import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadProfile, saveProfile } from '@/utils/storage';

export interface ScheduleConfig {
  categoryRotations: {
    [category: string]: {
      sequence: string[];
      startDate: string;
    };
  };
  habitWeekdays: {
    [habitId: string]: number[];
  };
}

export const DEFAULT_SCHEDULE: ScheduleConfig = {
  categoryRotations: {},
  habitWeekdays: {},
};

export interface UserProfile {
  onboardingComplete: boolean;
  activeHabitIds: string[];
  notificationMorning: string;
  notificationEvening: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  schedule: ScheduleConfig;
  speedProtocol: 'superspeed-l1' | 'bmc' | null;
}

const DEFAULT_PROFILE: UserProfile = {
  onboardingComplete: false,
  activeHabitIds: [],
  notificationMorning: '08:00',
  notificationEvening: '20:00',
  notificationsEnabled: false,
  soundEnabled: true,
  schedule: DEFAULT_SCHEDULE,
  speedProtocol: null,
};

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isOnboardingComplete: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  profile: DEFAULT_PROFILE,
  updateProfile: () => {},
  isOnboardingComplete: false,
  isLoading: true,
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadProfile();
      if (stored) setProfile(stored);
      setIsLoading(false);
    })();
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...updates };
        saveProfile(next);
        return next;
      });
    },
    [],
  );

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        isOnboardingComplete: profile.onboardingComplete,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
