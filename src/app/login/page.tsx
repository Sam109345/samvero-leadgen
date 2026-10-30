'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const redirectParam = searchParams.get('redirect') || '';

  const [emailOrUser, setEmailOrUser] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // First Login Password Setup State
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [activeUserId, setActiveUserId] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password.trim()) {
      setErrorMsg('Please enter your portal access password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailOrUser.trim(),
          username: emailOrUser.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.role) {
        // Set local storage session
        localStorage.setItem('samvero_portal_session', 'active');
        localStorage.setItem('samvero_portal_role', data.role);

        if (data.mustChangePassword) {
          setMustChangePassword(true);
          setActiveUserId(data.userId);
          setSuccessMsg('First login detected: Please set your permanent security password.');
          setLoading(false);
          return;
        }

        // Determine destination
        let destination = redirectParam;
        if (!destination) {
          if (data.role === 'admin' || data.role === 'super_admin') {
            destination = '/admin/dashboard';
          } else if (data.role === 'customer') {
            destination = '/app/dashboard';
          } else {
            destination = '/dashboard';
          }
        }

        setSuccessMsg(`Access granted as ${data.userName}. Redirecting...`);
        setTimeout(() => {
          window.location.href = destination;
        }, 600);
      } else {
        setErrorMsg(data.error || 'Authentication denied. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login connection failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Password updated successfully! Entering dashboard...');
        setTimeout(() => {
          const role = localStorage.getItem('samvero_portal_role');
          window.location.href = role === 'admin' ? '/admin/dashboard' : '/app/dashboard';
        }, 800);
      } else {
        setErrorMsg(data.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Password update error.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-20 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#090d1a] p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-white font-serif">SAMVERO Portal</h1>
              <p className="text-xs text-slate-400">
                Secure enterprise access for Super Admins and Registered SaaS Customers
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mustChangePassword ? (
              /* First Login Password Setup Form */
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">New Security Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPass}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-60"
                >
                  {changingPass ? 'Updating Security Password...' : 'Save Password & Enter Dashboard'}
                </button>
              </form>
            ) : (
              /* Standard Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address or Username
                  </label>
                  <input
                    type="text"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    placeholder="sameer.centric@gmail.com or client@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-xs tracking-wide transition shadow-lg shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Verifying Access Key...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer / Helper text */}
            <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account yet?{' '}
                <Link href="/signup" className="text-amber-400 hover:underline font-bold">
                  Apply for Access
                </Link>
              </p>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
                <Link href="/pricing" className="hover:text-slate-300">
                  Six Packages
                </Link>
                <span>&bull;</span>
                <Link href="/how-it-works" className="hover:text-slate-300">
                  How It Works
                </Link>
                <span>&bull;</span>
                <Link href="/contact" className="hover:text-slate-300">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060a14] flex items-center justify-center text-slate-500 font-mono text-xs">
          Loading authentication gateway...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
