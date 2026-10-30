/**
 * SAMVERO Enterprise Email Discovery & Verification Engine
 * 
 * Verifies email deliverability using:
 * 1. Strict RFC 5322 Syntax Regex
 * 2. Disposable Email Domain Detection
 * 3. Live DNS MX Exchanger Record Resolution
 * 4. RFC 7505 Null MX Detection (domains explicitly rejecting incoming mail)
 */

import { EmailVerificationStatus, EmailVerificationResult } from '@/types';

async function resolveDomainMx(domain: string): Promise<Array<{ exchange: string; priority: number }>> {
  if (typeof window !== 'undefined') {
    // If called from browser environment, call API route
    try {
      const res = await fetch('/api/verify/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `verify@${domain}` }),
      });
      const data = await res.json();
      return data.result?.mxRecords || [];
    } catch {
      return [];
    }
  }

  // Server-side Node.js environment
  const dns = require('dns');
  const dnsPromises = dns.promises || dns;
  return await dnsPromises.resolveMx(domain);
}

// Known disposable and temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'sharklasers.com',
  '10minutemail.com',
  '10minutemail.net',
  'throwawaymail.com',
  'dispostable.com',
  'yopmail.com',
  'trashmail.com',
  'trashmail.net',
  'getairmail.com',
  'fakemailgenerator.com',
  'mohmal.com',
  'fakeinbox.com',
  'burnermail.io',
  'maildrop.cc',
  'inboxkitten.com',
  'crazymailing.com',
  'mytemp.email',
  'nada.ltd',
  'getnada.com',
  'emailondeck.com',
]);

const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export type { EmailVerificationResult };

/**
 * Deep Verification of an Email Address
 */
export async function verifyEmailAddress(emailInput: string): Promise<EmailVerificationResult> {
  const email = (emailInput || '').trim().toLowerCase();
  const checkedAt = new Date().toISOString();

  if (!email) {
    return {
      email: '',
      domain: '',
      status: 'INVALID',
      isValidSyntax: false,
      isDisposable: false,
      hasActiveMx: false,
      mxRecords: [],
      checkedAt,
      reason: 'Empty email address',
    };
  }

  // 1. Syntax check
  if (!RFC5322_EMAIL_REGEX.test(email)) {
    return {
      email,
      domain: email.split('@')[1] || '',
      status: 'INVALID',
      isValidSyntax: false,
      isDisposable: false,
      hasActiveMx: false,
      mxRecords: [],
      checkedAt,
      reason: 'Failed RFC 5322 syntax validation',
    };
  }

  const parts = email.split('@');
  const domain = parts[1];

  // 2. Disposable check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      email,
      domain,
      status: 'DISPOSABLE',
      isValidSyntax: true,
      isDisposable: true,
      hasActiveMx: false,
      mxRecords: [],
      checkedAt,
      reason: 'Identified as disposable / temporary email provider',
    };
  }

  // 3. DNS MX Resolution
  try {
    const records = await resolveDomainMx(domain);

    // Check for explicit RFC 7505 Null MX (host "." or empty indicating domain rejects all mail)
    const hasNullMx = records.some((r) => !r.exchange || r.exchange.trim() === '.' || r.exchange.trim() === '');
    if (hasNullMx) {
      return {
        email,
        domain,
        status: 'INVALID',
        isValidSyntax: true,
        isDisposable: false,
        hasActiveMx: false,
        mxRecords: records,
        checkedAt,
        reason: 'Domain has Null MX record (RFC 7505: explicitly rejects all mail)',
      };
    }

    const validRecords = records.filter(
      (r) => r.exchange && r.exchange.trim().length > 0 && r.exchange.trim() !== '.'
    );

    if (validRecords.length === 0) {
      return {
        email,
        domain,
        status: 'INVALID',
        isValidSyntax: true,
        isDisposable: false,
        hasActiveMx: false,
        mxRecords: [],
        checkedAt,
        reason: 'Domain has no active MX records configured',
      };
    }

    return {
      email,
      domain,
      status: 'VERIFIED',
      isValidSyntax: true,
      isDisposable: false,
      hasActiveMx: true,
      mxRecords: validRecords.sort((a, b) => a.priority - b.priority),
      checkedAt,
      reason: `Active DNS MX host confirmed: ${validRecords[0].exchange} (priority ${validRecords[0].priority})`,
    };
  } catch (err: any) {
    const code = err.code || 'UNKNOWN';

    if (code === 'ENOTFOUND' || code === 'ENODATA') {
      return {
        email,
        domain,
        status: 'INVALID',
        isValidSyntax: true,
        isDisposable: false,
        hasActiveMx: false,
        mxRecords: [],
        checkedAt,
        reason: `Domain does not exist or has zero MX records (${code})`,
      };
    }

    // DNS Timeout / network error
    return {
      email,
      domain,
      status: 'UNVERIFIED',
      isValidSyntax: true,
      isDisposable: false,
      hasActiveMx: false,
      mxRecords: [],
      checkedAt,
      reason: `DNS verification timed out or DNS server unreachable (${code})`,
    };
  }
}
