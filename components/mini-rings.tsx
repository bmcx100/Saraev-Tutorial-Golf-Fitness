import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';
import { CATEGORY_META, type Habit, type HabitCategory } from '@/constants/habits';
import type { HabitLog } from '@/contexts/habit-context';

interface DayRingData {
  date: string;
  dayLabel: string;
  logs: HabitLog[];
  isToday: boolean;
}

interface MiniRingsProps {
  days: DayRingData[];
  activeHabits: Habit[];
}

const RING_SIZE = 40;
const RING_WIDTH = 3;
const CATEGORY_ORDER: HabitCategory[] = ['golf', 'workout', 'lifestyle'];

export function MiniRings({ days, activeHabits }: MiniRingsProps) {
  const colors = useColors();

  // Build category rings from active habits
  const activeCategories = CATEGORY_ORDER.filter((cat) =>
    activeHabits.some((h) => h.category === cat),
  );

  return (
    <View style={styles.container}>
      {days.map((day) => {
        const totalHabits = activeHabits.length;
        const completedCount = activeHabits.filter((h) => {
          const log = day.logs.find((l) => l.habitId === h.id);
          return log ? log.count >= h.targetCount : false;
        }).length;

        const categoryRings = activeCategories.map((cat) => {
          const habits = activeHabits.filter((h) => h.category === cat);
          const completed = habits.filter((h) => {
            const log = day.logs.find((l) => l.habitId === h.id);
            return log ? log.count >= h.targetCount : false;
          }).length;
          return {
            key: cat,
            color: CATEGORY_META[cat].color,
            progress: habits.length > 0 ? completed / habits.length : 0,
          };
        });

        return (
          <View key={day.date} style={styles.dayColumn}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              {categoryRings.map((ring, i) => {
                const center = RING_SIZE / 2;
                const radius = center - RING_WIDTH / 2 - i * (RING_WIDTH + 2);
                if (radius <= 0) return null;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference * (1 - ring.progress);

                return (
                  <React.Fragment key={ring.key}>
                    <Circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke={colors.ringBackground}
                      strokeWidth={RING_WIDTH}
                      fill="none"
                    />
                    <Circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke={ring.color}
                      strokeWidth={RING_WIDTH}
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      rotation={-90}
                      origin={`${center}, ${center}`}
                    />
                  </React.Fragment>
                );
              })}
            </Svg>
            <Text
              style={[
                styles.dayLabel,
                { color: day.isToday ? colors.tint : colors.textSecondary },
                day.isToday && styles.todayLabel,
              ]}
            >
              {day.dayLabel}
            </Text>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>
              {completedCount}/{totalHabits}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  todayLabel: {
    fontWeight: '700',
  },
  countLabel: {
    fontSize: 10,
  },
});
