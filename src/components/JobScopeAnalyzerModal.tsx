'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Send, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Layers, 
  DollarSign, 
  Zap, 
  FileText, 
  Smartphone, 
  Palette, 
  Code2, 
  Flame, 
  Check, 
  MessageCircle, 
  Phone, 
  Mail,
  AlertCircle
} from 'lucide-react';
import { Lead } from '@/types';
import { getJobRequirementSpec } from '@/lib/job-spec-helper';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

interface JobScopeAnalyzerModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDeliverablesStudio: (lead: Lead) => void;
  onOpenEmailPitch: (lead: Lead, previewUrl: string) => void;
}

export default function JobScopeAnalyzerModal({
  lead,
  isOpen,
  onClose,
  onOpenDeliverablesStudio,
  onOpenEmailPitch,
}: JobScopeAnalyzerModalProps) {
  const [activeTab, setActiveTab] = useState<'brief' | 'specs' | 'proposal'>('brief');
  const [copiedProposal, setCopiedProposal] = useState(false);

  if (!isOpen || !lead) return null;

  const spec = getJobRequirementSpec(lead);
  const previewUrl = `/preview/${lead.id}`;

  // Generated tailored proposal text based on job category
  const generatedProposal = `Hi ${lead.contact.contactPerson || 'Hiring Team'},\n\nI reviewed your project requirement for "${lead.title}" on ${spec.platformSource}.\n\nOur specialized team focuses exclusively on high-conversion ${spec.discipline} and we noticed your goal: ${spec.primaryGoal}\n\nTo give you immediate confidence before you award the contract, we have already synthesized a live, interactive deliverable draft for ${lead.businessName}:\n👉 Interactive Preview: ${typeof window !== 'undefined' ? window.location.origin : ''}${previewUrl}\n\nOur Deliverable Scope for this project includes:\n${spec.deliverablesDemanded.map(d => `• ${d}`).join('\n')}\n\nWe are available for an immediate start (${spec.urgency}). Let's connect via Zoom or WhatsApp to discuss your timeline!\n\nBest regards,\nSAMVERO Partner Director\nSAMVERO LeadGen Platform`;

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(generatedProposal);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'Upwork':
        return { bg: 'bg-emerald-600', text: 'Upwork Verified Job', color: 'text-emerald-500' };
      case 'Bark':
        return { bg: 'bg-blue-600', text: 'Bark.com Direct Inquiry', color: 'text-blue-500' };
      case 'LinkedIn':
        return { bg: 'bg-sky-600', text: 'LinkedIn Talent Lead', color: 'text-sky-500' };
      case 'Google My Business':
        return { bg: 'bg-rose-600', text: 'GMB Radar (No Website Target)', color: 'text-rose-500' };
      default:
        return { bg: 'bg-[#007FED]', text: 'Freelance Marketplace', color: 'text-[#007FED]' };
    }
  };

  const platformInfo = getPlatformBadge(spec.platformSource);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0d141e] border-b border-slate-200 dark:border-[#24334a] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Platform Origin Badge */}
              <span className={`text-[11px] font-bold text-white px-2.5 py-0.5 rounded shadow-xs ${platformInfo.bg}`}>
                {platformInfo.text}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Job ID: {spec.jobId}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Posted {lead.timeAgo || lead.postedAt || 'Just now'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
              {lead.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-[#24334a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-100/60 dark:bg-[#111927] border-b border-slate-200 dark:border-[#24334a] text-xs">
          
          {/* 1. Job Discipline */}
          <div className="p-3 bg-white dark:bg-[#161f2e] border border-slate-200/80 dark:border-[#24334a] rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Service Discipline</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-slate-100">
              <Layers className="w-4 h-4 text-[#007FED]" />
              <span className="line-clamp-1">{spec.discipline}</span>
            </div>
          </div>

          {/* 2. Budget Scope */}
          <div className="p-3 bg-white dark:bg-[#161f2e] border border-slate-200/80 dark:border-[#24334a] rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Client Budget Scope</span>
            <div className="flex items-center gap-1 mt-1 font-bold font-mono text-slate-900 dark:text-white text-sm">
              <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="line-clamp-1">{lead.budget || '$500 - $1,500 USD'}</span>
            </div>
          </div>

          {/* 3. Urgency */}
          <div className="p-3 bg-white dark:bg-[#161f2e] border border-slate-200/80 dark:border-[#24334a] rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Client Urgency</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span className="line-clamp-1">{spec.urgency}</span>
            </div>
          </div>

          {/* 4. Match Win Probability */}
          <div className="p-3 bg-white dark:bg-[#161f2e] border border-slate-200/80 dark:border-[#24334a] rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">AI Win Probability</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{spec.matchScore}% Match Score</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-[#24334a] flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('brief')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'brief'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Client Brief &amp; Problem Analysis
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Demanded Deliverables ({spec.deliverablesDemanded.length})
          </button>

          <button
            onClick={() => setActiveTab('proposal')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'proposal'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            1-Click Tailored Bid Proposal
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: Client Brief & Problem Statement */}
          {activeTab === 'brief' && (
            <div className="space-y-5">
              
              {/* Client Written Requirement */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Client Stated Job Brief:
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  "{lead.description}"
                </div>
              </div>

              {/* Primary Hiring Objective */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#007FED] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-xs sm:text-sm text-blue-950 dark:text-blue-200">
                    Primary Goal Behind This Hiring:
                  </h5>
                  <p className="text-xs text-blue-900 dark:text-blue-300 leading-normal">
                    {spec.primaryGoal}
                  </p>
                </div>
              </div>

              {/* Client Business Pain Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Key Business Pain Points We Are Solving:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {spec.painPoints.map((point, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1"
                    >
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                        Pain Point #0{idx + 1}
                      </span>
                      <p className="leading-snug">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SAMVERO Auto-Deliverable Solution Matrix */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Client Need vs SAMVERO Auto-Deliverables:
                </h4>
                <div className="border border-slate-200 dark:border-[#24334a] rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-[#24334a] text-xs">
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0d141e] font-bold text-slate-700 dark:text-slate-300 grid grid-cols-12 gap-2">
                    <span className="col-span-6">Client Requirement</span>
                    <span className="col-span-6">SAMVERO Auto-Synthesis Status</span>
                  </div>

                  <div className="px-4 py-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-6 font-medium text-slate-800 dark:text-slate-200">
                      High-converting responsive web presence
                    </span>
                    <span className="col-span-6 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Live Custom Landing Page Ready in Preview
                    </span>
                  </div>

                  <div className="px-4 py-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-6 font-medium text-slate-800 dark:text-slate-200">
                      Mobile application UI flow
                    </span>
                    <span className="col-span-6 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      14-Screen Native Mobile App Pre-rendered
                    </span>
                  </div>

                  <div className="px-4 py-3 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-6 font-medium text-slate-800 dark:text-slate-200">
                      Direct WhatsApp / Appointment booking
                    </span>
                    <span className="col-span-6 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Embedded WhatsApp Consultation CTA
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Technical Specifications & Deliverables Checklist */}
          {activeTab === 'specs' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Required Deliverables Checklist:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {spec.deliverablesDemanded.map((deliv, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-[#007FED] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                        {deliv}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Tech Stack */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#24334a]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recommended Tech Stack &amp; Tools:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {spec.techStackPreference.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="bg-slate-100 dark:bg-[#24334a] text-slate-800 dark:text-slate-200 text-xs px-3 py-1 rounded-md font-semibold border border-slate-200 dark:border-slate-700 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Client Verification Details */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg text-xs space-y-2">
                <h5 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Client Verification &amp; Hiring Quality:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-emerald-800 dark:text-emerald-400">
                  <div>• {spec.clientExperienceLevel}</div>
                  <div>• Payment Method Verified</div>
                  <div>• Phone &amp; Email Contact Verified</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 1-Click Tailored Bid Proposal */}
          {activeTab === 'proposal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">
                    Tailored Proposal for {spec.discipline}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Pre-filled with client requirements and your live preview deliverable link.
                  </p>
                </div>

                <button
                  onClick={handleCopyProposal}
                  className="freelancer-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md"
                >
                  {copiedProposal ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Proposal Text</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={generatedProposal}
                readOnly
                rows={11}
                className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-3 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#0d141e] border-t border-slate-200 dark:border-[#24334a] flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Contact Icons */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Direct Reach:</span>
            {cleanWhatsAppDigits(lead.contact.whatsapp || lead.contact.phone, lead.country) && (
              <a
                href={`https://wa.me/${cleanWhatsAppDigits(lead.contact.whatsapp || lead.contact.phone, lead.country)}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            {lead.contact.phone && (
              <a
                href={`tel:${lead.contact.phone}`}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                title="Phone Call Direct"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            {lead.contact.email && (
              <a
                href={`mailto:${lead.contact.email}`}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                title="Email Direct"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Right: Primary Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href={previewUrl}
              target="_blank"
              className="freelancer-btn-secondary text-xs sm:text-sm py-2 px-3 flex items-center gap-1.5 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#007FED] dark:text-[#38bdf8]" />
              <span>Live Preview URL</span>
            </Link>

            <button
              onClick={() => {
                onClose();
                onOpenDeliverablesStudio(lead);
              }}
              className="freelancer-btn-secondary text-xs sm:text-sm py-2 px-3 flex items-center gap-1.5 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md"
            >
              <Layers className="w-3.5 h-3.5 text-[#007FED] dark:text-[#38bdf8]" />
              <span>Deliverables Studio</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEmailPitch(lead, previewUrl);
              }}
              className="freelancer-btn-primary text-xs sm:text-sm py-2 px-4 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send Bid to Client
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
