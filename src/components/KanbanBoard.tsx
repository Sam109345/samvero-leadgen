'use client';

import React from 'react';
import { 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  Flame, 
  ArrowRight,
  Globe,
  Star
} from 'lucide-react';
import { Lead, PipelineStage } from '@/types';

interface KanbanBoardProps {
  leads: Lead[];
  onGenerateWebsite: (lead: Lead) => void;
  onOpenOutreach: (lead: Lead) => void;
  onMoveStage: (leadId: string, nextStage: PipelineStage) => void;
  onOpenNewLeadModal: () => void;
}

export default function KanbanBoard({
  leads,
  onGenerateWebsite,
  onOpenOutreach,
  onMoveStage,
  onOpenNewLeadModal,
}: KanbanBoardProps) {
  const columns: Array<{
    id: PipelineStage;
    label: string;
    countColor: string;
    badgeBg: string;
    filter: (lead: Lead) => boolean;
  }> = [
    {
      id: 'new',
      label: 'New Ingested Leads',
      countColor: 'text-blue-700 bg-blue-100',
      badgeBg: 'border-blue-200',
      filter: (l) => !l.pipelineStage || l.pipelineStage === 'new',
    },
    {
      id: 'hot',
      label: 'Hot Targets (No Website)',
      countColor: 'text-amber-800 bg-amber-100',
      badgeBg: 'border-amber-200',
      filter: (l) => l.pipelineStage === 'hot' || (!l.pipelineStage && !l.contact.hasWebsite),
    },
    {
      id: 'pending',
      label: 'Pitched & In Outreach',
      countColor: 'text-purple-700 bg-purple-100',
      badgeBg: 'border-purple-200',
      filter: (l) => l.pipelineStage === 'pending',
    },
    {
      id: 'won',
      label: 'Qualified & Won',
      countColor: 'text-emerald-700 bg-emerald-100',
      badgeBg: 'border-emerald-200',
      filter: (l) => l.pipelineStage === 'won',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start pb-6">
      {columns.map((col) => {
        const colLeads = leads.filter(col.filter);

        return (
          <div
            key={col.id}
            className="bg-slate-100/70 rounded-3xl p-3.5 border border-slate-200/90 flex flex-col max-h-[82vh]"
          >
            {/* Column Header (Salessage style Image 2) */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">
                  {col.label}
                </h3>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${col.countColor}`}
                >
                  {colLeads.length}
                </span>
              </div>
            </div>

            {/* + Add Leads Button (Salessage style) */}
            <button
              onClick={onOpenNewLeadModal}
              className="w-full py-2 mb-3 rounded-xl border border-dashed border-blue-400/80 bg-blue-50/60 hover:bg-blue-100/70 text-[#1877F2] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add custom lead</span>
            </button>

            {/* Cards Scrollable Column */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {colLeads.length > 0 ? (
                colLeads.map((lead) => {
                  const cleanPhone = lead.contact.phone?.replace(/[^0-9]/g, '');
                  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : undefined;

                  return (
                    <div
                      key={lead.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group"
                    >
                      {/* Top Row: Avatar + Name + Business Age */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 shadow-inner">
                            {lead.type === 'gmb' ? (
                              <Building2 className="w-4 h-4 text-[#1877F2]" />
                            ) : (
                              <Briefcase className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight group-hover:text-[#1877F2] transition line-clamp-1">
                              {lead.businessName}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {lead.city}, {lead.country}
                            </span>
                          </div>
                        </div>

                        {/* Age Pill Badge */}
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-2xs shrink-0 ${
                            lead.businessAge.isNew
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          {lead.businessAge.label}
                        </span>
                      </div>

                      {/* Missing Website Opportunity Alert */}
                      {!lead.contact.hasWebsite ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                            <span>Missing Website (Hot)</span>
                          </div>
                          <button
                            onClick={() => onGenerateWebsite(lead)}
                            className="text-[10px] font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded hover:bg-amber-300 transition"
                          >
                            Draft
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 truncate">
                          <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="truncate">{lead.contact.website}</span>
                        </div>
                      )}

                      {/* Contact Details (Salessage style Image 2) */}
                      <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                        {lead.contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a
                              href={`tel:${lead.contact.phone}`}
                              className="hover:text-blue-600 font-medium text-[11px]"
                            >
                              {lead.contact.phone}
                            </a>
                          </div>
                        )}
                        {lead.contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[11px] font-medium truncate">
                              {lead.contact.email}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Icon Action Row (Salessage style icons) */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          {lead.contact.email && (
                            <button
                              onClick={() => onOpenOutreach(lead)}
                              title="Send Email Proposal"
                              className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1877F2] flex items-center justify-center transition"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {lead.contact.phone && (
                            <a
                              href={`tel:${lead.contact.phone}`}
                              title="Direct Phone Call"
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {whatsappUrl && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Instant WhatsApp Message"
                              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => onGenerateWebsite(lead)}
                            title="Auto-Generate Client Website"
                            className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {lead.generatedWebsite && (
                            <a
                              href={`/preview/${lead.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Open Live Website Preview"
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Move Pipeline Stage Dropdown */}
                        <select
                          value={col.id}
                          onChange={(e) => onMoveStage(lead.id, e.target.value as PipelineStage)}
                          className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-2 py-1 outline-none border border-slate-200 cursor-pointer"
                        >
                          <option value="new">Move: New</option>
                          <option value="hot">Move: Hot</option>
                          <option value="pending">Move: Pitched</option>
                          <option value="won">Move: Won</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-xs text-slate-400">
                  No leads in this stage.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
