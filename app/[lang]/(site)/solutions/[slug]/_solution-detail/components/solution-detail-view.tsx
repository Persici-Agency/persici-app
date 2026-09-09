import React from 'react';
import { FeaturedClientStories, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import type { SolutionOfferingItem } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';
import {
  SolutionsHeroSection,
  SolutionsVectorDiagram,
  } from '../../../_solutions/components';

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
      {/* 1. Dynamic Solution Hero Section */}
      <SolutionsHeroSection
        tag={tag}
        secondaryTag={isRtl ? 'حل مؤسسي متقدم' : 'Enterprise Solution'}
        title={title}
        subtitle={desc}
        ctaHref="#contactUs"
        ctaText={isRtl ? 'احجز استشارة نمو' : 'Schedule Strategy Session'}
        visual={
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
              {isRtl
                ? 'منهجية معيارية تضمن موثوقية التنفيذ والتوسع المستدام'
                : 'Modular architecture engineered for enterprise reliability and continuous scale'}
            </p>
          </div>
        }
        lang={lang}
      />

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

      {/* 3. Reusable Featured Spotlight Story */}
      <FeaturedClientStories
        badge={isRtl ? 'نتائج مثبتة في الميدان' : 'Proven Track Record'}
        title={isRtl ? 'نمو قابل للقياس وأثر مباشر على الأرباح' : 'Measurable Growth With Direct Bottom-Line Impact'}
        description={
          isRtl
            ? 'نحن لا نكتفي بتقديم التوصيات، بل نقود التنفيذ الهندسي والتسويقي المتكامل لضمان تفوق علامتك التجارية.'
            : 'We partner directly with founders and leadership teams to architect, deploy, and scale high-growth engines with uncompromising quality.'
        }
        metric1Val="+340%"
        metric1Label={isRtl ? 'متوسط نمو الإيرادات' : 'Average Revenue Growth'}
        metric2Val="4.2x"
        metric2Label={isRtl ? 'العائد على الإنفاق' : 'Average Return on Spend'}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
        ctaText={isRtl ? 'احجز استشارة استراتيجية' : 'Book Strategy Consultation'}
        ctaHref="#contactUs"
        lang={lang}
      />

      {/* 4. Reusable Client Review */}
      <ClientReviewSection
        badge={isRtl ? 'شهادة العميل' : 'Client Review'}
        quoteText={{
          en: `Partnering with Persici for our ${title} transformation allowed us to scale throughput while significantly cutting operational overhead. A truly transformative engagement.`,
          ar: `شراكتنا مع بيرسيسي في تطبيق ${title} مكّنتنا من مضاعفة قدراتنا التشغيلية وخفض تكاليف التنفيذ بشكل ملموس. كانت تجربة فارقة بكل المقاييس.`,
        }}
        quoteAuthor="Elena Rostova"
        quoteRole={{
          en: `Chief Technology Officer, Veloce Global`,
          ar: `الرئيس التنفيذي للتكنولوجيا، فيلوس جلوبال`,
        }}
        lang={lang}
      />

      {/* 5. Reusable Solutions FAQ */}
      <FaqSection
        title="FAQ"
        subtitle={
          isRtl
            ? `إجابات واضحة حول آلية تكامل ${title}، وجداول التسليم، وفريق العمل المشرف.`
            : `Clear answers regarding ${title} architecture, integration timelines, and delivery teams.`
        }
        faqs={[
          {
            question: {
              en: `How quickly can ${title} be integrated into our stack?`,
              ar: `كم يستغرق دمج ${title} في بنيتنا البرمجية الحالية؟`,
            },
            answer: {
              en: `Our cross-functional pods typically complete discovery, architecture design, and initial sprint deployment within 2 to 4 weeks with zero disruption to your active operations.`,
              ar: `تكمل فرقنا المتخصصة مرحلة التدقيق وتصميم المعمارية وإطلاق أولى مخرجات التطوير خلال 2 إلى 4 أسابيع دون أي انقطاع في سير أعمالك.`,
            },
          },
          {
            question: {
              en: 'Do you manage full third-party tool and ERP integrations?',
              ar: 'هل تتولون التكامل الكامل مع أدوات الطرف الثالث وأنظمة ERP؟',
            },
            answer: {
              en: 'Yes. We engineer end-to-end API pipelines connecting your storefront, CRM, inventory databases, and analytics telemetry into one cohesive data layer.',
              ar: 'نعم، نبني مسارات ربط برمجية متكاملة تربط واجهة متجرك، وإدارة علاقات العملاء، وقواعد بيانات المخزون، والتحليلات الفورية في طبقة بيانات موحدة.',
            },
          },
          {
            question: {
              en: 'What metrics and KPIs determine the success of this solution?',
              ar: 'ما هي مؤشرات الأداء الرئيسية (KPIs) التي تقيس نجاح هذا الحل؟',
            },
            answer: {
              en: 'We benchmark clear bottom-line metrics before launch: conversion rates, page latency, blended customer acquisition cost (CAC), and customer lifetime value (LTV).',
              ar: 'نحدد مؤشرات واضحة ومقاسة قبل الإطلاق: معدلات التحويل، سرعة التجاوب، خفض تكلفة الاستحواذ على العملاء، ومضاعفة القيمة الدائمة للعميل.',
            },
          },
        ]}
        lang={lang}
      />

      {/* 6. Static Home Contact Section (Required on all Solution Pages) */}
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}
