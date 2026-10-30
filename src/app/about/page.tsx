'use client';

import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { ShieldCheck, Target, CheckCircle2, Award, Users, Globe2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">About Samvero</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 font-serif">
              Engineering True Lead Intelligence
            </h1>
            <p className="text-slate-300 text-base mt-4 leading-relaxed">
              We founded Samvero on a single, uncompromising thesis: Modern sales professionals and commercial agencies waste millions of hours on synthetic databases, outdated email lists, and dead prospects.
            </p>
          </div>

          {/* Core Philosophy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Genuine Commercial Intent</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We discover businesses at the exact moment they post active commercial needs, renew public licenses, or seek agency partnerships. Zero cold guesswork.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Audited Provenance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every email address, phone line, and operational address is linked directly to primary evidence URLs and DNS mail-server probe logs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center font-bold">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Tenant Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customer workspaces are completely isolated. Quotas, research history, custom lists, and prospecting notes are strictly private to each tenant.
              </p>
            </div>
          </div>

          {/* Standards & Execution */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1226] to-slate-950 border border-slate-800 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Our Zero-Fabrication Guarantee
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Unlike generic scrapers that mass-generate synthetic corporate inboxes, Samvero enforces rigorous multi-source validation:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Real-time DNS & MX Mail Exchange Verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ITU-T E.164 International Phone Formatting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>SSL & Mobile Responsiveness Audit on Live Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Strict Server-Side Lead Allocation & Quota Enforcement</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition flex items-center gap-2"
              >
                <span>Apply for Membership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
