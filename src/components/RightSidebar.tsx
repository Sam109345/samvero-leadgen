'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Mail, 
  Building2, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ApiQuotaStatus } from '@/types';

interface RightSidebarProps {
  stats: {
    totalLeads: number;
    newBusinesses: number;
    noWebsiteCount: number;
  };
  onQuickSearch: (query: string, country?: string) => void;
  onOpenSettings: () => void;
}

export default function RightSidebar({
  stats,
  onQuickSearch,
  onOpenSettings,
}: RightSidebarProps) {
  const [quotas, setQuotas] = useState<ApiQuotaStatus[]>([]);
  const [loadingQuotas, setLoadingQuotas] = useState(false);

  const fetchQuotas = async () => {
    try {
      setLoadingQuotas(true);
      const res = await fetch('/api/quotas');
      const data = await res.json();
      if (data.success) {
        setQuotas(data.quotas);
      }
    } catch (e) {
      console.warn('Failed to load quotas');
    } finally {
      setLoadingQuotas(false);
    }
  };

  useEffect(() => {
    fetchQuotas();
  }, []);

  const quickPresets = [
    { label: 'Dental Clinics in Lahore', country: 'Pakistan', query: 'Dental' },
    { label: 'Video Editors (US Remote)', country: 'US', query: 'Video' },
    { label: 'Harley St Clinics London', country: 'UK', query: 'Clinic' },
    { label: 'Marble & Builders Karachi', country: 'Pakistan', query: 'Marble' },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Real-Time Platform Stats */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1877F2]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Pipeline Snapshot
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1877F2] border border-blue-100">
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">Total Leads</span>
            <span className="text-xl font-extrabold text-slate-900">{stats.totalLeads}</span>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-2.5 border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-medium block">New Opened</span>
            <span className="text-xl font-extrabold text-emerald-800">{stats.newBusinesses}</span>
          </div>

          <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-100 col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-800 font-medium block">
                  High-Yield Redesign Targets
                </span>
                <span className="text-xs text-amber-700">No active website detected</span>
              </div>
              <span className="text-2xl font-black text-amber-800">{stats.noWebsiteCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Rate Limiting & Quota Tracker */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              API Quota Safety
            </h3>
          </div>
          <button
            onClick={fetchQuotas}
            className="text-slate-400 hover:text-slate-600 transition"
            title="Refresh quotas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingQuotas ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-2">
          {quotas.length > 0 ? (
            quotas.slice(0, 3).map((q, idx) => (
              <div key={idx} className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-[11px] truncate max-w-[130px]">
                    {q.service}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                      q.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.status === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-[#1877F2]'
                    }`}
                  >
                    {q.isFallback ? 'Fallback' : `${q.remaining} left`}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      q.isFallback ? 'bg-[#1877F2]' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, ((q.dailyLimit - q.remaining) / q.dailyLimit) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-xs text-slate-400">Loading quota metrics...</div>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className="w-full text-center text-[11px] font-semibold text-[#1877F2] hover:underline flex items-center justify-center gap-1 pt-1"
        >
          <span>Configure Free API Keys</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Instant High-Yield Lead Presets */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm space-y-2.5">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          One-Click Market Filters
        </h3>

        <div className="space-y-1.5">
          {quickPresets.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickSearch(item.query, item.country)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-blue-50/80 border border-slate-100 hover:border-blue-200 text-left transition group"
            >
              <div className="text-xs">
                <span className="font-semibold text-slate-800 group-hover:text-[#1877F2] block">
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400">{item.country}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1877F2] transition" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
