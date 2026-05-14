import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { useColors } from '@/hooks/use-colors';
import type { StrengthStats } from '@/utils/storage';
import type { StrengthCardMode } from '@/hooks/use-stats-aggregates';
import { STREAK_MILESTONES } from '@/constants/strength-protocols';
import { formatDate } from '@/utils/storage';

interface StrengthHookCardProps {
  strengthStats: StrengthStats | null;
  strengthCardMode: StrengthCardMode;
  colors: ReturnType<typeof useColors>;
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export function StrengthHookCard({ strengthStats, strengthCardMode, colors }: StrengthHookCardProps) {
  const today = formatDate(new Date());

  return (
    <Pressable
      onPress={() => router.push('/stats-strength')}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          STRENGTH
        </Text>
        <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
      </View>

      {strengthCardMode === 'empty' ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Complete a strength workout to get{'\u00A0'}started
        </Text>
      ) : (
        <View style={styles.body}>
          {strengthCardMode === 'newPR' && strengthStats!.lastPR && (
            <>
              <View style={styles.prBadge}>
                <Text style={styles.prBadgeText}>NEW PR</Text>
              </View>
              <Text style={[styles.exerciseName, { color: colors.text }]}>
                {strengthStats!.lastPR.exerciseName}
              </Text>
              <Text style={[styles.heroNumber, { color: colors.text }]}>
                {strengthStats!.lastPR.weight}
              </Text>
              <Text style={[styles.heroUnit, { color: colors.textSecondary }]}>lbs</Text>
            </>
          )}

          {strengthCardMode === 'streakNearMilestone' && (() => {
            const nextMilestone = STREAK_MILESTONES.find((m) => m > strengthStats!.streak.days);
            const gap = nextMilestone! - strengthStats!.streak.days;
            return (
              <>
                <Text style={[styles.heroNumber, { color: colors.text }]}>
                  {strengthStats!.streak.days}
                </Text>
                <Text style={[styles.subtitle, { color: colors.accent }]}>
                  {gap} days to {nextMilestone}-day streak
                </Text>
              </>
            );
          })()}

          {strengthCardMode === 'activeStreak' && (
            <>
              <Text style={[styles.heroNumber, { color: colors.text }]}>
                {strengthStats!.streak.days}
              </Text>
              <Text style={[styles.heroUnit, { color: colors.textSecondary }]}>
                day streak
              </Text>
            </>
          )}

          {strengthCardMode === 'default' && (() => {
            if (strengthStats!.streak.lastSessionDate) {
              const daysAgo = daysBetween(strengthStats!.streak.lastSessionDate, today);
              return (
                <Text style={[styles.defaultText, { color: colors.textSecondary }]}>
                  Last session: {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}
                </Text>
              );
            }
            return (
              <Text style={[styles.defaultText, { color: colors.textSecondary }]}>
                Ready for your next workout
              </Text>
            );
          })()}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  body: {
    alignItems: 'center',
  },
  prBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  prBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroNumber: {
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 62,
  },
  heroUnit: {
    fontSize: 15,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  defaultText: {
    fontSize: 15,
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 16,
  },
});
