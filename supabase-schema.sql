-- =========================================================================
-- SAMVERO - Supabase Database Schema & Tables
-- Execute this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- 1. Create 'leads' table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
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
    pipeline_stage TEXT DEFAULT 'new', -- 'new' | 'hot' | 'pending' | 'won' | 'rejected'
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy market & category queries
CREATE INDEX IF NOT EXISTS idx_leads_country ON public.leads (country);
CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads (category);
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON public.leads (pipeline_stage);

-- 2. Create 'client_messages' table (Inbound & Outbound CRM)
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_lead ON public.client_messages (lead_id);

-- 3. Create 'outreach_logs' table (Email Dispatch Audit Trail)
CREATE TABLE IF NOT EXISTS public.outreach_logs (
    id BIGSERIAL PRIMARY KEY,
    lead_id TEXT,
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

-- 4. Enable Row Level Security (RLS) & Public read policy
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous select for public leads showcase
CREATE POLICY "Allow public select on leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow service role full access on leads" ON public.leads FOR ALL USING (true);

CREATE POLICY "Allow public select on client_messages" ON public.client_messages FOR SELECT USING (true);
CREATE POLICY "Allow service role full access on client_messages" ON public.client_messages FOR ALL USING (true);

CREATE POLICY "Allow service role full access on outreach_logs" ON public.outreach_logs FOR ALL USING (true);

-- =========================================================================
-- Initial Seed: UAE, Pakistan, US, UK Flagship Market Leads
-- =========================================================================
INSERT INTO public.leads (id, title, business_name, type, platform, category, country, city, address, budget, description, contact, tags)
VALUES
(
  'uae-gmb-401',
  'Dr. Noor Aesthetic Dermatology & Laser Institute',
  'Dr. Noor Aesthetics & Laser Institute',
  'gmb',
  'Google My Business',
  'Local Business',
  'UAE',
  'Dubai',
  'Villa 14, Al Wasl Road, Jumeirah 1, Dubai, UAE',
  'AED 18,000 ($4,900) Luxury Portal',
  'Brand new VIP aesthetic clinic in Jumeirah 1. High net-worth clientele, requires 9-section portal with automated WhatsApp consultation and before/after slider.',
  '{"phone": "+971 4 344 8920", "whatsapp": "+97143448920", "email": "concierge@drnooraesthetics.ae", "hasWebsite": false, "contactPerson": "Dr. Noor Al-Mansoor"}'::jsonb,
  '["Newly Opened", "Jumeirah Dubai", "Aesthetic", "No Website", "High Ticket"]'::jsonb
),
(
  'uae-gmb-402',
  'Al-Futtaim Luxury Yacht Charters & Ocean Club',
  'Al-Futtaim Luxury Yacht Charters',
  'gmb',
  'Google My Business',
  'Local Business',
  'UAE',
  'Dubai',
  'Marina Walk, Berth B-12, Dubai Marina, Dubai, UAE',
  'AED 25,000 ($6,800) Charter Engine',
  'Fleet of 8 ultra-luxury 75ft-120ft yachts stationed in Dubai Marina. Currently receiving walk-in and agent bookings; urgently needs private digital booking engine.',
  '{"phone": "+971 4 399 7712", "whatsapp": "+97143997712", "email": "charters@alfuttaimyachts.ae", "hasWebsite": false, "contactPerson": "Hamad Al-Futtaim"}'::jsonb,
  '["Dubai Marina", "Yacht Charter", "Luxury", "Missing Website", "Urgent Lead"]'::jsonb
),
(
  'uae-job-404',
  'Private Chauffeur & VIP Airport Concierge App',
  'Royal Crest Chauffeur & Lifestyle UAE',
  'job',
  'Upwork',
  'Mobile App',
  'UAE',
  'Dubai',
  'Business Bay, Bay Square Building 7, Dubai, UAE',
  '$7,500 Fixed (AED 27,500)',
  'Exclusive VIP limousine & chauffeur service operating fleet across Dubai & Abu Dhabi airports. Needs 14-screen React Native client booking app.',
  '{"phone": "+971 4 429 1100", "whatsapp": "+97144291100", "email": "ops@royalcrestchauffeur.ae", "hasWebsite": true, "website": "https://royalcrestchauffeur.ae", "contactPerson": "Zayd Khouri (Managing Director)"}'::jsonb,
  '["React Native", "14-Screen App", "Business Bay Dubai", "High Budget"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
