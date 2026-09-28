import React, { useState, useEffect } from 'react';
import exercisesData from './data/exercises.json';
import {
  ActiveSession,
  Exercise,
  LiveExercise,
  LoggedSession,
  Routine,
  UserProfile,
  BodyMeasure,
  TrainingNote,
  GymPlace,
} from './types';
import {
  loadSessions,
  saveSessions,
  addSession,
  loadRoutines,
  saveRoutines,
  loadProfile,
  saveProfile,
  loadActiveSession,
  saveActiveSession,
  loadMeasures,
  addMeasure,
  loadAwardsUnlocked,
  saveAwardsUnlocked,
  loadNotes,
  addNote,
  deleteNote,
  loadPlaces,
  savePlaces,
} from './utils/storage';
import { computeAwards } from './data/awardsData';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LiveSessionModal } from './components/LiveSessionModal';
import { RestTimerFloating } from './components/RestTimerFloating';
import { HomeScreen } from './screens/HomeScreen';
import { TrainScreen } from './screens/TrainScreen';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ToolsScreen } from './screens/ToolsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NotesScreen } from './screens/NotesScreen';
import { PlacesScreen } from './screens/PlacesScreen';
import confetti from 'canvas-confetti';

const allExercises: Exercise[] = exercisesData as Exercise[];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType | 'tools' | 'notes' | 'places'>('home');
  const [sessions, setSessions] = useState<LoggedSession[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [measures, setMeasures] = useState<BodyMeasure[]>([]);
  const [notes, setNotes] = useState<TrainingNote[]>([]);
  const [places, setPlaces] = useState<GymPlace[]>([]);
  const [activePlaceId, setActivePlaceId] = useState('commercial');
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [storedAwards, setStoredAwards] = useState<Record<string, string>>({});

  // Initial load
  useEffect(() => {
    const loadedSessions = loadSessions();
    const loadedRoutines = loadRoutines();
    const loadedMeasures = loadMeasures();
    const loadedProfile = loadProfile();
    const loadedActive = loadActiveSession();
    const loadedUnlockedAwards = loadAwardsUnlocked();
    const loadedNotes = loadNotes();
    const loadedPlaces = loadPlaces();

    setSessions(loadedSessions);
    setRoutines(loadedRoutines);
    setMeasures(loadedMeasures);
    setProfile(loadedProfile);
    setStoredAwards(loadedUnlockedAwards);
    setNotes(loadedNotes);
    setPlaces(loadedPlaces);

    if (loadedActive) {
      setActiveSession(loadedActive);
    }
  }, []);

  // Compute awards
  const awards = computeAwards(
    sessions,
    routines.length,
    sessions.length > 0 ? Math.min(sessions.length, 7) : 0,
    storedAwards
  );

  // Check for newly unlocked awards
  useEffect(() => {
    let newlyUnlocked = false;
    const nextUnlocked = { ...storedAwards };

    awards.forEach((award) => {
      if (award.isUnlocked && !nextUnlocked[award.id]) {
        nextUnlocked[award.id] = new Date().toISOString();
        newlyUnlocked = true;
      }
    });

    if (newlyUnlocked) {
      setStoredAwards(nextUnlocked);
      saveAwardsUnlocked(nextUnlocked);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9A184', '#B98F72', '#E5B59C', '#8FA377'],
        });
      } catch {}
    }
  }, [sessions, routines]);

  // Sync active session to storage
  const handleUpdateActiveSession = (session: ActiveSession | null) => {
    setActiveSession(session);
    saveActiveSession(session);
  };

  // Start Quick Workout
  const handleQuickStart = () => {
    const defaultEx = allExercises.find((e) => e.name === 'Barbell Bench Press') || allExercises[0];
    const newSession: ActiveSession = {
      startedAt: new Date().toISOString(),
      currentExerciseIndex: 0,
      routineName: 'Quick Workout',
      restTimerSeconds: null,
      restTimerTotal: 90,
      exercises: [
        {
          id: '1',
          exercise: defaultEx,
          sets: [
            { id: 's1', reps: 10, weight: 40, done: false, kind: 'normal' },
            { id: 's2', reps: 10, weight: 40, done: false, kind: 'normal' },
            { id: 's3', reps: 10, weight: 40, done: false, kind: 'normal' },
          ],
        },
      ],
    };

    handleUpdateActiveSession(newSession);
    setIsSessionModalOpen(true);
  };

  // Start a Program / Routine
  const handleStartRoutine = (routine: Routine) => {
    const exercisesToLoad: Exercise[] = [];

    if (routine.days && routine.days.length > 0) {
      const firstDay = routine.days[0];
      firstDay.exercises.forEach((item) => {
        const found = allExercises.find(
          (e) => e.name.toLowerCase() === item.name.toLowerCase()
        );
        if (found) {
          exercisesToLoad.push(found);
        }
      });
    } else if (routine.exerciseIds && routine.exerciseIds.length > 0) {
      routine.exerciseIds.forEach((id) => {
        const found = allExercises.find((e) => e.id === id);
        if (found) exercisesToLoad.push(found);
      });
    }

    if (exercisesToLoad.length === 0) {
      // Fallback
      exercisesToLoad.push(
        allExercises.find((e) => e.name === 'Barbell Squat') || allExercises[0]
      );
    }

    const liveExercises: LiveExercise[] = exercisesToLoad.map((ex, idx) => ({
      id: `${idx}-${ex.id}`,
      exercise: ex,
      sets: [
        { id: 's1', reps: 10, weight: 40, done: false, kind: 'normal' },
        { id: 's2', reps: 10, weight: 40, done: false, kind: 'normal' },
        { id: 's3', reps: 10, weight: 40, done: false, kind: 'normal' },
      ],
    }));

    const newSession: ActiveSession = {
      startedAt: new Date().toISOString(),
      currentExerciseIndex: 0,
      routineId: routine.id,
      routineName: routine.name,
      restTimerSeconds: null,
      restTimerTotal: 90,
      exercises: liveExercises,
    };

    handleUpdateActiveSession(newSession);
    setIsSessionModalOpen(true);
  };

  // Start workout from selected exercises (Body Map)
  const handleStartCustomWorkout = (selectedExercises: Exercise[]) => {
    const chosen = selectedExercises.length > 0 ? selectedExercises : [allExercises[0]];
    const liveExercises: LiveExercise[] = chosen.map((ex, idx) => ({
      id: `${idx}-${ex.id}`,
      exercise: ex,
      sets: [
        { id: 's1', reps: 10, weight: 40, done: false, kind: 'normal' },
        { id: 's2', reps: 10, weight: 40, done: false, kind: 'normal' },
        { id: 's3', reps: 10, weight: 40, done: false, kind: 'normal' },
      ],
    }));

    const newSession: ActiveSession = {
      startedAt: new Date().toISOString(),
      currentExerciseIndex: 0,
      routineName: 'Custom Session',
      restTimerSeconds: null,
      restTimerTotal: 90,
      exercises: liveExercises,
    };

    handleUpdateActiveSession(newSession);
    setIsSessionModalOpen(true);
  };

  // Start single exercise from library
  const handleStartSingleExerciseWorkout = (exercise: Exercise) => {
    if (activeSession) {
      // Add to ongoing session
      const newLiveEx: LiveExercise = {
        id: Math.random().toString(36).substring(7),
        exercise,
        sets: [
          { id: 's1', reps: 10, weight: 30, done: false, kind: 'normal' },
          { id: 's2', reps: 10, weight: 30, done: false, kind: 'normal' },
          { id: 's3', reps: 10, weight: 30, done: false, kind: 'normal' },
        ],
      };
      const updated = {
        ...activeSession,
        exercises: [...activeSession.exercises, newLiveEx],
        currentExerciseIndex: activeSession.exercises.length,
      };
      handleUpdateActiveSession(updated);
      setIsSessionModalOpen(true);
    } else {
      handleStartCustomWorkout([exercise]);
    }
  };

  // Finish session
  const handleFinishSession = (completed: LoggedSession) => {
    const updated = addSession(completed);
    setSessions(updated);
    handleUpdateActiveSession(null);
    setIsSessionModalOpen(false);
    setCurrentTab('progress');

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D9A184', '#8FA377', '#E5B59C'],
      });
    } catch {}
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleAddMeasure = (measure: BodyMeasure) => {
    const updated = addMeasure(measure);
    setMeasures(updated);
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F3EFEA] flex flex-col font-sans selection:bg-[#D9A184] selection:text-[#12100E]">
      <Header onOpenTools={() => setCurrentTab('tools')} />

      {/* Main Screen Router */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-4">
        {currentTab === 'home' && (
          <HomeScreen
            profile={profile}
            sessions={sessions}
            routines={routines}
            onStartRoutine={handleStartRoutine}
            onQuickStart={handleQuickStart}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenTools={() => setCurrentTab('tools')}
          />
        )}

        {currentTab === 'train' && (
          <TrainScreen
            allExercises={allExercises}
            routines={routines}
            onStartRoutine={handleStartRoutine}
            onStartCustomWorkout={handleStartCustomWorkout}
            onSelectExercise={(ex) => handleStartSingleExerciseWorkout(ex)}
          />
        )}

        {currentTab === 'exercises' && (
          <ExercisesScreen
            allExercises={allExercises}
            onStartSingleExerciseWorkout={handleStartSingleExerciseWorkout}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressScreen
            sessions={sessions}
            measures={measures}
            onAddMeasure={handleAddMeasure}
            profile={profile}
          />
        )}

        {currentTab === 'tools' && (
          <ToolsScreen
            profile={profile}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'notes' && (
          <NotesScreen
            notes={notes}
            onAddNote={(n) => {
              const updated = addNote(n);
              setNotes(updated);
            }}
            onDeleteNote={(id) => {
              const updated = deleteNote(id);
              setNotes(updated);
            }}
            onBack={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'places' && (
          <PlacesScreen
            places={places}
            activePlaceId={activePlaceId}
            onSelectPlace={(id) => setActivePlaceId(id)}
            onBack={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            sessions={sessions}
            awards={awards}
            onOpenTools={() => setCurrentTab('tools')}
            onOpenNotes={() => setCurrentTab('notes')}
            onOpenPlaces={() => setCurrentTab('places')}
          />
        )}
      </main>

      {/* Floating Rest/Workout pill if minimized */}
      {activeSession && !isSessionModalOpen && (
        <RestTimerFloating
          session={activeSession}
          onResume={() => setIsSessionModalOpen(true)}
        />
      )}

      {/* Full Live Workout Modal */}
      {activeSession && isSessionModalOpen && (
        <LiveSessionModal
          session={activeSession}
          onUpdateSession={handleUpdateActiveSession}
          onFinishSession={handleFinishSession}
          allExercises={allExercises}
          unit={profile.unit}
          onMinimize={() => setIsSessionModalOpen(false)}
        />
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Bottom Navigation */}
      <Navbar
        currentTab={
          currentTab === 'tools' || currentTab === 'notes' || currentTab === 'places'
            ? 'profile'
            : currentTab
        }
        onSelectTab={(tab) => setCurrentTab(tab)}
        hasActiveSession={Boolean(activeSession)}
      />
    </div>
  );
}
