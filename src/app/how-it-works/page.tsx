'use client';

import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Bot,
  MailCheck,
  CreditCard,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Plan',
      tagline: 'Tailored for your exact market scope and monthly lead target',
      desc: 'Review our six subscription packages (Basic, Starter, Standard, Professional, Venture, Enterprise). Each package defines precise maximum lead allocations, allowed countries (US, UK, UAE, Pakistan, Global), and feature permissions such as deep business research and AI analysis.',
      features: ['Transparent Quota Limits', 'Configurable Duration Cycles', 'No Automated Hidden Charges'],
    },
    {
      num: '02',
      title: 'Submit Your Application',
      tagline: 'Structured business onboarding review',
      desc: 'Complete our professional customer registration application with your operating country, target industries, and service requirements. Our system assigns you an official Application Reference Number and routes your file directly to our onboarding team.',
      features: ['Instant Application Reference ID', 'Operating Country Validation', 'Direct Requirements Assessment'],
    },
    {
      num: '03',
      title: 'Complete Manual Payment',
      tagline: 'Direct, audited corporate settlement',
      desc: 'Samvero utilizes audited manual payments. Transfer payment via corporate Bank Wire Transfer, Wise Direct, or approved invoice. Submit your payment reference to your account manager. An authorized Super Admin confirms deposit and activates your subscription.',
      features: ['Verified Bank Wire & Wise Escrow', 'Manual Audit & Deposit Verification', 'Official Payment Receipts & History'],
    },
    {
      num: '04',
      title: 'Access Your Lead Generation Dashboard',
      tagline: 'Instant one-click workspace provisioning',
      desc: 'Once payment is confirmed, your isolated customer workspace is activated. You receive secure credentials with full plan entitlements. Discover leads across Google Business Profiles, LinkedIn, Upwork, and Bark with real-time verification and zero data crossover.',
      features: ['Multi-Tenant Data Isolation', 'Real-Time Contact Enrichment', 'Atomic Quota Enforcement'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Onboarding Architecture</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 font-serif">
              How Samvero Operates
            </h1>
            <p className="text-slate-300 text-base mt-4 leading-relaxed">
              From application and verified manual payment to private workspace provisioning and high-velocity prospecting.
            </p>
          </div>

          {/* 4 Steps Detail */}
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-10 rounded-3xl bg-[#090d1a] border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                <div className="md:col-span-3 flex flex-col items-start">
                  <span className="text-5xl sm:text-6xl font-black text-amber-400/30 font-mono">
                    {step.num}
                  </span>
                  <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold mt-2">
                    Phase {idx + 1}
                  </span>
                </div>
                <div className="md:col-span-9 space-y-3">
                  <h3 className="text-2xl font-black text-white">{step.title}</h3>
                  <div className="text-xs font-semibold text-amber-400/90">{step.tagline}</div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    {step.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Subsection (id=features) */}
          <div id="features" className="pt-10 border-t border-slate-800">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Core Engine</span>
              <h2 className="text-3xl font-extrabold text-white mt-2 font-serif">Platform Capabilities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: 'Google Business Profile Research', desc: 'Operating status, physical coordinates, verified ratings, and category extraction.' },
                { title: 'Multi-Source Contact Discovery', desc: 'Direct corporate email identification, phone line resolution, and social profile links.' },
                { title: 'Email & Phone Verification', desc: 'Automated live DNS MX server validation and ITU telephone formatting.' },
                { title: 'AI Pitch Blueprints', desc: 'Gemini-powered business intelligence analysis and turnkey proposal outlines.' },
                { title: 'Multi-Tenant Data Isolation', desc: 'Strict server-side tenant scoping. Customer A never sees Customer B records.' },
                { title: 'Lead Lists & Export Center', desc: 'Organize leads into focused outreach lists with one-click clean CSV downloads.' },
              ].map((feat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800 space-y-1.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{feat.title}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-sm transition shadow-lg shadow-amber-500/20"
            >
              <span>Submit Your Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
