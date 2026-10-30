'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Compass,
  FolderKanban,
  Bookmark,
  Search,
  Building2,
  MailCheck,
  PhoneCall,
  ListTree,
  Star,
  Send,
  MessageSquare,
  Kanban,
  BarChart3,
  History,
  DownloadCloud,
  Network,
  Cpu,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';

export type NavViewId =
  | 'dashboard'
  | 'all-leads'
  | 'discover'
  | 'lists'
  | 'saved'
  | 'research'
  | 'gmb'
  | 'verify-email'
  | 'verify-phone'
  | 'queue'
  | 'qualified'
  | 'campaigns'
  | 'responses'
  | 'pipeline'
  | 'analytics'
  | 'activity-logs'
  | 'export'
  | 'integrations'
  | 'api-config'
  | 'settings'
  | 'profile'
  | 'feed'
  | 'kanban'
  | 'inbox'
  | 'audit';

interface UnifiedSidebarProps {
  activeView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  counts?: {
    totalLeads?: number;
    queueCount?: number;
    unreadResponses?: number;
    qualifiedCount?: number;
  };
}

interface NavSection {
  title: string;
  items: Array<{
    id: NavViewId;
    label: string;
    path: string;
    icon: React.ElementType;
    badge?: number;
    highlight?: 'blue' | 'emerald' | 'amber' | 'purple';
  }>;
}

export default function UnifiedSidebar({
  activeView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  counts = {},
}: UnifiedSidebarProps) {
  const sections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { id: 'all-leads', label: 'All Leads', path: '/leads', icon: Users, badge: counts.totalLeads },
        { id: 'discover', label: 'Discover Leads', path: '/discover', icon: Compass, highlight: 'blue' },
        { id: 'lists', label: 'Lead Lists', path: '/lists', icon: FolderKanban },
        { id: 'saved', label: 'Saved Leads', path: '/saved', icon: Bookmark },
      ],
    },
    {
      title: 'RESEARCH',
      items: [
        { id: 'research', label: 'Business Research', path: '/research', icon: Search },
        { id: 'gmb', label: 'Google Business Profiles', path: '/gmb', icon: Building2 },
        { id: 'verify-email', label: 'Email Verification', path: '/verify-email', icon: MailCheck },
        { id: 'verify-phone', label: 'Phone Verification', path: '/verify-phone', icon: PhoneCall },
        { id: 'queue', label: 'Data Verification Queue', path: '/queue', icon: ListTree, badge: counts.queueCount, highlight: 'amber' },
      ],
    },
    {
      title: 'SALES',
      items: [
        { id: 'qualified', label: 'Qualified Leads', path: '/qualified', icon: Star, badge: counts.qualifiedCount, highlight: 'emerald' },
        { id: 'campaigns', label: 'Outreach Campaigns', path: '/campaigns', icon: Send },
        { id: 'responses', label: 'Responses', path: '/responses', icon: MessageSquare, badge: counts.unreadResponses, highlight: 'purple' },
        { id: 'pipeline', label: 'Sales Pipeline', path: '/pipeline', icon: Kanban },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { id: 'activity-logs', label: 'Activity Logs', path: '/activity-logs', icon: History },
        { id: 'export', label: 'Export Center', path: '/export', icon: DownloadCloud },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'integrations', label: 'Integrations', path: '/integrations', icon: Network },
        { id: 'api-config', label: 'API Configuration', path: '/api-config', icon: Cpu },
        { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User },
      ],
    },
  ];

  // Helper to normalize view matches (e.g. 'feed' maps to 'all-leads', 'inbox' to 'responses', 'kanban' to 'pipeline')
  const isItemActive = (itemId: NavViewId) => {
    if (activeView === itemId) return true;
    if (itemId === 'all-leads' && activeView === 'feed') return true;
    if (itemId === 'pipeline' && activeView === 'kanban') return true;
    if (itemId === 'responses' && activeView === 'inbox') return true;
    return false;
  };

  return (
    <aside
      className={`relative h-full flex flex-col bg-white dark:bg-[#0c1524] border-r border-slate-200 dark:border-slate-800 transition-all duration-200 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <button
          onClick={() => onSelectView('dashboard')}
          className="flex items-center gap-3 overflow-hidden focus:outline-none"
          title="SAMVERO Platform"
        >
          <SamveroBrandLogo size={collapsed ? 'sm' : 'md'} showText={!collapsed} tagline={false} />
        </button>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden lg:flex"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {sec.title}
              </div>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.id);

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={(e) => {
                    // Update state immediately without unmounting layout
                    onSelectView(item.id);
                    if (typeof window !== 'undefined') {
                      window.history.pushState(null, '', item.path);
                    }
                  }}
                  title={collapsed ? `${item.label}` : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        active ? 'text-white' : 'text-slate-400 dark:text-slate-400'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        active
                          ? 'bg-white/20 text-white'
                          : item.highlight === 'emerald'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.highlight === 'amber'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : item.highlight === 'purple'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Real-Data Badge */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] bg-slate-50 dark:bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Strict Real-Data Policy</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            100% Traceable Contact Sources. Zero Fabricated Records.
          </p>
        </div>
      )}
    </aside>
  );
}
