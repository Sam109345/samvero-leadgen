'use client';

import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import SubscriptionPricingView from '@/components/subscription/SubscriptionPricingView';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-[#0057FF] selection:text-white relative overflow-hidden">
      {/* Background radial space glow (Strict Electric Blue to Cyan Theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0057FF]/15 via-[#00AAFF]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#00AAFF]/10 blur-[130px] pointer-events-none" />

      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24 relative z-10 space-y-16">
        <SubscriptionPricingView />

        {/* Corporate Headquarters & Team Imagery Showcase (Inner Page Requirement) */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl p-8 bg-[#060b18]/95 border border-[#0057FF]/30 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-[0_20px_60px_rgba(0,87,255,0.15)]">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#0057FF]/20 text-[#00AAFF] border border-[#0057FF]/30">
                Institutional Deployment
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Enterprise Quota Provisioning & Settlement
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether deploying for a boutique agency or an international commercial sales force, each subscription tier is accompanied by isolated tenant sandboxes, validated ITU telephone records, and automated WhatsApp click-to-pitch workflows.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-emerald-400">
                <span>✓ Audited Bank Wire Receipts</span>
                <span>✓ Wise Direct Escrow</span>
                <span>✓ Super Admin Activation</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-[#00AAFF]/30 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80"
                alt="Corporate Executive Closing & Settlement"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-[11px] text-slate-300 font-mono">
                Commercial Settlement Desk • Samvero Global Acquisition
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
