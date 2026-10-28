'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  MessageSquare, 
  Search, 
  Clock, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Settings, 
  Plus, 
  ChevronDown, 
  Sparkles, 
  Building2, 
  Briefcase, 
  Layers, 
  Zap, 
  CheckCircle2,
  ExternalLink,
  Flame,
  Globe2,
  Lock,
  Crown,
  Shield,
  RotateCcw
} from 'lucide-react';
import { LeadNotification, Lead } from '@/types';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';
import { useAuth } from '@/lib/auth-context';

interface FreelancerNavbarProps {
  notifications: LeadNotification[];
  unreadCount: number;
  onClearNotifications: () => void;
  secondsLeft: number;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenNewLeadModal: () => void;
  totalLeadsCount: number;
  onOpenInbox: () => void;
  inboxUnreadCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeView: string;
  setActiveView: (view: 'kanban' | 'analytics' | 'feed' | 'gmb' | 'jobs' | 'builder' | 'inbox' | 'audit') => void;
  onSearch: (q: string) => void;
  searchQuery: string;
  onRefreshLiveLeads?: () => void;
  isRefreshingLive?: boolean;
}

export default function FreelancerNavbar({
  notifications,
  unreadCount,
  onClearNotifications,
  secondsLeft,
  isStreaming,
  onToggleStreaming,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenNewLeadModal,
  totalLeadsCount,
  onOpenInbox,
  inboxUnreadCount,
  theme,
  onToggleTheme,
  activeView,
  setActiveView,
  onSearch,
  searchQuery,
  onRefreshLiveLeads,
  isRefreshingLive = false,
}: FreelancerNavbarProps) {
  const { role, userName, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#161f2e] text-slate-800 dark:text-white border-b border-slate-200 dark:border-[#24334a] shadow-xs select-none transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: SAMVERO Official Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          
          {/* SAMVERO Dynamic Logo (Dark Mode & Light Mode) */}
          <button 
            onClick={() => setActiveView('feed')}
            className="flex items-center gap-3 group focus:outline-none"
            title="SAMVERO – AI-Powered Lead Generation Platform"
          >
            <div className="flex items-center">
              <SamveroBrandLogo size="md" showText={true} tagline={false} />
            </div>

            {/* Official Site Tagline */}
            <div className="hidden 2xl:flex flex-col text-left border-l border-slate-200 dark:border-[#24334a] pl-2.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                Find the Right Leads. Build Better Connections.
              </span>
            </div>
          </button>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveView('feed')}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'feed'
                  ? 'bg-[#007FED]/10 dark:bg-[#24334a] text-[#007FED]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2b3e]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Browse Projects
            </button>

            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'kanban'
                  ? 'bg-[#007FED]/10 dark:bg-[#24334a] text-[#007FED]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2b3e]'
              }`}
            >
              <Layers className="w-4 h-4" />
              My Pitches
            </button>

            <button
              onClick={onOpenInbox}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-2 relative ${
                activeView === 'inbox'
                  ? 'bg-[#007FED]/10 dark:bg-[#24334a] text-[#007FED]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2b3e]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Client Replies
              {inboxUnreadCount > 0 && (
                <span className="bg-[#ff0055] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                  {inboxUnreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('gmb')}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'gmb'
                  ? 'bg-[#007FED]/10 dark:bg-[#24334a] text-[#007FED]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2b3e]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              GMB Radar
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'analytics'
                  ? 'bg-[#007FED]/10 dark:bg-[#24334a] text-[#007FED]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2b3e]'
              }`}
            >
              <Zap className="w-4 h-4" />
              Funnel
            </button>

            {/* ONLY VISIBLE TO SUPER ADMIN */}
            {role === 'admin' && (
              <button
                onClick={() => setActiveView('audit')}
                className={`px-3 py-2 text-sm font-extrabold rounded-md transition-all flex items-center gap-1.5 border shadow-2xs ${
                  activeView === 'audit'
                    ? 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border-amber-400 dark:border-amber-500/50'
                    : 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                }`}
                title="Super Admin Only: Staff Lead Outreach Attribution & Device IP Security Monitor"
              >
                <Crown className="w-4 h-4 text-amber-500 fill-current" />
                <span>Executive Audit</span>
              </button>
            )}
          </nav>
        </div>

        {/* Center: Live Search Box */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects, GMB leads, skills (e.g. Website, Mobile)..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] focus:border-[#007FED] text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-md pl-10 pr-4 py-2 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearch('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: 10s Timer Pill, Sound, Notifications, Theme & Action Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Live Web Fetch Button */}
          {onRefreshLiveLeads && (
            <button
              onClick={onRefreshLiveLeads}
              disabled={isRefreshingLive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition active:scale-95 disabled:opacity-75 cursor-pointer"
              title="Query real-time Google Places & Marketplace Live Feeds right now"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingLive ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshingLive ? 'Fetching Live...' : 'Scan Live Leads'}</span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
            </button>
          )}

          {/* 10-Second Live Stream Status Pill */}
          <div 
            onClick={onToggleStreaming}
            title={isStreaming ? "Click to Pause Lead Ingestion" : "Click to Resume Lead Ingestion"}
            className="flex items-center gap-2 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:border-[#007FED] transition-all"
          >
            <span className="relative flex h-2 w-2">
              {isStreaming ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              )}
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s
            </span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline text-[11px]">
              {isStreaming ? 'Stream Active' : 'Paused'}
            </span>
          </div>

          {/* Sound Chime Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Luxury Audio Chime: ON' : 'Luxury Audio Chime: MUTED'}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#24334a] rounded-md transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#24334a] rounded-md transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#24334a] rounded-md transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ff0055] text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#161f2e] text-slate-800 dark:text-slate-100 rounded-lg shadow-2xl border border-slate-200 dark:border-[#24334a] overflow-hidden z-50">
                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0d141e] border-b border-slate-200 dark:border-[#24334a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">SAMVERO Real-Time Alerts</span>
                    <span className="text-xs bg-[#007FED]/10 text-[#007FED] font-bold px-2 py-0.5 rounded-full">
                      10s Ticker
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="text-xs text-[#007FED] hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#24334a]">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-50" />
                      No lead notifications yet. Incoming leads arrive every 10 seconds.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setShowNotifications(false);
                          setActiveView('feed');
                        }}
                        className="p-3.5 hover:bg-slate-50 dark:hover:bg-[#1f2b3e] cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {n.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          🏢 {n.businessName} • {n.location}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            title="API Keys & Platform Settings"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#24334a] rounded-md transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Post a Project / + Create Lead Primary Button */}
          <button
            onClick={onOpenNewLeadModal}
            className="bg-[#007FED] hover:bg-[#0067c6] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-md shadow-sm transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Post Project
          </button>

          {/* User Profile Avatar with Dual Role Indicator */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-[#24334a]">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-inner ${
                role === 'admin' 
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 ring-2 ring-amber-400/50' 
                  : 'bg-gradient-to-tr from-[#007FED] to-indigo-600'
              }`}>
                {role === 'admin' ? '👑' : 'S'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161f2e]"></span>
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>{role === 'admin' ? 'Sameer (Admin)' : (userName || 'Employer Staff')}</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {role === 'admin' ? '👑 Executive Mode' : '$48,500 Pool'}
              </span>
            </div>

            {/* Lock Terminal Action (Log Out & Switch Role) */}
            <button
              onClick={logout}
              title="Lock Operating Terminal (Switch Role / Sign Out)"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors ml-1"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
