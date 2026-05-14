import { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '@/contexts/habit-context';
import { useChallenges } from '@/contexts/challenge-context';
import { useUser } from '@/contexts/user-context';
import { useColors } from '@/hooks/use-colors';
import { useTrainingHistory } from '@/hooks/use-training-history';
import { MiniRings } from '@/components/mini-rings';
import { SpeedTrendCard } from '@/components/speed-trend-card';
import { StrengthSummaryCard } from '@/components/strength-summary-card';
import { formatDate } from '@/utils/storage';
import { getScheduledHabitIds } from '@/utils/schedule';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StatsScreen() {
  const { activeHabits, weekLogs } = useHabits();
  const { completedChallenges } = useChallenges();
  const { profile } = useUser();
  const colors = useColors();
  const {
    strengthSessions,
    loading: trainingLoading,
    driverSpeeds,
    latestDriverSpeed,
    bestDriverSpeed,
    strengthSessionCount,
    latestStrengthDay,
  } = useTrainingHistory();

  const showSpeed = profile.speedProtocol != null;
  const showStrength = profile.strengthProtocol != null;

  const today = formatDate(new Date());

  // Build week days data
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      days.push({
        date: dateStr,
        dayLabel: DAY_LABELS[d.getDay()],
        logs: weekLogs.get(dateStr) ?? [],
        isToday: dateStr === today,
      });
    }
    return days;
  }, [weekLogs, today]);

  // Calculate streak using per-day scheduling
  const streak = useMemo(() => {
    let count = 0;
    for (let i = weekDays.length - 1; i >= 0; i--) {
      const day = weekDays[i];
      const scheduledIds = getScheduledHabitIds(
        day.date,
        profile.activeHabitIds,
        profile.schedule,
      );
      const scheduledHabits = activeHabits.filter((h) =>
        scheduledIds.includes(h.id),
      );
      const allDone = scheduledHabits.length > 0 && scheduledHabits.every((h) => {
        const log = day.logs.find((l) => l.habitId === h.id);
        return log ? log.count >= h.targetCount : false;
      });
      if (allDone) count++;
      else break;
    }
    return count;
  }, [weekDays, activeHabits, profile]);

  // Habit breakdown: per-habit completion rate (only count days the habit was scheduled)
  const breakdown = useMemo(() => {
    return activeHabits
      .map((habit) => {
        let completed = 0;
        let scheduledDays = 0;
        weekDays.forEach((day) => {
          const scheduledIds = getScheduledHabitIds(
            day.date,
            profile.activeHabitIds,
            profile.schedule,
          );
          if (!scheduledIds.includes(habit.id)) return;
          scheduledDays++;
          const log = day.logs.find((l) => l.habitId === habit.id);
          if (log && log.count >= habit.targetCount) completed++;
        });
        const total = scheduledDays || 1;
        return {
          habit,
          completed,
          total: scheduledDays,
          rate: completed / total,
        };
      })
      .sort((a, b) => b.rate - a.rate);
  }, [activeHabits, weekDays, profile]);

  // Lifetime totals
  const totalCompletions = useMemo(() => {
    let total = 0;
    for (const logs of weekLogs.values()) {
      for (const log of logs) {
        total += log.count;
      }
    }
    return total;
  }, [weekLogs]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>Stats</Text>
          {streak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: colors.streakBadge + '20' }]}>
              <Text style={[styles.streakText, { color: colors.streakBadge }]}>
                {streak} day streak
              </Text>
            </View>
          )}
        </View>

        {/* Weekly Mini-Rings */}
        {activeHabits.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <MiniRings days={weekDays} activeHabits={activeHabits} />
          </View>
        )}

        {/* Training Progress */}
        {(showSpeed || showStrength) && trainingLoading && (
          <ActivityIndicator
            size="large"
            color={colors.tint}
            style={styles.loader}
          />
        )}
        {showSpeed && !trainingLoading && (
          <SpeedTrendCard
            driverSpeeds={driverSpeeds}
            latestDriverSpeed={latestDriverSpeed}
            bestDriverSpeed={bestDriverSpeed}
            colors={colors}
          />
        )}
        {showStrength && !trainingLoading && (
          <StrengthSummaryCard
            strengthSessions={strengthSessions}
            strengthSessionCount={strengthSessionCount}
            latestStrengthDay={latestStrengthDay}
            colors={colors}
          />
        )}

        {/* Habit Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            This Week
          </Text>
          {breakdown.map(({ habit, completed, total, rate }) => (
            <View key={habit.id} style={[styles.breakdownRow, { borderColor: colors.border }]}>
              <View style={[styles.breakdownDot, { backgroundColor: habit.ringColor }]} />
              <Text style={[styles.breakdownName, { color: colors.text }]}>{habit.name}</Text>
              <Text style={[styles.breakdownRate, { color: colors.textSecondary }]}>
                {Math.round(rate * 100)}%
              </Text>
              <Text style={[styles.breakdownFraction, { color: colors.textSecondary }]}>
                {completed}/{total}
              </Text>
            </View>
          ))}
        </View>

        {/* Record Cards */}
        <View style={styles.recordsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Records</Text>
          <View style={styles.recordGrid}>
            <RecordCard
              label="Best Streak"
              value={`${streak}`}
              unit="days"
              colors={colors}
            />
            <RecordCard
              label="Total Logs"
              value={`${totalCompletions}`}
              unit="entries"
              colors={colors}
            />
            <RecordCard
              label="Challenges"
              value={`${completedChallenges.filter((c) => c.status === 'completed').length}`}
              unit="completed"
              colors={colors}
            />
          </View>
        </View>

        {activeHabits.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Select some sessions to see your stats here.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RecordCard({
  label,
  value,
  unit,
  colors,
}: {
  label: string;
  value: string;
  unit: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.recordCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.recordValue, { color: colors.tint }]}>{value}</Text>
      <Text style={[styles.recordUnit, { color: colors.textSecondary }]}>{unit}</Text>
      <Text style={[styles.recordLabel, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: 'none',
  } as any,
  content: {
    padding: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  streakBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  breakdownSection: {
    marginBottom: 24,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  breakdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownName: {
    flex: 1,
    fontSize: 15,
  },
  breakdownRate: {
    fontSize: 15,
    fontWeight: '600',
    width: 44,
    textAlign: 'right',
  },
  breakdownFraction: {
    fontSize: 13,
    width: 30,
    textAlign: 'right',
  },
  recordsSection: {
    marginBottom: 24,
  },
  recordGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recordCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 2,
  },
  recordValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  recordUnit: {
    fontSize: 12,
  },
  recordLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  loader: {
    marginVertical: 24,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});
