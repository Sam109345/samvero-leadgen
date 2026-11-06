import { NextRequest, NextResponse } from 'next/server';
import { getAllAdapters, getActiveAdapters, executeMultiPlatformSearch } from '@/lib/adapters/registry';

export const dynamic = 'force-dynamic';

/**
 * GET /api/adapters - List all 40+ platforms with region, API availability, TOS and rate limits
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region'); // 'pakistan' | 'international' | 'global'
    const activeOnly = searchParams.get('active') === 'true';

    let adapters = activeOnly ? getActiveAdapters() : getAllAdapters();

    if (region && region !== 'all') {
      adapters = adapters.filter((a) => a.meta.region === region || a.meta.region === 'global');
    }

    const platformMetadata = adapters.map((a) => a.meta);

    return NextResponse.json({
      success: true,
      total: platformMetadata.length,
      activeCount: platformMetadata.filter((p) => p.hasLiveApi).length,
      pakistanPlatformsCount: platformMetadata.filter((p) => p.region === 'pakistan').length,
      internationalPlatformsCount: platformMetadata.filter((p) => p.region === 'international' || p.region === 'global').length,
      platforms: platformMetadata,
    });
  } catch (err: any) {
    console.error('Error in /api/adapters GET:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to list platform adapters' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/adapters - Execute lead search across multi-platform adapters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { query, category, country, city, limit = 15 } = body;

    const result = await executeMultiPlatformSearch({
      query,
      category,
      country,
      city,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: result.leads.length,
      leads: result.leads,
      platformStatuses: result.platformStatuses,
      durationMs: result.durationMs,
    });
  } catch (err: any) {
    console.error('Error in /api/adapters POST:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to execute multi-platform search' },
      { status: 500 }
    );
  }
}
