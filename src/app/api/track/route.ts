import { NextRequest, NextResponse } from 'next/server';
import { recordVisitorActivity } from '@/lib/visitor-tracking-store';
import { resolveIpDetails, getLivePublicIp } from '@/lib/geo-ip';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Extract real client IP
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfIp = req.headers.get('cf-connecting-ip');
    let clientIp = cfIp || (forwarded ? forwarded.split(',')[0].trim() : realIp) || '72.255.61.191';

    // If local/private, resolve or use fallback
    if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === 'localhost') {
      clientIp = await getLivePublicIp('72.255.61.191');
    }

    const geo = await resolveIpDetails(clientIp);
    const userAgent = req.headers.get('user-agent') || body.userAgent || '';

    const record = recordVisitorActivity({
      visitorId: body.visitorId || `anon-${Math.random().toString(36).substring(2, 9)}`,
      ip: clientIp,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      countryCode: geo.countryCode,
      isp: geo.isp,
      userAgent: userAgent,
      page: body.page || '/',
      referrer: body.referrer || 'direct',
      clickEvent: body.clickEvent,
      duration: body.duration,
    });

    return NextResponse.json({ success: true, recordId: record.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
