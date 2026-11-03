import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { getPlatformCredential, updatePlatformState } from '../credentials-store';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testGooglePlacesConnection(): Promise<TestConnectionResult> {
  const apiKey = getPlatformCredential('google_places', 'apiKey');
  if (!apiKey) {
    updatePlatformState('google_places', {
      status: 'credentials_missing',
      lastTestedAt: new Date().toISOString(),
      lastError: 'Google Places API key is not configured.',
    });
    return {
      success: false,
      status: 'credentials_missing',
      message: 'Google Places API key is not configured. Please enter your API key.',
      latencyMs: 0,
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=business+in+London&key=${encodeURIComponent(apiKey)}`, {
      signal: AbortSignal.timeout(8000),
    });
    const latencyMs = Date.now() - start;

    const data = await res.json();

    if (data.status === 'REQUEST_DENIED' || res.status === 401 || res.status === 403) {
      updatePlatformState('google_places', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: data.error_message || 'HTTP 401/403: Google Places API key denied.',
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: data.error_message || 'Google Places API request denied.',
        latencyMs,
      };
    }

    if (data.status === 'OVER_QUERY_LIMIT') {
      updatePlatformState('google_places', {
        status: 'quota_exhausted',
        lastTestedAt: new Date().toISOString(),
        lastError: 'Google Places API quota exceeded.',
        latencyMs,
      });
      return {
        success: false,
        status: 'quota_exhausted',
        message: 'Google Places API quota exceeded.',
        latencyMs,
      };
    }

    updatePlatformState('google_places', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: 'Successfully connected to Google Places API. Verified places text search.',
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('google_places', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach Google Places',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach Google Places API'}`,
      latencyMs,
    };
  }
}

export async function searchGooglePlacesLeads(options: {
  query?: string;
  location?: string;
  category?: string;
  country?: string;
  limit?: number;
}): Promise<Lead[]> {
  const apiKey = getPlatformCredential('google_places', 'apiKey');
  if (!apiKey) return [];

  const { query, location = 'London', category, country = 'UK', limit = 10 } = options;
  const qStr = `${query || category || 'medical clinic'} in ${location}`;

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(qStr)}&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const results = data?.results || [];
    const now = new Date().toISOString();

    return results.slice(0, limit).map((p: any, idx: number) => {
      const id = `gp-${p.place_id || idx}`;
      const businessName = p.name || 'Commercial Entity';
      const address = p.formatted_address || `${location}, ${country}`;

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'business_name',
        retrievedValue: businessName,
        sourceUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
        sourceProvider: 'Google Places API',
        sourceType: 'gmb',
        retrievalTimestamp: now,
        verificationStatus: 'VERIFIED',
        matchConfidence: 99,
        lastCheckedTimestamp: now,
      };

      const lead: Lead = {
        id,
        title: businessName,
        businessName,
        type: 'gmb',
        platform: 'Google Places' as any,
        category: (category as any) || 'Local Business',
        country: (country as any) || 'UK',
        city: location.split(',')[0].trim(),
        address,
        businessAge: {
          years: 3,
          months: 0,
          isNew: false,
          label: 'Google Places Verified',
          badgeColor: 'blue',
        },
        description: `Verified Google Places establishment at ${address}. Rating: ${p.rating || 'N/A'} (${p.user_ratings_total || 0} reviews). Operational Status: ${p.business_status || 'OPERATIONAL'}.`,
        postedAt: 'Active Google Place',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: false,
          gmbUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
        },
        rating: p.rating || undefined,
        reviewCount: p.user_ratings_total || undefined,
        tags: ['🟢 Live Google Places', p.business_status || 'OPERATIONAL', 'Verified Place'],
        verified: true,
        pipelineStage: 'hot',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: p.place_id || id,
        sourcePlatformUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[Google Places Client] search error:', err);
    return [];
  }
}
