'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Sparkles,
  Zap,
  Globe2,
  Database,
  Check,
} from 'lucide-react';

/* ── Twinkling Star Dust ─────────────────────────────────── */
function StarDust({ count = 35 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 0.8}px`,
    duration: `${Math.random() * 4 + 3}s`,
    delay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.7 + 0.2,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            '--duration': s.duration,
            '--delay': s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || '';
  const cycleParam = searchParams.get('cycle') || 'monthly';

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
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#06030e] text-slate-100 overflow-hidden font-sans select-none">
      {/* ── Atmospheric Cosmic Gradients & Lighting ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-purple-700/30 via-fuchsia-600/15 to-transparent blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-indigo-700/25 via-blue-600/10 to-transparent blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-purple-900/10 rounded-full blur-[160px]" />
      </div>

      <StarDust count={40} />

      {/* ── Main Glassmorphism Floating Shell (Screenshot 1 Matching) ── */}
      <div className="w-full max-w-4xl relative z-10 glass-luxury-container rounded-[2.5rem] p-4 sm:p-6 md:p-8 border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.7),0_0_80px_rgba(168,85,247,0.18)]">
        
        {/* Top bar with Brand Logo & Back to Home */}
        <div className="flex items-center justify-between px-3 pb-6 mb-2 border-b border-white/10">
          <Link href="/" className="hover:opacity-90 transition">
            <SamveroBrandLogo size="md" theme="dark" />
          </Link>

          <div className="flex items-center gap-3">
            {planParam && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">
                Selected: {planParam.toUpperCase()} ({cycleParam})
              </span>
            )}
            <Link
              href="/login"
              className="text-xs font-medium text-purple-300/80 hover:text-white px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-purple-400/40 transition flex items-center gap-1.5"
            >
              <span>Have an account? Log In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2-Column Split: Left Visual Capsule + Right Clean Glass Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ── LEFT PANEL: Luminous AI Specimen / Core Visual (Screenshot 1 Match) ── */}
          <div className="lg:col-span-5 hidden sm:flex flex-col justify-between rounded-[2rem] bg-[#0c0818]/90 border border-white/10 p-6 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            
            {/* Top pill badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-purple-300 bg-purple-500/15 border border-purple-500/30">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                <span>INTELLIGENCE PORTAL</span>
              </span>

              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                READY
              </span>
            </div>

            {/* Glowing Botanical / Cosmic Specimen Sculpture */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute -bottom-6 w-48 h-20 rounded-full bg-gradient-to-t from-purple-500/60 via-fuchsia-500/30 to-transparent blur-xl pointer-events-none" />
              
              <div className="relative w-48 h-56 flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_15px_30px_rgba(168,85,247,0.5)]">
                  <defs>
                    <linearGradient id="signupStem" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="signupLeaf" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#e879f9" />
                    </linearGradient>
                    <linearGradient id="signupPot" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b1d6e" />
                      <stop offset="50%" stopColor="#1e1038" />
                      <stop offset="100%" stopColor="#0f0720" />
                    </linearGradient>
                    <radialGradient id="signupPotGlow" cx="50%" cy="100%" r="80%">
                      <stop offset="0%" stopColor="#d946ef" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#0f0720" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <path d="M 60 150 L 140 150 L 130 215 C 130 220, 70 220, 70 215 Z" fill="url(#signupPot)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <path d="M 60 150 L 140 150 L 130 215 C 130 220, 70 220, 70 215 Z" fill="url(#signupPotGlow)" />
                  <ellipse cx="100" cy="150" rx="40" ry="8" fill="#4c1d95" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <ellipse cx="100" cy="216" rx="30" ry="5" fill="#f43f5e" opacity="0.4" filter="blur(3px)" />

                  <path d="M 100 148 C 88 100, 85 45, 100 25 C 115 45, 112 100, 100 148 Z" fill="url(#signupLeaf)" opacity="0.95" />
                  <path d="M 95 148 C 70 115, 55 70, 72 45 C 88 65, 96 110, 95 148 Z" fill="url(#signupStem)" opacity="0.9" />
                  <path d="M 90 150 C 55 130, 38 95, 50 78 C 68 90, 85 125, 90 150 Z" fill="url(#signupLeaf)" opacity="0.8" />
                  <path d="M 105 148 C 130 115, 145 70, 128 45 C 112 65, 104 110, 105 148 Z" fill="url(#signupLeaf)" opacity="0.9" />
                  <path d="M 110 150 C 145 130, 162 95, 150 78 C 132 90, 115 125, 110 150 Z" fill="url(#signupStem)" opacity="0.8" />

                  <circle cx="100" cy="24" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #fff)" />
                  <circle cx="72" cy="44" r="2.5" fill="#e879f9" filter="drop-shadow(0 0 5px #e879f9)" />
                  <circle cx="128" cy="44" r="2.5" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)" />
                  <circle cx="50" cy="78" r="2" fill="#c084fc" />
                  <circle cx="150" cy="78" r="2" fill="#f472b6" />
                </svg>
              </div>
            </div>

            {/* Bottom feature bullets */}
            <div className="relative z-10 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>15+ Commercial Connectors</span>
                </span>
                <span className="font-mono font-bold text-white">Live Feed</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Zero Fabricated Records</span>
                </span>
                <span className="font-mono font-bold text-white">Audited 100%</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: Clean Minimalist Glassmorphic Signup Form (Screenshot 1 Match) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center px-2 sm:px-6 py-2">
            
            {/* Heading & Subtitle */}
            <div className="mb-5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1.5">
                Create an account
              </h1>
              <p className="text-sm text-slate-400">
                Start discovering verified high-ticket clients with AI precision.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Sameer Centric"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-2xl glass-luxury-input text-sm text-white placeholder-slate-500 font-sans"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="sameer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-2xl glass-luxury-input text-sm text-white placeholder-slate-500 font-sans"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password Fields in 2-Col on larger screen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-2xl glass-luxury-input text-sm text-white placeholder-slate-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-2xl glass-luxury-input text-sm text-white placeholder-slate-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Pill Indicator */}
              {password && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Strength:</span>
                  <div className={`h-1.5 flex-1 rounded-full ${passwordStrength >= 1 ? 'bg-amber-400' : 'bg-white/10'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${passwordStrength >= 2 ? 'bg-cyan-400' : 'bg-white/10'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${passwordStrength >= 3 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                  <span className="text-[11px] font-mono text-slate-300 ml-1">
                    {passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}

              {/* Error & Success Feedback */}
              {errorMsg && (
                <div className="p-3 rounded-2xl flex items-center gap-2 text-xs bg-red-500/10 border border-red-500/30 text-red-300 animate-slide-down">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-2xl flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 animate-slide-down">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Gradient Pill CTA Button (Screenshot 1 Match) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full glass-pill-btn font-semibold text-sm flex items-center justify-center gap-2 mt-2"
                style={{ opacity: loading ? 0.75 : 1 }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Your Command Center...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Terms & Privacy Note */}
              <p className="text-[11px] text-center text-slate-500 pt-1 leading-relaxed">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-purple-400 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-purple-400 hover:underline">Privacy Policy</Link>.
              </p>

              {/* Bottom Quick Link */}
              <div className="pt-3 text-center text-xs text-slate-400 border-t border-white/10">
                <span>Already have an active account? </span>
                <Link
                  href="/login"
                  className="font-semibold text-purple-300 hover:text-purple-200 transition"
                >
                  Log in here →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#06030e]">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
