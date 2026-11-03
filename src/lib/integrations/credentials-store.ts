import fs from 'fs';
import path from 'path';
import { PlatformConfig, PlatformId, PlatformState, SyncHistoryLog, IntegrationStatus } from './types';
import { encryptSensitive, decryptSensitive } from '@/lib/lead-workspace-store';

const INTEGRATIONS_FILE = path.join(process.cwd(), 'data', 'integrations-store.json');
const SYNC_HISTORY_FILE = path.join(process.cwd(), 'data', 'sync-history.json');

export const PLATFORM_REGISTRY: Record<PlatformId, PlatformConfig> = {
  apollo: {
    id: 'apollo',
    name: 'Apollo.io',
    category: 'primary_b2b',
    description: 'Enterprise B2B prospect discovery, decision-maker verification, corporate hierarchies, and direct contact emails.',
    website: 'https://www.apollo.io',
    docsUrl: 'https://apolloio.github.io/apollo-api-docs/',
    isPrimary: true,
    isFree: false,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'Apollo Master API Key',
        placeholder: 'e.g. apollo_live_sec_...',
        type: 'password',
        description: 'Obtain from Apollo.io Settings > Integrations > API Keys',
      },
    ],
    defaultRateLimitPerMin: 60,
  },
  hunter: {
    id: 'hunter',
    name: 'Hunter.io',
    category: 'primary_b2b',
    description: 'Corporate domain email discovery, SMTP verification, confidence scoring, and professional pattern recognition.',
    website: 'https://hunter.io',
    docsUrl: 'https://hunter.io/api-documentation/v2',
    isPrimary: true,
    isFree: false,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'Hunter.io API Key',
        placeholder: 'e.g. 5a1b2c3d4e5f6...',
        type: 'password',
        description: 'Obtain from Hunter.io Dashboard > API Keys (Free tier gives 25 searches/month)',
      },
    ],
    defaultRateLimitPerMin: 15,
  },
  serpapi: {
    id: 'serpapi',
    name: 'SerpApi (Google Search & Maps)',
    category: 'primary_local',
    description: 'Real-time Google Search and Google Maps business intelligence, contact snippet parsing, and local presence auditing.',
    website: 'https://serpapi.com',
    docsUrl: 'https://serpapi.com/search-api',
    isPrimary: true,
    isFree: false,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'SerpApi Private Key',
        placeholder: 'e.g. 9f8e7d6c5b4a...',
        type: 'password',
        description: 'Obtain from SerpApi Account Dashboard (Free tier gives 100 searches/month)',
      },
    ],
    defaultRateLimitPerMin: 20,
  },
  foursquare: {
    id: 'foursquare',
    name: 'Foursquare Places API',
    category: 'primary_local',
    description: 'Global commercial directory with 100M+ physical venues, verified phone numbers, addresses, and business category taxonomy.',
    website: 'https://foursquare.com',
    docsUrl: 'https://location.foursquare.com/developer/reference/places-api-overview',
    isPrimary: true,
    isFree: false,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'Foursquare Service API Key',
        placeholder: 'e.g. fsq3...',
        type: 'password',
        description: 'Obtain from Foursquare Developer Console (Free personal tier available)',
      },
    ],
    defaultRateLimitPerMin: 50,
  },
  yelp: {
    id: 'yelp',
    name: 'Yelp Fusion API',
    category: 'primary_local',
    description: 'Commercial local business discovery, consumer reputation scores, direct phone numbers, and physical operational addresses.',
    website: 'https://www.yelp.com',
    docsUrl: 'https://docs.developer.yelp.com/reference/v3_business_search',
    isPrimary: true,
    isFree: false,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'Yelp Fusion API Key',
        placeholder: 'e.g. Bearer Token...',
        type: 'password',
        description: 'Obtain from Yelp Developers > Manage App (Free tier provides 500 API calls/day)',
      },
    ],
    defaultRateLimitPerMin: 30,
  },
  opencorporates: {
    id: 'opencorporates',
    name: 'OpenCorporates',
    category: 'primary_corporate',
    description: 'World’s largest open database of registered commercial companies, legal entity IDs, jurisdiction tracking, and incorporation status.',
    website: 'https://opencorporates.com',
    docsUrl: 'https://api.opencorporates.com/documentation/REST-API-introduction',
    isPrimary: true,
    isFree: true,
    requiredCredentials: [
      {
        key: 'apiToken',
        label: 'OpenCorporates API Token (Optional)',
        placeholder: 'Leave blank to use public open rate limit',
        type: 'password',
        description: 'Free public search works without a token under standard rate limits.',
      },
    ],
    defaultRateLimitPerMin: 20,
  },
  github: {
    id: 'github',
    name: 'GitHub REST API',
    category: 'primary_corporate',
    description: 'Developer, engineering lab, and software agency discovery with public repositories, websites, and verified contact profiles.',
    website: 'https://github.com',
    docsUrl: 'https://docs.github.com/en/rest',
    isPrimary: true,
    isFree: true,
    requiredCredentials: [
      {
        key: 'token',
        label: 'GitHub Personal Access Token (Optional)',
        placeholder: 'ghp_... (Leave blank for public 60 req/hr)',
        type: 'password',
        description: 'Public endpoint works without authentication. Providing a token raises limit to 5,000 req/hr.',
      },
    ],
    defaultRateLimitPerMin: 60,
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap Nominatim',
    category: 'free_directory',
    description: 'Free open-source geographic database for verified physical locations, clinics, salons, retail stores, and commercial venues.',
    website: 'https://www.openstreetmap.org',
    docsUrl: 'https://nominatim.org/release-docs/latest/api/Search/',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [],
    defaultRateLimitPerMin: 30,
  },
  wikidata: {
    id: 'wikidata',
    name: 'Wikidata Knowledge Graph',
    category: 'free_directory',
    description: 'Global open knowledge base identifying official corporate entities, parent organizations, founders, and verified web domains.',
    website: 'https://www.wikidata.org',
    docsUrl: 'https://www.wikidata.org/wiki/Wikidata:Data_access',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [],
    defaultRateLimitPerMin: 60,
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face Hub API',
    category: 'free_directory',
    description: 'AI startups, software agencies, and machine learning organizations building modern models and web apps.',
    website: 'https://huggingface.co',
    docsUrl: 'https://huggingface.co/docs/hub/api',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'User Access Token (Optional)',
        placeholder: 'hf_... (Leave blank for public access)',
        type: 'password',
        description: 'Public search works freely without authentication.',
      },
    ],
    defaultRateLimitPerMin: 60,
  },
  google_places: {
    id: 'google_places',
    name: 'Google Places API',
    category: 'primary_local',
    description: 'Official Google Maps Places engine for high-accuracy local business address, phone, rating, and website resolution.',
    website: 'https://developers.google.com/maps/documentation/places/web-service',
    docsUrl: 'https://developers.google.com/maps/documentation/places/web-service/overview',
    isPrimary: false,
    isFree: false,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'Google Cloud Places API Key',
        placeholder: 'AIzaSy...',
        type: 'password',
        description: 'Obtain from Google Cloud Console with Places API enabled',
      },
    ],
    defaultRateLimitPerMin: 60,
  },
  gemini_ai: {
    id: 'gemini_ai',
    name: 'Google Gemini 1.5 Flash AI',
    category: 'ai_engine',
    description: 'Evidence-based business intelligence scoring, tailored sales pitches, and automated web audit deliverables.',
    website: 'https://aistudio.google.com',
    docsUrl: 'https://ai.google.dev/docs',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [
      {
        key: 'apiKey',
        label: 'Gemini API Key',
        placeholder: 'AIzaSy...',
        type: 'password',
        description: 'Get free key at https://aistudio.google.com/app/apikey',
      },
    ],
    defaultRateLimitPerMin: 15,
  },
  smtp: {
    id: 'smtp',
    name: 'Outbound SMTP Mailer',
    category: 'outreach',
    description: 'Direct outbound cold outreach delivery through your verified corporate email server (Gmail, Outlook, Amazon SES).',
    website: 'https://www.ietf.org/rfc/rfc5321.txt',
    docsUrl: 'https://nodemailer.com/smtp/',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [
      { key: 'smtpHost', label: 'SMTP Host', placeholder: 'smtp.gmail.com', type: 'text', description: 'Server host' },
      { key: 'smtpPort', label: 'SMTP Port', placeholder: '587', type: 'text', description: 'Port (587 or 465)' },
      { key: 'smtpUser', label: 'Username / Email', placeholder: 'you@domain.com', type: 'text', description: 'SMTP username' },
      { key: 'smtpPass', label: 'App Password', placeholder: '••••••••', type: 'password', description: 'App-specific password' },
    ],
    defaultRateLimitPerMin: 20,
  },
  freelancer: {
    id: 'freelancer',
    name: 'Freelancer.com Feed',
    category: 'free_directory',
    description: 'Real-time commercial client project discovery, verified budgets, and active freelance RFPs.',
    website: 'https://www.freelancer.com',
    docsUrl: 'https://developers.freelancer.com',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [],
    defaultRateLimitPerMin: 60,
  },
  remotive: {
    id: 'remotive',
    name: 'Remotive Global Tech Feed',
    category: 'free_directory',
    description: 'Verified remote company listings, tech vacancies, and developer opportunities.',
    website: 'https://remotive.com',
    docsUrl: 'https://remotive.com/api/remote-jobs',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [],
    defaultRateLimitPerMin: 60,
  },
  remoteok: {
    id: 'remoteok',
    name: 'Remote OK Public Feed',
    category: 'free_directory',
    description: 'Live hiring tech companies with actual domains, compensation packages, and tech roles.',
    website: 'https://remoteok.com',
    docsUrl: 'https://remoteok.com/api',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [],
    defaultRateLimitPerMin: 60,
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit Client Hiring Feeds',
    category: 'free_directory',
    description: 'Active client RFP posts, direct hiring requests, and developer contracts from r/forhire and r/freelance_forhire.',
    website: 'https://www.reddit.com',
    docsUrl: 'https://www.reddit.com/r/forhire',
    isPrimary: false,
    isFree: true,
    requiredCredentials: [],
    defaultRateLimitPerMin: 30,
  },
};

interface PersistentIntegrationStore {
  credentials: Record<string, Record<string, string>>; // platformId -> encrypted key/value pairs
  states: Record<string, PlatformState>;
}

function ensureDataDir(): void {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadStore(): PersistentIntegrationStore {
  ensureDataDir();
  if (fs.existsSync(INTEGRATIONS_FILE)) {
    try {
      const raw = fs.readFileSync(INTEGRATIONS_FILE, 'utf8');
      return JSON.parse(raw);
    } catch {
      // fallback
    }
  }
  return { credentials: {}, states: {} };
}

function saveStore(data: PersistentIntegrationStore): void {
  ensureDataDir();
  try {
    fs.writeFileSync(INTEGRATIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save integrations store:', err);
  }
}

export function loadSyncHistory(): SyncHistoryLog[] {
  ensureDataDir();
  if (fs.existsSync(SYNC_HISTORY_FILE)) {
    try {
      const raw = fs.readFileSync(SYNC_HISTORY_FILE, 'utf8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

export function appendSyncHistory(log: SyncHistoryLog): void {
  ensureDataDir();
  const current = loadSyncHistory();
  current.unshift(log);
  // Cap at 200 logs
  const capped = current.slice(0, 200);
  try {
    fs.writeFileSync(SYNC_HISTORY_FILE, JSON.stringify(capped, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save sync history:', err);
  }
}

/**
 * Retrieve decrypted credential for a platform, with fallback to process.env
 */
export function getPlatformCredential(platformId: PlatformId, keyName: string): string {
  const store = loadStore();
  const platformCreds = store.credentials[platformId] || {};
  if (platformCreds[keyName]) {
    const decrypted = decryptSensitive(platformCreds[keyName]);
    if (decrypted) return decrypted;
  }

  // Fallback to environment variables
  if (platformId === 'apollo' && keyName === 'apiKey') {
    return process.env.APOLLO_API_KEY || '';
  }
  if (platformId === 'hunter' && keyName === 'apiKey') {
    return process.env.HUNTER_API_KEY || '';
  }
  if (platformId === 'serpapi' && keyName === 'apiKey') {
    return process.env.SERPAPI_API_KEY || '';
  }
  if (platformId === 'foursquare' && keyName === 'apiKey') {
    return process.env.FOURSQUARE_API_KEY || '';
  }
  if (platformId === 'yelp' && keyName === 'apiKey') {
    return process.env.YELP_API_KEY || '';
  }
  if (platformId === 'opencorporates' && keyName === 'apiToken') {
    return process.env.OPENCORPORATES_API_KEY || '';
  }
  if (platformId === 'github' && keyName === 'token') {
    return process.env.GITHUB_TOKEN || process.env.GITHUB_API_KEY || '';
  }
  if (platformId === 'huggingface' && keyName === 'apiKey') {
    return process.env.HUGGINGFACE_API_KEY || '';
  }
  if (platformId === 'google_places' && keyName === 'apiKey') {
    return process.env.GOOGLE_PLACES_API_KEY || '';
  }
  if (platformId === 'gemini_ai' && keyName === 'apiKey') {
    return process.env.GEMINI_API_KEY || '';
  }
  if (platformId === 'smtp') {
    if (keyName === 'smtpHost') return process.env.SMTP_HOST || 'smtp.gmail.com';
    if (keyName === 'smtpPort') return process.env.SMTP_PORT || '587';
    if (keyName === 'smtpUser') return process.env.SMTP_USER || '';
    if (keyName === 'smtpPass') return process.env.SMTP_PASS || '';
  }

  return '';
}

/**
 * Save credentials for a platform (encrypted at rest)
 */
export function setPlatformCredentials(platformId: PlatformId, creds: Record<string, string>): void {
  const store = loadStore();
  if (!store.credentials[platformId]) store.credentials[platformId] = {};

  for (const [key, val] of Object.entries(creds)) {
    if (val && val.trim()) {
      store.credentials[platformId][key] = encryptSensitive(val.trim());
    }
  }

  // Update state configured keys
  const config = PLATFORM_REGISTRY[platformId];
  if (config) {
    const configuredKeys = config.requiredCredentials
      .filter((req) => Boolean(getPlatformCredential(platformId, req.key)))
      .map((req) => req.key);

    const isFullyConfigured = config.requiredCredentials.length === 0 || configuredKeys.length > 0;

    store.states[platformId] = {
      ...(store.states[platformId] || {
        id: platformId,
        totalRecordsFetched: 0,
        totalRecordsSaved: 0,
        configuredKeys: [],
      }),
      status: isFullyConfigured ? 'connected' : 'credentials_missing',
      configuredKeys,
    };
  }

  saveStore(store);
}

/**
 * Update the state of a platform after a test or sync
 */
export function updatePlatformState(
  platformId: PlatformId,
  updates: Partial<PlatformState>
): PlatformState {
  const store = loadStore();
  const current = store.states[platformId] || {
    id: platformId,
    status: 'credentials_missing',
    totalRecordsFetched: 0,
    totalRecordsSaved: 0,
    configuredKeys: [],
  };

  const nextState: PlatformState = {
    ...current,
    ...updates,
  };

  store.states[platformId] = nextState;
  saveStore(store);
  return nextState;
}

/**
 * Get the current operational state of a platform
 */
export function getPlatformState(platformId: PlatformId): PlatformState {
  const store = loadStore();
  const config = PLATFORM_REGISTRY[platformId];
  if (!config) {
    return {
      id: platformId,
      status: 'credentials_missing',
      totalRecordsFetched: 0,
      totalRecordsSaved: 0,
      configuredKeys: [],
    };
  }

  const configuredKeys = config.requiredCredentials
    .filter((req) => Boolean(getPlatformCredential(platformId, req.key)))
    .map((req) => req.key);

  const existingState = store.states[platformId];

  // If completely free with no required credentials (OSM, Wikidata)
  if (config.requiredCredentials.length === 0) {
    return {
      id: platformId,
      status: existingState?.status || 'operational',
      lastTestedAt: existingState?.lastTestedAt || null,
      lastSyncAt: existingState?.lastSyncAt || null,
      lastError: existingState?.lastError || null,
      totalRecordsFetched: existingState?.totalRecordsFetched || 0,
      totalRecordsSaved: existingState?.totalRecordsSaved || 0,
      latencyMs: existingState?.latencyMs || null,
      configuredKeys: ['free_public_access'],
    };
  }

  // Free with optional credentials (GitHub, OpenCorporates, Hugging Face)
  if (config.isFree && config.requiredCredentials.every((c) => c.label.includes('Optional'))) {
    return {
      id: platformId,
      status: existingState?.status || 'operational',
      lastTestedAt: existingState?.lastTestedAt || null,
      lastSyncAt: existingState?.lastSyncAt || null,
      lastError: existingState?.lastError || null,
      totalRecordsFetched: existingState?.totalRecordsFetched || 0,
      totalRecordsSaved: existingState?.totalRecordsSaved || 0,
      latencyMs: existingState?.latencyMs || null,
      configuredKeys: configuredKeys.length > 0 ? configuredKeys : ['public_unauthenticated'],
    };
  }

  // Requires API key
  if (configuredKeys.length === 0) {
    return {
      id: platformId,
      status: 'credentials_missing',
      lastTestedAt: existingState?.lastTestedAt || null,
      lastSyncAt: existingState?.lastSyncAt || null,
      lastError: existingState?.lastError || 'API key has not been configured yet.',
      totalRecordsFetched: existingState?.totalRecordsFetched || 0,
      totalRecordsSaved: existingState?.totalRecordsSaved || 0,
      quotaRemaining: null,
      quotaTotal: null,
      latencyMs: null,
      configuredKeys: [],
    };
  }

  return {
    id: platformId,
    status: existingState?.status || 'connected',
    lastTestedAt: existingState?.lastTestedAt || null,
    lastSyncAt: existingState?.lastSyncAt || null,
    lastError: existingState?.lastError || null,
    totalRecordsFetched: existingState?.totalRecordsFetched || 0,
    totalRecordsSaved: existingState?.totalRecordsSaved || 0,
    quotaRemaining: existingState?.quotaRemaining ?? null,
    quotaTotal: existingState?.quotaTotal ?? null,
    latencyMs: existingState?.latencyMs ?? null,
    configuredKeys,
  };
}

/**
 * Get states of all registered platforms
 */
export function getAllPlatformStates(): { config: PlatformConfig; state: PlatformState }[] {
  return Object.values(PLATFORM_REGISTRY).map((config) => ({
    config,
    state: getPlatformState(config.id),
  }));
}
