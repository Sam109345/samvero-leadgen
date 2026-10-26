import nodemailer from 'nodemailer';
import { checkAndIncrementQuota } from './rate-limiter';
import { generateSamveroEmailTemplate } from './email-template';

export interface EmailPayload {
  to: string;
  recipientName?: string;
  businessName: string;
  subject: string;
  previewUrl?: string;
  leadType: 'gmb' | 'job';
  messageBody?: string;
  senderName?: string;
  senderEmail?: string;
  city?: string;
  country?: string;
  discipline?: string;
  smtpUser?: string;
  smtpPass?: string;
  resendKey?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  provider: 'resend' | 'smtp' | 'simulated';
  previewUrl?: string;
  statusMessage?: string;
  error?: string;
}

export async function sendOutreachEmail(payload: EmailPayload): Promise<EmailSendResult> {
  // Check hourly quota
  const quota = checkAndIncrementQuota('outreach_email');
  if (!quota.allowed) {
    return {
      success: false,
      provider: 'simulated',
      error: `Hourly email dispatch quota exceeded. Please wait ${quota.resetInMinutes} minutes or increase OUTREACH_EMAIL_HOURLY_LIMIT in .env.local`,
    };
  }

  const {
    to,
    recipientName = 'Business Owner',
    businessName,
    subject,
    previewUrl,
    messageBody,
    senderName = 'SAMVERO Acquisition & Technology Team',
    senderEmail = process.env.SMTP_FROM || 'outreach@samvero.com',
    city = 'Lahore',
    country = 'Pakistan',
    discipline = 'Web Development & Digital Showcase',
    smtpUser,
    smtpPass,
    resendKey,
  } = payload;

  const appUrl = process.env.PUBLIC_LIVE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cleanPath = previewUrl?.startsWith('/') ? previewUrl : `/${previewUrl || ''}`;
  const fullPreviewUrl = previewUrl?.startsWith('http')
    ? (process.env.PUBLIC_LIVE_URL && previewUrl.includes('localhost')
        ? previewUrl.replace(/https?:\/\/localhost:\d+/i, process.env.PUBLIC_LIVE_URL.replace(/\/$/, ''))
        : previewUrl)
    : `${appUrl.replace(/\/$/, '')}${cleanPath}`;

  // Generate Ultra-Luxurious SAMVERO Responsive HTML Email
  const htmlContent = generateSamveroEmailTemplate({
    recipientName,
    businessName,
    subject,
    previewUrl: fullPreviewUrl,
    messageBody,
    senderName,
    senderEmail,
    city,
    country,
    discipline,
  });

  const activeResendKey = resendKey || process.env.RESEND_API_KEY;
  const activeSmtpUser = smtpUser || process.env.SMTP_USER;
  const activeSmtpPass = smtpPass || process.env.SMTP_PASS;

  // 1. Try Resend if API key is provided
  if (activeResendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeResendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderEmail.includes('<') ? senderEmail : `SAMVERO <${senderEmail}>`,
          to: [to],
          subject,
          html: htmlContent,
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        return {
          success: true,
          messageId: resData.id,
          provider: 'resend',
          previewUrl: fullPreviewUrl,
          statusMessage: `Delivered to ${to} via Resend API (ID: ${resData.id})`,
        };
      }
      console.warn('Resend API returned error, falling back:', resData);
    } catch (e: any) {
      console.warn('Resend API call failed, attempting SMTP fallback:', e?.message);
    }
  }

  // 2. Try standard Gmail / SMTP if credentials are provided
  if (activeSmtpUser && activeSmtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: activeSmtpUser,
          pass: activeSmtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: senderEmail.includes('<') ? senderEmail : `SAMVERO <${activeSmtpUser}>`,
        to,
        subject,
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
        provider: 'smtp',
        previewUrl: fullPreviewUrl,
        statusMessage: `Dispatched live to ${to} via Gmail SMTP (${info.messageId})`,
      };
    } catch (err: any) {
      console.error('SMTP transport error:', err?.message);
      const isBadAuth = 
        err?.message?.includes('535') || 
        err?.message?.includes('BadCredentials') || 
        err?.message?.includes('Username and Password not accepted') ||
        err?.message?.includes('Application-specific password required');

      return {
        success: false,
        provider: 'smtp',
        error: isBadAuth
          ? 'Google Gmail Blocked: Google does not accept your regular Gmail account password for SMTP. Google strictly requires a 16-character Google App Password from https://myaccount.google.com/apppasswords. Alternatively, click "Send via Gmail (1-Click)" to dispatch directly from your browser with zero setup!'
          : `SMTP Transport Error: ${err?.message || 'Failed to communicate with mail server'}`,
      };
    }
  }

  // 3. Simulation Sandbox Mode (when no real SMTP / Resend keys are configured yet)
  const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`[SAMVERO Mailer - Simulated Delivery]
  To: ${to}
  Subject: ${subject}
  Target Business: ${businessName}
  Preview Link: ${fullPreviewUrl}
  Status: Successfully dispatched to simulated queue (Add Gmail App Password or Resend API key to deliver to real inboxes)
  `);

  return {
    success: true,
    messageId: simulatedId,
    provider: 'simulated',
    previewUrl: fullPreviewUrl,
    statusMessage: `Simulated dispatch successful. To deliver to real recipient inboxes, configure your Gmail App Password or Resend API key in Settings.`,
  };
}
