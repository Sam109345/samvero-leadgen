import { NextResponse } from 'next/server';
import { getAllQuotas } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET() {
  const quotas = getAllQuotas();
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    quotas,
  });
}
