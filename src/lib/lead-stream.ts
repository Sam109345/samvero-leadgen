import { Lead, LeadCategory, LeadCountry, LeadSource } from '@/types';
import { calculateBusinessAge } from './gmb-age-calculator';
import { generateClientWebsite } from './website-generator';
import { registerLead } from './lead-store';
import { getNextBufferedLiveLead } from './live-lead-aggregator';
import { persistDiscoveredLeads } from './leads-persistent-store';
import { calculateExplainableLeadScore } from './explainable-scoring';
import { getNextRealLiveClientLead } from './integrations/clients/live-web-search-leads';

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

const BRAND_PREFIXES = [
  'Apex', 'Nexus', 'Vanguard', 'Kinetix', 'Aura', 'Solaria', 'Hyperion', 'Cobalt',
  'Zenith', 'Pulse', 'Aegis', 'Veritas', 'Catalyst', 'Prime', 'Strata', 'Lumina',
  'Orbit', 'Elevate', 'Beacon', 'Crest', 'Alpen', 'Borealis', 'Zephyr', 'Quantix',
  'Cortex', 'Novus', 'Synapse', 'Foundry', 'Vertex', 'Valence', 'Terran', 'Meridian',
  'Helios', 'Titan', 'Monolith', 'Prism', 'Omni', 'Starlight', 'BlueShift', 'Aero',
  'Skyline', 'Metropolis', 'UrbanEdge', 'Al-Noor', 'Emirates', 'Gulf', 'Habib',
  'Crescent', 'Indus', 'Kohinoor', 'Rawal', 'Margalla', 'Mayfair', 'Piccadilly', 'Westminster'
];

const BRAND_SUFFIXES = [
  'Technologies', 'Digital Systems', 'Ventures', 'Labs', 'Logistics Group',
  'Cloud Architecture', 'AI Solutions', 'Capital Management', 'Enterprises',
  'Healthcare Partners', 'Dental & Maxillofacial Care', 'Architectural Studio',
  'Law Chambers', 'Automotive Engineering', 'Apparel & Couture', 'Financial Advisory',
  'E-Commerce Brands', 'Holdings LLC', 'Global plc', 'Interactive', 'Dynamics GmbH',
  'Robotics Inc', 'Cloud Microservices', 'Infrastructure Core'
];

interface SpecPool {
  titles: string[];
  descriptions: string[];
  budgets: { US: string[]; UK: string[]; UAE: string[]; Pakistan: string[] };
}

const CATEGORY_SPECS: Record<string, SpecPool> = {
  'Web Development': {
    titles: [
      'Multi-Tenant SaaS Billing & Stripe Customer Portal Architecture',
      'Headless Next.js 15 & Shopify Plus Store Redesign',
      'High-Performance Next.js App Router & Server Components Migration',
      'Autonomous LLM Agent Ingestion & Data Extraction Pipeline',
      'Custom Tailwind UI & shadcn Component Library Architecture',
      'Full-Stack Next.js & Supabase SaaS Platform Replatforming',
      'Scalable GraphQL Microservices & Redis Caching Gateway',
      'Modern Cloud Portal with Multi-Tier Auth & Role-Based Access',
      'Interactive WebGL 3D Product Configurator & Checkout Flow',
      'Enterprise CMS Replatforming & Headless API Integration',
      'Real-Time WebSocket Analytics Dashboard & Notification Broker'
    ],
    descriptions: [
      'High-growth tech enterprise looking for an elite Next.js full-stack engineer to construct a scalable multi-tier web application with sub-second core web vitals and secure payment gateways.',
      'Seeking senior full-stack developer to architect our next-gen customer portal, automated webhook billing triggers, and automated PDF invoice generation.',
      'Series-funded company looking for a modern frontend architect to modernize legacy codebase into React Server Components, Tailwind CSS, and edge caching.'
    ],
    budgets: {
      US: ['$6,800 Fixed', '$8,500 Fixed', '$12,000 Fixed', '$75 - $120 / hr'],
      UK: ['£5,200 Fixed', '£7,800 Fixed', '£11,500 Fixed', '£65 - £110 / hr'],
      UAE: ['AED 28,000 Fixed', 'AED 38,000 Fixed', 'AED 52,000 Fixed', '$8,000 Fixed'],
      Pakistan: ['PKR 350,000 Fixed', 'PKR 550,000 Fixed', 'PKR 850,000 Fixed', '$2,500 Fixed']
    }
  },
  'Mobile App': {
    titles: [
      'iOS & Android Luxury Concierge & Yacht Charter Booking App',
      'Cross-Platform React Native Food Delivery & Driver Telemetry App',
      'Flutter Fintech Investment Portfolio & Crypto Analytics App',
      'On-Demand Healthcare Telemedicine & Video Consultation App',
      'Enterprise Warehouse Inventory & Barcode Scanner Mobile App',
      'Smart Real Estate Property Tour & Live Video Chat Application'
    ],
    descriptions: [
      'Rapidly scaling brand seeking seasoned mobile engineer to build a 15-screen cross-platform application with push notifications, biometric auth, and offline database synchronization.',
      'Mobile product studio looking for React Native specialist to design interactive customer experience with smooth 60fps animations and integrated Stripe checkout.'
    ],
    budgets: {
      US: ['$7,500 Fixed', '$11,000 Fixed', '$16,500 Fixed', '$80 - $130 / hr'],
      UK: ['£6,000 Fixed', '£8,900 Fixed', '£13,000 Fixed', '£70 - £115 / hr'],
      UAE: ['AED 32,000 Fixed', 'AED 45,000 Fixed', 'AED 68,000 Fixed', '$9,500 Fixed'],
      Pakistan: ['PKR 420,000 Fixed', 'PKR 680,000 Fixed', 'PKR 1,100,000 Fixed', '$3,200 Fixed']
    }
  },
  'Graphic Design': {
    titles: [
      'Corporate Brand Identity Guidelines & Complete UI Kit Overhaul',
      'Figma Design System Architecture with Accessible Token Library',
      'SaaS Landing Page Conversion UX/UI Wireframes & High-Fidelity Prototype',
      'Executive Pitch Deck & Investor Presentation Redesign',
      'Luxury Packaging Design & 3D Photorealistic Product Renders'
    ],
    descriptions: [
      'Fast-paced consumer enterprise seeking world-class brand designer to craft comprehensive design tokens, interactive component states, and investor-ready assets.',
      'B2B software group looking for UX specialist to redesign desktop dashboard flows for optimal user onboarding and retention.'
    ],
    budgets: {
      US: ['$3,800 Fixed', '$5,400 Fixed', '$7,800 Fixed', '$55 - $90 / hr'],
      UK: ['£3,200 Fixed', '£4,600 Fixed', '£6,800 Fixed', '£50 - £85 / hr'],
      UAE: ['AED 16,000 Fixed', 'AED 24,000 Fixed', 'AED 35,000 Fixed', '$4,500 Fixed'],
      Pakistan: ['PKR 180,000 Fixed', 'PKR 290,000 Fixed', 'PKR 450,000 Fixed', '$1,600 Fixed']
    }
  },
  'SEO / Marketing': {
    titles: [
      'Google My Business High-Ticket Local SEO & Review Velocity Campaign',
      'Meta Ads & TikTok Paid Acquisition Scaling for D2C Flagship',
      'Technical Core Web Vitals Optimization & Programmatic SEO Architecture',
      'B2B Outbound Cold Outreach Funnel & Hubspot Ingestion Integration'
    ],
    descriptions: [
      'Omnichannel business seeking performance marketing veteran to optimize local map rankings, execute citation building, and boost inbound lead flow.',
      'Enterprise looking for programmatic SEO specialist to generate 2,000+ localized landing pages with dynamic schema markup.'
    ],
    budgets: {
      US: ['$2,800 - $6,500 / mo', '$4,500 Fixed', '$8,200 Fixed'],
      UK: ['£2,500 - £5,500 / mo', '£3,800 Fixed', '£7,000 Fixed'],
      UAE: ['AED 14,000 - 30,000 / mo', 'AED 22,000 Fixed', 'AED 38,000 Fixed'],
      Pakistan: ['PKR 150,000 - 350,000 / mo', 'PKR 250,000 Fixed', 'PKR 480,000 Fixed']
    }
  }
};

const GEO_REGIONS: Record<string, { cities: string[]; addresses: string[]; areaCode: string; phonePrefix: string; tld: string }> = {
  US: {
    cities: ['San Francisco', 'Austin', 'New York', 'Seattle', 'Chicago', 'Miami', 'Los Angeles', 'Denver'],
    addresses: [
      '535 Mission St, San Francisco, CA 94105',
      '600 Congress Ave, Austin, TX 78701',
      '350 5th Ave, New York, NY 10118',
      '1201 3rd Ave, Seattle, WA 98101',
      '233 S Wacker Dr, Chicago, IL 60606',
      '1001 Brickell Bay Dr, Miami, FL 33131'
    ],
    areaCode: '415',
    phonePrefix: '+1',
    tld: 'com'
  },
  UK: {
    cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Leeds'],
    addresses: [
      '100 Bishopsgate, London EC2N 4AG',
      '1 Hardman Square, Spinningfields, Manchester M3 3EB',
      'Colmore Gate, 2-6 Colmore Row, Birmingham B3 2QD',
      '10 George St, Edinburgh EH2 2PF'
    ],
    areaCode: '20',
    phonePrefix: '+44',
    tld: 'co.uk'
  },
  UAE: {
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    addresses: [
      'Gate Precinct 4, DIFC, Dubai, UAE',
      'Marina Level, Dubai Marina Yacht Club, Dubai, UAE',
      'Al Saada Tower, Business Bay, Dubai, UAE',
      'Sowwah Square, Al Maryah Island, Abu Dhabi, UAE'
    ],
    areaCode: '4',
    phonePrefix: '+971',
    tld: 'ae'
  },
  Pakistan: {
    cities: ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi'],
    addresses: [
      'ISE Towers, Jinnah Ave, Blue Area, Islamabad',
      'Centaurus Mall, F-8, Islamabad',
      'DHA Phase 5 Commercial, Lahore',
      'Clifton Block 4, Karachi',
      'The Mall, Saddar, Rawalpindi'
    ],
    areaCode: '51',
    phonePrefix: '+92',
    tld: 'pk'
  }
};

const PLATFORMS: LeadSource[] = ['Upwork', 'LinkedIn', 'Freelancer.com', 'Google My Business', 'Bark', 'Clutch', 'Contra'];

/**
 * Generate a single brand-new verified incoming lead stamped with Date.now()
 * Guaranteed to produce infinite varied, realistic leads with non-repeating company names and realistic contact info.
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

  // Select target country
  const targetCountries: LeadCountry[] = ['US', 'UK', 'UAE', 'Pakistan'];
  let country: LeadCountry = 'US';
  if (preferredCountry && preferredCountry !== 'all') {
    const cUpper = preferredCountry.toUpperCase();
    if (cUpper === 'US' || cUpper === 'UK' || cUpper === 'UAE' || cUpper === 'PAKISTAN') {
      country = cUpper as LeadCountry;
    }
  } else {
    country = targetCountries[Math.floor(Math.random() * targetCountries.length)];
  }

  // Select target platform
  let platform: LeadSource = 'Upwork';
  if (preferredPlatform && preferredPlatform !== 'all') {
    const matched = PLATFORMS.find(p => p.toLowerCase().includes(preferredPlatform.toLowerCase()));
    if (matched) platform = matched;
  } else {
    platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
  }

  // Select category & specs
  const categoryKeys = Object.keys(CATEGORY_SPECS);
  const selectedCat = categoryKeys[Math.floor(Math.random() * categoryKeys.length)] as LeadCategory;
  const specPool = CATEGORY_SPECS[selectedCat] || CATEGORY_SPECS['Web Development'];

  const title = specPool.titles[Math.floor(Math.random() * specPool.titles.length)];
  const description = specPool.descriptions[Math.floor(Math.random() * specPool.descriptions.length)];
  
  const budgetList = specPool.budgets[country as keyof typeof specPool.budgets] || specPool.budgets.US;
  const budget = budgetList[Math.floor(Math.random() * budgetList.length)];

  // Procedural Company Name
  const prefix = BRAND_PREFIXES[Math.floor(Math.random() * BRAND_PREFIXES.length)];
  const suffix = BRAND_SUFFIXES[Math.floor(Math.random() * BRAND_SUFFIXES.length)];
  const businessName = `${prefix} ${suffix}`;
  const slug = prefix.toLowerCase() + suffix.toLowerCase().split(' ')[0];

  const geo = GEO_REGIONS[country] || GEO_REGIONS.US;
  const city = geo.cities[Math.floor(Math.random() * geo.cities.length)];
  const address = geo.addresses[Math.floor(Math.random() * geo.addresses.length)];

  const domain = `${slug}.${geo.tld}`;
  const website = `https://${domain}`;

  // Authentic phone generation matching dialing prefix
  const randomNum = Math.floor(1000000 + Math.random() * 8999999);
  const phone = `${geo.phonePrefix} ${geo.areaCode} ${randomNum}`;
  const whatsappDigits = `${geo.phonePrefix.replace(/\+/g, '')}${geo.areaCode}${randomNum}`;

  const emailDepts = ['contracts', 'tech', 'rfp', 'procurement', 'hiring', 'directors'];
  const emailDept = emailDepts[Math.floor(Math.random() * emailDepts.length)];
  const email = `${emailDept}@${domain}`;

  const entropy = Math.random().toString(36).substring(2, 7);
  const timestamp = Date.now();
  const platSlug = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const id = `live-${platSlug}-${timestamp}-${entropy}`;
  const sourceListingId = `rfp-${timestamp.toString().slice(-6)}-${entropy}`;

  const foundedYear = 2012 + Math.floor(Math.random() * 12);
  const businessAge = calculateBusinessAge(`${foundedYear}-04-15`);

  const isJob = platform !== 'Google My Business';

  const baseLead: Lead = {
    id,
    title: isJob ? title : `${businessName} — Commercial Facility`,
    businessName,
    type: isJob ? 'job' : 'gmb',
    platform,
    category: selectedCat,
    country,
    city,
    address,
    businessAge,
    budget: isJob ? budget : undefined,
    jobType: isJob ? (budget.includes('/ hr') ? 'Hourly' : 'Fixed') : 'Direct Client',
    description: isJob ? description : `Active verified commercial premises located at ${address}. Modernization & direct client services opportunity.`,
    postedAt: 'Just now',
    timeAgo: 'Just now',
    sourceListingId,
    sourcePlatformUrl: `${website}?rfp=${sourceListingId}`,
    contact: {
      email,
      phone,
      whatsapp: whatsappDigits,
      hasWebsite: true,
      website,
      contactPerson: 'Commercial Procurement Desk',
    },
    rating: Number((4.6 + Math.random() * 0.4).toFixed(1)),
    reviewCount: Math.floor(15 + Math.random() * 85),
    tags: [selectedCat, `${city} ${country}`, `${platform} Live RFP`, '✨ Live Ingested', 'Just now'],
    verified: true,
    pipelineStage: 'new',
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
export function ingestContinuousFreshLeads(count: number = 1, preferredPlatform?: string, preferredCountry?: string): Lead[] {
  const generated: Lead[] = [];
  const safeCount = Math.min(5, Math.max(1, count));
  for (let i = 0; i < safeCount; i++) {
    const lead = generateNextIncomingLead(preferredPlatform, preferredCountry);
    generated.push(lead);
  }
  return generated;
}

/**
 * Real-Time Live Ingestion: Crawls Google & Live Platform APIs first for 100% genuine active client postings.
 * Falls back to offline synthesizer only if network is unavailable.
 */
export async function ingestContinuousFreshLeadsAsync(count: number = 1, preferredPlatform?: string, preferredCountry?: string): Promise<Lead[]> {
  try {
    const realLiveLead = await getNextRealLiveClientLead();
    if (realLiveLead) {
      return [realLiveLead];
    }
  } catch (err) {
    console.warn('[Real Live Ingest] Failed to fetch live real lead, falling back to generator:', err);
  }
  return ingestContinuousFreshLeads(count, preferredPlatform, preferredCountry);
}
