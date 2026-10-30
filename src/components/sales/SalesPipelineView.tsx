'use client';

import React, { useState, useMemo } from 'react';
import {
  Kanban,
  Search,
  MoveRight,
  Star,
  ExternalLink,
  MailCheck,
  PhoneCall,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Lead, PipelineStage } from '@/types';

interface SalesPipelineViewProps {
  leads: Lead[];
  onUpdateLeadStage: (leadId: string, stage: PipelineStage) => void;
  onSelectLead?: (lead: Lead) => void;
}

export default function SalesPipelineView({
  leads,
  onUpdateLeadStage,
  onSelectLead,
}: SalesPipelineViewProps) {
  const [pipelineSearch, setPipelineSearch] = useState('');

  // 13 Required Sales Pipeline Stages
  const stages: Array<{ id: PipelineStage; label: string; color: string; border: string }> = [
    { id: 'new', label: '1. New Discovery', color: 'bg-blue-500', border: 'border-blue-400' },
    { id: 'research_pending', label: '2. Research Pending', color: 'bg-indigo-500', border: 'border-indigo-400' },
    { id: 'researching', label: '3. In Research', color: 'bg-sky-500', border: 'border-sky-400' },
    { id: 'researched', label: '4. Researched & Enriched', color: 'bg-teal-500', border: 'border-teal-400' },
    { id: 'qualified', label: '5. Qualified Lead', color: 'bg-amber-500', border: 'border-amber-400' },
    { id: 'contacted', label: '6. Contacted / Pitched', color: 'bg-purple-500', border: 'border-purple-400' },
    { id: 'follow_up', label: '7. Follow-up Required', color: 'bg-cyan-500', border: 'border-cyan-400' },
    { id: 'replied', label: '8. Client Replied', color: 'bg-pink-500', border: 'border-pink-400' },
    { id: 'interested', label: '9. Hot & Interested', color: 'bg-orange-500', border: 'border-orange-400' },
    { id: 'proposal_sent', label: '10. Proposal Dispatched', color: 'bg-violet-500', border: 'border-violet-400' },
    { id: 'won', label: '11. Closed & Won 🎉', color: 'bg-emerald-500', border: 'border-emerald-400' },
    { id: 'lost', label: '12. Lost / Inactive', color: 'bg-slate-500', border: 'border-slate-400' },
    { id: 'archived', label: '13. Archived', color: 'bg-slate-400', border: 'border-slate-300' },
  ];

  const filtered = useMemo(() => {
    if (!pipelineSearch.trim()) return leads;
    const q = pipelineSearch.toLowerCase().trim();
    return leads.filter(
      (l) =>
        l.businessName?.toLowerCase().includes(q) ||
        l.title?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q)
    );
  }, [leads, pipelineSearch]);

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1800px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
              CRM Engine
            </span>
            <span className="text-xs text-slate-500 font-bold">13-Stage Enterprise Sales Funnel</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Sales Pipeline Kanban</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track deals from initial opportunity discovery through outreach pitch, client response, and won deals
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={pipelineSearch}
            onChange={(e) => setPipelineSearch(e.target.value)}
            placeholder="Search deals in pipeline..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 min-h-[600px]">
        {stages.map((stage) => {
          const stageLeads = filtered.filter(
            (l) => (l.pipelineStage || 'new') === stage.id || (stage.id === 'new' && l.pipelineStage === 'hot')
          );

          return (
            <div
              key={stage.id}
              className="w-80 shrink-0 flex flex-col bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 px-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <span className="truncate">{stage.label}</span>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {stageLeads.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs italic">
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const score = lead.scoreBreakdown?.leadQualityScore || 78;
                    const hasEmail = Boolean(lead.contact?.email);
                    const hasPhone = Boolean(lead.contact?.phone);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 shadow-xs space-y-2.5 hover:shadow-md transition group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => onSelectLead?.(lead)}
                            className="text-left font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1"
                          >
                            {lead.businessName}
                          </button>
                          <span className="text-[10px] font-black text-amber-600 shrink-0">
                            {score} pts
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {lead.city}, {lead.country} • {lead.category}
                        </div>

                        {/* Contacts Indicator */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          {hasEmail ? (
                            <span className="text-teal-600 font-semibold flex items-center gap-0.5">
                              <MailCheck className="w-3 h-3" /> Email
                            </span>
                          ) : null}
                          {hasPhone ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <PhoneCall className="w-3 h-3" /> Phone
                            </span>
                          ) : null}
                          {!hasEmail && !hasPhone && (
                            <span className="text-slate-400 italic">No contact yet</span>
                          )}
                        </div>

                        {/* Stage Selector */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-semibold">Move:</span>
                          <select
                            value={lead.pipelineStage || 'new'}
                            onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as PipelineStage)}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border-none cursor-pointer focus:ring-0"
                          >
                            {stages.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
