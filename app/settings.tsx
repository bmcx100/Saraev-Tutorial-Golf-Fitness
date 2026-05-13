import { useState } from 'react';
import { ScrollView, View, Text, Pressable, Switch, Alert, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HABIT_LIBRARY, CATEGORY_META, type Habit, type HabitCategory } from '@/constants/habits';
import { useUser, type ScheduleConfig, type HabitGoalConfig } from '@/contexts/user-context';
import { useColors } from '@/hooks/use-colors';
import { useHabits } from '@/contexts/habit-context';
import { useChallenges } from '@/contexts/challenge-context';
import { clearAllData, generateStreakData, saveLogs, formatDate } from '@/utils/storage';
import { scheduleDaily } from '@/utils/notifications';
import { WeekdayPicker } from '@/components/weekday-picker';
import { Confetti } from '@/components/confetti';
import { getGoalWeekdays } from '@/utils/schedule';

export default function SettingsScreen() {
  const colors = useColors();
  const { profile, updateProfile, devDateOverride, setDevDateOverride, resetProfile } = useUser();
  const [detailHabit, setDetailHabit] = useState<Habit | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const { todayHabits, logHabit } = useHabits();
  const { activeChallenge } = useChallenges();

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

  const schedule = profile.schedule;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Confetti
        active={confettiActive}
        onComplete={() => setConfettiActive(false)}
      />
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tracking */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Tracking</Text>
        {(['golf', 'workout', 'lifestyle'] as HabitCategory[]).map((cat) => {
          const habits = HABIT_LIBRARY.filter((h) => h.category === cat);
          if (habits.length === 0) return null;
          const meta = CATEGORY_META[cat];
          return (
            <View key={cat} style={styles.categoryBlock}>
              <Text style={[styles.categoryLabel, { color: colors.text }]}>{meta.label}</Text>
              {habits.map((habit) => {
                const isActive = profile.activeHabitIds.includes(habit.id);
                return (
                  <View key={habit.id}>
                    <Pressable
                      onPress={() => toggleHabit(habit.id)}
                      style={[styles.row, { borderColor: colors.border }]}
                    >
                      <MaterialIcons name={habit.icon as any} size={22} color={colors.textSecondary} />
                      <Text style={[styles.rowLabel, { color: colors.text }]}>{habit.name}</Text>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          setDetailHabit(habit);
                        }}
                        hitSlop={8}
                      >
                        <MaterialIcons name="settings" size={20} color={colors.textSecondary} />
                      </Pressable>
                      <MaterialIcons
                        name={isActive ? 'check-circle' : 'radio-button-unchecked'}
                        size={22}
                        color={isActive ? colors.accent : colors.border}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          );
        })}

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

        {/* Dev Tools — only in development */}
        {__DEV__ && (
          <>
            <Text style={[styles.sectionTitle, { color: '#F59E0B', marginTop: 28 }]}>
              Dev Tools
            </Text>

            {/* Test Confetti */}
            <Pressable
              onPress={() => setConfettiActive(true)}
              style={[styles.devButton, { borderColor: colors.border }]}
            >
              <MaterialIcons name="celebration" size={20} color={colors.text} />
              <Text style={[styles.devButtonText, { color: colors.text }]}>
                Test Confetti
              </Text>
            </Pressable>

            {/* Complete All Today's Habits */}
            <Pressable
              onPress={() => {
                todayHabits.forEach((h) => logHabit(h.id));
              }}
              style={[styles.devButton, { borderColor: colors.border }]}
            >
              <MaterialIcons name="done-all" size={20} color={colors.text} />
              <Text style={[styles.devButtonText, { color: colors.text }]}>
                Complete All Today&apos;s Habits
              </Text>
            </Pressable>

            {/* Force Complete Challenge */}
            {activeChallenge && (
              <Pressable
                onPress={() => {
                  // Force-complete by updating challenge status directly is complex;
                  // for dev tools, we just call the challenge check after maxing progress
                  Alert.alert('Note', 'Navigate to the challenge and complete manually, or generate streak data to trigger completion.');
                }}
                style={[styles.devButton, { borderColor: colors.border }]}
              >
                <MaterialIcons name="emoji-events" size={20} color={colors.text} />
                <Text style={[styles.devButtonText, { color: colors.text }]}>
                  Force Complete Challenge
                </Text>
              </Pressable>
            )}

            {/* Date Override */}
            <View style={[styles.devDateRow, { borderColor: colors.border }]}>
              <Pressable
                onPress={() => {
                  const current = devDateOverride
                    ? new Date(devDateOverride + 'T00:00:00')
                    : new Date();
                  current.setDate(current.getDate() - 1);
                  setDevDateOverride(formatDate(current));
                }}
                style={[styles.devDateBtn, { backgroundColor: colors.accent + '20' }]}
              >
                <Text style={[styles.devDateBtnText, { color: colors.accent }]}>- Day</Text>
              </Pressable>

              <Text style={[styles.devDateText, { color: colors.text }]}>
                {devDateOverride ?? 'Today'}
              </Text>

              <Pressable
                onPress={() => {
                  const current = devDateOverride
                    ? new Date(devDateOverride + 'T00:00:00')
                    : new Date();
                  current.setDate(current.getDate() + 1);
                  setDevDateOverride(formatDate(current));
                }}
                style={[styles.devDateBtn, { backgroundColor: colors.accent + '20' }]}
              >
                <Text style={[styles.devDateBtnText, { color: colors.accent }]}>+ Day</Text>
              </Pressable>

              {devDateOverride && (
                <Pressable
                  onPress={() => setDevDateOverride(null)}
                  style={[styles.devDateBtn, { backgroundColor: '#E63946' + '20' }]}
                >
                  <Text style={[styles.devDateBtnText, { color: '#E63946' }]}>Reset</Text>
                </Pressable>
              )}
            </View>

            {/* Generate Streak Data */}
            <Pressable
              onPress={async () => {
                const days = await generateStreakData(profile.activeHabitIds, 7, devDateOverride ?? undefined);
                Alert.alert('Done', `Generated ${days} days of streak data.`);
              }}
              style={[styles.devButton, { borderColor: colors.border }]}
            >
              <MaterialIcons name="trending-up" size={20} color={colors.text} />
              <Text style={[styles.devButtonText, { color: colors.text }]}>
                Generate 7-Day Streak
              </Text>
            </Pressable>

            <Pressable
              onPress={async () => {
                const days = await generateStreakData(profile.activeHabitIds, 30, devDateOverride ?? undefined);
                Alert.alert('Done', `Generated ${days} days of streak data.`);
              }}
              style={[styles.devButton, { borderColor: colors.border }]}
            >
              <MaterialIcons name="trending-up" size={20} color={colors.text} />
              <Text style={[styles.devButtonText, { color: colors.text }]}>
                Generate 30-Day Streak
              </Text>
            </Pressable>

            {/* Reset Today's Progress */}
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Reset Today',
                  'Clear all habit progress for today?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: async () => {
                        const today = devDateOverride ?? formatDate(new Date());
                        await saveLogs(today, []);
                        Alert.alert('Done', 'Today\'s progress has been reset. Go back and return to refresh.');
                      },
                    },
                  ],
                );
              }}
              style={[styles.devButton, { borderColor: '#E63946' }]}
            >
              <MaterialIcons name="refresh" size={20} color="#E63946" />
              <Text style={[styles.devButtonText, { color: '#E63946' }]}>
                Reset Today&apos;s Progress
              </Text>
            </Pressable>

            {/* Clear All Data */}
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Clear All Data',
                  'This will delete ALL app data and return to onboarding. Are you sure?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete Everything',
                      style: 'destructive',
                      onPress: async () => {
                        await clearAllData();
                        resetProfile();
                      },
                    },
                  ],
                );
              }}
              style={[styles.devButton, { borderColor: '#E63946', marginBottom: 40 }]}
            >
              <MaterialIcons name="delete-forever" size={20} color="#E63946" />
              <Text style={[styles.devButtonText, { color: '#E63946' }]}>
                Clear All Data
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Habit Detail Modal */}
      <Modal
        visible={detailHabit !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailHabit(null)}
      >
        {detailHabit && (
          <HabitDetailPanel
            habit={detailHabit}
            schedule={schedule}
            onUpdateSchedule={(newSchedule) => updateProfile({ schedule: newSchedule })}
            onClose={() => setDetailHabit(null)}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIODS: HabitGoalConfig['period'][] = ['daily', 'weekly', 'monthly'];

function HabitDetailPanel({
  habit,
  schedule,
  onUpdateSchedule,
  onClose,
}: {
  habit: Habit;
  schedule: ScheduleConfig;
  onUpdateSchedule: (schedule: ScheduleConfig) => void;
  onClose: () => void;
}) {
  const colors = useColors();
  const { profile, updateProfile } = useUser();

  const currentMode = schedule.habitModes?.[habit.id] ?? 'weekdays';
  const currentGoal = schedule.habitGoals?.[habit.id] ?? { count: 3, period: 'weekly' as const };

  const [mode, setMode] = useState<'weekdays' | 'goal'>(currentMode);
  const [goalCount, setGoalCount] = useState(currentGoal.count);
  const [goalPeriod, setGoalPeriod] = useState<HabitGoalConfig['period']>(currentGoal.period);

  const previewDays = getGoalWeekdays({ count: goalCount, period: goalPeriod });
  const previewText = previewDays.map((d) => DAY_LABELS[d]).join(', ');

  const saveMode = (
    newMode: 'weekdays' | 'goal',
    newCount?: number,
    newPeriod?: HabitGoalConfig['period'],
  ) => {
    const count = newCount ?? goalCount;
    const period = newPeriod ?? goalPeriod;
    const next = { ...schedule };
    next.habitModes = { ...next.habitModes, [habit.id]: newMode };

    if (newMode === 'goal') {
      next.habitGoals = { ...next.habitGoals, [habit.id]: { count, period } };
      next.habitWeekdays = {
        ...next.habitWeekdays,
        [habit.id]: getGoalWeekdays({ count, period }),
      };
    } else {
      const { [habit.id]: _, ...restGoals } = next.habitGoals ?? {};
      next.habitGoals = restGoals;
    }

    onUpdateSchedule(next);
  };

  const handleModeChange = (newMode: 'weekdays' | 'goal') => {
    setMode(newMode);
    saveMode(newMode);
  };

  const handleCountChange = (delta: number) => {
    const next = Math.max(1, Math.min(31, goalCount + delta));
    setGoalCount(next);
    saveMode('goal', next, goalPeriod);
  };

  const handlePeriodChange = (p: HabitGoalConfig['period']) => {
    setGoalPeriod(p);
    saveMode('goal', goalCount, p);
  };

  const handleWeekdayChange = (days: number[]) => {
    const next = {
      ...schedule,
      habitWeekdays: { ...schedule.habitWeekdays, [habit.id]: days },
    };
    onUpdateSchedule(next);
  };

  const protocolLabel =
    profile.speedProtocol === 'superspeed-l1'
      ? 'Super Speed Sticks L1'
      : profile.speedProtocol === 'bmc'
        ? "BMC's Speedy Sticks of Quickness"
        : 'Not set';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <View style={{ width: 24 }} />
        <Text style={[styles.topTitle, { color: colors.text }]}>{habit.name}</Text>
        <Pressable onPress={onClose} hitSlop={12}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Habit info */}
        <View style={styles.detailHeader}>
          <View style={[styles.detailIconWrap, { backgroundColor: habit.ringColor + '20' }]}>
            <MaterialIcons name={habit.icon as any} size={32} color={habit.ringColor} />
          </View>
          <Text style={[styles.detailCategory, { color: colors.textSecondary }]}>
            {CATEGORY_META[habit.category].label}
          </Text>
        </View>

        {/* Schedule */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>
          Schedule
        </Text>

        {/* Mode toggle */}
        <View style={[styles.segmentRow, { borderColor: colors.border }]}>
          <Pressable
            onPress={() => handleModeChange('weekdays')}
            style={[
              styles.segmentBtn,
              mode === 'weekdays' && { backgroundColor: colors.accent },
              mode !== 'weekdays' && { borderColor: colors.border, borderWidth: 1 },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: mode === 'weekdays' ? '#fff' : colors.text },
              ]}
            >
              Specific Days
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleModeChange('goal')}
            style={[
              styles.segmentBtn,
              mode === 'goal' && { backgroundColor: colors.accent },
              mode !== 'goal' && { borderColor: colors.border, borderWidth: 1 },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: mode === 'goal' ? '#fff' : colors.text },
              ]}
            >
              Count Goal
            </Text>
          </Pressable>
        </View>

        {mode === 'weekdays' && (
          <View style={styles.weekdaySection}>
            <Text style={[styles.weekdayLabel, { color: colors.text }]}>Active days</Text>
            <WeekdayPicker
              selectedDays={schedule.habitWeekdays[habit.id] ?? []}
              onChange={handleWeekdayChange}
            />
            <Text style={[styles.weekdayHint, { color: colors.textSecondary }]}>
              No days selected = every day
            </Text>
          </View>
        )}

        {mode === 'goal' && (
          <View style={styles.weekdaySection}>
            {/* Count stepper */}
            <Text style={[styles.weekdayLabel, { color: colors.text }]}>Goal count</Text>
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() => handleCountChange(-1)}
                style={[styles.stepperBtn, { backgroundColor: colors.accent + '20' }]}
              >
                <Text style={[styles.stepperBtnText, { color: colors.accent }]}>-</Text>
              </Pressable>
              <Text style={[styles.stepperValue, { color: colors.text }]}>{goalCount}</Text>
              <Pressable
                onPress={() => handleCountChange(1)}
                style={[styles.stepperBtn, { backgroundColor: colors.accent + '20' }]}
              >
                <Text style={[styles.stepperBtnText, { color: colors.accent }]}>+</Text>
              </Pressable>
            </View>

            {/* Period pills */}
            <Text style={[styles.weekdayLabel, { color: colors.text, marginTop: 16 }]}>Period</Text>
            <View style={styles.pillRow}>
              {PERIODS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => handlePeriodChange(p)}
                  style={[
                    styles.pill,
                    goalPeriod === p
                      ? { backgroundColor: colors.accent }
                      : { borderColor: colors.border, borderWidth: 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: goalPeriod === p ? '#fff' : colors.text },
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Preview */}
            <Text style={[styles.weekdayHint, { color: colors.textSecondary, marginTop: 12 }]}>
              Shows on {previewText}
            </Text>
            <Text style={[styles.weekdayHint, { color: colors.textSecondary, marginTop: 4 }]}>
              We&apos;ll track your pace and cheer you&nbsp;on
            </Text>
          </View>
        )}

        {/* Strength Protocol — only for gym */}
        {habit.id === 'gym' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}>
              Strength Protocol
            </Text>
            <View style={styles.weekdaySection}>
              <Text style={[styles.weekdayLabel, { color: colors.text }]}>
                {profile.strengthProtocol === 'lplp'
                  ? 'Legs / Pull / Legs / Push'
                  : 'Not set'}
              </Text>
              <Pressable
                onPress={() => updateProfile({ strengthProtocol: null })}
                style={[styles.changeProtocolBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.changeProtocolText, { color: colors.accent }]}>
                  Change Protocol
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {/* Speed Protocol — only for speed-sticks */}
        {habit.id === 'speed-sticks' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}>
              Speed Protocol
            </Text>
            <View style={styles.weekdaySection}>
              <Text style={[styles.weekdayLabel, { color: colors.text }]}>{protocolLabel}</Text>
              <Pressable
                onPress={() => updateProfile({ speedProtocol: null })}
                style={[styles.changeProtocolBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.changeProtocolText, { color: colors.accent }]}>
                  Change Protocol
                </Text>
              </Pressable>
            </View>
          </>
        )}
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
  categoryLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
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
  categoryBlock: {
    marginBottom: 8,
  },
  detailHeader: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  detailIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  weekdaySection: {
    paddingTop: 12,
    gap: 10,
  },
  weekdayLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  weekdayHint: {
    fontSize: 13,
  },
  changeProtocolBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  changeProtocolText: {
    fontSize: 15,
    fontWeight: '600',
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  devButtonText: {
    fontSize: 16,
  },
  devDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  devDateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  devDateBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  devDateText: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '700',
  },
  stepperValue: {
    fontSize: 24,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
