'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { verifyPhoneNumber, PhoneValidationResult } from '@/lib/phone-verifier';
import { formatWhatsAppUrl } from '@/lib/phone-utils';

export default function PhoneVerificationView() {
  const [phoneInput, setPhoneInput] = useState('');
  const [countryHint, setCountryHint] = useState('UAE');
  const [result, setResult] = useState<PhoneValidationResult | null>(null);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneInput.trim()) return;

    const res = verifyPhoneNumber(phoneInput.trim(), countryHint);
    setResult(res);
  };

  const sampleNumbers = [
    { p: '+971 4 457 3185', c: 'UAE', label: 'Dubai Marina Luxury Charters' },
    { p: '+92 42 111 253 282', c: 'Pakistan', label: 'Al-Fatah Department Store' },
    { p: '+44 20 7836 6866', c: 'UK', label: 'Smilepod Dental Care London' },
    { p: '+1 (512) 377-9780', c: 'US', label: 'Austin Dental Care USA' },
  ];

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1400px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
            Phone Telemetry Engine
          </span>
          <span className="text-xs text-slate-500 font-bold">ITU-T E.164 International Normalization</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Phone & WhatsApp Verification</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Verify international phone line format, detect country prefixes, and validate WhatsApp direct integration links
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
            Enter International Phone Number
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="sm:col-span-3 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. +971 4 457 3185, +92 42 111 253 282..."
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!phoneInput.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Validate Number</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-slate-400 font-medium">Verified Samples:</span>
          {sampleNumbers.map((sample) => (
            <button
              key={sample.p}
              onClick={() => {
                setPhoneInput(sample.p);
                setCountryHint(sample.c);
                setResult(verifyPhoneNumber(sample.p, sample.c));
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 transition"
            >
              {sample.p} ({sample.c})
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                ITU-T E.164 Result
              </span>
              <div className="text-lg font-mono font-black mt-0.5 text-emerald-600 dark:text-emerald-400">
                {result.normalized}
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{result.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-400 font-bold mb-1">Country Jurisdiction</div>
              <div className="font-extrabold text-slate-900 dark:text-white">
                {result.countryName} ({result.countryCode})
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-400 font-bold mb-1">WhatsApp Web Pure Digits</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">
                {result.whatsappDigits}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-400 font-bold mb-1">WhatsApp Direct Link</div>
              <a
                href={formatWhatsAppUrl(result.whatsappDigits)}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open wa.me Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            Validation Note: {result.reason}
          </div>
        </div>
      )}
    </div>
  );
}
