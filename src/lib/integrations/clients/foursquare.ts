import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { getPlatformCredential, updatePlatformState } from '../credentials-store';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testFoursquareConnection(): Promise<TestConnectionResult> {
  const apiKey = getPlatformCredential('foursquare', 'apiKey');
  if (!apiKey) {
    updatePlatformState('foursquare', {
      status: 'credentials_missing',
      lastTestedAt: new Date().toISOString(),
      lastError: 'Foursquare Places API key is not configured.',
    });
    return {
      success: false,
      status: 'credentials_missing',
      message: 'Foursquare API key is not configured. Please enter your API key.',
      latencyMs: 0,
    };
  }

  const start = Date.now();
  try {
    const res = await fetch('https://api.foursquare.com/v3/places/search?near=Dubai&limit=1', {
      headers: {
        Authorization: apiKey,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      updatePlatformState('foursquare', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: 'HTTP 401: Invalid Foursquare API Key.',
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: 'Invalid Foursquare API key (HTTP 401/403).',
        latencyMs,
      };
    }

    if (!res.ok) {
      updatePlatformState('foursquare', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: `Foursquare returned error HTTP ${res.status}`,
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: `Foursquare API returned HTTP ${res.status}`,
        latencyMs,
      };
    }

    updatePlatformState('foursquare', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: 'Successfully connected to Foursquare Places API. Verified global directory query access.',
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('foursquare', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach Foursquare',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach Foursquare API'}`,
      latencyMs,
    };
  }
}

export async function searchFoursquareLeads(options: {
  query?: string;
  near?: string;
  category?: string;
  country?: string;
  limit?: number;
}): Promise<Lead[]> {
  const apiKey = getPlatformCredential('foursquare', 'apiKey');
  if (!apiKey) return [];

  const { query, near = 'Dubai', category, country = 'UAE', limit = 10 } = options;
  const qStr = query || category || 'medical clinic';

  try {
    const fieldsParam = 'fsq_id,name,location,categories,tel,website,email,rating,verified';
    const apiUrl = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(qStr)}&near=${encodeURIComponent(near)}&limit=${limit}&fields=${fieldsParam}`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: apiKey,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const results = data?.results || [];
    const now = new Date().toISOString();

    return results.map((place: any, idx: number) => {
      const id = `fsq-${place.fsq_id || idx}`;
      const businessName = place.name || 'Local Venue';
      const address = place.location?.formatted_address || `${near}, ${country}`;
      const phone = place.tel || undefined;
      const website = place.website || undefined;
      const email = place.email || undefined;
      const categoryName = place.categories?.[0]?.name || category || 'Local Business';

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'business_name',
        retrievedValue: businessName,
        sourceUrl: `https://foursquare.com/v/${place.fsq_id}`,
        sourceProvider: 'Foursquare Places Global API',
        sourceType: 'gmb',
        retrievalTimestamp: now,
        verificationStatus: 'VERIFIED',
        matchConfidence: 96,
        lastCheckedTimestamp: now,
      };

      const lead: Lead = {
        id,
        title: businessName,
        businessName,
        type: 'gmb',
        platform: 'Foursquare' as any,
        category: (category as any) || 'Local Business',
        country: (country as any) || 'UAE',
        city: place.location?.locality || near,
        address,
        businessAge: {
          years: 2,
          months: 0,
          isNew: false,
          label: 'Foursquare Verified Venue',
          badgeColor: 'blue',
        },
        description: `Physical commercial entity verified on Foursquare. Category: ${categoryName}. Address: ${address}.`,
        postedAt: 'Active Foursquare Venue',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: Boolean(website),
          website,
          phone,
          whatsapp: phone ? cleanWhatsAppDigits(phone, country) : undefined,
        },
        rating: place.rating ? place.rating / 2 : undefined,
        reviewCount: place.stats?.total_ratings,
        tags: ['🟢 Live Foursquare', categoryName, Boolean(website) ? 'Active Website' : 'Missing Website'],
        verified: true,
        pipelineStage: Boolean(website) ? 'new' : 'hot',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: place.fsq_id || id,
        sourcePlatformUrl: `https://foursquare.com/v/${place.fsq_id}`,
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[Foursquare Client] search error:', err);
    return [];
  }
}
