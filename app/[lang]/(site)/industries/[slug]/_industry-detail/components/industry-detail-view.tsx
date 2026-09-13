import React from 'react';
import { FeaturedClientStories, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import type { IndustryOfferingItem } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { HomeContactSection } from '@/app/[lang]/(site)/_home/components/home-contact-section';
import {
  SolutionsHeroSection,
  SolutionsVectorDiagram,
} from '@/app/[lang]/(site)/solutions/_solutions/components';
import { getFeaturedStories } from '@shared/data/featured-client-stories.data';
import { IndustrySubNavbar } from '../../_components/industry-sub-navbar';

export type IndustryDetailViewProps = {
  industry: IndustryOfferingItem;
  lang: string;
  dict: Dictionary;
};

export function IndustryDetailView({ industry, lang, dict }: IndustryDetailViewProps) {
  const isRtl = lang === 'ar';
  const title = industry.title[lang as 'en' | 'ar'] || industry.title.en;
  const desc = industry.description[lang as 'en' | 'ar'] || industry.description.en;
  const tag = industry.tag[lang as 'en' | 'ar'] || industry.tag.en;

  const fallbackStories = getFeaturedStories([
    'nissan-mobility',
    'gulf-enterprise-copilot',
    'lahfaa-perfumes',
  ]);

  const fallbackFaqs = [
    {
      question: {
        en: `What specialized capabilities does Persici bring to ${title}?`,
        ar: `ما هي القدرات المتخصصة التي تقدمها بيرسيكي لقطاع ${title}؟`,
      },
      answer: {
        en: `We combine deep industry domain knowledge with enterprise digital engineering, cloud data sovereignty, and human-centered design tailored specifically for ${title}.`,
        ar: `نجمع بين المعرفة العميقة بمتطلبات القطاع والهندسة الرقمية المؤسسية، وسيادة البيانات السحابية، وتصميم التجارب المتمحور حول الإنسان والمصمم خصيصاً لقطاع ${title}.`,
      },
    },
    {
      question: {
        en: 'How quickly can our organization launch a transformation pilot?',
        ar: 'ما هي سرعة إطلاق نموذج التحول الأولي في مؤسستنا؟',
      },
      answer: {
        en: 'Our agile squads typically deploy an end-to-end validated proof of value within 8 to 12 weeks, ensuring low operational disruption and validated metrics.',
        ar: 'تنجح فرقنا الرشيقة في إطلاق نموذج أولي مثبت القيمة في غضون 8 إلى 12 أسبوعاً، مما يضمن استمرارية الأعمال المعتادة والتحقق من العوائد.',
      },
    },
    {
      question: {
        en: 'Are your solutions compliant with regional GCC data sovereignty regulations?',
        ar: 'هل حلولكم متوافقة مع ضوابط سيادة وتوطين البيانات في دول الخليج؟',
      },
      answer: {
        en: 'Yes. All architectures are engineered for local in-country cloud hosting and strict compliance with national cybersecurity and privacy mandates.',
        ar: 'نعم بالتأكيد. تُهندس كافة الحلول للاستضافة السحابية المحلية داخل حدود الدولة مع الامتثال الكامل لضوابط الأمن السيبراني والخصوصية الوطنية.',
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Dynamic Industry Hero Section */}
      <SolutionsHeroSection
        tag={tag}
        secondaryTag={isRtl ? 'قطاع الممارسات الصناعية' : 'Industry Practice'}
        title={title}
        subtitle={desc}
        ctaHref="#contactUs"
        ctaText={isRtl ? 'احجز استشارة متخصصة' : 'Schedule Strategy Session'}
        visual={
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-xl text-center">
            <div className="mx-auto flex items-center justify-center mb-6">
              <SolutionsVectorDiagram
                type={industry.diagramType}
                className="h-28 w-28 sm:h-36 sm:w-36 drop-shadow-md"
              />
            </div>
            <h3 className="font-primary text-xl font-bold text-slate-900 mb-2">
              {title} Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              {isRtl
                ? 'معمارية معيارية تضمن موثوقية التنفيذ والتوسع المستدام'
                : 'Modular architecture engineered for enterprise reliability and continuous scale'}
            </p>
          </div>
        }
        lang={lang}
      />

      {/* Dedicated Sticky Industry Sub-Navbar */}
      <IndustrySubNavbar
        lang={lang}
        sections={[
          { id: 'realities', label: { en: 'Strategic Imperatives', ar: 'الركائز الاستراتيجية' } },
          { id: 'customer-stories', label: { en: 'Customer stories', ar: 'قصص النجاح' } },
          { id: 'faqs', label: { en: 'FAQs', ar: 'الأسئلة الشائعة' } },
        ]}
      />

      {/* 2. Strategic Imperative Section */}
      <section id="realities" className={`${sectionPaddingY} bg-white border-y border-slate-100 scroll-mt-24`}>
        <div className={sectionContainer}>
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="font-primary text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {isRtl ? 'القيمة التجارية ومحركات النمو' : 'Commercial Value & Growth Drivers'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              {isRtl
                ? `كيف تسهم حلولنا في خفض الهدر التشغيلي ومضاعفة القيمة التراكمية في قطاع ${title}`
                : `How our solutions minimize operational friction and multiply value across ${title}`}
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
                  ? 'رفع معدلات التحويل وزيادة القيمة الدائمة للعملاء وخفض تكاليف التشغيل.'
                  : 'Driving conversion rates and lifetime value while reducing operational overhead.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-7">
              <div className="h-1 w-12 rounded-full bg-persici-black mb-4" />
              <h3 className="font-primary text-lg font-bold text-slate-900 mb-2">
                {isRtl ? '03. تكامل مؤسسي سلس' : '03. Seamless Enterprise Integration'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {isRtl
                  ? 'تكامل آمن وسريع عبر معايير برمجية حديثة مع كبرى المنصات السحابية وأنظمة ERP.'
                  : 'Open API connectivity integrating reliably with your existing stack and ERP architecture.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Client Stories */}
      <div id="customer-stories">
        <FeaturedClientStories
          stories={fallbackStories}
          sectionBadge={isRtl ? 'قصص النجاح المميزة' : 'Featured Client Stories'}
          sectionTitle={isRtl ? 'أثر تشغيلي استثنائي ونمو متسارع' : 'Proven Enterprise Impact & Operational Scalability'}
          sectionSubtitle={
            isRtl
              ? 'اكتشف كيف ساهمت معماريات بيرسيكي في تسريع أداء المؤسسات والشركات الكبرى.'
              : 'Explore how our enterprise architectures power leading organizations across the region.'
          }
          lang={lang}
        />
      </div>

      {/* 4. Executive Client Review */}
      <ClientReviewSection
        quoteText={{
          en: `Persici engineered our digital platforms for ${title}, achieving exceptional reliability and accelerating our time-to-market by 4x.`,
          ar: `طورت بيرسيكي منصاتنا الرقمية لقطاع ${title}، محققة موثوقية استثنائية وتسريعاً لإطلاق خدماتنا بمقدار 4 أضعاف.`,
        }}
        quoteAuthor="Nasser Al-Subaie"
        quoteRole={{
          en: `Chief Digital Officer, Enterprise ${title} Group`,
          ar: `الرئيس التنفيذي للقطاع الرقمي، مجموعة كبرى في ${title}`,
        }}
        badge={{
          en: 'Enterprise Client',
          ar: 'عميل مؤسسي',
        }}
        lang={lang}
      />

      {/* 5. Enterprise FAQs */}
      <div id="faqs">
        <FaqSection
          faqs={fallbackFaqs}
          title={isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          subtitle={
            isRtl
              ? `إجابات واضحة حول استراتيجية التحول والتنفيذ لقطاع ${title}`
              : `Answers regarding strategy and technical delivery for ${title}`
          }
          lang={lang}
        />
      </div>

      {/* 6. Global Contact Section */}
      <div id="contact">
        <HomeContactSection dict={dict} lang={lang} />
      </div>
    </div>
  );
}
