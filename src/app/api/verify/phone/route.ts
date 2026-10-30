import { NextRequest, NextResponse } from 'next/server';
import { verifyPhoneNumber } from '@/lib/phone-verifier';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body.phone;
    const country = body.country || '';

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone parameter required' }, { status: 400 });
    }

    const result = verifyPhoneNumber(phone, country);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Verification failed' }, { status: 500 });
  }
}
