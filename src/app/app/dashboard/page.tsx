'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import {
  Database,
  Search,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers,
  Building,
  Globe,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { CustomerLeadRecord, SaasSubscription } from '@/lib/saas-store';

export default function CustomerDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    fetch('/api/customer/metrics')
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

  if (loading || !metrics) {
    return (
      <CustomerLayout title="Executive Lead Dashboard" subtitle="Loading customer intelligence metrics...">
        <div className="py-24 text-center text-slate-500 font-mono text-xs animate-pulse">
          Loading workspace leads and active subscription allocations...
        </div>
      </CustomerLayout>
    );
  }

  const sub: SaasSubscription = metrics.subscription;
  const leadQuota = sub ? sub.leadQuota : 1000;
  const leadsConsumed = sub ? sub.leadsConsumed : metrics.myTotalLeads;
  const remainingQuota = Math.max(0, leadQuota - leadsConsumed);
  const quotaPercent = Math.min(100, Math.round((leadsConsumed / leadQuota) * 100));

  const expiry = sub ? new Date(sub.expiryDate) : null;
  const daysLeft = expiry ? Math.ceil((expiry.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;

  return (
    <CustomerLayout
      title="Client Lead Intelligence Dashboard"
      subtitle="Overview of your verified prospecting pipeline, lead quota consumption, and contact discovery metrics."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header & Fast Actions */}
        <div className="bg-gradient-to-r from-[#0b1222] via-[#0f172a] to-[#0b1222] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              Active SaaS Entitlement
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {sub?.planName || 'Standard Package'} Subscription
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Your account has access to verified local businesses, company decision-maker contacts, and AI-powered intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/app/research"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs font-mono rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-400/10"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Launch Business Research</span>
            </Link>
            <Link
              href="/app/leads"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs font-mono rounded-xl transition"
            >
              View My Leads
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b1222] border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Available Quota</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">
              {remainingQuota.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Of {leadQuota.toLocaleString()} allocated leads
            </div>
          </div>

          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Saved Leads</span>
              <Database className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2 font-mono">
              {metrics.myTotalLeads}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>In your workspace pool</span>
            </div>
          </div>

          <div className="bg-[#0b1222] border border-emerald-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Verified Direct Emails</span>
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
              {metrics.emailsDiscovered}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {metrics.myTotalLeads > 0 ? Math.round((metrics.emailsDiscovered / metrics.myTotalLeads) * 100) : 0}% mailbox discovery
            </div>
          </div>

          <div className="bg-[#0b1222] border border-indigo-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400">Direct Phone Numbers</span>
              <Phone className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2 font-mono">
              {metrics.phoneNumbersDiscovered}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Validated phone contact lines
            </div>
          </div>
        </div>

        {/* Quota Progress & Expiry Horizon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quota Consumption */}
          <div className="md:col-span-2 bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Monthly Lead Allocation Meter</h3>
              </div>
              <span className="text-xs font-mono text-amber-300 font-semibold">{quotaPercent}% Used</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Leads Consumed: {leadsConsumed.toLocaleString()}</span>
                <span>Remaining: {remainingQuota.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    quotaPercent >= 100 ? 'bg-rose-500' : quotaPercent >= 80 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <span>Need additional leads quota before next renewal?</span>
              </div>
              <Link
                href="/app/subscription"
                className="text-amber-400 hover:text-amber-300 font-mono font-semibold flex items-center gap-1"
              >
                <span>Upgrade Plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Expiry Countdown */}
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Subscription Horizon</h3>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Plan:</span>
                  <span className="text-amber-300 font-semibold">{sub?.planName || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Billing Cycle:</span>
                  <span className="text-white capitalize">{sub?.billingCycle?.replace('_', ' ') || 'Monthly'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expiry Date:</span>
                  <span className="text-white">{expiry?.toLocaleDateString() || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400">Remaining Duration</div>
                <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                  {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} Days` : 'Expired') : '30 Days'}
                </div>
              </div>
            </div>

            <Link
              href="/app/subscription"
              className="mt-4 w-full py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-semibold rounded-xl text-center block transition"
            >
              Request Renewal
            </Link>
          </div>
        </div>

        {/* Recent Workspace Leads */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Recent Saved Leads</h3>
            </div>
            <Link
              href="/app/leads"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All Leads ({metrics.myTotalLeads})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {metrics.recentLeads && metrics.recentLeads.length > 0 ? (
              metrics.recentLeads.map((lead: CustomerLeadRecord) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between text-xs gap-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold shrink-0 text-xs">
                      {lead.businessName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{lead.businessName}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>{lead.category}</span>
                        <span>&bull;</span>
                        <span>{lead.city ? `${lead.city}, ` : ''}{lead.country}</span>
                        <span>&bull;</span>
                        <span className="text-amber-400/80">via {lead.platform}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                    {lead.contact?.email ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">{lead.contact.email}</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">No Email</span>
                    )}

                    {lead.contact?.phone && (
                      <span className="text-indigo-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{lead.contact.phone}</span>
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${
                        lead.status === 'qualified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                No leads saved yet. Launch Business Research to discover verified prospects.
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
