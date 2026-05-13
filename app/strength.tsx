import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
  type ExerciseLog,
  type ExerciseSet,
  type StrengthSession,
} from '@/constants/strength-protocols';
import { SpeedNumpad } from '@/components/speed-numpad';

// ── Types ─────────────────────────────────────────────────────

type FieldId = string; // e.g. 'calf-raises.0.weight' or 'calf-raises.1.reps'

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
        weight: exDefaults?.[i]?.weight ?? null,
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

function getFieldIds(dayKey: WorkoutDay): FieldId[] {
  const dayDef = WORKOUT_DAYS.find((d) => d.key === dayKey)!;
  const ids: FieldId[] = [];
  for (const ex of dayDef.exercises) {
    for (let s = 0; s < SETS_PER_EXERCISE; s++) {
      ids.push(`${ex.id}.${s}.weight`, `${ex.id}.${s}.reps`);
    }
  }
  return ids;
}

// ── Protocol Picker ───────────────────────────────────────────

function ProtocolPicker({ onSelect }: { onSelect: (p: 'lplp') => void }) {
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
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
  const [activeField, setActiveField] = useState<FieldId | null>(null);
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
      setActiveField(null);
      setSelectedDay(day);
      setExercises(buildExerciseLogs(day, defaults));
      setExistingSession(null);
    },
    [defaults],
  );

  // Get/set field values from exercises
  const getFieldValue = useCallback(
    (fieldId: FieldId): number | null => {
      const [exId, setIdx, field] = fieldId.split('.');
      const ex = exercises.find((e) => e.exerciseId === exId);
      if (!ex) return null;
      const set = ex.sets[parseInt(setIdx, 10)];
      if (!set) return null;
      return field === 'weight' ? set.weight : set.reps;
    },
    [exercises],
  );

  const setFieldValue = useCallback(
    (fieldId: FieldId, value: number | null) => {
      const [exId, setIdx, field] = fieldId.split('.');
      const si = parseInt(setIdx, 10);
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.exerciseId !== exId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, i) => {
              if (i !== si) return s;
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

  // Numpad handlers
  const handleDigit = useCallback(
    (d: string) => {
      if (!activeField) return;
      const current = getFieldValue(activeField);
      const currentStr = current !== null ? String(current) : '';
      if (currentStr.length >= 4) return;
      const newStr = currentStr + d;
      setFieldValue(activeField, parseInt(newStr, 10));
    },
    [activeField, getFieldValue, setFieldValue],
  );

  const handleDelete = useCallback(() => {
    if (!activeField) return;
    const current = getFieldValue(activeField);
    if (current === null) return;
    const str = String(current);
    if (str.length <= 1) {
      setFieldValue(activeField, null);
    } else {
      setFieldValue(activeField, parseInt(str.slice(0, -1), 10));
    }
  }, [activeField, getFieldValue, setFieldValue]);

  const handleTab = useCallback(() => {
    const fieldIds = getFieldIds(selectedDay);
    if (!activeField) {
      setActiveField(fieldIds[0]);
      return;
    }
    const idx = fieldIds.indexOf(activeField);
    const nextIdx = (idx + 1) % fieldIds.length;
    setActiveField(fieldIds[nextIdx]);
  }, [activeField, selectedDay]);

  // Back / discard
  const handleBack = useCallback(() => {
    setActiveField(null);
    if (anySetsCompleted(exercisesRef.current) && !existingSession) {
      setShowDiscard(true);
    } else {
      router.back();
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
    router.back();
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
            <View key={exDef.id} style={styles.exerciseBlock}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>{exDef.name}</Text>

              {/* Set header */}
              <View style={styles.setHeaderRow}>
                <Text style={[styles.setHeaderLabel, { color: colors.textSecondary, width: 32 }]}>
                  Set
                </Text>
                <Text style={[styles.setHeaderLabel, { color: colors.textSecondary, flex: 1, textAlign: 'center' }]}>
                  Weight
                </Text>
                <Text style={[styles.setHeaderLabel, { color: colors.textSecondary, flex: 1, textAlign: 'center' }]}>
                  Reps
                </Text>
                <View style={{ width: 36 }} />
              </View>

              {exLog?.sets.map((set, si) => {
                const weightFieldId = `${exDef.id}.${si}.weight`;
                const repsFieldId = `${exDef.id}.${si}.reps`;

                return (
                  <View key={si} style={[styles.setRow, { borderColor: colors.border }]}>
                    {/* Set number */}
                    <Text style={[styles.setNumber, { color: colors.textSecondary }]}>{si + 1}</Text>

                    {/* Weight field */}
                    <Pressable
                      onPress={() => setActiveField(weightFieldId)}
                      style={[
                        styles.inputField,
                        {
                          backgroundColor: colors.surface,
                          borderColor: activeField === weightFieldId ? colors.accent : colors.border,
                          borderWidth: activeField === weightFieldId ? 2 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.inputValue,
                          { color: set.weight !== null ? colors.text : colors.textSecondary },
                        ]}
                      >
                        {set.weight !== null ? String(set.weight) : '--'}
                      </Text>
                      <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>lbs</Text>
                    </Pressable>

                    {/* Reps field */}
                    <Pressable
                      onPress={() => setActiveField(repsFieldId)}
                      style={[
                        styles.inputField,
                        {
                          backgroundColor: colors.surface,
                          borderColor: activeField === repsFieldId ? colors.accent : colors.border,
                          borderWidth: activeField === repsFieldId ? 2 : 1,
                        },
                      ]}
                    >
                      <Text style={[styles.inputValue, { color: colors.text }]}>
                        {String(set.reps)}
                      </Text>
                      <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>reps</Text>
                    </Pressable>

                    {/* Completion checkbox */}
                    <Pressable
                      onPress={() => toggleSetCompleted(exDef.id, si)}
                      hitSlop={8}
                    >
                      <MaterialIcons
                        name={set.completed ? 'check-circle' : 'radio-button-unchecked'}
                        size={28}
                        color={set.completed ? colors.accent : colors.border}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
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

      {/* Numpad */}
      <SpeedNumpad
        onDigit={handleDigit}
        onDelete={handleDelete}
        onTab={handleTab}
      />

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
                  router.back();
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
    paddingBottom: 120,
    gap: 20,
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
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  setNumber: {
    width: 24,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 3,
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  inputUnit: {
    fontSize: 11,
    fontWeight: '500',
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
