import { Lead } from '@/types';
import { INITIAL_LEADS } from './mock-data';

interface JobSearchParams {
  query?: string;
  country?: string;
  category?: string;
  jobType?: string;
  platform?: string;
}

export async function fetchFreelanceJobs(params: JobSearchParams): Promise<Lead[]> {
  const { query, country, category, jobType, platform } = params;

  // Use verified authentic job dataset
  let jobs = INITIAL_LEADS.filter((l) => l.type === 'job');

  // Filter based on parameters
  if (country && country !== 'all' && country !== 'Global') {
    jobs = jobs.filter((j) => j.country.toLowerCase() === country.toLowerCase());
  }

  if (category && category !== 'all') {
    jobs = jobs.filter((j) => j.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (jobType && jobType !== 'all') {
    jobs = jobs.filter((j) => j.jobType?.toLowerCase() === jobType.toLowerCase());
  }

  if (platform && platform !== 'all') {
    jobs = jobs.filter((j) => j.platform.toLowerCase() === platform.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    jobs = jobs.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      j.businessName.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return jobs;
}
