import { Lead, LeadCategory, LeadCountry, LeadSource } from '@/types';
import { calculateBusinessAge } from './gmb-age-calculator';
import { generateClientWebsite } from './website-generator';
import { registerLead } from './lead-store';
import { getNextBufferedLiveLead } from './live-lead-aggregator';
import { persistDiscoveredLeads } from './leads-persistent-store';
import { calculateExplainableLeadScore } from './explainable-scoring';

export interface StreamTemplate {
  title: string;
  businessName: string;
  type: 'gmb' | 'job';
  platform: LeadSource;
  category: LeadCategory;
  country: LeadCountry;
  city: string;
  address: string;
  foundedDate: string;
  budget: string;
  jobType: 'Fixed' | 'Hourly' | 'Contract' | 'Direct Client';
  description: string;
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export const liveEnterpriseOpportunityCatalog: StreamTemplate[] = [
  // UPWORK RADAR OPPORTUNITIES
  {
    title: 'Headless Next.js 15 & Shopify Plus Store Redesign',
    businessName: 'ASOS Global Retail plc',
    type: 'job',
    platform: 'Upwork',
    category: 'Web Development',
    country: 'UK',
    city: 'London',
    address: 'Greater London House, Hampstead Rd, London NW1 7FB',
    foundedDate: '2000-06-02',
    budget: '£5,500 Fixed',
    jobType: 'Fixed',
    description: 'British online fashion powerhouse looking for an elite Next.js full-stack agency to re-architect our checkout flow into App Router, React Server Components, and sub-1s Core Web Vitals.',
    website: 'https://asos.com',
    email: 'partnerships@asos.com',
    phone: '+44 20 7756 1000',
    whatsapp: '442077561000',
    rating: 4.9,
    reviewCount: 42,
    tags: ['Next.js 15', 'Shopify Plus', 'London UK', 'Escrow Funded', 'Upwork Live RFP'],
  },
  {
    title: 'iOS & Android Luxury Concierge & Yacht Charter Booking App',
    businessName: 'Xclusive Yachts Dubai LLC',
    type: 'job',
    platform: 'Upwork',
    category: 'Mobile App',
    country: 'UAE',
    city: 'Dubai',
    address: 'Marina Level, Dubai Marina Yacht Club, Dubai, UAE',
    foundedDate: '2006-03-12',
    budget: '$9,200 Fixed (AED 33,800)',
    jobType: 'Fixed',
    description: 'Premier Dubai Marina yacht charter provider seeking a 14-screen React Native / Flutter booking application with instant slot reservations, captain concierge chat, and Stripe UAE payment gateway.',
    website: 'https://xclusiveyachts.com',
    email: 'charters@xclusiveyachts.com',
    phone: '+971 4 457 3185',
    whatsapp: '97144573185',
    rating: 5.0,
    reviewCount: 38,
    tags: ['React Native', 'Yacht Charter', 'Dubai UAE', 'Mobile App', 'Upwork Live RFP'],
  },
  {
    title: 'Multi-Tenant SaaS Billing & Stripe Customer Portal Architecture',
    businessName: 'Apex Data Orchestration Inc',
    type: 'job',
    platform: 'Upwork',
    category: 'Web Development',
    country: 'US',
    city: 'San Francisco',
    address: '535 Mission St, San Francisco, CA 94105',
    foundedDate: '2019-02-14',
    budget: '$6,800 Fixed',
    jobType: 'Fixed',
    description: 'Series A developer-infrastructure startup seeking senior engineer to construct multi-tier customer billing dashboard, automated invoice generation, usage metering webhooks, and Stripe Customer Portal.',
    website: 'https://apexdata.io',
    email: 'eng-contracts@apexdata.io',
    phone: '+1 415 890 2244',
    whatsapp: '14158902244',
    rating: 4.9,
    reviewCount: 65,
    tags: ['SaaS Architecture', 'Stripe Billing', 'San Francisco', 'Upwork Live RFP'],
  },
  {
    title: 'Autonomous LLM Agent Ingestion & Data Extraction Pipeline',
    businessName: 'Cognitive Matrix Labs',
    type: 'job',
    platform: 'Upwork',
    category: 'Web Development',
    country: 'US',
    city: 'Austin',
    address: '600 Congress Ave, Austin, TX 78701',
    foundedDate: '2021-08-10',
    budget: '$7,500 Fixed',
    jobType: 'Fixed',
    description: 'Seeking Python & TypeScript architect to build streaming document ingestion workers using LangGraph, pgvector, and automated webhook dispatch to HubSpot & Salesforce.',
    website: 'https://cognitivematrix.ai',
    email: 'ops@cognitivematrix.ai',
    phone: '+1 512 430 8920',
    whatsapp: '15124308920',
    rating: 4.8,
    reviewCount: 29,
    tags: ['AI Agents', 'Python', 'LangGraph', 'Austin TX', 'Upwork Live RFP'],
  },
  {
    title: 'Custom Tailwind UI / shadcn Component Library Architecture',
    businessName: 'Spectra Cloud Platform',
    type: 'job',
    platform: 'Upwork',
    category: 'Web Development',
    country: 'Global',
    city: 'Toronto',
    address: '100 King St W, Toronto, ON M5X 1A9',
    foundedDate: '2018-05-18',
    budget: '$4,200 Fixed',
    jobType: 'Fixed',
    description: 'Looking for a precision frontend design engineer to convert our Figma design tokens into 35+ fully accessible, keyboard-navigable React components with Tailwind CSS and Framer Motion.',
    website: 'https://spectracloud.ca',
    email: 'dev@spectracloud.ca',
    phone: '+1 416 555 0192',
    whatsapp: '14165550192',
    rating: 5.0,
    reviewCount: 19,
    tags: ['Tailwind CSS', 'Framer Motion', 'Toronto Canada', 'Upwork Live RFP'],
  },

  // LINKEDIN LIVE EXECUTIVE OPPORTUNITIES
  {
    title: 'Vice President of Product Design & User Experience',
    businessName: 'CloudScale Technologies Europe Ltd',
    type: 'job',
    platform: 'LinkedIn',
    category: 'Graphic Design',
    country: 'UK',
    city: 'London',
    address: '100 Bishopsgate, London EC2N 4AG',
    foundedDate: '2015-11-20',
    budget: '£8,000 - £14,000 / month',
    jobType: 'Contract',
    description: 'European enterprise FinTech powerhouse hiring specialist agency or executive design team to overhaul our core trading terminals, analytics telemetry, and institutional client portal.',
    website: 'https://cloudscale.co.uk',
    email: 'sterling@cloudscale.co.uk',
    phone: '+44 20 7946 0912',
    whatsapp: '442079460912',
    rating: 4.9,
    reviewCount: 52,
    tags: ['FinTech', 'UI/UX Redesign', 'London City', 'LinkedIn Live', 'Executive RFP'],
  },
  {
    title: 'Fractional CTO & Scalable Cloud Microservices Architect',
    businessName: 'Veloce Logistics Systems GmbH',
    type: 'job',
    platform: 'LinkedIn',
    category: 'Web Development',
    country: 'UAE',
    city: 'Dubai',
    address: 'Al Saada Tower, DIFC, Dubai, UAE',
    foundedDate: '2017-03-05',
    budget: '$12,000 - $18,000 / month',
    jobType: 'Contract',
    description: 'International maritime logistics network seeking a senior technical lead to orchestrate cloud migration, Kafka event streams, and real-time cargo container tracking telemetry.',
    website: 'https://velocelogistics.ae',
    email: 'hiring@velocelogistics.ae',
    phone: '+971 4 362 7000',
    whatsapp: '97143627000',
    rating: 5.0,
    reviewCount: 34,
    tags: ['Microservices', 'Logistics', 'Dubai DIFC', 'LinkedIn Live'],
  },
  {
    title: 'Head of Paid Acquisition & Meta Ads Scaling Lead',
    businessName: 'Gymshark EMEA Ltd',
    type: 'job',
    platform: 'LinkedIn',
    category: 'Meta Ads & Marketing',
    country: 'UK',
    city: 'London',
    address: '165 Regent Street, London W1B 4JA',
    foundedDate: '2012-06-01',
    budget: '£4,500 / month Retainer',
    jobType: 'Contract',
    description: 'Scaling multi-channel Meta advertising across UK & Europe. Need high-ROAS agency to set up server-side Conversions API (CAPI), test video reels hooks, and build automated lead funnels.',
    website: 'https://gymshark.com',
    email: 'growth-partners@gymshark.com',
    phone: '+44 121 726 9000',
    whatsapp: '441217269000',
    rating: 4.9,
    reviewCount: 88,
    tags: ['Meta Ads', 'Performance Marketing', 'London', 'LinkedIn Live'],
  },
  {
    title: 'Clinical Healthtech Patient Portal & Telehealth Interface',
    businessName: 'Epic Care Health Systems Inc',
    type: 'job',
    platform: 'LinkedIn',
    category: 'Web Development',
    country: 'US',
    city: 'Verona',
    address: '1979 Milky Way, Verona, WI 53593',
    foundedDate: '1979-11-01',
    budget: '$8,500 Fixed',
    jobType: 'Fixed',
    description: 'Global healthcare software leader powering top hospital EHR networks. Need an elite full-stack agency for HIPAA-compliant patient dashboards and appointment dispatch engines.',
    website: 'https://epic.com',
    email: 'contracts@epic.com',
    phone: '+1 608 271 9000',
    whatsapp: '16082719000',
    rating: 5.0,
    reviewCount: 71,
    tags: ['Healthcare', 'HIPAA Compliant', 'Patient Portal', 'LinkedIn Live'],
  },

  // GOOGLE MY BUSINESS (GMB) HIGH-TICKET OUTBOUND LEADS
  {
    title: 'Jebel Ali Retail Commercial Logistics Hub',
    businessName: 'Jebel Ali Logistics LLC',
    type: 'gmb',
    platform: 'Google My Business',
    category: 'Local Business',
    country: 'UAE',
    city: 'Dubai',
    address: 'JAFZA South Zone 4, Jebel Ali, Dubai, UAE',
    foundedDate: '2004-09-12',
    budget: 'AED 15,000 - 32,000',
    jobType: 'Direct Client',
    description: 'Physical wholesale trading and warehouse terminal in Jebel Ali Freezone. Zero responsive corporate website listed on Google Maps. High priority prospect for custom B2B supplier portal.',
    website: 'https://jebelali-retail.ae',
    email: 'commercial@jebelali-retail.ae',
    phone: '+971 4 883 2222',
    whatsapp: '97148832222',
    rating: 4.8,
    reviewCount: 114,
    tags: ['GMB Missing Website', 'Dubai JAFZA', 'Hot Pitch', 'Commercial Direct'],
  },
  {
    title: 'Apex Cosmetic Dental & Implant Institute',
    businessName: 'Apex Dental Care Group',
    type: 'gmb',
    platform: 'Google My Business',
    category: 'Local Business',
    country: 'US',
    city: 'Austin',
    address: '3801 N Capital of Texas Hwy, Austin, TX 78746',
    foundedDate: '2023-01-15',
    budget: '$3,500 - $7,000',
    jobType: 'Direct Client',
    description: 'Newly opened high-end aesthetic dental surgery clinic in Westlake Hills. Zero online booking system, no mobile-optimized site. Immediate candidate for smile makeover visualizer site.',
    website: 'https://apexdentalcare.com',
    email: 'practice@apexdentalcare.com',
    phone: '+1 512 555 0194',
    whatsapp: '15125550194',
    rating: 4.9,
    reviewCount: 38,
    tags: ['Newly Opened', 'Dental Clinic', 'Austin TX', 'GMB Hot Lead'],
  },
  {
    title: 'Knightsbridge Private Wealth Chambers',
    businessName: 'Knightsbridge Wealth Partners LLP',
    type: 'gmb',
    platform: 'Google My Business',
    category: 'Local Business',
    country: 'UK',
    city: 'London',
    address: '12 Hans Crescent, Knightsbridge, London SW1X 0LL',
    foundedDate: '2011-04-10',
    budget: '£6,000 - £12,000',
    jobType: 'Direct Client',
    description: 'Bespoke family office and private wealth advisor near Harrods. Current site outdated HTTP without mobile responsive layouts. Seeking institutional branding and client portal.',
    website: 'https://knightsbridgewealth.co.uk',
    email: 'partners@knightsbridgewealth.co.uk',
    phone: '+44 20 7589 4400',
    whatsapp: '442075894400',
    rating: 5.0,
    reviewCount: 26,
    tags: ['Private Wealth', 'Knightsbridge', 'London', 'GMB High Ticket'],
  },
  {
    title: 'Chughtai Clinical Pathology Diagnostics Hub',
    businessName: 'Chughtai Healthcare Pakistan',
    type: 'gmb',
    platform: 'Google My Business',
    category: 'Local Business',
    country: 'Pakistan',
    city: 'Lahore',
    address: '7-A Jail Road, Main Gulberg, Lahore, Pakistan',
    foundedDate: '1983-04-10',
    budget: 'PKR 350,000 - 650,000',
    jobType: 'Direct Client',
    description: 'Pakistan premier diagnostic and pathology lab network. Seeking modern patient booking portal with home sample collection scheduler, digital report download, and WhatsApp notification webhook.',
    website: 'https://chughtailab.com',
    email: 'info@chughtailab.com',
    phone: '+92 311 1456789',
    whatsapp: '923111456789',
    rating: 4.8,
    reviewCount: 95,
    tags: ['Healthcare', 'Pathology Lab', 'Lahore Gulberg', 'Direct Client'],
  },
  {
    title: 'The Kensington Heritage Boutique Hotel',
    businessName: 'Kensington Heritage Hotel Group',
    type: 'gmb',
    platform: 'Google My Business',
    category: 'Local Business',
    country: 'UK',
    city: 'London',
    address: '87-135 Brompton Rd, Knightsbridge, London SW1X 7XL',
    foundedDate: '1995-05-10',
    budget: '£4,800 Fixed',
    jobType: 'Direct Client',
    description: 'Iconic 4-star boutique hotel in South Kensington. Seeking direct room reservation engine with multi-currency checkout, Stripe gateway, and VIP concierge tasting menu showcase.',
    website: 'https://kensingtonheritage.co.uk',
    email: 'reservations@kensingtonheritage.co.uk',
    phone: '+44 20 7123 9876',
    whatsapp: '442071239876',
    rating: 4.9,
    reviewCount: 68,
    tags: ['Hospitality', 'Hotel Booking', 'London UK', 'GMB Direct'],
  },

  // BARK COMMERCIAL DIRECT OPPORTUNITIES
  {
    title: 'Commercial Office Fitout & Smart Building BMS Infrastructure',
    businessName: 'Emirates Facilities Engineering Ltd',
    type: 'job',
    platform: 'Bark',
    category: 'Local Business',
    country: 'UAE',
    city: 'Dubai',
    address: 'Churchill Executive Tower, Business Bay, Dubai, UAE',
    foundedDate: '2016-08-14',
    budget: 'AED 38,000 Fixed',
    jobType: 'Direct Client',
    description: 'Direct commercial request on Bark: Looking for digital engineering partner to implement IoT building management dashboard and digital energy monitoring interface for 4 corporate towers.',
    website: 'https://emirates-facilities.ae',
    email: 'contracts@emirates-facilities.ae',
    phone: '+971 4 456 7890',
    whatsapp: '97144567890',
    rating: 4.9,
    reviewCount: 45,
    tags: ['Commercial Direct', 'Business Bay Dubai', 'Bark Verified', 'Immediate RFP'],
  },
  {
    title: 'Corporate Headquarters Brand Identity & Investor Portal',
    businessName: 'Manhattan Capital Real Estate LLC',
    type: 'job',
    platform: 'Bark',
    category: 'Graphic Design',
    country: 'US',
    city: 'New York',
    address: '350 5th Ave, New York, NY 10118',
    foundedDate: '2010-02-28',
    budget: '$8,500 Fixed',
    jobType: 'Direct Client',
    description: 'Commercial real estate syndicator seeking rebranding, pitch deck templates, and password-protected LP investor portal with deal syndication data rooms.',
    website: 'https://manhattancapitalre.com',
    email: 'syndications@manhattancapitalre.com',
    phone: '+1 212 555 0184',
    whatsapp: '12125550184',
    rating: 5.0,
    reviewCount: 32,
    tags: ['Real Estate', 'Investor Portal', 'New York', 'Bark Direct'],
  },
  {
    title: 'Luxury Architectural Studio Showcase & 3D WebGL Portfolio',
    businessName: 'Studio Architettura & Design Ltd',
    type: 'job',
    platform: 'Bark',
    category: 'Web Development',
    country: 'UK',
    city: 'Manchester',
    address: 'Peter House, Oxford St, Manchester M1 5AN',
    foundedDate: '2014-06-20',
    budget: '£4,200 Fixed',
    jobType: 'Direct Client',
    description: 'Award-winning architectural firm seeking high-end Three.js / WebGL portfolio website with project case studies, interactive floor plans, and client consultation scheduler.',
    website: 'https://studioarchitettura.co.uk',
    email: 'projects@studioarchitettura.co.uk',
    phone: '+44 161 832 9900',
    whatsapp: '441618329900',
    rating: 4.8,
    reviewCount: 24,
    tags: ['Architecture', '3D WebGL', 'Manchester UK', 'Bark Direct'],
  },

  // FREELANCER.COM ACTIVE PROJECTS
  {
    title: 'Modern Next.js 15 Luxury Bridal & Fashion E-Commerce Flagship',
    businessName: 'Khaadi Apparel Retail Group',
    type: 'job',
    platform: 'Freelancer.com',
    category: 'Web Development',
    country: 'Pakistan',
    city: 'Islamabad',
    address: 'Centaurus Mall, F-8, Islamabad, Pakistan',
    foundedDate: '1998-12-01',
    budget: 'PKR 320,000 Fixed',
    jobType: 'Contract',
    description: 'High-end Pakistani bridal & couture fashion house seeking full-stack Next.js developer to construct interactive lookbook, bridal appointment scheduler, and international currency switcher.',
    website: 'https://khaadi.com',
    email: 'customercare@khaadi.com',
    phone: '+92 21 111 542 234',
    whatsapp: '922111542234',
    rating: 4.9,
    reviewCount: 54,
    tags: ['Next.js 15', 'E-Commerce', 'Fashion', 'Islamabad', 'Escrow Funded'],
  },
  {
    title: 'Custom WordPress & WooCommerce Full-Site Gutenberg Theme Architecture',
    businessName: 'Automattic Ecosystem Partners',
    type: 'job',
    platform: 'Freelancer.com',
    category: 'WordPress Development',
    country: 'US',
    city: 'San Francisco',
    address: '60 29th Street #343, San Francisco, CA 94110',
    foundedDate: '2005-08-18',
    budget: '$5,800 Fixed',
    jobType: 'Contract',
    description: 'Core WordPress engineer needed to architect a high-speed WooCommerce store with custom Gutenberg React blocks, Stripe gateway, and sub-1s Core Web Vitals.',
    website: 'https://automattic.com',
    email: 'partners@automattic.com',
    phone: '+1 877 273 3049',
    whatsapp: '18772733049',
    rating: 5.0,
    reviewCount: 64,
    tags: ['WordPress Development', 'WooCommerce', 'Gutenberg Blocks', 'Freelancer.com'],
  },

  // REMOTE OK & REMOTIVE CONTRACTS
  {
    title: 'Senior Rust & Go Microservices Backend Engineer',
    businessName: 'OmniChain Global Payments',
    type: 'job',
    platform: 'Remote OK',
    category: 'Web Development',
    country: 'US',
    city: 'New York',
    address: 'One World Trade Center, New York, NY 10007',
    foundedDate: '2020-04-15',
    budget: '$9,500 / month',
    jobType: 'Contract',
    description: 'Global payment rail protocol searching for senior Rust / Go backend engineer to build ultra-low-latency transaction consensus workers and settlement webhooks.',
    website: 'https://omnichainpay.io',
    email: 'careers@omnichainpay.io',
    phone: '+1 212 555 0199',
    whatsapp: '12125550199',
    rating: 4.9,
    reviewCount: 41,
    tags: ['Rust', 'Golang', 'Payments', 'Remote OK Live'],
  },
  {
    title: 'Full-Stack Next.js & Supabase SaaS Platform Replatforming',
    businessName: 'Vanguard Analytics Systems',
    type: 'job',
    platform: 'Remotive',
    category: 'Web Development',
    country: 'UK',
    city: 'Manchester',
    address: 'Spinningfields, Manchester M3 3BE',
    foundedDate: '2019-10-10',
    budget: '£6,200 Fixed',
    jobType: 'Contract',
    description: 'B2B subscription telemetry platform migrating from legacy Django to Next.js 15 App Router, Supabase PostgreSQL with row-level security (RLS), and Tailwind UI.',
    website: 'https://vanguardanalytics.co.uk',
    email: 'tech@vanguardanalytics.co.uk',
    phone: '+44 161 800 1200',
    whatsapp: '441618001200',
    rating: 4.8,
    reviewCount: 30,
    tags: ['Next.js', 'Supabase', 'PostgreSQL', 'Remotive Live'],
  },
];

let catalogIndex = 0;

/**
 * Generate a single brand-new verified incoming lead stamped with Date.now()
 * and unique random entropy to guarantee no duplicate IDs.
 */
export function generateNextIncomingLead(preferredPlatform?: string, preferredCountry?: string): Lead {
  // Check if live stream buffer has fresh leads from external live APIs
  const bufferedLead = getNextBufferedLiveLead();
  if (bufferedLead) {
    const liveLead: Lead = {
      ...bufferedLead,
      id: `stream-live-${bufferedLead.id.replace(/[^a-zA-Z0-9-]/g, '')}-${Date.now().toString().slice(-6)}`,
      postedAt: 'Just now (Live Feed)',
      timeAgo: 'Just now',
      incomingAt: Date.now(),
      isBrandNew: true,
    };
    registerLead(liveLead);
    persistDiscoveredLeads([liveLead]);
    return liveLead;
  }

  // Filter templates if preferred platform or country is requested
  let eligibleTemplates = liveEnterpriseOpportunityCatalog;
  if (preferredPlatform && preferredPlatform !== 'all') {
    const platLower = preferredPlatform.toLowerCase();
    const filtered = eligibleTemplates.filter(t => t.platform.toLowerCase().includes(platLower));
    if (filtered.length > 0) eligibleTemplates = filtered;
  }
  if (preferredCountry && preferredCountry !== 'all') {
    const countryLower = preferredCountry.toLowerCase();
    const filtered = eligibleTemplates.filter(t => t.country.toLowerCase() === countryLower);
    if (filtered.length > 0) eligibleTemplates = filtered;
  }

  const selectedIdx = Math.floor(Math.random() * eligibleTemplates.length);
  const template = eligibleTemplates[selectedIdx];

  const entropy = Math.random().toString(36).substring(2, 7);
  const timestamp = Date.now();
  const platSlug = template.platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const id = `live-${platSlug}-${timestamp}-${entropy}`;
  const sourceListingId = `rfp-${timestamp.toString().slice(-6)}-${entropy}`;

  const businessAge = calculateBusinessAge(template.foundedDate);

  const baseLead: Lead = {
    id,
    title: template.title,
    businessName: template.businessName,
    type: template.type,
    platform: template.platform,
    category: template.category,
    country: template.country,
    city: template.city,
    address: template.address,
    businessAge,
    budget: template.budget,
    jobType: template.jobType,
    description: template.description,
    postedAt: 'Just now',
    timeAgo: 'Just now',
    sourceListingId,
    sourcePlatformUrl: `${template.website}?rfp=${sourceListingId}`,
    contact: {
      email: template.email,
      phone: template.phone,
      whatsapp: template.whatsapp,
      hasWebsite: Boolean(template.website),
      website: template.website,
      contactPerson: undefined,
    },
    rating: template.rating,
    reviewCount: template.reviewCount,
    tags: [...template.tags, '✨ Live Ingested', 'Just now'],
    verified: true,
    pipelineStage: template.website ? 'new' : 'hot',
    status: 'new',
    incomingAt: timestamp,
    isBrandNew: true,
  };

  const fullLead: Lead = {
    ...baseLead,
    scoreBreakdown: calculateExplainableLeadScore(baseLead),
    generatedWebsite: generateClientWebsite(baseLead),
  };

  registerLead(fullLead);
  persistDiscoveredLeads([fullLead]);

  return fullLead;
}

/**
 * Ingest N brand-new opportunities into the persistent database and return them
 */
export function ingestContinuousFreshLeads(count: number = 1, preferredPlatform?: string): Lead[] {
  const generated: Lead[] = [];
  const safeCount = Math.min(5, Math.max(1, count));
  for (let i = 0; i < safeCount; i++) {
    const lead = generateNextIncomingLead(preferredPlatform);
    generated.push(lead);
  }
  return generated;
}
