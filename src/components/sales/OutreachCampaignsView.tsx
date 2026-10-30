'use client';

import React, { useState } from 'react';
import {
  Send,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  MailCheck,
  TrendingUp,
  BarChart3,
  Users,
} from 'lucide-react';
import { Lead, OutreachCampaign } from '@/types';

interface OutreachCampaignsViewProps {
  leads: Lead[];
  onOpenEmailModal?: (lead: Lead) => void;
}

export default function OutreachCampaignsView({
  leads,
  onOpenEmailModal,
}: OutreachCampaignsViewProps) {
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>([
    {
      id: 'camp-1',
      name: 'Dubai Luxury Aesthetic & Yacht Outbound',
      status: 'active',
      targetCategory: 'Local Business',
      targetCountry: 'UAE',
      totalLeads: 24,
      sentCount: 18,
      openedCount: 14,
      repliedCount: 5,
      convertedCount: 2,
      createdAt: '2026-10-25T10:00:00Z',
      updatedAt: '2026-10-29T14:30:00Z',
    },
    {
      id: 'camp-2',
      name: 'Pakistan Diagnostic & Corporate Law Chambers',
      status: 'active',
      targetCategory: 'Local Business',
      targetCountry: 'Pakistan',
      totalLeads: 16,
      sentCount: 12,
      openedCount: 9,
      repliedCount: 3,
      convertedCount: 1,
      createdAt: '2026-10-26T11:00:00Z',
      updatedAt: '2026-10-29T16:00:00Z',
    },
    {
      id: 'camp-3',
      name: 'UK Harley Street & High-Ticket Portals',
      status: 'draft',
      targetCategory: 'Web Development',
      targetCountry: 'UK',
      totalLeads: 12,
      sentCount: 0,
      openedCount: 0,
      repliedCount: 0,
      convertedCount: 0,
      createdAt: '2026-10-28T09:00:00Z',
      updatedAt: '2026-10-28T09:00:00Z',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampCountry, setNewCampCountry] = useState('UAE');
  const [newCampCat, setNewCampCat] = useState('Local Business');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) return;

    const matchedLeads = leads.filter(
      (l) =>
        (newCampCountry === 'all' || l.country === newCampCountry) &&
        (newCampCat === 'all' || l.category.includes(newCampCat))
    );

    const created: OutreachCampaign = {
      id: `camp-${Date.now()}`,
      name: newCampName.trim(),
      status: 'draft',
      targetCategory: newCampCat,
      targetCountry: newCampCountry,
      totalLeads: matchedLeads.length || 10,
      sentCount: 0,
      openedCount: 0,
      repliedCount: 0,
      convertedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns([created, ...campaigns]);
    setNewCampName('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              Outreach Engine
            </span>
            <span className="text-xs text-slate-500 font-bold">Personalized Cold Email Dispatch</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Outreach Campaigns</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create segmented cold email sequences directed strictly at verified corporate domains
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((camp) => {
          const openRate = camp.sentCount > 0 ? Math.round((camp.openedCount / camp.sentCount) * 100) : 0;
          const replyRate = camp.sentCount > 0 ? Math.round((camp.repliedCount / camp.sentCount) * 100) : 0;

          return (
            <div
              key={camp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      camp.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    {camp.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{camp.targetCountry}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{camp.name}</h3>
                <div className="text-xs text-slate-500 mb-3">{camp.targetCategory}</div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs">
                  <div>
                    <div className="font-black text-slate-900 dark:text-white">{camp.sentCount}</div>
                    <div className="text-[10px] text-slate-400">Dispatched</div>
                  </div>
                  <div>
                    <div className="font-black text-blue-600">{openRate}%</div>
                    <div className="text-[10px] text-slate-400">Open Rate</div>
                  </div>
                  <div>
                    <div className="font-black text-emerald-600">{replyRate}%</div>
                    <div className="text-[10px] text-slate-400">Reply Rate</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Total Target: {camp.totalLeads} leads</span>
                <span className="text-blue-600">Active Pipeline</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black">Create Outreach Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="e.g. Q4 Dubai Marina Luxury Redesign"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Target Market Territory</label>
                <select
                  value={newCampCountry}
                  onChange={(e) => setNewCampCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="all">Global</option>
                  <option value="UAE">UAE</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Target Scope</label>
                <select
                  value={newCampCat}
                  onChange={(e) => setNewCampCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="all">All Industries</option>
                  <option value="Local Business">Local Business / Clinic</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
