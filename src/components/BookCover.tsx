import React from 'react';
import type { BookTheme, ChatStats } from '../types/chat';
import { BookOpen, Sparkles, Feather } from 'lucide-react';

interface BookCoverProps {
  stats: ChatStats;
  theme: BookTheme;
  onOpen: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ stats, theme, onOpen }) => {
  // Theme texture classes
  const getThemeClass = () => {
    switch (theme) {
      case 'midnight-navy':
        return 'leather-navy-texture border-amber-500/40 text-amber-100';
      case 'botanical-sage':
        return 'leather-green-texture border-emerald-400/40 text-emerald-100';
      default:
        return 'leather-texture border-amber-600/40 text-amber-100';
    }
  };

  const participant1 = stats.participants[0] || 'Friend 1';
  const participant2 = stats.participants[1] || 'Friend 2';

  return (
    <div
      onClick={onOpen}
      className={`w-full max-w-lg h-[calc(100vh-130px)] max-h-[660px] min-h-[400px] mx-auto rounded-r-2xl rounded-l-md shadow-2xl relative cursor-pointer select-none transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_60px_-10px_rgba(212,175,55,0.25)] flex flex-col justify-between p-6 sm:p-8 md:p-10 border-2 ${getThemeClass()}`}
      style={{
        boxShadow:
          '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 4px 0 10px rgba(0,0,0,0.6), inset -2px 0 5px rgba(255,255,255,0.1)',
      }}
    >
      {/* Book Spine Texture on Left Edge */}
      <div className="absolute top-0 bottom-0 left-0 w-7 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none rounded-l-md border-r border-amber-500/20" />

      {/* Ornate Gold Border Frame */}
      <div className="absolute inset-4 md:inset-6 border-2 border-amber-400/50 rounded-xl pointer-events-none">
        <div className="absolute inset-1.5 border border-amber-300/30 rounded-lg" />
        {/* Corner Filigree Symbols */}
        <span className="absolute -top-3 -left-2 text-amber-300 text-lg">✦</span>
        <span className="absolute -top-3 -right-2 text-amber-300 text-lg">✦</span>
        <span className="absolute -bottom-3 -left-2 text-amber-300 text-lg">✦</span>
        <span className="absolute -bottom-3 -right-2 text-amber-300 text-lg">✦</span>
      </div>

      {/* Top Header */}
      <div className="text-center relative z-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-400/30 text-amber-300/90 text-xs font-serif tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>WhatsApp Memories</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
      </div>

      {/* Center Title & Senders */}
      <div className="text-center my-auto relative z-10 px-4">
        <div className="flex justify-center mb-3">
          <Feather className="w-8 h-8 text-amber-400/80 transform -rotate-45" />
        </div>

        <h1 className="text-3xl md:text-5xl font-cinzel font-bold tracking-wider gold-foil-text mb-3 leading-tight">
          A Tale of Words
        </h1>

        <p className="text-base md:text-lg font-serif italic text-amber-200/80 mb-6">
          Conversations Between Two Souls
        </p>

        {/* Participants Pill */}
        <div className="flex items-center justify-center gap-3 text-sm md:text-base font-serif font-semibold text-amber-100/95 tracking-wide">
          <span className="bg-amber-950/80 px-3 py-1 rounded-md border border-amber-500/40 shadow-inner">
            {participant1}
          </span>
          <span className="text-amber-400 font-cinzel text-xs">&amp;</span>
          <span className="bg-amber-950/80 px-3 py-1 rounded-md border border-amber-500/40 shadow-inner">
            {participant2}
          </span>
        </div>

        {/* Date Range Badge */}
        {stats.startDate && stats.endDate && (
          <div className="mt-5 text-xs font-serif text-amber-300/70 tracking-widest uppercase">
            {stats.startDate} — {stats.endDate}
          </div>
        )}
      </div>

      {/* Bottom Wax Seal / Open Action */}
      <div className="text-center relative z-10 pb-4">
        <div className="inline-flex flex-col items-center group">
          {/* Glowing Wax Seal Button */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-700 via-red-800 to-red-950 border-2 border-amber-300/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <BookOpen className="w-6 h-6 text-amber-200" />
          </div>
          <span className="text-xs font-cinzel text-amber-200/90 tracking-widest mt-2 group-hover:text-amber-300 transition-colors uppercase">
            Click to Open Book
          </span>
          <span className="text-[10px] font-serif italic text-amber-400/60 mt-0.5">
            {stats.totalMessages} recorded memories inside
          </span>
        </div>
      </div>
    </div>
  );
};
