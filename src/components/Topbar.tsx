'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Rocket, 
  ChevronDown, 
  Search, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Building2, 
  Zap,
  Flame,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { LeadNotification, Lead } from '@/types';

interface TopbarProps {
  notifications: LeadNotification[];
  unreadCount: number;
  onClearNotifications: () => void;
  secondsLeft: number;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectLeadById: (id: string) => void;
  onOpenSettings: () => void;
  onOpenNewLeadModal: () => void;
  totalLeadsCount: number;
  onOpenInbox: () => void;
  inboxUnreadCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Topbar({
  notifications,
  unreadCount,
  onClearNotifications,
  secondsLeft,
  isStreaming,
  onToggleStreaming,
  soundEnabled,
  onToggleSound,
  onSelectLeadById,
  onOpenSettings,
  onOpenNewLeadModal,
  totalLeadsCount,
  onOpenInbox,
  inboxUnreadCount,
  theme,
  onToggleTheme,
  sidebarCollapsed,
  onToggleSidebar,
}: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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
    <header className="sticky top-0 z-50 w-full bg-[#0A1628] text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity (Curved Salessage style) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sidebar Expand/Collapse Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
            title={sidebarCollapsed ? 'Expand Sidebar Menu' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-cyan-300" /> : <PanelLeftClose className="w-4 h-4 text-slate-400" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1877F2] via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition">
              {/* Salessage style signal icon */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 17l6-6 4 4 8-8" />
                <path d="M14 7h7v7" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">SAMVERO</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">
                Executive Acquisition &amp; Leads
              </span>
            </div>
          </Link>

          {/* 10-Second Incoming Leads Timer Pill (Requested Feature) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-inner">
            <div className="relative flex items-center justify-center w-5 h-5">
              <span className={`absolute w-full h-full rounded-full ${isStreaming ? 'bg-cyan-500/30 animate-ping' : 'bg-slate-700'}`} />
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-cyan-400' : 'bg-slate-500'}`} />
            </div>
            <div className="text-xs">
              <span className="text-slate-400 font-medium">Next Lead in: </span>
              <strong className="text-cyan-300 font-mono text-sm font-bold tracking-tight">
                00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
              </strong>
            </div>
            <button
              onClick={onToggleStreaming}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition ml-1"
              title={isStreaming ? 'Pause Auto Stream' : 'Resume Auto Stream'}
            >
              {isStreaming ? 'Pause' : 'Stream'}
            </button>
          </div>
        </div>

        {/* Center: Live Pipeline Status Pill */}
        <div className="hidden xl:flex items-center gap-3 text-xs bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Marketplace Stream
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">
            Active Leads: <strong className="text-white">{totalLeadsCount}</strong>
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400">Territories: PK &bull; US &bull; UK</span>
        </div>

        {/* Right: Quick Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Chime Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl text-xs transition border ${
              soundEnabled
                ? 'bg-blue-600/20 text-cyan-300 border-blue-500/30 hover:bg-blue-600/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Chime sound enabled on incoming leads' : 'Chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Client Responses / Inbound Inbox Button */}
          <button
            onClick={onOpenInbox}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs font-bold transition shadow-xs"
            title="Open Client Responses & Inbound Inbox"
          >
            <MessageSquare className="w-4 h-4 text-purple-300" />
            <span className="hidden sm:inline">Client Replies</span>
            {inboxUnreadCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-purple-500 px-1 text-[10px] font-black text-white shadow-sm">
                {inboxUnreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown (Requested Feature) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
              title="Recent Lead Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F1E36] border border-slate-700/90 shadow-2xl overflow-hidden z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <h4 className="font-extrabold text-sm text-white">Live Ingestion Feed</h4>
                  </div>
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-cyan-400 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onSelectLeadById(notif.leadId);
                          setShowNotifications(false);
                        }}
                        className="p-3.5 hover:bg-slate-800/50 cursor-pointer transition flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-blue-400/20 mt-0.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="font-bold text-xs text-white truncate">
                              {notif.businessName}
                            </h5>
                            <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                              {notif.timeAgo}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {notif.title} &bull; {notif.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No new lead alerts in the current session.
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400">
                    Incoming lead stream active &bull; Auto-syncs every 10s
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action: New Lead / Pitch */}
          <button
            onClick={onOpenNewLeadModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Pitch</span>
          </button>

          {/* Settings / Keys */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
            title="Configure APIs & Quotas"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
            title={theme === 'dark' ? 'Switch to Luxury Light Mode' : 'Switch to Executive Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-300" />}
          </button>

          {/* User Profile Pill (Salessage style) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center ring-2 ring-blue-500/30">
              SM
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-bold text-white leading-tight">Sameer</span>
              <span className="block text-[10px] text-slate-400">Lead Director</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
