export interface ChatMessage {
  id: string;
  rawDate: string;        // e.g. "29/08/23"
  rawTime: string;        // e.g. "1:23 pm"
  timestamp: number;      // Unix timestamp if parsable, else fallback
  sender: string;         // e.g. "Soumily 🙃"
  content: string;        // e.g. "Ajk ki 2nd pdf ta puro poria diyach?"
  isSystem: boolean;      // filtered or meta
  hasBengali: boolean;    // contains Bengali Unicode characters
  isMedia: boolean;       // <Media omitted> etc.
  mediaType?: 'image' | 'video' | 'audio' | 'sticker' | 'document';
}

export interface ChatStats {
  totalMessages: number;
  totalWords: number;
  startDate: string;
  endDate: string;
  participants: string[];
  senderStats: Record<string, { count: number; words: number; emojiCount: number }>;
  topEmojis: { emoji: string; count: number }[];
  mostActiveDate: { date: string; count: number };
}

export interface BookPage {
  pageNumber: number; // 1-based
  dateHeading?: string; // Chapter title, e.g., "29 August 2023"
  messages: ChatMessage[];
  isLeft: boolean;
  charCount: number;
}

export interface SearchMatch {
  messageId: string;
  pageNumber: number;
  sender: string;
  textSnippet: string;
  matchIndex: number;
}

export type BookTheme = 'vintage-leather' | 'midnight-navy' | 'botanical-sage';
