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
  Send,
  TrendingUp,
  MessageSquare,
  Users,
  Check,
  XCircle,
  Eye,
  FileCheck2,
  Filter,
  AlertTriangle,
  BellOff,
  Clock,
  ArrowDown,
  HelpCircle,
  Compass,
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
      {/* Animated Cyber Grid Matrix */}
      <div className="absolute inset-0 cyber-grid-bg opacity-[0.14] pointer-events-none" />

      {/* Floating Cyber Squares */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[14%] right-[12%] w-[60px] h-[60px] border border-[#00AAFF]/40 bg-[#0057FF]/10 rounded-lg cyber-square-float" />
        <div className="absolute bottom-[20%] left-[8%] w-[70px] h-[70px] border border-cyan-400/40 bg-cyan-500/10 rounded-xl cyber-square-glow" />
      </div>

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
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
                  alt="Enterprise Telemetry & Discovery Workstation"
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

          {/* SAMVERO PROJECT PROCESSING & BID RANKING ENGINE (User Architectural Flow) */}
          <div className="space-y-8 pt-4">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#0057FF]/20 border border-[#00AAFF]/40 text-[#00AAFF]">
                <Cpu className="w-3.5 h-3.5" />
                END-TO-END PROJECT PROCESSING &amp; BID RANKING
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                How Samvero <span className="text-neon">Processes Projects</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                The algorithmic pipeline connecting multi-source project ingestion to ranked client proposal delivery.
              </p>
            </div>

            {/* Visual Step-by-Step Flow Matrix */}
            <div className="glass-card border border-blue-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-b from-[#060e24] to-[#020512] shadow-2xl">
              
              {/* Flow Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                
                {/* 1. PROJECT INGESTION */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 01
                    </span>
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Project Ingestion</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Samvero continuously queries Upwork, Freelancer.com, GMB, Bark, LinkedIn, and RemoteOK live feeds every 10 seconds.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
                    ⚡ 10s Ingestion Frequency
                  </div>
                </div>

                {/* 2. SKILLS + REQUIREMENTS + RELEVANCE */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 02
                    </span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-cyan-400" />
                    <span>Relevance Evaluation</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Processes <strong className="text-white">Skills + Project Requirements + Profile Relevance</strong> to compute multi-factor suitability score.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
                    🎯 3-Pillar Relevance Scoring
                  </div>
                </div>

                {/* 3. MATCHED vs NOT MATCHED GATEWAY */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 03
                    </span>
                    <Filter className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>MATCHED / NOT MATCHED</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>MATCHED: Pushed to Live Feed</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-300 font-semibold">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>NOT MATCHED: Noise Discarded</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                    ✓ 90%+ Precision Pass Filter
                  </div>
                </div>

                {/* 4. PROJECT FEED & NOTIFICATIONS */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 04
                    </span>
                    <Radio className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Feed &amp; Notifications</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Qualified projects arrive in real-time. Instant alerts trigger via Audio Chime, WhatsApp, and Dashboard Notification Hub.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-amber-400">
                    🔔 Zero-Delay Push Routing
                  </div>
                </div>

                {/* 5. USER VIEWS PROJECT (TUM PROJECT DEKHTE HO) */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 05
                    </span>
                    <Eye className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span>User Project Inspection</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    You inspect full scope: client budget, stated pain points, demanded deliverables, and pre-generated live website preview.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-blue-300">
                    🔍 Tum Project Dekhte Ho
                  </div>
                </div>

                {/* 6. BID / PROPOSAL GENERATION */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 06
                    </span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>BID / Proposal Synthesis</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1-Click tailored proposal is generated with deliverables checklist, scope terms, and live interactive prototype URL link.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
                    ✍️ AI Proposal + Live Demo Link
                  </div>
                </div>

                {/* 7. THIRD PARTY BID RANKING */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 07
                    </span>
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Third Party Bid Ranking</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Proposal is algorithmically calibrated against competitor bids. Having an interactive preview propels your pitch into the <strong className="text-purple-300">Top 3% of bids</strong>.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-purple-300">
                    🏆 #1 - #3 Top Tier Ranking
                  </div>
                </div>

                {/* 8. CLIENT RECEIVES RANKED PROPOSALS */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-blue-500/30 hover:border-cyan-400/60 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                      STEP 08
                    </span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-400" />
                    <span>Client Receives Ranked Proposals</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Client reviews incoming bids prioritized by relevance and verified proof. Your submission stands out at the top of their inbox.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-indigo-300">
                    📥 Client Ko Ranked Proposals
                  </div>
                </div>

                {/* 9. CLIENT ENGAGEMENT: VIEWS / PROFILE / CHAT */}
                <div className="p-5 rounded-2xl bg-[#091124] border border-emerald-500/40 hover:border-emerald-400 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      STEP 09
                    </span>
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Client Views, Profile Visit &amp; Chat</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Client clicks the live demo link, reviews your credentials, and opens direct communication via WhatsApp, Phone, or Portal Chat.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400 font-bold">
                    🚀 Closed Deal &amp; Contract Award
                  </div>
                </div>

              </div>

              {/* Bottom Visual Flow Banner */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Workflow className="w-4 h-4" />
                  <span>Continuous 9-Stage Execution Cycle</span>
                </span>
                <span className="text-slate-300">
                  Ingestion ➔ Scoring ➔ Matched ➔ Feed ➔ Proposal ➔ Bid Ranking ➔ Client Chat
                </span>
              </div>

            </div>
          </div>

          {/* MISSED LEAD VS. LOST LEAD ARCHITECTURAL GUIDE */}
          <div className="glass-card neon-border rounded-3xl p-6 sm:p-10 relative overflow-hidden space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                  ARCHITECTURAL DEEP-DIVE
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Agar Project Miss Ho Gaya To Kya Hota Hai?
                </h3>
                <p className="text-sm text-slate-400">
                  Yahan <span className="text-amber-400 font-semibold">&quot;Missed Lead&quot;</span> aur <span className="text-rose-400 font-semibold">&quot;Lost Lead&quot;</span> ko alag samjho — marketplace physics &amp; bidding opportunities explained.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  Official Freelancer Flow
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison: Missed vs Lost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missed Lead Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1836] to-[#081024] border border-amber-500/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    CASE A: NOTIFICATION MISS HUI
                  </span>
                  <BellOff className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>What is a Missed Lead?</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-[#050b18]/60 p-3.5 rounded-xl border border-slate-800">
                  <p className="font-semibold text-amber-200">Example Scenario:</p>
                  <p>1. Client ne WordPress project post kiya.</p>
                  <p>2. Tumhari skills us project se perfectly match karti hain.</p>
                  <p>3. Notification ya Project Feed mein project show hua.</p>
                  <p>4. Tum online nahi thay ya busy thay aur notification nahi dekhi.</p>
                  <p>5. Project abhi bhi platform per open aur active hai.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Ye lead necessarily lost nahi hui!</strong> Tum manually project feed, search, ya Browse se us project ko baad mein find karke bid kar sakte ho, jab tak project active/open ho.
                  </span>
                </div>
              </div>

              {/* Lost Lead Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1e0f18] to-[#12080f] border border-rose-500/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    CASE B: CONTRACT AWARDED / CLOSED
                  </span>
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>What is a Lost Lead?</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-[#10050b]/60 p-3.5 rounded-xl border border-slate-800">
                  <p className="font-semibold text-rose-200">Terminal Conditions:</p>
                  <p>1. Client ne kisi doosre freelancer ka bid accept/award kar diya.</p>
                  <p>2. Milestone escrow deposit initiate ho gaya aur project close hua.</p>
                  <p>3. Client ne project ko cancel ya delete kar diya.</p>
                  <p>4. Standard bidding window (typically 30 days) expire ho gayi.</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Sirf is condition mein lead lost hoti hai.</strong> Notification na dekhne se lead delete nahi hoti.
                  </span>
                </div>
              </div>
            </div>

            {/* Official Freelancer.com Documentation Facts */}
            <div className="p-6 rounded-2xl bg-[#081022] border border-blue-500/30 space-y-4">
              <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Agar Tumne Project Dekha Hi Nahi? Official Marketplace Truth</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Freelancer ka system publicly aur officially ye <strong className="text-white">kabhi nahi kehta</strong> ke: 
                <span className="text-amber-300 italic font-medium"> &quot;Agar freelancer ne notification miss ki to project automatically special &apos;Missed Leads&apos; folder mein chala jayega.&quot;</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Aisa koi shadow ya penalty feature official Freelancer documentation mein exist nahi karta. Freelancer officially projects ko <strong className="text-white font-mono">Browse → Projects</strong> se bhi find karne deta hai.
              </p>
            </div>

            {/* Practical Step-by-Step Flowchart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                  PRACTICAL STEP-BY-STEP RECOVERY FLOW
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Missed Notification ➔ Still Biddable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative">
                {[
                  {
                    step: '01',
                    title: 'PROJECT POSTED',
                    desc: 'Client posts WordPress or Web development project',
                    icon: Database,
                  },
                  {
                    step: '02',
                    title: 'MATCHING / FEED',
                    desc: 'Algorithmic matching tags your relevant skill profile',
                    icon: Cpu,
                  },
                  {
                    step: '03',
                    title: 'NOTIFICATION',
                    desc: 'Push chime & feed badge generated in real-time',
                    icon: Radio,
                  },
                  {
                    step: '04',
                    title: 'YOU MISS IT',
                    desc: 'You were offline, asleep, or away from workstation',
                    icon: BellOff,
                  },
                  {
                    step: '05',
                    title: 'REMAINS AVAILABLE',
                    desc: 'Project stays public & open in marketplace catalog',
                    icon: Clock,
                  },
                  {
                    step: '06',
                    title: 'SEARCH / FEED',
                    desc: 'You browse or search project feed later at your convenience',
                    icon: Search,
                  },
                  {
                    step: '07',
                    title: 'YOU CAN STILL BID',
                    desc: 'Submit winning proposal + live demo preview URL',
                    icon: CheckCircle2,
                  },
                ].map((item, idx) => {
                  const StepIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#091124] border border-blue-500/20 hover:border-cyan-400/50 transition flex flex-col justify-between space-y-2 group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-cyan-400">
                            {item.step}
                          </span>
                          <StepIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition" />
                        </div>
                        <h5 className="text-xs font-bold text-white tracking-tight">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                          {item.desc}
                        </p>
                      </div>
                      {idx < 6 && (
                        <div className="pt-2 flex justify-end text-slate-600 group-hover:text-cyan-400 transition">
                          <ArrowRight className="w-3 h-3 hidden lg:block" />
                          <ArrowDown className="w-3 h-3 block lg:hidden" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Insight Takeaway */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 via-[#0057FF]/20 to-cyan-900/30 border border-[#00AAFF]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0057FF]/30 border border-[#00AAFF]/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#00AAFF]" />
                </div>
                <div>
                  <p className="font-bold text-white">
                    Samvero 10-Second Telemetry Sync Ensures Zero Missed Windows
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Even if you were away for hours, Samvero keeps all active projects cached and sorted so you can bid on every legitimate lead before it closes.
                  </p>
                </div>
              </div>
              <Link
                href="/#opportunities"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shrink-0 shadow-lg shadow-blue-500/25"
              >
                Browse Live Feed
              </Link>
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
