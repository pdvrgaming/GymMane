import React, { useState } from 'react';
import { TrainingNote } from '../types';
import { BookOpen, Plus, Trash2, Calendar, Tag, X, ChevronLeft } from 'lucide-react';

interface NotesScreenProps {
  notes: TrainingNote[];
  onAddNote: (note: TrainingNote) => void;
  onDeleteNote: (id: string) => void;
  onBack?: () => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  workout: { bg: '#D9A18420', text: '#D9A184' },
  nutrition: { bg: '#8FA37720', text: '#8FA377' },
  recovery: { bg: '#7FA8C920', text: '#7FA8C9' },
  injury: { bg: '#E05A5A20', text: '#E05A5A' },
  general: { bg: '#E0B15A20', text: '#E0B15A' },
};

export const NotesScreen: React.FC<NotesScreenProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onBack,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState<TrainingNote['tag']>('workout');

  const handleCreate = () => {
    if (!title.trim() && !body.trim()) return;

    onAddNote({
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      title: title.trim() || 'Workout Note',
      body: body.trim(),
      tag,
    });

    setTitle('');
    setBody('');
    setShowAddModal(false);
  };

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
              Training Journal
            </span>
            <h2 className="text-2xl font-black text-white">Workout Notes</h2>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D9A184] text-[#12100E] font-bold text-xs hover:bg-[#E5B59C] transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#181512] border border-dashed border-[#2D251F] text-center text-[#A39B92]">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#D9A184]" />
          <p className="text-sm font-semibold text-white">Your Training Journal is empty.</p>
          <p className="text-xs mt-1 text-[#706860]">
            Log cues, recovery notes, PR goals, or how your sets felt.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#241F1A] border border-[#3E3229] text-xs font-bold text-[#D9A184]"
          >
            Write First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const tagStyle = TAG_COLORS[note.tag] || TAG_COLORS.general;
            const dateStr = new Date(note.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-[#181512] border border-[#2B231D] space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: tagStyle.bg, color: tagStyle.text }}
                    >
                      {note.tag}
                    </span>
                    <span className="text-[11px] text-[#706860] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 text-[#706860] hover:text-[#E05A5A] transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white">{note.title}</h4>
                <p className="text-xs text-[#D5CEC5] whitespace-pre-wrap leading-relaxed">
                  {note.body}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* New Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#1A1714] border border-[#3E342B] p-5 shadow-2xl text-[#F3EFEA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#29221C]">
              <h3 className="text-base font-bold text-white">Add Journal Entry</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[#A39B92] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Bench Day & Form Cues"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#14110E] border border-[#332A22] rounded-xl text-sm text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Category</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value as TrainingNote['tag'])}
                  className="w-full px-3 py-2 bg-[#14110E] border border-[#332A22] rounded-xl text-sm text-white focus:outline-none focus:border-[#D9A184]"
                >
                  <option value="workout">Workout</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="recovery">Recovery</option>
                  <option value="injury">Injury / Prehab</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#A39B92] block mb-1">Notes</label>
                <textarea
                  rows={4}
                  placeholder="Write your notes here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#14110E] border border-[#332A22] rounded-xl text-sm text-white focus:outline-none focus:border-[#D9A184]"
                />
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="w-full py-2.5 bg-[#D9A184] rounded-xl text-xs font-black text-[#12100E] hover:bg-[#E5B59C] transition"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
