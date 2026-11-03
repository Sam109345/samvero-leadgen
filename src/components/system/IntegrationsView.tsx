'use client';

import React, { useState, useEffect } from 'react';
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Key,
  Sliders,
  ShieldCheck,
  Building2,
  Users,
  Search,
  Globe2,
  Compass,
  Cpu,
  Mail,
  Zap,
  Lock,
  X,
  Check,
} from 'lucide-react';
import { PlatformConfig, PlatformState, IntegrationStatus } from '@/lib/integrations/types';

export default function IntegrationsView() {
  const [platforms, setPlatforms] = useState<{ config: PlatformConfig; state: PlatformState }[]>([]);
  const [loading, setLoading] = useState(true);

  // Testing & Sync states
  const [testingId, setTestingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  // Configuration Modal state
  const [configPlatform, setConfigPlatform] = useState<PlatformConfig | null>(null);
  const [credValues, setCredValues] = useState<Record<string, string>>({});
  const [savingCreds, setSavingCreds] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load live platforms
  const loadPlatforms = async () => {
    try {
      const res = await fetch('/api/integrations');
      const data = await res.json();
      if (data.success && Array.isArray(data.platforms)) {
        setPlatforms(data.platforms);
      }
    } catch (err) {
      console.warn('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  // Run live connection test
  const handleTestConnection = async (platformId: string) => {
    setTestingId(platformId);
    setTestResults((prev) => ({ ...prev, [platformId]: { success: false, message: 'Testing connection...' } }));

    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformId }),
      });
      const data = await res.json();

      setTestResults((prev) => ({
        ...prev,
        [platformId]: {
          success: data.success,
          message: data.result?.message || (data.success ? 'Connection verified successfully.' : data.error || 'Connection failed.'),
        },
      }));

      // Update state locally
      if (data.state) {
        setPlatforms((prev) =>
          prev.map((p) => (p.config.id === platformId ? { ...p, state: data.state } : p))
        );
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [platformId]: { success: false, message: err?.message || 'Network test failed' },
      }));
    } finally {
      setTestingId(null);
    }
  };

  // Run live synchronization
  const handleSyncPlatform = async (platformId: string) => {
    setSyncingId(platformId);
    try {
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformId }),
      });
      const data = await res.json();
      if (data.success) {
        await loadPlatforms();
      }
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setSyncingId(null);
    }
  };

  // Open configuration modal
  const handleOpenConfig = (config: PlatformConfig) => {
    setConfigPlatform(config);
    setCredValues({});
    setSaveSuccess(false);
  };

  // Save credentials
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configPlatform) return;
    setSavingCreds(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platformId: configPlatform.id,
          credentials: credValues,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        await loadPlatforms();
        setTimeout(() => {
          setConfigPlatform(null);
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to save credentials:', err);
    } finally {
      setSavingCreds(false);
    }
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'operational':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        );
      case 'connected':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Connected
          </span>
        );
      case 'credentials_missing':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Credentials Missing
          </span>
        );
      case 'auth_failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            Authentication Failed
          </span>
        );
      case 'quota_exhausted':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
            Quota Exhausted
          </span>
        );
      case 'sync_failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 flex items-center gap-1">
            Synchronization Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Connected Platforms & API Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure official credentials, test live endpoint connectivity, and track lead synchronization.
          </p>
        </div>

        <button
          onClick={loadPlatforms}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh All Statuses</span>
        </button>
      </div>

      {/* Primary Platforms Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Core Platforms & Free Sources
        </h3>

        {loading ? (
          <div className="bg-white dark:bg-[#111c2e] p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="font-semibold text-slate-800 dark:text-slate-200">Loading Integration Telemetry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map(({ config, state }) => {
              const test = testResults[config.id];
              const isTesting = testingId === config.id;
              const isSyncing = syncingId === config.id;

              return (
                <div
                  key={config.id}
                  className="bg-white dark:bg-[#111c2e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Name + Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{config.name}</span>
                          {config.isPrimary && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              Primary
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {getStatusBadge(state.status)}
                      <a
                        href={config.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Docs</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Telemetry info */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Last Tested:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {state.lastTestedAt ? new Date(state.lastTestedAt).toLocaleTimeString() : 'Not Tested'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Synchronization:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {state.lastSyncAt ? new Date(state.lastSyncAt).toLocaleTimeString() : 'No Sync Yet'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Leads Fetched:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {state.totalRecordsFetched.toLocaleString()}
                        </span>
                      </div>
                      {typeof state.quotaRemaining === 'number' && (
                        <div className="flex justify-between">
                          <span>Remaining API Quota:</span>
                          <span className="font-bold text-blue-600">
                            {state.quotaRemaining} {state.quotaTotal ? `/ ${state.quotaTotal}` : ''}
                          </span>
                        </div>
                      )}
                      {state.lastError && (
                        <div className="pt-1 text-rose-600 dark:text-rose-400 text-[10px] font-medium truncate">
                          {state.lastError}
                        </div>
                      )}
                    </div>

                    {/* Test result message */}
                    {test && (
                      <div
                        className={`p-2 rounded text-[11px] font-medium ${
                          test.success
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {test.message}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {config.requiredCredentials.length > 0 && (
                      <button
                        onClick={() => handleOpenConfig(config)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center gap-1"
                      >
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        <span>Configure</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => handleTestConnection(config.id)}
                        disabled={isTesting}
                        className="px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-xs font-semibold text-blue-700 dark:text-blue-300 transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                      </button>

                      <button
                        onClick={() => handleSyncPlatform(config.id)}
                        disabled={isSyncing}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <Zap className={`w-3 h-3 ${isSyncing ? 'animate-pulse' : ''}`} />
                        <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      {configPlatform && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 font-sans space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  <span>Configure {configPlatform.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Encrypted with AES-256-GCM at rest</p>
              </div>
              <button
                onClick={() => setConfigPlatform(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              {configPlatform.requiredCredentials.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={credValues[field.key] || ''}
                    onChange={(e) => setCredValues({ ...credValues, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required={!field.label.includes('Optional')}
                  />
                  <p className="text-[10px] text-slate-500">{field.description}</p>
                </div>
              ))}

              {saveSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Credentials saved & verified in database!</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfigPlatform(null)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCreds}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {savingCreds ? 'Saving...' : 'Save & Encrypt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
