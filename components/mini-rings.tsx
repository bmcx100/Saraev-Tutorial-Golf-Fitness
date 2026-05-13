import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';
import type { Habit } from '@/constants/habits';
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
const MAX_VISIBLE_RINGS = 3;

export function MiniRings({ days, activeHabits }: MiniRingsProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {days.map((day) => {
        const completedCount = activeHabits.filter((h) => {
          const log = day.logs.find((l) => l.habitId === h.id);
          return log ? log.count >= h.targetCount : false;
        }).length;

        // Sort habits by completion (least complete first for outer ring)
        const sortedHabits = [...activeHabits]
          .map((h) => {
            const log = day.logs.find((l) => l.habitId === h.id);
            const count = log?.count ?? 0;
            return { habit: h, progress: Math.min(count / h.targetCount, 1) };
          })
          .sort((a, b) => a.progress - b.progress)
          .slice(0, MAX_VISIBLE_RINGS);

        return (
          <View key={day.date} style={styles.dayColumn}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              {sortedHabits.map((item, i) => {
                const center = RING_SIZE / 2;
                const radius = center - RING_WIDTH / 2 - i * (RING_WIDTH + 2);
                if (radius <= 0) return null;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference * (1 - item.progress);

                return (
                  <React.Fragment key={item.habit.id}>
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
                      stroke={item.habit.ringColor}
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
              {completedCount}/{activeHabits.length}
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
