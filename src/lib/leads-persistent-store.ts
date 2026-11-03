import fs from 'fs';
import path from 'path';
import { Lead } from '@/types';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads-store.json');

function ensureDataDir(): void {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadAllStoredLeads(): Lead[] {
  ensureDataDir();
  if (fs.existsSync(LEADS_FILE)) {
    try {
      const raw = fs.readFileSync(LEADS_FILE, 'utf8');
      const leads: Lead[] = JSON.parse(raw);
      if (Array.isArray(leads)) {
        return leads;
      }
    } catch (err) {
      console.warn('Error reading leads-store.json:', err);
    }
  }
  return [];
}

export function saveAllStoredLeads(leads: Lead[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write leads-store.json:', err);
  }
}

/**
 * Extract normalized canonical domain from a website URL (e.g. "https://www.example.com/about" -> "example.com")
 */
export function extractCanonicalDomain(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  try {
    const withoutProto = url.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    const domain = withoutProto.split('/')[0].split('?')[0].split('#')[0].trim();
    return domain;
  } catch {
    return '';
  }
}

/**
 * Extract clean digit-only phone key for deduplication
 */
export function normalizePhoneKey(phone?: string | null): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 ? digits.slice(-10) : '';
}

/**
 * Extract normalized email key for deduplication
 */
export function normalizeEmailKey(email?: string | null): string {
  if (!email || typeof email !== 'string') return '';
  const trimmed = email.trim().toLowerCase();
  return trimmed.includes('@') ? trimmed : '';
}

/**
 * Persist an array of newly discovered leads with strict multi-attribute deduplication
 * and automatic contact enrichment.
 * 
 * Deduplication checks:
 * 1. Primary ID match
 * 2. Source Platform + sourceListingId match
 * 3. Verified email match
 * 4. Canonical web domain match
 * 5. Normalized phone number match
 * 6. Business name + location match
 * 
 * Returns the count of newly saved records, skipped duplicates, and total stored.
 */
export function persistDiscoveredLeads(newLeads: Lead[]): { savedCount: number; duplicatesSkipped: number; totalStored: number } {
  const currentLeads = loadAllStoredLeads();
  
  // Index existing leads across multiple attributes for rapid lookup and enrichment
  const leadIndexMap = new Map<number, Lead>();
  currentLeads.forEach((l, idx) => leadIndexMap.set(idx, l));

  const idMap = new Map<string, number>();
  const sourceListingMap = new Map<string, number>();
  const emailMap = new Map<string, number>();
  const domainMap = new Map<string, number>();
  const phoneMap = new Map<string, number>();
  const businessKeyMap = new Map<string, number>();

  currentLeads.forEach((l, idx) => {
    if (l.id) idMap.set(l.id.toLowerCase().trim(), idx);
    
    if (l.platform && l.sourceListingId) {
      sourceListingMap.set(`${l.platform.toLowerCase()}::${String(l.sourceListingId).toLowerCase().trim()}`, idx);
    }

    const emailKey = normalizeEmailKey(l.contact?.email);
    if (emailKey) emailMap.set(emailKey, idx);

    const domainKey = extractCanonicalDomain(l.contact?.website);
    if (domainKey) domainMap.set(domainKey, idx);

    const phoneKey = normalizePhoneKey(l.contact?.phone);
    if (phoneKey) phoneMap.set(phoneKey, idx);

    const nameStr = (l.businessName || l.title || '').toLowerCase().trim();
    const locStr = (l.city || l.country || '').toLowerCase().trim();
    if (nameStr) {
      businessKeyMap.set(`${nameStr}::${locStr}`, idx);
    }
  });

  let savedCount = 0;
  let duplicatesSkipped = 0;
  let hasEnrichments = false;
  const toAdd: Lead[] = [];

  for (const lead of newLeads) {
    const idKey = (lead.id || '').toLowerCase().trim();
    const sourceKey = lead.platform && lead.sourceListingId ? `${lead.platform.toLowerCase()}::${String(lead.sourceListingId).toLowerCase().trim()}` : '';
    const emailKey = normalizeEmailKey(lead.contact?.email);
    const domainKey = extractCanonicalDomain(lead.contact?.website);
    const phoneKey = normalizePhoneKey(lead.contact?.phone);
    const nameStr = (lead.businessName || lead.title || '').toLowerCase().trim();
    const locStr = (lead.city || lead.country || '').toLowerCase().trim();
    const businessKey = nameStr ? `${nameStr}::${locStr}` : '';

    // Check existing match
    let matchIdx: number | undefined;
    if (idKey && idMap.has(idKey)) matchIdx = idMap.get(idKey);
    else if (sourceKey && sourceListingMap.has(sourceKey)) matchIdx = sourceListingMap.get(sourceKey);
    else if (emailKey && emailMap.has(emailKey)) matchIdx = emailMap.get(emailKey);
    else if (domainKey && domainMap.has(domainKey)) matchIdx = domainMap.get(domainKey);
    else if (phoneKey && phoneMap.has(phoneKey)) matchIdx = phoneMap.get(phoneKey);
    else if (businessKey && businessKeyMap.has(businessKey)) matchIdx = businessKeyMap.get(businessKey);

    if (matchIdx !== undefined) {
      duplicatesSkipped++;
      // Enrich existing lead with newly found verified details
      const existing = leadIndexMap.get(matchIdx);
      if (existing) {
        let changed = false;
        if (!existing.contact) existing.contact = { hasWebsite: false };

        if (!existing.contact.email && lead.contact?.email) {
          existing.contact.email = lead.contact.email;
          existing.contact.emailStatus = lead.contact.emailStatus || 'VERIFIED';
          changed = true;
        }
        if (!existing.contact.phone && lead.contact?.phone) {
          existing.contact.phone = lead.contact.phone;
          existing.contact.whatsapp = lead.contact.whatsapp;
          changed = true;
        }
        if (!existing.contact.website && lead.contact?.website) {
          existing.contact.website = lead.contact.website;
          existing.contact.hasWebsite = true;
          changed = true;
        }
        if (!existing.contact.contactPerson && lead.contact?.contactPerson) {
          existing.contact.contactPerson = lead.contact.contactPerson;
          changed = true;
        }
        if (changed) {
          hasEnrichments = true;
        }
      }
      continue;
    }

    // New lead: register in lookup maps to avoid self-duplicates within newLeads array
    const newIdx = currentLeads.length + toAdd.length;
    if (idKey) idMap.set(idKey, newIdx);
    if (sourceKey) sourceListingMap.set(sourceKey, newIdx);
    if (emailKey) emailMap.set(emailKey, newIdx);
    if (domainKey) domainMap.set(domainKey, newIdx);
    if (phoneKey) phoneMap.set(phoneKey, newIdx);
    if (businessKey) businessKeyMap.set(businessKey, newIdx);

    toAdd.push(lead);
    savedCount++;
  }

  if (toAdd.length > 0 || hasEnrichments) {
    const updated = [...toAdd, ...currentLeads];
    saveAllStoredLeads(updated);
    return { savedCount, duplicatesSkipped, totalStored: updated.length };
  }

  return { savedCount: 0, duplicatesSkipped, totalStored: currentLeads.length };
}

/**
 * Update an existing lead by ID
 */
export function updateStoredLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = loadAllStoredLeads();
  const idx = leads.findIndex((l) => l.id.toLowerCase() === id.toLowerCase());
  if (idx === -1) return null;

  const updated: Lead = {
    ...leads[idx],
    ...updates,
  };
  leads[idx] = updated;
  saveAllStoredLeads(leads);
  return updated;
}

/**
 * Delete a lead by ID
 */
export function deleteStoredLead(id: string): boolean {
  const leads = loadAllStoredLeads();
  const initialLen = leads.length;
  const filtered = leads.filter((l) => l.id.toLowerCase() !== id.toLowerCase());
  if (filtered.length !== initialLen) {
    saveAllStoredLeads(filtered);
    return true;
  }
  return false;
}
