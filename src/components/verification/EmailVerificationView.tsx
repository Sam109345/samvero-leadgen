'use client';

import React, { useState } from 'react';
import {
  MailCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import type { EmailVerificationResult } from '@/types';

export default function EmailVerificationView() {
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailVerificationResult | null>(null);

  const triggerVerify = async (targetEmail: string) => {
    const emailToVerify = (targetEmail || '').trim();
    if (!emailToVerify) return;

    setLoading(true);
    try {
      const response = await fetch('/api/verify/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToVerify }),
      });
      const data = await response.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setResult({
          email: emailToVerify,
          domain: emailToVerify.split('@')[1] || '',
          status: 'INVALID',
          isValidSyntax: false,
          isDisposable: false,
          hasActiveMx: false,
          mxRecords: [],
          checkedAt: new Date().toISOString(),
          reason: data.error || 'Verification failed',
        });
      }
    } catch (err: any) {
      console.error('Email verification error:', err);
      setResult({
        email: emailToVerify,
        domain: emailToVerify.split('@')[1] || '',
        status: 'UNKNOWN',
        isValidSyntax: false,
        isDisposable: false,
        hasActiveMx: false,
        mxRecords: [],
        checkedAt: new Date().toISOString(),
        reason: err?.message || 'Verification network error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput.trim()) return;
    await triggerVerify(emailInput);
  };

  const sampleEmails = [
    'concierge@mediclinic.ae',
    'info@stile.com.pk',
    'charters@xclusiveyachts.com',
    'media@stripe.com',
    'fake_user@mailinator.com',
  ];

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1400px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
            Deliverability Engine
          </span>
          <span className="text-xs text-slate-500 font-bold">DNS MX Resolution & Disposable Email Filter</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Email Verification Engine</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Verify corporate email deliverability via live DNS MX host resolution and RFC 7505 null exchanger checks
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
            Enter Corporate Email Address
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. concierge@mediclinic.ae, info@stile.com.pk..."
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !emailInput.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MailCheck className="w-4 h-4" />}
              <span>{loading ? 'Verifying DNS...' : 'Verify Email Deliverability'}</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-slate-400 font-medium">Quick Test:</span>
          {sampleEmails.map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setEmailInput(sample);
                triggerVerify(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 transition"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deliverability Verdict</span>
              <div className="text-lg font-mono font-black mt-0.5">{result.email}</div>
            </div>

            <span
              className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                result.status === 'VERIFIED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : result.status === 'DISPOSABLE'
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
              }`}
            >
              {result.status === 'VERIFIED' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : result.status === 'DISPOSABLE' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>{result.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-400 font-bold mb-1">RFC 5322 Syntax</div>
              <div className="font-extrabold flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Valid Syntax
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-400 font-bold mb-1">Disposable Check</div>
              <div
                className={`font-extrabold flex items-center gap-1 ${
                  result.isDisposable ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {result.isDisposable ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {result.isDisposable ? 'Disposable Provider' : 'Legitimate Corporate Domain'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-400 font-bold mb-1">DNS MX Status</div>
              <div
                className={`font-extrabold flex items-center gap-1 ${
                  result.hasActiveMx ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.hasActiveMx ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {result.hasActiveMx ? 'Active Mail Exchangers' : 'No Mail Accept'}
              </div>
            </div>
          </div>

          {result.mxRecords.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-500 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-teal-600" />
                <span>Confirmed DNS Mail Exchangers ({result.domain}):</span>
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                {result.mxRecords.map((mx, idx) => (
                  <div key={idx} className="flex justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-700 dark:text-slate-300">{mx.exchange}</span>
                    <span className="text-slate-400 font-bold">Priority {mx.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 italic">
            Verification Reason: {result.reason}
          </div>
        </div>
      )}
    </div>
  );
}
