import React from 'react';
import { useOnlineStatus } from '../utils/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-xl bg-[#26221E] border border-[#3E3830] px-4 py-2 text-xs font-semibold text-[#D9A184] shadow-2xl animate-fade-in max-w-sm mx-auto">
      <WifiOff className="w-4 h-4 text-[#D9A184] shrink-0" />
      <span>Offline Mode — All your training is stored locally.</span>
    </div>
  );
};
