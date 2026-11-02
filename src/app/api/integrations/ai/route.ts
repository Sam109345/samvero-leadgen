import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserAiSettings,
  saveUserAiSettings,
  removeUserAiSettings,
  getUserGeminiApiKey,
  updateUserAiStatus,
} from '@/lib/lead-workspace-store';
import { callUserGeminiApi } from '@/lib/pitch-generator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const settings = getUserAiSettings(user.userId);

    return NextResponse.json({
      success: true,
      userId: user.userId,
      isConfigured: settings.isConfigured,
      status: settings.status,
      model: settings.model,
      lastTestedAt: settings.lastTestedAt,
      updatedAt: settings.updatedAt,
      // Strictly NEVER return the raw or decrypted API key to frontend
      maskedKey: settings.isConfigured ? '••••••••••••••••••••••••' : null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json();
    const { apiKey, model = 'gemini-1.5-flash', testNow = true } = body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
      return NextResponse.json(
        { success: false, error: 'A valid Google Gemini API key is required.' },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey.trim();

    // Live validation test if requested
    if (testNow) {
      const testResult = await callUserGeminiApi(
        trimmedKey,
        'Respond with: "OK"',
        'You are an API connection test validator.',
        model
      );

      if (!testResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: `Gemini API Key validation failed: ${testResult.error}. Please verify your key in Google AI Studio.`,
            status: 'invalid',
          },
          { status: 400 }
        );
      }
    }

    saveUserAiSettings(user.userId, trimmedKey, model);

    return NextResponse.json({
      success: true,
      message: 'Gemini API key successfully encrypted and connected to your account.',
      status: 'active',
      isConfigured: true,
      model,
      maskedKey: '••••••••••••••••••••••••',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    removeUserAiSettings(user.userId);

    return NextResponse.json({
      success: true,
      message: 'Gemini API key removed from your workspace.',
      status: 'not_configured',
      isConfigured: false,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
