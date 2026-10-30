'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Database,
  ListFilter,
  Search,
  BarChart3,
  Calendar,
  CreditCard,
  User,
  HelpCircle,
  LogOut,
  Bell,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SaasSubscription } from '@/lib/saas-store';

interface CustomerLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function CustomerLayout({ children, title, subtitle }: CustomerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('Alexander Wright');
  const [userEmail, setUserEmail] = useState('client@gmail.com');
  const [userId, setUserId] = useState('user-client-101');
  const [subscription, setSubscription] = useState<SaasSubscription | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1. Verify user session
    fetch('/api/auth/verify')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthorized(true);
          if (data.userName) setUserName(data.userName);
          if (data.userEmail) setUserEmail(data.userEmail);
          if (data.userId) setUserId(data.userId);
        } else {
          setAuthorized(false);
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => {
        setAuthorized(false);
        router.push('/login');
      });

    // 2. Fetch customer metrics & subscription snapshot
    fetch('/api/customer/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setSubscription(data.metrics.subscription || null);
        }
      })
      .catch(() => {});

    // 3. Fetch notifications
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
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'My Leads', href: '/app/leads', icon: Database },
    { name: 'Lead Lists', href: '/app/lead-lists', icon: ListFilter },
    { name: 'Business Research', href: '/app/research', icon: Search },
    { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    { name: 'Subscription', href: '/app/subscription', icon: Calendar },
    { name: 'Billing Invoices', href: '/app/billing', icon: CreditCard },
    { name: 'Profile Settings', href: '/app/profile', icon: User },
    { name: 'Help & Support', href: '/app/support', icon: HelpCircle },
  ];

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#060a14] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>Authenticating Samvero Customer Portal...</span>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return null;
  }

  // Quota and Expiry calculations
  const quota = subscription?.leadQuota || 1000;
  const consumed = subscription?.leadsConsumed || 0;
  const quotaRemaining = Math.max(0, quota - consumed);
  const quotaPercent = Math.min(100, Math.round((consumed / quota) * 100));

  const expiryDate = subscription?.expiryDate ? new Date(subscription.expiryDate) : null;
  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
  const isExpired = subscription?.status === 'expired' || (daysLeft !== null && daysLeft <= 0);

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Customer Sidebar */}
      <aside className="w-full md:w-64 bg-[#080d1a] border-r border-slate-800/80 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/app/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20">
              S
            </div>
            <div>
              <span className="font-serif tracking-wider font-bold text-white text-base">SAMVERO</span>
              <span className="block text-[9px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Client Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Plan & Quota Card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-[#0b1222] border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-300 font-mono text-[11px]">
              {subscription?.planName || 'Standard Package'}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${
                isExpired
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : isExpiringSoon
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {subscription?.status || 'Active'}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>Leads Consumed</span>
              <span>
                {consumed.toLocaleString()} / {quota.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  quotaPercent >= 100 ? 'bg-rose-500' : quotaPercent >= 80 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
              <span>{quotaRemaining.toLocaleString()} remaining</span>
              <span>{daysLeft !== null ? `${daysLeft}d left` : ''}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-[#060a14]/60">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-semibold text-white truncate">{userName}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{userEmail}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#080d1a] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-bold text-white font-serif">{title}</h1>
            {subtitle && <p className="text-[11px] text-slate-400 font-mono truncate">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Live Quota Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1222] border border-slate-800 text-[11px] font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Quota:</span>
              <span className="text-amber-400 font-semibold">{quotaRemaining.toLocaleString()} leads</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-bold flex items-center justify-center font-mono animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0b1222] border border-slate-700 rounded-xl shadow-2xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="font-semibold text-white">Notifications</span>
                    <span className="text-[10px] font-mono text-slate-400">{unreadCount} unread</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 text-center text-slate-500 font-mono text-[11px]">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800 text-[11px]">
                          <div className="font-semibold text-white">{n.title}</div>
                          <div className="text-slate-400 mt-0.5">{n.message}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-1">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Renewal Request Button */}
            <Link
              href="/app/subscription"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-md shadow-amber-400/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Renew / Upgrade</span>
            </Link>
          </div>
        </header>

        {/* Global Expiry Alert Banners */}
        {isExpired && (
          <div className="bg-rose-500/15 border-b border-rose-500/30 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Your Samvero subscription expired on {expiryDate?.toLocaleDateString()}. New discoveries are paused. Your existing leads are fully preserved.
              </span>
            </div>
            <Link
              href="/app/subscription"
              className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold font-mono rounded text-[11px] transition shrink-0"
            >
              Renew Subscription
            </Link>
          </div>
        )}

        {isExpiringSoon && !isExpired && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Your package expires in {daysLeft} days on {expiryDate?.toLocaleDateString()}. Request renewal now to ensure seamless lead research.
              </span>
            </div>
            <Link
              href="/app/subscription"
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-mono rounded text-[11px] transition shrink-0"
            >
              Request Renewal
            </Link>
          </div>
        )}

        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
