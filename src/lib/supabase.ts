import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead } from '@/types';

// Read Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

// Public / Browser client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey)
  : null;

// Server-side privileged client
export const supabaseAdmin: SupabaseClient | null = isSupabaseConfigured && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

/**
 * Fetch leads from Supabase PostgreSQL table
 */
export async function getLeadsFromSupabase(): Promise<Lead[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      businessName: row.business_name,
      type: row.type,
      platform: row.platform,
      category: row.category,
      country: row.country,
      city: row.city,
      address: row.address,
      businessAge: row.business_age || {
        years: 1,
        months: 0,
        isNew: true,
        label: '✨ Newly Opened',
        badgeColor: 'emerald',
      },
      budget: row.budget,
      jobType: row.job_type,
      description: row.description,
      postedAt: row.posted_at || 'Recently',
      contact: row.contact || { hasWebsite: false },
      rating: row.rating || 5.0,
      reviewCount: row.review_count || 10,
      tags: row.tags || [],
      verified: row.verified ?? true,
      pipelineStage: row.pipeline_stage || 'new',
      status: row.status || 'new',
    }));
  } catch (err: any) {
    console.warn('Error querying Supabase:', err?.message);
    return null;
  }
}

/**
 * Upsert a single lead to Supabase
 */
export async function upsertLeadToSupabase(lead: Lead): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;

  try {
    const { error } = await client.from('leads').upsert(
      {
        id: lead.id,
        title: lead.title,
        business_name: lead.businessName,
        type: lead.type,
        platform: lead.platform,
        category: lead.category,
        country: lead.country,
        city: lead.city,
        address: lead.address,
        business_age: lead.businessAge,
        budget: lead.budget,
        job_type: lead.jobType,
        description: lead.description,
        posted_at: lead.postedAt,
        contact: lead.contact,
        rating: lead.rating,
        review_count: lead.reviewCount,
        tags: lead.tags,
        verified: lead.verified,
        pipeline_stage: lead.pipelineStage,
        status: lead.status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Failed to upsert lead to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Supabase upsert exception:', err?.message);
    return false;
  }
}

/**
 * Store an outreach email record in Supabase
 */
export async function logOutreachToSupabase(record: {
  leadId: string;
  recipientEmail: string;
  recipientName?: string;
  businessName: string;
  subject: string;
  previewUrl: string;
  provider: string;
  messageId?: string;
  status: string;
}): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;

  try {
    const { error } = await client.from('outreach_logs').insert([
      {
        lead_id: record.leadId,
        recipient_email: record.recipientEmail,
        recipient_name: record.recipientName,
        business_name: record.businessName,
        subject: record.subject,
        preview_url: record.previewUrl,
        provider: record.provider,
        message_id: record.messageId,
        status: record.status,
        sent_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Failed to log outreach to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Supabase outreach log exception:', err?.message);
    return false;
  }
}
