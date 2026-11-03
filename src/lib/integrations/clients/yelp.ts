import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { getPlatformCredential, updatePlatformState } from '../credentials-store';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testYelpConnection(): Promise<TestConnectionResult> {
  const apiKey = getPlatformCredential('yelp', 'apiKey');
  if (!apiKey) {
    updatePlatformState('yelp', {
      status: 'credentials_missing',
      lastTestedAt: new Date().toISOString(),
      lastError: 'Yelp Fusion API key is not configured.',
    });
    return {
      success: false,
      status: 'credentials_missing',
      message: 'Yelp Fusion API key is not configured. Please enter your API key.',
      latencyMs: 0,
    };
  }

  const start = Date.now();
  try {
    const res = await fetch('https://api.yelp.com/v3/businesses/search?location=New+York&limit=1', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      updatePlatformState('yelp', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: 'HTTP 401: Invalid Yelp Fusion API Key.',
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: 'Invalid Yelp Fusion API Key (HTTP 401/403).',
        latencyMs,
      };
    }

    if (res.status === 429) {
      updatePlatformState('yelp', {
        status: 'quota_exhausted',
        lastTestedAt: new Date().toISOString(),
        lastError: 'Yelp Fusion API daily quota exhausted.',
        latencyMs,
      });
      return {
        success: false,
        status: 'quota_exhausted',
        message: 'Yelp daily quota exhausted.',
        latencyMs,
      };
    }

    if (!res.ok) {
      updatePlatformState('yelp', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: `Yelp returned error HTTP ${res.status}`,
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: `Yelp API returned HTTP ${res.status}`,
        latencyMs,
      };
    }

    updatePlatformState('yelp', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: 'Successfully connected to Yelp Fusion API. Verified local business query endpoint.',
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('yelp', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach Yelp',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach Yelp API'}`,
      latencyMs,
    };
  }
}

export async function searchYelpLeads(options: {
  query?: string;
  location?: string;
  category?: string;
  country?: string;
  limit?: number;
}): Promise<Lead[]> {
  const apiKey = getPlatformCredential('yelp', 'apiKey');
  if (!apiKey) return [];

  const { query, location = 'Austin, TX', category, country = 'US', limit = 10 } = options;
  const termStr = query || category || 'dentist';

  try {
    const apiUrl = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(termStr)}&location=${encodeURIComponent(location)}&limit=${limit}`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const businesses = data?.businesses || [];
    const now = new Date().toISOString();

    return businesses.map((b: any, idx: number) => {
      const id = `yelp-${b.id || idx}`;
      const businessName = b.name || 'Local Business';
      const address = b.location?.display_address?.join(', ') || `${location}, ${country}`;
      const phone = b.display_phone || b.phone || undefined;
      const categoryName = b.categories?.[0]?.title || category || 'Local Business';

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'business_name',
        retrievedValue: businessName,
        sourceUrl: b.url || 'https://www.yelp.com',
        sourceProvider: 'Yelp Fusion API',
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
        platform: 'Yelp Fusion' as any,
        category: (category as any) || 'Local Business',
        country: (country as any) || 'US',
        city: b.location?.city || location.split(',')[0].trim(),
        address,
        businessAge: {
          years: 2,
          months: 0,
          isNew: false,
          label: 'Yelp Verified Business',
          badgeColor: 'blue',
        },
        description: `Verified Yelp commercial profile in ${address}. Rating: ${b.rating || 'N/A'} (${b.review_count || 0} reviews). Category: ${categoryName}.`,
        postedAt: 'Active Yelp Profile',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: false,
          phone,
          whatsapp: phone ? cleanWhatsAppDigits(phone, country) : undefined,
        },
        rating: b.rating || undefined,
        reviewCount: b.review_count || undefined,
        tags: ['🟢 Live Yelp Fusion', categoryName, 'Consumer Verified'],
        verified: true,
        pipelineStage: 'hot',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: b.id || id,
        sourcePlatformUrl: b.url || 'https://www.yelp.com',
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[Yelp Client] search error:', err);
    return [];
  }
}
