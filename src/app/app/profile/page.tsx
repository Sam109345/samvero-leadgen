'use client';

import React, { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import {
  User,
  Building,
  Mail,
  Phone,
  Globe,
  Lock,
  ShieldCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Alexander Wright',
    email: 'client@gmail.com',
    businessName: 'Apex Digital Growth LLC',
    phone: '+1 (415) 890-2341',
    whatsapp: '+14158902341',
    country: 'United States',
    companyWebsite: 'https://apexdigitalgrowth.com',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/customer/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            businessName: data.user.businessName || prev.businessName,
            phone: data.user.phone || prev.phone,
            whatsapp: data.user.whatsapp || prev.whatsapp,
            country: data.user.country || prev.country,
            companyWebsite: data.user.companyWebsite || prev.companyWebsite,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      alert(err?.message || 'Profile update error');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(true);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to change password');
      }
    } catch (err: any) {
      alert(err?.message || 'Password update error');
    }
  };

  return (
    <CustomerLayout
      title="Profile & Security Settings"
      subtitle="Manage your executive profile details, corporate information, and authentication credentials."
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Details Form */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Executive Profile Information</h3>
          </div>

          {savedSuccess && (
            <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-[#080d1a]/50 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Company Website</label>
                <input
                  type="url"
                  value={profile.companyWebsite}
                  onChange={(e) => setProfile({ ...profile, companyWebsite: e.target.value })}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">WhatsApp / Direct Phone</label>
                <input
                  type="text"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Country / Territory</label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-mono rounded-lg transition"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Password & Security Form */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Change Password</h3>
          </div>

          {passwordSuccess && (
            <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Password successfully updated.</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-md">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono rounded-lg transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
