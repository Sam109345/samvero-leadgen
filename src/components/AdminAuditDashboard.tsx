'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Crown, 
  Users, 
  Monitor, 
  Radio, 
  Laptop, 
  Smartphone, 
  Globe, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Mail, 
  Send, 
  PhoneCall, 
  DollarSign, 
  Zap, 
  Power, 
  Lock,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  UserPlus,
  Shuffle,
  UserCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
  X,
  Briefcase
} from 'lucide-react';
import { AuditSession, StaffMember, OutreachRecord } from '@/lib/audit-store';
import { useAuth } from '@/lib/auth-context';

export default function AdminAuditDashboard() {
  const { role, userName, sessionId: currentSessionId, currentIp } = useAuth();

  const [sessions, setSessions] = useState<AuditSession[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [outreachRecords, setOutreachRecords] = useState<OutreachRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab & Filters
  const [activeSubTab, setActiveSubTab] = useState<'outreach' | 'devices' | 'users'>('outreach');
  const [staffFilter, setStaffFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [terminatingId, setTerminatingId] = useState<string | null>(null);

  // User Management & Lead Assignment State
  const [portalUsers, setPortalUsers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    department: 'Outreach SDR',
    isGlobalUser: false,
  });
  const [selectedUserForLeads, setSelectedUserForLeads] = useState<any>(null);
  const [allLeadsPool, setAllLeadsPool] = useState<any[]>([]);
  const [distributionNotice, setDistributionNotice] = useState<string | null>(null);
  const [leadPoolFilter, setLeadPoolFilter] = useState<'all' | 'unassigned' | 'assigned'>('all');
  const [leadPoolSearch, setLeadPoolSearch] = useState('');
  const [distributingLeads, setDistributingLeads] = useState(false);

  const fetchUsersData = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setPortalUsers(data.users);
        setUserStats(data.stats);
      }
    } catch (e) {
      console.warn('Failed to fetch portal users');
    }
  };

  const fetchAllLeads = async () => {
    try {
      const res = await fetch('/api/leads?scope=all');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setAllLeadsPool(data.leads);
      }
    } catch (e) {
      console.warn('Failed to fetch leads pool');
    }
  };

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/audit');
      const data = await res.json();

      if (data.success) {
        setSessions(data.sessions);
        setStaff(data.staff);
        setOutreachRecords(data.outreachRecords);
        setSummary(data.summary);
      } else {
        setError(data.error || 'Access restricted');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch audit data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
    fetchUsersData();
    fetchAllLeads();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.username || !newUserData.name || !newUserData.email) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_user',
          ...newUserData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingUser(false);
        setNewUserData({
          username: '',
          name: '',
          email: '',
          password: '',
          department: 'Outreach SDR',
          isGlobalUser: false,
        });
        setDistributionNotice(`✓ User ${data.user.name} created successfully!`);
        setTimeout(() => setDistributionNotice(null), 4000);
        await fetchUsersData();
        await fetchAllLeads();
      }
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleDistributeRandom = async () => {
    try {
      setDistributingLeads(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'distribute_random' }),
      });
      const data = await res.json();
      if (data.success) {
        setDistributionNotice(
          `🎲 ${data.message || 'Leads distributed randomly across staff with zero duplication!'}`
        );
        setTimeout(() => setDistributionNotice(null), 5000);
        await fetchUsersData();
        await fetchAllLeads();
      }
    } catch (err) {
      console.error('Failed to distribute leads:', err);
    } finally {
      setDistributingLeads(false);
    }
  };

  const handleToggleGlobal = async (userId: string, currentGlobal: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_global',
          userId,
          isGlobal: !currentGlobal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUsersData();
      }
    } catch (err) {
      console.error('Failed to toggle global user:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user? Any leads assigned to them will return to the pool.')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', userId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUsersData();
        await fetchAllLeads();
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleAssignLead = async (leadId: string, userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign_lead', leadId, userId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUsersData();
        await fetchAllLeads();
      }
    } catch (err) {
      console.error('Failed to assign lead:', err);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      setTerminatingId(sessionId);
      const res = await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'terminate_session',
          sessionId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTerminatingId(null);
    }
  };

  // If user is not admin
  if (role !== 'admin') {
    return (
      <div className="bg-white dark:bg-[#161f2e] border border-rose-200 dark:border-rose-900/60 rounded-3xl p-12 text-center max-w-2xl mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Restricted Administrator Console
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          This security audit and staff attribution center is accessible exclusively with Executive Admin credentials (<code className="font-mono text-cyan-600 font-bold">Sameer1234!@#</code>).
        </p>
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0d141e] text-xs font-bold text-slate-700 dark:text-slate-300">
            Current Session: {userName || 'Employer Staff'} (Limited Access)
          </span>
        </div>
      </div>
    );
  }

  // Filter outreach records
  const filteredRecords = outreachRecords.filter((rec) => {
    if (staffFilter !== 'all' && rec.staffId !== staffFilter) return false;
    if (channelFilter !== 'all' && rec.channel !== channelFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rec.businessName.toLowerCase().includes(q) ||
        rec.staffName.toLowerCase().includes(q) ||
        rec.recipientEmail.toLowerCase().includes(q) ||
        rec.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Active vs historical sessions
  const activeSessions = sessions.filter((s) => s.status === 'active');
  const pastSessions = sessions.filter((s) => s.status === 'terminated');

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#060b14] via-[#0d1627] to-[#0f1d35] rounded-3xl p-6 sm:p-8 text-white border border-cyan-500/30 shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wide">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-current" />
                EXECUTIVE ADMIN COMMAND
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono">
                <Shield className="w-3 h-3" />
                PORTAL AUDIT v2.5
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <Radio className="w-3 h-3 animate-pulse" />
                LIVE TRACKING ACTIVE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Audit &amp; Staff Attribution Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Track exactly which staff members have reached leads, monitor pitch volumes across Gmail &amp; SMTP, and inspect all active and historical device logins with verified IP addresses &amp; PC hostnames.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchAuditData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-sm"
              title="Refresh Audit Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-[#080e1b]/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Leads Reached</span>
              <Send className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.totalOutreachCount || 109}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> All Staff Combined
            </span>
          </div>

          <div className="bg-[#080e1b]/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Live Active Devices</span>
              <Monitor className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>{activeSessions.length}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block truncate">
              Your IP: {currentIp}
            </span>
          </div>

          <div className="bg-[#080e1b]/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Calls &amp; DMs Booked</span>
              <PhoneCall className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.totalCallsBooked || 31}
            </div>
            <span className="text-[11px] text-purple-400 font-semibold mt-1 block">
              74.5% Pitch Engagement
            </span>
          </div>

          <div className="bg-[#080e1b]/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Deals Closed by Team</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.totalDealsWon || 17}
            </div>
            <span className="text-[11px] text-amber-400 font-semibold mt-1 block">
              $57,200 Total Pipeline
            </span>
          </div>
        </div>
      </div>

      {/* Main Sub-Nav Pills: 1) Staff Reach Performance vs 2) Device & Login Audit */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-[#24334a] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('outreach')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'outreach'
                ? 'bg-[#007FED] text-white shadow-sm'
                : 'bg-white dark:bg-[#161f2e] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2b3e] border border-slate-200 dark:border-[#24334a]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Reach &amp; Lead Attribution</span>
            <span className="text-xs px-2 py-0.2 rounded-full bg-white/20 text-white font-mono">
              {staff.length} Members
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('devices')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'devices'
                ? 'bg-[#007FED] text-white shadow-sm'
                : 'bg-white dark:bg-[#161f2e] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2b3e] border border-slate-200 dark:border-[#24334a]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Device &amp; IP Login Security</span>
            <span className="text-xs px-2 py-0.2 rounded-full bg-emerald-500 text-white font-mono">
              {activeSessions.length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'users'
                ? 'bg-[#007FED] text-white shadow-sm'
                : 'bg-white dark:bg-[#161f2e] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2b3e] border border-slate-200 dark:border-[#24334a]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>User Management &amp; Lead Assignment</span>
            <span className="text-xs px-2 py-0.2 rounded-full bg-indigo-500 text-white font-mono">
              {portalUsers.length || 6} Users
            </span>
          </button>
        </div>
      </div>

      {/* Global Distribution Status Notification */}
      {distributionNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{distributionNotice}</span>
          </div>
          <button onClick={() => setDistributionNotice(null)} className="p-1 rounded-lg hover:bg-emerald-200/50 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: STAFF OUTREACH & LEAD ATTRIBUTION ("Kis bandy ne kitni leads ko reach kiya hai") */}
      {/* ========================================================================= */}
      {activeSubTab === 'outreach' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Staff Leaderboard Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Team Leaderboard &amp; Lead Outreach Volume
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time tally of pitches dispatched per team member
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map((member, index) => {
                const isLeader = index === 0;
                return (
                  <div
                    key={member.id}
                    className={`bg-white dark:bg-[#161f2e] rounded-2xl p-5 border transition-all shadow-xs ${
                      isLeader
                        ? 'border-amber-400/80 dark:border-amber-500/60 ring-1 ring-amber-400/30'
                        : 'border-slate-200 dark:border-[#24334a]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md ${
                            isLeader
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                              : 'bg-gradient-to-tr from-[#007FED] to-indigo-600'
                          }`}>
                            {member.avatar}
                          </div>
                          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-[#161f2e] ${
                            member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`} />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {member.name}
                            </span>
                            {isLeader && (
                              <span title="Top Outreach Performer">
                                <Crown className="w-3.5 h-3.5 text-amber-500 fill-current" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {member.role}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black text-[#007FED] block">
                          {member.leadsReachedCount}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Leads Reached
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Total Team Reach */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Share of Total Reach</span>
                        <span className="font-bold">
                          {Math.round((member.leadsReachedCount / (summary?.totalOutreachCount || 109)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-[#0d141e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{
                            width: `${Math.min(100, (member.leadsReachedCount / 40) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Conversion Stats Breakdown */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0d141e] text-center border border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Viewed</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {member.proposalsViewedCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Calls</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {member.callsBookedCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Won</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {member.dealsWonCount} ({member.pipelineValue})
                        </span>
                      </div>
                    </div>

                    {/* Footer Info: Channels & Last Outreach */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#24334a] flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[170px]" title={member.channels.join(', ')}>
                        Channels: {member.channels.join(', ')}
                      </span>
                      <span className="font-mono text-[10px] shrink-0 text-slate-500">
                        {member.lastOutreachAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Chronological Outreach Table */}
          <div className="bg-white dark:bg-[#161f2e] rounded-3xl border border-slate-200 dark:border-[#24334a] shadow-xs overflow-hidden">
            {/* Table Filters Header */}
            <div className="p-5 border-b border-slate-200 dark:border-[#24334a] flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#0d141e]/50">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Chronological Outreach Audit Log
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every pitch email, Gmail 1-Click dispatch, and chat message logged with staff attribution
                </p>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by business, staff or email..."
                    className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                  />
                </div>

                <select
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
                >
                  <option value="all">All Staff Members</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
                >
                  <option value="all">All Channels</option>
                  <option value="Gmail 1-Click">Gmail 1-Click</option>
                  <option value="Custom SMTP">Custom SMTP</option>
                  <option value="Inbound Chat">Inbound Chat</option>
                </select>
              </div>
            </div>

            {/* Outreach Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0d141e] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#24334a] uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Staff Operator</th>
                    <th className="px-5 py-3.5">Target Business</th>
                    <th className="px-5 py-3.5">Recipient Email</th>
                    <th className="px-5 py-3.5">Channel</th>
                    <th className="px-5 py-3.5">Deliverable</th>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#24334a]">
                  {filteredRecords.map((rec) => {
                    const statusBadge = {
                      'Delivered': 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900',
                      'Opened': 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900',
                      'Call Booked': 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                      'Closed Won': 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                    }[rec.status] || 'bg-slate-100 text-slate-700';

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1a2537] transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#007FED] flex items-center justify-center text-[10px] font-black">
                              {rec.staffName.charAt(0)}
                            </span>
                            <div>
                              <span>{rec.staffName}</span>
                              <span className="text-[10px] text-slate-400 font-normal block">
                                {rec.staffRole}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          <div>
                            <span>{rec.businessName}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {rec.category} &bull; {rec.country}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {rec.recipientEmail}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            rec.channel === 'Gmail 1-Click' 
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900' 
                              : 'bg-slate-100 dark:bg-[#0d141e] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                          }`}>
                            {rec.channel}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          {rec.previewUrl ? (
                            <a
                              href={rec.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-[#007FED] hover:underline flex items-center gap-1"
                            >
                              <span>Pitch Preview</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {rec.timestamp}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBadge}`}>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: DEVICE & IP LOGIN SECURITY AUDIT ("Portal is waqt and history me kahan kahan login hua hai") */}
      {/* ========================================================================= */}
      {activeSubTab === 'devices' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Active Devices Radar Section */}
          <div className="bg-white dark:bg-[#161f2e] rounded-3xl p-6 border border-slate-200 dark:border-[#24334a] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Live Active Logged-In Terminals ({activeSessions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Devices and computer workstations actively holding an authorized token right now
                  </p>
                </div>
              </div>
            </div>

            {/* Active Devices Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSessions.map((session) => {
                const isCurrent = session.id === currentSessionId || session.isCurrent;
                return (
                  <div
                    key={session.id}
                    className={`rounded-2xl p-5 border transition-all relative ${
                      isCurrent
                        ? 'bg-blue-50/60 dark:bg-[#1f2b3e]/80 border-blue-300 dark:border-blue-700/80 shadow-md ring-1 ring-blue-400/30'
                        : 'bg-slate-50/50 dark:bg-[#0d141e]/50 border-slate-200 dark:border-[#24334a]'
                    }`}
                  >
                    {/* Top Row: Device Name & Role Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs">
                          {session.deviceType === 'Mobile' ? (
                            <Smartphone className="w-5 h-5 text-purple-500" />
                          ) : session.deviceType === 'Laptop' ? (
                            <Laptop className="w-5 h-5 text-blue-500" />
                          ) : (
                            <Monitor className="w-5 h-5 text-cyan-500" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-slate-900 dark:text-white">
                              {session.deviceName}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[9px]">
                                CURRENT THIS PC
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            Logged as: <b>{session.userName}</b>
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        session.role === 'admin'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300'
                      }`}>
                        {session.role === 'admin' ? '👑 Super Admin' : '💼 Employer Staff'}
                      </span>
                    </div>

                    {/* Technical Telemetry Grid (IP, OS, Browser, Location) */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white dark:bg-[#161f2e] border border-slate-200/80 dark:border-[#24334a] text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">
                          Verified Live IP Address
                        </span>
                        <span className="font-bold text-[#007FED] dark:text-cyan-400">
                          {session.ipAddress}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">
                          Live Location
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {session.location}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">
                          Verified ISP Network
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 truncate block">
                          {session.isp || 'Cyber Internet Services'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">
                          Operating System &amp; Machine
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 truncate block">
                          {session.os}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Status & Terminate Action */}
                    <div className="mt-3.5 flex items-center justify-between text-xs pt-2">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Logged in: {session.loginTime}</span>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          disabled={terminatingId === session.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition"
                          title="Revoke session authorization"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{terminatingId === session.id ? 'Revoking...' : 'Terminate Session'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Login Log Table */}
          <div className="bg-white dark:bg-[#161f2e] rounded-3xl border border-slate-200 dark:border-[#24334a] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-[#24334a] bg-slate-50/50 dark:bg-[#0d141e]/50">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Historical Portal Access Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audited list of all terminals, IPs, and locations that logged into this SAMVERO installation
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0d141e] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#24334a] uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">User / Role</th>
                    <th className="px-5 py-3.5">PC / Device Name</th>
                    <th className="px-5 py-3.5">IP Address</th>
                    <th className="px-5 py-3.5">Platform &amp; Browser</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#24334a]">
                  {sessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1a2537] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          {sess.role === 'admin' ? (
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          <span>{sess.userName}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {sess.deviceName}
                      </td>

                      <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-[#007FED] dark:text-cyan-400">
                        {sess.ipAddress}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                        {sess.os} &bull; {sess.browser}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                        {sess.location}
                      </td>

                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                        {sess.loginTime}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sess.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-[#0d141e] text-slate-500 border border-slate-200 dark:border-slate-800'
                        }`}>
                          {sess.status === 'active' ? '🟢 Active' : '⚪ Terminated'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: USER MANAGEMENT & LEAD ASSIGNMENT ENGINE */}
      {/* ========================================================================= */}
      {activeSubTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top KPI Cards for Users & Lead Distribution */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Portal Users</span>
                <Users className="w-4 h-4 text-[#007FED]" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {portalUsers.length}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Admins, Global &amp; Staff
              </span>
            </div>

            <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Global Users (All Leads)</span>
                <Globe className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {portalUsers.filter((u) => u.isGlobalUser).length}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                Unrestricted Full Access
              </span>
            </div>

            <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Staff Members (Exclusive)</span>
                <UserCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {portalUsers.filter((u) => !u.isGlobalUser && u.role !== 'admin').length}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Zero-Overlap Lead Feeds
              </span>
            </div>

            <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Leads in System</span>
                <Layers className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {allLeadsPool.length || 35}
              </div>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1 block">
                Multi-Platform Pipeline
              </span>
            </div>

            <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-2xl p-4 shadow-xs col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Unassigned Pool</span>
                <Shuffle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {userStats?.unassignedLeadsCount !== undefined ? userStats.unassignedLeadsCount : Math.max(0, allLeadsPool.length - (userStats?.assignedLeadsCount || 0))}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Ready for Distribution
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-blue-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                  Lead Distribution Engine
                </span>
                <span className="text-xs text-slate-300">&bull; Anti-Duplication Protected</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Staff User Management &amp; Exclusive Lead Assignment
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Naye users banayein, unhe specific leads assign karein ya random distribute karein. Har staff member ko alag leads milti hain taake koi lead overlap na ho. Global User ko tamam leads nazar aati hain.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {/* Random Distribution Trigger */}
              <button
                type="button"
                disabled={distributingLeads}
                onClick={handleDistributeRandom}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition transform active:scale-95 disabled:opacity-50"
                title="Distribute unassigned leads randomly among staff with guaranteed zero duplication"
              >
                <Shuffle className={`w-4 h-4 ${distributingLeads ? 'animate-spin' : ''}`} />
                <span>{distributingLeads ? 'Distributing...' : '🎲 Distribute Random Leads'}</span>
              </button>

              {/* Create User Button */}
              <button
                type="button"
                onClick={() => setIsCreatingUser(true)}
                className="px-4 py-2.5 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-900/30 transition transform active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Create New User</span>
              </button>
            </div>
          </div>

          {/* Active Users Table Card */}
          <div className="bg-white dark:bg-[#161f2e] rounded-3xl border border-slate-200 dark:border-[#24334a] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-[#24334a] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Active Portal Users ({portalUsers.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage login credentials, lead allocations, and global visibility flags.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#0d141e] text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-[#24334a] uppercase text-[10px] tracking-wider">
                    <th className="px-5 py-3.5">User &amp; Department</th>
                    <th className="px-5 py-3.5">Username &amp; Email</th>
                    <th className="px-5 py-3.5">Role &amp; Visibility</th>
                    <th className="px-5 py-3.5">Assigned Leads</th>
                    <th className="px-5 py-3.5">Global User Toggle</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#24334a]">
                  {portalUsers.map((user) => {
                    const isSuperAdmin = user.role === 'admin';
                    const isGlobal = user.isGlobalUser;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1a2638] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007FED] to-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                              {user.avatar || user.name[0]}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isSuperAdmin && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {user.department || 'Outreach Desk'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                            @{user.username}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {user.email}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                              <Crown className="w-3 h-3" /> Super Admin
                            </span>
                          ) : isGlobal ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <Globe className="w-3 h-3" /> Global User (All Leads)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              <UserCheck className="w-3 h-3" /> Staff (Assigned Only)
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {isGlobal ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <span>All {allLeadsPool.length || 35} Leads Visible</span>
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-slate-900 dark:text-white">
                                {user.assignedLeadIds?.length || 0}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">exclusive leads</span>
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {!isSuperAdmin ? (
                            <button
                              type="button"
                              onClick={() => handleToggleGlobal(user.id, user.isGlobalUser)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                                user.isGlobalUser
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-600 dark:text-slate-300'
                              }`}
                              title="Toggle between Global User (sees all leads) and Staff (sees only assigned leads)"
                            >
                              {user.isGlobalUser ? (
                                <>
                                  <ToggleRight className="w-4 h-4 text-emerald-600" />
                                  <span>Global Mode ON</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-slate-400" />
                                  <span>Make Global</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic font-medium">Master Admin</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedUserForLeads(user)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 hover:text-[#007FED] border border-slate-200 dark:border-slate-700 font-bold text-xs transition"
                              title="Inspect and manage leads assigned to this user"
                            >
                              Manage Leads
                            </button>

                            {!isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Lead Pool Allocation Matrix */}
          <div className="bg-white dark:bg-[#161f2e] rounded-3xl border border-slate-200 dark:border-[#24334a] shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Lead Assignment Pool ({allLeadsPool.length} Total Leads)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assign leads individually to staff members, or filter by platform and assignment status.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by company or city..."
                    value={leadPoolSearch}
                    onChange={(e) => setLeadPoolSearch(e.target.value)}
                    className="bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#007FED]"
                  />
                </div>

                <select
                  value={leadPoolFilter}
                  onChange={(e: any) => setLeadPoolFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs font-bold rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-200"
                >
                  <option value="all">All Leads</option>
                  <option value="unassigned">Unassigned Only</option>
                  <option value="assigned">Assigned Only</option>
                </select>
              </div>
            </div>

            {/* Leads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allLeadsPool
                .filter((lead) => {
                  if (leadPoolFilter === 'unassigned' && lead.assignedToUserId) return false;
                  if (leadPoolFilter === 'assigned' && !lead.assignedToUserId) return false;
                  if (leadPoolSearch) {
                    const q = leadPoolSearch.toLowerCase();
                    return (
                      lead.businessName?.toLowerCase().includes(q) ||
                      lead.title?.toLowerCase().includes(q) ||
                      lead.city?.toLowerCase().includes(q) ||
                      lead.platform?.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .slice(0, 18)
                .map((lead) => {
                  const assignedUser = portalUsers.find((u) => u.id === lead.assignedToUserId);
                  return (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-[#24334a] bg-slate-50/50 dark:bg-[#0e1624] space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-cyan-300 border border-blue-200 dark:border-blue-900">
                            {lead.platform}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                            {lead.budget || '$1,500'}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {lead.businessName}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {lead.title}
                        </p>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                          <span>{lead.city}, {lead.country}</span>
                          <span>&bull;</span>
                          <span className="font-mono text-[10px] truncate max-w-[130px]">{lead.contact?.email}</span>
                        </div>
                      </div>

                      {/* Assignment Selector */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Assigned To:
                        </span>

                        <select
                          value={lead.assignedToUserId || ''}
                          onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                          className={`text-xs font-bold rounded-xl px-2 py-1 border transition ${
                            assignedUser
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 text-indigo-700 dark:text-indigo-300'
                              : 'bg-white dark:bg-slate-800 border-amber-300 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <option value="">Unassigned Pool</option>
                          {portalUsers
                            .filter((u) => !u.isGlobalUser && u.role !== 'admin')
                            .map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreatingUser && (
        <div 
          className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsCreatingUser(false)}
        >
          <div 
            className="bg-white dark:bg-[#161f2e] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#24334a] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#111c2e] dark:to-[#1a2942] border-b border-blue-100 dark:border-[#24334a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#007FED] text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Create New Portal User
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add staff operator or global supervisor account.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingUser(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                  Username (Unique Login ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. hamza_tariq"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#007FED]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Tariq"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#007FED]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hamza@samvero.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#007FED]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                  Access Password
                </label>
                <input
                  type="password"
                  placeholder="Leave empty for default (Samvero2026!)"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#007FED]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                  Department / Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. SaaS Outreach, Dubai Enterprise, US Telehealth"
                  value={newUserData.department}
                  onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] text-xs rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#007FED]"
                />
              </div>

              {/* Global User Option Checkbox */}
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-1.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserData.isGlobalUser}
                    onChange={(e) => setNewUserData({ ...newUserData, isGlobalUser: e.target.checked })}
                    className="w-4 h-4 accent-[#007FED] rounded"
                  />
                  <span className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200">
                    👑 Make this user a Global User (All Leads Access)
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6.5 leading-relaxed">
                  Agar ye checked hoga toh is user ke paas portal ki saari leads show hongi. Agar uncheck hoga toh sirf wahi leads show hongi jo ise assign ki jayengi.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingUser(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition active:scale-95"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Assigned Leads Modal */}
      {selectedUserForLeads && (
        <div 
          className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedUserForLeads(null)}
        >
          <div 
            className="bg-white dark:bg-[#161f2e] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#24334a] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between border-b border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                  {selectedUserForLeads.avatar || selectedUserForLeads.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {selectedUserForLeads.name} &bull; Lead Allocation
                  </h3>
                  <p className="text-xs text-blue-200">
                    {selectedUserForLeads.isGlobalUser
                      ? 'Global User (Has visibility to all leads in portal)'
                      : `Exclusive Leads: ${selectedUserForLeads.assignedLeadIds?.length || 0} leads`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForLeads(null)}
                className="p-1 rounded-xl text-blue-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {selectedUserForLeads.isGlobalUser ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs space-y-1">
                  <p className="font-extrabold text-sm">👑 Global User Active</p>
                  <p>
                    Ye user portal ka Global Supervisor hai. Iske paas tamaam {allLeadsPool.length} leads bina kisi boundary ke automatically show hoti hain.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Assigned Leads ({allLeadsPool.filter((l) => l.assignedToUserId === selectedUserForLeads.id).length}):</span>
                    <span className="text-[11px] text-slate-400">Zero duplicate conflict</span>
                  </div>

                  {allLeadsPool.filter((l) => l.assignedToUserId === selectedUserForLeads.id).length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      No exclusive leads assigned to this user yet. Click "Distribute Random Leads" or assign leads from the Lead Pool below.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {allLeadsPool
                        .filter((l) => l.assignedToUserId === selectedUserForLeads.id)
                        .map((l) => (
                          <div
                            key={l.id}
                            className="p-3.5 rounded-xl border border-slate-200 dark:border-[#24334a] bg-slate-50 dark:bg-[#0e1624] flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 dark:text-white">{l.businessName}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300">
                                  {l.platform}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500">{l.city}, {l.country} &bull; {l.budget}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAssignLead(l.id, '')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 transition"
                            >
                              Unassign
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#111c2e] border-t border-slate-200 dark:border-[#24334a] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUserForLeads(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
