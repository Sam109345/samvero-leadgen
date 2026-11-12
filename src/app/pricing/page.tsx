'use client';

import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import SubscriptionPricingView from '@/components/subscription/SubscriptionPricingView';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-[#0057FF] selection:text-white relative overflow-hidden">
      {/* Background radial space glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0057FF]/15 via-[#00AAFF]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#0057FF]/10 blur-[130px] pointer-events-none" />

      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <SubscriptionPricingView />
      </main>

      <PublicFooter />
    </div>
  );
}
