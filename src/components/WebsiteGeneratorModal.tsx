'use client';

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Mail, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Palette, 
  Building2, 
  Globe
} from 'lucide-react';
import { Lead, GeneratedWebsiteData } from '@/types';
import { generateClientWebsite, compileStandaloneHtml } from '@/lib/website-generator';

interface WebsiteGeneratorModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenOutreachWithPreview: (lead: Lead, previewUrl: string) => void;
}

export default function WebsiteGeneratorModal({
  lead,
  isOpen,
  onClose,
  onOpenOutreachWithPreview,
}: WebsiteGeneratorModalProps) {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [activeColor, setActiveColor] = useState<GeneratedWebsiteData['colorScheme']>('royal-blue');

  if (!isOpen || !lead) return null;

  const websiteData: GeneratedWebsiteData = {
    ...(lead.generatedWebsite || generateClientWebsite(lead)),
    colorScheme: activeColor,
  };

  const previewUrl = `/preview/${lead.id}`;
  const compiledHtml = compileStandaloneHtml(websiteData);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(compiledHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-white/80 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Automated Website Generator
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Ready to Pitch
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Generated from GMB &amp; business profile for <strong>{lead.businessName}</strong> ({lead.businessAge.label})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport toggle */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                  deviceView === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                  deviceView === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Color Palette Selector Bar */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-600">Theme Scheme:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'royal-blue', label: 'Meta Blue', color: '#1877F2' },
                { id: 'emerald-green', label: 'Emerald Health', color: '#059669' },
                { id: 'luxury-gold', label: 'Luxury Gold', color: '#D97706' },
                { id: 'modern-dark', label: 'Modern Studio', color: '#18181B' },
              ].map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setActiveColor(scheme.id as any)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                    activeColor === scheme.id
                      ? 'border-slate-800 bg-slate-100 font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: scheme.color }}
                  />
                  <span>{scheme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied HTML!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Tab</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenOutreachWithPreview(lead, previewUrl);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold transition shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Pitch to Client</span>
            </button>
          </div>
        </div>

        {/* Live Preview Viewport */}
        <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex justify-center items-start">
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden ${
              deviceView === 'desktop' ? 'w-full max-w-4xl h-full' : 'w-[375px] h-[640px]'
            }`}
          >
            <iframe
              srcDoc={compiledHtml}
              title="Client Landing Page Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
