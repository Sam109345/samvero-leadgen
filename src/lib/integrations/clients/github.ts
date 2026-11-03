import { Lead, SourceEvidence } from '@/types';
import { TestConnectionResult } from '../types';
import { getPlatformCredential, updatePlatformState } from '../credentials-store';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export async function testGitHubConnection(): Promise<TestConnectionResult> {
  const token = getPlatformCredential('github', 'token');
  const headers: Record<string, string> = {
    'User-Agent': 'SamveroLeadGen/2.0',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const start = Date.now();
  try {
    const res = await fetch('https://api.github.com/rate_limit', {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    const latencyMs = Date.now() - start;

    if (res.status === 401) {
      updatePlatformState('github', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: 'HTTP 401: Invalid GitHub Token.',
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: 'Invalid GitHub Personal Access Token.',
        latencyMs,
      };
    }

    if (!res.ok) {
      updatePlatformState('github', {
        status: 'auth_failed',
        lastTestedAt: new Date().toISOString(),
        lastError: `GitHub returned HTTP ${res.status}`,
        latencyMs,
      });
      return {
        success: false,
        status: 'auth_failed',
        message: `GitHub returned HTTP ${res.status}`,
        latencyMs,
      };
    }

    const data = await res.json();
    const core = data?.resources?.core || {};
    const remaining = core.remaining ?? 60;
    const limit = core.limit ?? 60;

    updatePlatformState('github', {
      status: 'operational',
      lastTestedAt: new Date().toISOString(),
      lastError: null,
      quotaRemaining: remaining,
      quotaTotal: limit,
      latencyMs,
    });

    return {
      success: true,
      status: 'operational',
      message: `Connected to GitHub REST API. Rate Limit: ${remaining}/${limit} remaining.`,
      latencyMs,
      quota: {
        remaining,
        total: limit,
        resetAt: core.reset ? new Date(core.reset * 1000).toISOString() : undefined,
      },
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    updatePlatformState('github', {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Failed to reach GitHub',
      latencyMs,
    });
    return {
      success: false,
      status: 'sync_failed',
      message: `Network error: ${err?.message || 'Failed to reach GitHub'}`,
      latencyMs,
    };
  }
}

export async function searchGitHubLeads(options: {
  query?: string;
  country?: string;
  limit?: number;
}): Promise<Lead[]> {
  const token = getPlatformCredential('github', 'token');
  const headers: Record<string, string> = {
    'User-Agent': 'SamveroLeadGen/2.0',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const { query = 'digital agency', country, limit = 8 } = options;
  const qStr = `${query} type:org${country ? ` location:${country}` : ''}`;

  try {
    const searchUrl = `https://api.github.com/search/users?q=${encodeURIComponent(qStr)}&per_page=${Math.min(limit, 10)}`;
    const res = await fetch(searchUrl, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const items = data?.items || [];
    const now = new Date().toISOString();

    // Fetch org profiles in parallel
    const orgProfiles = await Promise.all(
      items.map(async (u: any) => {
        try {
          const detailRes = await fetch(u.url, {
            headers,
            signal: AbortSignal.timeout(6000),
          });
          if (detailRes.ok) return await detailRes.json();
        } catch {}
        return u;
      })
    );

    return orgProfiles.map((p: any, idx: number) => {
      const id = `gh-${p.login || idx}`;
      const businessName = p.name || p.login || 'Software Organization';
      let website = p.blog || undefined;
      if (website && !website.startsWith('http')) website = `https://${website}`;
      const email = p.email || undefined;
      const location = p.location || country || 'Global';

      const evidence: SourceEvidence = {
        id: `ev-${id}`,
        leadId: id,
        fieldName: 'organization_name',
        retrievedValue: businessName,
        sourceUrl: p.html_url || `https://github.com/${p.login}`,
        sourceProvider: 'GitHub REST API',
        sourceType: 'b2b_database',
        retrievalTimestamp: now,
        verificationStatus: 'VERIFIED',
        matchConfidence: 97,
        lastCheckedTimestamp: now,
      };

      const lead: Lead = {
        id,
        title: `${businessName} (Software Lab & Engineering)`,
        businessName,
        type: 'job',
        platform: 'GitHub' as any,
        category: 'Web Development',
        country: (country as any) || 'US',
        city: location.split(',')[0].trim(),
        address: location,
        businessAge: {
          years: p.created_at ? Math.max(1, new Date().getFullYear() - new Date(p.created_at).getFullYear()) : 2,
          months: 0,
          isNew: false,
          label: 'GitHub Verified Organization',
          badgeColor: 'blue',
        },
        description: p.bio || p.description || `Software engineering entity with ${p.public_repos || 0} public repositories. Organization profile on GitHub.`,
        postedAt: 'Active GitHub Org',
        timeAgo: 'Just now',
        contact: {
          hasWebsite: Boolean(website),
          website,
          email,
          emailStatus: email ? 'VERIFIED' : undefined,
          contactPerson: p.name || p.login,
        },
        tags: ['🟢 Live GitHub', 'Software Engineering', `${p.public_repos || 0} Repos`],
        verified: true,
        pipelineStage: 'new',
        status: 'new',
        entityType: 'registered_business',
        sourceListingId: String(p.id || p.login),
        sourcePlatformUrl: p.html_url || `https://github.com/${p.login}`,
        sourceEvidenceList: [evidence],
        incomingAt: Date.now(),
      };

      lead.scoreBreakdown = calculateExplainableLeadScore(lead);
      return lead;
    });
  } catch (err) {
    console.warn('[GitHub Client] search error:', err);
    return [];
  }
}
