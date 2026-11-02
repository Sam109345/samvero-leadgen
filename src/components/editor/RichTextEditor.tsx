'use client';

import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import DOMPurify from 'dompurify';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Link as LinkIcon,
  Unlink,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Palette,
} from 'lucide-react';

export function sanitizeHtmlContent(dirtyHtml: string): string {
  if (!dirtyHtml) return '';
  if (typeof window === 'undefined') {
    return dirtyHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'p', 'b', 'strong', 'i', 'em', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'br', 'hr',
      'a', 'span', 'div', 'blockquote', 'code', 'pre',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'title'],
  });
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string, plainText: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write or generate your pitch...',
  minHeight = '240px',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#007FED] underline hover:opacity-80 font-medium',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: sanitizeHtmlContent(content),
    editorProps: {
      attributes: {
        class: `focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 p-4 leading-relaxed prose prose-sm dark:prose-invert max-w-none`,
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const cleanHtml = sanitizeHtmlContent(html);
      onChange(cleanHtml, text);
    },
  });

  // Keep editor content in sync when external content prop changes (e.g. AI generation, template loading, or switching leads)
  useEffect(() => {
    if (editor && !editor.isFocused && content !== editor.getHTML()) {
      editor.commands.setContent(sanitizeHtmlContent(content), { emitUpdate: false });
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter Hyperlink URL:', previousUrl || 'https://');

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-xs text-slate-400">
        Loading Rich Text Visual Editor...
      </div>
    );
  }

  const btnClass = (active: boolean) =>
    `p-1.5 rounded-md text-xs font-semibold transition flex items-center justify-center ${
      active
        ? 'bg-[#007FED] text-white shadow-xs'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
    }`;

  return (
    <div className={`border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0c1524] transition-colors shadow-xs ${className}`}>
      {/* Visual WYSIWYG Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-[#101b2e] border-b border-slate-200 dark:border-slate-800 select-none">
        
        {/* Bold, Italic, Underline */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={btnClass(editor.isActive('bold'))}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={btnClass(editor.isActive('italic'))}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={btnClass(editor.isActive('underline'))}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Headings & Paragraph */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={btnClass(editor.isActive('heading', { level: 1 }))}
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={btnClass(editor.isActive('heading', { level: 2 }))}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={btnClass(editor.isActive('heading', { level: 3 }))}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={btnClass(editor.isActive('paragraph'))}
            title="Normal Paragraph"
          >
            <Pilcrow className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists: Bullets & Numbered */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={btnClass(editor.isActive('bulletList'))}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={btnClass(editor.isActive('orderedList'))}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={btnClass(editor.isActive({ textAlign: 'left' }))}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={btnClass(editor.isActive({ textAlign: 'center' }))}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={btnClass(editor.isActive({ textAlign: 'right' }))}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hyperlink Controls */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={setLink}
            className={btnClass(editor.isActive('link'))}
            title="Add Hyperlink"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1.5 rounded-md text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Remove Hyperlink"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clear Formatting, Undo, Redo */}
        <div className="flex items-center gap-0.5 pl-1.5 ml-auto">
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WYSIWYG Content Area */}
      <div className="cursor-text bg-white dark:bg-[#0c1524]">
        <EditorContent editor={editor} />
      </div>

      {/* Editor Status Footbar */}
      <div className="px-4 py-1.5 bg-slate-50/80 dark:bg-[#09101c] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span className="font-mono">TipTap WYSIWYG Editor &bull; HTML Formatted & Sanitized</span>
        <span>
          {editor.storage.characterCount?.words?.() || editor.getText().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}
