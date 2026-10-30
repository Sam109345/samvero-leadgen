'use client';

import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Data Protection</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-2">Effective Date: October 30, 2026</p>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">1. Information We Collect</h2>
              <p>
                When you apply for Samvero membership, we collect your name, business email, WhatsApp contact number, operating jurisdiction, and service requirements. When you use the platform, we maintain audit telemetry including login IP addresses, device user-agents, and session durations to secure multi-tenant boundaries.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">2. Commercial Lead Data Processing</h2>
              <p>
                Our search and discovery engines process publicly accessible commercial information, such as Google Business listings, verified corporate websites, public directories, and freelance marketplace job postings. We do not process private sensitive personal data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">3. Multi-Tenant Data Isolation Guarantee</h2>
              <p>
                Your private leads, pipeline stages, custom tags, and private client communications are strictly isolated within your tenant context. No customer can query or view another customer&apos;s lead records or research jobs.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">4. Data Retention & Preservation</h2>
              <p>
                Saved leads and client notes are retained indefinitely in your account until you delete them. In the event of subscription expiration, existing customer data remains preserved and is not deleted.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white">5. Contact Information</h2>
              <p>
                For privacy compliance inquiries or data deletion requests, please contact our Data Governance Officer at{' '}
                <a href="mailto:privacy@samvero.com" className="text-amber-400 hover:underline">
                  privacy@samvero.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
