import { NextRequest, NextResponse } from 'next/server';
import { loadSyncHistory } from '@/lib/integrations/credentials-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    let history = loadSyncHistory();

    if (platform && platform !== 'all') {
      history = history.filter((h) => h.platformId === platform || h.platformName.toLowerCase().includes(platform.toLowerCase()));
    }

    if (status && status !== 'all') {
      history = history.filter((h) => h.status === status);
    }

    return NextResponse.json({
      success: true,
      total: history.length,
      history,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch sync history' },
      { status: 500 }
    );
  }
}
