'use client';

import React, { useEffect } from 'react';
import SamveroBrandLogo from './SamveroBrandLogo';
import { AuthProvider, useAuth } from '@/lib/auth-context';

interface PortalAuthGateProps {
  children: React.ReactNode;
}

function AuthGateContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const redirectParam = currentPath && currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
        window.location.href = `/login${redirectParam}`;
      }
    }
  }, [isAuthenticated]);

  // While checking initial auth or redirecting, show clean loading state
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#172B4D] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <SamveroBrandLogo size="lg" showText={true} tagline={true} />
          <div className="w-7 h-7 border-3 border-[#3B6FF5] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading SAMVERO Workspace...
          </span>
        </div>
      </div>
    );
  }

  // Authenticated: Render dashboard
  return <>{children}</>;
}

export default function PortalAuthGate({ children }: PortalAuthGateProps) {
  return (
    <AuthProvider>
      <AuthGateContent>{children}</AuthGateContent>
    </AuthProvider>
  );
}
