'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Filter, 
  ArrowDown, 
  ChevronRight, 
  Layers, 
  Sparkles,
  Flame,
  Globe2
} from 'lucide-react';

interface FunnelAnalyticsProps {
  totalLeads: number;
  noWebsiteCount: number;
  newBusinesses: number;
  pitchedCount: number;
}

export default function FunnelAnalytics({
  totalLeads,
  noWebsiteCount,
  newBusinesses,
  pitchedCount,
}: FunnelAnalyticsProps) {
  return (
    <div className="space-y-5">
      {/* Top Row: Performance Funnel (Left) + Wave Trend Chart (Right) identical to Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Performance Funnel Widget (Coupler.io / LinkedIn style Image 1) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Performance Funnel
              </h3>
              <p className="text-xs text-slate-500">Live multi-stage conversion breakdown</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1877F2]">
              Live Track
            </span>
          </div>

          {/* 3D Funnel Graphic matching Image 1 */}
          <div className="py-2 space-y-3">
            {/* Stage 1: Top of funnel */}
            <div className="relative group">
              <div className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-200 block">Total GMB Ingested</span>
                  <span className="text-2xl font-black">141.3K</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-200">Raw Discovery</span>
                  <span className="block text-[11px] text-white/80">Market Scrape</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Middle of funnel */}
            <div className="relative mx-4 group">
              <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-200 block">Qualified Prospects</span>
                  <span className="text-xl font-black">2.4K</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-200">1.70% Rate</span>
                  <span className="block text-[11px] text-white/80">Filtered Niches</span>
                </div>
              </div>
            </div>

            {/* Stage 3: Bottom of funnel (Converted Leads) */}
            <div className="relative mx-8 group">
              <div className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-200 block">Active Pipeline Leads</span>
                  <span className="text-xl font-black">{totalLeads * 10}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-200">35.6% Conversion</span>
                  <span className="block text-[11px] text-white/80">Pitch Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated from GMB, Upwork, Bark, &amp; LinkedIn</span>
            <span className="font-bold text-emerald-600">+14.2% vs last month</span>
          </div>
        </div>

        {/* Wave Spline Chart: Leads & Spend over time matching Image 1 */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Daily Ingestion Velocity
              </h3>
              <p className="text-xs text-slate-500">Lead discovery timeline &amp; acquisition trend</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1877F2]" />
              <span className="text-xs font-bold text-slate-700">Incoming Leads Stream</span>
            </div>
          </div>

          {/* SVG Smooth Area Curve Chart */}
          <div className="relative w-full h-56 pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1877F2" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#1877F2" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#E2E8F0" strokeDasharray="3 3" />

              {/* Smooth Area Wave */}
              <path
                d="M 0,80 Q 50,40 100,75 T 200,120 T 300,50 T 400,105 T 500,45 T 600,110 T 700,60 L 700,200 L 0,200 Z"
                fill="url(#waveGradient)"
              />

              {/* Smooth Line Stroke */}
              <path
                d="M 0,80 Q 50,40 100,75 T 200,120 T 300,50 T 400,105 T 500,45 T 600,110 T 700,60"
                fill="none"
                stroke="#1877F2"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data marker dots matching Image 1 */}
              {[
                { cx: 0, cy: 80 },
                { cx: 100, cy: 75 },
                { cx: 200, cy: 120 },
                { cx: 300, cy: 50 },
                { cx: 400, cy: 105 },
                { cx: 500, cy: 45 },
                { cx: 600, cy: 110 },
                { cx: 700, cy: 60 },
              ].map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="5"
                  className="fill-[#1877F2] stroke-white stroke-2 hover:r-7 transition-all cursor-pointer"
                />
              ))}
            </svg>

            {/* X-axis dates */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
              <span>Oct 1</span>
              <span>Oct 5</span>
              <span>Oct 9</span>
              <span>Oct 13</span>
              <span>Oct 17</span>
              <span>Today (Live)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Average velocity: <strong>14 fresh leads/hour</strong></span>
            <span className="font-bold text-[#1877F2]">10-sec Ingestion Engine Active</span>
          </div>
        </div>
      </div>

      {/* Lower Row: Bar Graphs Matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Missing Website Opportunity Breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-slate-900">Redesign Opportunity Niches</h4>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Dental & Healthcare Clinics', percent: 84, count: '38 leads' },
              { label: 'Marble & Architecture Studios', percent: 68, count: '24 leads' },
              { label: 'Corporate Law Chambers', percent: 55, count: '18 leads' },
              { label: 'Luxury Dining & Banquets', percent: 45, count: '12 leads' },
            ].map((item, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{item.label}</span>
                  <span className="text-amber-700 font-bold">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Operating Age Distribution */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-slate-900">Business Age Distribution</h4>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="space-y-2.5">
            {[
              { label: '✨ Newly Opened (< 1 Year)', percent: 35, color: 'bg-emerald-500', count: `${newBusinesses} leads` },
              { label: '🌱 Rising Business (1 - 3 Years)', percent: 28, color: 'bg-blue-500', count: '14 leads' },
              { label: '⭐ Established (3 - 5 Years)', percent: 22, color: 'bg-purple-500', count: '10 leads' },
              { label: '🏆 Veteran Business (5+ Years)', percent: 15, color: 'bg-amber-500', count: '8 leads' },
            ].map((item, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{item.label}</span>
                  <span className="text-slate-900 font-bold">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Territory Volume Comparison */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-slate-900">Target Territory Volume</h4>
            <Globe2 className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="space-y-2.5">
            {[
              { label: '🇵🇰 Pakistan Local Market', percent: 75, budget: 'PKR 150K - 350K avg' },
              { label: '🇺🇸 United States Market', percent: 62, budget: '$4,500 - $7,500 avg' },
              { label: '🇬🇧 United Kingdom Market', percent: 48, budget: '£3,000 - £6,000 avg' },
              { label: '🌍 Global Remote Upwork', percent: 55, budget: '$55 - $85/hr avg' },
            ].map((item, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{item.label}</span>
                  <span className="text-slate-500 text-[11px] font-normal">{item.budget}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
