export type WorkoutDay = 'legs1' | 'pull' | 'legs2' | 'push';

export const WORKOUT_ROTATION: WorkoutDay[] = ['legs1', 'pull', 'legs2', 'push'];

export interface ExerciseDef {
  id: string;
  name: string;
  defaultReps: number;
}

export interface WorkoutDayDef {
  key: WorkoutDay;
  label: string;
  subtitle: string;
  exercises: ExerciseDef[];
}

export const WORKOUT_DAYS: WorkoutDayDef[] = [
  {
    key: 'legs1',
    label: 'Legs 1',
    subtitle: 'Quads',
    exercises: [
      { id: 'calf-raises', name: 'Calf Raises', defaultReps: 8 },
      { id: 'tib-raises', name: 'Tib Raises', defaultReps: 8 },
      { id: 'split-squats', name: 'Split Squats', defaultReps: 8 },
      { id: 'squats', name: 'Squats', defaultReps: 8 },
    ],
  },
  {
    key: 'pull',
    label: 'Pull',
    subtitle: 'Back & Biceps',
    exercises: [
      { id: 'shrugs', name: 'Shrugs', defaultReps: 8 },
      { id: 'lat-pulldowns', name: 'Lat Pulldowns', defaultReps: 8 },
      { id: 'bent-over-rows', name: 'Bent Over Rows', defaultReps: 8 },
      { id: 'curls', name: 'Curls', defaultReps: 8 },
    ],
  },
  {
    key: 'legs2',
    label: 'Legs 2',
    subtitle: 'Hamstrings',
    exercises: [
      { id: 'calf-raises', name: 'Calf Raises', defaultReps: 8 },
      { id: 'tib-raises', name: 'Tib Raises', defaultReps: 8 },
      { id: 'nordic-curls', name: 'Nordic Curls', defaultReps: 8 },
      { id: 'back-extensions', name: 'Back Extensions', defaultReps: 8 },
      { id: 'dead-lifts', name: 'Dead Lifts', defaultReps: 8 },
    ],
  },
  {
    key: 'push',
    label: 'Push',
    subtitle: 'Chest, Shoulders & Triceps',
    exercises: [
      { id: 'dips', name: 'Dips', defaultReps: 8 },
      { id: 'bench-press', name: 'Bench Press', defaultReps: 8 },
      { id: 'overhead-press', name: 'Overhead Press', defaultReps: 8 },
      { id: 'front-delt-raises', name: 'Front Delt Raises', defaultReps: 8 },
      { id: 'side-delt-raises', name: 'Side Delt Raises', defaultReps: 8 },
      { id: 'tricep-extensions', name: 'Tricep Extensions', defaultReps: 8 },
    ],
  },
];

export const SETS_PER_EXERCISE = 3;

export interface ExerciseSet {
  weight: number | null;
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: ExerciseSet[];
}

export interface StrengthSession {
  date: string;
  protocol: string;
  workoutDay: WorkoutDay;
  exercises: ExerciseLog[];
  completedAt: string;
}
