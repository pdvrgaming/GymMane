import React from 'react';
import { bodyBaseMain, muscleFills, bodyViewW, bodyViewH } from '../data/bodySvgData';
import { MuscleId } from '../types';

interface BodyMapProps {
  selectedMuscles: string[];
  onToggleMuscle: (muscle: string) => void;
  onClearMuscles?: () => void;
}

const MUSCLE_NAMES: Record<string, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearm: 'Forearms',
  abdomen: 'Abs',
  obliques: 'Obliques',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  trapezius: 'Traps',
  back: 'Back',
};

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedMuscles,
  onToggleMuscle,
  onClearMuscles,
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Front & Back Label Header */}
      <div className="w-full flex justify-around text-xs font-bold text-[#A39B92] tracking-wider uppercase mb-1">
        <span>Front View</span>
        <span>Back View</span>
      </div>

      {/* Interactive SVG Body Map */}
      <div className="relative w-full max-w-md aspect-[535/462] bg-[#161311] rounded-2xl border border-[#2D2621] p-2 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox={`0 0 ${bodyViewW} ${bodyViewH}`}
          className="w-full h-full select-none"
        >
          {/* Base human body outline */}
          <g fill="#241F1B" stroke="#38302A" strokeWidth="1.2">
            {bodyBaseMain.map((d, i) => (
              <path key={`base-${i}`} d={d} />
            ))}
          </g>

          {/* Interactive Muscles */}
          {Object.entries(muscleFills).map(([muscleId, paths]) => {
            const isSelected = selectedMuscles.includes(muscleId);
            return (
              <g
                key={muscleId}
                onClick={() => onToggleMuscle(muscleId)}
                className="cursor-pointer transition-all duration-200 group"
              >
                {paths.map((d, idx) => (
                  <path
                    key={`${muscleId}-${idx}`}
                    d={d}
                    fill={isSelected ? '#D9A184' : '#3B332B'}
                    fillOpacity={isSelected ? 0.95 : 0.45}
                    stroke={isSelected ? '#FFF' : 'transparent'}
                    strokeWidth={isSelected ? 1.5 : 0}
                    className="hover:fill-[#B98F72] hover:fill-opacity-80 transition-colors"
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {selectedMuscles.length > 0 && onClearMuscles && (
          <button
            onClick={onClearMuscles}
            className="absolute top-3 right-3 text-xs bg-[#241F1B]/90 hover:bg-[#342D27] text-[#D9A184] px-2.5 py-1 rounded-full border border-[#443830] transition font-medium"
          >
            Clear ({selectedMuscles.length})
          </button>
        )}
      </div>

      {/* Quick Muscle Selector Chips */}
      <div className="w-full mt-3 flex flex-wrap gap-1.5 justify-center max-w-lg">
        {Object.entries(MUSCLE_NAMES).map(([id, label]) => {
          const isSelected = selectedMuscles.includes(id);
          return (
            <button
              key={id}
              onClick={() => onToggleMuscle(id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition active:scale-95 ${
                isSelected
                  ? 'bg-[#D9A184] text-[#12100E] shadow-sm font-bold'
                  : 'bg-[#1C1815] text-[#A39B92] hover:text-[#F3EFEA] hover:bg-[#28221D] border border-[#2D2620]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
