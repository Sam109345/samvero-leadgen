'use client';

import React, { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { ManualPayment, AdminSettings } from '@/lib/saas-store';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Download,
  Calendar,
  DollarSign,
  FileText,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function CustomerBillingPage() {
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/customer/metrics').then((r) => r.json()),
      fetch('/api/admin/settings').then((r) => r.json()),
    ])
      .then(([metricsData, settingsData]) => {
        if (settingsData.success) {
          setSettings(settingsData.settings);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch customer payments from tenant-isolated endpoint
    fetch('/api/customer/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.payments)) {
          setPayments(data.payments);
        }
      })
      .catch(() => {});
  }, []);

  const handlePrintReceipt = (pay: ManualPayment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Samvero Official Commercial Receipt - ${pay.paymentReference}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
            .title { font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-top: 4px; }
            .details { margin-bottom: 30px; font-size: 14px; line-height: 1.6; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            .table th { background: #f8fafc; font-size: 12px; text-transform: uppercase; color: #64748b; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; color: #0f172a; }
            .status { display: inline-block; padding: 4px 10px; background: #dcfce7; color: #15803d; border-radius: 9999px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SAMVERO Technologies Inc.</div>
            <div class="title">Official Commercial Subscription Receipt</div>
          </div>
          <div class="details">
            <p><strong>Customer:</strong> ${pay.customerName} (${pay.customerEmail})</p>
            <p><strong>Payment Reference:</strong> ${pay.paymentReference}</p>
            <p><strong>Date Confirmed:</strong> ${new Date(pay.confirmedAt || pay.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${pay.paymentMethod}</p>
            <p><strong>Status:</strong> <span class="status">CONFIRMED &amp; SETTLED</span></p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Cycle</th>
                <th>Currency</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Samvero SaaS Subscription (${pay.planName})</td>
                <td style="text-transform: capitalize;">${pay.billingDuration}</td>
                <td>${pay.currency}</td>
                <td>$${Number(pay.amountReceived || pay.amountDue).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Paid: $${Number(pay.amountReceived || pay.amountDue).toLocaleString()} ${pay.currency}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <CustomerLayout
      title="Billing History & Official Invoices"
      subtitle="View your confirmed payment receipts, transaction references, and corporate escrow wiring instructions."
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Wire Escrow Instructions Card */}
        <div className="bg-[#0b1222] border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <Building className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Manual Payment & Wire Escrow Desk</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Samvero operates an institutional B2B escrow model for enterprise subscriptions. Wire transfers and Wise payments are reconciled within 2-4 business hours upon confirmation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-semibold block">Commercial Wire Desk:</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank:</span>
                <span className="text-white">{settings?.bankWireInstructions?.bankName || 'JPMorgan Chase'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="text-white">{settings?.bankWireInstructions?.accountTitle || 'SAMVERO Technologies'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IBAN:</span>
                <span className="text-amber-300">{settings?.bankWireInstructions?.iban || 'US89CHAS48291049281700'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SWIFT:</span>
                <span className="text-white">{settings?.bankWireInstructions?.swiftCode || 'CHASUS33XXX'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-semibold block">Wise Corporate Desk:</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Wise Email:</span>
                <span className="text-white">{settings?.wiseInstructions?.email || 'billing@samvero.com'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PayTag:</span>
                <span className="text-amber-300">{settings?.wiseInstructions?.payTag || '@samvero-corporate'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currency:</span>
                <span className="text-emerald-400 font-bold">USD / EUR / GBP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Invoices Table */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Payment Invoices & Receipts</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{payments.length} transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d1a]/50 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Invoice / Reference</th>
                  <th className="py-3.5 px-4">Package & Cycle</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500 font-mono text-xs">
                      No invoices recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-850/30 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">{pay.paymentReference}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-amber-300 font-medium">{pay.planName}</span>
                        <span className="text-slate-500 font-mono text-[10px] block capitalize">
                          {pay.billingDuration.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${Number(pay.amountReceived || pay.amountDue).toLocaleString()} {pay.currency}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">{pay.paymentMethod}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {new Date(pay.confirmedAt || pay.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            pay.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{pay.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handlePrintReceipt(pay)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[10px] transition flex items-center gap-1 ml-auto"
                        >
                          <Download className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
