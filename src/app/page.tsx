'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import PortalAuthGate from '@/components/PortalAuthGate';
import LuxuryLandingPage from '@/components/public/LuxuryLandingPage';

// Navigation & Layout Components
import UnifiedSidebar, { NavViewId } from '@/components/navigation/UnifiedSidebar';
import TopNavigation from '@/components/navigation/TopNavigation';

// Core SaaS Views
import FreelancerLeadFeed from '@/components/freelancer/FreelancerLeadFeed';
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import LeadManagementView from '@/components/leads/LeadManagementView';
import DiscoverLeadsView from '@/components/discovery/DiscoverLeadsView';
import IntegrationsView from '@/components/system/IntegrationsView';
import ApiConfigurationView from '@/components/system/ApiConfigurationView';
import SyncHistoryView from '@/components/system/SyncHistoryView';
import AnalyticsView from '@/components/analytics/AnalyticsView';

// Management & Workflow Views
import LeadListsView from '@/components/lists/LeadListsView';
import SavedLeadsView from '@/components/saved/SavedLeadsView';
import OutreachCampaignsView from '@/components/sales/OutreachCampaignsView';
import ApproachedClientsView from '@/components/leads/ApproachedClientsView';
import SalesPipelineView from '@/components/sales/SalesPipelineView';
import ActivityLogsView from '@/components/analytics/ActivityLogsView';
import ExportCenterView from '@/components/analytics/ExportCenterView';
import ProfileView from '@/components/system/ProfileView';
import BusinessResearchView from '@/components/research/BusinessResearchView';
import GmbProfilesView from '@/components/research/GmbProfilesView';
import EmailVerificationView from '@/components/verification/EmailVerificationView';
import PhoneVerificationView from '@/components/verification/PhoneVerificationView';
import VerificationQueueView from '@/components/queue/VerificationQueueView';
import QualifiedLeadsView from '@/components/sales/QualifiedLeadsView';
import ClientInboxView from '@/components/ClientInboxView';
import SubscriptionPricingView from '@/components/subscription/SubscriptionPricingView';

// Modals
import CreateLeadModal from '@/components/CreateLeadModal';
import EmailOutreachModal from '@/components/EmailOutreachModal';
import DeliverablesStudioModal from '@/components/DeliverablesStudioModal';
import JobScopeAnalyzerModal from '@/components/JobScopeAnalyzerModal';
import LeadDetailModal from '@/components/leads/LeadDetailModal';

import { Lead, PipelineStage } from '@/types';
import { Sun, Moon, Palette, HelpCircle, ExternalLink, ShieldCheck, Mail, BookOpen } from 'lucide-react';

interface HomePageProps {
  initialView?: NavViewId;
}

export default function HomePage({ initialView }: HomePageProps) {
  const { isAuthenticated } = useAuth();

  if (initialView) {
    return <InternalLeadGenWorkbench initialView={initialView} />;
  }

  if (isAuthenticated === true) {
    return <InternalLeadGenWorkbench initialView="dashboard" />;
  }

  return <LuxuryLandingPage />;
}

function InternalLeadGenWorkbench({ initialView = 'dashboard' }: HomePageProps) {
  const { userName, sessionId } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshingLive, setIsRefreshingLive] = useState(false);

  // Active view across all navigation routes
  const [activeView, setActiveView] = useState<NavViewId>(initialView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Shortlist
  const [searchQuery, setSearchQuery] = useState('');
  const [savedLeadIds, setSavedLeadIds] = useState<Set<string>>(new Set());

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Modals state
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
  const [emailModalLead, setEmailModalLead] = useState<Lead | null>(null);
  const [websiteModalLead, setWebsiteModalLead] = useState<Lead | null>(null);
  const [jobScopeModalLead, setJobScopeModalLead] = useState<Lead | null>(null);
  const [inspectDetailLead, setInspectDetailLead] = useState<Lead | null>(null);

  // Theme initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem('samvero_theme') as 'light' | 'dark' | null;
      if (stored) {
        setTheme(stored);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    } catch {}
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('samvero_theme', next);
    } catch {}
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fetch leads from master database
  const fetchLeads = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshingLive(true);
    try {
      const url = forceRefresh ? '/api/leads?refresh=live' : '/api/leads';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.warn('Failed to load leads:', err);
    } finally {
      setLoading(false);
      setIsRefreshingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Load saved shortlist
  useEffect(() => {
    let isMounted = true;
    async function loadSaved() {
      try {
        const res = await fetch('/api/customer/leads');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.leads) && isMounted) {
            const ids = new Set<string>(data.leads.map((item: any) => item.leadId || item.id));
            setSavedLeadIds(ids);
          }
        }
      } catch (e) {
        console.warn('Could not load saved leads:', e);
      }
    }
    loadSaved();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save / Unsave Lead handler
  const handleToggleSaveLead = async (lead: Lead) => {
    const isCurrentlySaved = savedLeadIds.has(lead.id);
    setSavedLeadIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) next.delete(lead.id);
      else next.add(lead.id);
      return next;
    });

    try {
      if (isCurrentlySaved) {
        await fetch(`/api/customer/leads?leadId=${encodeURIComponent(lead.id)}`, {
          method: 'DELETE',
        });
      } else {
        await fetch('/api/customer/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: lead.id, leadData: lead }),
        });
      }
    } catch (err) {
      console.error('Error toggling save lead:', err);
    }
  };

  // Move stage
  const handleMoveStage = async (leadId: string, stage: PipelineStage) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, pipelineStage: stage, currentStatus: stage === 'won' ? 'Converted / Won' : stage === 'contacted' ? 'Approached' : l.currentStatus } : l))
    );
    try {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, pipelineStage: stage }),
      });
    } catch (e) {
      console.warn('Failed to update stage on server:', e);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    try {
      await fetch(`/api/leads?id=${encodeURIComponent(leadId)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete lead on server:', e);
    }
  };

  const handleArchiveLead = (leadId: string) => {
    handleDeleteLead(leadId);
  };

  // View navigation handler
  const handleSelectView = (view: NavViewId) => {
    const adminRouteMap: Record<string, string> = {
      'admin-dashboard': '/admin/dashboard',
      'user-management': '/admin/users',
      'subscription-management': '/admin/subscriptions',
      'lead-management': '/admin/leads',
      'system-settings': '/admin/settings',
    };
    if (adminRouteMap[view]) {
      window.location.href = adminRouteMap[view];
      return;
    }

    setActiveView(view);
    setMobileMenuOpen(false);

    const pathMap: Record<string, string> = {
      dashboard: '/dashboard',
      'all-leads': '/leads',
      'my-leads': '/leads?scope=mine',
      'saved-leads': '/saved',
      discover: '/discover',
      'search-companies': '/discover?type=company',
      'search-contacts': '/discover?type=contact',
      integrations: '/integrations',
      'api-config': '/api-config',
      'sync-history': '/sync-history',
      lists: '/lists',
      campaigns: '/campaigns',
      'follow-ups': '/follow-ups',
      analytics: '/analytics',
      settings: '/settings',
      profile: '/profile',
      support: '/support',
      // Legacy routes
      'hot-leads': '/hot-leads',
      'qualified-leads': '/qualified',
      'extra-leads': '/extra-leads',
      'needs-verification': '/needs-verification',
      messages: '/messages',
      outreach: '/outreach',
      reports: '/export',
      subscription: '/pricing',
      pipeline: '/pipeline',
    };

    if (typeof window !== 'undefined' && pathMap[view]) {
      window.history.pushState(null, '', pathMap[view]);
    }
  };

  // Page header titles & subtitles based on active view
  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Real-time overview of discovered leads, conversion funnel, and platform integrations health.',
    },
    'all-leads': {
      title: 'All Leads Management',
      subtitle: 'Manage and filter genuine business leads discovered across all connected engines.',
    },
    'my-leads': {
      title: 'My Assigned Leads',
      subtitle: 'Leads assigned to your workspace for direct client engagement and follow-up.',
    },
    'saved-leads': {
      title: 'Saved Lead Shortlist',
      subtitle: 'Curated prospects bookmarked for active outreach campaigns.',
    },
    discover: {
      title: 'Find New Leads',
      subtitle: 'Execute multi-source discovery across B2B platforms, physical registries, and live APIs.',
    },
    'search-companies': {
      title: 'Search Registered Companies',
      subtitle: 'Discover verified organizations, corporate legal registries, and business locations.',
    },
    'search-contacts': {
      title: 'Search Decision-Maker Contacts',
      subtitle: 'Find and verify professional contacts, direct emails, and executive phone numbers.',
    },
    integrations: {
      title: 'Connected Platforms & APIs',
      subtitle: 'Monitor connection status, test live API access, and manage rate limits.',
    },
    'api-config': {
      title: 'API Configuration & Encryption',
      subtitle: 'Configure private API keys with AES-256-GCM encryption at rest.',
    },
    'sync-history': {
      title: 'Synchronization History',
      subtitle: 'Audit trail of platform synchronization jobs, records fetched, and diagnostic logs.',
    },
    lists: {
      title: 'Lead Lists & Segments',
      subtitle: 'Organize prospective accounts into segmented lists for targeted outreach.',
    },
    campaigns: {
      title: 'Outreach Campaigns',
      subtitle: 'Plan and execute cold email, WhatsApp, and proposal delivery campaigns.',
    },
    'follow-ups': {
      title: 'Client Follow-ups & Reminders',
      subtitle: 'Track active conversations and scheduled touchpoints with approached prospects.',
    },
    analytics: {
      title: 'Pipeline & Growth Analytics',
      subtitle: 'Genuine metrics on lead acquisition performance, email verification rates, and geography.',
    },
    settings: {
      title: 'Workspace Settings',
      subtitle: 'Manage platform theme, notification preferences, and team configurations.',
    },
    profile: {
      title: 'Account Profile',
      subtitle: 'Manage your personal user details, password security, and active subscription.',
    },
    support: {
      title: 'Help & API Documentation',
      subtitle: 'Guides on connecting platforms, acquiring API keys, and maximizing lead conversion.',
    },
  };

  const currentMeta = viewTitles[activeView] || {
    title: 'Lead Generation Workbench',
    subtitle: 'Find the right leads. Build better connections.',
  };

  // Filtered leads for search
  const displayedLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase().trim();
    return leads.filter(
      (l) =>
        l.businessName?.toLowerCase().includes(q) ||
        l.title?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q) ||
        l.platform?.toLowerCase().includes(q) ||
        l.contact?.email?.toLowerCase().includes(q)
    );
  }, [leads, searchQuery]);

  // My leads: assigned to current user, bookmarked, or actively engaged in pipeline
  const myLeads = useMemo(() => {
    return displayedLeads.filter(
      (l) =>
        (userName && (l as any).assignedToUserId === userName) ||
        (sessionId && (l as any).assignedToUserId === sessionId) ||
        savedLeadIds.has(l.id) ||
        (l.currentStatus && l.currentStatus !== 'New Lead') ||
        (l.pipelineStage && l.pipelineStage !== 'new')
    );
  }, [displayedLeads, userName, sessionId, savedLeadIds]);

  const rawMyLeadsCount = useMemo(() => {
    return leads.filter(
      (l) =>
        (userName && (l as any).assignedToUserId === userName) ||
        (sessionId && (l as any).assignedToUserId === sessionId) ||
        savedLeadIds.has(l.id) ||
        (l.currentStatus && l.currentStatus !== 'New Lead') ||
        (l.pipelineStage && l.pipelineStage !== 'new')
    ).length;
  }, [leads, userName, sessionId, savedLeadIds]);

  return (
    <PortalAuthGate>
      <div className="min-h-screen bg-slate-50 dark:bg-[#090f1d] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        {/* Top SaaS Header */}
        <TopNavigation
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={() => fetchLeads(true)}
          isRefreshing={isRefreshingLive}
          onOpenNewLead={() => setCreateLeadModalOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Main Workbench Body with Sidebar & Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Reorganized Clean Sidebar */}
          <UnifiedSidebar
            activeView={activeView}
            onSelectView={handleSelectView}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            isMobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            counts={{
              totalLeads: leads.length,
              myLeadsCount: rawMyLeadsCount,
              savedCount: savedLeadIds.size,
              hotCount: leads.filter((l) => l.pipelineStage === 'hot').length,
              qualifiedCount: leads.filter((l) => (l.scoreBreakdown?.leadQualityScore ?? 0) >= 75).length,
              followupCount: leads.filter((l) => l.currentStatus === 'Follow-up Required').length,
            }}
          />

          {/* Dynamic Content Pane */}
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#090f1d] transition-colors duration-200">
            {/* 1. FREELANCER.COM-STYLE LEAD FEED (Primary View across Leads, Dashboard & Discovery) */}
            {(activeView === 'dashboard' ||
              activeView === 'all-leads' ||
              activeView === 'feed' ||
              activeView === 'hot-leads' ||
              activeView === 'qualified-leads' ||
              activeView === 'qualified' ||
              activeView === 'extra-leads' ||
              activeView === 'needs-verification' ||
              activeView === 'discover' ||
              activeView === 'search-companies' ||
              activeView === 'search-contacts') && (
              <FreelancerLeadFeed
                leads={displayedLeads}
                savedLeadIds={savedLeadIds}
                onToggleSaveLead={handleToggleSaveLead}
                onMoveStage={handleMoveStage}
                onOpenEmailModal={(l) => setEmailModalLead(l)}
                onOpenWebsiteModal={(l) => setWebsiteModalLead(l)}
                onOpenJobScopeModal={(l) => setJobScopeModalLead(l)}
                onInspectLead={(l) => setInspectDetailLead(l)}
                onOpenNewLeadModal={() => setCreateLeadModalOpen(true)}
                initialCategoryTab={
                  activeView === 'hot-leads'
                    ? 'hot'
                    : activeView === 'qualified-leads' || activeView === 'qualified'
                    ? 'qualified'
                    : activeView === 'extra-leads'
                    ? 'extra'
                    : activeView === 'needs-verification'
                    ? 'needs_verification'
                    : 'all'
                }
                initialSearchQuery={searchQuery}
                onOpenInbox={() => handleSelectView('messages')}
                inboxCount={3}
                isRefreshingLive={isRefreshingLive}
                onRefreshLiveLeads={() => fetchLeads(true)}
              />
            )}

            {activeView === 'my-leads' && (
              <FreelancerLeadFeed
                leads={myLeads}
                savedLeadIds={savedLeadIds}
                onToggleSaveLead={handleToggleSaveLead}
                onMoveStage={handleMoveStage}
                onOpenEmailModal={(l) => setEmailModalLead(l)}
                onOpenWebsiteModal={(l) => setWebsiteModalLead(l)}
                onOpenJobScopeModal={(l) => setJobScopeModalLead(l)}
                onInspectLead={(l) => setInspectDetailLead(l)}
                onOpenNewLeadModal={() => setCreateLeadModalOpen(true)}
                initialCategoryTab="all"
                initialSearchQuery={searchQuery}
                onOpenInbox={() => handleSelectView('messages')}
                inboxCount={3}
                isRefreshingLive={isRefreshingLive}
                onRefreshLiveLeads={() => fetchLeads(true)}
              />
            )}

            {/* 4. INTEGRATIONS & API MANAGEMENT */}
            {activeView === 'integrations' && <IntegrationsView />}

            {activeView === 'api-config' && <ApiConfigurationView />}

            {activeView === 'sync-history' && <SyncHistoryView />}

            {/* 5. MANAGEMENT */}
            {activeView === 'lists' && (
              <LeadListsView
                leads={displayedLeads}
                onSelectLead={(l) => setInspectDetailLead(l)}
              />
            )}

            {(activeView === 'saved-leads' || activeView === 'saved') && (
              <SavedLeadsView
                leads={displayedLeads}
                onSelectLead={(l) => setInspectDetailLead(l)}
              />
            )}

            {activeView === 'campaigns' && (
              <OutreachCampaignsView
                leads={displayedLeads}
                onOpenEmailModal={(l) => setEmailModalLead(l)}
              />
            )}

            {activeView === 'follow-ups' && (
              <ApproachedClientsView
                initialStatusFilter="Approached"
                onNavigateView={handleSelectView}
              />
            )}

            {activeView === 'analytics' && <AnalyticsView leads={displayedLeads} />}

            {/* 6. SYSTEM */}
            {activeView === 'settings' && (
              <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 font-sans">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Workspace & System Settings
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage visual theme, notifications, integrations, and session security.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#111c2e] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <Palette className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Appearance Mode</h3>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => { if (theme !== 'light') handleToggleTheme(); }}
                      className={`flex-1 p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light SaaS Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (theme !== 'dark') handleToggleTheme(); }}
                      className={`flex-1 p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        theme === 'dark' ? 'border-blue-500 bg-slate-800 text-blue-400' : 'border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark Theme</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#111c2e] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Automated Lead Generation Engine</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Backend discovery pipelines operate continuously across global registries, open POI networks, and public feeds with zero manual setup.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold">
                      Automated & Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'profile' && <ProfileView />}

            {activeView === 'support' && (
              <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 font-sans">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span>SAMVERO Help & Documentation</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Guidance on getting started, connecting official APIs, and running outreach campaigns.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>1. Getting Free API Credentials</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Hunter.io gives 25 free domain searches per month. SerpApi provides 100 free Google searches. Yelp Fusion gives 500 daily requests. OpenStreetMap, Wikidata, and GitHub are 100% free with no credit card required.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>2. Strict Real-Data Guarantee</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Samvero enforces an absolute zero-fake-data policy. When a prospect or business has no public phone or email on file, it is marked as unavailable rather than hallucinated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Backwards-compatible views */}
            {activeView === 'subscription' && <SubscriptionPricingView />}
            {(activeView === 'pipeline' || activeView === 'kanban') && (
              <SalesPipelineView
                leads={displayedLeads}
                onUpdateLeadStage={handleMoveStage}
                onSelectLead={(l) => setInspectDetailLead(l)}
              />
            )}
            {activeView === 'research' && <BusinessResearchView />}
            {activeView === 'gmb' && <GmbProfilesView leads={displayedLeads} onSelectLead={(l) => setInspectDetailLead(l)} />}
            {activeView === 'verify-email' && <EmailVerificationView />}
            {activeView === 'verify-phone' && <PhoneVerificationView />}
            {activeView === 'queue' && <VerificationQueueView leads={displayedLeads} jobs={[]} onRefreshJobs={() => fetchLeads(true)} onUpdateLead={() => {}} />}
            {activeView === 'qualified' && <QualifiedLeadsView leads={displayedLeads} onOpenEmailModal={(l) => setEmailModalLead(l)} onSelectLead={(l) => setInspectDetailLead(l)} />}
            {(activeView === 'messages' || activeView === 'responses' || activeView === 'inbox') && (
              <ClientInboxView onOpenWebsitePreview={(url) => window.open(url, '_blank')} />
            )}
            {(activeView === 'activity-logs' || activeView === 'audit') && <ActivityLogsView leads={displayedLeads} />}
            {(activeView === 'reports' || activeView === 'export') && <ExportCenterView leads={displayedLeads} />}
          </main>
        </div>

        {/* Global Modals */}
        {createLeadModalOpen && (
          <CreateLeadModal
            isOpen={createLeadModalOpen}
            onClose={() => setCreateLeadModalOpen(false)}
            onAddLead={(newLead) => {
              setLeads((prev) => [newLead, ...prev]);
              setCreateLeadModalOpen(false);
            }}
          />
        )}

        {emailModalLead && (
          <EmailOutreachModal
            isOpen={Boolean(emailModalLead)}
            onClose={() => setEmailModalLead(null)}
            lead={emailModalLead}
            onEmailSent={() => {
              handleMoveStage(emailModalLead.id, 'contacted');
              setEmailModalLead(null);
            }}
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
            onUpdateLeadStatus={(leadId, status) => {
              setLeads((prev) =>
                prev.map((l) => (l.id === leadId ? { ...l, currentStatus: status as any } : l))
              );
            }}
            onOpenEmailModal={(l) => {
              setInspectDetailLead(null);
              setEmailModalLead(l);
            }}
          />
        )}
      </div>
    </PortalAuthGate>
  );
}
