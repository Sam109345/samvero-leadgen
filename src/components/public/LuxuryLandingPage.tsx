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
  Briefcase,
  Users,
} from 'lucide-react';

/* ── Twinkling Starfield Dust (Deterministic SSR/CSR) ─────── */
function Starfield({ count = 45 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 19 + 7) % 100}%`,
    top: `${(i * 31 + 13) % 100}%`,
    width: `${((i % 3) * 0.7 + 1.2).toFixed(1)}px`,
    duration: `${(i % 4) + 3}s`,
    delay: `${((i % 5) * 0.8).toFixed(1)}s`,
    opacity: Number((((i % 5) * 0.15) + 0.35).toFixed(2)),
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
    title: 'CloudScale FinTech Infrastructure',
    company: 'CloudScale Europe Ltd',
    location: 'London, United Kingdom',
    country: 'UK',
    platform: 'LinkedIn Live',
    phone: '+44 20 7946 0912',
    whatsapp: 'Business Verified',
    tag: 'Hiring React & Next.js Agency',
    tagColor: 'text-[#00AAFF] bg-[#0057FF]/15 border-[#0057FF]/30',
    budget: '$8,000 - $15,000',
    score: 94,
    contactName: 'Eleanor Sterling (VP Tech)',
    verifiedEmail: 'sterling@cloudscale.co.uk',
  },
  {
    id: 'lead-4',
    title: 'Modern ERP Architecture Modernization',
    company: 'Nexus Industrial Automation',
    location: 'Toronto, Ontario, Canada',
    country: 'Canada',
    platform: 'Upwork Radar',
    phone: '+1 416 555 0188',
    whatsapp: 'Commercial Direct',
    tag: 'Fixed-Price Milestone RFP',
    tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    budget: '$5,000 - $12,000',
    score: 92,
    contactName: 'David K. Hoffman (CTO)',
    verifiedEmail: 'dhoffman@nexus-auto.ca',
  },
];

/* ── All 15 Supported Lead Channels Required by Task ────────── */
const SUPPORTED_CHANNELS = [
  { name: 'Google My Business', icon: '📍', category: 'Local Business & Maps' },
  { name: 'Upwork', icon: '💼', category: 'High-Ticket SOW RFP' },
  { name: 'LinkedIn', icon: '👔', category: 'Corporate Decision Makers' },
  { name: 'Freelancer.com', icon: '⚡', category: 'Global Enterprise Bids' },
  { name: 'Remote OK', icon: '🌐', category: 'Tech & Product Outbound' },
  { name: 'Remotive', icon: '🚀', category: 'Remote Scale Agencies' },
  { name: 'Bark', icon: '🎯', category: 'Direct Commercial Inquiries' },
  { name: 'Apollo.io', icon: '🔍', category: 'Verified Corporate Inboxes' },
  { name: 'Clutch', icon: '⭐', category: 'Agency B2B Reviews' },
  { name: 'Fiverr', icon: '🎨', category: 'Pro Creative Services' },
  { name: 'PeoplePerHour', icon: '⏱️', category: 'Commercial Projects' },
  { name: 'Contra', icon: '🤝', category: 'Independent Agency Feeds' },
  { name: 'Rozee.pk', icon: '🏢', category: 'National Corporate Hiring' },
  { name: 'Guru', icon: '🏆', category: 'Enterprise Technology Leads' },
  { name: 'Reddit', icon: '💬', category: 'Niche Commercial Subreddits' },
];

/* Currency options */
type CurrencyType = 'PKR' | 'USD' | 'AED' | 'GBP' | 'EUR';

const CURRENCY_MAP: Record<CurrencyType, { symbol: string; rateToPkr: number }> = {
  PKR: { symbol: 'Rs ', rateToPkr: 1 },
  USD: { symbol: '$', rateToPkr: 280 },
  AED: { symbol: 'AED ', rateToPkr: 76 },
  GBP: { symbol: '£', rateToPkr: 355 },
  EUR: { symbol: '€', rateToPkr: 302 },
};

/* ── Interactive 3D Floating Circles Configuration ──────── */
interface FloatingCircle {
  id: number;
  size: number;
  baseLeft: number;
  baseTop: number;
  offsetX: number;
  offsetY: number;
  followFactorX: number;
  followFactorY: number;
  factorX: number;
  factorY: number;
  floatClass: string;
  colorTheme: 'cyan' | 'electric-blue' | 'sky';
  isFollower?: boolean;
}

const HERO_CIRCLES: FloatingCircle[] = [
  // Swarm & Follower Circles – dynamically glide with mouse cursor ("jahan jahan mouse cursor jaaye")
  { id: 1, size: 85, baseLeft: 50, baseTop: 34, offsetX: -90, offsetY: -75, followFactorX: 42, followFactorY: 28, factorX: 18, factorY: 14, floatClass: 'animate-float', colorTheme: 'cyan', isFollower: true },
  { id: 2, size: 105, baseLeft: 50, baseTop: 34, offsetX: 75, offsetY: -85, followFactorX: 38, followFactorY: 26, factorX: 24, factorY: 18, floatClass: 'animate-float-delayed', colorTheme: 'electric-blue', isFollower: true },
  { id: 3, size: 55, baseLeft: 50, baseTop: 34, offsetX: 90, offsetY: 40, followFactorX: 44, followFactorY: 30, factorX: 14, factorY: 10, floatClass: 'animate-float', colorTheme: 'sky', isFollower: true },
  { id: 4, size: 75, baseLeft: 50, baseTop: 34, offsetX: -110, offsetY: 45, followFactorX: 35, followFactorY: 24, factorX: 20, factorY: 16, floatClass: 'animate-float-delayed', colorTheme: 'cyan', isFollower: true },
  { id: 5, size: 65, baseLeft: 50, baseTop: 34, offsetX: 10, offsetY: -110, followFactorX: 40, followFactorY: 25, factorX: 16, factorY: 12, floatClass: 'animate-float', colorTheme: 'electric-blue', isFollower: true },

  // Ambient Anchored Orbs – periphery depth with gravitational mouse attraction
  { id: 6, size: 125, baseLeft: 8, baseTop: 22, offsetX: 0, offsetY: 0, followFactorX: 14, followFactorY: 18, factorX: 35, factorY: 25, floatClass: 'animate-float', colorTheme: 'cyan' },
  { id: 7, size: 135, baseLeft: 88, baseTop: 18, offsetX: 0, offsetY: 0, followFactorX: 12, followFactorY: 16, factorX: 40, factorY: 30, floatClass: 'animate-float-delayed', colorTheme: 'electric-blue' },
  { id: 8, size: 90, baseLeft: 18, baseTop: 52, offsetX: 0, offsetY: 0, followFactorX: 16, followFactorY: 12, factorX: 28, factorY: 20, floatClass: 'animate-float', colorTheme: 'sky' },
];

/* Futuristic Acoustic Bubble Pop Synthesizer via Web Audio API */
function playBubblePopSound(size: number = 80) {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Pitch variation based on bubble size (smaller = higher pitch, larger = deeper pop)
    const baseFreq = Math.max(450, 1200 - size * 6);
    const dropFreq = Math.max(90, baseFreq * 0.16);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(dropFreq, now + 0.12);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc2.frequency.exponentialRampToValueAtTime(dropFreq * 1.8, now + 0.06);

    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.07);
  } catch {}
}

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

  /* Mouse tracking for animated floating circles in banner */
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Interactive popped circles state */
  const [poppedMap, setPoppedMap] = useState<Record<number, { isPopping: boolean; isPopped: boolean }>>({});

  /* Ref for 3D Walk-In stage and performance scroll */
  const walkinStageRef = useRef<HTMLDivElement>(null);
  const walkinCardRef = useRef<HTMLDivElement>(null);

  const handleBannerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  /* Global window mouse tracking for smooth responsive circle parallax */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  /* Click to pop burst handler */
  const handleCircleClick = (e: React.MouseEvent, circleId: number, size: number = 80) => {
    e.stopPropagation();
    playBubblePopSound(size);

    setPoppedMap((prev) => ({
      ...prev,
      [circleId]: { isPopping: true, isPopped: false },
    }));

    setTimeout(() => {
      setPoppedMap((prev) => ({
        ...prev,
        [circleId]: { isPopping: false, isPopped: true },
      }));
    }, 350);

    setTimeout(() => {
      setPoppedMap((prev) => ({
        ...prev,
        [circleId]: { isPopping: false, isPopped: false },
      }));
    }, 1600);
  };

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

  /* 60FPS Scroll Walk-In Controller */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (walkinCardRef.current && !isWalkedIn) {
            const rect = walkinCardRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const progress = Math.min(
              Math.max((windowHeight - rect.top) / (windowHeight * 0.85), 0),
              1
            );

            const currentTilt = (20 * (1 - progress * 0.9)).toFixed(2);
            const currentScale = (0.88 + progress * 0.12).toFixed(3);
            const currentY = (50 * (1 - progress)).toFixed(1);

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
      a: 'Select your preferred subscription package and click "Get Started". Submit your requirements and contact details. Once submitted, our team reviews your application and provides direct manual payment instructions via Bank Wire, Wise Direct, or corporate invoice for instant entitlement assignment.',
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
      className="min-h-screen flex flex-col bg-[#030712] text-slate-100 font-sans selection:bg-[#0057FF] selection:text-white overflow-x-hidden relative"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <PublicNavbar />

      <main className="flex-1">

        {/* ═══════════════════════════════════════════════════════
            1. HERO & CRM WALK-IN COMMAND CENTER (EXACT SCREENSHOT 1 INITIAL VIEW)
            In 100vh: Badge + Headline + Subheadline + CTA buttons +
            Glowing Horizon Arc + Top Half of CRM Dashboard ALL VISIBLE AT ONCE!
            ═══════════════════════════════════════════════════════ */}
        <section
          id="hero-portal"
          onMouseMove={handleBannerMouseMove}
          className="relative min-h-screen pt-16 sm:pt-20 pb-10 overflow-hidden select-none bg-[#030712]"
        >
          {/* Exact 100vh Initial Viewport Canvas Anchor */}
          <div className="absolute inset-0 pointer-events-none" style={{ minHeight: '100vh', height: '100vh' }} />

          {/* Cosmic Space Background Dust & Starfield */}
          <Starfield count={55} />

          {/* Deep Ambient Brand Glow Orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none transition-transform duration-500 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(0, 87, 255, 0.15) 0%, transparent 70%)',
              filter: 'blur(90px)',
              transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * -20}px, 0)`,
            }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full pointer-events-none transition-transform duration-500 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(0, 170, 255, 0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: `translate3d(${mousePos.x * 30}px, ${mousePos.y * 25}px, 0)`,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0, 87, 255, 0.16) 0%, rgba(0, 170, 255, 0.08) 50%, transparent 75%)',
              filter: 'blur(80px)',
            }}
          />

          {/* 3D Prismatic Glass Torus Ring centered behind Hero Headline (Screenshot 1 Match) */}
          <div
            className="absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 w-[480px] sm:w-[560px] h-[300px] sm:h-[340px] torus-ring-iridescent pointer-events-none opacity-40 transition-transform duration-500 ease-out hidden sm:block"
            style={{
              transform: `translateX(-50%) rotate(-18deg) rotateX(62deg) translate3d(${mousePos.x * 35}px, ${mousePos.y * 25}px, 0)`,
            }}
          />

          {/* Side Ambient Iridescent Torus Accents */}
          <div
            className="absolute top-16 -left-20 w-60 h-60 torus-ring-iridescent pointer-events-none opacity-30 hidden lg:block transition-transform duration-500 ease-out"
            style={{ transform: `rotate(25deg) rotateX(45deg) translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)` }}
          />
          <div
            className="absolute top-28 -right-24 w-64 h-64 torus-ring-iridescent pointer-events-none opacity-25 hidden lg:block transition-transform duration-500 ease-out"
            style={{ transform: `rotate(-30deg) rotateX(55deg) translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)` }}
          />

          {/* ── Dynamic Floating 3D Glass Circles with Mouse-Tracking & Click-To-Pop Burst ── */}
          {HERO_CIRCLES.map((c) => {
            const poppedState = poppedMap[c.id];
            const isPopping = poppedState?.isPopping;
            const isPopped = poppedState?.isPopped;

            // Follower circles dynamically follow mouse cursor wherever it goes ("jahan jahan mouse cursor jaaye")
            const posX = c.isFollower
              ? `calc(${50 + mousePos.x * c.followFactorX}% + ${c.offsetX}px)`
              : `calc(${c.baseLeft + mousePos.x * c.followFactorX}% + ${c.offsetX}px)`;
            const posY = c.isFollower
              ? `calc(${34 + mousePos.y * c.followFactorY}% + ${c.offsetY}px)`
              : `calc(${c.baseTop + mousePos.y * c.followFactorY}% + ${c.offsetY}px)`;

            return (
              <div
                key={c.id}
                className="absolute transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: posX,
                  top: posY,
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  transform: `translate3d(${mousePos.x * c.factorX}px, ${mousePos.y * c.factorY}px, 0)`,
                  zIndex: 22,
                }}
              >
                {/* Popping explosion state */}
                {isPopping && (
                  <div className="relative w-full h-full pointer-events-none">
                    {/* Expanding Shockwave Ring */}
                    <div
                      className="absolute inset-0 rounded-full animate-bubble-shockwave pointer-events-none"
                      style={{
                        border: '2px solid rgba(0, 220, 255, 0.95)',
                        boxShadow: '0 0 35px rgba(0, 170, 255, 0.9)',
                      }}
                    />
                    {/* 12 Radiant Burst Particles */}
                    {Array.from({ length: 12 }).map((_, pi) => {
                      const angle = (pi * 30 * Math.PI) / 180;
                      const dist = c.size * 0.75;
                      const tx = Math.cos(angle) * dist;
                      const ty = Math.sin(angle) * dist;
                      return (
                        <div
                          key={pi}
                          className="absolute rounded-full pointer-events-none animate-bubble-particle"
                          style={{
                            top: '50%',
                            left: '50%',
                            width: '6px',
                            height: '6px',
                            marginTop: '-3px',
                            marginLeft: '-3px',
                            background: pi % 2 === 0 ? '#38bdf8' : '#0057FF',
                            boxShadow: '0 0 10px #00AAFF',
                            '--tx': `${tx}px`,
                            '--ty': `${ty}px`,
                          } as React.CSSProperties}
                        />
                      );
                    })}
                    {/* Flash Expanding Core */}
                    <div
                      className="w-full h-full rounded-full animate-bubble-pop pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(0, 170, 255, 0.85) 50%, rgba(0, 87, 255, 0.4) 100%)',
                        boxShadow: '0 0 45px rgba(0, 220, 255, 1)',
                      }}
                    />
                  </div>
                )}

                {/* Normal Interactive Floating Glass Circle */}
                {!isPopped && !isPopping && (
                  <div
                    onClick={(e) => handleCircleClick(e, c.id, c.size)}
                    role="button"
                    tabIndex={0}
                    title="Click to pop!"
                    aria-label="Interactive floating circle - click to pop"
                    className={`w-full h-full rounded-full animate-float cursor-pointer pointer-events-auto transition-all duration-300 relative group ${c.floatClass} animate-bubble-respawn hover:scale-105`}
                    style={{
                      background:
                        c.colorTheme === 'cyan'
                          ? 'radial-gradient(circle at 35% 30%, rgba(0, 210, 255, 0.25) 0%, rgba(0, 170, 255, 0.12) 40%, rgba(3, 7, 18, 0.65) 90%)'
                          : c.colorTheme === 'electric-blue'
                          ? 'radial-gradient(circle at 35% 30%, rgba(0, 140, 255, 0.28) 0%, rgba(0, 87, 255, 0.14) 45%, rgba(3, 7, 18, 0.65) 90%)'
                          : 'radial-gradient(circle at 35% 30%, rgba(56, 189, 248, 0.25) 0%, rgba(0, 170, 255, 0.1) 40%, rgba(3, 7, 18, 0.65) 90%)',
                      border: '1.5px solid rgba(0, 170, 255, 0.45)',
                      boxShadow:
                        'inset 0 0 25px rgba(0, 170, 255, 0.35), inset 0 0 50px rgba(0, 87, 255, 0.2), 0 0 30px rgba(0, 170, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    {/* Specular glass reflection on top-left */}
                    <div className="absolute top-2 left-3 w-1/3 h-1/4 rounded-full bg-gradient-to-br from-white/50 via-cyan-300/20 to-transparent blur-[1px] pointer-events-none group-hover:from-white/70" />
                    
                    {/* Inner glowing pulse */}
                    <div className="absolute inset-2 rounded-full bg-radial from-cyan-400/20 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

                    {/* Hover highlight border ring */}
                    <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-[#00AAFF] group-hover:shadow-[0_0_35px_rgba(0,170,255,0.8),inset_0_0_20px_rgba(0,220,255,0.6)] transition-all pointer-events-none" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Hero Header Content (Compact, Perfectly Vertically Spaced) */}
          <div className="relative z-30 text-center max-w-4xl mx-auto px-4 sm:px-6 mb-3 sm:mb-4">
            
            {/* Pill Badge: Electric Blue Brand */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase bg-[#0057FF]/10 border border-[#00AAFF]/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,170,255,0.25)] text-[#00AAFF]">
              <Sparkles className="w-3 h-3 text-[#00AAFF] animate-pulse" />
              <span>Next-Gen Outbound Intelligence • Portal 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            {/* Main Headline: Bold, Electric Blue to Cyan (Matches Screenshot 1 Lines) */}
            <h1
              className="text-3xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight text-white mb-2.5 sm:mb-3 leading-[1.08]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Step Into The Future Of <br />
              <span className="bg-gradient-to-r from-[#0057FF] via-[#00AAFF] to-[#38bdf8] bg-clip-text text-transparent">
                High-Ticket Lead <br className="hidden sm:inline" /> Discovery
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto mb-3.5 sm:mb-4 leading-relaxed font-normal">
              Autonomous multi-platform radar crawling Google Maps, Upwork, LinkedIn and international registers with 100% verified emails, validated mobile numbers, and direct WhatsApp pitching.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <Link
                href="/signup"
                className="glass-pill-btn px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_10px_35px_rgba(0,87,255,0.5)] hover:shadow-[0_15px_45px_rgba(0,170,255,0.6)] transition"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              {/* Interactive Walk-In Camera Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setIsWalkedIn(!isWalkedIn);
                  const el = document.getElementById('crm-portal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm bg-white/[0.05] hover:bg-white/[0.1] text-[#00AAFF] border border-[#0057FF]/40 hover:border-[#00AAFF]/60 backdrop-blur-md transition flex items-center gap-2"
              >
                {isWalkedIn ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
                <span>{isWalkedIn ? 'Exit Walk-In' : 'Step Inside CRM (Walk-In View)'}</span>
              </button>

              <a
                href="#pricing"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition"
              >
                View Plans
              </a>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              THE PORTAL HORIZON GLOW & 3D CRM WALK-IN COMMAND CENTER
              Directly beneath the hero buttons so top half is visible in 100vh!
              ═══════════════════════════════════════════════════════ */}
          <div
            id="crm-portal"
            ref={walkinStageRef}
            className="w-full max-w-6xl mx-auto px-3 sm:px-6 relative z-20 crm-walkin-stage mt-4 sm:mt-6"
          >
            {/* The Cosmic Horizon Glowing Eclipse Arc (Electric Blue / Cyan) */}
            <div className="portal-horizon-arc -top-16" />
            <div className="portal-horizon-line -top-1 sm:top-2" />

            {/* 3D CRM Window Shell */}
            <div
              ref={walkinCardRef}
              className={`crm-walkin-card ${isWalkedIn ? 'walked-in' : ''} rounded-[1.75rem] sm:rounded-[2.5rem] p-2.5 sm:p-4 relative bg-[#060b18]/95 border border-[#0057FF]/35 backdrop-blur-3xl shadow-[0_30px_120px_rgba(0,87,255,0.4),0_0_60px_rgba(0,170,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]`}
            >
              {/* Downward Volumetric Horizon Reflection Highlight */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0057FF]/20 via-[#00AAFF]/5 to-transparent rounded-t-[2.5rem] pointer-events-none" />

              {/* CRM Top Chrome Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#030712]/95 border border-white/10 mb-2.5 relative z-10">
                {/* Traffic Lights */}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  
                  {/* Address Pill */}
                  <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/10">
                    <Lock className="w-3 h-3 text-[#00AAFF]" />
                    <span>samvero.live/mission-control/active-leads</span>
                  </span>
                </div>

                {/* Live Sync Status */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>RADAR ACTIVE • 10s PING</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#00AAFF] hidden md:inline">
                    50,000+ VERIFIED LEADS
                  </span>
                </div>
              </div>

              {/* CRM Live Feed Navigation Tabs */}
              <div className="flex items-center justify-between gap-3 mb-2.5 px-1 flex-wrap relative z-10">
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
                        className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap text-xs ${
                          active
                            ? 'bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white shadow-md shadow-[#0057FF]/30 border border-[#00AAFF]/40'
                            : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Search Input */}
                <div className="relative min-w-[200px] max-w-xs flex-1">
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
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 relative z-10">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-2xl bg-[#080e22]/90 border border-slate-800 hover:border-[#00AAFF]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-sm hover:shadow-[0_4px_25px_rgba(0,170,255,0.15)]"
                  >
                    {/* Lead Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm tracking-tight">{lead.title}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#0057FF]/15 text-[#00AAFF] border border-[#0057FF]/30">
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
                        <span className="flex items-center gap-1 text-[#00AAFF]">
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

              {/* Bottom CRM Telemetry Status Bar */}
              <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 px-2 flex-wrap gap-2">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-emerald-400">● 15 CRAWL ENGINES ONLINE</span>
                  <span className="hidden sm:inline">LATENCY: 14ms</span>
                  <span className="hidden md:inline">MX ACCURACY: 99.8%</span>
                </div>
                <div className="font-mono text-[#00AAFF]">
                  PRESS <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">/</kbd> TO SEARCH LEADS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. LOGOS MARQUEE SLIDER (STRICTLY NO STOP ON HOVER)
            Lists ALL 15 supported channels required by user
            ═══════════════════════════════════════════════════════ */}
        <section id="marquee-slider" className="py-4 border-y border-[#0057FF]/20 bg-[#060b18] overflow-hidden select-none">
          <div className="animate-marquee-continuous flex items-center gap-8">
            {[...SUPPORTED_CHANNELS, ...SUPPORTED_CHANNELS].map((channel, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-[#0057FF]/25 shadow-[0_0_20px_rgba(0,87,255,0.08)] whitespace-nowrap shrink-0"
              >
                <span className="text-xl">{channel.icon}</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white tracking-wide">{channel.name}</span>
                  <span className="text-[10px] font-mono text-[#00AAFF]">{channel.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* ═══════════════════════════════════════════════════════
            4. CORPORATE MEETING & MODERN OFFICE SHOWCASE
            Demonstrates real CRM workflow in enterprise boardrooms
            ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden bg-[#030712]">
          <Starfield count={30} />
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0057FF]/15 border border-[#00AAFF]/30 text-[#00AAFF] mb-4">
                <Building2 className="w-3.5 h-3.5 text-[#00AAFF]" />
                <span>Enterprise Agency Operations</span>
              </span>
              <h2
                className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Built for Boardroom Closings & High-Volume Desks
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                How modern agencies, outbound specialists, and executive BD leaders deploy Samvero across corporate headquarters.
              </p>
            </div>

            {/* Corporate Imagery & CRM Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              
              {/* Feature 1 */}
              <div className="rounded-3xl overflow-hidden bg-[#060b18] border border-slate-800 hover:border-[#00AAFF]/40 transition shadow-xl group flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                    alt="Corporate Boardroom Meeting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#0057FF]/90 text-white">
                    BOARDROOM STRATEGY
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Executive Client Pitches
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Arm your account managers with real primary evidence: company registrations, domain health, and direct decision-maker mobile lines.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-3xl overflow-hidden bg-[#060b18] border border-slate-800 hover:border-[#00AAFF]/40 transition shadow-xl group flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="Agency Workstation Collaboration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#00AAFF]/90 text-white">
                    OUTBOUND WORKSTATION
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    High-Velocity Pipeline Workflow
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Filter by country, commercial budget, and missing responsive assets. Convert cold leads into qualified pipeline stages in minutes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl overflow-hidden bg-[#060b18] border border-slate-800 hover:border-[#00AAFF]/40 transition shadow-xl group flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                    alt="Corporate Handshake & Contract Closing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-600/90 text-white">
                    HIGH-TICKET CLOSE
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    1-Click Scope of Work Proposals
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Generate white-labeled PDF proposal packages, 14-screen app specs, and vector logo audits directly inside the Workbench.
                  </p>
                </div>
              </div>

            </div>

            {/* 4-Pillar Architecture with Modern Analytics Imagery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Multi-Source Radar',
                  desc: 'Autonomous crawling across Google Maps, Upwork, LinkedIn, and registers without API bans or rate limits.',
                  icon: Globe2,
                  stat: '15+ Connectors',
                  image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
                },
                {
                  step: '02',
                  title: 'Deep MX & Phone Audit',
                  desc: 'Every business domain undergoes DNS MX checks, disposable mail rejection, and ITU telecom validation.',
                  icon: ShieldCheck,
                  stat: '98% Accuracy',
                  image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
                },
                {
                  step: '03',
                  title: 'Instant Outreach Studio',
                  desc: '1-click WhatsApp Web chat launches and pre-warmed Gmail outreach templates ready in 5 seconds.',
                  icon: MessageCircle,
                  stat: '1-Click Launch',
                  image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80',
                },
                {
                  step: '04',
                  title: 'AI Proposal Generator',
                  desc: 'Auto-generate tailored pitch scripts, Website Rebuild mockups, and client proposals that convert.',
                  icon: Bot,
                  stat: 'High-Ticket SOW',
                  image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
                },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-[2rem] bg-[#060b18]/90 border border-slate-800 hover:border-[#00AAFF]/40 transition flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-mono font-bold text-[#0057FF] group-hover:text-[#00AAFF] transition">
                          {item.step}
                        </span>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0057FF]/15 border border-[#00AAFF]/30 text-[#00AAFF] group-hover:scale-110 transition">
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="w-full h-24 rounded-xl overflow-hidden mb-4 border border-slate-800">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-[#00AAFF] font-semibold">
                      {item.stat}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            4. PRICING SECTION: STRICT ELECTRIC BLUE TO CYAN THEME
            ═══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 relative overflow-hidden bg-[#060b18] smooth-scroll-perf">
          
          {/* Ambient Glowing Spheres (Electric Blue & Cyan) */}
          <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-[#0057FF]/25 to-transparent blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#0057FF]/20 via-[#00AAFF]/15 to-transparent blur-[110px] pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-tr from-[#00AAFF]/20 to-transparent blur-[90px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0057FF]/15 border border-[#0057FF]/30 text-[#00AAFF] mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#00AAFF]" />
                <span>Subscription Packages</span>
              </span>
              <h2
                className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Simple, Transparent Lead Intelligence Tiers
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Choose the right monthly quota of validated commercial leads for your business.
              </p>
            </div>

            {/* Currency & Billing Cycle Switchers */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              {/* Currency Picker */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl">
                {(['USD', 'PKR', 'AED', 'GBP', 'EUR'] as CurrencyType[]).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setPricingCurrency(cur)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      pricingCurrency === cur
                        ? 'bg-[#0057FF] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>

              {/* Billing Cycle */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1 rounded-full text-xs font-semibold transition ${
                    billingCycle === 'monthly'
                      ? 'bg-[#0057FF] text-white'
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
                      ? 'bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Annual (Save 20%)
                </button>
              </div>
            </div>

            {/* The 3 Clean Glass Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* 1. Starter Prospector */}
              <div className="rounded-[2.5rem] p-7 bg-[#060b18]/90 border border-slate-800 hover:border-[#0057FF]/40 transition relative flex flex-col justify-between shadow-xl">
                <div>
                  <div className="mb-5">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#0057FF]/20 text-[#00AAFF] border border-[#0057FF]/30 mb-3">
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
                  className="w-full py-3.5 rounded-full text-center font-bold text-xs bg-slate-800 hover:bg-[#0057FF] text-white transition"
                >
                  Get Started
                </Link>
              </div>

              {/* 2. Growth Agency Pro (Featured - Electric Blue Gradient) */}
              <div className="rounded-[2.5rem] p-7 bg-[#060b18] border-2 border-[#00AAFF]/60 shadow-[0_20px_70px_rgba(0,170,255,0.25)] relative flex flex-col justify-between transform md:-translate-y-3">
                {/* Popular Pill */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#0057FF] to-[#00AAFF] text-white shadow-md shadow-[#0057FF]/40 border border-[#00AAFF]/40">
                  Most Popular
                </div>

                <div>
                  <div className="mb-5 mt-1">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#00AAFF]/20 text-[#00AAFF] border border-[#00AAFF]/40 mb-3">
                      Standard Plan
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Growth Agency Pro
                    </h3>
                    <p className="text-xs text-slate-300">
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
                        <Check className="w-4 h-4 text-[#00AAFF] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/signup?plan=standard&cycle=${billingCycle}`}
                  className="w-full py-3.5 rounded-full text-center font-bold text-xs bg-gradient-to-r from-[#0057FF] to-[#00AAFF] hover:brightness-110 text-white shadow-lg shadow-[#0057FF]/35 transition"
                >
                  Get Started
                </Link>
              </div>

              {/* 3. Enterprise Acquisition Desk */}
              <div className="rounded-[2.5rem] p-7 bg-[#060b18]/90 border border-slate-800 hover:border-[#00AAFF]/40 transition relative flex flex-col justify-between shadow-xl">
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
        <section className="py-24 relative overflow-hidden bg-[#030712] border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0057FF]/15 border border-[#00AAFF]/30 text-[#00AAFF] mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-[#00AAFF]" />
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
                    className="rounded-2xl overflow-hidden bg-[#060b18] border border-slate-800 transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 transition"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#00AAFF]' : 'text-slate-500'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80">
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
        <section className="py-24 relative overflow-hidden bg-[#060b18] border-t border-slate-800">
          <Starfield count={40} />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="rounded-[2.5rem] p-10 sm:p-14 bg-gradient-to-b from-[#080e24] to-[#030712] border border-[#0057FF]/35 shadow-[0_20px_80px_rgba(0,87,255,0.25)]">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0057FF]/15 border border-[#0057FF]/30 text-[#00AAFF] mb-6">
                <Zap className="w-3.5 h-3.5 text-[#00AAFF] animate-pulse" />
                <span>Ready For Conversion</span>
              </span>

              <h2
                className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Find Your Next High-Ticket <br />
                <span className="bg-gradient-to-r from-[#0057FF] via-[#00AAFF] to-[#38bdf8] bg-clip-text text-transparent">
                  Commercial Client Today
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
                Join high-performing agencies and founders prospecting with verified data certainty.
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/signup"
                  className="glass-pill-btn px-8 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-[0_10px_35px_rgba(0,87,255,0.4)]"
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
