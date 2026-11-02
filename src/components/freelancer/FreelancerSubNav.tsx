'use client';

import React from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Layers, 
  ShieldAlert, 
  Bookmark, 
  MessageSquare, 
  ArrowUpDown, 
  Globe2, 
  LayoutGrid, 
  AlignJustify,
  BarChart3
} from 'lucide-react';

export type LeadCategoryTab = 'all' | 'hot' | 'qualified' | 'extra' | 'needs_verification' | 'saved';

interface FreelancerSubNavProps {
  totalLeadsCount: number;
  hotCount: number;
  qualifiedCount: number;
  extraCount: number;
  needsVerificationCount: number;
  savedCount: number;
  activeCategoryTab: LeadCategoryTab;
  onSelectCategoryTab: (tab: LeadCategoryTab) => void;
  selectedCountry: string;
  onSelectCountry: (c: string) => void;
  sortBy: string;
  onSelectSortBy: (s: string) => void;
  activeView: string;
  setActiveView: (view: 'feed' | 'kanban' | 'analytics') => void;
  onOpenInbox: () => void;
  inboxCount: number;
}

export default function FreelancerSubNav({
  totalLeadsCount,
  hotCount,
  qualifiedCount,
  extraCount,
  needsVerificationCount,
  savedCount,
  activeCategoryTab,
  onSelectCategoryTab,
  selectedCountry,
  onSelectCountry,
  sortBy,
  onSelectSortBy,
  activeView,
  setActiveView,
  onOpenInbox,
  inboxCount,
}: FreelancerSubNavProps) {
  return (
    <div className="bg-white dark:bg-[#111927] border-b border-slate-200 dark:border-[#24334a] shadow-xs sticky top-16 z-40 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Lead Categories Tabs (Requirement 1 & 7) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          
          {/* All Leads */}
          <button
            onClick={() => onSelectCategoryTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategoryTab === 'all'
                ? 'bg-[#3B6FF5] text-white shadow-xs font-bold'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223147]'
            }`}
          >
            <span>All Leads</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeCategoryTab === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {totalLeadsCount}
            </span>
          </button>

          {/* Hot Leads */}
          <button
            onClick={() => onSelectCategoryTab('hot')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategoryTab === 'hot'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>Hot Leads</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeCategoryTab === 'hot'
                ? 'bg-white/20 text-white'
                : 'bg-rose-200/60 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200'
            }`}>
              {hotCount}
            </span>
          </button>

          {/* Qualified Leads */}
          <button
            onClick={() => onSelectCategoryTab('qualified')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategoryTab === 'qualified'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Qualified Leads</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeCategoryTab === 'qualified'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
            }`}>
              {qualifiedCount}
            </span>
          </button>

          {/* Extra Leads */}
          <button
            onClick={() => onSelectCategoryTab('extra')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategoryTab === 'extra'
                ? 'bg-[#3B6FF5] text-white shadow-xs font-bold'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223147]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#3B6FF5]" />
            <span>Extra Leads</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeCategoryTab === 'extra'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {extraCount}
            </span>
          </button>

          {/* Needs Verification */}
          <button
            onClick={() => onSelectCategoryTab('needs_verification')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategoryTab === 'needs_verification'
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Needs Verification</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeCategoryTab === 'needs_verification'
                ? 'bg-white/20 text-white'
                : 'bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
            }`}>
              {needsVerificationCount}
            </span>
          </button>

          {/* Saved Leads */}
          <button
            onClick={() => onSelectCategoryTab('saved')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategoryTab === 'saved'
                ? 'bg-purple-600 text-white shadow-xs font-bold'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-purple-500" />
            <span>Saved Leads</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeCategoryTab === 'saved'
                ? 'bg-white/20 text-white'
                : 'bg-purple-200/60 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200'
            }`}>
              {savedCount}
            </span>
          </button>

          {/* Messages Inbound Tab */}
          <button
            onClick={onOpenInbox}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'inbox' || activeView === 'messages'
                ? 'bg-[#3B6FF5] text-white shadow-xs font-bold'
                : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#3B6FF5]" />
            <span>Messages</span>
            {inboxCount > 0 && (
              <span className="bg-[#3B6FF5] text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {inboxCount}
              </span>
            )}
          </button>

        </div>

        {/* Right Side: Sorting Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Territory filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCountry}
              onChange={(e) => onSelectCountry(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer border-b border-transparent hover:border-slate-300"
            >
              <option value="all" className="dark:bg-[#161f2e]">🌍 All Markets</option>
              <option value="UAE" className="dark:bg-[#161f2e]">🇦🇪 UAE</option>
              <option value="Pakistan" className="dark:bg-[#161f2e]">🇵🇰 Pakistan</option>
              <option value="US" className="dark:bg-[#161f2e]">🇺🇸 United States</option>
              <option value="UK" className="dark:bg-[#161f2e]">🇬🇧 United Kingdom</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-[#24334a]" />

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer border-b border-transparent hover:border-slate-300"
            >
              <option value="newest" className="dark:bg-[#161f2e]">Newest First</option>
              <option value="quality_desc" className="dark:bg-[#161f2e]">Lead Quality (High to Low)</option>
              <option value="budget_desc" className="dark:bg-[#161f2e]">Highest Budget</option>
              <option value="budget_asc" className="dark:bg-[#161f2e]">Lowest Budget</option>
              <option value="relevance" className="dark:bg-[#161f2e]">Relevance</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-[#24334a]" />

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-[#1a2638] p-0.5 rounded-lg border border-slate-200 dark:border-[#24334a]">
            <button
              onClick={() => setActiveView('feed')}
              title="Freelancer List Feed View"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'feed'
                  ? 'bg-white dark:bg-[#3B6FF5] text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Feed</span>
            </button>

            <button
              onClick={() => setActiveView('kanban')}
              title="Kanban Pipeline Board"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'kanban'
                  ? 'bg-white dark:bg-[#3B6FF5] text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pipeline</span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              title="Funnel Analytics"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-white dark:bg-[#3B6FF5] text-slate-900 dark:text-white shadow-xs font-bold'
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
