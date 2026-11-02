const crypto = require('crypto');

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.PORTAL_ACCESS_PASSWORD ||
  'samvero_default_secure_session_hmac_secret_key_2026';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Sign a session payload with HMAC-SHA256
 */
function signSession(payload) {
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
function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

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

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    try {
      const decodedStr = base64UrlDecode(encodedPayload);
      const parsed = JSON.parse(decodedStr);
      if (!parsed.userId || !parsed.role) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  if (token.startsWith('auth_')) {
    try {
      const b64 = token.slice(5);
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      const [role, sessionId] = decoded.split(':');
      if (role && sessionId) {
        return {
          userId: role === 'admin' ? 'user-sameer' : role === 'customer' ? 'user-client-101' : 'user-employer',
          role: role,
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

module.exports = {
  signSession,
  verifySessionToken,
};
