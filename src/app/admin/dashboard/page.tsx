'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  FileText,
  CreditCard,
  DollarSign,
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  BarChart3,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <AdminLayout
      title="Super Admin Executive Overview"
      subtitle="Live database-backed SaaS metrics, application queue, and financial status"
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-300">Live PostgreSQL Backend Synced</span>
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Metrics</span>
          </button>
        </div>

        {/* 15 Database-Backed Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Total Customers</div>
            <div className="text-2xl font-black text-white mt-1">
              {metrics ? metrics.totalCustomers : '...'}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">
              {metrics ? `${metrics.activeCustomers} Active` : ''}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Pending Applications</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {metrics ? metrics.pendingApplications : '...'}
            </div>
            <Link href="/admin/applications" className="text-[10px] text-amber-300 hover:underline mt-1 block">
              Review Queue &rarr;
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Pending Payments</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {metrics ? metrics.pendingPayments : '...'}
            </div>
            <Link href="/admin/payments" className="text-[10px] text-amber-300 hover:underline mt-1 block">
              Verify Deposits &rarr;
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Active Subscriptions</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {metrics ? metrics.activeSubscriptions : '...'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {metrics ? `${metrics.expiringSoonSubscriptions} Expiring Soon` : ''}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Monthly Revenue</div>
            <div className="text-2xl font-black text-white mt-1">
              ${metrics ? Number(metrics.monthlyRevenue).toLocaleString() : '0'}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">Confirmed Deposits</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Total Leads Generated</div>
            <div className="text-2xl font-black text-white mt-1">
              {metrics ? metrics.totalLeadsGenerated : '...'}
            </div>
            <div className="text-[10px] text-blue-400 font-semibold mt-1">Master Global Pool</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Total Lead Allocations</div>
            <div className="text-2xl font-black text-white mt-1">
              {metrics ? Number(metrics.totalLeadAllocations).toLocaleString() : '...'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Assigned by Plan</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Total Leads Consumed</div>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {metrics ? Number(metrics.totalLeadsConsumed).toLocaleString() : '...'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Utilized by Customers</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Available Capacity</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {metrics ? Number(metrics.availableLeadCapacity).toLocaleString() : '...'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Remaining Customer Quota</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Renewals Due</div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {metrics ? metrics.renewalsDue : '...'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Requests Pending Action</div>
          </div>
        </div>

        {/* Distribution Charts Visual Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Package Distribution Chart */}
          <div className="p-6 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Subscription Package Distribution</span>
              </h3>
              <Link href="/admin/plans" className="text-xs text-amber-400 hover:underline">
                Manage Plans &rarr;
              </Link>
            </div>
            <div className="space-y-3 pt-2">
              {metrics?.packageDistribution &&
                Object.entries(metrics.packageDistribution).map(([pkgName, count]: [string, any]) => {
                  const maxCount = Math.max(1, metrics.activeSubscriptions || 1);
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={pkgName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{pkgName}</span>
                        <span className="text-slate-400 font-mono">
                          {count} {count === 1 ? 'Subscription' : 'Subscriptions'} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Leads by Source Distribution Chart */}
          <div className="p-6 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Leads Discovered by Source</span>
              </h3>
              <Link href="/admin/leads" className="text-xs text-blue-400 hover:underline">
                View All Leads &rarr;
              </Link>
            </div>
            <div className="space-y-3 pt-2">
              {metrics?.leadsBySource &&
                Object.entries(metrics.leadsBySource).slice(0, 6).map(([sourceName, count]: [string, any]) => {
                  const maxLeads = Math.max(1, metrics.totalLeadsGenerated || 1);
                  const pct = Math.round((count / maxLeads) * 100);
                  return (
                    <div key={sourceName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{sourceName}</span>
                        <span className="text-slate-400 font-mono">
                          {count} Leads ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Recent Applications & Recent Payments Double Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="p-6 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Recent Customer Applications</span>
              </h3>
              <Link href="/admin/applications" className="text-xs text-amber-400 hover:underline">
                View All Applications &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80">
              {!metrics?.recentApplications || metrics.recentApplications.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">No pending applications</div>
              ) : (
                metrics.recentApplications.map((app: any) => (
                  <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-xs">{app.fullName}</div>
                      <div className="text-[11px] text-slate-400">
                        {app.email} &bull; {app.country}
                      </div>
                      <div className="text-[10px] font-mono text-amber-400 mt-0.5">
                        {app.referenceNumber} &bull; {app.planName} ({app.billingDuration})
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                        {app.status}
                      </span>
                      <Link
                        href={`/admin/applications?ref=${app.referenceNumber}`}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="p-6 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Recent Manual Payments</span>
              </h3>
              <Link href="/admin/payments" className="text-xs text-emerald-400 hover:underline">
                View All Payments &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80">
              {!metrics?.recentPayments || metrics.recentPayments.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">No payments recorded</div>
              ) : (
                metrics.recentPayments.map((p: any) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-xs">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.paymentMethod} &bull; {p.paymentReference}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        {p.currency} {Number(p.amountDue).toLocaleString()} ({p.billingDuration})
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
