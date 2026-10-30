'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Activity,
  History,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Monitor,
  UserCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function AdminActivityLogsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'system_events' | 'active_sessions'>('system_events');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuditData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/audit').then((r) => r.json()),
      fetch('/api/admin/subscriptions').then((r) => r.json()),
    ])
      .then(([auditData, subData]) => {
        if (auditData.success) {
          setSessions(auditData.sessions || []);
        }
        if (subData.success) {
          setHistory(subData.history || []);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const filteredHistory = history.filter((h) => {
    const term = searchTerm.toLowerCase();
    return (
      (h.action || '').toLowerCase().includes(term) ||
      (h.reason || '').toLowerCase().includes(term) ||
      (h.performedBy || '').toLowerCase().includes(term)
    );
  });

  const filteredSessions = sessions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.userName || '').toLowerCase().includes(term) ||
      (s.ipAddress || '').toLowerCase().includes(term) ||
      (s.deviceName || '').toLowerCase().includes(term) ||
      (s.location || '').toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout
      title="Administrative Activity & Audit Center"
      subtitle="Comprehensive immutable security trail tracking operator logins, subscription modifications, payment verifications, and device sessions."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('system_events')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'system_events'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-[#080d1a] text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Subscription & Customer Events ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('active_sessions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'active_sessions'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-[#080d1a] text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Admin Device Sessions ({sessions.length})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>
            <button
              onClick={fetchAuditData}
              className="p-2 bg-[#080d1a] border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: System Events */}
        {activeTab === 'system_events' && (
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Action Event</th>
                    <th className="py-3.5 px-4">Audit Memo / Description</th>
                    <th className="py-3.5 px-4">Operator / Performed By</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 font-mono">
                        Loading system audit records...
                      </td>
                    </tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 font-mono">
                        No activity records found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-850/30 transition">
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                              item.action === 'created'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : item.action === 'quota_adjusted'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                : item.action === 'extended'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : item.action === 'renewed'
                                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {item.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white">{item.reason}</div>
                          {item.newState && (
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              State snapshot: {JSON.stringify(item.newState)}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{item.performedBy}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Active Sessions */}
        {activeTab === 'active_sessions' && (
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Operator</th>
                    <th className="py-3.5 px-4">IP Address & ISP</th>
                    <th className="py-3.5 px-4">Device & OS</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Session Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-850/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{session.userName}</div>
                        <div className="text-[11px] font-mono text-slate-400 capitalize">{session.role}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        <div>{session.ipAddress}</div>
                        <div className="text-[10px] text-slate-500">{session.isp}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-white flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-slate-400" />
                          <span>{session.deviceName}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">{session.browser}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{session.location}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {session.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
