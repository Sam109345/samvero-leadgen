'use client';

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Check, 
  Sparkles, 
  Flame, 
  Globe2, 
  DollarSign, 
  Layers, 
  Clock,
  Building2,
  Code2,
  Video,
  Palette,
  Smartphone
} from 'lucide-react';

interface FreelancerFiltersSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCountry: string;
  onCountryChange: (c: string) => void;
  businessAgeFilter: string;
  onBusinessAgeChange: (age: string) => void;
  hasWebsiteFilter: string;
  onHasWebsiteChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export default function FreelancerFiltersSidebar({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  businessAgeFilter,
  onBusinessAgeChange,
  hasWebsiteFilter,
  onHasWebsiteChange,
  categoryFilter,
  onCategoryChange,
  onResetFilters,
  totalFilteredCount,
}: FreelancerFiltersSidebarProps) {
  return (
    <aside className="w-full lg:w-72 bg-white/85 dark:bg-[#0c1424]/90 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-2xl p-5 shadow-xl transition-all space-y-6 shrink-0">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#24334a]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#007FED]" strokeWidth={1.75} />
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white font-display">Target Filters</h3>
          <span className="text-[11px] font-bold bg-[#007FED]/10 text-[#007FED] dark:text-[#38BDF8] px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
            {totalFilteredCount} Leads
          </span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-[#007FED] hover:underline font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
          Reset
        </button>
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Search Market Leads
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="e.g. Dubai Clinic, Next.js, Dental, Mobile..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-[#007FED] transition-colors"
          />
        </div>
      </div>

      {/* 2. Country / Territory (UAE added) */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          Target Market Territory
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Global Markets', count: '19' },
            { id: 'UAE', label: '🇦🇪 United Arab Emirates (Dubai, Abu Dhabi)', count: '6' },
            { id: 'Pakistan', label: '🇵🇰 Pakistan Local (LHR, KHI, ISB)', count: '5' },
            { id: 'US', label: '🇺🇸 United States (SF, Austin, Miami)', count: '4' },
            { id: 'UK', label: '🇬🇧 United Kingdom (London, Manchester)', count: '4' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                selectedCountry.toLowerCase() === item.id.toLowerCase()
                  ? 'bg-[#007FED]/10 text-[#007FED] font-bold border border-[#007FED]/30'
                  : 'hover:bg-slate-50 dark:hover:bg-[#1a2638] text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="country"
                  checked={selectedCountry.toLowerCase() === item.id.toLowerCase()}
                  onChange={() => onCountryChange(item.id)}
                  className="accent-[#007FED] w-3.5 h-3.5 cursor-pointer"
                />
                <span>{item.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">({item.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. GMB Business Age */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          GMB Operating Maturity
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Business Ages' },
            { id: 'new', label: '✨ Newly Opened (< 1 Year)', badge: 'Hot Target', badgeColor: 'bg-rose-500' },
            { id: 'rising', label: '🚀 Rising (1 - 3 Years)' },
            { id: 'established', label: '🏢 Established (3 - 5 Years)' },
            { id: 'veteran', label: '🏛️ Veteran Business (5+ Years)' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                businessAgeFilter === item.id
                  ? 'bg-[#007FED]/10 text-[#007FED] font-bold border border-[#007FED]/30'
                  : 'hover:bg-slate-50 dark:hover:bg-[#1a2638] text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="businessAge"
                  checked={businessAgeFilter === item.id}
                  onChange={() => onBusinessAgeChange(item.id)}
                  className="accent-[#007FED] w-3.5 h-3.5 cursor-pointer"
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] text-white px-1.5 py-0.5 rounded font-black ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* 4. Website Presence Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
          Website Presence Opportunity
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'no', label: '🔥 Missing Website (Instant Pitch)', count: '10' },
            { id: 'yes', label: '🌐 Has Website (Redesign & SOW)', count: '9' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                hasWebsiteFilter === item.id
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                  : 'hover:bg-slate-50 dark:hover:bg-[#1a2638] text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasWebsite"
                  checked={hasWebsiteFilter === item.id}
                  onChange={() => onHasWebsiteChange(item.id)}
                  className="accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>{item.label}</span>
              </div>
              {item.count && (
                <span className="text-[10px] text-slate-400 font-mono">({item.count})</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* 5. Category & Deliverables Required */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          Deliverable Focus
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'web', label: '💻 Web Development (Next.js)' },
            { id: 'mobile', label: '📱 Mobile Apps (14-Screen UI)' },
            { id: 'graphic', label: '🎨 Brand Identity & 6 SVG Logos' },
            { id: 'software', label: '⚙️ Software SOW & Architecture' },
            { id: 'local', label: '🏢 Local Business Digitalization' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                categoryFilter === item.id
                  ? 'bg-[#007FED]/10 text-[#007FED] font-bold border border-[#007FED]/30'
                  : 'hover:bg-slate-50 dark:hover:bg-[#1a2638] text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={categoryFilter === item.id}
                  onChange={() => onCategoryChange(item.id)}
                  className="accent-[#007FED] w-3.5 h-3.5 cursor-pointer"
                />
                <span>{item.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}
