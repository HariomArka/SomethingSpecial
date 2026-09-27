import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookPage, BookTheme, ChatStats } from '../types/chat';
import { BookCover } from './BookCover';
import { BookPreface } from './BookPreface';
import { BookPageSpread } from './BookPageSpread';
import { soundManager } from '../utils/audio';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { ChevronLeft, ChevronRight, BookOpen, RotateCcw } from 'lucide-react';

interface Interactive3DBookProps {
  pages: BookPage[];
  stats: ChatStats;
  theme: BookTheme;
  senderNameA: string;
  senderNameB: string;
  searchQuery: string;
  spreadIndex: number;
  onSpreadIndexChange: (newIndex: number) => void;
}

export const Interactive3DBook: React.FC<Interactive3DBookProps> = ({
  pages,
  stats,
  theme,
  senderNameA,
  senderNameB,
  searchQuery,
  spreadIndex,
  onSpreadIndexChange,
}) => {
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [jumpInput, setJumpInput] = useState<string>('');

  const totalChatSpreads = Math.ceil(pages.length / 2);
  const maxSpreadIndex = totalChatSpreads;

  // Turn page logic
  const handleNext = useCallback(() => {
    if (spreadIndex >= maxSpreadIndex || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('next');
    soundManager.playPageFlip();
    onSpreadIndexChange(spreadIndex + 1);
    setTimeout(() => setIsFlipping(false), 380);
  }, [spreadIndex, maxSpreadIndex, isFlipping, onSpreadIndexChange]);

  const handlePrev = useCallback(() => {
    if (spreadIndex <= -1 || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('prev');
    soundManager.playPageFlip();
    onSpreadIndexChange(spreadIndex - 1);
    setTimeout(() => setIsFlipping(false), 380);
  }, [spreadIndex, isFlipping, onSpreadIndexChange]);

  // Handle direct page jump submit
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpInput.trim(), 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pages.length) {
      soundManager.playPageFlip(true);
      const targetSpread = Math.ceil(pageNum / 2);
      setFlipDirection(targetSpread >= spreadIndex ? 'next' : 'prev');
      onSpreadIndexChange(targetSpread);
      setJumpInput('');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        onSpreadIndexChange(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onSpreadIndexChange]);

  // Get current left & right pages
  const leftPageIndex = spreadIndex > 0 ? (spreadIndex - 1) * 2 : -1;
  const rightPageIndex = spreadIndex > 0 ? (spreadIndex - 1) * 2 + 1 : -1;
  const leftPage = leftPageIndex >= 0 && leftPageIndex < pages.length ? pages[leftPageIndex] : null;
  const rightPage = rightPageIndex >= 0 && rightPageIndex < pages.length ? pages[rightPageIndex] : null;

  const styles = THEME_CONFIGS[theme] || THEME_CONFIGS['vintage-leather'];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-1 sm:p-2 select-none overflow-hidden">
      {/* 3D BOOK CONTAINER (STATIONARY - NO MOUSE WOBBLE) */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
        {/* FLOATING LEFT PAGE TURN ARROW (OUTSIDE BOOK) */}
        {spreadIndex > -1 && (
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFlipping}
            title="Previous Page (←)"
            className="absolute left-2 md:left-6 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-stone-700/80 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-amber-400" />
          </button>
        )}

        {/* FLOATING RIGHT PAGE TURN ARROW (OUTSIDE BOOK) */}
        {spreadIndex < maxSpreadIndex && (
          <button
            type="button"
            onClick={handleNext}
            disabled={isFlipping}
            title="Next Page (→)"
            className="absolute right-2 md:right-6 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-stone-700/80 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 text-amber-400" />
          </button>
        )}

        {/* STATIC PHYSICAL BOOK HARDCOVER & SPREAD */}
        <div
          className={`relative rounded-xl book-ambient-shadow transition-all duration-300 ${
            spreadIndex === -1 ? 'p-1' : 'p-1.5 sm:p-2 md:p-3'
          }`}
          style={{
            backgroundColor: styles.coverBorder,
            border: `3px solid ${styles.coverBorder}`,
          }}
        >
          {/* Stacked paper edge visible on left and right sides */}
          {spreadIndex !== -1 && (
            <>
              {/* Left page thickness stack */}
              <div
                className={`absolute top-2 bottom-2 -left-2 w-2 rounded-l-xs ${styles.paperStackLeftClass} pointer-events-none transition-colors duration-300`}
                style={{
                  backgroundColor: styles.paperStackEdgeColor,
                }}
              />
              {/* Right page thickness stack */}
              <div
                className={`absolute top-2 bottom-2 -right-2 w-2 rounded-r-xs ${styles.paperStackRightClass} pointer-events-none transition-colors duration-300`}
                style={{
                  backgroundColor: styles.paperStackEdgeColor,
                }}
              />
              {/* Top & Bottom page stack ridges */}
              <div
                className="absolute -top-1.5 left-4 right-4 h-1.5 rounded-t-xs opacity-70 pointer-events-none transition-colors duration-300"
                style={{ backgroundColor: styles.paperStackEdgeColor }}
              />
              <div
                className="absolute -bottom-1.5 left-4 right-4 h-1.5 rounded-b-xs opacity-80 pointer-events-none shadow-md transition-colors duration-300"
                style={{ backgroundColor: styles.paperStackEdgeColor }}
              />
            </>
          )}

          {/* PAGE CONTENT CONTAINER WITH 3D FLIP ANIMATIONS */}
          <div className={`relative overflow-hidden rounded-lg transform-style-3d ${styles.pageBgClass} transition-colors duration-300`}>
            <AnimatePresence mode="wait" custom={flipDirection}>
              {spreadIndex === -1 ? (
                // COVER
                <motion.div
                  key="book-cover"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <BookCover
                    stats={stats}
                    theme={theme}
                    onOpen={() => {
                      soundManager.playPageFlip();
                      onSpreadIndexChange(0);
                    }}
                  />
                </motion.div>
              ) : spreadIndex === 0 ? (
                // PREFACE & DEDICATION
                <motion.div
                  key="book-preface"
                  initial={{ opacity: 0, rotateY: flipDirection === 'next' ? 12 : -12 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: flipDirection === 'next' ? -12 : 12 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  <BookPreface
                    stats={stats}
                    theme={theme}
                    onBegin={() => {
                      soundManager.playPageFlip();
                      onSpreadIndexChange(1);
                    }}
                    onPrev={() => {
                      soundManager.playPageFlip();
                      onSpreadIndexChange(-1);
                    }}
                  />
                </motion.div>
              ) : (
                // CHAT SPREAD
                <motion.div
                  key={`spread-${spreadIndex}`}
                  initial={{
                    opacity: 0,
                    rotateY: flipDirection === 'next' ? 10 : -10,
                  }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{
                    opacity: 0,
                    rotateY: flipDirection === 'next' ? -10 : 10,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <BookPageSpread
                    leftPage={leftPage}
                    rightPage={rightPage}
                    senderNameA={senderNameA}
                    senderNameB={senderNameB}
                    searchQuery={searchQuery}
                    theme={theme}
                    onTurnNext={handleNext}
                    onTurnPrev={handlePrev}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* COMPACT BOTTOM NAVIGATION BAR (ALWAYS VISIBLE INSIDE VIEWPORT) */}
      <div className="flex-shrink-0 w-full max-w-4xl py-2 px-3 flex items-center justify-between gap-2 z-20">
        {/* PREVIOUS PAGE BUTTON */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={spreadIndex <= -1 || isFlipping}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg font-cinzel text-xs font-bold tracking-wider uppercase transition-all duration-150 select-none ${
            spreadIndex <= -1
              ? 'opacity-40 cursor-not-allowed bg-stone-900/60 text-stone-500 border border-stone-800'
              : 'bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 shadow-md active:translate-y-0.5'
          }`}
        >
          <ChevronLeft className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* CENTER POSITION & DIRECT PAGE JUMP */}
        <div className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700 text-xs font-serif shadow-lg">
          <button
            type="button"
            onClick={() => {
              soundManager.playPageFlip();
              onSpreadIndexChange(-1);
            }}
            title="Return to Cover"
            className="p-1 hover:text-amber-300 text-stone-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="text-stone-300 whitespace-nowrap">
            {spreadIndex === -1 ? (
              <span className="text-amber-400 font-cinzel tracking-wider">Book Cover</span>
            ) : spreadIndex === 0 ? (
              <span className="text-amber-300">Dedication</span>
            ) : (
              <span>
                Pages <strong className="text-amber-300 font-mono">{leftPage?.pageNumber || '?'}</strong> &amp;{' '}
                <strong className="text-amber-300 font-mono">{rightPage?.pageNumber || 'End'}</strong> of{' '}
                <span className="text-stone-400 font-mono">{pages.length.toLocaleString()}</span>
              </span>
            )}
          </span>

          {spreadIndex > 0 && (
            <button
              type="button"
              onClick={() => {
                soundManager.playPageFlip();
                onSpreadIndexChange(0);
              }}
              title="View Preface & Dedication"
              className="p-1 hover:text-amber-300 text-stone-400 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Page Jump Input for large archives */}
          {pages.length > 2 && (
            <form onSubmit={handleJumpSubmit} className="hidden md:flex items-center gap-1 border-l border-stone-700 pl-2 ml-1">
              <span className="text-[10px] text-stone-400 font-sans">Go to:</span>
              <input
                type="number"
                min={1}
                max={pages.length}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                placeholder="Page"
                className="w-14 bg-stone-800 text-amber-200 text-[11px] font-mono px-1.5 py-0.5 rounded border border-stone-700 focus:outline-none focus:border-amber-500"
              />
            </form>
          )}
        </div>

        {/* NEXT PAGE BUTTON */}
        <button
          type="button"
          onClick={handleNext}
          disabled={spreadIndex >= maxSpreadIndex || isFlipping}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg font-cinzel text-xs font-bold tracking-wider uppercase transition-all duration-150 select-none ${
            spreadIndex >= maxSpreadIndex
              ? 'opacity-40 cursor-not-allowed bg-stone-900/60 text-stone-500 border border-stone-800'
              : 'bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 border border-amber-500/30 shadow-md active:translate-y-0.5'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 text-amber-200" />
        </button>
      </div>
    </div>
  );
};
