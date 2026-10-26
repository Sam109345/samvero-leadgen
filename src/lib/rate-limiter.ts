// In-memory rate limiter and quota tracking
export interface QuotaEntry {
  service: string;
  count: number;
  limit: number;
  resetAt: number; // timestamp
}

const quotaStore: Record<string, QuotaEntry> = {
  google_places: {
    service: 'Google Places API',
    count: 0,
    limit: parseInt(process.env.GOOGLE_RATE_LIMIT || '60', 10),
    resetAt: Date.now() + 3600000,
  },
  serpapi: {
    service: 'SerpApi Scraping Hub',
    count: 0,
    limit: parseInt(process.env.SERPAPI_RATE_LIMIT || '10', 10),
    resetAt: Date.now() + 3600000,
  },
  outreach_email: {
    service: 'Automated Email Outreach',
    count: 0,
    limit: parseInt(process.env.OUTREACH_EMAIL_HOURLY_LIMIT || '20', 10),
    resetAt: Date.now() + 3600000,
  },
  free_job_boards: {
    service: 'Public Job Feeds (Remotive/Adzuna)',
    count: 0,
    limit: 100,
    resetAt: Date.now() + 3600000,
  },
};

export function checkAndIncrementQuota(serviceKey: string): { allowed: boolean; remaining: number; resetInMinutes: number } {
  const now = Date.now();
  let entry = quotaStore[serviceKey];

  if (!entry) {
    quotaStore[serviceKey] = {
      service: serviceKey,
      count: 0,
      limit: 50,
      resetAt: now + 3600000,
    };
    entry = quotaStore[serviceKey];
  }

  // Reset if window has elapsed
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 3600000;
  }

  if (entry.count >= entry.limit) {
    const resetInMinutes = Math.max(1, Math.ceil((entry.resetAt - now) / 60000));
    return { allowed: false, remaining: 0, resetInMinutes };
  }

  entry.count += 1;
  const remaining = Math.max(0, entry.limit - entry.count);
  const resetInMinutes = Math.max(1, Math.ceil((entry.resetAt - now) / 60000));

  return { allowed: true, remaining, resetInMinutes };
}

export function getAllQuotas() {
  const now = Date.now();
  return Object.entries(quotaStore).map(([key, entry]) => {
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + 3600000;
    }
    const remaining = Math.max(0, entry.limit - entry.count);
    const hasKey = key === 'google_places' ? Boolean(process.env.GOOGLE_PLACES_API_KEY)
      : key === 'serpapi' ? Boolean(process.env.SERPAPI_API_KEY)
      : key === 'outreach_email' ? Boolean(process.env.RESEND_API_KEY || process.env.SMTP_USER)
      : true;

    return {
      key,
      service: entry.service,
      usedToday: entry.count,
      dailyLimit: entry.limit,
      remaining,
      status: !hasKey ? 'simulated' : remaining === 0 ? 'exhausted' : remaining < (entry.limit * 0.2) ? 'warning' : 'active',
      isFallback: !hasKey || remaining === 0,
      notes: !hasKey 
        ? 'Using live free public aggregator fallback (No API key set)' 
        : remaining === 0 
          ? 'Quota limit reached - switched to cached data' 
          : `${remaining} calls remaining in current hourly window`
    };
  });
}
