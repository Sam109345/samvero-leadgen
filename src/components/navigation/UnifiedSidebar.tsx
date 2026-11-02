'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Compass,
  Flame,
  CheckCircle2,
  Layers,
  ShieldAlert,
  Bookmark,
  MessageSquare,
  Send,
  History,
  Briefcase,
  BarChart3,
  DownloadCloud,
  CreditCard,
  Settings,
  ShieldCheck,
  Users,
  Database,
  Cpu,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Search,
  Building2,
  MailCheck,
  PhoneCall,
  ListTree,
  Star,
  Sparkles,
  Network,
  User,
  Kanban,
} from 'lucide-react';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';
import { useAuth } from '@/lib/auth-context';

export type NavViewId =
  | 'dashboard'
  | 'discover'
  | 'hot-leads'
  | 'qualified-leads'
  | 'extra-leads'
  | 'needs-verification'
  | 'saved-leads'
  | 'messages'
  | 'outreach'
  | 'follow-ups'
  | 'campaigns'
  | 'analytics'
  | 'reports'
  | 'subscription'
  | 'settings'
  | 'admin-dashboard'
  | 'user-management'
  | 'subscription-management'
  | 'lead-management'
  | 'system-settings'
  // Legacy Aliases
  | 'all-leads'
  | 'approached-clients'
  | 'waiting-response'
  | 'interested-leads'
  | 'not-interested'
  | 'wasted-leads'
  | 'converted-leads'
  | 'closed-leads'
  | 'email-templates'
  | 'lists'
  | 'saved'
  | 'research'
  | 'gmb'
  | 'verify-email'
  | 'verify-phone'
  | 'queue'
  | 'qualified'
  | 'responses'
  | 'pipeline'
  | 'activity-logs'
  | 'export'
  | 'integrations'
  | 'api-config'
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
    hotCount?: number;
    qualifiedCount?: number;
    extraCount?: number;
    needsVerificationCount?: number;
    savedCount?: number;
    unreadResponses?: number;
    followupCount?: number;
    queueCount?: number;
  };
}

interface NavSection {
  title: string;
  adminOnly?: boolean;
  items: Array<{
    id: NavViewId;
    label: string;
    path: string;
    icon: React.ElementType;
    badge?: number;
    highlight?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  }>;
}

export default function UnifiedSidebar({
  activeView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  counts = {},
}: UnifiedSidebarProps) {
  const { role } = useAuth();
  const isAdmin = role === 'admin' || role === 'super_admin';

  // Persistent collapse preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('samvero_sidebar_collapsed');
      if (stored !== null) {
        const isCollapsed = stored === 'true';
        if (isCollapsed !== collapsed) {
          onToggleCollapse();
        }
      }
    } catch (e) {}
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    try {
      localStorage.setItem('samvero_sidebar_collapsed', String(next));
    } catch (e) {}
    onToggleCollapse();
  };

  const sections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { id: 'discover', label: 'Discover Leads', path: '/discover', icon: Compass, badge: counts.totalLeads, highlight: 'blue' },
        { id: 'hot-leads', label: 'Hot Leads', path: '/hot-leads', icon: Flame, badge: counts.hotCount, highlight: 'rose' },
        { id: 'qualified-leads', label: 'Qualified Leads', path: '/qualified', icon: CheckCircle2, badge: counts.qualifiedCount, highlight: 'emerald' },
        { id: 'extra-leads', label: 'Extra Leads', path: '/extra-leads', icon: Layers, badge: counts.extraCount },
        { id: 'needs-verification', label: 'Needs Verification', path: '/needs-verification', icon: ShieldAlert, badge: counts.needsVerificationCount, highlight: 'amber' },
        { id: 'saved-leads', label: 'Saved Leads', path: '/saved', icon: Bookmark, badge: counts.savedCount, highlight: 'purple' },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { id: 'messages', label: 'Messages', path: '/messages', icon: MessageSquare, badge: counts.unreadResponses, highlight: 'purple' },
        { id: 'outreach', label: 'Outreach', path: '/outreach', icon: Send, highlight: 'blue' },
        { id: 'follow-ups', label: 'Follow-ups', path: '/follow-ups', icon: History, badge: counts.followupCount, highlight: 'amber' },
        { id: 'campaigns', label: 'Campaigns', path: '/campaigns', icon: Briefcase },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', path: '/export', icon: DownloadCloud },
        { id: 'subscription', label: 'Subscription', path: '/pricing', icon: CreditCard, highlight: 'emerald' },
        { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
    // ADMIN ONLY section - strictly hidden from normal users
    ...(isAdmin
      ? [
          {
            title: 'ADMIN ONLY',
            adminOnly: true,
            items: [
              { id: 'admin-dashboard' as NavViewId, label: 'Admin Dashboard', path: '/admin/dashboard', icon: ShieldCheck, highlight: 'amber' as const },
              { id: 'user-management' as NavViewId, label: 'User Management', path: '/admin/users', icon: Users },
              { id: 'subscription-management' as NavViewId, label: 'Subscription Management', path: '/admin/subscriptions', icon: CreditCard },
              { id: 'lead-management' as NavViewId, label: 'Lead Management', path: '/admin/leads', icon: Database },
              { id: 'system-settings' as NavViewId, label: 'System Settings', path: '/admin/settings', icon: Cpu },
            ],
          },
        ]
      : []),
  ];

  // View matching helper
  const isItemActive = (itemId: NavViewId) => {
    if (activeView === itemId) return true;
    if (itemId === 'dashboard' && (activeView === 'feed' || activeView === 'all-leads')) return true;
    if (itemId === 'discover' && activeView === 'discover') return true;
    if (itemId === 'hot-leads' && activeView === 'hot-leads') return true;
    if (itemId === 'qualified-leads' && (activeView === 'qualified-leads' || activeView === 'qualified')) return true;
    if (itemId === 'saved-leads' && (activeView === 'saved-leads' || activeView === 'saved')) return true;
    if (itemId === 'messages' && (activeView === 'messages' || activeView === 'responses' || activeView === 'inbox')) return true;
    if (itemId === 'outreach' && (activeView === 'outreach' || activeView === 'approached-clients')) return true;
    if (itemId === 'reports' && (activeView === 'reports' || activeView === 'export' || activeView === 'activity-logs')) return true;
    return false;
  };

  return (
    <aside
      className={`relative h-full flex flex-col bg-white dark:bg-[#111c2e] border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 select-none z-30 shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Header with Logo & Toggle Button */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
        <button
          onClick={() => onSelectView('dashboard')}
          className="flex items-center gap-2.5 overflow-hidden focus:outline-none"
          title="SAMVERO Platform"
        >
          <SamveroBrandLogo size={collapsed ? 'sm' : 'md'} showText={!collapsed} tagline={false} />
        </button>

        <button
          onClick={handleToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            {!collapsed ? (
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>{sec.title}</span>
                {sec.adminOnly && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                    PROTECTED
                  </span>
                )}
              </div>
            ) : (
              <div className="my-2 border-t border-slate-200/60 dark:border-slate-800/60" />
            )}

            {sec.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer relative ${
                    active
                      ? 'bg-[#3B6FF5] text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        active
                          ? 'text-white'
                          : item.highlight === 'rose'
                          ? 'text-rose-500'
                          : item.highlight === 'emerald'
                          ? 'text-emerald-500'
                          : item.highlight === 'amber'
                          ? 'text-amber-500'
                          : item.highlight === 'blue'
                          ? 'text-[#3B6FF5]'
                          : 'text-slate-400 dark:text-slate-400'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        active
                          ? 'bg-white/20 text-white'
                          : item.highlight === 'rose'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
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

                  {/* Active dot in collapsed mode */}
                  {collapsed && active && (
                    <span className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile / Quick Info Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0b1320] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3B6FF5]/10 border border-[#3B6FF5]/30 text-[#3B6FF5] font-black text-xs flex items-center justify-center shrink-0">
              {isAdmin ? 'A' : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                {isAdmin ? 'Super Admin' : 'Client User'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block truncate">
                {isAdmin ? 'Executive Access' : 'Pro Prospector'}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
