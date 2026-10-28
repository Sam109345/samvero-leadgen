/**
 * SAMVERO International Phone & WhatsApp Sanitization Utility
 * 
 * Ensures pure digits only for WhatsApp (wa.me/<digits>) URLs without '+' sign
 * and with normalized international country dial codes, preventing the WhatsApp Web error:
 * "Phone number shared via url is invalid".
 */

export function cleanWhatsAppDigits(phone?: string, country: string = ''): string {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';

  // Strip international IDD prefix (00) e.g. 0092... -> 92...
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  const c = country.toLowerCase();

  // If number starts with trunk zero (e.g. 03... in PK, 05... in UAE, 07... in UK)
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

  // If US number is 10 digits without country code (e.g. 5128924410), prepend 1
  if ((c.includes('us') || c.includes('united states')) && digits.length === 10) {
    digits = '1' + digits;
  }

  return digits;
}

/**
 * Construct valid WhatsApp URL (wa.me) with pure numeric digits and optional message
 */
export function formatWhatsAppUrl(phone?: string, text: string = '', country: string = ''): string {
  const digits = cleanWhatsAppDigits(phone, country);
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
