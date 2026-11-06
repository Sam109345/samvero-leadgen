import { Lead } from '@/types';

export type PlatformRegion = 'pakistan' | 'international' | 'global';

export type PlatformCategory =
  | 'freelance'
  | 'social_media'
  | 'local_business'
  | 'b2b_directories'
  | 'classifieds'
  | 'remote_jobs'
  | 'design'
  | 'developer';

export type PlatformApiStatus =
  | 'live_operational'
  | 'requires_auth'
  | 'partner_only'
  | 'no_public_api';

export interface PlatformMetadata {
  id: string;
  name: string;
  region: PlatformRegion;
  category: PlatformCategory;
  apiStatus: PlatformApiStatus;
  hasLiveApi: boolean;
  authType: 'none' | 'api_key' | 'oauth2' | 'rss_feed' | 'partner_agreement';
  rateLimits: string;
  termsNotes: string;
  officialApiDocUrl?: string;
  websiteUrl: string;
}

export interface AdapterSearchOptions {
  query?: string;
  category?: string;
  country?: string;
  city?: string;
  limit?: number;
}

export interface PlatformAdapter {
  meta: PlatformMetadata;
  search: (options: AdapterSearchOptions) => Promise<Lead[]>;
  testConnection?: () => Promise<{ success: boolean; message: string; latencyMs: number }>;
}
