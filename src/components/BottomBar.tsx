'use client';

import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ExternalLink, 
  Zap, 
  CheckCircle2,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { Lead } from '@/types';

interface BottomBarProps {
  secondsLeft: number;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  latestLead?: Lead | null;
  onQuickInspectLead: (lead: Lead) => void;
  onOpenSettings: () => void;
  totalLeadsCount: number;
}

export default function BottomBar({
  secondsLeft,
  isStreaming,
  onToggleStreaming,
  soundEnabled,
  onToggleSound,
  latestLead,
  onQuickInspectLead,
  onOpenSettings,
  totalLeadsCount,
}: BottomBarProps) {
  const progressPercent = ((10 - secondsLeft) / 10) * 100;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A1628]/95 backdrop-blur-md border-t border-slate-800/90 text-white py-2.5 px-3 sm:px-6 shadow-2xl">
      <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: 10s Ingestion Timer Ticker (Requested Feature) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isStreaming ? 'bg-cyan-400' : 'bg-slate-500'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isStreaming ? 'bg-cyan-500' : 'bg-slate-600'}`} />
            </span>
            <span className="text-xs font-bold text-slate-200">
              Live Ingestion:
            </span>
            <span className="font-mono text-xs font-black text-cyan-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700">
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
            </span>
          </div>

          {/* Mini Progress Bar for 10s */}
          <div className="hidden sm:block w-28 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/80">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={onToggleStreaming}
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
          >
            {isStreaming ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Latest Incoming Lead Real-time Alert */}
        {latestLead && (
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 px-3.5 py-1 rounded-full border border-slate-800 text-xs text-slate-300 max-w-xl truncate">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
            <span className="font-semibold text-slate-400 shrink-0">Latest:</span>
            <strong className="text-white truncate">{latestLead.businessName}</strong>
            <span className="text-slate-500">&bull;</span>
            <span className="text-cyan-300 text-[11px] shrink-0">{latestLead.city}, {latestLead.country}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
              {latestLead.businessAge.label}
            </span>
            <button
              onClick={() => onQuickInspectLead(latestLead)}
              className="text-[11px] font-bold text-[#1877F2] hover:underline shrink-0 ml-1 flex items-center gap-0.5"
            >
              <span>Inspect</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Right: Sound toggle & API safety indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
            title="Toggle executive chime on incoming leads"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[11px]">Chime On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-[11px]">Muted</span>
              </>
            )}
          </button>

          <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800/80 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>APIs Safe &bull; {totalLeadsCount} Leads Live</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
