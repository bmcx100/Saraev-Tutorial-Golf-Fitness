import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CHALLENGE_TEMPLATES,
  createOnboardingTemplate,
  type ChallengeTemplate,
} from '@/constants/challenges';
import { useHabits } from '@/contexts/habit-context';
import { useUser } from '@/contexts/user-context';
import {
  loadChallenges,
  saveChallenges,
  loadLogsForRange,
  dateRange,
  formatDate,
} from '@/utils/storage';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  habitId: string;
  targetTotal: number;
  durationDays: number;
  startDate: string;
  status: 'active' | 'completed' | 'failed' | 'available';
}

interface ChallengeContextType {
  activeChallenge: Challenge | null;
  challengeProgress: number;
  availableChallenges: ChallengeTemplate[];
  completedChallenges: Challenge[];
  startChallenge: (templateId: string) => void;
  checkChallengeCompletion: () => void;
}

const ChallengeContext = createContext<ChallengeContextType>({
  activeChallenge: null,
  challengeProgress: 0,
  availableChallenges: [],
  completedChallenges: [],
  startChallenge: () => {},
  checkChallengeCompletion: () => {},
});

export const useChallenges = () => useContext(ChallengeContext);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useUser();
  const { todayLogs } = useHabits();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeProgress, setChallengeProgress] = useState(0);

  // Load persisted challenges
  useEffect(() => {
    (async () => {
      const stored = await loadChallenges();
      setChallenges(stored);
    })();
  }, []);

  const activeChallenge = useMemo(
    () => challenges.find((c) => c.status === 'active') ?? null,
    [challenges],
  );

  const completedChallenges = useMemo(
    () => challenges.filter((c) => c.status === 'completed' || c.status === 'failed'),
    [challenges],
  );

  // Filter available templates to habits the user has active
  const availableChallenges = useMemo(
    () =>
      CHALLENGE_TEMPLATES.filter((t) =>
        profile.activeHabitIds.includes(t.habitId),
      ),
    [profile.activeHabitIds],
  );

  // Compute progress for active challenge
  useEffect(() => {
    if (!activeChallenge) {
      setChallengeProgress(0);
      return;
    }

    (async () => {
      const dates = dateRange(activeChallenge.startDate, activeChallenge.durationDays);
      const logsMap = await loadLogsForRange(dates);
      let total = 0;
      for (const logs of logsMap.values()) {
        const log = logs.find((l) => l.habitId === activeChallenge.habitId);
        if (log) total += log.count;
      }
      setChallengeProgress(total);
    })();
  }, [activeChallenge, todayLogs]);

  // Check if active challenge completed or expired
  const checkChallengeCompletion = useCallback(() => {
    if (!activeChallenge) return;

    const today = formatDate(new Date());
    const endDate = new Date(activeChallenge.startDate + 'T00:00:00');
    endDate.setDate(endDate.getDate() + activeChallenge.durationDays);
    const endDateStr = formatDate(endDate);

    let newStatus: Challenge['status'] | null = null;

    if (challengeProgress >= activeChallenge.targetTotal) {
      newStatus = 'completed';
    } else if (today >= endDateStr) {
      newStatus = 'failed';
    }

    if (newStatus) {
      setChallenges((prev) => {
        const next = prev.map((c) =>
          c.id === activeChallenge.id ? { ...c, status: newStatus! } : c,
        );
        saveChallenges(next);
        return next;
      });
    }
  }, [activeChallenge, challengeProgress]);

  // Run completion check when progress changes
  useEffect(() => {
    checkChallengeCompletion();
  }, [checkChallengeCompletion]);

  const startChallenge = useCallback(
    (templateId: string) => {
      if (activeChallenge) return; // Only one at a time

      let template: ChallengeTemplate | undefined;
      if (templateId === 'onboarding-3day') {
        const firstHabit = profile.activeHabitIds[0];
        if (firstHabit) template = createOnboardingTemplate(firstHabit);
      } else {
        template = CHALLENGE_TEMPLATES.find((t) => t.id === templateId);
      }
      if (!template) return;

      const newChallenge: Challenge = {
        id: `${template.id}-${Date.now()}`,
        name: template.name,
        description: template.description,
        habitId: template.habitId,
        targetTotal: template.targetTotal,
        durationDays: template.durationDays,
        startDate: formatDate(new Date()),
        status: 'active',
      };

      setChallenges((prev) => {
        const next = [...prev, newChallenge];
        saveChallenges(next);
        return next;
      });
    },
    [activeChallenge, profile.activeHabitIds],
  );

  return (
    <ChallengeContext.Provider
      value={{
        activeChallenge,
        challengeProgress,
        availableChallenges,
        completedChallenges,
        startChallenge,
        checkChallengeCompletion,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}
