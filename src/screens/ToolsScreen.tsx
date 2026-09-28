import React, { useState } from 'react';
import {
  calculate1RM,
  calculatePlates,
  calculateBMI,
  calculateTDEE,
  calculateBodyFat,
  calculateWarmupSets,
} from '../utils/calculators';
import { UserProfile } from '../types';
import {
  Calculator,
  Flame,
  Scale,
  Percent,
  TrendingUp,
  Layers,
  ChevronLeft,
} from 'lucide-react';

interface ToolsScreenProps {
  profile: UserProfile;
  onBack?: () => void;
}

type ToolType = 'rm' | 'plate' | 'bmi' | 'cal' | 'bf' | 'warmup';

export const ToolsScreen: React.FC<ToolsScreenProps> = ({ profile, onBack }) => {
  const [activeTool, setActiveTool] = useState<ToolType>('rm');

  // 1RM state
  const [rmWeight, setRmWeight] = useState(100);
  const [rmReps, setRmReps] = useState(5);
  const [rmRpe, setRmRpe] = useState(8.5);

  // Plate state
  const [plateTarget, setPlateTarget] = useState(100);
  const [barWeight, setBarWeight] = useState(profile.unit === 'kg' ? 20 : 45);

  // BMI state
  const [bmiWeight, setBmiWeight] = useState(profile.weightKg || 75);
  const [bmiHeight, setBmiHeight] = useState(profile.heightCm || 178);

  // TDEE state
  const [tdeeAge, setTdeeAge] = useState(profile.age || 26);
  const [tdeeSex, setTdeeSex] = useState<'male' | 'female'>(profile.sex || 'male');
  const [tdeeActivity, setTdeeActivity] = useState(profile.activity || 1.55);

  // Body Fat state
  const [bfWaist, setBfWaist] = useState(82);
  const [bfNeck, setBfNeck] = useState(38);
  const [bfHip, setBfHip] = useState(95);

  // Warmup state
  const [warmupWorkingWeight, setWarmupWorkingWeight] = useState(100);

  const rmResult = calculate1RM(rmWeight, rmReps, rmRpe);
  const plateResult = calculatePlates(plateTarget, barWeight);
  const bmiResult = calculateBMI(bmiWeight, bmiHeight);
  const tdeeResult = calculateTDEE(bmiWeight, bmiHeight, tdeeAge, tdeeSex, tdeeActivity);
  const bfResult = calculateBodyFat(tdeeSex, bmiHeight, bfWaist, bfNeck, bfHip);
  const warmupResult = calculateWarmupSets(warmupWorkingWeight, barWeight);

  const TOOLS_LIST = [
    { id: 'rm', name: '1RM', desc: 'One-Rep Max', icon: TrendingUp },
    { id: 'plate', name: 'Plates', desc: 'Barbell Plates Math', icon: Layers },
    { id: 'bmi', name: 'BMI', desc: 'Body Mass Index', icon: Scale },
    { id: 'cal', name: 'Calories', desc: 'TDEE & Macros', icon: Flame },
    { id: 'bf', name: 'Body Fat', desc: 'Navy Body Fat %', icon: Percent },
    { id: 'warmup', name: 'Warm-up', desc: 'Ramp-up Sets', icon: Calculator },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full bg-[#181512] text-[#A39B92] hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
              Gym Tools
            </span>
            <h2 className="text-2xl font-black text-white">6 Calculators</h2>
          </div>
        </div>
      </div>

      {/* Grid of Tool Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {TOOLS_LIST.map((tool) => {
          const Icon = tool.icon;
          const isSelected = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as ToolType)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
                isSelected
                  ? 'bg-[#29221C] border-[#D9A184] text-[#D9A184]'
                  : 'bg-[#181512] border-[#2A221C] text-[#706860] hover:text-[#A39B92]'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-black">{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Container */}
      <div className="p-5 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl">
        {/* 1RM Tool */}
        {activeTool === 'rm' && (
          <div className="space-y-4">
            <div className="text-center p-5 rounded-2xl bg-[#13100E] border border-[#2B231D]">
              <span className="text-xs font-bold text-[#A39B92] uppercase">Estimated 1RM</span>
              <div className="text-4xl font-black text-[#D9A184] my-1">
                {rmResult.average} {profile.unit}
              </div>
              <span className="text-xs text-[#706860]">
                Epley: {rmResult.epley} • Brzycki: {rmResult.brzycki}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">
                  Weight ({profile.unit})
                </label>
                <input
                  type="number"
                  step="2.5"
                  value={rmWeight}
                  onChange={(e) => setRmWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Reps Performed</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={rmReps}
                  onChange={(e) => setRmReps(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Plate Calculator */}
        {activeTool === 'plate' && (
          <div className="space-y-4">
            <div className="text-center p-5 rounded-2xl bg-[#13100E] border border-[#2B231D]">
              <span className="text-xs font-bold text-[#A39B92] uppercase">Plates Per Side</span>
              <div className="text-2xl font-black text-[#D9A184] my-2">
                {plateResult.platesPerSide.length > 0 ? (
                  plateResult.platesPerSide.map((p) => `${p.count}×${p.weight}${profile.unit}`).join(' + ')
                ) : (
                  'Empty Barbell'
                )}
              </div>
              <span className="text-xs text-[#706860]">
                Total Loaded: {plateResult.totalActual} {profile.unit}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">
                  Target Weight ({profile.unit})
                </label>
                <input
                  type="number"
                  step="2.5"
                  value={plateTarget}
                  onChange={(e) => setPlateTarget(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Barbell Weight</label>
                <input
                  type="number"
                  value={barWeight}
                  onChange={(e) => setBarWeight(parseFloat(e.target.value) || 20)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>
            </div>
          </div>
        )}

        {/* BMI Calculator */}
        {activeTool === 'bmi' && (
          <div className="space-y-4">
            <div className="text-center p-5 rounded-2xl bg-[#13100E] border border-[#2B231D]">
              <span className="text-xs font-bold text-[#A39B92] uppercase">Body Mass Index</span>
              <div className="text-4xl font-black text-white my-1">{bmiResult.bmi}</div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${bmiResult.color}20`, color: bmiResult.color }}
              >
                {bmiResult.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={bmiWeight}
                  onChange={(e) => setBmiWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={bmiHeight}
                  onChange={(e) => setBmiHeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Calories & TDEE */}
        {activeTool === 'cal' && (
          <div className="space-y-4">
            <div className="text-center p-5 rounded-2xl bg-[#13100E] border border-[#2B231D]">
              <span className="text-xs font-bold text-[#A39B92] uppercase">Maintenance Calories</span>
              <div className="text-3xl font-black text-[#D9A184] my-1">
                {tdeeResult.tdee} kcal / day
              </div>
              <div className="flex justify-center gap-4 text-xs mt-2 text-[#A39B92]">
                <span>P: {tdeeResult.proteinGrams}g</span>
                <span>F: {tdeeResult.fatGrams}g</span>
                <span>C: {tdeeResult.carbGrams}g</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Sex</label>
                <select
                  value={tdeeSex}
                  onChange={(e) => setTdeeSex(e.target.value as 'male' | 'female')}
                  className="w-full px-3 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Activity Level</label>
                <select
                  value={tdeeActivity}
                  onChange={(e) => setTdeeActivity(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                >
                  <option value="1.2">Sedentary (desk job)</option>
                  <option value="1.375">Light (1-3 days/wk)</option>
                  <option value="1.55">Moderate (3-5 days/wk)</option>
                  <option value="1.725">Heavy (6-7 days/wk)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Body Fat % */}
        {activeTool === 'bf' && (
          <div className="space-y-4">
            <div className="text-center p-5 rounded-2xl bg-[#13100E] border border-[#2B231D]">
              <span className="text-xs font-bold text-[#A39B92] uppercase">Estimated Body Fat</span>
              <div className="text-4xl font-black text-[#D9A184] my-1">{bfResult}%</div>
              <span className="text-xs text-[#706860]">U.S. Navy Circumference Formula</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Waist (cm)</label>
                <input
                  type="number"
                  value={bfWaist}
                  onChange={(e) => setBfWaist(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Neck (cm)</label>
                <input
                  type="number"
                  value={bfNeck}
                  onChange={(e) => setBfNeck(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Warm-up Sets Generator */}
        {activeTool === 'warmup' && (
          <div className="space-y-4">
            <div className="text-center p-4 rounded-2xl bg-[#13100E] border border-[#2B231D]">
              <span className="text-xs font-bold text-[#A39B92] uppercase">Working Weight</span>
              <div className="text-3xl font-black text-[#D9A184] my-1">
                {warmupWorkingWeight} {profile.unit}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#A39B92] block mb-1">
                Target Working Weight ({profile.unit})
              </label>
              <input
                type="number"
                step="2.5"
                value={warmupWorkingWeight}
                onChange={(e) => setWarmupWorkingWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-[#13100E] border border-[#2B231D] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D9A184]"
              />
            </div>

            <div className="space-y-2 mt-3">
              <span className="text-xs font-bold text-[#A39B92]">Recommended Warm-up Sets</span>
              {warmupResult.map((w) => (
                <div
                  key={w.setNumber}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#14110E] border border-[#2B231D] text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{w.label}</span>
                    <span className="block text-[10px] text-[#A39B92]">{w.reps} reps</span>
                  </div>
                  <span className="font-black text-[#D9A184]">
                    {w.weight} {profile.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
