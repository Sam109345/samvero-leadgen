'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';
import SamveroBrandLogo from '@/components/SamveroBrandLogo';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#030712]/90 backdrop-blur-xl border-b py-3'
          : 'bg-transparent py-5'
      }`}
      style={scrolled ? {
        borderBottomColor: 'rgba(0,87,255,0.2)',
        boxShadow: '0 0 40px rgba(0,87,255,0.08), 0 1px 0 rgba(0,87,255,0.15)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand Logo with glow hover */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            style={{ filter: 'drop-shadow(0 0 0px rgba(0,87,255,0))' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(0 0 12px rgba(0,170,255,0.6))';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(0 0 0px rgba(0,87,255,0))';
            }}
          >
            <SamveroBrandLogo size="md" theme="dark" />
          </Link>

          {/* Desktop Nav – glassmorphism pill */}
          <nav
            className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(10,15,30,0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0,87,255,0.15)',
              boxShadow: '0 0 20px rgba(0,87,255,0.08)',
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 group"
                  style={{
                    color: isActive ? '#00AAFF' : 'rgba(203,213,225,1)',
                    background: isActive ? 'rgba(0,87,255,0.15)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(203,213,225,1)';
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: '#00AAFF', boxShadow: '0 0 6px #00AAFF' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200"
              style={{ color: 'rgba(203,213,225,1)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#fff';
                el.style.background = 'rgba(0,87,255,0.1)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'rgba(203,213,225,1)';
                el.style.background = 'transparent';
              }}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-nasa text-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-all"
            style={{
              background: 'rgba(10,15,30,0.8)',
              border: '1px solid rgba(0,87,255,0.2)',
              color: '#94a3b8',
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pt-3 pb-6 space-y-3 mt-3 animate-slide-down"
          style={{
            background: 'rgba(3,7,18,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,87,255,0.15)',
          }}
        >
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  color: pathname === link.href ? '#00AAFF' : '#cbd5e1',
                  background: pathname === link.href ? 'rgba(0,87,255,0.1)' : 'transparent',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div
            className="pt-3 flex flex-col gap-2"
            style={{ borderTop: '1px solid rgba(0,87,255,0.1)' }}
          >
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold rounded-xl transition-all"
              style={{
                background: 'rgba(10,15,30,0.8)',
                border: '1px solid rgba(0,87,255,0.2)',
                color: '#e2e8f0',
              }}
            >
              Login to Account
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold rounded-xl btn-nasa justify-center"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
