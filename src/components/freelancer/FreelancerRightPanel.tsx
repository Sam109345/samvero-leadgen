'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  MessageSquare, 
  Flame, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Layers, 
  Clock, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Lead } from '@/types';

interface FreelancerRightPanelProps {
  secondsLeft: number;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  latestLead: Lead | null;
  onOpenInbox: () => void;
  inboxUnreadCount: number;
  onInspectLead: (lead: Lead) => void;
  totalLeadsCount: number;
  noWebsiteCount: number;
  newGmbCount: number;
  onSelectTag: (tag: string) => void;
}

export default function FreelancerRightPanel({
  secondsLeft,
  isStreaming,
  onToggleStreaming,
  soundEnabled,
  onToggleSound,
  latestLead,
  onOpenInbox,
  inboxUnreadCount,
  onInspectLead,
  totalLeadsCount,
  noWebsiteCount,
  newGmbCount,
  onSelectTag,
}: FreelancerRightPanelProps) {
  const [simulating, setSimulating] = useState(false);

  // Quick simulation trigger
  const handleSimulateReply = async () => {
    try {
      setSimulating(true);
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate' }),
      });
      const data = await res.json();
      if (data.success) {
        onOpenInbox();
      }
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setSimulating(false);
    }
  };

  const progressPercent = Math.max(0, Math.min(100, ((10 - secondsLeft) / 10) * 100));

  return (
    <aside className="w-full lg:w-80 space-y-4">
      
      {/* 1. Live Lead Ingestion Radar (10s Countdown) */}
      <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#24334a]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isStreaming ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              )}
            </span>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Live Ingestion Radar
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Chime toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Pause/Resume Stream */}
            <button
              onClick={onToggleStreaming}
              title={isStreaming ? 'Pause 10s Lead Stream' : 'Resume 10s Lead Stream'}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded"
            >
              {isStreaming ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </button>
          </div>
        </div>

        {/* 10-Second Progress Bar */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500 dark:text-slate-400">Next Lead Arrival:</span>
            <span className="font-mono font-bold text-[#007FED]">
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-[#0d141e] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#007FED] to-cyan-400 h-full transition-all duration-300 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            Streaming opportunities from Google My Business, Bark, Upwork & LinkedIn job boards.
          </p>
        </div>

        {/* Latest Arrived Lead Card */}
        {latestLead && (
          <div 
            onClick={() => onInspectLead(latestLead)}
            className="mt-3 p-2.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-200/80 dark:border-[#24334a] rounded-md cursor-pointer hover:border-[#007FED] transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">⚡ JUST ARRIVED</span>
              <span>{latestLead.timeAgo || 'Just now'}</span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
              {latestLead.title}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              🏢 {latestLead.businessName} • {latestLead.city}
            </p>
          </div>
        )}
      </div>

      {/* 2. Client Responses & Inbound Replies (User's specific core question!) */}
      <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#24334a]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Client Responses
            </h4>
          </div>
          <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
            {inboxUnreadCount} Active
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {/* Dr. Zeeshan Ali reply preview */}
          <div 
            onClick={onOpenInbox}
            className="p-2.5 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-md cursor-pointer hover:border-rose-400 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-100">Dr. Zeeshan Ali (Founder)</span>
              <span className="text-[10px] text-rose-600 font-bold bg-rose-100 dark:bg-rose-900/60 px-1.5 rounded">
                Booking
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
              "Loved the mobile preview! Can we do a quick Zoom call on Friday?"
            </p>
          </div>

          {/* Elena Rostova reply preview */}
          <div 
            onClick={onOpenInbox}
            className="p-2.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-md cursor-pointer hover:border-[#007FED] transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-100">Elena Rostova (CognitiveScale)</span>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-100 dark:bg-blue-900/60 px-1.5 rounded">
                Pricing
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
              "The sample UI looks sharp. Turnaround time for Next.js revamp?"
            </p>
          </div>
        </div>

        {/* Action Buttons for Client Inbound Replies */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#24334a] flex items-center gap-2">
          <button
            onClick={onOpenInbox}
            className="flex-1 bg-[#007FED] hover:bg-[#0067c6] text-white text-xs font-semibold py-2 rounded-md transition-colors text-center"
          >
            Open Full Inbox
          </button>

          <button
            onClick={handleSimulateReply}
            disabled={simulating}
            title="Simulate realistic client response"
            className="px-2.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-md transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-500 ${simulating ? 'animate-spin' : ''}`} />
            <span>Simulate</span>
          </button>
        </div>
      </div>

      {/* 3. Marketplace Metrics (Clean Freelancer Style - NOT neon solid blocks!) */}
      <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-4 shadow-xs transition-colors">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-[#24334a]">
          Marketplace Stats
        </h4>

        <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-100 dark:border-[#24334a] rounded-md">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Budget Pool</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
              $48,500
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-100 dark:border-[#24334a] rounded-md">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Leads</span>
            <span className="text-base font-bold text-[#007FED] font-mono mt-0.5 block">
              {totalLeadsCount}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-100 dark:border-[#24334a] rounded-md">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">No Website</span>
            <span className="text-base font-bold text-amber-600 font-mono mt-0.5 block">
              {noWebsiteCount}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-100 dark:border-[#24334a] rounded-md">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">New GMB</span>
            <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">
              {newGmbCount}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Top In-Demand Skills */}
      <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-4 shadow-xs transition-colors">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-[#24334a]">
          Top Skills In Demand
        </h4>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {[
            'Website Design',
            'Next.js 14',
            'Mobile App',
            'TikTok Reels',
            'Graphic Logo',
            'Google My Business',
            'WhatsApp CRM',
            'WordPress'
          ].map((skill) => (
            <button
              key={skill}
              onClick={() => onSelectTag(skill)}
              className="text-xs bg-slate-100 dark:bg-[#1a2638] text-slate-600 dark:text-slate-300 hover:bg-[#007FED] hover:text-white px-2.5 py-1 rounded transition-colors font-medium"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
