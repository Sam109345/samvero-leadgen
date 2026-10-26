'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  DollarSign, 
  ExternalLink, 
  Mail, 
  Clock, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Phone
} from 'lucide-react';
import { Lead } from '@/types';

interface JobsExplorerProps {
  leads: Lead[];
  onOpenOutreach: (lead: Lead) => void;
  onGenerateWebsite: (lead: Lead) => void;
}

export default function JobsExplorer({
  leads,
  onOpenOutreach,
  onGenerateWebsite,
}: JobsExplorerProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [search, setSearch] = useState('');

  const jobLeads = leads.filter((l) => l.type === 'job');

  const filtered = jobLeads.filter((l) => {
    if (categoryFilter !== 'all' && !l.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
      return false;
    }
    if (platformFilter !== 'all' && l.platform.toLowerCase() !== platformFilter.toLowerCase()) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900">
              Freelance &amp; Service Marketplace Job Hub
            </h2>
            <p className="text-xs text-slate-500">
              Live gigs aggregated from Bark, Upwork, LinkedIn, and specialized job boards
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mobile apps, Next.js, 6 logos, Dubai..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            >
              <option value="all">⚡ All Job Niches</option>
              <option value="Web Development">💻 Web Development (Next.js)</option>
              <option value="Mobile App">📱 Mobile App (14 Screens)</option>
              <option value="Graphic Design">🎨 Brand Identity &amp; 6 Logos</option>
            </select>
          </div>

          <div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            >
              <option value="all">🌐 All Marketplaces</option>
              <option value="Upwork">Upwork</option>
              <option value="Bark">Bark</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="DesignBoard">DesignBoard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gigs List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? (
          filtered.map((job) => (
            <div
              key={job.id}
              className="glass-panel rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-white/80 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-700">
                      {job.platform}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs font-semibold text-slate-500">{job.city}, {job.country}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">{job.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Client: <strong className="text-slate-800">{job.businessName}</strong> ({job.businessAge.label})
                  </div>
                </div>

                {/* Budget */}
                {job.budget && (
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-extrabold text-[#1877F2] bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 block">
                      {job.budget}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{job.jobType}</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600">{job.description}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {job.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {job.contact.phone && (
                    <a
                      href={`tel:${job.contact.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Client</span>
                    </a>
                  )}

                  {job.contact.email && (
                    <button
                      onClick={() => onOpenOutreach(job)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#1877F2] border border-blue-200 transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Proposal</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onGenerateWebsite(job)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Generate Pitch Site</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 glass-panel rounded-2xl text-slate-500 text-sm">
            No marketplace jobs matching your current criteria.
          </div>
        )}
      </div>
    </div>
  );
}
