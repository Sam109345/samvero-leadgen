'use client';

import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Legal Agreement</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 mt-2">Last Updated: October 30, 2026</p>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">1. Service Overview & Platform Scope</h2>
              <p>
                SAMVERO Technologies Inc. (&ldquo;SAMVERO&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) provides commercial B2B lead generation, business intelligence, contact enrichment, and pipeline workflow services through our subscription software platform. By applying for access or logging into an active account, you (&ldquo;Customer&rdquo;, &ldquo;Tenant&rdquo;) agree to be legally bound by these Terms of Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">2. Customer Applications & Account Provisioning</h2>
              <p>
                Public registration constitutes an application for service. Samvero does not grant automated access upon form submission. All applications undergo requirements review and verified manual payment processing before customer accounts and workspace credentials are created.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">3. Manual Payment Settlement & Billing Cycles</h2>
              <p>
                Subscribers agree to settle fees via verified Bank Wire Transfer, Wise Direct, or approved corporate invoice. Subscriptions activate immediately upon administrative confirmation of received funds. Durations (Monthly, Quarterly, Half-Yearly, Annual) define active term windows and fresh lead allowances.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">4. Lead Quota & Plan Entitlements</h2>
              <p>
                Each subscription package includes an explicit maximum lead quota per billing cycle. Unused leads do not expire existing saved records; however, new lead consumption and background enrichment cease once the quota limit is reached until the account is upgraded or renewed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">5. Multi-Tenant Data Isolation & Security</h2>
              <p>
                Customer data, including saved leads, research records, custom lists, and outreach notes, is strictly isolated. We implement server-side tenant scoping and Row Level Security. Cross-tenant access is strictly prohibited and monitored.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">6. Data Provenance & Appropriate Use</h2>
              <p>
                Samvero extracts and validates publicly available commercial entity data. Customers agree to utilize contact information strictly in compliance with applicable anti-spam laws, including CAN-SPAM, GDPR, and PECR. Mass abusive spamming is grounds for immediate account suspension without refund.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">7. Expiration, Renewal & Termination</h2>
              <p>
                Upon subscription expiration, premium discovery features are locked. Existing saved customer leads remain preserved. Accounts may be renewed by submitting a renewal request and settling the renewal fee.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
