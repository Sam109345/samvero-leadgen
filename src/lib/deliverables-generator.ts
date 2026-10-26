import { 
  Lead, 
  DeliverablesPackage, 
  MobileAppDeliverable, 
  GraphicDesignDeliverable, 
  SoftwareSowDeliverable,
  MobileAppScreen,
  LogoConcept
} from '@/types';
import { generateClientWebsite } from './website-generator';

export function generateDeliverablesPackage(lead: Lead): DeliverablesPackage {
  const businessName = lead.businessName || lead.title || 'Executive Client';
  const city = lead.city || 'Metropolis';
  const category = lead.category || 'Local Business';
  const isDentalOrMedical = category === 'Local Business' && (businessName.toLowerCase().includes('clinic') || businessName.toLowerCase().includes('dental') || businessName.toLowerCase().includes('aesthetics'));
  const isWebOrTech = category === 'Web Development' || category === 'Digital Marketing' || lead.title.toLowerCase().includes('tech') || lead.title.toLowerCase().includes('saas');
  const isEcommerce = businessName.toLowerCase().includes('chai') || businessName.toLowerCase().includes('tea') || businessName.toLowerCase().includes('marble') || category === 'Graphic Design';

  // 1. Website (14-15 Comprehensive Sections)
  const website = lead.generatedWebsite || generateClientWebsite(lead);

  // 2. Mobile App (User Directive: EXACTLY 13-14 SCREENS WITH PROPER IMAGES, ICONS & COMPLETE UI)
  const appScreens: MobileAppScreen[] = [
    // --- STAGE 1: ONBOARDING & AUTH (Screens 1 to 4) ---
    {
      id: 'screen-01-splash',
      screenNumber: 1,
      title: 'Brand Splash & Reveal',
      subtitle: 'Animated luxury brand mark & high-res welcoming visual',
      screenType: 'splash',
      categoryTag: 'Onboarding & Auth',
      visualType: 'splash-hero',
      headerText: businessName,
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
        : isEcommerce 
        ? 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-slate-950',
      accentColor: '#007FED',
      elements: [
        { type: 'avatar', label: businessName.substring(0, 2).toUpperCase(), badge: 'Verified 2026' },
        { type: 'stat', label: 'Operating Excellence', detail: lead.businessAge?.label || 'Established' },
        { type: 'button', label: 'Explore Client Portal &rarr;', detail: 'Biometric Enabled' },
      ],
    },
    {
      id: 'screen-02-curated-discovery',
      screenNumber: 2,
      title: 'Curated Discovery & Home',
      subtitle: 'Featured editorial banners, personalized recommendations & quick search',
      screenType: 'discovery',
      categoryTag: 'Onboarding & Auth',
      visualType: 'curated-discovery',
      headerText: `Welcome to ${businessName.split(' ')[0]}`,
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
        : isEcommerce 
        ? 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-900 via-slate-850 to-slate-950',
      accentColor: '#007FED',
      elements: [
        { type: 'banner', label: 'Exclusive Private Client Tier', detail: 'Curated for discerning clients worldwide' },
        { type: 'card', label: isDentalOrMedical ? 'Swiss Porcelain Smile Makeover' : isEcommerce ? 'Artisan Reserve Collections' : 'High-Retention Creative Sprints', badge: 'Top Tier' },
        { type: 'stat', label: 'Client Trust Rating', detail: '★ 5.0 (420+ Reviews)' },
      ],
    },
    {
      id: 'screen-03-visual-catalog',
      screenNumber: 3,
      title: 'Visual Catalog & Services',
      subtitle: '2-Column high-res visual grid with transparent pricing & instant actions',
      screenType: 'catalog',
      categoryTag: 'Core Experience',
      visualType: 'product-catalog',
      headerText: isEcommerce ? 'Signature Collections' : 'Specialized Capabilities',
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
        : isEcommerce 
        ? 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80',
      secondaryImageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
        : isEcommerce 
        ? 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-slate-950',
      accentColor: '#007FED',
      elements: [
        { type: 'card', label: isDentalOrMedical ? 'Porcelain Veneers & Laminates' : isEcommerce ? 'Imperial Reserve (250g Tin)' : '4K Cinematic Video Reel', detail: isDentalOrMedical ? 'PKR 125,000 / arch' : isEcommerce ? 'PKR 2,450' : '$1,200', badge: 'Bestseller' },
        { type: 'card', label: isDentalOrMedical ? 'Laser Teeth Whitening Suite' : isEcommerce ? 'Botanical Infusion Pack' : 'Motion Graphics Branding', detail: isDentalOrMedical ? 'PKR 35,000' : isEcommerce ? 'PKR 1,850' : '$850', badge: 'Featured' },
      ],
    },
    {
      id: 'screen-04-detail-showcase',
      screenNumber: 4,
      title: '360 Spotlight & Deep-Dive',
      subtitle: 'High-res image carousel, laboratory certifications & ingredient purity',
      screenType: 'detail',
      categoryTag: 'Core Experience',
      visualType: 'detail-showcase',
      headerText: isEcommerce ? 'Imperial Reserve 360' : 'Swiss Porcelain Architecture',
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
        : isEcommerce 
        ? 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-900 via-blue-950 to-slate-950',
      accentColor: '#38BDF8',
      elements: [
        { type: 'stat', label: 'Optical Balance & Longevity', detail: '25-Year Written Warranty' },
        { type: 'list', label: '100% Biocompatible Materials', detail: 'Certified Swiss & German Dental Grade' },
        { type: 'button', label: 'Instant Booking / Add to Bag', detail: 'Priority Delivery' },
      ],
    },

    // --- STAGE 2: CLINICAL PROOF & SPECIALIST PITCH (Screens 5 to 7) ---
    {
      id: 'screen-05-before-after',
      screenNumber: 5,
      title: 'Before & After Transformations',
      subtitle: 'Interactive side-by-side comparison with real clinical outcome data',
      screenType: 'case_study',
      categoryTag: 'Core Experience',
      visualType: 'before-after-split',
      headerText: 'Verified Clinical Outcomes',
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      secondaryImageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-slate-950',
      accentColor: '#10B981',
      elements: [
        { type: 'banner', label: 'Case Study: Full Arch Makeover', detail: '100% Patient Confidence Restored' },
        { type: 'stat', label: 'Treatment Duration', detail: '2 Sessions (Painless Micro-Anesthesia)' },
        { type: 'button', label: 'Schedule Digital Smile Simulation', detail: 'Free 3D Scan' },
      ],
    },
    {
      id: 'screen-06-video-consultation',
      screenNumber: 6,
      title: 'Virtual Consultation & Pitch',
      subtitle: 'Direct high-definition video brief from the clinic director / creative lead',
      screenType: 'video',
      categoryTag: 'Core Experience',
      visualType: 'video-player',
      headerText: 'Consultation Briefing',
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-rose-950 to-slate-950',
      accentColor: '#F43F5E',
      elements: [
        { type: 'badge', label: 'HD 4K Video Briefing', badge: '3:45 mins' },
        { type: 'card', label: isDentalOrMedical ? 'Dr. Zeeshan Ali (AACD Fellow)' : 'Lead Creative Director', detail: 'Walkthrough of customized protocol & milestones' },
        { type: 'button', label: 'Play Video Consultation &bull; 4K', detail: 'Subtitles Available' },
      ],
    },
    {
      id: 'screen-07-interactive-calendar',
      screenNumber: 7,
      title: 'Interactive Slot Calendar',
      subtitle: 'Live time-slot selector with specialist synchronization',
      screenType: 'calendar',
      categoryTag: 'Booking & Flow',
      visualType: 'interactive-calendar',
      headerText: 'Select Consultation Time',
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-slate-950',
      accentColor: '#007FED',
      elements: [
        { type: 'stat', label: 'Next Available Opening', detail: 'Tomorrow &bull; 11:30 AM' },
        { type: 'card', label: 'Slot 1: 11:30 AM - 12:15 PM', badge: 'Available' },
        { type: 'card', label: 'Slot 2: 03:00 PM - 03:45 PM', badge: 'VIP FastTrack' },
        { type: 'button', label: 'Lock Preferred Slot', detail: 'Direct Confirmation' },
      ],
    },

    // --- STAGE 3: BOOKING, PACKAGES & CHECKOUT (Screens 8 to 10) ---
    {
      id: 'screen-08-suite-package',
      screenNumber: 8,
      title: 'Treatment Suites & Tiers',
      subtitle: 'Transparent package comparison with luxury inclusions & SLA',
      screenType: 'packages',
      categoryTag: 'Booking & Flow',
      visualType: 'suite-package',
      headerText: 'Bespoke Signature Suite',
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-900 via-indigo-950 to-slate-950',
      accentColor: '#6366F1',
      elements: [
        { type: 'card', label: 'Signature Bespoke Tier', detail: isDentalOrMedical ? 'PKR 125,000 (Full Aesthetic Smile)' : '$3,500 (Web + Mobile App)', badge: 'Most Popular' },
        { type: 'list', label: '3D Simulation + Dual Laser Whitening', detail: 'VIP Priority Scheduling Included' },
        { type: 'button', label: 'Proceed to 1-Click Checkout', detail: 'Zero Hidden Fees' },
      ],
    },
    {
      id: 'screen-09-apple-pay',
      screenNumber: 9,
      title: 'Apple Pay 1-Click Checkout',
      subtitle: 'Biometric FaceID payment authorization with bank-grade encryption',
      screenType: 'checkout',
      categoryTag: 'Booking & Flow',
      visualType: 'apple-pay-sheet',
      headerText: 'Confirm Payment',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-slate-950',
      accentColor: '#10B981',
      elements: [
        { type: 'card', label: 'Apple Pay &bull; Card ending in 4421', detail: 'Double Click Side Button to Pay', badge: 'FaceID' },
        { type: 'stat', label: 'Total Investment', detail: isDentalOrMedical ? 'PKR 125,000' : '$3,500' },
        { type: 'banner', label: '256-Bit SSL Encrypted', detail: 'Zero Card Data Stored on Server' },
      ],
    },
    {
      id: 'screen-10-qr-confirmation',
      screenNumber: 10,
      title: 'Reservation Confirmed',
      subtitle: 'Digital booking confirmation with Apple Wallet pass & security QR code',
      screenType: 'confirmation',
      categoryTag: 'Booking & Flow',
      visualType: 'qr-confirmation',
      headerText: 'Booking Confirmed!',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-emerald-950 to-slate-950',
      accentColor: '#10B981',
      elements: [
        { type: 'badge', label: `Pass #${lead.id.toUpperCase()}-2026`, badge: 'Active Pass' },
        { type: 'card', label: 'Add to Apple Wallet', detail: 'Automatic Calendar Reminders & Directions' },
        { type: 'button', label: 'View Real-Time Tracker &rarr;', detail: 'Track Appointment Desk' },
      ],
    },

    // --- STAGE 4: REAL-TIME TRACKING, CONCIERGE & ACCOUNT (Screens 11 to 14) ---
    {
      id: 'screen-11-gps-tracker',
      screenNumber: 11,
      title: 'Real-Time Concierge Tracker',
      subtitle: 'GPS live map tracking for delivery, doctor arrival & appointment check-in',
      screenType: 'tracker',
      categoryTag: 'Account & Support',
      visualType: 'gps-tracker',
      headerText: 'Concierge Radar',
      imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
      secondaryImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-slate-950',
      accentColor: '#007FED',
      elements: [
        { type: 'stat', label: 'Appointment Status', detail: 'Specialist Ready &bull; On Time' },
        { type: 'card', label: `Destination: ${lead.address || city}`, detail: 'Valet Parking Reserved' },
        { type: 'button', label: 'One-Tap Navigation (Google Maps)', detail: 'Direct Route' },
      ],
    },
    {
      id: 'screen-12-concierge-chat',
      screenNumber: 12,
      title: 'WhatsApp Concierge Desk',
      subtitle: 'Direct 24/7 private messaging with practice manager / client lead',
      screenType: 'chat',
      categoryTag: 'Account & Support',
      visualType: 'concierge-chat',
      headerText: 'Direct VIP Concierge',
      imageUrl: isDentalOrMedical 
        ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-emerald-950 to-slate-950',
      accentColor: '#10B981',
      elements: [
        { type: 'card', label: 'Clinic Coordinator', detail: '"Hello! Your digital smile plan is ready. Feel free to text me any questions."' },
        { type: 'stat', label: 'Average Response Time', detail: '< 2 Minutes via WhatsApp' },
        { type: 'button', label: 'Open Official WhatsApp Chat', detail: lead.contact.phone || 'Direct Desk' },
      ],
    },
    {
      id: 'screen-13-vip-rewards',
      screenNumber: 13,
      title: 'VIP Loyalty Passport',
      subtitle: 'Golden digital membership card, reward balance & priority perks',
      screenType: 'rewards',
      categoryTag: 'Account & Support',
      visualType: 'vip-rewards',
      headerText: 'Founder Club Card',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-amber-950 to-slate-950',
      accentColor: '#F59E0B',
      elements: [
        { type: 'badge', label: 'Tier: Gold Concierge Patron', badge: '4,500 Pts' },
        { type: 'card', label: 'Complimentary Annual Laser Touch-Up', detail: 'Unlocked for current period' },
        { type: 'stat', label: 'Next Reward Milestone', detail: '500 pts to Platinum Lounge' },
      ],
    },
    {
      id: 'screen-14-obsidian-settings',
      screenNumber: 14,
      title: 'Obsidian App Settings & SOS',
      subtitle: 'Biometric FaceID lock, dark mode toggle & emergency hotline',
      screenType: 'settings',
      categoryTag: 'Account & Support',
      visualType: 'obsidian-settings',
      headerText: 'Security & Profile Vault',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-slate-950',
      accentColor: '#007FED',
      elements: [
        { type: 'toggle', label: 'Obsidian Pure Dark Theme', badge: 'Active' },
        { type: 'toggle', label: 'Require FaceID on App Launch', badge: 'Enabled' },
        { type: 'list', label: 'Emergency Contact Line', detail: lead.contact.phone || '24/7 Desk' },
        { type: 'card', label: 'SAMVERO App Engine v4.8', detail: '256-bit encrypted end-to-end' },
      ],
    },
  ];

  const mobileApp: MobileAppDeliverable = {
    appName: `${businessName.split(' ')[0]} Executive Hub`,
    tagline: `Official 14-Screen Native Mobile Experience for ${businessName}`,
    targetPlatform: 'iOS (App Store) & Android (Google Play)',
    screens: appScreens,
  };

  // 3. Graphic Design & Brand Kit (EXACTLY 6 BESPOKE VECTOR SVG LOGO CONCEPTS WITH COMPANY NAME & TEXT)
  const initials = businessName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'SV';
  const displayBrand = businessName.length > 24 ? businessName.substring(0, 22) + '...' : businessName;

  const logoConcepts: LogoConcept[] = [
    // CONCEPT 1: Modern Geometric Monogram & Architectural Mark
    {
      id: 'concept-1-geometric',
      conceptName: 'The Precision Monogram',
      conceptSubtitle: 'Modern Geometric Architectural Mark',
      style: 'Minimalist Geometric / Swiss Optical Balance',
      symbol: initials,
      mood: 'Prestigious, Confident, Modern High-Tech',
      primaryColor: '#007FED',
      secondaryColor: '#005bb5',
      typography: 'Outfit Bold + Inter Medium',
      description: `Constructed from precise mathematical geometry, interlocking the monogram "${initials}" with a dynamic upward ascent vector and the full company name "${businessName.toUpperCase()}" set in bold tracking.`,
      svgMarkup: `<svg viewBox="0 0 380 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-c1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#38BDF8"/>
            <stop offset="0.5" stop-color="#007FED"/>
            <stop offset="1" stop-color="#1D4ED8"/>
          </linearGradient>
        </defs>
        <rect x="10" y="15" width="100" height="100" rx="26" fill="url(#grad-c1)"/>
        <path d="M40 85V45L60 68L80 45V85" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="60" cy="84" r="5" fill="#38BDF8"/>
        <text x="130" y="65" font-family="'Outfit', sans-serif" font-weight="900" font-size="24" letter-spacing="1" fill="#FFFFFF">${displayBrand.toUpperCase()}</text>
        <text x="130" y="90" font-family="'Inter', sans-serif" font-weight="700" font-size="10" letter-spacing="4" fill="#38BDF8">ARCHITECTURAL MONOGRAM &bull; EST. 2026</text>
      </svg>`,
    },

    // CONCEPT 2: The Sovereign Crest & Refractive Shield
    {
      id: 'concept-2-luxury',
      conceptName: 'The Sovereign Crest',
      conceptSubtitle: 'Refractive Hexagonal Shield & Trust Node',
      style: 'Dynamic Ribbon / High-Ticket Elegance',
      symbol: '✦',
      mood: 'Organic, Bespoke, World-Class Distinction',
      primaryColor: '#06B6D4',
      secondaryColor: '#0284C7',
      typography: 'Plus Jakarta Sans Bold + Inter',
      description: `A continuous fluid refractive shield conveying sovereign client trust, paired with crisp corporate typography suited for luxury signage, mobile apps, and international enterprise portfolios.`,
      svgMarkup: `<svg viewBox="0 0 380 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-c2" x1="10" y1="15" x2="110" y2="115" gradientUnits="userSpaceOnUse">
            <stop stop-color="#34D399"/>
            <stop offset="0.5" stop-color="#059669"/>
            <stop offset="1" stop-color="#064E3B"/>
          </linearGradient>
        </defs>
        <rect x="10" y="15" width="100" height="100" rx="26" fill="#0B132B" stroke="#059669" stroke-width="2"/>
        <path d="M60 35 L88 50 L88 80 L60 95 L32 80 L32 50 Z" fill="url(#grad-c2)"/>
        <circle cx="60" cy="65" r="7" fill="#FFFFFF"/>
        <text x="130" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" letter-spacing="1" fill="#FFFFFF">${displayBrand.toUpperCase()}</text>
        <text x="130" y="90" font-family="'Inter', sans-serif" font-weight="700" font-size="10" letter-spacing="4" fill="#34D399">SOVEREIGN TRUST &bull; PRIVATE CLIENT SUITE</text>
      </svg>`,
    },

    // CONCEPT 3: The Synergy Nexus (Fluid Infinity Loop)
    {
      id: 'concept-3-nexus',
      conceptName: 'The Synergy Nexus',
      conceptSubtitle: 'Continuous Optical Ribbon & Acquisition Node',
      style: 'Continuous Ribbon / High-Velocity Scale',
      symbol: '∞',
      mood: 'Innovative, Exponential, Kinetic Authority',
      primaryColor: '#8B5CF6',
      secondaryColor: '#6D28D9',
      typography: 'Outfit Black + Plus Jakarta Sans',
      description: `An infinite continuous ribbon node representing client lead acceleration, synchronized data flows, and compounding enterprise valuation.`,
      svgMarkup: `<svg viewBox="0 0 380 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-c3" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C084FC"/>
            <stop offset="0.5" stop-color="#8B5CF6"/>
            <stop offset="1" stop-color="#4C1D95"/>
          </linearGradient>
        </defs>
        <rect x="10" y="15" width="100" height="100" rx="26" fill="#0F172A"/>
        <path d="M38 65C38 52 48 42 60 42C72 42 82 52 82 65C82 78 72 88 60 88C48 88 38 78 38 65Z" stroke="url(#grad-c3)" stroke-width="7"/>
        <path d="M60 42L78 78" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
        <text x="130" y="65" font-family="'Outfit', sans-serif" font-weight="900" font-size="24" letter-spacing="1" fill="#FFFFFF">${displayBrand.toUpperCase()}</text>
        <text x="130" y="90" font-family="'Inter', sans-serif" font-weight="700" font-size="10" letter-spacing="4" fill="#C084FC">SYNERGY NEXUS &bull; INTELLIGENCE ENGINE</text>
      </svg>`,
    },

    // CONCEPT 4: The Apex Monolith (Ascending Tier-1 Gold Pillars)
    {
      id: 'concept-4-monolith',
      conceptName: 'The Apex Monolith',
      conceptSubtitle: 'Ascending Triple Pillars & Tier-1 Capital',
      style: 'Isometric Architectural / Luxury Gold',
      symbol: '🏛',
      mood: 'Authoritative, Enduring, Sovereign Prestige',
      primaryColor: '#D97706',
      secondaryColor: '#B45309',
      typography: 'Cinzel Decorative + Montserrat',
      description: `Three monumental ascending pillars in burnished gold, expressing institutional strength, legal and architectural distinction, and generational brand equity.`,
      svgMarkup: `<svg viewBox="0 0 380 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-c4" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FDE047"/>
            <stop offset="0.5" stop-color="#D97706"/>
            <stop offset="1" stop-color="#78350F"/>
          </linearGradient>
        </defs>
        <rect x="10" y="15" width="100" height="100" rx="26" fill="#18181B" stroke="#D97706" stroke-width="2"/>
        <rect x="36" y="60" width="10" height="30" rx="2" fill="url(#grad-c4)"/>
        <rect x="55" y="45" width="10" height="45" rx="2" fill="url(#grad-c4)"/>
        <rect x="74" y="32" width="10" height="58" rx="2" fill="url(#grad-c4)"/>
        <text x="130" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" letter-spacing="1" fill="#FFFFFF">${displayBrand.toUpperCase()}</text>
        <text x="130" y="90" font-family="'Inter', sans-serif" font-weight="700" font-size="10" letter-spacing="4" fill="#FBBF24">APEX MONOLITH &bull; TIER-1 VENTURES</text>
      </svg>`,
    },

    // CONCEPT 5: The Luminary Diamond (Haute Couture Optical Prism)
    {
      id: 'concept-5-diamond',
      conceptName: 'The Luminary Diamond',
      conceptSubtitle: 'Multi-Faceted Refraction & Aesthetic Atelier',
      style: 'Minimalist Optical Prism / Haute Couture',
      symbol: '💎',
      mood: 'Radiant, Flawless, Aesthetic Superiority',
      primaryColor: '#EC4899',
      secondaryColor: '#DB2777',
      typography: 'Playfair Display + Plus Jakarta Sans',
      description: `A multi-faceted geometric diamond with light-refracting symmetry. Tailored for aesthetic surgery practices, luxury perfumeries, and world-class design ateliers.`,
      svgMarkup: `<svg viewBox="0 0 380 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-c5" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F472B6"/>
            <stop offset="0.5" stop-color="#EC4899"/>
            <stop offset="1" stop-color="#831843"/>
          </linearGradient>
        </defs>
        <rect x="10" y="15" width="100" height="100" rx="26" fill="#0B1322"/>
        <path d="M60 35L84 55L60 95L36 55Z" fill="url(#grad-c5)"/>
        <path d="M48 55L60 35L72 55L60 95Z" fill="#FDF2F8" fill-opacity="0.3"/>
        <text x="130" y="65" font-family="'Playfair Display', serif" font-weight="800" font-size="24" letter-spacing="1" fill="#FFFFFF">${displayBrand.toUpperCase()}</text>
        <text x="130" y="90" font-family="'Inter', sans-serif" font-weight="700" font-size="10" letter-spacing="4" fill="#F472B6">LUMINARY ATELIER &bull; HAUTE DISTINCTION</text>
      </svg>`,
    },

    // CONCEPT 6: The Kinetic Horizon (High-Velocity Aerodynamic Chevrons)
    {
      id: 'concept-6-kinetic',
      conceptName: 'The Kinetic Horizon',
      conceptSubtitle: 'Forward Velocity Chevrons & Scalable Reach',
      style: 'Aerodynamic Vector / Global Market Velocity',
      symbol: '⚡',
      mood: 'Dynamic, Rapid, Global Market Velocity',
      primaryColor: '#3B82F6',
      secondaryColor: '#1D4ED8',
      typography: 'Outfit Black + Inter Regular',
      description: `Dual forward-thrusting velocity chevrons capturing momentum and real-time execution across global markets (Pakistan, UAE, US, and UK).`,
      svgMarkup: `<svg viewBox="0 0 380 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-c6" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#60A5FA"/>
            <stop offset="0.5" stop-color="#2563EB"/>
            <stop offset="1" stop-color="#1E3A8A"/>
          </linearGradient>
        </defs>
        <rect x="10" y="15" width="100" height="100" rx="26" fill="#090D16" stroke="#2563EB" stroke-width="1.5"/>
        <path d="M40 45L60 65L40 85" stroke="url(#grad-c6)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M60 45L80 65L60 85" stroke="#60A5FA" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="130" y="65" font-family="'Outfit', sans-serif" font-weight="900" font-size="24" letter-spacing="1" fill="#FFFFFF">${displayBrand.toUpperCase()}</text>
        <text x="130" y="90" font-family="'Inter', sans-serif" font-weight="700" font-size="10" letter-spacing="4" fill="#60A5FA">KINETIC HORIZON &bull; GLOBAL LEAD VELOCITY</text>
      </svg>`,
    },
  ];

  const graphicDesign: GraphicDesignDeliverable = {
    brandName: businessName,
    primaryColor: '#007FED',
    secondaryColor: '#0B132B',
    accentColor: '#38BDF8',
    typographyPrimary: 'Outfit Bold',
    typographySecondary: 'Inter',
    logoConcepts,
    collateralMockups: [
      {
        title: `${businessName} Executive Brand Kit`,
        type: 'Print & Digital Asset',
        headline: `World-Class Standards & Proven Commercial Distinction`,
        bodyText: `Engineered for luxury consultations in ${city}, ${lead.country}. Features 6 mathematically balanced vector SVG concepts with full brand typography, transparent dark/light assets, and multi-channel marketing collateral.`,
        callToAction: `Book Your Private Session: ${lead.contact.phone || '+971 4 0000000'}`,
      },
    ],
  };

  // 4. Software SOW (Enterprise Scope of Work)
  const softwareSow: SoftwareSowDeliverable = {
    projectTitle: `${businessName} &bull; Enterprise Digital Architecture & Deployment SOW`,
    executiveSummary: `This Scope of Work (SOW) outlines the end-to-end technical roadmap for deploying ${businessName}'s digital infrastructure, including Next.js 14 App Router, PostgreSQL database modeling, and automated customer booking.`,
    recommendedStack: [
      'Next.js 14 (App Router & Server Actions)',
      'TypeScript 5.6',
      'Tailwind CSS & Glassmorphism Design System',
      'PostgreSQL & Prisma ORM',
      'Vercel Edge Network & Docker Containers',
      'Twilio / WhatsApp Business Cloud API',
    ],
    milestones: [
      {
        title: 'Sprint 1: UI/UX Synthesis & Architecture Blueprint',
        duration: 'Days 1 - 4',
        deliverables: ['Figma interactive component library', 'Database schema modeling', 'API endpoint specification'],
        investment: '30% Milestone Deposit',
      },
      {
        title: 'Sprint 2: Full-Stack Engineering & System Integration',
        duration: 'Days 5 - 10',
        deliverables: ['Next.js App Router front-end', 'Live appointment booking engine', 'WhatsApp notification webhooks'],
        investment: '40% Functional Prototype Milestone',
      },
      {
        title: 'Sprint 3: Security Audits, QA & Production Deployment',
        duration: 'Days 11 - 14',
        deliverables: ['256-bit SSL encryption & HIPAA compliance', 'Custom domain setup & Cloudflare CDN', '30-Day warranty & team handover'],
        investment: '30% Final Handover & SLA',
      },
    ],
    slaGuarantee: '99.9% Production Uptime with 30-Day Post-Launch Bug-Free Warranty, 24/7 Security Monitoring & Complete Intellectual Property Transfer',
  };

  return {
    website,
    mobileApp,
    graphicDesign,
    softwareSow,
  };
}
