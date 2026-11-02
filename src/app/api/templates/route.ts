import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserTemplates,
  saveUserTemplate,
  deleteUserTemplate,
} from '@/lib/lead-workspace-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const templates = getUserTemplates(user.userId, category);
    return NextResponse.json({ success: true, templates });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json();
    const { id, title, category, subject, htmlContent, plainText } = body;

    if (!title || !category || !subject || !htmlContent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, category, subject, and HTML content are required.',
        },
        { status: 400 }
      );
    }

    const template = saveUserTemplate(user.userId, {
      id,
      title,
      category,
      subject,
      htmlContent,
      plainText,
    });

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully.',
      template,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Template ID required' }, { status: 400 });
    }

    const removed = deleteUserTemplate(user.userId, id);
    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Template not found or belongs to another user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
