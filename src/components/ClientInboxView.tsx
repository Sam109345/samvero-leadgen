'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Phone, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  User, 
  Flame, 
  DollarSign, 
  Calendar, 
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { EmailThread, EmailMessage } from '@/types';

interface ClientInboxViewProps {
  onOpenWebsitePreview: (previewUrl: string) => void;
  onClientReplyReceived?: (clientName: string, snippet: string) => void;
}

export default function ClientInboxView({
  onOpenWebsitePreview,
  onClientReplyReceived,
}: ClientInboxViewProps) {
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'pricing'>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [replySentSuccess, setReplySentSuccess] = useState(false);

  // Fetch threads
  const loadThreads = async (markReadId?: string) => {
    try {
      const url = markReadId ? `/api/inbox?markRead=${markReadId}` : '/api/inbox';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setThreads(data.threads);
        if (!selectedThreadId && data.threads.length > 0) {
          setSelectedThreadId(data.threads[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to load inbox threads');
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    loadThreads(id);
  };

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    if (filter === 'unread' && !t.unread) return false;
    if (filter === 'booking' && t.sentiment !== 'booking') return false;
    if (filter === 'pricing' && t.sentiment !== 'pricing') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.businessName.toLowerCase().includes(q) ||
        t.contactPerson.toLowerCase().includes(q) ||
        t.lastMessageSnippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Send Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThreadId || !replyText.trim()) return;

    try {
      setSendingReply(true);
      const res = await fetch('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: selectedThreadId,
          replyText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyText('');
        setReplySentSuccess(true);
        setTimeout(() => setReplySentSuccess(false), 3000);
        loadThreads();
      }
    } catch (e) {
      console.error('Failed to send reply:', e);
    } finally {
      setSendingReply(false);
    }
  };

  // Simulate an incoming client reply
  const handleSimulateClientReply = async () => {
    if (!selectedThreadId) return;

    try {
      setSimulating(true);
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate',
          threadId: selectedThreadId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        loadThreads();
        if (onClientReplyReceived && data.thread) {
          onClientReplyReceived(data.thread.contactPerson, data.thread.lastMessageSnippet);
        }
      }
    } catch (e) {
      console.error('Failed to simulate reply:', e);
    } finally {
      setSimulating(false);
    }
  };

  // Quick reply snippet injector
  const applyQuickReply = (text: string) => {
    setReplyText(text);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[82vh]">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center font-bold shadow-2xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                Client Responses &amp; Inbound Inbox
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Inbound Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              When clients reply to your website pitch, proposals show up here in real time
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {selectedThread && (
            <button
              onClick={handleSimulateClientReply}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs transition active:scale-95 disabled:opacity-50"
              title="Simulate an immediate client response for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{simulating ? 'Receiving...' : 'Simulate Client Reply'}</span>
            </button>
          )}

          <button
            onClick={() => loadThreads()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Refresh inbox"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Pane Inbox Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Conversations List */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200/90 flex flex-col bg-slate-50/40">
          {/* Search & Filter pills */}
          <div className="p-3 border-b border-slate-200/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'all' ? 'bg-[#1877F2] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({threads.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'unread' ? 'bg-[#1877F2] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread ({threads.filter((t) => t.unread).length})
              </button>
              <button
                onClick={() => setFilter('booking')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'booking' ? 'bg-[#1877F2] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Call Requests
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === selectedThreadId;
                const sentimentBadge = {
                  booking: { label: '📅 Zoom Call Request', color: 'bg-emerald-100 text-emerald-800' },
                  pricing: { label: '💰 Pricing Inquiry', color: 'bg-blue-100 text-blue-800' },
                  positive: { label: '✨ Positive Interest', color: 'bg-purple-100 text-purple-800' },
                  neutral: { label: 'Inbound Message', color: 'bg-slate-100 text-slate-700' },
                }[thread.sentiment || 'neutral'];

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-[#1877F2]'
                        : thread.unread
                        ? 'bg-white hover:bg-slate-50 font-bold'
                        : 'bg-transparent hover:bg-slate-100/60 text-slate-600'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 shadow-inner">
                      {thread.contactPerson.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {thread.contactPerson}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal shrink-0">
                          {thread.lastMessageAt}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-600 block truncate">
                        {thread.businessName} &bull; {thread.city}
                      </span>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 leading-snug">
                        {thread.lastMessageSnippet}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        {sentimentBadge && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${sentimentBadge.color}`}
                          >
                            {sentimentBadge.label}
                          </span>
                        )}
                        {thread.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#1877F2] ml-auto shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Thread History & Composer */}
        {selectedThread ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Thread Header Bar */}
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {selectedThread.businessName}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">&bull;</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {selectedThread.contactPerson} ({selectedThread.clientEmail})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Location: {selectedThread.city}, {selectedThread.country}
                </span>
              </div>

              {/* Quick Contact & Preview Actions */}
              <div className="flex items-center gap-2">
                {selectedThread.leadId && (
                  <button
                    onClick={() => onOpenWebsitePreview(`/preview/${selectedThread.leadId}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Pitch Website</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
              {selectedThread.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      <span>&bull;</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-2xl rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'bg-[#1877F2] text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.content}

                      {/* Attached Live Website Pill if present */}
                      {msg.previewUrl && (
                        <div
                          onClick={() => onOpenWebsitePreview(msg.previewUrl!)}
                          className={`mt-3 p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2 border transition ${
                            isUser
                              ? 'bg-blue-600/80 border-blue-400 text-white hover:bg-blue-600'
                              : 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span className="font-bold text-xs">
                              Interactive Website Preview Attached
                            </span>
                          </div>
                          <span className="text-[11px] underline flex items-center gap-0.5">
                            Open <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Closing Templates Bar */}
            <div className="px-5 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0 text-[10px]">
                Quick Pitch Closers:
              </span>
              <button
                type="button"
                onClick={() =>
                  applyQuickReply(
                    `Hi ${selectedThread.contactPerson},\n\nSounds fantastic! I'd love to connect on Friday at 4:30 PM. Here is our direct calendar booking link or I can call you at your office number.\n\nLooking forward to speaking with you!\n\nBest regards,\nSameer`
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition shrink-0"
              >
                📅 Confirm Friday Call
              </button>
              <button
                type="button"
                onClick={() =>
                  applyQuickReply(
                    `Hi ${selectedThread.contactPerson},\n\nThanks for asking! Our complete turnkey package includes custom design, mobile optimization, SEO, and domain deployment for PKR 180,000 / $1,500 with 7-day turnaround.\n\nShould we prepare the kickoff paperwork?`
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition shrink-0"
              >
                💵 Send Pricing Package
              </button>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-white space-y-2">
              <div className="relative">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write reply to ${selectedThread.contactPerson}...`}
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-sans"
                />
              </div>

              <div className="flex items-center justify-between">
                {replySentSuccess ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reply sent to client successfully!</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Dispatches directly to {selectedThread.clientEmail} via SMTP/Resend
                  </span>
                )}

                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? 'Sending...' : 'Send Client Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            Select a conversation to view thread.
          </div>
        )}
      </div>
    </div>
  );
}
