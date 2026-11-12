'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  Key,
  CheckCircle2,
  AlertTriangle,
  Server,
  RefreshCw,
  Mail,
  Send,
  Trash2,
  Lock,
  Sparkles,
  ExternalLink,
  Info,
  Check,
} from 'lucide-react';

export default function ApiConfigurationView() {
  // Gemini AI State
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [geminiMaskedKey, setGeminiMaskedKey] = useState('');
  const [newGeminiKey, setNewGeminiKey] = useState('');
  const [testingGemini, setTestingGemini] = useState(false);
  const [savingGemini, setSavingGemini] = useState(false);
  const [geminiFeedback, setGeminiFeedback] = useState<{ type: 'success' | 'error'; text: string; sample?: string } | null>(null);

  // SMTP Settings State
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [smtpHost, setSmtHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [replyTo, setReplyTo] = useState('');
  const [testEmailRecipient, setTestEmailRecipient] = useState('');

  const [testingSmtpConn, setTestingSmtpConn] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [smtpFeedback, setSmtpFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load configuration on mount
  const loadConfigurations = async () => {
    try {
      // 1. Load AI Config
      const aiRes = await fetch('/api/integrations/ai');
      const aiData = await aiRes.json();
      if (aiData.success) {
        setGeminiConfigured(aiData.isConfigured);
        setGeminiMaskedKey(aiData.maskedKey || '');
      }

      // 2. Load SMTP Config
      const smtpRes = await fetch('/api/integrations/smtp');
      const smtpData = await smtpRes.json();
      if (smtpData.success && (smtpData.settings || smtpData.smtpHost || smtpData.isConfigured)) {
        const s = smtpData.settings || smtpData;
        setSmtpConfigured(Boolean(smtpData.isConfigured));
        setSenderName(s.senderName || '');
        setSenderEmail(s.senderEmail || '');
        setSmtHost(s.host || s.smtpHost || '');
        setSmtpPort(s.port || s.smtpPort || 587);
        setSmtpUsername(s.username || s.smtpUser || '');
        setIsPasswordSaved(Boolean(s.isPasswordSaved ?? smtpData.isConfigured));
        setSmtpSecure(Boolean(s.secure ?? (s.encryption === 'ssl' || s.port === 465 || s.smtpPort === 465)));
        setReplyTo(s.replyTo || s.replyToEmail || '');
      }
    } catch (e) {
      console.warn('Failed to load API configurations:', e);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  // Save Gemini Key
  const handleSaveGeminiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGeminiKey.trim()) return;
    setSavingGemini(true);
    setGeminiFeedback(null);

    try {
      const res = await fetch('/api/integrations/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newGeminiKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setGeminiConfigured(true);
        setGeminiMaskedKey(data.maskedKey || '');
        setNewGeminiKey('');
        setGeminiFeedback({ type: 'success', text: 'Live Gemini API Key saved securely (encrypted at rest with AES-256-GCM).' });
      } else {
        setGeminiFeedback({ type: 'error', text: data.error || 'Failed to save Gemini key.' });
      }
    } catch (err: any) {
      setGeminiFeedback({ type: 'error', text: err?.message || 'Network error saving Gemini key.' });
    } finally {
      setSavingGemini(false);
    }
  };

  // Test Gemini Key Connection
  const handleTestGeminiKey = async () => {
    setTestingGemini(true);
    setGeminiFeedback(null);

    try {
      const res = await fetch('/api/integrations/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newGeminiKey.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setGeminiFeedback({
          type: 'success',
          text: data.message || 'Gemini API connection verified!',
          sample: data.sampleOutput,
        });
      } else {
        setGeminiFeedback({
          type: 'error',
          text: data.error || 'Failed to connect to Google Gemini API.',
        });
      }
    } catch (err: any) {
      setGeminiFeedback({ type: 'error', text: err?.message || 'Network error testing Gemini key.' });
    } finally {
      setTestingGemini(false);
    }
  };

  // Remove Gemini Key
  const handleRemoveGeminiKey = async () => {
    if (!confirm('Are you sure you want to remove your custom Gemini API key?')) return;
    try {
      const res = await fetch('/api/integrations/ai', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setGeminiConfigured(false);
        setGeminiMaskedKey('');
        setGeminiFeedback({ type: 'success', text: 'Gemini API Key removed. Workspace fallback mode active.' });
      }
    } catch (err: any) {
      setGeminiFeedback({ type: 'error', text: err?.message || 'Error removing key.' });
    }
  };

  // Save SMTP Settings
  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    setSmtpFeedback(null);

    try {
      const res = await fetch('/api/integrations/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          senderEmail,
          host: smtpHost,
          smtpHost,
          port: Number(smtpPort),
          smtpPort: Number(smtpPort),
          username: smtpUsername,
          smtpUser: smtpUsername,
          password: smtpPassword || undefined,
          smtpPass: smtpPassword || undefined,
          secure: smtpSecure,
          encryption: smtpSecure ? 'ssl' : 'tls',
          replyTo,
          replyToEmail: replyTo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSmtpConfigured(true);
        setIsPasswordSaved(true);
        setSmtpPassword('');
        setSmtpFeedback({ type: 'success', text: 'SMTP settings saved and credentials encrypted at rest.' });
      } else {
        setSmtpFeedback({ type: 'error', text: data.error || 'Failed to save SMTP configuration.' });
      }
    } catch (err: any) {
      setSmtpFeedback({ type: 'error', text: err?.message || 'Network error saving SMTP config.' });
    } finally {
      setSavingSmtp(false);
    }
  };

  // Test SMTP Connection
  const handleTestSmtpConnection = async () => {
    setTestingSmtpConn(true);
    setSmtpFeedback(null);

    try {
      const res = await fetch('/api/integrations/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'connection',
          senderName,
          senderEmail,
          host: smtpHost,
          port: Number(smtpPort),
          username: smtpUsername,
          password: smtpPassword || undefined,
          secure: smtpSecure,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSmtpFeedback({ type: 'success', text: data.message || 'SMTP server connection verified successfully!' });
      } else {
        setSmtpFeedback({ type: 'error', text: data.error || 'SMTP connection failed. Check host, port and authentication.' });
      }
    } catch (err: any) {
      setSmtpFeedback({ type: 'error', text: err?.message || 'Network error during SMTP test.' });
    } finally {
      setTestingSmtpConn(false);
    }
  };

  // Send Test Email
  const handleSendTestEmail = async () => {
    const target = testEmailRecipient.trim() || senderEmail.trim();
    if (!target) {
      setSmtpFeedback({ type: 'error', text: 'Please specify a recipient email to receive the test dispatch.' });
      return;
    }
    setSendingTestEmail(true);
    setSmtpFeedback(null);

    try {
      const res = await fetch('/api/integrations/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'email',
          recipientEmail: target,
          senderName,
          senderEmail,
          host: smtpHost,
          port: Number(smtpPort),
          username: smtpUsername,
          password: smtpPassword || undefined,
          secure: smtpSecure,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSmtpFeedback({ type: 'success', text: data.message || `Test email dispatched to ${target} via your custom SMTP server!` });
      } else {
        setSmtpFeedback({ type: 'error', text: data.error || 'Failed to dispatch test email.' });
      }
    } catch (err: any) {
      setSmtpFeedback({ type: 'error', text: err?.message || 'Network error sending test email.' });
    } finally {
      setSendingTestEmail(false);
    }
  };

  // Remove SMTP Config
  const handleRemoveSmtp = async () => {
    if (!confirm('Are you sure you want to remove your custom SMTP configuration?')) return;
    try {
      const res = await fetch('/api/integrations/smtp', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSmtpConfigured(false);
        setSenderName('');
        setSenderEmail('');
        setSmtHost('');
        setSmtpPort(587);
        setSmtpUsername('');
        setSmtpPassword('');
        setIsPasswordSaved(false);
        setReplyTo('');
        setSmtpFeedback({ type: 'success', text: 'SMTP configuration removed.' });
      }
    } catch (err: any) {
      setSmtpFeedback({ type: 'error', text: err?.message || 'Error removing SMTP configuration.' });
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1200px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
            Multi-Tenant Security
          </span>
          <span className="text-xs text-slate-500 font-bold">Isolated API &amp; SMTP Credentials</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">API &amp; Email Outreach Configuration</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure your user-isolated Google Gemini AI Key and independent SMTP server credentials. All secrets are encrypted at rest using AES-256-GCM and never shared across accounts.
        </p>
      </div>

      {/* SECTION 1: Google Gemini 1.5 Flash AI Configuration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0057FF]/10 text-[#00AAFF] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Google Gemini AI Engine</h2>
                {geminiConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" /> Fallback Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Powers real-time, evidence-based client pitch synthesis and proposal bids across 12+ categories.
              </p>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#00AAFF] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Get Free Key at Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {geminiConfigured && geminiMaskedKey && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 mr-2">Configured Key:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{geminiMaskedKey}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestGeminiKey}
                disabled={testingGemini}
                className="px-3 py-1 bg-[#0057FF] hover:bg-[#00AAFF] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {testingGemini ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Test Connection</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveGeminiKey}
                className="px-3 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveGeminiKey} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {geminiConfigured ? 'Update Gemini API Key' : 'Enter Google Gemini API Key'}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                value={newGeminiKey}
                onChange={(e) => setNewGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Paste your personal Gemini API Key)"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-[#00AAFF] outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Multi-tenant guarantee: Your key is securely encrypted at rest. No other tenant or customer can access or consume your quota.
            </p>
          </div>

          {geminiFeedback && (
            <div
              className={`p-3 rounded-xl text-xs space-y-1 ${
                geminiFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {geminiFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{geminiFeedback.text}</span>
              </div>
              {geminiFeedback.sample && (
                <div className="text-[11px] bg-white/60 dark:bg-black/30 p-2 rounded font-mono mt-1 text-slate-700 dark:text-slate-300">
                  Sample Live Response: &quot;{geminiFeedback.sample}&quot;
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            {newGeminiKey.trim() && (
              <button
                type="button"
                onClick={handleTestGeminiKey}
                disabled={testingGemini}
                className="px-4 py-2 border border-[#0057FF]/40 text-[#00AAFF] rounded-xl font-bold hover:bg-[#0057FF]/10 transition text-xs flex items-center gap-1.5"
              >
                {testingGemini ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Test New Key</span>
              </button>
            )}
            <button
              type="submit"
              disabled={savingGemini || !newGeminiKey.trim()}
              className="px-5 py-2 bg-[#0057FF] hover:bg-[#00AAFF] text-white rounded-xl font-bold transition shadow-xs text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {savingGemini ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Save &amp; Encrypt Key</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: User Independent SMTP Email Configuration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Custom SMTP Email Integration</h2>
                {smtpConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" /> Unconfigured
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every customer must configure their own independent SMTP server before dispatching cold pitches and outreach emails.
              </p>
            </div>
          </div>

          {smtpConfigured && (
            <button
              type="button"
              onClick={handleRemoveSmtp}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove SMTP Config</span>
            </button>
          )}
        </div>

        {!smtpConfigured && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <p className="font-bold">Please configure your email integration before sending emails.</p>
              <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                To guarantee zero multi-tenant leakage and maintain deliverability domain reputations, the platform does not allow sending outreach emails without verified individual customer credentials.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveSmtp} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sender Name (Displayed in Client Inbox)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Sarah Jenkins | SAMVERO Partner"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sender Email (From Header)
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. outreach@yourdomain.com"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                SMTP Host (Server Address)
              </label>
              <div className="relative">
                <Server className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtHost(e.target.value)}
                  placeholder="e.g. smtp.gmail.com or mail.yourdomain.com"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                SMTP Port (Usually 587 for TLS, 465 for SSL)
              </label>
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                placeholder="587"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
                placeholder="e.g. your_account@gmail.com"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                SMTP Password / App Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder={isPasswordSaved ? '•••••••••••• (Encrypted at rest — leave blank to keep)' : 'Enter SMTP password or App Password'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reply-To Email Address (Optional)
              </label>
              <input
                type="email"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="e.g. samverodigital@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={smtpSecure}
                  onChange={(e) => setSmtpSecure(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Enable SSL/TLS Direct Encryption (Port 465)
                </span>
              </label>
            </div>
          </div>

          {smtpFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                smtpFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {smtpFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{smtpFeedback.text}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Test Email Input */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                placeholder="Test recipient address..."
                className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-48 font-mono outline-none"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={sendingTestEmail || (!testEmailRecipient && !senderEmail)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {sendingTestEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-blue-500" />}
                <span>Send Test Email</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleTestSmtpConnection}
                disabled={testingSmtpConn}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {testingSmtpConn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5 text-blue-500" />}
                <span>Verify SMTP Connection</span>
              </button>

              <button
                type="submit"
                disabled={savingSmtp}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingSmtp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Save SMTP Configuration</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Official Platform Contact Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Official platform administrative &amp; technical inquiries contact:{' '}
            <strong className="text-slate-900 dark:text-white font-mono">samverodigital@gmail.com</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">v4.9 Enterprise Edition</span>
      </div>
    </div>
  );
}
