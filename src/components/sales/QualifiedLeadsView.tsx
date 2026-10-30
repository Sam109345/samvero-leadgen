'use client';

import React from 'react';
import {
  Star,
  CheckCircle2,
  MailCheck,
  PhoneCall,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import { Lead } from '@/types';

interface QualifiedLeadsViewProps {
  leads: Lead[];
  onOpenEmailModal?: (lead: Lead) => void;
  onSelectLead?: (lead: Lead) => void;
}

export default function QualifiedLeadsView({
  leads,
  onOpenEmailModal,
  onSelectLead,
}: QualifiedLeadsViewProps) {
  const qualified = React.useMemo(() => {
    return leads.filter(
      (l) =>
        (l.scoreBreakdown?.leadQualityScore || 75) >= 75 ||
        l.pipelineStage === 'qualified' ||
        (Boolean(l.contact?.email) && Boolean(l.contact?.phone))
    );
  }, [leads]);

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1500px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
            High-Conversion Prospects
          </span>
          <span className="text-xs text-slate-500 font-bold">{qualified.length} Qualified Opportunities</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Qualified Leads</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Filtered targets with verified corporate contact points, confirmed commercial budget, and high quality scores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {qualified.map((lead) => {
          const score = lead.scoreBreakdown?.leadQualityScore || 85;
          const hasEmail = Boolean(lead.contact?.email);
          const hasPhone = Boolean(lead.contact?.phone);

          return (
            <div
              key={lead.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    Qualified Opportunity
                  </span>
                  <span className="text-xs font-black text-amber-600">{score} pts</span>
                </div>

                <button
                  onClick={() => onSelectLead?.(lead)}
                  className="text-left font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1 mb-1 block w-full"
                >
                  {lead.businessName}
                </button>
                <div className="text-xs text-slate-500 mb-2">
                  {lead.city}, {lead.country} • {lead.category}
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs font-mono">
                  {hasEmail && (
                    <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 truncate">
                      <MailCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{lead.contact?.email}</span>
                    </div>
                  )}
                  {hasPhone && (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                      <span>{lead.contact?.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 truncate">{lead.budget || 'High Ticket'}</span>

                {hasEmail && onOpenEmailModal && (
                  <button
                    onClick={() => onOpenEmailModal(lead)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Pitch Now</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
