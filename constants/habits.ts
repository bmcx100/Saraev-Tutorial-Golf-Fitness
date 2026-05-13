export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: 'golf' | 'workout';
  trackingType: 'binary' | 'counter';
  targetCount: number;
  unit: string;
  duration: string;
  ringColor: string;
}

export const HABIT_LIBRARY: Habit[] = [
  // Golf
  {
    id: 'speed-sticks',
    name: 'Speed Sticks',
    icon: 'bolt',
    category: 'golf',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#2D6A4F',
  },
  {
    id: 'driver',
    name: 'Driver',
    icon: 'golf-course',
    category: 'golf',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#52B788',
  },

  // Fitness
  {
    id: 'push',
    name: 'Push',
    icon: 'fitness-center',
    category: 'workout',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#E63946',
  },
  {
    id: 'pull',
    name: 'Pull',
    icon: 'fitness-center',
    category: 'workout',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#457B9D',
  },
  {
    id: 'leg-day-1',
    name: 'Leg Day One',
    icon: 'directions-walk',
    category: 'workout',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#F59E0B',
  },
  {
    id: 'leg-day-2',
    name: 'Leg Day Two',
    icon: 'directions-walk',
    category: 'workout',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#7B2CBF',
  },
];

/** Default habit IDs for users migrating from the old format */
export const LEGACY_HABIT_IDS = ['speed-sticks', 'driver', 'push', 'pull', 'leg-day-1', 'leg-day-2'];
