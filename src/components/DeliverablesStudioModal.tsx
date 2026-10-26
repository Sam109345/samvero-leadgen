'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Smartphone, 
  Palette, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Mail, 
  ExternalLink, 
  Check, 
  Copy, 
  Share2, 
  Layers, 
  ShieldCheck, 
  Download,
  Building2,
  CheckCircle2,
  Monitor,
  Tablet,
  Play,
  Sun,
  Moon,
  Code2,
  ArrowRight,
  Wifi,
  Battery,
  Lock,
  QrCode,
  MapPin,
  MessageCircle,
  Award,
  CreditCard,
  Radio
} from 'lucide-react';
import { Lead, DeliverablesPackage, MobileAppScreen, LogoConcept } from '@/types';
import { generateDeliverablesPackage } from '@/lib/deliverables-generator';
import { compileStandaloneHtml } from '@/lib/website-generator';

interface DeliverablesStudioModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchOutreach: (lead: Lead, deliverableType: string, previewUrl: string) => void;
}

export default function DeliverablesStudioModal({
  lead,
  isOpen,
  onClose,
  onDispatchOutreach,
}: DeliverablesStudioModalProps) {
  const [activeTab, setActiveTab] = useState<'website' | 'mobile' | 'design' | 'sow'>('website');
  
  // Website Device Preview State
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Mobile App Carousel State (14 Screens with Images)
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [mobileCategoryFilter, setMobileCategoryFilter] = useState<string>('All');

  // Logo Concepts State (6 Vector SVG Concepts with Company Name)
  const [logoBgMode, setLogoBgMode] = useState<'dark' | 'light'>('dark');
  const [copiedSvgId, setCopiedSvgId] = useState<string | null>(null);

  // Live Public URL State
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [isLiveTunnelActive, setIsLiveTunnelActive] = useState(false);

  // General Copy State
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch live public tunnel URL from /api/tunnel
    if (isOpen) {
      fetch('/api/tunnel')
        .then(res => res.json())
        .then(data => {
          if (data?.success && data.publicUrl) {
            setPublicUrl(data.publicUrl);
            setIsLiveTunnelActive(data.isLive);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !lead) return null;

  const deliverables: DeliverablesPackage = lead.deliverablesPackage || generateDeliverablesPackage(lead);
  const websiteHtml = compileStandaloneHtml(deliverables.website);
  
  // Resolve active client preview URL (Live tunnel prioritized over localhost)
  const baseOrigin = publicUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const previewPath = `/preview/${lead.id}`;
  const fullLiveUrl = `${baseOrigin.replace(/\/$/, '')}${previewPath}`;

  const allScreens: MobileAppScreen[] = deliverables.mobileApp.screens || [];
  const screenCategories = ['All', 'Onboarding & Auth', 'Core Experience', 'Booking & Flow', 'Account & Support'];

  const filteredScreens = mobileCategoryFilter === 'All' 
    ? allScreens 
    : allScreens.filter(s => s.categoryTag === mobileCategoryFilter);

  const currentScreen: MobileAppScreen = allScreens[currentScreenIndex] || allScreens[0];

  const handleCopySpecs = () => {
    const textToCopy = `SAMVERO Deliverable Package for ${lead.businessName} (${lead.businessAge.label}):\n` +
      `- 9-Section Interactive Website with Sliders: ${deliverables.website.heroHeadline}\n` +
      `- 14-Screen Native Mobile App with HD Imagery: ${deliverables.mobileApp.appName} (14 Polished Screens)\n` +
      `- 6 Vector SVG Logo Concepts: Geometric Prism, Luxury Serif Crest, Nexus Tech Modern, Architectural Monolith, Diamond Horizon, Kinetic Velocity\n` +
      `- Enterprise SOW: ${deliverables.softwareSow.projectTitle}\n` +
      `Live Client Showcase URL: ${fullLiveUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    a.download = `${lead.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-7xl h-[94vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Top Header Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007FED] to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                  SAMVERO Deliverables Studio
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#007FED] dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                  Client Ready
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  15 Web Sections &bull; 14 App Screens with Imagery &bull; 3 SVG Logos
                </span>
                {isLiveTunnelActive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-purple-600 animate-pulse" />
                    Live Web URL Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored for <strong>{lead.businessName}</strong> &bull; {lead.city}, {lead.country} ({lead.businessAge.label})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySpecs}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Specs!' : 'Copy Brief'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 transition"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Deliverables Navigation Tabs */}
        <div className="px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 overflow-x-auto text-xs font-bold">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('website')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                activeTab === 'website'
                  ? 'bg-[#007FED] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>15-Section Website</span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-white/20 text-white">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mobile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                activeTab === 'mobile'
                  ? 'bg-[#007FED] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile App Carousel</span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950">
                14 Screens (HD Images)
              </span>
            </button>

            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                activeTab === 'design'
                  ? 'bg-[#007FED] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>6 Vector SVG Logos</span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-400 text-slate-950">
                SVG
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sow')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                activeTab === 'sow'
                  ? 'bg-[#007FED] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Software SOW</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onClose();
                onDispatchOutreach(lead, activeTab, fullLiveUrl);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#007FED] to-blue-600 text-white font-bold transition shadow-sm hover:from-blue-600 hover:to-blue-700"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send {activeTab.toUpperCase()} to Client</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 bg-slate-100/70 dark:bg-slate-950 p-4 sm:p-6 overflow-y-auto">
          
          {/* =========================================================================
              TAB 1: 15-SECTION COMPREHENSIVE PRODUCTION WEBSITE SHOWCASE
             ========================================================================= */}
          {activeTab === 'website' && (
            <div className="h-full flex flex-col space-y-3">
              {/* Toolbar: Sections overview + Responsive Device Switcher + Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#007FED]" />
                    {deliverables.website.isEcommerce ? 'E-Commerce Storefront' : 'Clinical & High-Ticket Portal'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    9 Production Sections (with Sliders)
                  </span>
                </div>

                {/* Viewport Width Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setDeviceViewport('desktop')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                      deviceViewport === 'desktop'
                        ? 'bg-white dark:bg-slate-900 text-[#007FED] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                    title="Desktop 100%"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setDeviceViewport('tablet')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                      deviceViewport === 'tablet'
                        ? 'bg-white dark:bg-slate-900 text-[#007FED] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                    title="Tablet 768px"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet</span>
                  </button>
                  <button
                    onClick={() => setDeviceViewport('mobile')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                      deviceViewport === 'mobile'
                        ? 'bg-white dark:bg-slate-900 text-[#007FED] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                    title="Mobile 375px"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadHtml}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Complete HTML</span>
                  </button>
                  <a
                    href={fullLiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#007FED] dark:text-cyan-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  >
                    <span>Open Live Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Sections Breakdown Ribbon */}
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500 dark:text-slate-400 scrollbar-thin">
                <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">9 Interactive Sections:</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">1. Announcement Bar</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">2. Luxury Header &amp; Brand SVG</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">3. Hero + HD Showcase</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">4. 4-Pillar Value Props</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">5. Interactive Services Slider Carousel</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">6. 360 Spotlight Deep-Dive</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">7. Before &amp; After Transformation Slider</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">8. Verified Reviews Carousel Slider</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs shrink-0">9. VIP Concierge Booking Engine &amp; 4-Column Footer</span>
              </div>

              {/* Viewport Frame with Live Iframe */}
              <div className="flex-1 flex justify-center items-center overflow-hidden bg-slate-200/50 dark:bg-slate-950/80 rounded-2xl p-2 border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full transition-all duration-300 shadow-xl rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 ${
                    deviceViewport === 'desktop'
                      ? 'w-full'
                      : deviceViewport === 'tablet'
                      ? 'w-[768px]'
                      : 'w-[375px]'
                  }`}
                >
                  <iframe
                    srcDoc={websiteHtml}
                    title="SAMVERO 9-Section Interactive Website Preview"
                    className="w-full h-full border-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: EXACTLY 14-SCREEN POLISHED MOBILE APP CAROUSEL WITH REAL IMAGES
             ========================================================================= */}
          {activeTab === 'mobile' && (
            <div className="h-full flex flex-col space-y-4">
              {/* Category Filter Pills Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Filter Screens:</span>
                  {screenCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setMobileCategoryFilter(cat);
                        if (cat !== 'All') {
                          const firstInCat = allScreens.findIndex(s => s.categoryTag === cat);
                          if (firstInCat !== -1) setCurrentScreenIndex(firstInCat);
                        }
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition shrink-0 ${
                        mobileCategoryFilter === cat
                          ? 'bg-[#007FED] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {cat} {cat === 'All' ? `(${allScreens.length})` : ''}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#007FED] bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                    Screen {currentScreen.screenNumber} of {allScreens.length}
                  </span>
                </div>
              </div>

              {/* Main Screen Preview & Details Grid */}
              <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
                
                {/* iPhone 16 Pro Luxury Frame with REAL IMAGES */}
                <div className="relative w-[320px] h-[610px] bg-slate-950 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-600/30 flex flex-col shrink-0">
                  {/* Dynamic Island */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 animate-pulse" />
                  </div>

                  {/* Inner Screen Display with High-Res Image Integration */}
                  <div
                    className={`flex-1 rounded-[40px] overflow-hidden bg-gradient-to-b ${currentScreen.bgColor} p-3.5 flex flex-col justify-between text-white relative transition-all duration-300 shadow-inner`}
                  >
                    {/* Top Bar Status */}
                    <div className="pt-4 flex items-center justify-between text-[10px] text-white/80 shrink-0">
                      <span className="font-bold">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3 h-3" />
                        <span className="text-[9px] font-bold">5G</span>
                        <Battery className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Screen Identification Pill */}
                    <div className="flex items-center justify-between pt-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-white/10 px-2 py-0.5 rounded-full">
                        #{currentScreen.screenNumber} &bull; {currentScreen.categoryTag}
                      </span>
                      <span className="text-[9px] text-white/60 font-semibold">{lead.businessName.split(' ')[0]}</span>
                    </div>

                    {/* Central Visual Component with REAL PHOTOGRAPHY */}
                    <div className="my-auto space-y-2 py-1">
                      
                      {/* High-Resolution Media Container */}
                      {currentScreen.imageUrl && (
                        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-lg border border-white/15 bg-slate-900 group">
                          <img 
                            src={currentScreen.imageUrl} 
                            alt={currentScreen.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          
                          {/* Visual Overlay Badges */}
                          {currentScreen.visualType === 'before-after-split' && (
                            <div className="absolute top-2 left-2 right-2 flex justify-between">
                              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white shadow-sm">
                                Clinical Proof
                              </span>
                              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-sm">
                                Verified
                              </span>
                            </div>
                          )}

                          {(currentScreen.visualType === 'video-player' || currentScreen.visualType === 'video-consultation') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                          )}

                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                            <span className="text-[10px] font-extrabold line-clamp-1 drop-shadow-sm">
                              {currentScreen.headerText}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Screen Header & Description */}
                      <div className="text-center space-y-0.5">
                        <h4 className="text-sm font-black tracking-tight leading-snug">
                          {currentScreen.title}
                        </h4>
                        <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">
                          {currentScreen.subtitle}
                        </p>
                      </div>

                      {/* Screen Elements Cards */}
                      <div className="space-y-1.5 pt-1">
                        {currentScreen.elements.slice(0, 2).map((el, i) => (
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

                    {/* Bottom Micro Bar & Home Indicator */}
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

                {/* Carousel Navigation & Screen Details Panel */}
                <div className="max-w-md w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                        Screen {currentScreen.screenNumber} of {allScreens.length} &bull; {currentScreen.categoryTag}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {currentScreen.title}
                      </h3>
                    </div>

                    {/* Prev / Next Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentScreenIndex((prev) =>
                            prev === 0 ? allScreens.length - 1 : prev - 1
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition"
                        title="Previous Screen"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentScreenIndex((prev) =>
                            (prev + 1) % allScreens.length
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition"
                        title="Next Screen"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentScreen.subtitle}. Native React Native / Flutter components with micro-animations, biometric FaceID support, push notifications, and sub-100ms response latency.
                  </p>

                  {/* Architecture & Engineering Specs Box */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Production Architecture Highlights:
                    </span>
                    <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Hermes JIT runtime engine with instant image pre-fetching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Apple Pay &bull; Google Pay 1-click biometric checkout</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Real-time GPS tracking &amp; WhatsApp concierge webhooks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Strict HIPAA &amp; PCI-DSS compliant cloud data encryption</span>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Jump Filmstrip for All 14 Screens */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Quick Jump (All {allScreens.length} Screens):
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                      {allScreens.map((s, idx) => (
                        <button
                          key={s.id}
                          onClick={() => setCurrentScreenIndex(idx)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 transition ${
                            idx === currentScreenIndex
                              ? 'bg-[#007FED] text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#007FED]'
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
              TAB 3: 3 VECTOR SVG LOGO CONCEPTS & BRAND IDENTITY
             ========================================================================= */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                      AI Brand Identity Suite
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      3 Vector SVG Concepts
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Signature Brand Marks for {deliverables.graphicDesign.brandName}
                  </h3>
                </div>

                {/* Dark / Light Preview Toggle */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 px-2">Preview Background:</span>
                  <button
                    onClick={() => setLogoBgMode('dark')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      logoBgMode === 'dark'
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Obsidian Dark</span>
                  </button>
                  <button
                    onClick={() => setLogoBgMode('light')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      logoBgMode === 'light'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Alabaster White</span>
                  </button>
                </div>
              </div>

              {/* 3 PERFECTLY DESIGNED LOGO CONCEPTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deliverables.graphicDesign.logoConcepts.map((logo, idx) => (
                  <div
                    key={logo.id || idx}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:border-[#007FED] transition duration-200"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Concept {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {logo.style.split('/')[0]}
                        </span>
                      </div>

                      {/* Interactive SVG Display Box */}
                      <div
                        className={`w-full h-44 rounded-2xl flex items-center justify-center p-4 transition-colors duration-200 border ${
                          logoBgMode === 'dark'
                            ? 'bg-slate-950 border-slate-800 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      >
                        <div
                          className="w-28 h-28 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: logo.svgMarkup || '' }}
                        />
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {logo.conceptName}
                        </h4>
                        <span className="text-xs font-semibold text-[#007FED] block mb-2">
                          {logo.conceptSubtitle}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {logo.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">Type Pairing:</span>
                          <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            {logo.typography}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">Brand Mood:</span>
                          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                            {logo.mood}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopySvg(logo)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 transition"
                    >
                      {copiedSvgId === logo.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied Vector SVG!</span>
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

          {/* =========================================================================
              TAB 4: SOFTWARE SOW
             ========================================================================= */}
          {activeTab === 'sow' && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Enterprise Scope of Work (SOW)
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {deliverables.softwareSow.projectTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {deliverables.softwareSow.executiveSummary}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
                  Recommended Architecture:
                </span>
                <div className="flex flex-wrap gap-2">
                  {deliverables.softwareSow.recommendedStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-900"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliverables.softwareSow.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#007FED]">{m.duration}</span>
                      <span className="text-[10px] font-bold text-slate-400">Step {idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{m.title}</h4>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                      {m.deliverables.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {m.investment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>SAMVERO Verified Assets &bull; 9 Web Sections with Sliders, 14 HD App Screens, 6 Vector SVG Logos &bull; Ready for Instant Client Dispatch</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onDispatchOutreach(lead, activeTab, fullLiveUrl);
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs transition shadow-md shadow-blue-500/20"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send {activeTab.toUpperCase()} to Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
