import React, { useState } from 'react';
import type { ChatMessage, BookTheme } from '../types/chat';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { ImageIcon, FileText, Music, Video, Smile } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
  isSenderA: boolean;
  searchQuery: string;
  senderNameA: string;
  senderNameB: string;
  theme?: BookTheme;
}

// Smart Avatar: Checks for /Arka.jpg /soumily.jpg and falls back to 'A' / 'S' badge
const UserAvatar: React.FC<{
  sender: string;
  initial: string;
  avatarClass: string;
}> = ({ sender, initial, avatarClass }) => {
  const [candidateIdx, setCandidateIdx] = useState(0);

  const isArka = sender.toLowerCase().includes('arka') || initial === 'A';
  const isSoumily = sender.toLowerCase().includes('soumily') || initial === 'S';

  const candidates = isArka
    ? ['/Arka.jpg', '/Arka.jpeg', '/arka.jpg', '/arka.jpeg', '/Arka.png']
    : isSoumily
    ? ['/soumily.jpg', '/Soumily.jpg', '/soumily.jpeg', '/Soumily.jpeg', '/soumily.png']
    : [];

  if (candidates.length > 0 && candidateIdx < candidates.length) {
    return (
      <img
        src={candidates[candidateIdx]}
        alt={initial}
        onError={() => setCandidateIdx((prev) => prev + 1)}
        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover shadow-sm ring-1 ring-black/20 flex-shrink-0 mb-0.5"
      />
    );
  }

  return (
    <div
      title={sender}
      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold shadow-sm ring-1 flex-shrink-0 mb-0.5 ${avatarClass}`}
    >
      {initial}
    </div>
  );
};

// Function to safely highlight matched words in Bengali & English
function highlightSearchText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) {
    return text;
  }

  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (part.toLowerCase() === trimmed.toLowerCase()) {
      return (
        <mark
          key={i}
          className="bg-amber-300 text-stone-900 font-semibold px-1 py-0.5 rounded shadow-sm border-b-2 border-amber-500"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isSenderA,
  searchQuery,
  theme = 'vintage-leather',
}) => {
  const styles = THEME_CONFIGS[theme] || THEME_CONFIGS['vintage-leather'];
  const initial = message.sender.slice(0, 1).toUpperCase();

  // Render media attachments if any
  const renderMediaBadge = () => {
    if (!message.isMedia) return null;
    return (
      <div
        className={`flex items-center gap-1.5 mt-1 py-0.5 px-2 rounded-lg text-[11px] font-sans ${
          theme === 'midnight-navy'
            ? 'bg-slate-800/80 border border-slate-700 text-slate-300'
            : 'bg-stone-100 border border-stone-200 text-stone-700'
        }`}
      >
        {message.mediaType === 'image' && <ImageIcon className="w-3.5 h-3.5 text-amber-500" />}
        {message.mediaType === 'document' && <FileText className="w-3.5 h-3.5 text-blue-500" />}
        {message.mediaType === 'audio' && <Music className="w-3.5 h-3.5 text-purple-400" />}
        {message.mediaType === 'video' && <Video className="w-3.5 h-3.5 text-emerald-400" />}
        {message.mediaType === 'sticker' && <Smile className="w-3.5 h-3.5 text-rose-400" />}
        <span className="italic font-medium">Attachment ({message.mediaType || 'Media'})</span>
      </div>
    );
  };

  return (
    <div
      className={`group flex items-end gap-1.5 sm:gap-2 mb-2 transition-all duration-150 chat-bubble-content ${
        isSenderA ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Sender A Avatar (Left) */}
      {isSenderA && (
        <UserAvatar
          sender={message.sender}
          initial={initial}
          avatarClass={styles.bubbleAAvatarClass}
        />
      )}

      {/* Bubble Container (NO NAME AT TOP - ONLY TIMESTAMP - CONSISTENT WIDE CARD WIDTH) */}
      <div
        className={`min-w-[125px] sm:min-w-[145px] max-w-[88%] relative rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 transition-transform duration-150 hover:-translate-y-0.5 ${
          isSenderA
            ? `${styles.bubbleAClass} rounded-bl-xs ${styles.bubbleATextClass}`
            : `${styles.bubbleBClass} rounded-br-xs ${styles.bubbleBTextClass}`
        }`}
      >
        {/* Timestamp header (Sender name removed per user requirement) */}
        <div className="flex items-center justify-end mb-0.5 leading-none">
          <span
            className={`text-[12px] sm:text-[12px] tracking-wider whitespace-nowrap ${
              isSenderA ? styles.bubbleATimeClass : styles.bubbleBTimeClass
            }`}
          >
            {message.rawTime}
          </span>
        </div>

        {/* Message Content */}
        <div
          className={`text-[18px] sm:text-[18px] leading-snug whitespace-pre-wrap break-words ${
            message.hasBengali
              ? 'font-bengali font-normal tracking-normal'
              : 'font-chat font-normal'
          }`}
        >
          {highlightSearchText(message.content, searchQuery)}
        </div>

        {/* Media indicator badge */}
        {renderMediaBadge()}
      </div>

      {/* Sender B Avatar (Right) */}
      {!isSenderA && (
        <UserAvatar
          sender={message.sender}
          initial={initial}
          avatarClass={styles.bubbleBAvatarClass}
        />
      )}
    </div>
  );
};
