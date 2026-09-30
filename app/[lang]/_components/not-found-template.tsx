'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { TbHome, TbMail, TbArrowRight, TbArrowLeft } from 'react-icons/tb';

export function NotFoundTemplate({ forcedLang }: { forcedLang?: string }) {
  const pathname = usePathname() || '';
  const detectedLang = forcedLang || (pathname.startsWith('/ar') ? 'ar' : 'en');
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>(detectedLang === 'ar' ? 'ar' : 'en');
  const isAr = currentLang === 'ar';
  const lang = currentLang;

  const t = {
    en: {
      statusBadge: 'ERROR 404 • UNRESOLVED ROUTE',
      title: 'Lost in Digital Space — Page Not Found',
      description:
        'The destination you are trying to reach has either been relocated, restricted, or does not exist on this server.',
      homeBtn: 'Return to Home',
      contactBtn: 'Contact Support',
      rights: `© ${new Date().getFullYear()} Persici Agency. All rights reserved.`,
      locations: 'Persici Growth OS • Dubai • Riyadh • Amman',
      toggleLabel: 'العربية',
    },
    ar: {
      statusBadge: 'خطأ 404 • مسار غير معروف',
      title: 'الصفحة غير موجودة في هذا المسار',
      description:
        'الصفحة التي تحاول الوصول إليها إما تم نقلها، أو غير مصرح بالوصول إليها، أو لم تكن موجودة من الأساس.',
      homeBtn: 'العودة إلى الصفحة الرئيسية',
      contactBtn: 'تواصل مع الدعم الفني',
      rights: `© ${new Date().getFullYear()} وكالة بيرسيتشي. جميع الحقوق محفوظة.`,
      locations: 'بيرسيتشي جروث أو إس • دبي • الرياض • عمان',
      toggleLabel: 'English',
    },
  }[currentLang];

  const handleToggleLang = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    setCurrentLang(nextLang);
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/404')) {
        const newPath = path.replace(`/${currentLang}/`, `/${nextLang}/`);
        window.history.replaceState(null, '', newPath);
      }
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#FFFAFA] text-[#121212] flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden select-none font-sans"
    >
      {/* Dynamic Background Crimson & Blush Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-b from-[#D83427]/10 via-[#EF8C7D]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#EF8C7D]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D83427]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Background Radial Grid Motif */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #121212 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Header: Dark Brand Logo for Light Canvas */}
      <header className="relative z-10 w-full max-w-7xl flex items-center justify-between py-2">
        <Link href={`/${lang}`} className="inline-flex items-center gap-2">
          <Image
            src="/persici-dark-logo-horizontal.webp"
            alt="Persici Agency"
            width={140}
            height={36}
            priority
            className="h-8 w-auto sm:h-9 object-contain"
          />
        </Link>

        {/* Interactive Language Switcher Toggle */}
        <button
          type="button"
          onClick={handleToggleLang}
          className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-slate-200/80 bg-white/90 hover:bg-white text-slate-700 hover:text-black shadow-xs transition-all duration-200 cursor-pointer"
        >
          {t.toggleLabel}
        </button>
      </header>

      {/* Main Content Showcase */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto py-12">
        {/* Visual Graphic: Official Persici Brand Icon & Concentric Rings (Static Emblem, No Hover Scale) */}
        <div className="relative mb-8 flex items-center justify-center pointer-events-none">
          {/* Animated Concentric Rings */}
          <div className="absolute w-44 h-44 rounded-full border border-[#D83427]/20 animate-ping opacity-30" />
          <div className="absolute w-36 h-36 rounded-full border border-[#D83427]/25" />
          <div className="absolute w-28 h-28 rounded-full border border-slate-200/80 bg-gradient-to-b from-white to-white/70 backdrop-blur-md shadow-lg shadow-[#D83427]/10" />

          {/* Central Official Brand Emblem: Fixed, Static, Never Scales */}
          <div className="relative w-20 h-20 rounded-2xl bg-white border border-[#D83427]/25 shadow-xl shadow-[#D83427]/15 flex items-center justify-center p-3.5">
            <Image
              src="/persici-icon.webp"
              alt="Persici Icon"
              width={56}
              height={56}
              priority
              className="w-12 h-12 object-contain drop-shadow-sm select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 text-slate-700 text-xs font-mono mb-6 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#D83427] animate-pulse" />
          <span>{t.statusBadge}</span>
        </div>

        {/* Massive 404 Display */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#121212] via-[#2A2A2A] to-[#898989] leading-none mb-4">
          404
        </h1>

        {/* Bilingual Primary Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#121212] mb-3">
          {t.title}
        </h2>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed font-normal">
          {t.description}
        </p>

        {/* Action Button Group */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D83427] hover:bg-[#B42419] text-white font-semibold text-sm shadow-xl shadow-[#D83427]/25 transition-all duration-200"
          >
            <TbHome className="w-4 h-4" />
            <span>{t.homeBtn}</span>
            {isAr ? (
              <TbArrowLeft className="w-4 h-4" />
            ) : (
              <TbArrowRight className="w-4 h-4" />
            )}
          </Link>

          <Link
            href={`/${lang}/contact`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 hover:text-black font-medium text-sm shadow-xs transition-all duration-200"
          >
            <TbMail className="w-4 h-4 text-slate-500" />
            <span>{t.contactBtn}</span>
          </Link>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between py-4 border-t border-slate-200/80 text-xs text-slate-500 gap-2">
        <span>{t.rights}</span>
        <span className="font-mono text-[11px] text-slate-400">
          {t.locations}
        </span>
      </footer>
    </div>
  );
}
