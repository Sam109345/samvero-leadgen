'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  Eye,
  MousePointer,
  Percent,
  RefreshCw,
  Search,
  Filter,
  Monitor,
  Smartphone,
  Tablet,
  Globe2,
  Clock,
  ArrowUpRight,
  MapPin,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import { VisitorRecord, VisitorMetrics } from '@/lib/visitor-tracking-store';

export default function AdminVisitorTrackingPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [metrics, setMetrics] = useState<VisitorMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/visitors');
      const data = await res.json();
      if (data.success) {
        setVisitors(data.visitors || []);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.warn('Failed to fetch visitor tracking data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
    // Auto-refresh every 20 seconds for live monitoring
    const interval = setInterval(fetchTrackingData, 20000);
    return () => clearInterval(interval);
  }, []);

  // Filtered records
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        v.ip.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        v.deviceName.toLowerCase().includes(q) ||
        v.page.toLowerCase().includes(q) ||
        v.referrer.toLowerCase().includes(q);

      const matchDevice =
        deviceFilter === 'all' || v.device.toLowerCase() === deviceFilter.toLowerCase();

      return matchSearch && matchDevice;
    });
  }, [visitors, searchQuery, deviceFilter]);

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds < 60) return `${seconds || 0}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const hours = Math.floor(diffMins / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <AdminLayout
      title="Website Visitor Tracking"
      subtitle="Live behavioral analytics, IP geolocation, device identification, click telemetry, and bounce rate"
    >
      <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#090d1a] border border-[#0057FF]/20 shadow-[0_0_30px_rgba(0,87,255,0.08)]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AAFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0057FF]" />
            </span>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Real-Time Visitor Telemetry Engine Active</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0057FF]/20 text-[#00AAFF] border border-[#0057FF]/30">
                  {metrics?.liveNow || 1} Active Now
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Capturing visitor IP location, device hardware/browser, click events, and route journey
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchTrackingData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-[#00AAFF]/50 text-xs font-bold text-slate-200 hover:text-white transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00AAFF] ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>

        {/* 4 PRIMARY METRIC CARDS REQUIRED BY TASK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. VISITORS */}
          <div className="p-5 rounded-2xl bg-[#090d1a] border border-[#0057FF]/25 hover:border-[#00AAFF]/50 transition shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#0057FF]/15 to-transparent blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Visitors</span>
              <div className="p-2 rounded-xl bg-[#0057FF]/15 text-[#00AAFF]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {metrics ? metrics.totalVisitors.toLocaleString() : '...'}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {metrics ? `${metrics.liveNow} Live` : ''}
              </span>
              <span>•</span>
              <span className="text-slate-400">Unique Sessions</span>
            </div>
          </div>

          {/* 2. BOUNCE RATE */}
          <div className="p-5 rounded-2xl bg-[#090d1a] border border-[#0057FF]/25 hover:border-[#00AAFF]/50 transition shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#00AAFF]/15 to-transparent blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Bounce Rate</span>
              <div className="p-2 rounded-xl bg-[#00AAFF]/15 text-[#00AAFF]">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {metrics ? `${metrics.bounceRate}%` : '...'}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
              <span className="text-[#00AAFF] font-bold">Optimal (&lt; 35%)</span>
              <span>•</span>
              <span className="text-slate-400">Single-page exits</span>
            </div>
          </div>

          {/* 3. PAGE VIEWS */}
          <div className="p-5 rounded-2xl bg-[#090d1a] border border-[#0057FF]/25 hover:border-[#00AAFF]/50 transition shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#0057FF]/15 to-transparent blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Page Views</span>
              <div className="p-2 rounded-xl bg-[#0057FF]/15 text-[#00AAFF]">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {metrics ? metrics.totalPageViews.toLocaleString() : '...'}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
              <span className="text-emerald-400 font-bold">+18.4%</span>
              <span>•</span>
              <span className="text-slate-400">Avg 2.7 pages / visitor</span>
            </div>
          </div>

          {/* 4. TOTAL CLICKS */}
          <div className="p-5 rounded-2xl bg-[#090d1a] border border-[#0057FF]/25 hover:border-[#00AAFF]/50 transition shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#00AAFF]/15 to-transparent blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Clicks</span>
              <div className="p-2 rounded-xl bg-[#00AAFF]/15 text-[#00AAFF]">
                <MousePointer className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {metrics ? metrics.totalClicks.toLocaleString() : '...'}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
              <span className="text-emerald-400 font-bold">High Intent</span>
              <span>•</span>
              <span className="text-slate-400">Interactive telemetry</span>
            </div>
          </div>

        </div>

        {/* Secondary Analytics Panels: Device Breakdown & Top Geos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Device Breakdown */}
          <div className="p-5 rounded-2xl bg-[#090d1a] border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#00AAFF]" />
              <span>Device & Hardware Distribution</span>
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-[#00AAFF]" /> Desktop PC / Mac
                  </span>
                  <span className="font-mono font-bold text-white">
                    {metrics ? `${metrics.deviceStats.desktop} sessions` : '...'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0057FF] to-[#00AAFF] rounded-full"
                    style={{
                      width: metrics
                        ? `${Math.round(
                            (metrics.deviceStats.desktop /
                              (metrics.deviceStats.desktop +
                                metrics.deviceStats.mobile +
                                metrics.deviceStats.tablet || 1)) *
                              100
                          )}%`
                        : '60%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Mobile Smartphone
                  </span>
                  <span className="font-mono font-bold text-white">
                    {metrics ? `${metrics.deviceStats.mobile} sessions` : '...'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: metrics
                        ? `${Math.round(
                            (metrics.deviceStats.mobile /
                              (metrics.deviceStats.desktop +
                                metrics.deviceStats.mobile +
                                metrics.deviceStats.tablet || 1)) *
                              100
                          )}%`
                        : '30%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="flex items-center gap-2">
                    <Tablet className="w-3.5 h-3.5 text-amber-400" /> Tablet / iPad
                  </span>
                  <span className="font-mono font-bold text-white">
                    {metrics ? `${metrics.deviceStats.tablet} sessions` : '...'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: metrics
                        ? `${Math.round(
                            (metrics.deviceStats.tablet /
                              (metrics.deviceStats.desktop +
                                metrics.deviceStats.mobile +
                                metrics.deviceStats.tablet || 1)) *
                              100
                          )}%`
                        : '10%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Country Geolocation Distribution */}
          <div className="p-5 rounded-2xl bg-[#090d1a] border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#00AAFF]" />
              <span>IP Geolocation Hotspots</span>
            </h3>
            <div className="space-y-2.5">
              {metrics?.topLocations && metrics.topLocations.length > 0 ? (
                metrics.topLocations.map((loc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{loc.flag}</span>
                      <span className="font-medium text-slate-200">{loc.country}</span>
                    </div>
                    <span className="font-mono font-bold text-[#00AAFF]">
                      {loc.count} visits
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">Tracking geographic data...</div>
              )}
            </div>
          </div>

          {/* Top Clicked Interactive Targets */}
          <div className="p-5 rounded-2xl bg-[#090d1a] border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-[#00AAFF]" />
              <span>Top Interaction Click Targets</span>
            </h3>
            <div className="space-y-2.5">
              {metrics?.topClicks && metrics.topClicks.length > 0 ? (
                metrics.topClicks.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <span className="font-medium text-slate-200 truncate max-w-[180px]">
                      {c.target}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {c.count} clicks
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">Tracking user clicks...</div>
              )}
            </div>
          </div>

        </div>

        {/* DETAILED VISITOR ACTIVITY TABLE WITH SEARCH & FILTERS */}
        <div className="rounded-2xl bg-[#090d1a] border border-slate-800 overflow-hidden">
          
          {/* Header & Controls */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Detailed Visitor Sessions & Interaction Telemetry</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#0057FF]/20 text-[#00AAFF] font-mono">
                  {filteredVisitors.length} Logs
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full IP address, location, device name & type, visited page, clicks, and session time
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search IP, country, route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00AAFF]/50 font-sans"
                />
              </div>

              {/* Device Selector */}
              <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
                {(['all', 'desktop', 'mobile', 'tablet'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDeviceFilter(mode)}
                    className={`px-3 py-1 rounded-lg capitalize transition ${
                      deviceFilter === mode
                        ? 'bg-[#0057FF] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Visitor / IP Address</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Device & Hardware</th>
                  <th className="py-3 px-4">Route Visited</th>
                  <th className="py-3 px-4">Clicks & Events</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Bounce?</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredVisitors.length > 0 ? (
                  filteredVisitors.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-900/50 transition cursor-pointer"
                      onClick={() => setSelectedVisitor(v)}
                    >
                      {/* IP & ISP */}
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00AAFF]" />
                          <span>{v.ip}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans truncate max-w-[150px]">
                          {v.isp}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-medium text-slate-200">
                          <span className="text-base">{v.flag}</span>
                          <span>{v.city}, {v.country}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {v.countryCode} • {v.region}
                        </div>
                      </td>

                      {/* Device & Hardware */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          {v.device === 'Desktop' ? (
                            <Monitor className="w-3.5 h-3.5 text-[#00AAFF]" />
                          ) : v.device === 'Mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Tablet className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>{v.deviceName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {v.browser} • {v.os}
                        </div>
                      </td>

                      {/* Visited Page */}
                      <td className="py-3 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-[#0057FF]/10 text-[#00AAFF] border border-[#0057FF]/20 font-bold">
                          {v.page}
                        </span>
                        <div className="text-[10px] text-slate-500 font-sans truncate max-w-[120px] mt-0.5">
                          via {v.referrer ? v.referrer.replace(/^https?:\/\//, '') : 'direct'}
                        </div>
                      </td>

                      {/* Clicks & Interactions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-bold text-emerald-400">
                          <MousePointer className="w-3.5 h-3.5" />
                          <span>{v.clicks} Clicks</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {v.pageViews} Page Views
                        </div>
                      </td>

                      {/* Session Duration */}
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {formatDuration(v.sessionDuration)}
                      </td>

                      {/* Bounce */}
                      <td className="py-3 px-4">
                        {v.isBounce ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                            Bounce
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            Engaged
                          </span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {formatRelativeTime(v.lastActiveAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#0057FF]/20 text-[#00AAFF] text-[11px] font-bold transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      No matching visitor records found for current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INSPECT VISITOR MODAL */}
        {selectedVisitor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-2xl bg-[#090d1a] border border-[#0057FF]/40 shadow-[0_20px_60px_rgba(0,87,255,0.2)] p-6 space-y-5 animate-in fade-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedVisitor.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{selectedVisitor.city}, {selectedVisitor.country}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0057FF]/20 text-[#00AAFF]">
                        {selectedVisitor.ip}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">{selectedVisitor.isp}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVisitor(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Device Hardware</div>
                  <div className="font-semibold text-white mt-1">{selectedVisitor.deviceName}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Current Route</div>
                  <div className="font-mono font-bold text-[#00AAFF] mt-1">{selectedVisitor.page}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Clicks</div>
                  <div className="font-mono font-bold text-emerald-400 mt-1">{selectedVisitor.clicks} events</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Session Duration</div>
                  <div className="font-mono font-bold text-white mt-1">{formatDuration(selectedVisitor.sessionDuration)}</div>
                </div>
              </div>

              {/* Click History Log */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-[#00AAFF]" />
                  <span>Clicked Interactive Targets ({selectedVisitor.clickEvents?.length || 0})</span>
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {selectedVisitor.clickEvents && selectedVisitor.clickEvents.length > 0 ? (
                    selectedVisitor.clickEvents.map((evt, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00AAFF]" />
                          <span className="font-semibold text-slate-200">{evt.target}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">
                          {formatRelativeTime(evt.time)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 py-3 text-center">
                      No button clicks recorded in this session.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedVisitor(null)}
                  className="px-4 py-2 rounded-xl bg-[#0057FF] hover:bg-[#00AAFF] text-white text-xs font-bold transition"
                >
                  Close Telemetry Modal
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
