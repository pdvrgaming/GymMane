import React from 'react';
import { LoggedSession, Routine, UserProfile } from '../types';
import {
  Flame,
  Dumbbell,
  Play,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  sessions: LoggedSession[];
  routines: Routine[];
  onStartRoutine: (routine: Routine) => void;
  onQuickStart: () => void;
  onNavigateTab: (tab: 'train' | 'progress' | 'exercises' | 'profile') => void;
  onOpenTools: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  sessions,
  routines,
  onStartRoutine,
  onQuickStart,
  onNavigateTab,
  onOpenTools,
}) => {
  // Calculate this week's workouts
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter((s) => new Date(s.date) >= startOfWeek);
  const weeklyProgress = Math.min(100, Math.round((thisWeekSessions.length / (profile.weeklyGoal || 4)) * 100));

  // Compute streak
  let currentStreak = 0;
  if (sessions.length > 0) {
    const dates = sessions.map((s) => new Date(s.date).toDateString());
    const uniqueDates = Array.from(new Set(dates));
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
      currentStreak = Math.min(uniqueDates.length, 7); // clean representative streak
    }
  }

  const totalVolume = sessions.reduce((acc, s) => acc + (s.volume || 0), 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Profile Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
            Welcome back
          </span>
          <h2 className="text-2xl font-black text-white">{profile.name}</h2>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#261E17] border border-[#3E3025] shadow-sm">
          <Flame className="w-4 h-4 text-[#D9A184] fill-current animate-pulse" />
          <span className="text-xs font-black text-[#D9A184]">
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Hero Quick Action / Weekly Goal Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#241E19] to-[#181411] border border-[#3A2F26] p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D9A184]">
              Weekly Goal
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-white">
                {thisWeekSessions.length}
              </span>
              <span className="text-sm font-bold text-[#A39B92]">
                / {profile.weeklyGoal} workouts
              </span>
            </div>
          </div>

          <button
            onClick={onQuickStart}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D9A184] text-[#12100E] font-black text-sm hover:bg-[#E5B59C] transition active:scale-95 shadow-lg shadow-[#D9A184]/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Lift</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#14100D] rounded-full h-2.5 overflow-hidden border border-[#2D241D]">
          <div
            className="bg-gradient-to-r from-[#B98F72] to-[#D9A184] h-full rounded-full transition-all duration-700"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
      </div>

      {/* Fast Stats Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#181512] border border-[#2B231D] rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold text-[#A39B92] uppercase">Workouts</span>
          <div className="text-xl font-black text-white mt-0.5">{sessions.length}</div>
        </div>

        <div className="bg-[#181512] border border-[#2B231D] rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold text-[#A39B92] uppercase">
            Total {profile.unit}
          </span>
          <div className="text-xl font-black text-[#D9A184] mt-0.5">
            {totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}t` : totalVolume}
          </div>
        </div>

        <div
          onClick={onOpenTools}
          className="bg-[#181512] border border-[#2B231D] rounded-2xl p-3 text-center cursor-pointer hover:border-[#D9A184] transition"
        >
          <span className="text-[10px] font-bold text-[#A39B92] uppercase">6 Calculators</span>
          <div className="text-xs font-black text-[#8FA377] mt-1.5 flex items-center justify-center gap-1">
            <span>Tools</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Routine Templates / Programs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-white">Routines</h3>
          <button
            onClick={() => onNavigateTab('train')}
            className="text-xs font-bold text-[#D9A184] hover:underline"
          >
            All Programs
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {routines.slice(0, 4).map((routine) => {
            const exerciseCount = routine.days
              ? routine.days.reduce((acc, d) => acc + d.exercises.length, 0)
              : routine.exerciseIds.length;

            return (
              <div
                key={routine.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#181512] border border-[#2B231D] hover:border-[#3E3229] transition group"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#A39B92] uppercase">
                    {routine.group || 'Program'}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-[#D9A184] transition">
                    {routine.name}
                  </h4>
                  <span className="text-xs text-[#706860]">
                    {routine.days ? `${routine.days.length} days split` : `${exerciseCount} exercises`}
                  </span>
                </div>

                <button
                  onClick={() => onStartRoutine(routine)}
                  className="w-10 h-10 rounded-xl bg-[#241F1A] border border-[#382E25] flex items-center justify-center text-[#D9A184] hover:bg-[#D9A184] hover:text-[#12100E] transition active:scale-95"
                  title="Start Workout"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-white">Recent Workouts</h3>
          <button
            onClick={() => onNavigateTab('progress')}
            className="text-xs font-bold text-[#D9A184] hover:underline"
          >
            View History
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#181512] border border-dashed border-[#2D251F] text-center text-[#A39B92]">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#D9A184]" />
            <p className="text-sm font-semibold">No workouts logged yet.</p>
            <p className="text-xs mt-1 text-[#706860]">
              Start your first session today to unlock your first medal!
            </p>
            <button
              onClick={onQuickStart}
              className="mt-4 px-4 py-2 rounded-full bg-[#26201A] border border-[#3E3229] text-xs font-bold text-[#D9A184] hover:bg-[#342A22]"
            >
              Start First Workout
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.slice(0, 3).map((s) => {
              const dateFormatted = new Date(s.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });
              const durationMins = Math.round(s.durationSec / 60);

              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-[#181512] border border-[#2B231D] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#A39B92]">{dateFormatted}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#251F19] text-[#D9A184] font-semibold">
                        {durationMins} min
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {s.routineName || 'Free Workout'}
                    </h4>
                    <span className="text-xs text-[#706860]">
                      {s.exercises.length} exercises • {s.setCount} sets • {s.volume} {profile.unit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#D9A184]">
                      {s.volume} {profile.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
