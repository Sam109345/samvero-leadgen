'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  CheckCircle2,
  Trash2,
  ArrowUpRight,
  Bookmark,
} from 'lucide-react';
import { Lead, LeadList } from '@/types';

interface LeadListsViewProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
}

export default function LeadListsView({ leads, onSelectLead }: LeadListsViewProps) {
  const [lists, setLists] = useState<LeadList[]>([
    {
      id: 'list-1',
      name: 'High-Ticket Aesthetic Clinics UAE',
      description: 'Prime Jumeirah & Downtown Dubai clinics without digital booking engine',
      leadIds: leads.filter((l) => l.country === 'UAE').slice(0, 5).map((l) => l.id),
      createdAt: '2026-10-24T12:00:00Z',
      updatedAt: '2026-10-29T10:00:00Z',
      color: 'blue',
    },
    {
      id: 'list-2',
      name: 'Pakistan Top Tier Corporate Chambers',
      description: 'Established PSX-listed industrial firms and corporate law practices',
      leadIds: leads.filter((l) => l.country === 'Pakistan').slice(0, 4).map((l) => l.id),
      createdAt: '2026-10-25T14:00:00Z',
      updatedAt: '2026-10-28T16:00:00Z',
      color: 'emerald',
    },
    {
      id: 'list-3',
      name: 'UK Harley Street & Dental Practices',
      description: 'London private healthcare clinics requiring Next.js patient portals',
      leadIds: leads.filter((l) => l.country === 'UK').slice(0, 4).map((l) => l.id),
      createdAt: '2026-10-26T09:30:00Z',
      updatedAt: '2026-10-27T11:00:00Z',
      color: 'purple',
    },
  ]);

  const [activeListId, setActiveListId] = useState<string>(lists[0]?.id || '');
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  const activeList = lists.find((l) => l.id === activeListId);
  const activeMembers = React.useMemo(() => {
    if (!activeList) return [];
    const idSet = new Set(activeList.leadIds);
    return leads.filter((l) => idSet.has(l.id));
  }, [activeList, leads]);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const created: LeadList = {
      id: `list-${Date.now()}`,
      name: newListName.trim(),
      description: newListDesc.trim(),
      leadIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLists([...lists, created]);
    setActiveListId(created.id);
    setNewListName('');
    setNewListDesc('');
    setShowNewListModal(false);
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              Lead Segmentation
            </span>
            <span className="text-xs text-slate-500 font-bold">{lists.length} Custom Lists</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Custom Lead Lists</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize high-priority targets into customized lists for dedicated campaigns and sales outreach
          </p>
        </div>

        <button
          onClick={() => setShowNewListModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead List</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Lists Roster */}
        <div className="space-y-3">
          {lists.map((l) => {
            const isSelected = l.id === activeListId;

            return (
              <button
                key={l.id}
                onClick={() => setActiveListId(l.id)}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs truncate text-slate-900 dark:text-white">{l.name}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {l.leadIds.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                  {l.description || 'No description provided'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Members of Selected List */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          {activeList ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-black">{activeList.name}</h2>
                  <p className="text-xs text-slate-500">{activeList.description}</p>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-cyan-400">
                  {activeMembers.length} Target Leads
                </span>
              </div>

              {activeMembers.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs italic">
                  This list currently contains 0 leads. Add leads from the &quot;All Leads&quot; view.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeMembers.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead?.(lead)}
                      className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{lead.businessName}</div>
                        <div className="text-[11px] text-slate-500">
                          {lead.city}, {lead.country} • {lead.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-amber-600">
                          {lead.scoreBreakdown?.leadQualityScore || 80} pts
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs italic">Select a list to view members</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black">Create Custom Lead List</h3>
            <form onSubmit={handleCreateList} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Q4 High-Value Aesthetic Clinics"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Description (Optional)</label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Brief note on target segment..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewListModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
