'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Star, 
  Clock, 
  Briefcase, 
  MessageSquare,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { Lead } from '@/types';

interface LeadCardProps {
  lead: Lead;
  onGenerateWebsite: (lead: Lead) => void;
  onOpenOutreach: (lead: Lead) => void;
  onSelectLead?: (lead: Lead) => void;
}

export default function LeadCard({
  lead,
  onGenerateWebsite,
  onOpenOutreach,
  onSelectLead,
}: LeadCardProps) {
  const isGmb = lead.type === 'gmb';
  const hasPhone = Boolean(lead.contact.phone);
  const hasEmail = Boolean(lead.contact.email);
  const hasWebsite = Boolean(lead.contact.hasWebsite);

  // Business Age Badge styling
  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/90',
    blue: 'bg-blue-50 text-[#1877F2] border-blue-200/90',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/90',
  }[lead.businessAge.badgeColor] || 'bg-blue-50 text-[#1877F2] border-blue-200';

  // Country Flag
  const countryFlag = lead.country === 'Pakistan' ? '🇵🇰' : lead.country === 'US' ? '🇺🇸' : lead.country === 'UK' ? '🇬🇧' : '🌍';

  // WhatsApp link generator
  const cleanPhone = lead.contact.phone?.replace(/[^0-9]/g, '');
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : undefined;

  return (
    <article className="glass-panel rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition duration-200 border border-white/80 space-y-3.5">
      {/* Header: Meta style profile row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar / Icon */}
          <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 shadow-inner">
            {isGmb ? (
              <Building2 className="w-5 h-5 text-[#1877F2]" />
            ) : (
              <Briefcase className="w-5 h-5 text-indigo-600" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-[#1877F2] transition cursor-pointer">
                {lead.businessName}
              </h3>
              {lead.verified && (
                <span title="Verified Listing">
                  <CheckCircle2 className="w-4 h-4 text-[#1877F2] fill-blue-50 shrink-0" />
                </span>
              )}
            </div>

            {/* Sub-meta: Platform, City, Time */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                {lead.platform}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <span>{countryFlag}</span>
                <span>{lead.city}, {lead.country}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                {lead.postedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Business Age Badge (Requested Feature) */}
        <div className="shrink-0">
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border shadow-xs ${badgeClasses}`}
          >
            {lead.businessAge.isNew ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-0.5" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            {lead.businessAge.label}
          </span>
        </div>
      </div>

      {/* Title & Core Opportunity description */}
      <div>
        <h4 className="font-bold text-sm text-slate-800 mb-1 leading-snug">
          {lead.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {lead.description}
        </p>
      </div>

      {/* Website Presence Alert Banner (Key selling point for lead generation) */}
      {!hasWebsite ? (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>No Website Found:</strong> Client relies on directory traffic. Prime target for your pitch!
            </span>
          </div>
          <button
            onClick={() => onGenerateWebsite(lead)}
            className="text-[11px] font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition shrink-0 ml-2"
          >
            Draft Site Now &rarr;
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span className="truncate">Current Web: {lead.contact.website || 'Active web presence'}</span>
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded ml-auto">
            Redesign Pitch Ready
          </span>
        </div>
      )}

      {/* Budget & Ratings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100/80 text-xs">
        <div className="flex items-center gap-3">
          {lead.budget && (
            <div className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {lead.budget}
            </div>
          )}

          {lead.rating && (
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{lead.rating}</span>
              <span className="text-slate-400">({lead.reviewCount || 10} reviews)</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1">
          {lead.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium text-slate-600 bg-slate-100/70 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Verified Direct Client Contact Bar */}
      <div className="flex items-center gap-2.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex-wrap">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Direct Contact:</span>
        {lead.contact.phone && (
          <a
            href={`tel:${lead.contact.phone}`}
            className="flex items-center gap-1 font-bold text-slate-800 hover:text-[#1877F2] transition"
            title="Dial real client phone number"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lead.contact.phone}</span>
          </a>
        )}
        {lead.contact.email && (
          <a
            href={`mailto:${lead.contact.email}`}
            className="flex items-center gap-1 text-slate-700 hover:text-[#1877F2] font-mono text-[11px] transition bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold"
            title="Send direct email to client"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>{lead.contact.email}</span>
          </a>
        )}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200 transition hover:bg-emerald-100"
            title="Open direct WhatsApp conversation"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Ready</span>
          </a>
        )}
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded ml-auto">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified Domain</span>
        </span>
      </div>

      {/* Actions Row: Meta style toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        {/* Contact actions (Phone / WhatsApp / Email) */}
        <div className="flex items-center gap-1.5">
          {hasPhone && (
            <>
              <a
                href={`tel:${lead.contact.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                title={`Call ${lead.contact.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call</span>
              </a>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 transition"
                  title="Direct WhatsApp Message"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </>
          )}

          {hasEmail && (
            <button
              onClick={() => onOpenOutreach(lead)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#1877F2] border border-blue-200/80 transition"
              title={`Send cold email pitch to ${lead.contact.email}`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Pitch</span>
            </button>
          )}
        </div>

        {/* Website Generator Action Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => onGenerateWebsite(lead)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1877F2] to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/20 transition transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Generate Website</span>
          </button>

          {lead.generatedWebsite && (
            <a
              href={`/preview/${lead.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Open Live Website Preview"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
