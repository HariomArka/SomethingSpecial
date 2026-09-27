import { useState, useMemo, useCallback, useEffect } from 'react';
import { parseWhatsAppChat } from './utils/whatsappParser';
import { paginateMessages } from './utils/pagination';
import { SAMPLE_WHATSAPP_CHAT } from './utils/sampleData';
import type { BookTheme, SearchMatch } from './types/chat';
import { HeaderNav } from './components/HeaderNav';
import { Interactive3DBook } from './components/Interactive3DBook';
import { StatsModal } from './components/StatsModal';
import { soundManager } from './utils/audio';

export function App() {
  // Start with default sample until /chat.txt loads
  const initialParse = useMemo(() => parseWhatsAppChat(SAMPLE_WHATSAPP_CHAT), []);

  const [messages, setMessages] = useState(initialParse.messages);
  const [stats, setStats] = useState(initialParse.stats);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(true);

  // Participant assignments: Sender A (Left) vs Sender B (Right)
  const [senderA, setSenderA] = useState<string>(initialParse.senders[0] || 'Sender A');
  const [senderB, setSenderB] = useState<string>(initialParse.senders[1] || 'Sender B');

  // Aesthetic settings
  const [theme, setTheme] = useState<BookTheme>('vintage-leather');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  // Search in English and Bengali
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentMatchIdx, setCurrentMatchIdx] = useState<number>(0);
  const [spreadIndex, setSpreadIndex] = useState<number>(-1);

  // Automatically load /public/chat.txt on launch
  useEffect(() => {
    let isSubscribed = true;
    fetch('/chat.txt')
      .then((res) => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then((rawText) => {
        if (!isSubscribed) return;
        if (rawText && rawText.trim().length > 10) {
          const parsed = parseWhatsAppChat(rawText);
          if (parsed.messages.length > 0) {
            setMessages(parsed.messages);
            setStats(parsed.stats);

            // Sort senders by message frequency
            const sorted = [...parsed.senders].sort((a, b) => {
              return (parsed.stats.senderStats[b]?.count || 0) - (parsed.stats.senderStats[a]?.count || 0);
            });
            setSenderA(sorted[0] || 'Sender 1');
            setSenderB(sorted[1] || sorted[0] || 'Sender 2');
          }
        }
      })
      .catch(() => {
        // Fallback to sample data already loaded
      })
      .finally(() => {
        if (isSubscribed) {
          setIsLoadingFile(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Paginate messages into book pages
  const pages = useMemo(() => paginateMessages(messages), [messages]);

  // Search indexing across pages (capped at 500 matches for high performance with 150k messages)
  const searchMatches = useMemo<SearchMatch[]>(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];

    const query = searchQuery.trim().toLowerCase();
    const results: SearchMatch[] = [];

    for (const page of pages) {
      for (const msg of page.messages) {
        if (msg.content.toLowerCase().includes(query)) {
          results.push({
            messageId: msg.id,
            pageNumber: page.pageNumber,
            sender: msg.sender,
            textSnippet: msg.content.slice(0, 50),
            matchIndex: results.length,
          });
          if (results.length >= 500) break;
        }
      }
      if (results.length >= 500) break;
    }

    return results;
  }, [pages, searchQuery]);

  // Handle live search changes and jump directly to first match
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentMatchIdx(0);
    if (query.trim().length >= 2) {
      const q = query.trim().toLowerCase();
      for (const page of pages) {
        if (page.messages.some((m) => m.content.toLowerCase().includes(q))) {
          soundManager.playPageFlip(true);
          setSpreadIndex(Math.ceil(page.pageNumber / 2));
          break;
        }
      }
    }
  };

  const handleNextMatch = useCallback(() => {
    if (searchMatches.length === 0) return;
    const nextIdx = (currentMatchIdx + 1) % searchMatches.length;
    setCurrentMatchIdx(nextIdx);
    const match = searchMatches[nextIdx];
    if (match) {
      soundManager.playPageFlip(true);
      setSpreadIndex(Math.ceil(match.pageNumber / 2));
    }
  }, [currentMatchIdx, searchMatches]);

  const handlePrevMatch = useCallback(() => {
    if (searchMatches.length === 0) return;
    const prevIdx = (currentMatchIdx - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIdx(prevIdx);
    const match = searchMatches[prevIdx];
    if (match) {
      soundManager.playPageFlip(true);
      setSpreadIndex(Math.ceil(match.pageNumber / 2));
    }
  }, [currentMatchIdx, searchMatches]);

  // Toggle sender orientation
  const handleSwapSenders = () => {
    setSenderA(senderB);
    setSenderB(senderA);
  };

  // Sync sound setting with manager
  const handleToggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="h-screen h-[100dvh] w-screen overflow-hidden flex flex-col bg-[#121110] text-[#e8e4dc] relative">
      {/* AMBIENT WARM STUDY LIGHTING */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#121110]/60 to-[#0a0908]" />
      </div>

      {/* MINIMAL NAVBAR (SEARCH, THEME, ANALYSIS - NO HEADINGS, NO UPLOAD) */}
      <HeaderNav
        theme={theme}
        onThemeChange={setTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        totalMatches={searchMatches.length}
        currentMatchIndex={currentMatchIdx}
        onPrevMatch={handlePrevMatch}
        onNextMatch={handleNextMatch}
        onOpenStats={() => setIsStatsOpen(true)}
        onSwapSenders={handleSwapSenders}
      />

      {/* MAIN BOOK STAGE (FITS SCREEN WITHOUT WINDOW SCROLLBAR) */}
      <main className="relative z-10 flex-1 min-h-0 w-full overflow-hidden flex flex-col items-center justify-center">
        {isLoadingFile ? (
          <div className="flex flex-col items-center justify-center gap-3 text-stone-300 font-serif italic">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
            <p className="text-sm">Binding your WhatsApp archive into book pages...</p>
          </div>
        ) : (
          <Interactive3DBook
            pages={pages}
            stats={stats}
            theme={theme}
            senderNameA={senderA}
            senderNameB={senderB}
            searchQuery={searchQuery}
            spreadIndex={spreadIndex}
            onSpreadIndexChange={setSpreadIndex}
          />
        )}
      </main>

      {/* STATS ANALYTICS MODAL */}
      <StatsModal
        stats={stats}
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </div>
  );
}

export default App;
