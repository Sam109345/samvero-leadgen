'use client';

import React, { useState } from 'react';
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
}: TopNavigationProps) {
  const { userName, role, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 z-20 shrink-0 font-sans">
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
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {role === 'admin' || role === 'super_admin' ? 'SA' : 'CU'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {userName || (role === 'admin' || role === 'super_admin' ? 'Sameer Admin' : 'Client Account')}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300">
                {role === 'admin' || role === 'super_admin' ? 'Super Admin' : 'Enterprise'}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {userName || (role === 'admin' || role === 'super_admin' ? 'Sameer Admin' : 'Client User')}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                  {role === 'admin' || role === 'super_admin' ? 'sameer.centric@gmail.com' : 'client@gmail.com'}
                </p>
              </div>

              {(role === 'admin' || role === 'super_admin') && (
                <a
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin Console</span>
                </a>
              )}

              <a
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Profile</span>
              </a>

              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left cursor-pointer"
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
