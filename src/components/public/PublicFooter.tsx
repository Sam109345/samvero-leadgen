import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Globe, Lock, ArrowUpRight, Zap } from 'lucide-react';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';

export default function PublicFooter() {
  return (
    <footer
      className="relative overflow-hidden pt-16 pb-12"
      style={{ background: '#030712', borderTop: '1px solid rgba(0,87,255,0.15)' }}
    >
      {/* Animated gradient divider top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, #0057FF, #00AAFF, #0057FF, transparent)',
          backgroundSize: '200% auto',
          animation: 'shimmer 4s linear infinite',
          opacity: 0.6,
        }}
      />

      {/* Background orbs */}
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,87,255,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute top-10 right-10 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12"
          style={{ borderBottom: '1px solid rgba(0,87,255,0.08)' }}
        >
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <SamveroBrandLogo size="md" theme="dark" tagline={false} />
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(148,163,184,0.8)', maxWidth: '20rem' }}>
              Discover real business opportunities, research companies, access verified contact information
              and manage your entire prospecting workflow from one intelligent platform.
            </p>
            <div className="flex items-center gap-3 text-xs pt-2 flex-wrap">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]"
                style={{
                  background: 'rgba(10,15,30,0.8)',
                  border: '1px solid rgba(0,87,255,0.15)',
                  color: 'rgba(148,163,184,1)',
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                <span>Zero Fabricated Contacts</span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]"
                style={{
                  background: 'rgba(10,15,30,0.8)',
                  border: '1px solid rgba(0,87,255,0.15)',
                  color: 'rgba(148,163,184,1)',
                }}
              >
                <Lock className="w-3.5 h-3.5" style={{ color: '#00AAFF' }} />
                <span>Multi-Tenant Isolation</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs" style={{ color: '#94a3b8' }}>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors duration-200">
                  Six Subscription Packages
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#features" className="hover:text-white transition-colors duration-200">
                  Features & Connectors
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="flex items-center gap-1 transition-colors duration-200"
                  style={{ color: '#00AAFF' }}
                >
                  <span>Customer Application</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs" style={{ color: '#94a3b8' }}>
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  About Samvero
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Customer Support</h4>
            <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
              Official customer inquiries & payment verification desk:
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:samverodigital@gmail.com"
                className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
                style={{ color: '#94a3b8' }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: '#00AAFF' }} />
                <span>samverodigital@gmail.com</span>
              </a>
              <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
                <Globe className="w-3.5 h-3.5" style={{ color: '#475569' }} />
                <span>Global Commercial Desk</span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                style={{
                  background: 'rgba(10,15,30,0.8)',
                  border: '1px solid rgba(0,87,255,0.2)',
                  color: '#94a3b8',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = '#fff';
                  el.style.borderColor = 'rgba(0,170,255,0.4)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = '#94a3b8';
                  el.style.borderColor = 'rgba(0,87,255,0.2)';
                }}
              >
                <span>Existing Customer Login</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ color: '#475569', fontSize: '11px' }}>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3" style={{ color: '#0057FF' }} />
            <p>© {new Date().getFullYear()} SAMVERO. All rights reserved. AI-Powered Lead Generation SaaS.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors duration-200">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors duration-200">Privacy</Link>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors duration-200">Pricing</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors duration-200">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
