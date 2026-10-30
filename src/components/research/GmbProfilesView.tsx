'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Lead } from '@/types';

interface GmbProfilesViewProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
}

export default function GmbProfilesView({ leads, onSelectLead }: GmbProfilesViewProps) {
  const [searchGmb, setSearchGmb] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const gmbLeads = React.useMemo(() => {
    return leads.filter((l) => {
      if (l.type !== 'gmb' && l.platform !== 'Google My Business') return false;
      if (selectedCity !== 'all' && l.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (searchGmb.trim()) {
        const q = searchGmb.toLowerCase().trim();
        return l.businessName.toLowerCase().includes(q) || l.address?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [leads, searchGmb, selectedCity]);

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
            Google Places Radar
          </span>
          <span className="text-xs text-slate-500 font-bold">{gmbLeads.length} Verified Profiles</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Google Business Profiles Radar</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monitor physical enterprise locations, Google Maps place IDs, review telemetry, and missing website indicators
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchGmb}
            onChange={(e) => setSearchGmb(e.target.value)}
            placeholder="Search verified Google Business Profiles..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="all">All Cities</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="London">London</option>
            <option value="Austin">Austin</option>
          </select>
        </div>
      </div>

      {/* GMB Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {gmbLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead?.(lead)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                {lead.gmbStatus === 'NOT_FOUND' ? (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-slate-400" />
                    <span>Google Profile Not Found</span>
                  </span>
                ) : (lead.gmbStatus === 'NEEDS_REVIEW' || lead.gmbStatus === 'MULTIPLE_MATCHES') ? (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>Identity Match Requires Review</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Google Business Profile Found</span>
                  </span>
                )}

                {lead.rating ? (
                  <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{lead.rating}</span>
                    {lead.reviewCount && <span className="text-[10px] text-slate-400 font-normal">({lead.reviewCount})</span>}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No public reviews</span>
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
                {lead.businessName}
              </h3>

              <div className="text-xs text-slate-500 flex items-start gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span className="line-clamp-2">{lead.address || `${lead.city}, ${lead.country}`}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Web Presence:</span>
                  <span className={`font-bold ${lead.contact?.hasWebsite ? 'text-teal-600' : 'text-amber-600'}`}>
                    {lead.contact?.hasWebsite ? 'Modern Domain' : 'Missing Website (Hot)'}
                  </span>
                </div>
                {lead.contact?.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified Line:</span>
                    <span className="font-mono font-semibold">{lead.contact.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">{lead.city}, {lead.country}</span>
              {lead.contact?.gmbUrl && (
                <a
                  href={lead.contact.gmbUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
