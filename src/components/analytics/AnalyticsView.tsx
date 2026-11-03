'use client';

import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  MailCheck,
  PhoneCall,
  Globe2,
  Layers,
  Award,
} from 'lucide-react';
import { Lead } from '@/types';

interface AnalyticsViewProps {
  leads: Lead[];
}

export default function AnalyticsView({ leads = [] }: AnalyticsViewProps) {
  // Real KPI calculations from genuine database records
  const stats = useMemo(() => {
    const total = leads.length;
    const withEmail = leads.filter((l) => Boolean(l.contact?.email)).length;
    const withPhone = leads.filter((l) => Boolean(l.contact?.phone)).length;
    const withBoth = leads.filter((l) => Boolean(l.contact?.email) && Boolean(l.contact?.phone)).length;
    const withWebsite = leads.filter((l) => Boolean(l.contact?.hasWebsite)).length;
    const qualified = leads.filter((l) => (l.scoreBreakdown?.leadQualityScore ?? 0) >= 75 || l.pipelineStage === 'qualified').length;
    const converted = leads.filter((l) => l.currentStatus === 'Converted / Won' || l.pipelineStage === 'won').length;
    const approached = leads.filter((l) => l.currentStatus === 'Approached' || l.pipelineStage === 'contacted').length;

    const emailPct = total > 0 ? Math.round((withEmail / total) * 100) : 0;
    const phonePct = total > 0 ? Math.round((withPhone / total) * 100) : 0;
    const qualifiedPct = total > 0 ? Math.round((qualified / total) * 100) : 0;

    return {
      total,
      withEmail,
      withPhone,
      withBoth,
      withWebsite,
      qualified,
      converted,
      approached,
      emailPct,
      phonePct,
      qualifiedPct,
    };
  }, [leads]);

  // Distribution breakdowns
  const bySource = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => {
      const src = l.platform || 'Direct';
      map[src] = (map[src] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const byIndustry = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => {
      const ind = l.category || 'General';
      map[ind] = (map[ind] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const byCountry = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => {
      const c = l.country || 'Global';
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Real Database Lead Analytics</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Calculated strictly from genuine prospect records in the database. Zero simulated metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Database Leads</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {stats.total.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Unique deduplicated entries</span>
        </div>

        <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Verified Email Rate</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {stats.emailPct}%
          </div>
          <span className="text-[11px] text-slate-400">{stats.withEmail} leads with direct email</span>
        </div>

        <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Phone Verified Rate</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {stats.phonePct}%
          </div>
          <span className="text-[11px] text-slate-400">{stats.withPhone} leads with phone / WhatsApp</span>
        </div>

        <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">High Quality Leads</span>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {stats.qualifiedPct}%
          </div>
          <span className="text-[11px] text-slate-400">{stats.qualified} leads scoring ≥ 75</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Breakdown */}
        <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Leads by Platform Source</span>
          </h3>

          <div className="space-y-3">
            {bySource.length === 0 ? (
              <p className="text-xs text-slate-400">No data available</p>
            ) : (
              bySource.map(([src, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={src} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{src}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Leads by Industry</span>
          </h3>

          <div className="space-y-3">
            {byIndustry.length === 0 ? (
              <p className="text-xs text-slate-400">No data available</p>
            ) : (
              byIndustry.slice(0, 6).map(([ind, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={ind} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{ind}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-600" />
            <span>Leads by Geographic Region</span>
          </h3>

          <div className="space-y-3">
            {byCountry.length === 0 ? (
              <p className="text-xs text-slate-400">No data available</p>
            ) : (
              byCountry.map(([ctry, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={ctry} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{ctry}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
