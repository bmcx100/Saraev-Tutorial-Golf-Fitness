export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  habitId: string;
  habitIds?: string[];
  targetTotal: number;
  durationDays: number;
}

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'get-long',
    name: 'Get Long',
    description: 'Build swing speed: 12 speed training sessions this month.',
    habitId: 'speed-training',
    targetTotal: 12,
    durationDays: 30,
  },
  {
    id: 'get-strong',
    name: 'Get Strong',
    description: 'Build strength: 12 gym sessions this month.',
    habitId: 'gym',
    targetTotal: 12,
    durationDays: 30,
  },
  {
    id: 'tighten-it-up',
    name: 'Tighten It Up',
    description: 'Stay sharp: 12 cardio or core sessions this month.',
    habitId: 'cardio',
    habitIds: ['cardio', 'core'],
    targetTotal: 12,
    durationDays: 30,
  },
  {
    id: 'speed-week',
    name: 'Speed Week',
    description: 'Build swing speed with 5 speed training sessions in a week.',
    habitId: 'speed-training',
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
