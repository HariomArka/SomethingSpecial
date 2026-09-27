import React from 'react';
import type { ChatStats, BookTheme } from '../types/chat';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { MessageSquare, FileText, Calendar, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface BookPrefaceProps {
  stats: ChatStats;
  theme: BookTheme;
  onBegin: () => void;
  onPrev?: () => void;
}

export const BookPreface: React.FC<BookPrefaceProps> = ({ stats, theme, onBegin, onPrev }) => {
  const styles = THEME_CONFIGS[theme] || THEME_CONFIGS['vintage-leather'];
  const p1 = stats.participants[0] || 'Sender 1';
  const p2 = stats.participants[1] || 'Sender 2';

  const p1Stats = stats.senderStats[p1] || { count: 0, words: 0, emojiCount: 0 };
  const p2Stats = stats.senderStats[p2] || { count: 0, words: 0, emojiCount: 0 };

  const total = (p1Stats.count + p2Stats.count) || 1;
  const p1Percent = Math.round((p1Stats.count / total) * 100);
  const p2Percent = 100 - p1Percent;

  // Theme-specific card styling for Preface metrics
  const getCardBg = () => {
    switch (theme) {
      case 'midnight-navy':
        return 'bg-slate-800/80 border-slate-700/80 text-slate-100 shadow-md';
      case 'botanical-sage':
        return 'bg-[#FAFDF9] border-emerald-200/80 text-emerald-950 shadow-sm';
      default:
        return 'bg-white border-stone-200 text-stone-900 shadow-sm';
    }
  };

  const getDramatisBox = () => {
    switch (theme) {
      case 'midnight-navy':
        return 'bg-slate-800/80 border-slate-700 text-slate-100 shadow-md';
      case 'botanical-sage':
        return 'bg-[#FAFDF9] border-emerald-200 text-emerald-950 shadow-sm';
      default:
        return 'bg-stone-50/90 border-stone-300 text-stone-900 shadow-sm';
    }
  };

  return (
    <div className="relative w-full max-w-5xl h-[calc(100vh-130px)] max-h-[660px] min-h-[420px] flex rounded-r-lg rounded-l-lg overflow-hidden select-none shadow-2xl transition-colors duration-300">
      {/* LEFT PAGE: DEDICATION & PROLOGUE (STRICT 50% WIDTH) */}
      <div
        onClick={onPrev}
        title="Click to return to Book Cover"
        className={`w-1/2 min-w-[50%] max-w-[50%] flex-1 basis-1/2 h-full ${styles.pageBgClass} ${styles.pageTextClass} ${styles.pageShadowLeftClass} relative flex flex-col justify-between p-5 sm:p-8 md:p-10 cursor-pointer group/left transition-colors duration-300 overflow-hidden`}
      >
        <div className={`border-b ${styles.pageBorderClass} pb-2 flex-shrink-0 flex items-center justify-between`}>
          <span className={`text-xs sm:text-sm font-cinzel font-bold ${styles.pageHeaderClass} tracking-widest uppercase`}>
            Frontispiece • Dedication
          </span>
          <span className={`text-xs font-serif italic ${styles.pageSubtextClass} transition flex items-center gap-1`}>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Cover</span>
          </span>
        </div>

        <div className="my-auto text-center px-3 sm:px-6 py-2 overflow-hidden">
          <span className="text-3xl sm:text-4xl opacity-40 font-serif block mb-1">❧</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading-book font-bold mt-1 mb-3 tracking-wide">
            Dedication
          </h2>
          <p className="font-serif italic text-base sm:text-lg md:text-xl leading-relaxed mb-4 opacity-90 max-w-md mx-auto">
            &ldquo;In every shared thought, every fleeting laugh, and every quiet late-night
            whisper sent across the digital ether — a piece of living memory is woven into
            history.&rdquo;
          </p>

          <div className={`inline-block p-3 sm:p-4 rounded-2xl border text-left w-full max-w-sm mx-auto ${getDramatisBox()}`}>
            <div className={`text-xs sm:text-sm font-cinzel font-bold ${styles.pageHeaderClass} uppercase tracking-wider mb-1.5`}>
              Dramatis Personae
            </div>
            <div className={`font-serif text-sm sm:text-base font-bold flex justify-between items-center py-1.5 border-b ${styles.pageBorderClass}`}>
              <span className="truncate pr-2">{p1}</span>
              <span className={`text-xs sm:text-sm font-mono font-bold flex-shrink-0 ${theme === 'midnight-navy' ? 'text-blue-300' : 'text-amber-800'}`}>
                {p1Stats.count.toLocaleString()} msgs
              </span>
            </div>
            <div className="font-serif text-sm sm:text-base font-bold flex justify-between items-center py-1.5">
              <span className="truncate pr-2">{p2}</span>
              <span className={`text-xs sm:text-sm font-mono font-bold flex-shrink-0 ${theme === 'midnight-navy' ? 'text-cyan-300' : 'text-emerald-800'}`}>
                {p2Stats.count.toLocaleString()} msgs
              </span>
            </div>
          </div>
        </div>

        <div className={`text-center pt-2.5 border-t ${styles.pageBorderClass} ${styles.pageSubtextClass} text-xs sm:text-sm font-serif italic flex-shrink-0`}>
          — Preface —
        </div>
      </div>

      {/* THIN CENTER SPINE CREASE & SEAM (NO WIDE BLUE RIBBON) */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 pointer-events-none z-20 flex justify-center items-center">
        {/* Subtle gutter crease shadow */}
        <div className="absolute inset-y-0 inset-x-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
        {/* Crisp thin seam line */}
        <div
          className={`w-[1.5px] h-full ${
            theme === 'midnight-navy'
              ? 'bg-blue-400/25'
              : theme === 'botanical-sage'
              ? 'bg-emerald-900/20'
              : 'bg-amber-950/20'
          }`}
        />
      </div>

      {/* RIGHT PAGE: THE RECORD & METRICS (STRICT 50% WIDTH) */}
      <div
        onClick={onBegin}
        title="Click to Begin Reading Chapter 1"
        className={`w-1/2 min-w-[50%] max-w-[50%] flex-1 basis-1/2 h-full ${styles.pageBgClass} ${styles.pageTextClass} ${styles.pageShadowRightClass} relative flex flex-col justify-between p-5 sm:p-7 md:p-8 cursor-pointer group/right transition-colors duration-300 overflow-hidden`}
      >
        <div className={`border-b ${styles.pageBorderClass} pb-2 flex-shrink-0 flex items-center justify-between`}>
          <span className={`text-xs sm:text-sm font-cinzel font-bold ${styles.pageHeaderClass} tracking-widest uppercase`}>
            Overview • The Record
          </span>
          <span className={`text-xs font-serif italic ${theme === 'midnight-navy' ? 'text-blue-300' : 'text-amber-800'} group-hover/right:translate-x-1 transition flex items-center gap-1 font-semibold`}>
            <span>Read Chapter 1</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden py-2 space-y-3 flex flex-col justify-between">
          <div className="text-center mb-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading-book font-bold">
              Memory Metrics
            </h3>
            <p className={`text-xs sm:text-sm font-serif italic mt-0.5 ${styles.pageSubtextClass}`}>
              Analyzed from raw WhatsApp exported archive
            </p>
          </div>

          {/* Quick Metrics Grid (BIGGER FONT SIZES) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 font-sans">
            <div className={`p-3 sm:p-4 rounded-xl border ${getCardBg()}`}>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium mb-1 ${styles.pageSubtextClass}`}>
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Messages</span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif truncate">
                {stats.totalMessages.toLocaleString()}
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl border ${getCardBg()}`}>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium mb-1 ${styles.pageSubtextClass}`}>
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Total Words</span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif truncate">
                {stats.totalWords.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Conversation Balance Bar (LARGER TEXT) */}
          <div className={`p-3 sm:p-4 rounded-xl border ${getCardBg()}`}>
            <div className="flex justify-between text-xs sm:text-sm font-serif font-bold mb-2">
              <span className="truncate pr-2">{p1} ({p1Percent}%)</span>
              <span className="truncate pl-2">{p2} ({p2Percent}%)</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 flex">
              <div
                className={`${theme === 'midnight-navy' ? 'bg-blue-500' : 'bg-amber-700'} h-full transition-all duration-500`}
                style={{ width: `${p1Percent}%` }}
              />
              <div
                className={`${theme === 'midnight-navy' ? 'bg-cyan-500' : 'bg-emerald-700'} h-full transition-all duration-500`}
                style={{ width: `${p2Percent}%` }}
              />
            </div>
          </div>

          {/* Favorite Emojis (LARGER ICONS) */}
          {stats.topEmojis.length > 0 && (
            <div className={`p-3 sm:p-4 rounded-xl border ${getCardBg()}`}>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-serif font-bold mb-2 ${styles.pageHeaderClass}`}>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Most Cherished Emojis</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.topEmojis.map((e, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-lg text-sm sm:text-base font-mono ${
                      theme === 'midnight-navy'
                        ? 'bg-slate-900 border-slate-700 text-slate-100'
                        : 'bg-white border-stone-200 text-stone-800'
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{e.emoji}</span>
                    <span className="opacity-80 text-xs font-bold">×{e.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Most active date */}
          {stats.mostActiveDate.date && (
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-serif italic justify-center ${styles.pageSubtextClass}`}>
              <Calendar className="w-4 h-4 opacity-70" />
              <span>
                Peak activity: <strong>{stats.mostActiveDate.date}</strong> ({stats.mostActiveDate.count.toLocaleString()} messages)
              </span>
            </div>
          )}
        </div>

        {/* Turn to Chapter I Button */}
        <div className={`pt-3 border-t ${styles.pageBorderClass} flex items-center justify-between flex-shrink-0`}>
          <span className={`text-xs sm:text-sm font-serif italic ${styles.pageSubtextClass}`}>— Folio 0 —</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBegin();
            }}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-cinzel font-bold tracking-wider shadow-lg hover:scale-105 transition-all ${
              theme === 'midnight-navy'
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-stone-900 hover:bg-amber-950 text-amber-200'
            }`}
          >
            <span>Begin Reading</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
