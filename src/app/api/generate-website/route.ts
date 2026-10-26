import { NextRequest, NextResponse } from 'next/server';
import { generateClientWebsite, compileStandaloneHtml } from '@/lib/website-generator';
import { Lead } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const lead: Lead = await request.json();

    if (!lead || (!lead.id && !lead.businessName)) {
      return NextResponse.json(
        { success: false, error: 'Lead data or business name is required' },
        { status: 400 }
      );
    }

    const websiteData = generateClientWebsite(lead);
    const html = compileStandaloneHtml(websiteData);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const previewUrl = `/preview/${lead.id || websiteData.slug}`;

    return NextResponse.json({
      success: true,
      websiteData,
      previewUrl,
      fullPreviewUrl: `${appUrl}${previewUrl}`,
      html,
    });
  } catch (error: any) {
    console.error('Error generating website:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate website' },
      { status: 500 }
    );
  }
}
