export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  habitId: string;
  targetTotal: number;
  durationDays: number;
}

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'speed-week',
    name: 'Speed Week',
    description: 'Build swing speed with 5 speed stick sessions in a week.',
    habitId: 'speed-sticks',
    targetTotal: 5,
    durationDays: 7,
  },
  {
    id: 'driver-blitz',
    name: 'Driver Blitz',
    description: 'Hit the range for 7 driver sessions in two weeks.',
    habitId: 'driver',
    targetTotal: 7,
    durationDays: 14,
  },
  {
    id: 'gym-streak',
    name: 'Gym Streak',
    description: 'Crush 10 gym sessions in 30 days.',
    habitId: 'gym',
    targetTotal: 10,
    durationDays: 30,
  },
  {
    id: 'cardio-month',
    name: 'Cardio Month',
    description: 'Complete 8 cardio sessions across 30 days.',
    habitId: 'cardio',
    targetTotal: 8,
    durationDays: 30,
  },
];

/** Creates a 3-day onboarding challenge for the user's first selected habit */
export function createOnboardingTemplate(habitId: string): ChallengeTemplate {
  return {
    id: 'onboarding-3day',
    name: '3-Day Kickoff',
    description: 'Complete 3 sessions in 3 days to build your first streak!',
    habitId,
    targetTotal: 3,
    durationDays: 3,
  };
}
