'use client';

import React, { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { PlanConfig, SaasSubscription, BillingCycle, AdminSettings } from '@/lib/saas-store';
import {
  Calendar,
  Check,
  Sparkles,
  AlertCircle,
  Building,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export default function CustomerSubscriptionPage() {
  const [subscription, setSubscription] = useState<SaasSubscription | null>(null);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Renewal Modal
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('plan_standard');
  const [selectedDuration, setSelectedDuration] = useState<BillingCycle>('monthly');
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [renewalSuccess, setRenewalSuccess] = useState<any>(null);

  const fetchSubscriptionData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/customer/metrics').then((r) => r.json()),
      fetch('/api/plans').then((r) => r.json()),
      fetch('/api/admin/settings').then((r) => r.json()),
    ])
      .then(([metricsData, plansData, settingsData]) => {
        if (metricsData.success && metricsData.metrics) {
          setSubscription(metricsData.metrics.subscription || null);
          if (metricsData.metrics.subscription?.planId) {
            setSelectedPlanId(metricsData.metrics.subscription.planId);
          }
        }
        if (plansData.success && Array.isArray(plansData.plans)) {
          setPlans(plansData.plans);
        }
        if (settingsData.success && settingsData.settings) {
          setSettings(settingsData.settings);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const handleRequestRenewal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/customer/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          requestedPlanId: selectedPlanId,
          requestedDuration: selectedDuration,
          customerNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRenewalSuccess(data.renewal);
        fetchSubscriptionData();
      } else {
        alert(data.error || 'Failed to submit renewal request');
      }
    } catch (err: any) {
      alert(err?.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !subscription) {
    return (
      <CustomerLayout title="Subscription & Plan Entitlements" subtitle="Loading subscription details...">
        <div className="py-24 text-center text-slate-500 font-mono text-xs animate-pulse">
          Loading subscription tier, entitlements snapshot, and renewal schedule...
        </div>
      </CustomerLayout>
    );
  }

  const expiry = new Date(subscription.expiryDate);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isExpired = subscription.status === 'expired' || daysLeft <= 0;

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[2];
  const renewalCost = selectedPlan ? (selectedPlan.prices as any)[selectedDuration] || selectedPlan.prices.monthly : 189;

  return (
    <CustomerLayout
      title="Subscription Management & Plan Upgrades"
      subtitle="View your active subscription package, lead allocation limits, feature permissions, and submit renewal requests."
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Active Plan Hero Card */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  Current Active Plan
                </span>
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                    isExpired
                      ? 'bg-rose-500/20 text-rose-400'
                      : isExpiringSoon
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {subscription.status}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-serif">
                {subscription.planName} Package
              </h2>
              <p className="text-xs text-slate-400 mt-1 capitalize font-mono">
                Billing Cycle: {subscription.billingCycle.replace('_', ' ')} &bull; {subscription.leadQuota.toLocaleString()} leads per cycle
              </p>

              <div className="flex items-center gap-6 mt-6 text-xs font-mono">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Expiration Date</div>
                  <div className="text-white font-bold mt-0.5">{expiry.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Days Remaining</div>
                  <div className={`font-bold mt-0.5 ${daysLeft <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {daysLeft > 0 ? `${daysLeft} Days` : 'Expired'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Leads Consumed</div>
                  <div className="text-white font-bold mt-0.5">
                    {subscription.leadsConsumed} / {subscription.leadQuota}
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowRenewModal(true);
                  setRenewalSuccess(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs font-mono rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Renewal / Upgrade</span>
              </button>
              <div className="text-[10px] text-center text-slate-500 font-mono">
                Manual bank wire & Wise settled
              </div>
            </div>
          </div>
        </div>

        {/* Feature Entitlements Checklist */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Your Package Feature Permissions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { name: 'Lead Discovery Quota', desc: `${subscription.leadQuota.toLocaleString()} verified businesses per cycle`, active: true },
              { name: 'Local Business Research', desc: 'Google My Business intelligence and operational hours', active: subscription.entitlements?.hasGmbResearch ?? true },
              { name: 'Direct Email Discovery', desc: 'Decision-maker mailbox finding and deliverability check', active: subscription.entitlements?.hasEmailDiscovery ?? true },
              { name: 'Phone Line Validation', desc: 'Direct corporate and mobile phone number verification', active: subscription.entitlements?.hasPhoneDiscovery ?? true },
              { name: 'CSV & CRM Data Export', desc: 'One-click spreadsheet export for outreach tools', active: subscription.entitlements?.hasCsvExport ?? true },
              { name: 'AI Synthesis & Lead Scoring', desc: 'Gemini 1.5 automated company intelligence summary', active: subscription.entitlements?.hasAiAnalysis ?? false },
              { name: 'Concurrent Research Pipelines', desc: `${subscription.entitlements?.concurrentResearchJobs || 10} parallel background discovery jobs`, active: true },
              { name: 'Dedicated Support Desk', desc: '24-hour turnaround SLA for prospect research inquiries', active: subscription.entitlements?.prioritySupport ?? false },
            ].map((f) => (
              <div
                key={f.name}
                className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 flex items-start gap-3"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    f.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className={`font-semibold ${f.active ? 'text-white' : 'text-slate-500 line-through'}`}>
                    {f.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL: Request Renewal */}
        {showRenewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-2xl my-8">
              {!renewalSuccess ? (
                <>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Request Subscription Renewal or Upgrade</h3>
                    <button
                      onClick={() => setShowRenewModal(false)}
                      className="text-slate-400 hover:text-white text-xs font-mono"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleRequestRenewal} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                        Select Target Package
                      </label>
                      <select
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {p.maxLeadsQuota.toLocaleString()} leads quota
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                        Select Billing Duration
                      </label>
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value as BillingCycle)}
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="half_yearly">Half Yearly</option>
                        <option value="annual">Annual (Best value)</option>
                      </select>
                    </div>

                    {/* Cost Preview */}
                    <div className="p-4 rounded-xl bg-[#080d1a] border border-amber-400/20 text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Renewal Fee:</span>
                        <span className="text-amber-400 font-bold text-sm">${renewalCost} USD</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Selected Package:</span>
                        <span className="text-slate-300">{selectedPlan?.name}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Lead Allocation:</span>
                        <span className="text-emerald-400 font-semibold">{selectedPlan?.maxLeadsQuota.toLocaleString()} leads</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                        Additional Instructions / Memo (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="e.g. Planning to initiate bank wire tomorrow from corporate account."
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowRenewModal(false)}
                        className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs font-mono rounded-lg transition"
                      >
                        {submitting ? 'Submitting...' : 'Submit Renewal Request'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">Renewal Request Submitted</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Our finance desk has been notified. Please complete your manual payment using the escrow details below:
                    </p>
                  </div>

                  {/* Wire Instructions */}
                  <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 text-xs font-mono space-y-2">
                    <div className="font-semibold text-amber-400 pb-1 border-b border-slate-800">
                      Bank Wire Instructions
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bank:</span>
                      <span className="text-white">{settings?.bankWireInstructions?.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Beneficiary:</span>
                      <span className="text-white">{settings?.bankWireInstructions?.accountTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">IBAN:</span>
                      <span className="text-amber-300">{settings?.bankWireInstructions?.iban}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SWIFT:</span>
                      <span className="text-white">{settings?.bankWireInstructions?.swiftCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Due:</span>
                      <span className="text-emerald-400 font-bold">${renewalCost} USD</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setShowRenewModal(false)}
                      className="px-5 py-2 bg-amber-400 text-slate-950 font-bold text-xs font-mono rounded-lg"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
