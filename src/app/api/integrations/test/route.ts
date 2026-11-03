import { NextRequest, NextResponse } from 'next/server';
import { testPlatformById } from '@/lib/pipeline/central-lead-pipeline';
import { PlatformId } from '@/lib/integrations/types';
import { getPlatformState } from '@/lib/integrations/credentials-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platformId } = body;

    if (!platformId) {
      return NextResponse.json(
        { success: false, error: 'platformId is required for connection testing.' },
        { status: 400 }
      );
    }

    const testResult = await testPlatformById(platformId as PlatformId);
    const updatedState = getPlatformState(platformId as PlatformId);

    return NextResponse.json({
      success: testResult.success,
      result: testResult,
      state: updatedState,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Connection test failed.' },
      { status: 500 }
    );
  }
}
