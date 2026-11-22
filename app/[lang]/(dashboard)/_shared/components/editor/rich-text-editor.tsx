'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TbBold,
  TbItalic,
  TbUnderline,
  TbH2,
  TbH3,
  TbPilcrow,
  TbList,
  TbListNumbers,
  TbQuote,
  TbLink,
  TbUnlink,
  TbCode,
  TbTypography,
  TbEraser,
  TbAlignLeft,
  TbAlignCenter,
  TbAlignRight,
  TbAlignJustified,
  TbArrowBackUp,
  TbArrowForwardUp,
  TbCheck,
  TbX,
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

interface ActiveFormatsState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  h2: boolean;
  h3: boolean;
  ul: boolean;
  ol: boolean;
  blockquote: boolean;
  link: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  alignJustify: boolean;
}

const INITIAL_ACTIVE_FORMATS: ActiveFormatsState = {
  bold: false,
  italic: false,
  underline: false,
  h2: false,
  h3: false,
  ul: false,
  ol: false,
  blockquote: false,
  link: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
};

function decodeEscapedFormattingTags(input: string): string {
  if (!input || !input.includes('&lt;')) return input;
  return input.replace(
    /&lt;(\/?(?:b|strong|i|em|u|p|br|ul|ol|li|h2|h3|blockquote|div|span)(?:\s+[^&]*?)?)&gt;/gi,
    '<$1>'
  );
}

function toVisualHtml(raw: string): string {
  if (!raw || !raw.trim()) return '';
  const normalized = decodeEscapedFormattingTags(raw);
  // If string has no HTML tags at all, convert plain newlines into <br> for visual display
  if (!/<[a-z][\s\S]*>/i.test(normalized)) {
    return normalized.replace(/\r?\n/g, '<br>');
  }
  return normalized;
}

function cleanVisualHtml(html: string): string {
  if (!html) return '';
  const trimmed = decodeEscapedFormattingTags(html).trim();
  if (
    !trimmed ||
    trimmed === '<br>' ||
    trimmed === '<br/>' ||
    trimmed === '<div><br></div>' ||
    trimmed === '<p><br></p>'
  ) {
    return '';
  }
  return trimmed;
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
  // WordPress-style two toggle buttons: 'normal' (default visual live preview WYSIWYG) and 'code' (HTML source)
  const [editorMode, setEditorMode] = useState<'normal' | 'code'>('normal');
  const [activeFormats, setActiveFormats] = useState<ActiveFormatsState>(INITIAL_ACTIVE_FORMATS);

  // Inline Link Popover State
  const [showLinkBar, setShowLinkBar] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const visualRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastEmittedHtmlRef = useRef<string>('');
  const prevModeRef = useRef<'normal' | 'code'>('normal');
  const prevTabRef = useRef<'en' | 'ar'>('en');
  const savedRangeRef = useRef<Range | null>(null);

  const currentValue = activeTab === 'en' ? valueEn || '' : valueAr || '';
  const currentSetter = activeTab === 'en' ? onChangeEn : onChangeAr;
  const isRtl = activeTab === 'ar';
  const minHeightPx = Math.max(130, rows * 24);

  // Sync external value changes, tab switches ('en' <-> 'ar'), or mode switches ('code' -> 'normal') into the visual DOM
  useEffect(() => {
    if (editorMode !== 'normal') {
      prevModeRef.current = editorMode;
      prevTabRef.current = activeTab;
      return;
    }
    const el = visualRef.current;
    if (!el) return;

    const targetHtml = toVisualHtml(currentValue);
    const modeJustSwitched = prevModeRef.current !== 'normal';
    const tabJustSwitched = prevTabRef.current !== activeTab;
    const isDomOutOfSync =
      (typeof document !== 'undefined' &&
        document.activeElement !== el &&
        cleanVisualHtml(el.innerHTML) !== cleanVisualHtml(targetHtml)) ||
      (el.innerHTML === '' && targetHtml !== '');

    if (
      modeJustSwitched ||
      tabJustSwitched ||
      currentValue !== lastEmittedHtmlRef.current ||
      isDomOutOfSync
    ) {
      el.innerHTML = targetHtml;
      lastEmittedHtmlRef.current = currentValue;
    }

    prevModeRef.current = 'normal';
    prevTabRef.current = activeTab;
  }, [currentValue, activeTab, editorMode]);

  // Detect active formatting at current cursor/selection inside Visual ('normal') mode
  const refreshActiveFormats = useCallback(() => {
    if (editorMode !== 'normal' || typeof document === 'undefined') return;
    const el = visualRef.current;
    const sel = window.getSelection();
    if (!el || !sel || sel.rangeCount === 0) return;

    const anchorNode = sel.anchorNode;
    if (!anchorNode || !el.contains(anchorNode)) {
      setActiveFormats(INITIAL_ACTIVE_FORMATS);
      return;
    }

    let h2 = false;
    let h3 = false;
    let ul = false;
    let ol = false;
    let blockquote = false;
    let link = false;
    let alignLeft = false;
    let alignCenter = false;
    let alignRight = false;
    let alignJustify = false;

    let node: Node | null = anchorNode;
    while (node && node !== el) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;
        const tag = elem.tagName.toUpperCase();
        if (tag === 'H2') h2 = true;
        if (tag === 'H3') h3 = true;
        if (tag === 'UL') ul = true;
        if (tag === 'OL') ol = true;
        if (tag === 'BLOCKQUOTE') blockquote = true;
        if (tag === 'A') link = true;

        const textAlign = elem.style?.textAlign || elem.getAttribute('align') || '';
        if (textAlign === 'left') alignLeft = true;
        if (textAlign === 'center') alignCenter = true;
        if (textAlign === 'right') alignRight = true;
        if (textAlign === 'justify') alignJustify = true;
      }
      node = node.parentNode;
    }

    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        h2,
        h3,
        ul: ul || document.queryCommandState('insertUnorderedList'),
        ol: ol || document.queryCommandState('insertOrderedList'),
        blockquote,
        link,
        alignLeft: alignLeft || document.queryCommandState('justifyLeft'),
        alignCenter: alignCenter || document.queryCommandState('justifyCenter'),
        alignRight: alignRight || document.queryCommandState('justifyRight'),
        alignJustify: alignJustify || document.queryCommandState('justifyFull'),
      });
    } catch {
      // Ignore queryCommandState errors in unsupported contexts
    }
  }, [editorMode]);

  const emitVisualChange = useCallback(() => {
    const el = visualRef.current;
    if (!el) return;
    const cleaned = cleanVisualHtml(el.innerHTML);
    lastEmittedHtmlRef.current = cleaned;
    currentSetter(cleaned);
    refreshActiveFormats();
  }, [currentSetter, refreshActiveFormats]);

  const ensureVisualFocus = () => {
    const el = visualRef.current;
    if (!el) return;
    if (document.activeElement !== el) {
      el.focus();
      // Place caret at end if no selection inside el
      const sel = window.getSelection();
      if (sel && (!sel.anchorNode || !el.contains(sel.anchorNode))) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  // =========================================================================
  // CODE MODE HELPERS (Smart Toggle Wrap / Unwrap for HTML Source View)
  // =========================================================================
  const toggleCodeTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;

    // Case 1: Selected text itself starts with <tag> and ends with </tag> -> unwrap it!
    const wrappedRegex = new RegExp(`^<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>$`, 'i');
    if (selectedText && wrappedRegex.test(selectedText.trim())) {
      const unwrapped = selectedText.trim().replace(wrappedRegex, '$1');
      const nextVal = text.substring(0, start) + unwrapped + text.substring(end);
      currentSetter(nextVal);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + unwrapped.length);
      }, 0);
      return;
    }

    // Case 2: Immediately surrounded by <tag> and </tag> outside the selection -> unwrap it!
    const before = text.substring(Math.max(0, start - openTag.length), start);
    const after = text.substring(end, Math.min(text.length, end + closeTag.length));
    if (before.toLowerCase() === openTag.toLowerCase() && after.toLowerCase() === closeTag.toLowerCase()) {
      const nextVal =
        text.substring(0, start - openTag.length) +
        selectedText +
        text.substring(end + closeTag.length);
      currentSetter(nextVal);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start - openTag.length,
          start - openTag.length + selectedText.length
        );
      }, 0);
      return;
    }

    // Otherwise wrap with <tag>...</tag>
    const contentToWrap = selectedText || 'text';
    const replacement = `${openTag}${contentToWrap}${closeTag}`;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    currentSetter(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + contentToWrap.length
      );
    }, 0);
  };

  const toggleCodeList = (type: 'ul' | 'ol') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end).trim();

    // If selection is already a list, unwrap it back to plain lines!
    const listRegex = new RegExp(`^<${type}\\b[^>]*>([\\s\\S]*?)<\\/${type}>$`, 'i');
    if (selected && listRegex.test(selected)) {
      const inner = selected.replace(listRegex, '$1');
      const lines = inner
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .join('\n');
      currentSetter(text.substring(0, start) + lines + text.substring(end));
      return;
    }

    const items = selected
      ? selected.split('\n').map((s) => s.trim()).filter(Boolean)
      : ['First item', 'Second item', 'Third item'];
    const listHtml =
      `<${type}>\n` +
      items.map((item) => `  <li>${item.replace(/^[•\-\d.]+\s*/, '')}</li>`).join('\n') +
      `\n</${type}>`;

    currentSetter(text.substring(0, start) + listHtml + text.substring(end));
  };

  // =========================================================================
  // UNIFIED TOOLBAR COMMAND HANDLERS (Visual 'normal' mode + 'code' mode)
  // =========================================================================
  const handleInlineCommand = (command: 'bold' | 'italic' | 'underline') => {
    if (editorMode === 'code') {
      const tagMap = { bold: 'strong', italic: 'em', underline: 'u' } as const;
      toggleCodeTag(tagMap[command]);
      return;
    }
    ensureVisualFocus();
    document.execCommand(command, false);
    emitVisualChange();
  };

  const handleBlockCommand = (tag: 'h2' | 'h3' | 'blockquote' | 'p') => {
    if (editorMode === 'code') {
      toggleCodeTag(tag);
      return;
    }
    ensureVisualFocus();

    // Toggle back to <p> if already active
    const isAlreadyActive =
      (tag === 'h2' && activeFormats.h2) ||
      (tag === 'h3' && activeFormats.h3) ||
      (tag === 'blockquote' && activeFormats.blockquote);

    const targetTag = isAlreadyActive ? 'p' : tag;
    document.execCommand('formatBlock', false, targetTag);
    emitVisualChange();
  };

  const handleListCommand = (type: 'ul' | 'ol') => {
    if (editorMode === 'code') {
      toggleCodeList(type);
      return;
    }
    ensureVisualFocus();
    const cmd = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(cmd, false);
    emitVisualChange();
  };

  const handleAlignmentCommand = (align: 'left' | 'center' | 'right' | 'justify') => {
    if (editorMode === 'code') {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selected = text.substring(start, end);
      if (selected) {
        const cleaned = selected.replace(
          /^<div style="text-align:\s*(?:left|center|right|justify);?">([\s\S]*)<\/div>$/i,
          '$1'
        );
        const replacement = `<div style="text-align: ${align}">${cleaned}</div>`;
        currentSetter(text.substring(0, start) + replacement + text.substring(end));
      } else {
        const trimmed = text.trim();
        if (!trimmed) return;
        const cleaned = trimmed.replace(
          /^<div style="text-align:\s*(?:left|center|right|justify);?">([\s\S]*)<\/div>$/i,
          '$1'
        );
        currentSetter(`<div style="text-align: ${align}">${cleaned}</div>`);
      }
      return;
    }

    ensureVisualFocus();
    const cmdMap = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    } as const;
    document.execCommand(cmdMap[align], false);
    emitVisualChange();
  };

  const handleOpenLinkBar = () => {
    if (editorMode === 'normal') {
      const el = visualRef.current;
      const sel = window.getSelection();
      if (el && sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
        setLinkText(sel.toString());

        // Check if cursor is already inside an <a> element
        let node: Node | null = sel.anchorNode;
        while (node && node !== el) {
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
            const anchor = node as HTMLAnchorElement;
            setLinkUrl(anchor.getAttribute('href') || 'https://');
            setLinkText(anchor.textContent || '');
            break;
          }
          node = node.parentNode;
        }
      } else {
        savedRangeRef.current = null;
        setLinkText('');
      }
    } else if (textareaRef.current) {
      const ta = textareaRef.current;
      setLinkText(ta.value.substring(ta.selectionStart, ta.selectionEnd));
    }
    setShowLinkBar((prev) => !prev);
  };

  const handleApplyLink = () => {
    const trimmedUrl = linkUrl.trim();
    if (!trimmedUrl) return;

    if (editorMode === 'code') {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selected = text.substring(start, end) || linkText.trim() || trimmedUrl;
      const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      const anchorHtml = `<a href="${trimmedUrl}"${targetAttr}>${selected}</a>`;
      currentSetter(text.substring(0, start) + anchorHtml + text.substring(end));
      setShowLinkBar(false);
      return;
    }

    const el = visualRef.current;
    if (!el) return;
    el.focus();

    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }

    const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const displayLabel =
      (sel && sel.toString().trim()) || linkText.trim() || trimmedUrl;

    document.execCommand(
      'insertHTML',
      false,
      `<a href="${trimmedUrl}"${targetAttr}>${displayLabel}</a>`
    );
    savedRangeRef.current = null;
    setShowLinkBar(false);
    setLinkUrl('https://');
    setLinkText('');
    emitVisualChange();
  };

  const handleUnlink = () => {
    if (editorMode === 'code') {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      if (start !== end) {
        const selected = text.substring(start, end).replace(/<\/?a\b[^>]*>/gi, '');
        currentSetter(text.substring(0, start) + selected + text.substring(end));
      } else {
        currentSetter(text.replace(/<\/?a\b[^>]*>/gi, ''));
      }
      setShowLinkBar(false);
      return;
    }

    ensureVisualFocus();
    const sel = window.getSelection();
    // If cursor is inside an <a> without a range selection, select the whole <a> first so unlink removes it
    if (sel && sel.isCollapsed && visualRef.current) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== visualRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
          const range = document.createRange();
          range.selectNode(node);
          sel.removeAllRanges();
          sel.addRange(range);
          break;
        }
        node = node.parentNode;
      }
    }
    document.execCommand('unlink', false);
    setShowLinkBar(false);
    emitVisualChange();
  };

  const handleClearFormatting = () => {
    if (editorMode === 'code') {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      if (start !== end) {
        const stripped = text.substring(start, end).replace(/<[^>]*>?/gm, '');
        currentSetter(text.substring(0, start) + stripped + text.substring(end));
      } else {
        currentSetter(text.replace(/<[^>]*>?/gm, ''));
      }
      return;
    }

    ensureVisualFocus();
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      document.execCommand('removeFormat', false);
      document.execCommand('unlink', false);
      document.execCommand('formatBlock', false, 'p');
      emitVisualChange();
    } else if (visualRef.current) {
      const plain = visualRef.current.innerText || '';
      visualRef.current.innerText = plain;
      emitVisualChange();
    }
  };

  const handleUndoRedo = (action: 'undo' | 'redo') => {
    if (editorMode === 'normal') {
      ensureVisualFocus();
      document.execCommand(action, false);
      emitVisualChange();
    }
  };

  const getToolbarBtnClass = (isActive = false) =>
    `p-1.5 rounded-lg transition-all cursor-pointer ${
      isActive
        ? 'bg-slate-900 text-white shadow-2xs'
        : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
    }`;

  return (
    <div className="space-y-2">
      {/* Header Row: Label + Language Tabs + [Normal | Code] Toggle Buttons + Live Preview */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </label>
          {helperText && <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector Tabs (EN / AR) */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'ar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              العربية (AR)
            </button>
          </div>

          {/* Two WordPress-Style Mode Toggle Buttons ("Normal" and "Code") */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setEditorMode('normal');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                editorMode === 'normal'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Visual Live Preview Editor (WordPress Normal Mode - Format visually without HTML tags)"
            >
              <TbTypography className="w-3.5 h-3.5" />
              <span>Normal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (editorMode === 'normal' && visualRef.current) {
                  const synced = cleanVisualHtml(visualRef.current.innerHTML);
                  lastEmittedHtmlRef.current = synced;
                  currentSetter(synced);
                }
                setEditorMode('code');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                editorMode === 'code'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="HTML Code Editor (View and edit raw HTML tags)"
            >
              <TbCode className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
        {/* Formatting Toolbar (Shown in both Normal and Code modes) */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50/90 border-b border-slate-200 text-slate-700">
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInlineCommand('bold')}
                title="Bold (Toggle On/Off)"
                className={getToolbarBtnClass(activeFormats.bold)}
              >
                <TbBold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInlineCommand('italic')}
                title="Italic (Toggle On/Off)"
                className={getToolbarBtnClass(activeFormats.italic)}
              >
                <TbItalic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInlineCommand('underline')}
                title="Underline (Toggle On/Off)"
                className={getToolbarBtnClass(activeFormats.underline)}
              >
                <TbUnderline className="w-4 h-4" />
              </button>

              <span className="w-px h-4 bg-slate-300 mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleBlockCommand('p')}
                title="Normal Paragraph"
                className={getToolbarBtnClass(
                  !activeFormats.h2 && !activeFormats.h3 && !activeFormats.blockquote && false
                )}
              >
                <TbPilcrow className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleBlockCommand('h2')}
                title="Heading 2 (Click again to return to normal text)"
                className={getToolbarBtnClass(activeFormats.h2)}
              >
                <TbH2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleBlockCommand('h3')}
                title="Heading 3 (Click again to return to normal text)"
                className={getToolbarBtnClass(activeFormats.h3)}
              >
                <TbH3 className="w-4 h-4" />
              </button>

              <span className="w-px h-4 bg-slate-300 mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleListCommand('ul')}
                title="Bulleted List (Click again to remove list)"
                className={getToolbarBtnClass(activeFormats.ul)}
              >
                <TbList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleListCommand('ol')}
                title="Numbered List (Click again to remove list)"
                className={getToolbarBtnClass(activeFormats.ol)}
              >
                <TbListNumbers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleBlockCommand('blockquote')}
                title="Quote Block (Click again to remove quote)"
                className={getToolbarBtnClass(activeFormats.blockquote)}
              >
                <TbQuote className="w-4 h-4" />
              </button>

              <span className="w-px h-4 bg-slate-300 mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleAlignmentCommand('left')}
                title="Align Left"
                className={getToolbarBtnClass(activeFormats.alignLeft)}
              >
                <TbAlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleAlignmentCommand('center')}
                title="Align Center"
                className={getToolbarBtnClass(activeFormats.alignCenter)}
              >
                <TbAlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleAlignmentCommand('right')}
                title="Align Right"
                className={getToolbarBtnClass(activeFormats.alignRight)}
              >
                <TbAlignRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleAlignmentCommand('justify')}
                title="Justify Text"
                className={getToolbarBtnClass(activeFormats.alignJustify)}
              >
                <TbAlignJustified className="w-4 h-4" />
              </button>

              <span className="w-px h-4 bg-slate-300 mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleOpenLinkBar}
                title="Insert or Edit Link"
                className={getToolbarBtnClass(activeFormats.link || showLinkBar)}
              >
                <TbLink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleUnlink}
                title="Remove Link (Unlink)"
                className="p-1.5 hover:bg-slate-200/80 rounded-lg transition-colors text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <TbUnlink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClearFormatting}
                title="Clear Formatting"
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-500 hover:text-red-600 cursor-pointer"
              >
                <TbEraser className="w-4 h-4" />
              </button>
            </div>

            {editorMode === 'normal' && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleUndoRedo('undo')}
                  title="Undo"
                  className="p-1.5 hover:bg-slate-200/80 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <TbArrowBackUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleUndoRedo('redo')}
                  title="Redo"
                  className="p-1.5 hover:bg-slate-200/80 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <TbArrowForwardUp className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        {/* WordPress-Style Inline Link Input Popover Bar */}
        {showLinkBar && (
          <div className="p-2.5 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center gap-2 animate-in fade-in">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://persiciagency.com/solutions"
              className="flex-1 min-w-[200px] px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-persici-crimson"
            />
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text (optional)"
              className="w-44 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-persici-crimson"
            />
            <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 cursor-pointer select-none px-1">
              <input
                type="checkbox"
                checked={linkNewTab}
                onChange={(e) => setLinkNewTab(e.target.checked)}
                className="rounded accent-persici-crimson"
              />
              <span>New tab</span>
            </label>
            <button
              type="button"
              onClick={handleApplyLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-persici-crimson hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <TbCheck className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLinkBar(false)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer"
              title="Close link bar"
            >
              <TbX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Canvas: 1) Normal (Visual Live Preview WYSIWYG) or 2) Code (Raw HTML) */}
        {editorMode === 'normal' ? (
          <div className="relative bg-white">
            {!currentValue && (
              <div
                dir={isRtl ? 'rtl' : 'ltr'}
                className="pointer-events-none absolute top-4 inset-x-4 text-sm text-slate-400 select-none"
              >
                {isRtl
                  ? 'اكتب المحتوى هنا مباشرة... استخدم شريط الأدوات أعلاه لتنسيق العناوين أو القوائم أو الخط العريض بدون الحاجة لكتابة أي كود.'
                  : 'Write and format visually here... Select text and click Bold, H2/H3, Lists, Alignment, or Link above.'}
              </div>
            )}
            <div
              ref={visualRef}
              contentEditable
              suppressContentEditableWarning
              dir={isRtl ? 'rtl' : 'ltr'}
              style={{ minHeight: `${minHeightPx}px` }}
              onInput={emitVisualChange}
              onBlur={emitVisualChange}
              onKeyUp={refreshActiveFormats}
              onMouseUp={refreshActiveFormats}
              onFocus={refreshActiveFormats}
              className="w-full p-4 text-sm text-slate-800 focus:outline-none leading-relaxed bg-white overflow-y-auto [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-2.5 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:my-2 [&_li]:my-0.5 [&_blockquote]:border-s-4 [&_blockquote]:border-persici-crimson [&_blockquote]:bg-slate-50 [&_blockquote]:ps-4 [&_blockquote]:py-2 [&_blockquote]:my-2 [&_blockquote]:italic [&_a]:text-persici-crimson [&_a]:underline [&_a]:font-medium"
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            dir={isRtl ? 'rtl' : 'ltr'}
            rows={rows}
            value={currentValue}
            onChange={(e) => {
              currentSetter(e.target.value);
            }}
            placeholder={
              isRtl
                ? 'محرر كود HTML المباشر...'
                : 'HTML Code Editor (<p>, <strong>, <ul>, <h2>, etc.)...'
            }
            className="w-full p-4 text-xs text-emerald-300 bg-slate-950 placeholder-slate-500 focus:outline-none font-mono resize-y leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}
