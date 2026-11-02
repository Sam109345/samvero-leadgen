import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserSmtpCredentials,
  updateUserSmtpStatus,
} from '@/lib/lead-workspace-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json().catch(() => ({}));
    
    // Resolve credentials from request body (for testing before saving) or from user store
    const storedCreds = getUserSmtpCredentials(user.userId);
    
    const host = (body.smtpHost || body.host || storedCreds?.smtpHost || '').trim();
    const port = Number(body.smtpPort || body.port || storedCreds?.smtpPort) || 587;
    const user_name = (body.smtpUser || body.username || storedCreds?.smtpUser || '').trim();
    const pass = (body.smtpPass || body.password || storedCreds?.smtpPass || '').trim();
    const senderEmail = (body.senderEmail || storedCreds?.senderEmail || '').trim();
    const senderName = (body.senderName || storedCreds?.senderName || user.name || 'Outreach Specialist').trim();
    const replyTo = (body.replyToEmail || body.replyTo || storedCreds?.replyToEmail || senderEmail).trim();
    const encryption = body.encryption || (body.secure ? 'ssl' : storedCreds?.encryption || 'tls');

    if (!host || !user_name || !pass || !senderEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please configure your email integration before sending emails.',
          status: 'not_configured',
        },
        { status: 400 }
      );
    }

    const sendEmail = Boolean(body.sendEmail || body.mode === 'email');
    const targetEmail = (body.targetEmail || body.recipientEmail || senderEmail || user.email || '').trim();

    const isSecure = encryption === 'ssl' || port === 465;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: {
        user: user_name,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 1. Verify credentials with mail server
    try {
      await transporter.verify();
    } catch (verifyErr: any) {
      updateUserSmtpStatus(user.userId, 'error', verifyErr?.message);
      return NextResponse.json(
        {
          success: false,
          error: `SMTP Verification Failed: ${verifyErr?.message}`,
          status: 'error',
        },
        { status: 400 }
      );
    }

    // 2. If user requested a test email dispatch
    if (sendEmail) {
      const recipient = targetEmail;
      const testInfo = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipient,
        replyTo: replyTo || senderEmail,
        subject: `[SAMVERO] SMTP Test Delivery Confirmation`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #007FED; margin-top: 0;">SAMVERO SMTP Integration Verified</h2>
            <p>Hello <strong>${senderName}</strong>,</p>
            <p>This test email confirms that your personal SMTP configuration is correctly connected and authenticated to the SAMVERO Lead Acquisition Platform.</p>
            <div style="background-color: #f8fafc; border-left: 4px solid #007FED; padding: 12px 16px; margin: 16px 0;">
              <p style="margin: 4px 0; font-size: 13px;"><strong>Sender Name:</strong> ${senderName}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Sender Email:</strong> ${senderEmail}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>SMTP Server:</strong> ${host}:${port}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Encryption:</strong> ${encryption.toUpperCase()}</p>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Platform official contact: samverodigital@gmail.com</p>
          </div>
        `,
      });

      updateUserSmtpStatus(user.userId, 'connected');
      return NextResponse.json({
        success: true,
        message: `Test email successfully dispatched to ${recipient}! Message ID: ${testInfo.messageId}`,
        status: 'connected',
        messageId: testInfo.messageId,
      });
    }

    updateUserSmtpStatus(user.userId, 'connected');
    return NextResponse.json({
      success: true,
      message: 'SMTP handshake and authentication verified successfully!',
      status: 'connected',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
