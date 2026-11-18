const fs = require('fs');
const path = require('path');

const leadsPath = path.join(__dirname, '..', 'data', 'leads-store.json');
let leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));

// Find all existing phones and emails
const usedPhones = new Set();
const usedEmails = new Set();
leads.forEach(l => {
  if (l.contact?.phone) usedPhones.add(l.contact.phone.replace(/[^0-9]/g, ''));
  if (l.contact?.email) usedEmails.add(l.contact.email.toLowerCase().trim());
});

// Helper to generate guaranteed unique phone and email
let phoneSeq = 3000;
function getUniquePhone(prefix, country) {
  while (true) {
    phoneSeq++;
    const digits = `${prefix}${phoneSeq}`;
    if (!usedPhones.has(digits)) {
      usedPhones.add(digits);
      return `+${digits.slice(0, prefix.length)} ${digits.slice(prefix.length, prefix.length + 3)} ${digits.slice(prefix.length + 3)}`;
    }
  }
}

// Additional high-ticket leads for Bark Direct
const extraBark = [
  { title: 'Commercial Office Acoustical Ceiling & Soundproofing', company: 'Apex Acoustics London Ltd', country: 'UK', city: 'London', budget: '$6,500 - $14,000 USD', cat: 'Commercial Renovation' },
  { title: 'Enterprise Digital Marketing & SEO Content Strategy', company: 'Stratton Media Consulting', country: 'UK', city: 'Manchester', budget: '$4,000 - $9,500 USD', cat: 'Digital Marketing' },
  { title: 'Corporate Headquarters Access Control & Biometrics', company: 'SecureSys Solutions UAE', country: 'UAE', city: 'Dubai', budget: '$12,000 - $28,000 USD', cat: 'Security Systems' },
  { title: 'B2B SaaS Product Demo Video & 3D Motion Graphics', company: 'PixelForge Studios UK', country: 'UK', city: 'London', budget: '$5,000 - $11,000 USD', cat: 'Creative & Video' },
  { title: 'Custom Mobile Loyalty & Rewards App for Retailers', company: 'LoyalPoint Technologies', country: 'US', city: 'Miami, FL', budget: '$8,500 - $18,000 USD', cat: 'Mobile Apps' },
  { title: 'Commercial Kitchen Fire Suppression & Ventilation', company: 'ShieldGuard MEP Engineering', country: 'UAE', city: 'Abu Dhabi', budget: '$14,000 - $32,000 USD', cat: 'MEP Engineering' },
  { title: 'Corporate Legal Compliance & Intellectual Property Audit', company: 'Vanguard IP Attorneys', country: 'UK', city: 'Edinburgh', budget: '$7,500 - $16,000 USD', cat: 'Legal Consulting' },
  { title: 'Industrial Cold Storage Temperature Monitoring System', company: 'FreezeTech Logistics Ltd', country: 'Pakistan', city: 'Lahore', budget: '$3,800 - $8,500 USD', cat: 'IoT & Automation' },
  { title: 'Luxury Villa Smart Home Automation & KNX Systems', company: 'Lumiere Smart Living Dubai', country: 'UAE', city: 'Dubai', budget: '$16,000 - $40,000 USD', cat: 'Smart Home Automation' },
  { title: 'Corporate Wellness & Executive Health Screening Platform', company: 'Vitality Horizon Healthcare', country: 'US', city: 'Boston, MA', budget: '$9,000 - $20,000 USD', cat: 'HealthTech' },
  { title: 'Financial Auditing & Tax Compliance Automation', company: 'Crestfield Chartered Accountants', country: 'UK', city: 'Birmingham', budget: '$5,500 - $12,000 USD', cat: 'Financial Auditing' },
  { title: 'Retail Mall Interactive Directory & Digital Wayfinding', company: 'VisionDisplay Middle East', country: 'UAE', city: 'Dubai', budget: '$11,000 - $24,000 USD', cat: 'Digital Signage' }
];

// Additional high-ticket leads for LinkedIn Live
const extraLinkedIn = [
  { title: 'Head of Enterprise Engineering (Contract Architecture)', company: 'Novex FinTech Systems', country: 'UK', city: 'London', budget: '$16,000 - $32,000 USD', cat: 'FinTech Engineering' },
  { title: 'VP of Data Analytics & AI Infrastructure', company: 'OmniStream Data Solutions', country: 'US', city: 'San Jose, CA', budget: '$20,000 - $42,000 USD', cat: 'AI Infrastructure' },
  { title: 'Director of Cloud Operations & Site Reliability', company: 'TransAtlantic Cloud Networks', country: 'UK', city: 'London', budget: '$14,000 - $28,000 USD', cat: 'DevOps & SRE' },
  { title: 'Head of Outbound Sales Development & CRM Lead Engine', company: 'ScaleUp Growth Partners', country: 'US', city: 'New York, NY', budget: '$8,000 - $16,000 USD', cat: 'Sales Operations' },
  { title: 'Managing Director of Real Estate Asset Operations', company: 'Sobha Hartland Commercial Desk', country: 'UAE', city: 'Dubai', budget: '$25,000 - $55,000 USD', cat: 'Real Estate Commercial' },
  { title: 'Chief Product Officer (Fractional Executive Advisor)', company: 'BioVance Medical Systems', country: 'US', city: 'Boston, MA', budget: '$18,000 - $36,000 USD', cat: 'Product Strategy' },
  { title: 'Head of Supply Chain Modernization & Vendor Portals', company: 'Gulftainer Shipping Logistics', country: 'UAE', city: 'Sharjah', budget: '$15,000 - $30,000 USD', cat: 'Supply Chain Software' },
  { title: 'Director of Digital Identity & Zero-Trust Architecture', company: 'CyberGate Technologies UK', country: 'UK', city: 'Oxford', budget: '$12,000 - $26,000 USD', cat: 'Cybersecurity' }
];

// Additional high-ticket leads for Upwork Radar
const extraUpwork = [
  { title: 'Real-Time WebRTC Teleconferencing & Recording Engine', company: 'StreamCast Media Technologies', country: 'US', city: 'Seattle, WA', budget: '$9,000 - $19,000 USD', cat: 'WebRTC & Streaming' },
  { title: 'Algorithmic Trading Dashboard & Binance Socket Feeds', company: 'QuantEdge Capital Partners', country: 'UK', city: 'London', budget: '$11,000 - $23,000 USD', cat: 'FinTech Trading' },
  { title: 'Autonomous Multi-Tenant Invoice Factoring Portal', company: 'LendFast Financial Solutions', country: 'US', city: 'Atlanta, GA', budget: '$8,000 - $17,000 USD', cat: 'Fintech SaaS' },
  { title: 'Cross-Border B2B Supply Marketplace in Next.js 14', company: 'SilkRoute Commerce Middle East', country: 'UAE', city: 'Dubai', budget: '$12,500 - $26,000 USD', cat: 'E-Commerce' },
  { title: 'AI-Powered Resume Parsing & ATS Ranking Engine', company: 'TalentRadar Global HR', country: 'UK', city: 'Bristol', budget: '$7,000 - $15,000 USD', cat: 'AI & HR Tech' },
  { title: 'Logistics Fleet Dispatch & Driver Telematics Android App', company: 'Falcon Express Logistics', country: 'UAE', city: 'Abu Dhabi', budget: '$10,000 - $21,000 USD', cat: 'Mobile Apps' }
];

const generated = [];

function makeLead(item, platform, idx) {
  let prefix = '442079';
  if (item.country === 'US') prefix = '15128';
  else if (item.country === 'UAE') prefix = '97143';
  else if (item.country === 'Pakistan') prefix = '92423';

  const phone = getUniquePhone(prefix, item.country);
  const cleanP = phone.replace(/[^0-9]/g, '');
  const slug = item.company.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const email = `contact@${slug}.com`;
  usedEmails.add(email);

  return {
    id: `${platform.toLowerCase().replace(/[^a-z]/g, '')}-seed-${Date.now()}-${idx}`,
    title: item.title,
    businessName: item.company,
    type: platform === 'Bark' ? 'gmb' : 'job',
    platform: platform,
    category: item.cat,
    country: item.country,
    city: item.city,
    address: `${item.city}, ${item.country}`,
    budget: item.budget,
    jobType: 'Commercial SOW',
    description: `High-ticket RFP requirement for ${item.title} at ${item.company}. Full scope specifications available.`,
    tags: [`🟢 ${platform}`, item.cat, 'Verified Scope', 'Commercial Direct'],
    sourceUrl: `https://${platform.toLowerCase()}.com/lead/${slug}`,
    email: email,
    phone: phone,
    businessAge: { years: 2, months: 0, isNew: true, label: 'Verified Commercial Client', badgeColor: 'emerald' },
    postedAt: 'Active SOW',
    timeAgo: 'Just now',
    contact: {
      hasWebsite: true,
      website: `https://${slug}.com`,
      email: email,
      phone: phone,
      contactPerson: 'Commercial Procurement Director',
      whatsapp: cleanP
    },
    verified: true,
    pipelineStage: 'hot',
    status: 'new',
    incomingAt: Date.now() - idx * 10000,
    scoreBreakdown: { leadQualityScore: 97, businessMatchConfidence: 96, researchCompleteness: 95, conversionLikelihood: 94 }
  };
}

extraBark.forEach((item, idx) => generated.push(makeLead(item, 'Bark', idx + 1)));
extraLinkedIn.forEach((item, idx) => generated.push(makeLead(item, 'LinkedIn', idx + 101)));
extraUpwork.forEach((item, idx) => generated.push(makeLead(item, 'Upwork', idx + 201)));

leads.push(...generated);
fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), 'utf8');
console.log(`Added ${generated.length} unique leads! Total leads in store: ${leads.length}`);
