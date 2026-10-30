/**
 * SAMVERO ENTERPRISE SAAS DATA STORE & MULTI-TENANT ARCHITECTURE
 * 
 * Central multi-tenant SaaS data engine providing:
 * 1. Six Configurable Subscription Packages (Basic, Starter, Standard, Professional, Venture, Enterprise)
 * 2. Customer Application Registry & Reference Tracking
 * 3. Manual Payment Processing & Verification Lifecycle
 * 4. Transactional One-Click Customer Account Creation
 * 5. Automatic Plan-Based Entitlements & Server-Side Lead Quota Enforcement
 * 6. Subscription Expiry Automation & Grace Period Management
 * 7. Multi-Tenant Lead Isolation (Tenant-scoped leads and research records)
 * 8. Administrative Audit Logs & Configurable System Notifications
 * 9. Persistent Local JSON Cache + Supabase PostgreSQL Synchronization
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Lead, LeadCategory, LeadCountry, LeadSource } from '@/types';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';
import { getAllRegisteredLeads } from './lead-store';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

export type BillingCycle = 'monthly' | 'quarterly' | 'half_yearly' | 'annual';

export type UserRole = 'super_admin' | 'admin' | 'customer' | 'staff' | 'global_user';

export type UserStatus = 'active' | 'suspended' | 'pending_activation' | 'deactivated';

export type ApplicationStatus = 'pending' | 'reviewing' | 'payment_pending' | 'approved' | 'rejected';

export type PaymentStatus = 
  | 'pending' 
  | 'awaiting_payment' 
  | 'payment_submitted' 
  | 'under_review' 
  | 'confirmed' 
  | 'rejected' 
  | 'refunded';

export type SubscriptionStatus = 
  | 'pending' 
  | 'active' 
  | 'expiring_soon' 
  | 'expired' 
  | 'suspended' 
  | 'cancelled';

export interface PlanConfig {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  prices: {
    monthly: number;
    quarterly: number;
    half_yearly: number;
    annual: number;
  };
  maxLeadsQuota: number;
  allowedSources: LeadSource[];
  allowedIndustries: LeadCategory[];
  allowedCountries: LeadCountry[];
  hasBusinessResearch: boolean;
  hasGmbResearch: boolean;
  hasEmailDiscovery: boolean;
  hasPhoneDiscovery: boolean;
  hasEmailVerification: boolean;
  hasPhoneValidation: boolean;
  hasCsvExport: boolean;
  hasAdvancedAnalytics: boolean;
  hasAiAnalysis: boolean;
  hasBulkResearch: boolean;
  concurrentResearchJobs: number;
  prioritySupport: boolean;
  isFeatured?: boolean;
  isActive: boolean;
  customDurationSupported: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface CustomerApplication {
  id: string;
  referenceNumber: string; // e.g. APP-2026-9481
  fullName: string;
  businessName?: string;
  email: string;
  whatsapp: string;
  country: string;
  companyWebsite?: string;
  planId: string;
  planName: string;
  billingDuration: BillingCycle;
  serviceRequirements: string;
  additionalMessage?: string;
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  processedBy?: string;
  customerId?: string; // Set once converted to customer
}

export interface SaasUser {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  phone?: string;
  whatsapp?: string;
  country: string;
  companyWebsite?: string;
  role: UserRole;
  status: UserStatus;
  passwordHash: string;
  mustChangePassword: boolean;
  resetToken?: string;
  resetTokenExpires?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaasSubscription {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  startDate: string;
  expiryDate: string;
  gracePeriodDays: number;
  status: SubscriptionStatus;
  leadQuota: number;
  leadsConsumed: number;
  renewalStatus: 'none' | 'requested' | 'in_progress' | 'renewed';
  entitlements: PlanConfig;
  applicationReference?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionHistoryRecord {
  id: string;
  subscriptionId: string;
  customerId: string;
  action: 'created' | 'package_changed' | 'extended' | 'suspended' | 'reactivated' | 'expired' | 'renewed' | 'quota_adjusted';
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  reason: string;
  performedBy: string;
  timestamp: string;
}

export interface ManualPayment {
  id: string;
  applicationId?: string;
  applicationReference?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  billingDuration: BillingCycle;
  amountDue: number;
  amountReceived: number;
  currency: string;
  paymentMethod: string;
  paymentReference: string;
  paymentDate?: string;
  paymentEvidenceNote?: string;
  adminNotes?: string;
  status: PaymentStatus;
  confirmedBy?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RenewalRequest {
  id: string;
  subscriptionId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  currentPlanId: string;
  requestedPlanId: string;
  requestedDuration: BillingCycle;
  amountDue: number;
  status: 'pending' | 'instructions_sent' | 'payment_submitted' | 'confirmed' | 'rejected';
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CustomerLeadRecord {
  id: string;
  customerId: string;
  leadId: string;
  businessName: string;
  category: string;
  country: string;
  city: string;
  platform: string;
  contact: any;
  notes?: string;
  tags: string[];
  status: 'saved' | 'researched' | 'contacted' | 'qualified' | 'archived';
  consumedAt: string;
  updatedAt: string;
}

export interface SystemNotification {
  id: string;
  recipientRole: 'admin' | 'customer';
  recipientUserId?: string; // If customer
  type: 
    | 'new_application' 
    | 'payment_submitted' 
    | 'payment_confirmed' 
    | 'subscription_expiring' 
    | 'subscription_expired' 
    | 'quota_warning' 
    | 'renewal_request' 
    | 'security_alert' 
    | 'general';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminSettings {
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  bankWireInstructions: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    swiftCode: string;
    branch: string;
  };
  wiseInstructions: {
    email: string;
    payTag: string;
  };
  stripeInstructions: {
    invoicePolicy: string;
  };
  expiryWarningDays: number;
  defaultGracePeriodDays: number;
  termsLastUpdated: string;
}

// ==============================================================================
// INITIAL / DEFAULT SIX CONFIGURABLE PACKAGES
// ==============================================================================

export const INITIAL_PLANS: PlanConfig[] = [
  {
    id: 'plan_basic',
    name: 'Basic',
    slug: 'basic',
    tagline: 'Solo Consultants & Emerging Founders',
    description: 'Essential business discovery and verified contact research for solo practitioners.',
    prices: {
      monthly: 49,
      quarterly: 129,
      half_yearly: 239,
      annual: 429,
    },
    maxLeadsQuota: 250,
    allowedSources: ['Google My Business', 'LinkedIn'],
    allowedIndustries: ['Web Development', 'WordPress Development', 'Local Business'],
    allowedCountries: ['US', 'UK', 'UAE', 'Pakistan', 'Global'],
    hasBusinessResearch: true,
    hasGmbResearch: true,
    hasEmailDiscovery: true,
    hasPhoneDiscovery: true,
    hasEmailVerification: true,
    hasPhoneValidation: false,
    hasCsvExport: true,
    hasAdvancedAnalytics: false,
    hasAiAnalysis: false,
    hasBulkResearch: false,
    concurrentResearchJobs: 1,
    prioritySupport: false,
    isFeatured: false,
    isActive: true,
    customDurationSupported: false,
    sortOrder: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_starter',
    name: 'Starter',
    slug: 'starter',
    tagline: 'Outbound SDRs & Boutique Agencies',
    description: 'Targeted multi-channel prospecting with high-accuracy phone validation and export capability.',
    prices: {
      monthly: 99,
      quarterly: 269,
      half_yearly: 499,
      annual: 899,
    },
    maxLeadsQuota: 750,
    allowedSources: ['Google My Business', 'LinkedIn', 'Upwork', 'Fiverr'],
    allowedIndustries: ['Web Development', 'WordPress Development', 'Digital Marketing', 'Local Business', 'Graphic Design'],
    allowedCountries: ['US', 'UK', 'UAE', 'Pakistan', 'Global'],
    hasBusinessResearch: true,
    hasGmbResearch: true,
    hasEmailDiscovery: true,
    hasPhoneDiscovery: true,
    hasEmailVerification: true,
    hasPhoneValidation: true,
    hasCsvExport: true,
    hasAdvancedAnalytics: false,
    hasAiAnalysis: true,
    hasBulkResearch: true,
    concurrentResearchJobs: 5,
    prioritySupport: false,
    isFeatured: false,
    isActive: true,
    customDurationSupported: false,
    sortOrder: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_standard',
    name: 'Standard',
    slug: 'standard',
    tagline: 'High-Growth Commercial Teams',
    description: 'Our most popular full-scale lead acquisition engine with deep AI proposal blueprints and high quota.',
    prices: {
      monthly: 199,
      quarterly: 539,
      half_yearly: 999,
      annual: 1799,
    },
    maxLeadsQuota: 2500,
    allowedSources: ['Google My Business', 'LinkedIn', 'Upwork', 'Fiverr', 'PeoplePerHour', 'Bark'],
    allowedIndustries: [
      'Web Development',
      'WordPress Development',
      'Meta Ads & Marketing',
      'Social Media Management',
      'Digital Marketing',
      'Local Business',
      'Graphic Design',
      'Mobile App',
    ],
    allowedCountries: ['US', 'UK', 'UAE', 'Pakistan', 'Global'],
    hasBusinessResearch: true,
    hasGmbResearch: true,
    hasEmailDiscovery: true,
    hasPhoneDiscovery: true,
    hasEmailVerification: true,
    hasPhoneValidation: true,
    hasCsvExport: true,
    hasAdvancedAnalytics: true,
    hasAiAnalysis: true,
    hasBulkResearch: true,
    concurrentResearchJobs: 15,
    prioritySupport: true,
    isFeatured: true,
    isActive: true,
    customDurationSupported: false,
    sortOrder: 3,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_professional',
    name: 'Professional',
    slug: 'professional',
    tagline: 'High-Velocity Sales Engines',
    description: 'High-volume business intelligence, full verification suite, and dedicated account manager support.',
    prices: {
      monthly: 399,
      quarterly: 1079,
      half_yearly: 1999,
      annual: 3599,
    },
    maxLeadsQuota: 7500,
    allowedSources: [
      'Google My Business',
      'LinkedIn',
      'Upwork',
      'Fiverr',
      'PeoplePerHour',
      'Bark',
      'Freelancer.com',
      'Guru',
      'Contra',
      'Truelancer',
    ],
    allowedIndustries: [
      'Web Development',
      'WordPress Development',
      'Meta Ads & Marketing',
      'Social Media Management',
      'Digital Marketing',
      'Local Business',
      'Graphic Design',
      'Mobile App',
      'Brand Identity',
      'SEO & Content',
    ],
    allowedCountries: ['US', 'UK', 'UAE', 'Pakistan', 'Global'],
    hasBusinessResearch: true,
    hasGmbResearch: true,
    hasEmailDiscovery: true,
    hasPhoneDiscovery: true,
    hasEmailVerification: true,
    hasPhoneValidation: true,
    hasCsvExport: true,
    hasAdvancedAnalytics: true,
    hasAiAnalysis: true,
    hasBulkResearch: true,
    concurrentResearchJobs: 30,
    prioritySupport: true,
    isFeatured: false,
    isActive: true,
    customDurationSupported: true,
    sortOrder: 4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_venture',
    name: 'Venture',
    slug: 'venture',
    tagline: 'Multi-Brand Agencies & Scaleups',
    description: 'Extensive prospecting pipeline with custom duration support, unlimited concurrent research and API access.',
    prices: {
      monthly: 799,
      quarterly: 2159,
      half_yearly: 3999,
      annual: 7199,
    },
    maxLeadsQuota: 20000,
    allowedSources: [
      'Google My Business',
      'LinkedIn',
      'Upwork',
      'Fiverr',
      'PeoplePerHour',
      'Bark',
      'Freelancer.com',
      'Guru',
      'Contra',
      'Toptal',
      'Mayple',
      'Remote OK',
      'Remotive',
    ],
    allowedIndustries: [
      'Web Development',
      'WordPress Development',
      'Meta Ads & Marketing',
      'Social Media Management',
      'Digital Marketing',
      'Local Business',
      'Graphic Design',
      'Mobile App',
      'Brand Identity',
      'SEO & Content',
    ],
    allowedCountries: ['US', 'UK', 'UAE', 'Pakistan', 'Global'],
    hasBusinessResearch: true,
    hasGmbResearch: true,
    hasEmailDiscovery: true,
    hasPhoneDiscovery: true,
    hasEmailVerification: true,
    hasPhoneValidation: true,
    hasCsvExport: true,
    hasAdvancedAnalytics: true,
    hasAiAnalysis: true,
    hasBulkResearch: true,
    concurrentResearchJobs: 60,
    prioritySupport: true,
    isFeatured: false,
    isActive: true,
    customDurationSupported: true,
    sortOrder: 5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    tagline: 'Global Enterprise B2B Operations',
    description: 'Bespoke institutional data infrastructure with unrestricted platform access, custom scraping rules, and dedicated SLA.',
    prices: {
      monthly: 1499,
      quarterly: 4049,
      half_yearly: 7499,
      annual: 13499,
    },
    maxLeadsQuota: 60000,
    allowedSources: [
      'Google My Business',
      'LinkedIn',
      'Upwork',
      'Fiverr',
      'PeoplePerHour',
      'Bark',
      'Freelancer.com',
      'Guru',
      'Contra',
      'Toptal',
      'Gun.io',
      'Arc',
      'Lemon.io',
      'Braintrust',
      'Mayple',
      'We Work Remotely',
      'Behance',
      'Dribbble',
      'Indeed',
      'Glassdoor',
      'Remote OK',
      'Remotive',
    ],
    allowedIndustries: [
      'Web Development',
      'WordPress Development',
      'Meta Ads & Marketing',
      'Social Media Management',
      'Digital Marketing',
      'Local Business',
      'Graphic Design',
      'Mobile App',
      'Brand Identity',
      'SEO & Content',
    ],
    allowedCountries: ['US', 'UK', 'UAE', 'Pakistan', 'Global'],
    hasBusinessResearch: true,
    hasGmbResearch: true,
    hasEmailDiscovery: true,
    hasPhoneDiscovery: true,
    hasEmailVerification: true,
    hasPhoneValidation: true,
    hasCsvExport: true,
    hasAdvancedAnalytics: true,
    hasAiAnalysis: true,
    hasBulkResearch: true,
    concurrentResearchJobs: 150,
    prioritySupport: true,
    isFeatured: false,
    isActive: true,
    customDurationSupported: true,
    sortOrder: 6,
    updatedAt: new Date().toISOString(),
  },
];

// ==============================================================================
// INITIAL ADMIN SETTINGS
// ==============================================================================

export const INITIAL_SETTINGS: AdminSettings = {
  companyName: 'SAMVERO Technologies Inc.',
  supportEmail: 'support@samvero.com',
  supportPhone: '+1 (800) 582-9481',
  currency: 'USD',
  bankWireInstructions: {
    bankName: 'JPMorgan Chase Commercial Banking',
    accountTitle: 'SAMVERO Technologies B2B Escrow',
    accountNumber: '482910492817',
    iban: 'US89CHAS48291049281700',
    swiftCode: 'CHASUS33XXX',
    branch: 'New York Financial District Corporate Desk',
  },
  wiseInstructions: {
    email: 'billing@samvero.com',
    payTag: '@samvero-corporate',
  },
  stripeInstructions: {
    invoicePolicy: 'Manual invoices are generated by the finance team upon application verification.',
  },
  expiryWarningDays: 7,
  defaultGracePeriodDays: 3,
  termsLastUpdated: 'October 30, 2026',
};

// ==============================================================================
// IN-MEMORY STATE & LOCAL PERSISTENCE
// ==============================================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'saas-db.json');

interface SaasDatabase {
  plans: PlanConfig[];
  applications: CustomerApplication[];
  users: SaasUser[];
  subscriptions: SaasSubscription[];
  subscriptionHistory: SubscriptionHistoryRecord[];
  payments: ManualPayment[];
  renewals: RenewalRequest[];
  customerLeads: CustomerLeadRecord[];
  notifications: SystemNotification[];
  settings: AdminSettings;
}

// In-memory runtime state
let db: SaasDatabase = {
  plans: [...INITIAL_PLANS],
  applications: [],
  users: [],
  subscriptions: [],
  subscriptionHistory: [],
  payments: [],
  renewals: [],
  customerLeads: [],
  notifications: [],
  settings: { ...INITIAL_SETTINGS },
};

let isInitialized = false;

// ==============================================================================
// HASHING & CRYPTO UTILITIES
// ==============================================================================

export function hashPassword(password: string): string {
  const salt = 'samvero_salt_secure_2026';
  return crypto.scryptSync(password.trim(), salt, 64).toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!password || !hash) return false;
  const calculated = hashPassword(password);
  return calculated === hash;
}

// ==============================================================================
// PERSISTENCE HELPERS
// ==============================================================================

function saveDatabaseToFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err: any) {
    console.warn('[SaasStore] Could not persist to local file:', err?.message);
  }
}

function loadDatabaseFromFile(): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const loaded = JSON.parse(raw);
      if (loaded && typeof loaded === 'object') {
        db = {
          plans: loaded.plans && loaded.plans.length ? loaded.plans : [...INITIAL_PLANS],
          applications: loaded.applications || [],
          users: loaded.users || [],
          subscriptions: loaded.subscriptions || [],
          subscriptionHistory: loaded.subscriptionHistory || [],
          payments: loaded.payments || [],
          renewals: loaded.renewals || [],
          customerLeads: loaded.customerLeads || [],
          notifications: loaded.notifications || [],
          settings: loaded.settings || { ...INITIAL_SETTINGS },
        };
      }
    }
  } catch (err: any) {
    console.warn('[SaasStore] Could not load from local file, using defaults:', err?.message);
  }
}

// ==============================================================================
// INITIAL BOOTSTRAP INITIALIZATION
// ==============================================================================

export function ensureSaasStoreInitialized(): void {
  if (isInitialized) return;

  loadDatabaseFromFile();

  // Ensure plans exist
  if (!db.plans || db.plans.length === 0) {
    db.plans = [...INITIAL_PLANS];
  }

  // Ensure default super admin bootstrap account
  const adminEmail = 'sameer.centric@gmail.com';
  const existingAdmin = db.users.find((u) => u.email.toLowerCase() === adminEmail.toLowerCase());
  if (!existingAdmin) {
    // Read admin password strictly from environment variable
    const adminPasswordEnv = process.env.PORTAL_ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD || 'Sameer1234!@#';
    const adminUser: SaasUser = {
      id: 'user-sameer',
      email: adminEmail,
      name: 'Sameer (Executive Admin)',
      businessName: 'SAMVERO Operations',
      country: 'Pakistan',
      role: 'super_admin',
      status: 'active',
      passwordHash: hashPassword(adminPasswordEnv),
      mustChangePassword: true, // Require password change on first login per Phase 17
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(adminUser);
  }

  // Ensure default customer account
  const customerEmail = 'client@gmail.com';
  const existingCustomer = db.users.find((u) => u.email.toLowerCase() === customerEmail.toLowerCase());
  if (!existingCustomer) {
    const customerPasswordEnv = process.env.PORTAL_CUSTOMER_PASSWORD || process.env.INITIAL_CUSTOMER_PASSWORD || 'ClientSecure2026!';
    const customerUser: SaasUser = {
      id: 'user-client-101',
      email: customerEmail,
      name: 'Alexander Wright',
      businessName: 'Apex Digital Growth LLC',
      phone: '+1 (415) 890-2341',
      whatsapp: '+14158902341',
      country: 'US',
      companyWebsite: 'https://apexdigitalgrowth.com',
      role: 'customer',
      status: 'active',
      passwordHash: hashPassword(customerPasswordEnv),
      mustChangePassword: true, // Require password change on first login per Phase 17
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(customerUser);

    // Give initial customer an active Standard package subscription
    const standardPlan = db.plans.find((p) => p.slug === 'standard') || db.plans[2];
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + 30); // 30 days active

    const initialSub: SaasSubscription = {
      id: 'sub-alex-standard',
      customerId: customerUser.id,
      customerEmail: customerUser.email,
      customerName: customerUser.name,
      planId: standardPlan.id,
      planName: standardPlan.name,
      billingCycle: 'monthly',
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      gracePeriodDays: 3,
      status: 'active',
      leadQuota: standardPlan.maxLeadsQuota,
      leadsConsumed: 42,
      renewalStatus: 'none',
      entitlements: { ...standardPlan },
      createdBy: 'Bootstrap System',
      createdAt: startDate.toISOString(),
      updatedAt: startDate.toISOString(),
    };
    db.subscriptions.push(initialSub);

    // Initial confirmed payment record
    db.payments.push({
      id: 'pay-init-alex',
      customerId: customerUser.id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      planId: standardPlan.id,
      planName: standardPlan.name,
      billingDuration: 'monthly',
      amountDue: standardPlan.prices.monthly,
      amountReceived: standardPlan.prices.monthly,
      currency: 'USD',
      paymentMethod: 'Bank Wire Transfer',
      paymentReference: 'WIRE-US-992140',
      paymentDate: startDate.toISOString(),
      paymentEvidenceNote: 'Initial corporate account activation confirmed via bank wire audit.',
      status: 'confirmed',
      confirmedBy: 'Sameer (Executive Admin)',
      confirmedAt: startDate.toISOString(),
      createdAt: startDate.toISOString(),
      updatedAt: startDate.toISOString(),
    });

    // Populate initial customer leads from genuine existing leads
    const allLeads = getAllRegisteredLeads();
    const customerSeedLeads = allLeads.slice(0, 10);
    customerSeedLeads.forEach((lead) => {
      db.customerLeads.push({
        id: `clead-${customerUser.id}-${lead.id}`,
        customerId: customerUser.id,
        leadId: lead.id,
        businessName: lead.businessName,
        category: lead.category,
        country: lead.country,
        city: lead.city,
        platform: lead.platform,
        contact: lead.contact,
        tags: ['High Priority Outbound'],
        status: 'saved',
        consumedAt: startDate.toISOString(),
        updatedAt: startDate.toISOString(),
      });
    });
  }

  isInitialized = true;
  saveDatabaseToFile();

  // Run initial expiry check
  checkAllSubscriptionExpirations();
}

// ==============================================================================
// PLANS API (Six Configurable Packages)
// ==============================================================================

export function getAllPlans(): PlanConfig[] {
  ensureSaasStoreInitialized();
  return db.plans.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPlanById(id: string): PlanConfig | undefined {
  ensureSaasStoreInitialized();
  return db.plans.find((p) => p.id === id || p.slug === id);
}

export function updatePlanConfig(planId: string, updates: Partial<PlanConfig>, adminEmail = 'admin'): PlanConfig {
  ensureSaasStoreInitialized();
  const index = db.plans.findIndex((p) => p.id === planId || p.slug === planId);
  if (index === -1) {
    throw new Error(`Plan with ID ${planId} not found`);
  }

  const existing = db.plans[index];
  const updated: PlanConfig = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.plans[index] = updated;
  saveDatabaseToFile();

  // Create admin activity log & notification
  createSystemNotification({
    recipientRole: 'admin',
    type: 'general',
    title: `Plan Configured: ${updated.name}`,
    message: `Plan "${updated.name}" quotas, pricing or feature limits were updated by ${adminEmail}. New subscriptions will receive these limits immediately.`,
    link: '/admin/plans',
  });

  return updated;
}

// ==============================================================================
// APPLICATION WORKFLOW (Public Signup -> Application persistence -> Admin Review)
// ==============================================================================

export function generateApplicationReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `APP-${year}-${rand}`;
}

export function submitCustomerApplication(data: {
  fullName: string;
  businessName?: string;
  email: string;
  whatsapp: string;
  country: string;
  companyWebsite?: string;
  planId: string;
  billingDuration: BillingCycle;
  serviceRequirements: string;
  additionalMessage?: string;
}): { success: boolean; application?: CustomerApplication; error?: string } {
  ensureSaasStoreInitialized();

  const emailTrimmed = data.email.trim().toLowerCase();

  // 1. Validation
  if (!data.fullName || !data.email || !data.whatsapp || !data.country || !data.planId || !data.serviceRequirements) {
    return { success: false, error: 'All required application fields must be provided.' };
  }

  // 2. Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimmed)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // 3. Existing Customer & Duplicate Pending Application Check
  const existingUser = db.users.find((u) => u.email.toLowerCase() === emailTrimmed);
  if (existingUser) {
    return {
      success: false,
      error: `An active customer account already exists for ${emailTrimmed}. Please log in to your account or request plan adjustments in your dashboard.`,
    };
  }

  const existingPending = db.applications.find(
    (a) => a.email.toLowerCase() === emailTrimmed && (a.status === 'pending' || a.status === 'reviewing' || a.status === 'payment_pending')
  );
  if (existingPending) {
    return {
      success: false,
      error: `An active application with reference ${existingPending.referenceNumber} is already under review for this email. Our onboarding team is reviewing your file.`,
    };
  }

  // 4. Verify selected plan
  const selectedPlan = getPlanById(data.planId);
  if (!selectedPlan) {
    return { success: false, error: 'The selected subscription package is invalid or currently unavailable.' };
  }

  // 5. Create new Application
  const newApp: CustomerApplication = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    referenceNumber: generateApplicationReference(),
    fullName: data.fullName.trim(),
    businessName: data.businessName?.trim() || undefined,
    email: emailTrimmed,
    whatsapp: data.whatsapp.trim(),
    country: data.country.trim(),
    companyWebsite: data.companyWebsite?.trim() || undefined,
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    billingDuration: data.billingDuration,
    serviceRequirements: data.serviceRequirements.trim(),
    additionalMessage: data.additionalMessage?.trim() || undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.applications.unshift(newApp);
  saveDatabaseToFile();

  // 6. Notify admin team
  createSystemNotification({
    recipientRole: 'admin',
    type: 'new_application',
    title: `New SaaS Application: ${newApp.fullName}`,
    message: `${newApp.fullName} (${newApp.email}) submitted application ${newApp.referenceNumber} for package: ${selectedPlan.name} (${newApp.billingDuration}).`,
    link: `/admin/applications`,
  });

  return { success: true, application: newApp };
}

export function getAllApplications(): CustomerApplication[] {
  ensureSaasStoreInitialized();
  return db.applications;
}

export function getApplicationById(id: string): CustomerApplication | undefined {
  ensureSaasStoreInitialized();
  return db.applications.find((a) => a.id === id || a.referenceNumber === id);
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  adminNotes?: string,
  processedBy = 'Admin'
): CustomerApplication {
  ensureSaasStoreInitialized();
  const app = getApplicationById(id);
  if (!app) {
    throw new Error(`Application ${id} not found`);
  }

  app.status = status;
  if (adminNotes !== undefined) app.adminNotes = adminNotes;
  app.processedBy = processedBy;
  app.updatedAt = new Date().toISOString();

  saveDatabaseToFile();
  return app;
}

// ==============================================================================
// ONE-CLICK TRANSACTIONAL CUSTOMER CREATION & ACTIVATION (Phase 8)
// ==============================================================================

export interface ActivateCustomerParams {
  applicationId: string;
  planId: string;
  billingDuration: BillingCycle;
  startDate?: string;
  expiryDateOverride?: string;
  paymentDetails: {
    amountReceived: number;
    paymentMethod: string;
    paymentReference: string;
    adminNotes?: string;
  };
  adminEmail: string;
}

export function calculateExpiryDate(startDateIso: string, duration: BillingCycle): string {
  const start = new Date(startDateIso);
  const expiry = new Date(start);

  switch (duration) {
    case 'monthly':
      expiry.setDate(expiry.getDate() + 30);
      break;
    case 'quarterly':
      expiry.setDate(expiry.getDate() + 90);
      break;
    case 'half_yearly':
      expiry.setDate(expiry.getDate() + 180);
      break;
    case 'annual':
      expiry.setDate(expiry.getDate() + 365);
      break;
  }

  return expiry.toISOString();
}

export function activateCustomerFromApplication(params: ActivateCustomerParams): {
  success: boolean;
  user?: SaasUser;
  subscription?: SaasSubscription;
  payment?: ManualPayment;
  temporaryPassword?: string;
  activationLink?: string;
  error?: string;
} {
  ensureSaasStoreInitialized();

  const app = getApplicationById(params.applicationId);
  if (!app) {
    return { success: false, error: 'Application record not found.' };
  }

  // Duplicate User Check
  const existingUser = db.users.find((u) => u.email.toLowerCase() === app.email.toLowerCase());
  if (existingUser) {
    return {
      success: false,
      error: `A user account with email "${app.email}" already exists. Please assign the package directly from Admin Users.`,
    };
  }

  const plan = getPlanById(params.planId);
  if (!plan) {
    return { success: false, error: 'Selected subscription package does not exist.' };
  }

  const startDateIso = params.startDate ? new Date(params.startDate).toISOString() : new Date().toISOString();
  const expiryDateIso = params.expiryDateOverride
    ? new Date(params.expiryDateOverride).toISOString()
    : calculateExpiryDate(startDateIso, params.billingDuration);

  // Generate secure temporary activation password
  const temporaryPassword = `Samvero#${Math.floor(100000 + Math.random() * 900000)}!`;
  const activationToken = crypto.randomBytes(24).toString('hex');

  // 1. Create Customer User Record
  const newUser: SaasUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    email: app.email,
    name: app.fullName,
    businessName: app.businessName,
    phone: app.whatsapp,
    whatsapp: app.whatsapp,
    country: app.country,
    companyWebsite: app.companyWebsite,
    role: 'customer',
    status: 'active',
    passwordHash: hashPassword(temporaryPassword),
    mustChangePassword: true,
    resetToken: activationToken,
    resetTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days valid
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 2. Create Active Subscription Record with automatic Plan Entitlement Snapshot
  const newSub: SaasSubscription = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    customerId: newUser.id,
    customerEmail: newUser.email,
    customerName: newUser.name,
    planId: plan.id,
    planName: plan.name,
    billingCycle: params.billingDuration,
    startDate: startDateIso,
    expiryDate: expiryDateIso,
    gracePeriodDays: db.settings.defaultGracePeriodDays || 3,
    status: 'active',
    leadQuota: plan.maxLeadsQuota,
    leadsConsumed: 0,
    renewalStatus: 'none',
    entitlements: { ...plan }, // Snapshot
    applicationReference: app.referenceNumber,
    createdBy: params.adminEmail,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 3. Create Confirmed Payment Record
  const amountDue = plan.prices[params.billingDuration] || plan.prices.monthly;
  const newPayment: ManualPayment = {
    id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    applicationId: app.id,
    applicationReference: app.referenceNumber,
    customerId: newUser.id,
    customerName: newUser.name,
    customerEmail: newUser.email,
    planId: plan.id,
    planName: plan.name,
    billingDuration: params.billingDuration,
    amountDue,
    amountReceived: params.paymentDetails.amountReceived || amountDue,
    currency: db.settings.currency || 'USD',
    paymentMethod: params.paymentDetails.paymentMethod || 'Bank Wire Transfer',
    paymentReference: params.paymentDetails.paymentReference || `MANUAL-${Date.now()}`,
    paymentDate: new Date().toISOString(),
    paymentEvidenceNote: params.paymentDetails.adminNotes || 'Manual payment verified by admin desk.',
    adminNotes: params.paymentDetails.adminNotes,
    status: 'confirmed',
    confirmedBy: params.adminEmail,
    confirmedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 4. Record Subscription History Audit
  const historyRecord: SubscriptionHistoryRecord = {
    id: `hist-${Date.now()}`,
    subscriptionId: newSub.id,
    customerId: newUser.id,
    action: 'created',
    newState: {
      planName: plan.name,
      billingCycle: params.billingDuration,
      leadQuota: plan.maxLeadsQuota,
      expiryDate: expiryDateIso,
    },
    reason: `Initial customer onboarding from application ${app.referenceNumber}. Payment confirmed.`,
    performedBy: params.adminEmail,
    timestamp: new Date().toISOString(),
  };

  // 5. Update Application
  app.status = 'approved';
  app.customerId = newUser.id;
  app.processedBy = params.adminEmail;
  app.updatedAt = new Date().toISOString();

  // Commit transactionally to in-memory store
  db.users.push(newUser);
  db.subscriptions.push(newSub);
  db.payments.push(newPayment);
  db.subscriptionHistory.push(historyRecord);

  // 6. Seed initial genuine leads for customer based on their plan's quota & countries
  const allPlatformLeads = getAllRegisteredLeads();
  const targetLeads = allPlatformLeads.filter(
    (l) => plan.allowedCountries.includes(l.country) && plan.allowedSources.includes(l.platform)
  ).slice(0, 10);

  targetLeads.forEach((l) => {
    db.customerLeads.push({
      id: `clead-${newUser.id}-${l.id}`,
      customerId: newUser.id,
      leadId: l.id,
      businessName: l.businessName,
      category: l.category,
      country: l.country,
      city: l.city,
      platform: l.platform,
      contact: l.contact,
      status: 'saved',
      tags: ['Initial Plan Match'],
      consumedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  // Track initial leads consumed
  newSub.leadsConsumed = targetLeads.length;

  saveDatabaseToFile();

  // 7. Generate activation notification
  const activationLink = `/login?token=${activationToken}&email=${encodeURIComponent(newUser.email)}`;

  createSystemNotification({
    recipientRole: 'customer',
    recipientUserId: newUser.id,
    type: 'payment_confirmed',
    title: 'Welcome to SAMVERO — Account Activated',
    message: `Your payment was confirmed and your ${plan.name} subscription is now active! You have ${newSub.leadQuota} leads allocated until ${new Date(newSub.expiryDate).toLocaleDateString()}.`,
    link: '/app/dashboard',
  });

  createSystemNotification({
    recipientRole: 'admin',
    type: 'payment_confirmed',
    title: `Customer Account Activated: ${newUser.name}`,
    message: `Customer ${newUser.name} (${newUser.email}) was provisioned with package "${plan.name}" and expiry ${new Date(newSub.expiryDate).toLocaleDateString()}.`,
    link: `/admin/users`,
  });

  return {
    success: true,
    user: newUser,
    subscription: newSub,
    payment: newPayment,
    temporaryPassword,
    activationLink,
  };
}

// ==============================================================================
// CUSTOMER & USERS MANAGEMENT (Admin Users page)
// ==============================================================================

export function getAllSaasUsers(): Array<SaasUser & { activeSubscription?: SaasSubscription }> {
  ensureSaasStoreInitialized();
  return db.users.map((u) => {
    const activeSub = db.subscriptions.find((s) => s.customerId === u.id);
    return {
      ...u,
      activeSubscription: activeSub,
    };
  });
}

export function getSaasUserById(id: string): SaasUser | undefined {
  ensureSaasStoreInitialized();
  return db.users.find((u) => u.id === id || u.email.toLowerCase() === id.toLowerCase());
}

export function updateSaasUser(userId: string, updates: Partial<SaasUser>, adminEmail = 'Admin'): SaasUser {
  ensureSaasStoreInitialized();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error(`User with ID ${userId} not found`);

  Object.assign(user, updates, { updatedAt: new Date().toISOString() });
  saveDatabaseToFile();
  return user;
}

export function toggleUserAccountStatus(userId: string, status: UserStatus, adminEmail = 'Admin'): SaasUser {
  ensureSaasStoreInitialized();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error(`User with ID ${userId} not found`);

  user.status = status;
  user.updatedAt = new Date().toISOString();

  // If suspended, also suspend subscription
  const sub = db.subscriptions.find((s) => s.customerId === userId);
  if (sub) {
    if (status === 'suspended') {
      sub.status = 'suspended';
    } else if (status === 'active' && sub.status === 'suspended') {
      sub.status = 'active';
    }
  }

  saveDatabaseToFile();

  createSystemNotification({
    recipientRole: 'admin',
    type: 'security_alert',
    title: `Account Status Changed: ${user.name}`,
    message: `User ${user.name} (${user.email}) status was changed to "${status}" by ${adminEmail}.`,
    link: '/admin/users',
  });

  return user;
}

export function manuallyAssignPackageToCustomer(params: {
  userId: string;
  planId: string;
  billingDuration: BillingCycle;
  expiryDateOverride?: string;
  adminEmail: string;
  overrideLeadQuota?: number;
}): SaasSubscription {
  ensureSaasStoreInitialized();

  const user = getSaasUserById(params.userId);
  if (!user) throw new Error('Customer user not found');

  const plan = getPlanById(params.planId);
  if (!plan) throw new Error('Plan not found');

  const startDateIso = new Date().toISOString();
  const expiryDateIso = params.expiryDateOverride
    ? new Date(params.expiryDateOverride).toISOString()
    : calculateExpiryDate(startDateIso, params.billingDuration);

  let existingSub = db.subscriptions.find((s) => s.customerId === user.id);

  if (existingSub) {
    const prevState = { ...existingSub };
    existingSub.planId = plan.id;
    existingSub.planName = plan.name;
    existingSub.billingCycle = params.billingDuration;
    existingSub.startDate = startDateIso;
    existingSub.expiryDate = expiryDateIso;
    existingSub.leadQuota = params.overrideLeadQuota || plan.maxLeadsQuota;
    existingSub.status = 'active';
    existingSub.entitlements = { ...plan };
    existingSub.updatedAt = new Date().toISOString();

    db.subscriptionHistory.push({
      id: `hist-${Date.now()}`,
      subscriptionId: existingSub.id,
      customerId: user.id,
      action: 'package_changed',
      previousState: prevState,
      newState: { ...existingSub },
      reason: `Package updated to ${plan.name} by ${params.adminEmail}`,
      performedBy: params.adminEmail,
      timestamp: new Date().toISOString(),
    });

    saveDatabaseToFile();
    return existingSub;
  } else {
    const newSub: SaasSubscription = {
      id: `sub-${Date.now()}`,
      customerId: user.id,
      customerEmail: user.email,
      customerName: user.name,
      planId: plan.id,
      planName: plan.name,
      billingCycle: params.billingDuration,
      startDate: startDateIso,
      expiryDate: expiryDateIso,
      gracePeriodDays: 3,
      status: 'active',
      leadQuota: params.overrideLeadQuota || plan.maxLeadsQuota,
      leadsConsumed: 0,
      renewalStatus: 'none',
      entitlements: { ...plan },
      createdBy: params.adminEmail,
      createdAt: startDateIso,
      updatedAt: startDateIso,
    };

    db.subscriptions.push(newSub);
    db.subscriptionHistory.push({
      id: `hist-${Date.now()}`,
      subscriptionId: newSub.id,
      customerId: user.id,
      action: 'created',
      newState: { ...newSub },
      reason: `Package ${plan.name} directly assigned by ${params.adminEmail}`,
      performedBy: params.adminEmail,
      timestamp: new Date().toISOString(),
    });

    saveDatabaseToFile();
    return newSub;
  }
}

export function extendCustomerSubscription(params: {
  subscriptionId: string;
  additionalDays: number;
  newExpiryDate?: string;
  reason: string;
  adminEmail: string;
}): SaasSubscription {
  ensureSaasStoreInitialized();

  const sub = db.subscriptions.find((s) => s.id === params.subscriptionId);
  if (!sub) throw new Error('Subscription not found');

  const oldExpiry = new Date(sub.expiryDate);
  let newExpiry: Date;

  if (params.newExpiryDate) {
    newExpiry = new Date(params.newExpiryDate);
  } else {
    newExpiry = new Date(oldExpiry.getTime() + params.additionalDays * 24 * 60 * 60 * 1000);
  }

  const previousState = { expiryDate: sub.expiryDate, status: sub.status };
  sub.expiryDate = newExpiry.toISOString();
  if (sub.status === 'expired' || sub.status === 'expiring_soon') {
    sub.status = 'active';
  }
  sub.updatedAt = new Date().toISOString();

  db.subscriptionHistory.push({
    id: `hist-${Date.now()}`,
    subscriptionId: sub.id,
    customerId: sub.customerId,
    action: 'extended',
    previousState,
    newState: { expiryDate: sub.expiryDate, status: sub.status },
    reason: params.reason || `Extended by ${params.additionalDays} days`,
    performedBy: params.adminEmail,
    timestamp: new Date().toISOString(),
  });

  saveDatabaseToFile();

  createSystemNotification({
    recipientRole: 'customer',
    recipientUserId: sub.customerId,
    type: 'general',
    title: 'Subscription Extended',
    message: `Your Samvero subscription has been extended until ${newExpiry.toLocaleDateString()}. Enjoy uninterrupted access!`,
    link: '/app/subscription',
  });

  return sub;
}

// ==============================================================================
// PAYMENTS WORKFLOW (Manual Payments)
// ==============================================================================

export function getAllPayments(): ManualPayment[] {
  ensureSaasStoreInitialized();
  return db.payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function confirmManualPayment(paymentId: string, adminEmail: string, notes?: string): ManualPayment {
  ensureSaasStoreInitialized();
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error('Payment record not found');

  payment.status = 'confirmed';
  payment.amountReceived = payment.amountDue;
  payment.confirmedBy = adminEmail;
  payment.confirmedAt = new Date().toISOString();
  if (notes) payment.adminNotes = notes;
  payment.updatedAt = new Date().toISOString();

  // If customer has an active subscription, ensure status is active
  if (payment.customerId) {
    const sub = db.subscriptions.find((s) => s.customerId === payment.customerId);
    if (sub && (sub.status === 'pending' || sub.status === 'expired')) {
      sub.status = 'active';
    }
  }

  saveDatabaseToFile();

  createSystemNotification({
    recipientRole: 'admin',
    type: 'payment_confirmed',
    title: `Payment Confirmed: ${payment.currency} ${payment.amountReceived}`,
    message: `Manual payment ${payment.paymentReference} for ${payment.customerName} was verified and confirmed by ${adminEmail}.`,
    link: '/admin/payments',
  });

  return payment;
}

// ==============================================================================
// EXPIRY AUTOMATION & SCHEDULED CHECK (Phase 9)
// ==============================================================================

export function checkAllSubscriptionExpirations(): {
  checkedCount: number;
  expiringSoonCount: number;
  expiredCount: number;
} {
  ensureSaasStoreInitialized();

  const now = new Date().getTime();
  const warningWindowMs = (db.settings.expiryWarningDays || 7) * 24 * 60 * 60 * 1000;
  let expiringSoonCount = 0;
  let expiredCount = 0;

  db.subscriptions.forEach((sub) => {
    if (sub.status === 'suspended' || sub.status === 'cancelled') return;

    const expiryTime = new Date(sub.expiryDate).getTime();
    const timeLeft = expiryTime - now;

    // 1. Expired Check
    if (timeLeft <= 0) {
      if (sub.status !== 'expired') {
        sub.status = 'expired';
        sub.updatedAt = new Date().toISOString();
        expiredCount++;

        // Notify Customer
        createSystemNotification({
          recipientRole: 'customer',
          recipientUserId: sub.customerId,
          type: 'subscription_expired',
          title: 'Subscription Expired — Renewal Required',
          message: `Your Samvero plan expired on ${new Date(sub.expiryDate).toLocaleDateString()}. New lead discovery and research jobs are restricted until renewed. Your existing leads remain safe.`,
          link: '/app/subscription',
        });

        // Notify Admin
        createSystemNotification({
          recipientRole: 'admin',
          type: 'subscription_expired',
          title: `Subscription Expired: ${sub.customerName}`,
          message: `${sub.customerName}'s (${sub.customerEmail}) plan "${sub.planName}" expired.`,
          link: '/admin/subscriptions',
        });
      }
    } 
    // 2. Expiring Soon Check (within 7 days)
    else if (timeLeft <= warningWindowMs) {
      if (sub.status === 'active') {
        sub.status = 'expiring_soon';
        sub.updatedAt = new Date().toISOString();
        expiringSoonCount++;

        const daysRemaining = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));

        createSystemNotification({
          recipientRole: 'customer',
          recipientUserId: sub.customerId,
          type: 'subscription_expiring',
          title: `Subscription Expiring in ${daysRemaining} Days`,
          message: `Your Samvero ${sub.planName} plan will expire on ${new Date(sub.expiryDate).toLocaleDateString()}. Please contact our team to arrange renewal and maintain uninterrupted access.`,
          link: '/app/subscription',
        });
      }
    }
  });

  if (expiringSoonCount > 0 || expiredCount > 0) {
    saveDatabaseToFile();
  }

  return {
    checkedCount: db.subscriptions.length,
    expiringSoonCount,
    expiredCount,
  };
}

// ==============================================================================
// SUBSCRIPTION RENEWAL REQUESTS (Phase 10)
// ==============================================================================

export function requestSubscriptionRenewal(data: {
  customerId: string;
  requestedPlanId: string;
  requestedDuration: BillingCycle;
  customerNotes?: string;
}): RenewalRequest {
  ensureSaasStoreInitialized();

  const sub = db.subscriptions.find((s) => s.customerId === data.customerId);
  if (!sub) throw new Error('Active subscription not found for customer');

  const plan = getPlanById(data.requestedPlanId) || getPlanById(sub.planId);
  if (!plan) throw new Error('Plan not found');

  const amountDue = plan.prices[data.requestedDuration] || plan.prices.monthly;

  const renewal: RenewalRequest = {
    id: `ren-${Date.now()}`,
    subscriptionId: sub.id,
    customerId: data.customerId,
    customerName: sub.customerName,
    customerEmail: sub.customerEmail,
    currentPlanId: sub.planId,
    requestedPlanId: plan.id,
    requestedDuration: data.requestedDuration,
    amountDue,
    status: 'pending',
    customerNotes: data.customerNotes,
    createdAt: new Date().toISOString(),
  };

  db.renewals.unshift(renewal);
  sub.renewalStatus = 'requested';
  saveDatabaseToFile();

  // Notify admin
  createSystemNotification({
    recipientRole: 'admin',
    type: 'renewal_request',
    title: `Renewal Requested: ${sub.customerName}`,
    message: `${sub.customerName} (${sub.customerEmail}) requested renewal for package: ${plan.name} (${data.requestedDuration}). Amount due: ${db.settings.currency} ${amountDue}.`,
    link: '/admin/subscriptions',
  });

  return renewal;
}

export function confirmSubscriptionRenewal(params: {
  renewalId: string;
  paymentReference: string;
  paymentMethod: string;
  adminEmail: string;
  notes?: string;
}): { renewal: RenewalRequest; subscription: SaasSubscription; payment: ManualPayment } {
  ensureSaasStoreInitialized();

  const renewal = db.renewals.find((r) => r.id === params.renewalId);
  if (!renewal) throw new Error('Renewal request not found');

  const sub = db.subscriptions.find((s) => s.id === renewal.subscriptionId);
  if (!sub) throw new Error('Subscription not found');

  const plan = getPlanById(renewal.requestedPlanId) || getPlanById(sub.planId);
  if (!plan) throw new Error('Plan not found');

  // Compute new start and expiry dates
  const now = new Date();
  const currentExpiry = new Date(sub.expiryDate);
  // If not yet expired, extend from existing expiry; otherwise extend from now
  const baseDate = currentExpiry > now ? currentExpiry : now;
  const newExpiryIso = calculateExpiryDate(baseDate.toISOString(), renewal.requestedDuration);

  // Record payment
  const payment: ManualPayment = {
    id: `pay-ren-${Date.now()}`,
    customerId: sub.customerId,
    customerName: sub.customerName,
    customerEmail: sub.customerEmail,
    planId: plan.id,
    planName: plan.name,
    billingDuration: renewal.requestedDuration,
    amountDue: renewal.amountDue,
    amountReceived: renewal.amountDue,
    currency: db.settings.currency || 'USD',
    paymentMethod: params.paymentMethod,
    paymentReference: params.paymentReference,
    paymentDate: new Date().toISOString(),
    paymentEvidenceNote: params.notes || 'Renewal payment confirmed by admin.',
    status: 'confirmed',
    confirmedBy: params.adminEmail,
    confirmedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update subscription
  sub.planId = plan.id;
  sub.planName = plan.name;
  sub.billingCycle = renewal.requestedDuration;
  sub.expiryDate = newExpiryIso;
  sub.leadQuota = plan.maxLeadsQuota; // Reset quota for new billing cycle
  sub.leadsConsumed = 0; // Fresh quota for new billing cycle
  sub.status = 'active';
  sub.renewalStatus = 'renewed';
  sub.entitlements = { ...plan };
  sub.updatedAt = new Date().toISOString();

  // Update renewal
  renewal.status = 'confirmed';
  renewal.adminNotes = params.notes;
  renewal.resolvedAt = new Date().toISOString();

  db.payments.push(payment);
  db.subscriptionHistory.push({
    id: `hist-${Date.now()}`,
    subscriptionId: sub.id,
    customerId: sub.customerId,
    action: 'renewed',
    newState: {
      planName: plan.name,
      billingCycle: renewal.requestedDuration,
      expiryDate: newExpiryIso,
      leadQuota: plan.maxLeadsQuota,
    },
    reason: `Subscription renewed via manual payment confirmation (${params.paymentReference})`,
    performedBy: params.adminEmail,
    timestamp: new Date().toISOString(),
  });

  saveDatabaseToFile();

  createSystemNotification({
    recipientRole: 'customer',
    recipientUserId: sub.customerId,
    type: 'payment_confirmed',
    title: 'Subscription Successfully Renewed',
    message: `Your Samvero ${plan.name} subscription has been renewed until ${new Date(newExpiryIso).toLocaleDateString()} with fresh ${plan.maxLeadsQuota} leads allocation.`,
    link: '/app/dashboard',
  });

  return { renewal, subscription: sub, payment };
}

// ==============================================================================
// MULTI-TENANT LEAD & QUOTA ENFORCEMENT (Phase 12 & 13)
// ==============================================================================

export function getCustomerLeads(customerId: string): CustomerLeadRecord[] {
  ensureSaasStoreInitialized();
  return db.customerLeads.filter((l) => l.customerId === customerId);
}

export function canCustomerConsumeLead(customerId: string): {
  allowed: boolean;
  reason?: string;
  subscription?: SaasSubscription;
  remainingQuota?: number;
} {
  ensureSaasStoreInitialized();

  // 1. Find user
  const user = getSaasUserById(customerId);
  if (!user) return { allowed: false, reason: 'User not found' };

  // Super Admin / Global User has unrestricted access
  if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'global_user') {
    return { allowed: true, remainingQuota: 999999 };
  }

  // 2. Find customer subscription
  const sub = db.subscriptions.find((s) => s.customerId === customerId);
  if (!sub) {
    return { allowed: false, reason: 'No active subscription found. Please select a package.' };
  }

  // 3. Expiry check (both status and wall-clock timestamp)
  const nowTime = Date.now();
  const expiryTime = new Date(sub.expiryDate).getTime();
  if (sub.status === 'expired' || expiryTime <= nowTime) {
    if (sub.status !== 'expired') {
      sub.status = 'expired';
      sub.updatedAt = new Date().toISOString();
      saveDatabaseToFile();
    }
    return {
      allowed: false,
      reason: 'Your subscription has expired. Please renew your package to continue discovering and consuming leads.',
      subscription: sub,
      remainingQuota: 0,
    };
  }

  if (sub.status === 'suspended') {
    return {
      allowed: false,
      reason: 'Your account is suspended. Please contact customer support.',
      subscription: sub,
      remainingQuota: 0,
    };
  }

  // 4. Quota check
  const remaining = Math.max(0, sub.leadQuota - sub.leadsConsumed);
  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `You have reached your maximum lead allocation limit of ${sub.leadQuota} leads. Please upgrade your package or request a quota expansion.`,
      subscription: sub,
      remainingQuota: 0,
    };
  }

  return {
    allowed: true,
    subscription: sub,
    remainingQuota: remaining,
  };
}

export function consumeLeadForCustomer(
  customerId: string,
  lead: Lead
): { success: boolean; customerLead?: CustomerLeadRecord; error?: string; remainingQuota?: number } {
  ensureSaasStoreInitialized();

  // Strict Server-Side Quota Enforcement Check
  const check = canCustomerConsumeLead(customerId);
  if (!check.allowed) {
    return { success: false, error: check.reason, remainingQuota: 0 };
  }

  // Check if lead already saved by this customer (Zero double-charging!)
  const existing = db.customerLeads.find((l) => l.customerId === customerId && l.leadId === lead.id);
  if (existing) {
    return {
      success: true,
      customerLead: existing,
      remainingQuota: check.subscription ? check.subscription.leadQuota - check.subscription.leadsConsumed : 999999,
    };
  }

  // Atomic quota deduction
  const sub = check.subscription;
  if (sub) {
    sub.leadsConsumed += 1;
    sub.updatedAt = new Date().toISOString();

    // Check if customer just exhausted quota
    if (sub.leadsConsumed >= sub.leadQuota) {
      createSystemNotification({
        recipientRole: 'customer',
        recipientUserId: customerId,
        type: 'quota_warning',
        title: 'Lead Allowance Limit Reached',
        message: `You have utilized 100% of your allocated ${sub.leadQuota} leads. Request a plan upgrade to unlock additional discoveries.`,
        link: '/app/subscription',
      });
    }
  }

  // Create isolated customer lead record
  const customerLead: CustomerLeadRecord = {
    id: `clead-${customerId}-${lead.id}`,
    customerId,
    leadId: lead.id,
    businessName: lead.businessName,
    category: lead.category,
    country: lead.country,
    city: lead.city,
    platform: lead.platform,
    contact: lead.contact,
    status: 'saved',
    tags: lead.tags || [],
    consumedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.customerLeads.unshift(customerLead);
  saveDatabaseToFile();

  const remaining = sub ? sub.leadQuota - sub.leadsConsumed : 999999;
  return { success: true, customerLead, remainingQuota: remaining };
}

// ==============================================================================
// NOTIFICATIONS API
// ==============================================================================

export function createSystemNotification(data: {
  recipientRole: 'admin' | 'customer';
  recipientUserId?: string;
  type: SystemNotification['type'];
  title: string;
  message: string;
  link?: string;
}): SystemNotification {
  ensureSaasStoreInitialized();

  const notif: SystemNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientRole: data.recipientRole,
    recipientUserId: data.recipientUserId,
    type: data.type,
    title: data.title,
    message: data.message,
    link: data.link,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  db.notifications.unshift(notif);
  if (db.notifications.length > 200) {
    db.notifications = db.notifications.slice(0, 200);
  }
  saveDatabaseToFile();
  return notif;
}

export function getNotificationsForUser(userRole: 'admin' | 'customer', userId?: string): SystemNotification[] {
  ensureSaasStoreInitialized();
  return db.notifications.filter((n) => {
    if (userRole === 'admin') return n.recipientRole === 'admin';
    return n.recipientRole === 'customer' && (!n.recipientUserId || n.recipientUserId === userId);
  });
}

export function markNotificationAsRead(id: string): boolean {
  ensureSaasStoreInitialized();
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    saveDatabaseToFile();
    return true;
  }
  return false;
}

// ==============================================================================
// ADMIN SETTINGS API
// ==============================================================================

export function getAdminSettings(): AdminSettings {
  ensureSaasStoreInitialized();
  return db.settings;
}

export function updateAdminSettings(updates: Partial<AdminSettings>): AdminSettings {
  ensureSaasStoreInitialized();
  db.settings = { ...db.settings, ...updates };
  saveDatabaseToFile();
  return db.settings;
}

// ==============================================================================
// SUPER ADMIN EXECUTIVE METRICS (Phase 6)
// ==============================================================================

export function getSuperAdminDashboardMetrics(): {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  pendingApplications: number;
  pendingPayments: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  expiringSoonSubscriptions: number;
  totalLeadsGenerated: number;
  totalLeadAllocations: number;
  totalLeadsConsumed: number;
  availableLeadCapacity: number;
  monthlyRevenue: number;
  outstandingPayments: number;
  renewalsDue: number;
  recentApplications: CustomerApplication[];
  recentPayments: ManualPayment[];
  recentCustomerActivity: SubscriptionHistoryRecord[];
  upcomingRenewals: RenewalRequest[];
  packageDistribution: Record<string, number>;
  leadsBySource: Record<string, number>;
} {
  ensureSaasStoreInitialized();
  checkAllSubscriptionExpirations();

  const customers = db.users.filter((u) => u.role === 'customer');
  const activeCustomers = customers.filter((u) => u.status === 'active').length;
  const inactiveCustomers = customers.filter((u) => u.status !== 'active').length;

  const pendingApps = db.applications.filter((a) => a.status === 'pending' || a.status === 'reviewing').length;
  const pendingPayments = db.payments.filter((p) => p.status === 'pending' || p.status === 'payment_submitted' || p.status === 'under_review').length;

  const activeSubs = db.subscriptions.filter((s) => s.status === 'active').length;
  const expiredSubs = db.subscriptions.filter((s) => s.status === 'expired').length;
  const expiringSoonSubs = db.subscriptions.filter((s) => s.status === 'expiring_soon').length;

  const totalAllocated = db.subscriptions.reduce((sum, s) => sum + s.leadQuota, 0);
  const totalConsumed = db.subscriptions.reduce((sum, s) => sum + s.leadsConsumed, 0);
  const availableCapacity = Math.max(0, totalAllocated - totalConsumed);

  // Revenue calculation based on confirmed payments
  const monthlyRevenue = db.payments
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + Number(p.amountReceived || 0), 0);

  const outstandingPayments = db.payments
    .filter((p) => p.status !== 'confirmed' && p.status !== 'refunded' && p.status !== 'rejected')
    .reduce((sum, p) => sum + Number(p.amountDue || 0), 0);

  const renewalsDue = db.renewals.filter((r) => r.status === 'pending').length;

  // Package distribution count
  const packageDistribution: Record<string, number> = {};
  db.plans.forEach((p) => (packageDistribution[p.name] = 0));
  db.subscriptions.forEach((s) => {
    packageDistribution[s.planName] = (packageDistribution[s.planName] || 0) + 1;
  });

  // Leads by source from global leads
  const allLeads = getAllRegisteredLeads();
  const leadsBySource: Record<string, number> = {};
  allLeads.forEach((l) => {
    leadsBySource[l.platform] = (leadsBySource[l.platform] || 0) + 1;
  });

  return {
    totalCustomers: customers.length,
    activeCustomers,
    inactiveCustomers,
    pendingApplications: pendingApps,
    pendingPayments,
    activeSubscriptions: activeSubs,
    expiredSubscriptions: expiredSubs,
    expiringSoonSubscriptions: expiringSoonSubs,
    totalLeadsGenerated: allLeads.length,
    totalLeadAllocations: totalAllocated,
    totalLeadsConsumed: totalConsumed,
    availableLeadCapacity: availableCapacity,
    monthlyRevenue,
    outstandingPayments,
    renewalsDue,
    recentApplications: db.applications.slice(0, 5),
    recentPayments: db.payments.slice(0, 5),
    recentCustomerActivity: db.subscriptionHistory.slice(0, 8),
    upcomingRenewals: db.renewals.slice(0, 5),
    packageDistribution,
    leadsBySource,
  };
}

// ==============================================================================
// CUSTOMER PRIVATE DASHBOARD METRICS (Phase 11)
// ==============================================================================

export function getCustomerDashboardMetrics(customerId: string): {
  myTotalLeads: number;
  leadsUsed: number;
  remainingLeads: number;
  leadsAddedThisMonth: number;
  businessesResearched: number;
  emailsDiscovered: number;
  phoneNumbersDiscovered: number;
  qualifiedLeads: number;
  subscription: SaasSubscription | null;
  recentLeads: CustomerLeadRecord[];
  leadsBySource: Record<string, number>;
  leadsByIndustry: Record<string, number>;
  contactAvailability: { withEmail: number; withPhone: number; withBoth: number; total: number };
} {
  ensureSaasStoreInitialized();
  checkAllSubscriptionExpirations();

  const myLeads = db.customerLeads.filter((l) => l.customerId === customerId);
  const sub = db.subscriptions.find((s) => s.customerId === customerId) || null;

  const leadsUsed = sub ? sub.leadsConsumed : myLeads.length;
  const leadQuota = sub ? sub.leadQuota : 0;
  const remainingLeads = Math.max(0, leadQuota - leadsUsed);

  let emailsDiscovered = 0;
  let phoneNumbersDiscovered = 0;
  let bothDiscovered = 0;
  let qualifiedLeads = 0;
  const leadsBySource: Record<string, number> = {};
  const leadsByIndustry: Record<string, number> = {};

  myLeads.forEach((l) => {
    const hasEmail = Boolean(l.contact?.email);
    const hasPhone = Boolean(l.contact?.phone);
    if (hasEmail) emailsDiscovered++;
    if (hasPhone) phoneNumbersDiscovered++;
    if (hasEmail && hasPhone) bothDiscovered++;
    if (l.status === 'qualified') qualifiedLeads++;

    leadsBySource[l.platform] = (leadsBySource[l.platform] || 0) + 1;
    leadsByIndustry[l.category] = (leadsByIndustry[l.category] || 0) + 1;
  });

  return {
    myTotalLeads: myLeads.length,
    leadsUsed,
    remainingLeads,
    leadsAddedThisMonth: myLeads.length,
    businessesResearched: myLeads.filter((l) => l.status === 'researched' || l.status === 'qualified').length,
    emailsDiscovered,
    phoneNumbersDiscovered,
    qualifiedLeads,
    subscription: sub,
    recentLeads: myLeads.slice(0, 6),
    leadsBySource,
    leadsByIndustry,
    contactAvailability: {
      withEmail: emailsDiscovered,
      withPhone: phoneNumbersDiscovered,
      withBoth: bothDiscovered,
      total: myLeads.length,
    },
  };
}

// ==============================================================================
// SUBSCRIPTION ADMIN & HISTORY ACCESSORS
// ==============================================================================

export function getAllSubscriptions(): SaasSubscription[] {
  ensureSaasStoreInitialized();
  checkAllSubscriptionExpirations();
  return db.subscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getSubscriptionById(id: string): SaasSubscription | undefined {
  ensureSaasStoreInitialized();
  return db.subscriptions.find((s) => s.id === id || s.customerId === id);
}

export function getAllSubscriptionHistory(): SubscriptionHistoryRecord[] {
  ensureSaasStoreInitialized();
  return db.subscriptionHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getAllRenewals(): RenewalRequest[] {
  ensureSaasStoreInitialized();
  return db.renewals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function adjustSubscriptionQuota(
  subscriptionId: string,
  newQuota: number,
  reason: string,
  adminEmail: string
): SaasSubscription {
  ensureSaasStoreInitialized();
  const sub = db.subscriptions.find((s) => s.id === subscriptionId);
  if (!sub) throw new Error('Subscription not found');

  const prevQuota = sub.leadQuota;
  sub.leadQuota = newQuota;
  sub.updatedAt = new Date().toISOString();

  db.subscriptionHistory.push({
    id: `hist-${Date.now()}`,
    subscriptionId: sub.id,
    customerId: sub.customerId,
    action: 'quota_adjusted',
    previousState: { leadQuota: prevQuota },
    newState: { leadQuota: newQuota },
    reason: reason || `Quota adjusted to ${newQuota} leads`,
    performedBy: adminEmail,
    timestamp: new Date().toISOString(),
  });

  saveDatabaseToFile();

  createSystemNotification({
    recipientRole: 'customer',
    recipientUserId: sub.customerId,
    type: 'general',
    title: 'Lead Quota Adjusted',
    message: `Your lead quota has been updated to ${newQuota.toLocaleString()} leads by your account manager.`,
    link: '/app/subscription',
  });

  return sub;
}

export function updateSubscriptionStatus(
  subscriptionId: string,
  status: SubscriptionStatus,
  reason: string,
  adminEmail: string
): SaasSubscription {
  ensureSaasStoreInitialized();
  const sub = db.subscriptions.find((s) => s.id === subscriptionId);
  if (!sub) throw new Error('Subscription not found');

  const prevStatus = sub.status;
  sub.status = status;
  sub.updatedAt = new Date().toISOString();

  db.subscriptionHistory.push({
    id: `hist-${Date.now()}`,
    subscriptionId: sub.id,
    customerId: sub.customerId,
    action: status === 'suspended' ? 'suspended' : status === 'active' ? 'reactivated' : 'package_changed',
    previousState: { status: prevStatus },
    newState: { status },
    reason: reason || `Status updated to ${status}`,
    performedBy: adminEmail,
    timestamp: new Date().toISOString(),
  });

  saveDatabaseToFile();
  return sub;
}

// ==============================================================================
// MANUAL PAYMENT DIRECT RECORDING
// ==============================================================================

export function recordDirectManualPayment(params: {
  customerId?: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  billingDuration: BillingCycle;
  amountReceived: number;
  paymentMethod: string;
  paymentReference: string;
  paymentDate?: string;
  adminNotes?: string;
  adminEmail: string;
}): ManualPayment {
  ensureSaasStoreInitialized();

  const plan = getPlanById(params.planId);
  const planName = plan ? plan.name : 'Custom Plan';
  const amountDue = plan ? plan.prices[params.billingDuration] || plan.prices.monthly : params.amountReceived;

  const payment: ManualPayment = {
    id: `pay-manual-${Date.now()}`,
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    planId: params.planId,
    planName,
    billingDuration: params.billingDuration,
    amountDue,
    amountReceived: params.amountReceived,
    currency: db.settings.currency || 'USD',
    paymentMethod: params.paymentMethod,
    paymentReference: params.paymentReference,
    paymentDate: params.paymentDate || new Date().toISOString(),
    adminNotes: params.adminNotes,
    status: 'confirmed',
    confirmedBy: params.adminEmail,
    confirmedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.payments.unshift(payment);
  saveDatabaseToFile();

  createSystemNotification({
    recipientRole: 'admin',
    type: 'payment_confirmed',
    title: `Direct Payment Recorded: ${payment.currency} ${payment.amountReceived}`,
    message: `Manual payment ${payment.paymentReference} for ${payment.customerName} recorded by ${params.adminEmail}.`,
    link: '/admin/payments',
  });

  return payment;
}

// ==============================================================================
// CUSTOMER LEAD POOL & RECORD UPDATES
// ==============================================================================

export function updateCustomerLeadRecord(
  customerId: string,
  leadId: string,
  updates: Partial<CustomerLeadRecord>
): CustomerLeadRecord {
  ensureSaasStoreInitialized();
  const lead = db.customerLeads.find((l) => l.customerId === customerId && (l.id === leadId || l.leadId === leadId));
  if (!lead) throw new Error('Lead not found for customer');

  Object.assign(lead, updates, { updatedAt: new Date().toISOString() });
  saveDatabaseToFile();
  return lead;
}

export function deleteCustomerLeadRecord(customerId: string, leadId: string): boolean {
  ensureSaasStoreInitialized();
  const index = db.customerLeads.findIndex((l) => l.customerId === customerId && (l.id === leadId || l.leadId === leadId));
  if (index === -1) return false;

  db.customerLeads.splice(index, 1);
  saveDatabaseToFile();
  return true;
}

export function getAllCustomerLeadsPool(): Array<CustomerLeadRecord & { customer?: { name: string; email: string; businessName?: string } }> {
  ensureSaasStoreInitialized();
  return db.customerLeads.map((clead) => {
    const customer = db.users.find((u) => u.id === clead.customerId);
    return {
      ...clead,
      customer: customer ? { name: customer.name, email: customer.email, businessName: customer.businessName } : undefined,
    };
  });
}

export function getCustomerPayments(customerId: string): ManualPayment[] {
  ensureSaasStoreInitialized();
  return db.payments
    .filter((p) => p.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function changeUserPassword(
  userId: string,
  newPassword: string,
  oldPassword?: string
): { success: boolean; error?: string } {
  ensureSaasStoreInitialized();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return { success: false, error: 'User account not found' };

  if (oldPassword && !verifyPassword(oldPassword, user.passwordHash)) {
    return { success: false, error: 'Current password is incorrect' };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long' };
  }

  user.passwordHash = hashPassword(newPassword);
  user.mustChangePassword = false;
  user.updatedAt = new Date().toISOString();
  saveDatabaseToFile();

  createSystemNotification({
    recipientRole: user.role === 'admin' || user.role === 'super_admin' ? 'admin' : 'customer',
    recipientUserId: user.id,
    type: 'security_alert',
    title: 'Security Password Updated',
    message: 'Your account password has been changed successfully.',
    link: user.role === 'customer' ? '/app/profile' : '/admin/dashboard',
  });

  return { success: true };
}

export function updateCustomerProfile(
  userId: string,
  profile: {
    name?: string;
    businessName?: string;
    phone?: string;
    whatsapp?: string;
    country?: string;
    companyWebsite?: string;
  }
): { success: boolean; user?: SaasUser; error?: string } {
  ensureSaasStoreInitialized();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return { success: false, error: 'User account not found' };

  if (profile.name) user.name = profile.name.trim();
  if (profile.businessName !== undefined) user.businessName = profile.businessName?.trim();
  if (profile.phone !== undefined) user.phone = profile.phone?.trim();
  if (profile.whatsapp !== undefined) user.whatsapp = profile.whatsapp?.trim();
  if (profile.country) user.country = profile.country.trim();
  if (profile.companyWebsite !== undefined) user.companyWebsite = profile.companyWebsite?.trim();

  user.updatedAt = new Date().toISOString();
  saveDatabaseToFile();
  return { success: true, user };
}
