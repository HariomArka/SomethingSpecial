import React from 'react';
import type { ChatStats } from '../types/chat';
import { X, MessageSquare, FileText, Calendar, Award, Sparkles, Smile } from 'lucide-react';

interface StatsModalProps {
  stats: ChatStats;
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] text-stone-900 rounded-2xl shadow-2xl border-4 border-[#381e0f] overflow-hidden paper-warm-bg flex flex-col max-h-[90vh]">
        {/* Ornate Gold Top Header */}
        <div className="bg-gradient-to-r from-[#2b1810] via-[#3a2016] to-[#1a0f0a] text-amber-100 p-4 px-6 flex items-center justify-between border-b-2 border-amber-500/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-base md:text-lg font-bold tracking-wider gold-foil-text">
              Chat Archive Intelligence
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200/70 hover:text-amber-100 hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 book-page-scroll">
          {/* Headline summary */}
          <div className="text-center">
            <span className="text-2xl text-amber-800">❦</span>
            <h4 className="font-heading-book text-2xl font-bold text-stone-900 mt-1">
              Conversation Summary &amp; Lore
            </h4>
            <p className="font-serif italic text-sm text-stone-600">
              Between {stats.participants.join(' & ')}
            </p>
            {stats.startDate && (
              <p className="font-mono text-xs text-amber-900/70 mt-1">
                {stats.startDate} — {stats.endDate}
              </p>
            )}
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm text-center">
              <MessageSquare className="w-4 h-4 text-amber-700 mx-auto mb-1" />
              <div className="text-xl font-bold font-serif text-stone-900">
                {stats.totalMessages.toLocaleString()}
              </div>
              <div className="text-[15px] text-stone-500 font-sans">Messages</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm text-center">
              <FileText className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
              <div className="text-xl font-bold font-serif text-stone-900">
                {stats.totalWords.toLocaleString()}
              </div>
              <div className="text-[15px] text-stone-500 font-sans">Words Exchanged</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm text-center">
              <Smile className="w-4 h-4 text-purple-700 mx-auto mb-1" />
              <div className="text-xl font-bold font-serif text-stone-900">
                {stats.topEmojis.reduce((acc, curr) => acc + curr.count, 0)}
              </div>
              <div className="text-[15px] text-stone-500 font-sans">Total Emojis</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm text-center">
              <Calendar className="w-4 h-4 text-rose-700 mx-auto mb-1" />
              <div className="text-lg font-bold font-serif text-stone-900 truncate">
                {stats.mostActiveDate.date || 'N/A'}
              </div>
              <div className="text-[15px] text-stone-500 font-sans">Peak Date</div>
            </div>
          </div>

          {/* Participant Breakdown Table */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <h5 className="font-cinzel text-xs font-bold text-amber-950 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Participant Contribution</span>
            </h5>

            <div className="space-y-4">
              {stats.participants.map((person) => {
                const s = stats.senderStats[person] || { count: 0, words: 0, emojiCount: 0 };
                const pct = Math.round((s.count / (stats.totalMessages || 1)) * 100);
                const avgWords = s.count ? Math.round(s.words / s.count) : 0;

                return (
                  <div key={person} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif font-bold text-sm text-stone-900">{person}</span>
                      <span className="text-xs font-mono font-semibold text-amber-900">
                        {s.count} msgs ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-stone-100 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-amber-700 to-amber-900 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-500 font-sans">
                      <span>{s.words.toLocaleString()} words</span>
                      <span>•</span>
                      <span>~{avgWords} words/msg</span>
                      <span>•</span>
                      <span>{s.emojiCount} emojis used</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Emojis Gallery */}
          {stats.topEmojis.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <h5 className="font-cinzel text-xs font-bold text-amber-950 uppercase tracking-widest mb-3">
                Top Reaction Symbols
              </h5>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {stats.topEmojis.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-center"
                  >
                    <span className="text-2xl block">{item.emoji}</span>
                    <span className="text-[10px] font-mono text-stone-500 font-bold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 p-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-100 font-cinzel text-xs tracking-wider font-semibold transition"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
