'use client';

import React, { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { CustomerLeadRecord } from '@/lib/saas-store';
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
} from 'lucide-react';

export default function CustomerLeadsPage() {
  const [leads, setLeads] = useState<CustomerLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<CustomerLeadRecord | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/customer/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId: string, nextStatus: CustomerLeadRecord['status']) => {
    try {
      const res = await fetch('/api/customer/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === leadId || l.leadId === leadId ? { ...l, status: nextStatus } : l)));
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
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id || l.leadId === selectedLead.id ? { ...l, notes: editNotes } : l))
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
        setLeads((prev) => prev.filter((l) => l.id !== leadId && l.leadId !== leadId));
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting lead');
    }
  };

  const handleExportCsv = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = ['Business Name', 'Category', 'Country', 'City', 'Platform', 'Email', 'Phone', 'Website', 'Status', 'Consumed At'];
    const rows = filteredLeads.map((l) => [
      `"${l.businessName.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.country}"`,
      `"${l.city || ''}"`,
      `"${l.platform}"`,
      `"${l.contact?.email || ''}"`,
      `"${l.contact?.phone || ''}"`,
      `"${l.contact?.website || ''}"`,
      `"${l.status}"`,
      `"${l.consumedAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samvero-leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.businessName.toLowerCase().includes(term) ||
      l.category.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      (l.city || '').toLowerCase().includes(term) ||
      (l.contact?.email || '').toLowerCase().includes(term) ||
      (l.contact?.phone || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <CustomerLayout
      title="My Saved Leads & Opportunities"
      subtitle="Your private tenant lead database. Filter by stage, update qualification status, inspect contact details, or export to CSV."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by business, email, phone, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            {[
              { label: 'All', value: 'all' },
              { label: 'Saved', value: 'saved' },
              { label: 'Researched', value: 'researched' },
              { label: 'Contacted', value: 'contacted' },
              { label: 'Qualified', value: 'qualified' },
              { label: 'Archived', value: 'archived' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition shrink-0 ${
                  statusFilter === tab.value
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-[#080d1a] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg transition flex items-center gap-1.5 shrink-0"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchLeads}
              className="p-1.5 bg-[#080d1a] border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Business & Category</th>
                  <th className="py-3.5 px-4">Location & Source</th>
                  <th className="py-3.5 px-4">Contact Intelligence</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-mono">
                      Loading your saved leads...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-mono">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-850/30 transition">
                      {/* Business */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{lead.businessName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{lead.category}</div>
                        {lead.notes && (
                          <div className="text-[10px] text-amber-300 font-sans italic mt-1 truncate max-w-[220px]">
                            &ldquo;{lead.notes}&rdquo;
                          </div>
                        )}
                      </td>

                      {/* Location & Source */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-mono text-[11px]">
                          {lead.city ? `${lead.city}, ` : ''}{lead.country}
                        </div>
                        <span className="inline-block mt-0.5 text-[10px] font-mono text-slate-400">
                          via {lead.platform}
                        </span>
                      </td>

                      {/* Contact */}
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

                      {/* Stage Selector */}
                      <td className="py-3.5 px-4">
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

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
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
                    placeholder="e.g. Sent personalized pitch email on Tuesday. Follow up on LinkedIn."
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
