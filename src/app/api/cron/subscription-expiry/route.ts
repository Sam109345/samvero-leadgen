import { NextRequest, NextResponse } from 'next/server';
import { checkAllSubscriptionExpirations } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const results = checkAllSubscriptionExpirations();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
