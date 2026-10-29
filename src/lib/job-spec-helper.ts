import { Lead, JobRequirementSpec } from '@/types';

/**
 * Returns comprehensive job specifications for a lead based on its category, platform, and content
 */
export function getJobRequirementSpec(lead: Lead): JobRequirementSpec {
  if (lead.requirementSpec) {
    return lead.requirementSpec;
  }

  const category = lead.category?.toLowerCase() || '';
  const platform = lead.platform || 'Google My Business';
  const isGmb = lead.type === 'gmb' || platform === 'Google My Business';

  // 0A. WordPress & WooCommerce Development
  if (
    category.includes('wordpress') || 
    category.includes('woocommerce') || 
    lead.title.toLowerCase().includes('wordpress') || 
    lead.title.toLowerCase().includes('woocommerce') || 
    lead.tags?.some(t => t.toLowerCase().includes('wordpress') || t.toLowerCase().includes('woocommerce') || t.toLowerCase().includes('gutenberg'))
  ) {
    return {
      discipline: 'WordPress Website Development',
      platformSource: platform,
      jobId: `WP-${lead.id.toUpperCase()}`,
      clientExperienceLevel: 'Expert Client',
      urgency: 'Immediate Start (< 48 hrs)',
      primaryGoal: 'Architect high-speed bespoke WordPress & WooCommerce online portal with custom Gutenberg blocks, payment gateway integration, and 95+ PageSpeed score.',
      deliverablesDemanded: [
        'Bespoke WordPress Theme / Full-Site Editing Gutenberg Block Architecture',
        'WooCommerce Store Setup, Dynamic Multi-Currency & Local Checkout Gateways',
        'Advanced Custom Fields (ACF Pro) Custom Post Types & Admin Dashboard',
        'Core Web Vitals Optimization (Sub-1s LCP, 95+ Mobile Google PageSpeed)',
        'Automated Database Backups, Security Hardening & SSL Setup'
      ],
      painPoints: [
        'Existing site uses bloated visual builders that take 6+ seconds to load',
        'High mobile cart abandonment due to clunky default checkout',
        'Plugin conflicts causing fatal errors during peak traffic surges'
      ],
      techStackPreference: ['WordPress 6.7+', 'WooCommerce', 'PHP 8.3', 'ACF Pro', 'MySQL', 'WP Rocket', 'Tailwind CSS'],
      matchScore: 99,
      bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
    };
  }

  // 0B. Social Media Management, Reels & Content Creation
  if (
    category.includes('social') || 
    category.includes('content') || 
    lead.title.toLowerCase().includes('social media') || 
    lead.title.toLowerCase().includes('reels') || 
    lead.title.toLowerCase().includes('thumbnail') || 
    lead.title.toLowerCase().includes('content creation') || 
    lead.title.toLowerCase().includes('posting') || 
    lead.tags?.some(t => 
      t.toLowerCase().includes('social media') || 
      t.toLowerCase().includes('reels') || 
      t.toLowerCase().includes('thumbnail') || 
      t.toLowerCase().includes('content creation') || 
      t.toLowerCase().includes('youtube thumbnail')
    )
  ) {
    return {
      discipline: 'Social Media & Content Creation',
      platformSource: platform,
      jobId: `SMM-${lead.id.toUpperCase()}`,
      clientExperienceLevel: 'Intermediate',
      urgency: 'Immediate Start (< 48 hrs)',
      primaryGoal: 'Execute monthly recurring social media management, daily creative post publishing, viral Instagram Reels / TikTok creation, and high-CTR YouTube / social thumbnails.',
      deliverablesDemanded: [
        'Monthly Recurring Content Calendar (30 High-Engagement Posts + Copywriting + Hashtags)',
        'Short-Form Video & Reels Creation (Hook ideation, 9:16 vertical editing, captions & audio sync)',
        'High-CTR YouTube Thumbnail & Social Feed Post Creation (Figma / Photoshop custom graphics)',
        'Multi-Platform Publishing Schedule (Instagram, Facebook, LinkedIn, TikTok & YouTube Shorts)',
        'Monthly Performance & Analytics Audit (Reach, Profile Visits, Engagement Rate & Follower Growth)'
      ],
      painPoints: [
        'Inconsistent posting schedule causing algorithm reach and follower growth to plummet',
        'Low click-through rates (CTR) on YouTube videos due to generic non-custom thumbnails',
        'No dedicated in-house team to produce daily short-form Reels and high-retention video hooks',
        'Competitors publishing daily high-aesthetic content and capturing the target audience'
      ],
      techStackPreference: ['Figma', 'Adobe Photoshop', 'CapCut Pro', 'Premiere Pro', 'Canva Pro', 'Meta Business Suite', 'Buffer / Hootsuite'],
      matchScore: 97,
      bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
    };
  }

  // 0C. Meta Ads (Facebook & Instagram Ads) & Paid Social Funnels
  if (
    platform.includes('Meta') || 
    platform.includes('Facebook') || 
    platform.includes('Instagram') || 
    category.includes('meta') || 
    lead.title.toLowerCase().includes('meta') || 
    lead.title.toLowerCase().includes('facebook ads') || 
    lead.title.toLowerCase().includes('roas') || 
    lead.tags?.some(t => t.toLowerCase().includes('meta ads') || t.toLowerCase().includes('facebook ads') || t.toLowerCase().includes('roas') || t.toLowerCase().includes('capi'))
  ) {
    return {
      discipline: 'Meta Ads & Paid Social',
      platformSource: platform,
      jobId: `META-${lead.id.toUpperCase()}`,
      clientExperienceLevel: 'Intermediate',
      urgency: 'Immediate Start (< 48 hrs)',
      primaryGoal: 'Deploy scalable Meta Ads (Facebook & Instagram) acquisition campaign with Conversions API (CAPI), high-ROAS creative testing, and automated lead capture.',
      deliverablesDemanded: [
        'Meta Ads Manager Full Setup: Pixel, Conversions API (CAPI) & Server-Side Event Tracking',
        'High-Converting Ad Creative Angles (Reels Video Hooks, UGC & Feed Carousels)',
        'Audience Targeting Architecture (Lookalike 1-3%, High-Intent Interest & Warm Retargeting)',
        'Automated WhatsApp Direct Lead Capture & Instant CRM Webhook Integration',
        'Weekly Performance Dashboard (ROAS, CPA, CPL & Conversion Dropoff Metrics)'
      ],
      painPoints: [
        'High Cost-Per-Lead (CPL) and low ROAS from unoptimized broad targeting',
        'iOS 14.5+ tracking loss causing underreported sales and broken retargeting',
        'Ad creative fatigue causing customer acquisition costs to spike'
      ],
      techStackPreference: ['Meta Ads Manager', 'Facebook Pixel & CAPI', 'Canva / Figma Creative Kit', 'Zapier Webhooks', 'Google Analytics 4'],
      matchScore: 98,
      bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
    };
  }

  // 1. Mobile App Development
  if (category.includes('mobile') || lead.title.toLowerCase().includes('mobile') || lead.title.toLowerCase().includes('app') || lead.tags?.some(t => t.toLowerCase().includes('mobile') || t.toLowerCase().includes('ios') || t.toLowerCase().includes('flutter'))) {
    return {
      discipline: 'Mobile App Development',
      platformSource: platform,
      jobId: `APP-${lead.id.toUpperCase()}`,
      clientExperienceLevel: 'Expert Client',
      urgency: 'Immediate Start (< 48 hrs)',
      primaryGoal: 'Launch cross-platform iOS & Android mobile application with real-time push notifications and secure auth.',
      deliverablesDemanded: [
        'Interactive App Screen Flow (Splash, Dashboard, Booking, Settings)',
        'Cross-platform UI (React Native / Flutter)',
        'Biometric FaceID / TouchID Authentication',
        'Direct Client Communication & Notification System'
      ],
      painPoints: [
        'Web-only interface is losing customer mobile engagement',
        'Customer repeat order rate dropped without mobile app presence',
        'Competitors have 5-star mobile apps on Apple App Store & Google Play'
      ],
      techStackPreference: ['Flutter', 'React Native', 'Firebase Auth', 'Tailwind CSS', 'Fastlane'],
      matchScore: 98,
      bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
    };
  }

  // 2. Brand Identity & Vector SVG System
  if (category.includes('logo') || category.includes('brand') || lead.title.toLowerCase().includes('logo') || lead.tags?.some(t => t.toLowerCase().includes('logo'))) {
    return {
      discipline: 'Brand Identity & Logos',
      platformSource: platform,
      jobId: `LOGO-${lead.id.toUpperCase()}`,
      clientExperienceLevel: 'Intermediate',
      urgency: 'Urgent (This Week)',
      primaryGoal: 'Synthesize 6 high-conversion vector SVG logo concepts with company mark and typographic brand name.',
      deliverablesDemanded: [
        '6 Distinct Vector SVG Concepts (Geometric, Serif Crest, Nexus Tech, Monolith, Diamond, Kinetic)',
        'Dark & Light Mode Vector Contrast Profiles',
        'Direct 1-Click Copy SVG Vector Path Markup',
        'Scalable Brand Icon Marks for Web & Mobile Headers'
      ],
      painPoints: [
        'Current branding is outdated or lacking vector resolution for retina displays',
        'No unified typographic hierarchy across digital properties',
        'Competitors look significantly more prestigious and established'
      ],
      techStackPreference: ['Figma', 'Vector SVG', 'Adobe Illustrator', 'Canvas API'],
      matchScore: 96,
      bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
    };
  }

  // 3. Graphic Design & Brand Identity
  if (category.includes('graphic') || lead.title.toLowerCase().includes('brand') || lead.title.toLowerCase().includes('packaging') || lead.title.toLowerCase().includes('logo') || lead.tags?.some(t => t.toLowerCase().includes('graphic') || t.toLowerCase().includes('packaging'))) {
    return {
      discipline: 'Graphic Design',
      platformSource: platform,
      jobId: `DES-${lead.id.toUpperCase()}`,
      clientExperienceLevel: 'First-Time Client',
      urgency: 'Urgent (This Week)',
      primaryGoal: 'Establish luxury, consistent visual brand identity including primary vector logo, color palette, and marketing assets.',
      deliverablesDemanded: [
        'Vector SVG Master Logo (Dark, Light, Monochrome & Icon Mark)',
        'Bespoke Hex Color Palette & Typography Hierarchy',
        'Print-Ready Brochure / Kraft Packaging Graphics',
        'Social Media Kit & 3D Realistic Product Mockups'
      ],
      painPoints: [
        'Using generic Canva templates which look amateur',
        'Launching in new luxury retail markets without consistent branding',
        'Need vector files for high-resolution packaging and signage'
      ],
      techStackPreference: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Vector SVG'],
      matchScore: 92,
      bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
    };
  }

  // 4. Software SOW / SaaS
  if (category.includes('software') || category.includes('saas') || lead.title.toLowerCase().includes('saas') || lead.title.toLowerCase().includes('sow') || lead.tags?.some(t => t.toLowerCase().includes('saas') || t.toLowerCase().includes('software'))) {
    return {
      discipline: 'Software SOW',
      platformSource: platform,
      jobId: `SOW-${lead.id.toUpperCase()}`,
      clientExperienceLevel: 'Expert Client',
      urgency: 'Immediate Start (< 48 hrs)',
      primaryGoal: 'Architect full-stack scalable web architecture with milestone deliverables, API endpoints, and database schema.',
      deliverablesDemanded: [
        'Comprehensive Scope of Work (SOW) & Architecture Blueprint',
        'Next.js 14 Server Components + TypeScript Backend',
        'PostgreSQL / Prisma Database Modeling & Auth',
        'Milestone Delivery Schedule & SLA Guarantee'
      ],
      painPoints: [
        'Previous agency delivered unmaintainable legacy PHP code',
        'Frequent server crashes during peak traffic',
        'No proper API documentation or automated deployment pipeline'
      ],
      techStackPreference: ['Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      matchScore: 97,
      bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
    };
  }

  // 5. Web Development & Local Business Digitalization (GMB & Web)
  return {
    discipline: isGmb ? 'Local Business Digitalization' : 'Web Development',
    platformSource: platform,
    jobId: isGmb ? `GMB-${lead.id.toUpperCase()}` : `WEB-${lead.id.toUpperCase()}`,
    clientExperienceLevel: isGmb ? 'First-Time Client' : 'Intermediate',
    urgency: isGmb && !lead.contact.hasWebsite ? 'Immediate Start (< 48 hrs)' : 'Urgent (This Week)',
    primaryGoal: !lead.contact.hasWebsite 
      ? `Deploy bespoke, mobile-optimized official website to convert Google My Business searches into online bookings.`
      : `Revamp corporate website into modern high-speed Next.js platform with automated customer inquiries.`,
    deliverablesDemanded: [
      'Complete Responsive Web Platform (Sticky Navbar, Hero, Services, Footer)',
      'Direct WhatsApp Consultation & Appointment Booking Flow',
      'Local SEO Metadata & Google Business Profile Schema Integration',
      'Mobile-First Touch Optimization (iPhone & Android)'
    ],
    painPoints: !lead.contact.hasWebsite
      ? [
          'Business has NO official website — losing 100% of organic Google search traffic',
          'Relying solely on physical walk-ins and manual Instagram messages',
          'High local search rating (★ 4.9) but nowhere for customers to book or view pricing'
        ]
      : [
          'Existing website is slow, outdated, and fails Google Core Web Vitals',
          'High visitor bounce rate on mobile devices',
          'No automated lead capture or CRM integration'
        ],
    techStackPreference: ['Next.js 14', 'Tailwind CSS', 'Vercel Edge', 'WhatsApp API', 'Google Cloud Places'],
    matchScore: !lead.contact.hasWebsite ? 99 : 91,
    bidStatus: lead.pipelineStage === 'pending' ? 'pitched' : 'unpitched',
  };
}
