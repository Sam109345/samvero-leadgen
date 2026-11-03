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
import { PLATFORM_CATEGORIES, PlatformCategoryId, matchesPlatformCategory } from '@/lib/platform-directory';
import FreelancerLeadFeed from '@/components/freelancer/FreelancerLeadFeed';
import LeadDetailModal from '@/components/leads/LeadDetailModal';
import EmailOutreachModal from '@/components/EmailOutreachModal';
import DeliverablesStudioModal from '@/components/DeliverablesStudioModal';
import JobScopeAnalyzerModal from '@/components/JobScopeAnalyzerModal';

export default function CustomerLeadsPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'saved'>('live');
  const [selectedCategory, setSelectedCategory] = useState<PlatformCategoryId | 'all'>('all');
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

  // Modals state
  const [inspectDetailLead, setInspectDetailLead] = useState<Lead | null>(null);
  const [emailModalLead, setEmailModalLead] = useState<Lead | null>(null);
  const [websiteModalLead, setWebsiteModalLead] = useState<Lead | null>(null);
  const [jobScopeModalLead, setJobScopeModalLead] = useState<Lead | null>(null);

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
      !term ||
      l.businessName.toLowerCase().includes(term) ||
      l.title.toLowerCase().includes(term) ||
      l.category.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      (l.city || '').toLowerCase().includes(term) ||
      (l.contact?.email || '').toLowerCase().includes(term) ||
      (l.contact?.phone || '').toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'all' || matchesPlatformCategory(l.platform, selectedCategory);
    const matchesPlatform = platformFilter === 'all' || l.platform.toLowerCase().includes(platformFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  // Filtered saved leads
  const filteredSavedLeads = savedLeads.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      l.businessName.toLowerCase().includes(term) ||
      l.category.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      (l.city || '').toLowerCase().includes(term) ||
      (l.contact?.email || '').toLowerCase().includes(term) ||
      (l.contact?.phone || '').toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'all' || matchesPlatformCategory(l.platform, selectedCategory);
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || l.platform.toLowerCase().includes(platformFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesStatus && matchesPlatform;
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

        {/* Rich Freelancer.com-style Lead Feed */}
        <FreelancerLeadFeed
          leads={liveLeads}
          savedLeadIds={savedLeadIdSet}
          onToggleSaveLead={handleSaveToWorkspace}
          onOpenEmailModal={(lead) => setEmailModalLead(lead)}
          onOpenWebsiteModal={(lead) => setWebsiteModalLead(lead)}
          onOpenJobScopeModal={(lead) => setJobScopeModalLead(lead)}
          onInspectLead={(lead) => setInspectDetailLead(lead)}
          initialCategoryTab={activeTab === 'saved' ? 'saved' : 'all'}
          isRefreshingLive={loading}
          onRefreshLiveLeads={() => {
            fetchSavedLeads();
            fetchLiveLeads();
          }}
          showRightPanel={true}
        />

        {/* Modals */}
        {emailModalLead && (
          <EmailOutreachModal
            isOpen={Boolean(emailModalLead)}
            onClose={() => setEmailModalLead(null)}
            lead={emailModalLead}
          />
        )}

        {websiteModalLead && (
          <DeliverablesStudioModal
            isOpen={Boolean(websiteModalLead)}
            onClose={() => setWebsiteModalLead(null)}
            lead={websiteModalLead}
            onDispatchOutreach={(lead) => {
              setWebsiteModalLead(null);
              setEmailModalLead(lead);
            }}
          />
        )}

        {jobScopeModalLead && (
          <JobScopeAnalyzerModal
            isOpen={Boolean(jobScopeModalLead)}
            onClose={() => setJobScopeModalLead(null)}
            lead={jobScopeModalLead}
            onOpenDeliverablesStudio={(lead) => {
              setJobScopeModalLead(null);
              setWebsiteModalLead(lead);
            }}
            onOpenEmailPitch={(lead) => {
              setJobScopeModalLead(null);
              setEmailModalLead(lead);
            }}
          />
        )}

        {inspectDetailLead && (
          <LeadDetailModal
            isOpen={Boolean(inspectDetailLead)}
            onClose={() => setInspectDetailLead(null)}
            lead={inspectDetailLead}
            onOpenEmailModal={(l) => {
              setInspectDetailLead(null);
              setEmailModalLead(l);
            }}
          />
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
