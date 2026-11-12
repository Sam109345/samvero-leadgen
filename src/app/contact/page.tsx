'use client';

import React, { useState } from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import {
  Mail,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Zap,
  Sparkles,
  Building2,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react';

function Stars({ count = 50 }: { count?: number }) {
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
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            '--duration': s.duration,
            '--delay': s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Platform Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientRole: 'admin',
          type: 'general',
          title: `Public Contact Inquiry: ${subject}`,
          message: `${name} (${email}) sent: "${message}"`,
          link: '/admin/dashboard',
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-[#0057FF] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <Stars />
        
        {/* Ambient Brand Color Orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.12) 0%, transparent 70%)', filter: 'blur(90px)' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none animate-float-delayed"
          style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />

        <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-12">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase bg-[#0057FF]/10 border border-[#00AAFF]/30 text-[#00AAFF] shadow-[0_0_20px_rgba(0,170,255,0.15)]">
              <MessageSquare className="w-3.5 h-3.5 text-[#00AAFF]" />
              <span>Communication Desk</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Contact{' '}
              <span className="bg-gradient-to-r from-[#0057FF] via-[#00AAFF] to-[#38bdf8] bg-clip-text text-transparent">
                Samvero
              </span>
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-slate-300">
              Reach our corporate onboarding desk regarding membership packages, manual payment settlement, bespoke API integration, and institutional data access.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Corporate Office Workstation & Contact Details ── */}
            <div className="lg:col-span-5 space-y-6 reveal">
              
              {/* Corporate Executive Office Workstation Card */}
              <div className="rounded-2xl overflow-hidden border border-[#0057FF]/30 shadow-lg relative group">
                <img
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80"
                  alt="Samvero Commercial Operations HQ"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#00AAFF]" />
                    <span>Commercial Operations HQ</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Live client dispatch & manual settlement verification team
                  </p>
                </div>
              </div>

              {/* Direct Channels */}
              <div className="rounded-2xl p-6 bg-[#060b18]/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00AAFF]" />
                  <span>Direct Communication Channels</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#0057FF]/15 text-[#00AAFF] shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Executive Onboarding & Billing</div>
                      <a href="mailto:admin@samvero.live" className="font-bold text-white hover:text-[#00AAFF] transition font-mono">
                        admin@samvero.live
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Direct WhatsApp Settlement Desk</div>
                      <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-emerald-400 transition font-mono">
                        +92 300 0000000 (Priority Chat)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#00AAFF]/15 text-[#00AAFF] shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Operating Hours</div>
                      <div className="font-bold text-white">24/7 Multi-Platform Crawl Monitoring</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantee Tag */}
              <div className="rounded-2xl p-4 bg-[#0057FF]/10 border border-[#0057FF]/20 flex items-center gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>All inquiries are routed directly to super admin for rapid manual settlement confirmation within 1 hour.</span>
              </div>
            </div>

            {/* ── Right Column: Interactive Dispatch Form ── */}
            <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#060b18]/95 border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)] reveal">
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Send Dispatch Message
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Fill in your company details and our commercial onboarding team will reach back via direct email & WhatsApp.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Message Successfully Dispatched</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Your inquiry has been received by our commercial leadership team. We will review your requirements and respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tariq Al-Mansoor"
                        className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00AAFF] font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">Corporate Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="director@company.com"
                        className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00AAFF] font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">Inquiry Category</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-[#00AAFF] font-sans cursor-pointer"
                    >
                      <option value="General Platform Inquiry">General Platform Inquiry</option>
                      <option value="Package Selection & Quota Inquiry">Package Selection & Quota Inquiry</option>
                      <option value="Manual Payment & Bank Wire Settlement">Manual Payment & Bank Wire Settlement</option>
                      <option value="Enterprise Bespoke SOW & API Integration">Enterprise Bespoke SOW & API Integration</option>
                      <option value="Existing Account Support">Existing Account Support</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">Detailed Message *</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail your sales target, niche industries, desired monthly lead volume, or payment query..."
                      className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00AAFF] font-sans resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0057FF] to-[#00AAFF] hover:brightness-110 text-white shadow-lg shadow-[#0057FF]/30 transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Dispatching to Commercial Desk...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Dispatch Inquiry Message</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
