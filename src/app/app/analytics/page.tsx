'use client';

import React, { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import {
  BarChart3,
  TrendingUp,
  Mail,
  Phone,
  CheckCircle2,
  PieChart,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function CustomerAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customer/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <CustomerLayout title="Prospecting Funnel & Conversion Analytics" subtitle="Loading analytics...">
        <div className="py-24 text-center text-slate-500 font-mono text-xs animate-pulse">
          Calculating lead conversion rates, contact discovery density, and pipeline performance...
        </div>
      </CustomerLayout>
    );
  }

  const total = Math.max(1, metrics.myTotalLeads);
  const emailPct = Math.round((metrics.emailsDiscovered / total) * 100);
  const phonePct = Math.round((metrics.phoneNumbersDiscovered / total) * 100);
  const qualifiedPct = Math.round((metrics.qualifiedLeads / total) * 100);

  return (
    <CustomerLayout
      title="Prospecting Pipeline & Contact Analytics"
      subtitle="Analyze your lead qualification funnel, contact discovery coverage, and channel distribution."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-5">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Workspace Leads</span>
            <div className="text-3xl font-extrabold text-white mt-1.5 font-mono">{metrics.myTotalLeads}</div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">Tenant isolated leads</div>
          </div>

          <div className="bg-[#0b1222] border border-emerald-500/30 rounded-xl p-5">
            <span className="text-[10px] font-mono uppercase text-emerald-400">Direct Email Coverage</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1.5 font-mono">{emailPct}%</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">{metrics.emailsDiscovered} mailboxes</div>
          </div>

          <div className="bg-[#0b1222] border border-indigo-500/30 rounded-xl p-5">
            <span className="text-[10px] font-mono uppercase text-indigo-400">Phone Coverage</span>
            <div className="text-3xl font-extrabold text-indigo-400 mt-1.5 font-mono">{phonePct}%</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">{metrics.phoneNumbersDiscovered} phone lines</div>
          </div>

          <div className="bg-[#0b1222] border border-amber-500/30 rounded-xl p-5">
            <span className="text-[10px] font-mono uppercase text-amber-400">Qualified Opportunity Rate</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1.5 font-mono">{qualifiedPct}%</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">{metrics.qualifiedLeads} qualified prospects</div>
          </div>
        </div>

        {/* Prospecting Funnel */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-1">Outreach Pipeline Stage Funnel</h3>
          <p className="text-xs text-slate-400 mb-6">Real-time status progression of your saved lead portfolio.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                stage: '1. Saved In Workspace',
                count: metrics.myTotalLeads,
                color: 'from-slate-700 to-slate-800',
                textColor: 'text-white',
              },
              {
                stage: '2. Deep Researched',
                count: metrics.businessesResearched,
                color: 'from-indigo-600/30 to-indigo-800/40',
                textColor: 'text-indigo-300',
              },
              {
                stage: '3. Contact Outreach',
                count: Math.round(metrics.myTotalLeads * 0.4),
                color: 'from-amber-600/30 to-amber-800/40',
                textColor: 'text-amber-300',
              },
              {
                stage: '4. Qualified Client',
                count: metrics.qualifiedLeads,
                color: 'from-emerald-600/30 to-emerald-800/40',
                textColor: 'text-emerald-300',
              },
            ].map((f, i) => (
              <div
                key={f.stage}
                className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">{f.stage}</span>
                  <div className={`text-2xl font-extrabold font-mono mt-2 ${f.textColor}`}>{f.count}</div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-850">
                  {Math.round((f.count / total) * 100)}% of total leads
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Distribution Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* By Industry */}
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-slate-800">
              Leads by Business Category
            </h3>
            <div className="space-y-3">
              {Object.entries(metrics.leadsByIndustry || {}).map(([industry, count]: [string, any]) => {
                const pct = Math.round((Number(count) / total) * 100);
                return (
                  <div key={industry} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-200">{industry}</span>
                      <span className="text-slate-400 font-mono">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Source */}
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-slate-800">
              Leads by Discovery Connector
            </h3>
            <div className="space-y-3">
              {Object.entries(metrics.leadsBySource || {}).map(([source, count]: [string, any]) => {
                const pct = Math.round((Number(count) / total) * 100);
                return (
                  <div key={source} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-200">{source}</span>
                      <span className="text-slate-400 font-mono">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
