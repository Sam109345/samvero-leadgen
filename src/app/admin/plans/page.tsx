'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlanConfig, BillingCycle } from '@/lib/saas-store';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
  Edit2,
  X,
  Sliders,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const fetchPlans = () => {
    setLoading(true);
    fetch('/api/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setSaving(true);
    setSaveSuccess('');

    try {
      const res = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: editingPlan.id,
          updates: editingPlan,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(`Plan "${editingPlan.name}" updated successfully.`);
        fetchPlans();
        setTimeout(() => {
          setEditingPlan(null);
          setSaveSuccess('');
        }, 1200);
      } else {
        alert(data.error || 'Failed to update plan');
      }
    } catch (err: any) {
      alert(err?.message || 'Save error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Six Subscription Packages Configuration"
      subtitle="Configure plan pricing, lead quotas, lead sources, and feature permissions. Changes apply immediately to new customer subscriptions."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="text-xs text-slate-400">
            Exactly 6 official packages configured in database. Click &ldquo;Configure Limits&rdquo; on any package to edit.
          </div>
        </div>

        {/* Six Packages Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono text-xs animate-pulse">
            Loading subscription packages from database...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition ${
                  plan.isFeatured
                    ? 'bg-gradient-to-b from-slate-900 via-[#0a1122] to-slate-950 border-amber-400/60 shadow-xl'
                    : 'bg-[#090d1a] border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-white">{plan.name}</span>
                      <span className="text-[10px] text-slate-400 block">{plan.tagline}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 font-mono font-bold text-xs">
                      {plan.maxLeadsQuota.toLocaleString()} Leads
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Monthly</span>
                      <span className="font-mono font-bold text-white">${plan.prices.monthly}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Quarterly</span>
                      <span className="font-mono font-bold text-white">${plan.prices.quarterly}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Half-Yearly</span>
                      <span className="font-mono font-bold text-white">${plan.prices.half_yearly}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Annual</span>
                      <span className="font-mono font-bold text-white">${plan.prices.annual}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Max Leads Quota:</span>
                      <span className="font-mono font-bold text-amber-400">{plan.maxLeadsQuota.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Concurrent Research Jobs:</span>
                      <span className="font-mono text-slate-400">{plan.concurrentResearchJobs}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Allowed Sources:</span>
                      <span className="font-mono text-slate-400">{plan.allowedSources.length} Platforms</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Email Verification:</span>
                      <span className={plan.hasEmailVerification ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                        {plan.hasEmailVerification ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Phone Validation:</span>
                      <span className={plan.hasPhoneValidation ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                        {plan.hasPhoneValidation ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>AI Pitch Blueprints:</span>
                      <span className={plan.hasAiAnalysis ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                        {plan.hasAiAnalysis ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Priority Support:</span>
                      <span className={plan.prioritySupport ? 'text-amber-400 font-bold' : 'text-slate-600'}>
                        {plan.prioritySupport ? 'Priority SLA' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setEditingPlan({ ...plan })}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Configure Limits & Prices</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Plan Modal */}
        {editingPlan && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#090d1a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Configure {editingPlan.name} Package</h3>
                    <p className="text-xs text-slate-400">Edit pricing, lead allowance, and server-side feature permissions</p>
                  </div>
                </div>
                <button onClick={() => setEditingPlan(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSavePlan} className="space-y-5 text-xs">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Package Name</label>
                    <input
                      type="text"
                      required
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Max Leads Quota</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.maxLeadsQuota}
                      onChange={(e) => setEditingPlan({ ...editingPlan, maxLeadsQuota: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Package Description</label>
                  <textarea
                    rows={2}
                    value={editingPlan.description}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Pricing row */}
                <div>
                  <label className="block text-slate-300 font-bold mb-2">Pricing by Duration (USD)</label>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Monthly</span>
                      <input
                        type="number"
                        value={editingPlan.prices.monthly}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            prices: { ...editingPlan.prices, monthly: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Quarterly</span>
                      <input
                        type="number"
                        value={editingPlan.prices.quarterly}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            prices: { ...editingPlan.prices, quarterly: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Half-Yearly</span>
                      <input
                        type="number"
                        value={editingPlan.prices.half_yearly}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            prices: { ...editingPlan.prices, half_yearly: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Annual</span>
                      <input
                        type="number"
                        value={editingPlan.prices.annual}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            prices: { ...editingPlan.prices, annual: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Permissions Checkboxes */}
                <div>
                  <label className="block text-slate-300 font-bold mb-2">Feature Permissions & Entitlements</label>
                  <div className="grid grid-cols-2 gap-2.5 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasBusinessResearch}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasBusinessResearch: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>Business Website Research</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasGmbResearch}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasGmbResearch: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>Google Business Research</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasEmailDiscovery}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasEmailDiscovery: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>Email Discovery Access</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasPhoneDiscovery}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasPhoneDiscovery: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>Phone Discovery Access</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasEmailVerification}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasEmailVerification: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>DNS MX Email Verification</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasPhoneValidation}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasPhoneValidation: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>Phone / WhatsApp Validation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasCsvExport}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasCsvExport: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>CSV Export Permission</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.hasAiAnalysis}
                        onChange={(e) => setEditingPlan({ ...editingPlan, hasAiAnalysis: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>AI Opportunity Analysis</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.prioritySupport}
                        onChange={(e) => setEditingPlan({ ...editingPlan, prioritySupport: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>Priority Support SLA</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingPlan.isFeatured || false}
                        onChange={(e) => setEditingPlan({ ...editingPlan, isFeatured: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500"
                      />
                      <span>Featured (Most Popular Badge)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black transition disabled:opacity-60"
                  >
                    {saving ? 'Saving Changes...' : 'Save Plan Configuration'}
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
