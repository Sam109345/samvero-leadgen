'use client';

import React from 'react';
import {
  Bookmark,
  Star,
  ExternalLink,
  MailCheck,
  PhoneCall,
  ArrowUpRight,
} from 'lucide-react';
import { Lead } from '@/types';

interface SavedLeadsViewProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
}

export default function SavedLeadsView({ leads, onSelectLead }: SavedLeadsViewProps) {
  // Saved leads: high scoring or starred
  const savedLeads = React.useMemo(() => {
    return leads.filter((l) => (l.scoreBreakdown?.leadQualityScore || 75) >= 82 || l.isSaved);
  }, [leads]);

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1500px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
            Starred Targets
          </span>
          <span className="text-xs text-slate-500 font-bold">{savedLeads.length} Saved Opportunities</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Saved & Starred Leads</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Bookmarked enterprise opportunities for immediate pitch preparation and executive follow-up
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead?.(lead)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md cursor-pointer transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
                  {lead.platform}
                </span>
                <span className="text-xs font-black text-amber-600">
                  {lead.scoreBreakdown?.leadQualityScore || 85} pts
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
                {lead.businessName}
              </h3>
              <div className="text-xs text-slate-500 mb-2">
                {lead.city}, {lead.country} • {lead.category}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {lead.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600 truncate">{lead.budget || 'High Ticket'}</span>
              <span className="text-blue-600 font-bold flex items-center gap-1">
                Inspect <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
