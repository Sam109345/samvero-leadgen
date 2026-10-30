import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendOutreachEmail } from '@/lib/mailer';
import { isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    return NextResponse.json({
      success: true,
      config: {
        smtpUser: process.env.SMTP_USER || '',
        smtpFrom: process.env.SMTP_FROM || 'outreach@samvero.com',
        isSmtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
        isResendConfigured: Boolean(process.env.RESEND_API_KEY),
        resendKeyMasked: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 6)}...` : '',
        isGeminiConfigured: Boolean(geminiKey),
        geminiKeyMasked: geminiKey ? `${geminiKey.substring(0, 6)}...${geminiKey.slice(-4)}` : '',
        isGooglePlacesConfigured: Boolean(process.env.GOOGLE_PLACES_API_KEY),
        googlePlacesKeyMasked: process.env.GOOGLE_PLACES_API_KEY ? `${process.env.GOOGLE_PLACES_API_KEY.substring(0, 6)}...` : '',
        isSupabaseConfigured,
        supabaseUrlMasked: supabaseUrl ? `${supabaseUrl.substring(0, 18)}...` : '',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, smtpUser, smtpPass, resendKey, smtpFrom, testRecipient, geminiApiKey, supabaseUrl, supabaseAnonKey } = body;

    // Action: Test Google Gemini AI (Free API Key)
    if (action === 'test-gemini') {
      const keyToTest = geminiApiKey || process.env.GEMINI_API_KEY;
      if (!keyToTest) {
        return NextResponse.json(
          { success: false, error: 'Please enter a Google Gemini API Key or get one free at aistudio.google.com/app/apikey' },
          { status: 400 }
        );
      }

      try {
        const testRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToTest}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Write a powerful 10-word slogan for SAMVERO digital technology agency.' }] }],
              generationConfig: { maxOutputTokens: 60 }
            })
          }
        );

        if (!testRes.ok) {
          const errData = await testRes.json().catch(() => ({}));
          return NextResponse.json({
            success: false,
            error: errData?.error?.message || `Google Gemini API returned status ${testRes.status}`,
          }, { status: 400 });
        }

        const data = await testRes.json();
        const output = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'AI synthesis verified!';

        return NextResponse.json({
          success: true,
          message: 'Google Gemini 1.5 Flash Free API is active & generating live content!',
          sampleOutput: output,
        });
      } catch (testErr: any) {
        return NextResponse.json({
          success: false,
          error: testErr?.message || 'Failed to connect to Google Gemini API',
        }, { status: 500 });
      }
    }

    // Action: Send Live Test Email
    if (action === 'test-email') {
      const recipient = testRecipient || smtpUser || process.env.SMTP_USER;
      if (!recipient) {
        return NextResponse.json(
          { success: false, error: 'Please provide an email address to send the test email to.' },
          { status: 400 }
        );
      }

      const sendResult = await sendOutreachEmail({
        to: recipient,
        recipientName: 'Valued Partner',
        businessName: 'SAMVERO Sample Client Showcase',
        subject: '✨ SAMVERO Live Test Email: Your Digital Proposal & Prototype',
        previewUrl: '/preview/pk-gmb-101',
        leadType: 'gmb',
        messageBody: 'This is a verified live test email from SAMVERO – AI-Powered Lead Generation Platform. Your email dispatch system is functioning properly and clients will receive this exact luxury design!',
        senderName: 'SAMVERO Acquisition & Technology Team',
        senderEmail: smtpFrom || process.env.SMTP_FROM || smtpUser || 'outreach@samvero.com',
        city: 'Global',
        country: 'Enterprise',
        discipline: 'Web Development & Mobile App Showcase',
        smtpUser,
        smtpPass,
        resendKey,
      });

      return NextResponse.json({
        success: sendResult.success,
        provider: sendResult.provider,
        messageId: sendResult.messageId,
        statusMessage: sendResult.statusMessage,
        message: sendResult.statusMessage || `Test email dispatched to ${recipient}`,
      });
    }

    // Action: Save configuration to .env.local
    const envPath = path.resolve(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const updates: Record<string, string> = {};
    if (smtpUser !== undefined) {
      updates['SMTP_USER'] = smtpUser;
      process.env.SMTP_USER = smtpUser;
    }
    if (smtpPass !== undefined) {
      updates['SMTP_PASS'] = smtpPass;
      process.env.SMTP_PASS = smtpPass;
    }
    if (resendKey !== undefined) {
      updates['RESEND_API_KEY'] = resendKey;
      process.env.RESEND_API_KEY = resendKey;
    }
    if (smtpFrom !== undefined) {
      updates['SMTP_FROM'] = smtpFrom;
      process.env.SMTP_FROM = smtpFrom;
    }
    if (geminiApiKey !== undefined) {
      updates['GEMINI_API_KEY'] = geminiApiKey;
      process.env.GEMINI_API_KEY = geminiApiKey;
    }
    if (supabaseUrl !== undefined) {
      updates['NEXT_PUBLIC_SUPABASE_URL'] = supabaseUrl;
      process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
    }
    if (supabaseAnonKey !== undefined) {
      updates['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = supabaseAnonKey;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;
    }

    let newEnvContent = envContent;
    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(newEnvContent)) {
        newEnvContent = newEnvContent.replace(regex, `${key}="${value}"`);
      } else {
        newEnvContent += `\n${key}="${value}"`;
      }
    }

    fs.writeFileSync(envPath, newEnvContent.trim() + '\n', 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Platform configuration successfully saved to environment!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
