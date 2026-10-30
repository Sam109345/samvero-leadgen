'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminSettings } from '@/lib/saas-store';
import {
  Settings,
  Building,
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = () => {
    setLoading(true);
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout title="Platform Settings & Escrow Instructions" subtitle="Loading administrative settings...">
        <div className="py-24 text-center text-slate-500 font-mono text-xs animate-pulse">
          Loading platform configuration and wire instructions...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Platform Settings & Wire Escrow Setup"
      subtitle="Configure manual bank wire transfer details, Wise corporate handle, billing currency, subscription grace periods, and support contacts."
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Platform settings and payment instructions saved successfully.</span>
          </div>
        )}

        {/* 1. Bank Wire Transfer Escrow Details */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Building className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Manual Bank Wire Instructions (Customer Facing)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bankWireInstructions?.bankName || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankWireInstructions: { ...settings.bankWireInstructions, bankName: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Account Title / Beneficiary</label>
              <input
                type="text"
                value={settings.bankWireInstructions?.accountTitle || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankWireInstructions: { ...settings.bankWireInstructions, accountTitle: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Account Number</label>
              <input
                type="text"
                value={settings.bankWireInstructions?.accountNumber || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankWireInstructions: { ...settings.bankWireInstructions, accountNumber: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">IBAN Number</label>
              <input
                type="text"
                value={settings.bankWireInstructions?.iban || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankWireInstructions: { ...settings.bankWireInstructions, iban: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">SWIFT / BIC Code</label>
              <input
                type="text"
                value={settings.bankWireInstructions?.swiftCode || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankWireInstructions: { ...settings.bankWireInstructions, swiftCode: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Bank Branch</label>
              <input
                type="text"
                value={settings.bankWireInstructions?.branch || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankWireInstructions: { ...settings.bankWireInstructions, branch: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Wise Corporate Handle */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Wise Corporate Instructions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Wise Registered Email</label>
              <input
                type="email"
                value={settings.wiseInstructions?.email || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    wiseInstructions: { ...settings.wiseInstructions, email: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Wise Corporate PayTag</label>
              <input
                type="text"
                value={settings.wiseInstructions?.payTag || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    wiseInstructions: { ...settings.wiseInstructions, payTag: e.target.value },
                  })
                }
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>
        </div>

        {/* 3. Subscription Automation Parameters */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Subscription Automation & Grace Windows</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Expiry Warning Notice (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.expiryWarningDays || 7}
                onChange={(e) => setSettings({ ...settings, expiryWarningDays: Number(e.target.value) })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Triggers expiring_soon notifications & renewal alerts.
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Post-Expiry Grace Period (Days)
              </label>
              <input
                type="number"
                min="0"
                max="14"
                value={settings.defaultGracePeriodDays || 3}
                onChange={(e) => setSettings({ ...settings, defaultGracePeriodDays: Number(e.target.value) })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Days customer can review leads before account freezes.
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Default SaaS Currency</label>
              <select
                value={settings.currency || 'USD'}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (AED)</option>
              </select>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Base currency for invoices.</div>
            </div>
          </div>
        </div>

        {/* 4. Company & Support Details */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Mail className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Company Identity & Support Contacts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Legal Company Name</label>
              <input
                type="text"
                value={settings.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Support Email Desk</label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.supportPhone || ''}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs font-mono rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-400/10"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Platform Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
