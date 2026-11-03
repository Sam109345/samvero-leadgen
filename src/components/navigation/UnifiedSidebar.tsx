'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bookmark,
  Compass,
  Building2,
  Contact2,
  Network,
  Key,
  History,
  ListOrdered,
  Briefcase,
  CalendarClock,
  BarChart3,
  Settings,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Database,
  CreditCard,
  Cpu,
  X,
  Menu,
} from 'lucide-react';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';
import { useAuth } from '@/lib/auth-context';

export type NavViewId =
  // MAIN
  | 'dashboard'
  | 'all-leads'
  | 'my-leads'
  | 'saved-leads'
  // DISCOVERY
  | 'discover'
  | 'search-companies'
  | 'search-contacts'
  // INTEGRATIONS
  | 'integrations'
  | 'api-config'
  | 'sync-history'
  // MANAGEMENT
  | 'lists'
  | 'campaigns'
  | 'follow-ups'
  | 'analytics'
  // SYSTEM
  | 'settings'
  | 'profile'
  | 'support'
  // ADMIN
  | 'admin-dashboard'
  | 'user-management'
  | 'subscription-management'
  | 'lead-management'
  | 'system-settings'
  // LEGACY ALIASES
  | 'hot-leads'
  | 'qualified-leads'
  | 'extra-leads'
  | 'needs-verification'
  | 'messages'
  | 'outreach'
  | 'reports'
  | 'subscription'
  | 'approached-clients'
  | 'waiting-response'
  | 'interested-leads'
  | 'not-interested'
  | 'wasted-leads'
  | 'converted-leads'
  | 'closed-leads'
  | 'email-templates'
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
  | 'feed'
  | 'kanban'
  | 'inbox'
  | 'audit';

interface UnifiedSidebarProps {
  activeView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  counts?: {
    totalLeads?: number;
    hotCount?: number;
    qualifiedCount?: number;
    extraCount?: number;
    needsVerificationCount?: number;
    savedCount?: number;
    myLeadsCount?: number;
    unreadResponses?: number;
    followupCount?: number;
    queueCount?: number;
  };
}

interface NavItem {
  id: NavViewId;
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  adminOnly?: boolean;
  items: NavItem[];
}

export default function UnifiedSidebar({
  activeView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
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
    } catch {}
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    try {
      localStorage.setItem('samvero_sidebar_collapsed', String(next));
    } catch {}
    onToggleCollapse();
  };

  const navGroups: NavGroup[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { id: 'all-leads', label: 'All Leads', path: '/leads', icon: Users, badge: counts.totalLeads, badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
        { id: 'my-leads', label: 'My Leads', path: '/leads?scope=mine', icon: UserCheck, badge: counts.myLeadsCount, badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
        { id: 'saved-leads', label: 'Saved Leads', path: '/saved', icon: Bookmark, badge: counts.savedCount, badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
      ],
    },
    {
      title: 'DISCOVERY',
      items: [
        { id: 'discover', label: 'Find Leads', path: '/discover', icon: Compass },
        { id: 'search-companies', label: 'Search Companies', path: '/discover?type=company', icon: Building2 },
        { id: 'search-contacts', label: 'Search Contacts', path: '/discover?type=contact', icon: Contact2 },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'lists', label: 'Lead Lists', path: '/lists', icon: ListOrdered },
        { id: 'campaigns', label: 'Campaigns', path: '/campaigns', icon: Briefcase },
        { id: 'follow-ups', label: 'Follow-ups', path: '/follow-ups', icon: CalendarClock, badge: counts.followupCount, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
        { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
        { id: 'profile', label: 'Account', path: '/profile', icon: User },
        { id: 'support', label: 'Help & Support', path: '/support', icon: HelpCircle },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'ADMIN',
            adminOnly: true,
            items: [
              { id: 'admin-dashboard' as NavViewId, label: 'Admin Console', path: '/admin/dashboard', icon: ShieldCheck },
              { id: 'user-management' as NavViewId, label: 'User Directory', path: '/admin/users', icon: Users },
              { id: 'subscription-management' as NavViewId, label: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
              { id: 'lead-management' as NavViewId, label: 'All Database Leads', path: '/admin/leads', icon: Database },
              { id: 'system-settings' as NavViewId, label: 'System Settings', path: '/admin/settings', icon: Cpu },
            ],
          },
        ]
      : []),
  ];

  const isItemActive = (itemId: NavViewId) => {
    if (activeView === itemId) return true;
    if (itemId === 'dashboard' && activeView === 'feed') return true;
    if (itemId === 'all-leads' && (activeView === 'feed' || activeView === 'hot-leads' || activeView === 'qualified-leads' || activeView === 'extra-leads' || activeView === 'needs-verification')) return true;
    if (itemId === 'saved-leads' && (activeView === 'saved-leads' || activeView === 'saved')) return true;
    if (itemId === 'discover' && activeView === 'discover') return true;
    if (itemId === 'integrations' && activeView === 'integrations') return true;
    if (itemId === 'api-config' && activeView === 'api-config') return true;
    if (itemId === 'sync-history' && activeView === 'sync-history') return true;
    if (itemId === 'lists' && activeView === 'lists') return true;
    if (itemId === 'campaigns' && (activeView === 'campaigns' || activeView === 'outreach')) return true;
    if (itemId === 'follow-ups' && activeView === 'follow-ups') return true;
    if (itemId === 'analytics' && activeView === 'analytics') return true;
    if (itemId === 'settings' && activeView === 'settings') return true;
    if (itemId === 'profile' && activeView === 'profile') return true;
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 font-sans transition-all duration-200 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <button
          onClick={() => onSelectView('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <SamveroBrandLogo size={collapsed ? 'sm' : 'md'} showText={!collapsed} tagline={false} />
        </button>

        {onCloseMobile ? (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleToggle}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isItemActive(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer group relative ${
                      active
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        active
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!collapsed && typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile Mini-card */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {isAdmin ? 'SA' : 'CU'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {isAdmin ? 'Administrator' : 'Enterprise User'}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                {isAdmin ? 'Super Admin' : 'Full Platform Access'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-68 z-50 transform md:hidden transition-transform duration-300 shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
