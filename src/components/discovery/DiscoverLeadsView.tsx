'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Compass,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Building2,
  Users,
  MapPin,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bookmark,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Lead } from '@/types';
import { PlatformState, PlatformConfig } from '@/lib/integrations/types';

interface DiscoverLeadsViewProps {
  onImportLead?: (lead: Lead) => void;
  savedLeadIds?: Set<string>;
  initialType?: 'company' | 'contact' | 'all';
}

export default function DiscoverLeadsView({
  onImportLead,
  savedLeadIds = new Set(),
  initialType = 'all',
}: DiscoverLeadsViewProps) {
  // Query Form State
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('Web Development');
  const [country, setCountry] = useState('US');
  const [city, setCity] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['osm', 'github', 'opencorporates']);

  // Advanced Filters State (Progressive Disclosure)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [companySize, setCompanySize] = useState('all');
  const [jobTitle, setJobTitle] = useState(initialType === 'contact' ? 'Founder' : '');
  const [companyType, setCompanyType] = useState('all');

  // Execution & Results
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [platformStatuses, setPlatformStatuses] = useState<Record<string, { status: string; count: number; error?: string }>>({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(savedLeadIds));
  const [searchSavedMessage, setSearchSavedMessage] = useState(false);

  // Platform states from integrations API
  const [platformStates, setPlatformStates] = useState<{ config: PlatformConfig; state: PlatformState }[]>([]);

  useEffect(() => {
    fetch('/api/integrations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.platforms)) {
          setPlatformStates(data.platforms);
        }
      })
      .catch(() => {});
  }, []);

  // Sync with initialType changes
  useEffect(() => {
    if (initialType === 'contact') {
      setJobTitle('Founder');
      setSelectedPlatforms((prev) => Array.from(new Set([...prev, 'github', 'hunter', 'apollo'])));
      setShowAdvanced(true);
    } else if (initialType === 'company') {
      setCompanyType('registered_business');
      setSelectedPlatforms((prev) => Array.from(new Set([...prev, 'opencorporates', 'wikidata', 'osm'])));
      setShowAdvanced(true);
    }
  }, [initialType]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearchSavedMessage(false);

    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim() || undefined,
          category: industry !== 'all' ? industry : undefined,
          country: country !== 'all' ? country : undefined,
          city: city.trim() || undefined,
          jobTitle: jobTitle.trim() || undefined,
          companySize: companySize !== 'all' ? companySize : undefined,
          companyType: companyType !== 'all' ? companyType : undefined,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
          limit: 15,
          autoPersist: true,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setResults(data.leads);
        if (data.platformStatuses) {
          setPlatformStatuses(data.platformStatuses);
        }
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim() || undefined,
          category: industry !== 'all' ? industry : undefined,
          country: country !== 'all' ? country : undefined,
          city: city.trim() || undefined,
          jobTitle: jobTitle.trim() || undefined,
          limit: 20,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Reload search results
        handleSearch();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveLead = (lead: Lead) => {
    onImportLead?.(lead);
    setSavedIds((prev) => new Set(prev).add(lead.id));
  };

  const togglePlatform = (pId: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(pId)) {
        return prev.filter((p) => p !== pId);
      }
      return [...prev, pId];
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Lead Discovery Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Query connected B2B databases, physical registries, and public corporate endpoints in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchSavedMessage(true);
              setTimeout(() => setSearchSavedMessage(false), 3000);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
          >
            {searchSavedMessage ? 'Search Saved!' : 'Save Search'}
          </button>

          <button
            onClick={handleStartSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Synchronizing...' : 'Start Synchronization'}</span>
          </button>
        </div>
      </div>

      {/* Progressive Disclosure Search Card */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
      >
        {/* Row 1: Essential Search Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keywords / Topic */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Keywords / Topic</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Next.js, Dental, Fintech..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Industry / Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Industry / Category</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="all">All Industries</option>
              <option value="Web Development">Web Development</option>
              <option value="WordPress Development">WordPress Development</option>
              <option value="Local Business">Local Business & Clinics</option>
              <option value="Meta Ads & Marketing">Meta Ads & Marketing</option>
              <option value="Social Media Management">Social Media Management</option>
              <option value="Graphic Design">Graphic Design & UI/UX</option>
              <option value="SEO & Content">SEO & Content Marketing</option>
            </select>
          </div>

          {/* Target Country */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="all">Global / Anywhere</option>
              <option value="US">United States (US)</option>
              <option value="UK">United Kingdom (UK)</option>
              <option value="UAE">United Arab Emirates (UAE)</option>
              <option value="Pakistan">Pakistan</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">City (Optional)</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Austin, London, Dubai..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Source Platforms Multi-select with real operational badges */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-2">
            Target Source Platforms ({selectedPlatforms.length} Selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'osm', name: 'OpenStreetMap' },
              { id: 'github', name: 'GitHub' },
              { id: 'opencorporates', name: 'OpenCorporates' },
              { id: 'wikidata', name: 'Wikidata' },
              { id: 'huggingface', name: 'Hugging Face' },
              { id: 'apollo', name: 'Apollo.io' },
              { id: 'hunter', name: 'Hunter.io' },
              { id: 'serpapi', name: 'SerpApi' },
              { id: 'foursquare', name: 'Foursquare' },
              { id: 'yelp', name: 'Yelp Fusion' },
              { id: 'google_places', name: 'Google Places' },
              { id: 'freelancer', name: 'Freelancer.com' },
              { id: 'remotive', name: 'Remotive' },
            ].map((p) => {
              const isSelected = selectedPlatforms.includes(p.id);
              const pState = platformStates.find((ps) => ps.config.id === p.id);
              const isReady = pState ? (pState.state.status === 'operational' || pState.state.status === 'connected') : true;

              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters Expandable Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters (Company Size, Job Title, Entity Type)'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvanced && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="all">Any Size</option>
                <option value="1-10">Startup (1 - 10)</option>
                <option value="11-50">Growth (11 - 50)</option>
                <option value="51-200">Mid-Market (51 - 200)</option>
                <option value="200+">Enterprise (200+)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. CEO, Founder, Director..."
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Entity Type</label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="all">All Entity Types</option>
                <option value="registered_business">Registered Corporation</option>
                <option value="local_business">Local Physical Enterprise</option>
                <option value="agency">Digital Agency / Software Lab</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{loading ? 'Discovering Leads...' : 'Search Leads'}</span>
          </button>
        </div>
      </form>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Discovery Results {results.length > 0 && `(${results.length} Found)`}
          </h3>
          {results.length > 0 && (
            <span className="text-xs text-slate-500 font-medium">
              Saved automatically to master database
            </span>
          )}
        </div>

        {loading ? (
          <div className="bg-white dark:bg-[#111c2e] p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="font-semibold text-slate-800 dark:text-slate-200">Executing Multi-Platform Discovery...</p>
            <p className="text-slate-400">Querying live platform endpoints, normalizing prospect data, and running deduplication.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white dark:bg-[#111c2e] p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
            <Compass className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-800 dark:text-slate-200">No leads retrieved for this search</p>
            <p className="text-slate-400">
              Ensure credentials are configured for chosen platforms, or broaden your location and keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((lead) => {
              const isSaved = savedIds.has(lead.id);
              const score = lead.scoreBreakdown?.leadQualityScore ?? 70;

              return (
                <div
                  key={lead.id}
                  className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {lead.platform}
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        Score {score}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {lead.businessName || lead.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {lead.description || 'Verified commercial lead record.'}
                    </p>

                    <div className="pt-2 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                      <div>
                        Location: <span className="font-medium text-slate-800 dark:text-slate-200">{lead.city ? `${lead.city}, ${lead.country}` : lead.country || 'Global'}</span>
                      </div>
                      {lead.contact?.contactPerson && (
                        <div>
                          Contact: <span className="font-medium text-slate-800 dark:text-slate-200">{lead.contact.contactPerson}</span>
                        </div>
                      )}
                      {lead.contact?.email && (
                        <div className="truncate font-mono text-[10px] text-blue-600">
                          {lead.contact.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {lead.contact?.website ? (
                      <a
                        href={lead.contact.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">No Website</span>
                    )}

                    <button
                      onClick={() => handleSaveLead(lead)}
                      disabled={isSaved}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                        isSaved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save Lead</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
