'use client';

import React, { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Lead } from '@/types';
import {
  Search,
  Filter,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  PlusCircle,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerResearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeadIds, setSavedLeadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [quotaExceededModal, setQuotaExceededModal] = useState<string | null>(null);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);

  // Load initial customer metrics & saved leads
  const fetchCustomerState = () => {
    fetch('/api/customer/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          const ids = new Set<string>(data.leads.map((l: any) => l.leadId || l.id));
          setSavedLeadIds(ids);
        }
      })
      .catch(() => {});

    fetch('/api/customer/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setRemainingQuota(data.metrics.remainingLeads);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCustomerState();
    handleSearch();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedCountry !== 'All') params.set('country', selectedCountry);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err: any) {
      console.warn('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    setSavingLeadId(lead.id);

    try {
      const res = await fetch('/api/customer/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      });

      const data = await res.json();

      if (data.success) {
        setSavedLeadIds((prev) => {
          const next = new Set(prev);
          next.add(lead.id);
          return next;
        });
        if (data.remainingQuota !== undefined) {
          setRemainingQuota(data.remainingQuota);
        }
      } else {
        if (data.quotaExceeded) {
          setQuotaExceededModal(data.error || 'Your monthly lead allocation quota has been reached.');
        } else {
          alert(data.error || 'Failed to save lead');
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Error occurred while saving lead');
    } finally {
      setSavingLeadId(null);
    }
  };

  return (
    <CustomerLayout
      title="Business Research & Lead Discovery"
      subtitle="Discover verified local companies and decision-makers across global registries. Atomic quota enforcement automatically applies on save."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Search Bar & Filters */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by company name, keywords, city, or niche..."
                className="w-full bg-[#080d1a] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#080d1a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Industries</option>
                <option value="Web Development">Web Development</option>
                <option value="WordPress Development">WordPress Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Local Business">Local Business</option>
                <option value="SEO & Content">SEO & Content</option>
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-[#080d1a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Countries</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="UAE">United Arab Emirates</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Global">Global</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs font-mono rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-400/10 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Searching...' : 'Search Engine'}</span>
              </button>
            </div>
          </form>

          {remainingQuota !== null && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 font-mono">
              <span className="text-slate-400">
                Your remaining monthly quota:{' '}
                <span className="text-amber-400 font-bold">{remainingQuota.toLocaleString()} leads</span>
              </span>
              <span className="text-slate-500 text-[11px]">Saving a lead deducts 1 quota credit</span>
            </div>
          )}
        </div>

        {/* Lead Discovery Results */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center text-slate-500 font-mono text-xs animate-pulse">
              Querying live discovery connectors and cross-referencing registries...
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs font-mono">
              No matching businesses found. Try adjusting your query or filters.
            </div>
          ) : (
            leads.map((lead) => {
              const isSaved = savedLeadIds.has(lead.id);
              const isSaving = savingLeadId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{lead.businessName}</h3>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {lead.category}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{lead.city ? `${lead.city}, ` : ''}{lead.country}</span>
                      <span>&bull;</span>
                      <span className="text-amber-400/80">via {lead.platform}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
                      {lead.contact?.email ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{lead.contact.email}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">No Email Listed</span>
                      )}

                      {lead.contact?.phone ? (
                        <span className="text-indigo-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{lead.contact.phone}</span>
                        </span>
                      ) : null}

                      {lead.contact?.website && (
                        <a
                          href={lead.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-amber-400 flex items-center gap-1 truncate max-w-[160px]"
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">{lead.contact.website}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSaved ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Saved to Workspace</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSaveLead(lead)}
                        disabled={isSaving}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-slate-700 hover:border-amber-400/50 shadow-sm"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isSaving ? 'Claiming...' : 'Save to Workspace'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL: Quota Exceeded */}
        {quotaExceededModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-rose-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Lead Quota Limit Reached</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">{quotaExceededModal}</p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setQuotaExceededModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
                <Link
                  href="/app/subscription"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs font-mono rounded-xl transition"
                >
                  Upgrade Package
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
