'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { TbMail, TbArrowRight, TbArrowLeft, TbClock } from 'react-icons/tb';
import {
  MaintenanceConfig,
  DEFAULT_MAINTENANCE_CONFIG,
  normalizeMaintenanceConfig,
} from '@/lib/maintenance-types';

interface CountdownTimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

function calculateTimeLeft(targetIso: string): CountdownTimeLeft {
  const targetMs = new Date(targetIso).getTime();
  const nowMs = Date.now();

  if (Number.isNaN(targetMs) || targetMs <= nowMs) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isExpired: true,
    };
  }

  const totalSeconds = Math.floor((targetMs - nowMs) / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isExpired: false,
  };
}

export interface MaintenanceTemplateProps {
  forcedLang?: string;
  initialConfig?: Partial<MaintenanceConfig> | null;
  embeddedPreview?: boolean;
}

export function MaintenanceTemplate({
  forcedLang,
  initialConfig,
  embeddedPreview = false,
}: MaintenanceTemplateProps) {
  const pathname = usePathname() || '';
  const detectedLang = forcedLang || (pathname.startsWith('/ar') ? 'ar' : 'en');
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>(
    detectedLang === 'ar' ? 'ar' : 'en'
  );

  // Sync language if forcedLang prop changes (e.g. in dashboard preview)
  const [prevForcedLang, setPrevForcedLang] = useState(forcedLang);
  if (forcedLang !== prevForcedLang) {
    setPrevForcedLang(forcedLang);
    if (forcedLang === 'ar' || forcedLang === 'en') {
      setCurrentLang(forcedLang);
    }
  }

  const config = normalizeMaintenanceConfig(
    initialConfig || DEFAULT_MAINTENANCE_CONFIG
  );

  const isAr = currentLang === 'ar';

  const [timeLeft, setTimeLeft] = useState<CountdownTimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false,
  });

  useEffect(() => {
    if (!config.countdownEnabled || !config.countdownTargetDate) {
      return;
    }

    const tick = () => {
      setTimeLeft(calculateTimeLeft(config.countdownTargetDate));
    };

    const initialTimer = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [config.countdownEnabled, config.countdownTargetDate]);

  const handleToggleLang = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    setCurrentLang(nextLang);
    if (!embeddedPreview && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith(`/${currentLang}/`) || path === `/${currentLang}`) {
        const newPath = path.replace(
          new RegExp(`^/${currentLang}(/|$)`),
          `/${nextLang}$1`
        );
        window.history.replaceState(null, '', newPath);
      }
    }
  };

  const labels = {
    en: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      toggleLabel: 'العربية',
      rights: '© 2026 Persici Agency. All rights reserved.',
      locations: 'Persici Growth OS • Dubai • Riyadh • Amman',
    },
    ar: {
      days: 'أيام',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثواني',
      toggleLabel: 'English',
      rights: '© 2026 وكالة بيرسيتشي. جميع الحقوق محفوظة.',
      locations: 'بيرسيتشي جروث أو إس • دبي • الرياض • عمان',
    },
  }[currentLang];

  const badgeText = isAr ? config.badge.ar : config.badge.en;
  const titleText = isAr ? config.title.ar : config.title.en;
  const descriptionText = isAr ? config.description.ar : config.description.en;
  const countdownHeaderText = isAr
    ? config.countdownLabel.ar
    : config.countdownLabel.en;
  const contactBtnText = isAr
    ? config.contactButtonLabel.ar
    : config.contactButtonLabel.en;

  const countdownUnits = [
    { key: 'days', value: timeLeft.days, label: labels.days },
    { key: 'hours', value: timeLeft.hours, label: labels.hours },
    { key: 'minutes', value: timeLeft.minutes, label: labels.minutes },
    { key: 'seconds', value: timeLeft.seconds, label: labels.seconds },
  ];

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${
        embeddedPreview ? 'min-h-[640px] rounded-2xl border border-slate-200' : 'min-h-screen'
      } w-full bg-[#FFFAFA] text-[#121212] flex flex-col justify-between items-center px-4 sm:px-6 py-8 relative overflow-hidden select-none font-sans`}
    >
      {/* Dynamic Background Crimson & Blush Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-b from-[#D83427]/10 via-[#EF8C7D]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#EF8C7D]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D83427]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Background Radial Grid Motif */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #121212 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Header: Dark Brand Logo for Light Canvas + Instant Language Toggle */}
      <header className="relative z-10 w-full max-w-7xl flex items-center justify-between py-2">
        <div className="inline-flex items-center gap-2">
          <Image
            src="/persici-dark-logo-horizontal.webp"
            alt="Persici Agency"
            width={140}
            height={36}
            priority
            className="h-8 w-auto sm:h-9 object-contain"
          />
        </div>

        <button
          type="button"
          onClick={handleToggleLang}
          className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-slate-200/80 bg-white/90 hover:bg-white text-slate-700 hover:text-black shadow-xs transition-all duration-200 cursor-pointer"
        >
          {labels.toggleLabel}
        </button>
      </header>

      {/* Main Content Showcase */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-auto py-10 sm:py-12 w-full">
        {/* Visual Graphic: Official Persici Brand Icon & Concentric Rings (Static Emblem) */}
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
          <span>{badgeText}</span>
        </div>

        {/* Bilingual Primary Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#121212] mb-4 max-w-2xl leading-tight">
          {titleText}
        </h1>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-8 leading-relaxed font-normal">
          {descriptionText}
        </p>

        {/* Optional Countdown Timer Section */}
        {config.countdownEnabled && (
          <div className="w-full max-w-xl mb-9">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">
              <TbClock className="w-3.5 h-3.5 text-[#D83427]" />
              <span>{countdownHeaderText}</span>
            </div>

            <div
              dir="ltr"
              className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full"
            >
              {countdownUnits.map((unit) => (
                <div
                  key={unit.key}
                  className="bg-white/90 backdrop-blur-md border border-slate-200/80 border-t-2 border-t-[#D83427] rounded-2xl p-3.5 sm:p-5 shadow-lg shadow-[#D83427]/5 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl sm:text-4xl md:text-5xl font-mono font-semibold text-[#121212] tracking-tight leading-none mb-1.5">
                    {unit.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Support / Contact Action Button */}
        {config.showContactButton && config.contactButtonHref && (
          <div className="flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
            <a
              href={config.contactButtonHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D83427] hover:bg-[#B42419] text-white font-semibold text-sm shadow-xl shadow-[#D83427]/25 transition-all duration-200"
            >
              <TbMail className="w-4 h-4" />
              <span>{contactBtnText}</span>
              {isAr ? (
                <TbArrowLeft className="w-4 h-4" />
              ) : (
                <TbArrowRight className="w-4 h-4" />
              )}
            </a>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between py-4 border-t border-slate-200/80 text-xs text-slate-500 gap-2">
        <span>{labels.rights}</span>
        <span className="font-mono text-[11px] text-slate-400">
          {labels.locations}
        </span>
      </footer>
    </div>
  );
}
