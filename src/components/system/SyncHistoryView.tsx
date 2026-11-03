'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Layers,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SyncHistoryLog } from '@/lib/integrations/types';

export default function SyncHistoryView() {
  const [logs, setLogs] = useState<SyncHistoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/integrations/sync-history');
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setLogs(data.history);
      }
    } catch (err) {
      console.warn('Failed to load sync history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Filter & Search
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (
        platformFilter !== 'all' &&
        log.platformId !== platformFilter &&
        log.platformName !== platformFilter &&
        !log.platformName.toLowerCase().includes(platformFilter.toLowerCase())
      ) {
        return false;
      }
      if (statusFilter !== 'all' && log.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          log.platformName.toLowerCase().includes(q) ||
          log.query?.toLowerCase().includes(q) ||
          log.error?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, platformFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage]);

  const uniquePlatforms = useMemo(() => {
    const map = new Map<string, string>();
    logs.forEach((l) => map.set(l.platformId, l.platformName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Synchronization History & Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit logs of live background queries, records ingested, deduplication, and error diagnostics.
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-[#111c2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search platform, query keyword, error..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
          />
        </div>

        {/* Platform Filter */}
        <div>
          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
          >
            <option value="all">All Source Platforms</option>
            {uniquePlatforms.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
          >
            <option value="all">All Execution Statuses</option>
            <option value="success">Success</option>
            <option value="partial">Partial / Empty</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Sync Table */}
      <div className="bg-white dark:bg-[#111c2e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 select-none">
              <tr>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Execution Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Fetched</th>
                <th className="py-3 px-4">Saved</th>
                <th className="py-3 px-4">Duplicates Skipped</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                    <span>Loading sync audit trail...</span>
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No synchronization runs logged yet</p>
                    <p className="text-xs text-slate-400 mt-1">Start a discovery search to generate genuine sync audit entries.</p>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {log.platformName}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(log.startedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {log.status === 'success' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Success
                            </span>
                          ) : log.status === 'partial' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              No New Records
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {log.recordsFetched}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600">
                          {log.recordsSaved}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {log.duplicatesSkipped}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {log.durationMs}ms
                        </td>
                        <td className="py-3 px-4 text-right">
                          {log.error ? (
                            <button
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <span>Inspect Error</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Clean Run</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Error Details */}
                      {isExpanded && log.error && (
                        <tr className="bg-rose-50/50 dark:bg-rose-950/20">
                          <td colSpan={8} className="py-3 px-6 text-xs text-rose-900 dark:text-rose-200">
                            <div className="font-semibold mb-1">Diagnostic Error Message:</div>
                            <pre className="font-mono text-[11px] p-2 bg-white dark:bg-slate-900 rounded border border-rose-200 dark:border-rose-900 overflow-x-auto whitespace-pre-wrap">
                              {log.error}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages} ({filteredLogs.length} total runs)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-2 py-1 rounded border disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-2 py-1 rounded border disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
