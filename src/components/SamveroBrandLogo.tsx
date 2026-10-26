'use client';

import React from 'react';

interface SamveroBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: boolean;
  theme?: 'cyan' | 'gold' | 'monochrome' | 'white';
}

export default function SamveroBrandLogo({
  className = '',
  size = 'md',
  showText = true,
  tagline = false,
  theme = 'cyan'
}: SamveroBrandLogoProps) {
  // Sizing dimensions
  const iconSize = {
    sm: 24,
    md: 32,
    lg: 42,
    xl: 56,
  }[size];

  const textClass = {
    sm: 'text-sm font-black tracking-tight',
    md: 'text-lg font-black tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric SVG Icon Mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Primary Cyan-Blue Gradient */}
          <linearGradient id="samvero-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#007FED" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Luxury Gold Gradient */}
          <linearGradient id="samvero-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Accent Glow Filter */}
          <filter id="samvero-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#007FED" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Hexagonal Shield Background */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill={theme === 'white' ? '#FFFFFF' : '#0B1322'}
          stroke={theme === 'gold' ? 'url(#samvero-grad-gold)' : 'url(#samvero-grad-cyan)'}
          strokeWidth="3.5"
          filter="url(#samvero-glow)"
        />

        {/* Geometric S-V Dual Horizon Interlocking Vectors */}
        <path
          d="M28 32 L50 20 L72 32 L50 44 Z"
          fill={theme === 'gold' ? 'url(#samvero-grad-gold)' : 'url(#samvero-grad-cyan)'}
        />
        <path
          d="M26 48 L48 60 L48 76 L26 64 Z"
          fill={theme === 'gold' ? '#FBBF24' : '#38BDF8'}
        />
        <path
          d="M74 48 L52 60 L52 76 L74 64 Z"
          fill={theme === 'gold' ? '#D97706' : '#1D4ED8'}
        />

        {/* Center Optical Focal Dot */}
        <circle
          cx="50"
          cy="44"
          r="4.5"
          fill="#FFFFFF"
        />
      </svg>

      {/* Typography: SAMVERO + Tagline */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`${textClass} font-black text-slate-900 dark:text-white uppercase tracking-wider`}>
              SAM<span className="text-[#007FED] dark:text-[#38BDF8]">VERO</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#007FED] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 tracking-widest">
              AI
            </span>
          </div>
          {tagline && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5">
              Find the Right Leads. Build Better Connections.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
