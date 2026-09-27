import React from 'react';
import type { BookPage, BookTheme } from '../types/chat';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { formatChapterDate } from '../utils/pagination';
import { ChatBubble } from './ChatBubble';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookPageSpreadProps {
  leftPage: BookPage | null;
  rightPage: BookPage | null;
  senderNameA: string;
  senderNameB: string;
  searchQuery: string;
  theme: BookTheme;
  onTurnNext?: () => void;
  onTurnPrev?: () => void;
}

export const BookPageSpread: React.FC<BookPageSpreadProps> = ({
  leftPage,
  rightPage,
  senderNameA,
  senderNameB,
  searchQuery,
  theme,
  onTurnNext,
  onTurnPrev,
}) => {
  const styles = THEME_CONFIGS[theme] || THEME_CONFIGS['vintage-leather'];

  // Derive chapter date for the spread
  const getPageDate = (page: BookPage | null): string => {
    if (!page) return '';
    if (page.dateHeading) return page.dateHeading;
    if (page.messages && page.messages.length > 0 && page.messages[0].rawDate) {
      return formatChapterDate(page.messages[0].rawDate);
    }
    return '';
  };

  const leftDate = getPageDate(leftPage) || getPageDate(rightPage);

  return (
    <div className="relative w-full max-w-5xl h-[calc(100vh-130px)] max-h-[660px] min-h-[400px] flex rounded-r-lg rounded-l-lg overflow-hidden select-none shadow-2xl transition-colors duration-300">
      {/* LEFT PAGE (STRICT 50% WIDTH - WIDER CONTENT PADDING) */}
      <div
        className={`w-1/2 min-w-[50%] max-w-[50%] flex-1 basis-1/2 overflow-hidden h-full ${styles.pageBgClass} ${styles.pageTextClass} ${styles.pageShadowLeftClass} relative flex flex-col justify-between p-3.5 sm:p-5 md:p-6 cursor-pointer group/left transition-colors duration-300`}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.chat-bubble-content')) return;
          onTurnPrev?.();
        }}
      >
        {/* Left Page Top Header (Always Chapter - Date) */}
        <div className={`flex items-center justify-between border-b ${styles.pageBorderClass} pb-1.5 mb-2 sm:mb-3 flex-shrink-0`}>
          <span className={`text-[11px] ${styles.pageHeaderClass} tracking-widest uppercase truncate max-w-[240px]`}>
            {leftDate ? `Chapter • ${leftDate}` : 'Memory'}
          </span>
          <span className={`text-[10px] ${styles.pageSubtextClass} font-serif italic flex-shrink-0`}>
            {leftPage ? `Folio ${leftPage.pageNumber}` : ''}
          </span>
        </div>

        {/* Messages Container (Strict Zero-Scroll - No scrollbars) */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-start">
          {leftPage ? (
            leftPage.messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isSenderA={msg.sender === senderNameA}
                searchQuery={searchQuery}
                senderNameA={senderNameA}
                senderNameB={senderNameB}
                theme={theme}
              />
            ))
          ) : (
            <div className={`h-full flex items-center justify-center ${styles.pageSubtextClass} font-serif italic`}>
              Blank Page
            </div>
          )}
        </div>

        {/* Left Page Bottom Footer */}
        <div className={`flex items-center justify-between pt-2 border-t ${styles.pageBorderClass} mt-2 ${styles.pageSubtextClass} flex-shrink-0`}>
          <span className="text-xs font-serif italic tracking-widest">
            {leftPage ? `— ${leftPage.pageNumber} —` : ''}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTurnPrev?.();
            }}
            className="flex items-center gap-1 text-[11px] font-serif italic hover:opacity-100 transition py-0.5 px-2 rounded opacity-70"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Turn page</span>
          </button>
        </div>

        {/* Left Page Hover Edge Cue */}
        <div
          title="Click to turn previous page"
          className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover/left:opacity-100 transition-opacity flex items-center justify-start pl-1 pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5 opacity-60" />
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

      {/* RIGHT PAGE (STRICT 50% WIDTH - WIDER CONTENT PADDING) */}
      <div
        className={`w-1/2 min-w-[50%] max-w-[50%] flex-1 basis-1/2 overflow-hidden h-full ${styles.pageBgClass} ${styles.pageTextClass} ${styles.pageShadowRightClass} relative flex flex-col justify-between p-3.5 sm:p-5 md:p-6 cursor-pointer group/right transition-colors duration-300`}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.chat-bubble-content')) return;
          onTurnNext?.();
        }}
      >
        {/* Right Page Top Header (Always Folio on left, Memory on right) */}
        <div className={`flex items-center justify-between border-b ${styles.pageBorderClass} pb-1.5 mb-2 sm:mb-3 flex-shrink-0`}>
          <span className={`text-[10px] ${styles.pageSubtextClass} font-serif italic flex-shrink-0`}>
            {rightPage ? `Folio ${rightPage.pageNumber}` : ''}
          </span>
          <span className={`text-[11px] ${styles.pageHeaderClass} tracking-widest uppercase`}>
            Memory
          </span>
        </div>

        {/* Messages Container (Strict Zero-Scroll - No scrollbars) */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-start">
          {rightPage ? (
            rightPage.messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isSenderA={msg.sender === senderNameA}
                searchQuery={searchQuery}
                senderNameA={senderNameA}
                senderNameB={senderNameB}
                theme={theme}
              />
            ))
          ) : (
            <div className={`h-full flex flex-col items-center justify-center ${styles.pageSubtextClass} font-serif italic p-6 text-center`}>
              <span className="text-2xl mb-2 opacity-40">❦</span>
              <p className="text-sm">End of conversation logs</p>
              <p className="text-xs opacity-70 mt-1">Every ending is a new beginning</p>
            </div>
          )}
        </div>

        {/* Right Page Bottom Footer */}
        <div className={`flex items-center justify-between pt-2 border-t ${styles.pageBorderClass} mt-2 ${styles.pageSubtextClass} flex-shrink-0`}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTurnNext?.();
            }}
            className="flex items-center gap-1 text-[11px] font-serif italic hover:opacity-100 transition py-0.5 px-2 rounded opacity-70"
          >
            <span>Turn page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-serif italic tracking-widest">
            {rightPage ? `— ${rightPage.pageNumber} —` : ''}
          </span>
        </div>

        {/* Right Page Hover Edge Cue */}
        <div
          title="Click to turn next page"
          className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-500/10 to-transparent opacity-0 group-hover/right:opacity-100 transition-opacity flex items-center justify-end pr-1 pointer-events-none"
        >
          <ChevronRight className="w-5 h-5 opacity-60" />
        </div>
      </div>
    </div>
  );
};
