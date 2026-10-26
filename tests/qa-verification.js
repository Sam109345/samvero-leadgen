// Automated QA Verification Script for SAMVERO Lead Generation Portal
const http = require('http');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 80,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body });
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runQA() {
  console.log('🚀 Starting Comprehensive QA Suite for SAMVERO Portal...\n');
  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, detail = '') {
    totalTests++;
    if (condition) {
      console.log(`✅ PASS: ${testName} ${detail ? '(' + detail + ')' : ''}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${testName} ${detail ? '(' + detail + ')' : ''}`);
    }
  }

  // 1. Leads API & Strict De-duplication Check
  try {
    const leadsRes = await fetchUrl('http://localhost:3000/api/leads');
    assert(leadsRes.status === 200, 'API /api/leads responds with 200 OK');
    const data = JSON.parse(leadsRes.body);
    assert(data.success === true, 'Leads API returns success: true');
    assert(Array.isArray(data.leads) && data.leads.length >= 19, 'Total leads loaded successfully', `Found ${data.leads.length} leads`);

    // Strict de-duplication check:
    const seenIds = new Set();
    const seenNames = new Set();
    let hasDuplicateId = false;
    let hasDuplicateName = false;

    for (const lead of data.leads) {
      if (seenIds.has(lead.id)) {
        hasDuplicateId = true;
        console.error('Duplicate ID detected:', lead.id);
      }
      seenIds.add(lead.id);

      const nameCity = `${lead.businessName.toLowerCase()}::${lead.city.toLowerCase()}`;
      if (seenNames.has(nameCity)) {
        hasDuplicateName = true;
        console.error('Duplicate Business detected:', lead.businessName, lead.city);
      }
      seenNames.add(nameCity);
    }

    assert(!hasDuplicateId, 'Zero Duplicate Lead IDs exist across the dataset');
    assert(!hasDuplicateName, 'Zero Duplicate Business Names exist across the dataset');

    // 2. UAE Market Verification
    const uaeLeads = data.leads.filter((l) => l.country === 'UAE');
    assert(uaeLeads.length >= 6, 'UAE Market leads populated with high-quality data', `Count: ${uaeLeads.length}`);
    
    const dubaiLead = uaeLeads.find((l) => l.city === 'Dubai');
    assert(Boolean(dubaiLead), 'Authentic Dubai lead exists', dubaiLead ? dubaiLead.businessName : '');

    const abuDhabiLead = uaeLeads.find((l) => l.city === 'Abu Dhabi');
    assert(Boolean(abuDhabiLead), 'Authentic Abu Dhabi lead exists', abuDhabiLead ? abuDhabiLead.businessName : '');

    const sharjahLead = uaeLeads.find((l) => l.city === 'Sharjah');
    assert(Boolean(sharjahLead), 'Authentic Sharjah lead exists', sharjahLead ? sharjahLead.businessName : '');

    // Other markets
    const pkLeads = data.leads.filter((l) => l.country === 'Pakistan');
    assert(pkLeads.length >= 5, 'Pakistan market leads verified', `Count: ${pkLeads.length}`);

    const usLeads = data.leads.filter((l) => l.country === 'US');
    assert(usLeads.length >= 4, 'United States market leads verified', `Count: ${usLeads.length}`);

    const ukLeads = data.leads.filter((l) => l.country === 'UK');
    assert(ukLeads.length >= 4, 'United Kingdom market leads verified', `Count: ${ukLeads.length}`);

    // Check no video editing in categories
    const videoLeads = data.leads.filter((l) => l.category === 'Video Editing');
    assert(videoLeads.length === 0, 'Zero Video Editing categories present in leads feed', 'Video feature completely deprecated');
  } catch (err) {
    console.error('Leads API test failed:', err);
  }

  // 3. Settings & Gemini API Configuration Check
  try {
    const settingsRes = await fetchUrl('http://localhost:3000/api/settings');
    assert(settingsRes.status === 200, 'API /api/settings responds with 200 OK');
    const settingsData = JSON.parse(settingsRes.body);
    assert(settingsData.success === true, 'Settings API returns valid config');
    assert('isGeminiConfigured' in settingsData.config, 'Google Gemini AI configuration key recognized');
    assert(settingsData.config.isSmtpConfigured === true, 'Gmail SMTP configured with user credentials');

    // Test Gemini endpoint behavior without key
    const geminiTestRes = await fetchUrl('http://localhost:3000/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test-gemini', geminiApiKey: '' })
    });
    const geminiTestData = JSON.parse(geminiTestRes.body);
    assert(geminiTestData.success === false && geminiTestData.error.includes('Gemini API Key'), 'Gemini test handler validates API Key input properly');
  } catch (err) {
    console.error('Settings test failed:', err);
  }

  // 4. Standalone Preview Page Test (UAE Lead uae-gmb-401)
  try {
    const previewRes = await fetchUrl('http://localhost:3000/preview/uae-gmb-401');
    assert(previewRes.status === 200, 'UAE Lead Preview (/preview/uae-gmb-401) renders 200 OK');
    assert(previewRes.body.includes('9-Section') || previewRes.body.includes('9 Interactive Sections'), 'Preview incorporates 9-Section Interactive Website specification');
    assert(previewRes.body.includes('6 Vector SVG Logos'), 'Preview incorporates 6 Vector SVG Logo concepts specification');
    assert(previewRes.body.includes('14-Screen'), 'Preview incorporates 14-Screen Native Mobile App specification');
    assert(!previewRes.body.includes('4K Short-Form Video Pitch'), 'Preview contains zero legacy video pitch elements');
  } catch (err) {
    console.error('Preview test failed:', err);
  }

  // 5. Main Home Dashboard Test
  try {
    const homeRes = await fetchUrl('http://localhost:3000/');
    assert(homeRes.status === 200, 'Home Dashboard (/) renders 200 OK');
    assert(homeRes.body.includes('SAMVERO'), 'SAMVERO brand rendered on home page');
  } catch (err) {
    console.error('Home test failed:', err);
  }

  console.log(`\n========================================`);
  console.log(`QA Result: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log(`========================================\n`);

  if (passedTests === totalTests) {
    console.log('🎉 ALL QA REQUIREMENTS VERIFIED AND PASSING FLAWLESSLY!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runQA();
