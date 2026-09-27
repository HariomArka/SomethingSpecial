import React from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  totalMatches: number;
  currentMatchIndex: number;
  onPrevMatch: () => void;
  onNextMatch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  totalMatches,
  currentMatchIndex,
  onPrevMatch,
  onNextMatch,
}) => {
  return (
    <div className="relative flex items-center bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-full px-3 py-1.5 shadow-lg transition-all focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-500/20 w-full max-w-xs md:max-w-md">
      <Search className="w-4 h-4 text-amber-400/80 mr-2 flex-shrink-0" />

      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search in English or বাংলা (e.g. pdf, আজকে)..."
        className="w-full bg-transparent text-sm text-stone-200 placeholder-stone-400/70 focus:outline-none font-sans"
      />

      {query && (
        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          {totalMatches > 0 ? (
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-full">
              {currentMatchIndex + 1}/{totalMatches}
            </span>
          ) : (
            <span className="text-[11px] font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
              0 found
            </span>
          )}

          {totalMatches > 1 && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={onPrevMatch}
                title="Previous match"
                className="p-1 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded transition"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onNextMatch}
                title="Next match"
                className="p-1 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded transition"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => onQueryChange('')}
            title="Clear search"
            className="p-1 text-stone-400 hover:text-rose-400 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
