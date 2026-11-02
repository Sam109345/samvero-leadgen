/**
 * SAMVERO Enterprise Email Discovery & Verification Engine (CommonJS Bridge)
 */
const dns = require('dns');

async function resolveDomainMx(domain) {
  const dnsPromises = dns.promises || dns;
  return await dnsPromises.resolveMx(domain);
}

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

async function verifyEmailAddress(emailInput) {
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

  try {
    const records = await resolveDomainMx(domain);

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
  } catch (err) {
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

module.exports = {
  verifyEmailAddress,
};
