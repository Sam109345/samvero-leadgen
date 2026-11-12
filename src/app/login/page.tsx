'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  X,
  Zap,
  Bot,
  Globe2,
  BarChart3,
} from 'lucide-react';

/* ── Starfield ───────────────────────────────────────────── */
function Stars({ count = 40 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 0.5}px`,
    duration: `${Math.random() * 4 + 2}s`,
    delay: `${Math.random() * 5}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, '--duration': s.duration, '--delay': s.delay } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const redirectParam = searchParams.get('redirect') || '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Keep theme logic intact
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Always force dark on login for NASA aesthetic
    document.documentElement.classList.add('dark');
    setTheme('dark');
  }, []);

  const fillCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('sameer.centric@gmail.com');
      setPassword('Sameer123!@#');
    } else {
      setEmail('client@gmail.com');
      setPassword('Client123!@#');
    }
    setErrorMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) { setErrorMsg('Please enter your email address.'); return; }
    if (!password.trim()) { setErrorMsg('Please enter your password.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), username: email.trim(), password: password.trim() }),
      });
      const data = await res.json();

      if (data.success && data.role) {
        if (rememberMe) {
          localStorage.setItem('samvero_portal_session', 'active');
          localStorage.setItem('samvero_portal_role', data.role);
          localStorage.setItem('samvero_saved_email', email.trim());
        } else {
          sessionStorage.setItem('samvero_portal_session', 'active');
          sessionStorage.setItem('samvero_portal_role', data.role);
          localStorage.removeItem('samvero_saved_email');
        }
        const destination = redirectParam || '/dashboard';
        setSuccessMsg(`Welcome back, ${data.userName}! Redirecting...`);
        setTimeout(() => { window.location.href = destination; }, 500);
      } else {
        setErrorMsg(data.error || 'Invalid email or password. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login connection failed. Please check network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#030712', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── LEFT PANEL: GIF + Welcome ─────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: '50%', background: 'rgba(10,15,30,0.9)', borderRight: '1px solid rgba(0,87,255,0.15)' }}
      >
        <Stars count={50} />

        {/* Ambient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none animate-float-delayed"
          style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        {/* Top logo */}
        <div className="relative z-10 p-10">
          <Link href="/">
            <SamveroBrandLogo size="lg" theme="dark" />
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-10 pb-10 flex-1">
          {/* Animated GIF in glowing frame */}
          <div
            className="w-72 h-72 rounded-2xl overflow-hidden mb-8 relative"
            style={{
              border: '1px solid rgba(0,87,255,0.3)',
              boxShadow: '0 0 60px rgba(0,87,255,0.2), 0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src="https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif"
              alt="AI Robot animation"
              className="w-full h-full object-cover"
            />
            {/* Overlay grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,87,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,87,255,0.05) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          <h2
            className="text-3xl font-bold text-white text-center mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome Back to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Samvero
            </span>
          </h2>
          <p className="text-sm text-center max-w-xs leading-relaxed" style={{ color: '#64748b' }}>
            Your AI-powered lead intelligence platform. Access thousands of verified leads from 15+ platforms.
          </p>

          {/* Feature bullets */}
          <div className="mt-8 space-y-3 w-full max-w-xs">
            {[
              { icon: Bot, text: 'AI-Powered Lead Discovery' },
              { icon: ShieldCheck, text: '98% Contact Accuracy' },
              { icon: Globe2, text: '15+ Data Platforms' },
              { icon: BarChart3, text: 'Real-Time Analytics' },
            ].map((f, i) => {
              const IconComp = f.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(0,87,255,0.1)', border: '1px solid rgba(0,87,255,0.2)' }}
                  >
                    <IconComp className="w-4 h-4" style={{ color: '#00AAFF' }} />
                  </div>
                  <span className="text-xs" style={{ color: '#94a3b8' }}>{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.8), transparent)' }}
        />
      </div>

      {/* ── RIGHT PANEL: Login Form ───────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-6 py-10 relative overflow-hidden"
        style={{ background: '#030712' }}
      >
        <Stars count={25} />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 relative z-10">
          <Link href="/">
            <SamveroBrandLogo size="md" theme="dark" />
          </Link>
        </div>

        {/* Form card */}
        <div
          className="w-full max-w-md relative z-10 animate-scale-in"
          style={{
            background: 'rgba(10,15,30,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,87,255,0.2)',
            borderRadius: '1.5rem',
            boxShadow: '0 0 60px rgba(0,87,255,0.1), 0 40px 80px rgba(0,0,0,0.5)',
            padding: '2rem',
          }}
        >
          {/* Header */}
          <div className="mb-6">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(0,87,255,0.1)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
            >
              <Zap className="w-3 h-3" /> Secure Login
            </div>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Sign in to your account
            </h1>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Enter your credentials to access the platform.
            </p>
          </div>

          {/* Quick-fill dev buttons */}
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
              style={{
                background: 'rgba(0,87,255,0.08)',
                border: '1px solid rgba(0,87,255,0.2)',
                color: '#94a3b8',
              }}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('user')}
              className="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
              style={{
                background: 'rgba(0,87,255,0.08)',
                border: '1px solid rgba(0,87,255,0.2)',
                color: '#94a3b8',
              }}
            >
              User Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold" style={{ color: '#94a3b8' }}>Email Address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Mail className="w-4 h-4" style={{ color: '#475569' }} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl transition-all focus:outline-none"
                  style={{
                    background: 'rgba(5,10,20,0.8)',
                    border: '1px solid rgba(0,87,255,0.2)',
                    color: '#e2e8f0',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold" style={{ color: '#94a3b8' }}>Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs transition-colors"
                  style={{ color: '#0057FF' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00AAFF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#0057FF'; }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4" style={{ color: '#475569' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl transition-all focus:outline-none font-mono"
                  style={{
                    background: 'rgba(5,10,20,0.8)',
                    border: '1px solid rgba(0,87,255,0.2)',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#475569' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className="relative w-9 h-5 rounded-full transition-all cursor-pointer"
                style={{ background: rememberMe ? '#0057FF' : 'rgba(30,40,60,0.8)', border: '1px solid rgba(0,87,255,0.3)' }}
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: rememberMe ? '17px' : '1px', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                />
              </div>
              <span className="text-xs" style={{ color: '#64748b' }}>Remember me for 30 days</span>
            </label>

            {/* Error / Success messages */}
            {errorMsg && (
              <div
                className="p-3 rounded-xl flex items-center gap-2 text-xs animate-slide-down"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div
                className="p-3 rounded-xl flex items-center gap-2 text-xs animate-slide-down"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-nasa justify-center mt-2"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div
            className="mt-6 pt-5 text-center text-xs"
            style={{ borderTop: '1px solid rgba(0,87,255,0.1)', color: '#64748b' }}
          >
            <span>Don't have an account yet? </span>
            <Link
              href="/signup"
              className="font-bold transition-colors"
              style={{ color: '#0057FF' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00AAFF'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#0057FF'; }}
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs relative z-10" style={{ color: '#334155' }}>
          SAMVERO LeadGen • Professional Lead Discovery & Acquisition Platform
        </p>
      </div>

      {/* ── Forgot Password Modal ─────────────────────────────── */}
      {forgotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
            style={{
              background: 'rgba(10,15,30,0.95)',
              border: '1px solid rgba(0,87,255,0.3)',
              boxShadow: '0 0 60px rgba(0,87,255,0.2)',
            }}
          >
            <div
              className="flex items-center justify-between pb-3 mb-4"
              style={{ borderBottom: '1px solid rgba(0,87,255,0.1)' }}
            >
              <h3 className="font-bold text-base text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Reset Password
              </h3>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#475569' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="text-center py-4 space-y-4">
                <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: '#10b981' }} />
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Reset Instructions Sent</h4>
                  <p className="text-xs" style={{ color: '#64748b' }}>
                    If an account exists for <b style={{ color: '#94a3b8' }}>{forgotEmail}</b>, recovery instructions have been sent.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl btn-nasa justify-center text-xs"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs" style={{ color: '#64748b' }}>
                  Enter your registered account email and we'll send you a password reset link.
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold" style={{ color: '#94a3b8' }}>Registered Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
                    style={{ background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(0,87,255,0.2)', color: '#e2e8f0' }}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(0,87,255,0.2)', color: '#94a3b8' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold btn-nasa justify-center"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: '#030712' }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#0057FF', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
