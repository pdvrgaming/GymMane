import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { Calculator } from 'lucide-react';

interface HeaderProps {
  onOpenTools?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTools }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#12100E]/90 backdrop-blur-md border-b border-[#241F1A]">
      <div className="flex items-center gap-2.5">
        <img
          src="./icon.png"
          alt="GymMane"
          className="w-8 h-8 rounded-xl object-cover shadow-sm border border-[#3E342B]"
        />
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
            GymMane
          </h1>
          <span className="text-[10px] text-[#A39B92] font-semibold">Lift. Log it. Grow.</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PWAInstallButton compact />
        {onOpenTools && (
          <button
            onClick={onOpenTools}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#1C1814] border border-[#2D2620] text-xs font-bold text-[#A39B92] hover:text-[#D9A184] hover:bg-[#25201A] transition"
            title="Fitness Calculators"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tools</span>
          </button>
        )}
      </div>
    </header>
  );
};
