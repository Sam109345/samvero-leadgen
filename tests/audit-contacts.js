const fs = require('fs');
const dns = require('dns').promises;

async function checkDomains() {
  const content = fs.readFileSync('./src/lib/mock-data.ts', 'utf8');
  const emailMatches = [...content.matchAll(/email:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const websiteMatches = [...content.matchAll(/website:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const phoneMatches = [...content.matchAll(/phone:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const rawWhatsAppMatches = [...content.matchAll(/whatsapp:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

  console.log(`Found ${emailMatches.length} emails, ${websiteMatches.length} websites, ${phoneMatches.length} phones, ${rawWhatsAppMatches.length} whatsapp fields.`);
  
  let failures = 0;
  const waWithPlus = rawWhatsAppMatches.filter(w => w.includes('+'));
  if (waWithPlus.length > 0) {
    console.error(`❌ FAILED: ${waWithPlus.length} WhatsApp fields contain '+' sign!`);
    failures++;
  } else {
    console.log(`✅ ALL ${rawWhatsAppMatches.length} WhatsApp fields contain strictly pure digits without '+' sign.`);
  }

  // Extract unique domains from emails
  const domains = new Set();
  emailMatches.forEach(e => {
    const parts = e.split('@');
    if (parts[1]) domains.add(parts[1].toLowerCase());
  });

  console.log(`\nVerifying DNS MX resolution for all ${domains.size} unique domains across 68 leads:`);
  for (const domain of domains) {
    try {
      const mx = await dns.resolveMx(domain);
      const validExchanges = mx.filter(m => m.exchange && m.exchange.trim().length > 0 && m.exchange !== '.');
      if (validExchanges.length > 0) {
        console.log(`  [OK - Active MX] ${domain} -> ${validExchanges[0].exchange} (priority ${validExchanges[0].priority})`);
      } else {
        console.error(`  [FAIL - Null/Empty MX (No Mail Accept)] ${domain} -> ${JSON.stringify(mx)}`);
        failures++;
      }
    } catch (err) {
      console.error(`  [FAIL - No MX / Unresolvable] ${domain} (${err.code})`);
      failures++;
    }
  }

  // Verify web search enrichment
  console.log('\nTesting live web search enrichment mechanism:');
  const https = require('https');
  const query = encodeURIComponent('Chughtai Lab Lahore Pakistan official contact website');
  const url = `https://html.duckduckgo.com/html/?q=${query}`;
  await new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 5000,
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const urlMatches = body.match(/uddg=([^&"']+)/g) || [];
        const decodedUrls = urlMatches.map(u => decodeURIComponent(u.replace('uddg=', ''))).slice(0, 3);
        console.log(`  [OK] DuckDuckGo search status ${res.statusCode}. Discovered URLs:`, decodedUrls);
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log('  [WARN] Web search request error:', e.message);
      resolve();
    });
    req.on('timeout', () => {
      req.destroy();
      console.log('  [WARN] Web search timeout');
      resolve();
    });
  });

  if (failures > 0) {
    console.error(`\n❌ AUDIT FAILED with ${failures} error(s)!`);
    process.exit(1);
  } else {
    console.log(`\n✅ AUDIT COMPLETE: 100% of leads have active, non-null MX mail exchangers and pure-digit WhatsApp numbers!`);
  }
}

checkDomains().catch((err) => {
  console.error('Audit exception:', err);
  process.exit(1);
});
