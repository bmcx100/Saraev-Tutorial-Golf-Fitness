import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useHabits } from '@/contexts/habit-context';
import { useChallenges } from '@/contexts/challenge-context';
import { useUser } from '@/contexts/user-context';
import { useColors } from '@/hooks/use-colors';
import { FitnessRings, type CategoryRingData } from '@/components/fitness-rings';
import { CATEGORY_META, type HabitCategory } from '@/constants/habits';
import { ChallengeCard } from '@/components/challenge-card';
import { HabitRow } from '@/components/habit-row';
import { Confetti } from '@/components/confetti';
import { playSound } from '@/constants/sounds';

export default function TodayScreen() {
  const { todayHabits, logHabit, getHabitProgress } = useHabits();
  const { activeChallenge, challengeProgress, checkChallengeCompletion } = useChallenges();
  const { profile } = useUser();
  const colors = useColors();

  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiMessage, setConfettiMessage] = useState<string | undefined>();

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });

  const handleLog = useCallback(
    (habitId: string) => {
      // Speed Sticks navigates to dedicated page instead of toggling
      if (habitId === 'speed-sticks') {
        router.push('/speed');
        return;
      }

      const { justCompleted, allDone } = logHabit(habitId);

      if (allDone) {
        // All habits done — confetti celebration
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
        playSound('confetti', profile.soundEnabled);
        setConfettiMessage(undefined);
        setConfettiActive(true);
      } else if (justCompleted) {
        playSound('success', profile.soundEnabled);
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else {
        playSound('tap', profile.soundEnabled);
      }

      checkChallengeCompletion();
    },
    [logHabit, checkChallengeCompletion, profile.soundEnabled],
  );

  // Prepare ring data — one ring per category
  const categoryOrder: HabitCategory[] = ['golf', 'workout', 'lifestyle'];
  const ringData: CategoryRingData[] = [];
  for (const cat of categoryOrder) {
    const habits = todayHabits.filter((h) => h.category === cat);
    if (habits.length === 0) continue;
    const completed = habits.filter((h) => getHabitProgress(h.id).complete).length;
    const meta = CATEGORY_META[cat];
    ringData.push({
      key: cat,
      label: meta.label,
      color: meta.color,
      progress: completed / habits.length,
    });
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Confetti
        active={confettiActive}
        message={confettiMessage}
        onComplete={() => setConfettiActive(false)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>Today</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{dateStr}</Text>
          </View>
          <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
            <MaterialIcons name="settings" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Fitness Rings */}
        {ringData.length > 0 && (
          <View style={styles.ringsSection}>
            <FitnessRings rings={ringData} />
          </View>
        )}

        {/* Challenge Banner */}
        {activeChallenge && (
          <View style={styles.challengeSection}>
            <ChallengeCard
              challenge={activeChallenge}
              progress={challengeProgress}
              onPress={() => router.push('/(tabs)/challenges')}
              compact
            />
          </View>
        )}

        {/* Habit Rows — grouped by category */}
        {categoryOrder.map((cat) => {
          const habits = todayHabits.filter((h) => h.category === cat);
          if (habits.length === 0) return null;
          const catCompleted = habits.filter((h) => getHabitProgress(h.id).complete).length;
          const meta = CATEGORY_META[cat];
          return (
            <View key={cat} style={styles.habitsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                {meta.label} · {catCompleted}/{habits.length} complete
              </Text>
              {habits.map((habit) => {
                const { count, target, complete } = getHabitProgress(habit.id);
                return (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    count={count}
                    target={target}
                    complete={complete}
                    onLog={() => handleLog(habit.id)}
                  />
                );
              })}
            </View>
          );
        })}

        {todayHabits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No sessions selected. Tap the gear icon to add some.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    gap: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  date: {
    fontSize: 16,
  },
  ringsSection: {
    marginBottom: 24,
  },
  challengeSection: {
    marginBottom: 24,
  },
  habitsSection: {
    gap: 2,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
