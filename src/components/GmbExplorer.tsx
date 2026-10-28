'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Sparkles, 
  Phone, 
  Mail, 
  ExternalLink, 
  Filter, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Globe,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { Lead } from '@/types';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

interface GmbExplorerProps {
  leads: Lead[];
  onGenerateWebsite: (lead: Lead) => void;
  onOpenOutreach: (lead: Lead) => void;
}

export default function GmbExplorer({
  leads,
  onGenerateWebsite,
  onOpenOutreach,
}: GmbExplorerProps) {
  const [cityFilter, setCityFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [onlyNoWebsite, setOnlyNoWebsite] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const gmbLeads = leads.filter((l) => l.type === 'gmb');

  const filtered = gmbLeads.filter((l) => {
    if (cityFilter !== 'all' && !l.city.toLowerCase().includes(cityFilter.toLowerCase())) {
      return false;
    }
    if (onlyNoWebsite && l.contact.hasWebsite) {
      return false;
    }
    if (ageFilter === 'new' && !l.businessAge.isNew) {
      return false;
    }
    if (ageFilter === 'established' && l.businessAge.isNew) {
      return false;
    }
    if (localSearch) {
      const q = localSearch.toLowerCase();
      return (
        l.businessName.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">
                Google My Business Explorer &amp; Age Detector
              </h2>
              <p className="text-xs text-slate-500">
                Identifies newly opened &amp; veteran local businesses with missing websites
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyNoWebsite(!onlyNoWebsite)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                onlyNoWebsite
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              <span>Missing Website Only</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search clinic, marble, lawyer, roofing..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            >
              <option value="all">📍 All Cities &amp; Markets</option>
              <option value="Dubai">🇦🇪 Dubai, UAE</option>
              <option value="Abu Dhabi">🇦🇪 Abu Dhabi, UAE</option>
              <option value="Sharjah">🇦🇪 Sharjah, UAE</option>
              <option value="Lahore">🇵🇰 Lahore, Pakistan</option>
              <option value="Karachi">🇵🇰 Karachi, Pakistan</option>
              <option value="Islamabad">🇵🇰 Islamabad, Pakistan</option>
              <option value="Austin">🇺🇸 Austin, TX (US)</option>
              <option value="Denver">🇺🇸 Denver, CO (US)</option>
              <option value="London">🇬🇧 London, UK</option>
            </select>
          </div>

          <div>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            >
              <option value="all">⏳ All Business Ages</option>
              <option value="new">✨ Newly Opened (&lt; 1 Year)</option>
              <option value="established">🏆 Established (1+ Years)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of GMB Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? (
          filtered.map((lead) => (
            <div
              key={lead.id}
              className="glass-panel rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-white/80 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{lead.businessName}</h3>
                    {lead.verified && (
                      <CheckCircle2 className="w-4 h-4 text-[#1877F2]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lead.address || `${lead.city}, ${lead.country}`}
                    </span>
                    <span>&bull;</span>
                    <span className="text-amber-600 font-semibold">
                      ★ {lead.rating} ({lead.reviewCount} Google reviews)
                    </span>
                  </div>
                </div>

                {/* Business Age Pill */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${
                      lead.businessAge.isNew
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-blue-50 text-[#1877F2] border-blue-200'
                    }`}
                  >
                    {lead.businessAge.isNew && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1.5" />
                    )}
                    {lead.businessAge.label}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600">{lead.description}</p>

              {/* Website Status Alert */}
              {!lead.contact.hasWebsite ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    No active website found for this business. Ready for your pitch!
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 px-2 py-0.5 rounded text-amber-900">
                    High Conversion
                  </span>
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Existing Website: {lead.contact.website}</span>
                </div>
              )}

              {/* Verified Direct Client Contact Bar */}
              <div className="flex items-center gap-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Direct Contact:</span>
                {lead.contact.phone && (
                  <a
                    href={`tel:${lead.contact.phone}`}
                    className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 hover:text-[#007FED] transition"
                    title="Call verified business phone"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{lead.contact.phone}</span>
                  </a>
                )}
                {lead.contact.email && (
                  <a
                    href={`mailto:${lead.contact.email}`}
                    className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-[#007FED] font-mono text-[11px] transition bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold"
                    title="Send verified direct business email"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{lead.contact.email}</span>
                  </a>
                )}
                {lead.contact.whatsapp && (
                  <a
                    href={`https://wa.me/${cleanWhatsAppDigits(lead.contact.whatsapp || lead.contact.phone, lead.country)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60 transition hover:bg-emerald-100"
                    title="Open official WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Ready</span>
                  </a>
                )}
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-0.5 rounded ml-auto">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Domain Verified</span>
                </span>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {lead.contact.phone && (
                    <a
                      href={`tel:${lead.contact.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Client</span>
                    </a>
                  )}

                  {lead.contact.email && (
                    <button
                      onClick={() => onOpenOutreach(lead)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#1877F2] border border-blue-200 transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Proposal</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onGenerateWebsite(lead)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Landing Page</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 glass-panel rounded-2xl text-slate-500 text-sm">
            No GMB listings found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
