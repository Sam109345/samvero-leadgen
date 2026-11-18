'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import { PlanConfig, BillingCycle } from '@/lib/saas-store';
import { Lead } from '@/types';
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
  Target,
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
  {
    id: 'lead-5',
    title: 'AI Workflow Automation & Agent Integration',
    company: 'Veloce Data Systems Inc',
    location: 'San Francisco, CA, USA',
    country: 'USA',
    platform: 'Freelancer.com',
    phone: '+1 415 890 2244',
    whatsapp: 'Direct Available',
    tag: 'Verified Client • Escrow Funded',
    tagColor: 'text-[#00AAFF] bg-[#0057FF]/15 border-[#0057FF]/30',
    budget: '$3,500 - $7,500',
    score: 97,
    contactName: 'Sarah Jenkins (Ops VP)',
    verifiedEmail: 's.jenkins@velocesystems.com',
  },
  {
    id: 'lead-6',
    title: 'Full-Stack Multi-Tenant SaaS Modernization',
    company: 'Synergy Cloud Technologies',
    location: 'Sydney, NSW, Australia',
    country: 'Australia',
    platform: 'Freelancer.com',
    phone: '+61 2 9123 4567',
    whatsapp: 'Commercial Direct',
    tag: 'Urgent RFP • High Rep Client',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    budget: '$4,500 - $9,800',
    score: 95,
    contactName: 'Liam O’Connor (Engineering Lead)',
    verifiedEmail: 'liam@synergycloud.com.au',
  },
  {
    id: 'lead-7',
    title: 'Commercial Office Fitout & HVAC Infrastructure',
    company: 'Emirates Facilities Engineering Ltd',
    location: 'Business Bay & DIFC, Dubai, UAE',
    country: 'UAE',
    platform: 'Bark Direct',
    phone: '+971 4 456 7890',
    whatsapp: 'Direct Available',
    tag: 'Phone Confirmed • Immediate RFP',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    budget: '$6,500 - $18,000',
    score: 99,
    contactName: 'Hamdan Al-Zaabi (Managing Partner)',
    verifiedEmail: 'h.zaabi@emirates-facilities.ae',
  },
  {
    id: 'lead-8',
    title: 'Boutique Hotel Corporate Branding & Web Engine',
    company: 'The Kensington Heritage Hotel Group',
    location: 'Kensington & Chelsea, London, UK',
    country: 'UK',
    platform: 'Bark Direct',
    phone: '+44 20 7123 9876',
    whatsapp: 'Business Verified',
    tag: 'Decision Maker Live • RFP Open',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    budget: '$5,000 - $11,000',
    score: 96,
    contactName: 'Charlotte Beaumont (Brand Director)',
    verifiedEmail: 'cbeaumont@kensingtonheritage.co.uk',
  },
  {
    id: 'lead-9',
    title: 'HIPAA-Compliant Patient Telehealth Mobile App',
    company: 'CarePulse Health Solutions',
    location: 'Chicago, IL, United States',
    country: 'USA',
    platform: 'Upwork Radar',
    phone: '+1 312 890 3311',
    whatsapp: 'Validated Mobile',
    tag: 'Healthcare Mobile • Verified Escrow',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    budget: '$10,000 - $22,000',
    score: 98,
    contactName: 'Dr. Gregory Hayes (Medical Director)',
    verifiedEmail: 'engineering@carepulse-health.com',
  },
  {
    id: 'lead-10',
    title: 'Automated Real-Time Freight Logistics Tracking System',
    company: 'TransGlobal Freight Forwarding',
    location: 'JAFZA & Downtown, Dubai, UAE',
    country: 'UAE',
    platform: 'Upwork Radar',
    phone: '+971 4 362 7000',
    whatsapp: 'Commercial Direct',
    tag: 'IoT Telemetry • Active RFP',
    tagColor: 'text-[#00AAFF] bg-[#0057FF]/15 border-[#0057FF]/30',
    budget: '$12,000 - $25,000',
    score: 97,
    contactName: 'Zubair Al-Hashimi (Operations Head)',
    verifiedEmail: 'it-procurement@transglobal.ae',
  },
  {
    id: 'lead-11',
    title: 'Vice President of Engineering & Cloud Architecture',
    company: 'Fintech Orbit Global Europe',
    location: 'Canary Wharf, London, UK',
    country: 'UK',
    platform: 'LinkedIn Live',
    phone: '+44 20 7946 0912',
    whatsapp: 'Business Verified',
    tag: 'Hiring Specialized Agency • Verified',
    tagColor: 'text-cyan-300 bg-[#0057FF]/20 border-[#00AAFF]/40',
    budget: '$15,000 - $30,000',
    score: 99,
    contactName: 'Alistair Montgomery (Chief Risk Officer)',
    verifiedEmail: 'hiring-tech@fintechorbit.co.uk',
  },
  {
    id: 'lead-12',
    title: 'Managing Director of Property Development Operations',
    company: 'Damac Real Estate Luxury Desk',
    location: 'DIFC & Downtown, Dubai, UAE',
    country: 'UAE',
    platform: 'LinkedIn Live',
    phone: '+971 4 373 1000',
    whatsapp: 'Validated Corporate Phone',
    tag: 'VIP Buyer Portal • Corporate Mandate',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    budget: '$20,000 - $45,000',
    score: 98,
    contactName: 'Fatima Al-Rumaithi (Commercial VP)',
    verifiedEmail: 'contracts@damac-luxury.ae',
  },
  {
    id: 'lead-13',
    title: 'Al-Zahra Specialist Medical Center',
    company: 'Al-Zahra Healthcare Network',
    location: 'Dubai Healthcare City, UAE',
    country: 'UAE',
    platform: 'Google My Business',
    phone: '+971 4 378 6666',
    whatsapp: 'Direct Available',
    tag: 'Missing Responsive Booking System',
    tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    budget: '$3,500 - $7,000',
    score: 96,
    contactName: 'Dr. Tariq Al-Khatib (Clinic Director)',
    verifiedEmail: 'admin@alzahra-dhcc.ae',
  },
  {
    id: 'lead-14',
    title: 'Custom B2B E-Commerce Wholesale Ordering Portal',
    company: 'Kensington Foods & Beverages Group',
    location: 'City of London, UK',
    country: 'UK',
    platform: 'Bark Direct',
    phone: '+44 20 7946 0912',
    whatsapp: 'Business Verified',
    tag: 'Ready to Hire • Commercial Tender',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    budget: '$8,000 - $18,000',
    score: 97,
    contactName: 'Edward Kensington (CEO)',
    verifiedEmail: 'trade@kensingtonfoods.co.uk',
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
  // Flank & Swarm Follower Lenses – dynamically glide with mouse cursor ("jahan jahan mouse cursor jaaye")
  { id: 1, size: 90, baseLeft: 10, baseTop: 24, offsetX: 0, offsetY: 0, followFactorX: 25, followFactorY: 18, factorX: 18, factorY: 14, floatClass: 'animate-float', colorTheme: 'cyan', isFollower: true },
  { id: 2, size: 100, baseLeft: 88, baseTop: 22, offsetX: 0, offsetY: 0, followFactorX: 24, followFactorY: 18, factorX: 20, factorY: 16, floatClass: 'animate-float-delayed', colorTheme: 'electric-blue', isFollower: true },
  { id: 3, size: 60, baseLeft: 18, baseTop: 12, offsetX: 0, offsetY: 0, followFactorX: 28, followFactorY: 20, factorX: 14, factorY: 10, floatClass: 'animate-float', colorTheme: 'sky', isFollower: true },
  { id: 4, size: 65, baseLeft: 82, baseTop: 14, offsetX: 0, offsetY: 0, followFactorX: 26, followFactorY: 18, factorX: 16, factorY: 12, floatClass: 'animate-float-delayed', colorTheme: 'cyan', isFollower: true },
  { id: 5, size: 50, baseLeft: 50, baseTop: 8, offsetX: 0, offsetY: 0, followFactorX: 18, followFactorY: 14, factorX: 10, factorY: 8, floatClass: 'animate-float', colorTheme: 'electric-blue', isFollower: true },

  // Ambient Anchored Obsidian-Glass Orbs – deep periphery depth
  { id: 6, size: 120, baseLeft: 3, baseTop: 45, offsetX: 0, offsetY: 0, followFactorX: 14, followFactorY: 16, factorX: 28, factorY: 20, floatClass: 'animate-float', colorTheme: 'cyan' },
  { id: 7, size: 130, baseLeft: 94, baseTop: 42, offsetX: 0, offsetY: 0, followFactorX: 12, followFactorY: 14, factorX: 30, factorY: 22, floatClass: 'animate-float-delayed', colorTheme: 'electric-blue' },
  { id: 8, size: 75, baseLeft: 8, baseTop: 68, offsetX: 0, offsetY: 0, followFactorX: 16, followFactorY: 12, factorX: 22, factorY: 16, floatClass: 'animate-float', colorTheme: 'sky' },
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

  const [liveDbLeads, setLiveDbLeads] = useState<Lead[]>([]);

  /* Fetch live leads from master database with real-time stream ingestion */
  useEffect(() => {
    let isMounted = true;
    const fetchDbLeads = (isStream = false) => {
      const url = isStream
        ? `/api/leads?refresh=live&stream=true&limit=60&t=${Date.now()}`
        : `/api/leads?stream=true&limit=60&t=${Date.now()}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.leads) && data.leads.length > 0 && isMounted) {
            setLiveDbLeads((prev) => {
              if (prev.length === 0) return data.leads;
              const prevIds = new Set(prev.map((l) => l.id.toLowerCase()));
              const freshArrivals = data.leads.filter((l: Lead) => !prevIds.has(l.id.toLowerCase()));
              if (freshArrivals.length > 0) {
                return [...freshArrivals, ...prev];
              }
              return data.leads;
            });
          }
        })
        .catch((err) => console.warn('Could not load live CRM leads:', err));
    };

    // Initial immediate fetch
    fetchDbLeads(false);

    // Continuous 12-second live streaming polling ticker
    const streamInterval = setInterval(() => {
      fetchDbLeads(true);
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(streamInterval);
    };
  }, []);

  /* Map live database leads to the interactive CRM card format */
  const mappedDbLeads: MockLead[] = useMemo(() => {
    return liveDbLeads.map((l) => {
      let platformName: MockLead['platform'] = 'Google My Business';
      const platLower = (l.platform || '').toLowerCase();
      if (platLower.includes('upwork')) platformName = 'Upwork Radar';
      else if (platLower.includes('linkedin')) platformName = 'LinkedIn Live';
      else if (platLower.includes('freelancer')) platformName = 'Freelancer.com';
      else if (platLower.includes('bark')) platformName = 'Bark Direct';
      else if (platLower.includes('google') || platLower.includes('map') || platLower.includes('gmb')) platformName = 'Google My Business';

      const isFresh = (l as any).isBrandNew || (typeof l.incomingAt === 'number' && Date.now() - l.incomingAt < 180000) || l.timeAgo === 'Just now';
      const tag = isFresh
        ? '⚡ Live Ingested Opportunity'
        : l.tags?.[0] || (l.contact?.hasWebsite ? 'Verified Enterprise' : 'Missing Responsive Site (Hot Pitch)');
      const tagColor = isFresh
        ? 'text-[#00AAFF] bg-[#0057FF]/20 border-[#00AAFF]/50'
        : l.contact?.hasWebsite
        ? 'text-[#00AAFF] bg-[#0057FF]/15 border-[#0057FF]/30'
        : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

      return {
        id: l.id,
        title: l.businessName || l.title,
        company: l.businessName || l.title,
        location: l.city ? `${l.city}, ${l.country}` : l.address || l.country || 'Global Outbound',
        country: l.country || 'Global',
        platform: platformName,
        phone: l.contact?.phone || '+971 4 883 2222',
        whatsapp: l.contact?.phone ? 'Validated Mobile' : 'Direct Available',
        tag,
        tagColor,
        budget: l.budget || '$1,500 - $4,500',
        score: l.scoreBreakdown?.leadQualityScore || 96,
        contactName: l.contact?.contactPerson || 'Executive Decision Maker',
        verifiedEmail: l.contact?.email || 'contact@verified-enterprise.com',
      };
    });
  }, [liveDbLeads]);

  /* Combined leads pool: live DB leads prepended with guaranteed multi-source fallback leads */
  const combinedLeadsPool = useMemo(() => {
    const seen = new Set<string>();
    const pool: MockLead[] = [];

    // Dynamically rotate fallback leads so they never always start with the same card
    const rotationOffset = Math.floor(Date.now() / 15000) % Math.max(1, CRM_LIVE_LEADS.length);
    const rotatedFallbacks = [
      ...CRM_LIVE_LEADS.slice(rotationOffset),
      ...CRM_LIVE_LEADS.slice(0, rotationOffset),
    ];

    for (const item of [...mappedDbLeads, ...rotatedFallbacks]) {
      const key = `${(item.title || '').trim().toLowerCase()}::${(item.platform || '').toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        pool.push(item);
      }
    }
    return pool;
  }, [mappedDbLeads]);

  /* Filter live leads in command center */
  const filteredLeads = useMemo(() => {
    return combinedLeadsPool.filter((lead) => {
      let matchesPlatform = true;
      if (activePlatformFilter !== 'All Sources') {
        const filterStr = activePlatformFilter.toLowerCase();
        const leadPlat = lead.platform.toLowerCase();
        if (filterStr.includes('google') || filterStr.includes('gmb')) {
          matchesPlatform = leadPlat.includes('google') || leadPlat.includes('gmb') || leadPlat.includes('map');
        } else if (filterStr.includes('upwork')) {
          matchesPlatform = leadPlat.includes('upwork');
        } else if (filterStr.includes('linkedin')) {
          matchesPlatform = leadPlat.includes('linkedin');
        } else if (filterStr.includes('freelancer')) {
          matchesPlatform = leadPlat.includes('freelancer');
        } else if (filterStr.includes('bark')) {
          matchesPlatform = leadPlat.includes('bark');
        } else {
          matchesPlatform = leadPlat.includes(filterStr);
        }
      }

      const q = leadSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.title.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.location.toLowerCase().includes(q) ||
        lead.platform.toLowerCase().includes(q) ||
        lead.tag.toLowerCase().includes(q) ||
        lead.verifiedEmail.toLowerCase().includes(q);

      return matchesPlatform && matchesSearch;
    });
  }, [combinedLeadsPool, activePlatformFilter, leadSearchQuery]);

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
            1. HERO BANNER — Clean, Centered, No Leads Panel, No Bubbles
            High-tech animated square grid & glowing cyber boxes
            ═══════════════════════════════════════════════════════ */}
        <section
          id="hero-portal"
          className="relative min-h-screen flex items-center justify-center overflow-hidden select-none bg-[#02040a] px-4"
        >
          {/* Animated 50px Grid Lines */}
          <div className="absolute inset-0 cyber-grid-bg pointer-events-none" />

          {/* High-Tech Animated Floating Square Boxes Across the Banner */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Glowing Accent Squares aligned to grid */}
            <div className="absolute top-[15%] left-[10%] w-[50px] h-[50px] border border-[#00AAFF]/60 bg-[#0057FF]/15 rounded-lg cyber-square-glow" style={{ animationDelay: '0s' }} />
            <div className="absolute top-[25%] right-[15%] w-[100px] h-[100px] border border-[#00AAFF]/50 bg-[#0070FF]/10 rounded-xl cyber-square-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-[20%] left-[18%] w-[75px] h-[75px] border border-[#00AAFF]/40 bg-[#0057FF]/10 rounded-lg cyber-square-float" style={{ animationDelay: '2.5s' }} />
            <div className="absolute bottom-[28%] right-[22%] w-[50px] h-[50px] border border-cyan-400/60 bg-cyan-500/15 rounded-lg cyber-square-glow" style={{ animationDelay: '1.8s' }} />
            <div className="absolute top-[60%] left-[8%] w-[60px] h-[60px] border border-[#0057FF]/50 bg-[#00AAFF]/10 rounded-lg cyber-square-glow" style={{ animationDelay: '3.2s' }} />
            <div className="absolute top-[18%] right-[35%] w-[45px] h-[45px] border border-cyan-300/40 bg-cyan-400/10 rounded-md cyber-square-float" style={{ animationDelay: '0.7s' }} />
            <div className="absolute bottom-[15%] right-[8%] w-[90px] h-[90px] border border-[#00AAFF]/45 bg-[#0057FF]/15 rounded-xl cyber-square-glow" style={{ animationDelay: '2.1s' }} />
            <div className="absolute top-[40%] right-[6%] w-[50px] h-[50px] border border-[#00AAFF]/35 bg-[#0057FF]/10 rounded-lg cyber-square-float" style={{ animationDelay: '4s' }} />
          </div>

          {/* Vignette mask so grid smoothly fades out on perimeter */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 40%, #02040a 90%)'
            }}
          />

          {/* Electric Blue Central Ambient Flare */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[420px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0, 87, 255, 0.28) 0%, rgba(0, 170, 255, 0.1) 45%, transparent 75%)',
              filter: 'blur(90px)',
            }}
          />

          {/* Hero Header Content — 100% CENTERED MIDDLE ALIGNED */}
          <div className="relative z-30 text-center max-w-4xl mx-auto py-12">
            
            {/* Pill Badge: Electric Blue Brand */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#020512]/90 border border-[#0057FF]/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,87,255,0.4)] text-cyan-300">
              <Sparkles className="w-4 h-4 text-[#00AAFF] animate-pulse" />
              <span>Next-Gen Outbound Intelligence • Portal 2026</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Main Headline: Bold, Electric Blue to Cyan */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Step Into The Future Of <br />
              <span className="bg-gradient-to-r from-[#0057FF] via-[#00AAFF] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,87,255,0.5)]">
                High-Ticket Lead Discovery
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
              Autonomous multi-platform radar crawling Google Maps, Upwork, LinkedIn and international registers with 100% verified emails, validated mobile numbers, and direct WhatsApp pitching.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 text-white bg-gradient-to-r from-[#0057FF] via-[#0070FF] to-[#00AAFF] shadow-[0_0_35px_rgba(0,87,255,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_55px_rgba(0,170,255,0.9)] hover:scale-[1.03] transition-all"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <a
                href="#pricing"
                className="px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base bg-black/60 hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/15 hover:border-[#0057FF]/60 backdrop-blur-md transition-all hover:scale-[1.03]"
              >
                View Plans
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. LOGOS MARQUEE SLIDER (STRICTLY NO STOP ON HOVER)
            Lists ALL 15 supported channels
            ═══════════════════════════════════════════════════════ */}
        <section id="marquee-slider" className="py-4 border-y border-[#0057FF]/35 bg-[#01030a] overflow-hidden select-none shadow-[inset_0_1px_20px_rgba(0,87,255,0.1)]">
          <div className="animate-marquee-continuous flex items-center gap-8">
            {[...SUPPORTED_CHANNELS, ...SUPPORTED_CHANNELS].map((channel, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#030614]/80 border border-[#0057FF]/30 hover:border-[#00AAFF]/60 shadow-[0_0_20px_rgba(0,87,255,0.1)] whitespace-nowrap shrink-0 transition-colors"
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
            SECTION 2: WHY AGENCIES LOSE DEALS (CUSTOMER PSYCHOLOGY / PROBLEM & SOLUTION)
            ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden bg-[#030712] border-y border-slate-800">
          <div className="absolute inset-0 cyber-grid-bg opacity-[0.14] pointer-events-none" />

          {/* Floating cyber squares */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[12%] right-[10%] w-[60px] h-[60px] border border-[#0057FF]/40 bg-[#0057FF]/10 rounded-xl cyber-square-float" />
            <div className="absolute bottom-[18%] left-[8%] w-[80px] h-[80px] border border-[#00AAFF]/40 bg-[#00AAFF]/10 rounded-xl cyber-square-glow" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0057FF]/20 border border-[#0057FF]/40 text-[#00AAFF] mb-4">
                <Target className="w-3.5 h-3.5 text-[#00AAFF]" />
                <span>The Outbound Dilemma</span>
              </span>
              <h2
                className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Why 94% of Cold Pitches Get Ignored
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Decision makers don't read generic emails. They respond to immediate pain points backed by proof.
              </p>
            </div>

            {/* Psychological Comparison Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* The Old Way */}
              <div className="p-8 rounded-3xl bg-[#090d1a] border border-rose-500/30 relative">
                <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-4">
                  ✕ THE OLD WAY (LOW CONVERSION)
                </div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Scraping Generic Lists & Spamming Inboxes
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                    <span>Buying static scraped databases where 40%+ emails bounce and damage your domain reputation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                    <span>Pitching business owners with no active intent or stated commercial budget.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                    <span>Sending generic cold emails with zero context about the company's real operational bottlenecks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                    <span>Zero phone or WhatsApp access, getting trapped behind gatekeepers and unmonitored info@ inboxes.</span>
                  </li>
                </ul>
              </div>

              {/* The Samvero Way */}
              <div className="p-8 rounded-3xl bg-[#060e24] border border-[#00AAFF]/40 relative shadow-[0_10px_40px_rgba(0,87,255,0.2)]">
                <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#0057FF]/25 text-cyan-300 border border-[#00AAFF]/40 mb-4">
                  ✓ THE SAMVERO WAY (HIGH-TICKET CLOSE)
                </div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Active High-Intent Telemetry + Direct WhatsApp
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Real-time crawls tracking active RFPs, tender postings, and businesses missing critical digital assets.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>100% DNS MX-verified company emails + verified ITU mobile numbers for direct WhatsApp pitching.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AI auto-analyzes the prospect's exact flaws (e.g. broken mobile layout, slow speed) before you pitch.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pre-calculated budget ranges ($1,500 - $35,000+) so you never waste time pitching underfunded leads.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Corporate Imagery & Workflow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              
              {/* Feature 1 */}
              <div className="rounded-3xl overflow-hidden bg-[#060b18] border border-slate-800 hover:border-[#00AAFF]/50 transition shadow-xl group flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                    alt="Corporate Boardroom Meeting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#0057FF] text-white">
                    BOARDROOM PROOF
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Executive Client Evidence
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Show up with verified corporate data, domain health audits, and vector proposals ready for signing on the first call.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-3xl overflow-hidden bg-[#060b18] border border-slate-800 hover:border-[#00AAFF]/50 transition shadow-xl group flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="Agency Workstation Collaboration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#00AAFF] text-white">
                    OUTBOUND VELOCITY
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Instant Multi-Territory Outreach
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Target the US, UK, UAE, or Pakistan. Pitch corporate decision makers via direct WhatsApp with 1-click tailored hooks.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl overflow-hidden bg-[#060b18] border border-slate-800 hover:border-[#00AAFF]/50 transition shadow-xl group flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                    alt="Corporate Handshake & Contract Closing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-600 text-white">
                    DEAL CLOSURE
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    1-Click Scope of Work Packages
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Eliminate weeks of back-and-forth. Send comprehensive SOW proposals with pricing breakdowns in under 60 seconds.
                  </p>
                </div>
              </div>

            </div>

            {/* 4-Pillar Architecture */}
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
            SECTION 3: PRICING (DEEP BLACK/DARK TECH SECTION WITH CYBER GRID)
            ═══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 relative overflow-hidden bg-[#02040a] border-t border-slate-800 smooth-scroll-perf">
          {/* Animated Square Grid lines */}
          <div className="absolute inset-0 cyber-grid-bg opacity-[0.14] pointer-events-none" />

          {/* Floating cyber squares */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[18%] left-[6%] w-[70px] h-[70px] border border-[#00AAFF]/40 bg-[#0057FF]/10 rounded-xl cyber-square-float" />
            <div className="absolute bottom-[20%] right-[8%] w-[90px] h-[90px] border border-cyan-400/40 bg-cyan-500/10 rounded-xl cyber-square-glow" />
          </div>
          
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
            SECTION 4: FAQ (DEEP BLACK TECH SECTION WITH CYBER GRID)
            ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden bg-[#030712] text-slate-100 border-t border-slate-800">
          {/* Animated Grid lines */}
          <div className="absolute inset-0 cyber-grid-bg opacity-[0.14] pointer-events-none" />

          {/* Floating cyber squares */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] right-[12%] w-[55px] h-[55px] border border-[#00AAFF]/40 bg-[#0057FF]/10 rounded-lg cyber-square-float" />
            <div className="absolute bottom-[25%] left-[10%] w-[65px] h-[65px] border border-cyan-400/40 bg-cyan-500/10 rounded-lg cyber-square-glow" />
          </div>

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0057FF]/15 border border-[#0057FF]/35 text-[#00AAFF] mb-4">
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
                    className="rounded-2xl overflow-hidden bg-[#060b18] border border-slate-800 transition hover:border-[#0057FF]/50"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 transition"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#00AAFF]' : 'text-slate-400'
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
            SECTION 5: FINAL CTA (DEEP BLACK TECH SECTION WITH CYBER SQUARES)
            ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden bg-[#02040a] border-t border-slate-800">
          <div className="absolute inset-0 cyber-grid-bg opacity-[0.16] pointer-events-none" />
          
          {/* Floating cyber squares */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] left-[15%] w-[80px] h-[80px] border border-[#00AAFF]/40 bg-[#0057FF]/10 rounded-xl cyber-square-float" />
            <div className="absolute bottom-[20%] right-[15%] w-[60px] h-[60px] border border-cyan-400/40 bg-cyan-500/10 rounded-xl cyber-square-glow" />
          </div>

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
