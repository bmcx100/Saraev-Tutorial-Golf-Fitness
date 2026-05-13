import { Pressable, View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { type Habit } from '@/constants/habits';
import { useColors } from '@/hooks/use-colors';
import type { PaceStatus } from '@/utils/pace';

interface HabitRowProps {
  habit: Habit;
  count: number;
  target: number;
  complete: boolean;
  onLog: () => void;
  paceStatus?: PaceStatus;
}

const PACE_CONFIG: Record<string, { dotColor: string; label: string | null; textColor: string }> = {
  celebrate: { dotColor: '#52B788', label: 'Ahead!', textColor: '#52B788' },
  ahead: { dotColor: '#52B788', label: null, textColor: '#52B788' },
  behind: { dotColor: '#F59E0B', label: 'Behind', textColor: '#F59E0B' },
  'far-behind': { dotColor: '#E63946', label: 'Behind!', textColor: '#E63946' },
};

export function HabitRow({ habit, count, target, complete, onLog, paceStatus }: HabitRowProps) {
  const colors = useColors();
  const iconScale = useSharedValue(1);

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(
        complete
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light,
      );
    }

    // Bounce icon
    iconScale.value = withSpring(1.3, { damping: 4, stiffness: 300 }, () => {
      iconScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });

    onLog();
  };

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const isCounter = habit.trackingType === 'counter';

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.row,
        {
          backgroundColor: complete ? colors.accentLight : colors.surface,
          borderColor: complete ? colors.accent : colors.border,
        },
      ]}
    >
      <Animated.View style={iconAnimStyle}>
        <MaterialIcons
          name={habit.icon as any}
          size={24}
          color={complete ? colors.accent : colors.textSecondary}
        />
      </Animated.View>
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: colors.text },
            complete && { textDecorationLine: 'line-through', opacity: 0.6 },
          ]}
        >
          {habit.name}
        </Text>
        {isCounter && (
          <Text style={[styles.duration, { color: colors.textSecondary }]}>
            {count} of {target} {habit.unit}
          </Text>
        )}
      </View>
      {isCounter && !complete && (
        <View style={[styles.countBadge, { backgroundColor: colors.tint + '20' }]}>
          <Text style={[styles.countText, { color: colors.tint }]}>{count}</Text>
        </View>
      )}
      {paceStatus && paceStatus !== 'on-track' && PACE_CONFIG[paceStatus] && (
        <View style={styles.paceIndicator}>
          <View style={[styles.paceDot, { backgroundColor: PACE_CONFIG[paceStatus].dotColor }]} />
          {PACE_CONFIG[paceStatus].label && (
            <Text style={[styles.paceLabel, { color: PACE_CONFIG[paceStatus].textColor }]}>
              {PACE_CONFIG[paceStatus].label}
            </Text>
          )}
        </View>
      )}
      <MaterialIcons
        name={complete ? 'check-circle' : 'radio-button-unchecked'}
        size={28}
        color={complete ? colors.accent : colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  duration: {
    fontSize: 13,
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
  },
  paceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
