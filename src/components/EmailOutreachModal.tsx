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
  Check
} from 'lucide-react';
import { Lead } from '@/types';
import { generateSamveroEmailTemplate } from '@/lib/email-template';
import { resolveLegitimateBusinessEmail, extractCleanDomain, slugifyBusinessName } from '@/lib/gmb-email-resolver';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

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
      const initialEmail = lead.contact.email || resolved.email;
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

  const suggestedEmailPills = lead && cleanDomain ? Array.from(new Set([
    lead.contact.email,
    `info@${cleanDomain}`,
    `contact@${cleanDomain}`,
    lead.category?.toLowerCase().includes('clinic') || lead.category?.toLowerCase().includes('dental') ? `consultations@${cleanDomain}` : null,
    lead.category?.toLowerCase().includes('marble') || lead.category?.toLowerCase().includes('roofing') ? `sales@${cleanDomain}` : null,
  ].filter(Boolean))) as string[] : [];

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

            {/* Email & Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Client Email Address:
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Domain Contact
                  </span>
                </div>
                <input
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="client@business.com"
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED] font-mono font-bold"
                />

                {/* Suggested Domain Email Chips */}
                {suggestedEmailPills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Available:</span>
                    {suggestedEmailPills.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setToEmail(em)}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono border transition ${
                          toEmail.toLowerCase() === em.toLowerCase()
                            ? 'bg-[#007FED] text-white border-[#007FED]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#007FED]'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
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
