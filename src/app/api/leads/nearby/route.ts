import { NextRequest, NextResponse } from 'next/server';
import { searchNearbyBusinesses } from '@/lib/nearby-lead-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const query = searchParams.get('q') || undefined;
    const category = searchParams.get('category') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20;
    const radiusMeters = searchParams.get('radius') ? parseInt(searchParams.get('radius')!, 10) : 8000;

    if (!latStr || !lonStr) {
      return NextResponse.json(
        { success: false, error: 'Latitude (lat) and longitude (lon) parameters are required.' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { success: false, error: 'Invalid latitude or longitude coordinates.' },
        { status: 400 }
      );
    }

    const result = await searchNearbyBusinesses({
      lat,
      lon,
      radiusMeters,
      query,
      category,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/leads/nearby:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Nearby business discovery failed.' },
      { status: 500 }
    );
  }
}
