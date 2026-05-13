import { ScrollView, View, Pressable, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { Habit } from '@/constants/habits';

interface ScheduleGridProps {
  habits: Habit[];
  cycleLength: number;
  sequence: string[];
  onChange: (sequence: string[]) => void;
  todayIndex?: number;
}

export function ScheduleGrid({
  habits,
  cycleLength,
  sequence,
  onChange,
  todayIndex,
}: ScheduleGridProps) {
  const colors = useColors();

  const handleTap = (dayIndex: number, habitId: string) => {
    const next = [...sequence];
    // If already selected → deselect (empty that day)
    if (next[dayIndex] === habitId) {
      next[dayIndex] = '';
    } else {
      // One-per-column: set this habit for this day
      next[dayIndex] = habitId;
    }
    onChange(next);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* Column headers */}
        <View style={styles.headerRow}>
          <View style={styles.labelCell} />
          {Array.from({ length: cycleLength }, (_, i) => (
            <View
              key={i}
              style={[
                styles.headerCell,
                i === todayIndex && {
                  backgroundColor: colors.accent + '20',
                  borderRadius: 8,
                },
              ]}
            >
              <Text
                style={[
                  styles.headerText,
                  { color: i === todayIndex ? colors.accent : colors.textSecondary },
                ]}
              >
                {i + 1}
              </Text>
            </View>
          ))}
        </View>

        {/* Habit rows */}
        {habits.map((habit) => (
          <View key={habit.id} style={styles.habitRow}>
            <View style={styles.labelCell}>
              <Text
                style={[styles.habitLabel, { color: colors.text }]}
                numberOfLines={1}
              >
                {habit.name}
              </Text>
            </View>
            {Array.from({ length: cycleLength }, (_, dayIdx) => {
              const selected = sequence[dayIdx] === habit.id;
              return (
                <Pressable
                  key={dayIdx}
                  onPress={() => handleTap(dayIdx, habit.id)}
                  style={[
                    styles.cell,
                    dayIdx === todayIndex && {
                      backgroundColor: colors.accent + '08',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.dot,
                      selected
                        ? { backgroundColor: habit.ringColor }
                        : { borderColor: colors.border, borderWidth: 1.5 },
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerCell: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  labelCell: {
    width: 80,
    paddingRight: 8,
  },
  habitLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  cell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
