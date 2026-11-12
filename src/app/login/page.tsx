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
  Database,
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
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#030712] text-slate-100 overflow-hidden font-sans select-none">
      {/* ── Atmospheric Ambient Satin Lights (Electric Blue & Cyan Theme) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Electric blue specular glow at top-left */}
        <div className="absolute -top-40 -left-40 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-[#0057FF]/30 via-[#00AAFF]/15 to-transparent blur-[140px]" />
        
        {/* Cyan rim glow at bottom-right */}
        <div className="absolute -bottom-40 -right-40 w-[720px] h-[720px] rounded-full bg-gradient-to-tl from-[#0057FF]/25 via-[#00AAFF]/15 to-transparent blur-[150px]" />

        {/* Center ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#0057FF]/10 rounded-full blur-[170px]" />
      </div>

      <StarDust count={35} />

      {/* ── Main Glassmorphism Frame ── */}
      <div className="w-full max-w-4xl relative z-10 glass-login-outer rounded-[2.5rem] p-4 sm:p-6 md:p-8">
        
        {/* Top Header: Brand Logo & Back to Home */}
        <div className="flex items-center justify-between px-3 pb-5 mb-4 border-b border-white/10">
          <Link href="/" className="hover:opacity-90 transition">
            <SamveroBrandLogo size="md" theme="dark" />
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-[#00AAFF] hover:text-white px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#0057FF]/30 hover:border-[#00AAFF]/50 transition flex items-center gap-1.5 backdrop-blur-md"
          >
            <span>Back to Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Split: Left Specimen Sculpture + Right Frosted Glass Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ── LEFT PANEL: High-Tech Specimen Hologram & Intelligence Card ── */}
          <div className="lg:col-span-5 hidden sm:flex flex-col justify-between rounded-[2rem] bg-[#060b18]/95 border border-[#0057FF]/25 p-6 relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_15px_40px_rgba(0,0,0,0.7)]">
            
            {/* Top Status Pill */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-[#00AAFF] bg-[#0057FF]/15 border border-[#0057FF]/30">
                <Sparkles className="w-3 h-3 text-[#00AAFF] animate-pulse" />
                <span>AI RADAR • V4.2</span>
              </span>

              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>

            {/* Glowing Hologram Artwork */}
            <div className="relative my-6 flex items-center justify-center">
              {/* Floor light puddle (Electric Blue to Cyan Glow) */}
              <div className="absolute -bottom-4 w-52 h-24 rounded-full bg-gradient-to-t from-[#0057FF]/70 via-[#00AAFF]/35 to-transparent blur-2xl pointer-events-none" />
              
              <div className="relative w-52 h-64 flex items-center justify-center">
                <svg viewBox="0 0 220 260" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,170,255,0.5)]">
                  <defs>
                    {/* Plant leaf gradients (Strictly Electric Blue to Cyan Theme) */}
                    <linearGradient id="leafCenter" x1="0%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor="#0033aa" />
                      <stop offset="40%" stopColor="#0057FF" />
                      <stop offset="85%" stopColor="#00AAFF" />
                      <stop offset="100%" stopColor="#e0f2fe" />
                    </linearGradient>
                    <linearGradient id="leafCyan" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#030712" />
                      <stop offset="50%" stopColor="#0057FF" />
                      <stop offset="85%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#bae6fd" />
                    </linearGradient>
                    <linearGradient id="leafBlueAccent" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#022c6e" />
                      <stop offset="50%" stopColor="#0057FF" />
                      <stop offset="85%" stopColor="#00AAFF" />
                      <stop offset="100%" stopColor="#7dd3fc" />
                    </linearGradient>
                    {/* Pot metallic gradient */}
                    <linearGradient id="potShine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0e1a38" />
                      <stop offset="40%" stopColor="#081024" />
                      <stop offset="100%" stopColor="#030712" />
                    </linearGradient>
                    <radialGradient id="potInnerGlow" cx="50%" cy="100%" r="75%">
                      <stop offset="0%" stopColor="#00AAFF" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#0057FF" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#030712" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowBlur" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Floor Reflection Ring */}
                  <ellipse cx="110" cy="242" rx="55" ry="10" fill="#0057FF" opacity="0.35" filter="blur(6px)" />
                  <ellipse cx="110" cy="240" rx="35" ry="5" fill="#00AAFF" opacity="0.5" filter="blur(3px)" />

                  {/* Potted Cup / Pot */}
                  <path d="M 65 160 L 155 160 L 142 235 C 142 240, 78 240, 78 235 Z" fill="url(#potShine)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <path d="M 65 160 L 155 160 L 142 235 C 142 240, 78 240, 78 235 Z" fill="url(#potInnerGlow)" />
                  {/* Rim */}
                  <ellipse cx="110" cy="160" rx="45" ry="9" fill="#0c1938" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                  <ellipse cx="110" cy="160" rx="42" ry="7" fill="#060e22" />

                  {/* Bioluminescent Succulent Foliage (Strict Electric Blue to Cyan Logo Theme) */}
                  {/* Central tall leaf */}
                  <path d="M 110 158 C 98 105, 95 40, 110 20 C 125 40, 122 105, 110 158 Z" fill="url(#leafCenter)" opacity="0.96" filter="url(#glowBlur)" />
                  
                  {/* Inner Left leaf */}
                  <path d="M 105 158 C 76 118, 62 65, 80 38 C 96 60, 106 115, 105 158 Z" fill="url(#leafCyan)" opacity="0.92" />
                  
                  {/* Inner Right leaf */}
                  <path d="M 115 158 C 144 118, 158 65, 140 38 C 124 60, 114 115, 115 158 Z" fill="url(#leafBlueAccent)" opacity="0.92" />

                  {/* Outer Left leaf */}
                  <path d="M 98 160 C 58 135, 42 90, 56 70 C 74 85, 92 125, 98 160 Z" fill="url(#leafCenter)" opacity="0.85" />

                  {/* Outer Right leaf */}
                  <path d="M 122 160 C 162 135, 178 90, 164 70 C 146 85, 128 125, 122 160 Z" fill="url(#leafCyan)" opacity="0.85" />

                  {/* Delicate sprigs sprouting outwards */}
                  <path d="M 85 150 C 65 130, 52 110, 50 102 C 60 108, 75 125, 85 150 Z" fill="#00AAFF" opacity="0.9" />
                  <path d="M 135 150 C 155 130, 168 110, 170 102 C 160 108, 145 125, 135 150 Z" fill="#38bdf8" opacity="0.9" />

                  {/* Glowing bioluminescent spores */}
                  <circle cx="110" cy="18" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px #fff)" />
                  <circle cx="80" cy="36" r="2.5" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)" />
                  <circle cx="140" cy="36" r="2.5" fill="#00AAFF" filter="drop-shadow(0 0 5px #00AAFF)" />
                  <circle cx="55" cy="68" r="2" fill="#7dd3fc" />
                  <circle cx="165" cy="68" r="2" fill="#bae6fd" />
                  <circle cx="48" cy="100" r="1.5" fill="#38bdf8" />
                  <circle cx="172" cy="100" r="1.5" fill="#e0f2fe" />
                </svg>
              </div>
            </div>

            {/* Bottom Proof Metrics */}
            <div className="relative z-10 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00AAFF]" />
                  <span>Verified Deliverability</span>
                </span>
                <span className="font-mono font-bold text-white">98.4%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#00AAFF]" />
                  <span>Active Lead Pipeline</span>
                </span>
                <span className="font-mono font-bold text-white">50K+ Ingested</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: Clean Frosted Glass Form ── */}
          <div className="lg:col-span-7 flex flex-col justify-center px-2 sm:px-6 py-4 glass-login-pane rounded-[2rem] p-6 sm:p-8">
            
            {/* Heading & Subtitle */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Login
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/80">
                Welcome back. Access your verified lead intelligence command center.
              </p>
            </div>

            {/* Quick Demo Autofill Pills (Unobtrusive) */}
            <div className="flex items-center gap-2 mb-6 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00AAFF] px-2 shrink-0">Demo:</span>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="flex-1 py-1 px-2.5 rounded-xl text-xs font-medium bg-[#0057FF]/20 hover:bg-[#0057FF]/35 text-[#00AAFF] border border-[#0057FF]/40 transition"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('user')}
                className="flex-1 py-1 px-2.5 rounded-xl text-xs font-medium bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 border border-blue-500/30 transition"
              >
                Client Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Underline Field (Screenshot 1 Match) */}
              <div className="space-y-1">
                <div className="relative glass-underline-field rounded-t-xl group">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#00AAFF] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password Underline Field */}
              <div className="space-y-1">
                <div className="relative glass-underline-field rounded-t-xl group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#0057FF] focus:ring-0 focus:ring-offset-0 cursor-pointer"
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
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Row Links */}
              <div className="pt-4 flex items-center justify-between text-xs text-slate-300/80">
                <Link
                  href="/signup"
                  className="hover:text-[#00AAFF] transition flex items-center gap-1 font-medium"
                >
                  <span>Create an account</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="hover:text-[#00AAFF] transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[2rem] p-6 glass-login-outer border border-white/20 animate-scale-in">
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
                  className="w-full py-3 rounded-full glass-pill-plum-btn text-xs font-semibold"
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
                    className="flex-1 py-3 rounded-full text-xs font-semibold glass-pill-plum-btn"
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
        <div className="min-h-screen flex items-center justify-center bg-[#070312]">
          <div className="w-10 h-10 rounded-full border-2 border-[#00AAFF] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
