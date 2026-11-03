'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  RotateCw,
  FileText,
  Briefcase,
  History,
  MessageSquare,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  User,
  Layers,
  ArrowRight,
  Tag,
  Star,
  FolderOpen,
  BookmarkPlus,
} from 'lucide-react';
import { Lead } from '@/types';
import RichTextEditor, { sanitizeHtmlContent } from '@/components/editor/RichTextEditor';
import { extractClientFirstName, formatGreeting, ProjectPitchCategory } from '@/lib/pitch-generator';

export type LeadStatusOption =
  | 'New Lead'
  | 'Approached'
  | 'Waiting for Client Response'
  | 'Follow-up Required'
  | 'Interested'
  | 'Not Interested'
  | 'Wasted Lead'
  | 'Converted / Won'
  | 'Closed';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadStatusChanged?: (leadId: string, newStatus: LeadStatusOption) => void;
  onUpdateLeadStatus?: (leadId: string, status: any) => void;
  onOpenEmailModal?: (lead: Lead) => void;
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onLeadStatusChanged,
  onUpdateLeadStatus,
  onOpenEmailModal,
}: LeadDetailModalProps) {
  // Navigation tabs inside Lead Detail
  const [activeTab, setActiveTab] = useState<'overview' | 'email_pitch' | 'bid_proposal' | 'followups' | 'notes' | 'history'>('overview');

  // Lead State
  const [currentStatus, setCurrentStatus] = useState<LeadStatusOption>('New Lead');
  const [approachedAt, setApproachedAt] = useState<string | null>(null);
  const [lastContactDate, setLastContactDate] = useState<string | null>(null);
  const [nextFollowupDate, setNextFollowupDate] = useState<string | null>(null);
  const [openedAt, setOpenedAt] = useState<string | null>(null);

  // Email Pitch State
  const [pitchCategory, setPitchCategory] = useState<string>('Website Development');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [emailPlainText, setEmailPlainText] = useState('');
  const [isDraftDirty, setIsDraftDirty] = useState(false);
  const [isDraftingAi, setIsDraftingAi] = useState(false);
  const [aiVariationCount, setAiVariationCount] = useState(0);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Email Templates State
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Bid / Proposal State
  const [bidTitle, setBidTitle] = useState('');
  const [bidContent, setBidContent] = useState('');
  const [bidDeliverables, setBidDeliverables] = useState<string[]>([]);
  const [bidTimeline, setBidTimeline] = useState('5-7 Business Days');
  const [bidInvestment, setBidInvestment] = useState('');
  const [bidStatus, setBidStatus] = useState<'draft' | 'submitted'>('draft');
  const [bidSubmittedAt, setBidSubmittedAt] = useState<string | null>(null);
  const [isGeneratingBid, setIsGeneratingBid] = useState(false);

  // Follow-ups & Notes & History State
  const [followups, setFollowups] = useState<any[]>([]);
  const [newFollowupDate, setNewFollowupDate] = useState('');
  const [newFollowupNotes, setNewFollowupNotes] = useState('');
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Notifications / Banners
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch email templates
  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (data.success && Array.isArray(data.templates)) {
        setAvailableTemplates(data.templates);
      }
    } catch (err) {
      console.warn('Failed to fetch templates:', err);
    }
  }, []);

  // Load Lead Status, Logs, Drafts, Follow-ups when modal opens
  const fetchLeadDetails = useCallback(async (targetLeadId: string) => {
    try {
      const res = await fetch(`/api/leads/${targetLeadId}/status`);
      const data = await res.json();
      if (data.success) {
        setCurrentStatus(data.status || 'New Lead');
        setApproachedAt(data.approachedAt || null);
        setLastContactDate(data.lastContactDate || null);
        setNextFollowupDate(data.nextFollowupDate || null);
        setOpenedAt(data.openedAt || null);
        setActivityLogs(data.activityLogs || []);
        setFollowups(data.followups || []);
        setNotes(data.notes || []);

        if (data.emailDraft) {
          setEmailSubject(data.emailDraft.subject || '');
          setEmailHtml(data.emailDraft.htmlContent || '');
          setEmailPlainText(data.emailDraft.plainText || '');
          setPitchCategory(data.emailDraft.category || 'Website Development');
          setIsDraftDirty(false);
        } else {
          // Initialize empty draft
          setEmailSubject('');
          setEmailHtml('');
          setEmailPlainText('');
          setIsDraftDirty(false);
        }

        if (data.bidDraft) {
          setBidTitle(data.bidDraft.title || '');
          setBidContent(data.bidDraft.content || '');
          setBidDeliverables(data.bidDraft.deliverables || []);
          setBidTimeline(data.bidDraft.timeline || '5-7 Days');
          setBidInvestment(data.bidDraft.investment || '');
          setBidStatus(data.bidDraft.status || 'draft');
          setBidSubmittedAt(data.bidDraft.submittedAt || null);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch lead workspace data:', err);
    }
  }, []);

  useEffect(() => {
    if (isOpen && lead) {
      setActionMessage(null);
      setRecipientEmail(lead.contact?.email || '');
      setPitchCategory(lead.category || 'Website Development');
      setBidInvestment(lead.budget || '$750 - $1,500 USD');
      fetchLeadDetails(lead.id);
      fetchTemplates();
    }
  }, [isOpen, lead, fetchLeadDetails, fetchTemplates]);

  if (!isOpen || !lead) return null;

  const clientFirstName = extractClientFirstName(lead.contact?.contactPerson);

  // Action: Mark as Approached
  const handleMarkAsApproached = async () => {
    try {
      const res = await fetch(`/api/leads/${lead.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approached' }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentStatus('Approached');
        setApproachedAt(new Date().toISOString());
        setActionMessage({
          type: 'success',
          text: 'Client marked as Approached and moved into Approached Clients section.',
        });
        fetchLeadDetails(lead.id);
        onLeadStatusChanged?.(lead.id, 'Approached');
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to update status' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Network error' });
    }
  };

  // Action: Change Status Dropdown
  const handleStatusChange = async (nextStatus: LeadStatusOption) => {
    try {
      const res = await fetch(`/api/leads/${lead.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentStatus(nextStatus);
        setActionMessage({ type: 'success', text: `Lead status updated to ${nextStatus}.` });
        fetchLeadDetails(lead.id);
        onLeadStatusChanged?.(lead.id, nextStatus);
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error updating status' });
    }
  };

  // Action: Select Reference Template
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) return;
    const tmpl = availableTemplates.find((t) => t.id === templateId);
    if (tmpl) {
      if (tmpl.subject) {
        setEmailSubject(
          tmpl.subject
            .replace(/\{\{businessName\}\}/g, lead.businessName)
            .replace(/\{\{clientFirstName\}\}/g, clientFirstName || '')
            .replace(/\{\{projectTitle\}\}/g, lead.title)
        );
      }
      if (tmpl.htmlContent) {
        setEmailHtml(
          tmpl.htmlContent
            .replace(/\{\{businessName\}\}/g, lead.businessName)
            .replace(/\{\{clientFirstName\}\}/g, clientFirstName || '')
            .replace(/\{\{projectTitle\}\}/g, lead.title)
        );
        setIsDraftDirty(true);
      }
    }
  };

  // Action: Save Current Generated Pitch as Template
  const handleSaveAsTemplate = async () => {
    if (!emailHtml || !emailSubject) {
      setActionMessage({ type: 'error', text: 'Generate or write an email pitch first to save as a template.' });
      return;
    }
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${pitchCategory} - Pitch (${lead.businessName.slice(0, 25)})`,
          category: pitchCategory,
          subject: emailSubject,
          htmlContent: emailHtml,
          plainText: emailPlainText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: 'success', text: 'Email pitch saved to Templates library.' });
        fetchTemplates();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to save template.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error saving template' });
    }
  };

  // Action: Draft Email Using AI (or Regenerate)
  const triggerAiDrafting = async (isRegenerate = false) => {
    try {
      setIsDraftingAi(true);
      setActionMessage(null);
      setShowOverwriteConfirm(false);

      const nextVariation = isRegenerate ? aiVariationCount + 1 : 0;
      setAiVariationCount(nextVariation);

      const selectedTmpl = selectedTemplateId ? availableTemplates.find((t) => t.id === selectedTemplateId) : null;

      const res = await fetch('/api/ai/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          categoryOverride: pitchCategory,
          isRegenerate,
          variationIndex: nextVariation,
          customTemplatePrompt: selectedTmpl ? selectedTmpl.htmlContent : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmailSubject(data.subject);
        setEmailHtml(data.htmlContent);
        setEmailPlainText(data.plainText);
        setIsDraftDirty(false);
        setActionMessage({
          type: 'success',
          text: data.message || 'AI Email Pitch generated successfully.',
        });
        fetchLeadDetails(lead.id);
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to draft email.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error calling AI pitch generator' });
    } finally {
      setIsDraftingAi(false);
    }
  };

  const handleDraftEmailClick = () => {
    if (isDraftDirty && emailHtml.trim().length > 20) {
      setShowOverwriteConfirm(true);
    } else {
      triggerAiDrafting(false);
    }
  };

  const handleRegenerateClick = () => {
    if (isDraftDirty && emailHtml.trim().length > 20) {
      setShowOverwriteConfirm(true);
    } else {
      triggerAiDrafting(true);
    }
  };

  // Action: Save Email Draft
  const handleSaveEmailDraft = async () => {
    try {
      const saveRes = await fetch(`/api/leads/${lead.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail || 'save.draft.only@example.com',
          subject: emailSubject,
          htmlContent: emailHtml,
          plainText: emailPlainText,
          category: pitchCategory,
          draftOnly: true,
        }),
      });
      const data = await saveRes.json();
      if (data.success) {
        setIsDraftDirty(false);
        setActionMessage({ type: 'success', text: 'Email draft saved successfully.' });
        fetchLeadDetails(lead.id);
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to save draft.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error saving email draft' });
    }
  };

  // Action: Reschedule Follow-up
  const handleRescheduleFollowup = async (followupId: string, nextDate: string) => {
    if (!nextDate) return;
    try {
      const res = await fetch(`/api/leads/${lead.id}/followups`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followupId, status: 'rescheduled', newDueDate: nextDate }),
      });
      const data = await res.json();
      if (data.success) {
        setReschedulingId(null);
        setRescheduleDate('');
        setActionMessage({ type: 'success', text: 'Follow-up successfully rescheduled.' });
        fetchLeadDetails(lead.id);
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to reschedule follow-up.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error rescheduling follow-up' });
    }
  };

  // Action: Send Email via User's SMTP
  const handleSendEmailSmtp = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setActionMessage({ type: 'error', text: 'Please enter a valid recipient email address.' });
      return;
    }
    if (!emailSubject || !emailHtml) {
      setActionMessage({ type: 'error', text: 'Please generate or write your email pitch first.' });
      return;
    }

    try {
      setSendingEmail(true);
      setActionMessage(null);

      const res = await fetch(`/api/leads/${lead.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          subject: emailSubject,
          htmlContent: emailHtml,
          plainText: emailPlainText,
          category: pitchCategory,
          recipientName: lead.contact?.contactPerson || lead.businessName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage({
          type: 'success',
          text: `Email successfully delivered! Status updated to "Waiting for Client Response". (Message ID: ${data.messageId})`,
        });
        setCurrentStatus('Waiting for Client Response');
        fetchLeadDetails(lead.id);
        onLeadStatusChanged?.(lead.id, 'Waiting for Client Response');
      } else {
        setActionMessage({
          type: 'error',
          text: data.error || 'Failed to dispatch email. Please check your SMTP configuration in Settings.',
        });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error communicating with mail server' });
    } finally {
      setSendingEmail(false);
    }
  };

  // Action: Generate AI Bid
  const handleGenerateAiBid = async () => {
    try {
      setIsGeneratingBid(true);
      setActionMessage(null);

      const res = await fetch('/api/ai/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, action: 'generate' }),
      });

      const data = await res.json();
      if (data.success && data.bid) {
        setBidTitle(data.bid.title);
        setBidContent(data.bid.content);
        setBidDeliverables(data.bid.deliverables || []);
        setBidTimeline(data.bid.timeline || '5-7 Days');
        setBidInvestment(data.bid.investment || lead.budget || '$750 USD');
        setBidStatus(data.bid.status || 'draft');
        setActionMessage({ type: 'success', text: 'AI Bid generated. Review and adjust before submitting.' });
        fetchLeadDetails(lead.id);
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to generate bid' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error generating proposal' });
    } finally {
      setIsGeneratingBid(false);
    }
  };

  // Action: Confirm Bid Submission
  const handleConfirmBidSubmission = async () => {
    try {
      const res = await fetch('/api/ai/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, action: 'confirm_submission' }),
      });
      const data = await res.json();
      if (data.success) {
        setBidStatus('submitted');
        setBidSubmittedAt(new Date().toISOString());
        setActionMessage({
          type: 'success',
          text: 'Bid submission confirmed and recorded in activity history.',
        });
        fetchLeadDetails(lead.id);
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error recording submission' });
    }
  };

  // Action: Add Follow-up
  const handleAddFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowupDate) return;

    try {
      const res = await fetch(`/api/leads/${lead.id}/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dueDate: newFollowupDate,
          notes: newFollowupNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewFollowupDate('');
        setNewFollowupNotes('');
        setActionMessage({ type: 'success', text: 'Follow-up scheduled.' });
        fetchLeadDetails(lead.id);
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error adding follow-up' });
    }
  };

  // Action: Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    try {
      const res = await fetch(`/api/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNoteContent.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewNoteContent('');
        setActionMessage({ type: 'success', text: 'Observation note added.' });
        fetchLeadDetails(lead.id);
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error adding note' });
    }
  };

  const statusBadgeColor = (st: LeadStatusOption) => {
    switch (st) {
      case 'Approached':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Waiting for Client Response':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'Follow-up Required':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Interested':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Converted / Won':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800';
      case 'Not Interested':
        return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      case 'Wasted Lead':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
      default:
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-[#22334d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0a111c] border-b border-slate-200 dark:border-[#1e2c42] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${statusBadgeColor(currentStatus)}`}>
                {currentStatus}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {lead.platform} &bull; {lead.category}
              </span>
              {lead.city && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  {lead.city}, {lead.country}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate max-w-2xl">
              {lead.businessName} &bull; <span className="text-sm font-semibold text-slate-500">{lead.title}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {currentStatus === 'New Lead' && (
              <button
                type="button"
                onClick={handleMarkAsApproached}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Mark as Approached</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Close Lead Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Action Banner */}
        {actionMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60'
                : actionMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60'
                : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : actionMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs font-bold underline hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 9 Structured Sections Tabs Bar */}
        <div className="px-6 border-b border-slate-200 dark:border-[#1e2c42] flex items-center gap-2 overflow-x-auto bg-slate-50/50 dark:bg-[#0c1421] text-xs font-bold select-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Lead & Project Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email_pitch')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'email_pitch'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>2. AI Email Pitch</span>
            {emailHtml && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bid_proposal')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bid_proposal'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>3. AI Bid & Proposal</span>
            {bidStatus === 'submitted' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 font-mono">
                Submitted
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('followups')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'followups'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>4. Follow-ups ({followups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notes'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>5. Notes ({notes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>6. Activity History ({activityLogs.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW & CLIENT / PROJECT INFO & REQUIREMENTS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Quick Status Controller Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131f33] border border-slate-200 dark:border-[#22334d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Lead Lifecycle Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${statusBadgeColor(currentStatus)}`}>
                      {currentStatus}
                    </span>
                    {approachedAt && (
                      <span className="text-[11px] text-slate-500">
                        Approached on: <strong>{new Date(approachedAt).toLocaleString()}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Change Status:
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value as LeadStatusOption)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Approached">Approached</option>
                    <option value="Waiting for Client Response">Waiting for Client Response</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Wasted Lead">Wasted Lead</option>
                    <option value="Converted / Won">Converted / Won</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Grid: 1. Client Information & 2. Project Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Client Information Card */}
                <div className="p-5 rounded-xl border border-slate-200 dark:border-[#22334d] bg-white dark:bg-[#111c2e] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#007FED]" />
                      Client Information
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {lead.id}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Person</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {lead.contact?.contactPerson || 'Not publicly listed'}
                      </span>
                      {clientFirstName && (
                        <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          (First Name: {clientFirstName})
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Business Name</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{lead.businessName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {lead.contact?.email || 'No public email listed'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone / WhatsApp</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {lead.contact?.phone || lead.contact?.whatsapp || 'No direct phone'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Location & Address</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {lead.address || `${lead.city}, ${lead.country}`}
                      </span>
                    </div>

                    {lead.contact?.website && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Website</span>
                        <a
                          href={lead.contact.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#007FED] hover:underline flex items-center gap-1 font-mono"
                        >
                          {lead.contact.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Project Information Card */}
                <div className="p-5 rounded-xl border border-slate-200 dark:border-[#22334d] bg-white dark:bg-[#111c2e] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      Project Information
                    </h3>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                      {lead.platform}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Project Title</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{lead.title}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Project Category</span>
                      <span className="font-semibold text-blue-600 dark:text-sky-400">{lead.category}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Budget Allocation</span>
                        <span className="font-black text-slate-900 dark:text-white">{lead.budget || 'Confirmed Scope'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Job Type</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.jobType || 'Direct Engagement'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Discovered / Posted</span>
                      <span className="text-slate-500">{lead.postedAt || 'Recently identified'}</span>
                    </div>

                    {lead.tags && lead.tags.length > 0 && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Keywords & Tags</span>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Project Requirements Card */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-[#22334d] bg-white dark:bg-[#111c2e] space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Project Requirements & Description
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1421] text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                  {lead.description || 'No extended requirements specification provided by client.'}
                </div>
              </div>

              {/* Bottom Quick-Action Forwarders */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('email_pitch')}
                  className="px-5 py-2.5 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Draft Email Using AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bid_proposal')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate AI Bid Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI EMAIL PITCH & RICH TEXT WYSIWYG EDITOR */}
          {activeTab === 'email_pitch' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Overwrite Confirmation Dialog */}
              {showOverwriteConfirm && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Confirm Draft Overwrite</span>
                  </div>
                  <p>
                    You have made manual edits to this email draft. Generating a new pitch will replace your current content. Do you wish to proceed?
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => triggerAiDrafting(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition"
                    >
                      Yes, Overwrite & Regenerate
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOverwriteConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Pitch Controls Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131f33] border border-slate-200 dark:border-[#22334d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Category Strategy:
                  </label>
                  <select
                    value={pitchCategory}
                    onChange={(e) => setPitchCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="WordPress Development">WordPress Development</option>
                    <option value="Shopify Development">Shopify Development</option>
                    <option value="E-commerce Development">E-commerce Development</option>
                    <option value="Social Media Management">Social Media Management</option>
                    <option value="Social Media Design">Social Media Design</option>
                    <option value="SEO">SEO Optimization</option>
                    <option value="Graphic Design">Graphic Design & Branding</option>
                    <option value="Logo Design">Logo & Visual Identity</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="General Outreach">General Outreach</option>
                  </select>

                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                    Template:
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[200px]"
                  >
                    <option value="">-- AI Pitch Generator --</option>
                    {availableTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary AI Generation Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDraftEmailClick}
                    disabled={isDraftingAi}
                    className="px-4 py-2 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 disabled:opacity-50"
                  >
                    {isDraftingAi ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AI Analyzing & Drafting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Draft Email Using AI</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRegenerateClick}
                    disabled={isDraftingAi}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                    title="Generate an alternative variation using the same lead data"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Regenerate with AI</span>
                  </button>
                </div>
              </div>

              {/* Email Envelope Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Recipient Email:
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Subject Line:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => {
                      setEmailSubject(e.target.value);
                      setIsDraftDirty(true);
                    }}
                    placeholder="Enter pitch subject line..."
                    className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                  />
                </div>
              </div>

              {/* Rich-Text Visual Editor (WYSIWYG) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#007FED]" />
                    Visual Email Pitch Editor (WYSIWYG):
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Strict greeting & closing structure enforced automatically
                  </span>
                </div>

                <RichTextEditor
                  content={emailHtml}
                  onChange={(html, text) => {
                    setEmailHtml(html);
                    setEmailPlainText(text);
                    setIsDraftDirty(true);
                  }}
                  placeholder="Click 'Draft Email Using AI' above to generate a project-specific pitch..."
                  minHeight="260px"
                />
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEmailDraft}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAsTemplate}
                    className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#007FED] dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-bold text-xs flex items-center gap-1.5 transition"
                    title="Save current pitch as reusable email template"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save Pitch as Template</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendEmailSmtp}
                    disabled={sendingEmail || !recipientEmail}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 disabled:opacity-50"
                  >
                    {sendingEmail ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Sending via SMTP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send via My SMTP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI BID & PROPOSAL */}
          {activeTab === 'bid_proposal' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-purple-900 dark:text-purple-300">
                    Freelance Marketplace & Direct Proposal Bid Engine
                  </h4>
                  <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 mt-0.5">
                    Synthesizes complete milestone scopes, approach, deliverables, and investment terms. Distinct from cold email outreach.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiBid}
                  disabled={isGeneratingBid}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {isGeneratingBid ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Bid...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Bid</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bid Meta Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Proposal Title:</label>
                  <input
                    type="text"
                    value={bidTitle}
                    onChange={(e) => setBidTitle(e.target.value)}
                    placeholder="E.g. Turnkey Website Architecture Scope"
                    className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-bold text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Timeline / Duration:</label>
                  <input
                    type="text"
                    value={bidTimeline}
                    onChange={(e) => setBidTimeline(e.target.value)}
                    placeholder="5-7 Days"
                    className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Deliverables List */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  Deliverables Scope:
                </label>
                <div className="space-y-1.5">
                  {bidDeliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#0c1421] border border-slate-100 dark:border-slate-800 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...bidDeliverables];
                          updated[idx] = e.target.value;
                          setBidDeliverables(updated);
                        }}
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-200 font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bid Proposal Full Narrative Text */}
              <div className="space-y-1">
                <label className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  Proposal Content / Solution Overview:
                </label>
                <textarea
                  rows={8}
                  value={bidContent}
                  onChange={(e) => setBidContent(e.target.value)}
                  placeholder="Click 'Generate AI Bid' above to synthesize a complete bid proposal..."
                  className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-sans"
                />
              </div>

              {/* Bid Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Status:{' '}
                    <strong className={bidStatus === 'submitted' ? 'text-teal-600' : 'text-slate-400'}>
                      {bidStatus === 'submitted' ? 'Submitted & Recorded' : 'Draft Proposal'}
                    </strong>
                  </span>
                  {bidSubmittedAt && (
                    <span className="text-[11px] text-slate-400">
                      ({new Date(bidSubmittedAt).toLocaleDateString()})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {bidStatus !== 'submitted' ? (
                    <button
                      type="button"
                      onClick={handleConfirmBidSubmission}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Record / Confirm Bid Submitted</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800">
                      <ShieldCheck className="w-4 h-4" />
                      Confirmed Submitted
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOLLOW-UP MANAGEMENT */}
          {activeTab === 'followups' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Add Follow-up Form */}
              <form onSubmit={handleAddFollowup} className="p-4 rounded-xl bg-slate-50 dark:bg-[#131f33] border border-slate-200 dark:border-[#22334d] space-y-3">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#007FED]" />
                  Schedule Follow-up Reminder
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      Due Date & Time:
                    </label>
                    <input
                      type="date"
                      required
                      value={newFollowupDate}
                      onChange={(e) => setNewFollowupDate(e.target.value)}
                      className="w-full bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      Action Note:
                    </label>
                    <input
                      type="text"
                      value={newFollowupNotes}
                      onChange={(e) => setNewFollowupNotes(e.target.value)}
                      placeholder="E.g. Check for client response on WhatsApp / follow-up email"
                      className="w-full bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Schedule Follow-up</span>
                  </button>
                </div>
              </form>

              {/* Follow-ups List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                  Upcoming & Active Follow-ups
                </h4>

                {followups.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-[#101928] rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    No follow-ups currently scheduled for this lead.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {followups.map((fup) => {
                      const isOverdue =
                        fup.status !== 'completed' &&
                        new Date(fup.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
                      const isRescheduling = reschedulingId === fup.id;

                      return (
                        <div
                          key={fup.id}
                          className={`p-3.5 rounded-xl border flex flex-col gap-2.5 text-xs transition ${
                            fup.status === 'completed'
                              ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                              : isOverdue
                              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                              : 'bg-white dark:bg-[#131f33] border-slate-200 dark:border-[#22334d]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-start gap-2.5">
                              <Clock
                                className={`w-4 h-4 shrink-0 mt-0.5 ${
                                  fup.status === 'completed'
                                    ? 'text-slate-400'
                                    : isOverdue
                                    ? 'text-rose-500'
                                    : 'text-amber-500'
                                }`}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {new Date(fup.dueDate).toLocaleDateString()}
                                  </span>
                                  {fup.status === 'completed' ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                      COMPLETED
                                    </span>
                                  ) : isOverdue ? (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                      OVERDUE
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                      UPCOMING
                                    </span>
                                  )}
                                  {fup.status === 'rescheduled' && (
                                    <span className="text-[10px] font-semibold text-slate-400">
                                      (Rescheduled)
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                                  {fup.notes || 'Routine follow-up'}
                                </p>
                              </div>
                            </div>

                            {fup.status !== 'completed' && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isRescheduling) {
                                      setReschedulingId(null);
                                      setRescheduleDate('');
                                    } else {
                                      setReschedulingId(fup.id);
                                      setRescheduleDate(fup.dueDate ? fup.dueDate.split('T')[0] : '');
                                    }
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                >
                                  {isRescheduling ? 'Cancel' : 'Reschedule'}
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    await fetch(`/api/leads/${lead.id}/followups`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ followupId: fup.id, status: 'completed' }),
                                    });
                                    fetchLeadDetails(lead.id);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 transition"
                                >
                                  Mark Completed
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Inline Reschedule Picker */}
                          {isRescheduling && (
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <label className="text-[11px] font-bold text-slate-500">New Due Date:</label>
                              <input
                                type="date"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs font-bold"
                              />
                              <button
                                type="button"
                                disabled={!rescheduleDate}
                                onClick={() => handleRescheduleFollowup(fup.id, rescheduleDate)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition disabled:opacity-50"
                              >
                                Save Date
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-slate-50 dark:bg-[#131f33] border border-slate-200 dark:border-[#22334d] space-y-3">
                <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#007FED]" />
                  Add Internal Lead Note:
                </label>
                <textarea
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Record private context, call summaries, or pricing agreements..."
                  className="w-full bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                  >
                    Save Note
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                  Timestamped Observation Notes ({notes.length})
                </h4>

                {notes.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-[#101928] rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    No notes recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notes.map((n) => (
                      <div
                        key={n.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111c2e] text-xs space-y-1"
                      >
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{n.content}</p>
                        <span className="text-[10px] text-slate-400 block pt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY HISTORY (TIMELINE) */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                Complete Lead Activity Timeline & Audit Trail
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {/* 1. Lead Discovered */}
                <div className="relative flex items-start gap-3 text-xs">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#0e1726]" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Lead Discovered in System
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Posted: {lead.postedAt || 'Recently'} &bull; Platform: {lead.platform}
                    </span>
                  </div>
                </div>

                {/* 2. Date Opened */}
                {openedAt && (
                  <div className="relative flex items-start gap-3 text-xs">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-[#0e1726]" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Lead Opened by User
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(openedAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* 3. Marked Approached */}
                {approachedAt && (
                  <div className="relative flex items-start gap-3 text-xs">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#0e1726]" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Marked as Approached
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(approachedAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Activity Logs from Store */}
                {activityLogs.map((log) => (
                  <div key={log.id} className="relative flex items-start gap-3 text-xs">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#007FED] ring-4 ring-white dark:ring-[#0e1726]" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {log.description}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
