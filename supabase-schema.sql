-- =========================================================================
-- SAMVERO - Production Supabase PostgreSQL Relational Schema
-- Fully relational architecture supporting 19 production SaaS entities:
-- 1. users
-- 2. businesses
-- 3. lead_sources
-- 4. source_records
-- 5. business_websites
-- 6. contacts
-- 7. contact_verification
-- 8. source_evidence
-- 9. enrichment_jobs
-- 10. research_history
-- 11. lead_lists
-- 12. lead_list_membership
-- 13. lead_activities
-- 14. outreach_campaigns
-- 15. outreach_messages
-- 16. pipeline_status_history
-- 17. api_integrations
-- 18. api_usage_logs
-- 19. leads (legacy & primary fast-access store)
-- =========================================================================

-- 1. Users & Team Members
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'staff', -- 'admin' | 'staff' | 'global_user'
    is_global_user BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'suspended'
    department TEXT,
    leads_reached_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Businesses Master Entity
CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    legal_name TEXT,
    category TEXT NOT NULL DEFAULT 'Local Business',
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    founded_year INTEGER,
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 10,
    gmb_place_id TEXT,
    gmb_status TEXT DEFAULT 'NOT_SEARCHED', -- 'FOUND' | 'NOT_FOUND' | 'MULTIPLE_MATCHES' | 'NEEDS_REVIEW' | 'NOT_SEARCHED'
    confidence_score INTEGER DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_businesses_name ON public.businesses (name);
CREATE INDEX IF NOT EXISTS idx_businesses_city_country ON public.businesses (city, country);
CREATE INDEX IF NOT EXISTS idx_businesses_gmb_place ON public.businesses (gmb_place_id);

-- 3. Primary Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    business_id TEXT REFERENCES public.businesses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    business_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'gmb', -- 'gmb' | 'job'
    platform TEXT NOT NULL DEFAULT 'Google My Business',
    category TEXT NOT NULL DEFAULT 'Web Development',
    country TEXT NOT NULL DEFAULT 'Pakistan', -- 'UAE' | 'Pakistan' | 'US' | 'UK' | 'Global'
    city TEXT NOT NULL DEFAULT 'Dubai',
    address TEXT,
    business_age JSONB,
    budget TEXT,
    job_type TEXT DEFAULT 'Direct Client',
    description TEXT,
    posted_at TEXT DEFAULT 'Just now',
    contact JSONB,
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 12,
    tags JSONB DEFAULT '[]'::jsonb,
    verified BOOLEAN DEFAULT true,
    pipeline_stage TEXT DEFAULT 'new', -- 'new' | 'research_pending' | 'researching' | 'researched' | 'qualified' | 'contacted' | 'follow_up' | 'replied' | 'interested' | 'proposal_sent' | 'won' | 'lost' | 'archived'
    status TEXT DEFAULT 'new',
    assigned_to_user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    score_breakdown JSONB,
    ai_intelligence JSONB,
    source_evidence_list JSONB,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_country ON public.leads (country);
CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads (category);
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON public.leads (pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_user ON public.leads (assigned_to_user_id);

-- 4. Lead Sources Registry
CREATE TABLE IF NOT EXISTS public.lead_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    connector_type TEXT NOT NULL, -- 'api' | 'rss' | 'directory' | 'manual'
    status TEXT DEFAULT 'active',
    rate_limit_per_minute INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Source Records (Original Raw Telemetry)
CREATE TABLE IF NOT EXISTS public.source_records (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    source_platform TEXT NOT NULL,
    source_listing_id TEXT,
    source_url TEXT NOT NULL,
    raw_payload JSONB,
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_source_records_lead ON public.source_records (lead_id);
CREATE INDEX IF NOT EXISTS idx_source_records_url ON public.source_records (source_url);

-- 6. Business Websites
CREATE TABLE IF NOT EXISTS public.business_websites (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT REFERENCES public.businesses(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    full_url TEXT NOT NULL,
    has_ssl BOOLEAN DEFAULT true,
    is_responsive BOOLEAN DEFAULT true,
    performance_score INTEGER,
    last_crawled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_business_websites_domain ON public.business_websites (domain);

-- 7. Contacts (Direct Contact Points)
CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    business_id TEXT REFERENCES public.businesses(id) ON DELETE SET NULL,
    contact_person TEXT,
    email TEXT,
    email_status TEXT DEFAULT 'UNVERIFIED', -- 'VERIFIED' | 'LIKELY_VALID' | 'UNVERIFIED' | 'INVALID' | 'DISPOSABLE' | 'UNKNOWN'
    phone TEXT,
    phone_status TEXT DEFAULT 'UNVERIFIED', -- 'VALID_FORMAT' | 'VERIFIED' | 'UNVERIFIED' | 'INVALID' | 'UNKNOWN'
    whatsapp_digits TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts (phone);

-- 8. Contact Verification Audit Trail
CREATE TABLE IF NOT EXISTS public.contact_verification (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contact_id TEXT REFERENCES public.contacts(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL, -- 'email_dns_mx' | 'phone_itu' | 'smtp_probe'
    verdict TEXT NOT NULL,
    raw_response JSONB,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Source Evidence (Field-Level Provenance)
CREATE TABLE IF NOT EXISTS public.source_evidence (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL, -- 'email' | 'phone' | 'website' | 'address'
    retrieved_value TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_provider TEXT NOT NULL,
    source_type TEXT NOT NULL,
    page_title TEXT,
    match_confidence INTEGER DEFAULT 90,
    retrieval_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_source_evidence_lead ON public.source_evidence (lead_id);

-- 10. Background Enrichment Jobs
CREATE TABLE IF NOT EXISTS public.enrichment_jobs (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED', -- 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED' | 'NEEDS_REVIEW'
    progress_percent INTEGER DEFAULT 0,
    current_stage TEXT,
    stages JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enrichment_jobs_status ON public.enrichment_jobs (status);

-- 11. Lead Lists & Segmentation
CREATE TABLE IF NOT EXISTS public.lead_lists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'blue',
    created_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Lead List Membership
CREATE TABLE IF NOT EXISTS public.lead_list_membership (
    id BIGSERIAL PRIMARY KEY,
    list_id TEXT REFERENCES public.lead_lists(id) ON DELETE CASCADE,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (list_id, lead_id)
);

-- 13. Lead Activities (Audit Log)
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'discovered' | 'researched' | 'verified' | 'stage_changed' | 'email_sent' | 'note_added' | 'list_added' | 'archived'
    description TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON public.lead_activities (lead_id);

-- 14. Outreach Campaigns
CREATE TABLE IF NOT EXISTS public.outreach_campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'draft', -- 'draft' | 'active' | 'paused' | 'completed'
    target_category TEXT,
    target_country TEXT,
    total_leads INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    replied_count INTEGER DEFAULT 0,
    converted_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Outreach Messages & Dispatch Logs
CREATE TABLE IF NOT EXISTS public.outreach_logs (
    id BIGSERIAL PRIMARY KEY,
    lead_id TEXT,
    campaign_id TEXT REFERENCES public.outreach_campaigns(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    business_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    provider TEXT NOT NULL, -- 'gmail-smtp' | 'resend'
    message_id TEXT,
    status TEXT DEFAULT 'delivered',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_outreach_sent_at ON public.outreach_logs (sent_at DESC);

-- 16. Inbound & Outbound CRM Client Messages
CREATE TABLE IF NOT EXISTS public.client_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    sender TEXT NOT NULL DEFAULT 'client', -- 'client' | 'agent'
    sender_name TEXT,
    sender_email TEXT,
    subject TEXT,
    content TEXT NOT NULL,
    sentiment TEXT DEFAULT 'positive',
    unread BOOLEAN DEFAULT true,
    attachments JSONB DEFAULT '[]'::jsonb,
    voice_note JSONB,
    is_deleted_for_everyone BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_lead ON public.client_messages (lead_id);

-- 17. Pipeline Status History
CREATE TABLE IF NOT EXISTS public.pipeline_status_history (
    id BIGSERIAL PRIMARY KEY,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    old_stage TEXT,
    new_stage TEXT NOT NULL,
    changed_by TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. API Integrations Configuration
CREATE TABLE IF NOT EXISTS public.api_integrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    is_configured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'not_configured',
    rate_limit_per_minute INTEGER DEFAULT 60,
    requests_today INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 19. API Usage Logs
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
    id BIGSERIAL PRIMARY KEY,
    integration_id TEXT,
    endpoint TEXT NOT NULL,
    response_status INTEGER,
    latency_ms INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Enablement & Access Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrichment_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow service role full access on leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow service role full access on businesses" ON public.businesses FOR ALL USING (true);
CREATE POLICY "Allow service role full access on contacts" ON public.contacts FOR ALL USING (true);
CREATE POLICY "Allow service role full access on client_messages" ON public.client_messages FOR ALL USING (true);
CREATE POLICY "Allow service role full access on outreach_logs" ON public.outreach_logs FOR ALL USING (true);
CREATE POLICY "Allow service role full access on enrichment_jobs" ON public.enrichment_jobs FOR ALL USING (true);

-- =========================================================================
-- SAMVERO - MULTI-TENANT SAAS & SUBSCRIPTION EXTENSIONS (Phase 19)
-- =========================================================================

-- 20. Six Configurable Subscription Plans
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    price_monthly NUMERIC(10,2) NOT NULL,
    price_quarterly NUMERIC(10,2) NOT NULL,
    price_half_yearly NUMERIC(10,2) NOT NULL,
    price_annual NUMERIC(10,2) NOT NULL,
    max_leads_quota INTEGER NOT NULL,
    allowed_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    allowed_industries JSONB NOT NULL DEFAULT '[]'::jsonb,
    allowed_countries JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_business_research BOOLEAN DEFAULT true,
    has_gmb_research BOOLEAN DEFAULT true,
    has_email_discovery BOOLEAN DEFAULT true,
    has_phone_discovery BOOLEAN DEFAULT true,
    has_email_verification BOOLEAN DEFAULT true,
    has_phone_validation BOOLEAN DEFAULT true,
    has_csv_export BOOLEAN DEFAULT true,
    has_advanced_analytics BOOLEAN DEFAULT true,
    has_ai_analysis BOOLEAN DEFAULT true,
    has_bulk_research BOOLEAN DEFAULT true,
    concurrent_research_jobs INTEGER DEFAULT 5,
    priority_support BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    custom_duration_supported BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 21. Customer Registration & Applications
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    reference_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    business_name TEXT,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    country TEXT NOT NULL,
    company_website TEXT,
    plan_id TEXT REFERENCES public.plans(id) ON DELETE SET NULL,
    plan_name TEXT NOT NULL,
    billing_duration TEXT NOT NULL, -- 'monthly' | 'quarterly' | 'half_yearly' | 'annual'
    service_requirements TEXT NOT NULL,
    additional_message TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'reviewing' | 'payment_pending' | 'approved' | 'rejected'
    admin_notes TEXT,
    processed_by TEXT,
    customer_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);

-- 22. Active Customer Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    plan_id TEXT NOT NULL REFERENCES public.plans(id),
    plan_name TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    grace_period_days INTEGER DEFAULT 3,
    status TEXT NOT NULL DEFAULT 'active', -- 'pending' | 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'cancelled'
    lead_quota INTEGER NOT NULL,
    leads_consumed INTEGER DEFAULT 0,
    renewal_status TEXT DEFAULT 'none',
    entitlements JSONB NOT NULL,
    application_reference TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON public.subscriptions (customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry ON public.subscriptions (expiry_date);

-- 23. Subscription History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.subscription_history (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'created' | 'package_changed' | 'extended' | 'suspended' | 'reactivated' | 'expired' | 'renewed'
    previous_state JSONB,
    new_state JSONB,
    reason TEXT,
    performed_by TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 24. Manual Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    application_id TEXT REFERENCES public.applications(id) ON DELETE SET NULL,
    application_reference TEXT,
    customer_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    plan_id TEXT REFERENCES public.plans(id),
    plan_name TEXT NOT NULL,
    billing_duration TEXT NOT NULL,
    amount_due NUMERIC(10,2) NOT NULL,
    amount_received NUMERIC(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    payment_reference TEXT NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_evidence_note TEXT,
    admin_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'awaiting_payment' | 'payment_submitted' | 'under_review' | 'confirmed' | 'rejected' | 'refunded'
    confirmed_by TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_customer ON public.payments (customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status);

-- 25. Subscription Renewals
CREATE TABLE IF NOT EXISTS public.renewals (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    current_plan_id TEXT NOT NULL,
    requested_plan_id TEXT NOT NULL REFERENCES public.plans(id),
    requested_duration TEXT NOT NULL,
    amount_due NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'instructions_sent' | 'payment_submitted' | 'confirmed' | 'rejected'
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 26. Multi-Tenant Customer Leads (Strict Isolation)
CREATE TABLE IF NOT EXISTS public.customer_leads (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lead_id TEXT NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    platform TEXT NOT NULL,
    contact JSONB,
    notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'saved',
    consumed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (customer_id, lead_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_leads_cust ON public.customer_leads (customer_id);

-- 27. System Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    recipient_role TEXT NOT NULL, -- 'admin' | 'customer'
    recipient_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (recipient_user_id);

-- 28. Admin Settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enablement on New SaaS Entities
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on active plans" ON public.plans FOR SELECT USING (is_active = true);
CREATE POLICY "Allow service role full access on plans" ON public.plans FOR ALL USING (true);
CREATE POLICY "Allow service role full access on applications" ON public.applications FOR ALL USING (true);
CREATE POLICY "Allow service role full access on subscriptions" ON public.subscriptions FOR ALL USING (true);
CREATE POLICY "Allow service role full access on subscription_history" ON public.subscription_history FOR ALL USING (true);
CREATE POLICY "Allow service role full access on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow service role full access on renewals" ON public.renewals FOR ALL USING (true);
CREATE POLICY "Allow service role full access on customer_leads" ON public.customer_leads FOR ALL USING (true);
CREATE POLICY "Allow service role full access on notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Allow service role full access on admin_settings" ON public.admin_settings FOR ALL USING (true);

