'use client';

import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Globe2, 
  MessageSquare, 
  Layers, 
  ListFilter, 
  ArrowUpDown, 
  SlidersHorizontal,
  LayoutGrid,
  BarChart3,
  AlignJustify
} from 'lucide-react';

interface FreelancerSubNavProps {
  totalLeadsCount: number;
  noWebsiteCount: number;
  newGmbCount: number;
  uaeCount?: number;
  pkCount: number;
  usCount: number;
  ukCount: number;
  inboxCount: number;
  selectedPipelineFilter: string;
  onSelectPipelineFilter: (f: string) => void;
  selectedCountry: string;
  onSelectCountry: (c: string) => void;
  sortBy: string;
  onSelectSortBy: (s: string) => void;
  activeView: string;
  setActiveView: (view: 'kanban' | 'analytics' | 'feed' | 'gmb' | 'jobs' | 'builder' | 'inbox' | 'audit') => void;
  onOpenInbox: () => void;
}

export default function FreelancerSubNav({
  totalLeadsCount,
  noWebsiteCount,
  newGmbCount,
  uaeCount = 6,
  pkCount,
  usCount,
  ukCount,
  inboxCount,
  selectedPipelineFilter,
  onSelectPipelineFilter,
  selectedCountry,
  onSelectCountry,
  sortBy,
  onSelectSortBy,
  activeView,
  setActiveView,
  onOpenInbox,
}: FreelancerSubNavProps) {
  return (
    <div className="bg-white dark:bg-[#111927] border-b border-slate-200 dark:border-[#24334a] shadow-xs sticky top-16 z-40 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Quick Filter Pills (Classic Freelancer Project Sub-filters) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          
          {/* All Leads */}
          <button
            onClick={() => {
              onSelectPipelineFilter('all');
              onSelectCountry('all');
              if (activeView !== 'feed') setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedPipelineFilter === 'all' && selectedCountry === 'all' && activeView === 'feed'
                ? 'bg-[#007FED] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223147]'
            }`}
          >
            <span>All Projects</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              selectedPipelineFilter === 'all' && selectedCountry === 'all' && activeView === 'feed'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {totalLeadsCount}
            </span>
          </button>

          {/* Missing Website (Prime Targets) */}
          <button
            onClick={() => {
              onSelectPipelineFilter('no_website');
              if (activeView !== 'feed') setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedPipelineFilter === 'no_website' && activeView === 'feed'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Missing Website</span>
            <span className="bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {noWebsiteCount}
            </span>
          </button>

          {/* Newly Opened GMB */}
          <button
            onClick={() => {
              onSelectPipelineFilter('new_gmb');
              if (activeView !== 'feed') setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedPipelineFilter === 'new_gmb' && activeView === 'feed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Newly Opened (&lt;1 yr)</span>
            <span className="bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {newGmbCount}
            </span>
          </button>

          {/* UAE (Dubai, Abu Dhabi) */}
          <button
            onClick={() => {
              onSelectCountry(selectedCountry === 'UAE' ? 'all' : 'UAE');
              if (activeView !== 'feed') setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCountry === 'UAE' && activeView === 'feed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223147]'
            }`}
          >
            <span>🇦🇪 UAE</span>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {uaeCount}
            </span>
          </button>

          {/* Pakistan Local */}
          <button
            onClick={() => {
              onSelectCountry(selectedCountry === 'Pakistan' ? 'all' : 'Pakistan');
              if (activeView !== 'feed') setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCountry === 'Pakistan' && activeView === 'feed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223147]'
            }`}
          >
            <span>🇵🇰 Pakistan</span>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {pkCount}
            </span>
          </button>

          {/* United States */}
          <button
            onClick={() => {
              onSelectCountry(selectedCountry === 'US' ? 'all' : 'US');
              if (activeView !== 'feed') setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCountry === 'US' && activeView === 'feed'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223147]'
            }`}
          >
            <span>🇺🇸 US</span>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {usCount}
            </span>
          </button>

          {/* United Kingdom */}
          <button
            onClick={() => {
              onSelectCountry(selectedCountry === 'UK' ? 'all' : 'UK');
              if (activeView !== 'feed') setActiveView('feed');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCountry === 'UK' && activeView === 'feed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223147]'
            }`}
          >
            <span>🇬🇧 UK</span>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {ukCount}
            </span>
          </button>

          {/* Client Responses Inbound Tab */}
          <button
            onClick={onOpenInbox}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeView === 'inbox'
                ? 'bg-[#ff0055] text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
            <span>Client Replies</span>
            <span className="bg-[#ff0055] text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {inboxCount}
            </span>
          </button>

        </div>

        {/* Right Side: Sorting Dropdown & View Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer border-b border-transparent hover:border-slate-300"
            >
              <option value="newest" className="dark:bg-[#161f2e]">Newest First</option>
              <option value="budget_desc" className="dark:bg-[#161f2e]">Highest Budget</option>
              <option value="budget_asc" className="dark:bg-[#161f2e]">Lowest Budget</option>
              <option value="age_asc" className="dark:bg-[#161f2e]">Business Age (Newest)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-[#24334a]" />

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-[#1a2638] p-0.5 rounded-md border border-slate-200 dark:border-[#24334a]">
            <button
              onClick={() => setActiveView('feed')}
              title="Freelancer List Feed View"
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                activeView === 'feed'
                  ? 'bg-white dark:bg-[#007FED] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Feed</span>
            </button>

            <button
              onClick={() => setActiveView('kanban')}
              title="Kanban Pipeline Board"
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                activeView === 'kanban'
                  ? 'bg-white dark:bg-[#007FED] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kanban</span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              title="Performance Funnel & Wave Analytics"
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                activeView === 'analytics'
                  ? 'bg-white dark:bg-[#007FED] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Analytics</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
