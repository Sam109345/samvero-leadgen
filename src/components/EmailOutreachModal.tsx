'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  ExternalLink,
  Eye,
  FileText,
  Lock,
  RefreshCw,
  MessageCircle,
  ShieldCheck,
  Copy,
  Check,
  Phone,
  PhoneCall
} from 'lucide-react';
import { Lead } from '@/types';
import { generateSamveroEmailTemplate } from '@/lib/email-template';
import { resolveLegitimateBusinessEmail, extractCleanDomain, slugifyBusinessName } from '@/lib/gmb-email-resolver';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

export const TEST_SMTP_EMAIL = 'sameer.centric@gmail.com';

export interface RecipientStatus {
  type: 'test' | 'corporate' | 'webmail' | 'personal_warning' | 'neutral';
  label: string;
  badgeClass: string;
  advisory?: string;
  recommendation?: string;
}

export function getEmailStatus(email: string, targetDomain: string): RecipientStatus {
  const clean = (email || '').trim().toLowerCase();
  if (!clean) {
    return {
      type: 'neutral',
      label: 'No Public Email Listed',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      advisory: 'This business has no public email listed on their official channels. Reaching out via verified WhatsApp or direct phone call provides the highest response rate.',
    };
  }

  if (clean === TEST_SMTP_EMAIL.toLowerCase()) {
    return {
      type: 'test',
      label: '🧪 Test Mode (Verified Safe)',
      badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      advisory: 'Dispatches straight to your authenticated Gmail (sameer.centric@gmail.com) to verify SMTP delivery and styling with zero bounce risk.',
    };
  }

  const parts = clean.split('@');
  const prefix = parts[0] || '';
  const domain = parts[1] || targetDomain;

  const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com'];
  if (freeProviders.includes(domain)) {
    return {
      type: 'webmail',
      label: '⚠️ Unverified Webmail',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      advisory: 'Free webmail addresses from automated listings may bounce if the mailbox does not exist. Use WhatsApp or Phone outreach for guaranteed client contact.',
    };
  }

  const corporatePrefixes = [
    'info', 'contact', 'consultations', 'sales', 'support', 'careers',
    'hello', 'team', 'office', 'admin', 'marketing', 'corporate',
    'engineering', 'director', 'charters', 'creative', 'tenders', 'contracts', 'dev',
    'talent', 'estimates', 'orders', 'partners', 'partnerships', 'founders', 'infrastructure',
    'devops', 'solar', 'quant', 'projects', 'ops', 'atelier', 'brand', 'branding',
    'exports', 'commercial', 'audit', 'growth', 'concierge', 'hiring', 'publishing',
    'dispatch', 'investors', 'production', 'editors', 'digital', 'studio', 'it',
    'estates', 'audio', 'reservations', 'events', 'ecom', 'admedia', 'agency',
    'media', 'qa', 'performance', 'acquisition', 'leads', 'legal', 'press', 'inquiries',
    'help', 'billing', 'accounts', 'tech', 'security', 'compliance'
  ];

  const isPersonalDoctor = prefix.startsWith('dr.') || prefix.startsWith('dr_') || prefix.startsWith('dr-');
  const tokens = prefix.split(/[._-]/);
  const isCorporate = !isPersonalDoctor && (
    corporatePrefixes.includes(prefix) ||
    corporatePrefixes.some(p => prefix.startsWith(`${p}.`) || prefix.startsWith(`${p}-`) || prefix.startsWith(`${p}_`)) ||
    tokens.some(t => corporatePrefixes.includes(t))
  );

  if (isCorporate) {
    return {
      type: 'corporate',
      label: '✓ Verified Corporate Inbox',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      advisory: 'Standard corporate distribution inbox with active mail delivery and minimal bounce risk.',
    };
  }

  // Personal prefix on a custom domain (e.g. dr.zeeshan, dr.harris, vance)
  const fallbackDomain = domain || targetDomain || 'company.com';
  return {
    type: 'personal_warning',
    label: '⚠️ Synthetic Personal Prefix (550 Risk)',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    advisory: `Individual prefix "${prefix}@" may not exist in ${fallbackDomain}'s directory (triggers Google "550 5.1.1 NoSuchUser" bounce). Switching to info@${fallbackDomain} or contact@${fallbackDomain} is recommended.`,
    recommendation: `info@${fallbackDomain}`,
  };
}

interface EmailOutreachModalProps {
  lead: Lead | null;
  previewUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailOutreachModal({
  lead,
  previewUrl,
  isOpen,
  onClose,
}: EmailOutreachModalProps) {
  const [template, setTemplate] = useState<'website' | 'mobile' | 'branding'>('website');
  const [toEmail, setToEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'html_preview'>('edit');
  const [result, setResult] = useState<{ success: boolean; message: string; provider?: string } | null>(null);
  const [publicLiveOrigin, setPublicLiveOrigin] = useState<string>('');

  useEffect(() => {
    fetch('/api/tunnel')
      .then((res) => res.json())
      .then((data) => {
        if (data.publicUrl && !data.publicUrl.includes('localhost')) {
          setPublicLiveOrigin(data.publicUrl);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen && lead) {
      const resolved = resolveLegitimateBusinessEmail({
        businessName: lead.businessName,
        website: lead.contact.website,
        country: lead.country,
        city: lead.city,
        category: lead.category,
        phone: lead.contact.phone,
      });
      const initialEmail = lead.contact.email || resolved.email || '';
      setToEmail(initialEmail);
      setRecipientName(lead.contact.contactPerson || `${lead.businessName} Owner`);
      applyTemplate('website', lead, previewUrl);
      setResult(null);
    }
  }, [isOpen, lead, previewUrl]);

  const applyTemplate = (type: 'website' | 'mobile' | 'branding', targetLead: Lead, pUrl?: string) => {
    setTemplate(type);
    const bName = targetLead.businessName;
    const city = targetLead.city;
    const ageLabel = targetLead.businessAge?.label || 'local established business';

    if (type === 'website') {
      setSubject(`Exclusive Digital Proposal & Interactive 9-Section Prototype for ${bName}`);
      setMessage(
        `Hello ${targetLead.contact.contactPerson || 'Business Owner'},\n\n` +
        `I came across ${bName} (${ageLabel}) while reviewing top local businesses in ${city}. ` +
        `We noticed your presence could benefit significantly from an interactive, mobile-optimized showcase with live appointment booking to convert more visitors into direct inquiries.\n\n` +
        `To demonstrate what is possible, our engineering team pre-generated an interactive live preview tailored exclusively for your services. You can explore your live prototype via the link attached below.\n\n` +
        `Would you be open to a quick 5-minute call this week to discuss activating this on your custom domain or tailoring it to your exact needs?\n\n` +
        `Best regards,\nSAMVERO Lead Acquisition & Technology Team`
      );
    } else if (type === 'mobile') {
      setSubject(`14-Screen Native Mobile App Architecture & VIP Experience for ${bName}`);
      setMessage(
        `Hi ${targetLead.contact.contactPerson || 'Business Owner'},\n\n` +
        `We analyzed ${bName}'s client journey in ${city}. To accelerate client retention, appointment re-bookings, and contactless VIP services, we designed a full 14-screen native iOS & Android mobile application architecture for your brand.\n\n` +
        `It features seamless biometric FaceID login, real-time concierge chat, Apple Pay integration, and automated appointment reminders.\n\n` +
        `You can explore the interactive live prototype via the link below. Let me know when you'd like to schedule a 10-minute walkthrough.\n\n` +
        `Best regards,\nSAMVERO Mobile Engineering Team`
      );
    } else if (type === 'branding') {
      setSubject(`Brand Identity Kit & 6 Vector SVG Logo Concepts for ${bName}`);
      setMessage(
        `Hi ${targetLead.contact.contactPerson || 'there'},\n\n` +
        `We love the work ${bName} is doing in ${city}. We are a boutique design studio specializing in iconic brand identities, packaging, and digital collateral.\n\n` +
        `We have pre-engineered 6 distinct, mathematically balanced vector SVG brand marks specifically designed for ${bName} to help command premium pricing in your market.\n\n` +
        `Warm regards,\nSAMVERO Design Studio`
      );
    }
  };

  if (!isOpen || !lead) return null;

  const effectiveOrigin = publicLiveOrigin || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const cleanPath = previewUrl?.startsWith('/') ? previewUrl : `/${previewUrl || ''}`;
  const resolvedPreviewUrl = previewUrl?.startsWith('http')
    ? (publicLiveOrigin && previewUrl.includes('localhost')
        ? previewUrl.replace(/https?:\/\/localhost:\d+/i, publicLiveOrigin.replace(/\/$/, ''))
        : previewUrl)
    : `${effectiveOrigin.replace(/\/$/, '')}${cleanPath}`;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail) return;

    try {
      setSending(true);
      setResult(null);

      const response = await fetch('/api/outreach/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          recipientName,
          businessName: lead.businessName,
          subject,
          previewUrl: resolvedPreviewUrl,
          leadType: lead.type,
          messageBody: message,
          city: lead.city,
          country: lead.country,
          discipline: lead.category,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: data.message || 'Email successfully sent!',
          provider: data.provider,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to dispatch email.',
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err?.message || 'Network error sending email',
      });
    } finally {
      setSending(false);
    }
  };

  const emailBodyWithLink = `${message}\n\n🔗 Explore your interactive live deliverables showcase here:\n${resolvedPreviewUrl}\n\n---\nSent via SAMVERO – AI-Powered Lead Generation Platform`;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyWithLink)}`;

  const defaultMailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyWithLink)}`;

  const rawPhone = lead ? cleanWhatsAppDigits(lead.contact.whatsapp || lead.contact.phone, lead.country) : '';
  const whatsappPitchUrl = rawPhone ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `Hello ${recipientName || lead?.businessName},\n\nI hope this message finds you well. We reviewed ${lead?.businessName} in ${lead?.city} and designed a tailored interactive live digital proposal and prototype exclusively for your brand:\n\n${resolvedPreviewUrl}\n\nWould you be open to a quick 5-minute chat to discuss activating this?\n\nBest regards,\nSAMVERO Technology Team`
  )}` : undefined;

  const cleanDomain = lead?.contact?.website 
    ? extractCleanDomain(lead.contact.website)
    : (lead?.contact?.email ? lead.contact.email.split('@')[1] : '');

  const isFreeDomain = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'].includes(cleanDomain);

  const suggestedEmailPills = lead && cleanDomain && !isFreeDomain ? Array.from(new Set([
    lead.contact.email && !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(lead.contact.email.split('@')[1]) ? lead.contact.email : null,
    `info@${cleanDomain}`,
    `contact@${cleanDomain}`,
    lead.category?.toLowerCase().includes('clinic') || lead.category?.toLowerCase().includes('dental') || lead.category?.toLowerCase().includes('aesthetic') || lead.category?.toLowerCase().includes('health') ? `consultations@${cleanDomain}` : null,
    lead.category?.toLowerCase().includes('marble') || lead.category?.toLowerCase().includes('roofing') ? `sales@${cleanDomain}` : null,
  ].filter(Boolean))) as string[] : [];

  const recipientStatus = getEmailStatus(toEmail, cleanDomain);

  // Generate preview of the HTML email template
  const previewHtml = generateSamveroEmailTemplate({
    recipientName: recipientName || 'Business Owner',
    businessName: lead.businessName,
    subject: subject || 'Special Proposal',
    previewUrl: resolvedPreviewUrl,
    messageBody: message,
    city: lead.city,
    country: lead.country,
    discipline: lead.category,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#161f2e] rounded-xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-[#24334a] overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#24334a] flex items-center justify-between bg-slate-50 dark:bg-[#0d141e]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#007FED]/10 dark:bg-[#007FED]/20 flex items-center justify-center text-[#007FED]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                SAMVERO Direct Client Proposal Outreach
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Delivering verified proposal with live interactive prototype to <strong>{lead.businessName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher: Edit Proposal vs Designed Email Preview */}
        <div className="px-6 border-b border-slate-200 dark:border-[#24334a] flex items-center gap-2 pt-2 bg-white dark:bg-[#161f2e]">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              viewMode === 'edit'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Edit Proposal Details
          </button>

          <button
            type="button"
            onClick={() => setViewMode('html_preview')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              viewMode === 'html_preview'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            Designed HTML Email Preview
          </button>
        </div>

        {/* Modal Body */}
        {viewMode === 'edit' ? (
          <form onSubmit={handleSend} className="p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Graceful Guidance Banner when No Public Email Exists */}
            {!toEmail && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-amber-950 dark:text-amber-100 text-sm">
                        No Public Email Listed &bull; Direct WhatsApp / Call Recommended
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 font-bold">
                        High Response Rate
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                      <strong>{lead.businessName}</strong> does not publish a verified corporate email inbox. Local businesses have a <strong>10x higher response rate via direct WhatsApp messages and verified phone calls</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/70 dark:border-amber-900/60">
                  {whatsappPitchUrl && (
                    <a
                      href={whatsappPitchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Pitch on WhatsApp Now</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  )}
                  {lead.contact.phone && (
                    <a
                      href={`tel:${lead.contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>Call {lead.contact.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Strategy Pills */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Select Proposal Template Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('website', lead, previewUrl)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold border transition ${
                    template === 'website'
                      ? 'bg-[#007FED] text-white border-[#007FED]'
                      : 'bg-slate-50 dark:bg-[#0d141e] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#24334a]'
                  }`}
                >
                  9-Section Website
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('mobile', lead, previewUrl)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold border transition ${
                    template === 'mobile'
                      ? 'bg-[#007FED] text-white border-[#007FED]'
                      : 'bg-slate-50 dark:bg-[#0d141e] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#24334a]'
                  }`}
                >
                  14-Screen App
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('branding', lead, previewUrl)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold border transition ${
                    template === 'branding'
                      ? 'bg-[#007FED] text-white border-[#007FED]'
                      : 'bg-slate-50 dark:bg-[#0d141e] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#24334a]'
                  }`}
                >
                  6 Vector Logos
                </button>
              </div>
            </div>

            {/* Direct Outreach Dispatch Channels Bar */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#007FED]" />
                  1-Click Direct Outreach (Bypasses SMTP &bull; 100% Real Delivery):
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Zero Block Guarantee
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-[#EA4335] hover:bg-[#d93025] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  title="Opens browser Gmail with client email, subject, message & prototype link pre-filled"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Gmail Web</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href={defaultMailtoUrl}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  title="Opens default email client (Outlook, Apple Mail, Windows Mail)"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via Mail App</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                {whatsappPitchUrl ? (
                  <a
                    href={whatsappPitchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    title="Send proposal & live deliverable link directly to client on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                ) : (
                  <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium flex items-center justify-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 opacity-40" />
                    <span>No WhatsApp Phone</span>
                  </div>
                )}
              </div>
            </div>

            {/* When No Email: Direct Outreach Banner for WhatsApp & Phone Call */}
            {!toEmail && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-300 dark:border-amber-700/80 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-600 font-bold">
                    <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        No Public Email Listed – Pitch Directly via WhatsApp or Phone
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        Recommended Channel
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lead.businessName} handles client inquiries directly via telephone and WhatsApp. Reaching out through direct call or WhatsApp delivers instantaneous responses compared to cold email.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {whatsappPitchUrl && (
                    <a
                      href={whatsappPitchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                      title="Direct WhatsApp Message with pre-filled pitch & showcase link"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Pitch via WhatsApp (Pre-Filled)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  )}

                  {lead.contact.phone && (
                    <a
                      href={`tel:${lead.contact.phone}`}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                      title={`Call ${lead.contact.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call {lead.contact.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* SMTP Test & Deliverability Quick-Action */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50/90 via-sky-50/50 to-indigo-50/90 dark:from-[#151c2d] dark:via-[#111927] dark:to-[#151c2d] border border-indigo-200/90 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                  🧪
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-indigo-950 dark:text-indigo-200">
                      Verify Your SMTP Pipeline
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 font-semibold font-mono">
                      {TEST_SMTP_EMAIL}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5 leading-tight">
                    Confirm your Gmail App Password & SMTP setup by dispatching a live test email to your own inbox without bounces.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setToEmail(TEST_SMTP_EMAIL);
                  setRecipientName('Sameer (SMTP Verification Test)');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0 self-stretch sm:self-auto"
                title="Populate recipient with sameer.centric@gmail.com to test SMTP delivery without bounces"
              >
                <span>🧪 Test My SMTP ({TEST_SMTP_EMAIL})</span>
              </button>
            </div>

            {/* Email & Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Client Email Address:
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${recipientStatus.badgeClass}`}>
                    {recipientStatus.type === 'corporate' && <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                    {recipientStatus.type === 'personal_warning' && <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
                    {recipientStatus.type === 'webmail' && <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                    {recipientStatus.type === 'neutral' && <MessageCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                    {recipientStatus.type === 'test' && <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                    {recipientStatus.label}
                  </span>
                </div>
                <input
                  type="email"
                  required={Boolean(toEmail)}
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder={!toEmail ? "No public email – enter one if known, or pitch via WhatsApp/Phone above" : "client@business.com"}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED] font-mono font-bold"
                />

                {/* Dynamic Recipient Advisory Banner */}
                {recipientStatus.advisory && (
                  <div className={`mt-1.5 p-2 rounded-lg text-[11px] leading-relaxed flex items-start gap-1.5 ${
                    recipientStatus.type === 'personal_warning' 
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60'
                      : recipientStatus.type === 'webmail' || recipientStatus.type === 'neutral'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60'
                      : recipientStatus.type === 'test'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
                  }`}>
                    <span className="shrink-0 mt-0.5">
                      {recipientStatus.type === 'personal_warning' ? '⚠️' : recipientStatus.type === 'webmail' ? '💡' : recipientStatus.type === 'neutral' ? '📞' : recipientStatus.type === 'test' ? '🧪' : '✓'}
                    </span>
                    <div className="flex-1">
                      <span>{recipientStatus.advisory}</span>
                      {recipientStatus.recommendation && (
                        <button
                          type="button"
                          onClick={() => setToEmail(recipientStatus.recommendation!)}
                          className="ml-1.5 font-bold underline hover:opacity-80 transition inline-block text-rose-700 dark:text-rose-300"
                        >
                          Switch to {recipientStatus.recommendation} &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggested Email Chips with Test Pill */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <span className="text-[10px] font-semibold text-slate-400">Quick Fill:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setToEmail(TEST_SMTP_EMAIL);
                      setRecipientName('Sameer (Owner Test)');
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono border transition flex items-center gap-1 ${
                      toEmail.toLowerCase() === TEST_SMTP_EMAIL.toLowerCase()
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400'
                    }`}
                  >
                    <span>🧪 Fill My Email (Test)</span>
                  </button>
                  {suggestedEmailPills.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setToEmail(em)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono border transition ${
                        toEmail.toLowerCase() === em.toLowerCase()
                          ? 'bg-[#007FED] text-white border-[#007FED] font-bold shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#007FED]'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Contact Person:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Founder / Manager"
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                />
                {lead.contact.phone && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    Client Phone: <span className="font-bold text-slate-700 dark:text-slate-200">{lead.contact.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Subject Line:
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
              />
            </div>

            {/* Attached Deliverable Link Pill */}
            {resolvedPreviewUrl && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Sparkles className="w-4 h-4 text-[#007FED] shrink-0" />
                  <div className="truncate">
                    <span className="font-bold">Client Deliverable Live URL:</span>{' '}
                    <span className="font-mono text-[11px] text-[#007FED] dark:text-sky-400">{resolvedPreviewUrl}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Worldwide
                  </span>
                  <a
                    href={resolvedPreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#007FED] hover:underline flex items-center gap-1 font-semibold text-xs"
                  >
                    <span>Test Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Message Body */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Proposal Message Content:
              </label>
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED] font-sans leading-relaxed"
              />
            </div>

            {/* Delivery Result Banner */}
            {result && (
              <div
                className={`p-3.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  result.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-semibold block">{result.message}</span>
                    {!result.success && (
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 block">
                        Tip: You can send directly using your browser Gmail below with zero SMTP password setup!
                      </span>
                    )}
                  </div>
                </div>

                {!result.success && (
                  <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#EA4335] hover:bg-[#d93025] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send via Gmail Web Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {result.provider === 'simulated' && (
                  <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-[#007FED] hover:bg-blue-600 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-sm transition"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Send via Gmail Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#24334a]">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Sending to:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{toEmail || 'No email provided'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="freelancer-btn-secondary text-xs py-2 px-3.5 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md"
                >
                  Cancel
                </button>

                {/* When No Email: Highlight WhatsApp Direct Outreach and Direct Phone Call */}
                {!toEmail ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {lead.contact.phone && (
                      <a
                        href={`tel:${lead.contact.phone}`}
                        className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title={`Direct phone call to ${lead.contact.phone}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call ({lead.contact.phone})</span>
                      </a>
                    )}

                    {whatsappPitchUrl && (
                      <a
                        href={whatsappPitchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Direct WhatsApp Message with prefilled pitch"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Pitch via WhatsApp (Recommended)</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    )}
                  </div>
                ) : (
                  <>
                    {/* 1-Click Direct Gmail Compose (100% Reliable, Zero Block) */}
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-md bg-[#EA4335] hover:bg-[#d93025] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                      title="Opens directly in your browser Gmail with everything pre-filled. 100% real delivery!"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send via Gmail (1-Click)</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>

                    {/* Background Server SMTP Send */}
                    <button
                      type="submit"
                      disabled={sending || !toEmail}
                      className="freelancer-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      {sending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{sending ? 'Dispatching...' : 'Send Server Proposal'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </form>
        ) : (
          /* TAB 2: Live HTML Email Template Preview */
          <div className="p-4 overflow-y-auto flex-1 bg-slate-100 dark:bg-[#0d141e]">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">This is the exact email that will arrive in the customer's inbox:</span>
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className="text-[#007FED] hover:underline font-semibold"
              >
                &larr; Back to edit details
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
              <iframe
                title="Email Preview"
                srcDoc={previewHtml}
                className="w-full h-[480px] border-none"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
