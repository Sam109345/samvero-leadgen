import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Globe, Lock, ArrowUpRight } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#050811] text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/70">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-black font-black text-base tracking-wider">S</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white font-serif">
                SAMVERO
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover real business opportunities, research companies, access verified contact information and manage your entire prospecting workflow from one intelligent platform.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Fabricated Contacts</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Multi-Tenant Isolation</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Six Subscription Packages
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#features" className="hover:text-white transition">
                  Features & Connectors
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition flex items-center gap-1 text-amber-400">
                  <span>Customer Application</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Samvero
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Customer Support</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official customer inquiries & payment verification desk:
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:support@samvero.com"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@samvero.com</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Global Commercial Desk</span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
              >
                <span>Existing Customer Login</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} SAMVERO. All rights reserved. Commercial Multi-Tenant Lead Generation SaaS.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition">
              Terms
            </Link>
            <Link href="/privacy-policy" className="hover:text-slate-300 transition">
              Privacy
            </Link>
            <Link href="/pricing" className="hover:text-slate-300 transition">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
