import React, { useState } from 'react';
import { Award, LoggedSession, UserProfile } from '../types';
import { MedalShelf } from '../components/MedalShelf';
import { PWAInstallButton } from '../components/PWAInstallButton';
import {
  exportBackupJSON,
  importBackupJSON,
  exportWorkoutsCSV,
} from '../utils/storage';
import {
  User,
  Shield,
  Download,
  Upload,
  FileSpreadsheet,
  Trash2,
  Scale,
  Award as TrophyIcon,
  CheckCircle2,
  Calculator,
  BookOpen,
  MapPin,
} from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  sessions: LoggedSession[];
  awards: Award[];
  onOpenTools: () => void;
  onOpenNotes?: () => void;
  onOpenPlaces?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  sessions,
  awards,
  onOpenTools,
  onOpenNotes,
  onOpenPlaces,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Compute stats
  const totalVolume = sessions.reduce((acc, s) => acc + (s.volume || 0), 0);
  const totalHours = (
    sessions.reduce((acc, s) => acc + (s.durationSec || 0), 0) / 3600
  ).toFixed(1);
  const level = Math.max(1, Math.floor(sessions.length / 3) + 1);

  const handleExportJSON = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GymMane_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvStr = exportWorkoutsCSV(sessions);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GymMane_Workouts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJSON(content);
      if (success) {
        setImportStatus('Backup restored successfully! Refreshing...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (
      confirm(
        'Are you sure you want to erase all local data? This will clear all your workout logs and cannot be undone.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
          Account & Device
        </span>
        <h2 className="text-2xl font-black text-white">Athlete Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1E1915] to-[#14110E] border border-[#3E342B] shadow-xl">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D9A184] text-[#12100E] flex items-center justify-center font-black text-2xl shadow-md">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{profile.name}</h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#D9A184] text-[#12100E]">
                Level {level}
              </span>
            </div>
            <span className="text-xs text-[#A39B92]">
              {profile.weeklyGoal} workouts / week goal
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#29221C] text-center">
          <div>
            <span className="text-[10px] font-bold text-[#A39B92] uppercase">Workouts</span>
            <div className="text-base font-black text-white">{sessions.length}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#A39B92] uppercase">Volume</span>
            <div className="text-base font-black text-[#D9A184]">
              {totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}t` : totalVolume}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#A39B92] uppercase">Time</span>
            <div className="text-base font-black text-white">{totalHours}h</div>
          </div>
        </div>
      </div>

      {/* Units & Preferences */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl space-y-3">
        <h3 className="text-sm font-extrabold text-white">Preferences</h3>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-bold text-white">Unit System</span>
            <span className="block text-[10px] text-[#A39B92]">Kilograms (kg) or Pounds (lb)</span>
          </div>

          <div className="flex items-center gap-1 bg-[#12100E] p-1 rounded-xl border border-[#2B231D]">
            <button
              onClick={() => onUpdateProfile({ ...profile, unit: 'kg' })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                profile.unit === 'kg'
                  ? 'bg-[#D9A184] text-[#12100E]'
                  : 'text-[#A39B92] hover:text-white'
              }`}
            >
              kg
            </button>
            <button
              onClick={() => onUpdateProfile({ ...profile, unit: 'lb' })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                profile.unit === 'lb'
                  ? 'bg-[#D9A184] text-[#12100E]'
                  : 'text-[#A39B92] hover:text-white'
              }`}
            >
              lb
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-[#26201B] space-y-1">
          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="w-full flex items-center justify-between p-2 text-xs font-bold text-[#D9A184] hover:bg-[#201B17] rounded-xl transition"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8FA377]" />
                <span>Training Journal & Notes</span>
              </span>
              <span>→</span>
            </button>
          )}

          {onOpenPlaces && (
            <button
              onClick={onOpenPlaces}
              className="w-full flex items-center justify-between p-2 text-xs font-bold text-[#D9A184] hover:bg-[#201B17] rounded-xl transition"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7FA8C9]" />
                <span>Places & Equipment Kits</span>
              </span>
              <span>→</span>
            </button>
          )}

          <button
            onClick={onOpenTools}
            className="w-full flex items-center justify-between p-2 text-xs font-bold text-[#D9A184] hover:bg-[#201B17] rounded-xl transition"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Open 6 Fitness Calculators</span>
            </span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* 20 Medals Trophy Shelf */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl">
        <MedalShelf awards={awards} />
      </div>

      {/* Backup, Export & Restore */}
      <div className="p-4 rounded-3xl bg-[#181512] border border-[#2B231D] shadow-xl space-y-3">
        <h3 className="text-sm font-extrabold text-white">Your Data</h3>
        <p className="text-xs text-[#A39B92]">
          All workout data lives securely in your device storage. You can export or restore backups anytime.
        </p>

        {importStatus && (
          <div className="p-2.5 rounded-xl bg-[#26201B] border border-[#3E342B] text-xs font-bold text-[#D9A184]">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#201B17] border border-[#2B231D] hover:border-[#D9A184] text-xs font-bold text-white transition active:scale-95"
          >
            <Download className="w-4 h-4 text-[#D9A184]" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#201B17] border border-[#2B231D] hover:border-[#D9A184] text-xs font-bold text-white transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#8FA377]" />
            <span>Export Workouts (CSV)</span>
          </button>
        </div>

        <label className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#201B17] border border-dashed border-[#3A2F26] text-xs font-bold text-[#A39B92] hover:text-white cursor-pointer transition">
          <Upload className="w-4 h-4" />
          <span>Restore Backup from File</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </label>

        <button
          onClick={handleClearAll}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#E05A5A] hover:bg-[#281818] rounded-xl transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete All Local Data</span>
        </button>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 rounded-3xl bg-[#151210] border border-[#221D18] flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#8FA377] shrink-0 mt-0.5" />
        <div className="text-xs text-[#A39B92] leading-relaxed">
          <strong className="text-white block mb-0.5">Privacy First</strong>
          No account, no tracking, and no external servers. GymMane works 100% offline directly in your browser or installed as a standalone PWA on Android and iOS.
        </div>
      </div>
    </div>
  );
};
