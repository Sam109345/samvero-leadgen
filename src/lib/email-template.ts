export interface TemplateOptions {
  recipientName: string;
  businessName: string;
  subject: string;
  previewUrl?: string;
  messageBody?: string;
  senderName?: string;
  senderEmail?: string;
  city?: string;
  country?: string;
  discipline?: string;
}

/**
 * Generates an ultra-luxurious, responsive HTML email template for SAMVERO
 * Compatible with Gmail, Apple Mail, Outlook, Yahoo, and mobile screens.
 */
export function generateSamveroEmailTemplate(options: TemplateOptions): string {
  const {
    recipientName = 'Business Owner',
    businessName,
    subject,
    previewUrl,
    messageBody,
    senderName = 'SAMVERO Acquisition & Technology Team',
    senderEmail = 'outreach@samvero.com',
    city = 'Lahore',
    country = 'Pakistan',
    discipline = 'Web Development & Digital Showcase',
  } = options;

  const appUrl = process.env.PUBLIC_LIVE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cleanPath = previewUrl?.startsWith('/') ? previewUrl : `/${previewUrl || ''}`;
  const fullPreviewUrl = previewUrl?.startsWith('http')
    ? (process.env.PUBLIC_LIVE_URL && previewUrl.includes('localhost')
        ? previewUrl.replace(/https?:\/\/localhost:\d+/i, process.env.PUBLIC_LIVE_URL.replace(/\/$/, ''))
        : previewUrl)
    : `${appUrl.replace(/\/$/, '')}${cleanPath}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F0F2F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: separate;
    }
    .email-container {
      max-width: 620px;
      margin: 30px auto;
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04);
      border: 1px solid #E2E8F0;
    }
    .brand-bar {
      padding: 24px 32px 18px 32px;
      background: #FFFFFF;
      border-bottom: 1px solid #F1F5F9;
      text-align: center;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-title span {
      color: #007FED;
    }
    .brand-tagline {
      font-size: 11px;
      color: #64748B;
      font-weight: 600;
      margin-top: 4px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .hero-banner {
      background: linear-gradient(135deg, #007FED 0%, #005bb5 100%);
      padding: 36px 32px;
      color: #FFFFFF;
      text-align: left;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 9999px;
      padding: 4px 14px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .hero-headline {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.25;
      margin: 0 0 8px 0;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }
    .hero-sub {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.88);
      margin: 0;
      line-height: 1.5;
    }
    .content-body {
      padding: 32px 32px 24px 32px;
      line-height: 1.65;
      color: #334155;
      font-size: 15px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 16px;
    }
    .deliverable-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 24px;
      margin: 28px 0;
      text-align: center;
    }
    .deliverable-badge {
      display: inline-block;
      background: #E0F2FE;
      color: #0369A1;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 6px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .deliverable-title {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px 0;
    }
    .deliverable-text {
      font-size: 14px;
      color: #64748B;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
    .btn-primary {
      display: inline-block;
      background-color: #007FED;
      color: #FFFFFF !important;
      font-weight: 700;
      font-size: 15px;
      padding: 13px 32px;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 127, 237, 0.3);
    }
    .features-grid {
      margin: 24px 0;
      width: 100%;
    }
    .feature-item {
      padding: 12px 14px;
      background: #F8FAFC;
      border: 1px solid #F1F5F9;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .feature-title {
      font-weight: 700;
      font-size: 13px;
      color: #0F172A;
    }
    .feature-desc {
      font-size: 12px;
      color: #64748B;
      margin-top: 2px;
    }
    .contact-cta-bar {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #E2E8F0;
    }
    .signature-area {
      margin-top: 30px;
      font-size: 14px;
      color: #475569;
    }
    .signature-title {
      font-weight: 700;
      color: #0F172A;
      font-size: 15px;
    }
    .footer-bar {
      background: #F8FAFC;
      padding: 24px 32px;
      border-top: 1px solid #E2E8F0;
      text-align: center;
      font-size: 12px;
      color: #94A3B8;
      line-height: 1.6;
    }
    .footer-bar a {
      color: #007FED;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0F2F5; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <div class="email-container">
          
          <!-- 1. Header with SAMVERO Official Brand -->
          <div class="brand-bar">
            <h2 class="brand-title">SAM<span>VERO</span></h2>
            <div class="brand-tagline">Find the Right Leads. Build Better Connections.</div>
          </div>

          <!-- 2. Hero Banner with Gradient -->
          <div class="hero-banner">
            <span class="hero-badge">Verified Prototype &bull; Instant Showcase</span>
            <h1 class="hero-headline">Bespoke Proposal for ${businessName}</h1>
            <p class="hero-sub">Target: ${discipline} &bull; ${city}, ${country}</p>
          </div>

          <!-- 3. Executive Message Body -->
          <div class="content-body">
            <div class="greeting">Hello ${recipientName},</div>
            
            <p style="margin-bottom: 16px;">
              ${messageBody ? messageBody.replace(/\n/g, '<br>') : `We noticed <strong>${businessName}</strong> in your local market and recognized an immediate opportunity to elevate your digital presence and convert more potential customers into high-ticket clients.`}
            </p>

            <p style="margin-bottom: 20px;">
              Rather than sending you a generic pitch or static slides, our engineering team has already synthesized an <strong>interactive, live preview draft</strong> tailored exclusively for your operations.
            </p>

            <!-- 4. Interactive Live Preview Deliverable Card -->
            <div class="deliverable-card">
              <span class="deliverable-badge">Live Interactive Prototype Ready</span>
              <h3 class="deliverable-title">Interactive Showcase for ${businessName}</h3>
              <p class="deliverable-text">
                Explore your live working website, 4-screen mobile app prototype, and automated booking system pre-configured for your market:
              </p>
              
              <a href="${fullPreviewUrl}" class="btn-primary" target="_blank">
                View Live Interactive Showcase &rarr;
              </a>
            </div>

            <!-- 5. Scope & Highlights Breakdown -->
            <div style="margin-top: 24px;">
              <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0 0 12px 0;">
                What is included in this scope:
              </h4>

              <div class="feature-item">
                <div class="feature-title">&#10004; High-Speed Responsive Web Presence</div>
                <div class="feature-desc">Next.js 14 architecture with instant mobile loading, bespoke typography, and Google SEO readiness.</div>
              </div>

              <div class="feature-item">
                <div class="feature-title">&#10004; Mobile App 4-Screen User Flow</div>
                <div class="feature-desc">Interactive iPhone 16 mockup flow covering authentication, dashboard, booking, and user settings.</div>
              </div>

              <div class="feature-item">
                <div class="feature-title">&#10004; Direct WhatsApp &amp; Inbound Call CTAs</div>
                <div class="feature-desc">One-click customer inquiry routing directly to your WhatsApp or phone desk.</div>
              </div>
            </div>

            <!-- 6. Next Steps & Direct Reach-out -->
            <div class="contact-cta-bar">
              <p style="font-size: 14px; margin: 0 0 14px 0; color: #334155;">
                If you would like to activate this on your official custom domain, adjust the visual design, or discuss tailored pricing, simply reply directly to this email.
              </p>
            </div>

            <!-- 7. Verified Sign-Off -->
            <div class="signature-area">
              Warm regards,<br>
              <div class="signature-title">${senderName}</div>
              <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
                SAMVERO &bull; AI-Powered Lead Generation Platform<br>
                Email: <a href="mailto:${senderEmail}" style="color: #007FED; text-decoration: none;">${senderEmail}</a> &bull; Web: <a href="${appUrl}" style="color: #007FED; text-decoration: none;">${appUrl}</a>
              </div>
            </div>

          </div>

          <!-- 8. Footer -->
          <div class="footer-bar">
            <strong>SAMVERO</strong> &bull; AI-Powered Lead Generation Platform<br>
            Find the Right Leads. Build Better Connections.<br>
            <span style="font-size: 11px; color: #CBD5E1; margin-top: 8px; display: block;">
              This invitation and digital showcase were synthesized exclusively for ${businessName}. If you received this in error, please disregard.
            </span>
          </div>

        </div>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
