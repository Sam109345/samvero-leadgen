import { NextRequest, NextResponse } from 'next/server';
import { getAllVisitorRecords, computeVisitorMetrics } from '@/lib/visitor-tracking-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const device = searchParams.get('device') || '';
    const country = searchParams.get('country') || '';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let records = getAllVisitorRecords();

    if (search) {
      records = records.filter(
        (r) =>
          r.ip.toLowerCase().includes(search) ||
          r.city.toLowerCase().includes(search) ||
          r.country.toLowerCase().includes(search) ||
          r.deviceName.toLowerCase().includes(search) ||
          r.page.toLowerCase().includes(search) ||
          r.referrer.toLowerCase().includes(search)
      );
    }

    if (device && device !== 'all') {
      records = records.filter((r) => r.device.toLowerCase() === device.toLowerCase());
    }

    if (country && country !== 'all') {
      records = records.filter(
        (r) =>
          r.countryCode.toLowerCase() === country.toLowerCase() ||
          r.country.toLowerCase() === country.toLowerCase()
      );
    }

    const metrics = computeVisitorMetrics();

    return NextResponse.json({
      success: true,
      metrics,
      visitors: records.slice(0, limit),
      total: records.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
