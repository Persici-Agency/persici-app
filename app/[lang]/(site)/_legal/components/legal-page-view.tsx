'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { LegalDocumentData, LegalClause, Jurisdiction } from '../types';
import type { Dictionary } from '@dictionaries';

interface LegalPageViewProps {
  data: LegalDocumentData;
  lang: string;
  dict: Dictionary;
}

export function LegalPageView({ data, lang, dict }: LegalPageViewProps) {
  const isAr = lang === 'ar';
  const [activeClauseId, setActiveClauseId] = useState<string>(data.clauses[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | 'all'>('all');

  // Multi-lingual text normalizer (handles Arabic diacritics, Alef/Taa/Yaa variations, and case)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '')
      .trim();
  };

  // Check whether a clause matches the selected jurisdiction filter
  const matchesJurisdiction = (clause: LegalClause, jur: Jurisdiction | 'all'): boolean => {
    if (jur === 'all') return true;

    // 1. Direct clause jurisdiction
    if (clause.jurisdiction) {
      if (clause.jurisdiction === jur) return true;
      if (jur === 'global' && clause.jurisdiction === 'global') return true;
    }

    // 2. Subsections jurisdiction
    if (clause.subsections?.some((sub) => sub.jurisdiction === jur)) {
      return true;
    }

    // 3. Highlight box jurisdiction
    if (clause.highlightBox?.jurisdiction === jur) {
      return true;
    }

    // 4. In-depth keyword & regional content association
    const combined = normalizeText(
      [
        clause.title.en,
        clause.title.ar,
        ...clause.content.en,
        ...clause.content.ar,
        ...(clause.subsections?.flatMap((s) => [
          s.subtitle.en,
          s.subtitle.ar,
          ...s.points.en,
          ...s.points.ar,
        ]) || []),
        clause.highlightBox?.title.en || '',
        clause.highlightBox?.title.ar || '',
        clause.highlightBox?.body.en || '',
        clause.highlightBox?.body.ar || '',
      ].join(' ')
    );

    if (jur === 'uae') {
      return (
        combined.includes('uae') ||
        combined.includes('dubai') ||
        combined.includes('امارات') ||
        combined.includes('دبي') ||
        combined.includes('difc') ||
        combined.includes('fta') ||
        combined.includes('45 of 2021') ||
        combined.includes('45 لسنه 2021') ||
        combined.includes('adgm')
      );
    }

    if (jur === 'ksa') {
      return (
        combined.includes('ksa') ||
        combined.includes('saudi') ||
        combined.includes('riyadh') ||
        combined.includes('سعودي') ||
        combined.includes('رياض') ||
        combined.includes('sdaia') ||
        combined.includes('سدايا') ||
        combined.includes('zatca') ||
        combined.includes('fatoora') ||
        combined.includes('م/19') ||
        combined.includes('m/19') ||
        combined.includes('scca')
      );
    }

    if (jur === 'jordan') {
      return (
        combined.includes('jordan') ||
        combined.includes('amman') ||
        combined.includes('اردن') ||
        combined.includes('عمان') ||
        combined.includes('24 of 2023') ||
        combined.includes('24 لسنه 2023') ||
        combined.includes('istd') ||
        combined.includes('khbp')
      );
    }

    if (jur === 'global') {
      return (
        combined.includes('global') ||
        combined.includes('gdpr') ||
        combined.includes('ccpa') ||
        combined.includes('international') ||
        combined.includes('دولي') ||
        combined.includes('2016/679') ||
        clause.jurisdiction === 'global'
      );
    }

    return false;
  };

  // Full-text multi-field search across titles, paragraphs, subsections, and highlights
  const matchesSearch = (clause: LegalClause, query: string): boolean => {
    if (!query.trim()) return true;
    const q = normalizeText(query);

    // Title (EN & AR)
    if (normalizeText(clause.title.en).includes(q) || normalizeText(clause.title.ar).includes(q)) {
      return true;
    }

    // Main paragraph content (EN & AR)
    for (const p of [...clause.content.en, ...clause.content.ar]) {
      if (normalizeText(p).includes(q)) return true;
    }

    // Subsections (subtitles and all bullet points)
    if (clause.subsections) {
      for (const sub of clause.subsections) {
        if (
          normalizeText(sub.subtitle.en).includes(q) ||
          normalizeText(sub.subtitle.ar).includes(q)
        ) {
          return true;
        }
        for (const pt of [...sub.points.en, ...sub.points.ar]) {
          if (normalizeText(pt).includes(q)) return true;
        }
      }
    }

    // Highlight boxes
    if (clause.highlightBox) {
      if (
        normalizeText(clause.highlightBox.title.en).includes(q) ||
        normalizeText(clause.highlightBox.title.ar).includes(q) ||
        normalizeText(clause.highlightBox.body.en).includes(q) ||
        normalizeText(clause.highlightBox.body.ar).includes(q)
      ) {
        return true;
      }
    }

    return false;
  };

  // Filter clauses by combining jurisdiction & search criteria
  const filteredClauses = useMemo(() => {
    return data.clauses.filter((clause) => {
      return matchesJurisdiction(clause, selectedJurisdiction) && matchesSearch(clause, searchQuery);
    });
  }, [data.clauses, selectedJurisdiction, searchQuery]);

  // Scrollspy to highlight active section in TOC based on currently visible clauses
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const clause of filteredClauses) {
        const el = document.getElementById(clause.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveClauseId(clause.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredClauses]);

  const jurisdictions = [
    { key: 'all', label: isAr ? 'جميع النطاقات' : 'All Jurisdictions' },
    { key: 'global', label: isAr ? 'دولي (GDPR/CCPA)' : 'Global (GDPR/CCPA)' },
    { key: 'uae', label: isAr ? 'الإمارات (دبي)' : 'UAE (Dubai)' },
    { key: 'ksa', label: isAr ? 'السعودية (الرياض)' : 'KSA (Riyadh)' },
    { key: 'jordan', label: isAr ? 'الأردن (عمّان)' : 'Jordan (Amman)' },
  ];

  return (
    <div data-header-luminance="light" className="min-h-screen bg-slate-50/50 pb-24 pt-28 sm:pt-32 lg:pt-36">
      {/* Ambient Top Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-persici-crimson/5 via-persici-blush/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href={`/${lang}`} className="hover:text-persici-crimson transition-colors">
            {dict.nav.home}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isAr ? data.title.ar : data.title.en}
          </span>
        </nav>

        {/* Hero Header Section */}
        <div data-header-luminance="light" className="mb-12 rounded-3xl border border-black/10 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-persici-crimson/10 px-3.5 py-1 text-xs font-medium text-persici-crimson">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {data.documentType === 'privacy' 
                  ? (isAr ? 'حوكمة الخصوصية والبيانات' : 'Privacy & Data Governance')
                  : (isAr ? 'الشروط والتعاملات التجارية' : 'Commercial & Service Agreement')}
              </span>
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-slate-600 font-mono">
                {data.version}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                type="button"
                aria-label={isAr ? 'طباعة المستند' : 'Print Document'}
                className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-1.5 text-xs text-slate-700 transition-colors hover:bg-slate-50 hover:border-black/20"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {isAr ? 'طباعة' : 'Print'}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-slate-900 mb-4">
              {isAr ? data.title.ar : data.title.en}
            </h1>
            <p className="font-secondary text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
              {isAr ? data.subtitle.ar : data.subtitle.en}
            </p>
          </div>

          {/* Operating Regional Entities Strip */}
          <div className="mt-8 pt-6 border-t border-black/5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              {isAr ? 'الكيانات التشغيلية والنطاقات القضائية لفروعنا' : 'Operating Branch Entities & Statutory Jurisdictions'}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {data.operatingEntities.map((entity, idx) => {
                const entityJur: Jurisdiction | null = entity.region.toLowerCase().includes('emirates')
                  ? 'uae'
                  : entity.region.toLowerCase().includes('saudi')
                  ? 'ksa'
                  : entity.region.toLowerCase().includes('jordan')
                  ? 'jordan'
                  : null;

                const isSelected = entityJur !== null && selectedJurisdiction === entityJur;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (entityJur) {
                        setSelectedJurisdiction(selectedJurisdiction === entityJur ? 'all' : entityJur);
                      }
                    }}
                    className={`flex flex-col justify-between rounded-2xl border p-3.5 text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'border-persici-crimson bg-persici-crimson/[0.04] ring-1 ring-inset ring-persici-crimson/30 shadow-xs'
                        : 'border-black/5 bg-slate-50/70 hover:border-persici-crimson/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-persici-crimson">
                          {entity.region}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-medium text-persici-crimson bg-persici-crimson/10 px-2 py-0.5 rounded-full">
                            {isAr ? 'نشط' : 'Active'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-900 mt-1">
                        {isAr ? entity.legalName.ar : entity.legalName.en}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 line-clamp-1" title={isAr ? entity.address.ar : entity.address.en}>
                      {isAr ? entity.address.ar : entity.address.en}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Effective Date & Contact Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-black/5">
            <div className="flex items-center gap-4">
              <span>
                {isAr ? 'تاريخ السريان: ' : 'Effective Date: '}
                <strong className="text-slate-800 font-medium">
                  {isAr ? data.effectiveDate.ar : data.effectiveDate.en}
                </strong>
              </span>
              <span>•</span>
              <span>
                {isAr ? 'البريد الرسمي: ' : 'Official Contact: '}
                <a
                  href={`mailto:${data.officerEmail}`}
                  className="text-persici-crimson font-medium hover:underline"
                >
                  {data.officerEmail}
                </a>
              </span>
            </div>

            {/* Jurisdiction Pill Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {jurisdictions.map((j) => (
                <button
                  key={j.key}
                  type="button"
                  onClick={() => setSelectedJurisdiction(j.key as Jurisdiction | 'all')}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedJurisdiction === j.key
                      ? 'bg-persici-black text-white shadow-xs'
                      : 'bg-black/5 text-slate-600 hover:bg-black/10'
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Asymmetric Layout (Sticky Rail + Content Body) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sticky TOC Navigation Rail (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Search Bar with active ring-inset border on the rounded card */}
              <div className="relative rounded-2xl border border-black/10 bg-white p-3 shadow-xs transition-all duration-200 focus-within:border-persici-crimson focus-within:ring-1 focus-within:ring-inset focus-within:ring-persici-crimson">
                <div className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'البحث في بنود المستند...' : 'Search legal clauses...'}
                    className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      type="button"
                      aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/5 text-slate-400 hover:bg-black/10 hover:text-slate-700 text-xs transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Table of Contents Box */}
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    {isAr ? 'فهرس البنود النظامية' : 'Table of Contents'}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {filteredClauses.length}/{data.clauses.length}
                  </span>
                </div>
                <nav className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredClauses.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-slate-400">
                      {isAr ? 'لا توجد بنود مطابقة' : 'No matching clauses'}
                    </div>
                  ) : (
                    filteredClauses.map((clause) => {
                      const isActive = activeClauseId === clause.id;
                      return (
                        <a
                          key={clause.id}
                          href={`#${clause.id}`}
                          className={`block rounded-xl px-3 py-2 text-xs transition-all ${
                            isActive
                              ? 'bg-persici-crimson text-white font-medium shadow-xs'
                              : 'text-slate-600 hover:bg-black/5 hover:text-slate-900'
                          }`}
                        >
                          {isAr ? clause.title.ar : clause.title.en}
                        </a>
                      );
                    })
                  )}
                </nav>
              </div>

              {/* Contact / DPO Card */}
              <div className="rounded-3xl border border-black/10 bg-persici-black p-6 text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-persici-blush">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-white">
                      {isAr ? 'المكتب القانوني وحوكمة البيانات' : 'Legal & Governance Desk'}
                    </h4>
                    <p className="text-[11px] text-white/60">
                      {isAr ? 'استفسارات العقود والخصوصية' : 'Direct Escalation Channel'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <a
                    href={`mailto:${data.officerEmail}`}
                    className="block rounded-xl bg-persici-crimson px-4 py-2.5 text-center text-xs font-medium text-white transition-all hover:bg-persici-crimson-80 hover:shadow-md hover:shadow-persici-crimson/25"
                  >
                    {data.officerEmail}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Legal Clauses Stream (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Filter & Match Counter Banner */}
            {(selectedJurisdiction !== 'all' || searchQuery.trim() !== '') && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-persici-crimson/20 bg-persici-crimson/[0.04] px-4 py-3 text-xs shadow-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-600">
                    {isAr ? 'التصفية النشطة:' : 'Active Filter:'}
                  </span>
                  {selectedJurisdiction !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-persici-crimson/10 px-2.5 py-1 text-xs font-medium text-persici-crimson">
                      <span>{jurisdictions.find((j) => j.key === selectedJurisdiction)?.label}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedJurisdiction('all')}
                        aria-label="Remove jurisdiction filter"
                        className="hover:text-persici-crimson-800 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {searchQuery.trim() !== '' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-xs font-mono text-slate-700">
                      <span>&ldquo;{searchQuery}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                        className="hover:text-black font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  <span className="text-slate-500">
                    ({isAr ? `${filteredClauses.length} من أصل ${data.clauses.length} بند` : `${filteredClauses.length} of ${data.clauses.length} clauses`})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedJurisdiction('all');
                    setSearchQuery('');
                  }}
                  className="font-medium text-persici-crimson hover:underline cursor-pointer"
                >
                  {isAr ? 'إعادة ضبط الكل' : 'Reset All Filters'}
                </button>
              </div>
            )}

            {filteredClauses.length === 0 ? (
              <div className="rounded-3xl border border-black/10 bg-white p-12 text-center text-slate-500">
                <p className="text-sm">
                  {isAr ? 'لم يتم العثور على بنود تطابق بحثك.' : 'No clauses match your search query.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedJurisdiction('all');
                  }}
                  className="mt-4 text-xs font-medium text-persici-crimson hover:underline cursor-pointer"
                >
                  {isAr ? 'إعادة ضبط خيارات البحث والتصفية' : 'Reset search & jurisdiction filters'}
                </button>
              </div>
            ) : (
              filteredClauses.map((clause) => (
                <article
                  key={clause.id}
                  id={clause.id}
                  className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 lg:p-10 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-4 mb-6">
                    <h2 className="font-primary text-xl sm:text-2xl font-medium tracking-tight text-slate-900">
                      {isAr ? clause.title.ar : clause.title.en}
                    </h2>
                    {clause.jurisdiction && (
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-mono uppercase text-slate-600">
                        {clause.jurisdiction === 'uae'
                          ? 'UAE Law'
                          : clause.jurisdiction === 'ksa'
                          ? 'Saudi PDPL'
                          : clause.jurisdiction === 'jordan'
                          ? 'Jordan Law'
                          : 'Global Standard'}
                      </span>
                    )}
                  </div>

                  {/* Primary Paragraphs */}
                  <div className="space-y-4 font-secondary text-sm leading-relaxed text-slate-700">
                    {(isAr ? clause.content.ar : clause.content.en).map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Subsections if present */}
                  {clause.subsections && clause.subsections.length > 0 && (
                    <div className="mt-8 space-y-6 border-t border-black/5 pt-6">
                      {clause.subsections
                        .filter((sub) => {
                          if (selectedJurisdiction === 'all') return true;
                          // If subsection is explicitly tagged for a different jurisdiction, filter it out
                          if (sub.jurisdiction && sub.jurisdiction !== selectedJurisdiction) {
                            return false;
                          }
                          return true;
                        })
                        .map((sub, sIdx) => {
                          const isJurisdictionMatch =
                            selectedJurisdiction !== 'all' && sub.jurisdiction === selectedJurisdiction;
                          return (
                            <div
                              key={sIdx}
                              className={`rounded-2xl border p-5 transition-all ${
                                isJurisdictionMatch
                                  ? 'border-persici-crimson/30 bg-persici-crimson/[0.04] ring-1 ring-inset ring-persici-crimson/20 shadow-xs'
                                  : 'border-black/5 bg-slate-50/80'
                              }`}
                            >
                              <h3 className="font-primary text-base font-medium text-slate-900 mb-3 flex items-center justify-between">
                                <span>{isAr ? sub.subtitle.ar : sub.subtitle.en}</span>
                                {sub.jurisdiction && (
                                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                                    isJurisdictionMatch
                                      ? 'bg-persici-crimson text-white font-semibold shadow-xs'
                                      : 'text-persici-crimson bg-persici-crimson/10'
                                  }`}>
                                    {sub.jurisdiction.toUpperCase()}
                                  </span>
                                )}
                              </h3>
                              <ul className="space-y-2 font-secondary text-xs sm:text-sm text-slate-600 list-disc list-inside">
                                {(isAr ? sub.points.ar : sub.points.en).map((pt, ptIdx) => (
                                  <li key={ptIdx} className="leading-relaxed">
                                    {pt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Highlight Box if present */}
                  {clause.highlightBox && (
                    <div className="mt-6 rounded-2xl border border-persici-crimson/20 bg-persici-crimson/5 p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-xs font-medium text-persici-crimson mb-1">
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{isAr ? clause.highlightBox.title.ar : clause.highlightBox.title.en}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {isAr ? clause.highlightBox.body.ar : clause.highlightBox.body.en}
                      </p>
                    </div>
                  )}
                </article>
              ))
            )}

            {/* Bottom Disclaimer Strip */}
            <div className="rounded-3xl border border-black/10 bg-white p-6 text-center text-xs text-slate-500">
              <p>
                {isAr
                  ? 'تمت صياغة هذه الوثيقة وفق أحدث المعايير الدولية والتشريعات النظامية في دولة الإمارات العربية المتحدة، والمملكة العربية السعودية، والمملكة الأردنية الهاشمية. للاستفسارات القانونية: '
                  : 'This document is drafted pursuant to international standards and governing statutory laws of the United Arab Emirates, the Kingdom of Saudi Arabia, and the Hashemite Kingdom of Jordan. For legal inquiries: '}
                <a href={`mailto:${data.officerEmail}`} className="text-persici-crimson font-medium hover:underline">
                  {data.officerEmail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
