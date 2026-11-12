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
  Globe2,
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
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#030712] text-slate-100 overflow-hidden font-sans select-none">
      {/* ── Atmospheric Ambient Satin Lights (Electric Blue & Cyan Theme) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-[#0057FF]/30 via-[#00AAFF]/15 to-transparent blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[720px] h-[720px] rounded-full bg-gradient-to-tl from-[#0057FF]/25 via-[#00AAFF]/15 to-transparent blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#0057FF]/10 rounded-full blur-[170px]" />
      </div>

      <StarDust count={35} />

      {/* ── Main Glassmorphism Floating Shell ── */}
      <div className="w-full max-w-4xl relative z-10 glass-login-outer rounded-[2.5rem] p-4 sm:p-6 md:p-8">
        
        {/* Top Header: Brand Logo & Navigation */}
        <div className="flex items-center justify-between px-3 pb-5 mb-4 border-b border-white/10">
          <Link href="/" className="hover:opacity-90 transition">
            <SamveroBrandLogo size="md" theme="dark" />
          </Link>

          <div className="flex items-center gap-3">
            {planParam && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-[#00AAFF] bg-[#0057FF]/10 border border-[#0057FF]/30">
                Plan: {planParam.toUpperCase()} ({cycleParam})
              </span>
            )}
            <Link
              href="/login"
              className="text-xs font-medium text-[#00AAFF] hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#0057FF]/30 hover:border-[#00AAFF]/50 transition flex items-center gap-1.5 backdrop-blur-md"
            >
              <span>Have an account? Log In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2-Column Split: Left Specimen Sculpture + Right Frosted Glass Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ── LEFT PANEL: High-Tech Specimen Card ── */}
          <div className="lg:col-span-5 hidden sm:flex flex-col justify-between rounded-[2rem] bg-[#060b18]/95 border border-[#0057FF]/25 p-6 relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_15px_40px_rgba(0,0,0,0.7)]">
            
            {/* Top pill badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-[#00AAFF] bg-[#0057FF]/15 border border-[#0057FF]/30">
                <Sparkles className="w-3 h-3 text-[#00AAFF] animate-pulse" />
                <span>INTELLIGENCE RADAR</span>
              </span>

              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE
              </span>
            </div>

            {/* Glowing Hologram Artwork */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute -bottom-4 w-52 h-24 rounded-full bg-gradient-to-t from-[#0057FF]/70 via-[#00AAFF]/35 to-transparent blur-2xl pointer-events-none" />
              
              <div className="relative w-52 h-64 flex items-center justify-center">
                <svg viewBox="0 0 220 260" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,170,255,0.5)]">
                  <defs>
                    <linearGradient id="suLeafCenter" x1="0%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor="#0033aa" />
                      <stop offset="40%" stopColor="#0057FF" />
                      <stop offset="85%" stopColor="#00AAFF" />
                      <stop offset="100%" stopColor="#e0f2fe" />
                    </linearGradient>
                    <linearGradient id="suLeafCyan" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#030712" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="85%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#bae6fd" />
                    </linearGradient>
                    <linearGradient id="suLeafPink" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#581c87" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="85%" stopColor="#f472b6" />
                      <stop offset="100%" stopColor="#fbcfe8" />
                    </linearGradient>
                    <linearGradient id="suPotShine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2e1065" />
                      <stop offset="40%" stopColor="#1e1035" />
                      <stop offset="100%" stopColor="#0b0618" />
                    </linearGradient>
                    <radialGradient id="suPotInnerGlow" cx="50%" cy="100%" r="75%">
                      <stop offset="0%" stopColor="#e879f9" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0b0618" stopOpacity="0" />
                    </radialGradient>
                    <filter id="suGlowBlur" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Floor Reflection Ring */}
                  <ellipse cx="110" cy="242" rx="55" ry="10" fill="#a855f7" opacity="0.35" filter="blur(6px)" />
                  <ellipse cx="110" cy="240" rx="35" ry="5" fill="#f472b6" opacity="0.5" filter="blur(3px)" />

                  {/* Potted Cup */}
                  <path d="M 65 160 L 155 160 L 142 235 C 142 240, 78 240, 78 235 Z" fill="url(#suPotShine)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <path d="M 65 160 L 155 160 L 142 235 C 142 240, 78 240, 78 235 Z" fill="url(#suPotInnerGlow)" />
                  <ellipse cx="110" cy="160" rx="45" ry="9" fill="#3b1d6e" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                  <ellipse cx="110" cy="160" rx="42" ry="7" fill="#1c0b38" />

                  {/* Succulent Leaves */}
                  <path d="M 110 158 C 98 105, 95 40, 110 20 C 125 40, 122 105, 110 158 Z" fill="url(#suLeafCenter)" opacity="0.96" filter="url(#suGlowBlur)" />
                  <path d="M 105 158 C 76 118, 62 65, 80 38 C 96 60, 106 115, 105 158 Z" fill="url(#suLeafCyan)" opacity="0.92" />
                  <path d="M 115 158 C 144 118, 158 65, 140 38 C 124 60, 114 115, 115 158 Z" fill="url(#suLeafPink)" opacity="0.92" />
                  <path d="M 98 160 C 58 135, 42 90, 56 70 C 74 85, 92 125, 98 160 Z" fill="url(#suLeafCenter)" opacity="0.85" />
                  <path d="M 122 160 C 162 135, 178 90, 164 70 C 146 85, 128 125, 122 160 Z" fill="url(#suLeafCyan)" opacity="0.85" />

                  {/* Delicate sprigs & spores */}
                  <circle cx="110" cy="18" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px #fff)" />
                  <circle cx="80" cy="36" r="2.5" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)" />
                  <circle cx="140" cy="36" r="2.5" fill="#f472b6" filter="drop-shadow(0 0 5px #f472b6)" />
                  <circle cx="55" cy="68" r="2" fill="#e9d5ff" />
                  <circle cx="165" cy="68" r="2" fill="#bae6fd" />
                </svg>
              </div>
            </div>

            {/* Bottom feature bullets */}
            <div className="relative z-10 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#00AAFF]" />
                  <span>15+ Commercial Feeds</span>
                </span>
                <span className="font-mono font-bold text-white">Live Pipeline</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00AAFF]" />
                  <span>Zero Fabricated Records</span>
                </span>
                <span className="font-mono font-bold text-white">Audited 100%</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: Clean Frosted Glass Signup Form ── */}
          <div className="lg:col-span-7 flex flex-col justify-center px-2 sm:px-6 py-4 glass-login-pane rounded-[2rem] p-6 sm:p-8">
            
            {/* Heading & Subtitle */}
            <div className="mb-5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/80">
                Start discovering verified high-ticket clients with AI precision.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              
              {/* Full Name Underline Field */}
              <div className="space-y-1">
                <div className="relative glass-underline-field rounded-t-xl group">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#00AAFF] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Email Address Underline Field */}
              <div className="space-y-1">
                <div className="relative glass-underline-field rounded-t-xl group">
                  <input
                    type="email"
                    required
                    placeholder="Work Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#00AAFF] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password Fields in 2-Col on larger screen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div className="space-y-1">
                  <div className="relative glass-underline-field rounded-t-xl group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password (Min 6)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <div className="relative glass-underline-field rounded-t-xl group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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

              {/* Brand Gradient Pill CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full glass-pill-btn font-semibold text-sm flex items-center justify-center gap-2 mt-4 shadow-[0_10px_35px_rgba(0,87,255,0.4)]"
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
              <p className="text-[11px] text-center text-slate-400/80 pt-1 leading-relaxed">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-[#00AAFF] hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-[#00AAFF] hover:underline">Privacy Policy</Link>.
              </p>

              {/* Bottom Quick Link */}
              <div className="pt-3 text-center text-xs text-slate-300/80 border-t border-white/10">
                <span>Already have an active account? </span>
                <Link
                  href="/login"
                  className="font-semibold text-[#00AAFF] hover:text-[#0088FF] transition"
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
        <div className="min-h-screen flex items-center justify-center bg-[#030712]">
          <div className="w-10 h-10 rounded-full border-2 border-[#00AAFF] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
