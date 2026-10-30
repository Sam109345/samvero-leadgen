'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SaasSubscription, SubscriptionHistoryRecord, RenewalRequest } from '@/lib/saas-store';
import {
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Sliders,
  RefreshCw,
  Search,
  Filter,
  History,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SaasSubscription[]>([]);
  const [history, setHistory] = useState<SubscriptionHistoryRecord[]>([]);
  const [renewals, setRenewals] = useState<RenewalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [quotaModalSub, setQuotaModalSub] = useState<SaasSubscription | null>(null);
  const [newQuotaValue, setNewQuotaValue] = useState<number>(0);
  const [quotaReason, setQuotaReason] = useState<string>('');

  const [extendModalSub, setExtendModalSub] = useState<SaasSubscription | null>(null);
  const [additionalDays, setAdditionalDays] = useState<number>(30);
  const [extendReason, setExtendReason] = useState<string>('');

  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubscriptions = () => {
    setLoading(true);
    fetch('/api/admin/subscriptions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubscriptions(data.subscriptions || []);
          setHistory(data.history || []);
          setRenewals(data.renewals || []);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAdjustQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotaModalSub) return;
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'adjust_quota',
          subscriptionId: quotaModalSub.id,
          newQuota: newQuotaValue,
          reason: quotaReason || 'Admin quota adjustment',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuotaModalSub(null);
        fetchSubscriptions();
      } else {
        alert(data.error || 'Failed to adjust quota');
      }
    } catch (err: any) {
      alert(err?.message || 'Error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtendExpiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalSub) return;
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extend_expiry',
          subscriptionId: extendModalSub.id,
          additionalDays,
          reason: extendReason || `Subscription extended by ${additionalDays} days`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExtendModalSub(null);
        fetchSubscriptions();
      } else {
        alert(data.error || 'Failed to extend subscription');
      }
    } catch (err: any) {
      alert(err?.message || 'Error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (sub: SaasSubscription) => {
    const nextStatus = sub.status === 'suspended' ? 'active' : 'suspended';
    const confirmPrompt = window.confirm(
      `Are you sure you want to mark this subscription as ${nextStatus.toUpperCase()} for ${sub.customerName}?`
    );
    if (!confirmPrompt) return;

    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          subscriptionId: sub.id,
          status: nextStatus,
          reason: `Admin changed status to ${nextStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSubscriptions();
      } else {
        alert(data.error || 'Failed to update subscription status');
      }
    } catch (err: any) {
      alert(err?.message || 'Error occurred');
    }
  };

  // Filtered subscriptions
  const filtered = subscriptions.filter((s) => {
    const matchesSearch =
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI stats
  const totalSubs = subscriptions.length;
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length;
  const expiringSoonSubs = subscriptions.filter((s) => s.status === 'expiring_soon').length;
  const expiredSubs = subscriptions.filter((s) => s.status === 'expired').length;
  const suspendedSubs = subscriptions.filter((s) => s.status === 'suspended').length;

  return (
    <AdminLayout
      title="Customer Subscriptions & Quota Management"
      subtitle="Monitor active customer packages, server-side lead quota utilization, expiry timelines, and complete lifecycle audit logs."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Subscriptions</div>
            <div className="text-2xl font-bold text-white mt-1">{totalSubs}</div>
          </div>
          <div className="bg-[#0b1222] border border-emerald-500/30 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Active Plans</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{activeSubs}</div>
          </div>
          <div className="bg-[#0b1222] border border-amber-500/30 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Expiring &le; 7 Days</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{expiringSoonSubs}</div>
          </div>
          <div className="bg-[#0b1222] border border-rose-500/30 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-rose-400">Expired Plans</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{expiredSubs}</div>
          </div>
          <div className="bg-[#0b1222] border border-slate-700/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Suspended</div>
            <div className="text-2xl font-bold text-slate-300 mt-1">{suspendedSubs}</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email, plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            {[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Expiring Soon', value: 'expiring_soon' },
              { label: 'Expired', value: 'expired' },
              { label: 'Suspended', value: 'suspended' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition shrink-0 ${
                  statusFilter === tab.value
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-[#080d1a] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={fetchSubscriptions}
              className="p-1.5 bg-[#080d1a] border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="Refresh subscriptions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Plan & Cycle</th>
                  <th className="py-3.5 px-4">Quota Utilization</th>
                  <th className="py-3.5 px-4">Start & Expiry</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                      Loading customer subscriptions...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                      No customer subscriptions found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((sub) => {
                    const usagePercent = Math.min(100, Math.round((sub.leadsConsumed / (sub.leadQuota || 1)) * 100));
                    const expiry = new Date(sub.expiryDate);
                    const now = new Date();
                    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

                    return (
                      <tr key={sub.id} className="hover:bg-slate-850/30 transition">
                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{sub.customerName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{sub.customerEmail}</div>
                          {sub.applicationReference && (
                            <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                              Ref: {sub.applicationReference}
                            </span>
                          )}
                        </td>

                        {/* Plan */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-amber-300">{sub.planName}</div>
                          <div className="text-[11px] font-mono text-slate-400 capitalize">{sub.billingCycle.replace('_', ' ')}</div>
                        </td>

                        {/* Quota */}
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                            <span className="text-white font-medium">
                              {sub.leadsConsumed.toLocaleString()} / {sub.leadQuota.toLocaleString()}
                            </span>
                            <span className="text-slate-400">{usagePercent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                usagePercent >= 100
                                  ? 'bg-rose-500'
                                  : usagePercent >= 80
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            {Math.max(0, sub.leadQuota - sub.leadsConsumed).toLocaleString()} remaining
                          </div>
                        </td>

                        {/* Start & Expiry */}
                        <td className="py-3.5 px-4">
                          <div className="text-white font-mono text-[11px]">
                            {new Date(sub.startDate).toLocaleDateString()} &rarr; {expiry.toLocaleDateString()}
                          </div>
                          <div className="text-[10px] font-mono mt-0.5">
                            {daysLeft > 0 ? (
                              <span className={daysLeft <= 7 ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                                {daysLeft} days remaining
                              </span>
                            ) : (
                              <span className="text-rose-400 font-semibold">Expired {Math.abs(daysLeft)} days ago</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : sub.status === 'expiring_soon'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : sub.status === 'expired'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                sub.status === 'active'
                                  ? 'bg-emerald-400 animate-pulse'
                                  : sub.status === 'expiring_soon'
                                  ? 'bg-amber-400 animate-ping'
                                  : sub.status === 'expired'
                                  ? 'bg-rose-400'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {sub.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setQuotaModalSub(sub);
                                setNewQuotaValue(sub.leadQuota);
                                setQuotaReason('');
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition"
                              title="Adjust Lead Quota"
                            >
                              Quota
                            </button>
                            <button
                              onClick={() => {
                                setExtendModalSub(sub);
                                setAdditionalDays(30);
                                setExtendReason('');
                              }}
                              className="px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 text-amber-300 font-mono text-[10px] transition"
                              title="Extend Expiry Date"
                            >
                              Extend
                            </button>
                            <button
                              onClick={() => handleToggleStatus(sub)}
                              className={`px-2.5 py-1 rounded font-mono text-[10px] transition ${
                                sub.status === 'suspended'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                              }`}
                              title={sub.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                            >
                              {sub.status === 'suspended' ? 'Resume' : 'Suspend'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription History Audit Log */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Subscription Lifecycle & Quota History Audit</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{history.length} audit records</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2">
            {history.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-mono">No subscription events logged yet.</div>
            ) : (
              history.map((record) => (
                <div
                  key={record.id}
                  className="p-3 rounded-lg bg-[#080d1a] border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between text-xs gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider shrink-0 mt-0.5 ${
                        record.action === 'created'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : record.action === 'quota_adjusted'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          : record.action === 'extended'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : record.action === 'renewed'
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {record.action.replace('_', ' ')}
                    </span>
                    <div>
                      <div className="text-slate-200 font-medium">{record.reason}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Performed by: <span className="text-slate-400">{record.performedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 shrink-0">
                    {new Date(record.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL 1: Adjust Quota */}
        {quotaModalSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-base font-semibold text-white mb-1">Adjust Lead Allocation Quota</h3>
              <p className="text-xs text-slate-400 mb-4">
                Customer: <span className="text-white font-medium">{quotaModalSub.customerName}</span> ({quotaModalSub.planName})
              </p>

              <form onSubmit={handleAdjustQuota} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    New Total Leads Quota (Current: {quotaModalSub.leadQuota})
                  </label>
                  <input
                    type="number"
                    min={quotaModalSub.leadsConsumed}
                    value={newQuotaValue}
                    onChange={(e) => setNewQuotaValue(Number(e.target.value))}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    Already consumed: {quotaModalSub.leadsConsumed} leads. Quota cannot be lower than consumed leads.
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Reason for Quota Adjustment</label>
                  <input
                    type="text"
                    value={quotaReason}
                    onChange={(e) => setQuotaReason(e.target.value)}
                    placeholder="e.g. VIP goodwill bonus, enterprise add-on purchase"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setQuotaModalSub(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg text-xs font-mono transition"
                  >
                    {actionLoading ? 'Saving...' : 'Apply New Quota'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Extend Expiry */}
        {extendModalSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-base font-semibold text-white mb-1">Extend Subscription Duration</h3>
              <p className="text-xs text-slate-400 mb-4">
                Customer: <span className="text-white font-medium">{extendModalSub.customerName}</span> (Expires:{' '}
                {new Date(extendModalSub.expiryDate).toLocaleDateString()})
              </p>

              <form onSubmit={handleExtendExpiry} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Additional Days to Add</label>
                  <input
                    type="number"
                    min="1"
                    value={additionalDays}
                    onChange={(e) => setAdditionalDays(Number(e.target.value))}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    New Expiry Date:{' '}
                    <span className="text-amber-400 font-semibold">
                      {new Date(
                        new Date(extendModalSub.expiryDate).getTime() + additionalDays * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Extension Reason / Memo</label>
                  <input
                    type="text"
                    value={extendReason}
                    onChange={(e) => setExtendReason(e.target.value)}
                    placeholder="e.g. Offline bank transfer pending settlement, grace period"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setExtendModalSub(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg text-xs font-mono transition"
                  >
                    {actionLoading ? 'Extending...' : 'Confirm Extension'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
