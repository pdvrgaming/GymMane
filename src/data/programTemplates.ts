import { Routine } from '../types';

export const kDefaultRoutines: Routine[] = [
  {
    id: 'fullbody',
    name: 'Full Body',
    group: 'Beginner',
    color: '#D9A184',
    exerciseIds: ['EIeI8Vf', 'squat', 'deadlift', 'overhead-press', 'plank'],
    sets: {
      'Barbell Squat': 3,
      'Barbell Bench Press': 3,
      'Barbell Row': 3,
      'Overhead Press': 3,
      'Romanian Deadlift': 3,
      'Plank': 3,
    },
    days: [
      {
        name: 'Full Body A',
        weekday: 1,
        exercises: [
          { name: 'Barbell Squat', sets: 3 },
          { name: 'Barbell Bench Press', sets: 3 },
          { name: 'Barbell Row', sets: 3 },
          { name: 'Overhead Press', sets: 3 },
          { name: 'Romanian Deadlift', sets: 3 },
          { name: 'Plank', sets: 3 },
        ],
      },
      {
        name: 'Full Body B',
        weekday: 3,
        exercises: [
          { name: 'Barbell Squat', sets: 3 },
          { name: 'Barbell Bench Press', sets: 3 },
          { name: 'Barbell Row', sets: 3 },
          { name: 'Overhead Press', sets: 3 },
          { name: 'Romanian Deadlift', sets: 3 },
          { name: 'Plank', sets: 3 },
        ],
      },
      {
        name: 'Full Body C',
        weekday: 5,
        exercises: [
          { name: 'Barbell Squat', sets: 3 },
          { name: 'Barbell Bench Press', sets: 3 },
          { name: 'Barbell Row', sets: 3 },
          { name: 'Overhead Press', sets: 3 },
          { name: 'Romanian Deadlift', sets: 3 },
          { name: 'Plank', sets: 3 },
        ],
      },
    ],
  },
  {
    id: 'ppl',
    name: 'Push Pull Legs',
    group: 'Hypertrophy',
    color: '#8FA377',
    exerciseIds: [],
    sets: {},
    days: [
      {
        name: 'Push',
        weekday: 1,
        exercises: [
          { name: 'Barbell Bench Press', sets: 4 },
          { name: 'Incline Dumbbell Bench Press', sets: 3 },
          { name: 'Overhead Press', sets: 3 },
          { name: 'Dumbbell Lateral Raise', sets: 3 },
          { name: 'Triceps Pushdown', sets: 3 },
        ],
      },
      {
        name: 'Pull',
        weekday: 3,
        exercises: [
          { name: 'Pull-up', sets: 4 },
          { name: 'Barbell Row', sets: 4 },
          { name: 'Lat Pulldown', sets: 3 },
          { name: 'Face Pull', sets: 3 },
          { name: 'Barbell Curl', sets: 3 },
        ],
      },
      {
        name: 'Legs',
        weekday: 5,
        exercises: [
          { name: 'Barbell Squat', sets: 4 },
          { name: 'Romanian Deadlift', sets: 3 },
          { name: 'Leg Press', sets: 3 },
          { name: 'Lying Leg Curl', sets: 3 },
          { name: 'Standing Calf Raise', sets: 4 },
        ],
      },
    ],
  },
  {
    id: 'upperlower',
    name: 'Upper Lower',
    group: 'Strength',
    color: '#7FA8C9',
    exerciseIds: [],
    sets: {},
    days: [
      {
        name: 'Upper A',
        weekday: 1,
        exercises: [
          { name: 'Barbell Bench Press', sets: 4 },
          { name: 'Barbell Row', sets: 4 },
          { name: 'Overhead Press', sets: 3 },
          { name: 'Lat Pulldown', sets: 3 },
          { name: 'Barbell Curl', sets: 3 },
          { name: 'Triceps Pushdown', sets: 3 },
        ],
      },
      {
        name: 'Lower A',
        weekday: 2,
        exercises: [
          { name: 'Barbell Squat', sets: 4 },
          { name: 'Romanian Deadlift', sets: 3 },
          { name: 'Leg Press', sets: 3 },
          { name: 'Lying Leg Curl', sets: 3 },
          { name: 'Standing Calf Raise', sets: 4 },
        ],
      },
      {
        name: 'Upper B',
        weekday: 4,
        exercises: [
          { name: 'Incline Dumbbell Bench Press', sets: 4 },
          { name: 'Pull-up', sets: 4 },
          { name: 'Dumbbell Shoulder Press', sets: 3 },
          { name: 'Seated Cable Row', sets: 3 },
          { name: 'Hammer Curl', sets: 3 },
          { name: 'Dips', sets: 3 },
        ],
      },
      {
        name: 'Lower B',
        weekday: 5,
        exercises: [
          { name: 'Deadlift', sets: 3 },
          { name: 'Front Squat', sets: 3 },
          { name: 'Leg Extension', sets: 3 },
          { name: 'Lying Leg Curl', sets: 3 },
          { name: 'Standing Calf Raise', sets: 4 },
        ],
      },
    ],
  },
  {
    id: 'stronglifts',
    name: 'StrongLifts 5×5',
    group: 'Strength',
    color: '#E0B15A',
    exerciseIds: [],
    sets: {},
    days: [
      {
        name: 'Workout A',
        weekday: 1,
        exercises: [
          { name: 'Barbell Squat', sets: 5 },
          { name: 'Barbell Bench Press', sets: 5 },
          { name: 'Barbell Row', sets: 5 },
        ],
      },
      {
        name: 'Workout B',
        weekday: 3,
        exercises: [
          { name: 'Barbell Squat', sets: 5 },
          { name: 'Overhead Press', sets: 5 },
          { name: 'Deadlift', sets: 1 },
        ],
      },
    ],
  },
  {
    id: 'home',
    name: 'Home / No Kit',
    group: 'Bodyweight',
    color: '#B98F72',
    exerciseIds: [],
    sets: {},
    days: [
      {
        name: 'Home A',
        weekday: 2,
        exercises: [
          { name: 'Push-up', sets: 3 },
          { name: 'Pull-up', sets: 3 },
          { name: 'Bodyweight Squat', sets: 3 },
          { name: 'Plank', sets: 3 },
        ],
      },
      {
        name: 'Home B',
        weekday: 5,
        exercises: [
          { name: 'Dips', sets: 3 },
          { name: 'Chin-up', sets: 3 },
          { name: 'Walking Lunge', sets: 3 },
          { name: 'Hanging Leg Raise', sets: 3 },
        ],
      },
    ],
  },
];
