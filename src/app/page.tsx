'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FreelancerNavbar from '@/components/freelancer/FreelancerNavbar';
import FreelancerSubNav from '@/components/freelancer/FreelancerSubNav';
import FreelancerFiltersSidebar from '@/components/freelancer/FreelancerFiltersSidebar';
import FreelancerJobCard from '@/components/freelancer/FreelancerJobCard';
import FreelancerRightPanel from '@/components/freelancer/FreelancerRightPanel';

import KanbanBoard from '@/components/KanbanBoard';
import FunnelAnalytics from '@/components/FunnelAnalytics';
import GmbExplorer from '@/components/GmbExplorer';
import ClientInboxView from '@/components/ClientInboxView';
import DeliverablesStudioModal from '@/components/DeliverablesStudioModal';
import EmailOutreachModal from '@/components/EmailOutreachModal';
import ApiSettingsModal from '@/components/ApiSettingsModal';
import CreateLeadModal from '@/components/CreateLeadModal';
import JobScopeAnalyzerModal from '@/components/JobScopeAnalyzerModal';
import PortalAuthGate from '@/components/PortalAuthGate';
import AdminAuditDashboard from '@/components/AdminAuditDashboard';

// Enterprise Real-Data SaaS Views
import UnifiedSidebar, { NavViewId } from '@/components/navigation/UnifiedSidebar';
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import LeadManagementView from '@/components/leads/LeadManagementView';
import DiscoverLeadsView from '@/components/discovery/DiscoverLeadsView';
import LeadListsView from '@/components/lists/LeadListsView';
import SavedLeadsView from '@/components/saved/SavedLeadsView';
import BusinessResearchView from '@/components/research/BusinessResearchView';
import GmbProfilesView from '@/components/research/GmbProfilesView';
import EmailVerificationView from '@/components/verification/EmailVerificationView';
import PhoneVerificationView from '@/components/verification/PhoneVerificationView';
import VerificationQueueView from '@/components/queue/VerificationQueueView';
import QualifiedLeadsView from '@/components/sales/QualifiedLeadsView';
import OutreachCampaignsView from '@/components/sales/OutreachCampaignsView';
import SalesPipelineView from '@/components/sales/SalesPipelineView';
import ActivityLogsView from '@/components/analytics/ActivityLogsView';
import ExportCenterView from '@/components/analytics/ExportCenterView';
import IntegrationsView from '@/components/system/IntegrationsView';
import ApiConfigurationView from '@/components/system/ApiConfigurationView';
import ProfileView from '@/components/system/ProfileView';

import { Lead, LeadNotification, PipelineStage } from '@/types';
import { playLuxuryChime } from '@/lib/sound-chime';
import { Briefcase, Sparkles, Flame, Plus, Layers, Filter, RotateCcw, LayoutGrid, Table } from 'lucide-react';
import LuxuryLandingPage from '@/components/public/LuxuryLandingPage';

interface HomePageProps {
  initialView?: NavViewId;
}

export default function HomePage({ initialView }: HomePageProps) {
  if (!initialView) {
    return <LuxuryLandingPage />;
  }
  return <InternalLeadGenWorkbench initialView={initialView} />;
}

function InternalLeadGenWorkbench({ initialView = 'dashboard' }: HomePageProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view across all 20 modules
  const [activeView, setActiveView] = useState<NavViewId>(initialView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Feed display style (when on all-leads): 'table' | 'cards'
  const [feedStyle, setFeedStyle] = useState<'table' | 'cards'>('table');

  // Filters state
  const [selectedPipelineFilter, setSelectedPipelineFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [businessAgeFilter, setBusinessAgeFilter] = useState('all');
  const [hasWebsiteFilter, setHasWebsiteFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Specific Platform & Discipline Filters
  const [platformFilter, setPlatformFilter] = useState('all');
  const [disciplineFilter, setDisciplineFilter] = useState('all');

  // Inbox & Theme state
  const [inboxUnreadCount, setInboxUnreadCount] = useState(3);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Live Timer & Ingestion Telemetry
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isStreaming, setIsStreaming] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [latestLead, setLatestLead] = useState<Lead | null>(null);
  const [notifications, setNotifications] = useState<LeadNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modals state
  const [selectedLeadForWebsite, setSelectedLeadForWebsite] = useState<Lead | null>(null);
  const [websiteModalOpen, setWebsiteModalOpen] = useState(false);

  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<Lead | null>(null);
  const [emailModalPreviewUrl, setEmailModalPreviewUrl] = useState<string | undefined>(undefined);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);

  // Job Scope & Brief Analyzer Modal State
  const [selectedLeadForJobScope, setSelectedLeadForJobScope] = useState<Lead | null>(null);
  const [jobScopeModalOpen, setJobScopeModalOpen] = useState(false);

  const handleOpenJobScopeModal = (lead: Lead) => {
    setSelectedLeadForJobScope(lead);
    setJobScopeModalOpen(true);
  };

  const [isRefreshingLive, setIsRefreshingLive] = useState(false);

  // Fetch initial leads from real database endpoint
  const fetchInitialLeads = useCallback(async (forceLive = false) => {
    try {
      if (forceLive) {
        setIsRefreshingLive(true);
      } else {
        setLoading(true);
      }
      const url = forceLive ? '/api/leads?refresh=live' : '/api/leads';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        // REAL-DATA RULE: Preserve true pipelineStage without fake modulo assignment
        const enriched: Lead[] = data.leads.map((l: Lead) => ({
          ...l,
          pipelineStage: l.pipelineStage || (!l.contact?.hasWebsite ? 'hot' : 'new'),
        }));
        setLeads(enriched);
        if (enriched.length > 0) {
          setLatestLead(enriched[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching leads:', e);
    } finally {
      setLoading(false);
      setIsRefreshingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialLeads();
  }, [fetchInitialLeads]);

  // Live Timer: Polling live lead buffer without hallucinating fake businesses
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Check for genuine incoming updates
          fetchInitialLeads(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming, fetchInitialLeads]);

  // Handle stage change
  const handleMoveStage = (leadId: string, nextStage: PipelineStage) => {
    setLeads((currentLeads) =>
      currentLeads.map((l) => (l.id === leadId ? { ...l, pipelineStage: nextStage } : l))
    );
  };

  // Handle lead deletion
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  // Handle lead archiving
  const handleArchiveLead = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, isArchived: true, pipelineStage: 'archived' } : l))
    );
  };

  // Handle adding custom lead
  const handleAddCustomLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    setLatestLead(newLead);
    try {
      localStorage.setItem('samvero_active_leads', JSON.stringify([newLead, ...leads]));
    } catch (e) {}
  };

  // Sync leads cache to localStorage
  useEffect(() => {
    if (leads.length > 0) {
      try {
        localStorage.setItem('samvero_active_leads', JSON.stringify(leads));
      } catch (e) {}
    }
  }, [leads]);

  // Modals helpers
  const handleOpenWebsiteModal = (lead: Lead) => {
    setSelectedLeadForWebsite(lead);
    setWebsiteModalOpen(true);
  };

  const handleOpenEmailModal = (lead: Lead, previewUrl?: string) => {
    setSelectedLeadForEmail(lead);
    setEmailModalPreviewUrl(previewUrl);
    setEmailModalOpen(true);
  };

  // Filter leads for classic feed
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (l.isArchived) return false;

      // Country filter
      if (selectedCountry !== 'all' && l.country.toLowerCase() !== selectedCountry.toLowerCase()) {
        return false;
      }

      // Pipeline Sub-filter
      if (selectedPipelineFilter === 'new_gmb' && !l.businessAge?.isNew) {
        return false;
      }
      if (selectedPipelineFilter === 'no_website' && l.contact?.hasWebsite) {
        return false;
      }
      if (selectedPipelineFilter === 'pitched' && l.pipelineStage !== 'pending' && l.pipelineStage !== 'contacted') {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && !l.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
        return false;
      }

      // Platform filter
      if (platformFilter !== 'all' && !l.platform.toLowerCase().includes(platformFilter.toLowerCase())) {
        return false;
      }

      // Business age filter
      if (businessAgeFilter !== 'all') {
        const years = l.businessAge?.years ?? 0;
        if (businessAgeFilter === 'new' && !l.businessAge?.isNew) return false;
        if (businessAgeFilter === '1-3' && (years < 1 || years > 3)) return false;
        if (businessAgeFilter === '3-5' && (years <= 3 || years > 5)) return false;
        if (businessAgeFilter === '5+' && years <= 5) return false;
      }

      // Has website filter
      if (hasWebsiteFilter === 'no-site' && l.contact?.hasWebsite) return false;
      if (hasWebsiteFilter === 'has-site' && !l.contact?.hasWebsite) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          l.title.toLowerCase().includes(q) ||
          l.businessName.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [leads, selectedCountry, selectedPipelineFilter, categoryFilter, platformFilter, businessAgeFilter, hasWebsiteFilter, searchQuery]);

  // Derived counts
  const totalLeads = leads.length;
  const newBusinesses = leads.filter((l) => l.businessAge?.isNew).length;
  const noWebsiteCount = leads.filter((l) => !l.contact?.hasWebsite).length;
  const pitchedCount = leads.filter((l) => l.pipelineStage === 'contacted' || l.pipelineStage === 'pending').length;
  const qualifiedCount = leads.filter((l) => (l.scoreBreakdown?.leadQualityScore || 75) >= 75).length;

  // View navigation router
  const handleSelectView = (view: NavViewId) => {
    setActiveView(view);
    // Smooth URL path sync without reload
    const pathMap: Record<NavViewId, string> = {
      dashboard: '/dashboard',
      'all-leads': '/leads',
      discover: '/discover',
      lists: '/lists',
      saved: '/saved',
      research: '/research',
      gmb: '/gmb',
      'verify-email': '/verify-email',
      'verify-phone': '/verify-phone',
      queue: '/queue',
      qualified: '/qualified',
      campaigns: '/campaigns',
      responses: '/responses',
      pipeline: '/pipeline',
      analytics: '/analytics',
      'activity-logs': '/activity-logs',
      export: '/export',
      integrations: '/integrations',
      'api-config': '/api-config',
      settings: '/settings',
      profile: '/profile',
      feed: '/leads',
      kanban: '/pipeline',
      inbox: '/responses',
      audit: '/activity-logs',
    };
    if (typeof window !== 'undefined' && pathMap[view]) {
      window.history.pushState(null, '', pathMap[view]);
    }
  };

  return (
    <PortalAuthGate>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1528] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        
        {/* Top Navbar */}
        <FreelancerNavbar
          notifications={notifications}
          unreadCount={unreadCount}
          onClearNotifications={() => setUnreadCount(0)}
          secondsLeft={secondsLeft}
          isStreaming={isStreaming}
          onToggleStreaming={() => setIsStreaming(!isStreaming)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onOpenNewLeadModal={() => setCreateLeadModalOpen(true)}
          totalLeadsCount={totalLeads}
          onOpenInbox={() => handleSelectView('responses')}
          inboxUnreadCount={inboxUnreadCount}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          activeView={activeView as any}
          setActiveView={handleSelectView as any}
          onSearch={(q) => setSearchQuery(q)}
          searchQuery={searchQuery}
          onRefreshLiveLeads={() => fetchInitialLeads(true)}
          isRefreshingLive={isRefreshingLive}
        />

        {/* Platform Body with Responsive Sidebar & Dynamic Views */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Complete 20-Route Unified Sidebar Navigation */}
          <UnifiedSidebar
            activeView={activeView}
            onSelectView={handleSelectView}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            counts={{
              totalLeads,
              queueCount: 3,
              unreadResponses: inboxUnreadCount,
              qualifiedCount,
            }}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0b1320] transition-colors duration-200">
            
            {/* VIEW 1: Executive Dashboard (Phase 10) */}
            {activeView === 'dashboard' && (
              <ExecutiveDashboard
                leads={leads}
                onSelectLead={(l) => {
                  setSelectedLeadForJobScope(l);
                  setJobScopeModalOpen(true);
                }}
                onNavigateToView={handleSelectView}
              />
            )}

            {/* VIEW 2: All Leads Management (Phase 12) */}
            {(activeView === 'all-leads' || activeView === 'feed') && (
              <div className="space-y-4">
                {/* View Mode Toggle: Enterprise Table vs Classic Freelancer 3-Column */}
                <div className="px-6 lg:px-8 pt-4 flex items-center justify-end gap-2 text-xs font-bold">
                  <span className="text-slate-400">View Style:</span>
                  <button
                    onClick={() => setFeedStyle('table')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                      feedStyle === 'table'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Table View</span>
                  </button>
                  <button
                    onClick={() => setFeedStyle('cards')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                      feedStyle === 'cards'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards Feed</span>
                  </button>
                </div>

                {feedStyle === 'table' ? (
                  <LeadManagementView
                    leads={leads}
                    onUpdateLeadStage={handleMoveStage}
                    onDeleteLead={handleDeleteLead}
                    onArchiveLead={handleArchiveLead}
                    onResearchLead={(l) => handleSelectView('research')}
                    onOpenWebsiteModal={handleOpenWebsiteModal}
                    onOpenEmailModal={handleOpenEmailModal}
                  />
                ) : (
                  <div className="flex-1 flex max-w-[1600px] mx-auto px-4 sm:px-6 py-4 gap-6">
                    <FreelancerFiltersSidebar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      selectedCountry={selectedCountry}
                      onCountryChange={setSelectedCountry}
                      categoryFilter={categoryFilter}
                      onCategoryChange={setCategoryFilter}
                      businessAgeFilter={businessAgeFilter}
                      onBusinessAgeChange={setBusinessAgeFilter}
                      hasWebsiteFilter={hasWebsiteFilter}
                      onHasWebsiteChange={setHasWebsiteFilter}
                      totalFilteredCount={filteredLeads.length}
                      onResetFilters={() => {
                        setSelectedCountry('all');
                        setCategoryFilter('all');
                        setBusinessAgeFilter('all');
                        setHasWebsiteFilter('all');
                        setSearchQuery('');
                      }}
                    />

                    <div className="flex-1 space-y-4">
                      {filteredLeads.map((lead) => (
                        <FreelancerJobCard
                          key={lead.id}
                          lead={lead}
                          onOpenWebsiteModal={handleOpenWebsiteModal}
                          onOpenEmailModal={(l) => handleOpenEmailModal(l)}
                          onInspect={(l) => handleOpenJobScopeModal(l)}
                          onInspectJobScope={handleOpenJobScopeModal}
                        />
                      ))}
                    </div>

                    <FreelancerRightPanel
                      secondsLeft={secondsLeft}
                      isStreaming={isStreaming}
                      onToggleStreaming={() => setIsStreaming(!isStreaming)}
                      soundEnabled={soundEnabled}
                      onToggleSound={() => setSoundEnabled(!soundEnabled)}
                      latestLead={latestLead}
                      onOpenInbox={() => handleSelectView('responses')}
                      inboxUnreadCount={inboxUnreadCount}
                      onInspectLead={handleOpenWebsiteModal}
                      totalLeadsCount={totalLeads}
                      noWebsiteCount={noWebsiteCount}
                      newGmbCount={newBusinesses}
                      onSelectTag={(tag) => setSearchQuery(tag)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: Discover Real Leads (Phase 3) */}
            {activeView === 'discover' && (
              <DiscoverLeadsView
                onImportLead={(l) => handleAddCustomLead(l)}
                savedLeadIds={new Set(leads.map((l) => l.id))}
              />
            )}

            {/* VIEW 4: Lead Lists (Phase 12) */}
            {activeView === 'lists' && (
              <LeadListsView
                leads={leads}
                onSelectLead={(l) => handleOpenJobScopeModal(l)}
              />
            )}

            {/* VIEW 5: Saved Leads */}
            {activeView === 'saved' && (
              <SavedLeadsView
                leads={leads}
                onSelectLead={(l) => handleOpenJobScopeModal(l)}
              />
            )}

            {/* VIEW 6: Business Research & Identity Resolution (Phase 4, 5, 6) */}
            {activeView === 'research' && <BusinessResearchView />}

            {/* VIEW 7: Google Business Profiles Radar (Phase 5) */}
            {activeView === 'gmb' && (
              <GmbProfilesView
                leads={leads}
                onSelectLead={(l) => handleOpenJobScopeModal(l)}
              />
            )}

            {/* VIEW 8: Email Verification Tool (Phase 8) */}
            {activeView === 'verify-email' && <EmailVerificationView />}

            {/* VIEW 9: Phone Verification Tool (Phase 8) */}
            {activeView === 'verify-phone' && <PhoneVerificationView />}

            {/* VIEW 10: Background Research Queue (Phase 16) */}
            {activeView === 'queue' && (
              <VerificationQueueView
                leads={leads}
                jobs={[]}
                onRefreshJobs={() => fetchInitialLeads(true)}
                onUpdateLead={(updated) => {
                  setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
                }}
              />
            )}

            {/* VIEW 11: Qualified Leads (Phase 12) */}
            {activeView === 'qualified' && (
              <QualifiedLeadsView
                leads={leads}
                onOpenEmailModal={handleOpenEmailModal}
                onSelectLead={(l) => handleOpenJobScopeModal(l)}
              />
            )}

            {/* VIEW 12: Outreach Campaigns */}
            {activeView === 'campaigns' && (
              <OutreachCampaignsView
                leads={leads}
                onOpenEmailModal={handleOpenEmailModal}
              />
            )}

            {/* VIEW 13: Client Responses & Inbound Inbox */}
            {(activeView === 'responses' || activeView === 'inbox') && (
              <ClientInboxView
                onOpenWebsitePreview={(previewUrl) => window.open(previewUrl, '_blank')}
                onClientReplyReceived={(clientName, snippet) => {
                  const notif: LeadNotification = {
                    id: `notif-reply-${Date.now()}`,
                    title: `💬 New Client Reply from ${clientName}`,
                    businessName: clientName,
                    location: snippet,
                    timestamp: new Date().toLocaleTimeString(),
                    timeAgo: 'Just now',
                    leadId: '',
                    type: 'client_reply',
                    read: false,
                  };
                  setNotifications((prev) => [notif, ...prev]);
                  setUnreadCount((c) => c + 1);
                  setInboxUnreadCount((c) => c + 1);
                  if (soundEnabled) playLuxuryChime();
                }}
              />
            )}

            {/* VIEW 14: Sales Pipeline Kanban Board (Phase 15) */}
            {(activeView === 'pipeline' || activeView === 'kanban') && (
              <SalesPipelineView
                leads={leads}
                onUpdateLeadStage={handleMoveStage}
                onSelectLead={(l) => handleOpenJobScopeModal(l)}
              />
            )}

            {/* VIEW 15: Analytics & Funnel (Phase 10) */}
            {activeView === 'analytics' && (
              <FunnelAnalytics
                totalLeads={totalLeads}
                noWebsiteCount={noWebsiteCount}
                newBusinesses={newBusinesses}
                pitchedCount={pitchedCount}
              />
            )}

            {/* VIEW 16: Activity Logs & Audit Trail */}
            {(activeView === 'activity-logs' || activeView === 'audit') && (
              <ActivityLogsView leads={leads} />
            )}

            {/* VIEW 17: Export Center */}
            {activeView === 'export' && <ExportCenterView leads={leads} />}

            {/* VIEW 18: Centralized Integrations Hub (Phase 17) */}
            {activeView === 'integrations' && <IntegrationsView />}

            {/* VIEW 19: API Configuration & Secrets (Phase 17) */}
            {activeView === 'api-config' && <ApiConfigurationView />}

            {/* VIEW 20: Settings View */}
            {activeView === 'settings' && (
              <div className="p-8 max-w-xl mx-auto">
                <button
                  onClick={() => setSettingsModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xs"
                >
                  Open Full API Settings & Quotas Modal
                </button>
              </div>
            )}

            {/* VIEW 21: Operator Profile View */}
            {activeView === 'profile' && <ProfileView />}

          </main>
        </div>

        {/* Global Modals */}
        <JobScopeAnalyzerModal
          lead={selectedLeadForJobScope}
          isOpen={jobScopeModalOpen}
          onClose={() => setJobScopeModalOpen(false)}
          onOpenDeliverablesStudio={(lead) => handleOpenWebsiteModal(lead)}
          onOpenEmailPitch={(lead, previewUrl) => handleOpenEmailModal(lead, previewUrl)}
        />

        <DeliverablesStudioModal
          lead={selectedLeadForWebsite}
          isOpen={websiteModalOpen}
          onClose={() => setWebsiteModalOpen(false)}
          onDispatchOutreach={(lead, deliverableType, previewUrl) => handleOpenEmailModal(lead, previewUrl)}
        />

        <EmailOutreachModal
          lead={selectedLeadForEmail}
          previewUrl={emailModalPreviewUrl}
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
        />

        <ApiSettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />

        <CreateLeadModal
          isOpen={createLeadModalOpen}
          onClose={() => setCreateLeadModalOpen(false)}
          onAddLead={handleAddCustomLead}
        />

      </div>
    </PortalAuthGate>
  );
}
