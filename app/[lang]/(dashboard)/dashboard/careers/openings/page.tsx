'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  TbBriefcase,
  TbMapPin,
  TbBuildingCommunity,
  TbClock,
  TbEye,
  TbCheck,
  TbRefresh,
  TbSearch,
  TbUsers,
  TbCoin,
  TbX,
  TbExternalLink,
  TbListCheck,
  TbTarget,
  TbPlus,
  TbEdit,
  TbTrash,
  TbDeviceFloppy,
  TbSparkles,
  TbHeartHandshake,
  TbCode,
  TbWorld,
} from 'react-icons/tb';

interface LocalizedField {
  en: string;
  ar: string;
}

export interface JobOpening {
  id?: string;
  _id?: string;
  slug: string;
  departmentSlug: 'engineering' | 'growth' | 'creative' | 'strategy' | 'data' | string;
  locationSlug: 'dubai' | 'riyadh' | 'amman' | 'remote' | string;
  title: LocalizedField;
  department: LocalizedField;
  location: LocalizedField;
  type: LocalizedField;
  experience?: LocalizedField;
  workPolicy?: LocalizedField;
  salaryRange?: LocalizedField;
  summary?: LocalizedField;
  description?: LocalizedField;
  mission?: LocalizedField;
  responsibilities?: LocalizedField[];
  requirements?: LocalizedField[];
  preferredQualifications?: LocalizedField[];
  techStack?: string[];
  benefits?: LocalizedField[];
  isActive?: boolean;
  featured?: boolean;
  postedDate?: string;
}

const DEPARTMENTS = [
  { slug: 'engineering', en: 'Engineering & AI', ar: 'الهندسة والذكاء الاصطناعي' },
  { slug: 'growth', en: 'Growth Marketing & Performance', ar: 'التسويق ونمو الأداء' },
  { slug: 'creative', en: 'Brand & Creative Craft', ar: 'الهوية والتصميم الإبداعي' },
  { slug: 'strategy', en: 'Digital Strategy & Advisory', ar: 'الاستراتيجية والاستشارات الرقمية' },
  { slug: 'data', en: 'Data Intelligence & Analytics', ar: 'ذكاء البيانات والتحليلات' },
];

const LOCATIONS = [
  { slug: 'dubai', en: 'Dubai HQ / Hybrid', ar: 'مقر دبي / هجين' },
  { slug: 'riyadh', en: 'Riyadh Hub / On-site', ar: 'مقر الرياض / حضوري' },
  { slug: 'amman', en: 'Amman Tech Lab / Hybrid', ar: 'مختبر عمّان التقني / هجين' },
  { slug: 'remote', en: 'Remote (GCC / EMEA)', ar: 'عن بُعد (الخليج وأوروبا والشرق الأوسط)' },
];

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const emptyJobForm: JobOpening = {
  slug: '',
  departmentSlug: 'engineering',
  locationSlug: 'dubai',
  title: { en: '', ar: '' },
  department: { en: 'Engineering & AI', ar: 'الهندسة والذكاء الاصطناعي' },
  location: { en: 'Dubai HQ / Hybrid', ar: 'مقر دبي / هجين' },
  type: { en: 'Full-time Permanent', ar: 'دوام كامل دائم' },
  experience: { en: 'Senior / Lead (5+ Years)', ar: 'مستوى أول / قيادي (٥+ سنوات)' },
  workPolicy: { en: 'Hybrid — Dubai HQ', ar: 'هجين — مقر دبي' },
  salaryRange: { en: '$110,000 - $145,000 + Equity', ar: '١١٠،٠٠٠ - ١٤٥،٠٠٠ دولار + أسهم' },
  summary: { en: '', ar: '' },
  mission: { en: '', ar: '' },
  responsibilities: [{ en: '', ar: '' }],
  requirements: [{ en: '', ar: '' }],
  preferredQualifications: [{ en: '', ar: '' }],
  techStack: ['Next.js', 'TypeScript', 'Tailwind'],
  benefits: [{ en: 'Comprehensive health & dental coverage', ar: 'تأمين صحي وطبي شامل' }],
  isActive: true,
  featured: false,
  postedDate: 'March 2026',
};

export default function CareerOpeningsPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Modals state
  const [activeJob, setActiveJob] = useState<JobOpening | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<JobOpening>(emptyJobForm);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'mission' | 'responsibilities' | 'requirements' | 'extras'>('basics');
  const [newTechInput, setNewTechInput] = useState('');

  const fetchOpenings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/careers?includeInactive=true', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.openings)) {
        setOpenings(data.openings);
      }
    } catch (err) {
      console.error('Failed to load career openings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  const getLocString = (field?: LocalizedField | null): string => {
    if (!field) return '';
    return isRtl ? field.ar || field.en || '' : field.en || field.ar || '';
  };

  const getLocArrayItem = (item: LocalizedField | string): string => {
    if (typeof item === 'string') return item;
    return isRtl ? item.ar || item.en : item.en || item.ar;
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      ...emptyJobForm,
      postedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
    setIsEditing(false);
    setActiveTab('basics');
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (job: JobOpening) => {
    setFormData({
      ...job,
      responsibilities: job.responsibilities?.length ? job.responsibilities : [{ en: '', ar: '' }],
      requirements: job.requirements?.length ? job.requirements : [{ en: '', ar: '' }],
      preferredQualifications: job.preferredQualifications?.length ? job.preferredQualifications : [{ en: '', ar: '' }],
      benefits: job.benefits?.length ? job.benefits : [{ en: '', ar: '' }],
      techStack: job.techStack || [],
    });
    setIsEditing(true);
    setActiveTab('basics');
    setIsEditorOpen(true);
  };

  // Save Career Opening
  const handleSaveOpening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.en || !formData.title.ar) {
      alert(isRtl ? 'يرجى إدخال عنوان الوظيفة باللغتين الإنجليزية والعربية' : 'Please provide job titles in both English and Arabic.');
      return;
    }

    setSaving(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/careers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsEditorOpen(false);
        fetchOpenings();
      } else {
        alert(data.error || 'Failed to save career opening');
      }
    } catch (err) {
      console.error('Failed to save opening:', err);
      alert('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Career Opening
  const handleDeleteOpening = async (job: JobOpening) => {
    const confirmMsg = isRtl
      ? `هل أنت متأكد من رغبتك في حذف وظيفة "${job.title.ar || job.title.en}" نهائياً؟`
      : `Are you sure you want to delete opening "${job.title.en}"?`;
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/careers?slug=${encodeURIComponent(job.slug)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOpenings((prev) => prev.filter((j) => j.slug !== job.slug));
        if (activeJob?.slug === job.slug) setActiveJob(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete opening');
      }
    } catch (err) {
      console.error('Failed to delete opening:', err);
    }
  };

  // Tech stack chip handlers
  const handleAddTech = () => {
    if (!newTechInput.trim()) return;
    if (!formData.techStack?.includes(newTechInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...(prev.techStack || []), newTechInput.trim()],
      }));
    }
    setNewTechInput('');
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: (prev.techStack || []).filter((t) => t !== techToRemove),
    }));
  };

  // Dynamic repeater array handlers
  const handleAddArrayItem = (field: 'responsibilities' | 'requirements' | 'preferredQualifications' | 'benefits') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), { en: '', ar: '' }],
    }));
  };

  const handleUpdateArrayItem = (
    field: 'responsibilities' | 'requirements' | 'preferredQualifications' | 'benefits',
    index: number,
    subfield: 'en' | 'ar',
    value: string
  ) => {
    setFormData((prev) => {
      const list = [...(prev[field] || [])];
      list[index] = { ...list[index], [subfield]: value };
      return { ...prev, [field]: list };
    });
  };

  const handleRemoveArrayItem = (
    field: 'responsibilities' | 'requirements' | 'preferredQualifications' | 'benefits',
    index: number
  ) => {
    setFormData((prev) => {
      const list = [...(prev[field] || [])];
      list.splice(index, 1);
      return { ...prev, [field]: list };
    });
  };

  const filteredOpenings = openings.filter((j) => {
    const matchesDept = selectedDept === 'all' || j.departmentSlug === selectedDept;
    const searchLower = search.toLowerCase();
    const titleEn = j.title?.en?.toLowerCase() || '';
    const titleAr = j.title?.ar || '';
    const deptEn = j.department?.en?.toLowerCase() || '';
    const deptAr = j.department?.ar || '';

    const matchesSearch =
      !search ||
      titleEn.includes(searchLower) ||
      titleAr.includes(search) ||
      deptEn.includes(searchLower) ||
      deptAr.includes(search);

    return matchesDept && matchesSearch;
  });

  const departments = Array.from(new Set(openings.map((o) => o.departmentSlug).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <TbBuildingCommunity className="w-4 h-4" />
            <span>{isRtl ? 'إدارة التوظيف والمواهب' : 'Talent Acquisition & Careers'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRtl ? 'الوظائف الشاغرة وإدارة النشر' : 'Active Job Postings & Publishing'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'إنشاء ونشر الوظائف بجميع تفاصيلها لتتوافق بدقة مع صفحة تفاصيل الوظيفة العامة ومتابعة المتقدمين.'
              : 'Create, publish, and edit career openings tailored precisely to the public career detail design.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-persici-crimson hover:bg-red-700 rounded-xl transition-colors shadow-sm"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'نشر وظيفة جديدة' : 'Publish New Career'}</span>
          </button>

          <Link
            href={`/${lang}/dashboard/careers/applicants`}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbUsers className="w-4 h-4" />
            <span>{isRtl ? 'المتقدمين' : 'Applicants'}</span>
          </Link>

          <button
            type="button"
            onClick={fetchOpenings}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title={isRtl ? 'تحديث' : 'Refresh'}
          >
            <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Department Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            type="button"
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedDept === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isRtl ? `كل الأقسام (${openings.length})` : `All Departments (${openings.length})`}
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap uppercase text-[11px] ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {dept.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full">
          <TbSearch className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            placeholder={isRtl ? 'البحث عن وظيفة بالعنوان أو القسم...' : 'Search openings by title or department...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson`}
          />
        </div>
      </div>

      {/* Openings Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-3" />
          <p className="text-sm">{isRtl ? 'جارٍ تحميل الوظائف...' : 'Loading job openings...'}</p>
        </div>
      ) : filteredOpenings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
          <TbBriefcase className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">
            {isRtl ? 'لم يتم العثور على وظائف مطابقة' : 'No job openings found'}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-persici-crimson text-white rounded-xl text-xs font-semibold"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'نشر أول وظيفة الآن' : 'Publish First Career Now'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpenings.map((job) => {
            const summaryText =
              getLocString(job.summary) ||
              getLocString(job.description) ||
              (job.summary?.en || job.description?.en || '');

            return (
              <div
                key={job.slug}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                      {getLocString(job.department) || job.departmentSlug}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {job.featured && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <TbSparkles className="w-3 h-3" />
                          <span>{isRtl ? 'مميزة' : 'Featured'}</span>
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          job.isActive !== false
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-slate-500 bg-slate-100 border-slate-200'
                        }`}
                      >
                        {job.isActive !== false ? (isRtl ? 'نشطة' : 'Active') : isRtl ? 'مؤرشفة' : 'Archived'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {isRtl ? job.title?.ar || job.title?.en : job.title?.en || job.title?.ar}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRtl ? job.title?.en : job.title?.ar}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <TbMapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{getLocString(job.location)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TbClock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{getLocString(job.type)}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <TbCoin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{getLocString(job.salaryRange)}</span>
                      </div>
                    )}
                  </div>

                  {summaryText && (
                    <p className="text-xs text-slate-600 line-clamp-3 pt-1 leading-relaxed">
                      {summaryText}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveJob(job)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        {isRtl ? 'التفاصيل' : 'Details'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs transition-colors"
                        title={isRtl ? 'تعديل الوظيفة' : 'Edit Opening'}
                      >
                        <TbEdit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOpening(job)}
                        className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs transition-colors"
                        title={isRtl ? 'حذف الوظيفة' : 'Delete Opening'}
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/${lang}/careers/${job.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-persici-crimson hover:underline flex items-center gap-1"
                      >
                        <TbExternalLink className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'الموقع' : 'Live'}</span>
                      </a>

                      <Link
                        href={`/${lang}/dashboard/careers/applicants?role=${job.slug}`}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        {isRtl ? 'المتقدمين' : 'Applicants'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* PUBLISH & EDIT CAREER OPENING MODAL (FULL CRAFT SUITE)              */}
      {/* =================================================================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
                  <TbBriefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {isEditing
                      ? isRtl
                        ? `تعديل الوظيفة: ${formData.title.ar || formData.title.en}`
                        : `Edit Opening: ${formData.title.en}`
                      : isRtl
                      ? 'نشر فرصة عمل جديدة'
                      : 'Publish New Career Opening'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isRtl
                      ? 'جميع الحقول مهيأة لتناسب تصميم صفحة تفاصيل الوظيفة العامة مباشرة'
                      : 'Configured strictly to match the public career detail page specification.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('basics')}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'basics'
                    ? 'border-persici-crimson text-persici-crimson'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. {isRtl ? 'المعلومات الأساسية' : 'Basic Specifications'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mission')}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'mission'
                    ? 'border-persici-crimson text-persici-crimson'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. {isRtl ? 'الرؤية والهدف (Mission)' : 'Mission & Context'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('responsibilities')}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'responsibilities'
                    ? 'border-persici-crimson text-persici-crimson'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. {isRtl ? 'المسؤوليات والمهام' : 'Responsibilities'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('requirements')}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'requirements'
                    ? 'border-persici-crimson text-persici-crimson'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. {isRtl ? 'المؤهلات والشروط' : 'Requirements'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('extras')}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'extras'
                    ? 'border-persici-crimson text-persici-crimson'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                5. {isRtl ? 'التقنيات والمزايا' : 'Tech Stack & Perks'}
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveOpening} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basics' && (
                <div className="space-y-5">
                  {/* Job Title EN & AR */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Job Title (English) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Staff Full-Stack & Generative AI Engineer"
                        value={formData.title.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            title: { ...prev.title, en: val },
                            slug: isEditing ? prev.slug : slugify(val),
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                        عنوان الوظيفة (العربية) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        dir="rtl"
                        placeholder="مثال: مهندس أول للنظم التوليدية والذكاء الاصطناعي"
                        value={formData.title.ar}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: { ...prev.title, ar: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                      />
                    </div>
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL Slug & Path
                    </label>
                    <div className="flex items-center gap-1 font-mono text-xs text-slate-400 bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl">
                      <span>/careers/</span>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                        }
                        className="flex-1 bg-transparent text-slate-900 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Department & Location Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department Category
                      </label>
                      <select
                        value={formData.departmentSlug}
                        onChange={(e) => {
                          const d = DEPARTMENTS.find((x) => x.slug === e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            departmentSlug: e.target.value as any,
                            department: d ? { en: d.en, ar: d.ar } : prev.department,
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.slug} value={d.slug}>
                            {d.en} — {d.ar}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Location Hub
                      </label>
                      <select
                        value={formData.locationSlug}
                        onChange={(e) => {
                          const l = LOCATIONS.find((x) => x.slug === e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            locationSlug: e.target.value as any,
                            location: l ? { en: l.en, ar: l.ar } : prev.location,
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                      >
                        {LOCATIONS.map((l) => (
                          <option key={l.slug} value={l.slug}>
                            {l.en} — {l.ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Work Policy, Seniority, Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Work Policy (EN / AR)
                      </label>
                      <input
                        type="text"
                        placeholder="Hybrid — Dubai HQ"
                        value={formData.workPolicy?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workPolicy: { en: e.target.value, ar: prev.workPolicy?.ar || '' },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-1.5"
                      />
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="هجين — مقر دبي"
                        value={formData.workPolicy?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workPolicy: { en: prev.workPolicy?.en || '', ar: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Seniority / Experience (EN / AR)
                      </label>
                      <input
                        type="text"
                        placeholder="Senior / Lead (5+ Years)"
                        value={formData.experience?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            experience: { en: e.target.value, ar: prev.experience?.ar || '' },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-1.5"
                      />
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="مستوى أول / قيادي (٥+ سنوات)"
                        value={formData.experience?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            experience: { en: prev.experience?.en || '', ar: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Salary / Package (EN / AR)
                      </label>
                      <input
                        type="text"
                        placeholder="$120,000 - $160,000 + Equity"
                        value={formData.salaryRange?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            salaryRange: { en: e.target.value, ar: prev.salaryRange?.ar || '' },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-1.5"
                      />
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="١٢٠،٠٠٠ - ١٦٠،٠٠٠ دولار + أسهم"
                        value={formData.salaryRange?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            salaryRange: { en: prev.salaryRange?.en || '', ar: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                      />
                    </div>
                  </div>

                  {/* Status Toggles & Posted Date */}
                  <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 gap-4">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive !== false}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                          }
                          className="rounded text-persici-crimson focus:ring-persici-crimson"
                        />
                        <span>{isRtl ? 'وظيفة نشطة ومتاحة للتقديم' : 'Active (Accepting Applications)'}</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.featured)}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                          }
                          className="rounded text-amber-500 focus:ring-amber-500"
                        />
                        <span>{isRtl ? 'تمييز الوظيفة في البوابة' : 'Featured Role'}</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">{isRtl ? 'تاريخ النشر: ' : 'Posted Date: '}</span>
                      <input
                        type="text"
                        value={formData.postedDate || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, postedDate: e.target.value }))
                        }
                        className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-700"
                        placeholder="March 2026"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUMMARY & MISSION */}
              {activeTab === 'mission' && (
                <div className="space-y-5">
                  {/* Short Summary */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Summary (English) — displayed on job cards & header
                    </label>
                    <textarea
                      rows={3}
                      placeholder="High-level introductory pitch for the role..."
                      value={formData.summary?.en || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          summary: { en: e.target.value, ar: prev.summary?.ar || '' },
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                      الملخص التعريفي السريع (العربية)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      placeholder="نبذة سريعة تظهر على بطاقات الوظيفة وفي رأس الصفحة..."
                      value={formData.summary?.ar || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          summary: { en: prev.summary?.en || '', ar: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>

                  {/* Strategic Mission */}
                  <div className="pt-3 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      The Mission & Strategic Context (English) — detailed section in page body
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Explain what the mission of this position is and what impact the engineer will drive..."
                      value={formData.mission?.en || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mission: { en: e.target.value, ar: prev.mission?.ar || '' },
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                      الهدف والرؤية العامة للدور (العربية)
                    </label>
                    <textarea
                      rows={5}
                      dir="rtl"
                      placeholder="اشرح الهدف الاستراتيجي من الوظيفة وتأثيرها على مشاريع وكالة برسيسي..."
                      value={formData.mission?.ar || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mission: { en: prev.mission?.en || '', ar: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: RESPONSIBILITIES */}
              {activeTab === 'responsibilities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {isRtl ? 'المسؤوليات والمهام الأساسية' : 'What You Will Own & Deliver'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isRtl
                          ? 'المهام اليومية والأهداف التنفيذية التي سيتولاها الموظف'
                          : 'List of deliverables, initiatives, and everyday responsibilities.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('responsibilities')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      <TbPlus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة مسؤولية' : 'Add Item'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.responsibilities?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>#{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveArrayItem('responsibilities', idx)}
                            className="text-red-400 hover:text-red-600"
                            title="Remove"
                          >
                            <TbTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Responsibility in English..."
                          value={item.en}
                          onChange={(e) =>
                            handleUpdateArrayItem('responsibilities', idx, 'en', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="المسؤولية بالعربية..."
                          value={item.ar}
                          onChange={(e) =>
                            handleUpdateArrayItem('responsibilities', idx, 'ar', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REQUIREMENTS & QUALIFICATIONS */}
              {activeTab === 'requirements' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {isRtl ? 'المؤهلات والشروط المطلوبة' : 'What You Bring to the Collective'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isRtl ? 'الخبرات والمهارات الأساسية لقبول المتقدم' : 'Required experience, core competencies, and technical background.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('requirements')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      <TbPlus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة شرط' : 'Add Requirement'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.requirements?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>Requirement #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveArrayItem('requirements', idx)}
                            className="text-red-400 hover:text-red-600"
                            title="Remove"
                          >
                            <TbTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Requirement in English..."
                          value={item.en}
                          onChange={(e) =>
                            handleUpdateArrayItem('requirements', idx, 'en', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="الشرط أو المؤهل بالعربية..."
                          value={item.ar}
                          onChange={(e) =>
                            handleUpdateArrayItem('requirements', idx, 'ar', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Bonus Points / Preferred Qualifications */}
                  <div className="pt-5 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          {isRtl ? 'نقاط إضافية مميزة (Bonus Points)' : 'Bonus Points & Preferred Experience'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {isRtl ? 'مهارات إضافية تمنح المتقدم أولوية' : 'Nice-to-have skills or certifications.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddArrayItem('preferredQualifications')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold"
                      >
                        <TbPlus className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'إضافة نقطة تميز' : 'Add Bonus'}</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.preferredQualifications?.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-amber-50/40 border border-amber-200/60 rounded-2xl space-y-2 relative"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-amber-700">
                            <span>Bonus #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveArrayItem('preferredQualifications', idx)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <TbTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Preferred qualification in English..."
                            value={item.en}
                            onChange={(e) =>
                              handleUpdateArrayItem('preferredQualifications', idx, 'en', e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200/80 rounded-lg"
                          />
                          <input
                            type="text"
                            dir="rtl"
                            placeholder="المؤهل الإضافي بالعربية..."
                            value={item.ar}
                            onChange={(e) =>
                              handleUpdateArrayItem('preferredQualifications', idx, 'ar', e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200/80 rounded-lg font-arabic"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TECH STACK & PERKS */}
              {activeTab === 'extras' && (
                <div className="space-y-6">
                  {/* Tech Stack Chips */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tech Stack & Core Tooling (Cloud & Tools)
                    </label>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Shown as interactive badge pills in the detail page (e.g. Next.js, Python, Cloudflare R2, TypeScript).
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Type technology name (e.g. Docker, Figma)..."
                        value={newTechInput}
                        onChange={(e) => setNewTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTech();
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={handleAddTech}
                        className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                      >
                        {isRtl ? 'إضافة أداة' : 'Add Tech'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-mono font-medium border border-slate-200"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Role Benefits / Perks */}
                  <div className="pt-5 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {isRtl ? 'المزايا الخاصة بهذه الوظيفة' : 'Role Perks & Total Rewards'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Custom compensation perks displayed in the total rewards card.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddArrayItem('benefits')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                      >
                        <TbPlus className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'إضافة ميزة' : 'Add Perk'}</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.benefits?.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span>Perk #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveArrayItem('benefits', idx)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <TbTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Benefit in English..."
                            value={item.en}
                            onChange={(e) =>
                              handleUpdateArrayItem('benefits', idx, 'en', e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                          <input
                            type="text"
                            dir="rtl"
                            placeholder="الميزة بالعربية..."
                            value={item.ar}
                            onChange={(e) =>
                              handleUpdateArrayItem('benefits', idx, 'ar', e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveOpening}
                  className="flex items-center gap-2 px-5 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <TbDeviceFloppy className="w-4 h-4" />
                  <span>
                    {saving
                      ? isRtl
                        ? 'جارٍ الحفظ والنشر...'
                        : 'Saving & Publishing...'
                      : isEditing
                      ? isRtl
                        ? 'تحديث وحفظ التعديلات'
                        : 'Update Career Opening'
                      : isRtl
                      ? 'نشر الوظيفة في البوابة'
                      : 'Publish Career Opening'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* JOB DETAILS INSPECTOR MODAL                                         */}
      {/* =================================================================== */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  {getLocString(activeJob.department)}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {isRtl ? activeJob.title?.ar || activeJob.title?.en : activeJob.title?.en || activeJob.title?.ar}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <TbMapPin className="w-3.5 h-3.5 text-slate-400" />
                    {getLocString(activeJob.location)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <TbClock className="w-3.5 h-3.5 text-slate-400" />
                    {getLocString(activeJob.type)}
                  </span>
                  {activeJob.salaryRange && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <TbCoin className="w-3.5 h-3.5 text-amber-500" />
                        {getLocString(activeJob.salaryRange)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveJob(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Mission / Summary */}
              {(activeJob.mission || activeJob.summary) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <TbTarget className="w-4 h-4 text-persici-crimson" />
                    <span>{isRtl ? 'الهدف من الوظيفة' : 'Role Mission & Overview'}</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {getLocString(activeJob.mission) || getLocString(activeJob.summary)}
                  </p>
                </div>
              )}

              {/* Responsibilities */}
              {activeJob.responsibilities && activeJob.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <TbListCheck className="w-4 h-4 text-persici-crimson" />
                    <span>{isRtl ? 'المسؤوليات الرئيسية' : 'Key Responsibilities'}</span>
                  </h4>
                  <ul className="space-y-2">
                    {activeJob.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-persici-crimson mt-1.5 shrink-0" />
                        <span>{getLocArrayItem(resp)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {activeJob.requirements && activeJob.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <TbCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? 'المتطلبات والخبرات' : 'Requirements & Qualifications'}</span>
                  </h4>
                  <ul className="space-y-2">
                    {activeJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{getLocArrayItem(req)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {activeJob.techStack && activeJob.techStack.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isRtl ? 'التقنيات والأدوات' : 'Tech Stack'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <a
                href={`/${lang}/careers/${activeJob.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-persici-crimson hover:underline flex items-center gap-1"
              >
                <TbExternalLink className="w-3.5 h-3.5" />
                <span>{isRtl ? 'عرض الصفحة العامة للوظيفة' : 'View Public Job Page'}</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = activeJob;
                    setActiveJob(null);
                    handleOpenEdit(toEdit);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <TbEdit className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تعديل الوظيفة' : 'Edit'}</span>
                </button>

                <Link
                  href={`/${lang}/dashboard/careers/applicants?role=${activeJob.slug}`}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                >
                  {isRtl ? 'استعراض المتقدمين' : 'View Applicants'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
