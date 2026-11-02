/**
 * SAMVERO International Phone & WhatsApp Sanitization Utility (CommonJS Bridge)
 */

function cleanWhatsAppDigits(phone, country = '') {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  const c = (country || '').toLowerCase();

  if (digits.startsWith('0')) {
    if (c.includes('pak') || digits.startsWith('03')) {
      digits = '92' + digits.slice(1);
    } else if (
      c.includes('uk') ||
      c.includes('britain') ||
      digits.startsWith('07') ||
      digits.startsWith('02') ||
      digits.startsWith('01')
    ) {
      digits = '44' + digits.slice(1);
    } else if (
      c.includes('uae') ||
      c.includes('dubai') ||
      digits.startsWith('05') ||
      digits.startsWith('04')
    ) {
      digits = '971' + digits.slice(1);
    } else if (c.includes('france') || digits.startsWith('01') || digits.startsWith('06')) {
      digits = '33' + digits.slice(1);
    } else if (c.includes('spain') || digits.startsWith('09')) {
      digits = '34' + digits.slice(1);
    }
  }

  if ((c.includes('us') || c.includes('united states')) && digits.length === 10) {
    digits = '1' + digits;
  }

  return digits;
}

function formatWhatsAppUrl(phone, text = '', country = '') {
  const digits = cleanWhatsAppDigits(phone, country);
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

module.exports = {
  cleanWhatsAppDigits,
  formatWhatsAppUrl,
};
