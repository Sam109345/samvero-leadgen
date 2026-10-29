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
  selectedPlatform?: string;
  onPlatformChange?: (p: string) => void;
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
  selectedPlatform = 'all',
  onPlatformChange,
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

      {/* 1.5. Lead Source Platform (50+ Platforms) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#007FED]" strokeWidth={1.75} />
            Lead Source Platform
          </label>
          {selectedPlatform !== 'all' && (
            <button
              onClick={() => onPlatformChange && onPlatformChange('all')}
              className="text-[10px] text-[#007FED] hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange && onPlatformChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs font-semibold rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#007FED] transition"
        >
          <option value="all">🌐 All Channels (50+ Platforms)</option>
          <optgroup label="Main Freelancing Platforms">
            <option value="Upwork">Upwork</option>
            <option value="Fiverr">Fiverr</option>
            <option value="Freelancer.com">Freelancer.com</option>
            <option value="PeoplePerHour">PeoplePerHour</option>
            <option value="Guru">Guru</option>
            <option value="Contra">Contra</option>
          </optgroup>
          <optgroup label="Freelancing Marketplaces">
            <option value="Truelancer">Truelancer</option>
            <option value="Workana">Workana</option>
            <option value="99designs">99designs</option>
            <option value="DesignCrowd">DesignCrowd</option>
            <option value="Toptal">Toptal</option>
            <option value="Gun.io">Gun.io</option>
            <option value="Arc">Arc.dev</option>
            <option value="Lemon.io">Lemon.io</option>
            <option value="Braintrust">Braintrust</option>
            <option value="Mayple">Mayple</option>
            <option value="MarketerHire">MarketerHire</option>
            <option value="Legiit">Legiit</option>
            <option value="SEOClerks">SEOClerks</option>
            <option value="Codeable">Codeable</option>
            <option value="We Work Remotely">We Work Remotely</option>
          </optgroup>
          <optgroup label="Design & Creative Platforms">
            <option value="Behance">Behance</option>
            <option value="Dribbble">Dribbble</option>
            <option value="DesignHill">DesignHill</option>
            <option value="Working Not Working">Working Not Working</option>
            <option value="Creativepool">Creativepool</option>
            <option value="Coroflot">Coroflot</option>
          </optgroup>
          <optgroup label="Remote Jobs & Direct Clients">
            <option value="LinkedIn">LinkedIn</option>
            <option value="Wellfound">Wellfound</option>
            <option value="FlexJobs">FlexJobs</option>
            <option value="Remote OK">Remote OK</option>
            <option value="Remotive">Remotive</option>
            <option value="Working Nomads">Working Nomads</option>
            <option value="Dynamite Jobs">Dynamite Jobs</option>
            <option value="Jooble">Jooble</option>
            <option value="Indeed">Indeed</option>
            <option value="Glassdoor">Glassdoor</option>
            <option value="SimplyHired">SimplyHired</option>
          </optgroup>
          <optgroup label="Specialized Platforms">
            <option value="WPHired">WPHired</option>
            <option value="ProBlogger Jobs">ProBlogger Jobs</option>
            <option value="WriterAccess">WriterAccess</option>
            <option value="Voices">Voices</option>
            <option value="Voice123">Voice123</option>
            <option value="Malt">Malt</option>
            <option value="Taskrabbit">Taskrabbit</option>
          </optgroup>
          <optgroup label="Regional & Local Portals">
            <option value="Google My Business">Google My Business</option>
            <option value="Rozee.pk">Rozee.pk (Pakistan)</option>
            <option value="Mustakbil">Mustakbil (Pakistan)</option>
            <option value="Bayt">Bayt (Middle East)</option>
            <option value="Naukrigulf">Naukrigulf (Gulf/UAE)</option>
            <option value="Dubizzle">Dubizzle (UAE)</option>
            <option value="Bark">Bark.com</option>
            <option value="Thumbtack">Thumbtack</option>
          </optgroup>
          <optgroup label="Paid Social & Ad Networks">
            <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
            <option value="Facebook Ads">Facebook Ads Manager</option>
            <option value="Instagram Ads">Instagram Sponsored Ads</option>
          </optgroup>
        </select>
      </div>

      {/* 2. Country / Territory */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          Target Market Territory
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Global Markets' },
            { id: 'UAE', label: '🇦🇪 United Arab Emirates (Dubai, Abu Dhabi)' },
            { id: 'Pakistan', label: '🇵🇰 Pakistan Local (LHR, KHI, ISB)' },
            { id: 'US', label: '🇺🇸 United States (SF, Austin, Miami)' },
            { id: 'UK', label: '🇬🇧 United Kingdom (London, Manchester)' },
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
            { id: 'no', label: '🔥 Missing Website (Instant Pitch)' },
            { id: 'yes', label: '🌐 Has Website (Redesign & SOW)' },
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
            { id: 'wordpress', label: '🌐 WordPress & WooCommerce' },
            { id: 'meta-ads', label: '📢 Meta Ads & Social Funnels' },
            { id: 'social', label: '📱 Social Media & Reels Creation' },
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
