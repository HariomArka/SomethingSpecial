import type { ChatMessage, ChatStats } from '../types/chat';

// Regex to detect Bengali unicode characters: U+0980 to U+09FF
export const BENGALI_REGEX = /[\u0980-\u09FF]/;

// Clean WhatsApp zero-width / bidirectional control characters that often break parsing
export function sanitizeWhatsAppText(text: string): string {
  return text
    .replace(/[\u200E\u200F\u202A-\u202E\uFEFF]/g, '') // remove directional and zero-width markers
    .replace(/\u202F/g, ' ') // replace narrow no-break space with standard space
    .replace(/\u00A0/g, ' '); // replace non-breaking space
}

// System messages to completely ignore or filter out
const SYSTEM_PATTERNS = [
  /messages and calls are end-to-end encrypted/i,
  /created group/i,
  /added you/i,
  /changed the subject/i,
  /changed this group's icon/i,
  /changed their phone number/i,
  /security code changed/i,
  /joined using this group's invite link/i,
  /left$/i,
  /removed /i,
  /you were added/i,
  /this message was deleted/i,
  /you deleted this message/i,
  /waiting for this message/i,
];

// Media indicators
const MEDIA_PATTERNS = {
  sticker: /<sticker omitted>|sticker omitted/i,
  image: /<media omitted>|image omitted|<image omitted>/i,
  video: /video omitted|<video omitted>/i,
  audio: /audio omitted|<audio omitted>|voice note omitted/i,
  document: /document omitted|<document omitted>|\.pdf\s*\(file attached\)/i,
};

/**
 * Line matcher supporting:
 * 1) Android hyphenated: "29/08/23, 1:23 pm - Sender: Message"
 * 2) iOS bracketed: "[29/08/23, 1:23:45 PM] Sender: Message"
 * 3) 24h formats: "29/08/2023, 14:30 - Sender: Message"
 */
const ANDROID_REGEX = /^(\d{1,4}[/.-]\d{1,2}[/.-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP]\.?[mM]\.?)?)\s*[-–—]\s*([^:]+?):\s*(.*)$/;
const IOS_REGEX = /^\[(\d{1,4}[/.-]\d{1,2}[/.-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP]\.?[mM]\.?)?)\]\s*([^:]+?):\s*(.*)$/;

export interface ParseResult {
  messages: ChatMessage[];
  stats: ChatStats;
  senders: string[];
}

export function parseWhatsAppChat(rawText: string): ParseResult {
  const sanitized = sanitizeWhatsAppText(rawText);
  const lines = sanitized.split(/\r?\n/);

  const rawMessages: {
    rawDate: string;
    rawTime: string;
    sender: string;
    contentLines: string[];
  }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (!line) continue;

    let match = line.match(ANDROID_REGEX);
    if (!match) {
      match = line.match(IOS_REGEX);
    }

    if (match) {
      const [, rawDate, rawTime, sender, content] = match;
      rawMessages.push({
        rawDate: rawDate.trim(),
        rawTime: rawTime.trim(),
        sender: sender.trim(),
        contentLines: [content],
      });
    } else {
      // Continuation of previous multi-line message
      if (rawMessages.length > 0) {
        rawMessages[rawMessages.length - 1].contentLines.push(line);
      }
    }
  }

  const parsedMessages: ChatMessage[] = [];
  const senderSet = new Set<string>();
  const senderStats: ChatStats['senderStats'] = {};
  const emojiFrequency: Record<string, number> = {};
  const dateFrequency: Record<string, number> = {};
  let totalWords = 0;

  // Regex to detect emojis
  const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;

  rawMessages.forEach((raw, idx) => {
    const fullContent = raw.contentLines.join('\n').trim();

    // Check if system message
    const isSystem = SYSTEM_PATTERNS.some((pat) => pat.test(fullContent) || pat.test(raw.sender));
    if (isSystem) {
      return; // Skip system messages per requirements
    }

    // Check if media attachment
    let isMedia = false;
    let mediaType: ChatMessage['mediaType'] = undefined;
    for (const [type, pattern] of Object.entries(MEDIA_PATTERNS)) {
      if (pattern.test(fullContent)) {
        isMedia = true;
        mediaType = type as ChatMessage['mediaType'];
        break;
      }
    }

    const hasBengali = BENGALI_REGEX.test(fullContent);

    // Track emojis
    const emojisFound = fullContent.match(emojiRegex);
    let emojiCount = 0;
    if (emojisFound) {
      emojiCount = emojisFound.length;
      emojisFound.forEach((emo) => {
        emojiFrequency[emo] = (emojiFrequency[emo] || 0) + 1;
      });
    }

    // Word count calculation
    const words = fullContent.split(/\s+/).filter(Boolean).length;
    totalWords += words;

    // Track sender
    senderSet.add(raw.sender);
    if (!senderStats[raw.sender]) {
      senderStats[raw.sender] = { count: 0, words: 0, emojiCount: 0 };
    }
    senderStats[raw.sender].count += 1;
    senderStats[raw.sender].words += words;
    senderStats[raw.sender].emojiCount += emojiCount;

    // Track date frequency
    dateFrequency[raw.rawDate] = (dateFrequency[raw.rawDate] || 0) + 1;

    // Parse date into approximate timestamp
    let timestamp = Date.now();
    try {
      const parts = raw.rawDate.split(/[/.-]/);
      if (parts.length === 3) {
        // usually DD/MM/YY or MM/DD/YY
        let [p1, p2, p3] = parts.map(Number);
        if (p3 < 100) p3 += 2000;
        // Default assumption DD/MM/YYYY for non-US
        const d = p1 <= 31 && p2 <= 12 ? new Date(p3, p2 - 1, p1) : new Date(p3, p1 - 1, p2);
        timestamp = d.getTime();
      }
    } catch {
      // fallback
    }

    parsedMessages.push({
      id: `msg-${idx}-${Date.now()}`,
      rawDate: raw.rawDate,
      rawTime: raw.rawTime,
      timestamp,
      sender: raw.sender,
      content: fullContent,
      isSystem: false,
      hasBengali,
      isMedia,
      mediaType,
    });
  });

  const senders = Array.from(senderSet);

  // Identify most active date
  let mostActiveDate = { date: '', count: 0 };
  for (const [date, count] of Object.entries(dateFrequency)) {
    if (count > mostActiveDate.count) {
      mostActiveDate = { date, count };
    }
  }

  // Top emojis sorted
  const topEmojis = Object.entries(emojiFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([emoji, count]) => ({ emoji, count }));

  const stats: ChatStats = {
    totalMessages: parsedMessages.length,
    totalWords,
    startDate: parsedMessages[0]?.rawDate || '',
    endDate: parsedMessages[parsedMessages.length - 1]?.rawDate || '',
    participants: senders,
    senderStats,
    topEmojis,
    mostActiveDate,
  };

  return {
    messages: parsedMessages,
    stats,
    senders,
  };
}
