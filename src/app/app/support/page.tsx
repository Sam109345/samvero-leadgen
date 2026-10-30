'use client';

import React, { useState } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import {
  HelpCircle,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does lead quota deduction work?',
    answer:
      'Each time you save a newly discovered company from the Business Research tool into your private workspace, exactly 1 quota credit is deducted. If you save the same lead multiple times, our server deduplication ensures zero double-charging.',
  },
  {
    question: 'How are manual bank wire and Wise payments confirmed?',
    answer:
      'Upon submitting your wire or Wise reference, our banking desk reconciles the incoming transaction against our JPMorgan Chase or Wise commercial ledger. Once cleared (usually within 2-4 business hours), your package and fresh quota are activated immediately.',
  },
  {
    question: 'What happens when my subscription expires?',
    answer:
      'When your subscription expires, all your previously saved leads and contact details remain safely preserved in your workspace. Only new lead discoveries and AI research jobs are paused until renewal is confirmed.',
  },
  {
    question: 'What is the Samvero lead verification SLA?',
    answer:
      'We run strict multi-point verification across all discovered mailboxes (MX record resolution, SMTP handshake, spam-trap elimination) and phone lines (E.164 formatting, carrier check), ensuring 95%+ outbound deliverability.',
  },
];

export default function CustomerSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Standard');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setLoading(true);

    try {
      // Create admin notification
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientRole: 'admin',
          type: 'general',
          title: `Client Support Ticket: ${subject}`,
          message: `Priority: ${priority}. Message: ${message}`,
          link: '/admin/dashboard',
        }),
      });

      setSubmitted(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout
      title="Client Concierge & Support Desk"
      subtitle="Submit research requests, report data questions, or review platform knowledge base documentation."
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submit Support Ticket */}
          <div className="md:col-span-2 bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Mail className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Open Dedicated Support Ticket</h3>
            </div>

            {submitted && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ticket submitted. Your dedicated account manager will respond shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Subject / Area</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Request custom scraping parameters for UK accounting firms"
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Standard">Standard (Within 24 Hours)</option>
                  <option value="Urgent">Urgent / Quota Expansion</option>
                  <option value="Critical">Critical Enterprise SLA</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Inquiry Details</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details regarding your question or requested custom search parameters..."
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold font-mono rounded-lg transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting...' : 'Dispatch Ticket'}</span>
              </button>
            </form>
          </div>

          {/* Concierge Info & Hours */}
          <div className="space-y-4">
            <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Desk Coverage & SLA</h3>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Hours of Operation</span>
                  <span className="text-slate-200">Monday &ndash; Friday &bull; 24/5 Global Coverage</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Direct Escrow Desk</span>
                  <span className="text-amber-300">support@samvero.com</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Response SLA</span>
                  <span className="text-emerald-400">&le; 4 Hours for Active Plans</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Data Provenance Guarantee</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Every lead delivered in Samvero is strictly sourced from live registries, verified public business filings, and open web directories. Zero synthetic contacts.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="rounded-xl bg-[#080d1a] border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-semibold text-white hover:text-amber-300 transition"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
