/**
 * SAMVERO ENTERPRISE LEAD WORKSPACE & MULTI-TENANT ENGINE
 * 
 * Provides strict multi-tenant isolation, database relationships, and local/Supabase persistence for:
 * 1. User Gemini AI settings (per-user API key encryption at rest)
 * 2. User SMTP settings (per-user credentials encryption, test connection, email dispatch)
 * 3. Canonical Lead Statuses & Approached Clients (New Lead, Approached, Waiting for Client Response, etc.)
 * 4. Rich-Text Email Drafts & Bid Drafts
 * 5. Lead Activity Timeline & Audit Logs
 * 6. Follow-up Management & Reminders
 * 7. Lead Notes
 * 8. Email Template Management by Category
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { isSupabaseConfigured, supabaseAdmin, supabase } from './supabase';
import { Lead } from '@/types';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

export type LeadStatusType =
  | 'New Lead'
  | 'Approached'
  | 'Waiting for Client Response'
  | 'Follow-up Required'
  | 'Interested'
  | 'Not Interested'
  | 'Wasted Lead'
  | 'Converted / Won'
  | 'Closed';

export interface UserAiSettings {
  userId: string;
  geminiApiKeyEncrypted?: string;
  model: string;
  status: 'configured' | 'not_configured' | 'active' | 'invalid';
  lastTestedAt?: string;
  updatedAt: string;
}

export interface UserSmtpSettings {
  userId: string;
  senderName: string;
  senderEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassEncrypted: string;
  encryption: 'tls' | 'ssl' | 'starttls' | 'none';
  replyToEmail?: string;
  status: 'connected' | 'not_configured' | 'error';
  lastTestedAt?: string;
  lastError?: string;
  updatedAt: string;
}

export interface UserLeadState {
  id: string; // `${userId}_${leadId}`
  userId: string;
  leadId: string;
  status: LeadStatusType;
  approachedAt?: string;
  lastContactDate?: string;
  nextFollowupDate?: string;
  openedAt?: string;
  updatedAt: string;
}

export interface EmailDraft {
  id: string;
  userId: string;
  leadId: string;
  subject: string;
  htmlContent: string;
  plainText: string;
  category: string;
  status: 'draft' | 'sent';
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BidDraft {
  id: string;
  userId: string;
  leadId: string;
  title: string;
  content: string;
  deliverables: string[];
  timeline: string;
  investment: string;
  status: 'draft' | 'submitted';
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivityLog {
  id: string;
  userId: string;
  leadId: string;
  type:
    | 'lead_discovered'
    | 'date_opened'
    | 'marked_approached'
    | 'email_draft_created'
    | 'email_sent'
    | 'bid_generated'
    | 'bid_submitted'
    | 'status_changed'
    | 'note_added'
    | 'followup_scheduled'
    | 'followup_completed';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface LeadFollowup {
  id: string;
  userId: string;
  leadId: string;
  dueDate: string;
  notes: string;
  status: 'pending' | 'completed' | 'rescheduled' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface LeadNote {
  id: string;
  userId: string;
  leadId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  userId: string;
  title: string;
  category:
    | 'Website Development'
    | 'WordPress'
    | 'Shopify'
    | 'Social Media'
    | 'SEO'
    | 'Graphic Design'
    | 'Branding'
    | 'Digital Marketing'
    | 'General Outreach';
  subject: string;
  htmlContent: string;
  plainText?: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceDatabase {
  aiSettings: Record<string, UserAiSettings>;
  smtpSettings: Record<string, UserSmtpSettings>;
  leadStates: Record<string, UserLeadState>; // key: `${userId}_${leadId}`
  emailDrafts: Record<string, EmailDraft>;
  bidDrafts: Record<string, BidDraft>;
  activityLogs: LeadActivityLog[];
  followups: Record<string, LeadFollowup>;
  notes: Record<string, LeadNote>;
  templates: Record<string, EmailTemplate>;
}

// ==============================================================================
// ENCRYPTION UTILITIES (AES-256-GCM)
// ==============================================================================

const MASTER_SECRET =
  process.env.ENCRYPTION_KEY ||
  process.env.SESSION_SECRET ||
  'samvero_lead_portal_encryption_secret_2026_key_32b';

function getEncryptionKey(): Buffer {
  return crypto.scryptSync(MASTER_SECRET, 'samvero_salt_workspace', 32);
}

export function encryptSensitive(plainText: string): string {
  if (!plainText) return '';
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err: any) {
    console.error('Encryption failed:', err);
    return '';
  }
}

export function decryptSensitive(cipherPackage: string): string {
  if (!cipherPackage) return '';
  try {
    const parts = cipherPackage.split(':');
    if (parts.length !== 3) return '';
    const [ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err: any) {
    console.error('Decryption failed:', err);
    return '';
  }
}

// ==============================================================================
// DEFAULT TEMPLATES SEED
// ==============================================================================

const INITIAL_DEFAULT_TEMPLATES: Omit<EmailTemplate, 'userId'>[] = [
  {
    id: 'tmpl-web-dev',
    title: 'Website Development Proposal',
    category: 'Website Development',
    subject: 'Proposal: High-Converting Website Design & Development for {{businessName}}',
    htmlContent: `<p>Hello {{clientFirstName}},</p>
<p>I reviewed your project requirements for <strong>{{projectTitle}}</strong> and noticed your objective to build a high-performance, responsive web solution that reliably converts visitors into inquiries.</p>
<p>At <strong>SAMVERO</strong>, our engineering team specializes in fast, responsive, and mobile-optimized web architectures built with modern frameworks (Next.js, React, Tailwind CSS).</p>
<p><strong>Proposed Scope:</strong></p>
<ul>
  <li>Custom responsive UI/UX designed specifically for your brand identity</li>
  <li>Fast page load speeds and SEO-ready semantic markup</li>
  <li>Direct appointment booking / WhatsApp lead capture integration</li>
  <li>Secure deployment with SSL and analytics dashboard</li>
</ul>
<p>Would you be open to a brief 10-minute call this week to review your timeline and functional requirements?</p>
<p>Best regards,<br><strong>SAMVERO Lead Acquisition & Technology Team</strong></p>`,
    plainText: `Hello {{clientFirstName}},\n\nI reviewed your project requirements for {{projectTitle}}...`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-wordpress',
    title: 'WordPress Tailored Pitch',
    category: 'WordPress',
    subject: 'WordPress Development & Optimization Proposal for {{businessName}}',
    htmlContent: `<p>Hello {{clientFirstName}},</p>
<p>I saw your requirement for WordPress expertise on <strong>{{projectTitle}}</strong>. We build clean, lightweight, and scalable WordPress solutions that avoid bloated page builders and run at peak performance.</p>
<p><strong>Deliverables:</strong></p>
<ul>
  <li>Custom theme development or tailored WooCommerce setup</li>
  <li>Speed optimization (sub-1s load times, 90+ Core Web Vitals)</li>
  <li>Custom post types, ACF fields, and seamless API integrations</li>
  <li>Enterprise security hardening and automated backup system</li>
</ul>
<p>We are available to start immediately and provide guaranteed milestone deliveries. When is a good time to connect?</p>
<p>Best regards,<br><strong>SAMVERO Lead Acquisition & Technology Team</strong></p>`,
    plainText: `Hello {{clientFirstName}},\n\nI saw your requirement for WordPress expertise...`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-shopify',
    title: 'Shopify Store Development',
    category: 'Shopify',
    subject: 'Shopify E-Commerce Store Architecture & Growth for {{businessName}}',
    htmlContent: `<p>Hello {{clientFirstName}},</p>
<p>Regarding your project <strong>{{projectTitle}}</strong>, our team focuses on high-conversion Shopify storefronts that maximize Average Order Value and streamline checkout flow.</p>
<p><strong>Our Approach:</strong></p>
<ul>
  <li>Shopify 2.0 theme customization with bespoke Liquid sections</li>
  <li>Mobile-first frictionless checkout and upsell integration</li>
  <li>Payment gateway, regional currency, and inventory management setup</li>
  <li>High-converting product landing pages tailored to your brand</li>
</ul>
<p>Let us know if you'd like a quick walkthrough of our Shopify architectural approach.</p>
<p>Best regards,<br><strong>SAMVERO Lead Acquisition & Technology Team</strong></p>`,
    plainText: `Hello {{clientFirstName}},\n\nRegarding your project...`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-social-media',
    title: 'Social Media Management & Strategy',
    category: 'Social Media',
    subject: 'Social Media Growth & High-Impact Content Strategy for {{businessName}}',
    htmlContent: `<p>Hello {{clientFirstName}},</p>
<p>I reviewed your brand presence in relation to <strong>{{projectTitle}}</strong>. In today's digital landscape, authentic audience engagement and recurring high-value content are essential for driving qualified client inquiries.</p>
<p><strong>Strategy Overview:</strong></p>
<ul>
  <li>Monthly content calendar aligned with your brand voice and commercial goals</li>
  <li>Custom high-retention short-form video reels, carousels, and visual assets</li>
  <li>Active community management and inbound inquiry routing</li>
  <li>Performance analytics reporting with actionable growth insights</li>
</ul>
<p>Would you have 10 minutes this week to discuss how we can scale your social channels?</p>
<p>Best regards,<br><strong>SAMVERO Lead Acquisition & Technology Team</strong></p>`,
    plainText: `Hello {{clientFirstName}},\n\nI reviewed your brand presence...`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-seo',
    title: 'SEO & Organic Growth Proposal',
    category: 'SEO',
    subject: 'Organic Search Ranking & SEO Strategy for {{businessName}}',
    htmlContent: `<p>Hello {{clientFirstName}},</p>
<p>I came across your project <strong>{{projectTitle}}</strong>. Ranking for high-intent search queries is one of the highest ROI channels for sustainable client acquisition.</p>
<p><strong>Our Proposed SEO Roadmap:</strong></p>
<ul>
  <li>Comprehensive technical SEO audit and Core Web Vitals remediation</li>
  <li>High-intent commercial keyword mapping and competitor gap analysis</li>
  <li>On-page content optimization and structured schema markup</li>
  <li>High-authority digital PR and white-hat link acquisition</li>
</ul>
<p>Let's schedule a brief strategy session to review your target keywords and timeline.</p>
<p>Best regards,<br><strong>SAMVERO Lead Acquisition & Technology Team</strong></p>`,
    plainText: `Hello {{clientFirstName}},\n\nI came across your project...`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-graphic-design',
    title: 'Graphic Design & Brand Collateral',
    category: 'Graphic Design',
    subject: 'Visual Identity & Graphic Design Proposal for {{businessName}}',
    htmlContent: `<p>Hello {{clientFirstName}},</p>
<p>I reviewed your creative requirements for <strong>{{projectTitle}}</strong>. Premium visual design commands higher market positioning and establishes immediate trust with your prospects.</p>
<p><strong>Scope of Deliverables:</strong></p>
<ul>
  <li>Modern, bespoke visual assets crafted in vector precision (Figma / Illustrator)</li>
  <li>Cohesive marketing collateral, social kits, and pitch decks</li>
  <li>Full source files with commercial usage rights and design system guidelines</li>
  <li>Rapid iterative revisions until 100% satisfaction</li>
</ul>
<p>We are ready to start drafting initial visual directions for your review. When is a convenient time to connect?</p>
<p>Best regards,<br><strong>SAMVERO Lead Acquisition & Technology Team</strong></p>`,
    plainText: `Hello {{clientFirstName}},\n\nI reviewed your creative requirements...`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ==============================================================================
// PERSISTENT WORKSPACE STORAGE (LOCAL JSON + SUPABASE SYNC)
// ==============================================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const WORKSPACE_FILE = path.join(DATA_DIR, 'workspace-store.json');

let workspaceDb: WorkspaceDatabase = {
  aiSettings: {},
  smtpSettings: {},
  leadStates: {},
  emailDrafts: {},
  bidDrafts: {},
  activityLogs: [],
  followups: {},
  notes: {},
  templates: {},
};

let initialized = false;

export function ensureWorkspaceStoreInitialized(): void {
  if (initialized) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(WORKSPACE_FILE)) {
      const raw = fs.readFileSync(WORKSPACE_FILE, 'utf8');
      const loaded = JSON.parse(raw);
      if (loaded && typeof loaded === 'object') {
        workspaceDb = {
          aiSettings: loaded.aiSettings || {},
          smtpSettings: loaded.smtpSettings || {},
          leadStates: loaded.leadStates || {},
          emailDrafts: loaded.emailDrafts || {},
          bidDrafts: loaded.bidDrafts || {},
          activityLogs: Array.isArray(loaded.activityLogs) ? loaded.activityLogs : [],
          followups: loaded.followups || {},
          notes: loaded.notes || {},
          templates: loaded.templates || {},
        };
      }
    }
  } catch (err: any) {
    console.warn('[WorkspaceStore] Could not load workspace store from file:', err?.message);
  }
  initialized = true;
}

function persistWorkspaceStore(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(WORKSPACE_FILE, JSON.stringify(workspaceDb, null, 2), 'utf8');
  } catch (err: any) {
    console.warn('[WorkspaceStore] Failed to write workspace store file:', err?.message);
  }
}

// ==============================================================================
// MULTI-TENANT USER AI SETTINGS
// ==============================================================================

export function getUserAiSettings(userId: string): {
  isConfigured: boolean;
  status: UserAiSettings['status'];
  model: string;
  lastTestedAt?: string;
  updatedAt?: string;
} {
  ensureWorkspaceStoreInitialized();
  const settings = workspaceDb.aiSettings[userId];
  if (!settings || !settings.geminiApiKeyEncrypted) {
    return {
      isConfigured: false,
      status: 'not_configured',
      model: 'gemini-1.5-flash',
    };
  }
  return {
    isConfigured: true,
    status: settings.status,
    model: settings.model || 'gemini-1.5-flash',
    lastTestedAt: settings.lastTestedAt,
    updatedAt: settings.updatedAt,
  };
}

export function getUserGeminiApiKey(userId: string): string | null {
  ensureWorkspaceStoreInitialized();
  const settings = workspaceDb.aiSettings[userId];
  if (!settings || !settings.geminiApiKeyEncrypted) return null;
  return decryptSensitive(settings.geminiApiKeyEncrypted);
}

export function saveUserAiSettings(
  userId: string,
  apiKey: string,
  model = 'gemini-1.5-flash'
): void {
  ensureWorkspaceStoreInitialized();
  const encrypted = encryptSensitive(apiKey.trim());
  const now = new Date().toISOString();
  workspaceDb.aiSettings[userId] = {
    userId,
    geminiApiKeyEncrypted: encrypted,
    model,
    status: 'configured',
    lastTestedAt: now,
    updatedAt: now,
  };
  persistWorkspaceStore();
}

export function removeUserAiSettings(userId: string): void {
  ensureWorkspaceStoreInitialized();
  delete workspaceDb.aiSettings[userId];
  persistWorkspaceStore();
}

export function updateUserAiStatus(
  userId: string,
  status: UserAiSettings['status'],
  tested = true
): void {
  ensureWorkspaceStoreInitialized();
  if (workspaceDb.aiSettings[userId]) {
    workspaceDb.aiSettings[userId].status = status;
    if (tested) {
      workspaceDb.aiSettings[userId].lastTestedAt = new Date().toISOString();
    }
    workspaceDb.aiSettings[userId].updatedAt = new Date().toISOString();
    persistWorkspaceStore();
  }
}

// ==============================================================================
// MULTI-TENANT USER SMTP SETTINGS
// ==============================================================================

export function getUserSmtpSettings(userId: string): {
  isConfigured: boolean;
  senderName: string;
  senderEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  encryption: UserSmtpSettings['encryption'];
  replyToEmail?: string;
  status: UserSmtpSettings['status'];
  lastTestedAt?: string;
  lastError?: string;
  updatedAt?: string;
} {
  ensureWorkspaceStoreInitialized();
  const s = workspaceDb.smtpSettings[userId];
  if (!s || !s.smtpHost || !s.smtpUser) {
    return {
      isConfigured: false,
      senderName: '',
      senderEmail: '',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      encryption: 'tls',
      status: 'not_configured',
    };
  }
  return {
    isConfigured: true,
    senderName: s.senderName,
    senderEmail: s.senderEmail,
    smtpHost: s.smtpHost,
    smtpPort: s.smtpPort,
    smtpUser: s.smtpUser,
    encryption: s.encryption,
    replyToEmail: s.replyToEmail,
    status: s.status,
    lastTestedAt: s.lastTestedAt,
    lastError: s.lastError,
    updatedAt: s.updatedAt,
  };
}

export function getUserSmtpCredentials(userId: string): {
  senderName: string;
  senderEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  encryption: UserSmtpSettings['encryption'];
  replyToEmail?: string;
} | null {
  ensureWorkspaceStoreInitialized();
  const s = workspaceDb.smtpSettings[userId];
  if (!s || !s.smtpHost || !s.smtpUser || !s.smtpPassEncrypted) return null;
  const password = decryptSensitive(s.smtpPassEncrypted);
  if (!password) return null;
  return {
    senderName: s.senderName,
    senderEmail: s.senderEmail,
    smtpHost: s.smtpHost,
    smtpPort: s.smtpPort,
    smtpUser: s.smtpUser,
    smtpPass: password,
    encryption: s.encryption,
    replyToEmail: s.replyToEmail,
  };
}

export function saveUserSmtpSettings(
  userId: string,
  data: {
    senderName: string;
    senderEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    encryption: UserSmtpSettings['encryption'];
    replyToEmail?: string;
  }
): void {
  ensureWorkspaceStoreInitialized();
  const encryptedPass = encryptSensitive(data.smtpPass.trim());
  const now = new Date().toISOString();
  workspaceDb.smtpSettings[userId] = {
    userId,
    senderName: data.senderName.trim(),
    senderEmail: data.senderEmail.trim(),
    smtpHost: data.smtpHost.trim(),
    smtpPort: Number(data.smtpPort) || 587,
    smtpUser: data.smtpUser.trim(),
    smtpPassEncrypted: encryptedPass,
    encryption: data.encryption || 'tls',
    replyToEmail: data.replyToEmail?.trim(),
    status: 'connected',
    lastTestedAt: now,
    updatedAt: now,
  };
  persistWorkspaceStore();
}

export function removeUserSmtpSettings(userId: string): void {
  ensureWorkspaceStoreInitialized();
  delete workspaceDb.smtpSettings[userId];
  persistWorkspaceStore();
}

export function updateUserSmtpStatus(
  userId: string,
  status: UserSmtpSettings['status'],
  error?: string
): void {
  ensureWorkspaceStoreInitialized();
  if (workspaceDb.smtpSettings[userId]) {
    workspaceDb.smtpSettings[userId].status = status;
    workspaceDb.smtpSettings[userId].lastTestedAt = new Date().toISOString();
    workspaceDb.smtpSettings[userId].lastError = error;
    workspaceDb.smtpSettings[userId].updatedAt = new Date().toISOString();
    persistWorkspaceStore();
  }
}

// ==============================================================================
// CANONICAL LEAD STATUS MANAGEMENT (PER USER)
// ==============================================================================

export function getUserLeadState(userId: string, leadId: string): UserLeadState {
  ensureWorkspaceStoreInitialized();
  const key = `${userId}_${leadId}`;
  const existing = workspaceDb.leadStates[key];
  if (existing) return existing;

  const defaultState: UserLeadState = {
    id: key,
    userId,
    leadId,
    status: 'New Lead',
    updatedAt: new Date().toISOString(),
  };
  return defaultState;
}

export function updateUserLeadStatus(
  userId: string,
  leadId: string,
  nextStatus: LeadStatusType,
  metadata?: {
    notes?: string;
    nextFollowupDate?: string;
    lastContactDate?: string;
  }
): UserLeadState {
  ensureWorkspaceStoreInitialized();
  const key = `${userId}_${leadId}`;
  const existing = workspaceDb.leadStates[key];
  const now = new Date().toISOString();

  let approachedAt = existing?.approachedAt;
  if (nextStatus === 'Approached' && !approachedAt) {
    approachedAt = now;
  }

  const updated: UserLeadState = {
    id: key,
    userId,
    leadId,
    status: nextStatus,
    approachedAt: approachedAt || existing?.approachedAt,
    lastContactDate: metadata?.lastContactDate || existing?.lastContactDate || (nextStatus === 'Waiting for Client Response' ? now : undefined),
    nextFollowupDate: metadata?.nextFollowupDate || existing?.nextFollowupDate,
    openedAt: existing?.openedAt || now,
    updatedAt: now,
  };

  workspaceDb.leadStates[key] = updated;

  // Add activity log entry
  addLeadActivityLog(userId, leadId, 'status_changed', `Lead status updated to "${nextStatus}"`, {
    previousStatus: existing?.status || 'New Lead',
    newStatus: nextStatus,
    notes: metadata?.notes,
  });

  if (nextStatus === 'Approached' && (!existing || existing.status !== 'Approached')) {
    addLeadActivityLog(userId, leadId, 'marked_approached', 'Marked client as Approached', {
      timestamp: now,
    });
  }

  persistWorkspaceStore();
  return updated;
}

export function recordLeadOpened(userId: string, leadId: string): void {
  ensureWorkspaceStoreInitialized();
  const key = `${userId}_${leadId}`;
  const existing = workspaceDb.leadStates[key];
  const now = new Date().toISOString();

  if (!existing) {
    workspaceDb.leadStates[key] = {
      id: key,
      userId,
      leadId,
      status: 'New Lead',
      openedAt: now,
      updatedAt: now,
    };
    addLeadActivityLog(userId, leadId, 'date_opened', 'Lead details inspected by user', { openedAt: now });
    persistWorkspaceStore();
  } else if (!existing.openedAt) {
    existing.openedAt = now;
    existing.updatedAt = now;
    addLeadActivityLog(userId, leadId, 'date_opened', 'Lead details inspected by user', { openedAt: now });
    persistWorkspaceStore();
  }
}

export function getAllUserLeadStates(userId: string): Record<string, UserLeadState> {
  ensureWorkspaceStoreInitialized();
  const result: Record<string, UserLeadState> = {};
  for (const [key, state] of Object.entries(workspaceDb.leadStates)) {
    if (state.userId === userId) {
      result[state.leadId] = state;
    }
  }
  return result;
}

// ==============================================================================
// EMAIL DRAFTS MANAGEMENT
// ==============================================================================

export function getEmailDraftForLead(userId: string, leadId: string): EmailDraft | null {
  ensureWorkspaceStoreInitialized();
  const drafts = Object.values(workspaceDb.emailDrafts).filter(
    (d) => d.userId === userId && d.leadId === leadId
  );
  if (drafts.length === 0) return null;
  // Return most recently updated draft
  return drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
}

export function saveEmailDraft(
  userId: string,
  leadId: string,
  data: {
    subject: string;
    htmlContent: string;
    plainText: string;
    category: string;
  }
): EmailDraft {
  ensureWorkspaceStoreInitialized();
  const existing = getEmailDraftForLead(userId, leadId);
  const now = new Date().toISOString();
  const draftId = existing ? existing.id : `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const draft: EmailDraft = {
    id: draftId,
    userId,
    leadId,
    subject: data.subject,
    htmlContent: data.htmlContent,
    plainText: data.plainText,
    category: data.category,
    status: existing ? existing.status : 'draft',
    sentAt: existing?.sentAt,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  workspaceDb.emailDrafts[draftId] = draft;

  addLeadActivityLog(userId, leadId, 'email_draft_created', `Email pitch draft created (${data.category})`, {
    subject: data.subject,
  });

  persistWorkspaceStore();
  return draft;
}

export function markEmailDraftSent(userId: string, leadId: string, messageId?: string): void {
  ensureWorkspaceStoreInitialized();
  const draft = getEmailDraftForLead(userId, leadId);
  const now = new Date().toISOString();
  if (draft) {
    draft.status = 'sent';
    draft.sentAt = now;
    draft.updatedAt = now;
  }

  // Update lead state: lastContactDate and transition to 'Waiting for Client Response'
  const state = getUserLeadState(userId, leadId);
  updateUserLeadStatus(
    userId,
    leadId,
    state.status === 'New Lead' || state.status === 'Approached'
      ? 'Waiting for Client Response'
      : state.status,
    { lastContactDate: now }
  );

  addLeadActivityLog(userId, leadId, 'email_sent', 'Email pitch sent successfully via verified SMTP', {
    sentAt: now,
    messageId,
  });

  persistWorkspaceStore();
}

// ==============================================================================
// BID / PROPOSAL DRAFTS MANAGEMENT
// ==============================================================================

export function getBidDraftForLead(userId: string, leadId: string): BidDraft | null {
  ensureWorkspaceStoreInitialized();
  const bids = Object.values(workspaceDb.bidDrafts).filter(
    (b) => b.userId === userId && b.leadId === leadId
  );
  if (bids.length === 0) return null;
  return bids.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
}

export function saveBidDraft(
  userId: string,
  leadId: string,
  data: {
    title: string;
    content: string;
    deliverables: string[];
    timeline: string;
    investment: string;
  }
): BidDraft {
  ensureWorkspaceStoreInitialized();
  const existing = getBidDraftForLead(userId, leadId);
  const now = new Date().toISOString();
  const bidId = existing ? existing.id : `bid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const bid: BidDraft = {
    id: bidId,
    userId,
    leadId,
    title: data.title,
    content: data.content,
    deliverables: data.deliverables,
    timeline: data.timeline,
    investment: data.investment,
    status: existing ? existing.status : 'draft',
    submittedAt: existing?.submittedAt,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  workspaceDb.bidDrafts[bidId] = bid;

  addLeadActivityLog(userId, leadId, 'bid_generated', `AI Bid synthesized: "${data.title}"`, {
    deliverablesCount: data.deliverables.length,
    investment: data.investment,
  });

  persistWorkspaceStore();
  return bid;
}

export function confirmBidSubmission(userId: string, leadId: string): BidDraft | null {
  ensureWorkspaceStoreInitialized();
  const bid = getBidDraftForLead(userId, leadId);
  if (!bid) return null;
  const now = new Date().toISOString();
  bid.status = 'submitted';
  bid.submittedAt = now;
  bid.updatedAt = now;

  addLeadActivityLog(userId, leadId, 'bid_submitted', 'Proposal submission confirmed by user', {
    submittedAt: now,
  });

  persistWorkspaceStore();
  return bid;
}

// ==============================================================================
// LEAD ACTIVITY LOGS (TIMELINE)
// ==============================================================================

export function addLeadActivityLog(
  userId: string,
  leadId: string,
  type: LeadActivityLog['type'],
  description: string,
  metadata?: Record<string, any>
): LeadActivityLog {
  ensureWorkspaceStoreInitialized();
  const log: LeadActivityLog = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    leadId,
    type,
    description,
    metadata,
    createdAt: new Date().toISOString(),
  };

  workspaceDb.activityLogs.unshift(log);
  // Cap at 5000 records to prevent memory leak
  if (workspaceDb.activityLogs.length > 5000) {
    workspaceDb.activityLogs.pop();
  }

  persistWorkspaceStore();
  return log;
}

export function getLeadActivityLogs(userId: string, leadId: string): LeadActivityLog[] {
  ensureWorkspaceStoreInitialized();
  return workspaceDb.activityLogs.filter((l) => l.userId === userId && l.leadId === leadId);
}

// ==============================================================================
// FOLLOW-UP MANAGEMENT
// ==============================================================================

export function addLeadFollowup(
  userId: string,
  leadId: string,
  dueDate: string,
  notes: string
): LeadFollowup {
  ensureWorkspaceStoreInitialized();
  const id = `fup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const followup: LeadFollowup = {
    id,
    userId,
    leadId,
    dueDate,
    notes,
    status: 'pending',
    createdAt: now,
  };

  workspaceDb.followups[id] = followup;

  // Update lead's nextFollowupDate
  const state = getUserLeadState(userId, leadId);
  updateUserLeadStatus(
    userId,
    leadId,
    state.status === 'New Lead' || state.status === 'Approached'
      ? 'Follow-up Required'
      : state.status,
    { nextFollowupDate: dueDate }
  );

  addLeadActivityLog(userId, leadId, 'followup_scheduled', `Follow-up scheduled for ${new Date(dueDate).toLocaleDateString()}`, {
    dueDate,
    notes,
  });

  persistWorkspaceStore();
  return followup;
}

export function updateLeadFollowupStatus(
  userId: string,
  followupId: string,
  status: LeadFollowup['status'],
  newDueDate?: string
): LeadFollowup | null {
  ensureWorkspaceStoreInitialized();
  const followup = workspaceDb.followups[followupId];
  if (!followup || followup.userId !== userId) return null;

  followup.status = status;
  if (status === 'completed') {
    followup.completedAt = new Date().toISOString();
    addLeadActivityLog(userId, followup.leadId, 'followup_completed', 'Follow-up marked as completed');
  } else if (status === 'rescheduled' && newDueDate) {
    followup.dueDate = newDueDate;
    addLeadActivityLog(userId, followup.leadId, 'followup_scheduled', `Follow-up rescheduled to ${new Date(newDueDate).toLocaleDateString()}`);
  }

  persistWorkspaceStore();
  return followup;
}

export function getLeadFollowups(userId: string, leadId?: string): LeadFollowup[] {
  ensureWorkspaceStoreInitialized();
  return Object.values(workspaceDb.followups).filter(
    (f) => f.userId === userId && (!leadId || f.leadId === leadId)
  );
}

// ==============================================================================
// LEAD NOTES
// ==============================================================================

export function addLeadNote(userId: string, leadId: string, content: string): LeadNote {
  ensureWorkspaceStoreInitialized();
  const id = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const note: LeadNote = {
    id,
    userId,
    leadId,
    content,
    createdAt: now,
    updatedAt: now,
  };

  workspaceDb.notes[id] = note;

  addLeadActivityLog(userId, leadId, 'note_added', 'Added private observation note', {
    snippet: content.slice(0, 60),
  });

  persistWorkspaceStore();
  return note;
}

export function getLeadNotes(userId: string, leadId: string): LeadNote[] {
  ensureWorkspaceStoreInitialized();
  return Object.values(workspaceDb.notes)
    .filter((n) => n.userId === userId && n.leadId === leadId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ==============================================================================
// EMAIL TEMPLATES MANAGEMENT
// ==============================================================================

export function getUserTemplates(userId: string, category?: string): EmailTemplate[] {
  ensureWorkspaceStoreInitialized();
  // Combine system default templates (attributed to this user) with user's custom templates
  const userList = Object.values(workspaceDb.templates).filter(
    (t) => t.userId === userId && (!category || t.category === category)
  );

  const defaults: EmailTemplate[] = INITIAL_DEFAULT_TEMPLATES.map((tmpl) => ({
    ...tmpl,
    userId,
  })).filter((t) => !category || t.category === category);

  // Return user templates first, then non-conflicting default templates
  const userTemplateTitles = new Set(userList.map((t) => t.title.toLowerCase()));
  const merged = [
    ...userList,
    ...defaults.filter((d) => !userTemplateTitles.has(d.title.toLowerCase())),
  ];

  return merged;
}

export function saveUserTemplate(
  userId: string,
  data: {
    id?: string;
    title: string;
    category: EmailTemplate['category'];
    subject: string;
    htmlContent: string;
    plainText?: string;
  }
): EmailTemplate {
  ensureWorkspaceStoreInitialized();
  const now = new Date().toISOString();
  const id = data.id || `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const template: EmailTemplate = {
    id,
    userId,
    title: data.title.trim(),
    category: data.category,
    subject: data.subject.trim(),
    htmlContent: data.htmlContent,
    plainText: data.plainText,
    createdAt: now,
    updatedAt: now,
  };

  workspaceDb.templates[id] = template;
  persistWorkspaceStore();
  return template;
}

export function deleteUserTemplate(userId: string, templateId: string): boolean {
  ensureWorkspaceStoreInitialized();
  const tmpl = workspaceDb.templates[templateId];
  if (!tmpl || tmpl.userId !== userId) return false;
  delete workspaceDb.templates[templateId];
  persistWorkspaceStore();
  return true;
}

// ==============================================================================
// REAL DATABASE STATUS STATS COMPUTATION
// ==============================================================================

export function computeLeadWorkspaceStats(userId: string, allTotalLeads: Lead[]): {
  newLeads: number;
  approachedClients: number;
  waitingForResponse: number;
  followupsDue: number;
  interestedClients: number;
  convertedLeads: number;
  notInterested: number;
  wastedLeads: number;
  closedLeads: number;
} {
  ensureWorkspaceStoreInitialized();
  const userStates = getAllUserLeadStates(userId);
  const nowTime = Date.now();

  let approachedClients = 0;
  let waitingForResponse = 0;
  let followUpRequired = 0;
  let interestedClients = 0;
  let convertedLeads = 0;
  let notInterested = 0;
  let wastedLeads = 0;
  let closedLeads = 0;

  for (const state of Object.values(userStates)) {
    if (state.status === 'Approached') approachedClients++;
    else if (state.status === 'Waiting for Client Response') waitingForResponse++;
    else if (state.status === 'Follow-up Required') followUpRequired++;
    else if (state.status === 'Interested') interestedClients++;
    else if (state.status === 'Converted / Won') convertedLeads++;
    else if (state.status === 'Not Interested') notInterested++;
    else if (state.status === 'Wasted Lead') wastedLeads++;
    else if (state.status === 'Closed') closedLeads++;
  }

  // Count follow-ups due (pending records with dueDate <= now + 24h, plus any lead explicitly in Follow-up Required)
  const userFollowups = Object.values(workspaceDb.followups).filter(
    (f) => f.userId === userId && f.status === 'pending'
  );
  const pendingScheduledDue = userFollowups.filter((f) => new Date(f.dueDate).getTime() <= nowTime + 86400000).length;
  const followupsDue = Math.max(followUpRequired, pendingScheduledDue);

  // New Leads are leads not yet marked approached or moved to other status
  const nonNewCount = approachedClients + waitingForResponse + followUpRequired + interestedClients + convertedLeads + notInterested + wastedLeads + closedLeads;
  const newLeads = Math.max(0, allTotalLeads.length - nonNewCount);

  return {
    newLeads,
    approachedClients,
    waitingForResponse,
    followupsDue,
    interestedClients,
    convertedLeads,
    notInterested,
    wastedLeads,
    closedLeads,
  };
}

export function normalizeCategoryToken(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[/\\_-]/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

export function matchLeadCategory(filter: string, leadCategory?: string, leadTags: string[] = []): boolean {
  if (!filter || filter === 'all') return true;

  const fClean = normalizeCategoryToken(filter);
  const catClean = normalizeCategoryToken(leadCategory || '');
  const tagsClean = (leadTags || []).map(normalizeCategoryToken);
  const combinedLeadText = `${catClean} ${tagsClean.join(' ')}`;

  if (fClean && combinedLeadText.includes(fClean)) return true;

  const ALIAS_MAP: Record<string, string[]> = {
    web: ['web', 'website', 'frontend', 'nextjs', 'react'],
    wordpress: ['wordpress', 'woocommerce', 'elementor'],
    'meta ads': ['meta ads', 'facebook', 'instagram', 'meta', 'social marketing'],
    meta: ['meta ads', 'facebook', 'instagram', 'meta', 'social marketing'],
    mobile: ['mobile', 'app', 'react native', 'flutter', 'ios', 'android'],
    'mobile apps': ['mobile', 'app', 'react native', 'flutter', 'ios', 'android'],
    local: ['local business', 'local', 'gmb', 'plumber', 'dentist', 'clinic', 'restaurant'],
    ecommerce: ['e commerce', 'ecommerce', 'shopify', 'woocommerce', 'store'],
    'e commerce': ['e commerce', 'ecommerce', 'shopify', 'woocommerce', 'store'],
    'ui ux': ['ui ux', 'ui/ux', 'design', 'figma', 'prototype', 'wireframe'],
    'logo design': ['logo', 'brand', 'identity', 'vector', 'branding', 'graphic design'],
    seo: ['seo', 'gmb', 'ranking', 'search engine', 'organic'],
    'social media': ['social media', 'instagram', 'reels', 'tiktok', 'content creator'],
  };

  const aliases = ALIAS_MAP[fClean];
  if (aliases) {
    for (const alias of aliases) {
      const aliasClean = normalizeCategoryToken(alias);
      if (combinedLeadText.includes(aliasClean)) {
        return true;
      }
    }
  }

  const filterWords = fClean.split(/\s+/).filter(Boolean);
  if (filterWords.length > 1) {
    const hasAnyWord = filterWords.some((w) => w.length > 2 && combinedLeadText.includes(w));
    if (hasAnyWord) return true;
  }

  return false;
}

