import {
  LoggedSession,
  Routine,
  UserProfile,
  ActiveSession,
  BodyMeasure,
  TrainingNote,
  GymPlace,
} from '../types';
import { kDefaultRoutines } from '../data/programTemplates';

const KEYS = {
  SESSIONS: 'gymmane_sessions_v1',
  ROUTINES: 'gymmane_routines_v1',
  PROFILE: 'gymmane_profile_v1',
  AWARDS: 'gymmane_awards_v1',
  ACTIVE_SESSION: 'gymmane_active_session_v1',
  MEASURES: 'gymmane_measures_v1',
};

export const defaultProfile: UserProfile = {
  name: 'Gym Athlete',
  handle: 'athlete',
  sex: 'male',
  age: 26,
  heightCm: 178,
  weightKg: 75,
  activity: 1.55,
  weeklyGoal: 4,
  unit: 'kg',
  createdAt: new Date().toISOString(),
};

// --- Sessions ---
export function loadSessions(): LoggedSession[] {
  try {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load sessions', e);
    return [];
  }
}

export function saveSessions(sessions: LoggedSession[]): void {
  try {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions', e);
  }
}

export function addSession(session: LoggedSession): LoggedSession[] {
  const all = [session, ...loadSessions()];
  saveSessions(all);
  return all;
}

// --- Routines ---
export function loadRoutines(): Routine[] {
  try {
    const raw = localStorage.getItem(KEYS.ROUTINES);
    if (!raw) {
      saveRoutines(kDefaultRoutines);
      return kDefaultRoutines;
    }
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : kDefaultRoutines;
  } catch (e) {
    console.error('Failed to load routines', e);
    return kDefaultRoutines;
  }
}

export function saveRoutines(routines: Routine[]): void {
  try {
    localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  } catch (e) {
    console.error('Failed to save routines', e);
  }
}

export function saveRoutine(routine: Routine): Routine[] {
  const existing = loadRoutines();
  const index = existing.findIndex((r) => r.id === routine.id);
  let updated: Routine[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = routine;
  } else {
    updated = [routine, ...existing];
  }
  saveRoutines(updated);
  return updated;
}

export function deleteRoutine(id: string): Routine[] {
  const existing = loadRoutines();
  const updated = existing.filter((r) => r.id !== id);
  saveRoutines(updated);
  return updated;
}

// --- Profile ---
export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load profile', e);
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

// --- Awards ---
export function loadAwardsUnlocked(): Record<string, string> {
  try {
    const raw = localStorage.getItem(KEYS.AWARDS);
    if (!raw) return { firstStep: new Date().toISOString() };
    return JSON.parse(raw);
  } catch (e) {
    return { firstStep: new Date().toISOString() };
  }
}

export function saveAwardsUnlocked(unlocked: Record<string, string>): void {
  try {
    localStorage.setItem(KEYS.AWARDS, JSON.stringify(unlocked));
  } catch (e) {
    console.error('Failed to save awards', e);
  }
}

// --- Active Session ---
export function loadActiveSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveActiveSession(session: ActiveSession | null): void {
  try {
    if (session) {
      localStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(KEYS.ACTIVE_SESSION);
    }
  } catch (e) {
    console.error('Failed to save active session', e);
  }
}

// --- Measures ---
export function loadMeasures(): BodyMeasure[] {
  try {
    const raw = localStorage.getItem(KEYS.MEASURES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveMeasures(measures: BodyMeasure[]): void {
  try {
    localStorage.setItem(KEYS.MEASURES, JSON.stringify(measures));
  } catch (e) {
    console.error('Failed to save measures', e);
  }
}

export function addMeasure(measure: BodyMeasure): BodyMeasure[] {
  const all = [measure, ...loadMeasures()];
  saveMeasures(all);
  return all;
}

// --- Notes / Journal ---
export function loadNotes(): TrainingNote[] {
  try {
    const raw = localStorage.getItem('gymmane_notes_v1');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveNotes(notes: TrainingNote[]): void {
  try {
    localStorage.setItem('gymmane_notes_v1', JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes', e);
  }
}

export function addNote(note: TrainingNote): TrainingNote[] {
  const all = [note, ...loadNotes()];
  saveNotes(all);
  return all;
}

export function deleteNote(id: string): TrainingNote[] {
  const all = loadNotes().filter((n) => n.id !== id);
  saveNotes(all);
  return all;
}

// --- Places / Kits ---
export const defaultPlaces: GymPlace[] = [
  {
    id: 'commercial',
    name: 'Commercial Gym',
    description: 'Full equipment access (Barbells, Dumbbells, Cables, Machines)',
    equipment: ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Weighted', 'Band', 'Kettlebell', 'Rings'],
  },
  {
    id: 'home',
    name: 'Home Gym',
    description: 'Barbell, Dumbbells, Bench & Rack',
    equipment: ['Barbell', 'Dumbbell', 'Bodyweight', 'Band'],
  },
  {
    id: 'calisthenics',
    name: 'Bodyweight / Park',
    description: 'Pull-up bar, dip bars, rings & bodyweight',
    equipment: ['Bodyweight', 'Weighted', 'Rings', 'Band'],
  },
];

export function loadPlaces(): GymPlace[] {
  try {
    const raw = localStorage.getItem('gymmane_places_v1');
    if (!raw) {
      savePlaces(defaultPlaces);
      return defaultPlaces;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultPlaces;
  }
}

export function savePlaces(places: GymPlace[]): void {
  try {
    localStorage.setItem('gymmane_places_v1', JSON.stringify(places));
  } catch (e) {
    console.error('Failed to save places', e);
  }
}

// --- Backup & Restore ---
export function exportBackupJSON(): string {
  const data = {
    gymmane_version: '2.0-pwa',
    exported_at: new Date().toISOString(),
    sessions: loadSessions(),
    routines: loadRoutines(),
    profile: loadProfile(),
    measures: loadMeasures(),
    awards: loadAwardsUnlocked(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.sessions) saveSessions(data.sessions);
    if (data.routines) saveRoutines(data.routines);
    if (data.profile) saveProfile(data.profile);
    if (data.measures) saveMeasures(data.measures);
    if (data.awards) saveAwardsUnlocked(data.awards);
    return true;
  } catch (e) {
    console.error('Invalid backup file', e);
    return false;
  }
}

// --- CSV Export for Workouts ---
export function exportWorkoutsCSV(sessions: LoggedSession[]): string {
  const headers = ['Date', 'Duration (min)', 'Exercise', 'Primary Muscle', 'Set Index', 'Kind', 'Weight', 'Reps', 'RPE'];
  const rows: string[] = [headers.join(',')];

  sessions.forEach((s) => {
    const date = new Date(s.date).toLocaleDateString();
    const duration = Math.round(s.durationSec / 60);

    s.exercises.forEach((ex) => {
      ex.sets.forEach((set, setIdx) => {
        rows.push(
          [
            `"${date}"`,
            duration,
            `"${ex.name.replace(/"/g, '""')}"`,
            `"${ex.primary}"`,
            setIdx + 1,
            `"${set.kind}"`,
            set.weight,
            set.reps,
            set.rpe ?? '',
          ].join(',')
        );
      });
    });
  });

  return rows.join('\n');
}
