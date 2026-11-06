import { PlatformAdapter, AdapterSearchOptions, PlatformMetadata } from './types';
import { Lead } from '@/types';
import { upworkAdapter } from './upwork.adapter';
import {
  fetchLiveFreelancerProjects,
  fetchLiveRemoteOkJobs,
  fetchLiveRemotiveJobs,
  fetchLiveRedditJobs,
  fetchLiveLocalBusinesses,
} from '@/lib/live-lead-aggregator';
import { searchOsmLeads } from '@/lib/integrations/clients/osm';
import { searchGitHubLeads } from '@/lib/integrations/clients/github';
import { searchOpenCorporatesLeads } from '@/lib/integrations/clients/opencorporates';
import { searchWikidataLeads } from '@/lib/integrations/clients/wikidata';
import { searchHuggingFaceLeads } from '@/lib/integrations/clients/huggingface';

/**
 * 1. Freelancer.com Live Adapter
 */
export const freelancerAdapter: PlatformAdapter = {
  meta: {
    id: 'freelancer',
    name: 'Freelancer.com',
    region: 'global',
    category: 'freelance',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Public active projects endpoint: 60 req/min.',
    termsNotes: 'Compliant with Freelancer.com open API terms for public marketplace search.',
    officialApiDocUrl: 'https://developers.freelancer.com',
    websiteUrl: 'https://www.freelancer.com',
  },
  search: async (opts) => fetchLiveFreelancerProjects({ query: opts.query, category: opts.category, limit: opts.limit }),
};

/**
 * 2. Remote OK Live Adapter
 */
export const remoteOkAdapter: PlatformAdapter = {
  meta: {
    id: 'remoteok',
    name: 'Remote OK',
    region: 'international',
    category: 'remote_jobs',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Public REST API endpoint: 30 req/min.',
    termsNotes: 'Compliant with RemoteOK public API guidelines for direct client posts.',
    officialApiDocUrl: 'https://remoteok.com/api',
    websiteUrl: 'https://remoteok.com',
  },
  search: async (opts) => fetchLiveRemoteOkJobs({ limit: opts.limit }),
};

/**
 * 3. Remotive Live Adapter
 */
export const remotiveAdapter: PlatformAdapter = {
  meta: {
    id: 'remotive',
    name: 'Remotive',
    region: 'international',
    category: 'remote_jobs',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Public REST API: 20 req/min.',
    termsNotes: 'Compliant with Remotive Developer Terms for published vacancies.',
    officialApiDocUrl: 'https://remotive.com/api/remote-jobs',
    websiteUrl: 'https://remotive.com',
  },
  search: async (opts) => fetchLiveRemotiveJobs({ query: opts.query, category: opts.category, limit: opts.limit }),
};

/**
 * 4. Google Maps & OpenStreetMap Nominatim Live Business Radar Adapter
 */
export const googleMapsOsmAdapter: PlatformAdapter = {
  meta: {
    id: 'google_maps',
    name: 'Google Maps & Local Radar',
    region: 'global',
    category: 'local_business',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Nominatim 1 req/sec; Google Places 100 req/sec with key.',
    termsNotes: 'Uses OpenStreetMap ODbL and Google Places API Terms of Service.',
    officialApiDocUrl: 'https://nominatim.org',
    websiteUrl: 'https://www.google.com/maps',
  },
  search: async (opts) => searchOsmLeads({ query: opts.query, city: opts.city, country: opts.country, category: opts.category, limit: opts.limit }),
};

/**
 * 5. Reddit Live RFP Adapter
 */
export const redditAdapter: PlatformAdapter = {
  meta: {
    id: 'reddit',
    name: 'Reddit (r/forhire)',
    region: 'international',
    category: 'freelance',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Reddit JSON API: 60 req/min.',
    termsNotes: 'Permitted public JSON access for client [Hiring] listings.',
    officialApiDocUrl: 'https://www.reddit.com/dev/api',
    websiteUrl: 'https://www.reddit.com/r/forhire',
  },
  search: async (opts) => fetchLiveRedditJobs({ limit: opts.limit }),
};

/**
 * 6. GitHub Organizations Live Adapter
 */
export const gitHubAdapter: PlatformAdapter = {
  meta: {
    id: 'github',
    name: 'GitHub Organizations',
    region: 'global',
    category: 'developer',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Unauthenticated 60 req/hr; 5,000 req/hr with token.',
    termsNotes: 'Uses GitHub Public REST API v3 in compliance with GitHub Terms.',
    officialApiDocUrl: 'https://docs.github.com/en/rest',
    websiteUrl: 'https://github.com',
  },
  search: async (opts) => searchGitHubLeads({ query: opts.query, city: opts.city, country: opts.country, limit: opts.limit }),
};

/**
 * 7. OpenCorporates Live Registry Adapter
 */
export const openCorporatesAdapter: PlatformAdapter = {
  meta: {
    id: 'opencorporates',
    name: 'OpenCorporates',
    region: 'global',
    category: 'b2b_directories',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Open public REST API: 20 req/min.',
    termsNotes: 'Public statutory corporate registry access under Open Database License.',
    officialApiDocUrl: 'https://api.opencorporates.com',
    websiteUrl: 'https://opencorporates.com',
  },
  search: async (opts) => searchOpenCorporatesLeads({ query: opts.query, country: opts.country, limit: opts.limit }),
};

/**
 * 8. Wikidata Knowledge Graph Live Adapter
 */
export const wikidataAdapter: PlatformAdapter = {
  meta: {
    id: 'wikidata',
    name: 'Wikidata Corporate Graph',
    region: 'global',
    category: 'b2b_directories',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'SPARQL Endpoint: 5 req/sec.',
    termsNotes: 'CC0 Public Domain entity knowledge graph.',
    officialApiDocUrl: 'https://query.wikidata.org',
    websiteUrl: 'https://www.wikidata.org',
  },
  search: async (opts) => searchWikidataLeads({ query: opts.query, category: opts.category, country: opts.country, limit: opts.limit }),
};

/**
 * 9. Hugging Face AI Organizations Live Adapter
 */
export const huggingFaceAdapter: PlatformAdapter = {
  meta: {
    id: 'huggingface',
    name: 'Hugging Face AI Labs',
    region: 'global',
    category: 'developer',
    apiStatus: 'live_operational',
    hasLiveApi: true,
    authType: 'none',
    rateLimits: 'Public API: 100 req/min.',
    termsNotes: 'Hugging Face public Hub API guidelines.',
    officialApiDocUrl: 'https://huggingface.co/docs/hub/api',
    websiteUrl: 'https://huggingface.co',
  },
  search: async (opts) => searchHuggingFaceLeads({ query: opts.query, category: opts.category, limit: opts.limit }),
};

// =========================================================================
// PAKISTAN LEAD GEN PLATFORMS (Active & Extensible Adapter Stubs)
// =========================================================================

export const pakistanPlatformAdapters: PlatformAdapter[] = [
  // 1. Kamaion (Emerging PK Freelance Platform)
  {
    meta: {
      id: 'kamaion',
      name: 'Kamaion Pakistan',
      region: 'pakistan',
      category: 'freelance',
      apiStatus: 'no_public_api',
      hasLiveApi: false,
      authType: 'partner_agreement',
      rateLimits: 'No public REST endpoint currently published.',
      termsNotes: 'Kamaion terms restrict unauthorized scraping. Requires direct platform integration agreement.',
      websiteUrl: 'https://kamaion.com',
    },
    search: async () => [],
  },

  // 2. Rozee.pk (Pakistan's Primary B2B Job & Employer Portal)
  {
    meta: {
      id: 'rozee_pk',
      name: 'Rozee.pk',
      region: 'pakistan',
      category: 'remote_jobs',
      apiStatus: 'partner_only',
      hasLiveApi: false,
      authType: 'api_key',
      rateLimits: 'Enterprise Recruiter API: Tiered by commercial agreement.',
      termsNotes: 'Rozee.pk terms of service Section 6 strictly prohibits automated scraping. Partner API access required for employer candidate listings.',
      websiteUrl: 'https://www.rozee.pk',
    },
    search: async () => [],
  },

  // 3. OLX Pakistan (Local Commercial Services & Opportunities)
  {
    meta: {
      id: 'olx_pk',
      name: 'OLX Pakistan',
      region: 'pakistan',
      category: 'classifieds',
      apiStatus: 'no_public_api',
      hasLiveApi: false,
      authType: 'partner_agreement',
      rateLimits: 'Protected by Akamai Edge Bot Manager. 0 public endpoints.',
      termsNotes: 'OLX Pakistan terms of use Section 4 prohibits automated spidering and harvesting. Adapter stub prepared for official feed integration.',
      websiteUrl: 'https://www.olx.com.pk',
    },
    search: async () => [],
  },

  // 4. PakWheels (Automotive & Local Enterprise Dealers)
  {
    meta: {
      id: 'pakwheels',
      name: 'PakWheels Business Hub',
      region: 'pakistan',
      category: 'local_business',
      apiStatus: 'no_public_api',
      hasLiveApi: false,
      authType: 'partner_agreement',
      rateLimits: 'Private enterprise API.',
      termsNotes: 'PakWheels terms prohibit scraping of dealer contact databases without signed API agreement.',
      websiteUrl: 'https://www.pakwheels.com',
    },
    search: async () => [],
  },

  // 5. LinkedIn Pakistan
  {
    meta: {
      id: 'linkedin_pk',
      name: 'LinkedIn Pakistan',
      region: 'pakistan',
      category: 'social_media',
      apiStatus: 'requires_auth',
      authType: 'oauth2',
      hasLiveApi: false,
      rateLimits: 'LinkedIn Marketing API: 100 req/day/user unapproved; Tiered enterprise.',
      termsNotes: 'LinkedIn TOS Section 8.2 strictly bans web scraping. Integration requires LinkedIn Developer Program OAuth with Lead Sync permissions.',
      officialApiDocUrl: 'https://learn.microsoft.com/en-us/linkedin/marketing/lead-sync',
      websiteUrl: 'https://www.linkedin.com',
    },
    search: async () => [],
  },

  // 6. Facebook Groups (Pakistan Business & Freelance Communities)
  {
    meta: {
      id: 'facebook_groups',
      name: 'Facebook Groups (PK Communities)',
      region: 'pakistan',
      category: 'social_media',
      apiStatus: 'requires_auth',
      authType: 'oauth2',
      hasLiveApi: false,
      rateLimits: 'Meta Graph API: 200 calls/hour per app user.',
      termsNotes: 'Meta Groups API requires App Review and group admin authorization under Meta Platform Terms.',
      officialApiDocUrl: 'https://developers.facebook.com/docs/groups-api',
      websiteUrl: 'https://www.facebook.com',
    },
    search: async () => [],
  },

  // 7. Instagram Business (Local PK Brands & Merchants)
  {
    meta: {
      id: 'instagram_pk',
      name: 'Instagram (Local PK Brands)',
      region: 'pakistan',
      category: 'social_media',
      apiStatus: 'requires_auth',
      authType: 'oauth2',
      hasLiveApi: false,
      rateLimits: 'Instagram Graph API: 200 calls/hour.',
      termsNotes: 'Requires Meta Business Login with instagram_basic and pages_read_engagement permissions.',
      officialApiDocUrl: 'https://developers.facebook.com/docs/instagram-api',
      websiteUrl: 'https://www.instagram.com',
    },
    search: async () => [],
  },

  // 8. Clutch Pakistan Agency Directory
  {
    meta: {
      id: 'clutch_pk',
      name: 'Clutch (Pakistan Agencies)',
      region: 'pakistan',
      category: 'b2b_directories',
      apiStatus: 'partner_only',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Cloudflare Enterprise protected. Clutch Partner API only.',
      termsNotes: 'Clutch terms prohibit scraping. Commercial syndication partnership required.',
      officialApiDocUrl: 'https://clutch.co/api',
      websiteUrl: 'https://clutch.co/pk',
    },
    search: async () => [],
  },

  // 9. Sortlist
  {
    meta: {
      id: 'sortlist_pk',
      name: 'Sortlist',
      region: 'pakistan',
      category: 'b2b_directories',
      apiStatus: 'partner_only',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Restricted partner API.',
      termsNotes: 'Sortlist Terms of Use prohibit automated extraction of agency briefs.',
      websiteUrl: 'https://www.sortlist.com',
    },
    search: async () => [],
  },

  // 10. Truelancer (Active in Pakistan & South Asia)
  {
    meta: {
      id: 'truelancer',
      name: 'Truelancer',
      region: 'pakistan',
      category: 'freelance',
      apiStatus: 'partner_only',
      authType: 'api_key',
      hasLiveApi: false,
      rateLimits: 'Commercial API: 100 req/min upon key provisioning.',
      termsNotes: 'Truelancer requires official API key from developer relations.',
      websiteUrl: 'https://www.truelancer.com',
    },
    search: async () => [],
  },

  // 11. Guru.com
  {
    meta: {
      id: 'guru',
      name: 'Guru',
      region: 'pakistan',
      category: 'freelance',
      apiStatus: 'requires_auth',
      authType: 'api_key',
      hasLiveApi: false,
      rateLimits: 'Guru Open API: 250 req/day with registered developer key.',
      termsNotes: 'Requires registered developer application on developer.guru.com.',
      officialApiDocUrl: 'https://www.guru.com/api',
      websiteUrl: 'https://www.guru.com',
    },
    search: async () => [],
  },

  // 12. Fiverr
  {
    meta: {
      id: 'fiverr',
      name: 'Fiverr',
      region: 'pakistan',
      category: 'freelance',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'PerimeterX protected; zero public search API endpoints.',
      termsNotes: 'Fiverr TOS Section 5 explicitly prohibits automated scraping, spiders, and scrapers. Adapter ready for affiliate/partner API.',
      websiteUrl: 'https://www.fiverr.com',
    },
    search: async () => [],
  },
];

// =========================================================================
// INTERNATIONAL LEAD GEN PLATFORMS (Active & Extensible Adapter Stubs)
// =========================================================================

export const internationalPlatformAdapters: PlatformAdapter[] = [
  // 1. PeoplePerHour
  {
    meta: {
      id: 'peopleperhour',
      name: 'PeoplePerHour',
      region: 'international',
      category: 'freelance',
      apiStatus: 'requires_auth',
      authType: 'api_key',
      hasLiveApi: false,
      rateLimits: 'Developer API: 60 req/min.',
      termsNotes: 'Requires Developer API application approval from PeoplePerHour.',
      websiteUrl: 'https://www.peopleperhour.com',
    },
    search: async () => [],
  },

  // 2. Contra
  {
    meta: {
      id: 'contra',
      name: 'Contra',
      region: 'international',
      category: 'freelance',
      apiStatus: 'partner_only',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Private GraphQL API.',
      termsNotes: 'Contra terms restrict scraping. Official developer partnership required.',
      websiteUrl: 'https://contra.com',
    },
    search: async () => [],
  },

  // 3. Toptal
  {
    meta: {
      id: 'toptal',
      name: 'Toptal',
      region: 'international',
      category: 'freelance',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Closed proprietary talent network.',
      termsNotes: 'Toptal Terms strictly prohibit automated crawling.',
      websiteUrl: 'https://www.toptal.com',
    },
    search: async () => [],
  },

  // 4. Workana
  {
    meta: {
      id: 'workana',
      name: 'Workana',
      region: 'international',
      category: 'freelance',
      apiStatus: 'partner_only',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Private API.',
      termsNotes: 'Workana Latin America & Global marketplace terms apply.',
      websiteUrl: 'https://www.workana.com',
    },
    search: async () => [],
  },

  // 5. 99designs
  {
    meta: {
      id: '99designs',
      name: '99designs by Vista',
      region: 'international',
      category: 'design',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'No public REST search API.',
      termsNotes: 'Vistaprint 99designs terms prohibit unauthorized harvesting of client contest briefs.',
      websiteUrl: 'https://99designs.com',
    },
    search: async () => [],
  },

  // 6. DesignCrowd
  {
    meta: {
      id: 'designcrowd',
      name: 'DesignCrowd',
      region: 'international',
      category: 'design',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'No public client API.',
      termsNotes: 'DesignCrowd terms apply.',
      websiteUrl: 'https://www.designcrowd.com',
    },
    search: async () => [],
  },

  // 7. Dribbble Jobs
  {
    meta: {
      id: 'dribbble',
      name: 'Dribbble Hiring',
      region: 'international',
      category: 'design',
      apiStatus: 'partner_only',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Dribbble Developer API requires official review.',
      termsNotes: 'Dribbble API Terms of Service apply.',
      websiteUrl: 'https://dribbble.com/jobs',
    },
    search: async () => [],
  },

  // 8. Behance
  {
    meta: {
      id: 'behance',
      name: 'Behance (Adobe)',
      region: 'international',
      category: 'design',
      apiStatus: 'partner_only',
      authType: 'api_key',
      hasLiveApi: false,
      rateLimits: 'Adobe Developer Console: 100 req/min.',
      termsNotes: 'Adobe Developer Terms apply.',
      websiteUrl: 'https://www.behance.net',
    },
    search: async () => [],
  },

  // 9. Bark.com
  {
    meta: {
      id: 'bark',
      name: 'Bark.com',
      region: 'international',
      category: 'local_business',
      apiStatus: 'partner_only',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Bark Partner Webhooks API.',
      termsNotes: 'Paid lead marketplace model. Integration requires Bark Pro partner account.',
      websiteUrl: 'https://www.bark.com',
    },
    search: async () => [],
  },

  // 10. DesignRush
  {
    meta: {
      id: 'designrush',
      name: 'DesignRush',
      region: 'international',
      category: 'b2b_directories',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Protected directory.',
      termsNotes: 'DesignRush terms prohibit unauthorized content extraction.',
      websiteUrl: 'https://www.designrush.com',
    },
    search: async () => [],
  },

  // 11. GoodFirms
  {
    meta: {
      id: 'goodfirms',
      name: 'GoodFirms',
      region: 'international',
      category: 'b2b_directories',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'No public REST endpoint.',
      termsNotes: 'GoodFirms terms of use apply.',
      websiteUrl: 'https://www.goodfirms.co',
    },
    search: async () => [],
  },

  // 12. Indeed
  {
    meta: {
      id: 'indeed',
      name: 'Indeed Employer Radar',
      region: 'international',
      category: 'remote_jobs',
      apiStatus: 'partner_only',
      authType: 'oauth2',
      hasLiveApi: false,
      rateLimits: 'Indeed Publisher API: Restricted to ATS certified partners.',
      termsNotes: 'Indeed Developer Terms Section 3 strictly limits access to certified commercial partners.',
      officialApiDocUrl: 'https://developer.indeed.com',
      websiteUrl: 'https://www.indeed.com',
    },
    search: async () => [],
  },

  // 13. Wellfound (AngelList)
  {
    meta: {
      id: 'wellfound',
      name: 'Wellfound (AngelList)',
      region: 'international',
      category: 'remote_jobs',
      apiStatus: 'partner_only',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'GraphQL Recruit API: Requires Recruit Pro enterprise plan.',
      termsNotes: 'Wellfound Terms prohibit non-partner data scraping.',
      websiteUrl: 'https://wellfound.com',
    },
    search: async () => [],
  },

  // 14. Thumbtack
  {
    meta: {
      id: 'thumbtack',
      name: 'Thumbtack',
      region: 'international',
      category: 'local_business',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Closed proprietary marketplace.',
      termsNotes: 'Thumbtack terms prohibit automated scrapers.',
      websiteUrl: 'https://www.thumbtack.com',
    },
    search: async () => [],
  },

  // 15. Hubstaff Talent
  {
    meta: {
      id: 'hubstaff_talent',
      name: 'Hubstaff Talent',
      region: 'international',
      category: 'remote_jobs',
      apiStatus: 'requires_auth',
      authType: 'api_key',
      hasLiveApi: false,
      rateLimits: 'Hubstaff API v2: 60 req/min with Personal Access Token.',
      termsNotes: 'Requires developer token from developer.hubstaff.com.',
      officialApiDocUrl: 'https://developer.hubstaff.com',
      websiteUrl: 'https://talent.hubstaff.com',
    },
    search: async () => [],
  },

  // 16. SolidGigs
  {
    meta: {
      id: 'solidgigs',
      name: 'SolidGigs',
      region: 'international',
      category: 'freelance',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Paid subscription model; no open developer endpoint.',
      termsNotes: 'Subscriber-only curation service.',
      websiteUrl: 'https://solidgigs.com',
    },
    search: async () => [],
  },

  // 17. FlexJobs
  {
    meta: {
      id: 'flexjobs',
      name: 'FlexJobs',
      region: 'international',
      category: 'remote_jobs',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Member-only portal; zero open endpoints.',
      termsNotes: 'Subscription terms prohibit automated retrieval.',
      websiteUrl: 'https://www.flexjobs.com',
    },
    search: async () => [],
  },

  // 18. SimplyHired
  {
    meta: {
      id: 'simplyhired',
      name: 'SimplyHired',
      region: 'international',
      category: 'remote_jobs',
      apiStatus: 'no_public_api',
      authType: 'partner_agreement',
      hasLiveApi: false,
      rateLimits: 'Indeed subsidiary; no public REST API.',
      termsNotes: 'SimplyHired terms of service apply.',
      websiteUrl: 'https://www.simplyhired.com',
    },
    search: async () => [],
  },
];

// =========================================================================
// MASTER ADAPTER REGISTRY & RUNTIME DISPATCHER
// =========================================================================

export const ALL_PLATFORM_ADAPTERS: PlatformAdapter[] = [
  // 10 Live Operating Adapters
  upworkAdapter,
  freelancerAdapter,
  remoteOkAdapter,
  remotiveAdapter,
  googleMapsOsmAdapter,
  redditAdapter,
  gitHubAdapter,
  openCorporatesAdapter,
  wikidataAdapter,
  huggingFaceAdapter,

  // 12 Pakistan Platform Stubs
  ...pakistanPlatformAdapters,

  // 18 International Platform Stubs
  ...internationalPlatformAdapters,
];

/**
 * Get all registered platform adapters
 */
export function getAllAdapters(): PlatformAdapter[] {
  return ALL_PLATFORM_ADAPTERS;
}

/**
 * Get only platforms that have live operational APIs
 */
export function getActiveAdapters(): PlatformAdapter[] {
  return ALL_PLATFORM_ADAPTERS.filter((a) => a.meta.hasLiveApi && a.meta.apiStatus === 'live_operational');
}

/**
 * Find an adapter by ID
 */
export function getAdapterById(id: string): PlatformAdapter | undefined {
  const cleanId = id.toLowerCase().trim();
  return ALL_PLATFORM_ADAPTERS.find((a) => a.meta.id.toLowerCase() === cleanId);
}

/**
 * Query across active adapters in parallel with timeout safety and normalize output
 */
export async function executeMultiPlatformSearch(options: AdapterSearchOptions): Promise<{
  leads: Lead[];
  platformStatuses: Record<string, { status: string; count: number; error?: string }>;
  durationMs: number;
}> {
  const startTime = Date.now();
  const active = getActiveAdapters();
  const platformStatuses: Record<string, { status: string; count: number; error?: string }> = {};
  const allLeads: Lead[] = [];

  const tasks = active.map(async (adapter) => {
    try {
      const results = await adapter.search(options);
      platformStatuses[adapter.meta.id] = {
        status: results.length > 0 ? 'success' : 'empty',
        count: results.length,
      };
      allLeads.push(...results);
    } catch (err: any) {
      platformStatuses[adapter.meta.id] = {
        status: 'error',
        count: 0,
        error: err?.message || 'Adapter query failed',
      };
    }
  });

  await Promise.allSettled(tasks);

  // Multi-attribute deduplication across retrieved leads
  const seen = new Set<string>();
  const uniqueLeads: Lead[] = [];

  for (const l of allLeads) {
    const idKey = (l.id || '').toLowerCase().trim();
    const nameKey = (l.businessName || l.title || '').toLowerCase().trim();
    if (idKey && !seen.has(idKey) && (!nameKey || !seen.has(nameKey))) {
      seen.add(idKey);
      if (nameKey) seen.add(nameKey);
      uniqueLeads.push(l);
    }
  }

  return {
    leads: uniqueLeads,
    platformStatuses,
    durationMs: Date.now() - startTime,
  };
}
