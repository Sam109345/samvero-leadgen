'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

import { Lead, LeadNotification, PipelineStage } from '@/types';
import { generateNextIncomingLead } from '@/lib/lead-stream';
import { playLuxuryChime } from '@/lib/sound-chime';
import { getJobRequirementSpec } from '@/lib/job-spec-helper';
import { Briefcase, Sparkles, Flame, Plus, Layers, Filter } from 'lucide-react';

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view: 'feed' (Classic Freelancer.com 3-column) | 'kanban' | 'analytics' | 'inbox' | 'gmb' | 'audit'
  const [activeView, setActiveView] = useState<'kanban' | 'analytics' | 'feed' | 'gmb' | 'jobs' | 'builder' | 'inbox' | 'audit'>('feed');

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

  // 10-Second Timer Engine & Real-Time Ingestion
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isStreaming, setIsStreaming] = useState(true);
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

  // Job Scope & Brief Analyzer Modal State (Requested by user)
  const [selectedLeadForJobScope, setSelectedLeadForJobScope] = useState<Lead | null>(null);
  const [jobScopeModalOpen, setJobScopeModalOpen] = useState(false);

  const handleOpenJobScopeModal = (lead: Lead) => {
    setSelectedLeadForJobScope(lead);
    setJobScopeModalOpen(true);
  };

  const [isRefreshingLive, setIsRefreshingLive] = useState(false);

  // Fetch initial leads
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
        const enriched: Lead[] = data.leads.map((l: Lead, i: number) => ({
          ...l,
          pipelineStage: !l.contact.hasWebsite
            ? 'hot'
            : i % 4 === 0
            ? 'pending'
            : i % 5 === 0
            ? 'won'
            : 'new',
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

  // 10-Second Live Timer Engine
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const newLead = generateNextIncomingLead();

          setLeads((currentLeads) => [newLead, ...currentLeads]);
          setLatestLead(newLead);

          const newNotif: LeadNotification = {
            id: `notif-${Date.now()}`,
            title: newLead.title,
            businessName: newLead.businessName,
            location: `${newLead.city}, ${newLead.country}`,
            timestamp: new Date().toLocaleTimeString(),
            timeAgo: 'Just now',
            leadId: newLead.id,
            type: 'new_lead',
            read: false,
          };

          setNotifications((prevNotifs) => [newNotif, ...prevNotifs.slice(0, 19)]);
          setUnreadCount((c) => c + 1);

          if (soundEnabled) {
            playLuxuryChime();
          }

          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming, soundEnabled]);

  // Handle stage change on Kanban board
  const handleMoveStage = (leadId: string, nextStage: PipelineStage) => {
    setLeads((currentLeads) =>
      currentLeads.map((l) => (l.id === leadId ? { ...l, pipelineStage: nextStage } : l))
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

  // Sync leads cache to localStorage whenever leads update
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

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    // Country filter
    if (selectedCountry !== 'all' && l.country.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }

    // Pipeline Sub-filter
    if (selectedPipelineFilter === 'new_gmb' && !l.businessAge?.isNew) {
      return false;
    }
    if (selectedPipelineFilter === 'no_website' && l.contact.hasWebsite) {
      return false;
    }
    if (selectedPipelineFilter === 'pitched' && l.pipelineStage !== 'pending') {
      return false;
    }

    // Platform Origin filter
    if (platformFilter !== 'all' && l.platform !== platformFilter) {
      return false;
    }

    // Job Discipline Needed filter
    if (disciplineFilter !== 'all') {
      const spec = getJobRequirementSpec(l);
      if (disciplineFilter === 'WordPress Website Development') {
        if (spec.discipline !== 'WordPress Website Development') return false;
      } else if (disciplineFilter === 'Meta Ads & Paid Social') {
        if (spec.discipline !== 'Meta Ads & Paid Social') return false;
      } else if (spec.discipline !== disciplineFilter) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'all') {
      const catLower = categoryFilter.toLowerCase();
      if (catLower === 'wordpress') {
        const matchesWp = (l.category?.toLowerCase() || '').includes('wordpress') || 
                          (l.title?.toLowerCase() || '').includes('wordpress') ||
                          (l.title?.toLowerCase() || '').includes('woocommerce') ||
                          l.tags.some(t => t.toLowerCase().includes('wordpress') || t.toLowerCase().includes('woocommerce'));
        if (!matchesWp) return false;
      } else if (catLower === 'meta-ads' || catLower === 'meta' || catLower === 'meta ads') {
        const matchesMeta = (l.platform?.toLowerCase() || '').includes('meta') ||
                            (l.platform?.toLowerCase() || '').includes('facebook') ||
                            (l.platform?.toLowerCase() || '').includes('instagram') ||
                            (l.category?.toLowerCase() || '').includes('meta') ||
                            (l.title?.toLowerCase() || '').includes('meta') ||
                            (l.title?.toLowerCase() || '').includes('facebook ads') ||
                            l.tags.some(t => t.toLowerCase().includes('meta ads') || t.toLowerCase().includes('facebook ads') || t.toLowerCase().includes('roas'));
        if (!matchesMeta) return false;
      } else if (!l.category?.toLowerCase().includes(catLower)) {
        return false;
      }
    }

    // Business age filter
    if (businessAgeFilter === 'new' && !l.businessAge?.isNew) return false;
    if (businessAgeFilter === 'rising' && (l.businessAge?.years || 0) > 3) return false;
    if (businessAgeFilter === 'established' && l.businessAge?.isNew) return false;

    // Has website filter
    if (hasWebsiteFilter === 'no' && l.contact.hasWebsite) return false;
    if (hasWebsiteFilter === 'yes' && !l.contact.hasWebsite) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.businessName.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'budget_desc') {
      const numA = parseInt(a.budget?.replace(/[^0-9]/g, '') || '0', 10);
      const numB = parseInt(b.budget?.replace(/[^0-9]/g, '') || '0', 10);
      return numB - numA;
    }
    if (sortBy === 'budget_asc') {
      const numA = parseInt(a.budget?.replace(/[^0-9]/g, '') || '0', 10);
      const numB = parseInt(b.budget?.replace(/[^0-9]/g, '') || '0', 10);
      return numA - numB;
    }
    if (sortBy === 'age_asc') {
      return a.businessAge?.isNew ? -1 : 1;
    }
    return 0; // Default newest first
  });

  // Analytics counts
  const totalLeads = leads.length;
  const newBusinesses = leads.filter((l) => l.businessAge?.isNew).length;
  const noWebsiteCount = leads.filter((l) => !l.contact.hasWebsite).length;
  const uaeCount = leads.filter((l) => l.country === 'UAE').length;
  const pakistanCount = leads.filter((l) => l.country === 'Pakistan').length;
  const usCount = leads.filter((l) => l.country === 'US').length;
  const ukCount = leads.filter((l) => l.country === 'UK').length;
  const pitchedCount = leads.filter((l) => l.pipelineStage === 'pending').length;

  return (
    <PortalAuthGate>
      <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0b111a] text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
      
      {/* 1. Classic Freelancer.com Navbar (Dark Navy / Slate) */}
      <FreelancerNavbar
        notifications={notifications}
        unreadCount={unreadCount}
        onClearNotifications={() => {
          setNotifications([]);
          setUnreadCount(0);
        }}
        secondsLeft={secondsLeft}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenNewLeadModal={() => setCreateLeadModalOpen(true)}
        totalLeadsCount={totalLeads}
        onOpenInbox={() => setActiveView('inbox')}
        inboxUnreadCount={inboxUnreadCount}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        activeView={activeView}
        setActiveView={setActiveView}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onRefreshLiveLeads={() => fetchInitialLeads(true)}
        isRefreshingLive={isRefreshingLive}
      />

      {/* 2. Freelancer Sub-Navigation Bar */}
      <FreelancerSubNav
        totalLeadsCount={totalLeads}
        noWebsiteCount={noWebsiteCount}
        newGmbCount={newBusinesses}
        uaeCount={uaeCount}
        pkCount={pakistanCount}
        usCount={usCount}
        ukCount={ukCount}
        inboxCount={inboxUnreadCount}
        selectedPipelineFilter={selectedPipelineFilter}
        onSelectPipelineFilter={setSelectedPipelineFilter}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenInbox={() => setActiveView('inbox')}
      />

      {/* 3. Main Workspace Area */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        
        {/* VIEW 1: Classic Freelancer.com 3-Column Feed View */}
        {activeView === 'feed' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Column: Filter By Sidebar */}
            <FreelancerFiltersSidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedPlatform={platformFilter}
              onPlatformChange={setPlatformFilter}
              businessAgeFilter={businessAgeFilter}
              onBusinessAgeChange={setBusinessAgeFilter}
              hasWebsiteFilter={hasWebsiteFilter}
              onHasWebsiteChange={setHasWebsiteFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              onResetFilters={() => {
                setSelectedCountry('all');
                setSelectedPipelineFilter('all');
                setCategoryFilter('all');
                setBusinessAgeFilter('all');
                setHasWebsiteFilter('all');
                setPlatformFilter('all');
                setDisciplineFilter('all');
                setSearchQuery('');
              }}
              totalFilteredCount={sortedLeads.length}
            />

            {/* Center Column: Freelancer Project Feed */}
            <section className="flex-1 w-full space-y-4">
              
              {/* Platform & Discipline Quick Filter Chips */}
              <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-3.5 shadow-xs space-y-2.5 transition-colors">
                
                {/* Row 1: Platform Origin */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">
                    Origin Platform:
                  </span>
                  {[
                    { id: 'all', label: 'All Sources' },
                    { id: 'Meta Ads', label: '📢 Meta Ads' },
                    { id: 'Upwork', label: '🟢 Upwork' },
                    { id: 'Fiverr', label: '🟢 Fiverr' },
                    { id: 'Freelancer.com', label: '🟡 Freelancer' },
                    { id: 'Google My Business', label: '🔴 GMB Radar' },
                    { id: 'LinkedIn', label: '🔷 LinkedIn' },
                    { id: 'Bark', label: '🔵 Bark' },
                    { id: 'Truelancer', label: '⚡ Truelancer' },
                    { id: 'Wellfound', label: '🦄 Wellfound' },
                    { id: 'Rozee.pk', label: '🇵🇰 Rozee.pk' },
                    { id: 'Bayt', label: '🇦🇪 Bayt' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPlatformFilter(item.id)}
                      className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-all ${
                        platformFilter === item.id
                          ? 'bg-[#007FED] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#24334a]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  {/* Dropdown for All 50+ Platforms */}
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="bg-slate-100 dark:bg-[#1a2638] border border-slate-200 dark:border-[#2e415d] text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 text-xs font-semibold focus:outline-none focus:border-[#007FED] ml-auto"
                  >
                    <option value="all">More Platforms (50+ Total)...</option>
                    <option value="Contra">Contra</option>
                    <option value="PeoplePerHour">PeoplePerHour</option>
                    <option value="Guru">Guru</option>
                    <option value="Workana">Workana</option>
                    <option value="99designs">99designs</option>
                    <option value="DesignCrowd">DesignCrowd</option>
                    <option value="Toptal">Toptal</option>
                    <option value="Gun.io">Gun.io</option>
                    <option value="Arc">Arc.dev</option>
                    <option value="Lemon.io">Lemon.io</option>
                    <option value="Braintrust">Braintrust</option>
                    <option value="Mayple">Mayple</option>
                    <option value="MarketerHire">MarketerHire</option>
                    <option value="Legiit">Legiit</option>
                    <option value="SEOClerks">SEOClerks</option>
                    <option value="Codeable">Codeable</option>
                    <option value="We Work Remotely">We Work Remotely</option>
                    <option value="Behance">Behance</option>
                    <option value="Dribbble">Dribbble</option>
                    <option value="DesignHill">DesignHill</option>
                    <option value="Working Not Working">Working Not Working</option>
                    <option value="Creativepool">Creativepool</option>
                    <option value="Coroflot">Coroflot</option>
                    <option value="FlexJobs">FlexJobs</option>
                    <option value="Remote OK">Remote OK</option>
                    <option value="Remotive">Remotive</option>
                    <option value="Working Nomads">Working Nomads</option>
                    <option value="Dynamite Jobs">Dynamite Jobs</option>
                    <option value="Jooble">Jooble</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Glassdoor">Glassdoor</option>
                    <option value="SimplyHired">SimplyHired</option>
                    <option value="WPHired">WPHired</option>
                    <option value="ProBlogger Jobs">ProBlogger Jobs</option>
                    <option value="WriterAccess">WriterAccess</option>
                    <option value="Voices">Voices</option>
                    <option value="Voice123">Voice123</option>
                    <option value="Malt">Malt</option>
                    <option value="Taskrabbit">Taskrabbit</option>
                    <option value="Mustakbil">Mustakbil</option>
                    <option value="Naukrigulf">Naukrigulf</option>
                    <option value="Dubizzle">Dubizzle</option>
                    <option value="Thumbtack">Thumbtack</option>
                  </select>
                </div>

                {/* Row 2: Job Discipline Demanded */}
                <div className="flex items-center gap-2 flex-wrap text-xs pt-2 border-t border-slate-100 dark:border-[#24334a]">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">
                    Job Needed:
                  </span>
                  {[
                    { id: 'all', label: 'All Disciplines' },
                    { id: 'WordPress Website Development', label: '🌐 WordPress / WooCommerce' },
                    { id: 'Meta Ads & Paid Social', label: '📢 Meta Ads & Funnels' },
                    { id: 'Web Development', label: '💻 Web Design' },
                    { id: 'Mobile App Development', label: '📱 Mobile App' },
                    { id: 'Brand Identity & Logos', label: '🎨 6 SVG Logos' },
                    { id: 'Graphic Design', label: '✨ Branding' },
                    { id: 'Software SOW', label: '⚙️ Software SOW' },
                    { id: 'Local Business Digitalization', label: '🏥 GMB Digital' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDisciplineFilter(item.id)}
                      className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-all ${
                        disciplineFilter === item.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-[#1a2638] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#24334a]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Feed Count Header */}
              <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg px-5 py-3 shadow-xs flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#007FED]" />
                  <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">
                    Active Projects &amp; Verified Leads
                  </h2>
                  <span className="text-xs bg-slate-100 dark:bg-[#24334a] text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                    {sortedLeads.length} projects
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>10s Ingestion active</span>
                </div>
              </div>

              {/* Project Cards List */}
              {sortedLeads.length === 0 ? (
                <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-12 text-center space-y-3">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">
                    No matching projects found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting or clearing your filters to see more leads across Web, Mobile, Video, and Graphic design.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCountry('all');
                      setSelectedPipelineFilter('all');
                      setCategoryFilter('all');
                      setBusinessAgeFilter('all');
                      setHasWebsiteFilter('all');
                      setPlatformFilter('all');
                      setDisciplineFilter('all');
                      setSearchQuery('');
                    }}
                    className="freelancer-btn-primary text-xs"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedLeads.map((lead) => (
                    <FreelancerJobCard
                      key={lead.id}
                      lead={lead}
                      onOpenWebsiteModal={handleOpenWebsiteModal}
                      onOpenEmailModal={handleOpenEmailModal}
                      onInspect={handleOpenWebsiteModal}
                      onInspectJobScope={handleOpenJobScopeModal}
                    />
                  ))}
                </div>
              )}

            </section>

            {/* Right Column: Ingestion Radar, Client Inbound Drawer & Marketplace Stats */}
            <FreelancerRightPanel
              secondsLeft={secondsLeft}
              isStreaming={isStreaming}
              onToggleStreaming={() => setIsStreaming(!isStreaming)}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              latestLead={latestLead}
              onOpenInbox={() => setActiveView('inbox')}
              inboxUnreadCount={inboxUnreadCount}
              onInspectLead={handleOpenWebsiteModal}
              totalLeadsCount={totalLeads}
              noWebsiteCount={noWebsiteCount}
              newGmbCount={newBusinesses}
              onSelectTag={(tag) => setSearchQuery(tag)}
            />

          </div>
        )}

        {/* VIEW 2: Kanban Pipeline Board */}
        {activeView === 'kanban' && (
          <KanbanBoard
            leads={filteredLeads}
            onGenerateWebsite={handleOpenWebsiteModal}
            onOpenOutreach={(l) => handleOpenEmailModal(l)}
            onMoveStage={handleMoveStage}
            onOpenNewLeadModal={() => setCreateLeadModalOpen(true)}
          />
        )}

        {/* VIEW 3: Performance Funnel & Analytics */}
        {activeView === 'analytics' && (
          <FunnelAnalytics
            totalLeads={totalLeads}
            noWebsiteCount={noWebsiteCount}
            newBusinesses={newBusinesses}
            pitchedCount={pitchedCount}
          />
        )}

        {/* VIEW 4: Client Inbound Replies Inbox */}
        {activeView === 'inbox' && (
          <ClientInboxView
            onOpenWebsitePreview={(previewUrl) => {
              window.open(previewUrl, '_blank');
            }}
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

        {/* VIEW 5: GMB Radar Explorer */}
        {activeView === 'gmb' && (
          <GmbExplorer
            leads={filteredLeads}
            onGenerateWebsite={handleOpenWebsiteModal}
            onOpenOutreach={(l) => handleOpenEmailModal(l)}
          />
        )}

        {/* VIEW 6: Executive Admin Security & Staff Attribution Center */}
        {activeView === 'audit' && (
          <AdminAuditDashboard />
        )}

      </main>

      {/* New Module: Client Job Scope & Requirements Analyzer (Requested by user) */}
      <JobScopeAnalyzerModal
        lead={selectedLeadForJobScope}
        isOpen={jobScopeModalOpen}
        onClose={() => setJobScopeModalOpen(false)}
        onOpenDeliverablesStudio={(lead) => {
          handleOpenWebsiteModal(lead);
        }}
        onOpenEmailPitch={(lead, previewUrl) => {
          handleOpenEmailModal(lead, previewUrl);
        }}
      />

      {/* Deliverables Studio Modal (Working Website, Mobile App Carousel, Video Pitch, Brand Kit, SOW) */}
      <DeliverablesStudioModal
        lead={selectedLeadForWebsite}
        isOpen={websiteModalOpen}
        onClose={() => setWebsiteModalOpen(false)}
        onDispatchOutreach={(lead, deliverableType, previewUrl) => {
          handleOpenEmailModal(lead, previewUrl);
        }}
      />

      {/* Email Outreach Modal with attached preview link */}
      <EmailOutreachModal
        lead={selectedLeadForEmail}
        previewUrl={emailModalPreviewUrl}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />

      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* Create / Post Lead Modal */}
      <CreateLeadModal
        isOpen={createLeadModalOpen}
        onClose={() => setCreateLeadModalOpen(false)}
        onAddLead={handleAddCustomLead}
      />

      </div>
    </PortalAuthGate>
  );
}
