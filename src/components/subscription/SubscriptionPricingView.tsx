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
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('starter');
  const [requestSent, setRequestSent] = useState<string | null>(null);

  // Base Prices in PKR (Starting at PKR 5,000 / month per requirement 9)
  const plansData = [
    {
      id: 'starter',
      badge: 'Basic Plan',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      btnGrad: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25',
      name: 'Starter Prospector',
      tagline: 'Ideal for independent freelancers and small agencies beginning outreach.',
      basePriceMonthlyPkr: 5000,
      isFeatured: false,
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
      badge: 'Standard Plan',
      badgeColor: 'bg-[#0057FF]/20 text-[#00AAFF] border-[#00AAFF]/40',
      btnGrad: 'from-[#0057FF] via-[#0088FF] to-[#00AAFF] hover:brightness-110 shadow-[#0057FF]/40',
      name: 'Growth Agency Pro',
      tagline: 'For fast-growing digital agencies closing high-ticket foreign clients.',
      basePriceMonthlyPkr: 12000,
      isFeatured: true,
      features: [
        '1,500 Verified Leads / month across 15+ platforms',
        'Upwork, Contra, Freelancer.com & Bark direct feed',
        'Automated SOW & Scope of Work Deliverables Studio',
        'Multi-channel Inbound Client Chat Inbox',
        'Voice Note Pitching & Luxury PDF Attachments',
        'CSV & Excel Export Center',
        'Priority Technical Support 24/7',
      ],
      quotaDisplay: '1,500 Leads / mo',
    },
    {
      id: 'enterprise',
      badge: 'Premium Plan',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      btnGrad: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25',
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
    return Math.round(monthlyRateInCurrency).toLocaleString();
  };

  const handleSubscribeRequest = (planId: string, planName: string) => {
    setSelectedPlan(planId);
    setRequestSent(`Subscription application for ${planName} (${CURRENCIES[currency].symbol}${calculatePrice(
      plansData.find((p) => p.id === planId)!.basePriceMonthlyPkr
    )}/${billingPeriod}) received. An account manager will confirm your manual payment & activation.`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-12 font-sans relative select-none">
      
      {/* Screenshot 5 Colorful 3D Glowing Ambient Orbs Floating Behind Frosted Cards */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-500/35 via-orange-600/25 to-amber-300/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#0057FF]/35 via-[#00AAFF]/25 to-cyan-400/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/35 via-teal-600/25 to-cyan-400/15 blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#00AAFF]/30 text-xs font-bold text-[#00AAFF] backdrop-blur-xl">
          <CreditCard className="w-3.5 h-3.5 text-[#00AAFF]" />
          <span>Plans & Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Choose Your Plan
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Base plan starts at <b>PKR 5,000 / month</b>. Select your preferred currency and billing cadence below.
        </p>

        {/* Currency Switcher & Billing Period Controls */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Currency Switcher */}
          <div className="flex items-center bg-white/[0.04] border border-white/15 backdrop-blur-xl rounded-full p-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 px-3 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#00AAFF]" />
              Currency:
            </span>
            {(['USD', 'PKR', 'AED', 'GBP', 'EUR'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  currency === c
                    ? 'bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Billing Cadence Toggle */}
          <div className="flex items-center bg-white/[0.04] border border-white/15 backdrop-blur-xl rounded-full p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('quarterly')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                billingPeriod === 'quarterly'
                  ? 'bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quarterly (-10%)
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                billingPeriod === 'annual'
                  ? 'bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
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

      {/* Confirmation Feedback */}
      {requestSent && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl glass-luxury-container border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 relative z-10 animate-slide-down">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{requestSent}</span>
        </div>
      )}

      {/* Pricing Cards Grid (Screenshot 5 Match) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 relative z-10 items-stretch">
        {plansData.map((plan) => {
          const price = calculatePrice(plan.basePriceMonthlyPkr);
          const cur = CURRENCIES[currency];

          return (
            <div
              key={plan.id}
              className={`rounded-[2.5rem] p-7 flex flex-col justify-between transition-all duration-300 relative glass-luxury-container ${
                plan.isFeatured
                  ? 'border-2 border-[#00AAFF]/50 shadow-[0_20px_70px_rgba(0,170,255,0.25)] transform md:-translate-y-3'
                  : 'border border-white/20 hover:border-white/40'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white text-[11px] font-bold shadow-md shadow-[#0057FF]/40 border border-[#00AAFF]/40 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <div className="mb-5 mt-1">
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border mb-3 ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#00AAFF] border border-white/10">
                      {plan.quotaDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px] leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {cur.symbol}{price}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      /{billingPeriod === 'annual' ? 'mo (billed yr)' : 'mo'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#00AAFF]" />
                    <span>Cadence: {billingPeriod}</span>
                    {currency !== 'PKR' && (
                      <span className="text-[10px] text-slate-500">
                        &bull; (Base: PKR {plan.basePriceMonthlyPkr.toLocaleString()}/mo)
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 text-xs text-slate-300 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                    Included Capabilities:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
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
                className={`w-full py-3.5 px-4 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r text-white shadow-lg ${plan.btnGrad}`}
              >
                <span>Get Started with {plan.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Security & Support Guarantee Footnote */}
      <div className="p-6 rounded-[2rem] glass-luxury-container border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0057FF]/15 border border-[#0057FF]/30 text-[#00AAFF] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white block">
              100% Guaranteed Lead Deliverability &amp; Identity Verification
            </span>
            <span>All leads contain real domain-resolved business contacts. Unused quotas roll over automatically.</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-mono shrink-0">
          Selected: <b>{CURRENCIES[currency].label}</b> &bull; Base: <b>PKR 5,000/mo</b>
        </div>
      </div>
    </div>
  );
}
