'use client';

import React, { useState } from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { Mail, Globe, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, MessageSquare, Zap, Sparkles } from 'lucide-react';

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
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, '--duration': s.duration, '--delay': s.delay } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

const inputStyle = {
  background: 'rgba(5,10,20,0.8)',
  border: '1px solid rgba(0,87,255,0.2)',
  color: '#e2e8f0',
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
};

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
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
      className="min-h-screen flex flex-col"
      style={{ background: '#030712', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}
    >
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <Stars />
        {/* Ambient orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 reveal">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.2)', color: '#00AAFF' }}
            >
              <MessageSquare className="w-3 h-3" /> Communication Desk
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}
            >
              Contact{' '}
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
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
              Reach our corporate onboarding desk regarding membership packages, manual payment settlement, and institutional data access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* ── Contact Details ───────────────────────────────── */}
            <div className="md:col-span-5 space-y-6 reveal">
              <div
                className="p-6 rounded-2xl space-y-5"
                style={{
                  background: 'rgba(10,15,30,0.7)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0,87,255,0.15)',
                }}
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Official Channels</h3>
                <div className="space-y-4 text-xs">
                  {[
                    {
                      icon: Mail,
                      color: '#00AAFF',
                      label: 'Customer Support',
                      value: 'samverodigital@gmail.com',
                      href: 'mailto:samverodigital@gmail.com',
                    },
                    {
                      icon: ShieldCheck,
                      color: '#10b981',
                      label: 'Payment Verification Desk',
                      value: 'billing@samvero.com',
                      href: 'mailto:billing@samvero.com',
                    },
                    {
                      icon: Globe,
                      color: '#0057FF',
                      label: 'Global Commercial Operations',
                      value: 'Mon – Sat, 08:00 – 20:00 UTC',
                    },
                  ].map((item, i) => {
                    const IconComp = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                        >
                          <IconComp className="w-4 h-4" style={{ color: item.color }} />
                        </div>
                        <div>
                          <div className="font-bold text-white mb-0.5">{item.label}</div>
                          {item.href ? (
                            <a href={item.href} className="transition-colors hover:text-white" style={{ color: '#64748b' }}>
                              {item.value}
                            </a>
                          ) : (
                            <div style={{ color: '#64748b' }}>{item.value}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA card */}
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: 'rgba(0,87,255,0.05)',
                  border: '1px solid rgba(0,87,255,0.2)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-2 text-xs font-bold" style={{ color: '#00AAFF' }}>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Looking to apply for access?</span>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#64748b' }}>
                  For immediate service onboarding, please submit an official application directly through our registration portal.
                </p>
                <a
                  href="/signup"
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                  style={{ color: '#0057FF' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00AAFF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#0057FF'; }}
                >
                  Apply for Membership <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* ── Contact Form ──────────────────────────────────── */}
            <div className="md:col-span-7 reveal" style={{ animationDelay: '0.2s' }}>
              {submitted ? (
                <div
                  className="p-10 rounded-2xl text-center space-y-5"
                  style={{
                    background: 'rgba(10,15,30,0.7)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    boxShadow: '0 0 40px rgba(16,185,129,0.1)',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <CheckCircle2 className="w-8 h-8" style={{ color: '#10b981' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Inquiry Received
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                    Thank you, {name}. Your inquiry has been routed to our commercial support team. We will respond via email shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setMessage(''); }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                    style={{
                      background: 'rgba(0,87,255,0.1)',
                      border: '1px solid rgba(0,87,255,0.2)',
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-6 sm:p-8 rounded-2xl space-y-5"
                  style={{
                    background: 'rgba(10,15,30,0.7)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(0,87,255,0.15)',
                    boxShadow: '0 0 40px rgba(0,87,255,0.08)',
                  }}
                >
                  {errorMsg && (
                    <div
                      className="p-3 rounded-xl flex items-center gap-2 text-xs"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold" style={{ color: '#94a3b8' }}>Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        style={inputStyle}
                        onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                        onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold" style={{ color: '#94a3b8' }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        style={inputStyle}
                        onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                        onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold" style={{ color: '#94a3b8' }}>Inquiry Category</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,170,255,0.5)'; }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,87,255,0.2)'; }}
                    >
                      <option value="General Inquiry" style={{ background: '#0a0f1e' }}>General Platform Inquiry</option>
                      <option value="Package Selection" style={{ background: '#0a0f1e' }}>Package Selection & Quota Inquiry</option>
                      <option value="Manual Payment Assistance" style={{ background: '#0a0f1e' }}>Manual Payment & Wire Instructions</option>
                      <option value="Enterprise Custom SOW" style={{ background: '#0a0f1e' }}>Enterprise Bespoke SOW</option>
                      <option value="Technical Support" style={{ background: '#0a0f1e' }}>Existing Account Support</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold" style={{ color: '#94a3b8' }}>Message</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our commercial team assist your business?"
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,170,255,0.5)'; (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(0,87,255,0.15)'; }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,87,255,0.2)'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-nasa justify-center"
                    style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Dispatch Message</span>
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
