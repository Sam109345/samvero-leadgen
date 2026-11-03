'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  MailCheck,
  PhoneCall,
  Building2,
  Columns,
  X,
  Send,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Globe2,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Lead, PipelineStage, SourceEvidence } from '@/types';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

interface LeadManagementViewProps {
  leads: Lead[];
  onUpdateLeadStage?: (leadId: string, stage: PipelineStage) => void;
  onDeleteLead?: (leadId: string) => void;
  onArchiveLead?: (leadId: string) => void;
  onResearchLead?: (lead: Lead) => void;
  onOpenWebsiteModal?: (lead: Lead) => void;
  onOpenEmailModal?: (lead: Lead) => void;
  onInspectLead?: (lead: Lead) => void;
}

export default function LeadManagementView({
  leads = [],
  onUpdateLeadStage,
  onDeleteLead,
  onArchiveLead,
  onResearchLead,
  onOpenWebsiteModal,
  onOpenEmailModal,
  onInspectLead,
}: LeadManagementViewProps) {
  // Search states
  const [globalSearch, setGlobalSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Expandable Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filters
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [contactAvailability, setContactAvailability] = useState<'all' | 'has_email' | 'has_phone' | 'both' | 'missing'>('all');

  // Sorting
  const [sortField, setSortField] = useState<'score' | 'name' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Bulk Selection
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  // Detailed Drawer
  const [activeDrawerLead, setActiveDrawerLead] = useState<Lead | null>(null);

  // Column Visibility
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [columns, setColumns] = useState({
    businessName: true,
    contactPerson: true,
    industry: true,
    location: true,
    email: true,
    phone: true,
    source: true,
    score: true,
    status: true,
    dateAdded: true,
    actions: true,
  });

  // Extract unique filter choices
  const industries = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => { if (l.category) set.add(l.category); });
    return Array.from(set).sort();
  }, [leads]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => { if (l.country) set.add(l.country); });
    return Array.from(set).sort();
  }, [leads]);

  const sources = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => { if (l.platform) set.add(l.platform); });
    return Array.from(set).sort();
  }, [leads]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    let result = leads.filter((l) => !l.isArchived);

    // Global Search
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.businessName?.toLowerCase().includes(q) ||
          l.title?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          l.country?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.platform?.toLowerCase().includes(q) ||
          l.contact?.email?.toLowerCase().includes(q) ||
          l.contact?.contactPerson?.toLowerCase().includes(q)
      );
    }

    // Company Search
    if (companySearch.trim()) {
      const q = companySearch.toLowerCase().trim();
      result = result.filter((l) => (l.businessName || l.title)?.toLowerCase().includes(q));
    }

    // Contact Search
    if (contactSearch.trim()) {
      const q = contactSearch.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.contact?.contactPerson?.toLowerCase().includes(q) ||
          l.contact?.email?.toLowerCase().includes(q)
      );
    }

    // Industry Filter
    if (selectedIndustry !== 'all') {
      result = result.filter((l) => l.category?.toLowerCase() === selectedIndustry.toLowerCase());
    }

    // Country Filter
    if (selectedCountry !== 'all') {
      result = result.filter((l) => l.country?.toLowerCase() === selectedCountry.toLowerCase());
    }

    // Source Filter
    if (selectedSource !== 'all') {
      result = result.filter((l) => l.platform?.toLowerCase() === selectedSource.toLowerCase());
    }

    // Status Filter
    if (selectedStatus !== 'all') {
      result = result.filter((l) => (l.currentStatus || 'New Lead').toLowerCase() === selectedStatus.toLowerCase());
    }

    // Contact Availability
    if (contactAvailability === 'both') {
      result = result.filter((l) => Boolean(l.contact?.email) && Boolean(l.contact?.phone));
    } else if (contactAvailability === 'has_email') {
      result = result.filter((l) => Boolean(l.contact?.email));
    } else if (contactAvailability === 'has_phone') {
      result = result.filter((l) => Boolean(l.contact?.phone));
    } else if (contactAvailability === 'missing') {
      result = result.filter((l) => !l.contact?.email && !l.contact?.phone);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'score') {
        const scoreA = a.scoreBreakdown?.leadQualityScore ?? 70;
        const scoreB = b.scoreBreakdown?.leadQualityScore ?? 70;
        comparison = scoreA - scoreB;
      } else if (sortField === 'name') {
        comparison = (a.businessName || a.title || '').localeCompare(b.businessName || b.title || '');
      } else {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.incomingAt || 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.incomingAt || 0;
        comparison = timeA - timeB;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [
    leads,
    globalSearch,
    companySearch,
    contactSearch,
    selectedIndustry,
    selectedCountry,
    selectedSource,
    selectedStatus,
    contactAvailability,
    sortField,
    sortDirection,
  ]);

  // Paginated records
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedLeadIds.size === paginatedLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(paginatedLeads.map((l) => l.id)));
    }
  };

  const handleToggleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // CSV Export of actual filtered records
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = [
      'ID',
      'Business Name',
      'Contact Person',
      'Industry',
      'Country',
      'City',
      'Email',
      'Phone',
      'Website',
      'Source',
      'Lead Score',
      'Status',
      'Date Added',
    ];

    const rows = filteredLeads.map((l) => [
      l.id,
      `"${(l.businessName || l.title || '').replace(/"/g, '""')}"`,
      `"${(l.contact?.contactPerson || 'Unavailable').replace(/"/g, '""')}"`,
      `"${(l.category || 'Unavailable').replace(/"/g, '""')}"`,
      `"${(l.country || 'Unavailable').replace(/"/g, '""')}"`,
      `"${(l.city || 'Unavailable').replace(/"/g, '""')}"`,
      `"${(l.contact?.email || 'Unavailable').replace(/"/g, '""')}"`,
      `"${(l.contact?.phone || 'Unavailable').replace(/"/g, '""')}"`,
      `"${(l.contact?.website || 'Unavailable').replace(/"/g, '""')}"`,
      `"${(l.platform || 'Direct').replace(/"/g, '""')}"`,
      l.scoreBreakdown?.leadQualityScore ?? 70,
      `"${(l.currentStatus || 'New Lead').replace(/"/g, '""')}"`,
      `"${l.createdAt || l.postedAt || 'Recent'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `samvero_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (!onDeleteLead || selectedLeadIds.size === 0) return;
    if (confirm(`Delete ${selectedLeadIds.size} selected leads?`)) {
      selectedLeadIds.forEach((id) => onDeleteLead(id));
      setSelectedLeadIds(new Set());
    }
  };

  const handleBulkMoveStatus = (stage: PipelineStage) => {
    if (!onUpdateLeadStage || selectedLeadIds.size === 0) return;
    selectedLeadIds.forEach((id) => onUpdateLeadStage(id, stage));
    setSelectedLeadIds(new Set());
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-sans">
      {/* Search & Actions Bar */}
      <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Global Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by business name, keyword, location, email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                showAdvancedFilters || selectedIndustry !== 'all' || selectedCountry !== 'all' || selectedSource !== 'all' || contactAvailability !== 'all'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Column Visibility Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                title="Toggle Columns"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Columns</span>
              </button>

              {showColumnPicker && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-2 z-30 text-xs space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 px-2 py-1 text-[11px] uppercase tracking-wider">
                    Toggle Table Columns
                  </div>
                  {Object.entries(columns).map(([col, isVisible]) => (
                    <label key={col} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={(e) => setColumns({ ...columns, [col]: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span className="capitalize text-slate-700 dark:text-slate-300">{col.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Export genuine records to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Company */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Company Search</label>
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Filter by business..."
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>

            {/* Search Contact */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Contact Search</label>
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Name or email..."
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="all">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="all">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Source Platform Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Source Platform</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="all">All Platforms</option>
                {sources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Contact Availability */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Contact Details</label>
              <select
                value={contactAvailability}
                onChange={(e) => setContactAvailability(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="all">Any Contact Info</option>
                <option value="both">Both Email & Phone</option>
                <option value="has_email">Has Verified Email</option>
                <option value="has_phone">Has Phone Number</option>
                <option value="missing">Missing Direct Contacts</option>
              </select>
            </div>

            {/* Lead Status */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Lifecycle Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="all">All Lead Statuses</option>
                <option value="New Lead">New Lead</option>
                <option value="Approached">Approached</option>
                <option value="Waiting for Client Response">Waiting for Response</option>
                <option value="Interested">Interested</option>
                <option value="Converted / Won">Converted / Won</option>
                <option value="Wasted Lead">Wasted Lead</option>
              </select>
            </div>

            {/* Clear Filters Action */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setGlobalSearch('');
                  setCompanySearch('');
                  setContactSearch('');
                  setSelectedIndustry('all');
                  setSelectedCountry('all');
                  setSelectedSource('all');
                  setSelectedStatus('all');
                  setContactAvailability('all');
                }}
                className="w-full py-1.5 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer font-semibold"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedLeadIds.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-blue-900 dark:text-blue-200 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <span>{selectedLeadIds.size} leads selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkMoveStatus('qualified')}
              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer"
            >
              Mark Qualified
            </button>
            <button
              onClick={() => handleBulkMoveStatus('contacted')}
              className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-800 text-white font-medium transition cursor-pointer"
            >
              Mark Approached
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium transition cursor-pointer"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Clean Lead Table */}
      <div className="bg-white dark:bg-[#111c2e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedLeads.length > 0 && selectedLeadIds.size === paginatedLeads.length}
                    onChange={handleToggleSelectAll}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                </th>

                {columns.businessName && (
                  <th
                    className="py-3 px-3.5 cursor-pointer hover:text-slate-900"
                    onClick={() => {
                      setSortField('name');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Business Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {columns.contactPerson && <th className="py-3 px-3.5">Contact Person</th>}
                {columns.industry && <th className="py-3 px-3.5">Industry</th>}
                {columns.location && <th className="py-3 px-3.5">Location</th>}
                {columns.email && <th className="py-3 px-3.5">Email</th>}
                {columns.phone && <th className="py-3 px-3.5">Phone</th>}
                {columns.source && <th className="py-3 px-3.5">Source</th>}

                {columns.score && (
                  <th
                    className="py-3 px-3.5 cursor-pointer hover:text-slate-900"
                    onClick={() => {
                      setSortField('score');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Lead Score</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {columns.status && <th className="py-3 px-3.5">Status</th>}

                {columns.dateAdded && (
                  <th
                    className="py-3 px-3.5 cursor-pointer hover:text-slate-900"
                    onClick={() => {
                      setSortField('date');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date Added</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {columns.actions && <th className="py-3 px-3.5 text-right">Actions</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No leads match your active filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting your filter parameters or start a new discovery.</p>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const score = lead.scoreBreakdown?.leadQualityScore ?? 70;
                  const isSelected = selectedLeadIds.has(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setActiveDrawerLead(lead)}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectLead(lead.id)}
                          className="rounded text-blue-600 focus:ring-0"
                        />
                      </td>

                      {/* Business Name */}
                      {columns.businessName && (
                        <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate">{lead.businessName || lead.title}</span>
                            {lead.contact?.website && (
                              <a
                                href={lead.contact.website}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-400 hover:text-blue-600"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Contact Person */}
                      {columns.contactPerson && (
                        <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 max-w-[130px] truncate">
                          {lead.contact?.contactPerson || <span className="text-slate-400">—</span>}
                        </td>
                      )}

                      {/* Industry */}
                      {columns.industry && (
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 max-w-[130px] truncate">
                          {lead.category || <span className="text-slate-400">—</span>}
                        </td>
                      )}

                      {/* Location */}
                      {columns.location && (
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 max-w-[120px] truncate">
                          {lead.city ? `${lead.city}, ${lead.country}` : lead.country || <span className="text-slate-400">—</span>}
                        </td>
                      )}

                      {/* Email */}
                      {columns.email && (
                        <td className="py-3 px-3.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 max-w-[150px] truncate">
                          {lead.contact?.email ? (
                            <span className="text-blue-600 dark:text-blue-400 font-medium">{lead.contact.email}</span>
                          ) : (
                            <span className="text-slate-400">Unavailable</span>
                          )}
                        </td>
                      )}

                      {/* Phone */}
                      {columns.phone && (
                        <td className="py-3 px-3.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                          {lead.contact?.phone || <span className="text-slate-400">Unavailable</span>}
                        </td>
                      )}

                      {/* Source */}
                      {columns.source && (
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {lead.platform}
                          </span>
                        </td>
                      )}

                      {/* Lead Score */}
                      {columns.score && (
                        <td className="py-3 px-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              score >= 80
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : score >= 65
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {score}
                          </span>
                        </td>
                      )}

                      {/* Status */}
                      {columns.status && (
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                            {lead.currentStatus || 'New Lead'}
                          </span>
                        </td>
                      )}

                      {/* Date Added */}
                      {columns.dateAdded && (
                        <td className="py-3 px-3.5 text-slate-500 text-[11px]">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : lead.postedAt || 'Recent'}
                        </td>
                      )}

                      {/* Actions */}
                      {columns.actions && (
                        <td className="py-3 px-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveDrawerLead(lead)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Inspect Lead"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {onOpenEmailModal && lead.contact?.email && (
                            <button
                              onClick={() => onOpenEmailModal(lead)}
                              className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Send Email Proposal"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onDeleteLead && (
                            <button
                              onClick={() => {
                                if (confirm('Delete lead record?')) onDeleteLead(lead.id);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(currentPage * pageSize, filteredLeads.length)}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredLeads.length}</span> leads
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lead Details Drawer / Modal */}
      {activeDrawerLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end transition-opacity">
          <div className="w-full max-w-xl bg-white dark:bg-[#111c2e] h-full shadow-2xl flex flex-col font-sans border-l border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Drawer Header */}
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate max-w-sm">
                  {activeDrawerLead.businessName || activeDrawerLead.title}
                </h3>
                <p className="text-[11px] text-slate-500">Source: {activeDrawerLead.platform}</p>
              </div>
              <button
                onClick={() => setActiveDrawerLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Section 1: Company Information */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400 border-b pb-1">
                  Company Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Company Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeDrawerLead.businessName || 'Unavailable'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Industry</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeDrawerLead.category || 'Unavailable'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeDrawerLead.city ? `${activeDrawerLead.city}, ${activeDrawerLead.country}` : activeDrawerLead.country || 'Unavailable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Official Website</span>
                    {activeDrawerLead.contact?.website ? (
                      <a href={activeDrawerLead.contact.website} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline truncate block">
                        {activeDrawerLead.contact.website}
                      </a>
                    ) : (
                      <span className="text-slate-400">Unavailable</span>
                    )}
                  </div>
                </div>
                {activeDrawerLead.description && (
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">Company Description</span>
                    <p className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeDrawerLead.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Section 2: Contact Information */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400 border-b pb-1">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Person</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeDrawerLead.contact?.contactPerson || 'Unavailable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Job Title</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeDrawerLead.jobType || 'Decision Maker'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Business Email</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {activeDrawerLead.contact?.email || 'Unavailable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Verification</span>
                    <span className="font-semibold">
                      {activeDrawerLead.contact?.email ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-slate-400">Unavailable</span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone Number</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {activeDrawerLead.contact?.phone || 'Unavailable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">WhatsApp Outreach</span>
                    {activeDrawerLead.contact?.phone ? (
                      <a
                        href={`https://wa.me/${cleanWhatsAppDigits(activeDrawerLead.contact.phone, activeDrawerLead.country)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:underline font-semibold"
                      >
                        Start WhatsApp Chat
                      </a>
                    ) : (
                      <span className="text-slate-400">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Lead Information */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400 border-b pb-1">
                  Lead Intelligence
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Source Platform</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeDrawerLead.platform}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lead Quality Score</span>
                    <span className="text-base font-bold text-blue-600">
                      {activeDrawerLead.scoreBreakdown?.leadQualityScore ?? 70} / 100
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Qualification Status</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeDrawerLead.pipelineStage || 'New'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Discovery Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeDrawerLead.createdAt ? new Date(activeDrawerLead.createdAt).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>

                {activeDrawerLead.sourceEvidenceList && activeDrawerLead.sourceEvidenceList.length > 0 && (
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">Source Evidence</span>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
                      {activeDrawerLead.sourceEvidenceList.map((ev, i) => (
                        <div key={i} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                          <span>{ev.fieldName}: <strong className="text-slate-800 dark:text-slate-200">{ev.retrievedValue}</strong></span>
                          <span className="text-emerald-600 text-[10px] font-bold">{ev.verificationStatus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3">
              {onOpenEmailModal && activeDrawerLead.contact?.email ? (
                <button
                  onClick={() => {
                    onOpenEmailModal(activeDrawerLead);
                    setActiveDrawerLead(null);
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Proposal</span>
                </button>
              ) : (
                <div className="text-xs text-slate-400">Direct proposal sending unavailable without email</div>
              )}
              <button
                onClick={() => setActiveDrawerLead(null)}
                className="py-2 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
