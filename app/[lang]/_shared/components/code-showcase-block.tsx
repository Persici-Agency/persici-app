'use client';

import React, { useMemo, useState } from 'react';
import { TbCode, TbCopy, TbCheck, TbTerminal2 } from 'react-icons/tb';

export interface CodeLanguageMeta {
  id: string;
  label: string;
  badgeColor: string;
  defaultTitleEn: string;
  defaultTitleAr: string;
  placeholder: string;
}

export const CODE_LANGUAGES: CodeLanguageMeta[] = [
  {
    id: 'html',
    label: 'HTML5',
    badgeColor: 'text-orange-300 bg-orange-500/15 border-orange-500/30',
    defaultTitleEn: 'Sample of HTML Code',
    defaultTitleAr: 'نموذج كود HTML',
    placeholder: `<section class="hero-banner">\n  <h1>Enterprise Performance</h1>\n  <p>Sub-second SSR architecture.</p>\n</section>`,
  },
  {
    id: 'php',
    label: 'PHP',
    badgeColor: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
    defaultTitleEn: 'Sample of PHP Code',
    defaultTitleAr: 'نموذج كود PHP',
    placeholder: `<?php\nfunction calculateConversionLift(int $before, int $after): float {\n    if ($before <= 0) return 0.0;\n    return round((($after - $before) / $before) * 100, 2);\n}\necho calculateConversionLift(1200, 4100) . '%';`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    badgeColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    defaultTitleEn: 'Sample of JavaScript Code',
    defaultTitleAr: 'نموذج كود JavaScript',
    placeholder: `export async function trackEvent(name, payload = {}) {\n  const res = await fetch('/api/analytics', {\n    method: 'POST',\n    body: JSON.stringify({ name, ...payload }),\n  });\n  return res.ok;\n}`,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    badgeColor: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
    defaultTitleEn: 'Sample of TypeScript Code',
    defaultTitleAr: 'نموذج كود TypeScript',
    placeholder: `export interface StoryMetrics {\n  conversionRate: number;\n  latencyMs: number;\n}\n\nexport const summarize = (m: StoryMetrics): string => \`\${m.conversionRate}% in \${m.latencyMs}ms\`;`,
  },
  {
    id: 'react',
    label: 'React JSX',
    badgeColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
    defaultTitleEn: 'Sample of React Code',
    defaultTitleAr: 'نموذج كود React',
    placeholder: `export function MetricBadge({ label, value }: { label: string; value: string }) {\n  return (\n    <div className="rounded-xl border p-4 bg-white">\n      <span className="text-2xl font-bold">{value}</span>\n      <p className="text-xs text-slate-500">{label}</p>\n    </div>\n  );\n}`,
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    badgeColor: 'text-slate-200 bg-white/10 border-white/20',
    defaultTitleEn: 'Sample of Next.js Code',
    defaultTitleAr: 'نموذج كود Next.js',
    placeholder: `import { NextResponse } from 'next/server';\n\nexport async function GET() {\n  return NextResponse.json({ status: 'healthy', edgeCached: true });\n}`,
  },
  {
    id: 'css',
    label: 'CSS / Tailwind',
    badgeColor: 'text-blue-300 bg-blue-500/15 border-blue-500/30',
    defaultTitleEn: 'Sample of CSS Code',
    defaultTitleAr: 'نموذج كود CSS',
    placeholder: `.glass-panel {\n  background: rgba(15, 23, 42, 0.85);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 1.5rem;\n}`,
  },
  {
    id: 'python',
    label: 'Python',
    badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    defaultTitleEn: 'Sample of Python Code',
    defaultTitleAr: 'نموذج كود Python',
    placeholder: `def score_lead(events: list[dict]) -> int:\n    # Weight high-intent conversions\n    return sum(item.get("weight", 1) for item in events)`,
  },
  {
    id: 'sql',
    label: 'SQL',
    badgeColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
    defaultTitleEn: 'Sample of SQL Query',
    defaultTitleAr: 'نموذج استعلام SQL',
    placeholder: `SELECT campaign_id, COUNT(*) AS conversions, SUM(revenue) AS total_usd\nFROM attribution_events\nWHERE created_at >= CURRENT_DATE - INTERVAL '30 days'\nGROUP BY campaign_id\nORDER BY total_usd DESC;`,
  },
  {
    id: 'json',
    label: 'JSON',
    badgeColor: 'text-lime-300 bg-lime-500/15 border-lime-500/30',
    defaultTitleEn: 'Sample of JSON Schema',
    defaultTitleAr: 'نموذج بيانات JSON',
    placeholder: `{\n  "service": "persici-edge-gateway",\n  "uptime": "99.99%",\n  "locales": ["en", "ar"]\n}`,
  },
  {
    id: 'bash',
    label: 'Bash / CLI',
    badgeColor: 'text-teal-300 bg-teal-500/15 border-teal-500/30',
    defaultTitleEn: 'Sample of CLI Script',
    defaultTitleAr: 'نموذج أوامر CLI',
    placeholder: `#!/usr/bin/env bash\nnpm run build && npx next start -p 3000`,
  },
];

export function getCodeLanguageMeta(langId?: string): CodeLanguageMeta {
  const normalized = (langId || 'typescript').toLowerCase();
  return CODE_LANGUAGES.find((l) => l.id === normalized) || CODE_LANGUAGES[3];
}

interface Token {
  text: string;
  className?: string;
}

const KEYWORD_SET = new Set([
  'import', 'export', 'from', 'default', 'as', 'async', 'await', 'function',
  'return', 'const', 'let', 'var', 'if', 'else', 'elif', 'switch', 'case',
  'break', 'continue', 'for', 'foreach', 'while', 'do', 'try', 'catch',
  'finally', 'throw', 'new', 'class', 'extends', 'implements', 'interface',
  'type', 'enum', 'public', 'private', 'protected', 'static', 'readonly',
  'namespace', 'use', 'echo', 'print', 'require', 'include', 'fn', 'def',
  'lambda', 'pass', 'with', 'in', 'is', 'not', 'and', 'or', 'typeof', 'keyof',
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'GROUP',
  'BY', 'ORDER', 'LIMIT', 'AS', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'INDEX', 'AND', 'OR', 'DESC', 'ASC', 'COUNT',
  'SUM', 'AVG', 'DISTINCT', 'INTERVAL', 'CURRENT_DATE',
]);

const BUILTIN_SET = new Set([
  'React', 'NextResponse', 'NextRequest', 'Promise', 'Record', 'Array', 'Object',
  'String', 'Number', 'Boolean', 'JSON', 'Math', 'Date', 'Buffer', 'console',
  'fetch', 'window', 'document', 'int', 'float', 'string', 'number', 'boolean',
  'void', 'any', 'unknown', 'list', 'dict', 'true', 'false', 'null', 'undefined',
  'TRUE', 'FALSE', 'NULL', 'self', 'this',
]);

function tokenizeLine(line: string, language: string): Token[] {
  const tokens: Token[] = [];
  const isMarkup = language === 'html' || language === 'react' || language === 'nextjs';
  const isCss = language === 'css';
  const isSql = language === 'sql';
  const isJson = language === 'json';

  // Composite regex matching comments, tags, strings, PHP tags/vars, hex colors, numbers, identifiers
  const pattern =
    /(<!--[\s\S]*?-->|\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|--\s.*$|<\?php|<\?=|\?>|`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|#[0-9a-fA-F]{3,8}\b|\$[A-Za-z_][A-Za-z0-9_]*|<\/?[A-Za-z][A-Za-z0-9.:-]*|\/?>|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_-]*(?=\s*:)|\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()|\b[A-Za-z_][A-Za-z0-9_]*\b)/gm;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), className: 'text-slate-300' });
    }

    const value = match[0];
    let className = 'text-slate-200';

    if (
      value.startsWith('//') ||
      value.startsWith('/*') ||
      value.startsWith('<!--') ||
      (value.startsWith('-- ') && isSql) ||
      (value.startsWith('#') && !/^#[0-9a-fA-F]{3,8}$/.test(value))
    ) {
      className = 'text-slate-500 italic';
    } else if (value === '<?php' || value === '<?=' || value === '?>') {
      className = 'text-rose-400 font-bold';
    } else if (value.startsWith('$')) {
      className = 'text-sky-300';
    } else if (value.startsWith('"') || value.startsWith("'") || value.startsWith('`')) {
      if (isJson && line.slice(pattern.lastIndex).trimStart().startsWith(':')) {
        className = 'text-cyan-300';
      } else {
        className = 'text-amber-300';
      }
    } else if (isMarkup && (value.startsWith('<') || value === '>' || value === '/>')) {
      className = 'text-rose-400';
    } else if (/^#[0-9a-fA-F]{3,8}$/.test(value) || /^\d+(?:\.\d+)?$/.test(value)) {
      className = 'text-orange-300';
    } else if (isCss && line.slice(pattern.lastIndex).trimStart().startsWith(':')) {
      className = 'text-cyan-300';
    } else if (isMarkup && line.slice(pattern.lastIndex).trimStart().startsWith('=')) {
      className = 'text-cyan-300';
    } else if (KEYWORD_SET.has(value) || KEYWORD_SET.has(value.toUpperCase())) {
      className = 'text-purple-400 font-medium';
    } else if (BUILTIN_SET.has(value)) {
      className = 'text-teal-300';
    } else if (line.slice(pattern.lastIndex).trimStart().startsWith('(')) {
      className = 'text-sky-400';
    } else if (/^[A-Z]/.test(value)) {
      className = 'text-emerald-300';
    }

    tokens.push({ text: value, className });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), className: 'text-slate-300' });
  }

  if (tokens.length === 0) {
    tokens.push({ text: ' ' });
  }

  return tokens;
}

export interface CodeShowcaseBlockProps {
  title?: string;
  language?: string;
  code: string;
  className?: string;
  compact?: boolean;
}

export function CodeShowcaseBlock({
  title,
  language = 'typescript',
  code,
  className = '',
  compact = false,
}: CodeShowcaseBlockProps) {
  const [copied, setCopied] = useState(false);
  const meta = getCodeLanguageMeta(language);

  const lines = useMemo(() => {
    const raw = (code || '').replace(/\r\n/g, '\n');
    return raw.split('\n');
  }, [code]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Code Section Heading before the code box */}
      {title && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 text-amber-400 shrink-0">
            <TbCode className="w-3.5 h-3.5" />
          </span>
          <h3 className="font-primary text-base sm:text-lg font-semibold text-slate-900">
            {title}
          </h3>
        </div>
      )}

      {/* IDE Window (Always LTR for authentic code readability in EN & AR) */}
      <div
        dir="ltr"
        className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-lg text-left"
      >
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${meta.badgeColor}`}
            >
              <TbTerminal2 className="w-3 h-3" />
              <span>{meta.label}</span>
            </span>

            <span className="text-[11px] font-mono text-slate-500 truncate hidden sm:inline">
              {lines.length} {lines.length === 1 ? 'line' : 'lines'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono transition-colors cursor-pointer shrink-0"
            title="Copy code snippet"
          >
            {copied ? (
              <>
                <TbCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <TbCopy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Lines Viewport */}
        <div
          className={`overflow-x-auto font-mono ${
            compact ? 'p-3 text-[11px] leading-5' : 'p-4 sm:p-5 text-xs sm:text-[13px] leading-6'
          }`}
        >
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineTokens = tokenizeLine(line, meta.id);
                return (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="select-none pe-4 text-right text-slate-600 align-top w-8 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="whitespace-pre align-top">
                      {lineTokens.map((tok, tIdx) => (
                        <span key={tIdx} className={tok.className}>
                          {tok.text}
                        </span>
                      ))}
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
