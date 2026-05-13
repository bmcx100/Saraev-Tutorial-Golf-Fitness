import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { Challenge } from '@/contexts/challenge-context';

interface ChallengeCardProps {
  challenge: Challenge;
  progress: number;
  onPress?: () => void;
  compact?: boolean;
}

export function ChallengeCard({ challenge, progress, onPress, compact }: ChallengeCardProps) {
  const colors = useColors();

  const today = new Date();
  const start = new Date(challenge.startDate + 'T00:00:00');
  const elapsed = Math.max(
    1,
    Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );
  const remaining = Math.max(0, challenge.durationDays - elapsed);
  const fraction = Math.min(progress / challenge.targetTotal, 1);
  const dailyPace =
    remaining > 0
      ? Math.ceil((challenge.targetTotal - progress) / remaining)
      : 0;
  const isOnTrack = progress >= (elapsed / challenge.durationDays) * challenge.targetTotal;

  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.challengeGradientStart,
        },
        compact && styles.compact,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Active</Text>
        </View>
        <Text style={styles.daysText}>Day {elapsed}</Text>
      </View>

      <Text style={styles.name}>{challenge.name}</Text>
      {!compact && (
        <Text style={styles.description}>{challenge.description}</Text>
      )}

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${fraction * 100}%`,
              backgroundColor: colors.challengeGradientEnd,
            },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>
          {progress}/{challenge.targetTotal}
        </Text>
        <Text style={styles.statText}>
          {remaining} days left
        </Text>
        {remaining > 0 && (
          <Text
            style={[
              styles.paceText,
              { color: isOnTrack ? '#A7F3D0' : '#FDE68A' },
            ]}
          >
            {isOnTrack ? 'On track' : `${dailyPace}/day needed`}
          </Text>
        )}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  compact: {
    padding: 16,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  daysText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  paceText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
