import React, { useEffect, useState } from 'react';
import { ActiveSession } from '../types';
import { Play, Dumbbell, Timer } from 'lucide-react';

interface RestTimerFloatingProps {
  session: ActiveSession;
  onResume: () => void;
}

export const RestTimerFloating: React.FC<RestTimerFloatingProps> = ({ session, onResume }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = new Date(session.startedAt).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startedAt]);

  const currentExercise =
    session.exercises[session.currentExerciseIndex] || session.exercises[0];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto animate-fade-in">
      <div
        onClick={onResume}
        className="flex items-center justify-between p-3 rounded-2xl bg-[#1C1814]/95 border border-[#3E342B] backdrop-blur-md shadow-2xl cursor-pointer hover:bg-[#25201A] transition active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D9A184] flex items-center justify-center text-[#12100E] shrink-0 font-bold">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-[#D9A184] tracking-wider">
              {session.restTimerSeconds && session.restTimerSeconds > 0
                ? `Resting: ${session.restTimerSeconds}s`
                : 'Session Active'}
            </div>
            <h4 className="text-sm font-bold text-white line-clamp-1">
              {currentExercise?.exercise.name || 'Workout in progress'}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#A39B92]">
            {formatTime(elapsed)}
          </span>
          <div className="w-7 h-7 rounded-full bg-[#8FA377] flex items-center justify-center text-[#12100E]">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
