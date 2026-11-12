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
  MessageCircle,
  ExternalLink,
  Radar,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';

/* ── Twinkling Starfield Dust ────────────────────────────── */
function Starfield({ count = 45 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 2 + 0.8}px`,
    duration: `${Math.random() * 4 + 3}s`,
    delay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.7 + 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
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

/* ── Live Mock Leads Data for CRM Walk-In Center ─────────── */
interface MockLead {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  platform: 'Google My Business' | 'Upwork Radar' | 'LinkedIn Live' | 'Freelancer.com' | 'Bark Direct';
  phone: string;
  whatsapp: string;
  tag: string;
  tagColor: string;
  budget: string;
  score: number;
  contactName: string;
  verifiedEmail: string;
}

const CRM_LIVE_LEADS: MockLead[] = [
  {
    id: 'lead-1',
    title: 'Jebel Ali Commercial Complex',
    company: 'Jebel Ali Retail & Logistics LLC',
    location: 'Dubai Marina & JAFZA, UAE',
    country: 'UAE',
    platform: 'Google My Business',
    phone: '+971 4 883 2222',
    whatsapp: 'Direct Available',
    tag: 'Missing Responsive Site (Hot Pitch)',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    budget: '$1,200 - $3,500',
    score: 98,
    contactName: 'Tariq Al-Mansoor (Director)',
    verifiedEmail: 'info@jebelali-retail.ae',
  },
  {
    id: 'lead-2',
    title: 'Apex Dental & Implant Care Center',
    company: 'Apex Precision Health Group',
    location: 'Austin, TX, United States',
    country: 'USA',
    platform: 'Google My Business',
    phone: '+1 512 555 0194',
    whatsapp: 'Validated Mobile',
    tag: 'Newly Opened • Zero Yelp Reviews',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    budget: '$2,500 - $4,800',
    score: 96,
    contactName: 'Dr. Marcus Vance (Owner)',
    verifiedEmail: 'contact@apexdentalcare.com',
  },
  {
    id: 'lead-3',
    title: 'FinTech Mobile App Enterprise Rebuild',
    company: 'Nova Capital London Ltd',
    location: 'Canary Wharf, London, UK',
    country: 'UK',
    platform: 'Freelancer.com',
    phone: '+44 20 7946 0912',
    whatsapp: 'Direct Verified',
    tag: 'Verified Client (4.9★ • £120k Spent)',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    budget: '£3,500 - £7,000',
    score: 99,
    contactName: 'Eleanor Smith (Product Lead)',
    verifiedEmail: 'esmith@novacapital.co.uk',
  },
  {
    id: 'lead-4',
    title: 'EuroTrans Logistics Multi-Modal Portal',
    company: 'EuroTrans Spedition GmbH',
    location: 'Munich, Bavaria, Germany',
    country: 'Germany',
    platform: 'Upwork Radar',
    phone: '+49 89 2018 4401',
    whatsapp: 'Available (EU Data)',
    tag: 'Legacy PHP 5.4 Detected • Needs Modern Next.js',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    budget: '€4,000 - €9,000',
    score: 94,
    contactName: 'Klaus Webber (Operations VP)',
    verifiedEmail: 'klaus.webber@eurotrans-muc.de',
  },
  {
    id: 'lead-5',
    title: 'Prestige Architecture & Interior Design',
    company: 'Prestige Living Studios',
    location: 'Lahore & Islamabad, Pakistan',
    country: 'Pakistan',
    platform: 'LinkedIn Live',
    phone: '+92 42 3578 9910',
    whatsapp: 'Direct Active',
    tag: 'Commercial Portfolio Expansion',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    budget: '₨ 350,000 - ₨ 750,000',
    score: 92,
    contactName: 'Zainab Qureshi (Principal)',
    verifiedEmail: 'studio@prestigeliving.pk',
  },
  {
    id: 'lead-6',
    title: 'Skyline Luxury Properties Outbound Feed',
    company: 'Skyline Real Estate Palm Jumeirah',
    location: 'Dubai, UAE',
    country: 'UAE',
    platform: 'Bark Direct',
    phone: '+971 50 123 4567',
    whatsapp: 'Direct WhatsApp',
    tag: 'Urgent Lead Acquisition',
    tagColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    budget: '$3,000 - $6,500',
    score: 97,
    contactName: 'Farhan Siddiqui (Head of BD)',
    verifiedEmail: 'fsiddiqui@skylinedubai.ae',
  },
];

/* ── Multi-Currency Support (Screenshot 5 Match) ─────────── */
type CurrencyType = 'PKR' | 'USD' | 'AED' | 'GBP' | 'EUR';

interface CurrencyRate {
  symbol: string;
  rateToPkr: number;
}

const CURRENCY_MAP: Record<CurrencyType, CurrencyRate> = {
  PKR: { symbol: '₨', rateToPkr: 1 },
  USD: { symbol: '$', rateToPkr: 278 },
  AED: { symbol: 'AED ', rateToPkr: 75.7 },
  GBP: { symbol: '£', rateToPkr: 352 },
  EUR: { symbol: '€', rateToPkr: 302 },
};

export default function LuxuryLandingPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [pricingCurrency, setPricingCurrency] = useState<CurrencyType>('USD');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  /* Walk-In Command Center State */
  const [isWalkedIn, setIsWalkedIn] = useState(false);
  const [activePlatformFilter, setActivePlatformFilter] = useState<string>('All Sources');
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);

  /* Ref for 3D Walk-In stage and performance scroll */
  const walkinStageRef = useRef<HTMLDivElement>(null);
  const walkinCardRef = useRef<HTMLDivElement>(null);

  /* Fetch backend plans */
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

  /* ── 60FPS Buttery-Smooth Scroll Walk-In Controller (ZERO React re-renders) ── */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (walkinCardRef.current && !isWalkedIn) {
            const rect = walkinCardRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress: 0 when banner enters view, 1 when centered
            const progress = Math.min(
              Math.max((windowHeight - rect.top) / (windowHeight * 0.85), 0),
              1
            );

            // Smoothly decrease tilt from 22deg to 0deg and scale from 0.86 to 1.0
            const currentTilt = (22 * (1 - progress * 0.9)).toFixed(2);
            const currentScale = (0.86 + progress * 0.14).toFixed(3);
            const currentY = (60 * (1 - progress)).toFixed(1);

            walkinCardRef.current.style.transform = `perspective(1600px) rotateX(${currentTilt}deg) scale(${currentScale}) translateY(${currentY}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isWalkedIn]);

  /* Filter live leads in command center */
  const filteredLeads = CRM_LIVE_LEADS.filter((lead) => {
    const matchesPlatform =
      activePlatformFilter === 'All Sources' ||
      lead.platform.toLowerCase().includes(activePlatformFilter.toLowerCase().replace(' gmb', '').replace(' radar', '').replace(' direct', '').replace(' live', ''));
    
    const matchesSearch =
      leadSearchQuery === '' ||
      lead.title.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      lead.tag.toLowerCase().includes(leadSearchQuery.toLowerCase());

    return matchesPlatform && matchesSearch;
  });

  const handleCopyLead = (id: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedLeadId(id);
    setTimeout(() => setCopiedLeadId(null), 2000);
  };

  /* Helper to format price for currency */
  const formatPrice = (pkrBase: number) => {
    const cur = CURRENCY_MAP[pricingCurrency];
    const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1;
    const finalAmount = Math.round((pkrBase * discountMultiplier) / cur.rateToPkr);
    return `${cur.symbol}${finalAmount.toLocaleString()}`;
  };

  const faqs = [
    {
      q: 'How does the Samvero Lead Intelligence Platform work?',
      a: 'Samvero combines automated real-data discovery connectors with multi-source contact enrichment. It tracks live commercial leads across Google Business Profiles, LinkedIn, Upwork, Bark, and international registers. Discovered businesses undergo automated domain checks, DNS/MX mail server validation, and ITU telephone verification before entering your private dashboard.',
    },
    {
      q: 'How do I purchase a package and activate my account?',
      a: 'Select your preferred subscription package and click "Apply for Plan". Submit your requirements and contact details. Once submitted, our team reviews your application and provides direct manual payment instructions via Bank Wire, Wise Direct, or corporate invoice for instant entitlement assignment.',
    },
    {
      q: 'How many leads do I receive each month?',
      a: 'Lead allowance depends on your package: Starter Prospector (500 leads), Growth Agency Pro (1,500 leads), or Enterprise Desk (5,000+ leads). All leads feature primary contact evidence, direct validated phone numbers, and WhatsApp web click-to-chat capabilities.',
    },
    {
      q: 'Can I upgrade my plan or change currencies at any time?',
      a: 'Yes. You can request a plan upgrade or currency adjustment anytime directly through your customer portal or by contacting your dedicated account manager. New lead quotas are added immediately upon manual confirmation.',
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[#05020c] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden relative"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <PublicNavbar />

      <main className="flex-1">

        {/* ═══════════════════════════════════════════════════════
            1. HERO SECTION: PORTAL TO THE FUTURE + CRM WALK-IN
            ═══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-24 overflow-hidden">
          
          {/* Cosmic Space Background Dust & Starfield */}
          <Starfield count={50} />

          {/* Scale AI 3D Prismatic Glass Torus Rings (Screenshot 3 Match) */}
          <div
            className="absolute top-28 -left-20 w-72 h-72 torus-ring-iridescent pointer-events-none opacity-60 hidden md:block"
            style={{ transform: 'rotate(25deg) rotateX(45deg)' }}
          />
          <div
            className="absolute top-48 -right-24 w-80 h-80 torus-ring-iridescent pointer-events-none opacity-50 hidden md:block"
            style={{ transform: 'rotate(-30deg) rotateX(55deg)' }}
          />

          {/* OrbitAI Angled Spotlight Beam (Screenshot 4 Match) */}
          <div className="orbit-spotlight-beam top-0 left-10 pointer-events-none" />

          {/* Ambient Cosmic Horizon Nebulas */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none" />

          {/* Hero Header Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6 mb-8">
            
            {/* Pill Badge: Portal To The Future */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/15 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.25)] text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Next-Gen Outbound Intelligence • Portal 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            {/* Main Headline: Bold, Cinematic Space Grotesk */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Step Into The Future Of <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
                High-Ticket Lead Discovery
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
              Autonomous multi-platform radar crawling Google Maps, Upwork, LinkedIn and international registers with 100% verified emails, validated mobile numbers, and direct WhatsApp pitching.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className="glass-pill-btn px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-[0_10px_35px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_45px_rgba(168,85,247,0.6)] transition"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              {/* Interactive Walk-In Camera Toggle Button */}
              <button
                type="button"
                onClick={() => setIsWalkedIn(!isWalkedIn)}
                className="px-6 py-3.5 rounded-full font-semibold text-sm bg-white/[0.05] hover:bg-white/[0.1] text-purple-200 border border-white/20 hover:border-purple-400/50 backdrop-blur-md transition flex items-center gap-2"
              >
                {isWalkedIn ? (
                  <>
                    <Minimize2 className="w-4 h-4 text-purple-400" />
                    <span>Exit Walk-In View</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-cyan-400" />
                    <span>Step Inside CRM (Walk-In View)</span>
                  </>
                )}
              </button>

              <a
                href="#pricing"
                className="px-6 py-3.5 rounded-full font-semibold text-sm text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition"
              >
                View Plans
              </a>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              THE PORTAL TO THE FUTURE HORIZON GLOW & CRM STAGE
              (Screenshot 2 & Webflow Reference Match)
              ═══════════════════════════════════════════════════════ */}
          <div
            ref={walkinStageRef}
            className="w-full max-w-6xl mx-auto px-3 sm:px-6 relative z-20 crm-walkin-stage mt-6 sm:mt-10"
          >
            {/* The Cosmic Horizon Glowing Eclipse Arc (Screenshot 2 Match) */}
            <div className="portal-horizon-arc -top-16" />
            <div className="portal-horizon-line top-10" />

            {/* 3D CRM Window Shell */}
            <div
              ref={walkinCardRef}
              className={`crm-walkin-card ${isWalkedIn ? 'walked-in' : ''} rounded-[2rem] sm:rounded-[2.5rem] p-2.5 sm:p-4 relative bg-[#090514]/90 border border-purple-500/30 backdrop-blur-3xl shadow-[0_30px_120px_rgba(112,0,255,0.45),0_0_60px_rgba(0,170,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]`}
            >
              {/* Downward Volumetric Horizon Reflection Highlight */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-purple-500/15 via-cyan-500/5 to-transparent rounded-t-[2.5rem] pointer-events-none" />

              {/* CRM Top Chrome Bar */}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#06030e]/95 border border-white/10 mb-3 relative z-10">
                {/* Traffic Lights */}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  
                  {/* Address Pill */}
                  <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/10">
                    <Lock className="w-3 h-3 text-purple-400" />
                    <span>samvero.live/mission-control/active-leads</span>
                  </span>
                </div>

                {/* Live Sync Status */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>RADAR ACTIVE • 10s PING</span>
                  </span>
                  <span className="text-[11px] font-mono text-purple-300 hidden md:inline">
                    50,000+ VERIFIED LEADS
                  </span>
                </div>
              </div>

              {/* CRM Live Feed Navigation Tabs (Foxley / Tuesday / Huly style) */}
              <div className="flex items-center justify-between gap-3 mb-3 px-1 flex-wrap relative z-10">
                {/* Platform Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    'All Sources',
                    'Google Maps GMB',
                    'Upwork Radar',
                    'LinkedIn Live',
                    'Freelancer.com',
                    'Bark Direct',
                  ].map((tab) => {
                    const active = activePlatformFilter === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActivePlatformFilter(tab)}
                        className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                          active
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40'
                            : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Search Input */}
                <div className="relative min-w-[220px] max-w-xs flex-1">
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Search leads, cities, niches..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-luxury-input text-xs text-white placeholder-slate-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* CRM Live Lead Cards Stream */}
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 relative z-10">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-2xl bg-[#0e091e]/90 border border-white/10 hover:border-purple-400/40 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-sm hover:shadow-[0_4px_25px_rgba(168,85,247,0.15)]"
                  >
                    {/* Lead Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm tracking-tight">{lead.title}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {lead.platform}
                        </span>
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${lead.tagColor}`}>
                          {lead.tag}
                        </span>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {lead.score}% Score
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          📍 {lead.location}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-slate-300">
                          📞 {lead.phone}
                        </span>
                        <span className="flex items-center gap-1 text-purple-300">
                          ✉️ {lead.verifiedEmail}
                        </span>
                      </div>
                    </div>

                    {/* Action Hub */}
                    <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                      <span className="font-mono font-bold text-cyan-300 text-sm px-2">
                        {lead.budget}
                      </span>

                      {/* Copy / Direct Action */}
                      <button
                        type="button"
                        onClick={() => handleCopyLead(lead.id, lead.phone)}
                        className="px-3 py-1.5 rounded-xl font-medium text-[11px] bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 border border-white/15 transition flex items-center gap-1.5"
                      >
                        {copiedLeadId === lead.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp Pitch</span>
                          </>
                        )}
                      </button>

                      <Link
                        href="/signup"
                        className="px-3.5 py-1.5 rounded-xl font-semibold text-[11px] glass-pill-btn flex items-center gap-1 text-white"
                      >
                        <span>Claim Lead</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CRM Telemetry Status Bar (DevMilosh / Huly style) */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 px-2 flex-wrap gap-2">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-emerald-400">● 15 CRAWL ENGINES ONLINE</span>
                  <span className="hidden sm:inline">LATENCY: 14ms</span>
                  <span className="hidden md:inline">MX ACCURACY: 99.8%</span>
                </div>
                <div className="font-mono text-purple-300">
                  PRESS <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">/</kbd> TO SEARCH LEADS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. DEV-MILOSH / HULY TELEMETRY TICKER
            ═══════════════════════════════════════════════════════ */}
        <section className="py-4 border-y border-white/10 bg-[#070312]/80 backdrop-blur-md overflow-hidden select-none">
          <div className="animate-marquee flex items-center gap-12 font-mono text-xs text-purple-300/80">
            <span>[RADAR-GMB: 142 VERIFIED INGESTED]</span>
            <span>✦</span>
            <span>[UPWORK-RADAR: 89 COMMERCIAL FEEDS]</span>
            <span>✦</span>
            <span>[LINKEDIN-LIVE: 112 PROFILES VERIFIED]</span>
            <span>✦</span>
            <span>[MX-DNS VALIDATION: 99.8% BOUNCE REDUCTION]</span>
            <span>✦</span>
            <span>[DUBAI COMMERCIAL RADAR: ACTIVE]</span>
            <span>✦</span>
            <span>[LONDON FINTECH DISCOVERY: 34 NEW LEADS]</span>
            <span>✦</span>
            <span>[ZERO FABRICATED RECORDS AUDITED]</span>
            <span>✦</span>
            <span>[RADAR-GMB: 142 VERIFIED INGESTED]</span>
            <span>✦</span>
            <span>[UPWORK-RADAR: 89 COMMERCIAL FEEDS]</span>
            <span>✦</span>
            <span>[LINKEDIN-LIVE: 112 PROFILES VERIFIED]</span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            3. 4-PILLAR INTELLIGENCE ARCHITECTURE (Tuesday / Neurix style)
            ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden bg-[#05020c]">
          <Starfield count={30} />
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/15 text-purple-300 mb-4">
                <Radar className="w-3.5 h-3.5 text-purple-400" />
                <span>Autonomous Intelligence Stack</span>
              </span>
              <h2
                className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Engineered for Agencies That Close
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                Four autonomous layers turning public commercial data into verified, high-converting client conversations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Multi-Source Radar',
                  desc: 'Autonomous crawling across Google Maps GMB, Upwork, LinkedIn, and registers without API bans or rate limits.',
                  icon: Globe2,
                  stat: '15+ Connectors',
                },
                {
                  step: '02',
                  title: 'Deep MX & Phone Audit',
                  desc: 'Every business domain undergoes DNS MX checks, disposable mail rejection, and ITU telecom validation.',
                  icon: ShieldCheck,
                  stat: '98% Accuracy',
                },
                {
                  step: '03',
                  title: 'Instant Outreach Studio',
                  desc: '1-click WhatsApp Web chat launches and pre-warmed Gmail outreach templates ready in 5 seconds.',
                  icon: MessageCircle,
                  stat: '1-Click Launch',
                },
                {
                  step: '04',
                  title: 'AI Proposal Generator',
                  desc: 'Auto-generate tailored pitch scripts, Website Rebuild mockups, and client proposals that convert.',
                  icon: Bot,
                  stat: 'High-Ticket SOW',
                },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-[2rem] glass-luxury-card relative overflow-hidden flex flex-col justify-between hover:border-purple-400/40 transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-mono font-bold text-purple-400/60 group-hover:text-purple-300 transition">
                          {item.step}
                        </span>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20 text-purple-300 group-hover:scale-110 transition">
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-purple-300 font-semibold">
                      {item.stat}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            4. PRICING SECTION: FROSTED GLASS CARDS WITH 3D ORBS
            (Screenshot 5 Match `media_1794487183634_5931994c.png`)
            ═══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 relative overflow-hidden bg-[#06030e] smooth-scroll-perf">
          
          {/* Screenshot 5 Colorful 3D Glowing Spheres Floating Behind Translucent Glass Cards */}
          <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-500/40 via-orange-600/30 to-amber-300/20 blur-[90px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/40 via-purple-600/30 to-cyan-400/20 blur-[110px] pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/40 via-teal-600/30 to-cyan-400/20 blur-[90px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/15 text-purple-300 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Plans & Pricing</span>
              </span>
              <h2
                className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Choose Your Plan
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                Transparent multi-currency access. No hidden auto-charges. Verified manually by our finance desk.
              </p>
            </div>

            {/* Currency Selector Bar & Billing Cycle Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              
              {/* Currency Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl">
                {(['USD', 'PKR', 'AED', 'GBP', 'EUR'] as CurrencyType[]).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setPricingCurrency(cur)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      pricingCurrency === cur
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>

              {/* Billing Cycle (Monthly / Annual 20% off) */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1 rounded-full text-xs font-semibold transition ${
                    billingCycle === 'monthly'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-1 rounded-full text-xs font-semibold transition ${
                    billingCycle === 'annual'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Annual (Save 20%)
                </button>
              </div>
            </div>

            {/* The 3 Ultra-Translucent Glass Cards (Screenshot 5 Match) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* 1. Basic / Starter Plan (Amber Pill) */}
              <div className="rounded-[2.5rem] p-7 glass-luxury-container relative flex flex-col justify-between border border-white/20 hover:border-amber-400/40 transition">
                <div>
                  <div className="mb-5">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
                      Basic Plan
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Starter Prospector
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ideal for independent freelancers and boutique agencies.
                    </p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {formatPrice(5000)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        /{billingCycle === 'annual' ? 'mo (billed yr)' : 'mo'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    {[
                      '500 Verified Multi-Platform Leads / mo',
                      'Direct Validated Phone & WhatsApp',
                      'Google Maps GMB Radar Access',
                      '1-Click WhatsApp Pitch Generator',
                      'Private Saved Leads Management',
                      'Daily Fresh Lead Ingestion',
                    ].map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/signup?plan=starter&cycle=${billingCycle}`}
                  className="w-full py-3.5 rounded-full text-center font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 transition"
                >
                  Get Started
                </Link>
              </div>

              {/* 2. Standard / Growth Agency Plan (Blue / Violet Pill - Featured) */}
              <div className="rounded-[2.5rem] p-7 glass-luxury-container relative flex flex-col justify-between border-2 border-purple-500/50 shadow-[0_20px_70px_rgba(168,85,247,0.35)] transform md:-translate-y-3">
                {/* Popular Pill */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/40 border border-purple-300/40">
                  Most Popular
                </div>

                <div>
                  <div className="mb-5 mt-1">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40 mb-3">
                      Standard Plan
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Growth Agency Pro
                    </h3>
                    <p className="text-xs text-slate-400">
                      For fast-growing agencies closing foreign high-ticket clients.
                    </p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {formatPrice(12000)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        /{billingCycle === 'annual' ? 'mo (billed yr)' : 'mo'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    {[
                      '1,500 Verified Leads / month across 15+ feeds',
                      'Upwork, Contra & Freelancer.com Direct Feeds',
                      'Automated Scope of Work (SOW) Deliverable Studio',
                      'Multi-Channel Inbound Client Chat Inbox',
                      'Voice Note Pitching & Luxury PDF Proposals',
                      'CSV & Excel Export Center',
                      'Priority Technical Support 24/7',
                    ].map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/signup?plan=standard&cycle=${billingCycle}`}
                  className="w-full py-3.5 rounded-full text-center font-bold text-xs glass-pill-btn shadow-lg shadow-purple-600/40 transition"
                >
                  Get Started
                </Link>
              </div>

              {/* 3. Premium / Enterprise Plan (Green Pill) */}
              <div className="rounded-[2.5rem] p-7 glass-luxury-container relative flex flex-col justify-between border border-white/20 hover:border-emerald-400/40 transition">
                <div>
                  <div className="mb-5">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-3">
                      Premium Plan
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Enterprise Acquisition Desk
                    </h3>
                    <p className="text-xs text-slate-400">
                      Comprehensive prospecting for full BD sales teams.
                    </p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {formatPrice(25000)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        /{billingCycle === 'annual' ? 'mo (billed yr)' : 'mo'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    {[
                      '5,000 Verified Leads / month (Zero Duplication)',
                      'Custom Territory Ingestion (Dubai, US, UK, EU)',
                      'Full White-Label Proposals & Presentations',
                      'Dedicated Outreach Campaign Director',
                      'Multi-Seat Team Access & Role Delegation',
                      'Direct Database Sync & API Webhooks',
                      '24/7 Dedicated Account Manager',
                    ].map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/signup?plan=enterprise&cycle=${billingCycle}`}
                  className="w-full py-3.5 rounded-full text-center font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition"
                >
                  Get Started
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            5. FAQ ACCORDION SECTION
            ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden bg-[#05020c] border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/15 text-purple-300 mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Frequently Asked Questions</span>
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Questions & Answers
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Everything you need to know about our subscription and lead delivery guarantees.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden glass-luxury-card border border-white/10 transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 transition"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-purple-400' : 'text-slate-500'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            6. FINAL CALL TO ACTION
            ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden bg-[#06030e] border-t border-white/10">
          <Starfield count={40} />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="glass-luxury-container rounded-[2.5rem] p-10 sm:p-14 border border-white/20 shadow-[0_20px_80px_rgba(112,0,255,0.3)]">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/15 text-purple-300 mb-6">
                <Zap className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Ready For Conversion</span>
              </span>

              <h2
                className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Find Your Next High-Ticket <br />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                  Commercial Client Today
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-xl mx-auto">
                Join high-performing agencies and founders prospecting with verified data certainty.
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/signup"
                  className="glass-pill-btn px-8 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-3.5 rounded-full font-semibold text-sm bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/15 transition"
                >
                  Explore Packages
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
