'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { PlanConfig, BillingCycle } from '@/lib/saas-store';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Lock, Copy, Check } from 'lucide-react';

function SignupForm() {
  const searchParams = useSearchParams();
  const preSelectedPlan = searchParams.get('plan') || 'plan_standard';
  const preSelectedDuration = (searchParams.get('billing') as BillingCycle) || 'monthly';

  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('US');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [planId, setPlanId] = useState(preSelectedPlan);
  const [billingDuration, setBillingDuration] = useState<BillingCycle>(preSelectedDuration);
  const [serviceRequirements, setServiceRequirements] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Status & Success state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState<any | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    fetch('/api/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
          if (preSelectedPlan && data.plans.some((p: PlanConfig) => p.id === preSelectedPlan || p.slug === preSelectedPlan)) {
            const found = data.plans.find((p: PlanConfig) => p.id === preSelectedPlan || p.slug === preSelectedPlan);
            if (found) setPlanId(found.id);
          } else if (data.plans.length > 0) {
            setPlanId(data.plans[2]?.id || data.plans[0].id);
          }
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoadingPlans(false));
  }, [preSelectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (!whatsapp.trim()) {
      setErrorMsg('WhatsApp Number is required for payment confirmation and onboarding.');
      return;
    }
    if (!country) {
      setErrorMsg('Please select your operating country.');
      return;
    }
    if (!planId) {
      setErrorMsg('Please select an interested subscription package.');
      return;
    }
    if (!serviceRequirements.trim()) {
      setErrorMsg('Please specify your service and prospecting requirements.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must consent to the Terms of Service and Privacy Policy to apply.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          businessName: businessName.trim() || undefined,
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          country,
          companyWebsite: companyWebsite.trim() || undefined,
          planId,
          billingDuration,
          serviceRequirements: serviceRequirements.trim(),
          additionalMessage: additionalMessage.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.application) {
        setSubmittedApplication(data.application);
      } else {
        setErrorMsg(data.error || 'Failed to submit application. Please verify your details.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error occurred while submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (!submittedApplication?.referenceNumber) return;
    navigator.clipboard.writeText(submittedApplication.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Customer Registration</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
              Application for Service
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Submit your requirements for account review. Once manual payment is confirmed, your isolated customer workspace is activated immediately.
            </p>
          </div>

          {submittedApplication ? (
            /* Phase 4 Exact Success Confirmation Display */
            <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#0b1224] to-[#070c18] p-8 md:p-10 shadow-2xl space-y-6 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white font-serif">Thank you for your interest in Samvero!</h2>
                <p className="text-sm text-slate-300 font-medium">Your application has been received successfully.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3">
                <p>
                  Our team will review your requirements and contact you shortly regarding your selected package, payment details and account activation.
                </p>
                <p>
                  Once your payment is confirmed, your Samvero account will be created and your dashboard access will be provided.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
                    Application Reference
                  </div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">
                    {submittedApplication.referenceNumber}
                  </div>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied' : 'Copy Ref'}</span>
                </button>
              </div>

              <div className="pt-2 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                >
                  Return to Homepage
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition"
                >
                  Go to Login Portal
                </Link>
              </div>
            </div>
          ) : (
            /* Professional Application Form */
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-800 bg-[#090d1a] p-6 sm:p-10 shadow-xl space-y-6"
            >
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Business / Organization Name <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Growth Studio"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Official Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    WhatsApp Number (with Country Code) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. +14158902341 or +971501234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Operating Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Operating Country <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="US">United States (US)</option>
                    <option value="UK">United Kingdom (UK)</option>
                    <option value="UAE">United Arab Emirates (UAE)</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Global">Global / Other</option>
                  </select>
                </div>

                {/* Company Website */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Company Website <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Interested Package */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Interested Subscription Package <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.maxLeadsQuota.toLocaleString()} Leads / ${p.prices.monthly}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Billing Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Preferred Billing Duration <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={billingDuration}
                    onChange={(e) => setBillingDuration(e.target.value as BillingCycle)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 capitalize"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half_yearly">Half-Yearly (-20%)</option>
                    <option value="annual">Annual (-30%)</option>
                  </select>
                </div>
              </div>

              {/* Service Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Service & Lead Requirements <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={serviceRequirements}
                  onChange={(e) => setServiceRequirements(e.target.value)}
                  placeholder="Describe your target client criteria, target industries, expected monthly lead consumption, and preferred outreach channels..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Additional Notes or Questions <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="Any custom requests or bank wire invoice details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                  />
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-amber-400 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy-policy" target="_blank" className="text-amber-400 hover:underline">
                      Privacy Policy
                    </Link>
                    . I understand account activation requires verified manual payment confirmation.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Secure 256-Bit SSL Submission &bull; No Auto-Charge</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-xs tracking-wide transition shadow-lg shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060a14] flex items-center justify-center text-slate-500 font-mono text-xs">
          Loading application portal...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
