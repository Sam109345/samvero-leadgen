import { NextRequest, NextResponse } from 'next/server';
import { executeMultiSourceDiscovery } from '@/lib/discovery-connectors';
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
    const query = searchParams.get('q') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 12;

    const leads = await executeMultiSourceDiscovery({
      platform,
      category,
      country,
      query,
      limit,
    });

    return NextResponse.json({
      success: true,
      total: leads.length,
      leads,
    });
  } catch (error: any) {
    console.error('Error in /api/discover:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Discovery failed' },
      { status: 500 }
    );
  }
}
