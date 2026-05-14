import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { useColors } from '@/hooks/use-colors';
import type { SpeedStats } from '@/utils/storage';
import type { SpeedCardMode } from '@/hooks/use-stats-aggregates';
import { DRIVER_MILESTONES } from '@/constants/speed-protocols';
import { formatDate } from '@/utils/storage';

interface SpeedHookCardProps {
  speedStats: SpeedStats | null;
  speedCardMode: SpeedCardMode;
  colors: ReturnType<typeof useColors>;
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export function SpeedHookCard({ speedStats, speedCardMode, colors }: SpeedHookCardProps) {
  const today = formatDate(new Date());

  return (
    <Pressable
      onPress={() => router.push('/stats-speed')}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          SPEED STICKS
        </Text>
        <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
      </View>

      {speedCardMode === 'empty' ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Complete a speed session to get{'\u00A0'}started
        </Text>
      ) : (
        <View style={styles.body}>
          {speedCardMode === 'newPR' && (
            <View style={styles.prBadge}>
              <Text style={styles.prBadgeText}>NEW PR</Text>
            </View>
          )}

          <Text style={[styles.heroNumber, { color: colors.text }]}>
            {speedStats!.driverPR!.mph}
          </Text>
          <Text style={[styles.heroUnit, { color: colors.textSecondary }]}>mph</Text>

          {speedCardMode === 'newPR' && speedStats!.previousDriverPR && (
            <Text style={[styles.subtitle, { color: colors.accent }]}>
              {'↑ '}{speedStats!.driverPR!.mph - speedStats!.previousDriverPR!.mph} mph
            </Text>
          )}

          {speedCardMode === 'nearMilestone' && (() => {
            const nextMilestone = DRIVER_MILESTONES.find((m) => m > speedStats!.driverPR!.mph);
            const gap = nextMilestone! - speedStats!.driverPR!.mph;
            return (
              <Text style={[styles.subtitle, { color: colors.accent }]}>
                {gap} mph from {nextMilestone}
              </Text>
            );
          })()}

          {speedCardMode === 'stale' && speedStats!.lastSessionDate && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Last session: {daysBetween(speedStats!.lastSessionDate, today)} days ago
            </Text>
          )}

          {speedCardMode === 'default' && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Personal Record
            </Text>
          )}
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
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 16,
  },
});
