'use client';

import React, { useState } from 'react';
import { 
  Check, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Globe2, 
  CheckCircle2, 
  HelpCircle,
  Clock
} from 'lucide-react';

export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP' | 'EUR';
export type BillingPeriod = 'monthly' | 'quarterly' | 'annual';

interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  symbol: string;
  rateToPkr: number; // 1 Unit of Currency = rateToPkr in PKR
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  PKR: { code: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: '₨', rateToPkr: 1 },
  USD: { code: 'USD', label: 'US Dollar (USD)', symbol: '$', rateToPkr: 278 },
  AED: { code: 'AED', label: 'UAE Dirham (AED)', symbol: 'AED ', rateToPkr: 75.7 },
  GBP: { code: 'GBP', label: 'British Pound (GBP)', symbol: '£', rateToPkr: 352 },
  EUR: { code: 'EUR', label: 'Euro (EUR)', symbol: '€', rateToPkr: 302 },
};

export default function SubscriptionPricingView() {
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('starter');
  const [requestSent, setRequestSent] = useState<string | null>(null);

  // Base Prices in PKR (Starting at PKR 5,000 / month per requirement 9)
  const plansData = [
    {
      id: 'starter',
      name: 'Starter Prospector',
      tagline: 'Ideal for independent freelancers and small agencies beginning outreach.',
      basePriceMonthlyPkr: 5000, // PKR 5,000 base starting price
      isFeatured: true,
      features: [
        '500 Verified Multi-Platform Leads / month',
        'Direct Owner Emails & Validated Phone Numbers',
        'Google My Business & Local Map Radar',
        '1-Click Direct Gmail & WhatsApp Web Outreach',
        'Interactive Website Pitch Preview Generator',
        'Private Saved Leads & Notes Management',
        'Daily Ingestion & Real-Time Alerts',
      ],
      quotaDisplay: '500 Leads / mo',
    },
    {
      id: 'professional',
      name: 'Growth Agency Pro',
      tagline: 'For fast-growing digital agencies closing high-ticket foreign clients.',
      basePriceMonthlyPkr: 12000,
      isFeatured: false,
      features: [
        '1,500 Verified Leads / month across 50+ platforms',
        'Upwork, Contra, Freelancer.com & Bark direct feed',
        'Automated SOW & Scope of Work Deliverables Studio',
        'Multi-channel Inbound Client Chat Inbox',
        'Voice Note Pitching & Luxury PDF Attachments',
        'CSV & Excel Export Center',
        'Priority Technical Support',
      ],
      quotaDisplay: '1,500 Leads / mo',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Acquisition Desk',
      tagline: 'Comprehensive prospecting infrastructure for full business development teams.',
      basePriceMonthlyPkr: 25000,
      isFeatured: false,
      features: [
        '5,000 Verified Leads / month with Zero Duplication',
        'Custom Territory Ingestion (Dubai, US, UK, Pakistan)',
        'Full White-Label Client Proposals & Presentations',
        'Dedicated Outreach Campaign Manager',
        'Multi-Seat Team Access & Role Delegation',
        'Direct Database Sync & API Webhooks',
        '24/7 Dedicated Account Director',
      ],
      quotaDisplay: '5,000 Leads / mo',
    },
  ];

  // Helper to calculate price in selected currency and billing period
  const calculatePrice = (baseMonthlyPkr: number) => {
    const cur = CURRENCIES[currency];
    const discountMultiplier = billingPeriod === 'quarterly' ? 0.9 : billingPeriod === 'annual' ? 0.75 : 1;
    const monthlyRateInCurrency = (baseMonthlyPkr * discountMultiplier) / cur.rateToPkr;

    if (cur.code === 'PKR') {
      return Math.round(monthlyRateInCurrency).toLocaleString();
    }
    return monthlyRateInCurrency.toFixed(2);
  };

  const handleSubscribeRequest = (planId: string, planName: string) => {
    setSelectedPlan(planId);
    setRequestSent(`Subscription request for ${planName} (${CURRENCIES[currency].symbol}${calculatePrice(
      plansData.find((p) => p.id === planId)!.basePriceMonthlyPkr
    )}/${billingPeriod}) received. An account manager will confirm your activation.`);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-[#3B6FF5]">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Transparent Membership &amp; Quotas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Flexible Subscription Plans
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Base plan starts at <b>PKR 5,000 / month</b>. Select your preferred currency and billing cadence below.
        </p>

        {/* Currency Switcher & Billing Period Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Currency Switcher (Requirement 9) */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 px-3 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#3B6FF5]" />
              Currency:
            </span>
            {(['PKR', 'USD', 'AED', 'GBP', 'EUR'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currency === c
                    ? 'bg-[#3B6FF5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Billing Cadence Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xs">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingPeriod === 'monthly'
                  ? 'bg-slate-900 dark:bg-slate-800 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('quarterly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingPeriod === 'quarterly'
                  ? 'bg-slate-900 dark:bg-slate-800 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Quarterly (-10%)
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                billingPeriod === 'annual'
                  ? 'bg-slate-900 dark:bg-slate-800 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-black">
                -25%
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Confirmation Banner */}
      {requestSent && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{requestSent}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plansData.map((plan) => {
          const price = calculatePrice(plan.basePriceMonthlyPkr);
          const cur = CURRENCIES[currency];

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 relative bg-white dark:bg-[#111927] border ${
                plan.isFeatured
                  ? 'border-[#3B6FF5] shadow-xl shadow-blue-500/10 ring-2 ring-[#3B6FF5]/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#3B6FF5] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Base Plan — Recommended</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#3B6FF5] border border-blue-200 dark:border-blue-900">
                    {plan.quotaDisplay}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px] leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                      {cur.symbol}{price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      / month ({currency})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Billed {billingPeriod}</span>
                    {currency !== 'PKR' && (
                      <span className="text-[10px] text-slate-500">
                        &bull; (Base: PKR {plan.basePriceMonthlyPkr.toLocaleString()}/mo)
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                    Included Capabilities:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleSubscribeRequest(plan.id, plan.name)}
                className={`mt-8 w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  plan.isFeatured
                    ? 'bg-[#3B6FF5] hover:bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                <span>Select {plan.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Security & Support Guarantee Footnote */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0e1624] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#3B6FF5] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              100% Guaranteed Lead Deliverability &amp; Identity Verification
            </span>
            <span>All leads contain real domain-resolved business contacts. Unused quotas roll over automatically.</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-mono shrink-0">
          Selected: <b>{CURRENCIES[currency].label}</b> &bull; Base: <b>PKR 5,000/mo</b>
        </div>
      </div>
    </div>
  );
}
