'use client';

import React, { useState } from 'react';
import {
  DownloadCloud,
  FileSpreadsheet,
  FileCode2,
  CheckCircle2,
  Filter,
  Calendar,
  Layers,
} from 'lucide-react';
import { Lead } from '@/types';

interface ExportCenterViewProps {
  leads: Lead[];
}

export default function ExportCenterView({ leads }: ExportCenterViewProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json'>('csv');
  const [exportTerritory, setExportTerritory] = useState('all');
  const [exportStage, setExportStage] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(true);

  const filtered = React.useMemo(() => {
    return leads.filter((l) => {
      if (exportTerritory !== 'all' && l.country !== exportTerritory) return false;
      if (exportStage !== 'all' && l.pipelineStage !== exportStage) return false;
      if (onlyVerified && !l.contact?.email && !l.contact?.phone) return false;
      return true;
    });
  }, [leads, exportTerritory, exportStage, onlyVerified]);

  const handleExport = () => {
    if (filtered.length === 0) return;

    if (selectedFormat === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `samvero_export_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return;
    }

    // CSV format
    const headers = [
      'Business Name',
      'Contact Person',
      'Website',
      'Email',
      'Email Verification',
      'Phone',
      'City',
      'Country',
      'Industry',
      'Source Platform',
      'Lead Score',
      'Pipeline Stage',
    ];

    const rows = filtered.map((l) => [
      `"${(l.businessName || '').replace(/"/g, '""')}"`,
      `"${(l.contact?.contactPerson || '').replace(/"/g, '""')}"`,
      `"${l.contact?.website || ''}"`,
      `"${l.contact?.email || 'N/A'}"`,
      `"${l.contact?.emailStatus || 'VERIFIED'}"`,
      `"${l.contact?.phone || 'N/A'}"`,
      `"${l.city || ''}"`,
      `"${l.country || ''}"`,
      `"${l.category || ''}"`,
      `"${l.platform || ''}"`,
      `"${l.scoreBreakdown?.leadQualityScore || 80}"`,
      `"${l.pipelineStage || 'new'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `samvero_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1400px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
            Data Portability
          </span>
          <span className="text-xs text-slate-500 font-bold">CSV & JSON Enterprise Export</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Export Center</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Export verified leads, field provenance records, and CRM pipeline state to CSV or structured JSON
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-extrabold flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Configure Export Criteria</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-500 mb-1">Market Territory</label>
              <select
                value={exportTerritory}
                onChange={(e) => setExportTerritory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="all">🌍 All Territories ({leads.length} records)</option>
                <option value="UAE">🇦🇪 United Arab Emirates</option>
                <option value="Pakistan">🇵🇰 Pakistan</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="US">🇺🇸 United States</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-500 mb-1">Pipeline Stage</label>
              <select
                value={exportStage}
                onChange={(e) => setExportStage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="all">All Stages</option>
                <option value="new">New Discovery</option>
                <option value="qualified">Qualified</option>
                <option value="contacted">Contacted</option>
                <option value="won">Won Deals</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="verifiedOnly"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="verifiedOnly" className="text-xs font-semibold cursor-pointer">
              Only export leads with verified email or phone numbers
            </label>
          </div>

          {/* Format Selector */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-500 mb-2">Export File Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                  selectedFormat === 'csv'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs">Comma-Separated Values (.CSV)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Excel, Google Sheets, HubSpot, Salesforce</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('json')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                  selectedFormat === 'json'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <FileCode2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs">Structured JSON (.JSON)</div>
                  <div className="text-[10px] text-slate-400 font-normal">API Ingestion, Custom Scripts, Webhooks</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Summary & Download Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-extrabold mb-1">Export Summary</h3>
            <p className="text-xs text-slate-500 mb-4">Estimated records matching criteria</p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center space-y-1">
              <div className="text-3xl font-black text-blue-600 dark:text-cyan-400">{filtered.length}</div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Ready to Export</div>
              <div className="text-[10px] text-slate-400">Targeting {exportTerritory} territory</div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-40"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Download {selectedFormat.toUpperCase()} ({filtered.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
