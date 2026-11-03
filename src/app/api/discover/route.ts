import { NextRequest, NextResponse } from 'next/server';
import { executeCentralLeadPipeline } from '@/lib/pipeline/central-lead-pipeline';
import { getSubscriptionById } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const role = request.cookies.get('samvero_portal_role')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;

    if (role === 'customer' && userId) {
      const sub = getSubscriptionById(userId);
      if (sub) {
        const nowTime = Date.now();
        const expiryTime = new Date(sub.expiryDate).getTime();
        if (sub.status === 'expired' || expiryTime <= nowTime) {
          return NextResponse.json(
            { success: false, error: 'Subscription expired. Please renew to continue lead discovery.', isExpired: true },
            { status: 403 }
          );
        }
        if (sub.leadsConsumed >= sub.leadQuota) {
          return NextResponse.json(
            { success: false, error: 'Lead quota limit reached for your plan.', quotaExceeded: true },
            { status: 403 }
          );
        }
      }
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || undefined;
    const category = searchParams.get('category') || undefined;
    const country = searchParams.get('country') || undefined;
    const city = searchParams.get('city') || undefined;
    const query = searchParams.get('q') || undefined;
    const jobTitle = searchParams.get('jobTitle') || undefined;
    const companySize = searchParams.get('companySize') || undefined;
    const companyType = searchParams.get('companyType') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 12;

    const pipelineResult = await executeCentralLeadPipeline({
      platforms: platform ? [platform] : undefined,
      category,
      country,
      city,
      query,
      jobTitle,
      companySize,
      companyType,
      limit,
      autoPersist: true,
    });

    return NextResponse.json({
      success: true,
      total: pipelineResult.leads.length,
      leads: pipelineResult.leads,
      platformStatuses: pipelineResult.platformStatuses,
      durationMs: pipelineResult.durationMs,
      totalSaved: pipelineResult.totalSaved,
      duplicatesSkipped: pipelineResult.duplicatesSkipped,
    });
  } catch (error: any) {
    console.error('Error in /api/discover GET:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Discovery failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const role = request.cookies.get('samvero_portal_role')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;

    if (role === 'customer' && userId) {
      const sub = getSubscriptionById(userId);
      if (sub) {
        const nowTime = Date.now();
        const expiryTime = new Date(sub.expiryDate).getTime();
        if (sub.status === 'expired' || expiryTime <= nowTime) {
          return NextResponse.json(
            { success: false, error: 'Subscription expired. Please renew to continue lead discovery.', isExpired: true },
            { status: 403 }
          );
        }
        if (sub.leadsConsumed >= sub.leadQuota) {
          return NextResponse.json(
            { success: false, error: 'Lead quota limit reached for your plan.', quotaExceeded: true },
            { status: 403 }
          );
        }
      }
    }

    const body = await request.json();
    const { query, category, country, city, jobTitle, companySize, companyType, platforms, limit = 15, autoPersist = true } = body;

    const pipelineResult = await executeCentralLeadPipeline({
      query,
      category,
      country,
      city,
      jobTitle,
      companySize,
      companyType,
      platforms,
      limit,
      autoPersist,
    });

    return NextResponse.json({
      success: true,
      total: pipelineResult.leads.length,
      leads: pipelineResult.leads,
      platformStatuses: pipelineResult.platformStatuses,
      durationMs: pipelineResult.durationMs,
      totalSaved: pipelineResult.totalSaved,
      duplicatesSkipped: pipelineResult.duplicatesSkipped,
    });
  } catch (error: any) {
    console.error('Error in /api/discover POST:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Discovery failed' },
      { status: 500 }
    );
  }
}
