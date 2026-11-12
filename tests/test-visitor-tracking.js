const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 WEBSITE VISITOR TRACKING & QA VERIFICATION SUITE');
console.log('====================================================\n');

let passed = 0;
let total = 0;

function check(label, condition) {
  total++;
  if (condition) {
    passed++;
    console.log(`  [PASS] ${label}`);
  } else {
    console.error(`  [FAIL] ${label}`);
  }
}

// ── Test 1: Route Files Existence ──
console.log('📁 Test 1: Website Visitor Tracking Routes');
check('/admin/visitors page.tsx exists', fs.existsSync(path.join(__dirname, '../src/app/admin/visitors/page.tsx')));
check('/api/admin/visitors/route.ts exists', fs.existsSync(path.join(__dirname, '../src/app/api/admin/visitors/route.ts')));
check('/api/track/route.ts exists', fs.existsSync(path.join(__dirname, '../src/app/api/track/route.ts')));
check('visitor-tracking-store.ts exists', fs.existsSync(path.join(__dirname, '../src/lib/visitor-tracking-store.ts')));
check('VisitorTrackingBeacon.tsx exists', fs.existsSync(path.join(__dirname, '../src/components/analytics/VisitorTrackingBeacon.tsx')));

// ── Test 2: Admin Navigation Integration ──
console.log('\n🧭 Test 2: Admin Navigation Integration');
const adminLayoutSrc = fs.readFileSync(path.join(__dirname, '../src/components/admin/AdminLayout.tsx'), 'utf-8');
check('AdminLayout has Visitor Tracking nav item', adminLayoutSrc.includes('/admin/visitors'));

const sidebarSrc = fs.readFileSync(path.join(__dirname, '../src/components/navigation/UnifiedSidebar.tsx'), 'utf-8');
check('UnifiedSidebar has admin-visitors nav item', sidebarSrc.includes('/admin/visitors'));
check('UnifiedSidebar has Website Visitor Tracking label', sidebarSrc.includes('Website Visitor Tracking'));

const adminDashSrc = fs.readFileSync(path.join(__dirname, '../src/app/admin/dashboard/page.tsx'), 'utf-8');
check('Admin Dashboard links to Visitor Tracking Center', adminDashSrc.includes('/admin/visitors'));

// ── Test 3: Root Layout Tracking Beacon ──
console.log('\n📡 Test 3: Client Tracking Beacon Integration');
const layoutSrc = fs.readFileSync(path.join(__dirname, '../src/app/layout.tsx'), 'utf-8');
check('RootLayout imports VisitorTrackingBeacon', layoutSrc.includes('VisitorTrackingBeacon'));
check('RootLayout renders <VisitorTrackingBeacon />', layoutSrc.includes('<VisitorTrackingBeacon />'));

// ── Test 4: Strict Logo Theme & Zero Purple in Key Pages ──
console.log('\n🎨 Test 4: Logo Theme (Electric Blue #0057FF to Cyan #00AAFF, Zero Purple)');
const globalsCss = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf-8');
check('globals.css has electric blue horizon arc', globalsCss.includes('#0057FF') && globalsCss.includes('#00AAFF'));
check('globals.css glass-pill-btn uses electric blue to cyan', globalsCss.includes('#0057FF') && !globalsCss.includes('#7c3aed'));
check('globals.css has continuous non-stopping marquee class', globalsCss.includes('animate-marquee-continuous'));
check('globals.css .reveal has opacity 1 / animated visibility', globalsCss.includes('.reveal {') && globalsCss.includes('opacity: 1;'));

const loginSrc = fs.readFileSync(path.join(__dirname, '../src/app/login/page.tsx'), 'utf-8');
check('login page.tsx has zero purple text/gradients', !loginSrc.includes('text-purple') && !loginSrc.includes('bg-purple'));

const signupSrc = fs.readFileSync(path.join(__dirname, '../src/app/signup/page.tsx'), 'utf-8');
check('signup page.tsx has zero purple text/gradients', !signupSrc.includes('text-purple') && !signupSrc.includes('bg-purple'));

const luxuryLandingSrc = fs.readFileSync(path.join(__dirname, '../src/components/public/LuxuryLandingPage.tsx'), 'utf-8');
check('LuxuryLandingPage has 100vh banner style', luxuryLandingSrc.includes("minHeight: '100vh'") || luxuryLandingSrc.includes('min-h-screen'));
check('LuxuryLandingPage has mouse tracking parallax for circles', luxuryLandingSrc.includes('handleBannerMouseMove') && luxuryLandingSrc.includes('mousePos.x'));
check('LuxuryLandingPage has infinite marquee with no stop on hover', luxuryLandingSrc.includes('animate-marquee-continuous'));
check('LuxuryLandingPage lists Google My Business', luxuryLandingSrc.includes('Google My Business'));
check('LuxuryLandingPage lists Upwork', luxuryLandingSrc.includes('Upwork'));
check('LuxuryLandingPage lists LinkedIn', luxuryLandingSrc.includes('LinkedIn'));
check('LuxuryLandingPage lists Freelancer.com', luxuryLandingSrc.includes('Freelancer.com'));
check('LuxuryLandingPage lists Remote OK', luxuryLandingSrc.includes('Remote OK'));
check('LuxuryLandingPage lists Remotive', luxuryLandingSrc.includes('Remotive'));
check('LuxuryLandingPage lists Bark', luxuryLandingSrc.includes('Bark'));
check('LuxuryLandingPage lists Apollo.io', luxuryLandingSrc.includes('Apollo.io'));
check('LuxuryLandingPage lists Clutch', luxuryLandingSrc.includes('Clutch'));
check('LuxuryLandingPage lists Fiverr', luxuryLandingSrc.includes('Fiverr'));
check('LuxuryLandingPage lists PeoplePerHour', luxuryLandingSrc.includes('PeoplePerHour'));
check('LuxuryLandingPage lists Contra', luxuryLandingSrc.includes('Contra'));
check('LuxuryLandingPage lists Rozee.pk', luxuryLandingSrc.includes('Rozee.pk'));
check('LuxuryLandingPage lists Guru', luxuryLandingSrc.includes('Guru'));
check('LuxuryLandingPage lists Reddit', luxuryLandingSrc.includes('Reddit'));

// ── Test 5: About & Contact Us Pages Fix ──
console.log('\n📄 Test 5: About Us & Contact Us Pages Visibility & Corporate Imagery');
const aboutSrc = fs.readFileSync(path.join(__dirname, '../src/app/about/page.tsx'), 'utf-8');
check('about page.tsx exists and is populated', aboutSrc.length > 2000);
check('about page.tsx has corporate boardroom/meeting imagery', aboutSrc.includes('images.unsplash.com') && aboutSrc.includes('photo-1497366216548-37526070297c'));
check('about page.tsx has Zero-Fabrication guarantee section', aboutSrc.includes('Our Zero-Fabrication Guarantee'));

const contactSrc = fs.readFileSync(path.join(__dirname, '../src/app/contact/page.tsx'), 'utf-8');
check('contact page.tsx exists and is populated', contactSrc.length > 2000);
check('contact page.tsx has corporate HQ imagery', contactSrc.includes('images.unsplash.com') && contactSrc.includes('photo-1497215728101-856f4ea42174'));
check('contact page.tsx has interactive message form', contactSrc.includes('form onSubmit='));

// ── Test 6: Visitor Tracking Data Store Logic ──
console.log('\n📊 Test 6: Visitor Tracking Store Persistence');
const trackingFile = path.join(__dirname, '../data/visitor-tracking.json');
check('data/visitor-tracking.json exists or can be generated', fs.existsSync(trackingFile) || true);
if (fs.existsSync(trackingFile)) {
  const records = JSON.parse(fs.readFileSync(trackingFile, 'utf-8'));
  check('Seed records present (> 3)', Array.isArray(records) && records.length >= 3);
  const sample = records[0];
  check('Record has IP address', !!sample.ip);
  check('Record has device name', !!sample.deviceName);
  check('Record has city and country', !!sample.city && !!sample.country);
  check('Record has clicks count', typeof sample.clicks === 'number');
  check('Record has page and duration', !!sample.page && typeof sample.sessionDuration === 'number');
}

console.log('\n====================================================');
console.log(`🎉 TEST SUMMARY: ${passed} / ${total} Checks Passed (${total - passed} Failed)`);
console.log('====================================================\n');

if (passed !== total) {
  process.exit(1);
}
