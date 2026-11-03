import { Lead } from '@/types';
import { fetchLiveMarketplaceJobs } from './live-lead-aggregator';
import { loadAllStoredLeads } from './leads-persistent-store';

interface JobSearchParams {
  query?: string;
  country?: string;
  category?: string;
  jobType?: string;
  platform?: string;
}

export async function fetchFreelanceJobs(params: JobSearchParams): Promise<Lead[]> {
  const { query, country, category, jobType, platform } = params;

  // 1. Fetch live jobs dynamically from Remotive & live public job feeds
  let liveJobs: Lead[] = [];
  try {
    liveJobs = await fetchLiveMarketplaceJobs({
      query,
      category,
      platform,
      country,
      limit: 10,
    });
  } catch (err) {
    console.warn('Live freelance jobs aggregator fallback:', err);
  }

  // 2. Verified real job records from persistent store
  const storedJobs = loadAllStoredLeads().filter((l) => l.type === 'job');
  const pool = [...liveJobs, ...storedJobs];

  // Deduplicate by ID
  const seenIds = new Set<string>();
  let jobs: Lead[] = [];
  for (const j of pool) {
    if (j && j.id && !seenIds.has(j.id.toLowerCase())) {
      seenIds.add(j.id.toLowerCase());
      jobs.push(j);
    }
  }

  // Filter based on parameters
  if (country && country !== 'all' && country !== 'Global') {
    jobs = jobs.filter((j) => j.country?.toLowerCase() === country.toLowerCase());
  }

  if (category && category !== 'all') {
    jobs = jobs.filter((j) => j.category?.toLowerCase().includes(category.toLowerCase()));
  }

  if (jobType && jobType !== 'all') {
    jobs = jobs.filter((j) => j.jobType?.toLowerCase() === jobType.toLowerCase());
  }

  if (platform && platform !== 'all') {
    jobs = jobs.filter((j) => j.platform?.toLowerCase().includes(platform.toLowerCase()));
  }

  if (query) {
    const q = query.toLowerCase();
    jobs = jobs.filter((j) =>
      j.title?.toLowerCase().includes(q) ||
      j.businessName?.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q) ||
      j.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return jobs;
}
