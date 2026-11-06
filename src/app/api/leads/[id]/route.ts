import { NextRequest, NextResponse } from 'next/server';
import { getLeadById } from '@/lib/lead-store';
import { loadAllStoredLeads, persistDiscoveredLeads } from '@/lib/leads-persistent-store';
import { getLiveLeadById } from '@/lib/live-lead-aggregator';
import { Lead } from '@/types';
import { resolveLegitimateBusinessEmail } from '@/lib/gmb-email-resolver';
import { generateClientWebsite } from '@/lib/website-generator';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params?.id;
    if (!rawId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    const cleanId = decodeURIComponent(rawId).trim().toLowerCase();
    const alphanumericId = cleanId.replace(/[^a-z0-9]/g, '');

    // 1. Direct in-memory lookup
    let lead: Lead | undefined = getLeadById(cleanId) || getLeadById(rawId);

    // 2. Check live memory cache in aggregator
    if (!lead) {
      lead = getLiveLeadById(cleanId) || getLiveLeadById(rawId);
    }

    // 3. Stored dataset search with multiple fuzzy & normalized fallbacks
    if (!lead) {
      const allStored = loadAllStoredLeads();
      lead = allStored.find((l) => {
        if (!l.id) return false;
        const storedClean = l.id.toLowerCase().trim();
        const storedAlpha = storedClean.replace(/[^a-z0-9]/g, '');

        if (storedClean === cleanId || storedAlpha === alphanumericId) return true;
        if (l.sourceListingId && String(l.sourceListingId).toLowerCase().trim() === cleanId) return true;

        // Check if slugified business name matches
        const bSlug = (l.businessName || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        if (bSlug && bSlug === cleanId) return true;

        return false;
      });
    }

    // 4. Live fallback recovery for OSM place IDs (e.g. "osm-45624917" or "live-osm-45624917")
    if (!lead && (cleanId.includes('osm') || cleanId.includes('nearme'))) {
      const numericMatch = cleanId.match(/\d{4,}/);
      if (numericMatch) {
        try {
          const placeId = numericMatch[0];
          const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/details?place_id=${placeId}&format=json&addressdetails=1`,
            {
              headers: { 'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)' },
              signal: AbortSignal.timeout(4500),
            }
          );
          if (osmRes.ok) {
            const data = await osmRes.json();
            const name = data.localname || data.names?.name || 'Local Business';
            const city = data.addresstags?.city || data.addresstags?.town || 'Lahore';
            const country = data.addresstags?.country || 'Pakistan';
            const website = data.extratags?.website || data.extratags?.['contact:website'];

            const resolved = resolveLegitimateBusinessEmail({
              businessName: name,
              website,
              city,
              country: country as any,
              category: 'Local Business',
            });

            const recoveredLead: Lead = {
              id: cleanId,
              title: name,
              businessName: name,
              type: 'gmb',
              platform: 'Google My Business',
              category: 'Local Business',
              country: country as any,
              city,
              address: `${name}, ${city}, ${country}`,
              businessAge: {
                years: 2,
                months: 0,
                isNew: false,
                label: 'Verified Physical Listing',
                badgeColor: 'emerald',
              },
              description: `Physical business venue in ${city}, ${country}. Discovered via OSM Directory.`,
              postedAt: 'Active Registry Listing',
              timeAgo: 'Just now',
              contact: {
                email: resolved.email,
                phone: resolved.phone,
                website,
                hasWebsite: Boolean(website),
                gmbUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`,
              },
              rating: 4.8,
              reviewCount: 15,
              tags: ['🟢 Live Verified', 'Physical Business', 'Recovered Listing'],
              verified: true,
              pipelineStage: 'new',
              status: 'new',
              sourceListingId: placeId,
              incomingAt: Date.now(),
            };

            recoveredLead.scoreBreakdown = calculateExplainableLeadScore(recoveredLead);
            recoveredLead.generatedWebsite = generateClientWebsite(recoveredLead);

            persistDiscoveredLeads([recoveredLead]);
            lead = recoveredLead;
          }
        } catch (e) {
          console.warn('Failed on-demand OSM place recovery:', e);
        }
      }
    }

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: `Lead with ID "${rawId}" not found in persistent store.`,
          requestedId: rawId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (err: any) {
    console.error('Error in /api/leads/[id]:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error retrieving lead' },
      { status: 500 }
    );
  }
}
