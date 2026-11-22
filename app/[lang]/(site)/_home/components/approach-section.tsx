import React from 'react';
import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import type { ApproachSectionContent, LocalizedString } from '@shared/types';
import { sectionContainer, sectionPaddingY, HomeButton, FadeUp } from '@shared';

type BilingualField = string | LocalizedString | { en?: string; ar?: string };

export interface LegacyApproachContent extends Partial<ApproachSectionContent> {
  teamImage?: string;
  titleEn?: string;
  titleAr?: string;
  desc1En?: string;
  desc1Ar?: string;
  desc2En?: string;
  desc2Ar?: string;
  ctaPrimary?: BilingualField;
  ctaPrimaryEn?: string;
  ctaPrimaryAr?: string;
  ctaSecondary?: BilingualField;
  ctaSecondaryEn?: string;
  ctaSecondaryAr?: string;
}

function readBiText(
  field: unknown,
  lang: string
): string | undefined {
  if (!field) return undefined;
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    const rec = field as Record<string, unknown>;
    const candidate = lang === 'ar' ? rec.ar || rec.en : rec.en || rec.ar;
    return typeof candidate === 'string' ? candidate : undefined;
  }
  return undefined;
}

export type ApproachSectionProps = {
  lang: string;
  dict: Dictionary;
  content?: LegacyApproachContent | Record<string, unknown>;
};

export function ApproachSection({
  lang,
  dict,
  content: rawContent,
}: ApproachSectionProps) {
  const isAr = lang === 'ar';
  const content = rawContent as LegacyApproachContent | undefined;

  const teamImage =
    content?.teamImage ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

  const title =
    readBiText(content?.title, lang) ||
    (isAr ? content?.titleAr : content?.titleEn) ||
    dict.approach.title;

  const desc1 =
    readBiText(content?.desc1, lang) ||
    (isAr ? content?.desc1Ar : content?.desc1En) ||
    dict.approach.desc1;

  const desc2 =
    readBiText(content?.desc2, lang) ||
    (isAr ? content?.desc2Ar : content?.desc2En) ||
    dict.approach.desc2;

  const ctaPrimary =
    readBiText(content?.ctaPrimaryText, lang) ||
    readBiText(content?.ctaPrimary, lang) ||
    (isAr ? content?.ctaPrimaryAr : content?.ctaPrimaryEn) ||
    dict.approach.ctaPrimary;

  const rawPrimaryHref = content?.ctaPrimaryHref || '/contact';
  const ctaPrimaryHref = rawPrimaryHref.startsWith(`/${lang}`)
    ? rawPrimaryHref
    : rawPrimaryHref.startsWith('/')
    ? `/${lang}${rawPrimaryHref}`
    : rawPrimaryHref;

  const ctaSecondary =
    readBiText(content?.ctaSecondaryText, lang) ||
    readBiText(content?.ctaSecondary, lang) ||
    (isAr ? content?.ctaSecondaryAr : content?.ctaSecondaryEn) ||
    dict.approach.ctaSecondary;

  const rawSecondaryHref = content?.ctaSecondaryHref || '/about';
  const ctaSecondaryHref = rawSecondaryHref.startsWith(`/${lang}`)
    ? rawSecondaryHref
    : rawSecondaryHref.startsWith('/')
    ? `/${lang}${rawSecondaryHref}`
    : rawSecondaryHref;

  return (
    <section className={`relative ${sectionContainer} ${sectionPaddingY}`}>
      {/* Subtle Right Background Polygon Accent from the reference design */}
      <div className="pointer-events-none absolute -top-12 -end-10 -bottom-12 -z-10 hidden w-1/2 overflow-hidden lg:block opacity-60">
        <div className="h-full w-full bg-gradient-to-bl from-persici-crimson/[0.04] via-black/[0.02] to-transparent [clip-path:polygon(30%_0%,100%_0%,100%_100%,0%_75%)] rounded-3xl" />
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Team Image */}
        <FadeUp delay={0} duration={800} distance={28} className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] sm:aspect-[1.15/1] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-black/5 shadow-2xl bg-black/5">
            <Image
              src={teamImage}
              alt="Persici eCommerce growth team"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </FadeUp>

        {/* Right Column: Approach Copy & CTAs */}
        <FadeUp delay={200} duration={800} distance={24} className="relative lg:col-span-6">
          <h2 className="font-primary text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
            {title}
          </h2>
          {typeof desc1 === 'string' && /<[a-z][\s\S]*>/i.test(desc1) ? (
            <div
              className="mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_u]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_a]:text-persici-crimson [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: desc1 }}
            />
          ) : (
            <p className="mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
              {desc1}
            </p>
          )}
          {desc2 &&
            (typeof desc2 === 'string' && /<[a-z][\s\S]*>/i.test(desc2) ? (
              <div
                className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_u]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_a]:text-persici-crimson [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: desc2 }}
              />
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
                {desc2}
              </p>
            ))}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <HomeButton
              href={ctaPrimaryHref}
              title={ctaPrimary}
              className="bg-persici-crimson text-white px-7 py-3 text-sm font-semibold"
              iconClassName="bg-white text-persici-crimson"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={ctaSecondaryHref}
              title={ctaSecondary}
              className="border border-black/15 bg-black/[0.04] text-foreground px-7 py-3 text-sm font-semibold"
              iconClassName="bg-black text-white"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
