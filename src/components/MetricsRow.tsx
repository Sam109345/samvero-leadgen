'use client';

import React from 'react';
import { 
  DollarSign, 
  Users, 
  Sparkles, 
  Globe, 
  Mail, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Flame 
} from 'lucide-react';

interface MetricsRowProps {
  totalLeads: number;
  newBusinesses: number;
  noWebsiteCount: number;
  pitchedCount: number;
  sitesCount: number;
}

export default function MetricsRow({
  totalLeads,
  newBusinesses,
  noWebsiteCount,
  pitchedCount,
  sitesCount,
}: MetricsRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. Value Pool Card (White with pink accent border like Image 1) */}
      <div className="bg-white rounded-2xl p-4 border-2 border-rose-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
        <span className="text-xs font-bold text-slate-500">Pipeline Budget Pool</span>
        <div className="my-1.5">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            $48.5K
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          <span>+8.4% this week</span>
        </div>
      </div>

      {/* 2. Total Leads (Solid Deep Royal Blue like Image 1) */}
      <div className="bg-[#1877F2] rounded-2xl p-4 text-white shadow-md shadow-blue-500/20 flex flex-col justify-between hover:shadow-lg transition">
        <span className="text-xs font-bold text-blue-100">Total Leads Ingested</span>
        <div className="my-1.5">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {totalLeads}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-200">
          <span>&bull;</span>
          <span>Aggregated multi-channel</span>
        </div>
      </div>

      {/* 3. Missing Website (Cyan Card like Image 1) */}
      <div className="bg-[#0284C7] rounded-2xl p-4 text-white shadow-md shadow-sky-500/20 flex flex-col justify-between hover:shadow-lg transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-100">Hot No-Website Leads</span>
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
        </div>
        <div className="my-1.5">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {noWebsiteCount}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-sky-200">
          <TrendingUp className="w-3 h-3 text-emerald-300" />
          <span>Prime pitch targets</span>
        </div>
      </div>

      {/* 4. Newly Opened (< 1 yr) (Emerald Green Card like Image 1) */}
      <div className="bg-[#059669] rounded-2xl p-4 text-white shadow-md shadow-emerald-500/20 flex flex-col justify-between hover:shadow-lg transition">
        <span className="text-xs font-bold text-emerald-100">Newly Opened (&lt;1 yr)</span>
        <div className="my-1.5">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {newBusinesses}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-200">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>High conversion potential</span>
        </div>
      </div>

      {/* 5. Pitches Sent (Coral / Rose Red Card like Image 1) */}
      <div className="bg-[#E11D48] rounded-2xl p-4 text-white shadow-md shadow-rose-500/20 flex flex-col justify-between hover:shadow-lg transition">
        <span className="text-xs font-bold text-rose-100">Pitches Dispatched</span>
        <div className="my-1.5">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {pitchedCount}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-rose-200">
          <span>&bull;</span>
          <span>72% open rate</span>
        </div>
      </div>

      {/* 6. Sites Generated (Violet / Purple Card like Image 1) */}
      <div className="bg-[#7C3AED] rounded-2xl p-4 text-white shadow-md shadow-purple-500/20 flex flex-col justify-between hover:shadow-lg transition">
        <span className="text-xs font-bold text-purple-100">Auto Sites Synthesized</span>
        <div className="my-1.5">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {sitesCount}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-purple-200">
          <span>&bull;</span>
          <span>Ready to deploy live</span>
        </div>
      </div>
    </div>
  );
}
