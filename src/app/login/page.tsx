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
  X,
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

  useEffect(() => {
    document.documentElement.classList.add('dark');
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
        setSuccessMsg(`Welcome back, ${data.userName || 'Commander'}! Redirecting...`);
        setTimeout(() => { window.location.href = destination; }, 500);
      } else {
        setErrorMsg(data.error || 'Invalid email or password. Please verify your credentials.');
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
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#06030e] text-slate-100 overflow-hidden font-sans select-none">
      {/* ── Atmospheric Cosmic Gradients & Lighting ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft violet/lavender ambient glow at top-left (screenshot 1 reference) */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-purple-700/30 via-fuchsia-600/15 to-transparent blur-[120px]" />
        
        {/* Deep blue/indigo halo at bottom-right */}
        <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-indigo-700/25 via-blue-600/10 to-transparent blur-[140px]" />

        {/* Central warm glow pool */}
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

          <Link
            href="/"
            className="text-xs font-medium text-purple-300/80 hover:text-white px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-purple-400/40 transition flex items-center gap-1.5"
          >
            <span>Back to Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Split: Left Visual Capsule + Right Clean Glass Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ── LEFT PANEL: Luminous 3D Plant / AI Core Visual (Screenshot 1 Match) ── */}
          <div className="lg:col-span-5 hidden sm:flex flex-col justify-between rounded-[2rem] bg-[#0c0818]/90 border border-white/10 p-6 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            
            {/* Top pill badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-purple-300 bg-purple-500/15 border border-purple-500/30">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                <span>AI RADAR • V4.2</span>
              </span>

              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>

            {/* Glowing Botanical / Cosmic Hologram Sculpture with Ambient Light Floor */}
            <div className="relative my-8 flex items-center justify-center">
              {/* Floor light puddle (Screenshot 1 lilac glowing base) */}
              <div className="absolute -bottom-6 w-48 h-20 rounded-full bg-gradient-to-t from-purple-500/60 via-fuchsia-500/30 to-transparent blur-xl pointer-events-none" />
              
              {/* Holographic Glowing Plant / Specimen Illustration */}
              <div className="relative w-48 h-56 flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_15px_30px_rgba(168,85,247,0.5)]">
                  <defs>
                    <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#e879f9" />
                    </linearGradient>
                    <linearGradient id="potGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b1d6e" />
                      <stop offset="50%" stopColor="#1e1038" />
                      <stop offset="100%" stopColor="#0f0720" />
                    </linearGradient>
                    <radialGradient id="potGlow" cx="50%" cy="100%" r="80%">
                      <stop offset="0%" stopColor="#d946ef" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#0f0720" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Luminous pot */}
                  <path d="M 60 150 L 140 150 L 130 215 C 130 220, 70 220, 70 215 Z" fill="url(#potGrad)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <path d="M 60 150 L 140 150 L 130 215 C 130 220, 70 220, 70 215 Z" fill="url(#potGlow)" />
                  <ellipse cx="100" cy="150" rx="40" ry="8" fill="#4c1d95" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <ellipse cx="100" cy="216" rx="30" ry="5" fill="#f43f5e" opacity="0.4" filter="blur(3px)" />

                  {/* Foliage leaves in Screenshot 1 organic arrangement */}
                  {/* Central tall leaf */}
                  <path d="M 100 148 C 88 100, 85 45, 100 25 C 115 45, 112 100, 100 148 Z" fill="url(#leafGrad)" opacity="0.95" />
                  {/* Left leaf */}
                  <path d="M 95 148 C 70 115, 55 70, 72 45 C 88 65, 96 110, 95 148 Z" fill="url(#stemGrad)" opacity="0.9" />
                  {/* Far left leaf */}
                  <path d="M 90 150 C 55 130, 38 95, 50 78 C 68 90, 85 125, 90 150 Z" fill="url(#leafGrad)" opacity="0.8" />
                  {/* Right leaf */}
                  <path d="M 105 148 C 130 115, 145 70, 128 45 C 112 65, 104 110, 105 148 Z" fill="url(#leafGrad)" opacity="0.9" />
                  {/* Far right leaf */}
                  <path d="M 110 150 C 145 130, 162 95, 150 78 C 132 90, 115 125, 110 150 Z" fill="url(#stemGrad)" opacity="0.8" />

                  {/* Delicate sprigs & bioluminescent spores */}
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
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Verified Deliverability</span>
                </span>
                <span className="font-mono font-bold text-white">98.4%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real Lead Pipeline</span>
                </span>
                <span className="font-mono font-bold text-white">50K+ Active</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: Clean Minimalist Glassmorphic Login Form (Screenshot 1 Match) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center px-2 sm:px-6 py-4">
            
            {/* Heading & Subtitle */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Login
              </h1>
              <p className="text-sm text-slate-400">
                Welcome back. Access your verified lead generation command center.
              </p>
            </div>

            {/* Quick Demo Credentials Autofill Pills */}
            <div className="flex items-center gap-2 mb-6 p-2 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300/80 px-2 shrink-0">Demo:</span>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border border-purple-500/20 hover:border-purple-500/40 transition"
              >
                Admin (Super)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('user')}
                className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 border border-blue-500/20 hover:border-blue-500/40 transition"
              >
                Client Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Field with Glass Underline/Pill */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-2xl glass-luxury-input text-sm text-white placeholder-slate-500 font-sans"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password Field with Show/Hide toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-2xl glass-luxury-input text-sm text-white placeholder-slate-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Stay logged in on this browser</span>
                </label>
              </div>

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
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Quick Links */}
              <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
                <Link
                  href="/signup"
                  className="hover:text-purple-300 transition flex items-center gap-1 font-medium"
                >
                  <span>Create an account</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="hover:text-purple-300 transition"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Forgot Password Glass Modal ── */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[2rem] p-6 glass-luxury-container border border-white/20 animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">
                Reset Password
              </h3>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
                <div>
                  <h4 className="font-bold text-white text-base mb-1">Recovery Dispatched</h4>
                  <p className="text-xs text-slate-400">
                    If an account is associated with <b className="text-slate-200">{forgotEmail}</b>, password reset instructions have been sent.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full py-3 rounded-full glass-pill-btn text-xs font-semibold"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter your registered account email and we'll dispatch an instant reset link.
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Registered Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-2xl glass-luxury-input text-sm text-white placeholder-slate-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-3 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full text-xs font-semibold glass-pill-btn"
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
        <div className="min-h-screen flex items-center justify-center bg-[#06030e]">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
