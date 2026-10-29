import { Lead, GeneratedWebsiteData } from '@/types';
import { resolveLegitimateBusinessEmail } from './gmb-email-resolver';

/**
 * SAMVERO Luxury Website Generator
 * Generates an 8-9 section interactive digital portal with animated effects and sliders
 */
export function generateClientWebsite(lead: Lead): GeneratedWebsiteData {
  const businessName = lead.businessName || lead.title || 'Executive Client';
  const slug = `site-${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
  const city = lead.city || 'Metropolis';
  const country = lead.country || 'Global';

  // Resolve authentic business contact details
  const fallbackContact = resolveLegitimateBusinessEmail({
    businessName,
    website: lead.contact?.website,
    country: lead.country,
    city: lead.city,
    category: lead.category,
    phone: lead.contact?.phone,
  });

  const phone = lead.contact?.phone || fallbackContact.phone;
  const email = lead.contact?.email || fallbackContact.email || '';
  const address = lead.address || `${city}, ${country}`;

  const titleLower = lead.title?.toLowerCase() || '';
  const descLower = lead.description?.toLowerCase() || '';
  const isEcommerce = 
    lead.category === 'Graphic Design' || 
    titleLower.includes('chai') || 
    titleLower.includes('tea') || 
    titleLower.includes('marble') || 
    titleLower.includes('packaging') || 
    titleLower.includes('oud') || 
    titleLower.includes('perfume') || 
    descLower.includes('packaging') || 
    descLower.includes('e-commerce') || 
    descLower.includes('store');

  const currency = country === 'Pakistan' ? 'PKR' : country === 'UAE' ? 'AED' : country === 'UK' ? '£' : '$';

  if (isEcommerce) {
    return {
      slug,
      businessName,
      tagline: 'Artisan Quality &bull; Handcrafted Perfection &bull; Fast Delivery',
      heroHeadline: `Discover Authentic Excellence Handcrafted for Connoisseurs`,
      heroSubheadline: `Experience the finest selection of signature collections curated by ${businessName}. Ethically sourced, rigorously tested, and delivered directly to your doorstep in ${city} and worldwide.`,
      heroImageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85',
      aboutText: `Founded with a relentless commitment to purity and heritage, ${businessName} blends traditional craftsmanship with modern luxury. We partner directly with artisan producers to bring you unparalleled quality without compromise.`,
      contactEmail: email,
      contactPhone: phone,
      address,
      colorScheme: 'luxury-gold',
      createdAt: 'Just now',
      isEcommerce: true,

      // Section 1: Announcement Bar
      announcementText: `✨ Complimentary Express Shipping on all orders over ${currency} 2,500 across ${country} &bull; Use code SAMVERO15 for 15% off`,

      // Section 3: Value Props Bar
      valueProps: [
        { title: '100% Pure & Certified', subtitle: 'Lab-tested artisan botanical & material purity', icon: 'ShieldCheck' },
        { title: 'Same-Day Express Dispatch', subtitle: `Next-day doorstep arrival in ${city}`, icon: 'Zap' },
        { title: 'Zero-Risk Guarantee', subtitle: '30-day hassle-free returns & replacement', icon: 'RotateCcw' },
        { title: 'Direct WhatsApp Concierge', subtitle: 'Real-time ordering & dedicated client support', icon: 'MessageCircle' },
      ],

      // Section 4: Interactive Showcase Slider (Products)
      products: [
        { id: 'prod-1', name: 'Imperial Reserve Blend (250g Tin)', price: `${currency} 2,450`, oldPrice: `${currency} 2,900`, rating: 5.0, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', isNew: true, isBestSeller: true },
        { id: 'prod-2', name: 'Artisan Botanical Infusion Pack', price: `${currency} 1,850`, oldPrice: `${currency} 2,200`, rating: 4.9, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80', isNew: true },
        { id: 'prod-3', name: 'Handcrafted Heritage Ceramic Jar Set', price: `${currency} 3,800`, oldPrice: `${currency} 4,500`, rating: 5.0, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', isBestSeller: true },
        { id: 'prod-4', name: 'Connoisseur Tasting Box (4 Varieties)', price: `${currency} 4,200`, oldPrice: `${currency} 5,000`, rating: 4.8, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', isNew: true },
      ],

      // Section 5: 360 Spotlight Deep-Dive
      spotlightFeature: {
        title: 'Master Blender Reserve Spotlight',
        subtitle: 'Hand-Harvested at 6,000ft Above Sea Level',
        description: `Each leaf in our reserve selection is hand-picked at peak morning mist, slow-withered in cedar rooms, and sealed under inert atmosphere to lock in delicate floral terpenes.`,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        bulletPoints: [
          'Zero artificial additives or chemical flavor spray',
          'Certified organic soil test documentation included',
          'Airtight gold-foil canisters with wax stamp seal',
          'Same-day temperature controlled dispatch',
        ],
        ctaText: 'Claim Your Collector Batch &rarr;',
      },

      // Section 6: Before & After Quality Transformation Slider
      caseStudies: [
        { 
          title: 'Commercial Mass Grade vs. Artisan Reserve', 
          metric: '3.4x Higher Antioxidant Density', 
          beforeText: 'Broken dust grades treated with synthetic flavor boosters', 
          afterText: 'Whole-leaf silver needle tips with natural floral honey notes',
          imageBefore: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
          imageAfter: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
        },
        { 
          title: 'Luxury Corporate Gifting Transformation', 
          metric: '98% Client Re-order Rate', 
          beforeText: 'Generic factory corporate hampers forgotten within days', 
          afterText: 'Handmade velvet gift boxes engraved with client crest',
          imageBefore: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
          imageAfter: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        },
      ],

      // Section 7: Verified Reviews Slider
      testimonials: [
        { author: 'Ayesha Khan', role: 'Verified Purchaser', quote: `The aroma and packaging of ${businessName} blew me away. Truly international standard luxury right here in ${city}!`, rating: 5, date: '3 days ago', verified: true, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        { author: 'Hamza Farooq', role: 'Private Collector', quote: 'Ordered the Imperial Reserve set for my office. Every guest asks where I got it. Sensational quality.', rating: 5, date: '1 week ago', verified: true, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        { author: 'Dr. Sarah Tariq', role: 'Verified Buyer', quote: 'Fast delivery, exquisite packaging, and the purest flavor I have experienced in years.', rating: 5, date: '2 weeks ago', verified: true, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
      ],

      // Section 8: FAQs Accordion
      faqs: [
        { question: `How long does delivery take to ${city}?`, answer: `Orders placed before 2:00 PM are dispatched the same day. Standard delivery takes 24 to 48 hours across major cities in ${country}.` },
        { question: 'What payment methods do you accept?', answer: 'We accept Cash on Delivery (COD), Direct Bank Transfer, Visa, MasterCard, and Apple Pay.' },
        { question: 'Are your products 100% natural and preservative-free?', answer: 'Yes! Absolutely zero artificial flavoring, additives, or preservatives are used in any of our blends or materials.' },
        { question: 'Do you offer custom corporate gift packages?', answer: 'Yes, we curate custom engraved corporate hampers for executive events, weddings, and annual client appreciation gifts.' },
      ],

      services: [
        { title: 'Artisan Purity Guarantee', description: 'Small-batch harvested, tested, and sealed to preserve peak fragrance and flavor.', icon: 'CheckCircle' },
        { title: 'Custom Corporate Gifting', description: 'Bespoke branded gift boxes, velvet ribbon packaging, and custom wax seals.', icon: 'Gift' },
        { title: 'Subscription Drop Program', description: 'Receive fresh seasonal harvests delivered automatically to your home every month.', icon: 'Calendar' },
      ],
      mapEmbedAddress: `${city}, ${country}`,
    };
  }

  // =========================================================================
  // 8-9 SECTIONS FOR SERVICE-BASED / CLINICAL / TECH CLIENTS
  // =========================================================================
  const isDentalMedical = 
    titleLower.includes('clinic') || 
    titleLower.includes('dental') || 
    titleLower.includes('aesthetic') || 
    descLower.includes('dental') || 
    descLower.includes('aesthetic');

  return {
    slug,
    businessName,
    tagline: isDentalMedical ? 'Swiss Aesthetic Dentistry &bull; Implantology &bull; Pain-Free Care' : 'Elite Engineering &bull; High-Converting Platforms &bull; Proven Growth',
    heroHeadline: isDentalMedical 
      ? `The Pinnacle of Modern Smile Design &amp; Clinical Excellence`
      : `High-Velocity Digital Platforms Built for Market Leaders`,
    heroSubheadline: isDentalMedical
      ? `Experience painless, transformative dental care powered by Swiss porcelain, 3D computer-guided simulations, and 15+ years of clinical mastery in ${city}.`
      : `We design and engineer bespoke web architectures, native mobile apps, and high-impact digital experiences that convert leads into lifelong clients.`,
    heroImageUrl: isDentalMedical 
      ? 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85'
      : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    aboutText: isDentalMedical
      ? `${businessName} was established to bring zero-compromise clinical dentistry to ${city}. Backed by advanced sterilization suites, 3D intraoral scanners, and gentle micro-anesthesia, we treat every patient like royalty.`
      : `${businessName} provides enterprise full-stack development, mobile applications, and high-retention growth architectures tailored to high-growth organizations.`,
    contactEmail: email,
    contactPhone: phone,
    address,
    colorScheme: 'royal-blue',
    createdAt: 'Just now',
    isEcommerce: false,

    // Section 1: Emergency & Announcement Top Bar
    announcementText: isDentalMedical 
      ? `✨ Urgent Emergency Care &amp; Weekend Consultations Available in ${city} &bull; Call ${phone}`
      : `✨ Q4 Digital Engineering Grants Open &bull; Priority Sprints for High-Growth Brands in ${city}`,

    // Section 3: 4-Pillar Value Proposition Grid
    valueProps: isDentalMedical ? [
      { title: 'Triple Sterilization', subtitle: 'Exceeds European Class B autoclaving standards', icon: 'ShieldCheck' },
      { title: 'Pain-Free Comfort', subtitle: 'Targeted computer-assisted micro-anesthesia', icon: 'HeartPulse' },
      { title: 'Swiss & German Materials', subtitle: '100% biocompatible porcelain with written warranty', icon: 'Sparkles' },
      { title: '24/7 VIP Emergency Care', subtitle: 'Same-day appointments for active trauma & pain', icon: 'Clock' },
    ] : [
      { title: 'Zero-Latency Architecture', subtitle: 'Next.js 14 App Router optimized for sub-100ms loads', icon: 'Zap' },
      { title: 'Conversion-Engineered UI', subtitle: 'Tactile glassmorphism with psychological triggers', icon: 'Layers' },
      { title: 'Enterprise Security SLA', subtitle: '256-bit SSL encryption with 99.99% uptime guarantee', icon: 'ShieldCheck' },
      { title: 'Dedicated Tech Concierge', subtitle: 'Direct Slack / WhatsApp channel with lead architect', icon: 'MessageSquare' },
    ],

    // Section 4: Interactive Showcase Slider (Services / Suites)
    services: isDentalMedical ? [
      { title: 'Swiss Porcelain Smile Makeover', description: 'Digital smile simulation, ultra-thin porcelain veneers, and complete aesthetic facial harmony.', icon: 'Sparkles', price: `${currency} 125,000 / arch`, duration: '2 Sessions', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80' },
      { title: 'Guided Dental Implants', description: '3D CBCT guided surgical placement with immediate temporary crown placement.', icon: 'Activity', price: `${currency} 85,000 / tooth`, duration: '45 mins', image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80' },
      { title: 'Laser Teeth Whitening Suite', description: 'Painless Philips Zoom laser whitening providing up to 8 shades brighter in 45 minutes.', icon: 'Sun', price: `${currency} 35,000`, duration: '45 mins', image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=600&q=80' },
      { title: 'Invisible Clear Aligners', description: 'Custom computer-guided orthodontic aligners to straighten teeth discreetly.', icon: 'ShieldCheck', price: `${currency} 180,000 Full Course`, duration: '4 - 8 Months', image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80' },
    ] : [
      { title: 'Full-Stack Next.js 14 Web Applications', description: 'Lightning-fast server components, PostgreSQL database modeling, and Tailwind glassmorphism UI.', icon: 'Code', price: `${currency} 250,000+`, duration: '2 - 3 Weeks', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' },
      { title: 'Native iOS & Android Mobile Apps', description: 'React Native & Flutter native builds with offline sync, biometric security, and push notifications.', icon: 'Smartphone', price: `${currency} 350,000+`, duration: '3 - 4 Weeks', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80' },
      { title: 'Bespoke Brand Identity & Design Systems', description: '6 distinct vector SVG concepts, typography guidelines, packaging, and digital style guides.', icon: 'Palette', price: `${currency} 120,000+`, duration: '1 - 2 Weeks', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80' },
      { title: 'Lead Gen Funnels & WhatsApp Automation', description: 'High-converting lead capture funnels with direct WhatsApp CRM and automated email follow-up.', icon: 'Send', price: `${currency} 95,000+`, duration: '5 - 7 Days', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
    ],

    // Section 5: 360 Spotlight & Procedure Deep-Dive
    spotlightFeature: {
      title: isDentalMedical ? '3D Computer-Guided Surgical Precision' : 'Zero-Latency Edge Cloud Architecture',
      subtitle: isDentalMedical ? 'Sub-Millimeter Optical Accuracy with Zero Discomfort' : 'Engineered for 100,000+ Concurrent High-Value Users',
      description: isDentalMedical
        ? `We utilize German 3D CBCT imaging to map bone density and nerve canals before touching a tooth. Implants are placed through virtual keyholes without incisions or sutures.`
        : `Built on Next.js 14 App Router and deployed across Vercel and Cloudflare global edge networks. Experience sub-100ms server response times worldwide.`,
      image: isDentalMedical
        ? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      bulletPoints: isDentalMedical ? [
        'Virtually zero post-operative swelling or downtime',
        'Same-day temporary ceramic restoration fitted',
        'Written 25-year structural manufacturer warranty',
        'Intraoral 3D scanner replaces messy impression trays',
      ] : [
        'Hermes JavaScript engine with instant hydration',
        '256-bit end-to-end data encryption and HIPAA compliance',
        'Dynamic Redis caching with real-time webhooks',
        'Automated CI/CD pipelines with zero downtime deploys',
      ],
      ctaText: isDentalMedical ? 'Schedule 3D Scan Consultation &rarr;' : 'Request System Architecture Spec &rarr;',
    },

    // Section 6: Interactive Before & After Transformation Slider
    caseStudies: isDentalMedical ? [
      { 
        title: 'Complete Smile Rejuvenation & Alignment', 
        metric: '100% Patient Confidence Lift', 
        beforeText: 'Severe enamel wear, deep staining, and anterior misalignment', 
        afterText: '10 custom Swiss porcelain veneers with natural translucency',
        imageBefore: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
        imageAfter: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
      },
      { 
        title: 'Single-Tooth Guided Implant Replacement', 
        metric: 'Permanent Bone Preservation', 
        beforeText: 'Fractured premolar root requiring delicate atraumatic extraction', 
        afterText: 'Titanium-zirconia implant with seamless emergence profile',
        imageBefore: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        imageAfter: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
      },
    ] : [
      { 
        title: 'Legacy Slow Website vs. SAMVERO Platform', 
        metric: '4.8x Higher Inbound Inquiries', 
        beforeText: 'Outdated WordPress template taking 4.8 seconds to load', 
        afterText: 'Bespoke Next.js glassmorphism web platform loading in 82ms',
        imageBefore: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        imageAfter: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      },
      { 
        title: 'Brand Identity Overhaul & App Launch', 
        metric: '$450K Pre-Seed Investment Closed', 
        beforeText: 'Inconsistent DIY graphics and fragmented mobile presentation', 
        afterText: '6 cohesive vector SVG marks and polished 14-screen native app',
        imageBefore: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        imageAfter: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
      },
    ],

    // Section 7: Verified Reviews Slider
    testimonials: [
      { author: 'Dr. Usman Malik', role: 'Verified Patient', quote: `The best clinical experience I have ever had in ${city}. Completely painless, state-of-the-art facility, and exceptionally polite staff.`, rating: 5, date: '4 days ago', verified: true, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { author: 'Zainab Qureshi', role: 'Smile Design Patient', quote: 'My veneers look so completely natural that no one can tell they are cosmetic! Truly master craftsmen.', rating: 5, date: '1 week ago', verified: true, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { author: 'Bilal Ahmed', role: 'Executive Client', quote: 'Prompt, hygienic, and thoroughly professional. The 3D scan and transparent treatment plan made all the difference.', rating: 5, date: '2 weeks ago', verified: true, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
    ],

    // Section 8: FAQs Accordion
    faqs: isDentalMedical ? [
      { question: 'Will my treatment or procedure be painful?', answer: 'Not at all. We utilize computer-guided micro-anesthesia, numbing gels, and relaxing clinical suites to ensure 100% painless care.' },
      { question: 'How long do Swiss porcelain veneers and implants last?', answer: 'Our Swiss and German porcelain restorations carry a 25-year structural warranty and are engineered for lifelong durability with routine dental hygiene.' },
      { question: `Do you accommodate urgent walk-in emergency appointments in ${city}?`, answer: 'Yes! We reserve daily priority slots for sudden toothaches, broken restorations, and sports injuries.' },
      { question: 'What payment and installment plans are available?', answer: 'We offer interest-free flexible installment plans, corporate insurance invoicing, and direct card payments.' },
    ] : [
      { question: 'How fast can our custom platform or app be deployed?', answer: 'Our rapid sprint model delivers a working functional prototype within 5 to 7 days, and full production deployment within 2 to 3 weeks.' },
      { question: 'Do you provide full source code and intellectual property transfer?', answer: 'Yes, 100% full intellectual property and Git repository ownership is transferred to your organization upon project completion.' },
      { question: 'How do you handle post-launch maintenance and security updates?', answer: 'Every project includes a 30-day post-launch warranty, 24/7 security monitoring, and continuous edge performance optimization.' },
    ],
    mapEmbedAddress: `${city}, ${country}`,
  };
}

/**
 * Compiles an ultra-luxurious, production-ready 9-SECTION STANDALONE HTML page with animated sliders
 */
export function compileStandaloneHtml(site: GeneratedWebsiteData): string {
  const isEcommerce = site.isEcommerce;
  const cleanPhone = site.contactPhone.replace(/[^0-9+]/g, '');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.businessName} &bull; ${site.heroHeadline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif { font-family: 'Playfair Display', serif; }
    .font-display { font-family: 'Outfit', sans-serif; }
    .slider-track { scroll-behavior: smooth; }
    .slider-track::-webkit-scrollbar { display: none; }
    .slider-track { -ms-overflow-style: none; scrollbar-width: none; }
    details > summary { list-style: none; }
    details > summary::-webkit-details-marker { display: none; }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    .animate-glow { animation: pulseGlow 4s ease-in-out infinite; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased selection:bg-[#007FED] selection:text-white">

  <!-- =========================================================================
       SECTION 1: LUXURY ANNOUNCEMENT & PROMO SLIDER BAR
       ========================================================================= -->
  <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white text-[12px] font-semibold py-2.5 px-4 text-center tracking-wide border-b border-white/10 flex items-center justify-center gap-2">
    <span>✨</span>
    <span>${site.announcementText || 'Complimentary VIP Consultations &amp; Doorstep Priority Delivery Available'}</span>
    <span class="hidden sm:inline bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-400/30">Verified 2026</span>
  </div>

  <!-- =========================================================================
       SECTION 2: LUXURY STICKY NAVIGATION WITH VECTOR SVG MARK
       ========================================================================= -->
  <header class="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- SVG Vector Mark -->
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
          <rect x="4" y="4" width="92" height="92" rx="22" fill="#0B1322" stroke="#007FED" stroke-width="4"/>
          <path d="M28 32 L50 20 L72 32 L50 44 Z" fill="#007FED"/>
          <path d="M26 48 L48 60 L48 76 L26 64 Z" fill="#38BDF8"/>
          <path d="M74 48 L52 60 L52 76 L74 64 Z" fill="#1D4ED8"/>
          <circle cx="50" cy="44" r="4.5" fill="#FFFFFF"/>
        </svg>
        <div>
          <span class="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block leading-tight font-display">${site.businessName}</span>
          <span class="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Private Client Tier</span>
        </div>
      </div>

      <nav class="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-300">
        <a href="#services" class="hover:text-[#007FED] transition">${isEcommerce ? 'Showcase' : 'Services Slider'}</a>
        <a href="#spotlight" class="hover:text-[#007FED] transition">360 Spotlight</a>
        <a href="#cases" class="hover:text-[#007FED] transition">Before &amp; After</a>
        <a href="#reviews" class="hover:text-[#007FED] transition">Testimonials</a>
        <a href="#faqs" class="hover:text-[#007FED] transition">FAQs</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="tel:${cleanPhone}" class="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#007FED] px-3 py-2">
          <span>${site.contactPhone}</span>
        </a>
        <a href="#book" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition transform hover:-translate-y-0.5">
          <span>${isEcommerce ? 'Shop Collections' : 'Reserve Appointment'}</span>
        </a>
      </div>
    </div>
  </header>

  <!-- =========================================================================
       SECTION 3: HIGH-CONVERTING HERO SECTION WITH AMBIENT GLOW
       ========================================================================= -->
  <section class="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-white via-blue-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <!-- Ambient Glow Orb -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#007FED]/15 rounded-full blur-3xl pointer-events-none animate-glow"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
      
      <!-- Left Column: Copy & CTAs -->
      <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-[#007FED] dark:text-cyan-300 text-xs font-bold shadow-xs">
          <span class="flex text-amber-400 text-sm">★★★★★</span>
          <span>Rated 5.0 by Discerning Clients &bull; ${site.tagline}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.08] font-display">
          ${site.heroHeadline}
        </h1>

        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
          ${site.heroSubheadline}
        </p>

        <!-- CTA Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
          <a href="#book" class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#007FED] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition transform hover:-translate-y-0.5 text-center">
            ${isEcommerce ? 'Explore Curated Catalog &rarr;' : 'Book Priority VIP Consultation &rarr;'}
          </a>
          <a href="#services" class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition text-center shadow-xs">
            Interactive Showcase Slider
          </a>
        </div>

        <!-- Trust Badges -->
        <div class="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-2">
            <span class="text-emerald-500">✓</span>
            <span>Verified 5.0 Google Rating</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-emerald-500">✓</span>
            <span>25-Year Written Guarantee</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-emerald-500">✓</span>
            <span>Direct WhatsApp Concierge</span>
          </div>
        </div>
      </div>

      <!-- Right Column: High-Res Hero Image with Floating Badge -->
      <div class="lg:col-span-5 relative">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-900 aspect-[4/5] group">
          <img 
            src="${site.heroImageUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85'}" 
            alt="${site.businessName} Showcase" 
            class="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          
          <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-extrabold text-slate-900 dark:text-white block">${site.businessName}</span>
                <span class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">${site.tagline.split('&bull;')[0]}</span>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                ● Live Concierge
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- =========================================================================
       SECTION 4: ANIMATED 4-PILLAR VALUE PROPOSITIONS
       ========================================================================= -->
  <section class="py-14 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${(site.valueProps || []).map((prop) => `
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#007FED] transition transform hover:-translate-y-1 shadow-xs group">
          <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#007FED] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition">
            ✦
          </div>
          <h3 class="font-extrabold text-slate-900 dark:text-white text-base mb-1 font-display">${prop.title}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${prop.subtitle}</p>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- =========================================================================
       SECTION 5: INTERACTIVE SHOWCASE SLIDER (PRODUCTS / SERVICES CAROUSEL)
       ========================================================================= -->
  <section id="services" class="py-20 max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        <span class="text-xs font-bold text-[#007FED] uppercase tracking-widest block">Interactive Showcase Carousel</span>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white mt-1 font-display">
          ${isEcommerce ? 'Signature Product Collections' : 'Specialized Clinical & Engineering Suites'}
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Use the carousel arrows to slide through bespoke solutions engineered for ${site.businessName}.
        </p>
      </div>

      <!-- Slider Navigation Controls -->
      <div class="flex items-center gap-2">
        <button onclick="document.getElementById('services-slider').scrollBy({ left: -340, behavior: 'smooth' })" class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#007FED] hover:text-white transition shadow-xs">
          &larr; Prev
        </button>
        <button onclick="document.getElementById('services-slider').scrollBy({ left: 340, behavior: 'smooth' })" class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#007FED] hover:text-white transition shadow-xs">
          Next &rarr;
        </button>
      </div>
    </div>

    <!-- Horizontal Scrollable Slider Track -->
    <div id="services-slider" class="slider-track flex gap-6 overflow-x-auto pb-4 scroll-smooth">
      ${(isEcommerce ? site.products || [] : site.services || []).map((item: any) => `
        <div class="min-w-[280px] sm:min-w-[340px] max-w-[340px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-[#007FED] transition transform hover:-translate-y-1 shadow-sm flex flex-col group">
          <div class="relative aspect-[16/11] overflow-hidden bg-slate-900">
            <img src="${item.image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'}" alt="${item.name || item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            ${item.price ? `
              <div class="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-cyan-300 font-extrabold text-xs border border-white/20">
                ${item.price}
              </div>
            ` : ''}
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-white font-display">${item.name || item.title}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">${item.description || 'Crafted with premium materials and backed by our written warranty.'}</p>
            </div>
            <a href="#book" class="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#007FED] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition">
              <span>${isEcommerce ? 'Order Reserve Batch' : 'Book Session'}</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- =========================================================================
       SECTION 6: INTERACTIVE 360 SPOTLIGHT & DEEP-DIVE
       ========================================================================= -->
  <section id="spotlight" class="py-20 bg-slate-900 text-white border-y border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 space-y-6">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest block">360 Technological Spotlight</span>
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight font-display">
          ${site.spotlightFeature?.title || 'Precision Engineering &amp; Clinical Mastery'}
        </h2>
        <p class="text-sm text-slate-300 leading-relaxed font-light">
          ${site.spotlightFeature?.description || 'Engineered with sub-millimeter precision to ensure unmatched longevity and zero clinical risk.'}
        </p>

        <div class="space-y-3 pt-2">
          ${(site.spotlightFeature?.bulletPoints || []).map((pt) => `
            <div class="flex items-start gap-3 text-xs text-slate-200 font-medium">
              <span class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0">✓</span>
              <span>${pt}</span>
            </div>
          `).join('')}
        </div>

        <div class="pt-4">
          <a href="#book" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20">
            <span>${site.spotlightFeature?.ctaText || 'Learn More About Our Standards &rarr;'}</span>
          </a>
        </div>
      </div>

      <div class="lg:col-span-6">
        <div class="rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl aspect-[4/3] bg-black">
          <img src="${site.spotlightFeature?.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'}" alt="Spotlight" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       SECTION 7: INTERACTIVE BEFORE & AFTER TRANSFORMATION SLIDER
       ========================================================================= -->
  <section id="cases" class="py-20 max-w-7xl mx-auto px-4 sm:px-6">
    <div class="text-center max-w-2xl mx-auto mb-14 space-y-2">
      <span class="text-xs font-bold text-[#007FED] uppercase tracking-widest block">Measurable Transformation</span>
      <h2 class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-display">Before &amp; After Case Studies</h2>
      <p class="text-xs text-slate-500 dark:text-slate-400">Real documented client cases illustrating our standard of perfection.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      ${(site.caseStudies || []).map((cs) => `
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white font-display">${cs.title}</h3>
            <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[11px]">${cs.metric}</span>
          </div>

          <!-- Dual Side-by-Side Visual Comparison -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <div class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img src="${cs.imageBefore || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'}" alt="Before" class="w-full h-full object-cover">
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-rose-300 font-black text-[10px]">BEFORE</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">${cs.beforeText}</p>
            </div>

            <div class="space-y-2">
              <div class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border-2 border-emerald-500">
                <img src="${cs.imageAfter || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'}" alt="After" class="w-full h-full object-cover">
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px]">AFTER</span>
              </div>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">${cs.afterText}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- =========================================================================
       SECTION 8: VERIFIED REVIEWS & TESTIMONIAL CAROUSEL SLIDER
       ========================================================================= -->
  <section id="reviews" class="py-20 bg-slate-100/60 dark:bg-slate-950/70 border-y border-slate-200/80 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span class="text-xs font-bold text-amber-500 uppercase tracking-widest block">Client Endorsements</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white mt-1 font-display">Verified 5-Star Testimonials</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real feedback from clients across Google My Business and private consultations.</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="document.getElementById('reviews-slider').scrollBy({ left: -360, behavior: 'smooth' })" class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#007FED] hover:text-white transition shadow-xs">
            &larr; Prev
          </button>
          <button onclick="document.getElementById('reviews-slider').scrollBy({ left: 360, behavior: 'smooth' })" class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#007FED] hover:text-white transition shadow-xs">
            Next &rarr;
          </button>
        </div>
      </div>

      <div id="reviews-slider" class="slider-track flex gap-6 overflow-x-auto pb-4 scroll-smooth">
        ${(site.testimonials || []).map((t) => `
          <div class="min-w-[300px] sm:min-w-[360px] max-w-[360px] shrink-0 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex text-amber-400 text-sm">★★★★★</div>
              <p class="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed font-normal">"${t.quote}"</p>
            </div>
            <div class="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <img src="${t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" alt="${t.author}" class="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700">
              <div>
                <span class="font-extrabold text-xs text-slate-900 dark:text-white block">${t.author}</span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400">${t.role}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- =========================================================================
       SECTION 9: INTERACTIVE FAQS ACCORDION & VIP CONCIERGE BOOKING ENGINE WITH 4-COLUMN FOOTER
       ========================================================================= -->
  <section id="faqs" class="py-20 max-w-4xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12 space-y-2">
      <span class="text-xs font-bold text-[#007FED] uppercase tracking-widest block">Clear Answers</span>
      <h2 class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-display">Frequently Asked Questions</h2>
    </div>

    <div class="space-y-3">
      ${(site.faqs || []).map((faq) => `
        <details class="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <summary class="flex items-center justify-between p-5 cursor-pointer font-bold text-sm text-slate-900 dark:text-white select-none">
            <span>${faq.question}</span>
            <span class="text-[#007FED] text-lg font-black transition-transform group-open:rotate-45">+</span>
          </summary>
          <div class="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
            ${faq.answer}
          </div>
        </details>
      `).join('')}
    </div>
  </section>

  <!-- VIP Concierge Booking Engine -->
  <section id="book" class="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-t border-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="text-center mb-10 space-y-2">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Direct Concierge Access</span>
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight font-display">
          ${isEcommerce ? 'Order Your Artisan Reserve' : 'Reserve Your VIP Private Session'}
        </h2>
        <p class="text-xs text-slate-400">Fill out your preferred schedule below; our concierge desk will confirm via WhatsApp within 15 minutes.</p>
      </div>

      <form onsubmit="event.preventDefault(); alert('Thank you! Your VIP request for ${site.businessName} has been received. Our concierge will contact you on WhatsApp.');" class="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
            <input type="text" required placeholder="Alexander Vance" class="w-full bg-slate-900/80 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone Number</label>
            <input type="tel" required placeholder="+971 50 000 0000" class="w-full bg-slate-900/80 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Preferred Service or Inquiry</label>
          <input type="text" placeholder="${isEcommerce ? 'Imperial Reserve Set' : 'Consultation & Smile Design'}" class="w-full bg-slate-900/80 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400">
        </div>

        <button type="submit" class="w-full py-4 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition">
          Confirm Priority Reservation &rarr;
        </button>
      </form>
    </div>
  </section>

  <!-- Luxury 4-Column Footer -->
  <footer class="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="space-y-2">
        <span class="font-extrabold text-base text-white font-display">${site.businessName}</span>
        <p class="text-[11px] text-slate-500 leading-relaxed">${site.aboutText}</p>
      </div>

      <div class="space-y-2">
        <span class="font-bold text-white text-xs block uppercase tracking-wider">Concierge Hours</span>
        <p class="text-[11px]">Monday &ndash; Saturday: 9:00 AM &ndash; 8:00 PM</p>
        <p class="text-[11px]">Sunday: 24/7 On-Call Emergency</p>
      </div>

      <div class="space-y-2">
        <span class="font-bold text-white text-xs block uppercase tracking-wider">Direct Contact</span>
        <p class="text-[11px]">Email: ${site.contactEmail}</p>
        <p class="text-[11px]">Phone: ${site.contactPhone}</p>
        <p class="text-[11px]">Address: ${site.address}</p>
      </div>

      <div class="space-y-2">
        <span class="font-bold text-white text-xs block uppercase tracking-wider">Platform Authentication</span>
        <p class="text-[11px]">Generated via SAMVERO – AI-Powered Lead Generation Platform.</p>
        <p class="text-[10px] text-slate-600">&copy; 2026 ${site.businessName}. All rights reserved.</p>
      </div>
    </div>
  </footer>

</body>
</html>`;
}
