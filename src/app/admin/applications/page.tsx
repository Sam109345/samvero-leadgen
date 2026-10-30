'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CustomerApplication, PlanConfig, BillingCycle } from '@/lib/saas-store';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  DollarSign,
  Copy,
  Check,
  X,
} from 'lucide-react';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<CustomerApplication[]>([]);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected application drawer/modal
  const [selectedApp, setSelectedApp] = useState<CustomerApplication | null>(null);

  // Activation modal state (Phase 8 One-Click Creation)
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [targetAppForActivation, setTargetAppForActivation] = useState<CustomerApplication | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<BillingCycle>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState('');
  const [amountReceived, setAmountReceived] = useState<number>(199);
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire Transfer');
  const [paymentReference, setPaymentReference] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [activating, setActivating] = useState(false);
  const [activationResult, setActivationResult] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchApplications = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/applications').then((r) => r.json()),
      fetch('/api/plans').then((r) => r.json()),
    ])
      .then(([appData, planData]) => {
        if (appData.success && Array.isArray(appData.applications)) {
          setApplications(appData.applications);
        }
        if (planData.success && Array.isArray(planData.plans)) {
          setPlans(planData.plans);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update expiry date whenever duration or start date changes
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    const exp = new Date(start);
    switch (selectedDuration) {
      case 'monthly':
        exp.setDate(exp.getDate() + 30);
        break;
      case 'quarterly':
        exp.setDate(exp.getDate() + 90);
        break;
      case 'half_yearly':
        exp.setDate(exp.getDate() + 180);
        break;
      case 'annual':
        exp.setDate(exp.getDate() + 365);
        break;
    }
    setExpiryDate(exp.toISOString().slice(0, 10));

    // Update expected amount from plan
    const currentPlan = plans.find((p) => p.id === selectedPlanId);
    if (currentPlan) {
      const price = currentPlan.prices[selectedDuration] || currentPlan.prices.monthly;
      setAmountReceived(price);
    }
  }, [selectedDuration, startDate, selectedPlanId, plans]);

  const handleOpenActivation = (app: CustomerApplication) => {
    setTargetAppForActivation(app);
    setSelectedPlanId(app.planId || plans[2]?.id || plans[0]?.id);
    setSelectedDuration(app.billingDuration || 'monthly');
    setPaymentReference(`WIRE-${Date.now().toString().slice(-6)}`);
    setActivationResult(null);
    setActivationModalOpen(true);
  };

  const handleExecuteActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppForActivation) return;
    setActivating(true);

    try {
      const res = await fetch('/api/admin/activate-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: targetAppForActivation.id,
          planId: selectedPlanId,
          billingDuration: selectedDuration,
          startDate,
          expiryDateOverride: expiryDate,
          amountReceived: Number(amountReceived),
          paymentMethod,
          paymentReference,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActivationResult(data);
        fetchApplications();
      } else {
        alert(data.error || 'Failed to activate customer.');
      }
    } catch (err: any) {
      alert(err?.message || 'Activation failed');
    } finally {
      setActivating(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: any) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchApplications();
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(data.application);
        }
      }
    } catch (err: any) {
      console.warn(err);
    }
  };

  const filtered = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.referenceNumber.toLowerCase().includes(q) ||
        (app.businessName && app.businessName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AdminLayout
      title="Customer Applications"
      subtitle="Review membership applications, verify payment instructions, and trigger one-click customer provisioning"
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
              placeholder="Search by name, email, or reference..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-bold shrink-0">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Applications ({applications.length})</option>
              <option value="pending">Pending Review</option>
              <option value="reviewing">In Review</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="approved">Approved & Activated</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#090d1a] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Selected Package</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                      Loading customer applications...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                      No applications found matching query.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{app.referenceNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{app.fullName}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.email} &bull; {app.whatsapp}
                        </div>
                        {app.businessName && (
                          <div className="text-[10px] text-slate-500 font-semibold">{app.businessName}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">{app.planName}</td>
                      <td className="py-3.5 px-4 font-mono capitalize text-slate-300">{app.billingDuration}</td>
                      <td className="py-3.5 px-4">{app.country}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            app.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : app.status === 'rejected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                              : app.status === 'payment_pending'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                        >
                          Details
                        </button>
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleOpenActivation(app)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-xs"
                          >
                            Activate Account
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Drawer */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-lg bg-[#090d1a] border-l border-slate-800 p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
                    Application Dossier
                  </span>
                  <h3 className="text-xl font-black text-white">{selectedApp.fullName}</h3>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reference Number</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">{selectedApp.referenceNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Current Status</span>
                    <span className="font-bold text-white capitalize">{selectedApp.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <span className="font-medium text-white">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">WhatsApp</span>
                    <span className="font-mono text-white">{selectedApp.whatsapp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Operating Country</span>
                    <span className="font-medium text-white">{selectedApp.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Business Name</span>
                    <span className="font-medium text-white">{selectedApp.businessName || 'Solo Practitioner'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Selected Package</span>
                    <span className="font-bold text-white">{selectedApp.planName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <span className="font-mono text-white capitalize">{selectedApp.billingDuration}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1.5">Service & Lead Requirements</h4>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 whitespace-pre-wrap">
                    {selectedApp.serviceRequirements}
                  </div>
                </div>

                {selectedApp.additionalMessage && (
                  <div>
                    <h4 className="font-bold text-white mb-1.5">Applicant Notes</h4>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 whitespace-pre-wrap">
                      {selectedApp.additionalMessage}
                    </div>
                  </div>
                )}

                {/* Status Change Buttons */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-slate-400 font-bold block mb-1">Set Application Status:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, 'reviewing')}
                      className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
                    >
                      Mark Reviewing
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, 'payment_pending')}
                      className="py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-200 font-bold transition"
                    >
                      Payment Pending
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                      className="py-2 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold transition"
                    >
                      Mark Rejected
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApp(null);
                        handleOpenActivation(selectedApp);
                      }}
                      className="py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black transition"
                    >
                      Activate Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* One-Click Customer Activation Modal (Phase 8) */}
        {activationModalOpen && targetAppForActivation && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#090d1a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">One-Click Customer Account Activation</h3>
                    <p className="text-xs text-slate-400">
                      Applicant: {targetAppForActivation.fullName} ({targetAppForActivation.referenceNumber})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivationModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activationResult ? (
                /* Success View with Generated Credentials & Link */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-bold">
                      Customer account and {activationResult.subscription?.planName} subscription created transactionally!
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Customer Login Email:</span>
                      <span className="font-bold text-white">{activationResult.user?.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">One-Time Temporary Password:</span>
                      <span className="font-mono font-bold text-amber-400 text-sm select-all">
                        {activationResult.temporaryPassword}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Assigned Lead Quota:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {activationResult.subscription?.leadQuota} Leads (Valid until{' '}
                        {new Date(activationResult.subscription?.expiryDate).toLocaleDateString()})
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate">
                      <span className="text-[10px] text-amber-400 font-bold block">Secure Activation Link:</span>
                      <span className="font-mono text-slate-300 truncate block text-[11px]">
                        {activationResult.activationLink}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}${activationResult.activationLink}`
                        );
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold shrink-0 transition"
                    >
                      {copiedLink ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActivationModalOpen(false);
                      setActivationResult(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                /* Activation Form */
                <form onSubmit={handleExecuteActivation} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Package */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Subscription Package</label>
                      <select
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.maxLeadsQuota.toLocaleString()} Leads)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Billing Duration</label>
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value as BillingCycle)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400 capitalize"
                      >
                        <option value="monthly">Monthly (+30 Days)</option>
                        <option value="quarterly">Quarterly (+90 Days)</option>
                        <option value="half_yearly">Half-Yearly (+180 Days)</option>
                        <option value="annual">Annual (+365 Days)</option>
                      </select>
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Expiry Date (Auto-calculated with manual override) */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Expiry Date <span className="text-[10px] text-amber-400">(Auto-calculated)</span>
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Amount Received */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Confirmed Amount (USD)</label>
                      <input
                        type="number"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                        <option value="Wise Direct">Wise Direct</option>
                        <option value="Direct Deposit">Direct Deposit</option>
                        <option value="Corporate Cheque">Corporate Cheque</option>
                        <option value="Stripe Invoice">Stripe Invoice</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Reference */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Payment Reference / Tx ID</label>
                    <input
                      type="text"
                      required
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. WIRE-8849102"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Admin Verification Notes</label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Deposit verified with JPMorgan commercial bank desk."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-[11px] text-slate-400">
                    <span className="font-bold text-amber-400 block mb-0.5">Automation Guarantee:</span>
                    Features, lead quotas, research permissions, and source platforms will be assigned automatically from the selected plan.
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActivationModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={activating}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black transition disabled:opacity-60"
                    >
                      {activating ? 'Provisioning Account...' : 'Confirm Payment & Activate Account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
