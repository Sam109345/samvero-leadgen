'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Key, 
  CheckCircle2,
  Crown,
  Briefcase,
  Monitor
} from 'lucide-react';
import SamveroBrandLogo from './SamveroBrandLogo';
import { AuthProvider, useAuth } from '@/lib/auth-context';

interface PortalAuthGateProps {
  children: React.ReactNode;
}

function AuthGateContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, userName, login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [successRole, setSuccessRole] = useState<'admin' | 'employer' | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter your authorization password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = await login(password.trim());

      if (result.success && result.role) {
        setSuccessRole(result.role as 'admin' | 'employer');
      } else {
        setErrorMsg(result.error || 'Invalid credentials. Access denied.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // While checking initial auth, show a dark ambient splash
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#070d18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <SamveroBrandLogo size="lg" showText={true} tagline={true} />
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // If authenticated, render full application dashboard
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, render the dual-access luxury lock screen
  return (
    <div className="min-h-screen bg-[#060b14] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/15 via-[#007FED]/20 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Status */}
      <header className="p-6 flex items-center justify-between z-10 max-w-6xl mx-auto w-full">
        <SamveroBrandLogo size="md" showText={true} tagline={false} />
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 rounded-full px-3.5 py-1 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-slate-300">ROLE-GATED TERMINAL</span>
        </div>
      </header>

      {/* Main Lock Screen Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div
          className={`w-full max-w-md bg-[#0d1627]/85 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-cyan-950/50 transition-all ${
            shake ? 'animate-bounce border-rose-500/60' : ''
          }`}
        >
          {/* Lock Icon Emblem */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-[#007FED] flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
                <Lock className="w-8 h-8" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#060b14] border-2 border-cyan-400 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  Executive Admin &amp; Staff Gateway
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                SAMVERO Portal Security
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your access password to login as Executive Admin or Employer Staff.
              </p>
            </div>
          </div>

          {/* Quick Dual Role Helper Hint */}
          <div className="mt-5 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-200 block">Super Admin</span>
                <span className="text-[9px] text-slate-500">Full Audit &amp; Team Tracking</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-200 block">Employer Staff</span>
                <span className="text-[9px] text-slate-500">Standard Lead Operations</span>
              </div>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Access Password</span>
                <span className="text-[10px] text-cyan-400 font-mono">Role Detected On Login</span>
              </label>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  placeholder="Enter Admin or Employer Password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080e1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 transition-all outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successRole && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Authenticated as <b>{successRole === 'admin' ? 'Super Executive Admin' : 'Employer Staff'}</b>! Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#007FED] via-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-600 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization &amp; Device...</span>
                </>
              ) : (
                <>
                  <span>Unlock Operating Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge Footnote */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>AES-256 Vault Protection</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.5 Role-Gated</span>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="p-6 text-center text-xs text-slate-600 z-10">
        <span>SAMVERO &bull; AI-Powered Lead Generation &amp; Client Acquisition Platform</span>
      </footer>
    </div>
  );
}

export default function PortalAuthGate({ children }: PortalAuthGateProps) {
  return (
    <AuthProvider>
      <AuthGateContent>{children}</AuthGateContent>
    </AuthProvider>
  );
}
