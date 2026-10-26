'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  Send, 
  Mail, 
  Lock, 
  Globe, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  ExternalLink, 
  Copy,
  Sparkles
} from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiSettingsModal({ isOpen, onClose }: ApiSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'gemini' | 'smtp' | 'resend' | 'tunnel' | 'quotas'>('gemini');
  
  // Gemini AI state
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ success: boolean; message: string; sampleOutput?: string } | null>(null);

  // SMTP credentials state
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  
  // Resend API state
  const [resendKey, setResendKey] = useState('');
  
  // Live Tunnel / Public URL state
  const [publicUrl, setPublicUrl] = useState('');
  const [customPublicDomain, setCustomPublicDomain] = useState('');
  const [tunnelStarting, setTunnelStarting] = useState(false);
  const [tunnelStatusMsg, setTunnelStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status flags
  const [isSmtpConfigured, setIsSmtpConfigured] = useState(false);
  const [isResendConfigured, setIsResendConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test email state
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Copied state
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch current config on load
  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.config) {
            setSmtpUser(data.config.smtpUser || '');
            setSmtpFrom(data.config.smtpFrom || '');
            setIsSmtpConfigured(data.config.isSmtpConfigured);
            setIsResendConfigured(data.config.isResendConfigured);
            setIsGeminiConfigured(data.config.isGeminiConfigured);
            if (data.config.geminiKeyMasked) {
              setGeminiApiKey(data.config.geminiKeyMasked);
            }
            if (!testEmailRecipient && data.config.smtpUser) {
              setTestEmailRecipient(data.config.smtpUser);
            }
          }
        })
        .catch((e) => console.error('Failed to load settings:', e));

      // Fetch public tunnel config
      fetch('/api/tunnel')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPublicUrl(data.publicUrl || '');
            if (data.publicUrl && !data.publicUrl.includes('localhost')) {
              setCustomPublicDomain(data.publicUrl);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-credentials',
          smtpUser,
          smtpPass,
          smtpFrom,
          resendKey,
          geminiApiKey,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (smtpUser && smtpPass) setIsSmtpConfigured(true);
        if (resendKey) setIsResendConfigured(true);
        if (geminiApiKey) setIsGeminiConfigured(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestGemini = async () => {
    setTestingGemini(true);
    setGeminiTestResult(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-gemini',
          geminiApiKey,
        }),
      });
      const data = await res.json();
      setGeminiTestResult({
        success: data.success,
        message: data.message || data.error || 'Gemini test completed',
        sampleOutput: data.sampleOutput,
      });
      if (data.success) {
        setIsGeminiConfigured(true);
      }
    } catch (e: any) {
      setGeminiTestResult({
        success: false,
        message: e?.message || 'Error communicating with Gemini API',
      });
    } finally {
      setTestingGemini(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient) return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-email',
          testRecipient: testEmailRecipient,
          smtpUser,
          smtpPass,
          smtpFrom,
          resendKey,
        }),
      });

      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || data.error || (data.success ? 'Test email dispatched!' : 'Failed to send'),
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Network error while attempting test send',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleStartTunnel = async () => {
    setTunnelStarting(true);
    setTunnelStatusMsg(null);
    try {
      const res = await fetch('/api/tunnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start-tunnel' }),
      });
      const data = await res.json();
      if (data.success) {
        setPublicUrl(data.publicUrl);
        setCustomPublicDomain(data.publicUrl);
        setTunnelStatusMsg({ type: 'success', text: data.message || 'Live tunnel active!' });
      } else {
        setTunnelStatusMsg({ type: 'error', text: data.error || 'Failed to start tunnel' });
      }
    } catch (e: any) {
      setTunnelStatusMsg({ type: 'error', text: e.message || 'Error launching tunnel' });
    } finally {
      setTunnelStarting(false);
    }
  };

  const handleSaveCustomPublicDomain = async () => {
    if (!customPublicDomain) return;
    setTunnelStarting(true);
    setTunnelStatusMsg(null);
    try {
      const res = await fetch('/api/tunnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set-custom-url', customUrl: customPublicDomain }),
      });
      const data = await res.json();
      if (data.success) {
        setPublicUrl(data.publicUrl);
        setTunnelStatusMsg({ type: 'success', text: data.message || 'Public domain updated!' });
      } else {
        setTunnelStatusMsg({ type: 'error', text: data.error || 'Invalid URL' });
      }
    } catch (e: any) {
      setTunnelStatusMsg({ type: 'error', text: e.message || 'Error updating domain' });
    } finally {
      setTunnelStarting(false);
    }
  };

  const isPublicUrlLive = publicUrl && !publicUrl.includes('localhost') && !publicUrl.includes('127.0.0.1');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-xl w-full max-w-2xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#24334a] flex items-center justify-between bg-slate-50 dark:bg-[#0d141e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#007FED]/10 dark:bg-[#007FED]/20 flex items-center justify-center text-[#007FED]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                SAMVERO Platform Settings &amp; Delivery Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure live email delivery, public client URLs &amp; API rate limits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 border-b border-slate-200 dark:border-[#24334a] flex items-center gap-2 pt-2 bg-white dark:bg-[#161f2e] overflow-x-auto">
          <button
            onClick={() => setActiveTab('gemini')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gemini'
                ? 'border-[#007FED] text-[#007FED] dark:text-[#38BDF8]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Google Gemini AI (Free)</span>
            <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.2 rounded">
              Free AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('smtp')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'smtp'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Gmail SMTP (Free)</span>
          </button>

          <button
            onClick={() => setActiveTab('tunnel')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tunnel'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 text-purple-500" />
            <span>Live Public Client URLs</span>
            {isPublicUrlLive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          </button>

          <button
            onClick={() => setActiveTab('resend')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'resend'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Resend API (3,000/mo)</span>
          </button>

          <button
            onClick={() => setActiveTab('quotas')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quotas'
                ? 'border-[#007FED] text-[#007FED]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Rate Limits &amp; Quotas</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700 dark:text-slate-200">
          
          {/* TAB 0: Google Gemini AI (Free API Key) */}
          {activeTab === 'gemini' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    <span>Google Gemini 1.5 Flash – 100% Free AI Engine</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {isGeminiConfigured ? 'Active & Ready' : 'Using Smart Fallback'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Powers dynamic luxury website copy, 14-screen mobile app specs, and 6 vector SVG logo concepts. Google AI Studio gives <strong>15 Requests/Min completely FREE</strong> without entering any credit card.
                </p>
                <div className="pt-1">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#007FED] dark:text-cyan-400 hover:underline font-bold"
                  >
                    <span>Get Your Free Gemini API Key at Google AI Studio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <form onSubmit={handleSaveCredentials} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs flex items-center justify-between">
                    <span>Google Gemini API Key:</span>
                    <span className="text-[10px] font-normal text-slate-400">Stored safely in .env.local</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="AIzaSy..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg pl-9 pr-3 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="freelancer-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Save Gemini Key</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestGemini}
                    disabled={testingGemini}
                    className="freelancer-btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 bg-slate-100 dark:bg-[#1a2638] text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#25354e]"
                  >
                    {testingGemini ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-500" />}
                    <span>Test Gemini Generation</span>
                  </button>

                  {saveSuccess && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                </div>
              </form>

              {/* Gemini Test Feedback Box */}
              {geminiTestResult && (
                <div className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                  geminiTestResult.success 
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {geminiTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{geminiTestResult.message}</span>
                  </div>
                  {geminiTestResult.sampleOutput && (
                    <div className="p-2.5 bg-white/60 dark:bg-black/40 rounded border border-emerald-200 dark:border-emerald-900/60 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      &quot;{geminiTestResult.sampleOutput}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: Gmail SMTP Setup */}
          {activeTab === 'smtp' && (
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#007FED]" />
                  <span>How to connect your Gmail Account in 30 Seconds:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  <li>Go to your Google Account security settings: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-[#007FED] underline font-semibold">myaccount.google.com/apppasswords</a></li>
                  <li>Sign in with your email account (the one you use on Antigravity).</li>
                  <li>Type App Name: <strong>SAMVERO</strong> and click <strong>Create</strong>.</li>
                  <li>Copy the <strong>16-character code</strong> and paste it below.</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                    Your Gmail Account:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your-name@gmail.com"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                    16-Character Google App Password:
                  </label>
                  <input
                    type="password"
                    required={!isSmtpConfigured}
                    placeholder={isSmtpConfigured ? "•••• •••• •••• •••• (Configured)" : "xxxx xxxx xxxx xxxx"}
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  Sender Display Name &amp; Email:
                </label>
                <input
                  type="text"
                  placeholder="SAMVERO Outreach <noreply@samvero.io>"
                  value={smtpFrom}
                  onChange={(e) => setSmtpFrom(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSmtpConfigured ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  <span className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                    Status: {isSmtpConfigured ? 'Gmail SMTP Active' : 'Not Connected'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="freelancer-btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Gmail Credentials</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Credentials saved! You can now send live proposal emails to clients.</span>
                </div>
              )}

              {/* Live Test Email Section */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#24334a] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Send Instant Test Email to Your Inbox:
                </h4>
                
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Enter email to receive test proposal"
                    value={testEmailRecipient}
                    onChange={(e) => setTestEmailRecipient(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={testing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Send Test Email</span>
                  </button>
                </div>

                {testResult && (
                  <div className={`p-2.5 rounded-md text-xs font-medium flex items-start gap-2 ${
                    testResult.success 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

            </form>
          )}

          {/* TAB 2: Live Public Client URLs & Tunnel (User Directive!) */}
          {activeTab === 'tunnel' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200 text-xs">
                  <Radio className="w-4 h-4 text-purple-600" />
                  <span>Public Live URL Engine for External Clients:</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  When a client receives your email on their phone or laptop, <strong>`localhost:3000`</strong> is not accessible from outside. This module provides a <strong>100% free live public HTTPS URL</strong> so any client anywhere can open the exact 15-section website and 14-screen mobile app!
                </p>
              </div>

              {/* Active URL Status Box */}
              <div className="p-4 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Active Client Preview URL:
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                    isPublicUrlLive 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isPublicUrlLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    {isPublicUrlLive ? 'Live Public HTTPS' : 'Localhost Only'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl ? `${publicUrl}/preview/pk-gmb-101` : 'http://localhost:3000/preview/pk-gmb-101'}
                    className="flex-1 bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <a
                    href={publicUrl ? `${publicUrl}/preview/pk-gmb-101` : 'http://localhost:3000/preview/pk-gmb-101'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-100 dark:bg-[#24334a] hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg transition"
                    title="Open in new browser tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl ? `${publicUrl}/preview/pk-gmb-101` : 'http://localhost:3000/preview/pk-gmb-101');
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="p-2 bg-slate-100 dark:bg-[#24334a] hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action 1: 1-Click Free Localtunnel */}
              <div className="p-4 bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-xl space-y-3">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Option A: Start 1-Click Free Public Live Tunnel
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Instantly forwards your local port 3000 to a free HTTPS link without deploying or paying.
                  </p>
                </div>

                <button
                  onClick={handleStartTunnel}
                  disabled={tunnelStarting}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2"
                >
                  {tunnelStarting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                  <span>{tunnelStarting ? 'Starting Free Tunnel...' : 'Start Free Public Live Tunnel'}</span>
                </button>
              </div>

              {/* Action 2: Custom Public Domain / Vercel Link */}
              <div className="p-4 bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-[#24334a] rounded-xl space-y-3">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Option B: Connect Custom Domain / Vercel Deployment
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    If you deployed SAMVERO on Vercel, Netlify or your own domain, enter it here.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://samvero-leads.vercel.app"
                    value={customPublicDomain}
                    onChange={(e) => setCustomPublicDomain(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                  />
                  <button
                    onClick={handleSaveCustomPublicDomain}
                    disabled={tunnelStarting || !customPublicDomain}
                    className="freelancer-btn-primary text-xs py-2.5 px-4 shrink-0"
                  >
                    Save Public URL
                  </button>
                </div>
              </div>

              {tunnelStatusMsg && (
                <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  tunnelStatusMsg.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200' 
                    : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200'
                }`}>
                  {tunnelStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                  <span>{tunnelStatusMsg.text}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Resend API Setup */}
          {activeTab === 'resend' && (
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div className="p-3.5 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 rounded-lg space-y-1.5">
                <span className="font-bold text-purple-900 dark:text-purple-200 text-xs block">
                  Resend.com Free Tier (3,000 free emails/month):
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Resend offers 100 emails/day completely free with 99.9% inbox deliverability. Get your free key at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-[#007FED] underline font-semibold">resend.com</a>.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  Resend API Key:
                </label>
                <input
                  type="password"
                  placeholder="re_123456789..."
                  value={resendKey}
                  onChange={(e) => setResendKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0d141e] border border-slate-200 dark:border-[#24334a] rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="freelancer-btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                <span>Save Resend Key</span>
              </button>
            </form>
          )}

          {/* TAB 4: Rate Limits & Quotas */}
          {activeTab === 'quotas' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Active Hourly &amp; Daily Limits:
              </h4>

              <div className="divide-y divide-slate-100 dark:divide-[#24334a] border border-slate-200 dark:border-[#24334a] rounded-lg overflow-hidden">
                <div className="p-3 bg-white dark:bg-[#0d141e] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-white block">Email Dispatch Throttle</span>
                    <span className="text-[11px] text-slate-400">Protects domain sender reputation</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-xs">
                    20 emails / hour
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-[#0d141e] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-white block">Google My Business Places API</span>
                    <span className="text-[11px] text-slate-400">Direct Google Places queries</span>
                  </div>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-xs">
                    60 requests / min
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#0d141e] border-t border-slate-200 dark:border-[#24334a] flex items-center justify-between text-xs text-slate-500">
          <span>SAMVERO &bull; Production Delivery Engine</span>
          <button
            onClick={onClose}
            className="freelancer-btn-secondary text-xs py-1.5 px-4 bg-white dark:bg-[#1a2638] border border-slate-300 dark:border-[#2e415d] hover:bg-slate-50 dark:hover:bg-[#24354d] text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
