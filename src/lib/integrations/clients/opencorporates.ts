import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { getPlatformCredential, updatePlatformState } from '../credentials-store';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testOpenCorporatesConnection(): Promise<TestConnectionResult> {
  const apiToken = getPlatformCredential('opencorporates', 'apiToken');
  const tokenParam = apiToken ? `&api_token=${encodeURIComponent(apiToken)}` : '';

  const start = Date.now();
  try {
    const res = await fetch(`https://api.opencorporates.com/v0.4/companies/search?q=technology&per_page=1${tokenParam}`, {
      headers: {
        'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      updatePlatformState('opencorporates', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: 'HTTP 401/403: Invalid OpenCorporates API Token.',
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: 'Invalid OpenCorporates API Token.',
        latencyMs,
      };
    }

    if (res.status === 429) {
      updatePlatformState('opencorporates', {
        status: 'quota_exhausted',
        lastTestedAt: new Date().toISOString(),
        lastError: 'OpenCorporates rate limit exceeded.',
        latencyMs,
      });
      return {
        success: false,
        status: 'quota_exhausted',
        message: 'OpenCorporates rate limit reached. Consider adding an API token.',
        latencyMs,
      };
    }

    if (!res.ok) {
      updatePlatformState('opencorporates', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: `OpenCorporates returned HTTP ${res.status}`,
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: `OpenCorporates returned HTTP ${res.status}`,
        latencyMs,
      };
    }

    const data = await res.json();
    const total = data?.results?.total_count || 0;

    updatePlatformState('opencorporates', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: `Connected to OpenCorporates. Verified access to global registry (${total.toLocaleString()} companies indexed).`,
      latencyMs,
      details: {
        totalCompanies: total,
        authenticated: Boolean(apiToken),
      },
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('opencorporates', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach OpenCorporates',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach OpenCorporates'}`,
      latencyMs,
    };
  }
}

export async function searchOpenCorporatesLeads(options: {
  query?: string;
  category?: string;
  country?: string;
  limit?: number;
}): Promise<Lead[]> {
  const apiToken = getPlatformCredential('opencorporates', 'apiToken');
  const tokenParam = apiToken ? `&api_token=${encodeURIComponent(apiToken)}` : '';

  const { query = 'Software', category, country, limit = 10 } = options;
  let jurisdictionParam = '';
  if (country === 'US') jurisdictionParam = '&jurisdiction_code=us';
  else if (country === 'UK') jurisdictionParam = '&jurisdiction_code=gb';
  else if (country === 'UAE') jurisdictionParam = '&jurisdiction_code=ae';

  try {
    const apiUrl = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(query)}${jurisdictionParam}&per_page=${Math.min(limit, 30)}&order=score${tokenParam}`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const companies = data?.results?.companies || [];
    const now = new Date().toISOString();

    return companies.map((item: any, idx: number) => {
      const c = item.company;
      const id = `oc-${c.jurisdiction_code}-${c.company_number || idx}`;
      const businessName = c.name || 'Registered Corporation';
      const incorporationYear = c.incorporation_date ? new Date(c.incorporation_date).getFullYear() : null;
      const years = incorporationYear ? Math.max(1, new Date().getFullYear() - incorporationYear) : 2;

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'legal_entity_name',
        retrievedValue: businessName,
        sourceUrl: c.opencorporates_url || 'https://opencorporates.com',
        sourceProvider: 'OpenCorporates Legal Registry',
        sourceType: 'b2b_database',
        retrievalTimestamp: now,
        verificationStatus: 'VERIFIED',
        matchConfidence: 99,
        lastCheckedTimestamp: now,
      };

      const lead: Lead = {
        id,
        title: `${businessName} (${c.company_type || 'Corporation'})`,
        businessName,
        type: 'gmb',
        platform: 'OpenCorporates' as any,
        category: (category as any) || (query !== 'Software' ? query : undefined) || 'Registered Business',
        country: (country as any) || (c.jurisdiction_code?.toUpperCase() === 'GB' ? 'UK' : c.jurisdiction_code?.toUpperCase() === 'AE' ? 'UAE' : 'US'),
        city: c.registered_address_in_full || `${c.jurisdiction_code?.toUpperCase()} Jurisdiction`,
        address: c.registered_address_in_full || undefined,
        businessAge: {
          years,
          months: 0,
          isNew: years <= 1,
          label: incorporationYear ? `Registered ${incorporationYear}` : 'Incorporated Entity',
          badgeColor: 'blue',
        },
        description: `Official corporate registry filing #${c.company_number} in jurisdiction ${c.jurisdiction_code}. Legal Status: ${c.current_status || 'Active'}.`,
        postedAt: c.incorporation_date ? `Inc. ${c.incorporation_date}` : 'Active Filing',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: false,
          contactPerson: undefined,
        },
        tags: ['🟢 Live OpenCorporates', `Jurisdiction: ${c.jurisdiction_code?.toUpperCase()}`, c.current_status || 'Active Filing'],
        verified: true,
        pipelineStage: 'new',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: c.company_number || id,
        sourcePlatformUrl: c.opencorporates_url || 'https://opencorporates.com',
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[OpenCorporates Client] search error:', err);
    return [];
  }
}
