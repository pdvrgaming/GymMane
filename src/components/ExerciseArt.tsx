import React, { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface ExerciseArtProps {
  artSlug: string;
  className?: string;
  autoPlay?: boolean;
}

export const ExerciseArt: React.FC<ExerciseArtProps> = ({
  artSlug,
  className = 'w-full h-48',
  autoPlay = true,
}) => {
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!artSlug) {
      setLoading(false);
      setHasError(true);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setHasError(false);

    fetch(`./art/${artSlug}.txt`)
      .then((res) => {
        if (!res.ok) throw new Error('Art not found');
        return res.text();
      })
      .then((text) => {
        if (!isMounted) return;
        const lines = text
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && l.startsWith('M'));
        if (lines.length > 0) {
          setFrames(lines);
          setCurrentFrame(0);
          setLoading(false);
        } else {
          setHasError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [artSlug]);

  useEffect(() => {
    if (!autoPlay || frames.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 700);

    return () => clearInterval(timer);
  }, [autoPlay, frames.length]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-[#181512] rounded-2xl border border-[#2D2621] ${className}`}
      >
        <div className="w-6 h-6 border-2 border-[#D9A184] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasError || frames.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#181512] rounded-2xl border border-[#2D2621] text-[#706860] ${className}`}
      >
        <Dumbbell className="w-10 h-10 mb-2 opacity-50" />
        <span className="text-xs">GymMane Exercise</span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center bg-[#181512] rounded-2xl border border-[#2D2621] overflow-hidden p-4 ${className}`}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full text-[#D9A184]"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={frames[currentFrame]}
          fill="currentColor"
          fillRule="evenodd"
          className="transition-all duration-300"
        />
      </svg>

      {frames.length > 1 && (
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1 bg-[#12100E]/70 px-2 py-0.5 rounded-full border border-[#2D2621] text-[10px] font-mono text-[#A39B92]">
          <span>
            {currentFrame + 1}/{frames.length}
          </span>
        </div>
      )}
    </div>
  );
};
