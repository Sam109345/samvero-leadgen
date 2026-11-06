/**
 * Robust Country & Location Normalization Utility
 * Handles multi-national ISO codes, multilingual spellings, and Pakistani city heuristics.
 */

export const PAKISTAN_CITIES = [
  'lahore',
  'karachi',
  'islamabad',
  'rawalpindi',
  'faisalabad',
  'peshawar',
  'multan',
  'sialkot',
  'gujranwala',
  'hyderabad',
  'quetta',
  'bahawalpur',
  'sargodha',
  'abbottabad',
  'sukkur',
  'gujrat',
  'sheikhupura',
  'jhelum',
  'sahiwal',
  'mardan',
  'kasur',
  'rahim yar khan',
  'لاہور',
  'کراچی',
  'اسلام آباد',
  'راولپنڈی',
  'فیصل آباد',
  'پشاور',
  'ملتان',
  'سیالکوٹ',
  'گوجرانوالہ',
  'کوئٹہ',
];

export const UAE_CITIES = [
  'dubai',
  'abu dhabi',
  'sharjah',
  'ajman',
  'ras al khaimah',
  'fujairah',
  'al ain',
  'umm al quwain',
];

export const US_MARKERS = [
  'united states',
  'usa',
  'us',
  'new york',
  'san francisco',
  'california',
  'texas',
  'austin',
  'florida',
  'chicago',
  'los angeles',
  'seattle',
  'boston',
  'atlanta',
  'denver',
];

export const UK_MARKERS = [
  'united kingdom',
  'uk',
  'gb',
  'great britain',
  'london',
  'manchester',
  'birmingham',
  'leeds',
  'glasgow',
  'edinburgh',
  'bristol',
  'liverpool',
];

/**
 * Normalizes any country name / code into a canonical string:
 * 'Pakistan' | 'UAE' | 'US' | 'UK' | raw
 */
export function normalizeCountryName(
  country?: string | null,
  city?: string | null,
  address?: string | null,
  phone?: string | null
): string {
  const c = (country || '').trim().toLowerCase();
  const ct = (city || '').trim().toLowerCase();
  const addr = (address || '').trim().toLowerCase();
  const p = (phone || '').replace(/\D/g, '');

  if (
    c === 'pakistan' ||
    c === 'pk' ||
    c === 'پاکستان' ||
    c.includes('pakistan') ||
    c.includes('پاکستان') ||
    addr.includes('پاکستان') ||
    p.startsWith('92') ||
    PAKISTAN_CITIES.some((cityItem) => ct.includes(cityItem) || addr.includes(cityItem))
  ) {
    return 'Pakistan';
  }

  if (
    c === 'uae' ||
    c === 'ae' ||
    c === 'الإمارات العربية المتحدة' ||
    c.includes('emirates') ||
    c.includes('uae') ||
    addr.includes('الإمارات') ||
    p.startsWith('971') ||
    UAE_CITIES.some((cityItem) => ct.includes(cityItem) || addr.includes(cityItem))
  ) {
    return 'UAE';
  }

  if (
    c === 'us' ||
    c === 'usa' ||
    c.includes('united states') ||
    US_MARKERS.some((marker) => ct.includes(marker) || addr.includes(marker))
  ) {
    return 'US';
  }

  if (
    c === 'uk' ||
    c === 'gb' ||
    c.includes('united kingdom') ||
    c.includes('great britain') ||
    p.startsWith('44') ||
    UK_MARKERS.some((marker) => ct.includes(marker) || addr.includes(marker))
  ) {
    return 'UK';
  }

  return country?.trim() || 'Global';
}

/**
 * Checks whether a lead matches a requested target country filter.
 * Handles 'all', 'Global', casing, ISO-2 codes ('PK' vs 'Pakistan'), and city matches.
 */
export function matchesCountry(
  leadCountry?: string | null,
  leadCity?: string | null,
  leadAddress?: string | null,
  targetCountry?: string | null,
  leadPhone?: string | null
): boolean {
  if (!targetCountry || targetCountry === 'all' || targetCountry.toLowerCase() === 'global') {
    return true;
  }

  const tc = targetCountry.trim().toLowerCase();
  const lc = (leadCountry || '').trim().toLowerCase();
  const lCity = (leadCity || '').trim().toLowerCase();
  const lAddr = (leadAddress || '').trim().toLowerCase();
  const lPhone = (leadPhone || '').replace(/\D/g, '');

  if (tc === 'pakistan' || tc === 'pk' || tc === 'پاکستان') {
    return (
      lc === 'pakistan' ||
      lc === 'pk' ||
      lc === 'پاکستان' ||
      lc.includes('pakistan') ||
      lc.includes('پاکستان') ||
      lAddr.includes('پاکستان') ||
      lPhone.startsWith('92') ||
      PAKISTAN_CITIES.some((c) => lCity.includes(c) || lAddr.includes(c))
    );
  }

  if (tc === 'uae' || tc === 'ae' || tc === 'الإمارات العربية المتحدة' || tc.includes('emirates')) {
    return (
      lc === 'uae' ||
      lc === 'ae' ||
      lc === 'الإمارات العربية المتحدة' ||
      lc.includes('emirates') ||
      lc.includes('uae') ||
      lAddr.includes('الإمارات') ||
      lPhone.startsWith('971') ||
      UAE_CITIES.some((c) => lCity.includes(c) || lAddr.includes(c))
    );
  }

  if (tc === 'us' || tc === 'usa' || tc.includes('united states')) {
    return (
      lc === 'us' ||
      lc === 'usa' ||
      lc.includes('united states') ||
      US_MARKERS.some((c) => lCity.includes(c) || lAddr.includes(c))
    );
  }

  if (tc === 'uk' || tc === 'gb' || tc.includes('united kingdom')) {
    return (
      lc === 'uk' ||
      lc === 'gb' ||
      lc.includes('united kingdom') ||
      lc.includes('great britain') ||
      lPhone.startsWith('44') ||
      UK_MARKERS.some((c) => lCity.includes(c) || lAddr.includes(c))
    );
  }

  return lc === tc || lc.includes(tc);
}
