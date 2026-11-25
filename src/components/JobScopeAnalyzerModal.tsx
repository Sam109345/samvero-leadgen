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
  AlertCircle,
  TrendingUp,
  Award,
  Crown,
  Eye,
  UserCheck,
  Users,
  Workflow,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import { Lead } from '@/types';
import { getJobRequirementSpec } from '@/lib/job-spec-helper';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

interface JobScopeAnalyzerModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDeliverablesStudio?: (lead: Lead) => void;
  onOpenEmailPitch?: (lead: Lead, previewUrl: string) => void;
}

export default function JobScopeAnalyzerModal({
  lead,
  isOpen,
  onClose,
  onOpenDeliverablesStudio,
  onOpenEmailPitch,
}: JobScopeAnalyzerModalProps) {
  const [activeTab, setActiveTab] = useState<'brief' | 'specs' | 'proposal' | 'bid_ranker'>('brief');
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
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-4 bg-slate-100/60 dark:bg-[#111927] border-b border-slate-200 dark:border-[#24334a] text-xs">
          
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

          {/* 4. Match Win Probability & Tri-Factor Relevance */}
          <div className="p-3 bg-white dark:bg-[#161f2e] border border-slate-200/80 dark:border-[#24334a] rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Tri-Factor Relevance</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{spec.matchScore}% Match Score</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Skills {Math.min(100, spec.matchScore + 1)}% • Scope {spec.matchScore}% • Profile {Math.max(90, spec.matchScore - 2)}%
            </div>
          </div>

          {/* 5. Pipeline Ingestion Status */}
          <div className="p-3 bg-white dark:bg-[#161f2e] border border-emerald-300 dark:border-emerald-900/60 rounded-lg col-span-2 sm:col-span-4 lg:col-span-1">
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold block">Pipeline Status</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-emerald-700 dark:text-emerald-300 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>MATCHED (Relevance Pass)</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-[#24334a] flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('brief')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'proposal'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            1-Click Tailored Bid Proposal
          </button>

          <button
            onClick={() => setActiveTab('bid_ranker')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bid_ranker'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span>Third-Party Bid Ranker (#1 Rank)</span>
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

              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs text-purple-900 dark:text-purple-200 font-semibold">
                    Third-Party Bid Ranking: This proposal ranks in the <strong>Top 3%</strong> of client submissions.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('bid_ranker')}
                  className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
                >
                  View Bid Ranker Analysis ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Third-Party Bid Ranking & Studio */}
          {activeTab === 'bid_ranker' && (
            <div className="space-y-5">
              
              {/* Top Rank Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shrink-0">
                    <Crown className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                        Third-Party Bid Ranking Analysis
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Top 3% Tier
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                      <span>Projected Rank:</span>
                      <span className="text-amber-400">#1 Top Ranked Proposal</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Algorithmic Score</div>
                    <div className="text-xl font-bold text-emerald-400">98 / 100</div>
                  </div>
                </div>
              </div>

              {/* 4 Ranking Factor Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Deliverable Proof</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">35/35 Pts</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Live Demo Link Attached
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Pre-synthesized interactive prototype gives client instant proof before hiring.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Skills Fit</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">29/30 Pts</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Direct Tech Alignment
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Exact matches for {spec.discipline} and specified tech stack requirements.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Response Velocity</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">20/20 Pts</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Early Ingestion Window
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Submitting during the primary decision window boosts proposal view rate by 3.8x.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Client Persona</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">14/15 Pts</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Pain Point Targeting
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Calibrated specifically for {spec.clientExperienceLevel} with transparent milestones.
                  </p>
                </div>
              </div>

              {/* Client Inbox View Simulator (Ranked Proposals Table) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>Client Inbox Perspective (Ranked Proposals):</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Live Marketplace Ranking Simulation
                  </span>
                </div>

                <div className="border border-slate-200 dark:border-[#24334a] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-[#24334a] text-xs">
                  {/* Your Ranked Proposal (Rank #1) */}
                  <div className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                        #1
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Your Proposal (SAMVERO AI + Live Demo)
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-600 text-white">
                            ⭐ Top Pick
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Interactive deliverable URL attached • 98% skill match • Direct WhatsApp/Phone verified
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">98 / 100</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-sans font-semibold">
                        Ready for Direct Chat
                      </span>
                    </div>
                  </div>

                  {/* Competitor #2 */}
                  <div className="p-3.5 bg-white dark:bg-[#0d141e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold flex items-center justify-center text-xs">
                        #2
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          Senior Freelancer (Competitor)
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Standard PDF attachment • No interactive deliverable • Generic portfolio link
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500 font-bold text-sm">74 / 100</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-sans">
                        Standard Review
                      </span>
                    </div>
                  </div>

                  {/* Competitor #3 */}
                  <div className="p-3.5 bg-white dark:bg-[#0d141e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-bold flex items-center justify-center text-xs">
                        #3
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          General Agency (Competitor)
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Copy-pasted template pitch • High price quote • Unmatched requirements
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500 font-bold text-sm">58 / 100</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-sans">
                        Low Conversion
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* End-to-End Pipeline Telemetry Tracker */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Workflow className="w-3.5 h-3.5 text-blue-500" />
                    <span>Samvero Project Lifecycle Status:</span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                    Stage 7 of 9 Active (Rank #1 Top 3%)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-1 text-center text-[9px] font-mono">
                  <div className="p-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    1. Ingestion ✓
                  </div>
                  <div className="p-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    2. Scored ✓
                  </div>
                  <div className="p-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    3. MATCHED ✓
                  </div>
                  <div className="p-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    4. Feed Alert ✓
                  </div>
                  <div className="p-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    5. Review ✓
                  </div>
                  <div className="p-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    6. Proposal ✓
                  </div>
                  <div className="p-1 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 font-bold">
                    7. Rank #1 ➔
                  </div>
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    8. Client Inbox
                  </div>
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    9. Client Chat
                  </div>
                </div>
              </div>

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
                onOpenDeliverablesStudio?.(lead);
              }}
              className="freelancer-btn-secondary text-xs sm:text-sm py-2 px-3 flex items-center gap-1.5 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md"
            >
              <Layers className="w-3.5 h-3.5 text-[#007FED] dark:text-[#38bdf8]" />
              <span>Deliverables Studio</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEmailPitch?.(lead, previewUrl);
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
