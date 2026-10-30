'use client';

import React from 'react';
import {
  User,
  Shield,
  Crown,
  Key,
  Globe2,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ProfileView() {
  const { role, userName, sessionId, logout } = useAuth();
  const isGlobalUser = role === 'admin';
  const userId = sessionId ? sessionId.slice(0, 12) : 'usr-admin';

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1200px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
            Security & Identity
          </span>
          <span className="text-xs text-slate-500 font-bold">Authenticated Portal Session</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Operator Profile & Access</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Current operator permissions, lead visibility scope, and multi-factor authentication status
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-md">
            {userName ? userName.slice(0, 2).toUpperCase() : 'OP'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black">{userName || 'Executive Operator'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-cyan-300">
                {role || 'staff'}
              </span>
            </div>
            <p className="text-xs text-slate-500">ID: {userId || 'usr-default'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Territory Visibility</div>
            <div className="font-extrabold flex items-center gap-1.5 text-blue-600 dark:text-cyan-400">
              <Globe2 className="w-4 h-4" />
              <span>{isGlobalUser ? 'Global (All 50+ Platforms)' : 'Assigned Territory Desk'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Access Level</div>
            <div className="font-extrabold flex items-center gap-1.5 text-emerald-600">
              <Shield className="w-4 h-4" />
              <span>{role === 'admin' ? 'Super Admin Privileges' : 'Staff Acquisition Desk'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Session Status</div>
            <div className="font-extrabold flex items-center gap-1.5 text-teal-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Active & Audited</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Audit logging: All lead dispatches and stage transitions are signed with operator credentials.
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 text-xs font-bold rounded-xl transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
