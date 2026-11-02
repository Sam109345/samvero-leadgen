import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserGeminiApiKey,
  getUserAiSettings,
  updateUserAiStatus,
} from '@/lib/lead-workspace-store';
import { callUserGeminiApi } from '@/lib/pitch-generator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json().catch(() => ({}));
    const key = (body.apiKey && typeof body.apiKey === 'string' && body.apiKey.trim())
      ? body.apiKey.trim()
      : getUserGeminiApiKey(user.userId);

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          error: 'No Gemini API key provided or configured. Please enter your API key to test connection.',
          status: 'not_configured',
        },
        { status: 400 }
      );
    }

    const settings = getUserAiSettings(user.userId);
    const testResult = await callUserGeminiApi(
      key,
      'Test message: Verify active API key connection.',
      'Respond with a single sentence confirmation.',
      body.model || settings.model || 'gemini-1.5-flash'
    );

    if (testResult.success) {
      updateUserAiStatus(user.userId, 'active', true);
      return NextResponse.json({
        success: true,
        message: 'Google Gemini API key successfully verified and active!',
        status: 'active',
        responseSample: testResult.text,
        sampleOutput: testResult.text,
      });
    } else {
      updateUserAiStatus(user.userId, 'invalid', true);
      return NextResponse.json(
        {
          success: false,
          error: `API Key test failed: ${testResult.error}`,
          status: 'invalid',
        },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
