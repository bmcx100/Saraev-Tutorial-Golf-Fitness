import { useState, useCallback, useEffect, useRef } from 'react';
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
import { PaceToast } from '@/components/pace-toast';
import { playSound } from '@/constants/sounds';
import { usePace } from '@/hooks/use-pace';
import { loadPaceToastShown, savePaceToastShown, formatDate } from '@/utils/storage';

export default function TodayScreen() {
  const { todayHabits, logHabit, getHabitProgress } = useHabits();
  const { activeChallenge, challengeProgress, checkChallengeCompletion } = useChallenges();
  const { profile, devDateOverride } = useUser();
  const colors = useColors();

  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiMessage, setConfettiMessage] = useState<string | undefined>();

  const { paceMap, celebrationHabits, warningHabits } = usePace();
  const [showCelebrationToast, setShowCelebrationToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const toastCheckedRef = useRef<string | null>(null);

  const displayDate = devDateOverride ? new Date(devDateOverride + 'T00:00:00') : new Date();
  const dateStr = displayDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });

  const todayStr = devDateOverride ?? formatDate(new Date());

  // Pace toast logic — once per day
  useEffect(() => {
    if (toastCheckedRef.current === todayStr) return;
    if (celebrationHabits.length === 0 && warningHabits.length === 0) return;

    (async () => {
      const alreadyShown = await loadPaceToastShown(todayStr);
      if (alreadyShown) {
        toastCheckedRef.current = todayStr;
        return;
      }
      toastCheckedRef.current = todayStr;

      if (celebrationHabits.length > 0) {
        setShowCelebrationToast(true);
      }
      if (warningHabits.length > 0) {
        setShowWarningToast(true);
      }

      await savePaceToastShown(todayStr);
    })();
  }, [todayStr, celebrationHabits, warningHabits]);

  const handleLog = useCallback(
    (habitId: string) => {
      // Speed Training navigates to dedicated page instead of toggling
      if (habitId === 'speed-training') {
        router.push('/speed');
        return;
      }

      // Strength Training navigates to dedicated page instead of toggling
      if (habitId === 'gym') {
        router.push('/strength');
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

      {showCelebrationToast && celebrationHabits.length > 0 && (
        <PaceToast
          message={`You're crushing ${celebrationHabits[0]}! Keep it\u00A0up!`}
          variant="celebration"
          visible={showCelebrationToast}
          onDismiss={() => setShowCelebrationToast(false)}
        />
      )}
      {showWarningToast && warningHabits.length > 0 && (
        <PaceToast
          message={`${warningHabits[0]} needs attention. Time to get after\u00A0it!`}
          variant="warning"
          visible={showWarningToast}
          onDismiss={() => setShowWarningToast(false)}
          delay={celebrationHabits.length > 0 ? 3500 : 0}
        />
      )}

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

        {devDateOverride && (
          <View style={[styles.devBanner, { backgroundColor: '#F59E0B' + '20', borderColor: '#F59E0B' }]}>
            <MaterialIcons name="build" size={14} color="#F59E0B" />
            <Text style={[styles.devBannerText, { color: '#F59E0B' }]}>
              Dev date override active
            </Text>
          </View>
        )}

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
                    paceStatus={paceMap.get(habit.id)?.status}
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
    userSelect: 'none',
  } as any,
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
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  devBannerText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
