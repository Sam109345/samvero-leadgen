'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Sparkles, 
  BarChart3, 
  Kanban, 
  Sliders, 
  Globe2, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MessageSquare,
  Layers, 
  HelpCircle,
  TrendingUp,
  FileCode2,
  FolderOpen
} from 'lucide-react';

interface SidebarProps {
  activeView: 'kanban' | 'analytics' | 'feed' | 'gmb' | 'jobs' | 'builder' | 'inbox';
  setActiveView: (view: 'kanban' | 'analytics' | 'feed' | 'gmb' | 'jobs' | 'builder' | 'inbox') => void;
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
  onOpenSettings: () => void;
  sidebarCollapsed: boolean;
  counts: {
    total: number;
    newBusinesses: number;
    noWebsiteCount: number;
    uaeCount?: number;
    pakistanCount: number;
    usCount: number;
    ukCount: number;
    pitchedCount: number;
    inboxUnreadCount?: number;
  };
}

export default function Sidebar({
  activeView,
  setActiveView,
  selectedFilter,
  setSelectedFilter,
  selectedCountry,
  setSelectedCountry,
  onOpenSettings,
  sidebarCollapsed,
  counts,
}: SidebarProps) {
  // Primary icon navigation (Slim bar)
  const primaryNav = [
    { id: 'kanban', label: 'Kanban Pipeline', icon: Kanban },
    { id: 'inbox', label: 'Client Replies & Inbox', icon: MessageSquare, badge: counts.inboxUnreadCount },
    { id: 'analytics', label: 'Performance Funnel', icon: BarChart3 },
    { id: 'feed', label: 'All Leads Feed', icon: LayoutDashboard },
    { id: 'gmb', label: 'GMB Explorer', icon: Building2 },
    { id: 'jobs', label: 'Marketplace Jobs', icon: Briefcase },
    { id: 'builder', label: 'Auto-Website Studio', icon: Sparkles },
  ];

  // Secondary sub-navigation lists (Salessage style Image 2)
  const pipelineFilters = [
    { id: 'all', label: 'All Leads', count: counts.total },
    { id: 'inbox_replies', label: '💬 Client Responses', count: counts.inboxUnreadCount || 3, highlight: 'purple' },
    { id: 'new_gmb', label: 'Newly Opened (< 1 yr)', count: counts.newBusinesses, highlight: 'emerald' },
    { id: 'no_website', label: 'Missing Website (Hot)', count: counts.noWebsiteCount, highlight: 'amber' },
    { id: 'pitched', label: 'Pitched & Pending', count: counts.pitchedCount, highlight: 'blue' },
  ];

  const territoryFilters = [
    { id: 'all_territories', countryCode: 'all', label: 'Global Markets', flag: '🌍', count: counts.total },
    { id: 'uae', countryCode: 'UAE', label: 'United Arab Emirates', flag: '🇦🇪', count: counts.uaeCount || 6 },
    { id: 'pk', countryCode: 'Pakistan', label: 'Pakistan Local', flag: '🇵🇰', count: counts.pakistanCount },
    { id: 'us', countryCode: 'US', label: 'United States', flag: '🇺🇸', count: counts.usCount },
    { id: 'uk', countryCode: 'UK', label: 'United Kingdom', flag: '🇬🇧', count: counts.ukCount },
  ];

  return (
    <div className="flex h-full shrink-0">
      {/* 1. Slim Icon Strip (Dark Salessage aesthetic) */}
      <div className="w-16 bg-[#0B1528] border-r border-slate-800 flex flex-col items-center py-4 justify-between select-none">
        <div className="flex flex-col items-center gap-3 w-full">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                title={item.label}
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition group ${
                  isActive
                    ? 'bg-[#1877F2] text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-5 h-5 transition transform group-hover:scale-110" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
                {isActive && (
                  <span className="absolute -left-1 w-1.5 h-6 bg-cyan-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Strip Actions */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onOpenSettings}
            title="API Settings & Quotas"
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Filter Panel (Collapsible & Expandable with Dark Mode) */}
      {!sidebarCollapsed && (
        <div className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col p-4 shadow-sm space-y-5 overflow-y-auto hidden lg:flex transition-all duration-300">
          {/* Pipeline Category */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-2">
              Lead Pipelines
            </div>

            {pipelineFilters.map((f) => {
              const isSelected = selectedFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1877F2] dark:text-cyan-300 border border-blue-200/70 dark:border-blue-800 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      f.highlight === 'emerald'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : f.highlight === 'amber'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : f.highlight === 'purple'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                        : isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Territory Presets */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
              <span>Territory Markets</span>
              <Globe2 className="w-3 h-3 text-slate-400" />
            </div>

            {territoryFilters.map((t) => {
              const isSelected = selectedCountry === t.countryCode;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedCountry(t.countryCode)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{t.flag}</span>
                    <span>{t.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-slate-800 dark:bg-blue-700 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hot Redesign Spotlight Box */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-900/60 shadow-xs mt-auto">
            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-extrabold text-xs mb-1">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500" />
              <span>Redesign Pitch Target</span>
            </div>
            <p className="text-[11px] text-amber-900/90 dark:text-amber-200/80 leading-snug">
              <strong>{counts.noWebsiteCount} leads</strong> have zero web presence. Auto-synthesize landing pages to pitch directly!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
