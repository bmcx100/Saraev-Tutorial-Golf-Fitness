import { ScrollView, View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HABIT_LIBRARY } from '@/constants/habits';
import { useUser } from '@/contexts/user-context';
import { type ScheduleConfig } from '@/contexts/user-context';
import { useColors } from '@/hooks/use-colors';
import { scheduleDaily } from '@/utils/notifications';
import { formatDate } from '@/utils/storage';
import { getCycleDayIndex } from '@/utils/schedule';
import { WeekdayPicker } from '@/components/weekday-picker';
import { ScheduleGrid } from '@/components/schedule-grid';

export default function SettingsScreen() {
  const colors = useColors();
  const { profile, updateProfile } = useUser();

  const toggleHabit = (id: string) => {
    const ids = profile.activeHabitIds.includes(id)
      ? profile.activeHabitIds.filter((h) => h !== id)
      : [...profile.activeHabitIds, id];
    updateProfile({ activeHabitIds: ids });
  };

  const toggleNotifications = (val: boolean) => {
    updateProfile({ notificationsEnabled: val });
    scheduleDaily(
      profile.notificationMorning,
      profile.notificationEvening,
      profile.activeHabitIds.length,
      val,
    );
  };

  const toggleSound = (val: boolean) => {
    updateProfile({ soundEnabled: val });
  };

  // --- Schedule helpers ---
  const schedule = profile.schedule;

  const updateSchedule = (updates: Partial<ScheduleConfig>) => {
    updateProfile({ schedule: { ...schedule, ...updates } });
  };

  // Group active habits by category
  const categories = new Map<string, typeof HABIT_LIBRARY>();
  for (const habit of HABIT_LIBRARY) {
    if (!profile.activeHabitIds.includes(habit.id)) continue;
    const list = categories.get(habit.category) ?? [];
    list.push(habit);
    categories.set(habit.category, list);
  }

  // Categories eligible for rotation (2+ active habits)
  const rotatableCategories = [...categories.entries()].filter(
    ([, habits]) => habits.length >= 2,
  );

  const isInRotation = (category: string) =>
    !!schedule.categoryRotations[category];

  const toggleRotation = (category: string) => {
    const next = { ...schedule.categoryRotations };
    if (next[category]) {
      delete next[category];
    } else {
      const habits = categories.get(category) ?? [];
      next[category] = {
        sequence: habits.map((h) => h.id),
        startDate: formatDate(new Date()),
      };
    }
    updateSchedule({ categoryRotations: next });
  };

  const updateCycleLength = (category: string, delta: number) => {
    const rot = schedule.categoryRotations[category];
    if (!rot) return;
    const habits = categories.get(category) ?? [];
    const maxLen = habits.length * 2;
    const newLen = Math.max(2, Math.min(maxLen, rot.sequence.length + delta));
    let seq = [...rot.sequence];
    if (newLen > seq.length) {
      // Extend with empty slots
      while (seq.length < newLen) seq.push('');
    } else {
      seq = seq.slice(0, newLen);
    }
    updateSchedule({
      categoryRotations: {
        ...schedule.categoryRotations,
        [category]: { ...rot, sequence: seq },
      },
    });
  };

  const updateSequence = (category: string, sequence: string[]) => {
    const rot = schedule.categoryRotations[category];
    if (!rot) return;
    updateSchedule({
      categoryRotations: {
        ...schedule.categoryRotations,
        [category]: { ...rot, sequence },
      },
    });
  };

  const updateWeekdays = (habitId: string, days: number[]) => {
    updateSchedule({
      habitWeekdays: { ...schedule.habitWeekdays, [habitId]: days },
    });
  };

  const rotatingCategories = new Set(Object.keys(schedule.categoryRotations));

  const today = formatDate(new Date());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Sessions */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>My Sessions</Text>
        {HABIT_LIBRARY.map((habit) => {
          const isActive = profile.activeHabitIds.includes(habit.id);
          const showWeekday =
            isActive && !rotatingCategories.has(habit.category);
          return (
            <View key={habit.id}>
              <Pressable
                onPress={() => toggleHabit(habit.id)}
                style={[styles.row, { borderColor: colors.border }]}
              >
                <MaterialIcons name={habit.icon as any} size={22} color={colors.textSecondary} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>{habit.name}</Text>
                <MaterialIcons
                  name={isActive ? 'check-circle' : 'radio-button-unchecked'}
                  size={22}
                  color={isActive ? colors.accent : colors.border}
                />
              </Pressable>
              {showWeekday && (
                <View style={styles.weekdayRow}>
                  <WeekdayPicker
                    selectedDays={schedule.habitWeekdays[habit.id] ?? []}
                    onChange={(days) => updateWeekdays(habit.id, days)}
                  />
                </View>
              )}
            </View>
          );
        })}

        {/* Schedule */}
        {rotatableCategories.length > 0 && (
          <>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}
            >
              Schedule
            </Text>
            {rotatableCategories.map(([category, habits]) => {
              const rotating = isInRotation(category);
              const rot = schedule.categoryRotations[category];
              const categoryLabel =
                category.charAt(0).toUpperCase() + category.slice(1);
              return (
                <View key={category} style={styles.categoryBlock}>
                  <Pressable
                    onPress={() => toggleRotation(category)}
                    style={[styles.switchRow, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.rowLabel, { color: colors.text }]}>
                      {categoryLabel}
                    </Text>
                    <Text
                      style={[
                        styles.modeLabel,
                        { color: rotating ? colors.accent : colors.textSecondary },
                      ]}
                    >
                      {rotating ? 'Rotation' : 'Daily'}
                    </Text>
                  </Pressable>

                  {rotating && rot && (
                    <View style={styles.rotationConfig}>
                      {/* Cycle length stepper */}
                      <View style={styles.stepperRow}>
                        <Text style={[styles.stepperLabel, { color: colors.text }]}>
                          Cycle length
                        </Text>
                        <View style={styles.stepper}>
                          <Pressable
                            onPress={() => updateCycleLength(category, -1)}
                            style={[styles.stepperBtn, { borderColor: colors.border }]}
                          >
                            <MaterialIcons name="remove" size={18} color={colors.text} />
                          </Pressable>
                          <Text style={[styles.stepperValue, { color: colors.text }]}>
                            {rot.sequence.length}
                          </Text>
                          <Pressable
                            onPress={() => updateCycleLength(category, 1)}
                            style={[styles.stepperBtn, { borderColor: colors.border }]}
                          >
                            <MaterialIcons name="add" size={18} color={colors.text} />
                          </Pressable>
                        </View>
                      </View>

                      {/* Start date */}
                      <View style={[styles.switchRow, { borderColor: colors.border }]}>
                        <Text style={[styles.rowLabel, { color: colors.text }]}>
                          Start date
                        </Text>
                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                          {rot.startDate}
                        </Text>
                      </View>

                      {/* Schedule grid */}
                      <View style={styles.gridWrapper}>
                        <ScheduleGrid
                          habits={habits}
                          cycleLength={rot.sequence.length}
                          sequence={rot.sequence}
                          onChange={(seq) => updateSequence(category, seq)}
                          todayIndex={getCycleDayIndex(
                            today,
                            rot.startDate,
                            rot.sequence.length,
                          )}
                        />
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* Notifications */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}>
          Notifications
        </Text>
        <View style={[styles.switchRow, { borderColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Enable notifications</Text>
          <Switch
            value={profile.notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ true: colors.accent, false: colors.border }}
          />
        </View>
        <View style={[styles.switchRow, { borderColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Morning reminder</Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {profile.notificationMorning}
          </Text>
        </View>
        <View style={[styles.switchRow, { borderColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Evening check-in</Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {profile.notificationEvening}
          </Text>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}>
          Preferences
        </Text>
        <View style={[styles.switchRow, { borderColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Sound effects</Text>
          <Switch
            value={profile.soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ true: colors.accent, false: colors.border }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  weekdayRow: {
    paddingVertical: 10,
    paddingLeft: 34,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBlock: {
    marginBottom: 8,
  },
  rotationConfig: {
    paddingLeft: 8,
    paddingTop: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  stepperLabel: {
    fontSize: 15,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  gridWrapper: {
    paddingVertical: 12,
  },
});
