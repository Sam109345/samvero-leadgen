'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, Building2, MapPin, Globe, Phone, Mail } from 'lucide-react';
import { Lead, PipelineStage } from '@/types';
import { calculateBusinessAge } from '@/lib/gmb-age-calculator';
import { generateClientWebsite } from '@/lib/website-generator';
import { resolveLegitimateBusinessEmail } from '@/lib/gmb-email-resolver';
import { cleanWhatsAppDigits } from '@/lib/phone-utils';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

export default function CreateLeadModal({
  isOpen,
  onClose,
  onAddLead,
}: CreateLeadModalProps) {
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('Lahore');
  const [country, setCountry] = useState<'Pakistan' | 'US' | 'UK' | 'UAE'>('Pakistan');
  const [category, setCategory] = useState<'Local Business' | 'Web Development' | 'Graphic Design' | 'Mobile App'>('Local Business');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [foundedYear, setFoundedYear] = useState('2026');
  const [hasWebsite, setHasWebsite] = useState(false);
  const [website, setWebsite] = useState('');
  const [budget, setBudget] = useState('PKR 150,000 - 300,000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) return;

    const age = calculateBusinessAge(foundedYear);
    const id = `custom-lead-${Date.now()}`;

    const resolved = resolveLegitimateBusinessEmail({
      businessName,
      website: hasWebsite ? website : undefined,
      country,
      city,
      category,
      phone: phone || undefined,
    });

    const finalPhone = phone || resolved.phone;
    const finalEmail = email || resolved.email;
    const finalWhatsApp = cleanWhatsAppDigits(finalPhone, country);

    const baseLead: Lead = {
      id,
      title: `${businessName} Showcase & Client Lead`,
      businessName,
      type: 'gmb',
      platform: 'Google My Business',
      category,
      country,
      city,
      address: `${city}, ${country}`,
      businessAge: age,
      budget,
      jobType: 'Direct Client',
      description: `Target prospect in ${city}. ${hasWebsite ? 'Existing website needs modernization.' : 'Has NO active website detected - high conversion target.'}`,
      postedAt: 'Just now',
      contact: {
        phone: finalPhone,
        email: finalEmail,
        whatsapp: finalWhatsApp,
        hasWebsite,
        website: hasWebsite ? website : undefined,
        contactPerson: 'Business Owner',
      },
      rating: 4.9,
      reviewCount: 15,
      tags: [hasWebsite ? 'Needs Redesign' : 'No Website Target', age.label],
      verified: true,
      pipelineStage: hasWebsite ? 'new' : 'hot',
      status: 'new',
      incomingAt: Date.now(),
    };

    const leadWithSite: Lead = {
      ...baseLead,
      generatedWebsite: generateClientWebsite(baseLead),
    };

    onAddLead(leadWithSite);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1877F2]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Create &amp; Ingest Custom Lead
              </h3>
              <p className="text-xs text-slate-500">
                Auto-computes business age &amp; drafts client pitch landing page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Business / Client Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Dr. Bilal Aesthetic Clinic, Lahore"
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Territory / Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              >
                <option value="Pakistan">🇵🇰 Pakistan (Local)</option>
                <option value="UAE">🇦🇪 United Arab Emirates (UAE)</option>
                <option value="US">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                City / Region
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Dubai / Lahore / Austin / London"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Niche / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              >
                <option value="Local Business">🏢 Local Business (GMB)</option>
                <option value="Web Development">💻 Web Development (Next.js)</option>
                <option value="Mobile App">📱 Mobile App (14 Screens)</option>
                <option value="Graphic Design">🎨 Brand Identity &amp; 6 Logos</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Founding Year / Date
              </label>
              <input
                type="text"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="2026 (New) or 2018 (Est.)"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Website Toggle */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-800">
                Has Existing Website?
              </span>
              <span className="text-[11px] text-slate-500">
                If false, lead will be flagged as Hot No-Website Redesign Target
              </span>
            </div>
            <input
              type="checkbox"
              checked={hasWebsite}
              onChange={(e) => setHasWebsite(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {hasWebsite && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Existing Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Lead &amp; Draft Site</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
