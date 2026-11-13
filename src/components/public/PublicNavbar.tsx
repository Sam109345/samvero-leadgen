'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Zap, Sparkles } from 'lucide-react';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/how-it-works#features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060b18]/90 backdrop-blur-2xl border-b border-white/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand Logo with glow hover */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
            >
              <SamveroBrandLogo size="md" theme="dark" />
            </Link>

            {/* DevMilosh / Huly style live status indicator */}
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>LIVE RADAR ACTIVE • 99.98%</span>
            </div>
          </div>

          {/* Desktop Nav – glassmorphism pill */}
          <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-[#0057FF]/25 border border-[#00AAFF]/40 shadow-sm shadow-[#0057FF]/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00AAFF] shadow-[0_0_6px_#00AAFF]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="glass-pill-btn px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-2xl bg-white/[0.05] border border-white/15 text-slate-300 hover:text-white transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 space-y-3 mt-3 bg-[#030712]/95 backdrop-blur-2xl border-b border-white/15 animate-slide-down">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  pathname === link.href
                    ? 'text-[#00AAFF] bg-[#0057FF]/15 border border-[#0057FF]/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 flex flex-col gap-2 border-t border-white/10">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold rounded-full bg-white/[0.05] border border-white/15 text-white"
            >
              Login to Account
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold rounded-full glass-pill-btn"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
