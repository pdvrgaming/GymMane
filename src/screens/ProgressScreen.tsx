import React, { useState } from 'react';
import { BodyMeasure, LoggedSession, UserProfile } from '../types';
import {
  TrendingUp,
  Award,
  Calendar,
  Ruler,
  Plus,
  Dumbbell,
  CheckCircle2,
  X,
} from 'lucide-react';

interface ProgressScreenProps {
  sessions: LoggedSession[];
  measures: BodyMeasure[];
  onAddMeasure: (measure: BodyMeasure) => void;
  profile: UserProfile;
}

const MEASURE_LABELS: Record<string, string> = {
  weight: 'Bodyweight',
  waist: 'Waist',
  chest: 'Chest',
  arm: 'Arms / Biceps',
  thigh: 'Thighs',
  neck: 'Neck',
  hips: 'Hips',
  bodyfat: 'Body Fat %',
};

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  sessions,
  measures,
  onAddMeasure,
  profile,
}) => {
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [measureKey, setMeasureKey] = useState('weight');
  const [measureVal, setMeasureVal] = useState('');

  // Compute PRs (best weight per exercise)
  const prs: { name: string; weight: number; reps: number; date: string }[] = [];
  const exerciseMap: Record<string, { weight: number; reps: number; date: string }> = {};

  sessions.forEach((s) => {
    s.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.kind !== 'warmup' && set.weight > 0) {
          const current = exerciseMap[ex.name];
          if (!current || set.weight > current.weight) {
            exerciseMap[ex.name] = { weight: set.weight, reps: set.reps, date: s.date };
          }
        }
      });
    });
  });

  Object.entries(exerciseMap).forEach(([name, data]) => {
    prs.push({ name, ...data });
  });

  prs.sort((a, b) => b.weight - a.weight);

  // Compute Muscle Split distribution
  const muscleCount: Record<string, number> = {};
  sessions.forEach((s) => {
    s.exercises.forEach((ex) => {
      const p = ex.primary.toLowerCase();
      muscleCount[p] = (muscleCount[p] || 0) + ex.sets.length;
    });
  });

  const totalLoggedSets = Object.values(muscleCount).reduce((a, b) => a + b, 0);

  // Calendar Heatmap: Past 60 days
  const today = new Date();
  const days: { dateStr: string; count: number }[] = [];
  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const matchCount = sessions.filter((s) => s.date.startsWith(dateStr)).length;
    days.push({ dateStr, count: matchCount });
  }

  const handleSaveMeasure = () => {
    const val = parseFloat(measureVal);
    if (isNaN(val) || val <= 0) return;

    onAddMeasure({
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      key: measureKey,
      value: val,
    });
    setMeasureVal('');
    setShowMeasureModal(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
          Analytics
        </span>
        <h2 className="text-2xl font-black text-white">Your Progress</h2>
      </div>

      {/* Activity Heatmap */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D9A184]" />
            <h3 className="text-sm font-bold text-white">Activity (Past 60 Days)</h3>
          </div>
          <span className="text-[11px] text-[#A39B92]">
            {sessions.length} total sessions
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center py-2">
          {days.map((d) => (
            <div
              key={d.dateStr}
              title={`${d.dateStr}: ${d.count} workout(s)`}
              className={`w-3.5 h-3.5 rounded-sm transition ${
                d.count >= 2
                  ? 'bg-[#D9A184]'
                  : d.count === 1
                  ? 'bg-[#B98F72]'
                  : 'bg-[#221D18]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-[#A39B92]">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#221D18]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#B98F72]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#D9A184]" />
          <span>More</span>
        </div>
      </div>

      {/* Muscle Split Distribution */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">Muscle Split</h3>
        {totalLoggedSets === 0 ? (
          <p className="text-xs text-[#706860] text-center py-4">
            Log your first sets to see your muscle split breakdown.
          </p>
        ) : (
          <div className="space-y-2">
            {Object.entries(muscleCount)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([muscle, count]) => {
                const pct = Math.round((count / totalLoggedSets) * 100);
                return (
                  <div key={muscle} className="text-xs">
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="capitalize text-white">{muscle}</span>
                      <span className="text-[#D9A184]">
                        {count} sets ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#14110E] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#D9A184] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Personal Records (PRs) */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D9A184]" />
            <h3 className="text-sm font-bold text-white">Personal Records (PRs)</h3>
          </div>
          <span className="text-xs text-[#A39B92]">{prs.length} lifts</span>
        </div>

        {prs.length === 0 ? (
          <p className="text-xs text-[#706860] text-center py-4">
            No PRs recorded yet. As you lift, your best numbers appear here.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {prs.slice(0, 10).map((pr, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#201B17] border border-[#2B231D]"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{pr.name}</h4>
                  <span className="text-[10px] text-[#A39B92]">
                    {pr.reps} {pr.reps === 1 ? 'rep' : 'reps'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#D9A184]">
                    {pr.weight} {profile.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body Measurements */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#D9A184]" />
            <h3 className="text-sm font-bold text-white">Body Measurements</h3>
          </div>
          <button
            onClick={() => setShowMeasureModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#D9A184] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record</span>
          </button>
        </div>

        {measures.length === 0 ? (
          <p className="text-xs text-[#706860] text-center py-4">
            Track bodyweight, waist, chest, or arms over time.
          </p>
        ) : (
          <div className="space-y-2">
            {measures.slice(0, 5).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#201B17] border border-[#2B231D] text-xs"
              >
                <div>
                  <span className="font-bold text-white">
                    {MEASURE_LABELS[m.key] || m.key}
                  </span>
                  <span className="block text-[10px] text-[#706860]">
                    {new Date(m.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-extrabold text-[#D9A184]">
                  {m.value} {m.key === 'bodyfat' ? '%' : m.key === 'weight' ? profile.unit : 'cm'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Measurement Modal */}
      {showMeasureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#1A1714] border border-[#3E342B] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#28211B]">
              <h3 className="text-base font-bold text-white">Record Body Measure</h3>
              <button
                onClick={() => setShowMeasureModal(false)}
                className="p-1 rounded-full text-[#A39B92] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Measurement</label>
                <select
                  value={measureKey}
                  onChange={(e) => setMeasureKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14110E] border border-[#332A22] rounded-xl text-sm text-white focus:outline-none focus:border-[#D9A184]"
                >
                  {Object.entries(MEASURE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">
                  Value ({measureKey === 'bodyfat' ? '%' : measureKey === 'weight' ? profile.unit : 'cm'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 75.5"
                  value={measureVal}
                  onChange={(e) => setMeasureVal(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#14110E] border border-[#332A22] rounded-xl text-sm text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>
            </div>

            <button
              onClick={handleSaveMeasure}
              className="w-full py-2.5 bg-[#D9A184] rounded-xl text-xs font-black text-[#12100E] hover:bg-[#E5B59C] transition"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
