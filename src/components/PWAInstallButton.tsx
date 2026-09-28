import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, Share2, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 rounded-full bg-[#D9A184] text-[#12100E] font-bold shadow-lg hover:bg-[#E5B59C] transition active:scale-95 ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm'
        }`}
        title="Install GymMane PWA"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-full border border-[#4A4036] bg-[#1E1A17] text-[#D9A184] hover:bg-[#2A2420] transition active:scale-95 ${
            compact ? 'px-2.5 py-1 text-xs font-semibold' : 'px-3 py-1.5 text-xs font-bold'
          }`}
          title="Install on iPhone / iPad"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#1A1715] border border-[#3E3830] p-6 shadow-2xl text-[#F3EFEA]">
              <div className="flex items-center justify-between pb-3 border-b border-[#2C2621]">
                <div className="flex items-center gap-2.5">
                  <img src="./pwa-192x192.png" alt="GymMane" className="w-8 h-8 rounded-lg shadow" />
                  <h3 className="text-base font-bold text-white">Install on iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-[#A39B92] hover:text-white hover:bg-[#2C2621]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-sm text-[#D5CEC5]">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2C2621] text-xs font-bold text-[#D9A184]">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-white">Share</strong> button{' '}
                    <Share2 className="inline w-4 h-4 text-[#D9A184] mx-1" /> in Safari’s navigation bar.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2C2621] text-xs font-bold text-[#D9A184]">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2C2621] text-xs font-bold text-[#D9A184]">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-white">Add</strong> in the top right corner. GymMane will open as a full standalone app!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-[#D9A184] py-2.5 text-sm font-bold text-[#12100E] hover:bg-[#E5B59C] transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop or non-Chromium browsers
  return (
    <button
      onClick={() => {
        alert("To install GymMane: In your browser menu, select 'Install GymMane' or 'Add to Home screen'.");
      }}
      className={`hidden sm:flex items-center gap-1.5 rounded-full border border-[#4A4036] bg-[#1E1A17] text-[#D9A184] hover:bg-[#2A2420] transition ${
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      }`}
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install App</span>
    </button>
  );
};
