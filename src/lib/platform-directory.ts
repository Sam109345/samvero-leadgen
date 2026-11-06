/**
 * SAMVERO Platform Directory & Taxonomy
 * 
 * Strict categorization of 70+ client acquisition platforms across 8 core categories:
 * 1. Freelancing Marketplaces
 * 2. B2B Lead Generation Platforms
 * 3. Business Directories & Company Discovery
 * 4. Social Media Platforms for Client Acquisition
 * 5. Remote Jobs & Contract Opportunities
 * 6. Specialized Platforms for Website Development
 * 7. Pakistan-Based Platforms
 * 8. Agency Recommended Platforms (Highest Priority)
 */

export type PlatformCategoryId =
  | 'agency_priority'
  | 'freelance'
  | 'b2b_leadgen'
  | 'directories'
  | 'social_media'
  | 'remote_jobs'
  | 'specialized_web'
  | 'pakistan';

export interface PlatformCategoryMeta {
  id: PlatformCategoryId;
  number: number;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  iconName: string;
  badgeColor: string;
  platforms: PlatformDefinition[];
}

export interface PlatformDefinition {
  id: string;
  name: string;
  website: string;
  category: PlatformCategoryId;
  purpose: string;
  isAgencyPriority?: boolean;
  priorityOrder?: number;
  liveStatus: 'live_api' | 'live_feed' | 'live_connector' | 'direct_portal';
  directSearchUrl?: (query: string, city?: string) => string;
}

// 1. Freelancing Marketplaces
export const FREELANCE_MARKETPLACES: PlatformDefinition[] = [
  {
    id: 'upwork',
    name: 'Upwork',
    website: 'https://www.upwork.com',
    category: 'freelance',
    purpose: 'Clients actively posting high-ticket projects, web dev & marketing scopes.',
    isAgencyPriority: true,
    priorityOrder: 1,
    liveStatus: 'live_feed',
    directSearchUrl: (q) => `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(q || 'website development Next.js')}&sort=recency`,
  },
  {
    id: 'fiverr',
    name: 'Fiverr',
    website: 'https://www.fiverr.com',
    category: 'freelance',
    purpose: 'Inbound service orders and buyer client briefs.',
    isAgencyPriority: true,
    priorityOrder: 2,
    liveStatus: 'direct_portal',
    directSearchUrl: (q) => `https://www.fiverr.com/search/gigs?query=${encodeURIComponent(q || 'web development')}`,
  },
  {
    id: 'freelancer',
    name: 'Freelancer.com',
    website: 'https://www.freelancer.com',
    category: 'freelance',
    purpose: 'Real-time project contest and bidding marketplace.',
    liveStatus: 'live_api',
    directSearchUrl: (q) => `https://www.freelancer.com/jobs/${encodeURIComponent(q || 'website-design')}`,
  },
  {
    id: 'peopleperhour',
    name: 'PeoplePerHour',
    website: 'https://www.peopleperhour.com',
    category: 'freelance',
    purpose: 'Website, creative and digital marketing projects.',
    isAgencyPriority: true,
    priorityOrder: 4,
    liveStatus: 'live_feed',
    directSearchUrl: (q) => `https://www.peopleperhour.com/freelance-jobs?ref=search&query=${encodeURIComponent(q || 'website development')}`,
  },
  {
    id: 'guru',
    name: 'Guru',
    website: 'https://www.guru.com',
    category: 'freelance',
    purpose: 'Direct enterprise technical contracting and web engineering.',
    liveStatus: 'direct_portal',
    directSearchUrl: (q) => `https://www.guru.com/d/jobs/q/${encodeURIComponent(q || 'web development')}`,
  },
  {
    id: 'toptal',
    name: 'Toptal',
    website: 'https://www.toptal.com',
    category: 'freelance',
    purpose: 'Top 3% elite enterprise software and product design contracts.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'contra',
    name: 'Contra',
    website: 'https://contra.com',
    category: 'freelance',
    purpose: 'Commission-free portfolio-led agency and independent client acquisition.',
    isAgencyPriority: true,
    priorityOrder: 5,
    liveStatus: 'live_connector',
    directSearchUrl: (q) => `https://contra.com/discover?query=${encodeURIComponent(q || 'web developer')}`,
  },
  {
    id: 'workana',
    name: 'Workana',
    website: 'https://www.workana.com',
    category: 'freelance',
    purpose: 'Latin America and international client projects.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'truelancer',
    name: 'Truelancer',
    website: 'https://www.truelancer.com',
    category: 'freelance',
    purpose: 'Global curated freelance projects and fixed milestones.',
    liveStatus: 'direct_portal',
  },
  {
    id: '99designs',
    name: '99designs',
    website: 'https://99designs.com',
    category: 'freelance',
    purpose: 'High-ticket graphic design, logo marks and brand identity contests.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'designcrowd',
    name: 'DesignCrowd',
    website: 'https://www.designcrowd.com',
    category: 'freelance',
    purpose: 'Custom visual design, branding and website layout crowdsourcing.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'legiit',
    name: 'Legiit',
    website: 'https://legiit.com',
    category: 'freelance',
    purpose: 'SEO, digital marketing, backlinks and WordPress development marketplace.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'bark',
    name: 'Bark',
    website: 'https://www.bark.com',
    category: 'freelance',
    purpose: 'Verified local business service buyers across US, UK & UAE.',
    liveStatus: 'live_connector',
  },
  {
    id: 'mayple',
    name: 'Mayple',
    website: 'https://www.mayple.com',
    category: 'freelance',
    purpose: 'Vetted growth marketing and high-tier agency contracts.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'codeable',
    name: 'Codeable',
    website: 'https://codeable.io',
    category: 'freelance',
    purpose: 'Dedicated WordPress, WooCommerce and Elementor client acquisition.',
    liveStatus: 'direct_portal',
  },
];

// 2. B2B Lead Generation Platforms
export const B2B_LEADGEN_PLATFORMS: PlatformDefinition[] = [
  {
    id: 'apollo',
    name: 'Apollo.io',
    website: 'https://www.apollo.io',
    category: 'b2b_leadgen',
    purpose: 'Business contacts, verified emails, and decision-maker phone discovery.',
    isAgencyPriority: true,
    priorityOrder: 6,
    liveStatus: 'live_connector',
    directSearchUrl: (q) => `https://app.apollo.io/#/people?finderViewId=5b8050e8549f0e1cd7c3f&personTitles[]=Founder&personTitles[]=CEO&qKeywords=${encodeURIComponent(q || 'CEO')}`,
  },
  {
    id: 'zoominfo',
    name: 'ZoomInfo',
    website: 'https://www.zoominfo.com',
    category: 'b2b_leadgen',
    purpose: 'Enterprise company hierarchy and high-accuracy decision-maker data.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'lusha',
    name: 'Lusha',
    website: 'https://www.lusha.com',
    category: 'b2b_leadgen',
    purpose: 'Direct phone numbers and verified business contact details.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'lead411',
    name: 'Lead411',
    website: 'https://www.lead411.com',
    category: 'b2b_leadgen',
    purpose: 'Trigger-based verified B2B prospecting data.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'uplead',
    name: 'UpLead',
    website: 'https://www.uplead.com',
    category: 'b2b_leadgen',
    purpose: '95% data accuracy guarantee for B2B contacts.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'snov',
    name: 'Snov.io',
    website: 'https://snov.io',
    category: 'b2b_leadgen',
    purpose: 'Automated email finding, domain search, and cold outreach sequences.',
    liveStatus: 'live_connector',
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    website: 'https://hunter.io',
    category: 'b2b_leadgen',
    purpose: 'Domain business email discovery and SMTP deliverability checks.',
    liveStatus: 'live_connector',
    directSearchUrl: (q) => `https://hunter.io/search/${encodeURIComponent(q || 'stripe.com')}`,
  },
  {
    id: 'cognism',
    name: 'Cognism',
    website: 'https://www.cognism.com',
    category: 'b2b_leadgen',
    purpose: 'GDPR-compliant premium B2B phone intelligence.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'rocketreach',
    name: 'RocketReach',
    website: 'https://rocketreach.co',
    category: 'b2b_leadgen',
    purpose: 'Professional contact discovery for 700M+ professionals.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'leadiq',
    name: 'LeadIQ',
    website: 'https://leadiq.com',
    category: 'b2b_leadgen',
    purpose: '1-click prospecting and Salesforce/HubSpot lead sync.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'getprospect',
    name: 'GetProspect',
    website: 'https://getprospect.com',
    category: 'b2b_leadgen',
    purpose: 'LinkedIn email finder and B2B email database.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'clay',
    name: 'Clay',
    website: 'https://www.clay.com',
    category: 'b2b_leadgen',
    purpose: 'Automated 50+ provider lead waterfall enrichment and AI personalization.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'instantly',
    name: 'Instantly',
    website: 'https://instantly.ai',
    category: 'b2b_leadgen',
    purpose: 'Scale cold email outreach campaigns with automated inbox warmup.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'smartlead',
    name: 'Smartlead',
    website: 'https://www.smartlead.ai',
    category: 'b2b_leadgen',
    purpose: 'Multi-mailbox cold email outreach infrastructure.',
    liveStatus: 'direct_portal',
  },
];

// 3. Business Directories & Company Discovery
export const BUSINESS_DIRECTORIES: PlatformDefinition[] = [
  {
    id: 'gmb',
    name: 'Google Maps',
    website: 'https://maps.google.com',
    category: 'directories',
    purpose: 'Local businesses with missing, broken, or outdated websites.',
    isAgencyPriority: true,
    priorityOrder: 8,
    liveStatus: 'live_api',
    directSearchUrl: (q, city) => `https://www.google.com/maps/search/${encodeURIComponent((q || 'dental clinic') + ' ' + (city || 'Lahore'))}`,
  },
  {
    id: 'clutch',
    name: 'Clutch',
    website: 'https://clutch.co',
    category: 'directories',
    purpose: 'B2B companies, web agencies, and high-budget service buyers.',
    isAgencyPriority: true,
    priorityOrder: 7,
    liveStatus: 'live_connector',
    directSearchUrl: (q) => `https://clutch.co/search?query=${encodeURIComponent(q || 'web development')}`,
  },
  {
    id: 'yelp',
    name: 'Yelp',
    website: 'https://www.yelp.com',
    category: 'directories',
    purpose: 'Commercial local business directories with consumer reviews and contact data.',
    liveStatus: 'direct_portal',
    directSearchUrl: (q, city) => `https://www.yelp.com/search?find_desc=${encodeURIComponent(q || 'restaurants')}&find_loc=${encodeURIComponent(city || 'Austin, TX')}`,
  },
  {
    id: 'yellowpages',
    name: 'Yellow Pages',
    website: 'https://www.yellowpages.com',
    category: 'directories',
    purpose: 'Direct company phone numbers, physical addresses, and trade contacts.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'crunchbase',
    name: 'Crunchbase',
    website: 'https://www.crunchbase.com',
    category: 'directories',
    purpose: 'Funded tech startups, venture-backed companies, and executive contacts.',
    liveStatus: 'direct_portal',
    directSearchUrl: (q) => `https://www.crunchbase.com/discover/organization.companies?query=${encodeURIComponent(q || 'fintech')}`,
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    website: 'https://www.producthunt.com',
    category: 'directories',
    purpose: 'Newly launched software startups needing design, SEO & web support.',
    liveStatus: 'live_feed',
    directSearchUrl: (q) => `https://www.producthunt.com/search?q=${encodeURIComponent(q || 'saas')}`,
  },
  {
    id: 'goodfirms',
    name: 'GoodFirms',
    website: 'https://www.goodfirms.co',
    category: 'directories',
    purpose: 'IT companies, enterprise software buyers, and service procurement.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'designrush',
    name: 'DesignRush',
    website: 'https://www.designrush.com',
    category: 'directories',
    purpose: 'Agencies and commercial businesses actively shopping for proposals.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'sortlist',
    name: 'Sortlist',
    website: 'https://www.sortlist.com',
    category: 'directories',
    purpose: 'Businesses seeking verified digital agencies for turnkey projects.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'ycombinator',
    name: 'Y Combinator',
    website: 'https://www.ycombinator.com/companies',
    category: 'directories',
    purpose: 'World’s top startup directory with active founder contacts and hiring rounds.',
    liveStatus: 'direct_portal',
    directSearchUrl: (q) => `https://www.ycombinator.com/companies?query=${encodeURIComponent(q || 'ai')}`,
  },
  {
    id: 'g2',
    name: 'G2',
    website: 'https://www.g2.com',
    category: 'directories',
    purpose: 'Software companies, B2B vendors, and software ecosystem buyers.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'capterra',
    name: 'Capterra',
    website: 'https://www.capterra.com',
    category: 'directories',
    purpose: 'Business software ecosystem and prospective vendor lists.',
    liveStatus: 'direct_portal',
  },
];

// 4. Social Media Platforms for Client Acquisition
export const SOCIAL_MEDIA_PLATFORMS: PlatformDefinition[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    website: 'https://www.linkedin.com',
    category: 'social_media',
    purpose: 'Direct decision-maker outreach, founders, CMOs & business owners.',
    isAgencyPriority: true,
    priorityOrder: 3,
    liveStatus: 'live_connector',
    directSearchUrl: (q) => `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(q || 'Founder hiring web developer')}`,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    website: 'https://www.reddit.com/r/forhire',
    category: 'social_media',
    purpose: 'Live community job boards with direct client hiring posts in real-time.',
    liveStatus: 'live_api',
    directSearchUrl: (q) => `https://www.reddit.com/r/forhire/search/?q=${encodeURIComponent(q || 'flair:Hiring web')}&restrict_sr=1&sort=new`,
  },
  {
    id: 'x_twitter',
    name: 'X (Twitter)',
    website: 'https://twitter.com',
    category: 'social_media',
    purpose: 'Startup founders requesting web redesigns, Next.js devs, and marketing help.',
    liveStatus: 'live_connector',
    directSearchUrl: (q) => `https://twitter.com/search?q=${encodeURIComponent(q || '"looking for a web developer" OR "hiring a designer"')}&f=live`,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    website: 'https://www.facebook.com',
    category: 'social_media',
    purpose: 'Business owner groups, local community pages, and commercial leads.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    website: 'https://www.instagram.com',
    category: 'social_media',
    purpose: 'Visual brands, e-commerce stores, aesthetic clinics, and restaurant outreach.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'discord',
    name: 'Discord',
    website: 'https://discord.com',
    category: 'social_media',
    purpose: 'Startup, web3, and tech builder communities hiring contractors.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'behance',
    name: 'Behance',
    website: 'https://www.behance.net',
    category: 'social_media',
    purpose: 'Design clients shopping for custom visual identities and UI/UX solutions.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    website: 'https://dribbble.com',
    category: 'social_media',
    purpose: 'UI/UX client projects and freelance agency contract boards.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'indiehackers',
    name: 'Indie Hackers',
    website: 'https://www.indiehackers.com',
    category: 'social_media',
    purpose: 'Bootstrapped founders and micro-SaaS owners looking for technical partners.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'makers',
    name: 'Makers',
    website: 'https://makers.so',
    category: 'social_media',
    purpose: 'Developer and product maker network for direct contract gigs.',
    liveStatus: 'direct_portal',
  },
];

// 5. Remote Jobs & Contract Opportunities
export const REMOTE_JOBS_PLATFORMS: PlatformDefinition[] = [
  {
    id: 'remoteok',
    name: 'Remote OK',
    website: 'https://remoteok.com',
    category: 'remote_jobs',
    purpose: 'High-paying remote contracts in software, design, and marketing.',
    liveStatus: 'live_api',
    directSearchUrl: (q) => `https://remoteok.com/remote-${encodeURIComponent(q || 'react')}-jobs`,
  },
  {
    id: 'remotive',
    name: 'Remotive',
    website: 'https://remotive.com',
    category: 'remote_jobs',
    purpose: 'Vetted remote engineering, marketing, and design engagements.',
    liveStatus: 'live_api',
    directSearchUrl: (q) => `https://remotive.com/remote-jobs/search?query=${encodeURIComponent(q || 'developer')}`,
  },
  {
    id: 'weworkremotely',
    name: 'We Work Remotely',
    website: 'https://weworkremotely.com',
    category: 'remote_jobs',
    purpose: 'World’s largest remote contract community with 100% verified companies.',
    liveStatus: 'live_feed',
    directSearchUrl: (q) => `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(q || 'developer')}`,
  },
  {
    id: 'wellfound',
    name: 'Wellfound',
    website: 'https://wellfound.com',
    category: 'remote_jobs',
    purpose: 'Startup contractor contracts with equity and direct founder hiring.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'flexjobs',
    name: 'FlexJobs',
    website: 'https://www.flexjobs.com',
    category: 'remote_jobs',
    purpose: 'Scam-free, thoroughly verified remote contracts.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'workingnomads',
    name: 'Working Nomads',
    website: 'https://www.workingnomads.com',
    category: 'remote_jobs',
    purpose: 'Curated digital nomad and contract development opportunities.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'dynamitejobs',
    name: 'Dynamite Jobs',
    website: 'https://dynamitejobs.com',
    category: 'remote_jobs',
    purpose: 'Fast-moving remote contracts with vetted remote companies.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'jobspresso',
    name: 'Jobspresso',
    website: 'https://jobspresso.co',
    category: 'remote_jobs',
    purpose: 'Curated high-quality remote opportunities in tech, marketing & support.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'arc',
    name: 'Arc',
    website: 'https://arc.dev',
    category: 'remote_jobs',
    purpose: 'Remote developer contracts with US and international scaleups.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'lemon',
    name: 'Lemon.io',
    website: 'https://lemon.io',
    category: 'remote_jobs',
    purpose: 'Vetted startup contracts for full-stack developers.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'braintrust',
    name: 'Braintrust',
    website: 'https://www.usebraintrust.com',
    category: 'remote_jobs',
    purpose: 'Decentralized talent network with Fortune 500 tech clients.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'catalant',
    name: 'Catalant',
    website: 'https://gocatalant.com',
    category: 'remote_jobs',
    purpose: 'Enterprise digital strategy and high-ticket consulting projects.',
    liveStatus: 'direct_portal',
  },
];

// 6. Specialized Platforms for Website Development
export const SPECIALIZED_WEB_PLATFORMS: PlatformDefinition[] = [
  {
    id: 'codeable_spec',
    name: 'Codeable',
    website: 'https://codeable.io',
    category: 'specialized_web',
    purpose: 'Dedicated WordPress, Elementor, and WooCommerce expert client orders.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'storetasker',
    name: 'Storetasker',
    website: 'https://storetasker.com',
    category: 'specialized_web',
    purpose: 'Verified Shopify brands seeking custom themes, apps & store setup.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'shopify_partners',
    name: 'Shopify Partners',
    website: 'https://www.shopify.com/partners',
    category: 'specialized_web',
    purpose: 'Direct Shopify merchant project directory and ecosystem opportunities.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'webflow_experts',
    name: 'Webflow Experts',
    website: 'https://webflow.com/certified-partners',
    category: 'specialized_web',
    purpose: 'Webflow agency projects and high-ticket landing page builds.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'wix_marketplace',
    name: 'Wix Marketplace',
    website: 'https://www.wix.com/marketplace',
    category: 'specialized_web',
    purpose: 'Direct Wix development and redesign requests submitted by business owners.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'squarespace_circle',
    name: 'Squarespace',
    website: 'https://circle.squarespace.com',
    category: 'specialized_web',
    purpose: 'Squarespace website development, customization and client handoffs.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'envato_studio',
    name: 'Envato',
    website: 'https://studio.envato.com',
    category: 'specialized_web',
    purpose: 'Creative theme customization and digital agency services ecosystem.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'awwwards',
    name: 'Awwwards',
    website: 'https://www.awwwards.com',
    category: 'specialized_web',
    purpose: 'Design portfolio discovery and high-budget brand agencies seeking partners.',
    liveStatus: 'direct_portal',
  },
];

// 7. Pakistan-Based Platforms
export const PAKISTAN_PLATFORMS: PlatformDefinition[] = [
  {
    id: 'kamaion',
    name: 'Kamaion Pakistan',
    website: 'https://kamaion.com',
    category: 'pakistan',
    purpose: 'Pakistani freelance services, gig marketplace, and remote talent exchange.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'rozee',
    name: 'Rozee.pk',
    website: 'https://www.rozee.pk',
    category: 'pakistan',
    purpose: 'Pakistan’s top corporate job and direct employer network.',
    liveStatus: 'direct_portal',
    directSearchUrl: (q) => `https://www.rozee.pk/job/jsearch/q/${encodeURIComponent(q || 'web developer')}`,
  },
  {
    id: 'mustakbil',
    name: 'Mustakbil',
    website: 'https://www.mustakbil.com',
    category: 'pakistan',
    purpose: 'Software houses and tech corporate hiring in Lahore, Karachi & Islamabad.',
    liveStatus: 'direct_portal',
    directSearchUrl: (q) => `https://www.mustakbil.com/jobs/search?q=${encodeURIComponent(q || 'software')}`,
  },
  {
    id: 'brightspyre',
    name: 'BrightSpyre',
    website: 'https://brightspyre.com',
    category: 'pakistan',
    purpose: 'Development, NGO, and corporate institutional projects in Pakistan.',
    liveStatus: 'direct_portal',
  },
  {
    id: 'linkedin_pakistan',
    name: 'LinkedIn Pakistan',
    website: 'https://www.linkedin.com',
    category: 'pakistan',
    purpose: 'Direct outreach to Pakistani founders, CEOs, and agency owners.',
    liveStatus: 'live_connector',
    directSearchUrl: (q) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q || 'Founder')}®ions=["101022442"]`,
  },
  {
    id: 'olx_pakistan',
    name: 'OLX Pakistan',
    website: 'https://www.olx.com.pk',
    category: 'pakistan',
    purpose: 'Local business listings, service requests, and commercial contacts.',
    liveStatus: 'direct_portal',
    directSearchUrl: (q) => `https://www.olx.com.pk/services_c611/q-${encodeURIComponent(q || 'web development')}`,
  },
];

// Combine all platforms into master dictionary
export const ALL_PLATFORMS: PlatformDefinition[] = [
  ...FREELANCE_MARKETPLACES,
  ...B2B_LEADGEN_PLATFORMS,
  ...BUSINESS_DIRECTORIES,
  ...SOCIAL_MEDIA_PLATFORMS,
  ...REMOTE_JOBS_PLATFORMS,
  ...SPECIALIZED_WEB_PLATFORMS,
  ...PAKISTAN_PLATFORMS,
];

// 8. Recommended Platforms for Agency (Highest Priority)
export const AGENCY_PRIORITY_PLATFORMS: PlatformDefinition[] = ALL_PLATFORMS.filter(
  (p) => p.isAgencyPriority
).sort((a, b) => (a.priorityOrder || 99) - (b.priorityOrder || 99));

// All 8 Categories Master Taxonomy
export const PLATFORM_CATEGORIES: PlatformCategoryMeta[] = [
  {
    id: 'agency_priority',
    number: 8,
    title: 'Agency Priority (High Conversion)',
    shortTitle: '⭐ Agency Priority',
    tagline: 'Direct Client & High-Ticket Project Acquisition',
    description: 'The 8 highest-priority platforms recommended for agency web development, WordPress, Shopify, UI/UX, SEO and marketing leads.',
    iconName: 'Sparkles',
    badgeColor: 'amber',
    platforms: AGENCY_PRIORITY_PLATFORMS,
  },
  {
    id: 'freelance',
    number: 1,
    title: 'Freelancing Marketplaces',
    shortTitle: '💼 Freelance Marketplaces',
    tagline: 'Direct Client Projects & Active RFPs',
    description: 'Platforms where businesses actively post project scopes, fixed-price milestones, and hourly contracts.',
    iconName: 'Briefcase',
    badgeColor: 'blue',
    platforms: FREELANCE_MARKETPLACES,
  },
  {
    id: 'b2b_leadgen',
    number: 2,
    title: 'B2B Lead Generation & Prospecting',
    shortTitle: '🎯 B2B Lead Gen',
    tagline: 'Decision-Makers & Direct Outreach',
    description: 'Identify enterprise business owners, CMOs, and decision-makers for direct email and cold outreach campaigns.',
    iconName: 'Target',
    badgeColor: 'emerald',
    platforms: B2B_LEADGEN_PLATFORMS,
  },
  {
    id: 'directories',
    number: 3,
    title: 'Business Directories & Company Discovery',
    shortTitle: '🏢 Business Directories',
    tagline: 'Businesses Needing Websites & Redesigns',
    description: 'Discover local and corporate businesses with missing or outdated websites ready for custom development proposals.',
    iconName: 'Building2',
    badgeColor: 'indigo',
    platforms: BUSINESS_DIRECTORIES,
  },
  {
    id: 'social_media',
    number: 4,
    title: 'Social Media Client Acquisition',
    shortTitle: '📱 Social Media Acquisition',
    tagline: 'Direct Founders, Community Posts & RFPs',
    description: 'Reach business owners, founders, and startups requesting development services across professional communities.',
    iconName: 'Share2',
    badgeColor: 'purple',
    platforms: SOCIAL_MEDIA_PLATFORMS,
  },
  {
    id: 'remote_jobs',
    number: 5,
    title: 'Remote Jobs & Tech Contracts',
    shortTitle: '🌍 Remote Tech Contracts',
    tagline: 'Scaleup Contractors & Agency Retainers',
    description: 'Companies hiring remote developers, designers, and agencies for long-term retainers and high-budget contracts.',
    iconName: 'Globe2',
    badgeColor: 'cyan',
    platforms: REMOTE_JOBS_PLATFORMS,
  },
  {
    id: 'specialized_web',
    number: 6,
    title: 'Specialized Web & CMS Platforms',
    shortTitle: '⚡ CMS & Web Specialists',
    tagline: 'WordPress, Shopify & Webflow Ecosystems',
    description: 'Niche platforms for selling specialized WordPress, WooCommerce, Shopify, Webflow, and custom web builds.',
    iconName: 'Code2',
    badgeColor: 'rose',
    platforms: SPECIALIZED_WEB_PLATFORMS,
  },
  {
    id: 'pakistan',
    number: 7,
    title: 'Pakistan Market Platforms',
    shortTitle: '🇵🇰 Pakistan Market Leads',
    tagline: 'Domestic Commercial Clients & IT Ecosystem',
    description: 'High-ticket domestic businesses, manufacturers, clinics, and IT companies across Lahore, Karachi & Islamabad.',
    iconName: 'Flag',
    badgeColor: 'emerald',
    platforms: PAKISTAN_PLATFORMS,
  },
];

/**
 * Determine which category a platform or lead belongs to
 */
export function getCategoryForPlatform(platformName: string): PlatformCategoryId {
  const norm = (platformName || '').toLowerCase().trim();
  
  // Check Agency Priority first
  if (
    norm.includes('upwork') ||
    norm.includes('fiverr') ||
    norm.includes('peopleperhour') ||
    norm.includes('contra') ||
    norm.includes('apollo') ||
    norm.includes('clutch') ||
    norm.includes('google my business') ||
    norm.includes('google maps')
  ) {
    // These belong to agency priority as well
  }

  // Pakistan
  if (
    norm.includes('rozee') ||
    norm.includes('mustakbil') ||
    norm.includes('brightspyre') ||
    norm.includes('olx') ||
    norm.includes('pakistan')
  ) {
    return 'pakistan';
  }

  // Specialized Web
  if (
    norm.includes('storetasker') ||
    norm.includes('shopify') ||
    norm.includes('webflow') ||
    norm.includes('wix') ||
    norm.includes('squarespace') ||
    norm.includes('envato') ||
    norm.includes('awwwards') ||
    norm.includes('codeable')
  ) {
    return 'specialized_web';
  }

  // Social Media
  if (
    norm.includes('linkedin') ||
    norm.includes('reddit') ||
    norm.includes('twitter') ||
    norm.includes('x (') ||
    norm.includes('facebook') ||
    norm.includes('instagram') ||
    norm.includes('discord') ||
    norm.includes('behance') ||
    norm.includes('dribbble') ||
    norm.includes('indie hacker')
  ) {
    return 'social_media';
  }

  // Remote Jobs
  if (
    norm.includes('remote ok') ||
    norm.includes('remotive') ||
    norm.includes('we work remotely') ||
    norm.includes('wellfound') ||
    norm.includes('flexjobs') ||
    norm.includes('working nomads') ||
    norm.includes('dynamite') ||
    norm.includes('jobspresso') ||
    norm.includes('arc') ||
    norm.includes('lemon') ||
    norm.includes('braintrust') ||
    norm.includes('catalant')
  ) {
    return 'remote_jobs';
  }

  // B2B Lead Gen
  if (
    norm.includes('apollo') ||
    norm.includes('zoominfo') ||
    norm.includes('lusha') ||
    norm.includes('lead411') ||
    norm.includes('uplead') ||
    norm.includes('snov') ||
    norm.includes('hunter') ||
    norm.includes('cognism') ||
    norm.includes('rocketreach') ||
    norm.includes('leadiq') ||
    norm.includes('clay') ||
    norm.includes('instantly') ||
    norm.includes('smartlead')
  ) {
    return 'b2b_leadgen';
  }

  // Business Directories
  if (
    norm.includes('google my business') ||
    norm.includes('google maps') ||
    norm.includes('yelp') ||
    norm.includes('yellow pages') ||
    norm.includes('crunchbase') ||
    norm.includes('product hunt') ||
    norm.includes('clutch') ||
    norm.includes('goodfirms') ||
    norm.includes('designrush') ||
    norm.includes('sortlist') ||
    norm.includes('g2') ||
    norm.includes('capterra')
  ) {
    return 'directories';
  }

  // Default to freelance marketplaces
  return 'freelance';
}

/**
 * Check if a lead matches a selected platform category
 */
export function matchesPlatformCategory(leadPlatform: string, categoryId: PlatformCategoryId | 'all'): boolean {
  if (!categoryId || categoryId === 'all') return true;
  
  if (categoryId === 'agency_priority') {
    const p = (leadPlatform || '').toLowerCase();
    return (
      p.includes('upwork') ||
      p.includes('fiverr') ||
      p.includes('linkedin') ||
      p.includes('peopleperhour') ||
      p.includes('contra') ||
      p.includes('apollo') ||
      p.includes('clutch') ||
      p.includes('google my business') ||
      p.includes('google maps')
    );
  }

  const detected = getCategoryForPlatform(leadPlatform);
  return detected === categoryId;
}
