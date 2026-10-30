'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { PlanConfig, BillingCycle } from '@/lib/saas-store';
import { Check, ArrowRight, ShieldCheck, HelpCircle, Lock } from 'lucide-react';

export default function PricingPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  useEffect(() => {
    fetch('/api/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Official Membership Tiers</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 font-serif">
              Six Subscription Packages
            </h1>
            <p className="text-slate-400 text-base mt-3">
              Predictable lead allowances and verified intelligence access. Quotas and limits are managed directly by central administration.
            </p>

            {/* Cycle Selector */}
            <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              {(['monthly', 'quarterly', 'half_yearly', 'annual'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition ${
                    billingCycle === cycle
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cycle === 'half_yearly' ? 'Half-Yearly (-20%)' : cycle}
                  {cycle === 'annual' && <span className="ml-1 text-[10px] text-amber-950 font-black">(-30%)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="py-20 text-center text-slate-500 font-mono text-sm animate-pulse">
              Retrieving active subscription packages...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const price = plan.prices[billingCycle] || plan.prices.monthly;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                      plan.isFeatured
                        ? 'bg-gradient-to-b from-slate-900 via-[#0a1122] to-slate-950 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/10'
                        : 'bg-[#090d1a] border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plan.isFeatured && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[11px] font-black uppercase tracking-wider shadow-md">
                        Recommended
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-black text-white">{plan.name}</h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {plan.maxLeadsQuota.toLocaleString()} Leads
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                      <div className="mt-6 mb-6 pb-6 border-b border-slate-800">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
                            ${price}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">/{billingCycle}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Manual bank wire or invoice payment</div>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-semibold">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{plan.maxLeadsQuota.toLocaleString()} Leads per cycle</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{plan.allowedSources.length} Platform Connectors</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Google Business & Profile Research</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Contact Information Discovery</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          {plan.hasEmailVerification ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                          )}
                          <span className={plan.hasEmailVerification ? 'text-slate-300' : 'text-slate-500 line-through'}>
                            DNS MX Mail Server Verification
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          {plan.hasPhoneValidation ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                          )}
                          <span className={plan.hasPhoneValidation ? 'text-slate-300' : 'text-slate-500 line-through'}>
                            ITU WhatsApp Number Validation
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          {plan.hasAiAnalysis ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                          )}
                          <span className={plan.hasAiAnalysis ? 'text-slate-300' : 'text-slate-500 line-through'}>
                            AI Pitch & Scope Blueprints
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          {plan.prioritySupport ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                          )}
                          <span className={plan.prioritySupport ? 'text-slate-300' : 'text-slate-500'}>
                            {plan.prioritySupport ? 'Dedicated Account Executive' : 'Standard Technical Support'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4">
                      <Link
                        href={`/signup?plan=${plan.id}&billing=${billingCycle}`}
                        className={`w-full block text-center py-3 rounded-xl font-bold text-xs transition ${
                          plan.isFeatured
                            ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        Apply for {plan.name}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Note on Manual Payment */}
          <div className="mt-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Manual Payment Assurance</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  We verify each customer application before accepting payment. No automated recurring credit card deductions.
                </p>
              </div>
            </div>
            <Link
              href="/signup"
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shrink-0"
            >
              Submit Application
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
