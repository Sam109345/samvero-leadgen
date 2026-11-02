/**
 * SAMVERO Lead Workspace Store (CommonJS bridge for test suites)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MASTER_SECRET =
  process.env.ENCRYPTION_KEY ||
  process.env.SESSION_SECRET ||
  'samvero_lead_portal_encryption_secret_2026_key_32b';

function getEncryptionKey() {
  return crypto.scryptSync(MASTER_SECRET, 'samvero_salt_workspace', 32);
}

function encryptSensitive(plainText) {
  if (!plainText) return '';
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    return '';
  }
}

function decryptSensitive(cipherPackage) {
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
  } catch (err) {
    console.error('Decryption failed:', err);
    return '';
  }
}

const LOCAL_STORE_FILE = path.join(process.cwd(), 'lead-workspace-store.json');

function readLocalDatabase() {
  try {
    if (!fs.existsSync(LOCAL_STORE_FILE)) {
      return {
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
    }
    const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
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
  }
}

function writeLocalDatabase(db) {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed writing workspace store file:', err);
  }
}

function getUserLeadState(userId, leadId) {
  const db = readLocalDatabase();
  const key = `${userId}_${leadId}`;
  return db.leadStates[key] || {
    id: key,
    userId,
    leadId,
    status: 'New Lead',
    updatedAt: new Date().toISOString(),
  };
}

function updateUserLeadStatus(userId, leadId, newStatus, metadata = {}) {
  const db = readLocalDatabase();
  const key = `${userId}_${leadId}`;
  const now = new Date().toISOString();
  const prevStatus = db.leadStates[key]?.status || 'New Lead';

  const existing = db.leadStates[key] || {
    id: key,
    userId,
    leadId,
    status: 'New Lead',
    updatedAt: now,
  };

  existing.status = newStatus;
  existing.updatedAt = now;
  if (newStatus === 'Approached' && !existing.approachedAt) {
    existing.approachedAt = now;
    existing.lastContactDate = now;
  }

  db.leadStates[key] = existing;

  // Add activity log
  const logItem = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    leadId,
    action: 'status_changed',
    description: `Status changed from "${prevStatus}" to "${newStatus}"${metadata.reason ? ` (Reason: ${metadata.reason})` : ''}`,
    metadata: { ...metadata, prevStatus, newStatus },
    createdAt: now,
  };
  db.activityLogs.unshift(logItem);

  writeLocalDatabase(db);
  return existing;
}

function addLeadFollowup(userId, leadId, dueDate, notes) {
  const db = readLocalDatabase();
  const id = `fup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();
  const fup = {
    id,
    userId,
    leadId,
    dueDate,
    notes,
    status: 'pending',
    createdAt: now,
  };
  db.followups[id] = fup;

  db.activityLogs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    leadId,
    action: 'followup_added',
    description: `Scheduled follow-up for ${dueDate}: "${notes}"`,
    createdAt: now,
  });

  writeLocalDatabase(db);
  return fup;
}

function addLeadNote(userId, leadId, content) {
  const db = readLocalDatabase();
  const id = `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();
  const note = {
    id,
    userId,
    leadId,
    content,
    createdAt: now,
    updatedAt: now,
  };
  db.notes[id] = note;

  db.activityLogs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    leadId,
    action: 'note_added',
    description: `Added private observation note: "${content.substring(0, 60)}${content.length > 60 ? '...' : ''}"`,
    createdAt: now,
  });

  writeLocalDatabase(db);
  return note;
}

function getLeadActivityLogs(userId, leadId) {
  const db = readLocalDatabase();
  return db.activityLogs.filter((l) => l.userId === userId && l.leadId === leadId);
}

function updateLeadFollowupStatus(userId, followupId, status, newDueDate) {
  const db = readLocalDatabase();
  const followup = db.followups[followupId];
  if (!followup || followup.userId !== userId) return null;

  followup.status = status;
  if (status === 'completed') {
    followup.completedAt = new Date().toISOString();
    db.activityLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      leadId: followup.leadId,
      action: 'followup_completed',
      description: 'Follow-up marked as completed',
      createdAt: new Date().toISOString(),
    });
  } else if (status === 'rescheduled' && newDueDate) {
    followup.dueDate = newDueDate;
    db.activityLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      leadId: followup.leadId,
      action: 'followup_rescheduled',
      description: `Follow-up rescheduled to ${newDueDate}`,
      createdAt: new Date().toISOString(),
    });
  }

  writeLocalDatabase(db);
  return followup;
}

function saveEmailDraft(userId, leadId, data) {
  const db = readLocalDatabase();
  const id = `draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();
  const draft = {
    id,
    userId,
    leadId,
    subject: data.subject,
    htmlContent: data.htmlContent,
    plainText: data.plainText,
    category: data.category,
    createdAt: now,
    updatedAt: now,
  };
  db.emailDrafts[id] = draft;
  writeLocalDatabase(db);
  return draft;
}

function getEmailDraftForLead(userId, leadId) {
  const db = readLocalDatabase();
  const drafts = Object.values(db.emailDrafts || {}).filter(
    (d) => d.userId === userId && d.leadId === leadId
  );
  if (drafts.length === 0) return null;
  return drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
}

function computeLeadWorkspaceStats(userId, allTotalLeads) {
  const db = readLocalDatabase();
  const userStates = Object.values(db.leadStates || {}).filter((s) => s.userId === userId);
  let approachedClients = 0;
  let waitingForResponse = 0;
  let followUpRequired = 0;
  let interestedClients = 0;
  let convertedLeads = 0;
  let notInterested = 0;
  let wastedLeads = 0;
  let closedLeads = 0;

  for (const s of userStates) {
    if (s.status === 'Approached') approachedClients++;
    else if (s.status === 'Waiting for Client Response') waitingForResponse++;
    else if (s.status === 'Follow-up Required') followUpRequired++;
    else if (s.status === 'Interested') interestedClients++;
    else if (s.status === 'Converted / Won') convertedLeads++;
    else if (s.status === 'Not Interested') notInterested++;
    else if (s.status === 'Wasted Lead') wastedLeads++;
    else if (s.status === 'Closed') closedLeads++;
  }

  const nonNewCount = approachedClients + waitingForResponse + followUpRequired + interestedClients + convertedLeads + notInterested + wastedLeads + closedLeads;
  const newLeads = Math.max(0, (allTotalLeads || []).length - nonNewCount);

  return {
    newLeads,
    approachedClients,
    waitingForResponse,
    followupsDue: followUpRequired,
    interestedClients,
    convertedLeads,
    notInterested,
    wastedLeads,
    closedLeads,
  };
}

function normalizeCategoryToken(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[/\\_-]/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function matchLeadCategory(filter, leadCategory, leadTags = []) {
  if (!filter || filter === 'all') return true;

  const fClean = normalizeCategoryToken(filter);
  const catClean = normalizeCategoryToken(leadCategory || '');
  const tagsClean = (leadTags || []).map(normalizeCategoryToken);
  const combinedLeadText = `${catClean} ${tagsClean.join(' ')}`;

  if (fClean && combinedLeadText.includes(fClean)) return true;

  const ALIAS_MAP = {
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

module.exports = {
  encryptSensitive,
  decryptSensitive,
  readLocalDatabase,
  writeLocalDatabase,
  getUserLeadState,
  updateUserLeadStatus,
  addLeadFollowup,
  updateLeadFollowupStatus,
  addLeadNote,
  getLeadActivityLogs,
  saveEmailDraft,
  getEmailDraftForLead,
  computeLeadWorkspaceStats,
  normalizeCategoryToken,
  matchLeadCategory,
};

