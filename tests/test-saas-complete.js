/**
 * SAMVERO COMMERCIAL SAAS PLATFORM — COMPLETE END-TO-END VERIFICATION SUITE
 * 
 * Verifies:
 * 1. Six Subscription Packages & Pricing Tiers
 * 2. Public Customer Application & Reference Generator (APP-2026-XXXX)
 * 3. Super Admin & Customer Multi-Tenant Authentication
 * 4. One-Click Transactional Customer Activation (Phase 8)
 * 5. Multi-Tenant Data Isolation & Customer Quota Enforcement
 * 6. Deduplication & Zero Double-Charging
 * 7. Subscription Expiry Automation & Scheduled Check
 * 8. Subscription Renewal Request & Manual Payment Confirmation (Phase 10)
 * 9. Backward Compatibility with Existing Lead Engine
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }

        // Extract cookies if any
        const setCookieHeaders = res.headers['set-cookie'] || [];
        const cookies = setCookieHeaders.map((c) => c.split(';')[0]).join('; ');

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookies,
          body: parsed,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

async function runAllTests() {
  console.log('\n============================================================');
  console.log('   SAMVERO COMMERCIAL SAAS PLATFORM — VERIFICATION SUITE');
  console.log('============================================================\n');

  let adminCookies = '';
  let customerCookies = '';
  let testAppReference = '';
  let testAppId = '';
  let testCustomerPassword = '';
  let testCustomerEmail = `corp_${Date.now()}@samvero-test.com`;

  // -------------------------------------------------------------
  // TEST 1: Plans Catalogue (Exactly 6 Packages)
  // -------------------------------------------------------------
  console.log('▶ [TEST 1] Verifying Six Subscription Packages Configuration...');
  const plansRes = await makeRequest('GET', '/api/plans');
  console.log('GET /api/plans status:', plansRes.statusCode, 'body:', plansRes.body);
  assert(plansRes.statusCode === 200, 'GET /api/plans returns 200 OK');
  assert(plansRes.body.success === true, 'Response contains success: true');
  assert(Array.isArray(plansRes.body.plans), 'Plans is an array');
  assert(plansRes.body.plans.length === 6, `Expected exactly 6 packages, got ${plansRes.body.plans.length}`);

  const planSlugs = plansRes.body.plans.map((p) => p.slug);
  const requiredSlugs = ['basic', 'starter', 'standard', 'professional', 'venture', 'enterprise'];
  requiredSlugs.forEach((slug) => {
    assert(planSlugs.includes(slug), `Package with slug "${slug}" exists`);
  });

  // Verify Standard package pricing and quota
  const standardPlan = plansRes.body.plans.find((p) => p.slug === 'standard');
  assert(standardPlan.prices.monthly > 0, 'Standard package has valid monthly price');
  assert(standardPlan.maxLeadsQuota === 2500, 'Standard package quota is 2500 leads');

  // -------------------------------------------------------------
  // TEST 2: Customer Application Submission
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 2] Verifying Customer Application Submission & Reference Format...');
  const appData = {
    fullName: 'David Sterling',
    businessName: 'Sterling Growth Capital',
    email: testCustomerEmail,
    whatsapp: '+14155550199',
    country: 'US',
    companyWebsite: 'https://sterlinggrowth.com',
    planId: standardPlan.id,
    billingDuration: 'monthly',
    serviceRequirements: 'High-intent B2B outreach for enterprise technology providers.',
    additionalMessage: 'Prefer wire transfer settlement via JPMorgan Chase escrow.',
  };

  const appSubmitRes = await makeRequest('POST', '/api/applications', appData);
  assert(appSubmitRes.statusCode === 200, 'POST /api/applications returns 200 OK');
  assert(appSubmitRes.body.success === true, 'Application submission successful');
  assert(appSubmitRes.body.application != null, 'Application object returned');

  testAppReference = appSubmitRes.body.application.referenceNumber;
  testAppId = appSubmitRes.body.application.id;

  assert(
    /^APP-2026-\d{4}$/.test(testAppReference),
    `Application reference matches format APP-2026-XXXX (Got: ${testAppReference})`
  );
  assert(appSubmitRes.body.application.status === 'pending', 'Initial status is "pending" (not active account)');

  // Duplicate rejection check
  console.log('  Testing duplicate application rejection for same email...');
  const dupRes = await makeRequest('POST', '/api/applications', appData);
  assert(dupRes.statusCode === 400 || dupRes.statusCode === 409 || dupRes.body.success === false, 'Duplicate application rejected');

  // -------------------------------------------------------------
  // TEST 3: Super Admin Authentication & Dashboard Metrics
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 3] Super Admin Authentication & Dashboard Metrics...');
  const adminLoginRes = await makeRequest('POST', '/api/auth/verify', {
    email: 'sameer.centric@gmail.com',
    password: process.env.PORTAL_ADMIN_PASSWORD || 'Sameer1234!@#',
  });

  assert(adminLoginRes.statusCode === 200, 'Super Admin login returned 200 OK');
  assert(adminLoginRes.body.success === true, 'Super Admin login authenticated successfully');
  assert(adminLoginRes.body.role === 'admin', 'Role is admin');
  assert(adminLoginRes.body.redirectUrl === '/admin/dashboard', 'Super Admin redirected to /admin/dashboard');

  adminCookies = adminLoginRes.cookies;

  const adminMetricsRes = await makeRequest('GET', '/api/admin/metrics', null, adminCookies);
  assert(adminMetricsRes.statusCode === 200, 'GET /api/admin/metrics returned 200 OK');
  assert(adminMetricsRes.body.metrics.totalCustomers >= 1, 'Total customers metric is non-zero');
  assert(adminMetricsRes.body.metrics.packageDistribution != null, 'Package distribution metrics present');

  // -------------------------------------------------------------
  // TEST 4: Transactional Customer Activation (Phase 8)
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 4] Transactional One-Click Customer Account Creation & Activation...');
  const activateRes = await makeRequest(
    'POST',
    '/api/admin/activate-customer',
    {
      applicationId: testAppId,
      planId: standardPlan.id,
      billingDuration: 'monthly',
      paymentDetails: {
        amountReceived: 189,
        paymentMethod: 'Bank Wire Transfer',
        paymentReference: `WIRE-CONF-${Date.now()}`,
        adminNotes: 'Settlement confirmed via Chase commercial desk.',
      },
    },
    adminCookies
  );

  assert(activateRes.statusCode === 200, 'POST /api/admin/activate-customer returned 200 OK');
  assert(activateRes.body.success === true, 'Customer activation successful');
  assert(activateRes.body.user != null, 'Customer user account created');
  assert(activateRes.body.subscription != null, 'Customer subscription created');
  assert(activateRes.body.subscription.status === 'active', 'Subscription is active');
  assert(activateRes.body.payment != null, 'Confirmed payment record created');
  assert(activateRes.body.payment.status === 'confirmed', 'Payment status is confirmed');

  testCustomerPassword = activateRes.body.temporaryPassword;
  const newCustomerId = activateRes.body.user.id;
  assert(typeof testCustomerPassword === 'string' && testCustomerPassword.length >= 8, 'Temporary secure password generated');

  // -------------------------------------------------------------
  // TEST 5: Customer Login & Dashboard Access
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 5] Customer Authentication & Tenant Workspace Isolation...');
  const customerLoginRes = await makeRequest('POST', '/api/auth/verify', {
    email: testCustomerEmail,
    password: testCustomerPassword,
  });

  assert(customerLoginRes.statusCode === 200, 'Customer login returned 200 OK');
  assert(customerLoginRes.body.success === true, 'Customer authenticated');
  assert(customerLoginRes.body.role === 'customer', 'Role is customer');
  assert(customerLoginRes.body.redirectUrl === '/app/dashboard', 'Customer redirected to /app/dashboard');

  customerCookies = customerLoginRes.cookies;

  const customerMetricsRes = await makeRequest('GET', '/api/customer/metrics', null, customerCookies);
  assert(customerMetricsRes.statusCode === 200, 'GET /api/customer/metrics returned 200 OK');
  assert(customerMetricsRes.body.metrics.subscription != null, 'Customer subscription snapshot received');
  assert(customerMetricsRes.body.metrics.subscription.planName === 'Standard', 'Subscribed to Standard package');

  // -------------------------------------------------------------
  // TEST 6: Atomic Lead Quota Enforcement & Deduplication
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 6] Atomic Server-Side Lead Quota Deduction & Deduplication...');
  // Fetch available leads pool
  const leadsPoolRes = await makeRequest('GET', '/api/leads');
  assert(leadsPoolRes.body.success === true && leadsPoolRes.body.leads.length > 0, 'Leads available in engine');
  const targetLead = leadsPoolRes.body.leads[0];

  const initialConsumed = customerMetricsRes.body.metrics.leadsUsed;

  // Consume Lead
  const saveLeadRes = await makeRequest('POST', '/api/customer/leads', { leadId: targetLead.id }, customerCookies);
  console.log('saveLeadRes status:', saveLeadRes.statusCode, 'body:', saveLeadRes.body, 'targetLead:', targetLead.id);
  assert(saveLeadRes.statusCode === 200, 'POST /api/customer/leads returned 200 OK');
  assert(saveLeadRes.body.success === true, 'Lead saved successfully');

  // Verify Quota decremented
  const afterSaveMetrics = await makeRequest('GET', '/api/customer/metrics', null, customerCookies);
  assert(afterSaveMetrics.body.metrics.leadsUsed === initialConsumed + 1, 'Quota consumption incremented by exactly 1');

  // Test Deduplication: Saving same lead again must NOT deduct quota!
  console.log('  Testing deduplication (zero double-charging)...');
  const duplicateSaveRes = await makeRequest('POST', '/api/customer/leads', { leadId: targetLead.id }, customerCookies);
  assert(duplicateSaveRes.body.success === true, 'Duplicate save returned success');

  const afterDupMetrics = await makeRequest('GET', '/api/customer/metrics', null, customerCookies);
  assert(
    afterDupMetrics.body.metrics.leadsUsed === initialConsumed + 1,
    'Zero double-charging: Quota did not increment on duplicate save'
  );

  // -------------------------------------------------------------
  // TEST 7: Subscription Expiry Automation
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 7] Subscription Expiry Cron Automation...');
  const cronRes = await makeRequest('GET', '/api/cron/subscription-expiry', null, adminCookies);
  assert(cronRes.statusCode === 200, 'GET /api/cron/subscription-expiry returned 200 OK');
  assert(cronRes.body.success === true, 'Expiry evaluation passed');
  assert(typeof cronRes.body.checkedCount === 'number', 'Checked count reported');

  // -------------------------------------------------------------
  // TEST 8: Subscription Renewal Workflow (Phase 10)
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 8] Subscription Renewal Request & Manual Payment Confirmation...');
  const renewRequestRes = await makeRequest(
    'POST',
    '/api/customer/renew',
    {
      action: 'request',
      requestedPlanId: 'plan_professional',
      requestedDuration: 'monthly',
      customerNotes: 'Upgrading to Professional package with 7500 leads quota.',
    },
    customerCookies
  );

  assert(renewRequestRes.statusCode === 200, 'POST /api/customer/renew (request) returned 200 OK');
  assert(renewRequestRes.body.success === true, 'Renewal request registered');
  const renewalId = renewRequestRes.body.renewal.id;

  // Super Admin confirms renewal
  const renewConfirmRes = await makeRequest(
    'POST',
    '/api/customer/renew',
    {
      action: 'confirm',
      renewalId,
      paymentReference: `WIRE-RENEW-${Date.now()}`,
      paymentMethod: 'Bank Wire Transfer',
      notes: 'Corporate upgrade wire cleared.',
    },
    adminCookies
  );

  assert(renewConfirmRes.statusCode === 200, 'POST /api/customer/renew (confirm) returned 200 OK');
  assert(renewConfirmRes.body.success === true, 'Renewal confirmed by admin');
  assert(renewConfirmRes.body.subscription.planName === 'Professional', 'Subscription upgraded to Professional');
  assert(renewConfirmRes.body.subscription.leadQuota === 7500, 'Quota expanded to 7500 leads');
  assert(renewConfirmRes.body.subscription.leadsConsumed === 0, 'Fresh quota reset for new billing cycle');

  // -------------------------------------------------------------
  // TEST 9: Duplicate Application Detection for Registered Customer Email
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 9] Duplicate Application Rejection for Registered Customer Email...');
  const existingCustomerAppRes = await makeRequest('POST', '/api/applications', {
    ...appData,
    email: 'client@gmail.com', // Already registered active customer
  });
  assert(
    existingCustomerAppRes.statusCode === 400 || existingCustomerAppRes.body.success === false,
    'Application with already registered customer email rejected'
  );
  assert(
    typeof existingCustomerAppRes.body.error === 'string' &&
    existingCustomerAppRes.body.error.toLowerCase().includes('already exists'),
    `Error message explains account already exists (Got: "${existingCustomerAppRes.body.error}")`
  );

  // -------------------------------------------------------------
  // TEST 10: Dedicated Password Change & First-Login Setup Flow
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 10] Dedicated Password Change & First-Login Setup Flow...');
  const newPermanentPassword = 'PermanentSecurePass2026!';
  const changePassRes = await makeRequest(
    'POST',
    '/api/auth/change-password',
    {
      userId: newCustomerId,
      newPassword: newPermanentPassword,
    },
    customerCookies
  );
  assert(changePassRes.statusCode === 200, 'POST /api/auth/change-password returned 200 OK');
  assert(changePassRes.body.success === true, 'Permanent password updated successfully');

  // Re-login with new password
  const reLoginRes = await makeRequest('POST', '/api/auth/verify', {
    email: testCustomerEmail,
    password: newPermanentPassword,
  });
  assert(reLoginRes.statusCode === 200, 'Login with new permanent password succeeded');
  assert(reLoginRes.body.mustChangePassword === false, 'mustChangePassword cleared after update');

  // -------------------------------------------------------------
  // TEST 11: Multi-Tenant Customer Payments & Cross-Tenant Security
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 11] Multi-Tenant Customer Payments & Cross-Tenant Security...');
  const custPaymentsRes = await makeRequest('GET', '/api/customer/payments', null, customerCookies);
  assert(custPaymentsRes.statusCode === 200, 'GET /api/customer/payments returned 200 OK');
  assert(Array.isArray(custPaymentsRes.body.payments), 'Customer payments is an array');
  assert(custPaymentsRes.body.payments.length >= 1, 'Customer can view their own payment invoices');
  assert(
    custPaymentsRes.body.payments.every((p) => p.customerId === newCustomerId),
    'Every returned payment strictly belongs to authenticated customer'
  );

  // Customer must be forbidden from accessing admin endpoints
  const forbiddenAdminRes = await makeRequest('GET', '/api/admin/metrics', null, customerCookies);
  assert(forbiddenAdminRes.statusCode === 403, 'Customer forbidden from /api/admin/metrics (403)');

  // -------------------------------------------------------------
  // TEST 12: Expired Subscription Locks Lead Discovery (Phase 9 & 14)
  // -------------------------------------------------------------
  console.log('\n▶ [TEST 12] Expired Subscription Lead Discovery Locking...');
  // Artificially extend expiry to past date via admin subscription adjustment
  const expireSubRes = await makeRequest(
    'PUT',
    '/api/admin/subscriptions',
    {
      subscriptionId: activateRes.body.subscription.id,
      action: 'update_status',
      status: 'expired',
      reason: 'Automated test expiry simulation',
    },
    adminCookies
  );
  assert(expireSubRes.statusCode === 200, 'Subscription status marked expired');

  // Customer attempts to discover new leads while expired
  const expiredLeadDiscoveryRes = await makeRequest('GET', '/api/leads', null, customerCookies);
  assert(
    expiredLeadDiscoveryRes.statusCode === 403 || expiredLeadDiscoveryRes.body.isExpired === true,
    'Expired customer blocked from discovering leads (403 Forbidden)'
  );

  console.log('\n============================================================');
  console.log('   🎉 ALL SAMVERO COMMERCIAL SAAS PLATFORM TESTS PASSED!');
  console.log('============================================================\n');
}

runAllTests().catch((err) => {
  console.error('\n❌ Test execution failed with error:', err);
  process.exit(1);
});
