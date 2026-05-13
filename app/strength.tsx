import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useUser } from '@/contexts/user-context';
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
} from '@/utils/storage';
import {
  WORKOUT_DAYS,
  WORKOUT_ROTATION,
  SETS_PER_EXERCISE,
  type WorkoutDay,
  type ExerciseDef,
  type ExerciseLog,
  type ExerciseSet,
  type StrengthSession,
} from '@/constants/strength-protocols';

// ── Types ─────────────────────────────────────────────────────

type ExerciseDefaults = Record<string, { weight: number | null; reps: number }[]>;

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

function allSetsCompleted(exercises: ExerciseLog[]): boolean {
  return exercises.every((ex) => ex.sets.every((s) => s.completed));
}

function anySetsCompleted(exercises: ExerciseLog[]): boolean {
  return exercises.some((ex) => ex.sets.some((s) => s.completed));
}

// ── Protocol Picker ───────────────────────────────────────────

function ProtocolPicker({ onSelect }: { onSelect: (p: 'lplp') => void }) {
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>Strength Training</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.pickerContent}>
        <Text style={[styles.pickerTitle, { color: colors.text }]}>
          Choose Your Protocol
        </Text>

        <Pressable
          onPress={() => onSelect('lplp')}
          style={[styles.protocolCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}
        >
          <MaterialIcons name="fitness-center" size={28} color={colors.accent} />
          <View style={styles.protocolCardText}>
            <Text style={[styles.protocolName, { color: colors.text }]}>
              Legs / Pull / Legs / Push
            </Text>
            <Text style={[styles.protocolDesc, { color: colors.textSecondary }]}>
              4-day rotation, progressive overload
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </Pressable>

        <View
          style={[
            styles.protocolCard,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.5 },
          ]}
        >
          <MaterialIcons name="fitness-center" size={28} color={colors.textSecondary} />
          <View style={styles.protocolCardText}>
            <Text style={[styles.protocolName, { color: colors.text }]}>
              BMC&apos;s Super Heavy Lifting{'\u00A0'}Thingy
            </Text>
            <Text style={[styles.protocolDesc, { color: colors.textSecondary }]}>
              Alternative protocol
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.border }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>Coming Soon</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Exercise Card ────────────────────────────────────────────

const COLLAPSED_HEIGHT = 52;

function ExerciseCard({
  exDef,
  exLog,
  onFieldChange,
  onToggleSet,
}: {
  exDef: ExerciseDef;
  exLog: ExerciseLog | undefined;
  onFieldChange: (exId: string, setIdx: number, field: 'weight' | 'reps', value: number | null) => void;
  onToggleSet: (exId: string, setIdx: number) => void;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const expandedHeight = useSharedValue(0);
  const heightAnim = useSharedValue(COLLAPSED_HEIGHT);
  const crossfade = useSharedValue(0);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (expandedHeight.value > 0) {
      heightAnim.value = withTiming(next ? expandedHeight.value : COLLAPSED_HEIGHT, {
        duration: 300,
      });
    }
    crossfade.value = withTiming(next ? 1 : 0, { duration: 300 });
  };

  const handleCheckNext = () => {
    if (!exLog) return;
    const nextIdx = exLog.sets.findIndex((s) => !s.completed);
    if (nextIdx !== -1) onToggleSet(exDef.id, nextIdx);
  };

  const outerStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }));

  const collapsedOpacity = useAnimatedStyle(() => ({
    opacity: 1 - crossfade.value,
  }));

  const expandedOpacity = useAnimatedStyle(() => ({
    opacity: crossfade.value,
  }));

  return (
    <Animated.View style={[styles.exerciseCard, { borderColor: colors.border }, outerStyle]}>
      {/* Expanded content — always rendered for height measurement */}
      <Animated.View
        style={expandedOpacity}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0) expandedHeight.value = h;
        }}
        pointerEvents={expanded ? 'auto' : 'none'}
      >
        <Pressable onPress={toggle} style={styles.expandedHeader}>
          <Text style={[styles.exerciseName, { color: colors.text, marginBottom: 0 }]}>
            {exDef.name}
          </Text>
          <MaterialIcons name="expand-less" size={24} color={colors.textSecondary} />
        </Pressable>

        <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
          <View style={styles.setHeaderRow}>
            <Text style={[styles.setHeaderLabel, { color: colors.textSecondary, width: 32, textAlign: 'center' }]}>
              Set
            </Text>
            <View style={styles.setColumnGroup}>
              <Text style={[styles.setHeaderLabel, { color: colors.textSecondary }]}>
                Weight
              </Text>
            </View>
            <View style={styles.setColumnGroup}>
              <Text style={[styles.setHeaderLabel, { color: colors.textSecondary }]}>
                Reps
              </Text>
            </View>
            <View style={{ width: 28 }} />
          </View>

          {exLog?.sets.map((set, si) => (
            <View key={si} style={[styles.setRow, { borderColor: colors.border }]}>
              <Text style={[styles.setNumber, { color: colors.textSecondary }]}>{si + 1}</Text>
              <View style={styles.setColumnGroup}>
                <View
                  style={[
                    styles.inputField,
                    { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    value={set.weight !== null ? String(set.weight) : ''}
                    onChangeText={(text) => {
                      const num = text === '' ? null : parseInt(text, 10);
                      if (text !== '' && isNaN(num!)) return;
                      onFieldChange(exDef.id, si, 'weight', num);
                    }}
                    keyboardType="number-pad"
                    placeholder="--"
                    placeholderTextColor={colors.textSecondary}
                    selectTextOnFocus
                  />
                </View>
                <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>lbs</Text>
              </View>
              <View style={styles.setColumnGroup}>
                <View
                  style={[
                    styles.inputField,
                    { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    value={String(set.reps)}
                    onChangeText={(text) => {
                      const num = text === '' ? 0 : parseInt(text, 10);
                      if (isNaN(num)) return;
                      onFieldChange(exDef.id, si, 'reps', num);
                    }}
                    keyboardType="number-pad"
                    selectTextOnFocus
                  />
                </View>
                <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>reps</Text>
              </View>
              <Pressable onPress={() => onToggleSet(exDef.id, si)} hitSlop={8}>
                <MaterialIcons
                  name={set.completed ? 'check-circle' : 'radio-button-unchecked'}
                  size={28}
                  color={set.completed ? colors.accent : colors.border}
                />
              </Pressable>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Collapsed overlay */}
      <Animated.View
        style={[{ position: 'absolute', top: 0, left: 0, right: 0 }, collapsedOpacity]}
        pointerEvents={expanded ? 'none' : 'auto'}
      >
        <Pressable onPress={handleCheckNext} style={styles.collapsedRow}>
          <Text
            style={[styles.exerciseName, { color: colors.text, marginBottom: 0, flex: 1 }]}
            numberOfLines={1}
          >
            {exDef.name}
          </Text>
          <Pressable onPress={toggle} hitSlop={8}>
            <Text style={[styles.collapsedStats, { color: colors.textSecondary }]}>
              {exLog?.sets[0]?.weight ?? '--'} lbs{' · '}
              {exLog?.sets[0]?.reps ?? '--'} reps
            </Text>
          </Pressable>
          <View style={styles.collapsedCheckboxRow}>
            {exLog?.sets.map((set, si) => (
              <MaterialIcons
                key={si}
                name={set.completed ? 'check-circle' : 'radio-button-unchecked'}
                size={22}
                color={set.completed ? colors.accent : colors.border}
              />
            ))}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ── Workout Tracker ───────────────────────────────────────────

function WorkoutTracker() {
  const colors = useColors();
  const { logHabit } = useHabits();
  const today = formatDate(new Date());

  const [selectedDay, setSelectedDay] = useState<WorkoutDay>('legs1');
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const exercisesRef = useRef(exercises);
  exercisesRef.current = exercises;
  const [defaults, setDefaults] = useState<ExerciseDefaults>({});
  const [loaded, setLoaded] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [existingSession, setExistingSession] = useState<StrengthSession | null>(null);

  // Load initial state
  useEffect(() => {
    (async () => {
      const [lastDay, defs, todaySession] = await Promise.all([
        loadLastStrengthWorkoutDay(),
        loadExerciseDefaults(),
        loadStrengthSession(today),
      ]);

      setDefaults(defs);

      if (todaySession) {
        // Re-entry: load existing session
        setSelectedDay(todaySession.workoutDay);
        setExercises(todaySession.exercises);
        setExistingSession(todaySession);
      } else {
        // New session: determine recommended day
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
      setSelectedDay(day);
      setExercises(buildExerciseLogs(day, defaults));
      setExistingSession(null);
    },
    [defaults],
  );

  // Update a single field in an exercise set
  const setFieldValue = useCallback(
    (exId: string, setIdx: number, field: 'weight' | 'reps', value: number | null) => {
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.exerciseId !== exId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, i) => {
              if (i !== setIdx) return s;
              return field === 'weight' ? { ...s, weight: value } : { ...s, reps: value ?? 0 };
            }),
          };
        }),
      );
    },
    [],
  );

  const toggleSetCompleted = useCallback(
    (exId: string, setIdx: number) => {
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.exerciseId !== exId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, i) => {
              if (i !== setIdx) return s;
              return { ...s, completed: !s.completed };
            }),
          };
        }),
      );
    },
    [],
  );

  // Back / discard
  const handleBack = useCallback(() => {
    if (anySetsCompleted(exercisesRef.current) && !existingSession) {
      setShowDiscard(true);
    } else {
      router.replace('/(tabs)');
    }
  }, [existingSession]);

  // Submit
  const handleSubmit = useCallback(async () => {
    const current = exercisesRef.current;
    if (!allSetsCompleted(current)) return;

    const session: StrengthSession = {
      date: today,
      protocol: 'lplp',
      workoutDay: selectedDay,
      exercises: current,
      completedAt: new Date().toISOString(),
    };

    // Build updated defaults
    const newDefaults = { ...defaults };
    for (const ex of current) {
      newDefaults[ex.exerciseId] = ex.sets.map((s) => ({
        weight: s.weight,
        reps: s.reps,
      }));
    }

    await Promise.all([
      saveStrengthSession(session),
      saveLastStrengthWorkoutDay(selectedDay),
      saveExerciseDefaults(newDefaults),
    ]);

    logHabit('gym');
    router.replace('/(tabs)');
  }, [today, selectedDay, defaults, logHabit]);

  const dayDef = WORKOUT_DAYS.find((d) => d.key === selectedDay)!;
  const canSubmit = allSetsCompleted(exercises);

  if (!loaded) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>Strength Training</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Day selector chips */}
      <View style={styles.daySelector}>
        {WORKOUT_DAYS.map((day) => {
          const isSelected = day.key === selectedDay;
          return (
            <Pressable
              key={day.key}
              onPress={() => handleDayChange(day.key)}
              style={[
                styles.dayChip,
                {
                  backgroundColor: isSelected ? colors.accent : 'transparent',
                  borderColor: isSelected ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayChipText,
                  { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Day subtitle */}
      <Text style={[styles.daySubtitle, { color: colors.textSecondary }]}>
        {dayDef.subtitle}
      </Text>

      {/* Exercise list */}
      <ScrollView
        contentContainerStyle={styles.exerciseList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {dayDef.exercises.map((exDef) => {
          const exLog = exercises.find((e) => e.exerciseId === exDef.id);
          return (
            <ExerciseCard
              key={exDef.id}
              exDef={exDef}
              exLog={exLog}
              onFieldChange={setFieldValue}
              onToggleSet={toggleSetCompleted}
            />
          );
        })}
      </ScrollView>

      {/* Submit button */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[
            styles.submitButton,
            {
              backgroundColor: canSubmit ? colors.accent : colors.border,
            },
          ]}
        >
          <Text style={[styles.submitButtonText, { opacity: canSubmit ? 1 : 0.5 }]}>
            Submit Workout
          </Text>
        </Pressable>
      </View>

      {/* Discard confirmation */}
      <Modal visible={showDiscard} transparent animationType="fade">
        <View style={styles.discardOverlay}>
          <View style={[styles.discardCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.discardTitle, { color: colors.text }]}>
              Discard this workout?
            </Text>
            <Text style={[styles.discardBody, { color: colors.textSecondary }]}>
              Your progress will be lost.
            </Text>
            <View style={styles.discardActions}>
              <Pressable
                onPress={() => setShowDiscard(false)}
                style={[styles.discardBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.discardBtnText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowDiscard(false);
                  router.replace('/(tabs)');
                }}
                style={[styles.discardBtn, { backgroundColor: '#EF4444', borderColor: '#EF4444' }]}
              >
                <Text style={[styles.discardBtnText, { color: '#FFFFFF' }]}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  // Protocol picker
  pickerContent: {
    padding: 20,
    gap: 16,
  },
  pickerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  protocolCardText: {
    flex: 1,
    gap: 2,
  },
  protocolName: {
    fontSize: 16,
    fontWeight: '700',
  },
  protocolDesc: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  // Day selector
  daySelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  daySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  // Exercise list
  exerciseList: {
    padding: 20,
    paddingBottom: 20,
    gap: 20,
  },
  exerciseCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  collapsedRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  collapsedStats: {
    fontSize: 13,
    fontWeight: '600',
  },
  collapsedCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  exerciseBlock: {
    gap: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  setHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  setHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  setColumnGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  setNumber: {
    width: 32,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputField: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  textInput: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    padding: 0,
    width: '100%',
  },
  inputUnit: {
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 0,
  },
  // Bottom bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  // Discard modal
  discardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  discardCard: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    gap: 8,
  },
  discardTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  discardBody: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  discardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  discardBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  discardBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
