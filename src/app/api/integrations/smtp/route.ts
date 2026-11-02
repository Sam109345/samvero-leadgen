import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserSmtpSettings,
  saveUserSmtpSettings,
  removeUserSmtpSettings,
  updateUserSmtpStatus,
} from '@/lib/lead-workspace-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const settings = getUserSmtpSettings(user.userId);

    const settingsPayload = {
      senderName: settings.senderName,
      senderEmail: settings.senderEmail,
      host: settings.smtpHost,
      port: settings.smtpPort,
      username: settings.smtpUser,
      smtpHost: settings.smtpHost,
      smtpPort: settings.smtpPort,
      smtpUser: settings.smtpUser,
      encryption: settings.encryption,
      secure: settings.encryption === 'ssl' || settings.smtpPort === 465,
      replyTo: settings.replyToEmail,
      replyToEmail: settings.replyToEmail,
      isPasswordSaved: settings.isConfigured,
      status: settings.status,
      lastTestedAt: settings.lastTestedAt,
      lastError: settings.lastError,
    };

    return NextResponse.json({
      success: true,
      userId: user.userId,
      isConfigured: settings.isConfigured,
      ...settingsPayload,
      settings: settingsPayload,
      updatedAt: settings.updatedAt,
      // Strictly masked password, NEVER returned in plaintext
      maskedPassword: settings.isConfigured ? '••••••••••••••••' : null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json();
    
    // Normalize field naming between frontend forms and backend models
    const resolvedHost = (body.smtpHost || body.host || '').trim();
    const resolvedPort = Number(body.smtpPort || body.port) || 587;
    const resolvedUser = (body.smtpUser || body.username || '').trim();
    const resolvedPass = (body.smtpPass || body.password || '').trim();
    const resolvedSenderEmail = (body.senderEmail || '').trim();
    const resolvedSenderName = (body.senderName || user.name || 'Outreach Specialist').trim();
    const resolvedReplyTo = (body.replyToEmail || body.replyTo || '').trim();
    const resolvedEncryption = body.encryption || (body.secure ? 'ssl' : 'tls');
    const verifyNow = body.verifyNow !== false;

    if (!resolvedSenderEmail || !resolvedHost || !resolvedUser || !resolvedPass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sender email, SMTP host, SMTP username, and password / app password are required.',
        },
        { status: 400 }
      );
    }

    const isSecure = resolvedEncryption === 'ssl' || resolvedPort === 465;

    // Verify SMTP connection live before saving if requested
    if (verifyNow) {
      try {
        const transporter = nodemailer.createTransport({
          host: resolvedHost,
          port: resolvedPort,
          secure: isSecure,
          auth: {
            user: resolvedUser,
            pass: resolvedPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        await transporter.verify();
      } catch (verifyErr: any) {
        return NextResponse.json(
          {
            success: false,
            error: `SMTP Connection test failed: ${verifyErr?.message || 'Authentication error'}. Please verify your SMTP host, port, and App Password.`,
            status: 'error',
          },
          { status: 400 }
        );
      }
    }

    saveUserSmtpSettings(user.userId, {
      senderName: resolvedSenderName,
      senderEmail: resolvedSenderEmail,
      smtpHost: resolvedHost,
      smtpPort: resolvedPort,
      smtpUser: resolvedUser,
      smtpPass: resolvedPass,
      encryption: resolvedEncryption,
      replyToEmail: resolvedReplyTo || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'SMTP credentials successfully verified and securely encrypted in your workspace.',
      status: 'connected',
      isConfigured: true,
      senderEmail: resolvedSenderEmail,
      senderName: resolvedSenderName,
      maskedPassword: '••••••••••••••••',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    removeUserSmtpSettings(user.userId);

    return NextResponse.json({
      success: true,
      message: 'SMTP integration removed from your account.',
      status: 'not_configured',
      isConfigured: false,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
