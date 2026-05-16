import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useUser } from '@/contexts/user-context';
import { useAuth } from '@/contexts/auth-context';
import { useHabits } from '@/contexts/habit-context';
import { useColors } from '@/hooks/use-colors';
import {
  formatDate,
  loadStrengthSession,
  saveStrengthSession,
  loadLastStrengthWorkoutDay,
  saveLastStrengthWorkoutDay,
  loadExerciseDefaults,
  saveExerciseDefaults,
  loadStrengthStats,
  saveStrengthStats,
} from '@/utils/storage';
import type { StrengthStats } from '@/utils/storage';
import {
  WORKOUT_DAYS,
  WORKOUT_ROTATION,
  SETS_PER_EXERCISE,
  type WorkoutDay,
  type ExerciseLog,
  type ExerciseSet,
  type StrengthSession,
} from '@/constants/strength-protocols';
import * as Haptics from 'expo-haptics';
import { playSound } from '@/constants/sounds';
import {
  ink,
  forest,
  greenDeep,
  citron,
  paper,
  rule,
  FontFamily,
  shadows,
} from '@/constants/design-tokens';
import { StrengthHero } from '@/components/strength/strength-hero';
import { ExerciseCard, deriveTone } from '@/components/strength/exercise-card';
import { AdjustSheet, type AdjustField, type AdjustScope } from '@/components/strength/adjust-sheet';

// ── Types ─────────────────────────────────────────────────────

type ExerciseDefaults = Record<string, { weight: number | null; reps: number }[]>;

const STREAK_MILESTONES = [7, 14, 21, 30, 60, 90];

interface ExercisePRResult {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  previousBest: number | null;
}

// ── Helpers ───────────────────────────────────────────────────

function getNextWorkoutDay(lastDay: WorkoutDay | null): WorkoutDay {
  if (!lastDay) return 'legs1';
  const idx = WORKOUT_ROTATION.indexOf(lastDay);
  return WORKOUT_ROTATION[(idx + 1) % WORKOUT_ROTATION.length];
}

function buildExerciseLogs(
  dayKey: WorkoutDay,
  defaults: ExerciseDefaults,
): ExerciseLog[] {
  const dayDef = WORKOUT_DAYS.find((d) => d.key === dayKey)!;
  return dayDef.exercises.map((ex) => {
    const exDefaults = defaults[ex.id];
    const sets: ExerciseSet[] = [];
    for (let i = 0; i < SETS_PER_EXERCISE; i++) {
      sets.push({
        weight: exDefaults?.[i]?.weight ?? 50,
        reps: exDefaults?.[i]?.reps ?? ex.defaultReps,
        completed: false,
      });
    }
    return { exerciseId: ex.id, sets };
  });
}

function anySetsCompleted(exercises: ExerciseLog[]): boolean {
  return exercises.some((ex) => ex.sets.some((s) => s.completed));
}

function countCompletedSets(exercises: ExerciseLog[]): number {
  return exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0);
}

function countTotalSets(exercises: ExerciseLog[]): number {
  return exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
}

// ── Protocol Picker ───────────────────────────────────────────

function ProtocolPicker({ onSelect }: { onSelect: (p: 'lplp') => void }) {
  const colors = useColors();

  return (
    <SafeAreaView style={[pickerStyles.container, { backgroundColor: colors.background }]}>
      <View style={pickerStyles.topBar}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[pickerStyles.topTitle, { color: colors.text }]}>Strength Training</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={pickerStyles.content}>
        <Text style={[pickerStyles.title, { color: colors.text }]}>
          Choose Your Protocol
        </Text>

        <Pressable
          onPress={() => onSelect('lplp')}
          style={[pickerStyles.card, { backgroundColor: colors.surface, borderColor: colors.accent }]}
        >
          <MaterialIcons name="fitness-center" size={28} color={colors.accent} />
          <View style={pickerStyles.cardText}>
            <Text style={[pickerStyles.cardName, { color: colors.text }]}>
              Legs / Pull / Legs / Push
            </Text>
            <Text style={[pickerStyles.cardDesc, { color: colors.textSecondary }]}>
              4-day rotation, progressive overload
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </Pressable>

        <View
          style={[
            pickerStyles.card,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.5 },
          ]}
        >
          <MaterialIcons name="fitness-center" size={28} color={colors.textSecondary} />
          <View style={pickerStyles.cardText}>
            <Text style={[pickerStyles.cardName, { color: colors.text }]}>
              BMC&apos;s Super Heavy Lifting{'\u00A0'}Thingy
            </Text>
            <Text style={[pickerStyles.cardDesc, { color: colors.textSecondary }]}>
              Alternative protocol
            </Text>
          </View>
          <View style={[pickerStyles.badge, { backgroundColor: colors.border }]}>
            <Text style={[pickerStyles.badgeText, { color: colors.textSecondary }]}>Coming Soon</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const pickerStyles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topTitle: { fontSize: 17, fontWeight: '700' },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  cardText: { flex: 1, gap: 2 },
  cardName: { fontSize: 16, fontWeight: '700' },
  cardDesc: { fontSize: 13 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
});

// ── Submit CTA ────────────────────────────────────────────────

function SubmitCTA({
  setsDone,
  setsTotal,
  onPress,
}: {
  setsDone: number;
  setsTotal: number;
  onPress: () => void;
}) {
  const isComplete = setsDone === setsTotal;

  return (
    <View style={submitStyles.bar}>
      <Pressable
        onPress={onPress}
        style={[submitStyles.btn, isComplete ? submitStyles.btnComplete : submitStyles.btnIncomplete]}
      >
        <Text style={[submitStyles.label, { color: isComplete ? greenDeep : 'rgba(17,55,31,0.5)' }]}>
          Submit Workout
        </Text>
        <Text style={[submitStyles.progress, { color: isComplete ? greenDeep : 'rgba(17,55,31,0.5)' }]}>
          {setsDone} / {setsTotal} SETS
        </Text>
      </Pressable>
    </View>
  );
}

const submitStyles = StyleSheet.create({
  bar: {
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: rule,
    backgroundColor: '#fff',
  },
  btn: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnIncomplete: {
    backgroundColor: 'rgba(207,222,80,0.35)',
  },
  btnComplete: {
    backgroundColor: citron,
    shadowColor: citron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 6,
  },
  label: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    letterSpacing: -0.005 * 15,
  },
  progress: {
    fontFamily: FontFamily.monoBold,
    fontSize: 13,
    letterSpacing: 0.06 * 13,
    fontVariant: ['tabular-nums'],
  },
});

// ── Workout Tracker ───────────────────────────────────────────

function WorkoutTracker() {
  const { logHabit } = useHabits();
  const { user } = useAuth();
  const { profile } = useUser();
  const today = formatDate(new Date());

  const [selectedDay, setSelectedDay] = useState<WorkoutDay>('legs1');
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const exercisesRef = useRef(exercises);
  exercisesRef.current = exercises;
  const [defaults, setDefaults] = useState<ExerciseDefaults>({});
  const [loaded, setLoaded] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [showPartialSubmit, setShowPartialSubmit] = useState(false);
  const [existingSession, setExistingSession] = useState<StrengthSession | null>(null);

  // Adjust sheet state
  const [adjustVisible, setAdjustVisible] = useState(false);
  const [adjustExId, setAdjustExId] = useState('');
  const [adjustField, setAdjustField] = useState<AdjustField>('weight');
  const [adjustValue, setAdjustValue] = useState(0);

  // Pending day change (when there's unsaved progress)
  const [pendingDay, setPendingDay] = useState<WorkoutDay | null>(null);

  // PR detection state
  const [strengthPRs, setStrengthPRs] = useState<Record<string, { weight: number; reps: number; date: string }>>({});

  // Session summary modal state
  const [showSummary, setShowSummary] = useState(false);
  const [summaryExPRs, setSummaryExPRs] = useState<ExercisePRResult[]>([]);
  const [summaryMilestone, setSummaryMilestone] = useState<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  // Load initial state
  useEffect(() => {
    (async () => {
      const [lastDay, defs, todaySession, sStats] = await Promise.all([
        loadLastStrengthWorkoutDay(),
        loadExerciseDefaults(),
        loadStrengthSession(today),
        loadStrengthStats(),
      ]);

      setDefaults(defs);
      if (sStats?.exercisePRs) setStrengthPRs(sStats.exercisePRs);

      if (todaySession) {
        setSelectedDay(todaySession.workoutDay);
        setExercises(todaySession.exercises);
        setExistingSession(todaySession);
      } else {
        const nextDay = getNextWorkoutDay(lastDay);
        setSelectedDay(nextDay);
        setExercises(buildExerciseLogs(nextDay, defs));
      }

      setLoaded(true);
    })();
  }, [today]);

  // Switch workout day
  const handleDayChange = useCallback(
    (day: WorkoutDay) => {
      if (day === selectedDay) return;
      if (anySetsCompleted(exercisesRef.current) && !existingSession) {
        setPendingDay(day);
        setShowDiscard(true);
        return;
      }
      setSelectedDay(day);
      setExercises(buildExerciseLogs(day, defaults));
      setExistingSession(null);
    },
    [defaults, selectedDay, existingSession],
  );

  // Confirm discard and switch
  const confirmDiscard = useCallback(() => {
    setShowDiscard(false);
    if (pendingDay) {
      setSelectedDay(pendingDay);
      setExercises(buildExerciseLogs(pendingDay, defaults));
      setExistingSession(null);
      setPendingDay(null);
    } else {
      router.replace('/(tabs)');
    }
  }, [pendingDay, defaults]);

  // Log next set for an exercise (optimistic)
  const handleLogSet = useCallback((exId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exId) return ex;
        const nextIdx = ex.sets.findIndex((s) => !s.completed);
        if (nextIdx === -1) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, i) =>
            i === nextIdx ? { ...s, completed: true } : s,
          ),
        };
      }),
    );
  }, []);

  // Open adjust sheet
  const handleOpenAdjust = useCallback(
    (exId: string, field: AdjustField) => {
      const ex = exercisesRef.current.find((e) => e.exerciseId === exId);
      if (!ex) return;
      const nextSet = ex.sets.find((s) => !s.completed) ?? ex.sets[0];
      setAdjustExId(exId);
      setAdjustField(field);
      setAdjustValue(field === 'weight' ? (nextSet.weight ?? 0) : nextSet.reps);
      setAdjustVisible(true);
    },
    [],
  );

  // Apply adjust
  const handleApplyAdjust = useCallback(
    (value: number, scope: AdjustScope) => {
      setAdjustVisible(false);
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.exerciseId !== adjustExId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, i) => {
              const shouldUpdate =
                scope === 'all' ||
                (scope === 'remaining' && !s.completed) ||
                (scope === 'this' && i === ex.sets.findIndex((ss) => !ss.completed));
              if (!shouldUpdate) return s;
              return adjustField === 'weight'
                ? { ...s, weight: value }
                : { ...s, reps: value };
            }),
          };
        }),
      );
    },
    [adjustExId, adjustField],
  );

  // Back / discard
  const handleBack = useCallback(() => {
    if (anySetsCompleted(exercisesRef.current) && !existingSession) {
      setPendingDay(null);
      setShowDiscard(true);
    } else {
      router.replace('/(tabs)');
    }
  }, [existingSession]);

  // Submit implementation
  const doSubmit = useCallback(
    async (current: ExerciseLog[]) => {
      const session: StrengthSession = {
        date: today,
        protocol: 'lplp',
        workoutDay: selectedDay,
        exercises: current,
        completedAt: new Date().toISOString(),
      };

      const newDefaults = { ...defaults };
      for (const ex of current) {
        newDefaults[ex.exerciseId] = ex.sets.map((s) => ({
          weight: s.weight,
          reps: s.reps,
        }));
      }

      await Promise.all([
        saveStrengthSession(session, user?.id),
        saveLastStrengthWorkoutDay(selectedDay, user?.id),
        saveExerciseDefaults(newDefaults, user?.id),
      ]);

      // Update strength aggregate stats
      const stats: StrengthStats = (await loadStrengthStats()) ?? {
        exercisePRs: {},
        streak: { days: 0, lastSessionDate: '' },
        bestStreak: 0,
        lastPR: null,
      };

      if (stats.streak.lastSessionDate) {
        const lastDate = new Date(stats.streak.lastSessionDate + 'T00:00:00');
        const thisDate = new Date(today + 'T00:00:00');
        const gap = Math.round(
          (thisDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (gap === 0) {
          // same day re-submit
        } else if (gap <= 2) {
          stats.streak.days += gap;
        } else {
          stats.streak.days = 1;
        }
      } else {
        stats.streak.days = 1;
      }
      stats.streak.lastSessionDate = today;
      if (stats.streak.days > stats.bestStreak) {
        stats.bestStreak = stats.streak.days;
      }

      const dayDef = WORKOUT_DAYS.find((d) => d.key === selectedDay)!;
      for (const exLog of current) {
        let maxWeight = 0;
        let maxReps = 0;
        for (const set of exLog.sets) {
          if (set.completed && set.weight != null && set.weight > maxWeight) {
            maxWeight = set.weight;
            maxReps = set.reps;
          }
        }
        if (maxWeight > 0) {
          const existing = stats.exercisePRs[exLog.exerciseId];
          if (!existing || maxWeight > existing.weight) {
            stats.exercisePRs[exLog.exerciseId] = {
              weight: maxWeight,
              reps: maxReps,
              date: today,
            };
            const exDef = dayDef.exercises.find((e) => e.id === exLog.exerciseId);
            stats.lastPR = {
              exerciseId: exLog.exerciseId,
              exerciseName: exDef?.name ?? exLog.exerciseId,
              weight: maxWeight,
              date: today,
            };
          }
        }
      }
      await saveStrengthStats(stats, user?.id);

      logHabit('gym');

      // Compute session PRs and milestone for summary modal
      const newExPRs: ExercisePRResult[] = [];
      for (const exLog of current) {
        let maxWeight = 0;
        let maxReps = 0;
        for (const set of exLog.sets) {
          if (set.completed && set.weight != null && set.weight > maxWeight) {
            maxWeight = set.weight;
            maxReps = set.reps;
          }
        }
        if (maxWeight > 0) {
          const prevPR = strengthPRs[exLog.exerciseId];
          if (!prevPR || maxWeight > prevPR.weight) {
            const exDef = dayDef.exercises.find((e) => e.id === exLog.exerciseId);
            newExPRs.push({
              exerciseId: exLog.exerciseId,
              exerciseName: exDef?.name ?? exLog.exerciseId,
              weight: maxWeight,
              reps: maxReps,
              previousBest: prevPR?.weight ?? null,
            });
          }
        }
      }

      // Check streak milestone
      let milestone: number | null = null;
      for (const m of STREAK_MILESTONES) {
        const prevStreak = strengthPRs ? (stats.streak.days - 1) : 0;
        if (stats.streak.days >= m && (prevStreak < m || stats.streak.days === m)) {
          milestone = m;
        }
      }

      if (newExPRs.length > 0 || milestone != null) {
        setSummaryExPRs(newExPRs);
        setSummaryMilestone(milestone);

        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        playSound('success', profile.soundEnabled);

        setShowSummary(true);
      } else {
        router.replace('/(tabs)');
      }
    },
    [today, selectedDay, defaults, logHabit, user?.id, strengthPRs, profile.soundEnabled],
  );

  // Submit handler (shows partial confirmation if incomplete)
  const handleSubmit = useCallback(async () => {
    const current = exercisesRef.current;
    const done = countCompletedSets(current);
    const total = countTotalSets(current);

    if (done < total) {
      setShowPartialSubmit(true);
      return;
    }

    await doSubmit(current);
  }, [doSubmit]);

  const dayDef = WORKOUT_DAYS.find((d) => d.key === selectedDay)!;
  const setsDone = countCompletedSets(exercises);
  const setsTotal = countTotalSets(exercises);

  // Build exercise summary for tone derivation
  const exerciseSummary = exercises.map((ex) => ({
    done: ex.sets.filter((s) => s.completed).length,
    total: ex.sets.length,
  }));

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      {/* Hero */}
      <StrengthHero
        selectedDay={selectedDay}
        onDayChange={handleDayChange}
        muscle={dayDef.subtitle}
        exerciseCount={dayDef.exercises.length}
        setsDone={setsDone}
        setsTotal={setsTotal}
        onBack={handleBack}
      />

      {/* Exercise list */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.exerciseList}
        showsVerticalScrollIndicator={false}
      >
        {dayDef.exercises.map((exDef, idx) => {
          const exLog = exercises.find((e) => e.exerciseId === exDef.id);
          if (!exLog) return null;
          const done = exLog.sets.filter((s) => s.completed).length;
          const total = exLog.sets.length;
          const tone = deriveTone(exerciseSummary, idx);
          const nextSet = exLog.sets.find((s) => !s.completed) ?? exLog.sets[0];

          return (
            <ExerciseCard
              key={exDef.id}
              name={exDef.name}
              weight={nextSet.weight}
              reps={nextSet.reps}
              done={done}
              total={total}
              tone={tone}
              onLogSet={() => handleLogSet(exDef.id)}
              onEditWeight={() => handleOpenAdjust(exDef.id, 'weight')}
              onEditReps={() => handleOpenAdjust(exDef.id, 'reps')}
              prWeight={strengthPRs[exDef.id]?.weight}
            />
          );
        })}
      </ScrollView>

      {/* Submit CTA */}
      <SubmitCTA setsDone={setsDone} setsTotal={setsTotal} onPress={handleSubmit} />

      {/* Adjust sheet */}
      <AdjustSheet
        visible={adjustVisible}
        field={adjustField}
        value={adjustValue}
        onApply={handleApplyAdjust}
        onCancel={() => setAdjustVisible(false)}
      />

      {/* Discard confirmation */}
      <Modal visible={showDiscard} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Text style={modalStyles.title}>
              {pendingDay ? 'Discard logged sets?' : 'Discard this workout?'}
            </Text>
            <Text style={modalStyles.body}>
              {pendingDay
                ? `You have ${setsDone} logged sets that will be lost.`
                : 'Your progress will be lost.'}
            </Text>
            <View style={modalStyles.actions}>
              <Pressable
                onPress={() => {
                  setShowDiscard(false);
                  setPendingDay(null);
                }}
                style={modalStyles.cancelBtn}
              >
                <Text style={modalStyles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={confirmDiscard} style={modalStyles.destructBtn}>
                <Text style={modalStyles.destructBtnText}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Partial submit confirmation */}
      <Modal visible={showPartialSubmit} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Text style={modalStyles.title}>Submit incomplete workout?</Text>
            <Text style={modalStyles.body}>
              Submit with {setsTotal - setsDone} sets remaining?
            </Text>
            <View style={modalStyles.actions}>
              <Pressable
                onPress={() => setShowPartialSubmit(false)}
                style={modalStyles.cancelBtn}
              >
                <Text style={modalStyles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowPartialSubmit(false);
                  doSubmit(exercisesRef.current);
                }}
                style={modalStyles.submitPartialBtn}
              >
                <Text style={modalStyles.submitPartialBtnText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Session Summary Modal */}
      <Modal visible={showSummary} transparent animationType="fade">
        <View style={summaryStyles.overlay}>
          <View style={summaryStyles.card}>
            <View style={summaryStyles.headerBar}>
              <Text style={summaryStyles.headerText}>Session Highlights</Text>
            </View>

            {summaryExPRs.map((pr) => (
              <View key={pr.exerciseId} style={summaryStyles.prRow}>
                <Text style={summaryStyles.prName}>{pr.exerciseName}</Text>
                <Text style={summaryStyles.prDetail}>
                  {pr.weight} lb {'\u00D7'} {pr.reps} reps
                </Text>
                {pr.previousBest != null && (
                  <Text style={summaryStyles.prDelta}>
                    {'\u2191'} {pr.weight - pr.previousBest} lbs
                  </Text>
                )}
                {pr.previousBest == null && (
                  <Text style={summaryStyles.prBadge}>NEW PR</Text>
                )}
              </View>
            ))}

            {summaryMilestone != null && (
              <View style={summaryStyles.milestoneBlock}>
                <Text style={summaryStyles.milestoneText}>
                  {summaryMilestone}-Day Streak!
                </Text>
              </View>
            )}

            <Pressable
              onPress={() => {
                setShowSummary(false);
                router.replace('/(tabs)');
              }}
              style={summaryStyles.continueBtn}
            >
              <Text style={summaryStyles.continueBtnText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────

export default function StrengthScreen() {
  const { profile, updateProfile } = useUser();

  const handleSelectProtocol = useCallback(
    (protocol: 'lplp') => {
      updateProfile({ strengthProtocol: protocol });
    },
    [updateProfile],
  );

  if (profile.strengthProtocol === null) {
    return <ProtocolPicker onSelect={handleSelectProtocol} />;
  }

  return <WorkoutTracker />;
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paper,
  },
  exerciseList: {
    padding: 14,
    paddingTop: 14,
    gap: 12,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    gap: 8,
    backgroundColor: paper,
    ...shadows.formCard,
  },
  title: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 17,
    color: ink,
    textAlign: 'center',
  },
  body: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 14,
    color: '#6b756f',
    textAlign: 'center',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: rule,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 15,
    color: forest,
  },
  destructBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: citron,
    alignItems: 'center',
  },
  destructBtnText: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 15,
    color: greenDeep,
  },
  submitPartialBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: citron,
    alignItems: 'center',
  },
  submitPartialBtnText: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 15,
    color: greenDeep,
  },
});

const summaryStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    gap: 12,
    backgroundColor: paper,
    ...shadows.formCard,
  },
  headerBar: {
    backgroundColor: citron,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  headerText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    color: greenDeep,
    textAlign: 'center',
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    flexWrap: 'wrap',
  },
  prName: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 13,
    color: ink,
    flex: 1,
  },
  prDetail: {
    fontFamily: FontFamily.monoBold,
    fontSize: 13,
    color: greenDeep,
  },
  prDelta: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 12,
    color: citron,
  },
  prBadge: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 10,
    color: citron,
    letterSpacing: 1,
  },
  milestoneBlock: {
    backgroundColor: citron + '30',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  milestoneText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 18,
    color: greenDeep,
  },
  continueBtn: {
    backgroundColor: citron,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  continueBtnText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    color: greenDeep,
  },
});
