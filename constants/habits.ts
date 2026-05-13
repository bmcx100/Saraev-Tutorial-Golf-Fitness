export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: 'golf' | 'workout' | 'lifestyle';
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
    id: 'gym',
    name: 'Strength Training',
    icon: 'fitness-center',
    category: 'workout',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#E63946',
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: 'directions-run',
    category: 'workout',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#F59E0B',
  },
  {
    id: 'core',
    name: 'Core',
    icon: 'self-improvement',
    category: 'workout',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#457B9D',
  },

  // Lifestyle
  {
    id: 'meals',
    name: 'Meals',
    icon: 'restaurant',
    category: 'lifestyle',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#2D9CDB',
  },
  {
    id: 'h2o',
    name: 'H2O',
    icon: 'water-drop',
    category: 'lifestyle',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#56CCF2',
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    icon: 'local-bar',
    category: 'lifestyle',
    trackingType: 'binary',
    targetCount: 1,
    unit: 'session',
    duration: '1 session',
    ringColor: '#9B51E0',
  },
];

export type HabitCategory = Habit['category'];

export const CATEGORY_META: Record<HabitCategory, { label: string; color: string }> = {
  golf: { label: 'Golf', color: '#2D6A4F' },
  workout: { label: 'Workouts', color: '#E63946' },
  lifestyle: { label: 'Lifestyle', color: '#9B51E0' },
};

/** Default habit IDs for users migrating from the old format */
export const LEGACY_HABIT_IDS = ['speed-sticks', 'driver', 'gym', 'cardio'];
