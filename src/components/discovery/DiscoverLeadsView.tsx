'use client';

import React, { useState } from 'react';
import {
  Compass,
  Search,
  Globe2,
  Filter,
  ExternalLink,
  Plus,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Briefcase,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { Lead } from '@/types';
import { executeMultiSourceDiscovery } from '@/lib/discovery-connectors';

interface DiscoverLeadsViewProps {
  onImportLead?: (lead: Lead) => void;
  savedLeadIds?: Set<string>;
}

export default function DiscoverLeadsView({
  onImportLead,
  savedLeadIds = new Set(),
}: DiscoverLeadsViewProps) {
  const [platform, setPlatform] = useState('all');
  const [category, setCategory] = useState('Web Development');
  const [country, setCountry] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set(savedLeadIds));

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const leads = await executeMultiSourceDiscovery({
        platform: platform !== 'all' ? platform : undefined,
        category: category !== 'all' ? category : undefined,
        country: country !== 'all' ? country : undefined,
        query: query.trim() || undefined,
        limit: 12,
      });
      setResults(leads);
    } catch (err) {
      console.error('Discovery error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (lead: Lead) => {
    onImportLead?.(lead);
    setImportedIds((prev) => new Set(prev).add(lead.id));
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              Multi-Source Connector
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Public Opportunities
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Discover Real Leads</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search active opportunities across PeoplePerHour, Upwork, Freelancer, Remotive, and OpenStreetMap
          </p>
        </div>
      </div>

      {/* Discovery Query Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Query Keyword */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Next.js, Redesign, Clinic..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Platform Connector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Platform Connector</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
            >
              <option value="all">⚡ All Connectors (Parallel Search)</option>
              <option value="remotive">Remotive (Software, Marketing, Design)</option>
              <option value="freelancer">Freelancer.com (Live Client Projects)</option>
              <option value="nominatim">OpenStreetMap (Local Businesses)</option>
            </select>
          </div>

          {/* Discipline Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Discipline / Scope</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
            >
              <option value="all">All Disciplines</option>
              <option value="Web Development">Web Development & Next.js</option>
              <option value="Local Business">Local Business & Medical Clinics</option>
              <option value="Mobile App">Mobile App Development</option>
              <option value="Graphic Design">Graphic Design & Branding</option>
              <option value="SEO & Content">SEO & Content Marketing</option>
            </select>
          </div>

          {/* Target Country */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Territory</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
            >
              <option value="all">🌍 Global Markets</option>
              <option value="UAE">🇦🇪 United Arab Emirates</option>
              <option value="Pakistan">🇵🇰 Pakistan</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="US">🇺🇸 United States</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] text-slate-500">
            Strict Real-Data Policy: Only authorized public APIs and permitted directory feeds are queried.
          </span>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{loading ? 'Discovering Live Opportunities...' : 'Discover Real Leads'}</span>
          </button>
        </div>
      </form>

      {/* Discovery Results */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold flex items-center gap-2">
            <span>Discovered Opportunities</span>
            {results.length > 0 && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300">
                {results.length} found
              </span>
            )}
          </h2>
        </div>

        {results.length === 0 && !loading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <Compass className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <div className="font-bold text-sm">Ready to Discover Real Market Opportunities</div>
            <p className="text-xs mt-1">Select a connector and click &quot;Discover Real Leads&quot; to initiate live discovery</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((lead) => {
            const isImported = importedIds.has(lead.id);

            return (
              <div
                key={lead.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 truncate">
                      {lead.platform}
                    </span>
                    <span className="text-xs font-black text-amber-600">
                      {lead.scoreBreakdown?.leadQualityScore || 80} pts
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {lead.title}
                  </h3>

                  <div className="text-xs text-slate-500 font-semibold mb-2">
                    {lead.businessName} • {lead.city}, {lead.country}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-3 leading-relaxed">
                    {lead.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-emerald-600 truncate">
                    {lead.budget || 'Scope Confirmed'}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {lead.sourcePlatformUrl && (
                      <a
                        href={lead.sourcePlatformUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Original Listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => handleImport(lead)}
                      disabled={isImported}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isImported
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isImported ? <CheckCircle2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{isImported ? 'Imported' : 'Import Lead'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
