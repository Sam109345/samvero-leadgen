'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import { PlanConfig, BillingCycle } from '@/lib/saas-store';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Building2,
  MailCheck,
  PhoneCall,
  Lock,
  Layers,
  ChevronDown,
  Globe2,
  Sliders,
  BarChart3,
  Bot,
  Zap,
  Check,
  HelpCircle,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

export default function LuxuryLandingPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
      })
      .catch((err) => console.warn('Could not load database plans:', err))
      .finally(() => setLoadingPlans(false));
  }, []);

  const faqs = [
    {
      q: 'How does Samvero work?',
      a: 'Samvero combines automated real-data discovery connectors with multi-source contact enrichment. It tracks live commercial leads across Google Business Profiles, LinkedIn, Upwork, Bark, and leading enterprise directories. Discovered businesses undergo automated domain checks, DNS/MX mail server validation, and ITU telephone verification before entering your private dashboard.',
    },
    {
      q: 'How do I purchase a package?',
      a: 'Select your preferred subscription package from the pricing section and click "Apply for Plan". Complete the structured customer application with your target requirements. Once submitted, our team reviews your application and provides direct manual payment instructions for your selected billing duration.',
    },
    {
      q: 'How does manual payment work?',
      a: 'Samvero utilizes audited manual payments via corporate Bank Wire Transfer, Wise Direct, and custom invoiced accounts. Once payment is made outside the platform, submit your transaction reference to your account manager. An authorized Super Admin verifies the deposit and immediately activates your subscription.',
    },
    {
      q: 'When will I receive my login credentials?',
      a: 'Immediately upon administrative payment confirmation, our system transactionally creates your isolated customer account, assigns your package entitlements, and emails your secure activation link and one-time password setup credentials.',
    },
    {
      q: 'How many leads can I access?',
      a: 'Lead allowance depends strictly on your configured package: Basic (250 leads), Starter (750 leads), Standard (2,500 leads), Professional (7,500 leads), Venture (20,000 leads), or Enterprise (60,000 leads). Quota is managed per billing cycle and you never forfeit existing saved leads.',
    },
    {
      q: 'What happens when my subscription expires?',
      a: 'When your subscription expires, new lead discovery and background enrichment jobs are restricted. However, all existing saved leads, contacts, and custom lists in your account remain completely accessible. You can request a renewal at any time from your billing page.',
    },
    {
      q: 'Can I upgrade my plan?',
      a: 'Yes. You can request a plan upgrade or billing cycle extension anytime directly through the customer portal or by contacting your dedicated account manager. New entitlements and expanded quotas are applied immediately upon manual confirmation.',
    },
    {
      q: 'How do renewals work?',
      a: 'Prior to expiration, you will receive reminders in your dashboard. You can click "Request Renewal" in your Subscription & Billing page, review payment details, and submit your reference. Admin confirmation extends your term and resets your fresh lead quota for the new cycle.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Header */}
      <PublicNavbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden border-b border-slate-800/80">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-transparent blur-[120px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Superbadge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-lg shadow-amber-500/5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Next-Generation Multi-Tenant Lead SaaS</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal">Real-Data Provenance Engine</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] font-serif">
              Find Better Business Opportunities.{' '}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Turn Leads Into Clients.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              Discover real business opportunities, research companies, access verified contact information and manage your entire prospecting workflow from one intelligent platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <span>Explore Packages</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Dashboard Mockup Visual */}
            <div className="mt-16 md:mt-20 max-w-6xl mx-auto relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-amber-500/20 via-blue-500/10 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
              <div className="relative rounded-2xl border border-slate-800/90 bg-[#090d19] overflow-hidden shadow-2xl">
                {/* Browser bar */}
                <div className="h-10 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>samvero.com/app/dashboard</span>
                  </div>
                  <div className="w-16" />
                </div>

                {/* Dashboard Inside Preview */}
                <div className="p-6 md:p-8 space-y-6 text-left">
                  {/* Top Bar Preview */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold mb-1">
                        Active Workspace &bull; Standard Plan Entitlement
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white">Prospecting & Lead Intelligence Desk</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>2,180 / 2,500 Leads Remaining</span>
                      </div>
                      <Link
                        href="/signup"
                        className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-xs"
                      >
                        Launch Search
                      </Link>
                    </div>
                  </div>

                  {/* 4 KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">My Total Leads</div>
                      <div className="text-2xl font-black text-white mt-1">320</div>
                      <div className="text-[11px] text-emerald-400 font-semibold mt-1">100% Genuine Provenance</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Verified Emails Discovered</div>
                      <div className="text-2xl font-black text-white mt-1">284</div>
                      <div className="text-[11px] text-blue-400 font-semibold mt-1">DNS/MX Validated</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Phone Numbers Enriched</div>
                      <div className="text-2xl font-black text-white mt-1">308</div>
                      <div className="text-[11px] text-purple-400 font-semibold mt-1">ITU Format Verified</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Qualified Opportunities</div>
                      <div className="text-2xl font-black text-white mt-1">94</div>
                      <div className="text-[11px] text-amber-400 font-semibold mt-1">AI Pitch Blueprints</div>
                    </div>
                  </div>

                  {/* Sample Real-data lead row mock */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                    <div className="p-3 bg-slate-900/60 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Live Intelligence Stream</span>
                      <span className="text-emerald-400 font-mono">Stream Active</span>
                    </div>
                    <div className="divide-y divide-slate-800/60 text-xs">
                      <div className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800 text-blue-300 font-bold flex items-center justify-center text-xs">
                            G
                          </div>
                          <div>
                            <div className="font-bold text-white">Falcon Crest Property Management</div>
                            <div className="text-[11px] text-slate-400">Dubai Marina, UAE &bull; Real Estate & Property</div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                            Email Verified
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold">
                            WhatsApp Ready
                          </span>
                        </div>
                        <div className="font-bold text-amber-400 text-xs">Score: 94/100</div>
                      </div>
                      <div className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-800 text-purple-300 font-bold flex items-center justify-center text-xs">
                            L
                          </div>
                          <div>
                            <div className="font-bold text-white">Harley Street Aesthetics & Dental Care</div>
                            <div className="text-[11px] text-slate-400">London, United Kingdom &bull; Healthcare & Wellness</div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                            Email Verified
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold">
                            Google Business
                          </span>
                        </div>
                        <div className="font-bold text-amber-400 text-xs">Score: 92/100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Platform Benefits */}
        <section className="py-24 bg-[#060a14] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Enterprise Value</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
                Everything You Need to Prospect with Certainty
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                Built specifically for commercial agencies, founders and outbound teams who demand verified contacts and real business opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Search,
                  title: 'Real Business Lead Discovery',
                  desc: 'Search active commercial companies across Google Maps, LinkedIn, Upwork, Bark and international public business registers with zero fabricated dummy records.',
                },
                {
                  icon: Bot,
                  title: 'Intelligent Business Research',
                  desc: 'Deep autonomous website crawling, SSL detection, mobile responsiveness analysis, and company operational footprint extraction.',
                },
                {
                  icon: MailCheck,
                  title: 'Contact Information Enrichment',
                  desc: 'Direct executive email extraction with deep DNS MX record validation and bounce reduction testing before outreach.',
                },
                {
                  icon: Building2,
                  title: 'Google Business Profile Research',
                  desc: 'Extract genuine physical addresses, verified ratings, review velocity, established operational age, and direct place IDs.',
                },
                {
                  icon: TrendingUp,
                  title: 'Lead Qualification & Scoring',
                  desc: 'Multi-factor explainable opportunity scoring calculating project relevance, budget availability, and digital revamp potential.',
                },
                {
                  icon: Layers,
                  title: 'Centralized Lead Management',
                  desc: 'Full-featured CRM pipeline, segmented lead lists, CSV exports, and multi-channel outreach tracking within your isolated private workspace.',
                },
              ].map((benefit, i) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition hover:bg-slate-900/70 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="py-24 bg-[#080d1b] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Transparent Workflow</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
                Four Steps to Active Prospecting
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                Simple, transparent, and verified onboarding process without hidden recurring auto-charges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {[
                {
                  step: '01',
                  title: 'Choose Your Plan',
                  desc: 'Select from our six configurable packages tailored to your lead volume, target geography, and feature requirements.',
                },
                {
                  step: '02',
                  title: 'Submit Your Application',
                  desc: 'Complete the professional customer application. We generate your unique Application Reference ID for tracking.',
                },
                {
                  step: '03',
                  title: 'Complete Manual Payment',
                  desc: 'Transfer payment via verified Bank Wire, Wise Direct, or corporate invoice. Our finance desk verifies your deposit.',
                },
                {
                  step: '04',
                  title: 'Access Your Dashboard',
                  desc: 'Receive immediate access credentials to your dedicated customer workspace with full plan quota and isolated data.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#090f20] border border-slate-800/90 relative group hover:border-amber-400/40 transition"
                >
                  <div className="text-3xl font-black text-amber-400/40 font-mono mb-3">{item.step}</div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Features Section */}
        <section id="features" className="py-24 bg-[#070b16] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Actual Implemented Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
                Commercial Powerhouse Features
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                All features advertised below are fully functional and connected directly to active backend engines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Multi-platform Lead Discovery',
                  desc: 'Google My Business, LinkedIn, Upwork, Fiverr, PeoplePerHour, Bark, and Freelancer.com live feeds.',
                },
                {
                  title: 'Business Intelligence',
                  desc: 'Automated deep crawling of corporate websites, technology stack fingerprinting, and digital audit.',
                },
                {
                  title: 'Google Business Research',
                  desc: 'Live place identity resolution, operating hours, review volume, and authentic location coordinates.',
                },
                {
                  title: 'Contact Discovery',
                  desc: 'Direct decision-maker name discovery, verified corporate domain emails, and direct phone lines.',
                },
                {
                  title: 'Contact Verification',
                  desc: 'Real-time DNS MX server probe and ITU international phone formatting for zero wasted outreach.',
                },
                {
                  title: 'AI-Powered Lead Analysis',
                  desc: 'Gemini 1.5 Flash opportunity analysis generating bespoke client pitches and website scope blueprints.',
                },
                {
                  title: 'Lead Management & Lists',
                  desc: 'Full-featured Kanban stage pipeline, customizable lead lists, status tags, and private client notes.',
                },
                {
                  title: 'Export & Analytics',
                  desc: 'Structured CSV exports for cold outreach tools, funnel conversion charts, and activity audit trail.',
                },
              ].map((feat, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800 hover:bg-slate-900/60 transition">
                  <div className="flex items-center gap-2 mb-2 text-amber-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Pricing Section (Display Six Subscription Packages from Database) */}
        <section id="pricing" className="py-24 bg-[#050811] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Database-Backed Plans</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 font-serif">
                Six Subscription Packages
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                Transparent quotas and feature entitlements configurable through our central administrative control.
              </p>

              {/* Billing Cycle Switcher */}
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
                    {cycle === 'half_yearly' ? 'Half-Yearly' : cycle}
                    {cycle === 'annual' && <span className="ml-1 text-[10px] text-amber-950 font-black">-30%</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Cards Grid */}
            {loadingPlans ? (
              <div className="py-16 text-center text-slate-500 font-mono text-sm animate-pulse">
                Loading official subscription packages from database...
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
                          Most Popular Package
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-xl font-black text-white">{plan.name}</h3>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {plan.maxLeadsQuota.toLocaleString()} Leads / Cycle
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

                        {/* Plan Limits & Features */}
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center gap-2 text-slate-300 font-semibold">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{plan.maxLeadsQuota.toLocaleString()} Total Lead Quota</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{plan.allowedSources.length} Discovered Lead Sources</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Google Business & Profile Research</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Corporate Email & Phone Discovery</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            {plan.hasEmailVerification ? (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                            )}
                            <span className={plan.hasEmailVerification ? 'text-slate-300' : 'text-slate-500 line-through'}>
                              DNS MX Email Verification
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            {plan.hasPhoneValidation ? (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                            )}
                            <span className={plan.hasPhoneValidation ? 'text-slate-300' : 'text-slate-500 line-through'}>
                              ITU WhatsApp Phone Validation
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            {plan.hasAiAnalysis ? (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                            )}
                            <span className={plan.hasAiAnalysis ? 'text-slate-300' : 'text-slate-500 line-through'}>
                              AI Pitch & Opportunity Blueprints
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            {plan.prioritySupport ? (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 text-slate-600 shrink-0">&times;</span>
                            )}
                            <span className={plan.prioritySupport ? 'text-slate-300' : 'text-slate-500'}>
                              {plan.prioritySupport ? 'Priority Account Manager Support' : 'Standard Email Support'}
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
          </div>
        </section>

        {/* 7. Why Samvero */}
        <section className="py-24 bg-[#070b16] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Our Commitment</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
                Why Industry Leaders Choose Samvero
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                {
                  title: 'Real-Source Business Data',
                  desc: 'Zero scraped duplicates or synthetic records. Every lead has traceable provenance to genuine commercial directories.',
                },
                {
                  title: 'Transparent Contact Discovery',
                  desc: 'Audit the exact URL, verification timestamp, and confidence rating for every discovered email address and telephone.',
                },
                {
                  title: 'Research-Backed Lead Quality',
                  desc: 'Every business is pre-screened for commercial activity, digital presence gaps, and proposal readiness.',
                },
                {
                  title: 'Subscription-Based Access',
                  desc: 'Controlled lead allocations ensure zero data flooding. Predictable quotas designed for conversion-focused sales teams.',
                },
                {
                  title: 'Dedicated Customer Onboarding',
                  desc: 'Personalized application review, manual verified payments, and tailored entitlement setup for every client account.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section className="py-24 bg-[#060a14] border-b border-slate-800/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Frequently Asked Questions</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
                Questions & Answers
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Everything you need to know about our subscription platform and manual payment workflow.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/70 transition"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#070b16] via-[#0b1329] to-[#050811]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-serif leading-tight">
              Ready to Find Your Next Business Opportunity?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Join leading commercial agencies and sales professionals using Samvero for verified, evidence-backed lead intelligence.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <PublicFooter />
    </div>
  );
}
