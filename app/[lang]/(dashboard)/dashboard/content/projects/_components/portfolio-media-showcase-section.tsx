'use client';

import React from 'react';
import {
  TbPlus,
  TbTrash,
  TbVideo,
  TbPhoto,
  TbDeviceDesktop,
  TbMovie,
  TbStack2,
} from 'react-icons/tb';
import type {
  ClientStoryDetail,
  StoryVideoItem,
  StorySoftwareDeviceMockup,
  StoryGalleryImage,
  StoryTechBadge,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioMediaShowcaseSectionProps {
  story: ClientStoryDetail;
  onChange: (updated: ClientStoryDetail) => void;
  lang: string;
  onOpenMediaPicker: (
    callback: (url: string) => void,
    type: 'image' | 'video' | 'all'
  ) => void;
}

export function PortfolioMediaShowcaseSection({
  story,
  onChange,
  lang,
  onOpenMediaPicker,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'وصف المعرض (EN)' : 'Showcase Description (EN)'}
          </label>
          <textarea
            rows={2}
            value={showcase.description?.en || ''}
            onChange={(e) => handleUpdateHeader('descEn', e.target.value)}
            placeholder="Explore the multi-faceted deliverables engineered for this project..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'وصف المعرض (AR)' : 'Showcase Description (AR)'}
          </label>
          <textarea
            rows={2}
            dir="rtl"
            value={showcase.description?.ar || ''}
            onChange={(e) => handleUpdateHeader('descAr', e.target.value)}
            placeholder="استكشف مخرجات العمل المتكاملة التي تم تطويرها لهذا المشروع..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-arabic"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TEMPLATE A: MARKETING VIDEO SHOWCASE                                   */}
      {/* ========================================================================= */}
      {story.templateType === 'marketing-video-showcase' && (
        <div className="space-y-6 pt-2">
          {/* Video Cuts / Episodes Repeater */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <TbMovie className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? 'حلقات ومقاطع الفيديو (Video Cuts & Episodes)' : 'Video Cuts & Episodes'}</span>
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

          {/* Stills Photo Gallery */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <TbPhoto className="w-4 h-4 text-emerald-600" />
                <span>{isRtl ? 'معرض اللقطات الثابتة (Photo Stills Gallery)' : 'Photo Stills Gallery'}</span>
              </div>
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة صورة' : 'Add Still Image'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gallery.map((img, gIdx) => (
                <div
                  key={gIdx}
                  className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2 relative"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{isRtl ? `صورة #${gIdx + 1}` : `Still #${gIdx + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(gIdx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={img.src}
                      onChange={(e) => handleUpdateGalleryImage(gIdx, 'src', e.target.value)}
                      placeholder="https://pub-...r2.dev/.../still.webp"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onOpenMediaPicker(
                          (url) => handleUpdateGalleryImage(gIdx, 'src', url),
                          'image'
                        )
                      }
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={img.alt?.en || ''}
                      onChange={(e) => handleUpdateGalleryImage(gIdx, 'altEn', e.target.value)}
                      placeholder="Alt text (EN)"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TEMPLATE B & C: SOFTWARE WEB APP & MOBILE APP SHOWCASE                 */}
      {/* ========================================================================= */}
      {(story.templateType === 'software-web-app-showcase' ||
        story.templateType === 'mobile-app-showcase') && (
        <div className="space-y-6 pt-2">
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
                {story.templateType === 'software-web-app-showcase' && (
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

          {/* Tech Stack Badges Repeater */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <TbStack2 className="w-4 h-4 text-persici-crimson" />
                <span>{isRtl ? 'حزم التقنيات المستخدمة (Technology Stack)' : 'Technology Stack Badges'}</span>
              </div>
              <button
                type="button"
                onClick={handleAddTech}
                className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة تقنية' : 'Add Tech Badge'}</span>
              </button>
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
      {/* 4. TEMPLATE D: IMAGE GALLERY SHOWCASE                                     */}
      {/* ========================================================================= */}
      {story.templateType === 'image-gallery-showcase' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <TbPhoto className="w-4 h-4 text-emerald-600" />
              <span>{isRtl ? 'معرض صور الهوية البصرية (Visual Gallery)' : 'Branding & Visual Gallery'}</span>
            </div>
            <button
              type="button"
              onClick={handleAddGalleryImage}
              className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة صورة' : 'Add Image'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gallery.map((img, gIdx) => (
              <div
                key={gIdx}
                className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2 relative"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{isRtl ? `صورة #${gIdx + 1}` : `Image #${gIdx + 1}`}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
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
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(gIdx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={img.src}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'src', e.target.value)}
                    placeholder="https://pub-...r2.dev/.../image.webp"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onOpenMediaPicker(
                        (url) => handleUpdateGalleryImage(gIdx, 'src', url),
                        'image'
                      )
                    }
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                  >
                    <TbPhoto className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={img.alt?.en || ''}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'altEn', e.target.value)}
                    placeholder="Caption (EN)"
                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={img.alt?.ar || ''}
                    onChange={(e) => handleUpdateGalleryImage(gIdx, 'altAr', e.target.value)}
                    placeholder="الوصف (AR)"
                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-arabic"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
