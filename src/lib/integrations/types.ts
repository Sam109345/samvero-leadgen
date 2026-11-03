/**
 * SAMVERO Platform Integration Types
 */

export type PlatformId =
  | 'apollo'
  | 'hunter'
  | 'serpapi'
  | 'foursquare'
  | 'yelp'
  | 'opencorporates'
  | 'github'
  | 'osm'
  | 'wikidata'
  | 'huggingface'
  | 'google_places'
  | 'gemini_ai'
  | 'smtp'
  | 'freelancer'
  | 'remotive'
  | 'remoteok'
  | 'reddit';

export type IntegrationStatus =
  | 'operational'
  | 'connected'
  | 'credentials_missing'
  | 'auth_failed'
  | 'quota_exhausted'
  | 'restricted'
  | 'sync_failed'
  | 'testing';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  category: 'primary_b2b' | 'primary_local' | 'primary_corporate' | 'free_directory' | 'ai_engine' | 'outreach';
  description: string;
  website: string;
  docsUrl: string;
  isPrimary: boolean;
  isFree: boolean;
  requiredCredentials: {
    key: string;
    label: string;
    placeholder: string;
    type: 'text' | 'password';
    description: string;
  }[];
  defaultRateLimitPerMin: number;
}

export interface PlatformState {
  id: PlatformId;
  status: IntegrationStatus;
  lastTestedAt?: string | null;
  lastSyncAt?: string | null;
  lastError?: string | null;
  totalRecordsFetched: number;
  totalRecordsSaved: number;
  quotaRemaining?: number | null;
  quotaTotal?: number | null;
  latencyMs?: number | null;
  configuredKeys: string[];
}

export interface SyncHistoryLog {
  id: string;
  platformId: PlatformId;
  platformName: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: 'success' | 'failed' | 'partial';
  recordsFetched: number;
  recordsSaved: number;
  duplicatesSkipped: number;
  query?: string;
  error?: string | null;
}

export interface TestConnectionResult {
  success: boolean;
  status: IntegrationStatus;
  message: string;
  latencyMs: number;
  quota?: {
    remaining?: number;
    total?: number;
    resetAt?: string;
  };
  details?: Record<string, any>;
}
