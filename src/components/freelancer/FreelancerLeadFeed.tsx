'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Lead, PipelineStage } from '@/types';
import FreelancerSubNav, { LeadCategoryTab } from './FreelancerSubNav';
import FreelancerFiltersSidebar from './FreelancerFiltersSidebar';
import FreelancerJobCard from './FreelancerJobCard';
import FreelancerRightPanel from './FreelancerRightPanel';
import KanbanBoard from '@/components/KanbanBoard';
import FunnelAnalytics from '@/components/FunnelAnalytics';
import { 
  Sparkles, 
  RotateCcw, 
  Search, 
  Layers, 
  Inbox, 
  CheckCircle2,
  TrendingUp,
  Flame
} from 'lucide-react';

export interface FreelancerLeadFeedProps {
  leads: Lead[];
  savedLeadIds: Set<string>;
  onToggleSaveLead: (lead: Lead) => void;
  onMoveStage?: (leadId: string, stage: PipelineStage) => void;
  onOpenEmailModal: (lead: Lead, previewUrl?: string) => void;
  onOpenWebsiteModal: (lead: Lead) => void;
  onOpenJobScopeModal?: (lead: Lead) => void;
  onInspectLead: (lead: Lead) => void;
  onOpenNewLeadModal?: () => void;
  initialCategoryTab?: LeadCategoryTab;
  initialSearchQuery?: string;
  onOpenInbox?: () => void;
  inboxCount?: number;
  isLoading?: boolean;
  isRefreshingLive?: boolean;
  onRefreshLiveLeads?: () => void;
  showRightPanel?: boolean;
}

export default function FreelancerLeadFeed({
  leads = [],
  savedLeadIds = new Set(),
  onToggleSaveLead,
  onMoveStage,
  onOpenEmailModal,
  onOpenWebsiteModal,
  onOpenJobScopeModal,
  onInspectLead,
  onOpenNewLeadModal,
  initialCategoryTab = 'all',
  initialSearchQuery = '',
  onOpenInbox,
  inboxCount = 0,
  isLoading = false,
  isRefreshingLive = false,
  onRefreshLiveLeads,
  showRightPanel = true,
}: FreelancerLeadFeedProps) {
  // Navigation & Sub-tabs
  const [activeCategoryTab, setActiveCategoryTab] = useState<LeadCategoryTab>(initialCategoryTab);
  const [activeViewMode, setActiveViewMode] = useState<'feed' | 'kanban' | 'analytics'>('feed');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [businessAgeFilter, setBusinessAgeFilter] = useState('all');
  const [hasWebsiteFilter, setHasWebsiteFilter] = useState('all');
  const [hasEmailFilter, setHasEmailFilter] = useState('all');
  const [hasPhoneFilter, setHasPhoneFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Streaming radar 10s simulation
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isStreaming, setIsStreaming] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Sync initialCategoryTab if changed externally
  useEffect(() => {
    if (initialCategoryTab) {
      setActiveCategoryTab(initialCategoryTab);
    }
  }, [initialCategoryTab]);

  const [feedLeads, setFeedLeads] = useState<Lead[]>(leads);
  const [isLiveSearching, setIsLiveSearching] = useState(false);

  // Sync leads from parent prop
  useEffect(() => {
    if (leads && leads.length > 0) {
      setFeedLeads((prev) => {
        const idMap = new Map<string, Lead>();
        prev.forEach((l) => idMap.set(l.id.toLowerCase(), l));
        leads.forEach((l) => idMap.set(l.id.toLowerCase(), l));
        return Array.from(idMap.values());
      });
    }
  }, [leads]);

  // Dynamically query live aggregator when user searches by keyword, country, or category
  useEffect(() => {
    const hasFilter = searchQuery.trim().length >= 2 || selectedCountry !== 'all' || categoryFilter !== 'all' || selectedCity.trim().length > 0;
    if (!hasFilter) return;

    const timer = setTimeout(async () => {
      setIsLiveSearching(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (selectedCountry !== 'all') params.set('country', selectedCountry);
        if (categoryFilter !== 'all') params.set('category', categoryFilter);
        if (selectedCity.trim()) params.set('city', selectedCity.trim());
        params.set('refresh', 'live');

        const res = await fetch(`/api/leads?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
            setFeedLeads((prev) => {
              const idMap = new Map<string, Lead>();
              prev.forEach((l) => idMap.set(l.id.toLowerCase(), l));
              data.leads.forEach((l: Lead) => idMap.set(l.id.toLowerCase(), l));
              return Array.from(idMap.values());
            });
          }
        }
      } catch (err) {
        console.warn('Dynamic live lead search error:', err);
      } finally {
        setIsLiveSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCountry, categoryFilter, selectedCity]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedCity('');
    setSelectedPlatform('all');
    setBusinessAgeFilter('all');
    setHasWebsiteFilter('all');
    setHasEmailFilter('all');
    setHasPhoneFilter('all');
    setQualityFilter('all');
    setVerificationFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
    setActiveCategoryTab('all');
    if (leads && leads.length > 0) {
      setFeedLeads(leads);
    }
  };

  // Helper: parse numerical budget from text (e.g., "$1,200", "$500 - $1,500 USD")
  const parseBudgetValue = (budgetStr?: string): number => {
    if (!budgetStr) return 0;
    const matches = budgetStr.replace(/,/g, '').match(/\d+/g);
    if (!matches || matches.length === 0) return 0;
    return Math.max(...matches.map((n) => parseInt(n, 10)));
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return feedLeads.filter((lead) => {
      // 1. Sub-nav Category Tab
      if (activeCategoryTab === 'hot') {
        const isHot =
          lead.pipelineStage === 'hot' ||
          (!lead.contact?.hasWebsite && lead.type === 'gmb') ||
          (lead.scoreBreakdown?.leadQualityScore ?? 0) >= 80 ||
          (lead.tags || []).some((t) => t.toLowerCase().includes('hot'));
        if (!isHot) return false;
      } else if (activeCategoryTab === 'qualified') {
        const isQualified =
          (lead.scoreBreakdown?.leadQualityScore ?? 0) >= 70 ||
          lead.pipelineStage === 'qualified' ||
          lead.verified === true;
        if (!isQualified) return false;
      } else if (activeCategoryTab === 'extra') {
        const isExtra =
          (lead.pipelineStage as string) === 'extra' ||
          lead.type === 'job' ||
          ['Upwork', 'Fiverr', 'Contra', 'Remote OK', 'Remotive', 'Freelancer.com', 'PeoplePerHour'].some((p) =>
            lead.platform?.toLowerCase().includes(p.toLowerCase())
          );
        if (!isExtra) return false;
      } else if (activeCategoryTab === 'needs_verification') {
        const needsVerif =
          !lead.verified ||
          (lead.scoreBreakdown?.researchCompleteness ?? 100) < 80 ||
          !lead.contact?.email;
        if (!needsVerif) return false;
      } else if (activeCategoryTab === 'saved') {
        if (!savedLeadIds.has(lead.id)) return false;
      }

      // 2. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          lead.businessName?.toLowerCase().includes(q) ||
          lead.title?.toLowerCase().includes(q) ||
          lead.description?.toLowerCase().includes(q) ||
          lead.city?.toLowerCase().includes(q) ||
          lead.country?.toLowerCase().includes(q) ||
          lead.category?.toLowerCase().includes(q) ||
          lead.platform?.toLowerCase().includes(q) ||
          (lead.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          lead.contact?.email?.toLowerCase().includes(q) ||
          lead.contact?.phone?.includes(q);
        if (!matchesSearch) return false;
      }

      // 3. Country Filter
      if (selectedCountry !== 'all') {
        const country = (lead.country || '').toLowerCase();
        const city = (lead.city || '').toLowerCase();
        if (selectedCountry === 'UAE') {
          if (!country.includes('uae') && !country.includes('emirates') && !city.includes('dubai') && !city.includes('abu dhabi')) {
            return false;
          }
        } else if (selectedCountry === 'Pakistan') {
          const pkCities = ['lahore', 'karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'peshawar', 'multan'];
          if (!country.includes('pakistan') && !pkCities.some((c) => city.includes(c))) {
            return false;
          }
        } else if (selectedCountry === 'US') {
          if (!country.includes('us') && !country.includes('united states') && !country.includes('usa')) {
            return false;
          }
        } else if (selectedCountry === 'UK') {
          if (!country.includes('uk') && !country.includes('united kingdom') && !city.includes('london')) {
            return false;
          }
        }
      }

      // 4. City Filter
      if (selectedCity.trim()) {
        const c = selectedCity.trim().toLowerCase();
        if (!(lead.city || '').toLowerCase().includes(c)) return false;
      }

      // 5. Platform Filter
      if (selectedPlatform !== 'all') {
        if (!(lead.platform || '').toLowerCase().includes(selectedPlatform.toLowerCase())) {
          return false;
        }
      }

      // 6. Business Age Filter
      if (businessAgeFilter === 'new' && !lead.businessAge?.isNew) return false;
      if (businessAgeFilter === 'established' && lead.businessAge?.isNew) return false;

      // 7. Website Availability Filter
      if (hasWebsiteFilter === 'no-site' && lead.contact?.hasWebsite) return false;
      if (hasWebsiteFilter === 'has-site' && !lead.contact?.hasWebsite) return false;

      // 8. Contact Availability Filters
      if (hasEmailFilter === 'has-email' || hasEmailFilter === 'has_email') {
        if (!lead.contact?.email || lead.contact.email.length < 3) return false;
      }
      if (hasPhoneFilter === 'has-phone' || hasPhoneFilter === 'has_phone') {
        if (!lead.contact?.phone && !lead.contact?.whatsapp) return false;
      }

      // 9. Verification Filter
      if (verificationFilter === 'verified' && !lead.verified) return false;
      if (verificationFilter === 'unverified' && lead.verified) return false;

      // 10. Quality Score Filter
      const score = lead.scoreBreakdown?.leadQualityScore ?? (lead as any).score ?? 0;
      if ((qualityFilter === '80+' || qualityFilter === 'high') && score < 80) return false;
      if ((qualityFilter === '90+' || qualityFilter === 'top') && score < 90) return false;

      // 11. Industry / Category Filter
      if (categoryFilter !== 'all') {
        const cat = `${lead.category || ''} ${lead.title || ''} ${(lead.tags || []).join(' ')}`.toLowerCase();
        if (categoryFilter === 'web' && !/(web|website|frontend|next|react|landing)/i.test(cat)) return false;
        if (categoryFilter === 'wordpress' && !/(wordpress|woocommerce|cms|php|elementor)/i.test(cat)) return false;
        if (categoryFilter === 'meta-ads' && !/(meta|facebook|instagram|ads|marketing|social media)/i.test(cat)) return false;
        if (categoryFilter === 'mobile' && !/(mobile|app|ios|android|flutter|react native)/i.test(cat)) return false;
        if (categoryFilter === 'local' && !/(local|clinic|dental|hospital|law|repair|salon|store|gmb|restaurant)/i.test(cat)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'quality_desc') {
        const scoreA = a.scoreBreakdown?.leadQualityScore ?? (a as any).score ?? 0;
        const scoreB = b.scoreBreakdown?.leadQualityScore ?? (b as any).score ?? 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'budget_desc') {
        return parseBudgetValue(b.budget) - parseBudgetValue(a.budget);
      }
      if (sortBy === 'budget_asc') {
        return parseBudgetValue(a.budget) - parseBudgetValue(b.budget);
      }
      if (sortBy === 'relevance') {
        const relA = a.scoreBreakdown?.businessMatchConfidence ?? 80;
        const relB = b.scoreBreakdown?.businessMatchConfidence ?? 80;
        return relB - relA;
      }
      return (b.postedAt || '').localeCompare(a.postedAt || '');
    });
  }, [
    feedLeads,
    activeCategoryTab,
    searchQuery,
    selectedCountry,
    selectedCity,
    selectedPlatform,
    businessAgeFilter,
    hasWebsiteFilter,
    hasEmailFilter,
    hasPhoneFilter,
    verificationFilter,
    qualityFilter,
    categoryFilter,
    sortBy,
    savedLeadIds,
  ]);

  // SubNav counts computation
  const tabCounts = useMemo(() => {
    return {
      total: feedLeads.length,
      hot: feedLeads.filter(
        (l) =>
          l.pipelineStage === 'hot' ||
          (!l.contact?.hasWebsite && l.type === 'gmb') ||
          (l.scoreBreakdown?.leadQualityScore ?? 0) >= 80 ||
          (l.tags || []).some((t) => t.toLowerCase().includes('hot'))
      ).length,
      qualified: feedLeads.filter(
        (l) =>
          (l.scoreBreakdown?.leadQualityScore ?? 0) >= 70 ||
          l.pipelineStage === 'qualified' ||
          l.verified === true
      ).length,
      extra: feedLeads.filter(
        (l) =>
          (l.pipelineStage as string) === 'extra' ||
          l.type === 'job' ||
          ['Upwork', 'Fiverr', 'Contra', 'Remote OK', 'Remotive', 'Freelancer.com', 'PeoplePerHour'].some((p) =>
            l.platform?.toLowerCase().includes(p.toLowerCase())
          )
      ).length,
      needsVerification: feedLeads.filter(
        (l) => !l.verified || (l.scoreBreakdown?.researchCompleteness ?? 100) < 80 || !l.contact?.email
      ).length,
      saved: savedLeadIds.size,
      noWebsite: feedLeads.filter((l) => !l.contact?.hasWebsite).length,
      newGmb: feedLeads.filter((l) => l.businessAge?.isNew).length,
    };
  }, [feedLeads, savedLeadIds]);

  return (
    <div className="w-full flex flex-col font-sans transition-colors duration-200">
      {/* 1. Freelancer Category Sub-Navigation Bar */}
      <FreelancerSubNav
        totalLeadsCount={tabCounts.total}
        hotCount={tabCounts.hot}
        qualifiedCount={tabCounts.qualified}
        extraCount={tabCounts.extra}
        needsVerificationCount={tabCounts.needsVerification}
        savedCount={tabCounts.saved}
        activeCategoryTab={activeCategoryTab}
        onSelectCategoryTab={setActiveCategoryTab}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        activeView={activeViewMode}
        setActiveView={setActiveViewMode}
        onOpenInbox={onOpenInbox || (() => {})}
        inboxCount={inboxCount}
      />

      {/* 2. Main Body Container with 3-Pane Layout */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* MODE 1: KANBAN BOARD */}
        {activeViewMode === 'kanban' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pipeline Kanban Board</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Drag and track your prospective leads across outreach stages.
                </p>
              </div>
              <button
                onClick={() => setActiveViewMode('feed')}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Back to Feed
              </button>
            </div>
            <KanbanBoard
              leads={filteredLeads}
              onGenerateWebsite={onOpenWebsiteModal}
              onOpenOutreach={(l) => onOpenEmailModal(l)}
              onMoveStage={onMoveStage || (() => {})}
              onOpenNewLeadModal={onOpenNewLeadModal || (() => {})}
            />
          </div>
        )}

        {/* MODE 2: FUNNEL ANALYTICS */}
        {activeViewMode === 'analytics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Acquisition Funnel Analytics</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time pipeline conversion analysis and website coverage metrics.
                </p>
              </div>
              <button
                onClick={() => setActiveViewMode('feed')}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Back to Feed
              </button>
            </div>
            <FunnelAnalytics
              totalLeads={tabCounts.total}
              noWebsiteCount={tabCounts.noWebsite}
              newBusinesses={tabCounts.newGmb}
              pitchedCount={leads.filter((l) => l.currentStatus === 'Approached' || l.pipelineStage === 'contacted').length}
            />
          </div>
        )}

        {/* MODE 3: FREELANCER LEAD FEED (DEFAULT & USER-FAVORITE) */}
        {activeViewMode === 'feed' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Sidebar: Freelancer Filters Sidebar */}
            <FreelancerFiltersSidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              selectedPlatform={selectedPlatform}
              onPlatformChange={setSelectedPlatform}
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
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredLeads.length}
            />

            {/* Center: Main Project Feed */}
            <div className="flex-1 min-w-0 space-y-4 w-full">
              
              {/* Feed Header Stats Row */}
              <div className="flex items-center justify-between bg-white dark:bg-[#111927] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {filteredLeads.length} {filteredLeads.length === 1 ? 'Opportunity' : 'Opportunities'} Available
                  </span>
                  {activeCategoryTab !== 'all' && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#3B6FF5] border border-blue-200 dark:border-blue-900 capitalize">
                      {activeCategoryTab.replace('_', ' ')}
                    </span>
                  )}
                  {isLiveSearching && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full animate-pulse">
                      <RotateCcw className="w-3 h-3 animate-spin" />
                      Live querying online APIs...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onRefreshLiveLeads && (
                    <button
                      onClick={onRefreshLiveLeads}
                      disabled={isRefreshingLive}
                      className="text-xs text-[#3B6FF5] hover:underline font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isRefreshingLive ? 'animate-spin' : ''}`} />
                      <span>{isRefreshingLive ? 'Refreshing...' : 'Live Sync'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Feed List */}
              {isLoading && filteredLeads.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-5 bg-white dark:bg-[#141d2b] border border-slate-200/90 dark:border-[#223147] rounded-xl animate-pulse space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="bg-white dark:bg-[#111927] border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#3B6FF5] flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    No leads match your active filters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Try broadening your country, industry or platform filters to see more genuine leads.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 px-4 py-2 bg-[#3B6FF5] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => (
                    <FreelancerJobCard
                      key={lead.id}
                      lead={lead}
                      isSaved={savedLeadIds.has(lead.id)}
                      onToggleSave={onToggleSaveLead}
                      onOpenWebsiteModal={onOpenWebsiteModal}
                      onOpenEmailModal={onOpenEmailModal}
                      onInspect={onInspectLead}
                      onInspectJobScope={onOpenJobScopeModal}
                    />
                  ))}
                </div>
              )}

            </div>

            {/* Right: Live Ingestion Radar & Quick Panel */}
            {showRightPanel && (
              <div className="hidden xl:block shrink-0">
                <FreelancerRightPanel
                  secondsLeft={secondsLeft}
                  isStreaming={isStreaming}
                  onToggleStreaming={() => setIsStreaming(!isStreaming)}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => setSoundEnabled(!soundEnabled)}
                  latestLead={leads[0] || null}
                  onOpenInbox={onOpenInbox || (() => {})}
                  inboxUnreadCount={inboxCount}
                  onInspectLead={onInspectLead}
                  totalLeadsCount={tabCounts.total}
                  noWebsiteCount={tabCounts.noWebsite}
                  newGmbCount={tabCounts.newGmb}
                  onSelectTag={(tag) => setSearchQuery(tag)}
                />
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
