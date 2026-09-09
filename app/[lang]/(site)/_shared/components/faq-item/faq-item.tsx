'use client';

import React, { useState } from 'react';

export interface FaqItemProps {
  /**
   * Question text (string or localized bilingual object)
   */
  question: string | { en?: string; ar?: string };

  /**
   * Answer text (string or localized bilingual object)
   */
  answer: string | { en?: string; ar?: string };

  /**
   * Controlled open state. When provided, the component relies on this prop
   * and delegates toggling to `onToggle`.
   */
  isOpen?: boolean;

  /**
   * Initial open state when used in uncontrolled mode (defaults to false).
   */
  defaultOpen?: boolean;

  /**
   * Toggle callback invoked when the question header is clicked.
   */
  onToggle?: () => void;

  /**
   * Language code (e.g. 'en', 'ar') for bilingual resolution and RTL alignment.
   */
  lang?: string;

  /**
   * Optional index or identifier for aria controls and IDs.
   */
  index?: number | string;

  /**
   * Optional custom HTML id attribute.
   */
  id?: string;

  /**
   * Custom CSS classes for the container.
   */
  className?: string;
}

/**
 * FaqItem (Question & Answer Component)
 * Standalone accordion item displaying a question button with animated plus/cross icon
 * and a smooth expanding answer drawer. Supports both controlled mode (within an accordion list)
 * and uncontrolled mode (as a single standalone FAQ card).
 */
export function FaqItem({
  question,
  answer,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onToggle,
  lang = 'en',
  index = 0,
  id,
  className = '',
}: FaqItemProps) {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(defaultOpen);

  // Controlled vs uncontrolled determination
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
    if (!isControlled) {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const resolveText = (val: string | { en?: string; ar?: string }): string => {
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
      return (lang === 'ar' ? val.ar : val.en) || val.en || val.ar || '';
    }
    return '';
  };

  const resolvedQuestion = resolveText(question);
  const resolvedAnswer = resolveText(answer);

  const uid = id || `faq-item-${index}`;
  const btnId = `${uid}-btn`;
  const contentId = `${uid}-content`;

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border-0 bg-persici-black-20 shadow-none overflow-hidden transition-all duration-300 ${className}`}
    >
      <button
        type="button"
        id={btnId}
        onClick={handleToggle}
        className="flex w-full items-center justify-between p-5 sm:p-6 text-left rtl:text-right cursor-pointer gap-4 transition-colors hover:bg-black/[0.02]"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="font-primary text-md font-semibold text-slate-900">
          {resolvedQuestion}
        </span>
        <span
          className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-2xs font-bold text-sm sm:text-base transition-transform duration-300 ${
            isOpen ? 'rotate-45 text-persici-crimson' : 'text-slate-700'
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={btnId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base leading-relaxed text-slate-600 border-t border-black/5 pt-4">
            {resolvedAnswer}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable aliases
export const FaqAccordionItem = FaqItem;
export type FaqAccordionItemProps = FaqItemProps;
export const QuestionAnswerItem = FaqItem;
export type QuestionAnswerItemProps = FaqItemProps;
