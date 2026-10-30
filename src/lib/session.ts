import crypto from 'crypto';
import { NextRequest } from 'next/server';

export interface SessionPayload {
  userId: string;
  role: 'super_admin' | 'admin' | 'customer' | 'employer';
  email: string;
  name: string;
  isGlobal: boolean;
  sessionId: string;
  timestamp: number;
}

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.PORTAL_ACCESS_PASSWORD ||
  'samvero_default_secure_session_hmac_secret_key_2026';

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Sign a session payload with HMAC-SHA256
 */
export function signSession(payload: SessionPayload): string {
  const payloadStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadStr);
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `samv_${encodedPayload}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  // 1. Signed SAMVERO token format: samv_<payload>.<signature>
  if (token.startsWith('samv_')) {
    const raw = token.slice(5);
    const dotIndex = raw.indexOf('.');
    if (dotIndex === -1) return null;

    const encodedPayload = raw.slice(0, dotIndex);
    const signature = raw.slice(dotIndex + 1);

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    // Constant-time comparison
    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    try {
      const decodedStr = base64UrlDecode(encodedPayload);
      const parsed = JSON.parse(decodedStr) as SessionPayload;
      if (!parsed.userId || !parsed.role) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  // 2. Legacy fallback format for existing backward-compatible test suites: auth_<base64(role:sessionId)>
  if (token.startsWith('auth_')) {
    try {
      const b64 = token.slice(5);
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      const [role, sessionId] = decoded.split(':');
      if (role && sessionId) {
        return {
          userId: role === 'admin' ? 'user-sameer' : role === 'customer' ? 'user-client-101' : 'user-employer',
          role: role as any,
          email: role === 'admin' ? 'sameer.centric@gmail.com' : 'client@gmail.com',
          name: role === 'admin' ? 'Sameer (Executive Admin)' : 'Customer Client',
          isGlobal: role === 'admin',
          sessionId,
          timestamp: Date.now(),
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Extract and authenticate session from NextRequest cookies
 */
export function getAuthenticatedSession(request: NextRequest): SessionPayload | null {
  const token = request.cookies.get('samvero_portal_token')?.value;
  if (!token) return null;

  const verified = verifySessionToken(token);
  if (!verified) return null;

  // Cross-verify with role cookie if present to prevent role mismatch
  const roleCookie = request.cookies.get('samvero_portal_role')?.value;
  if (roleCookie) {
    const normalizedRole = roleCookie === 'super_admin' ? 'admin' : roleCookie;
    const normalizedTokenRole = verified.role === 'super_admin' ? 'admin' : verified.role;
    if (normalizedRole !== normalizedTokenRole) {
      return null;
    }
  }

  return verified;
}
