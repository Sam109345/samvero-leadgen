import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserSmtpCredentials,
  markEmailDraftSent,
  saveEmailDraft,
  getEmailDraftForLead,
  addLeadActivityLog,
} from '@/lib/lead-workspace-store';
import { sanitizeHtmlContent } from '@/components/editor/RichTextEditor';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getEffectiveUser(request);
    const draft = getEmailDraftForLead(user.userId, params.id);
    return NextResponse.json({ success: true, draft });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getEffectiveUser(request);
    const leadId = params.id;
    const body = await request.json();
    const {
      to,
      subject,
      htmlContent,
      plainText,
      category = 'General Outreach',
      recipientName,
      draftOnly = false,
    } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    // 1. If this is draft-only saving, save directly without requiring SMTP configuration
    if (draftOnly) {
      const draft = saveEmailDraft(user.userId, leadId, {
        subject: subject || '',
        htmlContent: sanitizeHtmlContent(htmlContent || ''),
        plainText: plainText || (htmlContent ? htmlContent.replace(/<[^>]+>/g, '') : ''),
        category,
      });

      addLeadActivityLog(user.userId, leadId, 'email_draft_created', `Email pitch draft saved for "${category}"`, {
        subject: subject || '',
        draftId: draft.id,
      });

      return NextResponse.json({
        success: true,
        message: 'Email draft saved successfully.',
        draft,
      });
    }

    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid recipient email address is required.' },
        { status: 400 }
      );
    }

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { success: false, error: 'Subject and email message content are required.' },
        { status: 400 }
      );
    }

    // 2. Enforce user's own SMTP configuration
    const creds = getUserSmtpCredentials(user.userId);
    if (!creds) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please configure your email integration before sending emails.',
          code: 'SMTP_NOT_CONFIGURED',
        },
        { status: 400 }
      );
    }

    // 3. Save current email draft before sending
    saveEmailDraft(user.userId, leadId, {
      subject,
      htmlContent: sanitizeHtmlContent(htmlContent),
      plainText: plainText || htmlContent.replace(/<[^>]+>/g, ''),
      category,
    });

    // 3. Connect to user's SMTP server
    const isSecure = creds.encryption === 'ssl' || creds.smtpPort === 465;
    const transporter = nodemailer.createTransport({
      host: creds.smtpHost,
      port: creds.smtpPort,
      secure: isSecure,
      auth: {
        user: creds.smtpUser,
        pass: creds.smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 4. Send email
    const cleanHtml = sanitizeHtmlContent(htmlContent);
    const info = await transporter.sendMail({
      from: `"${creds.senderName}" <${creds.senderEmail}>`,
      to: to.trim(),
      replyTo: creds.replyToEmail || creds.senderEmail,
      subject: subject.trim(),
      html: cleanHtml,
      text: plainText || cleanHtml.replace(/<[^>]+>/g, ''),
    });

    // 5. Check if delivery was rejected by SMTP server
    if (info.rejected && info.rejected.length > 0 && (!info.accepted || info.accepted.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: `Mail delivery rejected by destination server for ${to}. Email was not marked as sent.`,
        },
        { status: 400 }
      );
    }

    // 6. Only on verified SMTP acceptance: Mark as Sent, update lead state, log activity
    markEmailDraftSent(user.userId, leadId, info.messageId);

    return NextResponse.json({
      success: true,
      message: `Email pitch successfully accepted and sent via ${creds.smtpHost} to ${to}!`,
      messageId: info.messageId,
      sentAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('SMTP email dispatch error:', err);
    return NextResponse.json(
      {
        success: false,
        error: `SMTP Dispatch Error: ${err?.message || 'Failed to send outreach email'}`,
      },
      { status: 500 }
    );
  }
}
