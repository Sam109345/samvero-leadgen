import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserGeminiApiKey,
  saveBidDraft,
  confirmBidSubmission,
  getBidDraftForLead,
} from '@/lib/lead-workspace-store';
import { generateProjectBid } from '@/lib/pitch-generator';
import { Lead } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json();
    const { lead, action = 'generate' } = body;

    if (!lead || !lead.id) {
      return NextResponse.json(
        { success: false, error: 'Lead data with ID is required.' },
        { status: 400 }
      );
    }

    const typedLead = lead as Lead;

    // Action: Confirm submission by user
    if (action === 'confirm_submission') {
      const confirmed = confirmBidSubmission(user.userId, typedLead.id);
      return NextResponse.json({
        success: true,
        message: 'Bid submission date successfully recorded in activity history.',
        bid: confirmed,
      });
    }

    // Action: Save manually edited bid draft
    if (action === 'save_draft') {
      const { title, content, deliverables, timeline, investment } = body;
      const saved = saveBidDraft(user.userId, typedLead.id, {
        title: title || `Proposal for ${typedLead.businessName}`,
        content: content || '',
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        timeline: timeline || '5-7 Days',
        investment: investment || typedLead.budget || 'Scope Confirmed',
      });
      return NextResponse.json({
        success: true,
        message: 'Bid proposal draft saved.',
        bid: saved,
      });
    }

    // Action: Generate AI Bid
    const userKey = getUserGeminiApiKey(user.userId);
    const generated = await generateProjectBid(typedLead, userKey);

    const savedDraft = saveBidDraft(user.userId, typedLead.id, {
      title: generated.title,
      content: generated.content,
      deliverables: generated.deliverables,
      timeline: generated.timeline,
      investment: generated.investment,
    });

    return NextResponse.json({
      success: true,
      message: 'AI Bid synthesized successfully.',
      bid: savedDraft,
      hasUserApiKey: Boolean(userKey),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error generating bid' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'leadId is required' }, { status: 400 });
    }

    const bid = getBidDraftForLead(user.userId, leadId);
    return NextResponse.json({
      success: true,
      bid,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
