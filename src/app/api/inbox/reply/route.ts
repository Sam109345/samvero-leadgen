import { NextRequest, NextResponse } from 'next/server';
import { sendReplyToClient } from '@/lib/inbox-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, replyText } = body;

    if (!threadId || !replyText) {
      return NextResponse.json(
        { success: false, error: 'threadId and replyText are required' },
        { status: 400 }
      );
    }

    const result = sendReplyToClient(threadId, replyText);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Reply sent to client successfully',
        sentMessage: result.message,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send reply' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error sending reply' },
      { status: 500 }
    );
  }
}
