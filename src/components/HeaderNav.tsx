import React, { useState, useRef, useEffect } from 'react';
import type { BookTheme } from '../types/chat';
import { SearchBar } from './SearchBar';
import { Volume2, VolumeX, Palette, BarChart3, ArrowLeftRight } from 'lucide-react';

interface HeaderNavProps {
  theme: BookTheme;
  onThemeChange: (theme: BookTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalMatches: number;
  currentMatchIndex: number;
  onPrevMatch: () => void;
  onNextMatch: () => void;
  onOpenStats: () => void;
  onSwapSenders?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  theme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  searchQuery,
  onSearchChange,
  totalMatches,
  currentMatchIndex,
  onPrevMatch,
  onNextMatch,
  onOpenStats,
  onSwapSenders,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex-shrink-0 w-full h-12 md:h-14 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 flex items-center justify-between z-30">
      {/* SEARCH BAR (BENGALI & ENGLISH) */}
      <div className="flex-1 max-w-lg">
        <SearchBar
          query={searchQuery}
          onQueryChange={onSearchChange}
          totalMatches={totalMatches}
          currentMatchIndex={currentMatchIndex}
          onPrevMatch={onPrevMatch}
          onNextMatch={onNextMatch}
        />
      </div>

      {/* RIGHT SIDE TOOLS: THEME, ANALYSIS, SOUND */}
      <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
        {/* Swap Sides (compact icon) */}
        {onSwapSenders && (
          <button
            type="button"
            onClick={onSwapSenders}
            title="Swap Sender Sides (Left / Right)"
            className="p-2 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-300 hover:border-amber-500/50 transition"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-400/90" />
          </button>
        )}

        {/* Theme Selector (Click-Toggled & Persistent until selection/outside click) */}
        <div className="relative" ref={themeRef}>
          <button
            type="button"
            onClick={() => setIsThemeOpen((prev) => !prev)}
            title="Change Book Binding Theme"
            className={`p-2 rounded-lg border transition flex items-center gap-1.5 ${
              isThemeOpen
                ? 'bg-stone-800 border-amber-500/70 text-amber-300'
                : 'bg-stone-900 border-stone-700/80 text-stone-300 hover:text-amber-300 hover:border-amber-500/50'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-xs font-cinzel text-stone-300">Theme</span>
          </button>

          {isThemeOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-stone-900/98 backdrop-blur-md border border-stone-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-cinzel">
              <div className="text-[10px] text-stone-400 px-2 py-1 uppercase tracking-wider font-sans font-semibold">
                Binding Theme
              </div>
              <button
                type="button"
                onClick={() => {
                  onThemeChange('vintage-leather');
                  setIsThemeOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between transition ${
                  theme === 'vintage-leather' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#381e0f] border border-amber-500/60" />
                  <span>Vintage Leather</span>
                </div>
                {theme === 'vintage-leather' && <span className="text-amber-400 text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  onThemeChange('midnight-navy');
                  setIsThemeOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between transition ${
                  theme === 'midnight-navy' ? 'bg-blue-950 text-blue-300 font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#101a2c] border border-blue-400/60" />
                  <span>Midnight Navy</span>
                </div>
                {theme === 'midnight-navy' && <span className="text-blue-400 text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  onThemeChange('botanical-sage');
                  setIsThemeOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between transition ${
                  theme === 'botanical-sage' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0e2a22] border border-emerald-400/60" />
                  <span>Botanical Sage</span>
                </div>
                {theme === 'botanical-sage' && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Analysis / Stats Button */}
        <button
          type="button"
          onClick={onOpenStats}
          title="Conversation Intelligence & Statistics"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-200 hover:text-amber-300 hover:border-amber-500/50 text-xs font-cinzel tracking-wider transition"
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Analysis</span>
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Page Turn Sounds' : 'Enable Page Turn Sounds'}
          className="p-2 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-300 transition"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-500" />
          )}
        </button>
      </div>
    </header>
  );
};
