import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { getPlatformCredential, updatePlatformState } from '../credentials-store';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testSerpApiConnection(): Promise<TestConnectionResult> {
  const apiKey = getPlatformCredential('serpapi', 'apiKey');
  if (!apiKey) {
    updatePlatformState('serpapi', {
      status: 'credentials_missing',
      lastTestedAt: new Date().toISOString(),
      lastError: 'SerpApi API key is not configured.',
    });
    return {
      success: false,
      status: 'credentials_missing',
      message: 'SerpApi key is not configured. Please enter your API key.',
      latencyMs: 0,
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(`https://serpapi.com/account?api_key=${encodeURIComponent(apiKey)}`, {
      headers: { 'User-Agent': 'SamveroLeadGen/2.0' },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      updatePlatformState('serpapi', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: 'HTTP 401: Invalid SerpApi API key.',
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: 'Invalid SerpApi API key (HTTP 401).',
        latencyMs,
      };
    }

    if (!res.ok) {
      updatePlatformState('serpapi', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: `SerpApi returned error HTTP ${res.status}`,
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: `SerpApi returned HTTP ${res.status}`,
        latencyMs,
      };
    }

    const data = await res.json();
    const remaining = data?.total_searches_left ?? data?.plan_searches_left ?? null;

    updatePlatformState('serpapi', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      quotaRemaining: remaining,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: `Connected to SerpApi. Remaining searches: ${remaining !== null ? remaining : 'Active'}.`,
      latencyMs,
      quota: {
        remaining: remaining || undefined,
      },
      details: {
        accountEmail: data?.account_email,
        planName: data?.plan_name,
      },
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('serpapi', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach SerpApi',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach SerpApi'}`,
      latencyMs,
    };
  }
}

export async function searchSerpApiLeads(options: {
  query?: string;
  location?: string;
  category?: string;
  country?: string;
  limit?: number;
}): Promise<Lead[]> {
  const apiKey = getPlatformCredential('serpapi', 'apiKey');
  if (!apiKey) return [];

  const { query, location = 'Austin, TX', category, country = 'US', limit = 10 } = options;
  const qStr = `${query || category || 'web design'} in ${location}`;

  try {
    const apiUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(qStr)}&api_key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'SamveroLeadGen/2.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const results = data?.local_results || [];
    const now = new Date().toISOString();

    return results.slice(0, limit).map((r: any, idx: number) => {
      const id = `serp-${r.place_id || idx}`;
      const businessName = r.title || 'Local Commercial Enterprise';
      const website = r.website ? (r.website.startsWith('http') ? r.website : `https://${r.website}`) : undefined;
      const phone = r.phone || undefined;
      const address = r.address || location;

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'business_name',
        retrievedValue: businessName,
        sourceUrl: r.link || website || 'https://www.google.com/maps',
        sourceProvider: 'SerpApi Google Maps Radar',
        sourceType: 'gmb',
        retrievalTimestamp: now,
        verificationStatus: 'VERIFIED',
        matchConfidence: 98,
        lastCheckedTimestamp: now,
      };

      const lead: Lead = {
        id,
        title: businessName,
        businessName,
        type: 'gmb',
        platform: 'SerpApi' as any,
        category: (category as any) || 'Local Business',
        country: (country as any) || 'US',
        city: location.split(',')[0].trim(),
        address,
        businessAge: {
          years: 2,
          months: 0,
          isNew: false,
          label: 'Google Verified Place',
          badgeColor: 'blue',
        },
        description: `Verified Google Business profile at ${address}. Rating: ${r.rating || 'N/A'} (${r.reviews || 0} reviews). ${website ? 'Active website found.' : 'Missing website on Google profile.'}`,
        postedAt: 'Active Google Listing',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: Boolean(website),
          website,
          phone,
          whatsapp: phone ? cleanWhatsAppDigits(phone, country) : undefined,
          gmbUrl: r.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName + ' ' + address)}`,
        },
        rating: r.rating || undefined,
        reviewCount: r.reviews || undefined,
        tags: ['🟢 Live SerpApi', Boolean(website) ? 'Active Website' : 'Missing Website (Hot Pitch)', 'Google Maps Verified'],
        verified: true,
        pipelineStage: Boolean(website) ? 'new' : 'hot',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: r.place_id ? String(r.place_id) : id,
        sourcePlatformUrl: r.link || website || 'https://www.google.com/maps',
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[SerpApi Client] search error:', err);
    return [];
  }
}
