'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FolderOpen,
  X,
  Search,
} from 'lucide-react';
import RichTextEditor, { sanitizeHtmlContent } from '@/components/editor/RichTextEditor';

interface EmailTemplateItem {
  id: string;
  userId: string;
  title: string;
  category: string;
  subject: string;
  htmlContent: string;
  plainText?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EmailTemplatesView() {
  const [templates, setTemplates] = useState<EmailTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor Modal / Drawer State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Website Development');
  const [formSubject, setFormSubject] = useState('');
  const [formHtml, setFormHtml] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (data.success && Array.isArray(data.templates)) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.warn('Failed to load email templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openNewTemplateModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCategory('Website Development');
    setFormSubject('Exclusive Digital Proposal for {{businessName}}');
    setFormHtml('<p>Hello {{clientFirstName}},</p><p>We reviewed your requirements for <strong>{{projectTitle}}</strong>...</p><p>Best regards,<br><strong>SAMVERO Lead Acquisition & Technology Team</strong></p>');
    setIsEditing(true);
    setStatusMessage(null);
  };

  const openEditTemplateModal = (tmpl: EmailTemplateItem) => {
    setEditingId(tmpl.id);
    setFormTitle(tmpl.title);
    setFormCategory(tmpl.category);
    setFormSubject(tmpl.subject);
    setFormHtml(tmpl.htmlContent);
    setIsEditing(true);
    setStatusMessage(null);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formSubject || !formHtml) {
      setStatusMessage({ type: 'error', text: 'Title, Subject, and Content are required.' });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId || undefined,
          title: formTitle,
          category: formCategory,
          subject: formSubject,
          htmlContent: sanitizeHtmlContent(formHtml),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        fetchTemplates();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save template.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this email template?')) return;

    try {
      const res = await fetch(`/api/templates?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.warn('Failed to delete template:', err);
    }
  };

  const categories = [
    'All Categories',
    'Website Development',
    'WordPress',
    'Shopify',
    'Social Media',
    'SEO',
    'Graphic Design',
    'Branding',
    'Digital Marketing',
    'General Outreach',
  ];

  const filtered = templates.filter((tmpl) => {
    if (categoryFilter !== 'all' && tmpl.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        tmpl.title.toLowerCase().includes(q) ||
        tmpl.subject.toLowerCase().includes(q) ||
        tmpl.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#007FED]" />
            Email Templates Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, customize, and categorize email outreach templates. The AI pitch generator references these starting points to personalize pitches against live project requirements.
          </p>
        </div>

        <button
          onClick={openNewTemplateModal}
          className="px-4 py-2.5 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Template</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#22334d] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by title or subject..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#007FED]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-bold text-slate-500">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100"
          >
            <option value="all">All Categories</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#22334d] shadow-2xs flex flex-col justify-between hover:border-[#007FED]/50 transition group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#007FED] border border-blue-200 dark:border-blue-900/60">
                  {tmpl.category}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEditTemplateModal(tmpl)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    title="Edit Template"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(tmpl.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Subject: <span className="font-semibold text-slate-700 dark:text-slate-300">{tmpl.subject}</span>
                </p>
              </div>

              {/* Template Preview Snippet */}
              <div
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1421] text-[11px] text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed font-sans border border-slate-100 dark:border-slate-800/80"
                dangerouslySetInnerHTML={{ __html: tmpl.htmlContent.slice(0, 300) }}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 mt-4">
              <span>Updated: {new Date(tmpl.updatedAt).toLocaleDateString()}</span>
              <button
                onClick={() => openEditTemplateModal(tmpl)}
                className="text-[#007FED] font-bold hover:underline"
              >
                Customize &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Edit or Create Template */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-[#22334d] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0c1421]">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingId ? 'Edit Outreach Template' : 'Create Custom Outreach Template'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {statusMessage && (
                <div
                  className={`p-3 rounded-lg font-semibold flex items-center gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-rose-50 text-rose-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Template Title:</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="E.g. High-Conversion Shopify Proposal"
                    className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Category:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-bold text-xs"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Subject Line Pattern:</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Use tags like {{businessName}}, {{projectTitle}}"
                  className="w-full bg-slate-50 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Visual Email Template Body (WYSIWYG):
                </label>
                <RichTextEditor
                  content={formHtml}
                  onChange={(html) => setFormHtml(html)}
                  minHeight="220px"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#007FED] hover:bg-blue-600 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Template'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
