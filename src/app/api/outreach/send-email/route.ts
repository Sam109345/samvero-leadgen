import { NextRequest, NextResponse } from 'next/server';
import { sendOutreachEmail } from '@/lib/mailer';
import { recordStaffOutreach } from '@/lib/audit-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      to, 
      businessName, 
      subject, 
      previewUrl, 
      messageBody, 
      recipientName, 
      leadType,
      city,
      country,
      discipline,
      smtpUser,
      smtpPass,
      resendKey
    } = body;

    if (!to || !businessName) {
      return NextResponse.json(
        { success: false, error: 'Recipient email and business name are required' },
        { status: 400 }
      );
    }

    const result = await sendOutreachEmail({
      to,
      recipientName,
      businessName,
      subject: subject || `Custom Website Showcase & Digital Growth Proposal for ${businessName}`,
      previewUrl,
      leadType: leadType || 'gmb',
      messageBody,
      city,
      country,
      discipline,
      smtpUser,
      smtpPass,
      resendKey,
    });

    if (!result.success) {
      const isQuota = result.error?.includes('quota');
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to dispatch email' },
        { status: isQuota ? 429 : 400 }
      );
    }

    // Automatically attribute this outreach action to the active staff operator
    const portalRole = request.cookies.get('samvero_portal_role')?.value;
    const isExecutive = portalRole === 'admin';

    recordStaffOutreach({
      staffId: isExecutive ? 'staff-sameer' : 'staff-employer',
      staffName: isExecutive ? 'Sameer (Lead Director)' : 'Employer Staff Desk',
      leadId: `lead-${Date.now()}`,
      businessName,
      category: discipline || 'Digital Growth & Web',
      country: country || 'Global',
      recipientEmail: to,
      channel: result.provider === 'smtp' ? 'Custom SMTP' : 'Resend API',
      subject: subject || `Digital Proposal for ${businessName}`,
      previewUrl: previewUrl || '',
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      provider: result.provider,
      previewUrl: result.previewUrl,
      statusMessage: result.statusMessage,
      message: result.statusMessage || `Email dispatched successfully via ${result.provider} to ${to}`,
    });
  } catch (err: any) {
    console.error('Error in send-email API:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error while sending email' },
      { status: 500 }
    );
  }
}
