'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer } from '@shared/constants';
import { HomeButton, FadeUp } from '@shared/components';
import { TbSparkles } from 'react-icons/tb';
import type { Dictionary } from '@dictionaries';

export interface InsightsHeroSectionProps {
  lang: string;
  dict?: Dictionary;
}

export function InsightsHeroSection({ lang }: InsightsHeroSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full overflow-hidden bg-linear-to-b from-white via-slate-50/40 to-white pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-24 border-b border-black/[0.05]"
    >
      {/* Subtle architectural background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 -start-32 h-96 w-96 rounded-full bg-persici-crimson/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -end-32 h-96 w-96 rounded-full bg-persici-crimson/5 blur-3xl" />

      <div className={`relative z-10 ${sectionContainer}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline, Narrative & HomeButtons */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            {/* Badge */}
            <FadeUp delay={0} duration={750} distance={16}>
              <div className="inline-flex items-center gap-2 rounded-full border border-persici-crimson/20 bg-persici-crimson/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-6 backdrop-blur-xs">
                <TbSparkles className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {isRtl ? 'الرؤى والقيادة الفكرية' : 'Insights & Thought Leadership'}
                </span>
              </div>
            </FadeUp>

            {/* Main Headline */}
            <FadeUp delay={120} duration={850} distance={24} blur={true}>
              <h1 className="font-primary text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                {isRtl ? (
                  <>
                    قيادة فكرية حائزة على{' '}
                    <span className="text-persici-crimson">جوائز عالمية</span>
                  </>
                ) : (
                  <>
                    Award-winning{' '}
                    <span className="text-persici-crimson">thought leadership</span>
                  </>
                )}
              </h1>
            </FadeUp>

            {/* Descriptive Body Copy */}
            <FadeUp delay={240} duration={800} distance={20}>
              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {isRtl
                  ? 'تم تكريم أبحاثنا الاستراتيجية بجائزة السرد القصصي للقيادة الفكرية في حفل جوائز TLFT 2024. بعد منافسة دولية محتدمة، نال تقريرنا أعلى درجات التقييم العام بفضل أصالته المفاهيمية، ومحتواه الاستثنائي، وصياغته البصرية الآسرة.'
                  : 'Our brand and research was recognized with the Thought Leadership Storytelling Award at the TLFT Awards 2024. Selected from a competitive global field, the report earned the highest overall score in the judging process and was recognized for its distinctive concept, memorable content, swift format and admirable compelling storytelling.'}
              </p>
            </FadeUp>

            {/* HomeButtons */}
            <FadeUp delay={360} duration={750} distance={18}>
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <HomeButton
                  href={`/${lang}/insights/can-gen-ai-help-agile-teams-improve-delivery-clarity`}
                  title={isRtl ? 'قراءة الرؤية' : 'Read insight'}
                  className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
                  currentLang={lang}
                  isLangEffectIcon={true}
                />

                <HomeButton
                  href="#explore"
                  title={isRtl ? 'استكشف كافة المحتويات' : 'Explore All Content'}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                  currentLang={lang}
                  isLangEffectIcon={true}
                />
              </div>
            </FadeUp>
          </div>

          {/* Right Column: High Quality Hero Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <FadeUp delay={200} duration={900} distance={30}>
              <div className="relative group">
                {/* Decorative glowing ambient rings */}
                <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-persici-crimson/25 via-persici-crimson/10 to-amber-500/20 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hero Award Image Container */}
                <div className="relative w-[280px] h-[360px] sm:w-[340px] sm:h-[430px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950 group-hover:scale-[1.01] transition-transform duration-500">
                  <Image
                    src="/images/insights/insights-hero-award.webp"
                    alt={isRtl ? 'جائزة القيادة الفكرية والسرد القصصي TLFT' : 'TLFT Thought Leadership Storytelling Award Winner'}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 300px, 400px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
