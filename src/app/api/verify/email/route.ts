import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailAddress } from '@/lib/email-verifier';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
    }

    const result = await verifyEmailAddress(email);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Verification failed' }, { status: 500 });
  }
}
