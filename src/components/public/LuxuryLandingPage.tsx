'use client';

import React, { useState, useEffect, useRef } from 'react';
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

/* ── Starfield: 60 CSS-only twinkling stars ─────────────── */
function Starfield() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 2.5 + 0.5}px`,
    duration: `${Math.random() * 4 + 2}s`,
    delay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.7 + 0.1,
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
            width: s.width,
            height: s.width,
            opacity: s.opacity,
            '--duration': s.duration,
            '--delay': s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── Scroll-reveal hook ──────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function LuxuryLandingPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const isAnnual = billingCycle === 'annual';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useScrollReveal();

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

  /* Auto-rotate carousel */
  const features = [
    {
      icon: Search,
      title: 'Real Business Lead Discovery',
      desc: 'Search active companies across Google Maps, LinkedIn, Upwork, Bark and international business registers with zero fabricated records.',
    },
    {
      icon: Bot,
      title: 'Intelligent Business Research',
      desc: 'Deep autonomous website crawling, SSL detection, mobile responsiveness analysis, and company footprint extraction.',
    },
    {
      icon: MailCheck,
      title: 'Contact Information Enrichment',
      desc: 'Direct executive email extraction with deep DNS MX record validation and bounce reduction before outreach.',
    },
    {
      icon: Building2,
      title: 'Google Business Profile Research',
      desc: 'Extract genuine physical addresses, verified ratings, review velocity, established operational age, and direct place IDs.',
    },
    {
      icon: TrendingUp,
      title: 'Lead Qualification & Scoring',
      desc: 'Multi-factor explainable scoring calculating project relevance, budget availability, and digital revamp potential.',
    },
    {
      icon: Layers,
      title: 'Centralized Lead Management',
      desc: 'Full-featured CRM pipeline, segmented lead lists, CSV exports, and multi-channel outreach tracking.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

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
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#030712', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}
    >
      <PublicNavbar />

      <main className="flex-1">

        {/* ═══ 1. HERO SECTION ═══════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <Starfield />

          {/* Large ambient orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none animate-float"
            style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none animate-float-delayed"
            style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '3s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(0,51,204,0.04) 0%, transparent 60%)', filter: 'blur(100px)' }}
          />

          {/* 3D rotating rings */}
          <div
            className="absolute w-[700px] h-[700px] rounded-full pointer-events-none animate-spin-slow"
            style={{
              border: '1px solid rgba(0,87,255,0.08)',
              transform: 'rotateX(70deg)',
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none animate-spin-reverse"
            style={{
              border: '1px solid rgba(0,170,255,0.06)',
              transform: 'rotateX(70deg) rotateZ(45deg)',
            }}
          />

          {/* Scan line */}
          <div className="scan-line pointer-events-none" />

          {/* Hero content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-32 pb-24">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10 text-xs font-semibold tracking-widest uppercase animate-slide-down"
              style={{
                background: 'rgba(10,15,30,0.8)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0,170,255,0.3)',
                boxShadow: '0 0 20px rgba(0,87,255,0.2)',
                color: '#00AAFF',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#00AAFF', boxShadow: '0 0 8px #00AAFF' }}
              />
              AI-Powered Lead Intelligence Platform
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up"
              style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}
            >
              <span className="text-white">Find Your Next</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0057FF 0%, #00AAFF 50%, #0057FF 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 3s linear infinite',
                }}
              >
                Big Client
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
              style={{ color: '#94a3b8', animationDelay: '0.3s' }}
            >
              Verified leads from Google My Business, LinkedIn, Upwork & more.
              Real contacts. Real opportunities. Zero fabricated data.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Link
                href="/signup"
                className="btn-nasa"
              >
                <Zap className="w-4 h-4" />
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#pricing"
                className="px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
                style={{
                  color: '#94a3b8',
                  border: '1px solid rgba(100,116,139,0.3)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(0,87,255,0.5)';
                  el.style.color = '#fff';
                  el.style.background = 'rgba(0,87,255,0.08)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(100,116,139,0.3)';
                  el.style.color = '#94a3b8';
                  el.style.background = 'transparent';
                }}
              >
                Explore Packages
              </a>
            </div>

            {/* Social proof */}
            <div
              className="mt-14 flex items-center justify-center gap-8 flex-wrap animate-fade-in"
              style={{ animationDelay: '0.8s' }}
            >
              {[
                { label: '50K+', sub: 'Verified Leads' },
                { label: '15+', sub: 'Platforms' },
                { label: '98%', sub: 'Accuracy' },
                { label: '24/7', sub: 'Monitoring' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-2xl font-black"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {s.label}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#64748b' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview card */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 pointer-events-none"
            style={{ opacity: 0.7 }}
          >
            <div
              className="h-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #0057FF, #00AAFF, #0057FF, transparent)' }}
            />
          </div>
        </section>

        {/* ═══ 2. STATS SECTION ══════════════════════════════════ */}
        <section
          className="py-16"
          style={{ borderTop: '1px solid rgba(0,87,255,0.1)', borderBottom: '1px solid rgba(0,87,255,0.1)', background: 'rgba(10,15,30,0.4)' }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
            {[
              { num: '50K+', label: 'Verified Leads', icon: Search },
              { num: '15+', label: 'Data Platforms', icon: Globe2 },
              { num: '98%', label: 'Accuracy Rate', icon: ShieldCheck },
              { num: '24/7', label: 'Live Monitoring', icon: Zap },
            ].map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={i}
                  className="glass-card-hover rounded-2xl p-6 text-center reveal"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(0,87,255,0.1)', border: '1px solid rgba(0,87,255,0.2)' }}
                  >
                    <IconComp className="w-5 h-5" style={{ color: '#00AAFF' }} />
                  </div>
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
                    {stat.num}
                  </div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: '#64748b' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ 3. ANIMATED PIPELINE / GIF SECTION ═══════════════ */}
        <section className="py-24 relative overflow-hidden" style={{ background: '#030712' }}>
          <Starfield />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-14 reveal">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
              >
                <Zap className="w-3 h-3" /> Real-Time Data Pipeline
              </div>
              <h2
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Watch Leads Flow In Live
              </h2>
              <p style={{ color: '#64748b' }}>Automated discovery from every major platform, enriched & verified instantly.</p>
            </div>

            <div
              className="rounded-2xl overflow-hidden p-1 reveal"
              style={{
                background: 'rgba(10,15,30,0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0,87,255,0.25)',
                boxShadow: '0 0 60px rgba(0,87,255,0.15), 0 40px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-t-xl"
                style={{ background: 'rgba(10,15,30,0.9)', borderBottom: '1px solid rgba(0,87,255,0.1)' }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                <div
                  className="ml-4 flex items-center gap-2 px-4 py-1 rounded-md text-xs font-mono"
                  style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.15)', color: '#64748b' }}
                >
                  <Lock className="w-3 h-3" style={{ color: '#10b981' }} />
                  <span>samvero.com/app/pipeline</span>
                </div>
                <div
                  className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full animate-pulse"
                  style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  LIVE
                </div>
              </div>

              {/* GIF embed */}
              <div className="relative overflow-hidden" style={{ background: '#050d1a' }}>
                <img
                  src="https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
                  alt="Real-time data pipeline visualization"
                  className="w-full"
                  style={{ maxHeight: '380px', objectFit: 'cover', opacity: 0.9 }}
                />
                {/* Overlay grid */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,87,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,87,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                {/* Bottom fade */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.7), transparent)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 4. FEATURES CAROUSEL ══════════════════════════════ */}
        <section
          className="py-24 relative"
          style={{ background: 'rgba(10,15,30,0.5)', borderTop: '1px solid rgba(0,87,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14 reveal">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
              >
                <Sparkles className="w-3 h-3" /> Enterprise Features
              </div>
              <h2
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}
              >
                Everything You Need to Prospect with{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Certainty
                </span>
              </h2>
              <p style={{ color: '#64748b' }}>
                Built for commercial agencies, founders and outbound teams who demand verified contacts.
              </p>
            </div>

            {/* Auto-playing feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, i) => {
                const IconComp = feat.icon;
                const isActive = i === carouselIndex;
                return (
                  <div
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className="glass-card-hover rounded-2xl p-6 cursor-pointer reveal"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      border: isActive ? '1px solid rgba(0,170,255,0.4)' : '1px solid rgba(0,87,255,0.15)',
                      boxShadow: isActive ? '0 0 40px rgba(0,87,255,0.2), 0 20px 60px rgba(0,0,0,0.3)' : undefined,
                      transform: isActive ? 'translateY(-4px)' : undefined,
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all"
                      style={{
                        background: isActive ? 'rgba(0,87,255,0.2)' : 'rgba(0,87,255,0.08)',
                        border: `1px solid ${isActive ? 'rgba(0,170,255,0.4)' : 'rgba(0,87,255,0.15)'}`,
                        boxShadow: isActive ? '0 0 20px rgba(0,87,255,0.3)' : undefined,
                      }}
                    >
                      <IconComp
                        className="w-6 h-6"
                        style={{ color: isActive ? '#00AAFF' : '#0057FF' }}
                      />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {feat.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{feat.desc}</p>
                    {isActive && (
                      <div
                        className="mt-4 flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: '#00AAFF' }}
                      >
                        <Zap className="w-3 h-3" />
                        Active Feature
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Carousel dots */}
            <div className="flex justify-center gap-2 mt-8">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === carouselIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    background: i === carouselIndex
                      ? 'linear-gradient(90deg, #0057FF, #00AAFF)'
                      : 'rgba(0,87,255,0.2)',
                    border: i === carouselIndex ? 'none' : '1px solid rgba(0,87,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 5. HOW IT WORKS ═══════════════════════════════════ */}
        <section
          className="py-24 relative overflow-hidden"
          style={{ background: '#030712', borderTop: '1px solid rgba(0,87,255,0.08)' }}
        >
          <Starfield />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
              >
                <BarChart3 className="w-3 h-3" /> Transparent Workflow
              </div>
              <h2
                className="text-4xl font-bold mb-4 text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Four Steps to Active Prospecting
              </h2>
              <p style={{ color: '#64748b' }}>
                Simple, transparent, and verified onboarding process without hidden recurring auto-charges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Choose Your Plan',
                  desc: 'Select from our six configurable packages tailored to your lead volume, target geography, and feature requirements.',
                  icon: Sliders,
                },
                {
                  step: '02',
                  title: 'Submit Application',
                  desc: 'Complete the professional customer application. We generate your unique Application Reference ID for tracking.',
                  icon: FileSpreadsheet,
                },
                {
                  step: '03',
                  title: 'Complete Payment',
                  desc: 'Transfer via verified Bank Wire, Wise Direct, or corporate invoice. Our finance desk verifies your deposit.',
                  icon: Lock,
                },
                {
                  step: '04',
                  title: 'Access Your Dashboard',
                  desc: 'Instant account activation with full lead discovery, enrichment, and CRM capabilities from day one.',
                  icon: Zap,
                },
              ].map((step, i) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-6 relative reveal"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    {/* Connector line */}
                    {i < 3 && (
                      <div
                        className="hidden md:block absolute top-10 -right-3 w-6 h-px z-10"
                        style={{ background: 'linear-gradient(90deg, rgba(0,87,255,0.4), transparent)' }}
                      />
                    )}
                    <div
                      className="text-5xl font-black mb-4"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: 'linear-gradient(135deg, rgba(0,87,255,0.3), rgba(0,170,255,0.1))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {step.step}
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(0,87,255,0.1)', border: '1px solid rgba(0,87,255,0.2)' }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: '#00AAFF' }} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ 6. PRICING SECTION ════════════════════════════════ */}
        <section
          id="pricing"
          className="py-24 relative"
          style={{ background: 'rgba(10,15,30,0.5)', borderTop: '1px solid rgba(0,87,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14 reveal">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
              >
                <Sparkles className="w-3 h-3" /> Subscription Plans
              </div>
              <h2
                className="text-4xl font-bold mb-4 text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Choose Your Intelligence Package
              </h2>
              <p style={{ color: '#64748b' }}>
                Transparent pricing with no hidden auto-charges. Manual payment verified by our team.
              </p>
            </div>

            {/* Billing toggle */}
            <div className="flex justify-center mb-10">
              <div
                className="inline-flex rounded-xl p-1"
                style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(0,87,255,0.15)' }}
              >
                {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 capitalize"
                    style={{
                      background: billingCycle === cycle ? 'linear-gradient(135deg, #0057FF, #0033CC)' : 'transparent',
                      color: billingCycle === cycle ? '#fff' : '#94a3b8',
                      boxShadow: billingCycle === cycle ? '0 0 20px rgba(0,87,255,0.3)' : undefined,
                    }}
                  >
                    {cycle === 'annual' ? 'Annual (Save 20%)' : 'Monthly'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Cards */}
            {loadingPlans ? (
              <div className="flex justify-center py-16">
                <div
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: '#0057FF', borderTopColor: 'transparent' }}
                />
              </div>
            ) : plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan: any, i) => {
                  const price =
                    billingCycle === 'annual'
                      ? (plan.prices?.annual ?? plan.annualPrice ?? (plan.prices?.monthly ? plan.prices.monthly * 10 : 0))
                      : (plan.prices?.monthly ?? plan.monthlyPrice ?? 0);
                  const isPopular = plan.name?.toLowerCase().includes('standard') || plan.isPopular;
                  return (
                    <div
                      key={plan.id || i}
                      className="glass-card rounded-2xl p-6 reveal relative flex flex-col"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        border: isPopular ? '1px solid rgba(0,170,255,0.4)' : '1px solid rgba(0,87,255,0.15)',
                        boxShadow: isPopular ? '0 0 40px rgba(0,87,255,0.2)' : undefined,
                      }}
                    >
                      {isPopular && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                            color: '#fff',
                            boxShadow: '0 0 20px rgba(0,87,255,0.4)',
                          }}
                        >
                          Most Popular
                        </div>
                      )}

                      <div className="mb-4">
                        <h3
                          className="text-lg font-bold text-white mb-1"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {plan.name}
                        </h3>
                        <p className="text-xs" style={{ color: '#64748b' }}>{plan.description}</p>
                      </div>

                      <div className="mb-6">
                        <span
                          className="text-4xl font-black"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          ${price ?? '—'}
                        </span>
                        <span className="text-sm ml-1" style={{ color: '#475569' }}>
                          /{billingCycle === 'annual' ? 'yr' : 'mo'}
                        </span>
                      </div>

                      <ul className="space-y-2.5 mb-6 flex-1">
                        {(plan.features ?? []).slice(0, 6).map((feat: string, fi: number) => (
                          <li key={fi} className="flex items-start gap-2 text-xs" style={{ color: '#94a3b8' }}>
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/signup?plan=${plan.id}&cycle=${billingCycle}`}
                        className="w-full text-center py-3 rounded-xl text-sm font-bold transition-all duration-300"
                        style={{
                          background: isPopular ? 'linear-gradient(135deg, #0057FF, #0033CC)' : 'rgba(0,87,255,0.08)',
                          border: `1px solid ${isPopular ? 'rgba(0,170,255,0.4)' : 'rgba(0,87,255,0.2)'}`,
                          color: '#fff',
                          boxShadow: isPopular ? '0 0 20px rgba(0,87,255,0.3)' : undefined,
                        }}
                      >
                        Apply for Plan
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Fallback static plans */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Starter', price: billingCycle === 'annual' ? 149 : 19, leads: '750', popular: false },
                  { name: 'Standard', price: billingCycle === 'annual' ? 399 : 49, leads: '2,500', popular: true },
                  { name: 'Professional', price: billingCycle === 'annual' ? 999 : 129, leads: '7,500', popular: false },
                ].map((plan, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-6 reveal relative flex flex-col"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      border: plan.popular ? '1px solid rgba(0,170,255,0.4)' : '1px solid rgba(0,87,255,0.15)',
                      boxShadow: plan.popular ? '0 0 40px rgba(0,87,255,0.2)' : undefined,
                    }}
                  >
                    {plan.popular && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #0057FF, #00AAFF)', color: '#fff' }}
                      >
                        Most Popular
                      </div>
                    )}
                    <h3
                      className="text-lg font-bold text-white mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span
                        className="text-4xl font-black"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        ${plan.price}
                      </span>
                      <span className="text-sm ml-1" style={{ color: '#475569' }}>
                        /{billingCycle === 'annual' ? 'yr' : 'mo'}
                      </span>
                    </div>
                    <ul className="space-y-2 mb-6 flex-1 text-xs" style={{ color: '#94a3b8' }}>
                      {[
                        `${plan.leads} Verified Leads`,
                        'Multi-Platform Discovery',
                        'Email & Phone Enrichment',
                        'Lead Management CRM',
                        'CSV Export',
                      ].map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#10b981' }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/signup"
                      className="w-full text-center py-3 rounded-xl text-sm font-bold text-white"
                      style={{
                        background: plan.popular ? 'linear-gradient(135deg, #0057FF, #0033CC)' : 'rgba(0,87,255,0.08)',
                        border: `1px solid ${plan.popular ? 'rgba(0,170,255,0.4)' : 'rgba(0,87,255,0.2)'}`,
                        boxShadow: plan.popular ? '0 0 20px rgba(0,87,255,0.3)' : undefined,
                      }}
                    >
                      Apply for Plan
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══ 7. TRUST / WHY SAMVERO ════════════════════════════ */}
        <section
          className="py-24 relative overflow-hidden"
          style={{ background: '#030712', borderTop: '1px solid rgba(0,87,255,0.08)' }}
        >
          <Starfield />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-14 reveal">
              <h2
                className="text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Why Teams Trust{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Samvero
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Primary Evidence Provenance',
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
                <div
                  key={idx}
                  className="glass-card-hover rounded-2xl p-6 flex gap-4 items-start reveal"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs font-mono"
                    style={{
                      background: 'rgba(0,87,255,0.1)',
                      border: '1px solid rgba(0,87,255,0.2)',
                      color: '#00AAFF',
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 8. FAQ SECTION ════════════════════════════════════ */}
        <section
          className="py-24 relative"
          style={{ background: 'rgba(10,15,30,0.5)', borderTop: '1px solid rgba(0,87,255,0.08)' }}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-14 reveal">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
              >
                <HelpCircle className="w-3 h-3" /> FAQ
              </div>
              <h2
                className="text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Questions & Answers
              </h2>
              <p style={{ color: '#64748b' }}>
                Everything you need to know about our subscription platform and manual payment workflow.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden transition-all duration-300 reveal"
                    style={{
                      background: isOpen ? 'rgba(0,87,255,0.05)' : 'rgba(10,15,30,0.6)',
                      border: isOpen ? '1px solid rgba(0,170,255,0.3)' : '1px solid rgba(0,87,255,0.1)',
                      backdropFilter: 'blur(16px)',
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 transition-all"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown
                        className="w-4 h-4 shrink-0 transition-transform duration-300"
                        style={{
                          color: isOpen ? '#00AAFF' : '#475569',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div
                        className="px-5 pb-5 pt-1 text-xs leading-relaxed animate-slide-down"
                        style={{ color: '#64748b', borderTop: '1px solid rgba(0,87,255,0.1)' }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ 9. FINAL CTA ══════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden" style={{ background: '#030712' }}>
          <Starfield />

          {/* Large center orb */}
          <div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.08) 0%, transparent 60%)', filter: 'blur(80px)' }}
          />

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <div
              className="glass-card neon-border rounded-3xl p-12 md:p-16 reveal"
              style={{ background: 'rgba(10,15,30,0.7)' }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,87,255,0.1)', border: '1px solid rgba(0,87,255,0.3)', color: '#00AAFF' }}
              >
                <Zap className="w-3 h-3 animate-pulse" /> Ready to Launch
              </div>
              <h2
                className="text-4xl sm:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}
              >
                Ready to Find Your Next{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Business Opportunity?
                </span>
              </h2>
              <p className="text-base mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#64748b' }}>
                Join leading commercial agencies and sales professionals using Samvero for verified,
                evidence-backed lead intelligence.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/signup" className="btn-nasa text-sm">
                  <Zap className="w-4 h-4" />
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-4 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    color: '#94a3b8',
                    border: '1px solid rgba(100,116,139,0.3)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(0,87,255,0.5)';
                    el.style.color = '#fff';
                    el.style.background = 'rgba(0,87,255,0.08)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(100,116,139,0.3)';
                    el.style.color = '#94a3b8';
                    el.style.background = 'transparent';
                  }}
                >
                  View All Plans
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
