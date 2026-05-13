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
    id: 'push-streak',
    name: 'Push Streak',
    description: 'Crush 10 push workouts in 30 days.',
    habitId: 'push',
    targetTotal: 10,
    durationDays: 30,
  },
  {
    id: 'pull-streak',
    name: 'Pull Streak',
    description: 'Crush 10 pull workouts in 30 days.',
    habitId: 'pull',
    targetTotal: 10,
    durationDays: 30,
  },
  {
    id: 'leg-month',
    name: 'Leg Month',
    description: 'Complete 8 leg day sessions across 30 days.',
    habitId: 'leg-day-1',
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
