'use client';

import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import SubscriptionPricingView from '@/components/subscription/SubscriptionPricingView';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0b1320] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20">
        <SubscriptionPricingView />
      </main>

      <PublicFooter />
    </div>
  );
}
