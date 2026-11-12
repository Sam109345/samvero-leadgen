'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
  Zap,
  Bot,
  Globe2,
  BarChart3,
  Sparkles,
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

function SignupForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Always dark for NASA aesthetic
    document.documentElement.classList.add('dark');
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) { setErrorMsg('Full name is required.'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.'); return;
    }
    if (!password || password.length < 6) { setErrorMsg('Password must be at least 6 characters long.'); return; }
    if (password !== confirmPassword) { setErrorMsg('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), password, confirmPassword }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('samvero_portal_session', 'active');
        localStorage.setItem('samvero_portal_role', 'customer');
        setSuccessMsg(data.message || 'Account created successfully! Redirecting...');
        setTimeout(() => { window.location.href = data.redirectUrl || '/dashboard'; }, 600);
      } else {
        setErrorMsg(data.error || 'Failed to create account. Please check inputs.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration connection failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#030712', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── LEFT PANEL: GIF + Benefits ───────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: '50%', background: 'rgba(10,15,30,0.9)', borderRight: '1px solid rgba(0,87,255,0.15)' }}
      >
        <Stars count={50} />

        {/* Ambient orbs */}
        <div
          className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none animate-float-delayed"
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
            className="w-72 h-72 rounded-2xl overflow-hidden mb-8"
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
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(0,87,255,0.1)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
          >
            <Sparkles className="w-3 h-3" /> Start for Free Today
          </div>

          <h2
            className="text-3xl font-bold text-white text-center mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Join{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0057FF, #00AAFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Samvero
            </span>{' '}
            Today
          </h2>
          <p className="text-sm text-center max-w-xs leading-relaxed mb-8" style={{ color: '#64748b' }}>
            Access thousands of verified leads from Google My Business, LinkedIn, Upwork, and more.
          </p>

          {/* Benefits checklist */}
          <div className="space-y-3 w-full max-w-xs">
            {[
              'No fabricated or synthetic data',
              'DNS/MX validated email addresses',
              'ITU-format verified phone numbers',
              'Multi-platform lead discovery',
              'Private isolated workspace',
              'Dedicated account manager',
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  <Check className="w-3 h-3" style={{ color: '#10b981' }} />
                </div>
                <span className="text-xs" style={{ color: '#94a3b8' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.8), transparent)' }}
        />
      </div>

      {/* ── RIGHT PANEL: Signup Form ──────────────────────────── */}
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
              <Sparkles className="w-3 h-3" /> Create Account
            </div>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Get started with Samvero
            </h1>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Create your account and start discovering leads instantly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold" style={{ color: '#94a3b8' }}>Full Name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <User className="w-4 h-4" style={{ color: '#475569' }} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl transition-all focus:outline-none"
                  style={{ background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(0,87,255,0.2)', color: '#e2e8f0' }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
            </div>

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
                  style={{ background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(0,87,255,0.2)', color: '#e2e8f0' }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold" style={{ color: '#94a3b8' }}>Password</label>
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
                  style={{ background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(0,87,255,0.2)', color: '#e2e8f0' }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#475569' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{
                        background: passwordStrength >= level
                          ? level === 1 ? '#ef4444' : level === 2 ? '#f59e0b' : '#10b981'
                          : 'rgba(0,87,255,0.1)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold" style={{ color: '#94a3b8' }}>Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4" style={{ color: '#475569' }} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl transition-all focus:outline-none font-mono"
                  style={{
                    background: 'rgba(5,10,20,0.8)',
                    border: confirmPassword && password !== confirmPassword
                      ? '1px solid rgba(239,68,68,0.5)'
                      : confirmPassword && password === confirmPassword
                      ? '1px solid rgba(16,185,129,0.5)'
                      : '1px solid rgba(0,87,255,0.2)',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => { (e.target as HTMLInputElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#475569' }}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error / Success */}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create My Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div
            className="mt-6 pt-5 text-center text-xs"
            style={{ borderTop: '1px solid rgba(0,87,255,0.1)', color: '#64748b' }}
          >
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold transition-colors"
              style={{ color: '#0057FF' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00AAFF'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#0057FF'; }}
            >
              Log in here
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs relative z-10" style={{ color: '#334155' }}>
          SAMVERO LeadGen • Professional Lead Discovery & Acquisition Platform
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#030712' }}>
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#0057FF', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
