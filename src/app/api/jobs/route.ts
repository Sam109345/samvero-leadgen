import { NextRequest, NextResponse } from 'next/server';
import { fetchFreelanceJobs } from '@/lib/jobs-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const country = searchParams.get('country') || 'all';
    const category = searchParams.get('category') || 'all';
    const jobType = searchParams.get('jobType') || 'all';
    const platform = searchParams.get('platform') || 'all';

    const jobs = await fetchFreelanceJobs({
      query,
      country,
      category,
      jobType,
      platform,
    });

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error fetching freelance jobs' },
      { status: 500 }
    );
  }
}
