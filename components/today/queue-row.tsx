import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  ink, sub, greenDeep, citron, forest,
  FontFamily, shadows, chipColors,
} from '@/constants/design-tokens';
import { BoltIcon, TeeIcon, DumbbellIcon, CheckCircleIcon } from '@/components/ui/design-icons';
import type { Habit, HabitCategory } from '@/constants/habits';

type QueueState = 'up-next' | 'queued' | 'done';

interface QueueRowProps {
  /** Display index, e.g. "01" */
  index: string;
  habit: Habit;
  /** Short description, e.g. "6 × 3 sets · L / R · 12 min" */
  meta: string;
  state: QueueState;
  onPress: () => void;
}

function getIconForHabit(habitId: string, color: string, size: number) {
  switch (habitId) {
    case 'speed-training':
      return <BoltIcon size={size} color={color} />;
    case 'driver':
      return <TeeIcon size={size} color={color} />;
    case 'gym':
      return <DumbbellIcon size={size} color={color} />;
    default:
      return <BoltIcon size={size} color={color} />;
  }
}

function getChipColors(category: HabitCategory) {
  return chipColors[category] ?? chipColors.golf;
}

/**
 * Single queue row for the Today screen.
 */
export function QueueRow({ index, habit, meta, state, onPress }: QueueRowProps) {
  const isUpNext = state === 'up-next';
  const isDone = state === 'done';
  const chip = getChipColors(habit.category);

  return (
    <Pressable
      style={[
        styles.container,
        isUpNext && styles.upNextOutline,
        isDone && styles.doneContainer,
      ]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={styles.index}>{index}</Text>
        <View style={[styles.iconChip, { backgroundColor: chip.bg }]}>
          {getIconForHabit(habit.id, chip.fg, 14)}
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, isDone && styles.nameDone]}>{habit.name}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>

      <View style={[styles.statusPill, isUpNext && styles.statusPillUpNext]}>
        {isDone ? (
          <View style={styles.doneRow}>
            <CheckCircleIcon size={12} color={forest} />
            <Text style={[styles.statusText, styles.statusTextDone]}>Done</Text>
          </View>
        ) : (
          <Text style={[styles.statusText, isUpNext && styles.statusTextUpNext]}>
            {isUpNext ? 'Up next' : 'Queued'}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingRight: 14,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    ...shadows.row,
  },
  upNextOutline: {
    borderWidth: 2,
    borderColor: citron,
  },
  doneContainer: {
    opacity: 0.7,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  index: {
    fontSize: 11,
    color: sub,
    fontFamily: FontFamily.monoBold,
    letterSpacing: 0.55,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontFamily: FontFamily.outfitBold,
    color: ink,
    letterSpacing: -0.15,
  },
  nameDone: {
    textDecorationLine: 'line-through',
  },
  meta: {
    fontSize: 11.5,
    color: sub,
    marginTop: 1,
    fontFamily: FontFamily.outfitMedium,
  },
  statusPill: {
    paddingVertical: 4,
  },
  statusPillUpNext: {
    backgroundColor: citron,
    paddingHorizontal: 9,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 10.5,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: 0.84,
    textTransform: 'uppercase',
    color: sub,
  },
  statusTextUpNext: {
    color: greenDeep,
  },
  statusTextDone: {
    color: forest,
    textTransform: 'uppercase',
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
