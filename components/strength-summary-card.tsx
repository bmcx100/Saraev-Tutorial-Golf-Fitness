import { View, Text, StyleSheet } from 'react-native';
import type { useColors } from '@/hooks/use-colors';
import type { StrengthSession } from '@/constants/strength-protocols';
import { WORKOUT_ROTATION, WORKOUT_DAYS } from '@/constants/strength-protocols';
import type { LatestStrengthDay } from '@/hooks/use-training-history';
import { formatDate } from '@/utils/storage';

interface StrengthSummaryCardProps {
  strengthSessions: StrengthSession[];
  strengthSessionCount: number;
  latestStrengthDay: LatestStrengthDay | null;
  colors: ReturnType<typeof useColors>;
}

function workoutDayLabel(key: string): string {
  const def = WORKOUT_DAYS.find((d) => d.key === key);
  return def ? def.label : key;
}

export function StrengthSummaryCard({
  strengthSessions,
  strengthSessionCount,
  latestStrengthDay,
  colors,
}: StrengthSummaryCardProps) {
  const hasData = latestStrengthDay != null;

  // Find which workout days have been hit in the last 7 days
  const last7Days = new Set<string>();
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const session = strengthSessions.find((s) => s.date === dateStr);
    if (session) last7Days.add(session.workoutDay);
  }

  const latestDateFormatted = latestStrengthDay
    ? new Date(latestStrengthDay.date + 'T00:00:00').toLocaleDateString(
        undefined,
        { month: 'short', day: 'numeric' },
      )
    : '';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        Strength Training
      </Text>

      {hasData ? (
        <>
          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={[styles.bigNumber, { color: colors.text }]}>
                {strengthSessionCount}
              </Text>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                sessions
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.dayLabel, { color: colors.text }]}>
                {workoutDayLabel(latestStrengthDay!.workoutDay)}
              </Text>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {latestDateFormatted}
              </Text>
            </View>
          </View>

          <View style={styles.rotationRow}>
            {WORKOUT_ROTATION.map((day) => {
              const hit = last7Days.has(day);
              const def = WORKOUT_DAYS.find((d) => d.key === day);
              const initial = def ? def.label[0] : day[0].toUpperCase();
              return (
                <View key={day} style={styles.rotationItem}>
                  <View
                    style={[
                      styles.dot,
                      hit
                        ? { backgroundColor: colors.tint }
                        : { backgroundColor: colors.border },
                    ]}
                  />
                  <Text
                    style={[styles.rotationLabel, { color: colors.textSecondary }]}
                  >
                    {initial}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Complete a strength workout to see your{'\u00A0'}progress here
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  columns: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  bigNumber: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  dayLabel: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 40,
  },
  label: {
    fontSize: 13,
  },
  rotationRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rotationItem: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  rotationLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 15,
    marginTop: 8,
  },
});
