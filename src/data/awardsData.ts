import { Award, LoggedSession } from '../types';

export interface AwardDef {
  id: string;
  name: string;
  line: string;
  maxProgress: number;
  unit: string;
}

export const kAwardsList: AwardDef[] = [
  { id: 'firstStep', name: 'First step', line: 'Welcome to GymMane. This one is on the house.', maxProgress: 1, unit: 'launch' },
  { id: 'firstWorkout', name: 'First workout', line: 'The first one is logged. That is the hard one.', maxProgress: 1, unit: 'workout' },
  { id: 'firstRoutine', name: 'First routine', line: 'You have a plan to come back to.', maxProgress: 1, unit: 'routine' },
  { id: 'firstRecord', name: 'First record', line: 'You beat your best lift on an exercise.', maxProgress: 1, unit: 'record' },
  { id: 'streak3', name: 'Three in a row', line: 'Three days straight. This is how it starts.', maxProgress: 3, unit: 'days' },
  { id: 'streak7', name: 'Full week', line: 'Seven days in a row.', maxProgress: 7, unit: 'days' },
  { id: 'workouts10', name: 'Double digits', line: 'Ten workouts completed.', maxProgress: 10, unit: 'workouts' },
  { id: 'tonne1', name: 'First tonne', line: '1,000 kg total volume moved.', maxProgress: 1000, unit: 'kg' },
  { id: 'sets100', name: 'Centurion', line: '100 sets logged.', maxProgress: 100, unit: 'sets' },
  { id: 'hours10', name: 'Ten hours', line: '10 hours under the bar.', maxProgress: 10, unit: 'hours' },
  { id: 'workouts50', name: 'Fifty club', line: '50 workouts logged.', maxProgress: 50, unit: 'workouts' },
  { id: 'tonnes10', name: 'Ten tonnes', line: '10,000 kg lifted.', maxProgress: 10000, unit: 'kg' },
  { id: 'hours50', name: 'Fifty hours', line: '50 hours trained.', maxProgress: 50, unit: 'hours' },
  { id: 'streak30', name: 'Monthly streak', line: '30 days active streak.', maxProgress: 30, unit: 'days' },
  { id: 'sets1000', name: 'Thousand sets', line: '1,000 sets logged.', maxProgress: 1000, unit: 'sets' },
  { id: 'workouts100', name: 'Century of workouts', line: '100 workouts logged.', maxProgress: 100, unit: 'workouts' },
  { id: 'hours100', name: 'Hundred hours', line: '100 hours logged.', maxProgress: 100, unit: 'hours' },
  { id: 'streak100', name: 'Unbreakable', line: '100 days streak.', maxProgress: 100, unit: 'days' },
  { id: 'tonnes100', name: 'Heavy metal', line: '100 tonnes total volume.', maxProgress: 100000, unit: 'kg' },
  { id: 'workouts365', name: 'Iron year', line: '365 workouts logged.', maxProgress: 365, unit: 'workouts' },
];

export function computeAwards(
  sessions: LoggedSession[],
  routineCount: number,
  streakDays: number,
  storedUnlocked: Record<string, string> = {}
): Award[] {
  const workoutCount = sessions.length;
  const totalVolume = sessions.reduce((acc, s) => acc + (s.volume || 0), 0);
  const totalSets = sessions.reduce((acc, s) => acc + (s.setCount || 0), 0);
  const totalHours = Math.floor(sessions.reduce((acc, s) => acc + (s.durationSec || 0), 0) / 3600);
  const prCount = sessions.length > 0 ? 1 : 0;

  return kAwardsList.map((def) => {
    let progress = 0;
    switch (def.id) {
      case 'firstStep':
        progress = 1;
        break;
      case 'firstWorkout':
        progress = Math.min(1, workoutCount);
        break;
      case 'firstRoutine':
        progress = Math.min(1, routineCount);
        break;
      case 'firstRecord':
        progress = Math.min(1, prCount);
        break;
      case 'streak3':
      case 'streak7':
      case 'streak30':
      case 'streak100':
        progress = Math.min(def.maxProgress, streakDays);
        break;
      case 'workouts10':
      case 'workouts50':
      case 'workouts100':
      case 'workouts365':
        progress = Math.min(def.maxProgress, workoutCount);
        break;
      case 'tonne1':
      case 'tonnes10':
      case 'tonnes100':
        progress = Math.min(def.maxProgress, Math.round(totalVolume));
        break;
      case 'sets100':
      case 'sets1000':
        progress = Math.min(def.maxProgress, totalSets);
        break;
      case 'hours10':
      case 'hours50':
      case 'hours100':
        progress = Math.min(def.maxProgress, totalHours);
        break;
      default:
        progress = 0;
    }

    const isUnlocked = progress >= def.maxProgress || Boolean(storedUnlocked[def.id]);
    const icon = isUnlocked
      ? `./badges/${def.id}.webp`
      : `./badges/${def.id}_off.webp`;

    return {
      id: def.id,
      name: def.name,
      description: def.line,
      icon,
      isUnlocked,
      unlockedAt: storedUnlocked[def.id] || (isUnlocked ? new Date().toISOString() : undefined),
      progress,
      maxProgress: def.maxProgress,
      unit: def.unit,
    };
  });
}
