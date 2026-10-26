/**
 * SAMVERO – Google Gemini AI Integration Engine
 * Free-tier AI generator powered by Google Gemini 1.5 Flash
 * Generates tailored website copy, 14-screen mobile app specs, and 6 vector logo concepts.
 */

export interface GeminiGenerationOptions {
  businessName: string;
  category: string;
  city: string;
  country: string;
  businessAgeLabel?: string;
  budget?: string;
}

export async function callGeminiApi(prompt: string, fallbackText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackText;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API returned error status:', response.status);
      return fallbackText;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || fallbackText;
  } catch (err: any) {
    console.warn('Gemini API call failed, using intelligent built-in generator:', err?.message);
    return fallbackText;
  }
}

/**
 * Enhance client website copy using Gemini AI
 */
export async function generateGeminiWebsiteCopy(opts: GeminiGenerationOptions): Promise<{
  heroHeadline: string;
  heroSubheadline: string;
  tagline: string;
  aboutText: string;
}> {
  const prompt = `You are a world-class luxury brand copywriter. Write high-converting marketing copy for:
Business Name: ${opts.businessName}
Category: ${opts.category}
Location: ${opts.city}, ${opts.country}
Business Age: ${opts.businessAgeLabel || 'Established'}

Return a JSON object with:
1. heroHeadline (catchy, powerful 6-10 words)
2. heroSubheadline (persuasive, high-trust 15-25 words)
3. tagline (memorable luxury punchline 4-7 words)
4. aboutText (engaging 2-sentence brand heritage story)
JSON format only.`;

  const fallback = {
    heroHeadline: `World-Class ${opts.category} Precision Crafted for Discerning Clients`,
    heroSubheadline: `Experience unparalleled excellence at ${opts.businessName}. We combine clinical precision with bespoke service in ${opts.city}.`,
    tagline: `Uncompromising Standards. Exceptional Outcomes.`,
    aboutText: `Founded with a dedication to timeless quality in ${opts.city}, ${opts.businessName} has established an unmatched benchmark for client satisfaction and technological excellence.`
  };

  try {
    const rawResult = await callGeminiApi(prompt, JSON.stringify(fallback));
    const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        heroHeadline: parsed.heroHeadline || fallback.heroHeadline,
        heroSubheadline: parsed.heroSubheadline || fallback.heroSubheadline,
        tagline: parsed.tagline || fallback.tagline,
        aboutText: parsed.aboutText || fallback.aboutText,
      };
    }
  } catch (e) {
    // Return fallback on any parse issue
  }

  return fallback;
}
