const fs = require('fs');

function cleanWhatsAppDigits(phone, country = '') {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';

  // If starts with 00 (e.g. 0092... or 0044...), strip 00
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  // Country specific trunk prefix handling
  const c = (country || '').toLowerCase();
  if (digits.startsWith('0')) {
    if (c.includes('pak') || digits.startsWith('03')) {
      digits = '92' + digits.slice(1);
    } else if (c.includes('uk') || c.includes('britain') || digits.startsWith('07') || digits.startsWith('02') || digits.startsWith('01')) {
      digits = '44' + digits.slice(1);
    } else if (c.includes('uae') || c.includes('dubai') || digits.startsWith('05') || digits.startsWith('04')) {
      digits = '971' + digits.slice(1);
    } else if (c.includes('france') || digits.startsWith('01') || digits.startsWith('06')) {
      digits = '33' + digits.slice(1);
    } else if (c.includes('spain') || digits.startsWith('09')) {
      digits = '34' + digits.slice(1);
    }
  }

  // If standard US 10-digit number (e.g. 5128924410), prepend 1
  if ((c.includes('us') || c.includes('united states')) && digits.length === 10) {
    digits = '1' + digits;
  }

  return digits;
}

function getWhatsAppUrl(phone, whatsapp, text = '', country = '') {
  const digits = cleanWhatsAppDigits(whatsapp || phone, country);
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// 1. Static Unit Test Cases
const cases = [
  { p: '+92 321 4455890', c: 'Pakistan', expected: '923214455890' },
  { p: '0300 8291044', c: 'Pakistan', expected: '923008291044' },
  { p: '+1 (512) 892-4410', c: 'US', expected: '15128924410' },
  { p: '(512) 892-4410', c: 'US', expected: '15128924410' },
  { p: '+44 20 7946 0912', c: 'UK', expected: '442079460912' },
  { p: '020 7946 0912', c: 'UK', expected: '442079460912' },
  { p: '+971 4 344 8920', c: 'UAE', expected: '97143448920' },
  { p: '050 789 2210', c: 'UAE', expected: '971507892210' },
  { p: '+33 1 89 02 44 11', c: 'Global', expected: '33189024411' },
  { p: '+34 91 890 2233', c: 'Global', expected: '34918902233' }
];

let failed = 0;
cases.forEach(({ p, c, expected }) => {
  const res = cleanWhatsAppDigits(p, c);
  if (res !== expected) {
    console.error(`FAILED: ${p} (${c}) -> got ${res}, expected ${expected}`);
    failed++;
  } else {
    console.log(`PASSED: ${p} (${c}) -> ${res}`);
  }
});

console.log(`\nUnit Tests: ${cases.length - failed} / ${cases.length} passed.`);

// 2. Audit all 68 leads in mock-data.ts
const content = fs.readFileSync('./src/lib/mock-data.ts', 'utf8');
const leadBlocks = content.split(/\{\s*id:\s*['"]/g).slice(1);
console.log(`\nAuditing phone & WhatsApp numbers across all ${leadBlocks.length} leads in mock-data.ts...`);

let leadFailures = 0;
leadBlocks.forEach((block, idx) => {
  const idMatch = block.match(/^([^'"]+)/);
  const phoneMatch = block.match(/phone:\s*['"]([^'"]+)['"]/);
  const waMatch = block.match(/whatsapp:\s*['"]([^'"]+)['"]/);
  const countryMatch = block.match(/country:\s*['"]([^'"]+)['"]/);

  const id = idMatch ? idMatch[1] : `lead-${idx}`;
  const phone = phoneMatch ? phoneMatch[1] : '';
  const wa = waMatch ? waMatch[1] : '';
  const country = countryMatch ? countryMatch[1] : '';

  if (!phone || phone.length < 8) {
    console.error(`❌ Lead ${id}: invalid phone: "${phone}"`);
    leadFailures++;
    return;
  }

  // Raw stored whatsapp field must NOT contain '+' and must be purely numeric
  if (!wa || wa.includes('+') || !/^[0-9]{10,15}$/.test(wa)) {
    console.error(`❌ Lead ${id}: raw whatsapp field "${wa}" contains '+' or is not pure digits (10-15 digits)!`);
    leadFailures++;
    return;
  }

  const cleanDigits = cleanWhatsAppDigits(wa || phone, country);
  if (!cleanDigits || cleanDigits.includes('+') || cleanDigits.length < 10) {
    console.error(`❌ Lead ${id}: cleanWhatsAppDigits produced invalid digits: "${cleanDigits}"`);
    leadFailures++;
    return;
  }

  const waUrl = getWhatsAppUrl(phone, wa, '', country);
  if (!waUrl.startsWith('https://wa.me/') || waUrl.includes('+')) {
    console.error(`❌ Lead ${id}: invalid WhatsApp URL: "${waUrl}"`);
    leadFailures++;
    return;
  }
});

// 3. Audit all streaming templates in lead-stream.ts
const streamContent = fs.readFileSync('./src/lib/lead-stream.ts', 'utf8');
const streamWaMatches = [...streamContent.matchAll(/whatsapp:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log(`Auditing ${streamWaMatches.length} streaming templates in lead-stream.ts...`);
streamWaMatches.forEach((wa, idx) => {
  if (wa.includes('+') || !/^[0-9]{10,15}$/.test(wa)) {
    console.error(`❌ Streaming template ${idx + 1}: raw whatsapp "${wa}" contains '+' or is not pure digits!`);
    leadFailures++;
  }
});

if (leadFailures === 0) {
  console.log(`✅ ALL ${leadBlocks.length} LEADS and all ${streamWaMatches.length} STREAM TEMPLATES have strictly pure-digit WhatsApp numbers without '+' signs!`);
} else {
  console.error(`❌ ${leadFailures} leads failed phone/WhatsApp validation.`);
  process.exit(1);
}
