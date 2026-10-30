'use client';

import React, { useState } from 'react';
import {
  ListTree,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Play,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { EnrichmentJob, Lead } from '@/types';
import { enqueueEnrichmentJob, processEnrichmentJob, retryEnrichmentJob, getAllEnrichmentJobs } from '@/lib/enrichment-queue';

interface VerificationQueueViewProps {
  leads: Lead[];
  jobs: EnrichmentJob[];
  onRefreshJobs?: () => void;
  onUpdateLead?: (lead: Lead) => void;
}

export default function VerificationQueueView({
  leads,
  jobs = [],
  onRefreshJobs,
  onUpdateLead,
}: VerificationQueueViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeJobRunning, setActiveJobRunning] = useState<string | null>(null);

  const [internalJobs, setInternalJobs] = useState<EnrichmentJob[]>(() => {
    const existing = getAllEnrichmentJobs();
    if (existing.length > 0) return existing;
    const candidates = leads.filter((l) => !l.contact?.email || !l.contact?.phone).slice(0, 8);
    return candidates.map((l) => enqueueEnrichmentJob(l));
  });

  const allJobsList = jobs.length > 0 ? jobs : internalJobs;

  const displayJobs = React.useMemo(() => {
    if (filterStatus === 'all') return allJobsList;
    return allJobsList.filter((j) => j.status === filterStatus);
  }, [allJobsList, filterStatus]);

  const handleRunJob = async (job: EnrichmentJob) => {
    const targetLead = leads.find((l) => l.id === job.leadId);
    if (!targetLead) return;

    setActiveJobRunning(job.id);
    try {
      const { job: updatedJob, enrichedLead } = await processEnrichmentJob(job.id, targetLead);
      setInternalJobs(getAllEnrichmentJobs());
      onUpdateLead?.(enrichedLead);
      onRefreshJobs?.();
    } finally {
      setActiveJobRunning(null);
    }
  };

  const handleQueueAll = () => {
    leads.forEach((l) => enqueueEnrichmentJob(l));
    setInternalJobs(getAllEnrichmentJobs());
    onRefreshJobs?.();
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
              Background Worker
            </span>
            <span className="text-xs text-slate-500 font-bold">Multi-Stage Research Pipeline</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Data Verification Queue</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry of background identity resolution, Google Places validation, and DNS MX checks
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          {['all', 'RUNNING', 'QUEUED', 'COMPLETED', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === st
                  ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Jobs' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <th className="p-3.5">Job ID</th>
                <th className="p-3.5">Target Business</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Stages Completed</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {displayJobs.map((job) => {
                const isRunning = activeJobRunning === job.id || job.status === 'RUNNING';

                return (
                  <tr key={job.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">{job.id.slice(0, 16)}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
                      {job.businessName}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${
                          job.status === 'COMPLETED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : isRunning
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-cyan-300'
                            : job.status === 'FAILED'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {isRunning ? (
                          <RotateCcw className="w-3 h-3 animate-spin" />
                        ) : job.status === 'COMPLETED' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : job.status === 'FAILED' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{isRunning ? 'RUNNING' : job.status}</span>
                      </span>
                    </td>

                    <td className="p-3.5 w-36">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Progress</span>
                          <span>{job.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              job.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${job.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                      {job.currentStage}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1">
                        {['Identity', 'GMB', 'Domain', 'Email MX', 'Phone', 'AI Intel', 'Score'].map((tag, i) => (
                          <span
                            key={tag}
                            className={`w-2 h-2 rounded-full ${
                              job.progressPercent >= (i + 1) * 14 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={`${tag}: ${job.progressPercent >= (i + 1) * 14 ? 'Completed' : 'Pending'}`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleRunJob(job)}
                        disabled={isRunning}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-cyan-400 font-bold rounded-lg text-xs transition disabled:opacity-40"
                      >
                        {isRunning ? 'Processing...' : job.status === 'COMPLETED' ? 'Re-Run' : 'Process Now'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
