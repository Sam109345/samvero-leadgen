import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPlatformStates,
  setPlatformCredentials,
  getPlatformState,
} from '@/lib/integrations/credentials-store';
import { PlatformId } from '@/lib/integrations/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const platforms = getAllPlatformStates();
    return NextResponse.json({
      success: true,
      platforms,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platformId, credentials } = body;

    if (!platformId || !credentials) {
      return NextResponse.json(
        { success: false, error: 'platformId and credentials are required.' },
        { status: 400 }
      );
    }

    setPlatformCredentials(platformId as PlatformId, credentials);
    const updatedState = getPlatformState(platformId as PlatformId);

    return NextResponse.json({
      success: true,
      message: `Credentials updated successfully for ${platformId}.`,
      state: updatedState,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to configure platform' },
      { status: 500 }
    );
  }
}
