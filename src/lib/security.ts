/**
 * SAMVERO Enterprise Security & SSRF Protection Engine
 * 
 * Protects website deep crawlers and enrichment functions against:
 * - Server-Side Request Forgery (SSRF)
 * - Private / Loopback IP extraction
 * - Cloud metadata endpoint exploitation (AWS/GCP/Azure)
 * - Dangerous schemes and malformed URLs
 */

import { URL } from 'url';

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

/**
 * Validate that a URL is safe for server-side HTTP fetching
 */
export function isSafePublicUrl(inputUrl: string): { safe: boolean; reason?: string; normalizedUrl?: string } {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { safe: false, reason: 'URL is required and must be a string' };
  }

  const trimmed = inputUrl.trim();

  // Explicitly check for non-http/https URI schemes (e.g. ftp://, file://, gopher://, javascript:, ws://)
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

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return { safe: false, reason: 'Malformed URL format' };
  }

  // Only allowed schemes
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { safe: false, reason: `Forbidden URL scheme: ${parsed.protocol}` };
  }

  let hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

  // Check known blocked hostnames
  if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith('.localhost') || hostname.endsWith('.internal')) {
    return { safe: false, reason: `Target host "${hostname}" is restricted` };
  }

  // Check for private / link-local IP prefixes
  for (const prefix of BLOCKED_IP_PREFIXES) {
    if (hostname.startsWith(prefix)) {
      return { safe: false, reason: `Private IP access prohibited (${prefix}*)` };
    }
  }

  // Check IPv4 quad dotted notation & private ranges
  const parts = hostname.split('.');
  if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p))) {
    const octet1 = parseInt(parts[0], 10);
    const octet2 = parseInt(parts[1], 10);

    // 127.0.0.0/8 (Loopback)
    if (octet1 === 127) {
      return { safe: false, reason: 'Loopback IP address prohibited' };
    }
    // 10.0.0.0/8 (Class A Private)
    if (octet1 === 10) {
      return { safe: false, reason: 'Class A private network range prohibited' };
    }
    // 172.16.0.0 – 172.31.255.255 (Class B Private)
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
      return { safe: false, reason: 'Class B private network range prohibited' };
    }
    // 192.168.0.0/16 (Class C Private)
    if (octet1 === 192 && octet2 === 168) {
      return { safe: false, reason: 'Class C private network range prohibited' };
    }
    // 169.254.0.0/16 (Link Local & AWS/GCP Metadata)
    if (octet1 === 169 && octet2 === 254) {
      return { safe: false, reason: 'Link-local cloud metadata range prohibited' };
    }
    // 0.0.0.0/8
    if (octet1 === 0) {
      return { safe: false, reason: 'Zero address prohibited' };
    }
  }

  return { safe: true, normalizedUrl: parsed.toString() };
}

/**
 * Sanitize strings for safe HTML display and XSS prevention
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
