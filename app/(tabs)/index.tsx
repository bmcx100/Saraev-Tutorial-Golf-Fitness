import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useHabits } from '@/contexts/habit-context';
import { useChallenges } from '@/contexts/challenge-context';
import { useUser } from '@/contexts/user-context';
import { CATEGORY_META, type HabitCategory, type Habit } from '@/constants/habits';
import { Confetti } from '@/components/confetti';
import { PaceToast } from '@/components/pace-toast';
import { playSound } from '@/constants/sounds';
import { usePace } from '@/hooks/use-pace';
import { useQueueOrder } from '@/hooks/use-queue-order';
import { recomputeIfStale } from '@/utils/queue-order';
import { loadPaceToastShown, savePaceToastShown, formatDate } from '@/utils/storage';
import type { HeroVariant } from '@/components/today/up-next-hero';

import {
  G10, ink, sub, forest, cream,
  FontFamily, shadows,
} from '@/constants/design-tokens';
import { TopoBackground } from '@/components/today/topo-background';
import { RingCard } from '@/components/today/ring-card';
import { UpNextHero } from '@/components/today/up-next-hero';
import { QueueRow } from '@/components/today/queue-row';
import { GearIcon } from '@/components/ui/design-icons';

/** Build a meta description string for a habit in the queue row */
function habitMeta(habit: Habit): string {
  const mins = habit.durationMinutes ? ` · ${habit.durationMinutes} min` : '';
  switch (habit.id) {
    case 'speed-training':
      return `6 × 3 sets · L / R${mins}`;
    case 'driver':
      return `Range session${mins}`;
    case 'gym':
      return `4 sets · 8 reps${mins}`;
    case 'cardio':
      return `Cardio session${mins}`;
    case 'core':
      return `Core session${mins}`;
    case 'meals':
      return `Log meals${mins}`;
    case 'h2o':
      return `Track water${mins}`;
    case 'alcohol':
      return `Track drinks${mins}`;
    default:
      return habit.duration + mins;
  }
}

/** Build subtitle for Up Next hero */
function heroSubtitle(habit: Habit, challengeName?: string): string {
  const base = habitMeta(habit).replace(` · ${habit.durationMinutes} min`, '');
  if (challengeName) {
    return `${base} · part of ${challengeName}`;
  }
  return base;
}

const CATEGORY_ORDER: HabitCategory[] = ['golf', 'workout', 'lifestyle'];

export default function TodayScreen() {
  const { todayHabits, logHabit, getHabitProgress } = useHabits();
  const { activeChallenge, challengeProgress, checkChallengeCompletion } = useChallenges();
  const { profile, devDateOverride } = useUser();

  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiMessage, setConfettiMessage] = useState<string | undefined>();

  const { celebrationHabits, warningHabits } = usePace();
  const [showCelebrationToast, setShowCelebrationToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const toastCheckedRef = useRef<string | null>(null);

  const displayDate = useMemo(
    () => devDateOverride ? new Date(devDateOverride + 'T00:00:00') : new Date(),
    [devDateOverride],
  );
  const dateStr = displayDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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
      if (habitId === 'speed-training') {
        router.push('/speed');
        return;
      }
      if (habitId === 'gym') {
        router.push('/strength');
        return;
      }

      const { justCompleted, allDone } = logHabit(habitId);

      if (allDone) {
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

      // Trigger background recompute of queue order if stale
      const categoryMap: Record<string, HabitCategory> = {};
      for (const h of todayHabits) categoryMap[h.id] = h.category;
      recomputeIfStale(
        todayHabits.map((h) => h.id),
        categoryMap,
      ).catch(() => {});
    },
    [logHabit, checkChallengeCompletion, profile.soundEnabled, todayHabits],
  );

  // Order habits by learned queue order, completed at bottom
  const orderedHabits = useQueueOrder(todayHabits, getHabitProgress);

  // Ring data — per-category progress
  const ringPcts = useMemo((): [number, number, number] => {
    const pcts: [number, number, number] = [0, 0, 0];
    for (let ci = 0; ci < CATEGORY_ORDER.length; ci++) {
      const cat = CATEGORY_ORDER[ci];
      const habits = todayHabits.filter((h) => h.category === cat);
      if (habits.length === 0) continue;
      const completed = habits.filter((h) => getHabitProgress(h.id).complete).length;
      pcts[ci] = completed / habits.length;
    }
    return pcts;
  }, [todayHabits, getHabitProgress]);

  // Find first incomplete habit (Up Next)
  const upNextHabit = useMemo(
    () => orderedHabits.find((h) => !getHabitProgress(h.id).complete) ?? null,
    [orderedHabits, getHabitProgress],
  );

  const upNextIndex = upNextHabit
    ? orderedHabits.indexOf(upNextHabit)
    : -1;

  // Compute hero variant from habit ID
  const heroVariant: HeroVariant = useMemo(() => {
    if (!upNextHabit) return 'default';
    if (upNextHabit.id === 'speed-training') return 'speed';
    if (upNextHabit.id === 'gym') return 'strength';
    return 'default';
  }, [upNextHabit]);

  // Challenge day number
  const challengeDayNumber = useMemo(() => {
    if (!activeChallenge) return 0;
    const start = new Date(activeChallenge.startDate + 'T00:00:00').getTime();
    const today = displayDate.getTime();
    return Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  }, [activeChallenge, displayDate]);

  // Challenge days left
  const challengeDaysLeft = useMemo(() => {
    if (!activeChallenge) return 0;
    const start = new Date(activeChallenge.startDate + 'T00:00:00').getTime();
    const end = start + activeChallenge.durationDays * 24 * 60 * 60 * 1000;
    const today = displayDate.getTime();
    return Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
  }, [activeChallenge, displayDate]);

  // Which categories have incomplete habits
  const remainingCategories = useMemo(() => {
    const cats: string[] = [];
    for (const cat of CATEGORY_ORDER) {
      const habits = todayHabits.filter((h) => h.category === cat);
      if (habits.length > 0 && habits.some((h) => !getHabitProgress(h.id).complete)) {
        cats.push(CATEGORY_META[cat].label);
      }
    }
    return cats;
  }, [todayHabits, getHabitProgress]);

  // Challenge name matches? (for "part of Get Long" subtitle)
  const challengeMatchesHabit = useCallback(
    (habitId: string) => {
      if (!activeChallenge) return false;
      const matchIds = activeChallenge.habitIds ?? [activeChallenge.habitId];
      return matchIds.includes(habitId);
    },
    [activeChallenge],
  );

  // Day 1 label in header eyebrow
  const dayLabel = activeChallenge ? ` · Day ${challengeDayNumber}` : '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

      {/* Page-level topo contour overlay */}
      <TopoBackground />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>
              {dateStr.toUpperCase()}{dayLabel.toUpperCase()}
            </Text>
            <Text style={styles.title}>Today</Text>
          </View>
          <Pressable
            style={styles.gearButton}
            onPress={() => router.push('/settings')}
            hitSlop={12}
          >
            <GearIcon size={18} color={forest} />
          </Pressable>
        </View>

        {devDateOverride && (
          <View style={styles.devBanner}>
            <MaterialIcons name="build" size={14} color="#F59E0B" />
            <Text style={styles.devBannerText}>Dev date override active</Text>
          </View>
        )}

        {/* G8 Ring Card — active challenge */}
        {activeChallenge && (
          <View style={styles.section}>
            <RingCard
              challengeName={activeChallenge.name + '.'}
              dayNumber={challengeDayNumber}
              remaining={remainingCategories.length}
              categoryLabels={remainingCategories}
              progress={challengeProgress}
              target={activeChallenge.targetTotal}
              ringPcts={ringPcts}
            />
          </View>
        )}

        {/* Up Next Hero */}
        {upNextHabit && (
          <View style={styles.section}>
            <UpNextHero
              habit={upNextHabit}
              variant={heroVariant}
              subtitle={heroSubtitle(
                upNextHabit,
                challengeMatchesHabit(upNextHabit.id) ? activeChallenge?.name : undefined,
              )}
              queuePosition={upNextIndex + 1}
              queueTotal={orderedHabits.length}
              challengeName={
                challengeMatchesHabit(upNextHabit.id) ? activeChallenge?.name : undefined
              }
              challengeSessionCurrent={
                challengeMatchesHabit(upNextHabit.id) ? challengeProgress : undefined
              }
              challengeSessionTotal={
                challengeMatchesHabit(upNextHabit.id) ? activeChallenge?.targetTotal : undefined
              }
              challengeDaysLeft={
                challengeMatchesHabit(upNextHabit.id) ? challengeDaysLeft : undefined
              }
              onStartPress={() => handleLog(upNextHabit.id)}
            />
          </View>
        )}

        {/* Today's Queue */}
        {orderedHabits.length > 0 && (
          <>
            <View style={styles.queueHeader}>
              <Text style={styles.queueTitle}>Today&apos;s queue</Text>
              <Text style={styles.queueCount}>
                {orderedHabits.length} items
              </Text>
            </View>
            <View style={styles.queueList}>
              {orderedHabits.map((habit, i) => {
                const { complete } = getHabitProgress(habit.id);
                const isUpNext = !complete && i === upNextIndex;
                return (
                  <QueueRow
                    key={habit.id}
                    index={String(i + 1).padStart(2, '0')}
                    habit={habit}
                    meta={habitMeta(habit)}
                    state={complete ? 'done' : isUpNext ? 'up-next' : 'queued'}
                    onPress={() => handleLog(habit.id)}
                  />
                );
              })}
            </View>
          </>
        )}

        {todayHabits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No sessions selected. Tap the gear icon to add some.
            </Text>
          </View>
        )}

        {/* Bottom spacer for floating tab bar */}
        <View style={styles.tabBarSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: G10,
    userSelect: 'none',
  } as any,
  content: {
    paddingTop: 0,
  },
  // ── Header ──
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  eyebrow: {
    fontSize: 11.5,
    fontFamily: FontFamily.outfitBold,
    color: forest,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 2,
    fontSize: 32,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -1.12,
    lineHeight: 32,
    color: ink,
  },
  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cream,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gear,
  },
  // ── Dev banner ──
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 18,
    marginTop: 10,
    backgroundColor: '#F59E0B20',
    borderColor: '#F59E0B',
  },
  devBannerText: {
    fontSize: 13,
    fontFamily: FontFamily.outfitSemiBold,
    color: '#F59E0B',
  },
  // ── Sections ──
  section: {
    marginTop: 14,
    marginHorizontal: 18,
  },
  // ── Queue ──
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  queueTitle: {
    fontSize: 18,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -0.36,
    color: ink,
  },
  queueCount: {
    fontSize: 11.5,
    fontFamily: FontFamily.monoBold,
    color: sub,
  },
  queueList: {
    paddingHorizontal: 18,
    gap: 8,
  },
  // ── Empty state ──
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: FontFamily.outfitMedium,
    textAlign: 'center',
    color: sub,
  },
  // ── Bottom spacer ──
  tabBarSpacer: {
    height: 110,
  },
});
