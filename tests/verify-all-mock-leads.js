const fs = require('fs');

const mockContent = fs.readFileSync('src/lib/mock-data.ts', 'utf8');

// Simple regex parser to extract leads from rawLeads
const leadRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?businessName:\s*'([^']+)'[\s\S]*?country:\s*'([^']+)'[\s\S]*?contact:\s*\{([\s\S]*?)\}/g;

let match;
let count = 0;
const leads = [];

while ((match = leadRegex.exec(mockContent)) !== null) {
  count++;
  const id = match[1];
  const businessName = match[2];
  const country = match[3];
  const contactBlock = match[4];

  const emailMatch = contactBlock.match(/email:\s*'([^']+)'/);
  const phoneMatch = contactBlock.match(/phone:\s*'([^']+)'/);
  const websiteMatch = contactBlock.match(/website:\s*'([^']+)'/);
  const whatsappMatch = contactBlock.match(/whatsapp:\s*'([^']+)'/);

  leads.push({
    id,
    businessName,
    country,
    email: emailMatch ? emailMatch[1] : undefined,
    phone: phoneMatch ? phoneMatch[1] : undefined,
    website: websiteMatch ? websiteMatch[1] : undefined,
    whatsapp: whatsappMatch ? whatsappMatch[1] : undefined,
  });
}

console.log(`Found ${leads.length} leads in mock-data.ts`);

const suspicious = [];
for (const lead of leads) {
  // Check domain match
  if (lead.email && lead.website) {
    try {
      const webDomain = new URL(lead.website).hostname.replace(/^www\./, '');
      const emailDomain = lead.email.split('@')[1];
      // Check if domains are related (e.g. care.daraz.com and daraz.pk, or direct match)
      const webRoot = webDomain.split('.').slice(-2).join('.');
      const emailRoot = emailDomain.split('.').slice(-2).join('.');
      if (webRoot !== emailRoot && !webDomain.includes(emailRoot) && !emailDomain.includes(webRoot)) {
        suspicious.push({
          id: lead.id,
          name: lead.businessName,
          issue: `Domain mismatch: web=${webDomain} vs email=${emailDomain}`
        });
      }
    } catch (e) {
      suspicious.push({ id: lead.id, name: lead.businessName, issue: `Invalid URL: ${lead.website}` });
    }
  }

  // Check dummy phone patterns (555, 7946, 1234567, 890-)
  if (lead.phone && (lead.phone.includes('7946') || lead.phone.includes('555-') || lead.phone.includes('1234567'))) {
    suspicious.push({
      id: lead.id,
      name: lead.businessName,
      issue: `Suspicious phone: ${lead.phone}`
    });
  }

  // Check dummy emails
  if (lead.email && (lead.email.includes('example') || lead.email.includes('dummy') || lead.email.includes('test@'))) {
    suspicious.push({
      id: lead.id,
      name: lead.businessName,
      issue: `Suspicious email: ${lead.email}`
    });
  }
}

console.log(`Suspicious count: ${suspicious.length}`);
console.log(JSON.stringify(suspicious, null, 2));
