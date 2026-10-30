// Comprehensive Test Suite for SAMVERO Production Upgrade
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message} ${details ? '(' + details + ')' : ''}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 SAMVERO Production Upgrade Verification Suite');
  console.log('====================================================\n');

  // TEST 1: App Router 20+ Routes File Presence
  console.log('📁 Test 1: Navigation Route Pages Verification');
  const routes = [
    'dashboard',
    'leads',
    'discover',
    'lists',
    'saved',
    'research',
    'gmb',
    'verify-email',
    'verify-phone',
    'queue',
    'qualified',
    'campaigns',
    'responses',
    'pipeline',
    'analytics',
    'activity-logs',
    'export',
    'integrations',
    'api-config',
    'settings',
    'profile',
  ];

  routes.forEach((route) => {
    const pagePath = path.join(__dirname, '..', 'src', 'app', route, 'page.tsx');
    assert(fs.existsSync(pagePath), `Route /${route} page.tsx exists`);
  });

  // TEST 2: SSRF Protection Engine
  console.log('\n🛡️ Test 2: SSRF Security Engine Validation');
  const { isSafePublicUrl } = require('../src/lib/security');

  const unsafeUrls = [
    'http://127.0.0.1/admin',
    'http://localhost:3000/internal',
    'http://169.254.169.254/latest/meta-data/',
    'http://10.0.0.1/secret',
    'http://192.168.1.1/router',
    'http://metadata.google.internal/computeMetadata/v1/',
    'ftp://example.com/file',
  ];

  unsafeUrls.forEach((url) => {
    const res = isSafePublicUrl(url);
    assert(!res.safe, `SSRF blocked unsafe URL: ${url}`, res.reason);
  });

  const safeUrls = [
    'https://chughtailab.com',
    'https://mediclinic.ae/en/corporate.html',
    'https://stripe.com',
  ];

  safeUrls.forEach((url) => {
    const res = isSafePublicUrl(url);
    assert(res.safe, `SSRF allowed legitimate public URL: ${url}`);
  });

  // TEST 3: Email Verification Engine (Syntax, Disposable, Real DNS MX)
  console.log('\n📧 Test 3: Email Verification Engine (RFC 5322, Disposable, DNS MX)');
  const { verifyEmailAddress } = require('../src/lib/email-verifier');

  // 3a. Invalid Syntax
  const invalidSyntaxRes = await verifyEmailAddress('not-an-email');
  assert(invalidSyntaxRes.status === 'INVALID' && !invalidSyntaxRes.isValidSyntax, 'Syntax rejection: not-an-email');

  // 3b. Disposable Domain
  const disposableRes = await verifyEmailAddress('tester@mailinator.com');
  assert(disposableRes.status === 'DISPOSABLE' && disposableRes.isDisposable, 'Disposable detection: tester@mailinator.com');

  // 3c. Authentic Domain with DNS MX
  const validDomainRes = await verifyEmailAddress('contact@stripe.com');
  assert(validDomainRes.hasActiveMx && validDomainRes.status === 'VERIFIED', 'DNS MX resolution for stripe.com', `Found ${validDomainRes.mxRecords.length} records`);

  // TEST 4: Phone Normalization & WhatsApp Digits
  console.log('\n📱 Test 4: ITU-T E.164 Phone Normalization & WhatsApp Links');
  const { verifyPhoneNumber, formatWhatsAppLink } = require('../src/lib/phone-verifier');

  const phoneCases = [
    { raw: '+971 4 344 8920', country: 'UAE', expectedE164: '+97143448920', expectedDigits: '97143448920' },
    { raw: '050 789 2210', country: 'UAE', expectedE164: '+971507892210', expectedDigits: '971507892210' },
    { raw: '+92 321 4455890', country: 'Pakistan', expectedE164: '+923214455890', expectedDigits: '923214455890' },
    { raw: '0300 8291044', country: 'Pakistan', expectedE164: '+923008291044', expectedDigits: '923008291044' },
    { raw: '+1 (512) 892-4410', country: 'US', expectedE164: '+15128924410', expectedDigits: '15128924410' },
  ];

  phoneCases.forEach(({ raw, country, expectedE164, expectedDigits }) => {
    const verified = verifyPhoneNumber(raw, country);
    assert(verified.isValid, `Phone format valid: ${raw} (${country})`);
    assert(verified.normalizedE164 === expectedE164, `E.164 match: ${verified.normalizedE164} === ${expectedE164}`);
    assert(verified.cleanWhatsAppDigits === expectedDigits, `WA Digits match: ${verified.cleanWhatsAppDigits} === ${expectedDigits}`);

    const waLink = formatWhatsAppLink(raw, 'Hello', country);
    assert(waLink.startsWith('https://wa.me/') && !waLink.includes('+'), `WA link has no plus sign: ${waLink}`);
  });

  // TEST 5: Explainable Lead Scoring (4 Dimensions)
  console.log('\n⭐ Test 5: Explainable 4-Dimension Lead Scoring Engine');
  const { calculateExplainableLeadScore } = require('../src/lib/explainable-scoring');

  const sampleLead = {
    id: 'test-1',
    businessName: 'Mediclinic Middle East',
    type: 'gmb',
    platform: 'Google My Business',
    category: 'Healthcare',
    country: 'UAE',
    city: 'Dubai',
    businessAge: { years: 10, months: 0, isNew: false, label: 'Established', badgeColor: 'green' },
    rating: 4.8,
    reviewCount: 120,
    contact: {
      hasWebsite: true,
      website: 'https://mediclinic.ae',
      phone: '+971 4 344 8920',
      email: 'concierge@mediclinic.ae',
      emailStatus: 'VERIFIED',
      phoneStatus: 'VERIFIED',
    },
    tags: ['Hospital', 'Clinic'],
    verified: true,
  };

  const scoring = calculateExplainableLeadScore(sampleLead);
  assert(scoring.leadQualityScore >= 0 && scoring.leadQualityScore <= 100, `Lead Quality Score in bounds: ${scoring.leadQualityScore}`);
  assert(scoring.businessMatchConfidence >= 0 && scoring.businessMatchConfidence <= 100, `Business Match Confidence in bounds: ${scoring.businessMatchConfidence}`);
  assert(scoring.researchCompleteness >= 0 && scoring.researchCompleteness <= 100, `Research Completeness in bounds: ${scoring.researchCompleteness}`);
  assert(Array.isArray(scoring.explanation) && scoring.explanation.length > 0, `Explanation factors generated: ${scoring.explanation.length}`);

  // TEST 6: Real-Data Policy Audit on mock-data.ts
  console.log('\n🔍 Test 6: Absolute Real-Data Policy Audit on mock-data.ts');
  const mockContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'mock-data.ts'), 'utf8');

  // Verify no fabricated email patterns (e.g. consultations@ or generic info@ without verified flag)
  const hasSynthesizedConsultations = mockContent.includes('consultations@');
  assert(!hasSynthesizedConsultations, 'Zero synthesized consultations@ email addresses in dataset');

  // TEST 7: Supabase Schema File Integrity
  console.log('\n🗄️ Test 7: Supabase 19-Entity Relational Schema File');
  const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
  assert(fs.existsSync(schemaPath), 'supabase-schema.sql exists in workspace root');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS public.leads'), 'Schema defines public.leads');
  assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS public.lead_activities'), 'Schema defines public.lead_activities');
  assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS public.enrichment_jobs'), 'Schema defines public.enrichment_jobs');
  assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS public.source_evidence'), 'Schema defines public.source_evidence');
  assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS public.pipeline_stages'), 'Schema defines public.pipeline_stages');
  assert(schemaContent.includes('ROW LEVEL SECURITY'), 'Schema enforces Row Level Security policies');

  // TEST 8: Sales Pipeline 13 Stages Integrity
  console.log('\n📊 Test 8: Sales Pipeline 13 Stages Integrity');
  const pipelineViewPath = path.join(__dirname, '..', 'src', 'components', 'sales', 'SalesPipelineView.tsx');
  assert(fs.existsSync(pipelineViewPath), 'SalesPipelineView.tsx exists');
  const pipelineContent = fs.readFileSync(pipelineViewPath, 'utf8');
  const requiredStages = [
    'new',
    'research_pending',
    'researching',
    'researched',
    'qualified',
    'contacted',
    'follow_up',
    'replied',
    'interested',
    'proposal_sent',
    'won',
    'lost',
    'archived',
  ];
  requiredStages.forEach((stage) => {
    assert(pipelineContent.includes(`id: '${stage}'`), `Pipeline stage '${stage}' is defined in SalesPipelineView`);
  });

  // TEST 9: Unverified Contact Scoring Protection
  console.log('\n🛡️ Test 9: Unverified Contact Scoring Deliverability Protection');
  const unverifiedLead = {
    id: 'unverified-1',
    businessName: 'Unverified Shop',
    contact: {
      email: 'owner@unverified-domain.com',
      phone: '+971 50 123 4567',
      emailStatus: 'UNVERIFIED',
      phoneStatus: 'UNVERIFIED',
    },
  };
  const unverifiedScore = calculateExplainableLeadScore(unverifiedLead);
  assert(
    unverifiedScore.contactVerificationStatus !== 'VERIFIED',
    `Unverified contacts cannot receive VERIFIED status (received: ${unverifiedScore.contactVerificationStatus})`
  );

  // TEST 10: Executive Dashboard Real Metrics & Charts
  console.log('\n📈 Test 10: Executive Dashboard Real Metrics & Chart Integrity');
  const execDashPath = path.join(__dirname, '..', 'src', 'components', 'dashboard', 'ExecutiveDashboard.tsx');
  const execContent = fs.readFileSync(execDashPath, 'utf8');
  assert(!execContent.includes('0.45'), 'Zero simulated weekly leads formulas (Math.round * 0.45 removed)');
  assert(execContent.includes('Lead Acquisition Over Time'), 'Dashboard renders Lead Acquisition Over Time chart');
  assert(execContent.includes('Lead Source Distribution'), 'Dashboard renders Lead Source Distribution chart');
  assert(execContent.includes('Industry Distribution'), 'Dashboard renders Industry Distribution chart');
  assert(execContent.includes('Contact Verification Status'), 'Dashboard renders Contact Verification Status chart');

  // TEST 11: Real-Data Aggregator & Queue Integrity
  console.log('\n⚡ Test 11: Real-Data Aggregator & Queue Verification');
  const queuePath = path.join(__dirname, '..', 'src', 'components', 'queue', 'VerificationQueueView.tsx');
  const queueContent = fs.readFileSync(queuePath, 'utf8');
  assert(!queueContent.includes('idx % 3 === 0'), 'Zero modulo mock simulations in VerificationQueueView');

  const aggPath = path.join(__dirname, '..', 'src', 'lib', 'live-lead-aggregator.ts');
  const aggContent = fs.readFileSync(aggPath, 'utf8');
  assert(!aggContent.includes('613) 241-2828'), 'Zero hardcoded Canadian placeholder phone numbers in live-lead-aggregator.ts');

  console.log('\n====================================================');
  console.log(`📊 Verification Suite Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Unhandled error in test suite:', err);
  process.exit(1);
});
