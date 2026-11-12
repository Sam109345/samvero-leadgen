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
  Cpu,
  Database,
  Radio,
  Workflow,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      phase: 'PLAN ORBIT',
      title: 'Select Mission Parameters & Plan',
      tagline: 'Tailored quotas for your market scope and monthly lead target',
      desc: 'Review our 6 enterprise tiers (Basic, Starter, Standard, Professional, Venture, Enterprise). Each package defines precise maximum verified lead allocations, allowed geographic scopes (US, UK, UAE, Pakistan, Global), and feature access like deep GMB radar, AI pitch decks, and WhatsApp verification.',
      features: ['Transparent Quota Limits', 'Configurable Duration Cycles', 'No Hidden Fees'],
      icon: Radio,
    },
    {
      num: '02',
      phase: 'INTELLIGENCE INTAKE',
      title: 'Submit Target Application',
      tagline: 'Structured business onboarding and territory calibration',
      desc: 'Submit your customer onboarding profile with operating country, target niche, and deliverables requirements. Our system assigns an official Application Reference Number and prepares telemetry filters.',
      features: ['Instant Application Reference ID', 'Geographic Country Filter Mapping', 'Custom Requirements Calibration'],
      icon: Cpu,
    },
    {
      num: '03',
      phase: 'SECURE SETTLEMENT',
      title: 'Audited Enterprise Settlement',
      tagline: 'Direct, audited corporate settlement via Bank Wire or Wise Direct',
      desc: 'Samvero utilizes audited manual payments. Transfer payment via corporate Bank Wire Transfer, Wise Direct, or approved invoice. Submit your payment reference to your account manager. An authorized Super Admin confirms deposit and activates your subscription.',
      features: ['Verified Bank Wire & Wise Escrow', 'Audited Deposit Verification', 'Official Payment Receipts & History'],
      icon: CreditCard,
    },
    {
      num: '04',
      phase: 'TELEMETRY LAUNCH',
      title: 'Access Real-Time Lead Command Center',
      tagline: 'Instant one-click workspace provisioning with live APIs',
      desc: 'Once payment is confirmed, your isolated customer workspace is activated. Discover live leads across Google My Business, Upwork, Freelancer, LinkedIn, RemoteOK, and Bark with instant phone/WhatsApp ITU formatting and zero demo data.',
      features: ['Multi-Tenant Data Isolation', 'Real-Time Contact Enrichment', 'Live API Stream (10s Auto-Sync)'],
      icon: Database,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-[#0057FF] selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0057FF]/15 via-[#00AAFF]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-[#0057FF]/10 blur-[130px] pointer-events-none" />

      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card mb-4 text-xs font-semibold text-[#00AAFF]">
              <span className="w-2 h-2 rounded-full bg-[#00AAFF] animate-pulse" />
              SYSTEM PIPELINE & ARCHITECTURE
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              How <span className="text-neon">Samvero</span> Operates
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
              From onboarding calibration to live multi-platform lead aggregation, contact verification, and direct client outreach.
            </p>
          </div>

          {/* 3D Pipeline Visual Animation Container */}
          <div className="glass-card neon-border rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2 space-y-4">
                <span className="text-xs uppercase font-mono tracking-widest text-[#00AAFF] font-bold">
                  TELEMETRY PIPELINE
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Continuous Real-Time Data Pipeline
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Real API connectors query Google My Business, OpenStreetMap, Freelancer.com, Remotive, Upwork, and RemoteOK every 10 seconds. Each lead is cleaned, sanitized with international country phone codes, WhatsApp direct links, and verified DNS/MX records.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Zero Mock Data Guarantee', '10s Periodic Live Sync', 'Valid WhatsApp & Phones', 'ITU E.164 Standards'].map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0057FF]/15 border border-[#0057FF]/30 text-[#00AAFF]"
                    >
                      ✓ {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden border border-[#0057FF]/30 shadow-2xl relative group">
                <img
                  src="https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
                  alt="3D Live Pipeline Stream"
                  className="w-full h-64 sm:h-72 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-cyan-300 bg-[#030712]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#00AAFF]/30">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE PIPELINE ACTIVE
                  </span>
                  <span>10s INTERVAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Steps Detail */}
          <div className="space-y-8">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={idx}
                  className="p-8 sm:p-10 rounded-3xl glass-card border border-blue-500/20 hover:border-[#00AAFF]/50 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden group"
                >
                  <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#0057FF]/5 rounded-full blur-3xl group-hover:bg-[#0057FF]/15 transition-all" />

                  <div className="md:col-span-3 flex flex-col items-start">
                    <span
                      className="text-5xl sm:text-6xl font-black text-[#0057FF]/40 font-mono group-hover:text-[#00AAFF]/70 transition-colors"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {step.num}
                    </span>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#00AAFF] font-bold mt-2 flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-[#00AAFF]" />
                      {step.phase}
                    </span>
                  </div>

                  <div className="md:col-span-9 space-y-3 relative z-10">
                    <h3
                      className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#00AAFF]">{step.tagline}</div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {step.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-3 py-1 rounded-lg bg-[#0057FF]/10 border border-[#0057FF]/30 text-xs font-medium text-slate-200 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00AAFF]" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Subsection (id=features) */}
          <div id="features" className="pt-10 border-t border-blue-500/20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-[#00AAFF]">Core Capabilities</span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white mt-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Space-Grade Engine Capabilities
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: 'Google Business Profile Research', desc: 'Operating status, physical coordinates, verified ratings, and category extraction with direct calls.' },
                { title: 'Multi-Source Contact Discovery', desc: 'Direct corporate email identification, phone line resolution, and live verified WhatsApp direct messaging.' },
                { title: 'Email & Phone Verification', desc: 'Automated live DNS MX server validation and ITU telephone formatting with E.164 sanitization.' },
                { title: 'AI Pitch Blueprints', desc: 'Gemini-powered business intelligence analysis and turnkey proposal outlines for high conversion.' },
                { title: 'Multi-Tenant Data Isolation', desc: 'Strict server-side tenant scoping. Customer A never sees Customer B records.' },
                { title: 'Lead Lists & Export Center', desc: 'Organize leads into focused outreach lists with one-click clean CSV downloads and pipeline tracking.' },
              ].map((feat, idx) => (
                <div key={idx} className="p-6 rounded-2xl glass-card border border-blue-500/20 hover:border-[#00AAFF]/40 transition space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00AAFF] shrink-0" />
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #0057FF 0%, #00AAFF 100%)',
              }}
            >
              <span>Launch Your Mission Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
