'use client';

import React, { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { CustomerLeadRecord } from '@/lib/saas-store';
import {
  ListFilter,
  PlusCircle,
  Folder,
  Database,
  Trash2,
  Mail,
  Phone,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface LeadList {
  id: string;
  name: string;
  description: string;
  tag: string;
  createdAt: string;
}

const DEFAULT_LISTS: LeadList[] = [
  {
    id: 'list-1',
    name: 'High-Priority Outbound',
    description: 'Verified leads with both valid email and direct phone line.',
    tag: 'High Priority Outbound',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list-2',
    name: 'Initial Plan Match',
    description: 'Leads matching your subscription industry profile.',
    tag: 'Initial Plan Match',
    createdAt: new Date().toISOString(),
  },
];

export default function CustomerLeadListsPage() {
  const [lists, setLists] = useState<LeadList[]>(DEFAULT_LISTS);
  const [selectedListId, setSelectedListId] = useState<string>('list-1');
  const [leads, setLeads] = useState<CustomerLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // New list modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  useEffect(() => {
    fetch('/api/customer/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList: LeadList = {
      id: `list-${Date.now()}`,
      name: newListName.trim(),
      description: newListDesc.trim() || 'Custom segmented lead list',
      tag: newListName.trim(),
      createdAt: new Date().toISOString(),
    };

    setLists([...lists, newList]);
    setSelectedListId(newList.id);
    setShowNewModal(false);
    setNewListName('');
    setNewListDesc('');
  };

  const selectedList = lists.find((l) => l.id === selectedListId) || lists[0];
  const listLeads = leads.filter((l) => {
    if (!selectedList) return true;
    if (selectedList.id === 'list-1') return Boolean(l.contact?.email && l.contact?.phone);
    if (selectedList.id === 'list-2') return (l.tags || []).includes('Initial Plan Match') || (l.tags || []).includes('High Priority Outbound');
    return (l.tags || []).includes(selectedList.tag);
  });

  return (
    <CustomerLayout
      title="Segmented Lead Lists & Campaigns"
      subtitle="Organize your verified leads into targeted outreach segments and campaign buckets."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Lists Sidebar */}
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-semibold text-white text-xs">My Lead Lists</span>
              <button
                onClick={() => setShowNewModal(true)}
                className="p-1 rounded-lg text-amber-400 hover:bg-slate-800 transition"
                title="Create New List"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {lists.map((list) => {
                const count = leads.filter((l) => {
                  if (list.id === 'list-1') return Boolean(l.contact?.email && l.contact?.phone);
                  if (list.id === 'list-2') return (l.tags || []).includes('Initial Plan Match') || (l.tags || []).includes('High Priority Outbound');
                  return (l.tags || []).includes(list.tag);
                }).length;

                const isSelected = list.id === selectedListId;

                return (
                  <button
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'bg-[#080d1a] text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span className="truncate">{list.name}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                        isSelected ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List Details & Leads Table */}
          <div className="md:col-span-3 bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{selectedList?.name || 'Lead List'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedList?.description}</p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-semibold">{listLeads.length} leads in list</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">Loading leads...</div>
            ) : listLeads.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                No leads currently in this list. Assign leads to this tag from the My Leads page.
              </div>
            ) : (
              <div className="space-y-2">
                {listLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">{lead.businessName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {lead.category} &bull; {lead.city ? `${lead.city}, ` : ''}{lead.country}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      {lead.contact?.email ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[140px]">{lead.contact.email}</span>
                        </span>
                      ) : null}
                      {lead.contact?.phone ? (
                        <span className="text-indigo-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{lead.contact.phone}</span>
                        </span>
                      ) : null}
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-800 text-slate-300 font-mono">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create List Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-base font-semibold text-white mb-1">Create Lead List</h3>
              <p className="text-xs text-slate-400 mb-4">Segment leads for targeted prospecting or drip campaigns.</p>

              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">List Name</label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g. US Dental Clinics Outbound"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Description / Campaign Goal</label>
                  <input
                    type="text"
                    value={newListDesc}
                    onChange={(e) => setNewListDesc(e.target.value)}
                    placeholder="e.g. Q4 Cold Email campaign targeting founders"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs font-mono transition"
                  >
                    Create List
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
