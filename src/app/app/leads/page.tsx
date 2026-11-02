'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { CustomerLeadRecord } from '@/lib/saas-store';
import { Lead } from '@/types';
import {
  Database,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Globe,
  Trash2,
  ExternalLink,
  Edit2,
  Tag,
  RefreshCw,
  CheckCircle2,
  Share2,
  Sparkles,
  Bookmark,
  Plus,
  Send,
  Building2,
  Layers,
  MapPin,
  Check,
} from 'lucide-react';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

export default function CustomerLeadsPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'saved'>('live');
  const [savedLeads, setSavedLeads] = useState<CustomerLeadRecord[]>([]);
  const [liveLeads, setLiveLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<CustomerLeadRecord | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Fetch saved customer leads
  const fetchSavedLeads = () => {
    fetch('/api/customer/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          setSavedLeads(data.leads);
        }
      })
      .catch((err) => console.warn(err));
  };

  // Fetch live available leads
  const fetchLiveLeads = () => {
    setLoading(true);
    fetch('/api/leads?refresh=live')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          setLiveLeads(data.leads);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSavedLeads();
    fetchLiveLeads();
  }, []);

  const handleSaveToWorkspace = async (lead: Lead) => {
    setSavingLeadId(lead.id);
    try {
      const res = await fetch('/api/customer/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, leadData: lead }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(`Lead "${lead.businessName}" saved to your workspace!`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
        fetchSavedLeads();
      } else {
        alert(data.error || 'Failed to save lead');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving lead');
    } finally {
      setSavingLeadId(null);
    }
  };

  const handleUpdateStatus = async (leadId: string, nextStatus: CustomerLeadRecord['status']) => {
    try {
      const res = await fetch('/api/customer/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedLeads((prev) =>
          prev.map((l) => (l.id === leadId || l.leadId === leadId ? { ...l, status: nextStatus } : l))
        );
      }
    } catch (err: any) {
      alert(err?.message || 'Error updating stage');
    }
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      const res = await fetch('/api/customer/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: selectedLead.id, notes: editNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id || l.leadId === selectedLead.id ? { ...l, notes: editNotes } : l
          )
        );
        setSelectedLead(null);
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving notes');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to remove this lead from your workspace?')) return;

    try {
      const res = await fetch(`/api/customer/leads?leadId=${leadId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSavedLeads((prev) => prev.filter((l) => l.id !== leadId && l.leadId !== leadId));
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting lead');
    }
  };

  const handleExportCsv = () => {
    const listToExport = activeTab === 'saved' ? filteredSavedLeads : filteredLiveLeads;
    if (listToExport.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = ['Business Name', 'Category', 'Country', 'City', 'Platform', 'Email', 'Phone', 'Website'];
    const rows = listToExport.map((l: any) => [
      `"${(l.businessName || l.title || '').replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.country}"`,
      `"${l.city || ''}"`,
      `"${l.platform}"`,
      `"${l.contact?.email || ''}"`,
      `"${l.contact?.phone || ''}"`,
      `"${l.contact?.website || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samvero-enterprise-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const savedLeadIdSet = new Set(savedLeads.map((s) => s.leadId || s.id));

  // Filtered live leads
  const filteredLiveLeads = liveLeads.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.businessName.toLowerCase().includes(term) ||
      l.title.toLowerCase().includes(term) ||
      l.category.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      (l.city || '').toLowerCase().includes(term) ||
      (l.contact?.email || '').toLowerCase().includes(term) ||
      (l.contact?.phone || '').toLowerCase().includes(term);

    const matchesPlatform = platformFilter === 'all' || l.platform.toLowerCase().includes(platformFilter.toLowerCase());
    return matchesSearch && matchesPlatform;
  });

  // Filtered saved leads
  const filteredSavedLeads = savedLeads.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.businessName.toLowerCase().includes(term) ||
      l.category.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      (l.city || '').toLowerCase().includes(term) ||
      (l.contact?.email || '').toLowerCase().includes(term) ||
      (l.contact?.phone || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || l.platform.toLowerCase().includes(platformFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  return (
    <CustomerLayout
      title="Enterprise Leads & Opportunities"
      subtitle="Full unrestricted access to real verified leads across Upwork, Fiverr, Google Maps, Contra, LinkedIn, Remote OK, Reddit, and Pakistan markets."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Enterprise Entitlement Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0e192e] to-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Enterprise Client Active Plan
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  60,000 Leads Quota
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  70+ Real Sources
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Full Unrestricted Multi-Channel Access Enabled
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Main Workbench</span>
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'live'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Live Opportunities</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'live' ? 'bg-slate-950/20 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'
              }`}>
                {liveLeads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Saved Pipeline</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'saved' ? 'bg-slate-950/20 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'
              }`}>
                {savedLeads.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                fetchSavedLeads();
                fetchLiveLeads();
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search & Platform Filter Bar */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-3.5 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across all platforms, company, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 shrink-0 font-medium">Source:</span>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-[#080d1a] border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Sources (70+ Channels)</option>
              <option value="Upwork">Upwork</option>
              <option value="Fiverr">Fiverr</option>
              <option value="Freelancer">Freelancer.com</option>
              <option value="PeoplePerHour">PeoplePerHour</option>
              <option value="Contra">Contra</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Reddit">Reddit</option>
              <option value="Remote OK">Remote OK</option>
              <option value="Remotive">Remotive</option>
              <option value="Google Maps">Google Maps</option>
              <option value="Bark">Bark</option>
              <option value="Pakistan">Pakistan Market (Rozee/OLX)</option>
            </select>

            {activeTab === 'saved' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#080d1a] border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Stages</option>
                <option value="saved">Saved</option>
                <option value="researched">Researched</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="archived">Archived</option>
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: Enterprise Live Opportunities */}
        {activeTab === 'live' && (
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080d1a]/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Opportunity & Platform</th>
                    <th className="py-3.5 px-4">Budget / Value</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Verified Contacts</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500 font-mono">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          <span>Aggregating real-time live opportunities across 70+ platforms...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLiveLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500 font-mono">
                        No live opportunities matching filter criteria. Try clearing search or platform filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLiveLeads.map((lead) => {
                      const isAlreadySaved = savedLeadIdSet.has(lead.id);
                      const cleanPhone = cleanWhatsAppDigits(
                        lead.contact?.whatsapp || lead.contact?.phone,
                        lead.country
                      );

                      return (
                        <tr key={lead.id} className="hover:bg-slate-850/40 transition">
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{lead.businessName}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                                {lead.platform}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300 font-medium mt-0.5 line-clamp-1">
                              {lead.title}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                              {lead.description}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 shrink-0 whitespace-nowrap">
                            <span className="font-bold text-emerald-400 font-mono text-xs">
                              {lead.budget || 'Custom Scope'}
                            </span>
                            <div className="text-[10px] text-slate-500">{lead.jobType || 'Direct Engagement'}</div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{lead.city ? `${lead.city}, ` : ''}{lead.country}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">{lead.timeAgo || 'Active'}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {lead.contact?.email ? (
                                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                                  <Mail className="w-3 h-3 shrink-0" />
                                  <span className="truncate max-w-[170px]">{lead.contact.email}</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-600 font-mono">Verified Post</span>
                              )}
                              {lead.contact?.phone ? (
                                <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-mono">
                                  <Phone className="w-3 h-3 shrink-0" />
                                  <span>{lead.contact.phone}</span>
                                </div>
                              ) : null}
                              {lead.contact?.website && (
                                <a
                                  href={lead.contact.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 font-mono truncate max-w-[170px]"
                                >
                                  <Globe className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{lead.contact.website}</span>
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                    `Hello ${lead.contact?.contactPerson || lead.businessName}, I am contacting you regarding your requirement for "${lead.title}".`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition"
                                >
                                  WhatsApp
                                </a>
                              )}

                              <button
                                onClick={() => handleSaveToWorkspace(lead)}
                                disabled={isAlreadySaved || savingLeadId === lead.id}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                                  isAlreadySaved
                                    ? 'bg-slate-800 text-slate-400 cursor-default'
                                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer'
                                }`}
                              >
                                {isAlreadySaved ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Saved</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Save</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: My Saved Leads Pipeline */}
        {activeTab === 'saved' && (
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080d1a]/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Business & Category</th>
                    <th className="py-3.5 px-4">Location & Source</th>
                    <th className="py-3.5 px-4">Contact Intelligence</th>
                    <th className="py-3.5 px-4">Stage</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSavedLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500 font-mono">
                        No saved leads in your workspace yet. Switch to &ldquo;Enterprise Live Opportunities&rdquo; to save leads!
                      </td>
                    </tr>
                  ) : (
                    filteredSavedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-850/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{lead.businessName}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{lead.category}</div>
                          {lead.notes && (
                            <div className="text-[10px] text-amber-300 font-sans italic mt-1 truncate max-w-[220px]">
                              &ldquo;{lead.notes}&rdquo;
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-300 font-mono text-[11px]">
                            {lead.city ? `${lead.city}, ` : ''}{lead.country}
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] font-mono text-slate-400">
                            via {lead.platform}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {lead.contact?.email ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                                <Mail className="w-3 h-3 shrink-0" />
                                <span className="truncate max-w-[180px]">{lead.contact.email}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-mono">No Email</span>
                            )}
                            {lead.contact?.phone ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-mono">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span>{lead.contact.phone}</span>
                              </div>
                            ) : null}
                            {lead.contact?.website && (
                              <a
                                href={lead.contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 font-mono truncate max-w-[180px]"
                              >
                                <Globe className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{lead.contact.website}</span>
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                            className="bg-[#080d1a] border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-mono text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="saved">Saved</option>
                            <option value="researched">Researched</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setEditNotes(lead.notes || '');
                              }}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                              title="Edit Notes"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: Notes Editor */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-base font-semibold text-white mb-1">Lead Notes & Strategy</h3>
              <p className="text-xs text-slate-400 mb-4">{selectedLead.businessName}</p>

              <form onSubmit={handleSaveNotes} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Private Notes</label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="e.g. Sent personalized proposal on Tuesday. Next follow-up on Friday."
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs font-mono transition"
                  >
                    Save Notes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
