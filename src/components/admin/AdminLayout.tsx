'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Layers,
  Database,
  BarChart3,
  Plug,
  Activity,
  Settings,
  Bell,
  LogOut,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState('Sameer (Executive Admin)');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Verify session
    fetch('/api/auth/verify')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && (data.role === 'admin' || data.role === 'super_admin')) {
          setAuthorized(true);
          if (data.userName) setAdminName(data.userName);
        } else {
          setAuthorized(false);
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => {
        setAuthorized(false);
        router.push('/login');
      });

    // Fetch notifications
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
        }
      })
      .catch(() => {});
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('samvero_portal_session');
    localStorage.removeItem('samvero_portal_role');
    document.cookie = 'samvero_portal_token=; Max-Age=0; path=/;';
    document.cookie = 'samvero_portal_role=; Max-Age=0; path=/;';
    document.cookie = 'samvero_user_id=; Max-Age=0; path=/;';
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'Users & Customers', href: '/admin/users', icon: Users },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: Calendar },
    { name: 'Plans & Quotas', href: '/admin/plans', icon: Layers },
    { name: 'Manual Payments', href: '/admin/payments', icon: DollarSign },
    { name: 'Global Leads Pool', href: '/admin/leads', icon: Database },
    { name: 'Analytics & Revenue', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Lead Sources', href: '/admin/lead-sources', icon: Search },
    { name: 'Integrations', href: '/admin/integrations', icon: Plug },
    { name: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#060a14] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>Verifying Super Admin Authorization...</span>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#080d1a] border-r border-slate-800/80 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-black font-black text-sm tracking-wider">S</span>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white font-serif">SAMVERO</span>
              <span className="block text-[9px] uppercase tracking-widest text-amber-400 font-bold">
                Admin Super Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Portal links & Operator Badge */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <Link
            href="/app/dashboard"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 transition"
          >
            <span>Customer Portal View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 font-bold flex items-center justify-center text-xs">
                {adminName[0]}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">{adminName}</div>
                <div className="text-[10px] text-amber-400 font-mono font-semibold">SUPER_ADMIN</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#080d1a]/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-black text-white">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0a0f1f] border border-slate-800 rounded-2xl shadow-2xl z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-white">
                    <span>Admin Notifications</span>
                    <span className="text-[10px] text-amber-400">{unreadCount} Unread</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1.5 text-xs">
                    {notifications.length === 0 ? (
                      <div className="py-4 text-center text-slate-500">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border ${
                            n.isRead ? 'bg-slate-900/30 border-slate-800/40' : 'bg-slate-900/80 border-amber-400/20'
                          }`}
                        >
                          <div className="font-bold text-white text-[11px]">{n.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition flex items-center gap-1.5"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
