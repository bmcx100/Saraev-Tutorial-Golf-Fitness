import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface DayData {
  day: string;
  completedIds: string[];
}

interface WeekGridProps {
  habitId: string;
  habitName: string;
  weekData: DayData[];
}

export function WeekGrid({ habitId, habitName, weekData }: WeekGridProps) {
  const colors = useColors();
  const daysCompleted = weekData.filter((d) => d.completedIds.includes(habitId)).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.habitName, { color: colors.text }]}>{habitName}</Text>
        <Text style={[styles.count, { color: colors.accent }]}>{daysCompleted}/7</Text>
      </View>
      <View style={styles.dots}>
        {weekData.map((day, i) => {
          const done = day.completedIds.includes(habitId);
          return (
            <View key={i} style={styles.dayColumn}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done ? colors.accent : 'transparent',
                    borderColor: done ? colors.accent : colors.border,
                  },
                ]}
              />
              <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>{day.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 15,
    fontWeight: '600',
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
