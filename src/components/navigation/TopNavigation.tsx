'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  RefreshCw,
  Plus,
  User,
  LogOut,
  Moon,
  Sun,
  Shield,
  Menu,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface TopNavigationProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenNewLead?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenMobileMenu?: () => void;
  onSelectView?: (view: any) => void;
}

export default function TopNavigation({
  title,
  subtitle,
  searchQuery = '',
  onSearchChange,
  onRefresh,
  isRefreshing = false,
  onOpenNewLead,
  theme = 'light',
  onToggleTheme,
  onOpenMobileMenu,
  onSelectView,
}: TopNavigationProps) {
  const { userName, role, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click, touch tap, or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showProfileMenu]);

  return (
    <header className="h-16 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 relative z-50 shrink-0 font-sans">
      {/* Left: Mobile Menu Toggle + Title and Contextual Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Middle: Clean Search Bar */}
      {onSearchChange && (
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search companies, contacts, industries..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      )}

      {/* Right: Quick Actions, Theme, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Sync / Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition cursor-pointer disabled:opacity-50"
            title="Refresh Leads & Sync Platforms"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        )}

        {/* Quick Add Lead */}
        {onOpenNewLead && (
          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Lead</span>
          </button>
        )}

        {/* Theme Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition cursor-pointer select-none"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-white/20">
                {role === 'admin' || role === 'super_admin' ? 'SA' : 'CU'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f172a]" />
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {userName || (role === 'admin' || role === 'super_admin' ? 'Sameer (Executive Admin)' : 'Client Account')}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {role === 'admin' || role === 'super_admin' ? 'Super Admin' : 'Enterprise'}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-blue-500' : ''}`} />
          </button>

          {showProfileMenu && (
            <div 
              role="menu"
              className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-[#0c1322]/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 p-2 z-[100] text-xs animate-in fade-in zoom-in-95 duration-150 font-sans ring-1 ring-black/5 dark:ring-white/10"
            >
              {/* Header Profile Badge */}
              <div className="px-3 py-2.5 mb-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-cyan-400">
                    {role === 'admin' || role === 'super_admin' ? 'Executive Terminal' : 'Client Workspace'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white truncate text-xs">
                  {userName || (role === 'admin' || role === 'super_admin' ? 'Sameer (Executive Admin)' : 'Client Account')}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                  {role === 'admin' || role === 'super_admin' ? 'sameer.centric@gmail.com' : 'client@gmail.com'}
                </p>
              </div>

              {/* Navigation Items */}
              <div className="space-y-0.5">
                {(role === 'admin' || role === 'super_admin') && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span className="font-medium">Admin Console</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      Root
                    </span>
                  </Link>
                )}

                {onSelectView ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSelectView('profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Account Profile</span>
                  </button>
                ) : (
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Account Profile</span>
                  </Link>
                )}

                <Link
                  href="/how-it-works"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium">Architecture &amp; Flow</span>
                </Link>
              </div>

              {/* Logout Option */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 mt-1.5 pt-1.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
