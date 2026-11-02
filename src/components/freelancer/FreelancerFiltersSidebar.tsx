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
  Layers, 
  Clock,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  MapPin
} from 'lucide-react';

export interface FreelancerFiltersSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCountry: string;
  onCountryChange: (c: string) => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  selectedPlatform?: string;
  onPlatformChange?: (p: string) => void;
  businessAgeFilter: string;
  onBusinessAgeChange: (age: string) => void;
  hasWebsiteFilter: string;
  onHasWebsiteChange: (val: string) => void;
  hasEmailFilter?: string;
  onHasEmailChange?: (val: string) => void;
  hasPhoneFilter?: string;
  onHasPhoneChange?: (val: string) => void;
  qualityFilter?: string;
  onQualityChange?: (val: string) => void;
  verificationFilter?: string;
  onVerificationChange?: (val: string) => void;
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
  selectedCity = '',
  onCityChange,
  selectedPlatform = 'all',
  onPlatformChange,
  businessAgeFilter,
  onBusinessAgeChange,
  hasWebsiteFilter,
  onHasWebsiteChange,
  hasEmailFilter = 'all',
  onHasEmailChange,
  hasPhoneFilter = 'all',
  onHasPhoneChange,
  qualityFilter = 'all',
  onQualityChange,
  verificationFilter = 'all',
  onVerificationChange,
  categoryFilter,
  onCategoryChange,
  onResetFilters,
  totalFilteredCount,
}: FreelancerFiltersSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = React.useState(false);

  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all space-y-4 shrink-0">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#3B6FF5]" strokeWidth={2} />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Target Filters</h3>
          <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#3B6FF5] px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            {totalFilteredCount} Leads
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="lg:hidden text-[11px] text-[#3B6FF5] hover:bg-blue-50 dark:hover:bg-slate-800 font-bold px-2 py-1 rounded-lg border border-blue-200 dark:border-slate-700 transition"
          >
            {mobileExpanded ? 'Hide ▲' : 'Filters ▼'}
          </button>
          <button
            onClick={onResetFilters}
            className="text-xs text-[#3B6FF5] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Search Market Leads
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. Dubai Clinic, Next.js, Dental..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#3B6FF5] transition-colors"
          />
        </div>
      </div>

      <div className={`${mobileExpanded ? 'block' : 'hidden'} lg:block space-y-4`}>

      {/* 1.2 City Search */}
      {onCityChange && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            Filter by City
          </label>
          <input
            type="text"
            placeholder="e.g. Dubai, Lahore, Austin, London..."
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 rounded-xl px-3 py-2 focus:outline-none focus:border-[#3B6FF5] transition-colors"
          />
        </div>
      )}

      {/* 1.5. Lead Source Platform */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#3B6FF5]" />
            Lead Source
          </label>
          {selectedPlatform !== 'all' && (
            <button
              onClick={() => onPlatformChange && onPlatformChange('all')}
              className="text-[10px] text-[#3B6FF5] hover:underline font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange && onPlatformChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3B6FF5] transition"
        >
          <option value="all">🌐 All Channels (70+ Platforms)</option>
          
          <optgroup label="⭐ High Priority (Agency Core)">
            <option value="Upwork">Upwork (Direct Projects)</option>
            <option value="Fiverr">Fiverr (Service Orders)</option>
            <option value="LinkedIn">LinkedIn (Decision-Makers)</option>
            <option value="PeoplePerHour">PeoplePerHour (Web/Creative)</option>
            <option value="Contra">Contra (Portfolio Acquisition)</option>
            <option value="Apollo">Apollo.io (Business Contacts)</option>
            <option value="Clutch">Clutch (Agency Discovery)</option>
            <option value="Google Maps">Google Maps (Missing Websites)</option>
          </optgroup>

          <optgroup label="1. Freelancing Marketplaces">
            <option value="Freelancer.com">Freelancer.com (Live API)</option>
            <option value="Guru">Guru</option>
            <option value="Toptal">Toptal</option>
            <option value="Workana">Workana</option>
            <option value="Truelancer">Truelancer</option>
            <option value="99designs">99designs</option>
            <option value="DesignCrowd">DesignCrowd</option>
            <option value="Legiit">Legiit</option>
            <option value="Bark">Bark</option>
            <option value="Mayple">Mayple</option>
            <option value="Codeable">Codeable</option>
          </optgroup>

          <optgroup label="2. B2B Lead Generation & Outreach">
            <option value="ZoomInfo">ZoomInfo</option>
            <option value="Lusha">Lusha</option>
            <option value="Lead411">Lead411</option>
            <option value="UpLead">UpLead</option>
            <option value="Snov.io">Snov.io</option>
            <option value="Hunter.io">Hunter.io</option>
            <option value="Cognism">Cognism</option>
            <option value="RocketReach">RocketReach</option>
            <option value="LeadIQ">LeadIQ</option>
            <option value="GetProspect">GetProspect</option>
            <option value="Clay">Clay</option>
            <option value="Instantly">Instantly</option>
            <option value="Smartlead">Smartlead</option>
          </optgroup>

          <optgroup label="3. Business Directories & Discovery">
            <option value="Google My Business">Google My Business</option>
            <option value="Yelp">Yelp</option>
            <option value="Yellow Pages">Yellow Pages</option>
            <option value="Crunchbase">Crunchbase</option>
            <option value="Product Hunt">Product Hunt</option>
            <option value="GoodFirms">GoodFirms</option>
            <option value="DesignRush">DesignRush</option>
            <option value="Sortlist">Sortlist</option>
            <option value="Y Combinator">Y Combinator</option>
            <option value="G2">G2</option>
            <option value="Capterra">Capterra</option>
          </optgroup>

          <optgroup label="4. Social Media Acquisition">
            <option value="Reddit">Reddit (Live RFP)</option>
            <option value="Facebook">Facebook Groups</option>
            <option value="Instagram">Instagram Business</option>
            <option value="X (Twitter)">X / Twitter</option>
            <option value="Discord">Discord Communities</option>
            <option value="Behance">Behance</option>
            <option value="Dribbble">Dribbble</option>
            <option value="Indie Hackers">Indie Hackers</option>
            <option value="Makers">Makers</option>
          </optgroup>

          <optgroup label="5. Remote Tech Contracts">
            <option value="Remote OK">Remote OK (Live API)</option>
            <option value="Remotive">Remotive (Live API)</option>
            <option value="We Work Remotely">We Work Remotely</option>
            <option value="Wellfound">Wellfound</option>
            <option value="FlexJobs">FlexJobs</option>
            <option value="Working Nomads">Working Nomads</option>
            <option value="Dynamite Jobs">Dynamite Jobs</option>
            <option value="Jobspresso">Jobspresso</option>
            <option value="Arc">Arc</option>
            <option value="Lemon.io">Lemon.io</option>
            <option value="Braintrust">Braintrust</option>
            <option value="Catalant">Catalant</option>
          </optgroup>

          <optgroup label="6. Specialized Web Development">
            <option value="Storetasker">Storetasker (Shopify)</option>
            <option value="Shopify Partners">Shopify Partners</option>
            <option value="Webflow Experts">Webflow Experts</option>
            <option value="Wix Marketplace">Wix Marketplace</option>
            <option value="Squarespace">Squarespace</option>
            <option value="Envato">Envato</option>
            <option value="Awwwards">Awwwards</option>
          </optgroup>

          <optgroup label="7. Pakistan Market Platforms">
            <option value="Rozee.pk">Rozee.pk</option>
            <option value="Mustakbil">Mustakbil</option>
            <option value="BrightSpyre">BrightSpyre</option>
            <option value="LinkedIn Pakistan">LinkedIn Pakistan</option>
            <option value="OLX Pakistan">OLX Pakistan</option>
          </optgroup>
        </select>
      </div>

      {/* 2. Country / Territory */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
          Country / Territory
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Global Markets' },
            { id: 'UAE', label: '🇦🇪 UAE (Dubai, Abu Dhabi)' },
            { id: 'Pakistan', label: '🇵🇰 Pakistan (LHR, KHI, ISB)' },
            { id: 'US', label: '🇺🇸 United States' },
            { id: 'UK', label: '🇬🇧 United Kingdom' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                selectedCountry.toLowerCase() === item.id.toLowerCase()
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#3B6FF5] font-bold border border-blue-200 dark:border-blue-900'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="country"
                  checked={selectedCountry.toLowerCase() === item.id.toLowerCase()}
                  onChange={() => onCountryChange(item.id)}
                  className="accent-[#3B6FF5] w-3.5 h-3.5 cursor-pointer"
                />
                <span>{item.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Website Availability Filter */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Website Availability
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'no-site', label: '🔥 Missing Website (Hot Pitch)' },
            { id: 'has-site', label: '🌐 Has Website (Redesign Target)' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                hasWebsiteFilter === item.id
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-900'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-300'
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

      {/* 4. Contact Availability (Email & Phone) */}
      {onHasEmailChange && onHasPhoneChange && (
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#3B6FF5]" />
            Direct Contact Filters
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onHasEmailChange(hasEmailFilter === 'has_email' || hasEmailFilter === 'has-email' ? 'all' : 'has-email')}
              className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                hasEmailFilter === 'has_email' || hasEmailFilter === 'has-email'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="text-[10px]">Has Email</span>
            </button>
            <button
              type="button"
              onClick={() => onHasPhoneChange(hasPhoneFilter === 'has_phone' || hasPhoneFilter === 'has-phone' ? 'all' : 'has-phone')}
              className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                hasPhoneFilter === 'has_phone' || hasPhoneFilter === 'has-phone'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="text-[10px]">Has Phone</span>
            </button>
          </div>
        </div>
      )}

      {/* 4.5 Verification Status */}
      {onVerificationChange && (
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verification Status
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'verified', label: '✓ Verified' },
              { id: 'unverified', label: 'Unverified' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onVerificationChange(item.id)}
                className={`py-1.5 rounded-lg border text-center text-[10px] font-bold transition cursor-pointer ${
                  verificationFilter === item.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Lead Quality Score */}
      {onQualityChange && (
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            Lead Quality Score
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Scores' },
              { id: 'high', label: '80+ High' },
              { id: 'top', label: '90+ Elite' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onQualityChange(item.id === 'high' ? '80+' : item.id === 'top' ? '90+' : 'all')}
                className={`py-1.5 rounded-lg border text-center text-[10px] font-bold transition cursor-pointer ${
                  qualityFilter === item.id ||
                  (item.id === 'high' && qualityFilter === '80+') ||
                  (item.id === 'top' && qualityFilter === '90+')
                    ? 'bg-[#3B6FF5] text-white border-[#3B6FF5]'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Deliverable / Category Focus */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          Industry &amp; Deliverables
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Industries' },
            { id: 'web', label: '💻 Web Development' },
            { id: 'wordpress', label: '🌐 WordPress & WooCommerce' },
            { id: 'meta-ads', label: '📢 Meta Ads & Social Marketing' },
            { id: 'mobile', label: '📱 Mobile Apps' },
            { id: 'local', label: '🏢 Local Business Services' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                categoryFilter === item.id
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#3B6FF5] font-bold border border-blue-200 dark:border-blue-900'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={categoryFilter === item.id}
                  onChange={() => onCategoryChange(item.id)}
                  className="accent-[#3B6FF5] w-3.5 h-3.5 cursor-pointer"
                />
                <span>{item.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      </div>

    </aside>
  );
}
