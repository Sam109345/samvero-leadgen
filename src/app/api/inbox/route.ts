import { NextRequest, NextResponse } from 'next/server';
import { getInboxThreads, simulateClientReply, markThreadAsRead } from '@/lib/inbox-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const markReadId = searchParams.get('markRead');

    if (markReadId) {
      markThreadAsRead(markReadId);
    }

    const threads = getInboxThreads();

    return NextResponse.json({
      success: true,
      unreadCount: threads.filter((t) => t.unread).length,
      threads,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch inbox' },
      { status: 500 }
    );
  }
}

// POST endpoint for simulating client replies OR handling real incoming email webhooks (Resend/SendGrid)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, action } = body;

    if (action === 'simulate' && threadId) {
      const result = simulateClientReply(threadId);
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Client reply simulated successfully',
          thread: result.thread,
          incomingMessage: result.message,
        });
      }
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error processing inbox action' },
      { status: 500 }
    );
  }
}
