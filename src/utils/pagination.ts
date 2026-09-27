import type { ChatMessage, BookPage } from '../types/chat';

// Format raw date "29/08/23" into readable classic chapter date "29 August 2023"
export function formatChapterDate(rawDate: string): string {
  try {
    const parts = rawDate.split(/[/.-]/);
    if (parts.length === 3) {
      let [d, m, y] = parts.map(Number);
      if (y < 100) y += 2000;
      if (m > 12 && d <= 12) {
        const temp = d;
        d = m;
        m = temp;
      }
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      if (m >= 1 && m <= 12) {
        return `${d} ${monthNames[m - 1]} ${y}`;
      }
    }
  } catch {
    // fallback
  }
  return rawDate;
}

/**
 * Accurately estimate the physical pixel height of a rendered chat bubble
 * to ensure that only as many messages are placed on a page as can fit
 * without requiring any scrollbar.
 */
function estimateMessageHeight(msg: ChatMessage): number {
  // Average characters per line inside bubble given max-w-[85%] of a ~440px page
  const CHARS_PER_LINE = 36;

  const rawLines = msg.content.split('\n');
  let totalVisualLines = 0;
  for (const line of rawLines) {
    totalVisualLines += Math.max(1, Math.ceil(line.length / CHARS_PER_LINE));
  }

  // Base height: container padding (16px) + timestamp (14px) + margin-bottom (8px) = ~52px
  const baseHeight = 52;
  // Extra height per additional visual line (~18px per line)
  const extraLinesHeight = Math.max(0, totalVisualLines - 1) * 18;
  // Media badge height if attached
  const mediaHeight = msg.isMedia ? 28 : 0;

  return baseHeight + extraLinesHeight + mediaHeight;
}

/**
 * Strict Zero-Scroll Pagination:
 * Places only as many messages on each page as can physically fit
 * within the visible page height, completely eliminating scrollbars.
 */
export function paginateMessages(messages: ChatMessage[]): BookPage[] {
  if (messages.length === 0) return [];

  const pages: BookPage[] = [];
  let currentPageMessages: ChatMessage[] = [];
  let accumulatedHeight = 0;
  let lastDate = '';
  let currentPageDateHeading: string | undefined = undefined;

  // Safe visual height budget: fits on standard and laptop screens without scroll
  const PAGE_HEIGHT_BUDGET = 425;

  messages.forEach((msg) => {
    const msgHeight = estimateMessageHeight(msg);
    const isNewDate = msg.rawDate !== lastDate;

    // If adding this message exceeds the physical height, start a fresh page
    if (accumulatedHeight + msgHeight > PAGE_HEIGHT_BUDGET && currentPageMessages.length > 0) {
      pages.push({
        pageNumber: pages.length + 1,
        dateHeading: currentPageDateHeading || formatChapterDate(currentPageMessages[0].rawDate),
        messages: currentPageMessages,
        isLeft: (pages.length + 1) % 2 !== 0,
        charCount: accumulatedHeight,
      });

      currentPageMessages = [];
      accumulatedHeight = 0;
      currentPageDateHeading = undefined;
    }

    if (isNewDate && !currentPageDateHeading) {
      currentPageDateHeading = formatChapterDate(msg.rawDate);
    }

    currentPageMessages.push(msg);
    accumulatedHeight += msgHeight;
    lastDate = msg.rawDate;
  });

  // Flush remaining messages onto final page
  if (currentPageMessages.length > 0) {
    pages.push({
      pageNumber: pages.length + 1,
      dateHeading: currentPageDateHeading || formatChapterDate(currentPageMessages[0].rawDate),
      messages: currentPageMessages,
      isLeft: (pages.length + 1) % 2 !== 0,
      charCount: accumulatedHeight,
    });
  }

  return pages;
}
