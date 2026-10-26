import { NextRequest, NextResponse } from 'next/server';
import { fetchGmbLeads } from '@/lib/gmb-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const country = searchParams.get('country') || 'Pakistan';
    const category = searchParams.get('category') || '';
    const onlyNoWebsite = searchParams.get('noWebsite') === 'true';

    const leads = await fetchGmbLeads({
      query,
      city,
      country,
      category,
      onlyNoWebsite,
    });

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error fetching GMB data' },
      { status: 500 }
    );
  }
}
