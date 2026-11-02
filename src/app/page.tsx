'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FreelancerNavbar from '@/components/freelancer/FreelancerNavbar';
import FreelancerSubNav, { LeadCategoryTab } from '@/components/freelancer/FreelancerSubNav';
import FreelancerFiltersSidebar from '@/components/freelancer/FreelancerFiltersSidebar';
import FreelancerJobCard from '@/components/freelancer/FreelancerJobCard';
import FreelancerRightPanel from '@/components/freelancer/FreelancerRightPanel';
import SubscriptionPricingView from '@/components/subscription/SubscriptionPricingView';
import { useAuth } from '@/lib/auth-context';

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

import ApproachedClientsView from '@/components/leads/ApproachedClientsView';
import EmailTemplatesView from '@/components/templates/EmailTemplatesView';
import LeadDetailModal from '@/components/leads/LeadDetailModal';
import { matchLeadCategory } from '@/lib/lead-workspace-store';

import { Lead, LeadNotification, PipelineStage } from '@/types';
import { playLuxuryChime } from '@/lib/sound-chime';
import { Briefcase, Sparkles, Flame, Plus, Layers, Filter, RotateCcw, LayoutGrid, Table, Bookmark, Sun, Moon, Volume2, VolumeX, ShieldCheck, Key, Palette, CheckCircle2 } from 'lucide-react';
import LuxuryLandingPage from '@/components/public/LuxuryLandingPage';

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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view across all 20 modules
  const [activeView, setActiveView] = useState<NavViewId>(initialView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Feed display style (when on all-leads): 'table' | 'cards' (Default to rich Freelancer cards!)
  const [feedStyle, setFeedStyle] = useState<'table' | 'cards'>('cards');

  // Category Tab state for Freelancer SubNav
  const [activeCategoryTab, setActiveCategoryTab] = useState<LeadCategoryTab>('all');
  const [savedLeadIds, setSavedLeadIds] = useState<Set<string>>(new Set());

  // Filters state
  const [selectedPipelineFilter, setSelectedPipelineFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [businessAgeFilter, setBusinessAgeFilter] = useState('all');
  const [hasWebsiteFilter, setHasWebsiteFilter] = useState('all');
  const [hasEmailFilter, setHasEmailFilter] = useState('all');
  const [hasPhoneFilter, setHasPhoneFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Specific Platform & Discipline Filters
  const [platformFilter, setPlatformFilter] = useState('all');
  const [disciplineFilter, setDisciplineFilter] = useState('all');

  // Inbox & Theme state
  const [inboxUnreadCount, setInboxUnreadCount] = useState(3);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samvero_theme') as 'light' | 'dark' | null;
      if (stored) {
        setTheme(stored);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    } catch (e) {}
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('samvero_theme', next);
    } catch (e) {}
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

  // 9-Section Lead Detail Modal State
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenLeadDetail = (lead: Lead) => {
    setSelectedLeadForDetail(lead);
    setDetailModalOpen(true);
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

  // Sync initialView to activeCategoryTab
  useEffect(() => {
    if (initialView === 'hot-leads') setActiveCategoryTab('hot');
    else if (initialView === 'qualified-leads' || initialView === 'qualified') setActiveCategoryTab('qualified');
    else if (initialView === 'extra-leads') setActiveCategoryTab('extra');
    else if (initialView === 'needs-verification') setActiveCategoryTab('needs_verification');
    else if (initialView === 'saved-leads' || initialView === 'saved') setActiveCategoryTab('saved');
    else setActiveCategoryTab('all');
  }, [initialView]);

  // Load saved leads for authenticated user from /api/customer/leads
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

  // Save / Unsave Lead handler (Atomic sync with /api/customer/leads)
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
        const res = await fetch(`/api/customer/leads?leadId=${encodeURIComponent(lead.id)}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          setSavedLeadIds((prev) => new Set(prev).add(lead.id));
        }
      } else {
        const res = await fetch('/api/customer/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: lead.id, leadData: lead }),
        });
        const data = await res.json();
        if (!data.success) {
          setSavedLeadIds((prev) => {
            const next = new Set(prev);
            next.delete(lead.id);
            return next;
          });
          if (data.quotaExceeded) {
            alert(data.error || 'Lead save quota limit reached for your plan. Please upgrade your subscription.');
          }
        }
      }
    } catch (err) {
      console.error('Error toggling save lead:', err);
    }
  };

  // Filter leads for classic feed
  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        if (l.isArchived) return false;

        // Category tab filter (Requirement 1 & 7)
        if (activeCategoryTab === 'hot') {
          const isHot = l.pipelineStage === 'hot' || !l.contact?.hasWebsite || (l.scoreBreakdown?.leadQualityScore || 0) >= 85;
          if (!isHot) return false;
        } else if (activeCategoryTab === 'qualified') {
          const isQualified = (l.scoreBreakdown?.leadQualityScore || 0) >= 75 || l.pipelineStage === 'qualified';
          if (!isQualified) return false;
        } else if (activeCategoryTab === 'extra') {
          const isExtra = ['Bark', 'Freelancer.com', 'Contra', 'PeoplePerHour', 'Guru', 'Truelancer', 'Workana', 'DesignCrowd', 'Malt'].includes(l.platform);
          if (!isExtra) return false;
        } else if (activeCategoryTab === 'needs_verification') {
          const needsVerif = !l.verified || l.contact?.emailStatus === 'UNVERIFIED' || l.contact?.emailStatus === 'UNKNOWN' || l.researchStatus === 'NEEDS_REVIEW' || l.contact?.phoneStatus === 'UNVERIFIED';
          if (!needsVerif) return false;
        } else if (activeCategoryTab === 'saved') {
          if (!savedLeadIds.has(l.id) && !l.isSaved) return false;
        }

        // Country filter
        if (selectedCountry !== 'all' && l.country.toLowerCase() !== selectedCountry.toLowerCase()) {
          return false;
        }

        // City filter
        if (selectedCity && selectedCity.trim() !== '' && !l.city.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }

        // Platform filter
        if (platformFilter !== 'all' && !l.platform.toLowerCase().includes(platformFilter.toLowerCase())) {
          return false;
        }

        // Pipeline Sub-filter
        if (selectedPipelineFilter === 'new_gmb' && !l.businessAge?.isNew) {
          return false;
        }
        if (selectedPipelineFilter === 'no_website' && l.contact?.hasWebsite) {
          return false;
        }
        if (selectedPipelineFilter === 'pitched' && l.pipelineStage !== 'pending' && l.pipelineStage !== 'contacted' && l.currentStatus !== 'Approached') {
          return false;
        }

        // Category filter (normalized for hyphens, punctuation, and industry aliases)
        if (categoryFilter !== 'all') {
          if (!matchLeadCategory(categoryFilter, l.category, l.tags)) {
            return false;
          }
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
        if ((hasWebsiteFilter === 'no-site' || hasWebsiteFilter === 'no_website') && l.contact?.hasWebsite) return false;
        if ((hasWebsiteFilter === 'has-site' || hasWebsiteFilter === 'has_website') && !l.contact?.hasWebsite) return false;

        // Has Email filter (supports hyphen or underscore)
        if ((hasEmailFilter === 'has-email' || hasEmailFilter === 'has_email') && !l.contact?.email) return false;
        if ((hasEmailFilter === 'no-email' || hasEmailFilter === 'no_email') && l.contact?.email) return false;

        // Has Phone filter (supports hyphen or underscore)
        if ((hasPhoneFilter === 'has-phone' || hasPhoneFilter === 'has_phone') && !l.contact?.phone) return false;
        if ((hasPhoneFilter === 'no-phone' || hasPhoneFilter === 'no_phone') && l.contact?.phone) return false;

        // Quality score filter
        if (qualityFilter !== 'all') {
          const qScore = l.scoreBreakdown?.leadQualityScore || 70;
          if ((qualityFilter === '90+' || qualityFilter === 'top') && qScore < 90) return false;
          if ((qualityFilter === '80+' || qualityFilter === 'high') && qScore < 80) return false;
          if ((qualityFilter === '70+' || qualityFilter === 'medium') && qScore < 70) return false;
        }

        // Verification status filter
        if (verificationFilter === 'verified' && !l.verified) return false;
        if (verificationFilter === 'unverified' && l.verified) return false;

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
      })
      .sort((a, b) => {
        if (sortBy === 'quality_desc') {
          return (b.scoreBreakdown?.leadQualityScore || 0) - (a.scoreBreakdown?.leadQualityScore || 0);
        }
        if (sortBy === 'budget_desc') {
          return (b.budget || '').localeCompare(a.budget || '');
        }
        if (sortBy === 'budget_asc') {
          return (a.budget || '').localeCompare(b.budget || '');
        }
        return 0;
      });
  }, [
    leads,
    activeCategoryTab,
    savedLeadIds,
    selectedCountry,
    selectedCity,
    selectedPipelineFilter,
    categoryFilter,
    platformFilter,
    businessAgeFilter,
    hasWebsiteFilter,
    hasEmailFilter,
    hasPhoneFilter,
    qualityFilter,
    verificationFilter,
    searchQuery,
    sortBy,
  ]);

  // Derived counts
  const totalLeads = leads.length;
  const newBusinesses = leads.filter((l) => l.businessAge?.isNew).length;
  const noWebsiteCount = leads.filter((l) => !l.contact?.hasWebsite).length;
  const pitchedCount = leads.filter((l) => l.pipelineStage === 'contacted' || l.pipelineStage === 'pending').length;
  const hotCount = useMemo(() => leads.filter((l) => l.pipelineStage === 'hot' || !l.contact?.hasWebsite || (l.scoreBreakdown?.leadQualityScore || 0) >= 85).length, [leads]);
  const qualifiedCount = useMemo(() => leads.filter((l) => (l.scoreBreakdown?.leadQualityScore || 75) >= 75 || l.pipelineStage === 'qualified').length, [leads]);
  const extraCount = useMemo(() => leads.filter((l) => ['Bark', 'Freelancer.com', 'Contra', 'PeoplePerHour', 'Guru', 'Truelancer', 'Workana', 'DesignCrowd', 'Malt'].includes(l.platform)).length, [leads]);
  const needsVerificationCount = useMemo(() => leads.filter((l) => !l.verified || l.contact?.emailStatus === 'UNVERIFIED' || l.contact?.emailStatus === 'UNKNOWN' || l.researchStatus === 'NEEDS_REVIEW' || l.contact?.phoneStatus === 'UNVERIFIED').length, [leads]);
  const followupCount = useMemo(() => leads.filter((l) => l.currentStatus === 'Follow-up Required' || l.pipelineStage === 'follow_up').length, [leads]);

  // View navigation router
  const handleSelectView = (view: NavViewId) => {
    // Admin direct redirects
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

    // Synchronize category tab when selecting workspace views
    if (view === 'hot-leads') setActiveCategoryTab('hot');
    else if (view === 'qualified-leads' || view === 'qualified') setActiveCategoryTab('qualified');
    else if (view === 'extra-leads') setActiveCategoryTab('extra');
    else if (view === 'needs-verification') setActiveCategoryTab('needs_verification');
    else if (view === 'saved-leads' || view === 'saved') setActiveCategoryTab('saved');
    else if (['dashboard', 'discover', 'all-leads', 'feed'].includes(view)) setActiveCategoryTab('all');

    // Smooth URL path sync without reload
    const pathMap: Record<NavViewId, string> = {
      dashboard: '/dashboard',
      discover: '/discover',
      'hot-leads': '/hot-leads',
      'qualified-leads': '/qualified',
      'extra-leads': '/extra-leads',
      'needs-verification': '/needs-verification',
      'saved-leads': '/saved',
      messages: '/messages',
      outreach: '/outreach',
      'follow-ups': '/follow-ups',
      campaigns: '/campaigns',
      analytics: '/analytics',
      reports: '/export',
      subscription: '/pricing',
      settings: '/settings',
      'admin-dashboard': '/admin/dashboard',
      'user-management': '/admin/users',
      'subscription-management': '/admin/subscriptions',
      'lead-management': '/admin/leads',
      'system-settings': '/admin/settings',
      'all-leads': '/leads',
      'approached-clients': '/approached-clients',
      'waiting-response': '/waiting-response',
      'interested-leads': '/interested-leads',
      'not-interested': '/not-interested',
      'wasted-leads': '/wasted-leads',
      'converted-leads': '/converted-leads',
      'closed-leads': '/closed-leads',
      'email-templates': '/templates',
      lists: '/lists',
      saved: '/saved',
      research: '/research',
      gmb: '/gmb',
      'verify-email': '/verify-email',
      'verify-phone': '/verify-phone',
      queue: '/queue',
      qualified: '/qualified',
      responses: '/messages',
      pipeline: '/pipeline',
      'activity-logs': '/activity-logs',
      export: '/export',
      integrations: '/integrations',
      'api-config': '/api-config',
      profile: '/profile',
      feed: '/leads',
      kanban: '/pipeline',
      inbox: '/messages',
      audit: '/activity-logs',
    };
    if (typeof window !== 'undefined' && pathMap[view]) {
      window.history.pushState(null, '', pathMap[view]);
    }
  };

  const handleCategoryTabSelect = (tab: LeadCategoryTab) => {
    setActiveCategoryTab(tab);
    if (tab === 'all') setActiveView('dashboard');
    else if (tab === 'hot') setActiveView('hot-leads');
    else if (tab === 'qualified') setActiveView('qualified-leads');
    else if (tab === 'extra') setActiveView('extra-leads');
    else if (tab === 'needs_verification') setActiveView('needs-verification');
    else if (tab === 'saved') setActiveView('saved-leads');
  };

  const isDiscoveryRoute = [
    'dashboard',
    'discover',
    'hot-leads',
    'qualified-leads',
    'extra-leads',
    'needs-verification',
    'saved-leads',
    'all-leads',
    'feed',
  ].includes(activeView);

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
          onOpenInbox={() => handleSelectView('messages')}
          inboxUnreadCount={inboxUnreadCount}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
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
              hotCount,
              qualifiedCount,
              extraCount,
              needsVerificationCount,
              savedCount: savedLeadIds.size,
              unreadResponses: inboxUnreadCount,
              followupCount,
              queueCount: 3,
            }}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0b1320] transition-colors duration-200">
            
            {/* SIGNATURE FREELANCER.COM LEAD DISCOVERY WORKBENCH (Requirement 1 & 7) */}
            {isDiscoveryRoute && (
              <div className="flex flex-col min-h-full">
                {/* Signature Freelancer SubNav with Category Pills & Market / Sorting Toolbar */}
                <FreelancerSubNav
                  totalLeadsCount={totalLeads}
                  hotCount={hotCount}
                  qualifiedCount={qualifiedCount}
                  extraCount={extraCount}
                  needsVerificationCount={needsVerificationCount}
                  savedCount={savedLeadIds.size}
                  activeCategoryTab={activeCategoryTab}
                  onSelectCategoryTab={handleCategoryTabSelect}
                  selectedCountry={selectedCountry}
                  onSelectCountry={setSelectedCountry}
                  sortBy={sortBy}
                  onSelectSortBy={setSortBy}
                  activeView={feedStyle === 'table' ? 'feed' : 'feed'}
                  setActiveView={(v) => {
                    if (v === 'feed') {
                      setFeedStyle('cards');
                      setActiveView('dashboard');
                    } else if (v === 'kanban') {
                      setActiveView('pipeline');
                    } else if (v === 'analytics') {
                      setActiveView('analytics');
                    }
                  }}
                  onOpenInbox={() => handleSelectView('messages')}
                  inboxCount={inboxUnreadCount}
                />

                {/* View Mode Toggle: Freelancer Cards vs Table View */}
                <div className="px-6 lg:px-8 pt-3 pb-1 flex items-center justify-between text-xs font-bold">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">
                    Showing <span className="font-extrabold text-slate-800 dark:text-slate-200">{filteredLeads.length}</span> {activeCategoryTab.replace('_', ' ')} opportunities
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">View Mode:</span>
                    <button
                      onClick={() => setFeedStyle('cards')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        feedStyle === 'cards'
                          ? 'bg-[#007FED] text-white shadow-xs font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Freelancer Feed</span>
                    </button>
                    <button
                      onClick={() => setFeedStyle('table')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        feedStyle === 'table'
                          ? 'bg-[#007FED] text-white shadow-xs font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>Table View</span>
                    </button>
                  </div>
                </div>

                {feedStyle === 'table' ? (
                  <LeadManagementView
                    leads={filteredLeads}
                    onUpdateLeadStage={handleMoveStage}
                    onDeleteLead={handleDeleteLead}
                    onArchiveLead={handleArchiveLead}
                    onResearchLead={(l) => handleSelectView('research')}
                    onOpenWebsiteModal={handleOpenWebsiteModal}
                    onOpenEmailModal={handleOpenEmailModal}
                    onInspectLead={handleOpenLeadDetail}
                  />
                ) : (
                  <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-4 gap-6">
                    <FreelancerFiltersSidebar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      selectedCountry={selectedCountry}
                      onCountryChange={setSelectedCountry}
                      selectedCity={selectedCity}
                      onCityChange={setSelectedCity}
                      selectedPlatform={platformFilter}
                      onPlatformChange={setPlatformFilter}
                      businessAgeFilter={businessAgeFilter}
                      onBusinessAgeChange={setBusinessAgeFilter}
                      hasWebsiteFilter={hasWebsiteFilter}
                      onHasWebsiteChange={setHasWebsiteFilter}
                      hasEmailFilter={hasEmailFilter}
                      onHasEmailChange={setHasEmailFilter}
                      hasPhoneFilter={hasPhoneFilter}
                      onHasPhoneChange={setHasPhoneFilter}
                      qualityFilter={qualityFilter}
                      onQualityChange={setQualityFilter}
                      verificationFilter={verificationFilter}
                      onVerificationChange={setVerificationFilter}
                      categoryFilter={categoryFilter}
                      onCategoryChange={setCategoryFilter}
                      totalFilteredCount={filteredLeads.length}
                      onResetFilters={() => {
                        setSelectedCountry('all');
                        setSelectedCity('');
                        setPlatformFilter('all');
                        setCategoryFilter('all');
                        setBusinessAgeFilter('all');
                        setHasWebsiteFilter('all');
                        setHasEmailFilter('all');
                        setHasPhoneFilter('all');
                        setQualityFilter('all');
                        setVerificationFilter('all');
                        setSearchQuery('');
                      }}
                    />

                    <div className="flex-1 space-y-4 min-w-0">
                      {filteredLeads.length === 0 ? (
                        <div className="bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Leads Found</h3>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {activeCategoryTab === 'saved'
                              ? "You haven't saved any leads to your shortlist yet. Click the 'Save Lead' button on any job card to curate your private list."
                              : "No leads match your active filters. Try adjusting your search query, country, or filter parameters."}
                          </p>
                          {activeCategoryTab === 'saved' && (
                            <button
                              onClick={() => handleCategoryTabSelect('all')}
                              className="px-4 py-2 bg-[#007FED] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                            >
                              Discover All Leads
                            </button>
                          )}
                        </div>
                      ) : (
                        filteredLeads.map((lead) => (
                          <FreelancerJobCard
                            key={lead.id}
                            lead={lead}
                            isSaved={savedLeadIds.has(lead.id)}
                            onToggleSave={handleToggleSaveLead}
                            onOpenWebsiteModal={handleOpenWebsiteModal}
                            onOpenEmailModal={(l) => handleOpenEmailModal(l)}
                            onInspect={(l) => handleOpenLeadDetail(l)}
                            onInspectJobScope={handleOpenJobScopeModal}
                          />
                        ))
                      )}
                    </div>

                    <div className="hidden xl:block w-80 shrink-0">
                      <FreelancerRightPanel
                        secondsLeft={secondsLeft}
                        isStreaming={isStreaming}
                        onToggleStreaming={() => setIsStreaming(!isStreaming)}
                        soundEnabled={soundEnabled}
                        onToggleSound={() => setSoundEnabled(!soundEnabled)}
                        latestLead={latestLead}
                        onOpenInbox={() => handleSelectView('messages')}
                        inboxUnreadCount={inboxUnreadCount}
                        onInspectLead={handleOpenWebsiteModal}
                        totalLeadsCount={totalLeads}
                        noWebsiteCount={noWebsiteCount}
                        newGmbCount={newBusinesses}
                        onSelectTag={(tag) => setSearchQuery(tag)}
                      />
                    </div>
                  </div>
                )}
              </div>
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

            {/* VIEW: Client Messaging & 3-Pane Inbound Inbox (Requirement 8) */}
            {(activeView === 'messages' || activeView === 'responses' || activeView === 'inbox') && (
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

            {/* VIEW: Subscription & Multi-Currency Pricing (Requirement 9) */}
            {activeView === 'subscription' && <SubscriptionPricingView />}

            {/* VIEW: Outreach Pipeline & Email Dispatch */}
            {activeView === 'outreach' && (
              <ApproachedClientsView
                initialStatusFilter="Approached"
                onNavigateView={handleSelectView}
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

            {/* VIEW 17: Reports & Export Center */}
            {(activeView === 'reports' || activeView === 'export') && <ExportCenterView leads={leads} />}

            {/* VIEW 18: Centralized Integrations Hub (Phase 17) */}
            {activeView === 'integrations' && <IntegrationsView />}

            {/* VIEW 19: API Configuration & Secrets (Phase 17) */}
            {activeView === 'api-config' && <ApiConfigurationView />}

            {/* VIEW 20: Settings View */}
            {activeView === 'settings' && (
              <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8 font-sans">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Workspace &amp; System Settings
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage visual theme, notifications, delivery configurations, and API keys.
                  </p>
                </div>

                {/* Card 1: Appearance & Visual Theme (Requirement 4) */}
                <div className="bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <Palette className="w-5 h-5 text-[#3B6FF5]" />
                    <div>
                      <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Appearance &amp; Theme Mode
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Switch between light and dark modes. Preference is remembered across all sessions.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (theme !== 'light') handleToggleTheme();
                      }}
                      className={`p-4 rounded-xl border-2 flex items-center gap-3 transition text-left cursor-pointer ${
                        theme === 'light'
                          ? 'border-[#3B6FF5] bg-blue-50/50 dark:bg-blue-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 shrink-0">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          Light Workspace
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Clean white surfaces, clear typography, professional borders.
                        </span>
                      </div>
                      {theme === 'light' && (
                        <CheckCircle2 className="w-5 h-5 text-[#3B6FF5] ml-auto shrink-0" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (theme !== 'dark') handleToggleTheme();
                      }}
                      className={`p-4 rounded-xl border-2 flex items-center gap-3 transition text-left cursor-pointer ${
                        theme === 'dark'
                          ? 'border-[#3B6FF5] bg-blue-50/50 dark:bg-blue-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                          Dark Workspace
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Midnight navy background (#172B4D), high-contrast cards.
                        </span>
                      </div>
                      {theme === 'dark' && (
                        <CheckCircle2 className="w-5 h-5 text-[#3B6FF5] ml-auto shrink-0" />
                      )}
                    </button>
                  </div>

                  {/* Brand Palette Swatches (Requirement 4) */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Official Brand Color System
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="h-6 rounded bg-[#172B4D]" />
                        <span className="font-bold text-[10px] block truncate">Midnight Navy</span>
                        <span className="font-mono text-[9px] text-slate-400">#172B4D</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="h-6 rounded bg-[#3B6FF5]" />
                        <span className="font-bold text-[10px] block truncate">Cobalt Blue</span>
                        <span className="font-mono text-[9px] text-slate-400">#3B6FF5</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="h-6 rounded bg-[#72D6B5]" />
                        <span className="font-bold text-[10px] block truncate">Mint</span>
                        <span className="font-mono text-[9px] text-slate-400">#72D6B5</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="h-6 rounded bg-[#F5F7FB] border border-slate-200" />
                        <span className="font-bold text-[10px] block truncate">Cloud</span>
                        <span className="font-mono text-[9px] text-slate-400">#F5F7FB</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="h-6 rounded bg-[#FFFFFF] border border-slate-200" />
                        <span className="font-bold text-[10px] block truncate">White</span>
                        <span className="font-mono text-[9px] text-slate-400">#FFFFFF</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="h-6 rounded bg-[#202938]" />
                        <span className="font-bold text-[10px] block truncate">Slate Ink</span>
                        <span className="font-mono text-[9px] text-slate-400">#202938</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Audio & Live Stream Feedback */}
                <div className="bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Luxury Audio Chime Feedback
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Play harmonic chime tone when new leads or client replies arrive.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        soundEnabled
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {soundEnabled ? 'Enabled' : 'Muted'}
                    </button>
                  </div>
                </div>

                {/* Card 3: API & Outreach Infrastructure */}
                <div className="bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#3B6FF5]">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Outreach SMTP &amp; AI Pitch Generator Keys
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Configure live Gmail SMTP dispatch, Google Gemini API, and public client tunnels.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsModalOpen(true)}
                      className="px-5 py-2.5 bg-[#3B6FF5] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Open Full API Settings Modal &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 21: Operator Profile View */}
            {activeView === 'profile' && <ProfileView />}

            {/* Approached Clients & Pipeline Sub-Sections */}
            {activeView === 'approached-clients' && (
              <ApproachedClientsView
                initialStatusFilter="Approached"
                onNavigateView={handleSelectView}
              />
            )}
            {activeView === 'waiting-response' && (
              <ApproachedClientsView
                initialStatusFilter="Waiting for Client Response"
                onNavigateView={handleSelectView}
              />
            )}
            {activeView === 'follow-ups' && (
              <ApproachedClientsView
                initialStatusFilter="Follow-up Required"
                onNavigateView={handleSelectView}
              />
            )}
            {activeView === 'interested-leads' && (
              <ApproachedClientsView
                initialStatusFilter="Interested"
                onNavigateView={handleSelectView}
              />
            )}
            {activeView === 'not-interested' && (
              <ApproachedClientsView
                initialStatusFilter="Not Interested"
                onNavigateView={handleSelectView}
              />
            )}
            {activeView === 'wasted-leads' && (
              <ApproachedClientsView
                initialStatusFilter="Wasted Lead"
                onNavigateView={handleSelectView}
              />
            )}
            {activeView === 'converted-leads' && (
              <ApproachedClientsView
                initialStatusFilter="Converted / Won"
                onNavigateView={handleSelectView}
              />
            )}
            {activeView === 'closed-leads' && (
              <ApproachedClientsView
                initialStatusFilter="Closed"
                onNavigateView={handleSelectView}
              />
            )}

            {/* Email Templates Manager */}
            {activeView === 'email-templates' && <EmailTemplatesView />}

          </main>
        </div>

        {/* Global Modals */}
        <LeadDetailModal
          lead={selectedLeadForDetail}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onLeadStatusChanged={(leadId, newStatus) => {
            fetchInitialLeads();
          }}
        />

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
          theme={theme}
          onToggleTheme={handleToggleTheme}
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
