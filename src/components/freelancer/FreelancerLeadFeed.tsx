'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Lead, PipelineStage } from '@/types';
import { matchesCountry } from '@/lib/country-matcher';
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
  Flame,
  MapPin,
  History,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Undo2,
  X,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { isWhatsAppMobileNumber } from '@/lib/phone-utils';
import { enrichLeadContact } from '@/lib/contact-enricher';

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
  const [hasWhatsAppFilter, setHasWhatsAppFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Streaming radar 10s simulation & Auto-Rotation
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isStreaming, setIsStreaming] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // History Navigation (Max 5 Snapshots)
  interface FeedSnapshot {
    id: string;
    timestamp: number;
    timeString: string;
    leads: Lead[];
    summary: string;
  }
  const [historyStack, setHistoryStack] = useState<FeedSnapshot[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(0); // 0 = Live, 1..5 = Previous steps
  const [liveLeadsBackup, setLiveLeadsBackup] = useState<Lead[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Near Me Active state
  const [nearMeActive, setNearMeActive] = useState(false);
  const [nearMeLeadsCount, setNearMeLeadsCount] = useState(0);

  // Sync initialCategoryTab if changed externally
  useEffect(() => {
    if (initialCategoryTab) {
      setActiveCategoryTab(initialCategoryTab);
    }
  }, [initialCategoryTab]);

  const [feedLeads, setFeedLeads] = useState<Lead[]>(leads);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [isSearchingNearMe, setIsSearchingNearMe] = useState(false);

  const waVerifiedCount = useMemo(() => {
    return (feedLeads || []).filter(l => {
      const c = l.contact || enrichLeadContact(l).contact;
      return isWhatsAppMobileNumber(c?.whatsapp, l.country);
    }).length;
  }, [feedLeads]);
  const [nearMeToast, setNearMeToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Auto-Cycle leads every 10 seconds - Continuous authentic live streaming flow
  const cycleNextLeads = async () => {
    if (feedLeads.length === 0) return;

    // 1. Save current snapshot to history (max 5 snapshots)
    setHistoryStack((prev) => {
      const snap: FeedSnapshot = {
        id: `snap_${Date.now()}`,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        leads: [...feedLeads],
        summary:
          feedLeads
            .slice(0, 3)
            .map((l) => l.businessName || l.title)
            .filter(Boolean)
            .join(', ') || `${feedLeads.length} leads`,
      };
      return [snap, ...prev.slice(0, 4)];
    });

    // 2. Fetch fresh live leads from online APIs with cache-busting
    try {
      const countryParam = selectedCountry !== 'all' ? `&country=${encodeURIComponent(selectedCountry)}` : '';
      const categoryParam = categoryFilter !== 'all' ? `&category=${encodeURIComponent(categoryFilter)}` : '';
      const res = await fetch(`/api/leads?refresh=live&limit=30&t=${Date.now()}${countryParam}${categoryParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
          setFeedLeads((prev) => {
            const existingIdSet = new Set(prev.map((l) => l.id.toLowerCase()));
            const brandNewLeads = data.leads.filter((l: Lead) => !existingIdSet.has(l.id.toLowerCase()));

            // Keep pinned near-me leads at the top
            const pinned = prev.filter(
              (l) =>
                (l as any).isNearMe ||
                (l as any).pinnedNearMe ||
                (l.tags || []).some((t) => t.toLowerCase().includes('near me'))
            );
            const unpinned = prev.filter(
              (l) =>
                !(l as any).isNearMe &&
                !(l as any).pinnedNearMe &&
                !(l.tags || []).some((t) => t.toLowerCase().includes('near me'))
            );

            // If brand-new leads arrived from external APIs, stamp with incomingAt = Date.now() and prepend!
            if (brandNewLeads.length > 0) {
              const stampedNew = brandNewLeads.map((l: Lead) => ({
                ...l,
                incomingAt: Date.now(),
                postedAt: 'Just now',
                timeAgo: 'Just now',
              }));
              return [...pinned, ...stampedNew, ...unpinned];
            }

            // Continuous rotating flow: cycle 2 fresh opportunities from the bottom pool to the top with fresh arrival stamp
            if (unpinned.length > 3) {
              const rotatedCount = Math.min(2, Math.floor(unpinned.length / 2));
              const cycledItems = unpinned.slice(-rotatedCount).map((l: Lead, idx) => ({
                ...l,
                incomingAt: Date.now() - idx * 1000,
                postedAt: 'Just now',
                timeAgo: 'Just now',
              }));
              const remaining = unpinned.slice(0, -rotatedCount);
              return [...pinned, ...cycledItems, ...remaining];
            }

            return prev;
          });
          return;
        }
      }
    } catch {
      // Ignore network errors in auto-stream
    }

    // Fallback rotation if network is offline or throttled:
    setFeedLeads((prev) => {
      const pinned = prev.filter(
        (l) =>
          (l as any).isNearMe ||
          (l as any).pinnedNearMe ||
          (l.tags || []).some((t) => t.toLowerCase().includes('near me'))
      );
      const unpinned = prev.filter(
        (l) =>
          !(l as any).isNearMe &&
          !(l as any).pinnedNearMe &&
          !(l.tags || []).some((t) => t.toLowerCase().includes('near me'))
      );
      if (unpinned.length <= 2) return prev;
      const cycled = [
        { ...unpinned[unpinned.length - 1], incomingAt: Date.now(), postedAt: 'Just now', timeAgo: 'Just now' },
        ...unpinned.slice(0, unpinned.length - 1),
      ];
      return [...pinned, ...cycled];
    });
  };

  // Live timer ticker to auto-refresh relative time ("X mins ago") every 30 seconds
  const [, setMinuteTicker] = useState(0);
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setMinuteTicker((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(tickerInterval);
  }, []);

  // 10-second countdown interval (pauses when user navigates Previous history)
  useEffect(() => {
    if (!isStreaming || historyStep > 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          cycleNextLeads();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming, historyStep, feedLeads]);

  // History Navigation Handlers
  const handleGoPrevious = () => {
    if (historyStep >= 5 || historyStack.length === 0 || historyStep >= historyStack.length) {
      return;
    }
    const nextStep = historyStep + 1;
    if (historyStep === 0) {
      setLiveLeadsBackup(feedLeads);
    }
    const targetSnapshot = historyStack[nextStep - 1];
    if (targetSnapshot) {
      setHistoryStep(nextStep);
      setFeedLeads(targetSnapshot.leads);
    }
  };

  const handleGoNext = () => {
    if (historyStep <= 0) return;
    const nextStep = historyStep - 1;
    if (nextStep === 0) {
      setHistoryStep(0);
      if (liveLeadsBackup.length > 0) {
        setFeedLeads(liveLeadsBackup);
      }
    } else {
      const targetSnapshot = historyStack[nextStep - 1];
      if (targetSnapshot) {
        setHistoryStep(nextStep);
        setFeedLeads(targetSnapshot.leads);
      }
    }
  };

  const handleJumpToLive = () => {
    setHistoryStep(0);
    if (liveLeadsBackup.length > 0) {
      setFeedLeads(liveLeadsBackup);
    }
    setIsStreaming(true);
    setSecondsLeft(10);
  };

  const handleRestoreSnapshot = (snapshotIndex: number) => {
    if (snapshotIndex < 0 || snapshotIndex >= historyStack.length) return;
    if (historyStep === 0) {
      setLiveLeadsBackup(feedLeads);
    }
    setHistoryStep(snapshotIndex + 1);
    setFeedLeads(historyStack[snapshotIndex].leads);
    setIsHistoryModalOpen(false);
  };

  const handleSearchNearMe = async () => {
    setIsSearchingNearMe(true);
    setNearMeToast({ message: 'Requesting device coordinates & scanning nearby businesses...', type: 'info' });

    const runNearMeFetch = async (lat?: number, lon?: number) => {
      try {
        const params = new URLSearchParams();
        if (lat !== undefined && lon !== undefined) {
          params.set('lat', String(lat));
          params.set('lon', String(lon));
        }
        if (selectedCity.trim()) params.set('city', selectedCity.trim());
        if (selectedCountry !== 'all') params.set('country', selectedCountry);
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (categoryFilter !== 'all') params.set('category', categoryFilter);

        const res = await fetch(`/api/leads/near-me?${params.toString()}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
          const formattedNearMeLeads = data.leads.map((l: Lead) => ({
            ...l,
            isNearMe: true,
            pinnedNearMe: true,
            tags: Array.from(new Set([...(l.tags || []), 'Near Me', 'Local Business'])),
          }));

          setFeedLeads((prev) => {
            const idMap = new Map<string, Lead>();
            formattedNearMeLeads.forEach((l: Lead) => idMap.set(l.id.toLowerCase(), l));
            prev.forEach((l) => {
              if (!idMap.has(l.id.toLowerCase())) {
                idMap.set(l.id.toLowerCase(), l);
              }
            });
            return Array.from(idMap.values());
          });

          setNearMeActive(true);
          setNearMeLeadsCount(formattedNearMeLeads.length);
          setActiveCategoryTab('all');

          const locLabel = data.location?.locality || data.location?.city || 'your area';
          setNearMeToast({
            message: `📍 Successfully discovered ${data.count} verified businesses in ${locLabel} — Pinned to Top!`,
            type: 'success',
          });
          setTimeout(() => setNearMeToast(null), 6000);
        } else {
          setNearMeToast({
            message: data.message || 'No nearby businesses found for this location.',
            type: 'info',
          });
          setTimeout(() => setNearMeToast(null), 4500);
        }
      } catch (err: any) {
        setNearMeToast({
          message: 'Unable to connect to nearby places directory.',
          type: 'error',
        });
        setTimeout(() => setNearMeToast(null), 4500);
      } finally {
        setIsSearchingNearMe(false);
      }
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          runNearMeFetch(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, searching local city region:', err.message);
          runNearMeFetch();
        },
        { timeout: 7000, enableHighAccuracy: false }
      );
    } else {
      runNearMeFetch();
    }
  };

  // Sync initialSearchQuery if changed externally (e.g. from TopNavigation)
  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Sync leads from parent prop
  useEffect(() => {
    if (leads) {
      setFeedLeads(leads);
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
    setHasWhatsAppFilter('all');
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
          (lead.scoreBreakdown?.leadQualityScore ?? (lead as any).score ?? 0) >= 80 ||
          (lead.tags || []).some((t) => t.toLowerCase().includes('hot'));
        if (!isHot) return false;
      } else if (activeCategoryTab === 'qualified') {
        const score = lead.scoreBreakdown?.leadQualityScore ?? (lead as any).score ?? 0;
        const isQualified =
          (score >= 70 || lead.pipelineStage === 'qualified') &&
          lead.pipelineStage !== 'hot';
        if (!isQualified) return false;
      } else if (activeCategoryTab === 'extra') {
        const isExtra =
          (lead.pipelineStage as string) === 'extra' ||
          lead.type === 'job' ||
          ['Upwork', 'Fiverr', 'Contra', 'Remote OK', 'Remotive', 'Freelancer.com', 'PeoplePerHour'].some((p) =>
            (lead.platform || '').toLowerCase().includes(p.toLowerCase())
          );
        if (!isExtra) return false;
      } else if (activeCategoryTab === 'needs_verification') {
        const needsVerif =
          !lead.verified ||
          (lead.scoreBreakdown?.researchCompleteness ?? 100) < 65 ||
          (lead.pipelineStage === 'new' && !lead.contact?.phone && !lead.contact?.email);
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
        if (!matchesCountry(lead.country, lead.city, lead.address, selectedCountry, lead.contact?.phone)) {
          return false;
        }
      }

      // 4. City Filter
      if (selectedCity.trim()) {
        const c = selectedCity.trim().toLowerCase();
        if (!(lead.city || '').toLowerCase().includes(c)) return false;
      }

      // 5. Platform Filter (Intelligent Alias-Aware Matching)
      if (selectedPlatform !== 'all') {
        const pFilter = selectedPlatform.toLowerCase().trim();
        const leadPlat = (lead.platform || '').toLowerCase().trim();

        // Handle Google Maps / Google My Business alias
        const isGmbMatch =
          (pFilter.includes('google') || pFilter.includes('gmb') || pFilter.includes('maps')) &&
          (leadPlat.includes('google') || leadPlat.includes('gmb') || leadPlat.includes('maps') || lead.type === 'gmb');

        // Handle Freelancer alias
        const isFreelancerMatch =
          pFilter.includes('freelancer') && leadPlat.includes('freelancer');

        // Handle LinkedIn alias
        const isLinkedInMatch =
          pFilter.includes('linkedin') && leadPlat.includes('linkedin');

        // Handle Apollo alias
        const isApolloMatch =
          pFilter.includes('apollo') && leadPlat.includes('apollo');

        // Handle Rozee alias
        const isRozeeMatch =
          pFilter.includes('rozee') && leadPlat.includes('rozee');

        // Direct containment
        const isExactOrSub =
          leadPlat.includes(pFilter) || pFilter.includes(leadPlat);

        if (!isGmbMatch && !isFreelancerMatch && !isLinkedInMatch && !isApolloMatch && !isRozeeMatch && !isExactOrSub) {
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
      const enrichedContact = lead.contact || enrichLeadContact(lead).contact;
      if (hasEmailFilter === 'has-email' || hasEmailFilter === 'has_email') {
        if (!enrichedContact?.email || enrichedContact.email.length < 3) return false;
      }
      if (hasPhoneFilter === 'has-phone' || hasPhoneFilter === 'has_phone') {
        if (!enrichedContact?.phone && !enrichedContact?.whatsapp) return false;
      }
      if (hasWhatsAppFilter === 'verified_wa') {
        if (!isWhatsAppMobileNumber(enrichedContact?.whatsapp, lead.country)) return false;
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
      // Priority 1: Near Me Businesses ALWAYS pinned to the absolute top (ooper ooper)
      const aNear = Boolean(
        (a as any).isNearMe ||
        (a as any).pinnedNearMe ||
        (a.tags || []).some((t) => t.toLowerCase().includes('near me')) ||
        a.businessAge?.label?.toLowerCase().includes('near me')
      );
      const bNear = Boolean(
        (b as any).isNearMe ||
        (b as any).pinnedNearMe ||
        (b.tags || []).some((t) => t.toLowerCase().includes('near me')) ||
        b.businessAge?.label?.toLowerCase().includes('near me')
      );
      if (aNear && !bNear) return -1;
      if (!aNear && bNear) return 1;

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
      // Default: Newest first by incomingAt numerical timestamp
      const timeA = typeof a.incomingAt === 'number' ? a.incomingAt : 0;
      const timeB = typeof b.incomingAt === 'number' ? b.incomingAt : 0;
      if (timeB !== timeA) {
        return timeB - timeA;
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
    hasWhatsAppFilter,
    verificationFilter,
    qualityFilter,
    categoryFilter,
    sortBy,
    savedLeadIds,
  ]);

  // SubNav counts computation (dynamically scoped to selectedCountry and selectedPlatform)
  const tabCounts = useMemo(() => {
    const scoped = feedLeads.filter((l) => {
      if (selectedCountry !== 'all' && !matchesCountry(l.country, l.city, l.address, selectedCountry, l.contact?.phone)) {
        return false;
      }
      if (selectedPlatform !== 'all') {
        const pFilter = selectedPlatform.toLowerCase().trim();
        const leadPlat = (l.platform || '').toLowerCase().trim();
        const isGmbMatch =
          (pFilter.includes('google') || pFilter.includes('gmb') || pFilter.includes('maps')) &&
          (leadPlat.includes('google') || leadPlat.includes('gmb') || leadPlat.includes('maps') || l.type === 'gmb');
        const isFreelancerMatch = pFilter.includes('freelancer') && leadPlat.includes('freelancer');
        const isLinkedInMatch = pFilter.includes('linkedin') && leadPlat.includes('linkedin');
        const isApolloMatch = pFilter.includes('apollo') && leadPlat.includes('apollo');
        const isRozeeMatch = pFilter.includes('rozee') && leadPlat.includes('rozee');
        const isExactOrSub = leadPlat.includes(pFilter) || pFilter.includes(leadPlat);
        if (!isGmbMatch && !isFreelancerMatch && !isLinkedInMatch && !isApolloMatch && !isRozeeMatch && !isExactOrSub) {
          return false;
        }
      }
      return true;
    });

    return {
      total: scoped.length,
      hot: scoped.filter(
        (l) =>
          l.pipelineStage === 'hot' ||
          (!l.contact?.hasWebsite && l.type === 'gmb') ||
          (l.scoreBreakdown?.leadQualityScore ?? (l as any).score ?? 0) >= 80 ||
          (l.tags || []).some((t) => t.toLowerCase().includes('hot'))
      ).length,
      qualified: scoped.filter(
        (l) =>
          ((l.scoreBreakdown?.leadQualityScore ?? (l as any).score ?? 0) >= 70 || l.pipelineStage === 'qualified') &&
          l.pipelineStage !== 'hot'
      ).length,
      extra: scoped.filter(
        (l) =>
          (l.pipelineStage as string) === 'extra' ||
          l.type === 'job' ||
          ['Upwork', 'Fiverr', 'Contra', 'Remote OK', 'Remotive', 'Freelancer.com', 'PeoplePerHour'].some((p) =>
            (l.platform || '').toLowerCase().includes(p.toLowerCase())
          )
      ).length,
      needsVerification: scoped.filter(
        (l) => !l.verified || (l.scoreBreakdown?.researchCompleteness ?? 100) < 65
      ).length,
      saved: scoped.filter((l) => savedLeadIds.has(l.id)).length,
      noWebsite: scoped.filter((l) => !l.contact?.hasWebsite).length,
      newGmb: scoped.filter((l) => l.businessAge?.isNew).length,
    };
  }, [feedLeads, selectedCountry, selectedPlatform, savedLeadIds]);

  // Dynamic live platform counts (scoped to current country filter)
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const base = selectedCountry === 'all'
      ? feedLeads
      : feedLeads.filter((l) => matchesCountry(l.country, l.city, l.address, selectedCountry, l.contact?.phone));
    base.forEach((l) => {
      const p = l.platform || 'Other';
      counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  }, [feedLeads, selectedCountry]);

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
              platformCounts={platformCounts}
              businessAgeFilter={businessAgeFilter}
              onBusinessAgeChange={setBusinessAgeFilter}
              hasWebsiteFilter={hasWebsiteFilter}
              onHasWebsiteChange={setHasWebsiteFilter}
              hasEmailFilter={hasEmailFilter}
              onHasEmailChange={setHasEmailFilter}
              hasPhoneFilter={hasPhoneFilter}
              onHasPhoneChange={setHasPhoneFilter}
              hasWhatsAppFilter={hasWhatsAppFilter}
              onHasWhatsAppChange={setHasWhatsAppFilter}
              qualityFilter={qualityFilter}
              onQualityChange={setQualityFilter}
              verificationFilter={verificationFilter}
              onVerificationChange={setVerificationFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredLeads.length}
              onSearchNearMe={handleSearchNearMe}
              isSearchingNearMe={isSearchingNearMe}
            />

            {/* Center: Main Project Feed */}
            <div className="flex-1 min-w-0 space-y-4 w-full">
              
              {/* Near Me Feedback Banner */}
              {nearMeToast && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-xs transition-all animate-in fade-in ${
                    nearMeToast.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                      : nearMeToast.type === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                      : 'bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-[#3B6FF5]" />
                    <span>{nearMeToast.message}</span>
                  </div>
                  <button
                    onClick={() => setNearMeToast(null)}
                    className="text-[11px] underline opacity-75 hover:opacity-100 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Pinned Near Me Alert Banner */}
              {nearMeActive && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-2 border-emerald-500/50 dark:border-emerald-500/40 flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                        <span>📍 Pinned to Top: {nearMeLeadsCount} Local Businesses Discovered Near You</span>
                      </p>
                      <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                        Local GMB entities and physical businesses are pinned at the very top of your feed with prominent badges.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNearMeActive(false);
                      setFeedLeads((prev) =>
                        prev.map((l) => ({ ...l, isNearMe: false, pinnedNearMe: false }))
                      );
                    }}
                    className="text-[11px] font-bold px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-200 transition cursor-pointer"
                  >
                    Clear Pinned
                  </button>
                </div>
              )}

              {/* Feed Header Stats Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111927] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {filteredLeads.length} {filteredLeads.length === 1 ? 'Opportunity' : 'Opportunities'} Available
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Auto-Updating Live Feed
                  </span>

                  {/* Quick Toggle for WhatsApp Verified */}
                  <button
                    type="button"
                    onClick={() => setHasWhatsAppFilter(prev => prev === 'verified_wa' ? 'all' : 'verified_wa')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer ${
                      hasWhatsAppFilter === 'verified_wa'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                    }`}
                    title="Filter to only leads with authentic cellular mobile numbers on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp Verified</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      hasWhatsAppFilter === 'verified_wa' ? 'bg-white/25 text-white' : 'bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                    }`}>
                      {waVerifiedCount}
                    </span>
                  </button>
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
                  <button
                    type="button"
                    onClick={handleSearchNearMe}
                    disabled={isSearchingNearMe}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-[#3B6FF5] text-xs font-bold border border-blue-200 dark:border-blue-800 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    title="Scan businesses near your physical location"
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSearchingNearMe ? 'animate-bounce text-amber-500' : 'text-[#3B6FF5]'}`} />
                    <span>{isSearchingNearMe ? 'Locating...' : 'Near Me'}</span>
                  </button>

                  {onRefreshLiveLeads && (
                    <button
                      onClick={onRefreshLiveLeads}
                      disabled={isRefreshingLive}
                      className="px-3.5 py-1.5 bg-[#3B6FF5] hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                      title="Fetch brand-new live client projects from Freelancer, RemoteOK, Remotive & Reddit"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isRefreshingLive ? 'animate-spin' : ''}`} />
                      <span>{isRefreshingLive ? 'Fetching Live APIs...' : 'Fetch New Leads'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 10-Second Auto-Rotation Bar & Previous/History Navigation Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111927] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
                {/* Left: 10s Countdown or History Banner */}
                <div className="flex items-center gap-2.5">
                  {historyStep === 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 relative">
                        {isStreaming && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isStreaming ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isStreaming ? (
                          <>
                            Auto-rotating leads in{' '}
                            <span className="font-mono font-bold text-[#3B6FF5] text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                              {secondsLeft}s
                            </span>
                          </>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">Auto-rotation Paused</span>
                        )}
                      </span>
                      <button
                        onClick={() => setIsStreaming(!isStreaming)}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 transition cursor-pointer"
                        title={isStreaming ? 'Pause 10s auto-rotation' : 'Resume 10s auto-rotation'}
                      >
                        {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span className="font-bold">Viewing History Snapshot (Step {historyStep}/5)</span>
                      <button
                        onClick={handleJumpToLive}
                        className="ml-1 text-[11px] underline font-extrabold text-[#3B6FF5] hover:text-blue-700 cursor-pointer"
                      >
                        Return to Live Feed
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Previous (max 5 times), Next, Live, and History Modal */}
                <div className="flex items-center gap-1.5">
                  {/* Previous Button (max 5 steps) */}
                  <button
                    onClick={handleGoPrevious}
                    disabled={historyStep >= 5 || historyStack.length === 0 || historyStep >= historyStack.length}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    title={
                      historyStep >= 5
                        ? 'Maximum limit of 5 previous steps reached'
                        : historyStack.length === 0
                        ? 'History is empty. Wait for first 10-second rotation.'
                        : 'Go to previous batch of leads (up to 5 times)'
                    }
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous {historyStep > 0 ? `(${historyStep}/5)` : ''}</span>
                  </button>

                  {/* Next Button (when browsing history) */}
                  {historyStep > 0 && (
                    <button
                      onClick={handleGoNext}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                      title="Move forward towards live leads"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Return to Live Button */}
                  {historyStep > 0 && (
                    <button
                      onClick={handleJumpToLive}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                      title="Resume live 10-second feed stream"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Live</span>
                    </button>
                  )}

                  {/* Dedicated History Option Button */}
                  <button
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition cursor-pointer"
                    title="Open Lead Batch History Drawer (Last 5 Snapshots)"
                  >
                    <History className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>History</span>
                    {historyStack.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-mono">
                        {historyStack.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* History Modal / Drawer */}
              {isHistoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#162032]">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lead Feed Snapshots History</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Previous 5 auto-saved lead batches (capped at 5 steps)
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsHistoryModalOpen(false)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                      {historyStack.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400 space-y-2">
                          <History className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                          <p className="text-xs font-semibold">No previous snapshots recorded yet.</p>
                          <p className="text-[11px] text-slate-400">
                            Snapshots are automatically saved every 10 seconds during auto-rotation (up to 5 batches).
                          </p>
                        </div>
                      ) : (
                        historyStack.map((snap, idx) => (
                          <div
                            key={snap.id}
                            className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                              historyStep === idx + 1
                                ? 'border-[#3B6FF5] bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#141e30]'
                            }`}
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                                  Step {idx + 1} of 5
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                                  <Clock className="w-3 h-3" />
                                  {snap.timeString}
                                </span>
                                {historyStep === idx + 1 && (
                                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">
                                    Current View
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {snap.leads.length} leads: {snap.summary}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRestoreSnapshot(idx)}
                              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#3B6FF5] hover:bg-blue-600 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
                            >
                              Restore
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-[#162032] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {historyStack.length}/5 snapshots in memory
                      </span>
                      <button
                        onClick={() => setIsHistoryModalOpen(false)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
