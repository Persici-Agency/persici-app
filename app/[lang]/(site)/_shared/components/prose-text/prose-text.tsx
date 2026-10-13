import React from 'react';

export interface ProseTextProps {
  content?: string;
  fallback?: string;
  className?: string;
}

/**
 * Safely renders rich text HTML formatted via the dashboard WYSIWYG editor
 * applying clean responsive typography styles across desktop, tablet, and mobile.
 */
export function ProseText({ content, fallback = '', className = '' }: ProseTextProps) {
  const rawHtml = content || fallback;

  if (!rawHtml) return null;

  // If the content is purely plain text (no tags), render standard paragraph
  if (!rawHtml.includes('<') && !rawHtml.includes('>')) {
    return <p className={className}>{rawHtml}</p>;
  }

  return (
    <div
      className={`prose prose-sm sm:prose-base max-w-none text-foreground/80 leading-relaxed font-normal [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ms-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ms-5 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_blockquote]:border-s-4 [&_blockquote]:border-primary/40 [&_blockquote]:ps-4 [&_blockquote]:italic ${className}`}
      dangerouslySetInnerHTML={{ __html: rawHtml }}
    />
  );
}
