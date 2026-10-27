'use client';

import React from 'react';
import { Filter, Sparkles, Building2, Briefcase, Globe, Calendar, RotateCcw } from 'lucide-react';

interface FiltersBarProps {
  country: string;
  setCountry: (c: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  businessAge: string;
  setBusinessAge: (age: string) => void;
  platform: string;
  setPlatform: (p: string) => void;
  hasWebsiteFilter: string;
  setHasWebsiteFilter: (h: string) => void;
  leadType: string;
  setLeadType: (t: string) => void;
  onReset: () => void;
}

export default function FiltersBar({
  country,
  setCountry,
  category,
  setCategory,
  businessAge,
  setBusinessAge,
  platform,
  setPlatform,
  hasWebsiteFilter,
  setHasWebsiteFilter,
  leadType,
  setLeadType,
  onReset,
}: FiltersBarProps) {
  return (
    <div className="bg-white/85 dark:bg-[#0c1424]/90 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-2xl p-4 sm:p-5 shadow-xl transition-all space-y-3.5">
      {/* Top row: Type toggles + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Lead Source Segment (All vs GMB vs Jobs) */}
        <div className="flex items-center bg-slate-100/90 dark:bg-[#111c2e] p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setLeadType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              leadType === 'all'
                ? 'bg-white dark:bg-[#1a2942] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Opportunities
          </button>
          <button
            onClick={() => setLeadType('gmb')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              leadType === 'gmb'
                ? 'bg-white dark:bg-[#1a2942] text-[#007FED] dark:text-[#38BDF8] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>GMB Listings</span>
          </button>
          <button
            onClick={() => setLeadType('job')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              leadType === 'job'
                ? 'bg-white dark:bg-[#1a2942] text-[#007FED] dark:text-[#38BDF8] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Marketplace Jobs</span>
          </button>
        </div>

        {/* Hot Toggle: Filter for businesses without a website */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setHasWebsiteFilter(hasWebsiteFilter === 'no-site' ? 'all' : 'no-site')
            }
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              hasWebsiteFilter === 'no-site'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>No Website Only (Hot Pitch)</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium hover:underline"
            title="Reset Filters"
          >
            <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Country Filter (Includes UAE) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Country / Market
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200/90 dark:border-[#24334a] text-xs font-semibold rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-[#007FED] transition"
          >
            <option value="all">🌍 All Markets</option>
            <option value="UAE">🇦🇪 United Arab Emirates (UAE)</option>
            <option value="Pakistan">🇵🇰 Pakistan (Local Market)</option>
            <option value="US">🇺🇸 United States</option>
            <option value="UK">🇬🇧 United Kingdom</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Skill & Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200/90 dark:border-[#24334a] text-xs font-semibold rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-[#007FED] transition"
          >
            <option value="all">⚡ All Categories</option>
            <option value="Web Development">💻 Web Development (Next.js)</option>
            <option value="Graphic Design">🎨 Brand Identity & 6 SVG Logos</option>
            <option value="Mobile App">📱 Mobile App (14 Screens)</option>
            <option value="Software Architecture">⚙️ Software SOW & Specs</option>
            <option value="Local Business">🏢 Local Business / GMB</option>
          </select>
        </div>

        {/* Business Age Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Business Age
          </label>
          <select
            value={businessAge}
            onChange={(e) => setBusinessAge(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200/90 dark:border-[#24334a] text-xs font-semibold rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-[#007FED] transition"
          >
            <option value="all">⏳ Any Operating Age</option>
            <option value="new">✨ Newly Opened (&lt; 1 yr)</option>
            <option value="1-3">🌱 Rising (1 - 3 yrs)</option>
            <option value="3-5">⭐ Established (3 - 5 yrs)</option>
            <option value="5+">🏆 Veteran (5+ yrs)</option>
          </select>
        </div>

        {/* Platform / Source */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Platform / Source
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200/90 dark:border-[#24334a] text-xs font-semibold rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-[#007FED] transition"
          >
            <option value="all">🌐 All Channels ({'20+ Platforms'})</option>
            <optgroup label="Main Freelancing Platforms">
              <option value="Upwork">Upwork</option>
              <option value="Fiverr">Fiverr</option>
              <option value="Freelancer.com">Freelancer.com</option>
              <option value="PeoplePerHour">PeoplePerHour</option>
              <option value="Guru">Guru</option>
              <option value="Contra">Contra</option>
            </optgroup>
            <optgroup label="Direct Client & Remote Platforms">
              <option value="LinkedIn">LinkedIn</option>
              <option value="Wellfound">Wellfound (AngelList)</option>
              <option value="We Work Remotely">We Work Remotely</option>
              <option value="Remote OK">Remote OK</option>
            </optgroup>
            <optgroup label="Design & Creative Platforms">
              <option value="Dribbble">Dribbble</option>
              <option value="Behance">Behance</option>
              <option value="99designs">99designs</option>
            </optgroup>
            <optgroup label="Specialized Developer Networks">
              <option value="Toptal">Toptal</option>
              <option value="Codeable">Codeable</option>
              <option value="Truelancer">Truelancer</option>
            </optgroup>
            <optgroup label="Local Business & Regional Portals">
              <option value="Google My Business">Google My Business</option>
              <option value="Bark">Bark</option>
              <option value="Thumbtack">Thumbtack</option>
              <option value="Rozee.pk">Rozee.pk (Pakistan)</option>
              <option value="Bayt">Bayt (GCC/Middle East)</option>
              <option value="Dubizzle">Dubizzle (UAE)</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
