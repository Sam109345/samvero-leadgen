/**
 * SAMVERO Functional Upgrade Verification Suite
 * 
 * Executes mandatory tests defined in Requirement 15:
 * - Test A: Website Lead (AI Pitch, Rich-text HTML, Greeting, Closing, Bid, Approached transition, Follow-up, Note, Activity)
 * - Test B: Social Media Lead (Specific pitch, zero website language, social media deliverables)
 * - Test C: Status Transitions & Timeline (New Lead -> Approached -> Waiting for Client Response)
 * - Test D: Wasted Lead (Wasted status with reason, timeline check)
 * - Security & Multi-Tenant Isolated Encryption Tests
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const {
  extractClientFirstName,
  formatGreeting,
  STRICT_CLOSING_HTML,
  STRICT_CLOSING_TEXT,
  detectLeadPitchCategory,
  generateCategorySpecificPitch,
  generateProjectBid,
} = require('../src/lib/pitch-generator');

const {
  signSession,
  verifySessionToken,
} = require('../src/lib/session');

const {
  encryptSensitive,
  decryptSensitive,
  updateUserLeadStatus,
  getUserLeadState,
  addLeadFollowup,
  updateLeadFollowupStatus,
  addLeadNote,
  getLeadActivityLogs,
  saveEmailDraft,
  getEmailDraftForLead,
  computeLeadWorkspaceStats,
  matchLeadCategory,
} = require('../src/lib/lead-workspace-store');

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

async function runFunctionalUpgradeTests() {
  console.log('====================================================');
  console.log('🧪 SAMVERO Functional Upgrade Verification Suite');
  console.log('====================================================\n');

  // ============================================================================
  // TEST A: Website Lead Verification
  // ============================================================================
  console.log('🌐 TEST A: Website Lead Verification');
  const websiteLead = {
    id: 'test_lead_web_001',
    businessName: 'Apex Health Partners',
    title: 'Custom Modern Web Application with Next.js',
    category: 'Website Development',
    description: 'Looking to overhaul our clinic patient booking website with high-performance responsive interface.',
    city: 'Austin, TX',
    budget: '$1,200 USD',
    contact: {
      contactPerson: 'Sarah Jenkins',
      email: 'sjenkins@apexhealth.com',
      hasWebsite: false,
    },
    tags: ['nextjs', 'react', 'web-development'],
  };

  // 1. First Name Greeting & Closing
  const firstName = extractClientFirstName(websiteLead.contact.contactPerson);
  assert(firstName === 'Sarah', 'Extracted client first name ONLY', `Expected "Sarah", got "${firstName}"`);
  
  const greeting = formatGreeting(websiteLead.contact.contactPerson);
  assert(greeting === 'Hello Sarah,', 'Strict greeting is "Hello Sarah,"', greeting);

  const fallbackGreeting = formatGreeting(null);
  assert(fallbackGreeting === 'Hello,', 'Fallback greeting without contact person is "Hello,"', fallbackGreeting);

  // Unicode and Honorific/Title Edge Cases (Requirement 3)
  const unicodeJose = extractClientFirstName('José María');
  assert(unicodeJose === 'José', 'Unicode extraction: "José María" -> "José"', unicodeJose);

  const unicodeFrancois = extractClientFirstName('François Girard');
  assert(unicodeFrancois === 'François', 'Unicode extraction: "François Girard" -> "François"', unicodeFrancois);

  const parentheticalRene = extractClientFirstName('René Dupont (CEO)');
  assert(parentheticalRene === 'René', 'Parenthetical stripping: "René Dupont (CEO)" -> "René"', parentheticalRene);

  const titleAlex = extractClientFirstName('Dr. Alex Rivera - Hiring Manager');
  assert(titleAlex === 'Alex', 'Title and dash stripping: "Dr. Alex Rivera - Hiring Manager" -> "Alex"', titleAlex);

  // 2. Generate AI Pitch for Website Lead
  const detectedCategoryA = detectLeadPitchCategory(websiteLead);
  assert(detectedCategoryA === 'Website Development', 'Correctly detected category as Website Development', detectedCategoryA);

  const pitchA = generateCategorySpecificPitch(websiteLead, detectedCategoryA);
  assert(pitchA.htmlContent.includes('<p>Hello Sarah,</p>'), 'Pitch begins with strict first name greeting in HTML');
  assert(pitchA.htmlContent.includes(STRICT_CLOSING_HTML), 'Pitch ends with EXACT strict closing HTML');
  assert(pitchA.plainText.endsWith(STRICT_CLOSING_TEXT), 'Pitch plain text ends with EXACT strict closing text');
  assert(pitchA.htmlContent.includes('Next.js') || pitchA.htmlContent.includes('web platform'), 'Pitch contains tailored web architecture language');

  // 3. Bid Generation for Website Lead
  const bidA = generateProjectBid(websiteLead);
  assert(bidA.title.includes('Website Development'), 'Bid title includes project category', bidA.title);
  assert(Array.isArray(bidA.deliverables) && bidA.deliverables.length >= 3, 'Bid contains structured deliverables list', `Found ${bidA.deliverables.length} deliverables`);
  assert(Boolean(bidA.timeline), 'Bid specifies delivery timeline', bidA.timeline);
  assert(Boolean(bidA.investment), 'Bid specifies investment / milestone pricing', bidA.investment);

  // 4. Mark as Approached
  const testRunId = Date.now();
  const testUserId = `test_user_${testRunId}`;
  updateUserLeadStatus(testUserId, websiteLead.id, 'Approached');
  const stateA1 = getUserLeadState(testUserId, websiteLead.id);
  assert(stateA1.status === 'Approached', 'Lead status successfully transitioned to "Approached"');
  assert(Boolean(stateA1.approachedAt), 'Approached timestamp recorded');

  // 5. Add Follow-up
  const followupA = addLeadFollowup(testUserId, websiteLead.id, '2026-11-05T10:00:00Z', 'Follow up on web proposal review');
  assert(followupA.status === 'pending', 'Follow-up created with status "pending"');

  // 6. Add Note
  const noteA = addLeadNote(testUserId, websiteLead.id, 'Sarah preferred a discovery call on Thursday afternoon.');
  assert(noteA.content.includes('Sarah preferred'), 'Lead observation note recorded');

  // 7. Verify Activity Timeline
  const logsA = getLeadActivityLogs(testUserId, websiteLead.id);
  assert(logsA.length >= 3, 'Complete audit timeline recorded (status change, follow-up, note)', `Count: ${logsA.length}`);
  assert(logsA.some((l) => l.action === 'status_changed'), 'Timeline contains status_changed event');
  assert(logsA.some((l) => l.action === 'followup_added'), 'Timeline contains followup_added event');
  assert(logsA.some((l) => l.action === 'note_added'), 'Timeline contains note_added event');

  // 8. Follow-up Reschedule & Draft Save Verification (Requirements 10 & 13)
  const rescheduledFup = updateLeadFollowupStatus(testUserId, followupA.id, 'rescheduled', '2026-11-12T10:00:00Z');
  assert(rescheduledFup && rescheduledFup.status === 'rescheduled', 'Follow-up successfully rescheduled to new date');
  assert(rescheduledFup && rescheduledFup.dueDate === '2026-11-12T10:00:00Z', 'Rescheduled due date updated correctly');

  const draftA = saveEmailDraft(testUserId, websiteLead.id, {
    subject: 'Draft Proposal for Sarah',
    htmlContent: '<p>Hello Sarah, this is a draft.</p>',
    plainText: 'Hello Sarah, this is a draft.',
    category: 'Website Development',
  });
  assert(Boolean(draftA.id), 'Email draft saved successfully without requiring SMTP credentials');

  const loadedDraftA = getEmailDraftForLead(testUserId, websiteLead.id);
  assert(loadedDraftA && loadedDraftA.subject === 'Draft Proposal for Sarah', 'Loaded saved draft matches saved content');

  // ============================================================================
  // TEST B: Social Media Lead Verification
  // ============================================================================
  console.log('\n📱 TEST B: Social Media Lead Verification');
  const socialLead = {
    id: 'test_lead_smm_002',
    businessName: 'Luxe Aesthetics Studio',
    title: 'Social Media Management & Instagram Content Creator',
    category: 'Social Media Management',
    description: 'Seeking an agency or freelancer to handle our daily Instagram reels, carousels, and community management.',
    budget: '$800/month',
    contact: {
      contactPerson: 'Marcus Vance',
      email: 'marcus@luxestudio.com',
      hasWebsite: true,
      website: 'https://luxestudio.com',
    },
    tags: ['smm', 'social-media', 'instagram', 'content-creation'],
  };

  // 1. Detect Category
  const detectedCategoryB = detectLeadPitchCategory(socialLead);
  assert(detectedCategoryB === 'Social Media Management', 'Detected category as Social Media Management', detectedCategoryB);

  // 2. Generate Pitch
  const pitchB = generateCategorySpecificPitch(socialLead, detectedCategoryB);
  assert(pitchB.htmlContent.includes('<p>Hello Marcus,</p>'), 'Strict greeting addresses Marcus');
  assert(pitchB.htmlContent.includes('content calendar') || pitchB.htmlContent.includes('reels'), 'Pitch addresses social media content and reels');
  
  // 3. Negative check: MUST NOT contain website development pitch language
  const lowerB = pitchB.htmlContent.toLowerCase();
  assert(!lowerB.includes('website design') && !lowerB.includes('turnkey web architecture') && !lowerB.includes('appointment booking integration'), 'Social media pitch contains NO website development pitch language');

  // 4. Bid Proposal for Social Media
  const bidB = generateProjectBid(socialLead);
  assert(bidB.title.includes('Social Media'), 'Social media bid title focuses on social media', bidB.title);

  // 5. Test E-commerce Development category pitch (Zero generic copy)
  const ecomLead = {
    id: 'test_lead_ecom_005',
    businessName: 'Nordic Ware Emporium',
    title: 'Custom Headless Storefront & Checkout Optimization',
    category: 'E-commerce Development',
    description: 'Need complete custom cart checkout and inventory sync for multichannel sales.',
    contact: { contactPerson: 'Astrid Lind', email: 'astrid@nordicware.com' },
  };
  const pitchEcom = generateCategorySpecificPitch(ecomLead, 'E-commerce Development');
  assert(pitchEcom.htmlContent.includes('E-commerce Architecture') || pitchEcom.htmlContent.includes('checkout') || pitchEcom.htmlContent.includes('cart'), 'E-commerce pitch contains tailored commerce architecture copy');
  assert(!pitchEcom.htmlContent.toLowerCase().includes('general digital solutions') && !pitchEcom.htmlContent.toLowerCase().includes('reels'), 'E-commerce pitch has NO generic or social media copy');

  // 6. Test UI/UX Design category pitch
  const uiuxLead = {
    id: 'test_lead_uiux_006',
    businessName: 'FinFlow Technologies',
    title: 'Mobile Banking App UI/UX Redesign & User Flow',
    category: 'UI/UX Design',
    description: 'Looking for a senior product designer to build Figma components and interactive prototypes.',
    contact: { contactPerson: 'Julian Thorne', email: 'julian@finflow.io' },
  };
  const pitchUiUx = generateCategorySpecificPitch(uiuxLead, 'UI/UX Design');
  assert(pitchUiUx.htmlContent.includes('Figma') || pitchUiUx.htmlContent.includes('user flow') || pitchUiUx.htmlContent.includes('wireframe'), 'UI/UX pitch contains tailored design system & prototype copy');
  assert(!pitchUiUx.htmlContent.toLowerCase().includes('shopify store setup') && !pitchUiUx.htmlContent.toLowerCase().includes('wordpress plugin'), 'UI/UX pitch has NO irrelevant e-commerce store copy');

  // 7. Test Logo Design category pitch (Distinct from Graphic Design)
  const logoLead = {
    id: 'test_lead_logo_007',
    businessName: 'Vanguard Aerospace',
    title: 'Corporate Logo & Visual Mark Design',
    category: 'Logo Design',
    description: 'Seeking a distinct minimalist logo mark with complete vector guidelines.',
    contact: { contactPerson: 'Elena Rostova', email: 'elena@vanguard.aero' },
  };
  const pitchLogo = generateCategorySpecificPitch(logoLead, 'Logo Design');
  assert(pitchLogo.htmlContent.includes('vector') || pitchLogo.htmlContent.includes('brand mark') || pitchLogo.htmlContent.includes('visual identity') || pitchLogo.htmlContent.includes('logo'), 'Logo Design pitch contains distinct vector & identity mark copy');

  // 8. Pipeline Real Statistics Verification (Requirement 10)
  const realStats = computeLeadWorkspaceStats(testUserId, [websiteLead, socialLead, ecomLead, uiuxLead, logoLead]);
  assert(typeof realStats.newLeads === 'number', 'Pipeline stats computes newLeads count', String(realStats.newLeads));
  assert(typeof realStats.approachedClients === 'number', 'Pipeline stats computes approachedClients count', String(realStats.approachedClients));
  assert(typeof realStats.followupsDue === 'number', 'Pipeline stats computes followupsDue count', String(realStats.followupsDue));
  assert(typeof realStats.closedLeads === 'number', 'Pipeline stats computes closedLeads count', String(realStats.closedLeads));

  // ============================================================================
  // TEST C: Status Transitions & Timeline
  // ============================================================================
  console.log('\n🔄 TEST C: Status Transitions Verification');
  const flowLeadId = 'test_lead_flow_003';

  // 1. New Lead initial state
  const stateC0 = getUserLeadState(testUserId, flowLeadId);
  assert(stateC0.status === 'New Lead', 'Initial state is "New Lead"');

  // 2. Transition: New Lead -> Approached
  updateUserLeadStatus(testUserId, flowLeadId, 'Approached');
  const stateC1 = getUserLeadState(testUserId, flowLeadId);
  assert(stateC1.status === 'Approached', 'Transitioned to "Approached"');

  // 3. Transition: Approached -> Waiting for Client Response
  updateUserLeadStatus(testUserId, flowLeadId, 'Waiting for Client Response');
  const stateC2 = getUserLeadState(testUserId, flowLeadId);
  assert(stateC2.status === 'Waiting for Client Response', 'Transitioned to "Waiting for Client Response"');

  // 4. Verify audit trail reflects each transition with timestamps
  const logsC = getLeadActivityLogs(testUserId, flowLeadId);
  assert(logsC.length >= 2, 'Audit timeline contains both state changes', `Logs: ${logsC.length}`);
  assert(logsC[0].description.includes('Waiting for Client Response'), 'Most recent log is Waiting for Client Response transition');
  assert(Boolean(logsC[0].createdAt), 'Timestamp present on log entry', logsC[0].createdAt);

  // ============================================================================
  // TEST D: Wasted Lead Verification
  // ============================================================================
  console.log('\n🗑️ TEST D: Wasted Lead Verification');
  const wastedLeadId = 'test_lead_wasted_004';
  updateUserLeadStatus(testUserId, wastedLeadId, 'Approached');
  updateUserLeadStatus(testUserId, wastedLeadId, 'Wasted Lead', { reason: 'Client unreachable / non-responsive after 4 attempts' });

  const stateD = getUserLeadState(testUserId, wastedLeadId);
  assert(stateD.status === 'Wasted Lead', 'Lead status marked as "Wasted Lead"');

  const logsD = getLeadActivityLogs(testUserId, wastedLeadId);
  const wastedLog = logsD.find((l) => l.metadata && l.metadata.newStatus === 'Wasted Lead');
  assert(Boolean(wastedLog), 'Wasted Lead transition logged in timeline');
  assert(wastedLog && wastedLog.metadata && wastedLog.metadata.reason.includes('Client unreachable'), 'Logged reason preserved in metadata', wastedLog ? wastedLog.metadata.reason : '');

  // ============================================================================
  // SECURITY & MULTI-TENANT ISOLATION TESTS
  // ============================================================================
  console.log('\n🔐 Test 5: AES-256-GCM Encryption & Multi-Tenant Isolation');
  const sampleSecret = 'AIzaSy_super_secret_user_gemini_api_key_12345';
  const encrypted = encryptSensitive(sampleSecret);
  assert(encrypted !== sampleSecret, 'API Key was encrypted');
  assert(encrypted.split(':').length === 3, 'Ciphertext matches IV:Tag:Cipher format');

  const decrypted = decryptSensitive(encrypted);
  assert(decrypted === sampleSecret, 'Decrypted ciphertext restores original plaintext exactly');

  // Multi-tenant check: ensure User A and User B leads are strictly isolated
  const userA = `user_alpha_${testRunId}`;
  const userB = `user_beta_${testRunId}`;
  const userA_Lead = getUserLeadState(userA, 'lead_100');
  updateUserLeadStatus(userA, 'lead_100', 'Interested');
  const userB_Lead = getUserLeadState(userB, 'lead_100');
  assert(userB_Lead.status === 'New Lead', 'Multi-tenant isolation: User A status change does not bleed into User B workspace');

  // ============================================================================
  // TEST 6: Temporary Account Integrity & Password Hashing (Requirement 6)
  // ============================================================================
  console.log('\n👤 TEST 6: Seeded Account Integrity & Scrypt Password Hashing');
  const dbPath = path.join(__dirname, '..', 'data', 'saas-db.json');
  assert(fs.existsSync(dbPath), 'data/saas-db.json exists on disk');
  const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const users = dbContent.users || [];

  // Super Admin: sameer.centric@gmail.com / Sameer123!@#
  const adminUser = users.find((u) => u.email === 'sameer.centric@gmail.com');
  assert(Boolean(adminUser), 'Admin user "sameer.centric@gmail.com" exists in database');
  assert(adminUser.role === 'super_admin' || adminUser.role === 'admin', 'Admin role is super_admin/admin', adminUser?.role);
  assert(adminUser.mustChangePassword === false, 'Admin mustChangePassword is false (no forced reset blocking login)');
  const computedAdminHash = crypto.scryptSync('Sameer123!@#', 'samvero_salt_secure_2026', 64).toString('hex');
  assert(adminUser.passwordHash === computedAdminHash, 'Admin password scrypt hash verifies against "Sameer123!@#"');

  // Customer: client@gmail.com / Client123!@#
  const clientUser = users.find((u) => u.email === 'client@gmail.com');
  assert(Boolean(clientUser), 'Client user "client@gmail.com" exists in database');
  assert(clientUser.role === 'customer' || clientUser.role === 'user', 'Client role is customer/user', clientUser?.role);
  assert(clientUser.mustChangePassword === false, 'Client mustChangePassword is false (no forced reset blocking login)');
  const computedClientHash = crypto.scryptSync('Client123!@#', 'samvero_salt_secure_2026', 64).toString('hex');
  assert(clientUser.passwordHash === computedClientHash, 'Client password scrypt hash verifies against "Client123!@#"');

  // Negative test: invalid password does not match
  const wrongHash = crypto.scryptSync('WrongPassword!23', 'samvero_salt_secure_2026', 64).toString('hex');
  assert(clientUser.passwordHash !== wrongHash, 'Invalid password correctly rejected by scrypt hash');

  // ============================================================================
  // TEST 7: Category Filter Normalization & Discovery Matching (Requirement 7)
  // ============================================================================
  console.log('\n🔍 TEST 7: Category Filter Normalization & Matching');
  const categoryTestCases = [
    { filter: 'meta-ads', leadCat: 'Meta Ads & Marketing', leadTags: ['facebook', 'instagram'], expected: true },
    { filter: 'meta-ads', leadCat: 'E-Commerce Store Development', leadTags: ['meta_ads', 'scaling'], expected: true },
    { filter: 'seo', leadCat: 'SEO Optimization & GMB Ranking', leadTags: ['gmb', 'local-seo'], expected: true },
    { filter: 'ui-ux', leadCat: 'UI/UX Design & Prototyping', leadTags: ['figma', 'wireframes'], expected: true },
    { filter: 'ecommerce', leadCat: 'E-Commerce Store Development', leadTags: ['shopify'], expected: true },
    { filter: 'logo-design', leadCat: 'Logo & Brand Identity', leadTags: ['branding'], expected: true },
    { filter: 'mobile-apps', leadCat: 'Mobile App Development', leadTags: ['react-native'], expected: true },
    { filter: 'meta-ads', leadCat: 'Custom Website Development', leadTags: ['react', 'nextjs'], expected: false },
  ];

  for (const tc of categoryTestCases) {
    const matched = matchLeadCategory(tc.filter, tc.leadCat, tc.leadTags);
    assert(matched === tc.expected, `Filter "${tc.filter}" vs "${tc.leadCat}" -> ${matched ? 'Matched' : 'Filtered out'}`);
  }

  // ============================================================================
  // TEST 8: Server-Side Cryptographic HMAC Admin API Authorization (Requirements 5 & 10)
  // ============================================================================
  console.log('\n🛡️ TEST 8: Server-Side Cryptographic HMAC Admin API Session Verification');
  
  // 1. Valid Admin Session Token
  const validAdminPayload = {
    userId: 'user-sameer',
    role: 'super_admin',
    email: 'sameer.centric@gmail.com',
    name: 'Sameer (Executive Admin)',
    isGlobal: true,
    sessionId: `sess_${Date.now()}`,
    timestamp: Date.now(),
  };
  const validAdminToken = signSession(validAdminPayload);
  assert(validAdminToken.startsWith('samv_'), 'Signed token has "samv_" prefix');
  const decodedAdmin = verifySessionToken(validAdminToken);
  assert(Boolean(decodedAdmin), 'Valid admin token verified successfully');
  assert(decodedAdmin && decodedAdmin.role === 'super_admin', 'Verified role matches "super_admin"');
  assert(decodedAdmin && decodedAdmin.email === 'sameer.centric@gmail.com', 'Verified email matches "sameer.centric@gmail.com"');

  // 2. Tampered Payload (modified role/userId in base64 segment)
  const tokenParts = validAdminToken.slice(5).split('.');
  const forgedPayload = Buffer.from(JSON.stringify({ ...validAdminPayload, role: 'super_admin', userId: 'hacker' })).toString('base64url');
  const tamperedToken = `samv_${forgedPayload}.${tokenParts[1]}`;
  const tamperedResult = verifySessionToken(tamperedToken);
  assert(tamperedResult === null, 'Tampered token payload rejected by cryptographic HMAC signature');

  // 3. Tampered Signature
  const badSigToken = `samv_${tokenParts[0]}.invalidsignature1234567890abcdef`;
  assert(verifySessionToken(badSigToken) === null, 'Tampered signature rejected by cryptographic HMAC check');

  // 4. Customer Token is Not Admin
  const customerPayload = {
    userId: 'user-client-101',
    role: 'customer',
    email: 'client@gmail.com',
    name: 'Alexander Wright',
    isGlobal: false,
    sessionId: `sess_cust_${Date.now()}`,
    timestamp: Date.now(),
  };
  const customerToken = signSession(customerPayload);
  const decodedCustomer = verifySessionToken(customerToken);
  assert(Boolean(decodedCustomer), 'Customer token is valid');
  assert(decodedCustomer && decodedCustomer.role === 'customer', 'Customer role is customer (not admin)');
  const isCustomerAdmin = decodedCustomer && (decodedCustomer.role === 'admin' || decodedCustomer.role === 'super_admin');
  assert(!isCustomerAdmin, 'Customer is strictly denied admin privileges');

  // TEST 9: Gmail / mailto URL Plain-Text Sanitizer & Connected Platforms Removal
  console.log('\n📧 TEST 9: Gmail URL Plain-Text Sanitizer & Zero Connected Platforms UI');
  const { htmlToPlainText } = require('../src/lib/email-plain-text');

  const richHtmlInput = `
    <p>Dear <strong>Alexander</strong>,</p>
    <p>We reviewed your business clinic showcase.<br/>Here are the key deliverables:</p>
    <ul>
      <li>Interactive Next.js Web App</li>
      <li>One-Click WhatsApp Booking</li>
    </ul>
    <p>Explore your live showcase at <a href="https://samvero.com/preview/clinic">SAMVERO Demo</a>.</p>
  `;

  const plainTextResult = htmlToPlainText(richHtmlInput);
  assert(!plainTextResult.includes('<p>'), 'No <p> tags in plain text output');
  assert(!plainTextResult.includes('<strong>'), 'No <strong> tags in plain text output');
  assert(!plainTextResult.includes('<ul>'), 'No <ul> tags in plain text output');
  assert(!plainTextResult.includes('<li>'), 'No <li> tags in plain text output');
  assert(!plainTextResult.includes('<br'), 'No <br> tags in plain text output');
  assert(plainTextResult.includes('Alexander'), 'Client name preserved in plain text');
  assert(plainTextResult.includes('• Interactive Next.js Web App'), 'Bullet points formatted cleanly');
  assert(plainTextResult.includes('SAMVERO Demo (https://samvero.com/preview/clinic)'), 'Link converted to clean textual anchor');

  // Verify UnifiedSidebar has NO 'Connected Platforms' or 'API Management' in navigation groups
  const sidebarContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'navigation', 'UnifiedSidebar.tsx'), 'utf8');
  assert(!sidebarContent.includes("'Connected Platforms'"), 'Connected Platforms removed from UnifiedSidebar');
  assert(!sidebarContent.includes("'API Management'"), 'API Management removed from UnifiedSidebar');

  // Verify AdminLayout has NO 'Integrations' navigation item
  const adminLayoutContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'admin', 'AdminLayout.tsx'), 'utf8');
  assert(!adminLayoutContent.includes("{ name: 'Integrations'"), 'Integrations removed from AdminLayout navigation');

  // TEST 10: Zero Mock Data Enforcement, Discovered Leads Pipeline & Zero-Key Registry
  console.log('\n🔒 TEST 10: Zero Mock Data Policy, Discovered Leads & Zero-Key Registry');
  
  // 1. preview/[id]/page.tsx must NOT synthesize fake dummy leads
  const previewContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'preview', '[id]', 'page.tsx'), 'utf8');
  assert(!previewContent.includes('Bespoke Digital Architecture'), 'Zero synthesized dummy company names in preview/[id]');
  assert(!previewContent.includes("isUae ? 'Jumeirah 1, Dubai, UAE'"), 'Zero synthesized dummy addresses in preview/[id]');
  assert(previewContent.includes('Lead Record Not Found'), 'Honest empty state displayed when lead ID is not in database');

  // 2. jobs-service and gmb-service must NOT fall back to INITIAL_LEADS
  const jobsServiceContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'jobs-service.ts'), 'utf8');
  assert(!jobsServiceContent.includes('INITIAL_LEADS'), 'jobs-service does NOT import or fall back to mock INITIAL_LEADS');
  assert(jobsServiceContent.includes('loadAllStoredLeads'), 'jobs-service uses genuine stored leads');

  const gmbServiceContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'gmb-service.ts'), 'utf8');
  assert(!gmbServiceContent.includes('INITIAL_LEADS'), 'gmb-service does NOT import or fall back to mock INITIAL_LEADS');
  assert(gmbServiceContent.includes('loadAllStoredLeads'), 'gmb-service uses genuine stored leads');

  // 3. lead-store.ts must integrate loadAllStoredLeads
  const leadStoreContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'lead-store.ts'), 'utf8');
  assert(leadStoreContent.includes('loadAllStoredLeads'), 'lead-store integrates loadAllStoredLeads');
  assert(leadStoreContent.includes('leadsRegistry.set(key, lead)'), 'lead-store caches discovered stored leads in registry');

  // 4. PLATFORM_REGISTRY must register legitimate zero-key platforms
  const credsStoreContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'integrations', 'credentials-store.ts'), 'utf8');
  assert(credsStoreContent.includes("id: 'freelancer'"), 'Freelancer.com registered in PLATFORM_REGISTRY');
  assert(credsStoreContent.includes("id: 'remotive'"), 'Remotive registered in PLATFORM_REGISTRY');

  // 5. /api/leads/[id]/route.ts exists for RESTful lead lookup
  const leadIdRouteExists = fs.existsSync(path.join(__dirname, '..', 'src', 'app', 'api', 'leads', '[id]', 'route.ts'));
  assert(leadIdRouteExists, 'Dedicated /api/leads/[id]/route.ts exists');

  // 6. /api/leads/route.ts handles idParam
  const leadsApiContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'api', 'leads', 'route.ts'), 'utf8');
  assert(leadsApiContent.includes("searchParams.get('id')"), '/api/leads handles ?id= search parameter');

  console.log('\n====================================================');
  console.log(`📊 Functional Verification Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runFunctionalUpgradeTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
