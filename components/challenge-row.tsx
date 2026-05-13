import { View, Text, StyleSheet, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { HABIT_LIBRARY } from '@/constants/habits';
import type { ChallengeTemplate } from '@/constants/challenges';
import type { Challenge } from '@/contexts/challenge-context';

function durationColor(days: number, colors: ReturnType<typeof useColors>): string {
  if (days <= 3) return colors.durationGreen;
  if (days <= 7) return colors.durationRed;
  if (days <= 14) return colors.durationBlue;
  return colors.durationAmber;
}

// ── Available challenge row ──────────────────────────────────

interface AvailableRowProps {
  template: ChallengeTemplate;
  disabled: boolean;
  onStart: () => void;
}

export function AvailableChallengeRow({ template, disabled, onStart }: AvailableRowProps) {
  const colors = useColors();
  const habit = HABIT_LIBRARY.find((h) => h.id === template.habitId);

  return (
    <Pressable
      onPress={disabled ? undefined : onStart}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <MaterialIcons
        name={(habit?.icon ?? 'emoji-events') as any}
        size={24}
        color={colors.textSecondary}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{template.name}</Text>
        <Text style={[styles.target, { color: colors.textSecondary }]}>
          {template.targetTotal} {habit?.unit ?? 'sessions'} in {template.durationDays} days
        </Text>
      </View>
      <View
        style={[
          styles.durationBadge,
          { backgroundColor: durationColor(template.durationDays, colors) + '20' },
        ]}
      >
        <Text
          style={[
            styles.durationText,
            { color: durationColor(template.durationDays, colors) },
          ]}
        >
          {template.durationDays}d
        </Text>
      </View>
    </Pressable>
  );
}

// ── Completed challenge row ──────────────────────────────────

interface CompletedRowProps {
  challenge: Challenge;
}

export function CompletedChallengeRow({ challenge }: CompletedRowProps) {
  const colors = useColors();
  const passed = challenge.status === 'completed';

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <MaterialIcons
        name={passed ? 'emoji-events' : 'cancel'}
        size={24}
        color={passed ? colors.accent : colors.textSecondary}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{challenge.name}</Text>
        <Text style={[styles.target, { color: colors.textSecondary }]}>
          {passed ? 'Completed' : 'Not completed'} — started{' '}
          {challenge.startDate}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  target: {
    fontSize: 13,
  },
  durationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
