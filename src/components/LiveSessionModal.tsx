import React, { useState, useEffect } from 'react';
import {
  ActiveSession,
  Exercise,
  LiveExercise,
  LiveSet,
  LoggedSession,
  SetKind,
} from '../types';
import { playRestChime } from '../utils/audio';
import { calculatePlates } from '../utils/calculators';
import { ExerciseArt } from './ExerciseArt';
import {
  Play,
  Pause,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  Minimize2,
  Clock,
  Dumbbell,
  Calculator,
  ArrowRight,
  Flame,
  Award,
  X,
} from 'lucide-react';

interface LiveSessionModalProps {
  session: ActiveSession;
  onUpdateSession: (session: ActiveSession | null) => void;
  onFinishSession: (session: LoggedSession) => void;
  allExercises: Exercise[];
  unit: 'kg' | 'lb';
  onMinimize: () => void;
}

export const LiveSessionModal: React.FC<LiveSessionModalProps> = ({
  session,
  onUpdateSession,
  onFinishSession,
  allExercises,
  unit,
  onMinimize,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [restTimeLeft, setRestTimeLeft] = useState<number | null>(session.restTimerSeconds);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [searchExercise, setSearchExercise] = useState('');
  const [plateCalcWeight, setPlateCalcWeight] = useState<number | null>(null);

  // Elapsed workout timer
  useEffect(() => {
    const startTime = new Date(session.startedAt).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startedAt]);

  // Rest countdown timer
  useEffect(() => {
    if (restTimeLeft === null || restTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setRestTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          playRestChime();
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [restTimeLeft]);

  // Keep session synced with rest timer
  useEffect(() => {
    onUpdateSession({
      ...session,
      restTimerSeconds: restTimeLeft,
    });
  }, [restTimeLeft]);

  const currentExercise = session.exercises[session.currentExerciseIndex] || session.exercises[0];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleSetDone = (setIndex: number) => {
    if (!currentExercise) return;
    const updatedSets = currentExercise.sets.map((s, idx) => {
      if (idx === setIndex) {
        const nextDone = !s.done;
        if (nextDone) {
          // Trigger default 90s rest timer
          setRestTimeLeft(90);
          if (navigator.vibrate) navigator.vibrate(50);
        }
        return { ...s, done: nextDone };
      }
      return s;
    });

    const updatedExercises = session.exercises.map((ex, idx) =>
      idx === session.currentExerciseIndex ? { ...ex, sets: updatedSets } : ex
    );

    onUpdateSession({
      ...session,
      exercises: updatedExercises,
    });
  };

  const handleUpdateSetValue = (
    setIndex: number,
    field: 'reps' | 'weight' | 'kind',
    value: number | SetKind
  ) => {
    if (!currentExercise) return;
    const updatedSets = currentExercise.sets.map((s, idx) => {
      if (idx === setIndex) {
        return { ...s, [field]: value };
      }
      return s;
    });

    const updatedExercises = session.exercises.map((ex, idx) =>
      idx === session.currentExerciseIndex ? { ...ex, sets: updatedSets } : ex
    );

    onUpdateSession({
      ...session,
      exercises: updatedExercises,
    });
  };

  const handleAddSet = () => {
    if (!currentExercise) return;
    const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
    const newSet: LiveSet = {
      id: Math.random().toString(36).substring(7),
      reps: lastSet ? lastSet.reps : 10,
      weight: lastSet ? lastSet.weight : 40,
      done: false,
      kind: 'normal',
    };

    const updatedExercises = session.exercises.map((ex, idx) =>
      idx === session.currentExerciseIndex ? { ...ex, sets: [...ex.sets, newSet] } : ex
    );

    onUpdateSession({
      ...session,
      exercises: updatedExercises,
    });
  };

  const handleDeleteSet = (setIndex: number) => {
    if (!currentExercise || currentExercise.sets.length <= 1) return;
    const updatedSets = currentExercise.sets.filter((_, idx) => idx !== setIndex);
    const updatedExercises = session.exercises.map((ex, idx) =>
      idx === session.currentExerciseIndex ? { ...ex, sets: updatedSets } : ex
    );

    onUpdateSession({
      ...session,
      exercises: updatedExercises,
    });
  };

  const handleAddExerciseToSession = (ex: Exercise) => {
    const newLiveEx: LiveExercise = {
      id: Math.random().toString(36).substring(7),
      exercise: ex,
      sets: [
        { id: '1', reps: 10, weight: 30, done: false, kind: 'normal' },
        { id: '2', reps: 10, weight: 30, done: false, kind: 'normal' },
        { id: '3', reps: 10, weight: 30, done: false, kind: 'normal' },
      ],
    };

    const updatedExercises = [...session.exercises, newLiveEx];
    onUpdateSession({
      ...session,
      exercises: updatedExercises,
      currentExerciseIndex: updatedExercises.length - 1,
    });
    setShowAddExercise(false);
  };

  const handleFinishWorkout = () => {
    const totalVolume = session.exercises.reduce((acc, ex) => {
      return (
        acc +
        ex.sets.reduce((sAcc, s) => {
          return s.done && s.kind !== 'warmup' ? sAcc + s.reps * s.weight : sAcc;
        }, 0)
      );
    }, 0);

    const totalSets = session.exercises.reduce((acc, ex) => {
      return acc + ex.sets.filter((s) => s.done && s.kind !== 'warmup').length;
    }, 0);

    const logged: LoggedSession = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      durationSec: elapsed,
      routineId: session.routineId,
      routineName: session.routineName || 'Free Workout',
      volume: Math.round(totalVolume),
      setCount: totalSets,
      exercises: session.exercises.map((ex) => ({
        id: ex.exercise.id,
        name: ex.exercise.name,
        primary: ex.exercise.primary,
        sets: ex.sets
          .filter((s) => s.done)
          .map((s) => ({
            reps: s.reps,
            weight: s.weight,
            kind: s.kind,
            rpe: s.rpe,
          })),
      })),
    };

    onFinishSession(logged);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#12100E] text-[#F3EFEA] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#26201B] bg-[#161310] shrink-0">
        <button
          onClick={onMinimize}
          className="flex items-center gap-1 text-xs font-bold text-[#A39B92] hover:text-white px-2.5 py-1.5 rounded-lg bg-[#221D18]"
          title="Minimize Workout"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Minimize</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
            {session.routineName || 'Live Session'}
          </span>
          <div className="flex items-center gap-1.5 text-base font-extrabold text-[#D9A184]">
            <Clock className="w-4 h-4" />
            <span>{formatTime(elapsed)}</span>
          </div>
        </div>

        <button
          onClick={handleFinishWorkout}
          className="px-3.5 py-1.5 rounded-full bg-[#8FA377] text-[#12100E] font-bold text-xs hover:bg-[#A1B887] transition shadow-md active:scale-95"
        >
          Finish
        </button>
      </div>

      {/* Rest Timer Floating Banner if running */}
      {restTimeLeft !== null && restTimeLeft > 0 && (
        <div className="bg-[#241F1A] border-b border-[#3B322A] px-4 py-2 flex items-center justify-between shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A184] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D9A184]"></span>
            </span>
            <span className="text-xs font-semibold text-[#A39B92]">Rest countdown:</span>
            <span className="text-sm font-mono font-bold text-[#D9A184]">
              {formatTime(restTimeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRestTimeLeft((prev) => (prev ? prev + 30 : 30))}
              className="text-xs px-2 py-0.5 rounded bg-[#332A22] text-[#D9A184] hover:bg-[#44382E]"
            >
              +30s
            </button>
            <button
              onClick={() => setRestTimeLeft(null)}
              className="text-xs px-2 py-0.5 rounded bg-[#332A22] text-[#A39B92] hover:text-white"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl w-full mx-auto pb-24">
        {/* Exercise Switcher tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {session.exercises.map((ex, idx) => {
            const isCurrent = idx === session.currentExerciseIndex;
            const completedCount = ex.sets.filter((s) => s.done).length;
            return (
              <button
                key={ex.id}
                onClick={() => onUpdateSession({ ...session, currentExerciseIndex: idx })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  isCurrent
                    ? 'bg-[#28211B] text-[#D9A184] border-[#D9A184]'
                    : 'bg-[#181412] text-[#A39B92] border-[#26201B] hover:bg-[#201B17]'
                }`}
              >
                <span>{ex.exercise.name}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  {completedCount}/{ex.sets.length}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setShowAddExercise(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#A39B92] bg-[#181412] border border-dashed border-[#3D332A] hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Current Exercise Card */}
        {currentExercise && (
          <div className="bg-[#181512] border border-[#2D2621] rounded-3xl p-4 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold text-[#D9A184] uppercase tracking-wider">
                  Target: {currentExercise.exercise.primary}
                </span>
                <h2 className="text-xl font-black text-white">{currentExercise.exercise.name}</h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#251F1A] text-[#A39B92] border border-[#382E25]">
                {currentExercise.exercise.equipment}
              </span>
            </div>

            {/* Exercise Animated Art */}
            {currentExercise.exercise.art && (
              <div className="mb-4">
                <ExerciseArt artSlug={currentExercise.exercise.art} className="w-full h-36" />
              </div>
            )}

            {/* Sets Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[11px] font-bold text-[#A39B92] uppercase px-2">
                <span className="col-span-2">Set</span>
                <span className="col-span-4 text-center">Weight ({unit})</span>
                <span className="col-span-3 text-center">Reps</span>
                <span className="col-span-3 text-right">Done</span>
              </div>

              {currentExercise.sets.map((set, setIdx) => {
                return (
                  <div
                    key={set.id}
                    className={`grid grid-cols-12 items-center p-2 rounded-xl transition ${
                      set.done ? 'bg-[#1C2417] border border-[#2E3C25]' : 'bg-[#201B17] border border-[#2F2721]'
                    }`}
                  >
                    {/* Set Number & Kind */}
                    <div className="col-span-2 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#A39B92]">{setIdx + 1}</span>
                      <select
                        value={set.kind}
                        onChange={(e) =>
                          handleUpdateSetValue(setIdx, 'kind', e.target.value as SetKind)
                        }
                        className="bg-transparent text-[11px] font-bold text-[#D9A184] cursor-pointer focus:outline-none"
                      >
                        <option value="normal" className="bg-[#201B17]">Normal</option>
                        <option value="warmup" className="bg-[#201B17]">Warmup (W)</option>
                        <option value="drop" className="bg-[#201B17]">Drop (D)</option>
                        <option value="failure" className="bg-[#201B17]">Failure (F)</option>
                      </select>
                    </div>

                    {/* Weight Input & Plate Calculator Button */}
                    <div className="col-span-4 flex items-center justify-center gap-1">
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight || ''}
                        onChange={(e) =>
                          handleUpdateSetValue(setIdx, 'weight', parseFloat(e.target.value) || 0)
                        }
                        className="w-16 text-center text-sm font-bold bg-[#14110E] border border-[#332A22] rounded-lg py-1 text-white focus:border-[#D9A184] focus:outline-none"
                      />
                      <button
                        onClick={() => setPlateCalcWeight(set.weight)}
                        title="Calculate Plates"
                        className="p-1 text-[#A39B92] hover:text-[#D9A184]"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Reps Input */}
                    <div className="col-span-3 flex justify-center">
                      <input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) =>
                          handleUpdateSetValue(setIdx, 'reps', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-14 text-center text-sm font-bold bg-[#14110E] border border-[#332A22] rounded-lg py-1 text-white focus:border-[#D9A184] focus:outline-none"
                      />
                    </div>

                    {/* Done Checkbox & Delete Set */}
                    <div className="col-span-3 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleSetDone(setIdx)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition active:scale-90 ${
                          set.done
                            ? 'bg-[#8FA377] text-[#12100E] shadow-sm'
                            : 'bg-[#2E2620] text-[#A39B92] hover:bg-[#3D332B] hover:text-white'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        onClick={() => handleDeleteSet(setIdx)}
                        className="p-1 text-[#706860] hover:text-[#E05A5A]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Set Button */}
            <button
              onClick={handleAddSet}
              className="mt-3 w-full py-2.5 rounded-xl bg-[#241F1A] border border-dashed border-[#3D332A] text-xs font-bold text-[#D9A184] hover:bg-[#2C2520] transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Set</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md h-[80vh] flex flex-col rounded-3xl bg-[#1A1714] border border-[#3E342B] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B231D]">
              <h3 className="text-base font-bold text-white">Add Exercise to Workout</h3>
              <button
                onClick={() => setShowAddExercise(false)}
                className="p-1 rounded-full text-[#A39B92] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3">
              <input
                type="text"
                placeholder="Search exercise..."
                value={searchExercise}
                onChange={(e) => setSearchExercise(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#14110E] border border-[#332A22] rounded-xl text-sm text-white focus:outline-none focus:border-[#D9A184]"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {allExercises
                .filter((e) =>
                  e.name.toLowerCase().includes(searchExercise.toLowerCase()) ||
                  e.primary.toLowerCase().includes(searchExercise.toLowerCase())
                )
                .slice(0, 40)
                .map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleAddExerciseToSession(ex)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#201B17] border border-[#2D251F] hover:border-[#D9A184] text-left transition"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                      <span className="text-xs text-[#A39B92] capitalize">
                        {ex.primary} • {ex.equipment}
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-[#D9A184]" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Plate Calculator Helper Modal */}
      {plateCalcWeight !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#1A1714] border border-[#3E342B] p-5 shadow-2xl text-center">
            <h3 className="text-base font-bold text-white">Plate Breakdown</h3>
            <p className="text-xs text-[#A39B92] mt-0.5">
              Barbell ({unit === 'kg' ? '20 kg' : '45 lb'}) + Plates per side
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-[#14110E] border border-[#2B231D]">
              <span className="text-2xl font-black text-[#D9A184]">
                {plateCalcWeight} {unit}
              </span>
              <div className="mt-3 space-y-1.5 text-xs text-[#D5CEC5]">
                {calculatePlates(plateCalcWeight, unit === 'kg' ? 20 : 45).platesPerSide.length > 0 ? (
                  calculatePlates(plateCalcWeight, unit === 'kg' ? 20 : 45).platesPerSide.map(
                    (p, i) => (
                      <div key={i} className="flex justify-between py-1 border-b border-[#221B16]">
                        <span>
                          {p.weight} {unit} plate:
                        </span>
                        <span className="font-bold text-white">
                          {p.count} each side (×{p.count * 2})
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <span className="text-[#A39B92]">Just the empty barbell</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setPlateCalcWeight(null)}
              className="mt-4 w-full py-2 bg-[#28211B] rounded-xl text-xs font-bold text-white hover:bg-[#342C24]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
