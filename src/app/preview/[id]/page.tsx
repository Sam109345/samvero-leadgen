'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_LEADS } from '@/lib/mock-data';
import { generateDeliverablesPackage } from '@/lib/deliverables-generator';
import { compileStandaloneHtml } from '@/lib/website-generator';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  CheckCircle, 
  Star, 
  Sparkles, 
  MapPin, 
  Globe, 
  Smartphone, 
  Palette, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Monitor,
  Tablet,
  Download,
  Moon,
  Sun,
  Code2,
  CheckCircle2,
  Wifi,
  Battery,
  Play
} from 'lucide-react';
import { Lead, MobileAppScreen, LogoConcept } from '@/types';

interface Props {
  params: {
    id: string;
  };
}

export default function WebsitePreviewPage({ params }: Props) {
  const { id } = params;
  const [activeTab, setActiveTab] = useState<'website' | 'mobile' | 'design'>('website');
  
  // Website Device Preview State
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Mobile App Carousel State (14 Screens with HD Images)
  const [mobileScreenIndex, setMobileScreenIndex] = useState(0);
  const [mobileCategoryFilter, setMobileCategoryFilter] = useState<string>('All');

  // Logo Concepts State
  const [logoBgMode, setLogoBgMode] = useState<'dark' | 'light'>('dark');
  const [copiedSvgId, setCopiedSvgId] = useState<string | null>(null);

  // Find lead by id or generate fallback
  let lead = INITIAL_LEADS.find((l) => l.id.toLowerCase() === id.toLowerCase());

  if (!lead) {
    const cleanName = id.replace(/^site-/, '').replace(/-/g, ' ');
    lead = {
      id,
      title: cleanName.toUpperCase(),
      businessName: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      type: 'gmb',
      platform: 'Google My Business',
      category: 'Local Business',
      country: 'Pakistan',
      city: 'Lahore',
      address: 'Main Boulevard, Gulberg, Lahore',
      businessAge: {
        years: 2,
        months: 0,
        isNew: false,
        label: 'Established (~2 yrs)',
        badgeColor: 'blue',
      },
      description: 'Exclusive local business offering top tier services.',
      postedAt: 'Today',
      contact: {
        email: `contact@${id}.com`,
        phone: '+92 321 0000000',
        hasWebsite: false,
      },
      tags: ['Verified', 'High Growth'],
      verified: true,
    };
  }

  const deliverables = generateDeliverablesPackage(lead);
  const site = deliverables.website;
  const websiteHtml = compileStandaloneHtml(site);

  const allScreens: MobileAppScreen[] = deliverables.mobileApp.screens || [];
  const screenCategories = ['All', 'Onboarding & Auth', 'Core Experience', 'Booking & Flow', 'Account & Support'];

  const filteredScreens = mobileCategoryFilter === 'All' 
    ? allScreens 
    : allScreens.filter(s => s.categoryTag === mobileCategoryFilter);

  const currentAppScreen: MobileAppScreen = allScreens[mobileScreenIndex] || allScreens[0];

  const handleCopySvg = (logo: LogoConcept) => {
    if (logo.svgMarkup) {
      navigator.clipboard.writeText(logo.svgMarkup);
      setCopiedSvgId(logo.id);
      setTimeout(() => setCopiedSvgId(null), 2000);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([websiteHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Floating Glassmorphism Toolbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              SAMVERO Hub
            </Link>
            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Client Showcase:</span>
              <span className="text-xs font-bold text-white">{site.businessName}</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold bg-blue-950 text-cyan-300 border border-blue-800">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {lead.businessAge.label}
              </span>
            </div>
          </div>

          {/* Deliverables Switcher Bar in Preview */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl text-xs font-bold border border-slate-800">
            <button
              onClick={() => setActiveTab('website')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'website' ? 'bg-[#007FED] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>9-Section Website (with Sliders)</span>
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'mobile' ? 'bg-[#007FED] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>14-Screen App</span>
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'design' ? 'bg-[#007FED] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>6 Vector SVG Logos</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.contactPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Client
            </a>
            <a
              href={`mailto:${site.contactEmail}?subject=Regarding Your New SAMVERO Deliverables Showcase`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white shadow-sm transition"
            >
              <Mail className="w-3.5 h-3.5" />
              Email Proposal
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: 9-SECTION INTERACTIVE WEBSITE WITH SLIDERS
         ========================================================================= */}
      {activeTab === 'website' && (
        <div className="flex-1 flex flex-col p-3 sm:p-5 max-w-7xl mx-auto w-full space-y-3">
          {/* Subheader Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#007FED]" />
                {site.businessName} &bull; {site.isEcommerce ? 'E-Commerce Storefront' : 'Clinical & High-Ticket Portal'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                9 Interactive Sections (with Sliders)
              </span>
            </div>

            {/* Viewport switch */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setDeviceViewport('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                  deviceViewport === 'desktop' ? 'bg-[#007FED] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceViewport('tablet')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                  deviceViewport === 'tablet' ? 'bg-[#007FED] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDeviceViewport('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                  deviceViewport === 'mobile' ? 'bg-[#007FED] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Complete HTML</span>
            </button>
          </div>

          {/* Iframe Viewport Container */}
          <div className="flex-1 min-h-[78vh] flex justify-center items-center bg-slate-950 rounded-3xl p-3 border border-slate-800 overflow-hidden shadow-2xl">
            <div
              className={`h-full min-h-[76vh] transition-all duration-300 rounded-2xl overflow-hidden bg-white shadow-xl ${
                deviceViewport === 'desktop'
                  ? 'w-full'
                  : deviceViewport === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              <iframe
                srcDoc={websiteHtml}
                title="SAMVERO 15-Section Website"
                className="w-full h-full min-h-[76vh] border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: EXACTLY 14-SCREEN POLISHED MOBILE APP CAROUSEL WITH REAL IMAGERY
         ========================================================================= */}
      {activeTab === 'mobile' && (
        <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col items-center space-y-6 w-full">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Mobile App Experience &bull; 14 Full Polished Screens with Real Imagery
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              {deliverables.mobileApp.appName}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Native cross-platform iOS &amp; Android design carousel built with Hermes JIT, biometric FaceID authentication, and instant checkout.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {screenCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setMobileCategoryFilter(cat);
                  if (cat !== 'All') {
                    const firstInCat = allScreens.findIndex(s => s.categoryTag === cat);
                    if (firstInCat !== -1) setMobileScreenIndex(firstInCat);
                  }
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  mobileCategoryFilter === cat
                    ? 'bg-[#007FED] text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat} {cat === 'All' ? `(${allScreens.length})` : ''}
              </button>
            ))}
          </div>

          {/* Phone Mockup + Details Grid */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full py-4">
            
            {/* Phone Frame with REAL IMAGERY */}
            <div className="relative w-[320px] h-[610px] bg-slate-950 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-600/30 flex flex-col shrink-0">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 animate-pulse" />
              </div>

              <div
                className={`flex-1 rounded-[40px] overflow-hidden bg-gradient-to-b ${currentAppScreen.bgColor} p-3.5 flex flex-col justify-between text-white shadow-inner transition-all duration-300`}
              >
                {/* Status Bar */}
                <div className="pt-4 flex justify-between text-[10px] text-white/80">
                  <span className="font-bold">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3 h-3" />
                    <span className="text-[9px] font-bold">5G</span>
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Pill */}
                <div className="flex items-center justify-between pt-2">
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-white/10 px-2 py-0.5 rounded-full">
                    #{currentAppScreen.screenNumber} &bull; {currentAppScreen.categoryTag}
                  </span>
                  <span className="text-[9px] text-white/60 font-semibold">{lead.businessName.split(' ')[0]}</span>
                </div>

                {/* Visual Imagery */}
                <div className="my-auto space-y-2 py-1">
                  {currentAppScreen.imageUrl && (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-lg border border-white/15 bg-slate-900 group">
                      <img 
                        src={currentAppScreen.imageUrl} 
                        alt={currentAppScreen.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {(currentAppScreen.visualType === 'video-player' || currentAppScreen.visualType === 'video-consultation') && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                        <span className="text-[10px] font-extrabold line-clamp-1 drop-shadow-sm">
                          {currentAppScreen.headerText}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="text-center space-y-0.5">
                    <h4 className="text-sm font-black tracking-tight leading-snug">
                      {currentAppScreen.title}
                    </h4>
                    <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">
                      {currentAppScreen.subtitle}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {currentAppScreen.elements.slice(0, 2).map((el, i) => (
                      <div
                        key={i}
                        className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2 text-xs flex items-center justify-between"
                      >
                        <div className="pr-1">
                          <span className="font-bold block text-[10px] text-white line-clamp-1">{el.label}</span>
                          {el.detail && (
                            <span className="text-[9px] text-slate-300 block line-clamp-1">{el.detail}</span>
                          )}
                        </div>
                        {el.badge && (
                          <span className="text-[8px] font-black bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded shrink-0">
                            {el.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-2 shrink-0 space-y-2">
                  <div className="flex items-center justify-around text-[9px] text-white/50 pt-1 border-t border-white/10">
                    <span className="text-cyan-300 font-bold">● Home</span>
                    <span>Catalog</span>
                    <span>Book</span>
                    <span>Chat</span>
                    <span>VIP</span>
                  </div>
                  <div className="w-24 h-1 bg-white/40 rounded-full mx-auto" />
                </div>

              </div>
            </div>

            {/* Navigation & Details */}
            <div className="max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Screen {currentAppScreen.screenNumber} of {allScreens.length}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {currentAppScreen.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setMobileScreenIndex((p) =>
                        p === 0 ? allScreens.length - 1 : p - 1
                      )
                    }
                    className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 shadow-sm transition"
                    title="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setMobileScreenIndex((p) =>
                        (p + 1) % allScreens.length
                      )
                    }
                    className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 shadow-sm transition"
                    title="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentAppScreen.subtitle}. Crafted with high-fidelity glassmorphism, responsive tactile haptics, and instant data synchronization.
              </p>

              {/* Specs Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-white block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Engineering Highlights:
                </span>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li>Zero-latency client state caching via Hermes engine</li>
                  <li>AES-256 end-to-end encrypted messaging &amp; bookings</li>
                  <li>Native iOS widgets and Android dynamic shortcuts</li>
                </ul>
              </div>

              {/* Filmstrip */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">
                  Quick Jump (All {allScreens.length} Screens):
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {allScreens.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setMobileScreenIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 transition ${
                        idx === mobileScreenIndex
                          ? 'bg-[#007FED] text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-[#007FED]'
                      }`}
                    >
                      #{s.screenNumber} {s.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: 3 VECTOR SVG LOGO CONCEPTS
         ========================================================================= */}
      {activeTab === 'design' && (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
                Brand Identity Kit &bull; 3 Vector SVG Concepts
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Signature Brand Marks for {site.businessName}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 px-2">Preview Contrast:</span>
              <button
                onClick={() => setLogoBgMode('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  logoBgMode === 'dark' ? 'bg-[#007FED] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Obsidian Dark</span>
              </button>
              <button
                onClick={() => setLogoBgMode('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  logoBgMode === 'light' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Alabaster White</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliverables.graphicDesign.logoConcepts.map((logo, i) => (
              <div
                key={logo.id || i}
                className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:border-[#007FED] transition duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                      Concept {i + 1}
                    </span>
                    <span className="text-xs text-slate-400">{logo.style.split('/')[0]}</span>
                  </div>

                  <div
                    className={`w-full h-44 rounded-2xl flex items-center justify-center p-4 transition-colors duration-200 border ${
                      logoBgMode === 'dark'
                        ? 'bg-black border-slate-800'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div
                      className="w-28 h-28 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: logo.svgMarkup || '' }}
                    />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-white">{logo.conceptName}</h4>
                    <span className="text-xs font-semibold text-[#007FED] block mb-2">
                      {logo.conceptSubtitle}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">{logo.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Typography:</span>
                      <span className="font-mono text-white font-bold">{logo.typography}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Mood:</span>
                      <span className="text-purple-400 font-semibold">{logo.mood}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopySvg(logo)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 font-bold text-xs text-slate-200 transition"
                >
                  {copiedSvgId === logo.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied Vector SVG!</span>
                    </>
                  ) : (
                    <>
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Copy SVG Vector Code</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-4 text-center text-xs">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-semibold text-slate-300">
            SAMVERO &bull; AI-Powered Lead Generation Platform &bull; Find the Right Leads. Build Better Connections.
          </p>
          <p className="text-slate-500">
            All deliverables dynamically generated for {site.businessName} &bull; 9 Web Sections (with Sliders), 14 HD App Screens, 6 Vector Logos
          </p>
        </div>
      </footer>
    </div>
  );
}
