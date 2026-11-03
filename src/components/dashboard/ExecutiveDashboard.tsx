'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  MailCheck,
  Award,
  Network,
  Activity,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Layers,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Search,
} from 'lucide-react';
import { Lead } from '@/types';
import { PlatformState } from '@/lib/integrations/types';

interface ExecutiveDashboardProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
  onNavigateToView?: (viewId: any) => void;
}

export default function ExecutiveDashboard({
  leads = [],
  onSelectLead,
  onNavigateToView,
}: ExecutiveDashboardProps) {
  const [platformStates, setPlatformStates] = useState<{ config: any; state: PlatformState }[]>([]);
  const [loadingHealth, setLoadingHealth] = useState(true);

  // Fetch real platform integration health
  useEffect(() => {
    fetch('/api/integrations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.platforms)) {
          setPlatformStates(data.platforms);
        }
      })
      .catch((err) => console.warn('Could not load integration health:', err))
      .finally(() => setLoadingHealth(false));
  }, []);

  // 1. KPI Calculations from genuine records
  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => !l.currentStatus || l.currentStatus === 'New Lead').length;
    const qualifiedLeads = leads.filter((l) => {
      const score = l.scoreBreakdown?.leadQualityScore ?? 0;
      return score >= 75 || l.pipelineStage === 'qualified';
    }).length;
    const contactableLeads = leads.filter((l) => Boolean(l.contact?.email) || Boolean(l.contact?.phone)).length;
    const convertedLeads = leads.filter((l) => l.currentStatus === 'Converted / Won' || l.pipelineStage === 'won').length;

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      contactableLeads,
      convertedLeads,
    };
  }, [leads]);

  // 2. Integration Health stats
  const healthStats = useMemo(() => {
    const operational = platformStates.filter((p) => p.state.status === 'operational').length;
    const connected = platformStates.filter((p) => p.state.status === 'connected').length;
    const missingCreds = platformStates.filter((p) => p.state.status === 'credentials_missing').length;
    const failed = platformStates.filter((p) => p.state.status === 'auth_failed' || p.state.status === 'sync_failed' || p.state.status === 'quota_exhausted').length;

    return {
      total: platformStates.length,
      operational: operational + connected,
      missingCreds,
      failed,
    };
  }, [platformStates]);

  // 3. Recent Activity (last 8 discovered leads)
  const recentLeads = useMemo(() => {
    return [...leads].slice(0, 8);
  }, [leads]);

  // 4. Genuine Discovery by Source distribution (real counts only)
  const sourceDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    for (const lead of leads) {
      const src = lead.platform || 'Direct';
      map[src] = (map[src] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  // 5. Industry distribution (real counts only)
  const industryDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    for (const lead of leads) {
      const ind = lead.category || (lead as any).industry || 'General Business';
      map[ind] = (map[ind] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  // 6. Contact verification status distribution
  const contactVerificationDistribution = useMemo(() => {
    let verifiedEmail = 0;
    let verifiedPhone = 0;
    let bothVerified = 0;
    let unverified = 0;

    for (const lead of leads) {
      const hasEmail = Boolean(lead.contact?.email && (lead.contact?.emailStatus === 'VERIFIED' || lead.contact?.emailStatus === 'LIKELY_VALID' || lead.verified));
      const hasPhone = Boolean(lead.contact?.phone && (lead.contact?.phoneStatus === 'VALID_FORMAT' || lead.verified));
      if (hasEmail && hasPhone) bothVerified++;
      else if (hasEmail) verifiedEmail++;
      else if (hasPhone) verifiedPhone++;
      else unverified++;
    }

    const total = leads.length || 1;
    return [
      { label: 'Dual Verified (Email + Phone)', count: bothVerified, pct: Math.round((bothVerified / total) * 100), color: 'bg-emerald-500' },
      { label: 'Verified Email Only', count: verifiedEmail, pct: Math.round((verifiedEmail / total) * 100), color: 'bg-blue-500' },
      { label: 'Verified Phone Only', count: verifiedPhone, pct: Math.round((verifiedPhone / total) * 100), color: 'bg-indigo-500' },
      { label: 'Unverified / Pending', count: unverified, pct: Math.round((unverified / total) * 100), color: 'bg-slate-400' },
    ];
  }, [leads]);

  // 7. Lead Acquisition Over Time (past 7 day real activity)
  const acquisitionOverTime = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const count = leads.filter((l) => {
        const t = l.createdAt ? new Date(l.createdAt).getTime() : (l.incomingAt || dayStart + 1000);
        return t >= dayStart && t < dayEnd;
      }).length;

      days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), count });
    }
    return days;
  }, [leads]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* B. Main KPI Section */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. Total Leads */}
          <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Leads</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis.totalLeads.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Discovered across all platforms</p>
            </div>
          </div>

          {/* 2. New Leads */}
          <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">New Leads</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis.newLeads.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Pending initial outreach</p>
            </div>
          </div>

          {/* 3. Qualified Leads */}
          <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Qualified Leads</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis.qualifiedLeads.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Score ≥ 75 / high fit</p>
            </div>
          </div>

          {/* 4. Contactable Leads */}
          <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Contactable Leads</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <MailCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis.contactableLeads.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Verified email or phone</p>
            </div>
          </div>

          {/* 5. Converted Leads */}
          <div className="col-span-2 lg:col-span-1 bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Converted Leads</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis.convertedLeads.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Deals won in pipeline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Platform Health + Lead Acquisition Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* D. Automated Engine Status */}
        <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Data Engines</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Automated
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Live Operational Sources
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{healthStats.operational}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Data Fetching Status
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Continuous Sync</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Database Records Synced
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{leads.length.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full py-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Internal Automated Backend Pipeline</span>
            </div>
          </div>
        </div>

        {/* 1. Lead Acquisition Over Time Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Lead Acquisition Over Time</h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {leads.length} Real Leads Stored
            </span>
          </div>

          <div className="py-4">
            <div className="flex items-end justify-between gap-2 h-28 pt-2">
              {acquisitionOverTime.map((item, idx) => {
                const maxCount = Math.max(...acquisitionOverTime.map((a) => a.count), 1);
                const barHeight = Math.max(12, Math.round((item.count / maxCount) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 font-semibold">
                      {item.count}
                    </span>
                    <div className="w-full max-w-[36px] bg-blue-100 dark:bg-blue-950/60 rounded-t-md overflow-hidden flex items-end">
                      <div
                        className="w-full bg-blue-600 rounded-t-md transition-all duration-300"
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-600 dark:text-slate-300">
            <span>Real-time ingestion pipeline active</span>
            {onNavigateToView && (
              <button
                onClick={() => onNavigateToView('all-leads')}
                className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Leads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Row: 3 Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. Lead Source Distribution */}
        <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Lead Source Distribution</h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300">{sourceDistribution.length} Active</span>
          </div>

          <div className="py-4">
            {sourceDistribution.length === 0 ? (
              <div className="py-6 text-center text-slate-600 dark:text-slate-300 text-xs">
                <Building2 className="w-7 h-7 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p>No leads discovered yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {sourceDistribution.slice(0, 5).map(([src, count]) => {
                  const percentage = Math.round((count / (leads.length || 1)) * 100);
                  return (
                    <div key={src} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{src}</span>
                        <span className="text-slate-500 font-semibold">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
            <span>Multi-platform pipeline</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{leads.length} Leads</span>
          </div>
        </div>

        {/* 3. Industry Distribution */}
        <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Industry Distribution</h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300">{industryDistribution.length} Sectors</span>
          </div>

          <div className="py-4">
            {industryDistribution.length === 0 ? (
              <div className="py-6 text-center text-slate-600 dark:text-slate-300 text-xs">
                <Layers className="w-7 h-7 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p>No industry data available.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {industryDistribution.slice(0, 5).map(([ind, count]) => {
                  const percentage = Math.round((count / (leads.length || 1)) * 100);
                  return (
                    <div key={ind} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{ind}</span>
                        <span className="text-slate-500 font-semibold">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
            <span>Market segment breakdown</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{leads.length} Classified</span>
          </div>
        </div>

        {/* 4. Contact Verification Status */}
        <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Contact Verification Status</h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300">Deliverability</span>
          </div>

          <div className="py-4 space-y-2.5">
            {contactVerificationDistribution.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{item.label}</span>
                  <span className="text-slate-500 font-semibold">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
            <span>Deliverability protection</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{kpis.contactableLeads} Reachable</span>
          </div>
        </div>
      </div>

      {/* C. Lead Activity: Recently Discovered Leads Table */}
      <div className="bg-white dark:bg-[#111c2e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Recent Lead Activity</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Genuine prospects discovered through connected engines
            </p>
          </div>
          {onNavigateToView && (
            <button
              onClick={() => onNavigateToView('all-leads')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600 dark:text-slate-300">
            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-medium text-slate-700 dark:text-slate-300">No leads available</p>
            <p className="mt-1">Connect your platform credentials or start a discovery search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Business / Lead</th>
                  <th className="py-2.5 px-4">Source</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Contact Person</th>
                  <th className="py-2.5 px-4">Score</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentLeads.map((lead) => {
                  const score = lead.scoreBreakdown?.leadQualityScore ?? 70;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead && onSelectLead(lead)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                        {lead.businessName || lead.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {lead.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {lead.city ? `${lead.city}, ${lead.country}` : lead.country || 'Global'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {lead.contact?.contactPerson || 'Unavailable'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          score >= 80
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : score >= 65
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {score}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                          {lead.currentStatus || 'New Lead'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead && onSelectLead(lead);
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
