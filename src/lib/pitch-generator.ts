/**
 * SAMVERO PROJECT-SPECIFIC AI EMAIL PITCH & BID GENERATOR
 * 
 * Strict compliance with requirements:
 * 1. Category-specific generation (never generic)
 * 2. Strict greeting: ONLY client's first name ("Hello Sarah," or "Hi Ahmed,") or "Hello,"
 * 3. Strict closing: EXACTLY:
 *    Best regards,
 *    SAMVERO Lead Acquisition & Technology Team
 * 4. User-specific Gemini API integration with zero key leakage
 * 5. Distinct Bid / Proposal generation vs Email Outreach
 */

import { Lead } from '@/types';
import { decryptSensitive } from './lead-workspace-store';

export function extractClientFirstName(contactPerson?: string | null): string {
  if (!contactPerson) return '';
  // Strip parenthetical notes like (CEO), (Hiring Manager) and dash suffixes
  const stripped = contactPerson
    .replace(/\(.*?\)/g, '')
    .replace(/[-–—].*$/, '')
    .trim();

  // Strip common titles
  const withoutTitle = stripped.replace(/^(dr\.?|mr\.?|mrs\.?|ms\.?|eng\.?|prof\.?)\s+/i, '').trim();

  // Ignore business/company keywords if they form the entity name
  if (/(inc|llc|ltd|co\b|corp|team|agency|group|studio|founder|owner|manager|hiring|recruiter|client|department)/i.test(withoutTitle)) {
    return '';
  }

  const firstWord = withoutTitle.split(/[\s,._-]+/)[0];
  if (!firstWord || firstWord.length < 2) return '';
  // Support Unicode letters (e.g. José, François, René, Müller, Søren)
  let isLetterOnly = false;
  try {
    isLetterOnly = new RegExp('^[\\p{L}]+$', 'u').test(firstWord);
  } catch {
    isLetterOnly = /^[a-zA-Z\u00C0-\u024F]+$/.test(firstWord);
  }
  if (!isLetterOnly) return '';
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

export function formatGreeting(contactPerson?: string | null): string {
  const firstName = extractClientFirstName(contactPerson);
  if (firstName) {
    return `Hello ${firstName},`;
  }
  return 'Hello,';
}

export const STRICT_CLOSING_HTML = `<p>Best regards,<br>SAMVERO Lead Acquisition & Technology Team</p>`;
export const STRICT_CLOSING_TEXT = `Best regards,\nSAMVERO Lead Acquisition & Technology Team`;

export type ProjectPitchCategory =
  | 'Website Development'
  | 'WordPress Development'
  | 'Shopify Development'
  | 'E-commerce Development'
  | 'Social Media Management'
  | 'Social Media Design'
  | 'SEO'
  | 'Graphic Design'
  | 'Logo Design'
  | 'Mobile App Development'
  | 'UI/UX Design'
  | 'Digital Marketing'
  | 'General Outreach';

export function detectLeadPitchCategory(lead: Partial<Lead>): ProjectPitchCategory {
  const text = `${lead.category || ''} ${lead.title || ''} ${lead.description || ''} ${(lead.tags || []).join(' ')}`.toLowerCase();

  if (text.includes('wordpress') || text.includes('woocommerce') || text.includes('elementor')) {
    return 'WordPress Development';
  }
  if (text.includes('shopify') || text.includes('liquid') || text.includes('shopify plus')) {
    return 'Shopify Development';
  }
  if (text.includes('e-commerce') || text.includes('ecommerce') || text.includes('online store') || text.includes('cart')) {
    return 'E-commerce Development';
  }
  if (text.includes('social media management') || text.includes('social media marketing') || text.includes('smm') || text.includes('instagram manager')) {
    return 'Social Media Management';
  }
  if (text.includes('social media design') || text.includes('post design') || text.includes('carousel design') || text.includes('thumbnail')) {
    return 'Social Media Design';
  }
  if (text.includes('seo') || text.includes('search engine') || text.includes('ranking') || text.includes('backlink')) {
    return 'SEO';
  }
  if (text.includes('logo') || text.includes('brand mark') || text.includes('identity design')) {
    return 'Logo Design';
  }
  if (text.includes('graphic design') || text.includes('branding') || text.includes('brand guidelines') || text.includes('flyer')) {
    return 'Graphic Design';
  }
  if (text.includes('mobile app') || text.includes('ios') || text.includes('android') || text.includes('react native') || text.includes('flutter')) {
    return 'Mobile App Development';
  }
  if (text.includes('ui/ux') || text.includes('ui ux') || text.includes('figma') || text.includes('wireframe') || text.includes('prototype')) {
    return 'UI/UX Design';
  }
  if (text.includes('digital marketing') || text.includes('google ads') || text.includes('meta ads') || text.includes('paid social') || text.includes('ppc')) {
    return 'Digital Marketing';
  }
  if (text.includes('web') || text.includes('website') || text.includes('landing page') || text.includes('frontend') || text.includes('fullstack')) {
    return 'Website Development';
  }

  return 'General Outreach';
}

/**
 * Call user's own Gemini API key
 */
export async function callUserGeminiApi(
  apiKey: string,
  prompt: string,
  systemInstruction?: string,
  model = 'gemini-1.5-flash'
): Promise<{ success: boolean; text?: string; error?: string }> {
  if (!apiKey) {
    return { success: false, error: 'User Gemini API key is missing' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.75,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `Gemini API returned HTTP ${response.status}`;
      return { success: false, error: errMsg };
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return { success: false, error: 'Gemini returned empty candidate content' };
    }

    return { success: true, text: candidateText };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network failure communicating with Gemini API' };
  }
}

/**
 * Clean & enforce strict greeting and closing rules on generated HTML pitch
 */
export function enforceEmailStructure(
  rawText: string,
  contactPerson?: string | null,
  businessName?: string
): { subject: string; htmlContent: string; plainText: string } {
  const greeting = formatGreeting(contactPerson);
  const closingHtml = STRICT_CLOSING_HTML;
  const closingText = STRICT_CLOSING_TEXT;

  // Extract Subject line if provided in output
  let subject = `Tailored Proposal for ${businessName || 'Your Project'}`;
  let bodyContent = rawText;

  const subjectMatch = rawText.match(/Subject:\s*(.+)/i);
  if (subjectMatch) {
    subject = subjectMatch[1].trim().replace(/^["']|["']$/g, '');
    bodyContent = bodyContent.replace(/Subject:\s*(.+)/i, '').trim();
  }

  // Remove any conflicting greeting that might have been generated
  bodyContent = bodyContent
    .replace(/^(hello|hi|dear|hey)\s+[^,\n]+[,:\n]/i, '')
    .trim();

  // Remove any conflicting signatures/closings
  bodyContent = bodyContent
    .replace(/(best regards|warm regards|sincerely|cheers|thanks)[,\s\S]*$/i, '')
    .trim();

  // Convert raw paragraphs to clean HTML if markdown
  let htmlBody = bodyContent;
  if (!htmlBody.includes('<p>') && !htmlBody.includes('<ul>')) {
    // Format markdown paragraphs & lists into HTML
    const paragraphs = htmlBody.split(/\n\s*\n/);
    htmlBody = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const items = trimmed
            .split(/\n/)
            .map((item) => `<li>${item.replace(/^[-*•]\s*/, '').trim()}</li>`)
            .join('\n');
          return `<ul>\n${items}\n</ul>`;
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed
            .split(/\n/)
            .map((item) => `<li>${item.replace(/^\d+\.\s*/, '').trim()}</li>`)
            .join('\n');
          return `<ol>\n${items}\n</ol>`;
        }
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  }

  const finalHtml = `<p>${greeting}</p>\n${htmlBody}\n${closingHtml}`;
  const finalPlainText = `${greeting}\n\n${bodyContent.replace(/<[^>]+>/g, '')}\n\n${closingText}`;

  return {
    subject,
    htmlContent: finalHtml,
    plainText: finalPlainText,
  };
}

/**
 * Intelligent category-specific deterministic pitch generation
 * Used when user key is configured but offline, or as reference baseline
 */
export function generateCategorySpecificPitch(
  lead: Lead,
  category: ProjectPitchCategory,
  variationIndex = 0
): { subject: string; htmlContent: string; plainText: string } {
  const greeting = formatGreeting(lead.contact?.contactPerson);
  const bName = lead.businessName || 'Your Business';
  const pTitle = lead.title || 'your project';
  const city = lead.city || '';
  const desc = lead.description || '';

  let subject = '';
  let body = '';

  switch (category) {
    case 'Website Development':
      subject = variationIndex % 2 === 0
        ? `Website Design & Development Proposal for ${bName}`
        : `Turnkey Web Architecture & Conversion Optimization for ${bName}`;
      body = `<p>I reviewed your project specifications for <strong>${pTitle}</strong>${city ? ` in ${city}` : ''}. We noticed your core requirement to create a high-performance, mobile-responsive web platform that builds immediate credibility and converts incoming traffic into active inquiries.</p>
<p>At <strong>SAMVERO</strong>, our engineering team designs and delivers custom web platforms utilizing modern, high-speed architectures (Next.js, React, Tailwind CSS) that load in under 1 second.</p>
<p><strong>Our Proposed Deliverable Scope:</strong></p>
<ul>
  <li>Clean, responsive UI/UX tailored to your exact industry requirements</li>
  <li>Fast performance optimization with clean, accessible code</li>
  <li>Direct WhatsApp inquiry CTA and appointment booking integration</li>
  <li>SEO-ready semantic structure and structured schema markup</li>
</ul>
<p>We are available to start work immediately and provide milestone-based progress reviews. Would you be open to a 10-minute discovery call this week to review your timeline?</p>`;
      break;

    case 'WordPress Development':
      subject = variationIndex % 2 === 0
        ? `WordPress Development & Custom Theme Proposal for ${bName}`
        : `Scalable WordPress Architecture & Speed Optimization for ${pTitle}`;
      body = `<p>I am reaching out regarding your WordPress project requirement for <strong>${pTitle}</strong>. We specialize in building secure, lightning-fast WordPress and WooCommerce solutions built without heavy page builder bloat.</p>
<p><strong>Proposed Approach:</strong></p>
<ul>
  <li>Bespoke WordPress theme development or child-theme customization</li>
  <li>Sub-second speed optimization targeting 90+ Google PageSpeed Core Web Vitals</li>
  <li>Seamless third-party API, CRM, and payment gateway integrations</li>
  <li>Hardened security configuration and automated daily backup routines</li>
</ul>
<p>Let us know if you would like a brief walkthrough of our WordPress development roadmap and milestones.</p>`;
      break;

    case 'Shopify Development':
      subject = variationIndex % 2 === 0
        ? `Shopify Store Development & Checkout Optimization for ${bName}`
        : `High-Converting Shopify E-Commerce Proposal for ${pTitle}`;
      body = `<p>I analyzed your project requirements for <strong>${pTitle}</strong>. In modern e-commerce, user experience and mobile checkout fluidity are the single biggest determinants of your conversion rate and Average Order Value.</p>
<p><strong>Proposed Deliverables for ${bName}:</strong></p>
<ul>
  <li>Shopify 2.0 architecture with custom Liquid sections for flexible merchandising</li>
  <li>Mobile-first conversion optimization, fast product filtering, and 1-click checkout</li>
  <li>Seamless inventory synchronization and payment/shipping integrations</li>
  <li>Post-purchase upsells and automated cart recovery flows</li>
</ul>
<p>Would you have 5 minutes this week to connect on your product catalog and desired launch date?</p>`;
      break;

    case 'E-commerce Development':
      subject = variationIndex % 2 === 0
        ? `Custom E-Commerce Platform & High-Conversion Store Architecture for ${bName}`
        : `Scalable E-Commerce Store Development Proposal for ${pTitle}`;
      body = `<p>I reviewed your project specifications for <strong>${pTitle}</strong>. Scaling an e-commerce business requires a high-performance storefront, frictionless checkout experience, and robust backend integrations that drive conversions and increase Average Order Value.</p>
<p><strong>Proposed E-Commerce Deliverables for ${bName}:</strong></p>
<ul>
  <li>Turnkey high-converting store architecture with mobile-first checkout optimization</li>
  <li>Real-time inventory synchronization, order management, and secure payment gateways</li>
  <li>Automated abandoned cart recovery, product recommendations, and customer accounts</li>
  <li>Sub-second load times engineered for maximum search visibility and purchase conversion</li>
</ul>
<p>We are ready to start immediately with milestone-based delivery. Would you be open to a 10-minute call this week to review your catalog and launch milestones?</p>`;
      break;

    case 'Social Media Management':
      subject = variationIndex % 2 === 0
        ? `Social Media Growth Strategy & Content Execution for ${bName}`
        : `Targeted Social Media Management & Brand Engagement for ${pTitle}`;
      body = `<p>I reviewed your project requirement regarding <strong>${pTitle}</strong>. Scaling a brand on social media requires authentic storytelling, consistent visual identity, and strategic audience engagement that translates into real business inquiries.</p>
<p><strong>Our Social Media Management Strategy:</strong></p>
<ul>
  <li>Comprehensive 30-day content calendar tailored to your target audience</li>
  <li>High-engagement video reels, carousels, and visual posts optimized for reach</li>
  <li>Active community management and direct message triage</li>
  <li>Bi-weekly performance analytics tracking audience growth and inquiry volume</li>
</ul>
<p>We would love to discuss how our team at SAMVERO can elevate your social channels. When would be a good time to connect?</p>`;
      break;

    case 'Social Media Design':
      subject = `Bespoke Social Media Creatives & Visual Brand Assets for ${bName}`;
      body = `<p>I saw your requirement for creative social media design on <strong>${pTitle}</strong>. In crowded social feeds, thumb-stopping design and clear visual hierarchy make all the difference in audience retention.</p>
<p><strong>Creative Scope:</strong></p>
<ul>
  <li>Custom vector graphics, infographics, and carousel layouts</li>
  <li>High-converting video reel covers and YouTube thumbnails</li>
  <li>Consistent brand color palettes, typography, and visual guidelines</li>
  <li>Full source files with rapid turnaround for breaking announcements</li>
</ul>
<p>Let's connect to review your brand kit and upcoming creative campaign goals.</p>`;
      break;

    case 'SEO':
      subject = `Organic Search Optimization & First-Page Ranking Strategy for ${bName}`;
      body = `<p>I am writing regarding your search engine optimization requirements for <strong>${pTitle}</strong>. Ranking organically for high-intent commercial keywords delivers the lowest customer acquisition cost of any channel.</p>
<p><strong>SEO Roadmap:</strong></p>
<ul>
  <li>In-depth technical SEO audit resolving crawl errors and indexing roadblocks</li>
  <li>High-intent commercial keyword mapping targeting verified buyer intent</li>
  <li>On-page semantic optimization and Google My Business local search ranking</li>
  <li>Ethical white-hat outreach to build authoritative domain backlinks</li>
</ul>
<p>Would you be open to reviewing an initial keyword analysis tailored to your competitors?</p>`;
      break;

    case 'Graphic Design':
      subject = variationIndex % 2 === 0
        ? `Bespoke Graphic Design & Marketing Collateral Proposal for ${bName}`
        : `Creative Graphic Design & Visual Assets for ${pTitle}`;
      body = `<p>I reviewed your graphic design requirements for <strong>${pTitle}</strong>. Cohesive visual design across all touchpoints commands premium brand perception and elevates audience engagement.</p>
<p><strong>Scope of Work:</strong></p>
<ul>
  <li>High-impact marketing collateral, brochures, flyers, and digital ad banners</li>
  <li>Consistent typography, color theory, and composition standards</li>
  <li>Print-ready CMYK and digital RGB assets with complete source packages</li>
  <li>Rapid iterative revisions with guaranteed delivery timelines</li>
</ul>
<p>We are available to start concepting immediately. When would be a good time to review your creative brief?</p>`;
      break;

    case 'Logo Design':
      subject = variationIndex % 2 === 0
        ? `Logo & Visual Identity Design Proposal for ${bName}`
        : `Iconic Logo Design & Brand Mark Architecture for ${pTitle}`;
      body = `<p>I saw your requirement for logo and visual identity design on <strong>${pTitle}</strong>. A distinctive brand mark anchors your entire business presence and builds immediate trust with target clients.</p>
<p><strong>Proposed Logo Design Deliverables:</strong></p>
<ul>
  <li>Multiple bespoke vector logo concepts crafted with geometric precision</li>
  <li>Primary, secondary, and sub-mark lockups in light and dark variants</li>
  <li>Complete vector formats (SVG, EPS, AI, PDF) and high-res PNG/JPG exports</li>
  <li>Mini brand style guide covering color hex codes, font pairings, and clear-space rules</li>
</ul>
<p>Let's schedule a 5-minute chat to discuss your brand aesthetic and design preferences.</p>`;
      break;

    case 'Mobile App Development':
      subject = `Native Mobile Application Development Architecture for ${bName}`;
      body = `<p>I reviewed your project specifications for <strong>${pTitle}</strong>. Developing a mobile application demands robust performance, responsive UI animations, and a secure backend infrastructure.</p>
<p><strong>Deliverables:</strong></p>
<ul>
  <li>Cross-platform iOS and Android application built with React Native / Flutter</li>
  <li>Intuitive UI/UX user flows with biometric authentication and push notifications</li>
  <li>Secure RESTful API backend and cloud database integration</li>
  <li>App Store and Google Play compliance review and deployment assistance</li>
</ul>
<p>Let's schedule a 10-minute technical discovery call to review your user journeys and milestone schedule.</p>`;
      break;

    case 'UI/UX Design':
      subject = variationIndex % 2 === 0
        ? `User Experience & Interactive UI/UX Design Proposal for ${bName}`
        : `Modern UI/UX Design & High-Fidelity Figma Prototyping for ${pTitle}`;
      body = `<p>I analyzed your project specifications for <strong>${pTitle}</strong>. Great digital products succeed by eliminating user friction and turning complex workflows into intuitive, beautiful user interfaces.</p>
<p><strong>Proposed UI/UX Scope for ${bName}:</strong></p>
<ul>
  <li>User persona mapping, information architecture, and low-fidelity wireframes</li>
  <li>High-fidelity responsive UI screens designed in Figma with auto-layout and components</li>
  <li>Interactive clickable prototype ready for user testing and stakeholder review</li>
  <li>Comprehensive design system with typography, color tokens, and developer handover specs</li>
</ul>
<p>Would you have 10 minutes this week to walk through your user flows and desired design aesthetic?</p>`;
      break;

    case 'Digital Marketing':
      subject = `Strategic Digital Marketing & High-ROI Acquisition Proposal for ${bName}`;
      body = `<p>I am reaching out regarding your digital marketing initiative for <strong>${pTitle}</strong>. Maximizing ad spend efficiency requires laser-targeted audience funnels, high-converting ad creatives, and relentless data testing.</p>
<p><strong>Campaign Strategy:</strong></p>
<ul>
  <li>Full-funnel campaign architecture across Google Ads and Meta Ads</li>
  <li>Custom conversion landing pages engineered for maximum opt-in rates</li>
  <li>Advanced pixel tracking, CAPI event setup, and attribution modeling</li>
  <li>Weekly performance reporting focused strictly on Cost Per Acquisition and ROI</li>
</ul>
<p>Would you be available for a brief strategy call this week to review your target CPA?</p>`;
      break;

    default:
      subject = `Exclusive Proposal: Technology & Acquisition Solutions for ${bName}`;
      body = `<p>I reviewed the requirements for <strong>${pTitle}</strong>. At <strong>SAMVERO</strong>, our engineering and digital acquisition team specializes in delivering high-impact solutions that solve specific operational bottlenecks.</p>
<p><strong>Our Proposed Deliverable Scope:</strong></p>
<ul>
  <li>Direct alignment with your specific project deliverables and timeline</li>
  <li>Clean engineering and transparent communication with verified milestones</li>
  <li>Comprehensive testing and post-launch support guarantee</li>
</ul>
<p>Would you be open to a quick 5-minute call this week to review how we can support this project?</p>`;
      break;
  }

  const finalHtml = `<p>${greeting}</p>\n${body}\n${STRICT_CLOSING_HTML}`;
  const plainText = `${greeting}\n\n${body.replace(/<[^>]+>/g, '')}\n\n${STRICT_CLOSING_TEXT}`;

  return {
    subject,
    htmlContent: finalHtml,
    plainText,
  };
}

/**
 * Generate AI Bid / Proposal (Strictly distinct format from email pitch)
 */
export async function generateProjectBid(
  lead: Lead,
  userGeminiKey?: string | null
): Promise<{
  title: string;
  content: string;
  deliverables: string[];
  timeline: string;
  investment: string;
}> {
  const category = detectLeadPitchCategory(lead);
  const pTitle = lead.title || 'Client Project';
  const bName = lead.businessName || 'Client';
  const desc = lead.description || '';

  if (userGeminiKey) {
    const prompt = `You are a senior technical solutions architect at SAMVERO Lead Acquisition & Technology.
Generate a professional, highly competitive platform bid for:
Project Title: ${pTitle}
Business/Client: ${bName}
Category: ${category}
Project Description: ${desc}

STRICT BIDDING RULES:
1. DO NOT format this as an email pitch. This is a formal freelance/marketplace bid proposal.
2. Structure:
   - Proposed Approach (concise technical strategy)
   - Scope of Deliverables (bullet points)
   - Execution Timeline
   - Investment / Milestone Estimate
   - Professional Closing
3. Never invent previous client names or fake case studies.
4. Keep it direct, authoritative, and conversion-focused.

Return ONLY a JSON object with:
{
  "title": "Bid proposal title",
  "content": "Full markdown proposal text",
  "deliverables": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4"],
  "timeline": "Estimated duration (e.g. 5-7 Business Days)",
  "investment": "Estimated investment (e.g. $750 USD Fixed Scope)"
}`;

    const res = await callUserGeminiApi(
      userGeminiKey,
      prompt,
      'You are a senior technology proposal writer. Return valid JSON only.'
    );

    if (res.success && res.text) {
      try {
        const jsonMatch = res.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            title: parsed.title || `Comprehensive ${category} Proposal for ${bName}`,
            content: parsed.content || res.text,
            deliverables: Array.isArray(parsed.deliverables) ? parsed.deliverables : ['Milestone 1 Discovery', 'Milestone 2 Development', 'Milestone 3 Deployment'],
            timeline: parsed.timeline || '7-10 Business Days',
            investment: parsed.investment || lead.budget || '$850 USD',
          };
        }
      } catch {
        // Fallback below
      }
    }
  }

  // Deterministic bid generator
  return {
    title: `Turnkey ${category} Scope & Milestone Execution for ${pTitle}`,
    content: `### Executive Solution Overview
Our engineering team at SAMVERO reviewed the complete requirements for "${pTitle}". We deliver production-grade ${category} with verified milestones, clean architecture, and rapid turnaround.

### Proposed Technical Approach
1. **Requirements Architecture & Audit:** Deep-dive analysis of specifications, competitor benchmarks, and wireframes.
2. **Core Implementation:** Agile milestone-based development ensuring zero regressions and responsive performance.
3. **Quality Assurance & Security Review:** Cross-device browser testing, speed optimization, and vulnerability scanning.
4. **Final Deployment & Handover:** Complete source code repository, documentation, and 30-day post-launch support.

We are ready for an immediate start upon contract award.`,
    deliverables: [
      `Complete ${category} architecture tailored to specifications`,
      'Mobile-responsive layout and cross-browser verified UI',
      'Full source code repository with comprehensive handover documentation',
      '30-day post-delivery bug fixing and performance warranty',
    ],
    timeline: '5 to 7 Business Days',
    investment: lead.budget || '$650 - $1,200 USD (Milestone Billed)',
  };
}
