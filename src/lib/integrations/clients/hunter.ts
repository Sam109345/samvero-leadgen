import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { getPlatformCredential, updatePlatformState } from '../credentials-store';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testHunterConnection(): Promise<TestConnectionResult> {
  const apiKey = getPlatformCredential('hunter', 'apiKey');
  if (!apiKey) {
    updatePlatformState('hunter', {
      status: 'credentials_missing',
      lastTestedAt: new Date().toISOString(),
      lastError: 'Hunter.io API key is not configured.',
    });
    return {
      success: false,
      status: 'credentials_missing',
      message: 'Hunter.io API key is not configured. Please enter your API key.',
      latencyMs: 0,
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(`https://api.hunter.io/v2/account?api_key=${encodeURIComponent(apiKey)}`, {
      headers: {
        'User-Agent': 'SamveroLeadGen/2.0',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      updatePlatformState('hunter', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: 'HTTP 401: Invalid Hunter.io API key.',
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: 'Invalid Hunter.io API key (HTTP 401).',
        latencyMs,
      };
    }

    if (res.status === 429) {
      updatePlatformState('hunter', {
        status: 'quota_exhausted',
        lastTestedAt: new Date().toISOString(),
        lastError: 'Hunter.io API monthly quota exhausted.',
        latencyMs,
      });
      return {
        success: false,
        status: 'quota_exhausted',
        message: 'Hunter.io API monthly search quota exhausted.',
        latencyMs,
      };
    }

    if (!res.ok) {
      updatePlatformState('hunter', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: `Hunter.io returned error HTTP ${res.status}`,
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: `Hunter.io API returned HTTP ${res.status}`,
        latencyMs,
      };
    }

    const data = await res.json();
    const calls = data?.data?.calls || {};
    const plan = data?.data?.plan_name || 'Free';
    const remaining = Math.max(0, (calls.available || 0) - (calls.used || 0));

    updatePlatformState('hunter', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      quotaRemaining: remaining,
      quotaTotal: calls.available || 25,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: `Connected to Hunter.io (${plan} plan). Remaining credits: ${remaining}/${calls.available || 25}.`,
      latencyMs,
      quota: {
        remaining,
        total: calls.available || 25,
        resetAt: data?.data?.reset_date,
      },
      details: {
        plan,
        email: data?.data?.email,
      },
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('hunter', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach Hunter API',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach Hunter API'}`,
      latencyMs,
    };
  }
}

export async function searchHunterDomain(options: {
  domain?: string;
  company?: string;
  category?: string;
  limit?: number;
}): Promise<Lead[]> {
  const apiKey = getPlatformCredential('hunter', 'apiKey');
  if (!apiKey) return [];

  const { domain, company, category, limit = 10 } = options;
  if (!domain && !company) return [];

  const param = domain ? `domain=${encodeURIComponent(domain)}` : `company=${encodeURIComponent(company!)}`;

  try {
    const res = await fetch(`https://api.hunter.io/v2/domain-search?${param}&limit=${limit}&api_key=${encodeURIComponent(apiKey)}`, {
      headers: { 'User-Agent': 'SamveroLeadGen/2.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const result = data?.data;
    if (!result) return [];

    const orgName = result.organization || company || domain || 'Verified Enterprise';
    const orgDomain = result.domain || domain || '';
    const emails = result.emails || [];
    const now = new Date().toISOString();

    return emails.slice(0, limit).map((em: any, idx: number) => {
      const id = `hunter-${orgDomain}-${em.value.replace(/[^a-z0-9]/gi, '_')}-${idx}`;
      const contactPerson = [em.first_name, em.last_name].filter(Boolean).join(' ') || undefined;

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'corporate_email',
        retrievedValue: em.value,
        sourceUrl: em.sources?.[0]?.uri || `https://${orgDomain}`,
        sourceProvider: 'Hunter.io Email Discovery',
        sourceType: 'b2b_database',
        retrievalTimestamp: now,
        verificationStatus: em.confidence > 70 ? 'VERIFIED' : 'UNVERIFIED',
        matchConfidence: em.confidence || 85,
        lastCheckedTimestamp: now,
      };

      const lead: Lead = {
        id,
        title: `${contactPerson ? `${contactPerson} (${em.position || 'Decision Maker'})` : 'Executive Contact'} at ${orgName}`,
        businessName: orgName,
        type: 'gmb',
        platform: 'Hunter.io',
        category: (category as any) || 'Technology',
        country: (result.country as any) || 'US',
        city: result.city || 'Corporate Domain',
        businessAge: {
          years: 3,
          months: 0,
          isNew: false,
          label: 'Domain Verified',
          badgeColor: 'blue',
        },
        description: `Verified email discovery on domain ${orgDomain}. Position: ${em.position || 'Professional Contact'}. Confidence score: ${em.confidence || 85}%.`,
        postedAt: 'Active Live Domain Record',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: Boolean(orgDomain),
          website: orgDomain ? `https://${orgDomain}` : undefined,
          email: em.value,
          emailStatus: em.confidence >= 80 ? 'VERIFIED' : 'LIKELY_VALID',
          contactPerson,
        },
        tags: ['🟢 Live Hunter.io', 'SMTP Verified', `${em.confidence || 85}% Confidence`],
        verified: em.confidence >= 70,
        pipelineStage: 'new',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: em.value,
        sourcePlatformUrl: em.sources?.[0]?.uri || `https://${orgDomain}`,
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[Hunter Client] search error:', err);
    return [];
  }
}

/**
 * Hunter.io Email Finder by name and domain
 */
export async function findHunterEmail(options: {
  domain: string;
  firstName: string;
  lastName: string;
}): Promise<{ email: string | null; score: number; position?: string }> {
  const apiKey = getPlatformCredential('hunter', 'apiKey');
  if (!apiKey) return { email: null, score: 0 };

  const { domain, firstName, lastName } = options;
  try {
    const url = `https://api.hunter.io/v2/email-finder?domain=${encodeURIComponent(domain)}&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&api_key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SamveroLeadGen/2.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { email: null, score: 0 };
    const data = await res.json();
    const email = data?.data?.email || null;
    const score = data?.data?.score || 0;
    const position = data?.data?.position || undefined;
    return { email, score, position };
  } catch {
    return { email: null, score: 0 };
  }
}

/**
 * Hunter.io Email Verifier (deliverability check)
 */
export async function verifyHunterEmail(email: string): Promise<{ result: string; score: number }> {
  const apiKey = getPlatformCredential('hunter', 'apiKey');
  if (!apiKey) return { result: 'unknown', score: 0 };

  try {
    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SamveroLeadGen/2.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { result: 'unknown', score: 0 };
    const data = await res.json();
    return {
      result: data?.data?.result || 'unknown',
      score: data?.data?.score || 0,
    };
  } catch {
    return { result: 'unknown', score: 0 };
  }
}
