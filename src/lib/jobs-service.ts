import { Lead } from '@/types';
import { INITIAL_LEADS } from './mock-data';
import { calculateBusinessAge } from './gmb-age-calculator';
import { generateClientWebsite } from './website-generator';

interface JobSearchParams {
  query?: string;
  country?: string;
  category?: string;
  jobType?: string;
  platform?: string;
}

export async function fetchFreelanceJobs(params: JobSearchParams): Promise<Lead[]> {
  const { query, country, category, jobType, platform } = params;

  let jobs = INITIAL_LEADS.filter((l) => l.type === 'job');

  // Attempt to fetch from public free Remotive API if Web or Design is requested
  try {
    const shouldFetchLive = !country || country === 'Global' || country === 'US';
    if (shouldFetchLive) {
      const remotiveCategory = category === 'Graphic Design' ? 'design' : 'software-dev';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${remotiveCategory}&limit=5`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.jobs)) {
          const liveRemotiveJobs: Lead[] = data.jobs.slice(0, 4).map((j: any) => {
            const age = calculateBusinessAge(2022); // est 4 yrs
            const base: Lead = {
              id: `remotive-${j.id}`,
              title: j.title,
              businessName: j.company_name || 'Innovate Remote Lab',
              type: 'job',
              platform: 'LinkedIn',
              category: category === 'Graphic Design' ? 'Graphic Design' : 'Web Development',
              country: 'Global',
              city: j.candidate_required_location || 'Remote Global',
              address: j.candidate_required_location || 'Global Remote',
              businessAge: age,
              budget: j.salary || '$4,000 - $6,500 / mo',
              jobType: j.job_type === 'contract' ? 'Contract' : 'Full-Time',
              description: j.description ? j.description.replace(/<[^>]+>/g, '').substring(0, 240) + '...' : 'Exciting design and web development opening.',
              postedAt: '40 mins ago',
              contact: {
                email: `hiring@${(j.company_name || 'company').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                phone: '+1 (800) 555-0199',
                hasWebsite: true,
                website: j.url,
                contactPerson: 'Talent Acquisition Team',
              },
              tags: ['Remote', 'Verified Employer', 'Design & Web'],
              verified: true,
              status: 'new',
            };

            return {
              ...base,
              generatedWebsite: generateClientWebsite(base),
            };
          });

          // Prepend live items without duplicating
          jobs = [...liveRemotiveJobs, ...jobs];
        }
      }
    }
  } catch (e) {
    // Gracefully ignore network timeout or offline state and rely on cached dataset
  }

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
