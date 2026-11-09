'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { CustomerLeadRecord } from '@/lib/saas-store';
import { Lead } from '@/types';
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import FreelancerLeadFeed from '@/components/freelancer/FreelancerLeadFeed';
import LeadDetailModal from '@/components/leads/LeadDetailModal';
import EmailOutreachModal from '@/components/EmailOutreachModal';
import DeliverablesStudioModal from '@/components/DeliverablesStudioModal';
import JobScopeAnalyzerModal from '@/components/JobScopeAnalyzerModal';

export default function CustomerLeadsPage() {
  const [savedLeads, setSavedLeads] = useState<CustomerLeadRecord[]>([]);
  const [liveLeads, setLiveLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [inspectDetailLead, setInspectDetailLead] = useState<Lead | null>(null);
  const [emailModalLead, setEmailModalLead] = useState<Lead | null>(null);
  const [websiteModalLead, setWebsiteModalLead] = useState<Lead | null>(null);
  const [jobScopeModalLead, setJobScopeModalLead] = useState<Lead | null>(null);

  // Fetch saved customer leads
  const fetchSavedLeads = () => {
    fetch('/api/customer/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          setSavedLeads(data.leads);
        }
      })
      .catch((err) => console.warn(err));
  };

  // Fetch live available leads
  const fetchLiveLeads = () => {
    setLoading(true);
    fetch('/api/leads?refresh=live')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          setLiveLeads(data.leads);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSavedLeads();
    fetchLiveLeads();
    // Automatically poll real-time platforms every 40 seconds
    const interval = setInterval(() => {
      fetchLiveLeads();
    }, 40000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveToWorkspace = async (lead: Lead) => {
    setSavingLeadId(lead.id);
    try {
      const res = await fetch('/api/customer/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, leadData: lead }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(`Lead "${lead.businessName}" saved to your workspace!`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
        fetchSavedLeads();
      } else {
        alert(data.error || 'Failed to save lead');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving lead');
    } finally {
      setSavingLeadId(null);
    }
  };

  const savedLeadIdSet = new Set(savedLeads.map((s) => s.leadId || s.id));

  return (
    <CustomerLayout
      title="Enterprise Leads & Opportunities"
      subtitle="Full unrestricted access to real verified leads across Upwork, Fiverr, Google Maps, Contra, LinkedIn, Remote OK, Reddit, and Pakistan markets."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Enterprise Entitlement Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0e192e] to-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Enterprise Client Active Plan
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  60,000 Leads Quota
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  70+ Real Sources
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Full Unrestricted Multi-Channel Access Enabled
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Main Workbench</span>
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Rich Freelancer.com-style Lead Feed */}
        <FreelancerLeadFeed
          leads={liveLeads}
          savedLeadIds={savedLeadIdSet}
          onToggleSaveLead={handleSaveToWorkspace}
          onOpenEmailModal={(lead) => setEmailModalLead(lead)}
          onOpenWebsiteModal={(lead) => setWebsiteModalLead(lead)}
          onOpenJobScopeModal={(lead) => setJobScopeModalLead(lead)}
          onInspectLead={(lead) => setInspectDetailLead(lead)}
          initialCategoryTab="all"
          isLoading={loading}
          isRefreshingLive={loading}
          onRefreshLiveLeads={() => {
            fetchSavedLeads();
            fetchLiveLeads();
          }}
          showRightPanel={true}
        />

        {/* Modals */}
        {emailModalLead && (
          <EmailOutreachModal
            isOpen={Boolean(emailModalLead)}
            onClose={() => setEmailModalLead(null)}
            lead={emailModalLead}
          />
        )}

        {websiteModalLead && (
          <DeliverablesStudioModal
            isOpen={Boolean(websiteModalLead)}
            onClose={() => setWebsiteModalLead(null)}
            lead={websiteModalLead}
            onDispatchOutreach={(lead) => {
              setWebsiteModalLead(null);
              setEmailModalLead(lead);
            }}
          />
        )}

        {jobScopeModalLead && (
          <JobScopeAnalyzerModal
            isOpen={Boolean(jobScopeModalLead)}
            onClose={() => setJobScopeModalLead(null)}
            lead={jobScopeModalLead}
            onOpenDeliverablesStudio={(lead) => {
              setJobScopeModalLead(null);
              setWebsiteModalLead(lead);
            }}
            onOpenEmailPitch={(lead) => {
              setJobScopeModalLead(null);
              setEmailModalLead(lead);
            }}
          />
        )}

        {inspectDetailLead && (
          <LeadDetailModal
            isOpen={Boolean(inspectDetailLead)}
            onClose={() => setInspectDetailLead(null)}
            lead={inspectDetailLead}
            onOpenEmailModal={(l) => {
              setInspectDetailLead(null);
              setEmailModalLead(l);
            }}
          />
        )}
      </div>
    </CustomerLayout>
  );
}
