import type { BookTheme } from '../types/chat';

export interface ThemeStyles {
  id: BookTheme;
  name: string;
  // Hardcover & outer spine
  coverBgClass: string;
  coverBorder: string;
  coverTextClass: string;
  // Open Pages
  pageBgClass: string;
  pageTextClass: string;
  pageHeaderClass: string;
  pageSubtextClass: string;
  pageBorderClass: string;
  pageShadowLeftClass: string;
  pageShadowRightClass: string;
  gutterGradientClass: string;
  // Ribbon Bookmark
  bookmarkGradientClass: string;
  // Stacked paper sides
  paperStackLeftClass: string;
  paperStackRightClass: string;
  paperStackEdgeColor: string;
  // Chat bubbles
  bubbleAClass: string;
  bubbleBClass: string;
  bubbleATextClass: string;
  bubbleBTextClass: string;
  bubbleASenderClass: string;
  bubbleBSenderClass: string;
  bubbleATimeClass: string;
  bubbleBTimeClass: string;
  bubbleAAvatarClass: string;
  bubbleBAvatarClass: string;
  // Scrollbar
  scrollbarClass: string;
}

export const THEME_CONFIGS: Record<BookTheme, ThemeStyles> = {
  'vintage-leather': {
    id: 'vintage-leather',
    name: 'Vintage Leather',
    coverBgClass: 'leather-texture border-amber-600/40 text-amber-100',
    coverBorder: '#381e0f',
    coverTextClass: 'text-amber-100',

    pageBgClass: 'paper-warm-bg',
    pageTextClass: 'text-stone-900',
    pageHeaderClass: 'text-amber-950/70',
    pageSubtextClass: 'text-stone-400',
    pageBorderClass: 'border-stone-200/80',
    pageShadowLeftClass: 'page-left-shadow border-r border-amber-900/10',
    pageShadowRightClass: 'page-right-shadow',
    gutterGradientClass: 'book-gutter-gradient',

    bookmarkGradientClass: 'from-red-800 via-rose-700 to-red-950',

    paperStackLeftClass: 'paper-stacked-left',
    paperStackRightClass: 'paper-stacked-right',
    paperStackEdgeColor: '#e4decb',

    bubbleAClass: 'bubble-tactile-a',
    bubbleBClass: 'bubble-tactile-b',
    bubbleATextClass: 'text-stone-800',
    bubbleBTextClass: 'text-stone-900',
    bubbleASenderClass: 'text-amber-900',
    bubbleBSenderClass: 'text-emerald-900',
    bubbleATimeClass: 'text-stone-400 font-serif italic',
    bubbleBTimeClass: 'text-stone-500 font-serif italic',
    bubbleAAvatarClass: 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 ring-amber-900/30',
    bubbleBAvatarClass: 'bg-gradient-to-br from-emerald-800 to-teal-950 text-emerald-100 ring-emerald-900/30',

    scrollbarClass: 'book-page-scroll',
  },

  'midnight-navy': {
    id: 'midnight-navy',
    name: 'Midnight Navy',
    coverBgClass: 'leather-navy-texture border-blue-500/40 text-blue-100',
    coverBorder: '#101a2c',
    coverTextClass: 'text-blue-100',

    pageBgClass: 'paper-midnight-bg',
    pageTextClass: 'text-slate-100',
    pageHeaderClass: 'text-blue-300 font-cinzel',
    pageSubtextClass: 'text-slate-400',
    pageBorderClass: 'border-slate-700/60',
    pageShadowLeftClass: 'page-left-shadow-dark border-r border-blue-950/60',
    pageShadowRightClass: 'page-right-shadow-dark',
    gutterGradientClass: 'book-gutter-midnight-gradient',

    bookmarkGradientClass: 'from-blue-600 via-indigo-600 to-blue-950',

    paperStackLeftClass: 'paper-stacked-midnight-left',
    paperStackRightClass: 'paper-stacked-midnight-right',
    paperStackEdgeColor: '#1e293b',

    bubbleAClass: 'bubble-tactile-midnight-a',
    bubbleBClass: 'bubble-tactile-midnight-b',
    bubbleATextClass: 'text-slate-100',
    bubbleBTextClass: 'text-blue-50',
    bubbleASenderClass: 'text-blue-300',
    bubbleBSenderClass: 'text-cyan-300',
    bubbleATimeClass: 'text-slate-400 font-serif italic',
    bubbleBTimeClass: 'text-blue-300/70 font-serif italic',
    bubbleAAvatarClass: 'bg-gradient-to-br from-slate-700 to-slate-900 text-slate-100 ring-slate-600/40',
    bubbleBAvatarClass: 'bg-gradient-to-br from-blue-700 to-indigo-950 text-blue-100 ring-blue-600/40',

    scrollbarClass: 'book-page-scroll-midnight',
  },

  'botanical-sage': {
    id: 'botanical-sage',
    name: 'Botanical Sage',
    coverBgClass: 'leather-green-texture border-emerald-400/40 text-emerald-100',
    coverBorder: '#064e3b',
    coverTextClass: 'text-emerald-100',

    pageBgClass: 'paper-sage-bg',
    pageTextClass: 'text-emerald-950',
    pageHeaderClass: 'text-emerald-900/80 font-cinzel',
    pageSubtextClass: 'text-emerald-700/60',
    pageBorderClass: 'border-emerald-800/15',
    pageShadowLeftClass: 'page-left-shadow-sage border-r border-emerald-900/15',
    pageShadowRightClass: 'page-right-shadow-sage',
    gutterGradientClass: 'book-gutter-sage-gradient',

    bookmarkGradientClass: 'from-emerald-700 via-teal-700 to-emerald-950',

    paperStackLeftClass: 'paper-stacked-sage-left',
    paperStackRightClass: 'paper-stacked-sage-right',
    paperStackEdgeColor: '#dbe4db',

    bubbleAClass: 'bubble-tactile-sage-a',
    bubbleBClass: 'bubble-tactile-sage-b',
    bubbleATextClass: 'text-emerald-950',
    bubbleBTextClass: 'text-emerald-950',
    bubbleASenderClass: 'text-emerald-900 font-bold',
    bubbleBSenderClass: 'text-teal-900 font-bold',
    bubbleATimeClass: 'text-emerald-700/60 font-serif italic',
    bubbleBTimeClass: 'text-teal-800/60 font-serif italic',
    bubbleAAvatarClass: 'bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-100 ring-emerald-900/30',
    bubbleBAvatarClass: 'bg-gradient-to-br from-teal-800 to-emerald-950 text-teal-100 ring-teal-900/30',

    scrollbarClass: 'book-page-scroll-sage',
  },
};
