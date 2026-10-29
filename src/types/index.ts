export type LeadSource = 
  | 'Google My Business'
  | 'Upwork'
  | 'Fiverr'
  | 'Freelancer.com'
  | 'Freelancer'
  | 'PeoplePerHour'
  | 'Guru'
  | 'Contra'
  | 'Truelancer'
  | 'Workana'
  | '99designs'
  | 'DesignCrowd'
  | 'Toptal'
  | 'Gun.io'
  | 'Arc'
  | 'Lemon.io'
  | 'Braintrust'
  | 'Mayple'
  | 'MarketerHire'
  | 'Legiit'
  | 'SEOClerks'
  | 'Codeable'
  | 'We Work Remotely'
  | 'Behance'
  | 'Dribbble'
  | 'DesignHill'
  | 'Working Not Working'
  | 'Creativepool'
  | 'Coroflot'
  | 'LinkedIn'
  | 'Wellfound'
  | 'FlexJobs'
  | 'Remote OK'
  | 'Remotive'
  | 'Working Nomads'
  | 'Dynamite Jobs'
  | 'Jooble'
  | 'Indeed'
  | 'Glassdoor'
  | 'SimplyHired'
  | 'WPHired'
  | 'ProBlogger Jobs'
  | 'WriterAccess'
  | 'Voices'
  | 'Voice123'
  | 'Malt'
  | 'Taskrabbit'
  | 'Rozee.pk'
  | 'Mustakbil'
  | 'Bayt'
  | 'Naukrigulf'
  | 'Dubizzle'
  | 'Bark'
  | 'Thumbtack'
  | 'Meta Ads'
  | 'Facebook Ads'
  | 'Instagram Ads'
  | 'DesignBoard';

export type LeadCategory = 
  | 'Web Development'
  | 'WordPress Development'
  | 'Meta Ads & Marketing'
  | 'Social Media Management'
  | 'Graphic Design'
  | 'Mobile App'
  | 'Brand Identity'
  | 'Digital Marketing'
  | 'Local Business'
  | 'SEO & Content';

export type LeadCountry = 'US' | 'UK' | 'Pakistan' | 'UAE' | 'Global';

export type PipelineStage = 'new' | 'hot' | 'pending' | 'won' | 'rejected';

export interface BusinessAgeInfo {
  years: number;
  months: number;
  foundedYear?: number;
  isNew: boolean; // < 1 year old
  label: string;  // e.g. "✨ Newly Opened (4 mos)" or "Established (8 yrs)"
  badgeColor: 'emerald' | 'amber' | 'blue' | 'purple';
}

export interface LeadContact {
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  hasWebsite: boolean;
  gmbUrl?: string;
  contactPerson?: string;
}

export interface GeneratedWebsiteData {
  slug: string;
  businessName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl?: string;
  aboutText: string;
  services: Array<{ title: string; description: string; icon: string; price?: string; duration?: string; image?: string }>;
  testimonials: Array<{ author: string; role: string; quote: string; rating: number; date?: string; verified?: boolean; avatarUrl?: string }>;
  contactEmail: string;
  contactPhone: string;
  address: string;
  colorScheme: 'royal-blue' | 'emerald-green' | 'luxury-gold' | 'modern-dark' | 'meta-indigo';
  previewHtml?: string;
  createdAt: string;
  // 14-15 Section Production Architecture
  isEcommerce?: boolean;
  announcementText?: string;
  valueProps?: Array<{ title: string; subtitle: string; icon: string }>;
  collections?: Array<{ name: string; itemCount: string; image: string; tag: string }>;
  products?: Array<{ id: string; name: string; price: string; oldPrice?: string; rating: number; image: string; isNew?: boolean; isBestSeller?: boolean }>;
  packages?: Array<{ name: string; price: string; period: string; features: string[]; popular?: boolean; image?: string }>;
  spotlightFeature?: { title: string; subtitle: string; description: string; image: string; bulletPoints: string[]; ctaText: string };
  founderBio?: { name: string; title: string; credentials: string[]; bio: string; image: string; quote?: string };
  caseStudies?: Array<{ title: string; metric: string; beforeText: string; afterText: string; imageBefore?: string; imageAfter?: string; imageMain?: string }>;
  processSteps?: Array<{ stepNumber: string; title: string; description: string; icon?: string }>;
  videoShowcase?: { title: string; subtitle: string; thumbnailImage: string; timecode: string; retentionScore: string; hookCaption: string };
  faqs?: Array<{ question: string; answer: string }>;
  mapEmbedAddress?: string;
}

export interface JobRequirementSpec {
  discipline: 
    | 'Web Development' 
    | 'WordPress Website Development'
    | 'Meta Ads & Paid Social'
    | 'Social Media & Content Creation'
    | 'Mobile App Development' 
    | 'Brand Identity & Logos' 
    | 'Graphic Design' 
    | 'Software SOW' 
    | 'Local Business Digitalization';
  platformSource: LeadSource; // Upwork, Bark, GMB, LinkedIn, etc.
  jobId: string; // e.g. "UP-8841", "BK-310", "GMB-101"
  clientExperienceLevel: 'Expert Client' | 'Intermediate' | 'First-Time Client';
  urgency: 'Immediate Start (< 48 hrs)' | 'Urgent (This Week)' | 'Flexible Timeline';
  primaryGoal: string; // e.g. "Increase online patient booking by replacing walk-in dependency"
  deliverablesDemanded: string[]; // e.g. ["Custom Responsive Homepage", "Doctor Schedule Integration", "WhatsApp Consultation CTA"]
  painPoints: string[]; // e.g. ["No online booking", "Walk-ins dropping", "Competitors running Google Ads"]
  techStackPreference: string[]; // e.g. ["Next.js", "Tailwind CSS", "Vercel"]
  matchScore: number; // e.g. 96 (%)
  bidStatus?: 'unpitched' | 'pitched' | 'viewed' | 'replied';
}

export interface Lead {
  id: string;
  title: string;
  businessName: string;
  type: 'gmb' | 'job';
  platform: LeadSource;
  category: LeadCategory;
  country: LeadCountry;
  city: string;
  address?: string;
  businessAge: BusinessAgeInfo;
  budget?: string;
  jobType?: 'Hourly' | 'Fixed' | 'Contract' | 'Full-Time' | 'Direct Client';
  description: string;
  postedAt: string;
  timeAgo?: string;
  contact: LeadContact;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  verified: boolean;
  generatedWebsite?: GeneratedWebsiteData;
  deliverablesPackage?: DeliverablesPackage;
  pipelineStage?: PipelineStage;
  status?: 'new' | 'contacted' | 'pitch_sent' | 'closed';
  incomingAt?: number; // timestamp
  requirementSpec?: JobRequirementSpec;
  // Assignment & Staff Allocation
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedAt?: string;
}

export interface PortalUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'staff' | 'global_user';
  isGlobalUser: boolean; // If true: sees ALL leads across all platforms & countries
  status: 'active' | 'suspended';
  createdAt: string;
  assignedLeadIds: string[];
  avatar: string;
  department?: string;
  leadsReachedCount?: number;
  notes?: string;
}

export interface LeadNotification {
  id: string;
  title: string;
  businessName: string;
  location: string;
  timestamp: string;
  timeAgo: string;
  leadId: string;
  type: 'new_lead' | 'website_ready' | 'pitch_dispatched' | 'client_reply';
  read: boolean;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: string; // 'image' | 'pdf' | 'doc' | 'archive' | 'file'
  url: string; // Data URL or public link
}

export interface VoiceNoteData {
  url: string; // Audio Data URL or Blob URL
  durationSeconds: number;
}

export interface EmailMessage {
  id: string;
  sender: 'user' | 'client';
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  timestamp: string;
  previewUrl?: string;
  sentiment?: 'positive' | 'pricing' | 'booking' | 'neutral';
  attachments?: ChatAttachment[];
  voiceNote?: VoiceNoteData;
  isDeletedForEveryone?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface EmailThread {
  id: string;
  leadId: string;
  businessName: string;
  clientEmail: string;
  contactPerson: string;
  city: string;
  country: string;
  lastMessageSnippet: string;
  lastMessageAt: string;
  unread: boolean;
  status: 'hot_reply' | 'awaiting_reply' | 'closed';
  sentiment?: 'positive' | 'pricing' | 'booking' | 'neutral';
  messages: EmailMessage[];
}

export interface FilterOptions {
  country: string;
  category: string;
  businessAge: string; // 'all' | 'new' | '1-3' | '3-5' | '5+'
  platform: string;
  search: string;
  type: string; // 'all' | 'gmb' | 'job'
  hasWebsite?: string; // 'all' | 'no-site' | 'has-site'
}

export interface ApiQuotaStatus {
  service: string;
  usedToday: number;
  dailyLimit: number;
  remaining: number;
  status: 'active' | 'warning' | 'exhausted' | 'simulated';
  isFallback: boolean;
  notes: string;
}

export interface MobileAppScreen {
  id: string;
  screenNumber: number; // 1 to 14
  title: string;
  subtitle: string;
  screenType: string;
  categoryTag: 'Onboarding & Auth' | 'Core Experience' | 'Booking & Flow' | 'Account & Support';
  headerText: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  visualType?: 'splash-hero' | 'curated-discovery' | 'product-catalog' | 'detail-showcase' | 'before-after-split' | 'video-consultation' | 'video-player' | 'interactive-calendar' | 'suite-package' | 'apple-pay-sheet' | 'qr-confirmation' | 'gps-tracker' | 'concierge-chat' | 'vip-rewards' | 'obsidian-settings';
  elements: Array<{
    type: 'button' | 'card' | 'input' | 'stat' | 'list' | 'avatar' | 'banner' | 'image' | 'rating' | 'toggle' | 'badge';
    label: string;
    detail?: string;
    icon?: string;
    badge?: string;
    imageUrl?: string;
  }>;
  bgColor: string;
  accentColor: string;
}

export interface MobileAppDeliverable {
  appName: string;
  tagline: string;
  targetPlatform: string;
  screens: MobileAppScreen[];
}

export interface StoryboardFrame {
  scene: number;
  timecode: string;
  title: string;
  visualDescription: string;
  audioCue: string;
  captionSample: string;
}

export interface VideoPitchDeliverable {
  hookTitle: string;
  hookDuration: string;
  aspectRatio: '9:16' | '16:9';
  targetPlatform: string;
  retentionScoreTarget: string;
  storyboardFrames: StoryboardFrame[];
  pitchLetter: string;
}

export interface LogoConcept {
  id: string;
  conceptName: string;
  conceptSubtitle: string;
  style: string;
  symbol: string;
  description: string;
  svgMarkup: string;
  typography: string;
  mood: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface CollateralMockup {
  title: string;
  type: string;
  headline: string;
  bodyText: string;
  callToAction: string;
}

export interface GraphicDesignDeliverable {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typographyPrimary: string;
  typographySecondary: string;
  logoConcepts: LogoConcept[];
  collateralMockups: CollateralMockup[];
}

export interface MilestoneItem {
  title: string;
  duration: string;
  deliverables: string[];
  investment: string;
}

export interface SoftwareSowDeliverable {
  projectTitle: string;
  executiveSummary: string;
  recommendedStack: string[];
  milestones: MilestoneItem[];
  slaGuarantee: string;
}

export interface DeliverablesPackage {
  website: GeneratedWebsiteData;
  mobileApp: MobileAppDeliverable;
  graphicDesign: GraphicDesignDeliverable;
  softwareSow: SoftwareSowDeliverable;
  videoPitch?: VideoPitchDeliverable;
}
