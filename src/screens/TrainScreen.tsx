import React, { useState } from 'react';
import { BodyMap } from '../components/BodyMap';
import { Exercise, Routine } from '../types';
import { Play, Plus, Dumbbell, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface TrainScreenProps {
  allExercises: Exercise[];
  routines: Routine[];
  onStartRoutine: (routine: Routine) => void;
  onStartCustomWorkout: (exercises: Exercise[]) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const TrainScreen: React.FC<TrainScreenProps> = ({
  allExercises,
  routines,
  onStartRoutine,
  onStartCustomWorkout,
  onSelectExercise,
}) => {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  const handleToggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const handleClearMuscles = () => {
    setSelectedMuscles([]);
    setSelectedExerciseIds([]);
  };

  // Filter exercises matching selected muscles
  const filteredExercises =
    selectedMuscles.length === 0
      ? []
      : allExercises.filter(
          (ex) =>
            selectedMuscles.includes(ex.primary.toLowerCase()) ||
            ex.secondary.some((s) => selectedMuscles.includes(s.toLowerCase()))
        );

  const toggleExerciseSelection = (exId: string) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(exId) ? prev.filter((id) => id !== exId) : [...prev, exId]
    );
  };

  const handleStartWithSelected = () => {
    const chosen =
      selectedExerciseIds.length > 0
        ? allExercises.filter((e) => selectedExerciseIds.includes(e.id))
        : filteredExercises.slice(0, 4);

    onStartCustomWorkout(chosen);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
          Workout Builder
        </span>
        <h2 className="text-2xl font-black text-white">Body Map & Training</h2>
        <p className="text-xs text-[#A39B92] mt-0.5">
          Tap what you want to train on the body map below.
        </p>
      </div>

      {/* Interactive Body Map */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl">
        <BodyMap
          selectedMuscles={selectedMuscles}
          onToggleMuscle={handleToggleMuscle}
          onClearMuscles={handleClearMuscles}
        />

        {selectedMuscles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#26201B] flex items-center justify-between">
            <span className="text-xs text-[#A39B92]">
              <strong className="text-white">{filteredExercises.length}</strong> matching exercises
            </span>

            <button
              onClick={handleStartWithSelected}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D9A184] text-[#12100E] font-black text-xs hover:bg-[#E5B59C] transition active:scale-95 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                Start Workout ({selectedExerciseIds.length || Math.min(4, filteredExercises.length)})
              </span>
            </button>
          </div>
        )}
      </div>

      {/* If Muscles are selected: Show filtered exercises */}
      {selectedMuscles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">
              Target Exercises ({filteredExercises.length})
            </h3>
            <span className="text-[11px] text-[#A39B92]">Tap to pick for workout</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredExercises.slice(0, 30).map((ex) => {
              const isSelected = selectedExerciseIds.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  onClick={() => toggleExerciseSelection(ex.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#29221C] border-[#D9A184]'
                      : 'bg-[#181512] border-[#2B231D] hover:border-[#382E26]'
                  }`}
                >
                  <div className="flex-1 mr-2">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{ex.name}</h4>
                    <span className="text-[10px] text-[#A39B92] capitalize">
                      {ex.primary} • {ex.equipment}
                    </span>
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectExercise(ex);
                    }}
                    className="text-[10px] px-2 py-1 rounded-lg bg-[#221D18] text-[#A39B92] hover:text-[#D9A184] hover:bg-[#2C251F]"
                  >
                    View
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Routine Templates / Programs */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-white">Program Routines</h3>

        <div className="space-y-2.5">
          {routines.map((routine) => {
            return (
              <div
                key={routine.id}
                className="p-4 rounded-2xl bg-[#181512] border border-[#2B231D] flex items-center justify-between hover:border-[#3D332A] transition"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#D9A184]">
                    {routine.group || 'Program'}
                  </span>
                  <h4 className="text-base font-bold text-white">{routine.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#706860] mt-0.5">
                    <span>
                      {routine.days ? `${routine.days.length} days split` : 'Full workout'}
                    </span>
                    {routine.days && (
                      <span>
                        • {routine.days.map((d) => d.name.split('·')[0].trim()).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onStartRoutine(routine)}
                  className="px-4 py-2 rounded-xl bg-[#241F1A] border border-[#3A2F25] text-xs font-bold text-[#D9A184] hover:bg-[#D9A184] hover:text-[#12100E] transition flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
