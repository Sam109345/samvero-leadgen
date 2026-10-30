'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CustomerLeadRecord } from '@/lib/saas-store';
import { Lead } from '@/types';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Trash2,
  RefreshCw,
  Tag,
} from 'lucide-react';

interface CustomerLeadWithMeta extends CustomerLeadRecord {
  customer?: {
    name: string;
    email: string;
    businessName?: string;
  };
}

export default function AdminLeadsPage() {
  const [customerLeads, setCustomerLeads] = useState<CustomerLeadWithMeta[]>([]);
  const [globalSample, setGlobalSample] = useState<Lead[]>([]);
  const [totalGlobal, setTotalGlobal] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'customer_pool' | 'global_catalog'>('customer_pool');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<CustomerLeadWithMeta | Lead | null>(null);

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/admin/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomerLeads(data.customerLeads || []);
          setTotalGlobal(data.totalGlobalLeads || 0);
          setGlobalSample(data.globalLeadsSample || []);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDeleteCustomerLead = async (customerId: string, leadId: string) => {
    if (!window.confirm('Are you sure you want to remove this lead from the customer account?')) return;

    try {
      const res = await fetch(`/api/admin/leads?customerId=${customerId}&leadId=${leadId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCustomerLeads(customerLeads.filter((l) => !(l.customerId === customerId && (l.id === leadId || l.leadId === leadId))));
      } else {
        alert(data.error || 'Failed to delete lead');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting lead');
    }
  };

  const filteredCustomerLeads = customerLeads.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      l.businessName.toLowerCase().includes(term) ||
      (l.customer?.name || '').toLowerCase().includes(term) ||
      (l.customer?.email || '').toLowerCase().includes(term) ||
      l.category.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      l.platform.toLowerCase().includes(term)
    );
  });

  const filteredGlobalLeads = globalSample.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      l.businessName.toLowerCase().includes(term) ||
      l.category.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      l.platform.toLowerCase().includes(term)
    );
  });

  const emailCount = customerLeads.filter((l) => l.contact?.email).length;
  const phoneCount = customerLeads.filter((l) => l.contact?.phone).length;

  return (
    <AdminLayout
      title="Global Leads Pool & Multi-Tenant Registry"
      subtitle="Inspect tenant-isolated customer lead stores, real-time lead allocations, contact discovery coverage, and platform catalog provenance."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Customer Consumed Leads</div>
            <div className="text-2xl font-bold text-white mt-1">{customerLeads.length}</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Isolated across tenant accounts</div>
          </div>
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Catalog Leads In Engine</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{totalGlobal.toLocaleString()}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">100% genuine scrapers & connectors</div>
          </div>
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Verified Email Coverage</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {customerLeads.length > 0 ? Math.round((emailCount / customerLeads.length) * 100) : 0}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{emailCount} valid mailboxes found</div>
          </div>
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Verified Direct Phone Coverage</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">
              {customerLeads.length > 0 ? Math.round((phoneCount / customerLeads.length) * 100) : 0}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{phoneCount} validated phone lines</div>
          </div>
        </div>

        {/* Toolbar & Tabs */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customer_pool')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'customer_pool'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-[#080d1a] text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Tenant Customer Leads ({customerLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('global_catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'global_catalog'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-[#080d1a] text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Global Engine Discovery Pool ({totalGlobal})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search business, customer, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>
            <button
              onClick={fetchLeads}
              className="p-2 bg-[#080d1a] border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Tenant Customer Pool */}
        {activeTab === 'customer_pool' && (
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Customer Tenant</th>
                    <th className="py-3.5 px-4">Business & Category</th>
                    <th className="py-3.5 px-4">Location & Platform</th>
                    <th className="py-3.5 px-4">Contact Intelligence</th>
                    <th className="py-3.5 px-4">Stage</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                        Loading customer leads pool...
                      </td>
                    </tr>
                  ) : filteredCustomerLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                        No customer leads match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomerLeads.map((clead) => (
                      <tr key={clead.id} className="hover:bg-slate-850/30 transition">
                        {/* Customer */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{clead.customer?.name || 'Customer'}</div>
                          <div className="text-[11px] font-mono text-slate-400">{clead.customer?.email}</div>
                          {clead.customer?.businessName && (
                            <div className="text-[10px] text-amber-400/80">{clead.customer.businessName}</div>
                          )}
                        </td>

                        {/* Business */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{clead.businessName}</div>
                          <span className="inline-block mt-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                            {clead.category}
                          </span>
                        </td>

                        {/* Location & Platform */}
                        <td className="py-3 px-4">
                          <div className="text-slate-300 font-mono text-[11px]">
                            {clead.city ? `${clead.city}, ` : ''}{clead.country}
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] font-mono text-slate-400">
                            via {clead.platform}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {clead.contact?.email ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                                <Mail className="w-3 h-3 shrink-0" />
                                <span className="truncate max-w-[180px]">{clead.contact.email}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-mono">No Email</span>
                            )}
                            {clead.contact?.phone ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-mono">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span>{clead.contact.phone}</span>
                              </div>
                            ) : null}
                          </div>
                        </td>

                        {/* Stage */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                              clead.status === 'qualified'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : clead.status === 'researched'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                : clead.status === 'contacted'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {clead.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedLead(clead)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition"
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => handleDeleteCustomerLead(clead.customerId, clead.id)}
                              className="p-1 rounded text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* Tab 2: Global Engine Catalog Sample */}
        {activeTab === 'global_catalog' && (
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Business Name</th>
                    <th className="py-3.5 px-4">Category & Industry</th>
                    <th className="py-3.5 px-4">Geo Location</th>
                    <th className="py-3.5 px-4">Connector Provenance</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredGlobalLeads.map((glead) => (
                    <tr key={glead.id} className="hover:bg-slate-850/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{glead.businessName}</div>
                        {glead.contact?.website && (
                          <a
                            href={glead.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-400/80 hover:underline flex items-center gap-1 font-mono mt-0.5"
                          >
                            <Globe className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[160px]">{glead.contact.website}</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[10px]">
                          {glead.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300 font-mono">
                          {glead.city ? `${glead.city}, ` : ''}{glead.country}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-300 font-mono font-medium">{glead.platform}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 text-[11px] font-mono">
                          {glead.contact?.email && <div className="text-emerald-400 truncate max-w-[160px]">{glead.contact.email}</div>}
                          {glead.contact?.phone && <div className="text-indigo-400">{glead.contact.phone}</div>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLead(glead)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lead Inspection Drawer / Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <h3 className="text-base font-semibold text-white mb-1">{selectedLead.businessName}</h3>
              <p className="text-xs text-slate-400 mb-4">
                Category: <span className="text-amber-400">{selectedLead.category}</span> &bull; Source:{' '}
                <span className="text-white">{selectedLead.platform}</span>
              </p>

              <div className="space-y-3 bg-[#080d1a] p-4 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-white">
                    {selectedLead.city ? `${selectedLead.city}, ` : ''}{selectedLead.country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-emerald-400">{selectedLead.contact?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="text-indigo-400">{selectedLead.contact?.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Website:</span>
                  <span className="text-amber-300 truncate max-w-[200px]">{selectedLead.contact?.website || 'N/A'}</span>
                </div>
                {selectedLead.contact?.social && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Social:</span>
                    <span className="text-slate-300">{JSON.stringify(selectedLead.contact.social)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
