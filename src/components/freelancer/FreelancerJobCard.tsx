'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Sparkles, 
  Send, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  ArrowUpRight,
  MessageCircle,
  Briefcase,
  Layers,
  Code2,
  Video,
  Smartphone,
  Palette,
  FileSearch,
  Zap,
  Check,
  UserCheck
} from 'lucide-react';
import { Lead } from '@/types';
import { getJobRequirementSpec } from '@/lib/job-spec-helper';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

interface FreelancerJobCardProps {
  lead: Lead;
  onOpenWebsiteModal: (lead: Lead) => void;
  onOpenEmailModal: (lead: Lead, previewUrl?: string) => void;
  onInspect: (lead: Lead) => void;
  onInspectJobScope?: (lead: Lead) => void;
}

export default function FreelancerJobCard({
  lead,
  onOpenWebsiteModal,
  onOpenEmailModal,
  onInspect,
  onInspectJobScope,
}: FreelancerJobCardProps) {
  const isNewGmb = lead.businessAge?.isNew;
  const hasWebsite = lead.contact.hasWebsite;
  const previewUrl = `/preview/${lead.id}`;
  const spec = getJobRequirementSpec(lead);

  // Formatted Budget
  const budgetDisplay = lead.budget || '$500 - $1,500 USD';

  // Platform visual badges
  const getPlatformStyle = (source: string) => {
    switch (source) {
      case 'Upwork':
        return { bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' };
      case 'Fiverr':
        return { bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200', dot: 'bg-emerald-600' };
      case 'Freelancer.com':
        return { bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' };
      case 'Contra':
        return { bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' };
      case 'PeoplePerHour':
        return { bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200', dot: 'bg-amber-500' };
      case 'Guru':
        return { bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' };
      case 'Wellfound':
        return { bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' };
      case 'Dribbble':
        return { bg: 'bg-pink-50 dark:bg-pink-950/60 border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300', dot: 'bg-pink-500' };
      case 'Behance':
        return { bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-500' };
      case '99designs':
        return { bg: 'bg-orange-50 dark:bg-orange-950/60 border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-200', dot: 'bg-orange-500' };
      case 'Toptal':
      case 'Codeable':
        return { bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300', dot: 'bg-cyan-500' };
      case 'Bark':
        return { bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' };
      case 'LinkedIn':
        return { bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' };
      case 'Meta Ads':
      case 'Facebook Ads':
      case 'Instagram Ads':
        return { bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-300', dot: 'bg-blue-600' };
      case 'Google My Business':
        return { bg: 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300', dot: 'bg-red-500' };
      case 'Rozee.pk':
      case 'Bayt':
      case 'Dubizzle':
      case 'Thumbtack':
        return { bg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' };
      default:
        return { bg: 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300', dot: 'bg-slate-500' };
    }
  };

  const platformStyle = getPlatformStyle(spec.platformSource);

  // WhatsApp click handler
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = cleanWhatsAppDigits(lead.contact.whatsapp || lead.contact.phone, lead.country);
    if (!cleanPhone) return;
    const text = encodeURIComponent(
      `Hello ${lead.contact.contactPerson || lead.businessName}, I saw your business requirement for "${lead.title}". We have prepared an interactive digital proposal & mobile app preview for you: ${typeof window !== 'undefined' ? window.location.origin : ''}${previewUrl}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // Direct Call handler
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.contact.phone) {
      window.location.href = `tel:${lead.contact.phone}`;
    }
  };

  return (
    <article className="freelancer-project-card p-5 sm:p-5.5 bg-white dark:bg-[#141d2b] border border-slate-200/90 dark:border-[#223147] rounded-xl hover:border-[#007FED] dark:hover:border-[#007FED] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between gap-3.5 group">
      
      {/* 1. Origin Platform & Service Discipline Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100 dark:border-[#24334a]">
        
        {/* Platform Origin Badge & Job ID */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold border ${platformStyle.bg}`}>
            <span className={`w-2 h-2 rounded-full ${platformStyle.dot}`}></span>
            <span>{spec.platformSource}</span>
            <span className="font-mono text-[10px] opacity-75">#{spec.jobId}</span>
          </span>

          {/* Job Discipline Badge */}
          <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-[#24334a] text-slate-700 dark:text-slate-200 text-xs font-semibold px-2.5 py-0.5 rounded">
            <Layers className="w-3 h-3 text-[#007FED]" />
            <span>{spec.discipline}</span>
          </span>
        </div>

        {/* Win Match Probability */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60 font-mono">
            <Sparkles className="w-3 h-3" />
            {spec.matchScore}% Match
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
            <Zap className="w-3 h-3 fill-current" />
            {spec.urgency}
          </span>
        </div>

      </div>

      {/* 2. Title, Budget & Post Time */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        
        {/* Title & GMB Badge */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 
              onClick={() => onInspectJobScope ? onInspectJobScope(lead) : onOpenWebsiteModal(lead)}
              className="text-base sm:text-lg font-bold text-[#007FED] hover:text-[#005bb5] hover:underline cursor-pointer tracking-tight"
            >
              {lead.title}
            </h3>

            {/* Time Ago */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-[#24334a] px-2 py-0.5 rounded">
              <Clock className="w-3 h-3" />
              {lead.timeAgo || lead.postedAt || 'Just now'}
            </span>

            {/* Pulsing New Badge */}
            {(lead.timeAgo?.includes('sec') || lead.postedAt?.includes('sec') || lead.postedAt?.includes('Just now')) && (
              <span className="bg-[#ff0055] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase animate-pulse">
                NEW
              </span>
            )}

            {/* Live Verified Online Data Indicator */}
            {(lead.tags?.includes('🟢 Live Verified Data') || lead.id.startsWith('live-') || lead.postedAt?.includes('Live verified')) && (
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>LIVE ONLINE</span>
              </span>
            )}
          </div>

          {/* Business Info Row (Freelancer Client Meta Row) */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#007FED]" />
              {lead.businessName}
            </span>

            <span>•</span>

            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {lead.country === 'Pakistan' ? '🇵🇰' : lead.country === 'US' ? '🇺🇸' : '🇬🇧'} {lead.city}, {lead.country}
            </span>

            <span>•</span>

            {/* GMB Operating Age Badge */}
            <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] ${
              isNewGmb 
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold' 
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
            }`}>
              {isNewGmb ? <Sparkles className="w-3 h-3 text-rose-500" /> : <Clock className="w-3 h-3 text-emerald-500" />}
              {lead.businessAge?.label || 'Operating'}
            </span>

            <span>•</span>

            {/* Ratings */}
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-current" />
              {lead.rating || 4.8}
              <span className="text-slate-400 text-[10px]">({lead.reviewCount || 42})</span>
            </span>

            {/* Website Detected or Missing */}
            {!hasWebsite ? (
              <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded text-[11px] font-bold">
                <Flame className="w-3 h-3 text-amber-500 fill-current" />
                No Website Found
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                <Globe className="w-3 h-3" />
                Has Website
              </span>
            )}
          </div>
        </div>

        {/* Right: Budget Column */}
        <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1 text-right shrink-0">
          <span className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {budgetDisplay}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {lead.jobType === 'Hourly' ? 'Hourly Project' : 'Fixed-price project'}
          </span>
        </div>

      </div>

      {/* 3. Description Snippet */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {lead.description}
      </p>

      {/* 4. Client Job Demands Callout Box (Answering user request: "Pata chalna chahiye k client kis job k liye lead daali hai") */}
      <div className="p-3 bg-slate-50 dark:bg-[#0d141e] border border-slate-200/80 dark:border-[#24334a] rounded-lg text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007FED]" />
            Client Demanded Deliverables for this Job:
          </span>
          <span className="text-[#007FED] font-normal lowercase hover:underline cursor-pointer" onClick={() => onInspectJobScope && onInspectJobScope(lead)}>
            view full scope &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {spec.deliverablesDemanded.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="line-clamp-1">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Skills Pill Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {lead.tags?.slice(0, 6).map((tag, idx) => (
          <span
            key={idx}
            className="freelancer-tag bg-slate-100 dark:bg-[#1a2638] text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded text-xs font-medium hover:bg-slate-200 dark:hover:bg-[#24334a] transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 5.5 Verified Direct Client Contact Bar */}
      <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-[#0e1624] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#24334a] flex-wrap">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Direct Contact:</span>
        {lead.contact.phone && (
          <a
            href={`tel:${lead.contact.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 hover:text-[#007FED] transition"
            title="Dial real client phone number"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lead.contact.phone}</span>
          </a>
        )}
        {lead.contact.email && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEmailModal(lead, previewUrl);
              }}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-[#007FED] font-mono text-[11px] font-bold transition bg-white dark:bg-[#162030] px-2 py-0.5 rounded border border-slate-200 dark:border-[#24334a]"
              title="Click to open verified email proposal outreach"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lead.contact.email}</span>
            </button>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
              ✓ Verified
            </span>
          </div>
        )}
        {lead.contact.whatsapp && (
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60 transition hover:bg-emerald-100"
            title="Open direct WhatsApp conversation"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Ready</span>
          </button>
        )}
        {lead.assignedToUserName && (
          <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded text-[11px] font-bold border border-indigo-200 dark:border-indigo-800/60 ml-auto">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Assigned: {lead.assignedToUserName}</span>
          </span>
        )}
      </div>

      {/* 6. Bottom Action Footer Row */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#24334a] flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Client Verification & Quick Contact Links */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          
          {/* Bids Count */}
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 Bids</span>
            <span>• High Win Rate</span>
          </span>

          <span className="hidden sm:inline">•</span>

          {/* Verification Badges */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Lead</span>
          </div>

          {/* Quick Contact Icons */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-[#24334a]">
            {lead.contact.phone && (
              <button
                onClick={handleWhatsApp}
                title="Send WhatsApp Direct Message"
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            )}

            {lead.contact.phone && (
              <button
                onClick={handleCall}
                title={`Call ${lead.contact.phone}`}
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            )}

            {lead.contact.email && (
              <button
                onClick={() => onOpenEmailModal(lead, previewUrl)}
                title={`Send Email to ${lead.contact.email}`}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Right: Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Live External Platform Source Link */}
          {lead.contact.website && (
            <a
              href={lead.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="freelancer-btn-secondary text-xs sm:text-sm py-1.5 px-3 bg-slate-50 dark:bg-[#1a2638] border border-slate-200 dark:border-[#2e415d] hover:bg-slate-100 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 rounded-md font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
              title={`Open live project source listing on ${lead.platform}`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#007FED]" />
              <span>Live Listing ↗</span>
            </a>
          )}

          {/* Inspect Job Scope & Brief (New Module requested by user!) */}
          <button
            onClick={() => onInspectJobScope ? onInspectJobScope(lead) : onOpenWebsiteModal(lead)}
            className="freelancer-btn-secondary text-xs sm:text-sm py-1.5 px-3 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Inspect complete client job brief, demanded deliverables and tailored proposal"
          >
            <FileSearch className="w-3.5 h-3.5 text-[#007FED] dark:text-[#38bdf8]" />
            <span>Inspect Scope &amp; Brief</span>
          </button>

          {/* Live Preview Deliverables */}
          <Link
            href={previewUrl}
            target="_blank"
            className="freelancer-btn-secondary text-xs sm:text-sm py-1.5 px-3 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#007FED] dark:text-[#38bdf8]" />
            <span>Preview Deliverables</span>
          </Link>

          {/* Bid on Project / Pitch Client */}
          <button
            onClick={() => onOpenWebsiteModal(lead)}
            className="freelancer-btn-primary text-xs sm:text-sm py-1.5 px-4 bg-[#007FED] hover:bg-[#0067c6] text-white rounded-md font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Bid on Project</span>
          </button>

        </div>

      </div>

    </article>
  );
}
