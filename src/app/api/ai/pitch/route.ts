import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserGeminiApiKey,
  getUserAiSettings,
  saveEmailDraft,
  addLeadActivityLog,
} from '@/lib/lead-workspace-store';
import {
  detectLeadPitchCategory,
  generateCategorySpecificPitch,
  callUserGeminiApi,
  enforceEmailStructure,
  formatGreeting,
  extractClientFirstName,
  ProjectPitchCategory,
} from '@/lib/pitch-generator';
import { Lead } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json();
    const {
      lead,
      categoryOverride,
      isRegenerate = false,
      variationIndex = 0,
      customTemplatePrompt,
    } = body;

    if (!lead || !lead.id) {
      return NextResponse.json(
        { success: false, error: 'Lead data with ID is required.' },
        { status: 400 }
      );
    }

    const typedLead = lead as Lead;
    const resolvedCategory: ProjectPitchCategory =
      categoryOverride || detectLeadPitchCategory(typedLead);

    // Retrieve user's personal encrypted Gemini key
    const userKey = getUserGeminiApiKey(user.userId);
    const aiSettings = getUserAiSettings(user.userId);

    const clientFirstName = extractClientFirstName(typedLead.contact?.contactPerson);
    const greeting = formatGreeting(typedLead.contact?.contactPerson);

    let generatedSubject = '';
    let generatedHtml = '';
    let generatedPlainText = '';
    let usedAiModel = false;

    // 1. If user has connected their own Gemini API key, use live Gemini API
    if (userKey) {
      const prompt = `You are a world-class technology solution strategist at SAMVERO.
Draft a high-converting, professional, tailored cold outreach email pitch for this specific lead:

Lead Title: ${typedLead.title || ''}
Business Name: ${typedLead.businessName || ''}
Target Category: ${resolvedCategory}
Platform: ${typedLead.platform || ''}
Location: ${typedLead.city || ''}, ${typedLead.country || ''}
Project Scope & Requirements: ${typedLead.description || ''}
Client First Name: ${clientFirstName || '(Not available)'}
Variation Number: ${isRegenerate ? variationIndex + 1 : 1}
${customTemplatePrompt ? `Reference Template Starting Point: ${customTemplatePrompt}` : ''}

CRITICAL RULES:
1. GREETING:
   - If Client First Name is available, use ONLY: "${greeting}"
   - NEVER use the client's full name, company name, or titles.
2. CATEGORY SPECIFIC:
   - The pitch MUST be strictly tailored to ${resolvedCategory}.
   ${resolvedCategory === 'Social Media Management' || resolvedCategory === 'Social Media Design' ? '- DO NOT mention website development. Focus on social media strategy, reels, content calendar, and engagement.' : ''}
   ${resolvedCategory === 'Website Development' ? '- Focus on responsive design, UI/UX, conversion rate, and performance.' : ''}
   ${resolvedCategory === 'WordPress Development' ? '- Focus on custom WordPress themes, WooCommerce, speed optimization, and plugins.' : ''}
   ${resolvedCategory === 'Shopify Development' ? '- Focus on Shopify store customization, checkout fluidity, and conversion rate.' : ''}
   ${resolvedCategory === 'SEO' ? '- Focus on organic ranking, keyword intent, technical audit, and domain authority.' : ''}
   ${resolvedCategory === 'Graphic Design' || resolvedCategory === 'Logo Design' ? '- Focus on vector precision, visual identity, brand mark, and collateral.' : ''}
   ${resolvedCategory === 'Mobile App Development' ? '- Focus on native iOS/Android development, UI/UX, and cloud APIs.' : ''}
3. PERSUASIVE VALUE:
   - Explain how SAMVERO solves the client's problem.
   - Include 3-4 bullet points highlighting relevant deliverables.
   - Include a low-friction call to action (e.g. 5-10 minute call).
   - NEVER invent fake client names, previous achievements, or case studies.
4. CLOSING:
   - Must end with EXACTLY:
     Best regards,
     SAMVERO Lead Acquisition & Technology Team
   - Do NOT add personal names, phone numbers, or extra contact details.

Format your output with:
Subject: <Catchy, highly relevant subject line>
<Email body>`;

      const geminiRes = await callUserGeminiApi(
        userKey,
        prompt,
        'You are an expert enterprise proposal writer. Write concise, project-specific, conversion-focused emails.',
        aiSettings.model || 'gemini-1.5-flash'
      );

      if (geminiRes.success && geminiRes.text) {
        const enforced = enforceEmailStructure(
          geminiRes.text,
          typedLead.contact?.contactPerson,
          typedLead.businessName
        );
        generatedSubject = enforced.subject;
        generatedHtml = enforced.htmlContent;
        generatedPlainText = enforced.plainText;
        usedAiModel = true;
      }
    }

    // 2. Fallback to deterministic category-specific generator if no key or API error
    if (!generatedHtml) {
      const fallback = generateCategorySpecificPitch(
        typedLead,
        resolvedCategory,
        isRegenerate ? variationIndex + 1 : 0
      );
      generatedSubject = fallback.subject;
      generatedHtml = fallback.htmlContent;
      generatedPlainText = fallback.plainText;
    }

    // Save draft in user's workspace
    const draft = saveEmailDraft(user.userId, typedLead.id, {
      subject: generatedSubject,
      htmlContent: generatedHtml,
      plainText: generatedPlainText,
      category: resolvedCategory,
    });

    addLeadActivityLog(
      user.userId,
      typedLead.id,
      'email_draft_created',
      isRegenerate
        ? `Regenerated AI email draft for "${resolvedCategory}" (Variation ${variationIndex + 1})`
        : `Generated AI email draft for "${resolvedCategory}"`,
      {
        subject: generatedSubject,
        usedUserGeminiKey: usedAiModel,
      }
    );

    return NextResponse.json({
      success: true,
      draftId: draft.id,
      subject: generatedSubject,
      htmlContent: generatedHtml,
      plainText: generatedPlainText,
      category: resolvedCategory,
      usedAiModel,
      hasUserApiKey: Boolean(userKey),
      message: userKey
        ? 'AI Pitch generated live via your connected Google Gemini API key.'
        : 'Generated tailored pitch using built-in project engine. Connect your personal Gemini API key in Integrations for custom live model generations.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error drafting email' },
      { status: 500 }
    );
  }
}
