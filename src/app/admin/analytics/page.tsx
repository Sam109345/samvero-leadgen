'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Users,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
  RefreshCw,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.metrics);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <AdminLayout title="SaaS Analytics & Revenue Velocity" subtitle="Loading executive SaaS analytics...">
        <div className="py-24 text-center text-slate-500 font-mono text-xs animate-pulse">
          Synthesizing financial performance, lead consumption velocity, and customer retention metrics...
        </div>
      </AdminLayout>
    );
  }

  const utilizationRate =
    metrics.totalLeadAllocations > 0
      ? Math.round((metrics.totalLeadsConsumed / metrics.totalLeadAllocations) * 100)
      : 0;

  const arpu =
    metrics.activeCustomers > 0
      ? Math.round(metrics.monthlyRevenue / metrics.activeCustomers)
      : metrics.monthlyRevenue;

  return (
    <AdminLayout
      title="SaaS Analytics & Financial Performance"
      subtitle="Executive insights across recurring manual subscription revenue, lead quota consumption rates, and package adoption."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Financial & Usage KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b1222] border border-emerald-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Total Confirmed Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
              ${Number(metrics.monthlyRevenue || 0).toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% manual wire verified</span>
            </div>
          </div>

          <div className="bg-[#0b1222] border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Average Revenue Per User (ARPU)</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">
              ${arpu.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">Across active customer base</div>
          </div>

          <div className="bg-[#0b1222] border border-indigo-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400">Lead Utilization Rate</span>
              <BarChart3 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2 font-mono">{utilizationRate}%</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {metrics.totalLeadsConsumed} of {metrics.totalLeadAllocations.toLocaleString()} consumed
            </div>
          </div>

          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Active Subscriptions</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2 font-mono">{metrics.activeSubscriptions}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {metrics.expiringSoonSubscriptions} expiring within 7 days
            </div>
          </div>
        </div>

        {/* Charts & Breakdowns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Subscription Package Adoption */}
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Subscription Package Distribution</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">6 Configured Packages</span>
            </div>

            <div className="space-y-4">
              {Object.entries(metrics.packageDistribution || {}).map(([packageName, count]: [string, any]) => {
                const total = Math.max(1, metrics.activeSubscriptions + metrics.expiredSubscriptions);
                const percent = Math.round((Number(count) / total) * 100);

                return (
                  <div key={packageName} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-200 font-medium">{packageName}</span>
                      <span className="text-slate-400 font-mono">
                        {count} subscriber{count === 1 ? '' : 's'} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Platform Lead Provenance Distribution */}
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Leads Available by Discovery Source</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Engine Sources</span>
            </div>

            <div className="space-y-4">
              {Object.entries(metrics.leadsBySource || {}).map(([sourceName, count]: [string, any]) => {
                const total = Math.max(1, metrics.totalLeadsGenerated);
                const percent = Math.round((Number(count) / total) * 100);

                return (
                  <div key={sourceName} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-200 font-medium">{sourceName}</span>
                      <span className="text-slate-400 font-mono">
                        {Number(count).toLocaleString()} leads ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lead Quota Velocity & Engine Capacity */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Server-Side Lead Quota Velocity Overview</h3>
            </div>
            <button
              onClick={fetchMetrics}
              className="p-1.5 bg-[#080d1a] border border-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400">Total Customer Quota Committed</div>
              <div className="text-2xl font-bold text-white font-mono">
                {metrics.totalLeadAllocations.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500">
                Sum of all max lead quotas granted to active subscriptions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400">Total Leads Consumed By Customers</div>
              <div className="text-2xl font-bold text-indigo-400 font-mono">
                {metrics.totalLeadsConsumed.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500">
                Individual business entities claimed and locked into private tenant stores.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400">Available Customer Capacity</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {metrics.availableLeadCapacity.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500">
                Remaining discovery headroom across existing active customer plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
