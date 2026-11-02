'use client';

import React from 'react';

export interface SamveroBrandLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: boolean;
  theme?: 'auto' | 'light' | 'dark' | 'cyan' | 'gold' | 'monochrome' | 'white';
}

export default function SamveroBrandLogo({
  className = '',
  size = 'md',
  showText = true,
  tagline = false,
  theme = 'auto',
}: SamveroBrandLogoProps) {
  // Height based on size preserving original image aspect ratio
  const heightClasses = {
    xs: 'h-6',
    sm: 'h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-16',
  }[size];

  const iconSizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  }[size];

  // Map legacy color tokens to logo theme
  const resolvedTheme =
    theme === 'white' || theme === 'gold' ? 'dark' : theme === 'cyan' || theme === 'monochrome' ? 'auto' : theme;

  if (!showText) {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        {/* Supplied brand icon asset */}
        <img
          src="/samvero-icon.png"
          alt="SAMVERO"
          className={`${iconSizeClasses} object-contain transition-transform duration-200 hover:scale-105`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="inline-flex items-center">
        {resolvedTheme === 'auto' ? (
          <>
            {/* Light Mode Logo (Dark Text) */}
            <img
              src="/logo-light.png"
              alt="SAMVERO"
              className={`${heightClasses} w-auto object-contain block dark:hidden transition-transform duration-200 hover:scale-[1.02]`}
            />
            {/* Dark Mode Logo (White Text) */}
            <img
              src="/logo-dark.png"
              alt="SAMVERO"
              className={`${heightClasses} w-auto object-contain hidden dark:block transition-transform duration-200 hover:scale-[1.02]`}
            />
          </>
        ) : resolvedTheme === 'light' ? (
          <img
            src="/logo-light.png"
            alt="SAMVERO"
            className={`${heightClasses} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
          />
        ) : (
          <img
            src="/logo-dark.png"
            alt="SAMVERO"
            className={`${heightClasses} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
          />
        )}
      </div>
      {tagline && (
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-1">
          Find the Right Leads. Build Better Connections.
        </span>
      )}
    </div>
  );
}
