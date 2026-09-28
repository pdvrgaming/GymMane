import React from 'react';
import { Home, Dumbbell, BookOpen, LineChart, User, Plus } from 'lucide-react';

export type TabType = 'home' | 'train' | 'exercises' | 'progress' | 'profile';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  hasActiveSession?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, hasActiveSession }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#14110E]/95 backdrop-blur-lg border-t border-[#26201B] px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center flex-1 py-1 transition ${
            currentTab === 'home' ? 'text-[#D9A184]' : 'text-[#706860] hover:text-[#A39B92]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Today</span>
        </button>

        {/* Exercises */}
        <button
          onClick={() => onSelectTab('exercises')}
          className={`flex flex-col items-center flex-1 py-1 transition ${
            currentTab === 'exercises' ? 'text-[#D9A184]' : 'text-[#706860] hover:text-[#A39B92]'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Library</span>
        </button>

        {/* Center Prominent Train / Start Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => onSelectTab('train')}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 ${
              currentTab === 'train' || hasActiveSession
                ? 'bg-[#D9A184] text-[#12100E] border-[#F3EFEA]'
                : 'bg-[#D9A184] text-[#12100E] border-[#221C17] hover:scale-105'
            }`}
            title="Start Workout / Body Map"
          >
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Progress */}
        <button
          onClick={() => onSelectTab('progress')}
          className={`flex flex-col items-center flex-1 py-1 transition ${
            currentTab === 'progress' ? 'text-[#D9A184]' : 'text-[#706860] hover:text-[#A39B92]'
          }`}
        >
          <LineChart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Progress</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center flex-1 py-1 transition ${
            currentTab === 'profile' ? 'text-[#D9A184]' : 'text-[#706860] hover:text-[#A39B92]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </nav>
  );
};
