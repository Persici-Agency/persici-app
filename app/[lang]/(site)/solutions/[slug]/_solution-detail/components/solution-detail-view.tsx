import React from 'react';
import type { Dictionary } from '@dictionaries';
import type { SolutionOfferingItem } from '@shared/types';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { HomeButton, ShapedImageContainer, FadeUp, CountUp } from '@shared';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';
import { SolutionsVectorDiagram } from '../../../_solutions/components/solutions-vector-diagram';

export type SolutionDetailViewProps = {
  solution: SolutionOfferingItem;
  lang: string;
  dict: Dictionary;
};

export function SolutionDetailView({ solution, lang, dict }: SolutionDetailViewProps) {
  const isRtl = lang === 'ar';
  const title = solution.title[lang as 'en' | 'ar'] || solution.title.en;
  const desc = solution.description[lang as 'en' | 'ar'] || solution.description.en;
  const tag = solution.tag[lang as 'en' | 'ar'] || solution.tag.en;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Solution Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 bg-linear-to-b from-white via-persici-white to-slate-50/50">
        <div className={sectionContainer}>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className={badgePill}>
                  {tag}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {isRtl ? 'حل مؤسسي متقدم' : 'Enterprise Solution'}
                </span>
              </div>

              <h1 className="font-primary text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {title}
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl">
                {desc}
              </p>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <HomeButton
                  href="#contactUs"
                  title={isRtl ? 'احجز استشارة نمو' : 'Schedule Strategy Session'}
                  className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
                  currentLang={lang}
                  isLangEffectIcon={true}
                />
              </div>
            </div>

            {/* Visual Vector & Mockup Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-xl text-center">
                <div className="mx-auto flex items-center justify-center mb-6">
                  <SolutionsVectorDiagram
                    type={solution.diagramType}
                    className="h-28 w-28 sm:h-36 sm:w-36 drop-shadow-md"
                  />
                </div>
                <h3 className="font-primary text-xl font-bold text-slate-900 mb-2">
                  {title} Architecture
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                  {isRtl ? 'منهجية معيارية تضمن موثوقية التنفيذ والتوسع المستدام' : 'Modular architecture engineered for enterprise reliability and continuous scale'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Strategic Imperative Section */}
      <section className={`${sectionPaddingY} bg-white border-y border-slate-100`}>
        <div className={sectionContainer}>
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="font-primary text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {isRtl ? 'القيمة التجارية ومحركات النمو' : 'Commercial Value & Growth Drivers'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              {isRtl
                ? 'كيف يسهم هذا الحل في خفض الهدر التشغيلي ومضاعفة القيمة الدائمة للعملاء'
                : 'How this solution minimizes operational friction and multiplies lifetime customer value'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-7">
              <div className="h-1 w-12 rounded-full bg-persici-crimson mb-4" />
              <h3 className="font-primary text-lg font-bold text-slate-900 mb-2">
                {isRtl ? '01. كفاءة تشغيلية مثبتة' : '01. Validated Operational Velocity'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {isRtl
                  ? 'أتمتة العمليات واختصار أوقات التنفيذ والإنتاج من شهور إلى أيام معدودة.'
                  : 'Automating high-friction workflows to compress cycle timelines from months to days.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-7">
              <div className="h-1 w-12 rounded-full bg-persici-blush mb-4" />
              <h3 className="font-primary text-lg font-bold text-slate-900 mb-2">
                {isRtl ? '02. تحسين هوامش الربح' : '02. Margin & LTV Maximization'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {isRtl
                  ? 'رفع معدلات التحويل وزيادة متوسط قيمة الطلب وخفض تكلفة اكتساب العميل.'
                  : 'Driving conversion rates and average order values while reducing customer acquisition costs.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-7">
              <div className="h-1 w-12 rounded-full bg-persici-black mb-4" />
              <h3 className="font-primary text-lg font-bold text-slate-900 mb-2">
                {isRtl ? '03. تكامل مؤسسي سلس' : '03. Seamless Enterprise Integration'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {isRtl
                  ? 'تكامل آمن وسريع عبر معايير برمجية حديثة مع كبرى المنصات السحابية والتجارية.'
                  : 'Open API connectivity integrating reliably with your existing stack and ERP architecture.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Spotlight Story */}
      <section className={`${sectionPaddingY} bg-slate-900 text-white relative`}>
        <div className={sectionContainer}>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-widest text-persici-crimson mb-3 block">
                {isRtl ? 'نتائج مثبتة في الميدان' : 'Proven Track Record'}
              </span>
              <h2 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {isRtl ? 'نمو قابل للقياس وأثر مباشر على الأرباح' : 'Measurable Growth With Direct Bottom-Line Impact'}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                {isRtl
                  ? 'نحن لا نكتفي بتقديم التوصيات، بل نقود التنفيذ الهندسي والتسويقي المتكامل لضمان تفوق علامتك التجارية.'
                  : 'We partner directly with founders and leadership teams to architect, deploy, and scale high-growth engines with uncompromising quality.'}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <div className="font-primary text-3xl font-extrabold text-persici-crimson">
                    <CountUp value="+340%" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isRtl ? 'متوسط نمو الإيرادات' : 'Average Revenue Growth'}
                  </div>
                </div>
                <div>
                  <div className="font-primary text-3xl font-extrabold text-white">
                    <CountUp value="4.2x" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isRtl ? 'العائد على الإنفاق' : 'Average Return on Spend'}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <FadeUp
                direction={isRtl ? 'right' : 'left'}
                delay={100}
                distance={24}
                duration={750}
                className="relative"
              >
                <ShapedImageContainer
                  shape="sapient-tab-tl"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt={title}
                  aspectRatio="aspect-4/3"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="drop-shadow-2xl"
                />
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Static Home Contact Section (Required on all Solution Pages) */}
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}
