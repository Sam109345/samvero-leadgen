'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Compass, 
  Briefcase, 
  Building2, 
  Layers, 
  Sparkles, 
  Mail, 
  SlidersHorizontal,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSettings: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-white/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Search */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1877F2] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <span className="font-extrabold text-lg tracking-tighter">S</span>
            </div>
            <div className="hidden min-[420px]:block">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-slate-900 to-[#1877F2] bg-clip-text text-transparent">
                SAMVERO
              </span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                Lead Acquisition
              </span>
            </div>
          </Link>

          {/* Search Input (Meta styled) */}
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, cities, keywords..."
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-full border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Center: Meta-style Icon Tabs (Desktop) */}
        <div className="hidden md:flex items-center justify-center gap-1 sm:gap-2 flex-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition relative ${
              activeTab === 'feed'
                ? 'text-[#1877F2] bg-blue-50/80 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>All Leads</span>
            {activeTab === 'feed' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1877F2] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('gmb')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition relative ${
              activeTab === 'gmb'
                ? 'text-[#1877F2] bg-blue-50/80 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>GMB Explorer</span>
            {activeTab === 'gmb' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1877F2] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition relative ${
              activeTab === 'jobs'
                ? 'text-[#1877F2] bg-blue-50/80 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Marketplace Jobs</span>
            {activeTab === 'jobs' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1877F2] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition relative ${
              activeTab === 'builder'
                ? 'text-[#1877F2] bg-blue-50/80 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Site Builder</span>
            {activeTab === 'builder' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Right: Status Pill & Settings */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold hover:bg-emerald-100 transition shadow-sm"
            title="View API Quotas & Keys status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">APIs Active</span>
            <Zap className="w-3 h-3 text-emerald-600" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            title="API Keys & Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            SM
          </div>
        </div>
      </div>
    </header>
  );
}
