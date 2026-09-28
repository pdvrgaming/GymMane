import React, { useState, useMemo } from 'react';
import { Exercise } from '../types';
import { ExerciseArt } from '../components/ExerciseArt';
import { Search, X, Dumbbell, Filter, ChevronRight, Play } from 'lucide-react';

interface ExercisesScreenProps {
  allExercises: Exercise[];
  onStartSingleExerciseWorkout?: (exercise: Exercise) => void;
}

const MUSCLE_FILTERS = [
  'All',
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearm',
  'abdomen',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
];

const EQUIPMENT_FILTERS = [
  'All',
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Bodyweight',
  'Band',
  'Kettlebell',
];

export const ExercisesScreen: React.FC<ExercisesScreenProps> = ({
  allExercises,
  onStartSingleExerciseWorkout,
}) => {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchSearch =
        search === '' ||
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.primary.toLowerCase().includes(search.toLowerCase());

      const matchMuscle =
        selectedMuscle === 'All' ||
        ex.primary.toLowerCase() === selectedMuscle.toLowerCase() ||
        ex.secondary.some((s) => s.toLowerCase() === selectedMuscle.toLowerCase());

      const matchEquipment =
        selectedEquipment === 'All' ||
        ex.equipment.toLowerCase().includes(selectedEquipment.toLowerCase());

      return matchSearch && matchMuscle && matchEquipment;
    });
  }, [allExercises, search, selectedMuscle, selectedEquipment]);

  return (
    <div className="space-y-4 pb-24">
      <div>
        <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
          Library
        </span>
        <h2 className="text-2xl font-black text-white">500+ Exercises</h2>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706860]" />
        <input
          type="text"
          placeholder="Search exercise, muscle, or kit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-[#181512] border border-[#2B231D] rounded-2xl text-sm text-white placeholder-[#706860] focus:outline-none focus:border-[#D9A184]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-[#706860] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Muscle Filter Scroll */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MUSCLE_FILTERS.map((m) => {
          const isSelected = selectedMuscle.toLowerCase() === m.toLowerCase();
          return (
            <button
              key={m}
              onClick={() => setSelectedMuscle(m)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                isSelected
                  ? 'bg-[#D9A184] text-[#12100E] font-bold'
                  : 'bg-[#181512] text-[#A39B92] hover:text-white border border-[#26201B]'
              }`}
            >
              {m === 'All' ? 'All Muscles' : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Equipment Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {EQUIPMENT_FILTERS.map((eq) => {
          const isSelected = selectedEquipment === eq;
          return (
            <button
              key={eq}
              onClick={() => setSelectedEquipment(eq)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                isSelected
                  ? 'bg-[#2E2620] text-[#D9A184] border border-[#44382D]'
                  : 'bg-[#14110E] text-[#706860] hover:text-[#A39B92]'
              }`}
            >
              {eq}
            </button>
          );
        })}
      </div>

      {/* Exercises List */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#A39B92]">
          Showing {filteredExercises.length} exercises
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredExercises.slice(0, 50).map((ex) => (
            <div
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181512] border border-[#28211B] hover:border-[#3E342B] cursor-pointer transition active:scale-[0.99] group"
            >
              <div className="flex-1 mr-2">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D9A184] transition line-clamp-1">
                  {ex.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#706860]">
                  <span className="capitalize text-[#A39B92]">{ex.primary}</span>
                  <span>•</span>
                  <span>{ex.equipment}</span>
                  <span>•</span>
                  <span className="text-[10px]">{ex.difficulty}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#706860] group-hover:text-[#D9A184] group-hover:translate-x-0.5 transition" />
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#1A1714] border border-[#3E342B] p-5 shadow-2xl text-[#F3EFEA]">
            <div className="flex items-start justify-between pb-3 border-b border-[#28211B]">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#D9A184]">
                  {activeExercise.primary} • {activeExercise.equipment}
                </span>
                <h3 className="text-lg font-black text-white">{activeExercise.name}</h3>
              </div>
              <button
                onClick={() => setActiveExercise(null)}
                className="p-1.5 rounded-full text-[#A39B92] hover:text-white bg-[#26201B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
              {/* Animation Art */}
              {activeExercise.art && (
                <ExerciseArt artSlug={activeExercise.art} className="w-full h-48" />
              )}

              {/* Muscles Tags */}
              <div>
                <span className="text-xs font-bold text-[#A39B92] block mb-1.5">Muscles</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#D9A184]/20 border border-[#D9A184]/40 text-xs font-bold text-[#D9A184] capitalize">
                    {activeExercise.primary} (Primary)
                  </span>
                  {activeExercise.secondary.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-[#241F1A] text-xs text-[#A39B92] capitalize border border-[#332A22]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps Instructions */}
              {activeExercise.steps.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-[#A39B92] block mb-2">Instructions</span>
                  <div className="space-y-2">
                    {activeExercise.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D5CEC5]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#241F1A] text-[10px] font-bold text-[#D9A184]">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {onStartSingleExerciseWorkout && (
              <div className="pt-3 border-t border-[#28211B]">
                <button
                  onClick={() => {
                    const ex = activeExercise;
                    setActiveExercise(null);
                    onStartSingleExerciseWorkout(ex);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#D9A184] text-[#12100E] font-black text-sm hover:bg-[#E5B59C] transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Log This Exercise</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
