'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ManualPayment, PlanConfig } from '@/lib/saas-store';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  PlusCircle,
  FileCheck,
  Building,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal 1: Confirm Payment
  const [confirmModalPayment, setConfirmModalPayment] = useState<ManualPayment | null>(null);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [confirming, setConfirming] = useState(false);

  // Modal 2: Record Direct Payment
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordForm, setRecordForm] = useState({
    customerName: '',
    customerEmail: '',
    planId: 'plan_standard',
    billingDuration: 'monthly',
    amountReceived: 189,
    paymentMethod: 'Bank Wire Transfer',
    paymentReference: '',
    adminNotes: '',
  });
  const [recording, setRecording] = useState(false);

  const fetchPayments = () => {
    setLoading(true);
    fetch('/api/admin/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.payments)) {
          setPayments(data.payments);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));

    fetch('/api/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmModalPayment) return;
    setConfirming(true);

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: confirmModalPayment.id,
          notes: confirmNotes || 'Payment verified against bank settlement.',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmModalPayment(null);
        fetchPayments();
      } else {
        alert(data.error || 'Failed to confirm payment');
      }
    } catch (err: any) {
      alert(err?.message || 'Error confirming payment');
    } finally {
      setConfirming(false);
    }
  };

  const handleRecordDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecording(true);

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...recordForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowRecordModal(false);
        setRecordForm({
          customerName: '',
          customerEmail: '',
          planId: 'plan_standard',
          billingDuration: 'monthly',
          amountReceived: 189,
          paymentMethod: 'Bank Wire Transfer',
          paymentReference: '',
          adminNotes: '',
        });
        fetchPayments();
      } else {
        alert(data.error || 'Failed to record direct payment');
      }
    } catch (err: any) {
      alert(err?.message || 'Error recording direct payment');
    } finally {
      setRecording(false);
    }
  };

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? p.status === 'pending' || p.status === 'payment_submitted' || p.status === 'under_review'
        : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalRevenue = payments
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + Number(p.amountReceived || 0), 0);

  const pendingAmount = payments
    .filter((p) => p.status !== 'confirmed' && p.status !== 'rejected')
    .reduce((sum, p) => sum + Number(p.amountDue || 0), 0);

  const confirmedCount = payments.filter((p) => p.status === 'confirmed').length;
  const pendingCount = payments.filter((p) => p.status !== 'confirmed' && p.status !== 'rejected').length;

  return (
    <AdminLayout
      title="Manual B2B Payments & Escrow Desk"
      subtitle="Verify offline bank wire transfers, Wise receipts, corporate invoice transactions, and manual settlements."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b1222] border border-emerald-500/30 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Total Confirmed Revenue</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">${totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{confirmedCount} settlements cleared</div>
          </div>
          <div className="bg-[#0b1222] border border-amber-500/30 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Pending Verification</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">${pendingAmount.toLocaleString()}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{pendingCount} transactions awaiting review</div>
          </div>
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Primary Payment Route</div>
            <div className="text-2xl font-bold text-white mt-1">Bank Wire</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Direct institutional escrow</div>
          </div>
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Average Transaction</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              ${confirmedCount > 0 ? Math.round(totalRevenue / confirmedCount).toLocaleString() : '0'}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Across all confirmed packages</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, customer, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            {[
              { label: 'All Payments', value: 'all' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Pending Review', value: 'pending' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition shrink-0 ${
                  statusFilter === tab.value
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-[#080d1a] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={() => setShowRecordModal(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-xs font-mono rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-400/10"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record Direct Wire</span>
            </button>

            <button
              onClick={fetchPayments}
              className="p-1.5 bg-[#080d1a] border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Plan & Cycle</th>
                  <th className="py-3.5 px-4">Amount & Currency</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Reference & Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                      Loading payment records from database...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                      No payment records found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-850/30 transition">
                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{pay.customerName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{pay.customerEmail}</div>
                        {pay.applicationReference && (
                          <span className="inline-block mt-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/70 text-slate-400">
                            App: {pay.applicationReference}
                          </span>
                        )}
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-amber-300">{pay.planName}</div>
                        <div className="text-[11px] font-mono text-slate-400 capitalize">{pay.billingDuration.replace('_', ' ')}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white font-mono text-sm">
                          ${pay.amountReceived ? pay.amountReceived.toLocaleString() : pay.amountDue.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Due: ${pay.amountDue.toLocaleString()} {pay.currency}
                        </div>
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-200">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pay.paymentMethod}</span>
                        </span>
                      </td>

                      {/* Reference & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-white text-[11px] font-semibold">{pay.paymentReference}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {new Date(pay.paymentDate || pay.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                            pay.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : pay.status === 'under_review' || pay.status === 'payment_submitted'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              pay.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                            }`}
                          />
                          {pay.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {pay.status !== 'confirmed' ? (
                          <button
                            onClick={() => {
                              setConfirmModalPayment(pay);
                              setConfirmNotes('');
                            }}
                            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-semibold rounded-lg transition"
                          >
                            Verify & Confirm
                          </button>
                        ) : (
                          <div className="text-[11px] font-mono text-slate-400">
                            Verified by: <span className="text-slate-300">{pay.confirmedBy || 'Desk'}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: Confirm Payment */}
        {confirmModalPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-base font-semibold text-white mb-1">Verify Manual Payment</h3>
              <p className="text-xs text-slate-400 mb-4">
                Reference: <span className="text-amber-400 font-mono">{confirmModalPayment.paymentReference}</span> from{' '}
                <span className="text-white font-medium">{confirmModalPayment.customerName}</span>
              </p>

              <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 space-y-1 mb-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Due:</span>
                  <span className="text-white font-semibold">
                    ${confirmModalPayment.amountDue} {confirmModalPayment.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Route:</span>
                  <span className="text-amber-300">{confirmModalPayment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan Assigned:</span>
                  <span className="text-white">{confirmModalPayment.planName}</span>
                </div>
              </div>

              <form onSubmit={handleConfirmPayment} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Verification Note / Settlement ID
                  </label>
                  <input
                    type="text"
                    value={confirmNotes}
                    onChange={(e) => setConfirmNotes(e.target.value)}
                    placeholder="e.g. JPMorgan Chase settlement cleared #84920"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setConfirmModalPayment(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={confirming}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition"
                  >
                    {confirming ? 'Confirming...' : 'Mark Payment Confirmed'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Record Direct Payment */}
        {showRecordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#0b1222] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <h3 className="text-base font-semibold text-white mb-1">Record Direct Wire / Wise Payment</h3>
              <p className="text-xs text-slate-400 mb-4">
                Manually record incoming wire payment directly received outside of online flow.
              </p>

              <form onSubmit={handleRecordDirectPayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      value={recordForm.customerName}
                      onChange={(e) => setRecordForm({ ...recordForm, customerName: e.target.value })}
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Customer Email</label>
                    <input
                      type="email"
                      value={recordForm.customerEmail}
                      onChange={(e) => setRecordForm({ ...recordForm, customerEmail: e.target.value })}
                      placeholder="e.g. marcus@enterprise.com"
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Package</label>
                    <select
                      value={recordForm.planId}
                      onChange={(e) => {
                        const selectedPlan = plans.find((p) => p.id === e.target.value);
                        setRecordForm({
                          ...recordForm,
                          planId: e.target.value,
                          amountReceived: selectedPlan ? (selectedPlan.prices as any)[recordForm.billingDuration] || selectedPlan.prices.monthly : 189,
                        });
                      }}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.maxLeadsQuota} leads)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Billing Duration</label>
                    <select
                      value={recordForm.billingDuration}
                      onChange={(e) => {
                        const duration = e.target.value;
                        const selectedPlan = plans.find((p) => p.id === recordForm.planId);
                        setRecordForm({
                          ...recordForm,
                          billingDuration: duration,
                          amountReceived: selectedPlan ? (selectedPlan.prices as any)[duration] || selectedPlan.prices.monthly : 189,
                        });
                      }}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="half_yearly">Half Yearly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Amount Received (USD)</label>
                    <input
                      type="number"
                      value={recordForm.amountReceived}
                      onChange={(e) => setRecordForm({ ...recordForm, amountReceived: Number(e.target.value) })}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Payment Method</label>
                    <select
                      value={recordForm.paymentMethod}
                      onChange={(e) => setRecordForm({ ...recordForm, paymentMethod: e.target.value })}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                      <option value="Wise Transfer">Wise Corporate Transfer</option>
                      <option value="Corporate Invoice">Corporate Invoice / Net 30</option>
                      <option value="Direct Escrow">Direct B2B Escrow</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Wire / Settlement Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={recordForm.paymentReference}
                    onChange={(e) => setRecordForm({ ...recordForm, paymentReference: e.target.value })}
                    placeholder="e.g. WIRE-CHASE-94810283"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Admin Audit Notes</label>
                  <input
                    type="text"
                    value={recordForm.adminNotes}
                    onChange={(e) => setRecordForm({ ...recordForm, adminNotes: e.target.value })}
                    placeholder="e.g. Receipt verified from PDF wire confirmation"
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowRecordModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recording}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs font-mono transition"
                  >
                    {recording ? 'Recording...' : 'Record Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
