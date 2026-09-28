export type MuscleId =
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearm'
  | 'abdomen'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'trapezius'
  | 'back';

export type SetKind = 'normal' | 'warmup' | 'drop' | 'failure' | 'restPause';

export interface Exercise {
  id: string;
  name: string;
  primary: string;
  secondary: string[];
  equipment: string;
  difficulty: string;
  art: string;
  steps: string[];
  mode?: string;
}

export interface LoggedSet {
  reps: number;
  weight: number;
  kind: SetKind;
  rpe?: number;
  sec?: number;
  km?: number;
}

export interface LoggedExercise {
  id: string;
  name: string;
  primary: string;
  sets: LoggedSet[];
}

export interface LoggedSession {
  id: string;
  date: string; // ISO date string
  durationSec: number;
  exercises: LoggedExercise[];
  routineId?: string;
  routineName?: string;
  volume: number;
  setCount: number;
}

export interface PlannedSet {
  reps?: number;
  weightKg?: number;
  kind?: SetKind;
  sec?: number;
  km?: number;
}

export interface RoutineDay {
  name: string;
  exercises: { name: string; sets: number }[];
  weekday?: number;
}

export interface Routine {
  id: string;
  name: string;
  group?: string;
  color?: string;
  days?: RoutineDay[];
  exerciseIds: string[];
  sets: Record<string, number>;
  plan?: Record<string, PlannedSet[]>;
}

export interface Award {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  unit?: string;
}

export interface BodyMeasure {
  id: string;
  date: string;
  key: string;
  value: number;
}

export interface TrainingNote {
  id: string;
  date: string;
  title: string;
  body: string;
  tag: 'workout' | 'nutrition' | 'recovery' | 'injury' | 'general';
}

export interface GymPlace {
  id: string;
  name: string;
  description: string;
  equipment: string[];
}

export interface UserProfile {
  name: string;
  handle: string;
  sex: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  activity: number;
  weeklyGoal: number;
  unit: 'kg' | 'lb';
  createdAt: string;
}

export interface LiveSet {
  id: string;
  reps: number;
  weight: number;
  done: boolean;
  kind: SetKind;
  rpe?: number;
  sec?: number;
}

export interface LiveExercise {
  id: string;
  exercise: Exercise;
  sets: LiveSet[];
}

export interface ActiveSession {
  startedAt: string;
  exercises: LiveExercise[];
  currentExerciseIndex: number;
  routineId?: string;
  routineName?: string;
  restTimerSeconds: number | null;
  restTimerTotal: number | null;
}
