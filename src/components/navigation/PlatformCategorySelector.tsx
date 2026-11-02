'use client';

import React from 'react';
import {
  PLATFORM_CATEGORIES,
  PlatformCategoryId,
  PlatformDefinition,
} from '@/lib/platform-directory';
import {
  Sparkles,
  Briefcase,
  Target,
  Building2,
  Share2,
  Globe2,
  Code2,
  Flag,
  ChevronRight,
  ExternalLink,
  Layers,
  Check,
} from 'lucide-react';

interface PlatformCategorySelectorProps {
  activeCategory: PlatformCategoryId | 'all';
  onSelectCategory: (cat: PlatformCategoryId | 'all') => void;
  selectedPlatform: string;
  onSelectPlatform: (platformName: string) => void;
  totalLeadsCount?: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Briefcase,
  Target,
  Building2,
  Share2,
  Globe2,
  Code2,
  Flag,
};

export default function PlatformCategorySelector({
  activeCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  totalLeadsCount,
}: PlatformCategorySelectorProps) {
  const currentCategoryMeta =
    activeCategory !== 'all'
      ? PLATFORM_CATEGORIES.find((c) => c.id === activeCategory)
      : null;

  return (
    <div className="bg-white dark:bg-[#111927] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden transition-all mb-4">
      {/* 1. Category Navigation Pills */}
      <div className="p-3 bg-slate-50/70 dark:bg-[#0d1522] border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lead Acquisition Channels
            </span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
              8 Core Categories • 70+ Platforms
            </span>
          </div>
          {activeCategory !== 'all' && (
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectPlatform('all');
              }}
              className="text-[11px] font-bold text-[#3B6FF5] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All 50+ Platforms</span>
            </button>
          )}
        </div>

        {/* Scrollable Category Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {/* All Channels Pill */}
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              onSelectPlatform('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Sources</span>
            {totalLeadsCount !== undefined && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeCategory === 'all'
                    ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {totalLeadsCount}
              </span>
            )}
          </button>

          {/* 8 Categories */}
          {PLATFORM_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.iconName] || Layers;
            const isActive = activeCategory === cat.id;
            const isPriority = cat.id === 'agency_priority';

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectPlatform('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? isPriority
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm font-extrabold'
                      : 'bg-[#3B6FF5] text-white shadow-sm font-extrabold'
                    : isPriority
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/70 hover:bg-amber-100'
                    : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? isPriority
                        ? 'text-slate-950 fill-current'
                        : 'text-white'
                      : isPriority
                      ? 'text-amber-500 fill-current'
                      : 'text-slate-400'
                  }`}
                />
                <span>{cat.shortTitle}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? isPriority
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat.platforms.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Category Details & Individual Platform Pills */}
      {currentCategoryMeta ? (
        <div className="p-3.5 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {currentCategoryMeta.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  — {currentCategoryMeta.tagline}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {currentCategoryMeta.description}
              </p>
            </div>

            {selectedPlatform !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectPlatform('all')}
                className="self-start sm:self-center text-[10px] font-bold text-[#3B6FF5] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900 cursor-pointer"
              >
                Reset to All {currentCategoryMeta.shortTitle}
              </button>
            )}
          </div>

          {/* Sub-Pills for Individual Platforms */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <button
              type="button"
              onClick={() => onSelectPlatform('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                selectedPlatform === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>All ({currentCategoryMeta.platforms.length})</span>
            </button>

            {currentCategoryMeta.platforms.map((p) => {
              const isSelected = selectedPlatform.toLowerCase() === p.name.toLowerCase();

              return (
                <div key={p.id} className="relative group inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => onSelectPlatform(p.name)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#3B6FF5] text-white border-blue-600 shadow-xs font-bold'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {p.isAgencyPriority && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    )}
                    <span>{p.name}</span>

                    {p.liveStatus === 'live_api' && (
                      <span className="text-[9px] text-emerald-500 font-extrabold uppercase">
                        LIVE
                      </span>
                    )}
                  </button>

                  {/* Direct Platform Link in Hover Action */}
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${p.name} official site (${p.website})`}
                    className="ml-0.5 p-1 text-slate-400 hover:text-blue-500 transition"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* View for 'all': Highlight the 8 Agency High-Priority Platforms */
        <div className="p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Highest Agency Conversion Channels:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Upwork', 'Fiverr', 'LinkedIn', 'PeoplePerHour', 'Contra', 'Apollo', 'Clutch', 'Google Maps'].map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    onSelectCategory('agency_priority');
                    onSelectPlatform(name);
                  }}
                  className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200 text-[11px] font-bold rounded-md border border-amber-200 dark:border-amber-800 cursor-pointer transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 shrink-0">
            Click any platform above to filter qualified opportunities
          </div>
        </div>
      )}
    </div>
  );
}
