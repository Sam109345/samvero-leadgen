import { NextRequest, NextResponse } from 'next/server';
import { deleteMessageFromThread } from '@/lib/inbox-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, messageId, mode } = body;

    if (!threadId || !messageId) {
      return NextResponse.json(
        { success: false, error: 'threadId and messageId are required' },
        { status: 400 }
      );
    }

    const deleteMode = mode === 'permanent' ? 'permanent' : 'for_everyone';
    const result = deleteMessageFromThread(threadId, messageId, deleteMode);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: deleteMode === 'for_everyone' 
          ? 'Message deleted for everyone successfully' 
          : 'Message permanently removed',
        thread: result.thread,
        deletedMessage: result.message,
      });
    }

    return NextResponse.json(
      { success: false, error: result.error || 'Failed to delete message' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error deleting message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  return POST(request);
}
