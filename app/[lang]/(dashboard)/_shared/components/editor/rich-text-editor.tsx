'use client';

import React, { useState, useRef } from 'react';
import {
  TbBold,
  TbItalic,
  TbUnderline,
  TbH2,
  TbH3,
  TbList,
  TbListNumbers,
  TbQuote,
  TbLink,
  TbEye,
  TbCode,
  TbEraser,
} from 'react-icons/tb';

export interface RichTextEditorProps {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (val: string) => void;
  onChangeAr: (val: string) => void;
  helperText?: string;
  rows?: number;
}

export function RichTextEditor({
  label,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  helperText,
  rows = 6,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentValue = activeTab === 'en' ? valueEn : valueAr;
  const currentSetter = activeTab === 'en' ? onChangeEn : onChangeAr;
  const isRtl = activeTab === 'ar';

  const wrapSelection = (openTag: string, closeTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || 'text';

    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newValue = text.substring(0, start) + replacement + text.substring(end);

    currentSetter(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 0);
  };

  const insertBlock = (tag: string) => {
    wrapSelection(`<${tag}>`, `</${tag}>`);
  };

  const insertList = (type: 'ul' | 'ol') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end).trim();

    const items = selected ? selected.split('\n') : ['First item', 'Second item', 'Third item'];
    const listHtml = `<${type}>\n` + items.map((item) => `  <li>${item.replace(/^[•\-\d.]\s*/, '')}</li>`).join('\n') + `\n</${type}>`;

    const newValue = text.substring(0, start) + listHtml + text.substring(end);
    currentSetter(newValue);
  };

  const insertLink = () => {
    const url = prompt('Enter URL (e.g. https://persiciagency.com/solutions):', 'https://');
    if (!url) return;
    wrapSelection(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
  };

  const clearFormatting = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const stripped = selected.replace(/<[^>]*>?/gm, '');
    const newValue = text.substring(0, start) + stripped + text.substring(end);
    currentSetter(newValue);
  };

  return (
    <div className="space-y-2">
      {/* Label and Language / Mode Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </label>
          {helperText && <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'ar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              العربية (AR)
            </button>
          </div>

          {/* Edit / Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
              previewMode
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {previewMode ? <TbCode className="w-3.5 h-3.5" /> : <TbEye className="w-3.5 h-3.5" />}
            <span>{previewMode ? 'Source Editor' : 'Live Preview'}</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
        {/* Formatting Toolbar */}
        {!previewMode && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/80 border-b border-slate-200 text-slate-700">
            <button
              type="button"
              onClick={() => insertBlock('strong')}
              title="Bold"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbBold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('em')}
              title="Italic"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbItalic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('u')}
              title="Underline"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbUnderline className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => insertBlock('h2')}
              title="Heading 2"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbH2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('h3')}
              title="Heading 3"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbH3 className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => insertList('ul')}
              title="Bulleted List"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertList('ol')}
              title="Numbered List"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbListNumbers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('blockquote')}
              title="Quote"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbQuote className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={insertLink}
              title="Insert Link"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <TbLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={clearFormatting}
              title="Strip Formatting"
              className="p-1.5 hover:bg-slate-200/80 rounded-md transition-colors text-slate-500 hover:text-red-600"
            >
              <TbEraser className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Canvas */}
        {previewMode ? (
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="p-4 min-h-[160px] bg-slate-50/40 text-slate-800 prose prose-sm max-w-none font-normal leading-relaxed [&_ul]:list-disc [&_ul]:ms-5 [&_ol]:list-decimal [&_ol]:ms-5"
            dangerouslySetInnerHTML={{
              __html: currentValue || `<p className="text-slate-400 italic">No content entered for ${activeTab.toUpperCase()}.</p>`,
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            dir={isRtl ? 'rtl' : 'ltr'}
            rows={rows}
            value={currentValue}
            onChange={(e) => currentSetter(e.target.value)}
            placeholder={
              isRtl
                ? 'اكتب المحتوى هنا... يمكنك استخدام أشرطة الأدوات أعلاه لتنسيق النصوص والقوائم والعناوين.'
                : 'Write content here... Use the toolbar above to style headings, bold text, bullet points, and links.'
            }
            className="w-full p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-mono resize-y leading-relaxed bg-white"
          />
        )}
      </div>
    </div>
  );
}
