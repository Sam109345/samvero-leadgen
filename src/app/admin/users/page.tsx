'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SaasUser, SaasSubscription, PlanConfig, BillingCycle } from '@/lib/saas-store';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  X,
  RefreshCw,
  Plus,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Array<SaasUser & { activeSubscription?: SaasSubscription }>>([]);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [assignPackageModalOpen, setAssignPackageModalOpen] = useState(false);
  const [extendSubModalOpen, setExtendSubModalOpen] = useState(false);
  const [targetUserForAction, setTargetUserForAction] = useState<any | null>(null);

  // Form states
  const [newPlanId, setNewPlanId] = useState('');
  const [newDuration, setNewDuration] = useState<BillingCycle>('monthly');
  const [additionalDays, setAdditionalDays] = useState(30);
  const [extensionReason, setExtensionReason] = useState('Commercial Account Extension');

  const fetchUsers = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/customers').then((r) => r.json()),
      fetch('/api/plans').then((r) => r.json()),
    ])
      .then(([userData, planData]) => {
        if (userData.success && Array.isArray(userData.users)) {
          setUsers(userData.users);
        }
        if (planData.success && Array.isArray(planData.plans)) {
          setPlans(planData.plans);
          if (planData.plans.length > 0) setNewPlanId(planData.plans[0].id);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!confirm(`Are you sure you want to mark this user as ${nextStatus}?`)) return;

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status', userId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password', userId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Temporary Password generated: ${data.temporaryPassword}`);
        fetchUsers();
      }
    } catch (err: any) {
      alert(err?.message || 'Password reset error');
    }
  };

  const handleAssignPackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForAction) return;

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign_package',
          userId: targetUserForAction.id,
          planId: newPlanId,
          billingDuration: newDuration,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssignPackageModalOpen(false);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to assign package');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to assign package');
    }
  };

  const handleExtendSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForAction) return;

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extend_subscription',
          userId: targetUserForAction.id,
          additionalDays: Number(additionalDays),
          reason: extensionReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExtendSubModalOpen(false);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to extend subscription');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to extend');
    }
  };

  const filtered = users.filter((u) => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.businessName && u.businessName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AdminLayout
      title="Customer & User Management"
      subtitle="Complete database of customer profiles, assigned subscriptions, quota usage, and account security controls"
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Accounts ({users.length})</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#090d1a] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase font-black tracking-wider text-[10px] whitespace-nowrap">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Business Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Assigned Package</th>
                  <th className="py-3 px-4">Sub Status</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Leads Allocated</th>
                  <th className="py-3 px-4">Leads Consumed</th>
                  <th className="py-3 px-4">Remaining Leads</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={15} className="py-12 text-center text-slate-500 font-mono">
                      Loading customers database...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="py-12 text-center text-slate-500">
                      No customer accounts found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const sub = user.activeSubscription;
                    const allocated = sub ? sub.leadQuota : 0;
                    const consumed = sub ? sub.leadsConsumed : 0;
                    const remaining = Math.max(0, allocated - consumed);

                    return (
                      <tr key={user.id} className="hover:bg-slate-900/40 transition whitespace-nowrap">
                        <td className="py-3.5 px-4 font-bold text-white">{user.name}</td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {user.businessName || 'Solo Practitioner'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{user.email}</td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{user.phone || user.whatsapp || 'N/A'}</td>
                        <td className="py-3.5 px-4">{user.country}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-amber-400">{sub ? sub.planName : 'No Plan'}</span>
                          {sub && <span className="block text-[10px] text-slate-400 capitalize">{sub.billingCycle}</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              sub?.status === 'active'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : sub?.status === 'expiring_soon'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {sub ? sub.status : 'None'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              user.status === 'active'
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-rose-950 text-rose-300'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{allocated.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-400">{consumed.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{remaining.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                          {sub?.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                          {sub ? new Date(sub.expiryDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                            title="View Customer Details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setTargetUserForAction(user);
                              setAssignPackageModalOpen(true);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                            title="Assign or Change Package"
                          >
                            Plan
                          </button>
                          {sub && (
                            <button
                              onClick={() => {
                                setTargetUserForAction(user);
                                setExtendSubModalOpen(true);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold"
                              title="Extend Expiry Date"
                            >
                              Extend
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              user.status === 'active'
                                ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
                            title="Reset Password"
                          >
                            Reset
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal 1: Assign Package */}
        {assignPackageModalOpen && targetUserForAction && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#090d1a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">
                  Assign Package: {targetUserForAction.name}
                </h3>
                <button
                  onClick={() => setAssignPackageModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAssignPackageSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Select Subscription Package</label>
                  <select
                    value={newPlanId}
                    onChange={(e) => setNewPlanId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.maxLeadsQuota.toLocaleString()} Leads / ${p.prices.monthly}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Billing Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value as BillingCycle)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400 capitalize"
                  >
                    <option value="monthly">Monthly (+30 Days)</option>
                    <option value="quarterly">Quarterly (+90 Days)</option>
                    <option value="half_yearly">Half-Yearly (+180 Days)</option>
                    <option value="annual">Annual (+365 Days)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-[11px] text-slate-400">
                  Changing package automatically updates lead quotas, research permissions, and resets expiry date according to plan rules.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignPackageModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black"
                  >
                    Apply Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Extend Subscription */}
        {extendSubModalOpen && targetUserForAction && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#090d1a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">
                  Extend Subscription: {targetUserForAction.name}
                </h3>
                <button onClick={() => setExtendSubModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExtendSubSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Additional Days to Add</label>
                  <select
                    value={additionalDays}
                    onChange={(e) => setAdditionalDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={7}>+7 Days (Grace Extension)</option>
                    <option value={14}>+14 Days</option>
                    <option value={30}>+30 Days (Full Month)</option>
                    <option value={60}>+60 Days (Two Months)</option>
                    <option value={90}>+90 Days (Quarter)</option>
                    <option value={365}>+365 Days (Full Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Extension Reason (Audit Log)</label>
                  <input
                    type="text"
                    required
                    value={extensionReason}
                    onChange={(e) => setExtensionReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setExtendSubModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black"
                  >
                    Confirm Extension
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: View Customer Details */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#090d1a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Business</span>
                  <span className="text-white font-medium">{selectedUser.businessName || 'Solo Practitioner'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Country</span>
                  <span className="text-white font-medium">{selectedUser.country}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">WhatsApp / Phone</span>
                  <span className="text-white font-mono">{selectedUser.phone || selectedUser.whatsapp || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Website</span>
                  <span className="text-white font-mono truncate block">{selectedUser.companyWebsite || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Account Status</span>
                  <span className="text-white font-bold capitalize">{selectedUser.status}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Role</span>
                  <span className="text-white font-bold uppercase">{selectedUser.role}</span>
                </div>
              </div>

              {selectedUser.activeSubscription && (
                <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">
                      Package: {selectedUser.activeSubscription.planName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">
                      {selectedUser.activeSubscription.billingCycle}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="p-2 rounded bg-slate-900/80">
                      <div className="text-[10px] text-slate-500">Allocated</div>
                      <div className="font-mono font-bold text-white">
                        {selectedUser.activeSubscription.leadQuota.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80">
                      <div className="text-[10px] text-slate-500">Consumed</div>
                      <div className="font-mono font-bold text-purple-400">
                        {selectedUser.activeSubscription.leadsConsumed.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80">
                      <div className="text-[10px] text-slate-500">Expires</div>
                      <div className="font-mono font-bold text-emerald-400 text-[11px]">
                        {new Date(selectedUser.activeSubscription.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
