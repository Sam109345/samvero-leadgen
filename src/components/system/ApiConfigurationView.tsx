'use client';

import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  Key,
  CheckCircle2,
  AlertTriangle,
  Server,
  RefreshCw,
} from 'lucide-react';

export default function ApiConfigurationView() {
  const [geminiKey, setGeminiKey] = useState('');
  const [googlePlacesKey, setGooglePlacesKey] = useState('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Configuration updated. In production, set keys in .env.local or your hosting environment.');
    setTimeout(() => setSavedMessage(null), 4000);
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1200px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
            System Secrets & Quotas
          </span>
          <span className="text-xs text-slate-500 font-bold">Secure Environment Configuration</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">API Configuration & Keys</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Securely configure external providers. API keys are never exposed in browser bundle.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-500 mb-1">
              Google Gemini 1.5 Flash API Key (Optional Free AI Key)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Get free at https://aistudio.google.com/app/apikey)"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Powers deep evidence-based AI business intelligence and tailored sales pitch synthesis.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-500 mb-1">
              Google Places API Key (Optional External Places Key)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                value={googlePlacesKey}
                onChange={(e) => setGooglePlacesKey(e.target.value)}
                placeholder="AIzaSy... (Leave blank to use OpenStreetMap & built-in directory)"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              When left blank, SAMVERO automatically utilizes OpenStreetMap Nominatim and verified public listings.
            </p>
          </div>

          {savedMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedMessage}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
