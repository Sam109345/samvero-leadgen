'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCircle2, Phone, Mail } from 'lucide-react';

const WHATSAPP_NUMBER = '923122557564'; // +923122557564

export default function WhatsAppChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = (textToSend?: string) => {
    const finalMsg = (textToSend || message).trim();
    if (!finalMsg) return;

    const encoded = encodeURIComponent(finalMsg);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSentSuccess(true);
    setTimeout(() => {
      setMessage('');
      setSentSuccess(false);
    }, 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'Hi! I want to explore high-intent commercial leads for my agency.',
    'I want to inquire about VIP enterprise packages & custom quotas.',
    'Can you show me a live demo of your 10-second lead radar?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans print:hidden">
      {/* ── Chatbot Window ── */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[380px] rounded-3xl bg-[#070d1d]/98 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-300 ring-2 ring-emerald-800 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                  <span>Samvero WhatsApp Desk</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                </div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                  <span>Online • Instant Landing</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition cursor-pointer"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto bg-gradient-to-b from-[#0a1226] to-[#040814] text-xs">
            {/* Bot message 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                SV
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-[#0e1a36] border border-slate-800 text-slate-200 leading-relaxed shadow-sm">
                <p className="font-semibold text-white mb-1">Welcome to Samvero VIP Support! 👋</p>
                <p className="text-slate-300">
                  Have questions about verified leads, automated outreach, or enterprise plans? Type your inquiry below to connect directly with our executive team on WhatsApp (<span className="text-emerald-400 font-mono font-semibold">+92 312 2557564</span>).
                </p>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1 pl-9">
              <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
                Quick Prompts:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessage(prompt);
                    handleSend(prompt);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-[#091124] hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition text-[11px] leading-tight block cursor-pointer"
                >
                  💬 {prompt}
                </button>
              ))}
            </div>

            {/* Direct Support Numbers */}
            <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-slate-800/80 text-[11px] space-y-1 text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>Call: +92 305 2607448</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-cyan-400" />
                <span>Email: samverodigital@gmail.com</span>
              </div>
            </div>

            {sentSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Landing on WhatsApp now...</span>
              </div>
            )}
          </div>

          {/* Input & Send Footer */}
          <div className="p-3 bg-[#070d1d] border-t border-slate-800 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              rows={2}
              className="flex-1 bg-[#0b142b] border border-slate-700/80 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none resize-none transition"
            />
            <button
              onClick={() => handleSend()}
              disabled={!message.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 text-white font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating WhatsApp Action Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.5),0_10px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-emerald-400/40"
        aria-label="Chat on WhatsApp (+923122557564)"
      >
        {/* Pulsing ring aura */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />

        {/* Inner Icon */}
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 fill-white text-emerald-600" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#030712] shadow-sm">
              1
            </span>
          </>
        )}
      </button>
    </div>
  );
}
