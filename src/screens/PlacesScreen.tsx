import React from 'react';
import { GymPlace } from '../types';
import { MapPin, Check, ChevronLeft, Plus } from 'lucide-react';

interface PlacesScreenProps {
  places: GymPlace[];
  activePlaceId: string;
  onSelectPlace: (id: string) => void;
  onBack?: () => void;
}

export const PlacesScreen: React.FC<PlacesScreenProps> = ({
  places,
  activePlaceId,
  onSelectPlace,
  onBack,
}) => {
  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full bg-[#181512] text-[#A39B92] hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-[#A39B92] tracking-wider uppercase">
              Gym Locations
            </span>
            <h2 className="text-2xl font-black text-white">Places & Kits</h2>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#A39B92] leading-relaxed">
        Choose where you are training. Exercises will automatically filter to the kit you actually have available.
      </p>

      <div className="space-y-3">
        {places.map((place) => {
          const isActive = place.id === activePlaceId;
          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place.id)}
              className={`p-4 rounded-3xl border transition cursor-pointer ${
                isActive
                  ? 'bg-[#221C16] border-[#D9A184] shadow-lg'
                  : 'bg-[#181512] border-[#29221C] hover:border-[#3D332A]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#D9A184] text-[#12100E]' : 'bg-[#26201B] text-[#A39B92]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{place.name}</h4>
                    <p className="text-xs text-[#A39B92] mt-0.5">{place.description}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                    isActive
                      ? 'bg-[#D9A184] border-[#D9A184] text-[#12100E]'
                      : 'border-[#3D332A] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Equipment badges */}
              <div className="mt-3 pt-3 border-t border-[#2A231D] flex flex-wrap gap-1.5">
                {place.equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[#13100E] border border-[#2B231D] text-[10px] font-semibold text-[#A39B92]"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
