'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Mail,
  ExternalLink,
  Phone,
  MessageSquare,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
  Trash2,
  ArrowUpDown,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { Lead } from '@/types';
import LeadDetailModal, { LeadStatusOption } from './LeadDetailModal';

interface ApproachedClientsViewProps {
  initialStatusFilter?: LeadStatusOption | 'all';
  onNavigateView?: (view: any) => void;
}

export default function ApproachedClientsView({
  initialStatusFilter = 'all',
  onNavigateView,
}: ApproachedClientsViewProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newLeads: 0,
    approachedClients: 0,
    waitingForResponse: 0,
    followupsDue: 0,
    interestedClients: 0,
    convertedLeads: 0,
    notInterested: 0,
    wastedLeads: 0,
    closedLeads: 0,
  });

  // Active filter tab: 'approached' | 'waiting' | 'followup' | 'interested' | 'not_interested' | 'wasted' | 'converted' | 'all'
  const [activeTab, setActiveTab] = useState<string>(
    initialStatusFilter === 'all'
      ? 'approached'
      : initialStatusFilter === 'Waiting for Client Response'
      ? 'waiting'
      : initialStatusFilter === 'Follow-up Required'
      ? 'followup'
      : initialStatusFilter === 'Interested'
      ? 'interested'
      : initialStatusFilter === 'Not Interested'
      ? 'not_interested'
      : initialStatusFilter === 'Wasted Lead'
      ? 'wasted'
      : initialStatusFilter === 'Converted / Won'
      ? 'converted'
      : initialStatusFilter === 'Closed'
      ? 'closed'
      : 'approached'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  const fetchApproachedLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leads/approached?status=all`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.warn('Failed to load approached leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproachedLeads();
  }, []);

  // Filter leads based on activeTab, search, and category
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Tab matching
      if (activeTab === 'approached' && lead.currentStatus !== 'Approached') return false;
      if (activeTab === 'waiting' && lead.currentStatus !== 'Waiting for Client Response') return false;
      if (activeTab === 'followup' && lead.currentStatus !== 'Follow-up Required') return false;
      if (activeTab === 'interested' && lead.currentStatus !== 'Interested') return false;
      if (activeTab === 'not_interested' && lead.currentStatus !== 'Not Interested') return false;
      if (activeTab === 'wasted' && lead.currentStatus !== 'Wasted Lead') return false;
      if (activeTab === 'converted' && lead.currentStatus !== 'Converted / Won') return false;
      if (activeTab === 'closed' && lead.currentStatus !== 'Closed') return false;

      // Category filter
      if (categoryFilter !== 'all' && !lead.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          lead.businessName.toLowerCase().includes(q) ||
          lead.title.toLowerCase().includes(q) ||
          lead.city.toLowerCase().includes(q) ||
          lead.country.toLowerCase().includes(q) ||
          (lead.contact?.contactPerson && lead.contact.contactPerson.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [leads, activeTab, categoryFilter, searchQuery]);

  const handleStatusChangeQuick = async (leadId: string, nextStatus: LeadStatusOption) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, currentStatus: nextStatus } : l))
        );
        fetchApproachedLeads();
      }
    } catch (err) {
      console.warn('Failed to update lead status:', err);
    }
  };

  const statusBadgeColor = (st: string) => {
    switch (st) {
      case 'Approached':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Waiting for Client Response':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'Follow-up Required':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Interested':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Converted / Won':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800';
      case 'Not Interested':
        return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      case 'Wasted Lead':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
      default:
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Approached Clients & Outreach Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dedicated lead management section tracking reached businesses, waiting client replies, follow-ups, and conversion outcomes.
          </p>
        </div>

        <button
          onClick={fetchApproachedLeads}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#22334d] hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 self-start shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Real Statistics Metric Counters Bar - 9 Canonical Lifecycle States */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
        <button
          onClick={() => {
            if (onNavigateView) {
              onNavigateView('all-leads');
            } else {
              setActiveTab('all');
            }
          }}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'all'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-2 ring-blue-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
          title="Click to view All / New Leads"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase">New Leads</div>
          <div className="text-lg font-black text-slate-900 dark:text-white">{stats.newLeads}</div>
        </button>

        <button
          onClick={() => setActiveTab('approached')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'approached'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-2 ring-blue-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Approached</div>
          <div className="text-lg font-black text-blue-600 dark:text-blue-400">{stats.approachedClients}</div>
        </button>

        <button
          onClick={() => setActiveTab('waiting')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'waiting'
              ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 ring-2 ring-purple-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Waiting Reply</div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400">{stats.waitingForResponse}</div>
        </button>

        <button
          onClick={() => setActiveTab('followup')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'followup'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Follow-ups Due</div>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400">{stats.followupsDue}</div>
        </button>

        <button
          onClick={() => setActiveTab('interested')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'interested'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Interested</div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{stats.interestedClients}</div>
        </button>

        <button
          onClick={() => setActiveTab('converted')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'converted'
              ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 ring-2 ring-teal-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">Won / Converted</div>
          <div className="text-lg font-black text-teal-600 dark:text-teal-400">{stats.convertedLeads}</div>
        </button>

        <button
          onClick={() => setActiveTab('not_interested')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'not_interested'
              ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 ring-2 ring-slate-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase">Not Interested</div>
          <div className="text-lg font-black text-slate-600 dark:text-slate-300">{stats.notInterested}</div>
        </button>

        <button
          onClick={() => setActiveTab('wasted')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'wasted'
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Wasted Leads</div>
          <div className="text-lg font-black text-rose-600 dark:text-rose-400">{stats.wastedLeads}</div>
        </button>

        <button
          onClick={() => setActiveTab('closed')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'closed'
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600 ring-2 ring-gray-500/20'
              : 'bg-white dark:bg-[#111c2e] border-slate-200 dark:border-[#22334d] hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold text-gray-500 uppercase">Closed Leads</div>
          <div className="text-lg font-black text-gray-700 dark:text-gray-300">{stats.closedLeads}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#22334d] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, business, project title, city..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100"
          >
            <option value="all">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="WordPress">WordPress</option>
            <option value="Shopify">Shopify</option>
            <option value="Social Media">Social Media</option>
            <option value="SEO">SEO</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>
        </div>
      </div>

      {/* Approached Clients Data Table */}
      <div className="bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#22334d] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#09101c] text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Client Name & Business</th>
                <th className="py-3.5 px-4">Project Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Date Approached</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4">Last Contact</th>
                <th className="py-3.5 px-4">Next Follow-up</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No leads found matching current filter &ldquo;{activeTab}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => setSelectedLeadForDetail(lead)}
                  >
                    {/* Client Name & Business */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {lead.contact?.contactPerson || lead.businessName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lead.businessName} &bull; {lead.city}, {lead.country}
                      </div>
                    </td>

                    {/* Project Title */}
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <span className="font-semibold text-slate-800 dark:text-slate-200" title={lead.title}>
                        {lead.title}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-blue-600 dark:text-sky-400 font-semibold">
                        {lead.category}
                      </span>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        {lead.platform}
                      </span>
                    </td>

                    {/* Date Approached */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {lead.approachedAt ? (
                        new Date(lead.approachedAt).toLocaleDateString()
                      ) : (
                        <span className="text-slate-400 italic">Not recorded</span>
                      )}
                    </td>

                    {/* Current Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusBadgeColor(lead.currentStatus)}`}>
                        {lead.currentStatus}
                      </span>
                    </td>

                    {/* Last Contact */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {lead.lastContactDate ? (
                        new Date(lead.lastContactDate).toLocaleDateString()
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>

                    {/* Next Follow-up */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {lead.nextFollowupDate ? (
                        <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.nextFollowupDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#007FED] hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-bold transition flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Open Lead</span>
                        </button>

                        <select
                          value={lead.currentStatus}
                          onChange={(e) => handleStatusChangeQuick(lead.id, e.target.value as LeadStatusOption)}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                        >
                          <option value="Approached">Approached</option>
                          <option value="Waiting for Client Response">Waiting Response</option>
                          <option value="Follow-up Required">Follow-up Due</option>
                          <option value="Interested">Interested</option>
                          <option value="Converted / Won">Converted / Won</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Wasted Lead">Wasted Lead</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9-Section Lead Detail Modal */}
      {selectedLeadForDetail && (
        <LeadDetailModal
          lead={selectedLeadForDetail}
          isOpen={Boolean(selectedLeadForDetail)}
          onClose={() => {
            setSelectedLeadForDetail(null);
            fetchApproachedLeads();
          }}
          onLeadStatusChanged={(leadId, newStatus) => {
            setLeads((prev) =>
              prev.map((l) => (l.id === leadId ? { ...l, currentStatus: newStatus } : l))
            );
            fetchApproachedLeads();
          }}
        />
      )}
    </div>
  );
}
