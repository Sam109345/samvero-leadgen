import { NextRequest, NextResponse } from 'next/server';
import { syncPlatformNow, executeCentralLeadPipeline } from '@/lib/pipeline/central-lead-pipeline';
import { PlatformId } from '@/lib/integrations/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platformId, query, category, country, city, limit } = body;

    if (platformId && platformId !== 'all') {
      const syncLog = await syncPlatformNow(platformId as PlatformId);
      return NextResponse.json({
        success: syncLog.status === 'success' || syncLog.status === 'partial',
        syncLog,
      });
    }

    // Full multi-platform sync
    const result = await executeCentralLeadPipeline({
      query,
      category,
      country,
      city,
      limit: limit || 15,
      autoPersist: true,
    });

    return NextResponse.json({
      success: result.success,
      totalFetched: result.totalFetched,
      totalSaved: result.totalSaved,
      duplicatesSkipped: result.duplicatesSkipped,
      platformStatuses: result.platformStatuses,
      durationMs: result.durationMs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Sync failed.' },
      { status: 500 }
    );
  }
}
