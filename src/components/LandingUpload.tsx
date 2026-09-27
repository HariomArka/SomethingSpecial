import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { SAMPLE_WHATSAPP_CHAT } from '../utils/sampleData';

interface LandingUploadProps {
  onDataLoaded: (rawText: string) => void;
}

export const LandingUpload: React.FC<LandingUploadProps> = ({ onDataLoaded }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      setErrorMsg('Please upload a standard WhatsApp exported .txt file.');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content && content.trim()) {
        onDataLoaded(content);
      } else {
        setErrorMsg('The selected file appears to be empty.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Error reading file. Please try again.');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please paste your WhatsApp conversation lines above.');
      return;
    }
    setErrorMsg('');
    onDataLoaded(pastedText);
  };

  const handleLoadSample = () => {
    setErrorMsg('');
    onDataLoaded(SAMPLE_WHATSAPP_CHAT);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-auto px-4 py-8">
      {/* GLAMOUR TITLE */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-serif tracking-widest uppercase mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Transform Chats into Living Literature</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-stone-100 tracking-wide gold-foil-text mb-3">
          The WhatsApp Chronicle
        </h1>

        <p className="font-serif italic text-stone-300/80 text-sm md:text-base max-w-lg mx-auto">
          Bind your cherished conversations into a tactile 3D interactive leatherbound book.
          Supports English, বাংলা (Bengali), and multi-line memories.
        </p>
      </div>

      {/* GLASSMORPHIC CARD CONTAINER */}
      <div className="bg-stone-900/70 backdrop-blur-xl border border-stone-700/50 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* MODE TABS */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold tracking-wider transition ${
                activeTab === 'upload'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Upload .txt
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold tracking-wider transition ${
                activeTab === 'paste'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Paste Text
            </button>
          </div>

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-700/40 to-amber-900/40 border border-amber-500/40 text-amber-200 hover:bg-amber-800/40 text-xs font-serif italic transition shadow hover:scale-105"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Load Soumily &amp; Arka Demo</span>
          </button>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-sans">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: FILE DROPZONE */}
        {activeTab === 'upload' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 group ${
              isDragging
                ? 'border-amber-400 bg-amber-950/20 scale-[1.01]'
                : 'border-stone-700/80 hover:border-amber-500/60 hover:bg-stone-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-16 h-16 rounded-full bg-stone-800/80 border border-stone-700 group-hover:border-amber-500/50 group-hover:scale-110 flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-md">
              <UploadCloud className="w-8 h-8 text-amber-400 group-hover:text-amber-300 transition-colors" />
            </div>

            <p className="text-base font-serif font-medium text-stone-200 mb-1">
              Drop your WhatsApp <span className="text-amber-400 font-mono">_chat.txt</span> file here
            </p>

            <p className="text-xs text-stone-400/80 font-sans mb-4">
              or click to browse from your device
            </p>

            <div className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 font-mono bg-stone-800/60 px-3 py-1 rounded-full border border-stone-700/50">
              <FileText className="w-3 h-3 text-amber-400" />
              <span>Format: 29/08/23, 1:23 pm - Name: Message</span>
            </div>
          </div>
        )}

        {/* TAB 2: PASTE TEXT */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste raw WhatsApp export lines here...
Example:
29/08/23, 1:23 pm - Soumily 🙃: Ajk ki 2nd pdf ta puro poria diyach?
29/08/23, 1:25 pm - Arka: Na re, page 14 obdi dekhechi!"
              className="w-full bg-stone-950/80 border border-stone-700 rounded-xl p-4 text-xs font-mono text-stone-300 placeholder-stone-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition resize-none"
            />

            <button
              type="button"
              onClick={handlePasteSubmit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 font-cinzel font-bold text-xs tracking-widest uppercase shadow-lg transition active:scale-[0.99]"
            >
              Parse &amp; Bind into 3D Book
            </button>
          </div>
        )}

        {/* BOTTOM METADATA / PRIVACY & GUIDE */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-1.5 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-sans text-[11px]">
              100% In-Browser Privacy. No chat data ever leaves your device.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 text-amber-400/80 hover:text-amber-300 text-[11px] font-serif italic underline underline-offset-2 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to export from WhatsApp?</span>
          </button>
        </div>

        {/* EXPORT INSTRUCTION GUIDE ACCORDION */}
        {showGuide && (
          <div className="mt-4 p-4 rounded-xl bg-stone-950/90 border border-stone-800 text-stone-300 text-xs font-sans space-y-2">
            <h4 className="font-cinzel text-amber-300 font-bold text-[11px] tracking-wider uppercase">
              How to Export Chat from WhatsApp:
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-[11px] text-stone-400">
              <div className="p-2 rounded bg-stone-900 border border-stone-800">
                <strong className="text-amber-200 block mb-1">Android:</strong>
                Open Chat → Tap 3 dots (top right) → More → <em>Export Chat</em> → Choose <em>Without Media</em>.
              </div>
              <div className="p-2 rounded bg-stone-900 border border-stone-800">
                <strong className="text-amber-200 block mb-1">iPhone:</strong>
                Open Chat → Tap Contact Name at top → Scroll down to <em>Export Chat</em> → Select <em>Without Media</em>.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
