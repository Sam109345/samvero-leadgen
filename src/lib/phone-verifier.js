/**
 * SAMVERO Enterprise Phone Validation & International Normalization Engine (CommonJS Bridge)
 */
const { cleanWhatsAppDigits } = require('./phone-utils');

const COUNTRY_DIAL_PATTERNS = [
  { code: 'AE', name: 'United Arab Emirates', minDigits: 8, maxDigits: 9, prefix: '971' },
  { code: 'PK', name: 'Pakistan', minDigits: 10, maxDigits: 11, prefix: '92' },
  { code: 'GB', name: 'United Kingdom', minDigits: 10, maxDigits: 11, prefix: '44' },
  { code: 'US', name: 'United States', minDigits: 10, maxDigits: 10, prefix: '1' },
  { code: 'CA', name: 'Canada', minDigits: 10, maxDigits: 10, prefix: '1' },
  { code: 'FR', name: 'France', minDigits: 9, maxDigits: 9, prefix: '33' },
  { code: 'DE', name: 'Germany', minDigits: 10, maxDigits: 11, prefix: '49' },
  { code: 'AU', name: 'Australia', minDigits: 9, maxDigits: 9, prefix: '61' },
  { code: 'SA', name: 'Saudi Arabia', minDigits: 9, maxDigits: 9, prefix: '966' },
];

function verifyPhoneNumber(phoneInput, hintCountry = '') {
  const original = (phoneInput || '').trim();
  const checkedAt = new Date().toISOString();

  if (!original) {
    return {
      original: '',
      normalized: '',
      normalizedE164: '',
      countryCode: '',
      countryName: '',
      status: 'INVALID',
      isValid: false,
      isValidLength: false,
      whatsappDigits: '',
      cleanWhatsAppDigits: '',
      checkedAt,
      reason: 'Empty phone number',
    };
  }

  const rawDigits = original.replace(/[^0-9]/g, '');
  if (rawDigits.length < 7 || rawDigits.length > 15) {
    return {
      original,
      normalized: original,
      normalizedE164: original,
      countryCode: '',
      countryName: '',
      status: 'INVALID',
      isValid: false,
      isValidLength: false,
      whatsappDigits: '',
      cleanWhatsAppDigits: '',
      checkedAt,
      reason: `Invalid digit length (${rawDigits.length} digits; ITU E.164 requires 7-15 digits)`,
    };
  }

  const whatsappDigits = cleanWhatsAppDigits(original, hintCountry);

  let matchedCountry = COUNTRY_DIAL_PATTERNS.find((c) => whatsappDigits.startsWith(c.prefix));

  if (!matchedCountry && hintCountry) {
    const lower = hintCountry.toLowerCase();
    matchedCountry = COUNTRY_DIAL_PATTERNS.find(
      (c) => c.name.toLowerCase().includes(lower) || c.code.toLowerCase() === lower
    );
  }

  const normalized = `+${whatsappDigits}`;

  if (matchedCountry) {
    const subscriberDigits = whatsappDigits.slice(matchedCountry.prefix.length);
    const validLen =
      subscriberDigits.length >= matchedCountry.minDigits &&
      subscriberDigits.length <= matchedCountry.maxDigits;

    return {
      original,
      normalized,
      normalizedE164: normalized,
      countryCode: matchedCountry.code,
      countryName: matchedCountry.name,
      status: validLen ? 'VALID_FORMAT' : 'UNVERIFIED',
      isValid: validLen,
      isValidLength: validLen,
      whatsappDigits,
      cleanWhatsAppDigits: whatsappDigits,
      checkedAt,
      reason: validLen
        ? `Valid ITU E.164 international format for ${matchedCountry.name} (+${matchedCountry.prefix})`
        : `Digit count mismatch for ${matchedCountry.name} subscriber line`,
    };
  }

  return {
    original,
    normalized,
    normalizedE164: normalized,
    countryCode: 'INTL',
    countryName: hintCountry || 'International',
    status: 'VALID_FORMAT',
    isValid: true,
    isValidLength: true,
    whatsappDigits,
    cleanWhatsAppDigits: whatsappDigits,
    checkedAt,
    reason: 'Valid international dialing pattern recognized',
  };
}

function formatWhatsAppLink(phoneInput, message = '', hintCountry = '') {
  const digits = cleanWhatsAppDigits(phoneInput, hintCountry);
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

module.exports = {
  verifyPhoneNumber,
  formatWhatsAppLink,
};
