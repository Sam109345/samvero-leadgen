'use client';

import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { ShieldCheck, Target, CheckCircle2, Award, Users, Globe2, ArrowRight, Zap, Sparkles } from 'lucide-react';

function Stars({ count = 50 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 0.5}px`,
    duration: `${Math.random() * 4 + 2}s`,
    delay: `${Math.random() * 5}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, '--duration': s.duration, '--delay': s.delay } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#030712', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}
    >
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <Stars />
        {/* Ambient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none animate-float-delayed"
          style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <div className="max-w-5xl mx-auto px-6 space-y-20 relative z-10">

          {/* ── Hero Header ─────────────────────────────────────── */}
          <div className="text-center max-w-3xl mx-auto reveal">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
            >
              <Sparkles className="w-3 h-3" /> About Samvero
            </div>
            <h1
              className="text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}
            >
              Engineering True{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Lead Intelligence
              </span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#64748b' }}>
              We founded Samvero on a single, uncompromising thesis: Modern sales professionals and commercial agencies
              waste millions of hours on synthetic databases, outdated email lists, and dead prospects.
            </p>
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
                  className="glass-card-hover rounded-2xl p-8 space-y-4 reveal"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                  >
                    <IconComp className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* ── Mission Statement ─────────────────────────────────── */}
          <div
            className="rounded-3xl p-10 sm:p-14 relative overflow-hidden reveal"
            style={{
              background: 'rgba(10,15,30,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,87,255,0.2)',
              boxShadow: '0 0 60px rgba(0,87,255,0.08)',
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />

            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
              >
                <ShieldCheck className="w-3 h-3" /> Our Zero-Fabrication Guarantee
              </div>
              <h2
                className="text-3xl font-bold text-white mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Built on Verified Data, Not Assumptions
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                Unlike generic scrapers that mass-generate synthetic corporate inboxes, Samvero enforces rigorous
                multi-source validation at every step of the discovery pipeline:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  'Real-time DNS & MX Mail Exchange Verification',
                  'ITU-T E.164 International Phone Formatting',
                  'SSL & Mobile Responsiveness Audit on Live Domains',
                  'Strict Server-Side Lead Allocation & Quota Enforcement',
                  'Multi-Platform Cross-Reference Validation',
                  'Zero Synthetic or AI-Generated Contact Data',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs" style={{ color: '#94a3b8' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#10b981' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 flex-wrap">
                <Link href="/signup" className="btn-nasa text-xs">
                  <Zap className="w-4 h-4" />
                  Apply for Membership
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-6 py-3 rounded-xl text-xs font-bold transition-all"
                  style={{
                    color: '#94a3b8',
                    border: '1px solid rgba(0,87,255,0.2)',
                    background: 'rgba(0,87,255,0.05)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = '#fff';
                    el.style.borderColor = 'rgba(0,170,255,0.4)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = '#94a3b8';
                    el.style.borderColor = 'rgba(0,87,255,0.2)';
                  }}
                >
                  View Packages
                </Link>
              </div>
            </div>
          </div>

          {/* ── Stats Row ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal">
            {[
              { num: '50K+', label: 'Verified Leads' },
              { num: '15+', label: 'Data Platforms' },
              { num: '98%', label: 'Contact Accuracy' },
              { num: '6', label: 'Subscription Tiers' },
            ].map((s, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="text-3xl font-black mb-1"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.num}
                </div>
                <div className="text-xs uppercase tracking-widest" style={{ color: '#475569' }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
