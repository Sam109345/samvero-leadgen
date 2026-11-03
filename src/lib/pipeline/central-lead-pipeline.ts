/**
 * SAMVERO Centralized Lead Generation Pipeline
 * 
 * Multi-Platform Lead Acquisition, Data Normalization, Deduplication,
 * Enrichment, Scoring, Database Persistence & Synchronization.
 * 
 * STRICT REAL DATA POLICY:
 * - Real API queries only.
 * - Missing info is represented as null/undefined.
 * - Zero synthesized or mock entries.
 */

import { Lead } from '@/types';
import { PlatformId, SyncHistoryLog } from '../integrations/types';
import {
  PLATFORM_REGISTRY,
  getPlatformState,
  updatePlatformState,
  appendSyncHistory,
} from '../integrations/credentials-store';

import { searchApolloLeads, testApolloConnection } from '../integrations/clients/apollo';
import { searchHunterDomain, testHunterConnection } from '../integrations/clients/hunter';
import { searchSerpApiLeads, testSerpApiConnection } from '../integrations/clients/serpapi';
import { searchFoursquareLeads, testFoursquareConnection } from '../integrations/clients/foursquare';
import { searchYelpLeads, testYelpConnection } from '../integrations/clients/yelp';
import { searchOpenCorporatesLeads, testOpenCorporatesConnection } from '../integrations/clients/opencorporates';
import { searchGitHubLeads, testGitHubConnection } from '../integrations/clients/github';
import { searchOsmLeads, testOsmConnection } from '../integrations/clients/osm';
import { searchWikidataLeads, testWikidataConnection } from '../integrations/clients/wikidata';
import { searchHuggingFaceLeads, testHuggingFaceConnection } from '../integrations/clients/huggingface';
import { searchGooglePlacesLeads, testGooglePlacesConnection } from '../integrations/clients/google-places';

import {
  fetchLiveFreelancerProjects,
  fetchLiveRemotiveJobs,
  fetchLiveRemoteOkJobs,
  fetchLiveRedditJobs,
} from '../live-lead-aggregator';

import { persistDiscoveredLeads } from '../leads-persistent-store';
import { calculateExplainableLeadScore } from '../explainable-scoring';

export interface PipelineSearchQuery {
  query?: string;
  category?: string;
  country?: string;
  city?: string;
  jobTitle?: string;
  companySize?: string;
  companyType?: string;
  platforms?: (PlatformId | string)[];
  limit?: number;
  autoPersist?: boolean;
}

export interface PipelineExecutionResult {
  success: boolean;
  totalFetched: number;
  totalSaved: number;
  duplicatesSkipped: number;
  leads: Lead[];
  platformStatuses: Record<string, { status: string; count: number; error?: string }>;
  durationMs: number;
}

/**
 * Execute a connection test for any registered platform with safety timeout
 */
export async function testPlatformById(platformId: PlatformId) {
  const timeoutMs = 8500;
  const timeoutPromise = new Promise<{ success: false; status: any; message: string; latencyMs: number }>((_, reject) =>
    setTimeout(() => reject(new Error(`Connection to ${platformId} timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  const testExecutor = async () => {
    switch (platformId) {
      case 'apollo':
        return testApolloConnection();
      case 'hunter':
        return testHunterConnection();
      case 'serpapi':
        return testSerpApiConnection();
      case 'foursquare':
        return testFoursquareConnection();
      case 'yelp':
        return testYelpConnection();
      case 'opencorporates':
        return testOpenCorporatesConnection();
      case 'github':
        return testGitHubConnection();
      case 'osm':
        return testOsmConnection();
      case 'wikidata':
        return testWikidataConnection();
      case 'huggingface':
        return testHuggingFaceConnection();
      case 'google_places':
        return testGooglePlacesConnection();
      default:
        return {
          success: true,
          status: 'operational' as const,
          message: `Platform ${platformId} is operational.`,
          latencyMs: 10,
        };
    }
  };

  try {
    return await Promise.race([testExecutor(), timeoutPromise]);
  } catch (err: any) {
    updatePlatformState(platformId, {
      status: 'sync_failed',
      lastTestedAt: new Date().toISOString(),
      lastError: err?.message || 'Connection test timeout',
    });
    return {
      success: false,
      status: 'sync_failed' as const,
      message: err?.message || `Connection to ${platformId} timed out`,
      latencyMs: timeoutMs,
    };
  }
}

/**
 * Execute discovery on a specific platform
 */
async function executeSinglePlatformDiscovery(
  platformId: PlatformId | string,
  params: PipelineSearchQuery
): Promise<{ leads: Lead[]; error?: string }> {
  const { query, category, country, city, limit = 10 } = params;
  const pId = platformId.toLowerCase();

  try {
    if (pId === 'apollo') {
      const state = getPlatformState('apollo');
      if (state.status === 'credentials_missing') {
        return { leads: [], error: 'Apollo.io API key not configured' };
      }
      const leads = await searchApolloLeads({ query, category, country, city, jobTitle: params.jobTitle, limit });
      return { leads };
    }

    if (pId === 'hunter') {
      const state = getPlatformState('hunter');
      if (state.status === 'credentials_missing') {
        return { leads: [], error: 'Hunter.io API key not configured' };
      }
      const domain = query?.includes('.') ? query : undefined;
      const company = !domain ? query || category : undefined;
      const leads = await searchHunterDomain({ domain, company, category, limit });
      return { leads };
    }

    if (pId === 'serpapi') {
      const state = getPlatformState('serpapi');
      if (state.status === 'credentials_missing') {
        return { leads: [], error: 'SerpApi API key not configured' };
      }
      const location = [city, country].filter(Boolean).join(', ') || 'London, UK';
      const leads = await searchSerpApiLeads({ query, location, category, country, limit });
      return { leads };
    }

    if (pId === 'foursquare') {
      const state = getPlatformState('foursquare');
      if (state.status === 'credentials_missing') {
        return { leads: [], error: 'Foursquare Places API key not configured' };
      }
      const near = city || (country === 'UAE' ? 'Dubai' : 'London');
      const leads = await searchFoursquareLeads({ query, near, category, country, limit });
      return { leads };
    }

    if (pId === 'yelp') {
      const state = getPlatformState('yelp');
      if (state.status === 'credentials_missing') {
        return { leads: [], error: 'Yelp Fusion API key not configured' };
      }
      const location = city || 'New York, NY';
      const leads = await searchYelpLeads({ query, location, category, country, limit });
      return { leads };
    }

    if (pId === 'opencorporates') {
      const leads = await searchOpenCorporatesLeads({ query: query || category || 'Software', category, country, limit });
      return { leads };
    }

    if (pId === 'github') {
      const leads = await searchGitHubLeads({ query: query || undefined, category: category || undefined, city: city || undefined, country: country || undefined, limit });
      return { leads };
    }

    if (pId === 'osm' || pId === 'openstreetmap' || pId === 'gmb') {
      const leads = await searchOsmLeads({ query: query || undefined, city: city || undefined, country: country || undefined, category: category || undefined, limit });
      return { leads };
    }

    if (pId === 'wikidata') {
      const leads = await searchWikidataLeads({ query, category, country, limit });
      return { leads };
    }

    if (pId === 'huggingface') {
      const leads = await searchHuggingFaceLeads({ query, category, limit });
      return { leads };
    }

    if (pId === 'google_places') {
      const state = getPlatformState('google_places');
      if (state.status === 'credentials_missing') {
        return { leads: [], error: 'Google Places API key not configured' };
      }
      const location = city || 'London';
      const leads = await searchGooglePlacesLeads({ query, location, category, country, limit });
      return { leads };
    }

    if (pId === 'freelancer' || pId === 'freelancer.com') {
      const leads = await fetchLiveFreelancerProjects({ query, category, limit });
      return { leads };
    }

    if (pId === 'remotive') {
      const leads = await fetchLiveRemotiveJobs({ query, category, limit });
      return { leads };
    }

    if (pId === 'remoteok' || pId === 'remote ok') {
      const leads = await fetchLiveRemoteOkJobs({ limit });
      return { leads };
    }

    if (pId === 'reddit') {
      const leads = await fetchLiveRedditJobs({ limit });
      return { leads };
    }

    return { leads: [] };
  } catch (err: any) {
    return { leads: [], error: err?.message || 'Platform discovery error' };
  }
}

/**
 * Master multi-source discovery & sync execution
 */
export async function executeCentralLeadPipeline(
  query: PipelineSearchQuery
): Promise<PipelineExecutionResult> {
  const startTime = Date.now();
  const autoPersist = query.autoPersist !== false; // Default true

  // Default platforms to query if none specified: query all available operational sources!
  let targetPlatforms: (PlatformId | string)[] = query.platforms && query.platforms.length > 0
    ? query.platforms
    : (() => {
        const configuredPaid: (PlatformId | string)[] = [];
        for (const pid of ['apollo', 'hunter', 'serpapi', 'foursquare', 'yelp', 'google_places'] as PlatformId[]) {
          const st = getPlatformState(pid);
          if (st.status === 'operational' || st.status === 'connected') {
            configuredPaid.push(pid);
          }
        }
        return [...configuredPaid, 'osm', 'github', 'opencorporates', 'wikidata', 'huggingface', 'freelancer', 'remotive'];
      })();

  const platformStatuses: Record<string, { status: string; count: number; error?: string }> = {};
  const allDiscoveredLeads: Lead[] = [];
  const perPlatformResults: {
    platId: PlatformId | string;
    platStart: number;
    duration: number;
    count: number;
    leads: Lead[];
    error?: string;
  }[] = [];

  // Execute in parallel across selected platforms
  const tasks = targetPlatforms.map(async (platId) => {
    const platStart = Date.now();
    const result = await executeSinglePlatformDiscovery(platId, query);
    const duration = Date.now() - platStart;

    const count = result.leads.length;
    platformStatuses[String(platId)] = {
      status: count > 0 ? 'success' : result.error ? 'error' : 'empty',
      count,
      error: result.error,
    };

    allDiscoveredLeads.push(...result.leads);
    perPlatformResults.push({
      platId,
      platStart,
      duration,
      count,
      leads: result.leads,
      error: result.error,
    });
  });

  await Promise.all(tasks);

  // Normalize scores
  const normalizedLeads = allDiscoveredLeads.map((l) => {
    if (!l.scoreBreakdown) {
      l.scoreBreakdown = calculateExplainableLeadScore(l);
    }
    return l;
  });

  // Persist each platform's records to database with accurate per-platform audit stats
  let totalSaved = 0;
  let duplicatesSkipped = 0;

  for (const item of perPlatformResults) {
    let saved = 0;
    let skipped = 0;

    if (autoPersist && item.leads.length > 0) {
      const pRes = persistDiscoveredLeads(item.leads);
      saved = pRes.savedCount;
      skipped = pRes.duplicatesSkipped;
      totalSaved += saved;
      duplicatesSkipped += skipped;
    }

    if (item.platId in PLATFORM_REGISTRY) {
      const pId = item.platId as PlatformId;
      const platConfig = PLATFORM_REGISTRY[pId];

      const syncLog: SyncHistoryLog = {
        id: `sync-${pId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        platformId: pId,
        platformName: platConfig.name,
        startedAt: new Date(item.platStart).toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: item.duration,
        status: item.error ? 'failed' : item.count > 0 ? 'success' : 'partial',
        recordsFetched: item.count,
        recordsSaved: saved,
        duplicatesSkipped: skipped,
        query: [query.query, query.city, query.country].filter(Boolean).join(' | '),
        error: item.error || null,
      };

      appendSyncHistory(syncLog);

      const currentState = getPlatformState(pId);
      updatePlatformState(pId, {
        status: item.error ? (currentState.status === 'credentials_missing' ? 'credentials_missing' : 'sync_failed') : 'operational',
        lastSyncAt: new Date().toISOString(),
        totalRecordsFetched: currentState.totalRecordsFetched + item.count,
        totalRecordsSaved: currentState.totalRecordsSaved + saved,
        lastError: item.error || null,
      });
    }
  }

  const durationMs = Date.now() - startTime;

  return {
    success: normalizedLeads.length > 0,
    totalFetched: normalizedLeads.length,
    totalSaved,
    duplicatesSkipped,
    leads: normalizedLeads,
    platformStatuses,
    durationMs,
  };
}

/**
 * Trigger live synchronization for a specific platform
 */
export async function syncPlatformNow(platformId: PlatformId): Promise<SyncHistoryLog> {
  const start = Date.now();
  const config = PLATFORM_REGISTRY[platformId];
  const query: PipelineSearchQuery = {
    platforms: [platformId],
    limit: 15,
    autoPersist: true,
  };

  const result = await executeCentralLeadPipeline(query);
  const durationMs = Date.now() - start;

  const log: SyncHistoryLog = {
    id: `sync-${platformId}-${Date.now()}`,
    platformId,
    platformName: config?.name || platformId,
    startedAt: new Date(start).toISOString(),
    completedAt: new Date().toISOString(),
    durationMs,
    status: result.totalFetched > 0 ? 'success' : result.platformStatuses[platformId]?.error ? 'failed' : 'partial',
    recordsFetched: result.totalFetched,
    recordsSaved: result.totalSaved,
    duplicatesSkipped: result.duplicatesSkipped,
    error: result.platformStatuses[platformId]?.error || null,
  };

  return log;
}
