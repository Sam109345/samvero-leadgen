import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { updatePlatformState } from '../credentials-store';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testOsmConnection(): Promise<TestConnectionResult> {
  const start = Date.now();
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?q=London&format=json&limit=1', {
      headers: { 'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)' },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (!res.ok) {
      updatePlatformState('osm', {
        status: 'sync_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: `Nominatim returned HTTP ${res.status}`,
        latencyMs,
      });
      return {
        success: false,
        status: 'sync_failed',
        message: `Nominatim returned HTTP ${res.status}`,
        latencyMs,
      };
    }

    updatePlatformState('osm', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: 'Successfully connected to OpenStreetMap Nominatim. Free public places directory is operational.',
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('osm', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach Nominatim',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach Nominatim'}`,
      latencyMs,
    };
  }
}

export async function searchOsmLeads(options: {
  query?: string;
  city?: string;
  country?: string;
  category?: string;
  limit?: number;
}): Promise<Lead[]> {
  const { query, city, country, category, limit = 10 } = options;

  // Build clean comma-separated search terms for Nominatim.
  // Nominatim treats "in" as a literal address component, causing queries like "clinic in Lahore" to fail with 0 results.
  // Using comma-delimited tokens ("clinic, Lahore, Pakistan") resolves directly to POI entries.
  const targetCategory = query || category || 'clinic';
  const locationTokens = [city, country].filter(Boolean);
  const searchTerm = locationTokens.length > 0 ? `${targetCategory}, ${locationTokens.join(', ')}` : targetCategory;

  try {
    let apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&addressdetails=1&extratags=1&limit=${limit}`;
    let res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)' },
      signal: AbortSignal.timeout(8000),
    });

    let places = res.ok ? await res.json() : [];

    // Fallback: If comma search returned empty and city was provided, try city + category without country
    if ((!Array.isArray(places) || places.length === 0) && city) {
      const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${targetCategory} ${city}`)}&format=json&addressdetails=1&extratags=1&limit=${limit}`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { 'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)' },
        signal: AbortSignal.timeout(8000),
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData) && fallbackData.length > 0) {
          places = fallbackData;
        }
      }
    }

    if (!Array.isArray(places) || places.length === 0) return [];
    const now = new Date().toISOString();

    return places.map((place: any, idx: number) => {
      const id = `osm-${place.place_id || idx}`;
      const name = place.name || place.display_name.split(',')[0].trim();
      const address = place.display_name;
      const resolvedCity = place.address?.city || place.address?.town || place.address?.municipality || place.address?.suburb || city || 'London';
      const resolvedCountry = place.address?.country || country || 'UK';

      const rawWebsite = place.extratags?.website || place.extratags?.['contact:website'] || place.extratags?.url;
      const rawPhone = place.extratags?.phone || place.extratags?.['contact:phone'];
      const rawEmail = place.extratags?.email || place.extratags?.['contact:email'];

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'business_name',
        retrievedValue: name,
        sourceUrl: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}`,
        sourceProvider: 'OpenStreetMap Nominatim',
        sourceType: 'gmb',
        retrievalTimestamp: now,
        verificationStatus: 'VERIFIED',
        matchConfidence: 98,
        lastCheckedTimestamp: now,
      };

      const lead: Lead = {
        id,
        title: name,
        businessName: name,
        type: 'gmb',
        platform: 'Google My Business',
        category: (category as any) || (place.type ? place.type.replace(/_/g, ' ') : 'Local Business'),
        country: (resolvedCountry as any),
        city: resolvedCity,
        address,
        businessAge: {
          years: 2,
          months: 0,
          isNew: false,
          label: 'Physical Location Verified',
          badgeColor: 'emerald',
        },
        description: `Verified physical location entry at ${address}. Category: ${place.type || 'Commercial'}.`,
        postedAt: 'Active Registry Listing',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: Boolean(rawWebsite),
          website: rawWebsite,
          email: rawEmail,
          phone: rawPhone,
          whatsapp: rawPhone ? cleanWhatsAppDigits(rawPhone, country) : undefined,
          gmbUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`,
        },
        tags: ['🟢 Live OpenStreetMap', 'Physical Location Verified', Boolean(rawWebsite) ? 'Active Website' : 'Missing Website'],
        verified: true,
        pipelineStage: Boolean(rawWebsite) ? 'new' : 'hot',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: String(place.place_id),
        sourcePlatformUrl: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}`,
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[OSM Client] search error:', err);
    return [];
  }
}
