import React, { useState } from 'react';
import { Award } from '../types';
import confetti from '../utils/confetti';
import { Award as AwardIcon, CheckCircle2, Lock, X } from 'lucide-react';

interface MedalShelfProps {
  awards: Award[];
}

export const MedalShelf: React.FC<MedalShelfProps> = ({ awards }) => {
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);

  const unlockedCount = awards.filter((a) => a.isUnlocked).length;

  const handleSelectAward = (award: Award) => {
    setSelectedAward(award);
    if (award.isUnlocked) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#D9A184', '#B98F72', '#E5B59C', '#F3EFEA'],
        });
      } catch {}
    }
  };

  return (
    <div className="w-full">
      {/* Header Stat */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AwardIcon className="w-5 h-5 text-[#D9A184]" />
          <h3 className="text-base font-bold text-white">Trophy Case</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#26211C] border border-[#3E352C] text-[#D9A184]">
          {unlockedCount} / {awards.length} Unlocked
        </span>
      </div>

      {/* 4-column responsive Grid of 20 Medals */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {awards.map((award) => {
          return (
            <button
              key={award.id}
              onClick={() => handleSelectAward(award)}
              className={`group relative flex flex-col items-center p-2 rounded-2xl border transition duration-200 active:scale-95 ${
                award.isUnlocked
                  ? 'bg-[#1C1814] border-[#3E342B] hover:border-[#D9A184] hover:shadow-lg hover:shadow-[#D9A184]/10'
                  : 'bg-[#141210] border-[#221E1A] opacity-65 hover:opacity-90'
              }`}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-1.5">
                <img
                  src={award.icon}
                  alt={award.name}
                  className={`w-full h-full object-contain filter transition-transform duration-300 group-hover:scale-105 ${
                    !award.isUnlocked ? 'grayscale contrast-75' : ''
                  }`}
                  loading="lazy"
                />
                {!award.isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                    <Lock className="w-3.5 h-3.5 text-[#A39B92]" />
                  </div>
                )}
              </div>

              <span className="text-[11px] font-semibold text-center leading-tight line-clamp-1 text-[#D5CEC5]">
                {award.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modal Detail */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#1A1714] border border-[#3E342B] p-6 shadow-2xl text-center relative">
            <button
              onClick={() => setSelectedAward(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#A39B92] hover:text-white bg-[#26211C]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Medal Large Image */}
            <div className="w-24 h-24 mx-auto my-3 relative flex items-center justify-center">
              <img
                src={selectedAward.icon}
                alt={selectedAward.name}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>

            <h4 className="text-xl font-black text-white mt-2">{selectedAward.name}</h4>
            <p className="text-sm text-[#A39B92] mt-1.5 px-4 leading-relaxed">
              {selectedAward.description}
            </p>

            {/* Progress Bar */}
            <div className="mt-5 p-3 rounded-2xl bg-[#14110F] border border-[#2B241E] text-left">
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[#D5CEC5]">
                <span>Status</span>
                <span className="text-[#D9A184]">
                  {selectedAward.isUnlocked
                    ? 'Completed'
                    : `${selectedAward.progress} / ${selectedAward.maxProgress} ${selectedAward.unit || ''}`}
                </span>
              </div>
              <div className="w-full bg-[#241F1A] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#D9A184] h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (selectedAward.progress / selectedAward.maxProgress) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-5">
              {selectedAward.isUnlocked ? (
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#8FA377]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Unlocked & in Trophy Cabinet</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#A39B92]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Keep lifting to unlock</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAward(null)}
              className="mt-6 w-full rounded-xl bg-[#2D2620] py-2.5 text-sm font-bold text-[#F3EFEA] hover:bg-[#3D342C] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
