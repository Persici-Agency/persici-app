'use client';

import React from 'react';
import Image from 'next/image';
import {
  TbPlus,
  TbTrash,
  TbVideo,
  TbPhoto,
  TbDeviceDesktop,
  TbMovie,
  TbStack2,
  TbLibraryPhoto,
  TbPhotoPlus,
  TbLayoutCollage,
  TbLayoutGrid,
  TbCarouselHorizontal,
  TbLayoutBoard,
  TbSlideshow,
  TbBook2,
  TbArrowUp,
  TbArrowDown,
  TbSortAscending,
  TbSortDescending,
} from 'react-icons/tb';
import { RichTextEditor } from '@dashboard-shared/components';
import type { MediaItem } from '@dashboard-shared/components/media/types';
import type {
  ClientStoryDetail,
  StoryVideoItem,
  StorySoftwareDeviceMockup,
  StoryGalleryImage,
  StoryGalleryDesign,
  StoryGalleryOrder,
  StoryTechBadge,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import { AiFieldTrigger, type StoryAiFieldControls } from './ai-field-trigger';

interface GalleryDesignMeta {
  id: StoryGalleryDesign;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  isDefault?: boolean;
}

const GALLERY_DESIGN_OPTIONS: GalleryDesignMeta[] = [
  {
    id: 'editorial-bento',
    nameEn: 'Editorial Bento Grid',
    nameAr: 'شبكة التحرير الذكية (Bento)',
    descEn: 'Default asymmetric showcase with wide 2x2 featured highlights and companion stills.',
    descAr: 'التصميم الافتراضي: عرض تحريري متباين يبرز الصور المميزة بحجم مزدوج مع الباقي.',
    isDefault: true,
  },
  {
    id: 'uniform-grid',
    nameEn: 'Architectural Uniform Grid',
    nameAr: 'شبكة هندسية منتظمة (Grid)',
    descEn: 'Clean symmetrical 3-column architectural cards with equal proportions and lightbox zoom.',
    descAr: 'شبكة متساوية الأبعاد من 3 أعمدة تبرز الانضباط البصري مع معاينة مكبرة.',
  },
  {
    id: 'interactive-carousel',
    nameEn: 'Interactive Carousel Slider',
    nameAr: 'معرض سحب دائري تفاعلي (Carousel)',
    descEn: 'Smooth swipeable horizontal strip with navigation arrows, slide counters, and progress bar.',
    descAr: 'شريط عرض أفقي قابل للسحب والتمرير مع أسهم تنقل وعداد شرائح.',
  },
  {
    id: 'masonry-lookbook',
    nameEn: 'Masonry Lookbook Collage',
    nameAr: 'كولاج متدرج الارتفاعات (Masonry)',
    descEn: 'Agency lookbook layout preserving native portrait & landscape aspect ratios without cropping.',
    descAr: 'تخطيط إبداعي متعدد الارتفاعات يحفظ الأبعاد الطبيعية لكل صورة دون اقتصاص.',
  },
  {
    id: 'spotlight-filmstrip',
    nameEn: 'Spotlight Stage & Filmstrip',
    nameAr: 'منصة عرض رئيسية + شريط مصغرات',
    descEn: 'Large cinematic centerpiece stage with interactive bottom thumbnail filmstrip switcher.',
    descAr: 'شاشة عرض رئيسية سينمائية كبيرة مع شريط مصغرات سفلي للتنقل الفوري.',
  },
  {
    id: 'magazine-spread',
    nameEn: 'Editorial Magazine Spread',
    nameAr: 'عرض المجلة الفاخرة (Spread)',
    descEn: 'Alternates full-width panoramic hero frames with curated 60/40 asymmetric story pairs.',
    descAr: 'يتناوب بين إطارات بانورامية كاملة العرض وثنائيات غير متماثلة بأسلوب المجلات العالمية.',
  },
];

function renderGalleryDesignIcon(id: StoryGalleryDesign, className = 'w-4 h-4') {
  switch (id) {
    case 'uniform-grid':
      return <TbLayoutGrid className={className} />;
    case 'interactive-carousel':
      return <TbCarouselHorizontal className={className} />;
    case 'masonry-lookbook':
      return <TbLayoutBoard className={className} />;
    case 'spotlight-filmstrip':
      return <TbSlideshow className={className} />;
    case 'magazine-spread':
      return <TbBook2 className={className} />;
    default:
      return <TbLayoutCollage className={className} />;
  }
}

interface PortfolioMediaShowcaseSectionProps {
  story: ClientStoryDetail;
  onChange: (updated: ClientStoryDetail) => void;
  lang: string;
  onOpenMediaPicker: (
    callback: (url: string) => void,
    type: 'image' | 'video' | 'all'
  ) => void;
  onOpenMultiMediaPicker?: (
    callback: (urls: string[], items: MediaItem[]) => void,
    type?: 'image' | 'video' | 'all'
  ) => void;
  aiControls?: StoryAiFieldControls;
}

export function PortfolioMediaShowcaseSection({
  story,
  onChange,
  lang,
  onOpenMediaPicker,
  onOpenMultiMediaPicker,
  aiControls,
}: PortfolioMediaShowcaseSectionProps) {
  const isRtl = lang === 'ar';
  const showcase = story.mediaShowcase || {
    title: { en: 'Deliverables & Production', ar: 'معرض المخرجات والإنتاج' },
    description: { en: '', ar: '' },
  };

  const handleUpdateHeader = (
    field: 'titleEn' | 'titleAr' | 'descEn' | 'descAr',
    val: string
  ) => {
    const updated = { ...showcase };
    if (field === 'titleEn') {
      updated.title = { ...updated.title, en: val };
    } else if (field === 'titleAr') {
      updated.title = { ...updated.title, ar: val };
    } else if (field === 'descEn') {
      updated.description = { ...updated.description, en: val };
    } else if (field === 'descAr') {
      updated.description = { ...updated.description, ar: val };
    }
    onChange({ ...story, mediaShowcase: updated });
  };

  // ==========================================
  // TEMPLATE 1: MARKETING VIDEOS & GALLERY
  // ==========================================
  const videos = showcase.videos || [];
  const gallery = showcase.gallery || [];

  const handleAddVideo = () => {
    const newVideo: StoryVideoItem = {
      id: `vid-${Date.now()}`,
      title: { en: `Episode #${videos.length + 1}`, ar: `الحلقة #${videos.length + 1}` },
      duration: '0:30',
      videoUrl: '',
      posterUrl: '',
      aspectRatio: '16:9',
    };
    onChange({
      ...story,
      mediaShowcase: { ...showcase, videos: [...videos, newVideo] },
    });
  };

  const handleUpdateVideo = (
    index: number,
    field: keyof StoryVideoItem | 'titleEn' | 'titleAr',
    val: string
  ) => {
    const updated = [...videos];
    if (field === 'titleEn') {
      updated[index] = {
        ...updated[index],
        title: { ...updated[index].title, en: val },
      };
    } else if (field === 'titleAr') {
      updated[index] = {
        ...updated[index],
        title: { ...updated[index].title, ar: val },
      };
    } else {
      updated[index] = { ...updated[index], [field]: val };
    }
    onChange({
      ...story,
      mediaShowcase: { ...showcase, videos: updated },
    });
  };

  const handleRemoveVideo = (index: number) => {
    const updated = [...videos];
    updated.splice(index, 1);
    onChange({
      ...story,
      mediaShowcase: { ...showcase, videos: updated },
    });
  };

  const activeGalleryDesign: StoryGalleryDesign = showcase.galleryDesign || 'editorial-bento';
  const activeGalleryOrder: StoryGalleryOrder = showcase.galleryOrder || 'normal';

  const handleGalleryOrderChange = (order: StoryGalleryOrder) => {
    onChange({
      ...story,
      mediaShowcase: {
        ...showcase,
        galleryOrder: order,
      },
    });
  };

  // Gallery
  const handleAddGalleryImage = () => {
    const newImg: StoryGalleryImage = {
      src: '',
      alt: { en: 'Story Still', ar: 'لقطة من المشروع' },
      caption: { en: '', ar: '' },
      featured: false,
    };
    onChange({
      ...story,
      mediaShowcase: { ...showcase, gallery: [...gallery, newImg] },
    });
  };

  const handleBulkAddGalleryImages = (urls: string[], pickedItems?: MediaItem[]) => {
    if (!urls || urls.length === 0) return;

    const itemByUrl = new Map<string, MediaItem>();
    for (const mi of pickedItems || []) {
      itemByUrl.set(mi.url, mi);
    }

    const newImages: StoryGalleryImage[] = urls.map((url, idx) => {
      const meta = itemByUrl.get(url);
      const fallbackEn =
        meta?.alt?.trim() ||
        meta?.title?.trim() ||
        `${story.title?.en || 'Project Deliverable'} #${gallery.length + idx + 1}`;
      const fallbackAr =
        meta?.alt?.trim() ||
        meta?.title?.trim() ||
        `${story.title?.ar || 'مخرجات المشروع'} #${gallery.length + idx + 1}`;
      return {
        src: url,
        alt: { en: fallbackEn, ar: fallbackAr },
        caption: {
          en: meta?.caption?.trim() || '',
          ar: meta?.caption?.trim() || '',
        },
        width: meta?.width,
        height: meta?.height,
        featured: false,
      };
    });

    const cleanedExisting =
      gallery.length === 1 && !gallery[0].src.trim() ? [] : gallery;

    onChange({
      ...story,
      mediaShowcase: {
        ...showcase,
        gallery: [...cleanedExisting, ...newImages],
      },
    });
  };

  const handleGalleryDesignChange = (design: StoryGalleryDesign) => {
    onChange({
      ...story,
      mediaShowcase: {
        ...showcase,
        galleryDesign: design,
      },
    });
  };

  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;
    const updated = [...gallery];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    onChange({
      ...story,
      mediaShowcase: { ...showcase, gallery: updated },
    });
  };

  const handleUpdateGalleryImage = (
    index: number,
    field: keyof StoryGalleryImage | 'altEn' | 'altAr' | 'captionEn' | 'captionAr',
    val: string | boolean | number
  ) => {
    const updated = [...gallery];
    if (field === 'altEn') {
      updated[index] = {
        ...updated[index],
        alt: { ...(updated[index].alt || { en: '', ar: '' }), en: String(val) },
      };
    } else if (field === 'altAr') {
      updated[index] = {
        ...updated[index],
        alt: { ...(updated[index].alt || { en: '', ar: '' }), ar: String(val) },
      };
    } else if (field === 'captionEn') {
      updated[index] = {
        ...updated[index],
        caption: { ...(updated[index].caption || { en: '', ar: '' }), en: String(val) },
      };
    } else if (field === 'captionAr') {
      updated[index] = {
        ...updated[index],
        caption: { ...(updated[index].caption || { en: '', ar: '' }), ar: String(val) },
      };
    } else {
      updated[index] = { ...updated[index], [field]: val };
    }
    onChange({
      ...story,
      mediaShowcase: { ...showcase, gallery: updated },
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = [...gallery];
    updated.splice(index, 1);
    onChange({
      ...story,
      mediaShowcase: { ...showcase, gallery: updated },
    });
  };

  // ==========================================
  // TEMPLATE 2 & 3: DEVICE MOCKUPS & TECH STACK
  // ==========================================
  const mockups = showcase.mockups || [];
  const techStack = showcase.techStack || [];

  const handleAddMockup = (defaultType: 'desktop' | 'mobile' | 'tablet' = 'desktop') => {
    const newMockup: StorySoftwareDeviceMockup = {
      type: defaultType,
      image: '',
      title: { en: 'Screen Preview', ar: 'معاينة الشاشة' },
      mediaType: 'image',
    };
    onChange({
      ...story,
      mediaShowcase: { ...showcase, mockups: [...mockups, newMockup] },
    });
  };

  const handleUpdateMockup = (
    index: number,
    field: keyof StorySoftwareDeviceMockup | 'titleEn' | 'titleAr',
    val: string | StorySoftwareDeviceMockup['type'] | StorySoftwareDeviceMockup['mediaType']
  ) => {
    const updated = [...mockups];
    if (field === 'titleEn') {
      updated[index] = {
        ...updated[index],
        title: { ...(updated[index].title || { en: '', ar: '' }), en: String(val || '') },
      };
    } else if (field === 'titleAr') {
      updated[index] = {
        ...updated[index],
        title: { ...(updated[index].title || { en: '', ar: '' }), ar: String(val || '') },
      };
    } else {
      updated[index] = { ...updated[index], [field]: val };
    }
    onChange({
      ...story,
      mediaShowcase: { ...showcase, mockups: updated },
    });
  };

  const handleRemoveMockup = (index: number) => {
    const updated = [...mockups];
    updated.splice(index, 1);
    onChange({
      ...story,
      mediaShowcase: { ...showcase, mockups: updated },
    });
  };

  // Tech Stack
  const handleAddTech = () => {
    const newTech: StoryTechBadge = {
      name: 'Next.js',
      category: 'frontend',
    };
    onChange({
      ...story,
      mediaShowcase: { ...showcase, techStack: [...techStack, newTech] },
    });
  };

  const handleUpdateTech = (
    index: number,
    field: keyof StoryTechBadge,
    val: string | StoryTechBadge['category']
  ) => {
    const updated = [...techStack];
    updated[index] = { ...updated[index], [field]: val };
    onChange({
      ...story,
      mediaShowcase: { ...showcase, techStack: updated },
    });
  };

  const handleRemoveTech = (index: number) => {
    const updated = [...techStack];
    updated.splice(index, 1);
    onChange({
      ...story,
      mediaShowcase: { ...showcase, techStack: updated },
    });
  };

  return (
    <div id="sec-media" className="space-y-6 pt-2">
      <div className="border-b border-slate-200 pb-3">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
            08
          </span>
          <span>{isRtl ? 'معرض المخرجات والوسائط المتكيفة' : 'Adaptive Deliverables & Media Showcase'}</span>
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {isRtl
            ? 'يتم تخصيص هذا القسم تلقائياً وفقاً لنوع القالب المختار (تطبيق ويب، تطبيق جوال، فيديو، أو معرض صور).'
            : `Configured dynamically for the active template: ${story.templateType}`}
        </p>
      </div>

      {/* 1. Showcase Header (EN & AR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'عنوان المعرض (EN)' : 'Showcase Heading (EN)'}
          </label>
          <input
            type="text"
            value={showcase.title?.en || ''}
            onChange={(e) => handleUpdateHeader('titleEn', e.target.value)}
            placeholder="Deliverables & Production"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'عنوان المعرض (AR)' : 'Showcase Heading (AR)'}
          </label>
          <input
            type="text"
            dir="rtl"
            value={showcase.title?.ar || ''}
            onChange={(e) => handleUpdateHeader('titleAr', e.target.value)}
            placeholder="معرض المخرجات والإنتاج"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-medium font-arabic"
          />
        </div>
      </div>

      <RichTextEditor
        label={isRtl ? 'وصف المعرض (Showcase Description)' : 'Showcase Description (EN / AR)'}
        rows={3}
        valueEn={showcase.description?.en || ''}
        valueAr={showcase.description?.ar || ''}
        onChangeEn={(val) => handleUpdateHeader('descEn', val)}
        onChangeAr={(val) => handleUpdateHeader('descAr', val)}
      />

      {/* ========================================================================= */}
      {/* 2. TEMPLATE A & E: MARKETING VIDEO & MARKETING & BRANDING SHOWCASE        */}
      {/* ========================================================================= */}
      {(story.templateType === 'marketing-video-showcase' ||
        story.templateType === 'marketing-branding-showcase') && (
        <div className="space-y-6 pt-2">
          {story.templateType === 'marketing-branding-showcase' && (
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-900 leading-relaxed">
              {isRtl
                ? 'قالب التسويق والهوية البصرية مصمم للمشاريع المركزة التي تضم فيديو أو اثنين و/أو صورة أو صورتين رئيسيتين للهوية البصرية بدون معرض ضخم.'
                : 'Marketing & Branding template is optimized for focused projects with 1–2 campaign videos and/or 1–2 key branding visuals without requiring a large gallery or multi-episode series.'}
            </div>
          )}
          {/* Video Cuts / Episodes Repeater */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <TbMovie className="w-4 h-4 text-amber-600" />
                <span>
                  {story.templateType === 'marketing-branding-showcase'
                    ? isRtl
                      ? 'فيديو الحملة والهوية (1–2 فيديو اختياري)'
                      : 'Featured Campaign Videos (Optional, 1–2 Videos)'
                    : isRtl
                    ? 'حلقات ومقاطع الفيديو (Video Cuts & Episodes)'
                    : 'Video Cuts & Episodes'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddVideo}
                className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة مقطع فيديو' : 'Add Video Cut'}</span>
              </button>
            </div>

            {videos.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed">
                {isRtl ? 'لا توجد مقاطع فيديو مضافة بعد.' : 'No video cuts added yet. Click Add Video Cut above.'}
              </p>
            ) : (
              <div className="space-y-4">
                {videos.map((vid, vIdx) => (
                  <div
                    key={vid.id || vIdx}
                    className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{isRtl ? `فيديو #${vIdx + 1}` : `Video #${vIdx + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(vIdx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'عنوان المقطع (English)' : 'Cut Title (English)'}
                        </label>
                        <input
                          type="text"
                          value={vid.title?.en || ''}
                          onChange={(e) => handleUpdateVideo(vIdx, 'titleEn', e.target.value)}
                          placeholder="Episode 1: The Main Commercial"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'المدة الزمنية (Duration)' : 'Duration (e.g. 0:35)'}
                        </label>
                        <input
                          type="text"
                          value={vid.duration || ''}
                          onChange={(e) => handleUpdateVideo(vIdx, 'duration', e.target.value)}
                          placeholder="0:35"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {isRtl ? 'عنوان المقطع (العربية)' : 'Cut Title (Arabic)'}
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={vid.title?.ar || ''}
                        onChange={(e) => handleUpdateVideo(vIdx, 'titleAr', e.target.value)}
                        placeholder="الحلقة الأولى: الإعلان الرئيسي"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'رابط ملف الفيديو (MP4 / WebM)' : 'Video File URL (MP4 / WebM)'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={vid.videoUrl || ''}
                            onChange={(e) => handleUpdateVideo(vIdx, 'videoUrl', e.target.value)}
                            placeholder="https://pub-...r2.dev/.../video.mp4"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              onOpenMediaPicker(
                                (url) => handleUpdateVideo(vIdx, 'videoUrl', url),
                                'video'
                              )
                            }
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold shrink-0 border border-amber-200"
                          >
                            <TbVideo className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'صورة الغلاف (Poster WebP)' : 'Cut Poster URL'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={vid.posterUrl || ''}
                            onChange={(e) => handleUpdateVideo(vIdx, 'posterUrl', e.target.value)}
                            placeholder="https://pub-...r2.dev/.../poster.webp"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              onOpenMediaPicker(
                                (url) => handleUpdateVideo(vIdx, 'posterUrl', url),
                                'image'
                              )
                            }
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                          >
                            <TbPhoto className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TEMPLATE B, C & F: WEB APP, AI PLATFORMS & MOBILE APP SHOWCASE         */}
      {/* ========================================================================= */}
      {(story.templateType === 'software-web-app-showcase' ||
        story.templateType === 'ai-platform-showcase' ||
        story.templateType === 'mobile-app-showcase') && (
        <div className="space-y-6 pt-2">
          {story.templateType === 'ai-platform-showcase' && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 leading-relaxed">
              {isRtl
                ? 'قالب منصات الذكاء الاصطناعي: أضف شاشات المنصة (سطح المكتب/الجوال)، وفيديو العرض التفاعلي (اختياري)، وحزم تقنيات ونماذج الذكاء الاصطناعي.'
                : 'AI Platforms Template: Configure interactive desktop/mobile mockups, an optional live AI workflow demo video, and AI models & infrastructure tech badges.'}
            </div>
          )}
          {/* Device Mockups Repeater */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <TbDeviceDesktop className="w-4 h-4 text-blue-600" />
                <span>
                  {isRtl
                    ? 'شاشات وأطر الأجهزة (Device Mockups & Chassis)'
                    : 'Device Frames & Screen Assets'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {(story.templateType === 'software-web-app-showcase' ||
                  story.templateType === 'ai-platform-showcase') && (
                  <button
                    type="button"
                    onClick={() => handleAddMockup('desktop')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    <TbPlus className="w-3 h-3" />
                    <span>{isRtl ? 'إطار ماك (Desktop)' : 'Add Desktop'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleAddMockup('mobile')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:underline cursor-pointer"
                >
                  <TbPlus className="w-3 h-3" />
                  <span>{isRtl ? 'إطار جوال (Mobile)' : 'Add Mobile'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddMockup('tablet')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline cursor-pointer"
                >
                  <TbPlus className="w-3 h-3" />
                  <span>{isRtl ? 'إطار لوحي (Tablet)' : 'Add Tablet'}</span>
                </button>
              </div>
            </div>

            {mockups.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed">
                {isRtl
                  ? 'لا توجد شاشات أجهزة مضافة بعد. اضغط على خيارات الإضافة أعلاه.'
                  : 'No device screens added yet. Click Add Desktop, Mobile, or Tablet above.'}
              </p>
            ) : (
              <div className="space-y-3">
                {mockups.map((mockup, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <select
                          value={mockup.type}
                          onChange={(e) =>
                            handleUpdateMockup(
                              mIdx,
                              'type',
                              e.target.value as StorySoftwareDeviceMockup['type']
                            )
                          }
                          className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-semibold"
                        >
                          <option value="desktop">macOS Desktop Chassis</option>
                          <option value="mobile">Smartphone Chassis (Dynamic Island)</option>
                          <option value="tablet">Tablet Bezel Chassis</option>
                        </select>

                        <select
                          value={mockup.mediaType || 'image'}
                          onChange={(e) =>
                            handleUpdateMockup(
                              mIdx,
                              'mediaType',
                              e.target.value as StorySoftwareDeviceMockup['mediaType']
                            )
                          }
                          className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                        >
                          <option value="image">Static Image (WebP)</option>
                          <option value="gif">Animated GIF (Full-Motion)</option>
                          <option value="video">Portrait Video (MP4)</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMockup(mIdx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'عنوان الشاشة (EN)' : 'Screen Title (EN)'}
                        </label>
                        <input
                          type="text"
                          value={mockup.title?.en || ''}
                          onChange={(e) => handleUpdateMockup(mIdx, 'titleEn', e.target.value)}
                          placeholder="e.g. Real-Time Analytics Dashboard"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'عنوان الشاشة (AR)' : 'Screen Title (AR)'}
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={mockup.title?.ar || ''}
                          onChange={(e) => handleUpdateMockup(mIdx, 'titleAr', e.target.value)}
                          placeholder="مثال: لوحة التحكم والتحليلات اللحظية"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {isRtl ? 'رابط ملف الصورة / GIF' : 'Image / Full-Motion GIF Asset URL'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={mockup.image}
                          onChange={(e) => handleUpdateMockup(mIdx, 'image', e.target.value)}
                          placeholder="https://pub-...r2.dev/.../screen.webp"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onOpenMediaPicker(
                              (url) => handleUpdateMockup(mIdx, 'image', url),
                              'image'
                            )
                          }
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                        >
                          <TbPhoto className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {mockup.mediaType === 'video' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'رابط الفيديو داخل الجهاز' : 'In-Device Portrait Video URL'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={mockup.videoUrl || ''}
                            onChange={(e) =>
                              handleUpdateMockup(mIdx, 'videoUrl', e.target.value)
                            }
                            placeholder="https://pub-...r2.dev/.../app-demo.mp4"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              onOpenMediaPicker(
                                (url) => handleUpdateMockup(mIdx, 'videoUrl', url),
                                'video'
                              )
                            }
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold shrink-0 border border-amber-200"
                          >
                            <TbVideo className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Demo Video (Optional) */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <TbVideo className="w-4 h-4 text-amber-600" />
              <span>
                {story.templateType === 'ai-platform-showcase'
                  ? isRtl
                    ? 'فيديو العرض الحي لمنصة الذكاء الاصطناعي (اختياري)'
                    : 'Interactive AI Platform Demo Video (Optional)'
                  : isRtl
                  ? 'فيديو العرض التفاعلي للتطبيق (اختياري)'
                  : 'Interactive App Demo Video (Optional)'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isRtl ? 'رابط ملف الفيديو (MP4 / WebM)' : 'Demo Video URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={showcase.demoVideo || ''}
                    onChange={(e) =>
                      onChange({
                        ...story,
                        mediaShowcase: { ...showcase, demoVideo: e.target.value },
                      })
                    }
                    placeholder="https://pub-...r2.dev/.../demo.mp4"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onOpenMediaPicker(
                        (url) =>
                          onChange({
                            ...story,
                            mediaShowcase: { ...showcase, demoVideo: url },
                          }),
                        'video'
                      )
                    }
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold shrink-0 border border-amber-200"
                  >
                    <TbVideo className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isRtl ? 'صورة غلاف الفيديو (اختياري)' : 'Demo Video Poster URL (Optional)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={showcase.demoVideoPoster || ''}
                    onChange={(e) =>
                      onChange({
                        ...story,
                        mediaShowcase: { ...showcase, demoVideoPoster: e.target.value },
                      })
                    }
                    placeholder="https://pub-...r2.dev/.../poster.webp"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onOpenMediaPicker(
                        (url) =>
                          onChange({
                            ...story,
                            mediaShowcase: { ...showcase, demoVideoPoster: url },
                          }),
                        'image'
                      )
                    }
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                  >
                    <TbPhoto className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Badges Repeater */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <TbStack2 className="w-4 h-4 text-persici-crimson" />
                <span>{isRtl ? 'حزم التقنيات المستخدمة (Technology Stack)' : 'Technology Stack Badges'}</span>
              </div>
              <div className="flex items-center gap-2">
                {aiControls && (
                  <AiFieldTrigger
                    lang={lang}
                    hasReference={aiControls.hasReference}
                    allowWithoutReference
                    onMissingReference={aiControls.onMissingReference}
                    isLoading={aiControls.generatingFieldKey === 'tech_stack'}
                    onGenerate={() =>
                      aiControls.onGenerateField('tech_stack', { keyLabel: 'tech_stack' })
                    }
                    labelEn="Generate Tech Stack with AI"
                    labelAr="استخراج التقنيات بالذكاء الاصطناعي"
                  />
                )}
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إضافة تقنية' : 'Add Tech Badge'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, tIdx) => (
                <div
                  key={tIdx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) => handleUpdateTech(tIdx, 'name', e.target.value)}
                    placeholder="Next.js"
                    className="w-24 px-1.5 py-0.5 text-xs bg-white border border-slate-200 rounded font-semibold"
                  />
                  <select
                    value={tech.category || 'frontend'}
                    onChange={(e) => handleUpdateTech(tIdx, 'category', e.target.value)}
                    className="text-[11px] bg-transparent text-slate-500 outline-none"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="cloud">Cloud</option>
                    <option value="tool">Tool</option>
                    <option value="design">Design</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tIdx)}
                    className="text-slate-400 hover:text-red-600 p-0.5"
                  >
                    <TbTrash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. UNIVERSAL VISUAL GALLERY & LAYOUT DESIGN (ALL TEMPLATES)               */}
      {/* ========================================================================= */}
      <div className="space-y-5 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <TbLibraryPhoto className="w-4 h-4 text-emerald-600" />
              <span>
                {story.templateType === 'marketing-branding-showcase'
                  ? isRtl
                    ? 'معرض صور العلامة التجارية وتصميم العرض (1–2 صورة أو أكثر)'
                    : 'Brand Visual Gallery & Display Layout'
                  : isRtl
                  ? 'معرض الصور المتكامل وتصميم العرض (متاح لجميع القوالب)'
                  : 'Visual Image Gallery & Layout Design (All Templates)'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                {gallery.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isRtl
                ? 'اختر نمط عرض المعرض المناسب (الافتراضي: شبكة التحرير Bento)، ثم حدد صوراً متعددة دفعة واحدة أو ارفع مجلداً كاملاً من مكتبة R2.'
                : 'Choose one of 6 gallery layouts (Editorial Bento is selected by default), and bulk-select or bulk-upload multiple images into any folder/subfolder.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenMultiMediaPicker && (
              <button
                type="button"
                onClick={() => onOpenMultiMediaPicker(handleBulkAddGalleryImages, 'image')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <TbPhotoPlus className="w-4 h-4" />
                <span>{isRtl ? 'تحديد / رفع صور متعددة' : 'Bulk Select / Upload Images'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAddGalleryImage}
              className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة صورة مفردة' : 'Add Single Image'}</span>
            </button>
          </div>
        </div>

        {/* 6 Best-Practice Gallery Designs Selector */}
        <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              {isRtl ? 'تصميم عرض المعرض (Gallery Display Design)' : 'Select Gallery Display Design'}
            </label>
            <span className="text-[11px] font-medium text-slate-500">
              {isRtl ? 'الافتراضي:' : 'Default:'}{' '}
              <strong className="text-slate-800">Editorial Bento Grid</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {GALLERY_DESIGN_OPTIONS.map((opt) => {
              const isSelected = activeGalleryDesign === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleGalleryDesignChange(opt.id)}
                  className={`p-3 rounded-xl border text-start transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-persici-crimson bg-white ring-2 ring-persici-crimson/20 shadow-xs'
                      : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-persici-crimson text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {renderGalleryDesignIcon(opt.id, 'w-4 h-4')}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {isRtl ? opt.nameAr : opt.nameEn}
                      </span>
                      {opt.isDefault && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase">
                          {isRtl ? 'افتراضي' : 'Default'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {isRtl ? opt.descAr : opt.descEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Gallery Display Order Selector (Normal 1..N vs Reverse N..1) */}
          <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                {isRtl ? 'ترتيب عرض صور المعرض (Gallery Display Order)' : 'Gallery Display Order'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isRtl
                  ? 'اختر الترتيب العادي (من الأولى للأخيرة) أو العكسي (من الأخيرة للأولى).'
                  : 'Choose Normal order (1, 2, 3...) or Reverse order so the last image appears first.'}
              </p>
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleGalleryOrderChange('normal')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGalleryOrder === 'normal'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TbSortAscending className="w-3.5 h-3.5" />
                <span>{isRtl ? 'الترتيب العادي (1 ← الأخير)' : 'Normal Order (1 → N)'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleGalleryOrderChange('reverse')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGalleryOrder === 'reverse'
                    ? 'bg-persici-crimson text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TbSortDescending className="w-3.5 h-3.5" />
                <span>{isRtl ? 'الترتيب العكسي (الأخير ← 1)' : 'Reverse Order (N → 1)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Images Grid */}
        {gallery.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
            <TbLibraryPhoto className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">
              {isRtl
                ? 'لا توجد صور مضافة في المعرض بعد.'
                : 'No images added to the gallery yet.'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isRtl
                ? 'اضغط على "تحديد / رفع صور متعددة" لإضافة أو رفع مجموعة صور دفعة واحدة في مجلد المشروع.'
                : 'Use "Bulk Select / Upload Images" above to pick or upload multiple assets at once into any folder/subfolder.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {gallery.map((img, gIdx) => (
              <div
                key={gIdx}
                className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">
                      {isRtl ? `صورة #${gIdx + 1}` : `Image #${gIdx + 1}`}
                    </span>
                    {activeGalleryOrder === 'reverse' && gallery.length > 1 && (
                      <span className="px-1.5 py-0.2 rounded bg-persici-crimson/10 text-persici-crimson text-[10px] font-bold">
                        {isRtl
                          ? `تظهر كـ #${gallery.length - gIdx}`
                          : `Displays #${gallery.length - gIdx}`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activeGalleryDesign === 'editorial-bento' && (
                      <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer me-1">
                        <input
                          type="checkbox"
                          checked={Boolean(img.featured)}
                          onChange={(e) =>
                            handleUpdateGalleryImage(gIdx, 'featured', e.target.checked)
                          }
                          className="rounded text-persici-crimson"
                        />
                        <span>Featured (2x2)</span>
                      </label>
                    )}

                    <button
                      type="button"
                      disabled={gIdx === 0}
                      onClick={() => handleMoveGalleryImage(gIdx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-white disabled:opacity-30 cursor-pointer"
                      title={isRtl ? 'تحريك لأعلى' : 'Move earlier'}
                    >
                      <TbArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={gIdx === gallery.length - 1}
                      onClick={() => handleMoveGalleryImage(gIdx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-white disabled:opacity-30 cursor-pointer"
                      title={isRtl ? 'تحريك لأسفل' : 'Move later'}
                    >
                      <TbArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(gIdx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white cursor-pointer"
                      title={isRtl ? 'حذف الصورة' : 'Remove image'}
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Live Thumbnail + URL Picker */}
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 relative shrink-0 flex items-center justify-center">
                    {img.src.trim() ? (
                      <Image
                        src={img.src}
                        alt={img.alt?.en || 'Gallery preview'}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <TbPhoto className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={img.src}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'src', e.target.value)}
                    placeholder="https://pub-...r2.dev/.../image.webp"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onOpenMediaPicker(
                        (url) => handleUpdateGalleryImage(gIdx, 'src', url),
                        'image'
                      )
                    }
                    className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                    title={isRtl ? 'اختيار من مكتبة الوسائط' : 'Pick from Media Library'}
                  >
                    <TbPhoto className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={img.alt?.en || ''}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'altEn', e.target.value)}
                    placeholder="Alt Text (EN)"
                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={img.alt?.ar || ''}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'altAr', e.target.value)}
                    placeholder="النص البديل (AR)"
                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-arabic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={img.caption?.en || ''}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'captionEn', e.target.value)}
                    placeholder="Caption Overlay (EN - optional)"
                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={img.caption?.ar || ''}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'captionAr', e.target.value)}
                    placeholder="التعليق الظاهر (AR - اختياري)"
                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-arabic"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
