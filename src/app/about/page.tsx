'use client';

import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import {
  ShieldCheck,
  Target,
  CheckCircle2,
  Award,
  Users,
  Globe2,
  ArrowRight,
  Zap,
  Sparkles,
  Building2,
  Briefcase,
  TrendingUp,
} from 'lucide-react';

function Stars({ count = 50 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 19 + 7) % 100}%`,
    top: `${(i * 31 + 13) % 100}%`,
    size: `${((i % 3) * 0.7 + 1.2).toFixed(1)}px`,
    duration: `${(i % 4) + 3}s`,
    delay: `${((i % 5) * 0.8).toFixed(1)}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            '--duration': s.duration,
            '--delay': s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-[#0057FF] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <Stars />
        
        {/* Ambient Brand Color Orbs (Electric Blue & Cyan) */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.12) 0%, transparent 70%)', filter: 'blur(90px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none animate-float-delayed"
          style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />

        <div className="max-w-6xl mx-auto px-6 space-y-20 relative z-10">

          {/* ── Hero Header ─────────────────────────────────────── */}
          <div className="text-center max-w-3xl mx-auto reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase bg-[#0057FF]/10 border border-[#00AAFF]/30 text-[#00AAFF] shadow-[0_0_20px_rgba(0,170,255,0.15)]">
              <Sparkles className="w-3 h-3 text-[#00AAFF]" />
              <span>About Samvero Enterprise</span>
            </div>
            
            <h1
              className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Engineering True{' '}
              <span className="bg-gradient-to-r from-[#0057FF] via-[#00AAFF] to-[#38bdf8] bg-clip-text text-transparent">
                Lead Intelligence
              </span>
            </h1>
            
            <p className="text-base sm:text-lg leading-relaxed text-slate-300">
              We founded Samvero on a single, uncompromising thesis: Modern sales professionals, commercial agencies, and business development desks waste millions of hours on synthetic databases, outdated email lists, and dead prospects.
            </p>
          </div>

          {/* ── Corporate Office & Executive Workstation Visual Showcase ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center reveal">
            <div className="relative rounded-3xl overflow-hidden border border-[#0057FF]/30 shadow-[0_20px_60px_rgba(0,87,255,0.25)] group">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="Corporate Boardroom Strategy Meeting"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#0057FF]/80 text-white uppercase tracking-wider">
                  Executive Headquarters
                </span>
                <h3 className="text-lg font-bold text-white mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Global Corporate Deal Closings
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Empowering enterprise teams in North America, Europe, and the Middle East to convert high-ticket commercial contracts.
                </p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-[#00AAFF]/30 shadow-[0_20px_60px_rgba(0,170,255,0.2)] group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Tech Office Collaboration"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#00AAFF]/80 text-white uppercase tracking-wider">
                  Outbound Workstation
                </span>
                <h3 className="text-lg font-bold text-white mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Autonomous Data Engineering Desk
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Every commercial feed is audited for MX deliverability, SSL validity, and telecom registry accuracy.
                </p>
              </div>
            </div>
          </div>

          {/* ── Core Philosophy Grid ─────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Genuine Commercial Intent',
                desc: 'We discover businesses at the exact moment they post active commercial needs, renew public licenses, or seek agency partnerships. Zero cold guesswork.',
                color: '#0057FF',
              },
              {
                icon: ShieldCheck,
                title: 'Audited Provenance',
                desc: 'Every email address, phone line, and operational address is linked directly to primary evidence URLs and DNS mail-server probe logs.',
                color: '#10b981',
              },
              {
                icon: Globe2,
                title: 'Multi-Tenant Isolation',
                desc: 'Customer workspaces are completely isolated. Quotas, research history, custom lists, and prospecting notes are strictly private to each tenant.',
                color: '#00AAFF',
              },
            ].map((item, i) => {
              const IconComp = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-8 space-y-4 reveal bg-[#060b18]/90 border border-slate-800 hover:border-[#00AAFF]/40 transition shadow-lg group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}
                  >
                    <IconComp className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* ── Zero-Fabrication Guarantee ───────────────────────── */}
          <div className="rounded-3xl p-8 sm:p-14 relative overflow-hidden reveal bg-[#060b18]/95 border border-[#0057FF]/30 shadow-[0_0_80px_rgba(0,87,255,0.15)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial-gradient from-[#0057FF]/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase bg-[#0057FF]/15 border border-[#0057FF]/30 text-[#00AAFF]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Our Zero-Fabrication Guarantee</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl font-bold text-white mb-4 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Built on Audited Evidence, Never Assumptions
              </h2>
              
              <p className="text-sm leading-relaxed text-slate-300 max-w-3xl mb-8">
                Unlike generic scrapers that mass-generate synthetic inboxes, Samvero enforces rigorous multi-source validation at every step of the outbound discovery pipeline:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  'Real-time DNS & MX Mail Exchange Verification',
                  'ITU-T E.164 International Phone & WhatsApp Formatting',
                  'SSL & Mobile Responsiveness Audit on Live Domains',
                  'Strict Server-Side Lead Allocation & Quota Enforcement',
                  'Multi-Platform Cross-Reference Verification',
                  'Zero Synthetic or AI-Hallucinated Contact Records',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/signup"
                  className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0057FF] to-[#00AAFF] hover:brightness-110 text-white shadow-lg shadow-[#0057FF]/30 transition flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Apply for Membership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/pricing"
                  className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-[#00AAFF]/40 bg-slate-900/60 transition"
                >
                  View Packages & Quotas
                </Link>
              </div>
            </div>
          </div>

          {/* ── Stats KPI Row ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal">
            {[
              { num: '50K+', label: 'Verified Global Leads' },
              { num: '15+', label: 'Commercial Data Feeds' },
              { num: '98.4%', label: 'Deliverability Accuracy' },
              { num: '6', label: 'Subscription Tiers' },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-center bg-[#060b18]/80 border border-slate-800"
              >
                <div
                  className="text-3xl sm:text-4xl font-black mb-1 bg-gradient-to-r from-[#0057FF] to-[#00AAFF] bg-clip-text text-transparent"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {s.num}
                </div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
