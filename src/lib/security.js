/**
 * SAMVERO Enterprise Security & SSRF Protection Engine (CommonJS bridge for test suites)
 */
const { URL } = require('url');

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  'instance-data',
]);

const BLOCKED_IP_PREFIXES = [
  '127.',      // Loopback
  '10.',       // Class A Private
  '192.168.',  // Class C Private
  '169.254.',  // Link-Local & AWS/GCP Metadata (169.254.169.254)
  'fc00:',     // IPv6 Unique Local
  'fe80:',     // IPv6 Link-Local
];

function isSafePublicUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { safe: false, reason: 'URL is required and must be a string' };
  }

  const trimmed = inputUrl.trim();

  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') {
      return { safe: false, reason: `Forbidden URL scheme: ${scheme}:` };
    }
  }

  let normalized = trimmed;
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    return { safe: false, reason: 'Malformed URL format' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { safe: false, reason: `Forbidden URL scheme: ${parsed.protocol}` };
  }

  let hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith('.localhost') || hostname.endsWith('.internal')) {
    return { safe: false, reason: `Target host "${hostname}" is restricted` };
  }

  for (const prefix of BLOCKED_IP_PREFIXES) {
    if (hostname.startsWith(prefix)) {
      return { safe: false, reason: `Private IP access prohibited (${prefix}*)` };
    }
  }

  const parts = hostname.split('.');
  if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p))) {
    const octet1 = parseInt(parts[0], 10);
    const octet2 = parseInt(parts[1], 10);

    if (octet1 === 127) {
      return { safe: false, reason: 'Loopback IP address prohibited' };
    }
    if (octet1 === 10) {
      return { safe: false, reason: 'Class A private network range prohibited' };
    }
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
      return { safe: false, reason: 'Class B private network range prohibited' };
    }
    if (octet1 === 192 && octet2 === 168) {
      return { safe: false, reason: 'Class C private network range prohibited' };
    }
    if (octet1 === 169 && octet2 === 254) {
      return { safe: false, reason: 'Link-local cloud metadata range prohibited' };
    }
    if (octet1 === 0) {
      return { safe: false, reason: 'Zero address prohibited' };
    }
  }

  return { safe: true, normalizedUrl: parsed.toString() };
}

function sanitizeText(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  isSafePublicUrl,
  sanitizeText,
};
