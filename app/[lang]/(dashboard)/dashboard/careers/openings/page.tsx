'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RichTextEditor } from '@dashboard-shared/components/editor/rich-text-editor';
import {
  TbBriefcase,
  TbMapPin,
  TbBuildingCommunity,
  TbClock,
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
  TbFiles,
  TbAdjustmentsHorizontal,
  TbToggleLeft,
  TbToggleRight,
} from 'react-icons/tb';
import type { CareerSectionVisibility } from '@/app/[lang]/(site)/careers/_careers/data/careers.data';

interface LocalizedField {
  en: string;
  ar: string;
}

export interface JobOpening {
  id?: string;
  _id?: string;
  slug: string;
  originalSlug?: string;
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
  visaSponsorship?: LocalizedField;
  workstation?: LocalizedField;
  contactEmail?: string;
  customSectionTitles?: {
    mission?: LocalizedField;
    responsibilities?: LocalizedField;
    requirements?: LocalizedField;
    preferredQualifications?: LocalizedField;
    techStack?: LocalizedField;
    benefits?: LocalizedField;
  };
  sectionVisibility?: CareerSectionVisibility;
}

const DEFAULT_VISIBILITY: Required<CareerSectionVisibility> = {
  showDepartmentBadge: true,
  showLocationBadge: true,
  showWorkPolicyBadge: true,
  showTypeBadge: true,
  showExperienceBadge: true,
  showSalary: true,
  showPostedDate: true,
  showSummary: true,
  showMission: true,
  showResponsibilities: true,
  showRequirements: true,
  showPreferredQualifications: true,
  showTechStack: true,
  showBenefits: true,
  showSidebarSpecs: true,
  showVisaSupport: true,
  showWorkstation: true,
  showShareCard: true,
  showConciergeCard: true,
  showApplicationForm: true,
  showRelatedRoles: true,
};

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

function stripHtmlPreview(text: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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
  visaSponsorship: {
    en: '100% Sponsored (UAE Golden Visa Eligible)',
    ar: 'كفالة كاملة (مؤهل للإقامة الذهبية في الإمارات)',
  },
  workstation: {
    en: 'M3 Max MacBook Pro + 4K Studio Display',
    ar: 'حاسوب M3 Max MacBook Pro مع شاشة 4K احترافية',
  },
  contactEmail: 'careers@persici.com',
  customSectionTitles: {},
  sectionVisibility: { ...DEFAULT_VISIBILITY },
};

export default function CareerOpeningsPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived' | 'featured'>('all');

  // Modals state
  const [activeJob, setActiveJob] = useState<JobOpening | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<JobOpening>(emptyJobForm);
  const [saving, setSaving] = useState(false);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'basics' | 'mission' | 'responsibilities' | 'requirements' | 'extras' | 'visibility'
  >('basics');
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
    queueMicrotask(() => {
      fetchOpenings();
    });
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
      sectionVisibility: { ...DEFAULT_VISIBILITY },
    });
    setIsEditing(false);
    setActiveTab('basics');
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (
    job: JobOpening,
    initialTab: 'basics' | 'mission' | 'responsibilities' | 'requirements' | 'extras' | 'visibility' = 'basics'
  ) => {
    setFormData({
      ...job,
      originalSlug: job.slug,
      type: job.type || { en: 'Full-time Permanent', ar: 'دوام كامل دائم' },
      experience: job.experience || { en: '', ar: '' },
      workPolicy: job.workPolicy || { en: '', ar: '' },
      salaryRange: job.salaryRange || { en: '', ar: '' },
      summary: job.summary || job.description || { en: '', ar: '' },
      mission: job.mission || { en: '', ar: '' },
      responsibilities: job.responsibilities?.length ? job.responsibilities : [{ en: '', ar: '' }],
      requirements: job.requirements?.length ? job.requirements : [{ en: '', ar: '' }],
      preferredQualifications: job.preferredQualifications?.length
        ? job.preferredQualifications
        : [{ en: '', ar: '' }],
      benefits: job.benefits?.length ? job.benefits : [{ en: '', ar: '' }],
      techStack: job.techStack || [],
      visaSponsorship: job.visaSponsorship || {
        en: '100% Sponsored (UAE Golden Visa Eligible)',
        ar: 'كفالة كاملة (مؤهل للإقامة الذهبية في الإمارات)',
      },
      workstation: job.workstation || {
        en: 'M3 Max MacBook Pro + 4K Studio Display',
        ar: 'حاسوب M3 Max MacBook Pro مع شاشة 4K احترافية',
      },
      contactEmail: job.contactEmail || 'careers@persici.com',
      customSectionTitles: job.customSectionTitles || {},
      sectionVisibility: {
        ...DEFAULT_VISIBILITY,
        ...(job.sectionVisibility || {}),
      },
    });
    setIsEditing(true);
    setActiveTab(initialTab);
    setIsEditorOpen(true);
  };

  // Quick 1-click toggle for Active/Archived or Featured directly on card
  const handleQuickToggle = async (job: JobOpening, field: 'isActive' | 'featured') => {
    setTogglingSlug(`${job.slug}-${field}`);
    try {
      const nextValue = field === 'isActive' ? !(job.isActive !== false) : !Boolean(job.featured);
      const updatedJob = {
        ...job,
        originalSlug: job.slug,
        [field]: nextValue,
      };
      const res = await fetch('/api/careers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOpenings((prev) =>
          prev.map((item) => (item.slug === job.slug ? { ...item, [field]: nextValue } : item))
        );
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Failed to toggle job field:', err);
    } finally {
      setTogglingSlug(null);
    }
  };

  // Save Career Opening
  const handleSaveOpening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.en || !formData.title.ar) {
      alert(
        isRtl
          ? 'يرجى إدخال عنوان الوظيفة باللغتين الإنجليزية والعربية'
          : 'Please provide job titles in both English and Arabic.'
      );
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
  const handleAddArrayItem = (
    field: 'responsibilities' | 'requirements' | 'preferredQualifications' | 'benefits'
  ) => {
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

  const handleToggleVisibility = (key: keyof CareerSectionVisibility) => {
    setFormData((prev) => {
      const current = prev.sectionVisibility?.[key] !== false;
      return {
        ...prev,
        sectionVisibility: {
          ...DEFAULT_VISIBILITY,
          ...(prev.sectionVisibility || {}),
          [key]: !current,
        },
      };
    });
  };

  const handleSetAllVisibility = (value: boolean) => {
    const nextVis: CareerSectionVisibility = {};
    (Object.keys(DEFAULT_VISIBILITY) as Array<keyof CareerSectionVisibility>).forEach((k) => {
      nextVis[k] = value;
    });
    setFormData((prev) => ({
      ...prev,
      sectionVisibility: nextVis,
    }));
  };

  const filteredOpenings = openings.filter((j) => {
    const matchesDept = selectedDept === 'all' || j.departmentSlug === selectedDept;
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? j.isActive !== false
        : statusFilter === 'archived'
        ? j.isActive === false
        : Boolean(j.featured);

    const searchLower = search.toLowerCase();
    const titleEn = j.title?.en?.toLowerCase() || '';
    const titleAr = j.title?.ar || '';
    const deptEn = j.department?.en?.toLowerCase() || '';
    const deptAr = j.department?.ar || '';
    const locEn = j.location?.en?.toLowerCase() || '';

    const matchesSearch =
      !search ||
      titleEn.includes(searchLower) ||
      titleAr.includes(search) ||
      deptEn.includes(searchLower) ||
      deptAr.includes(search) ||
      locEn.includes(searchLower);

    return matchesDept && matchesStatus && matchesSearch;
  });

  const departments = Array.from(new Set(openings.map((o) => o.departmentSlug).filter(Boolean)));
  const activeCount = openings.filter((o) => o.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <TbBuildingCommunity className="w-4 h-4" />
            <span>{isRtl ? 'إدارة التوظيف والمواهب (ATS)' : 'Talent Acquisition & Careers ATS'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRtl ? 'الوظائف الشاغرة وإدارة النشر والتصميم' : 'Active Job Postings & Detail Design Control'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'إدارة جميع الوظائف النشطة، الأقسام، المهارات، المؤهلات الموصى بها، وتخصيص إظهار أو إخفاء أي قسم في صفحة تفاصيل الوظيفة.'
              : 'Create, edit, activate/archive roles, manage categories & skills, and toggle design sections on/off per job detail page.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-persici-crimson hover:bg-red-700 rounded-xl transition-colors shadow-sm"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة ونشر وظيفة جديدة' : 'Publish New Career'}</span>
          </button>

          <Link
            href={`/${lang}/dashboard/pages/careers`}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
          >
            <TbFiles className="w-4 h-4" />
            <span>{isRtl ? 'محتوى صفحة بوابة الوظائف' : 'Edit Careers Hub Page'}</span>
          </Link>

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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
              {isRtl ? `كل الأقسام (${openings.length})` : `All Categories (${openings.length})`}
            </button>
            {departments.map((dept) => {
              const matchingJob = openings.find((o) => o.departmentSlug === dept);
              const label = matchingJob
                ? isRtl
                  ? matchingJob.department?.ar || dept
                  : matchingJob.department?.en || dept
                : dept.replace(/-/g, ' ');
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-[11px] ${
                    selectedDept === dept
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {isRtl ? 'الكل' : 'All'} ({openings.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                statusFilter === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {isRtl ? 'نشطة' : 'Active'} ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('archived')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                statusFilter === 'archived'
                  ? 'bg-slate-200 text-slate-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {isRtl ? 'مؤرشفة' : 'Archived'} ({openings.length - activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('featured')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                statusFilter === 'featured'
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {isRtl ? 'مميزة' : 'Featured'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <TbSearch
            className={`w-4 h-4 text-slate-400 absolute ${
              isRtl ? 'right-3.5' : 'left-3.5'
            } top-1/2 -translate-y-1/2`}
          />
          <input
            type="text"
            placeholder={
              isRtl
                ? 'البحث عن وظيفة بالعنوان أو القسم أو الموقع...'
                : 'Search openings by title, category, or location...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${
              isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
            } py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson`}
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
            const rawSummary =
              getLocString(job.summary) ||
              getLocString(job.description) ||
              job.summary?.en ||
              job.description?.en ||
              '';
            const summaryText = stripHtmlPreview(rawSummary);
            const isJobActive = job.isActive !== false;

            return (
              <div
                key={job.slug}
                className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isJobActive ? 'border-slate-200' : 'border-slate-200/70 bg-slate-50/40 opacity-85'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                      {getLocString(job.department) || job.departmentSlug}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={togglingSlug === `${job.slug}-featured`}
                        onClick={() => handleQuickToggle(job, 'featured')}
                        title={
                          isRtl
                            ? 'تبديل حالة التمييز (Featured)'
                            : 'Click to toggle Featured badge on Careers Hub'
                        }
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border transition-colors ${
                          job.featured
                            ? 'text-amber-700 bg-amber-100 border-amber-300'
                            : 'text-slate-400 bg-slate-50 border-slate-200 hover:text-amber-600'
                        }`}
                      >
                        <TbSparkles className="w-3 h-3" />
                        <span>{isRtl ? 'مميزة' : 'Featured'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={togglingSlug === `${job.slug}-isActive`}
                        onClick={() => handleQuickToggle(job, 'isActive')}
                        title={
                          isRtl
                            ? 'اضغط لتفعيل أو أرشفة الوظيفة في الموقع العام'
                            : 'Click to toggle Active / Archived on public Careers Hub'
                        }
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${
                          isJobActive
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                            : 'text-slate-500 bg-slate-100 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isJobActive ? (
                          <TbToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <TbToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>
                          {isJobActive ? (isRtl ? 'نشطة' : 'Active') : isRtl ? 'مؤرشفة' : 'Archived'}
                        </span>
                      </button>
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
                      <TbMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{getLocString(job.location)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TbClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {getLocString(job.type)}
                        {job.workPolicy ? ` • ${getLocString(job.workPolicy)}` : ''}
                      </span>
                    </div>
                    {job.salaryRange && (job.salaryRange.en || job.salaryRange.ar) && (
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <TbCoin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{getLocString(job.salaryRange)}</span>
                      </div>
                    )}
                  </div>

                  {summaryText && (
                    <p className="text-xs text-slate-600 line-clamp-3 pt-1 leading-relaxed">
                      {summaryText}
                    </p>
                  )}

                  {/* Skills / TechStack mini preview */}
                  {job.techStack && job.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {job.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                          +{job.techStack.length - 4}
                        </span>
                      )}
                    </div>
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
                        onClick={() => handleOpenEdit(job, 'basics')}
                        className="px-2.5 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        title={isRtl ? 'تعديل الوظيفة' : 'Edit Opening'}
                      >
                        <TbEdit className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(job, 'visibility')}
                        className="p-1.5 text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs transition-colors"
                        title={
                          isRtl
                            ? 'التحكم بإظهار/إخفاء أقسام صفحة الوظيفة (Design On/Off)'
                            : 'Design & Section Visibility Controls (On/Off)'
                        }
                      >
                        <TbAdjustmentsHorizontal className="w-4 h-4" />
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
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
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
      {/* PUBLISH & EDIT CAREER OPENING MODAL (FULL 6-TAB CRAFT SUITE)        */}
      {/* =================================================================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
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
                      ? 'تحكم كامل في البيانات، الأقسام، المهارات، وإظهار/إخفاء عناصر التصميم لصفحة الوظيفة'
                      : 'Full control over job content, categories, skills, recommendations, and detail page design visibility (On/Off).'}
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
            <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-3 overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('basics')}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'basics'
                    ? 'border-persici-crimson text-persici-crimson'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. {isRtl ? 'المعلومات والأقسام' : 'Role, Category & Specs'}
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
                2. {isRtl ? 'الملخص والرسالة' : 'Summary & Mission'}
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
                4. {isRtl ? 'الشروط والتوصيات' : 'Requirements & Recommendations'}
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
                5. {isRtl ? 'المهارات والمزايا' : 'Skills & Perks'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('visibility')}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'visibility'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-amber-700/80 hover:text-amber-800'
                }`}
              >
                <TbAdjustmentsHorizontal className="w-3.5 h-3.5" />
                <span>6. {isRtl ? 'إظهار/إخفاء التصميم (On/Off)' : 'Design & Visibility (On/Off)'}</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveOpening} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC INFO, CATEGORY & SPECS */}
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

                  {/* Department / Category & Location Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
                    {/* Department / Category */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-800">
                        Department / Category (Filter Key & Display Labels)
                      </label>
                      <select
                        value={
                          DEPARTMENTS.some((d) => d.slug === formData.departmentSlug)
                            ? formData.departmentSlug
                            : '__custom__'
                        }
                        onChange={(e) => {
                          if (e.target.value === '__custom__') return;
                          const d = DEPARTMENTS.find((x) => x.slug === e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            departmentSlug: e.target.value,
                            department: d ? { en: d.en, ar: d.ar } : prev.department,
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.slug} value={d.slug}>
                            Preset: {d.en} ({d.slug})
                          </option>
                        ))}
                        <option value="__custom__">+ Custom Category Slug</option>
                      </select>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Category Slug
                          </label>
                          <input
                            type="text"
                            value={formData.departmentSlug}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                departmentSlug: slugify(e.target.value) || e.target.value,
                              }))
                            }
                            placeholder="engineering"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Label (EN)
                          </label>
                          <input
                            type="text"
                            value={formData.department?.en || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                department: {
                                  en: e.target.value,
                                  ar: prev.department?.ar || '',
                                },
                              }))
                            }
                            placeholder="Engineering & AI"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Label (AR)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={formData.department?.ar || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                department: {
                                  en: prev.department?.en || '',
                                  ar: e.target.value,
                                },
                              }))
                            }
                            placeholder="الهندسة والذكاء الاصطناعي"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location Hub */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-800">
                        Location Hub (Filter Key & Display Labels)
                      </label>
                      <select
                        value={
                          LOCATIONS.some((l) => l.slug === formData.locationSlug)
                            ? formData.locationSlug
                            : '__custom__'
                        }
                        onChange={(e) => {
                          if (e.target.value === '__custom__') return;
                          const l = LOCATIONS.find((x) => x.slug === e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            locationSlug: e.target.value,
                            location: l ? { en: l.en, ar: l.ar } : prev.location,
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      >
                        {LOCATIONS.map((l) => (
                          <option key={l.slug} value={l.slug}>
                            Preset: {l.en} ({l.slug})
                          </option>
                        ))}
                        <option value="__custom__">+ Custom Location Slug</option>
                      </select>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Location Slug
                          </label>
                          <input
                            type="text"
                            value={formData.locationSlug}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                locationSlug: slugify(e.target.value) || e.target.value,
                              }))
                            }
                            placeholder="dubai"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Location (EN)
                          </label>
                          <input
                            type="text"
                            value={formData.location?.en || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                location: {
                                  en: e.target.value,
                                  ar: prev.location?.ar || '',
                                },
                              }))
                            }
                            placeholder="Dubai, UAE"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Location (AR)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={formData.location?.ar || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                location: {
                                  en: prev.location?.en || '',
                                  ar: e.target.value,
                                },
                              }))
                            }
                            placeholder="دبي، الإمارات"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Type, Work Policy, Seniority, Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Job Type / Contract (EN / AR)
                      </label>
                      <input
                        type="text"
                        placeholder="Full-time Permanent"
                        value={formData.type?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            type: { en: e.target.value, ar: prev.type?.ar || '' },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-1.5"
                      />
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="دوام كامل دائم"
                        value={formData.type?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            type: { en: prev.type?.en || '', ar: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                      />
                    </div>

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

                  {/* Sidebar Specifications: Visa Sponsorship, Workstation, Contact Email */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Visa & Relocation Spec (EN / AR)
                      </label>
                      <input
                        type="text"
                        value={formData.visaSponsorship?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            visaSponsorship: {
                              en: e.target.value,
                              ar: prev.visaSponsorship?.ar || '',
                            },
                          }))
                        }
                        placeholder="100% Sponsored (UAE Golden Visa Eligible)"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl mb-1.5"
                      />
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.visaSponsorship?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            visaSponsorship: {
                              en: prev.visaSponsorship?.en || '',
                              ar: e.target.value,
                            },
                          }))
                        }
                        placeholder="كفالة كاملة (مؤهل للإقامة الذهبية في الإمارات)"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-arabic"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Workstation Spec (EN / AR)
                      </label>
                      <input
                        type="text"
                        value={formData.workstation?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workstation: {
                              en: e.target.value,
                              ar: prev.workstation?.ar || '',
                            },
                          }))
                        }
                        placeholder="M3 Max MacBook Pro + 4K Studio Display"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl mb-1.5"
                      />
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.workstation?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workstation: {
                              en: prev.workstation?.en || '',
                              ar: e.target.value,
                            },
                          }))
                        }
                        placeholder="حاسوب M3 Max MacBook Pro مع شاشة 4K احترافية"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-arabic"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Concierge Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                        }
                        placeholder="careers@persici.com"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
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
                        <span>
                          {isRtl ? 'وظيفة نشطة ومتاحة للتقديم' : 'Active (Shown on Careers Hub)'}
                        </span>
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
                        <span>{isRtl ? 'تمييز الوظيفة في البوابة' : 'Featured Role Badge'}</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">
                        {isRtl ? 'تاريخ النشر: ' : 'Posted Date: '}
                      </span>
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

              {/* TAB 2: SUMMARY & MISSION (WITH RICH TEXT) */}
              {activeTab === 'mission' && (
                <div className="space-y-6">
                  <RichTextEditor
                    label="Short Summary — Displayed on Job Cards & Detail Header"
                    valueEn={formData.summary?.en || ''}
                    valueAr={formData.summary?.ar || ''}
                    onChangeEn={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        summary: { en: val, ar: prev.summary?.ar || '' },
                      }))
                    }
                    onChangeAr={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        summary: { en: prev.summary?.en || '', ar: val },
                      }))
                    }
                  />

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mission Section Heading Override (EN)
                        </label>
                        <input
                          type="text"
                          placeholder="The Mission & Strategic Context"
                          value={formData.customSectionTitles?.mission?.en || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                mission: {
                                  en: e.target.value,
                                  ar: prev.customSectionTitles?.mission?.ar || '',
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                          عنوان قسم المهمة والهدف (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="المهمة والسياق الاستراتيجي للدور"
                          value={formData.customSectionTitles?.mission?.ar || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                mission: {
                                  en: prev.customSectionTitles?.mission?.en || '',
                                  ar: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                        />
                      </div>
                    </div>

                    <RichTextEditor
                      label="The Mission & Strategic Context — Detailed Section Body"
                      valueEn={formData.mission?.en || ''}
                      valueAr={formData.mission?.ar || ''}
                      onChangeEn={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          mission: { en: val, ar: prev.mission?.ar || '' },
                        }))
                      }
                      onChangeAr={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          mission: { en: prev.mission?.en || '', ar: val },
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: RESPONSIBILITIES */}
              {activeTab === 'responsibilities' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Responsibilities Section Heading Override (EN)
                      </label>
                      <input
                        type="text"
                        placeholder="What You Will Own & Deliver"
                        value={formData.customSectionTitles?.responsibilities?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customSectionTitles: {
                              ...prev.customSectionTitles,
                              responsibilities: {
                                en: e.target.value,
                                ar: prev.customSectionTitles?.responsibilities?.ar || '',
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                        عنوان قسم المسؤوليات (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="المسؤوليات والمهام الرئيسية"
                        value={formData.customSectionTitles?.responsibilities?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customSectionTitles: {
                              ...prev.customSectionTitles,
                              responsibilities: {
                                en: prev.customSectionTitles?.responsibilities?.en || '',
                                ar: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>

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
                      <span>{isRtl ? 'إضافة مسؤولية' : 'Add Responsibility'}</span>
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

              {/* TAB 4: REQUIREMENTS & RECOMMENDATIONS (PREFERRED QUALIFICATIONS) */}
              {activeTab === 'requirements' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Requirements Section Heading Override (EN)
                      </label>
                      <input
                        type="text"
                        placeholder="What You Bring to the Collective"
                        value={formData.customSectionTitles?.requirements?.en || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customSectionTitles: {
                              ...prev.customSectionTitles,
                              requirements: {
                                en: e.target.value,
                                ar: prev.customSectionTitles?.requirements?.ar || '',
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                        عنوان قسم المؤهلات والخبرات (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="المؤهلات والخبرات المطلوبة"
                        value={formData.customSectionTitles?.requirements?.ar || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customSectionTitles: {
                              ...prev.customSectionTitles,
                              requirements: {
                                en: prev.customSectionTitles?.requirements?.en || '',
                                ar: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {isRtl ? 'المؤهلات والشروط المطلوبة' : 'What You Bring to the Collective (Requirements)'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isRtl
                          ? 'الخبرات والمهارات الأساسية لقبول المتقدم'
                          : 'Required experience, core competencies, and technical background.'}
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

                  {/* Bonus Points / Recommendations (Preferred Qualifications) */}
                  <div className="pt-5 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-amber-50/40 rounded-2xl border border-amber-200/70">
                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 mb-1">
                          Recommendations / Bonus Section Heading Override (EN)
                        </label>
                        <input
                          type="text"
                          placeholder="Bonus Points & Preferred Experience"
                          value={formData.customSectionTitles?.preferredQualifications?.en || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                preferredQualifications: {
                                  en: e.target.value,
                                  ar: prev.customSectionTitles?.preferredQualifications?.ar || '',
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 mb-1 font-arabic" dir="rtl">
                          عنوان قسم التوصيات والمؤهلات الإضافية (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="مؤهلات إضافية تمنحك أولوية"
                          value={formData.customSectionTitles?.preferredQualifications?.ar || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                preferredQualifications: {
                                  en: prev.customSectionTitles?.preferredQualifications?.en || '',
                                  ar: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg font-arabic"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          {isRtl
                            ? 'التوصيات ونقاط التميز الإضافية (Recommendations / Bonus Points)'
                            : 'Recommendations, Bonus Points & Preferred Experience'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {isRtl
                            ? 'مهارات وتوصيات إضافية تمنح المتقدم أولوية'
                            : 'Recommended background, nice-to-have skills, or certifications.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddArrayItem('preferredQualifications')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold"
                      >
                        <TbPlus className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'إضافة توصية / ميزة' : 'Add Recommendation'}</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.preferredQualifications?.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-amber-50/40 border border-amber-200/60 rounded-2xl space-y-2 relative"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-amber-700">
                            <span>Recommendation #{idx + 1}</span>
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
                            placeholder="Recommended qualification in English..."
                            value={item.en}
                            onChange={(e) =>
                              handleUpdateArrayItem(
                                'preferredQualifications',
                                idx,
                                'en',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200/80 rounded-lg"
                          />
                          <input
                            type="text"
                            dir="rtl"
                            placeholder="المؤهل الموصى به بالعربية..."
                            value={item.ar}
                            onChange={(e) =>
                              handleUpdateArrayItem(
                                'preferredQualifications',
                                idx,
                                'ar',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200/80 rounded-lg font-arabic"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SKILLS (TECH STACK) & PERKS */}
              {activeTab === 'extras' && (
                <div className="space-y-6">
                  {/* Skills / Tech Stack Chips */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Skills & Tech Stack Section Heading Override (EN)
                        </label>
                        <input
                          type="text"
                          placeholder="Tech Stack & Core Tooling"
                          value={formData.customSectionTitles?.techStack?.en || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                techStack: {
                                  en: e.target.value,
                                  ar: prev.customSectionTitles?.techStack?.ar || '',
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                          عنوان قسم المهارات والتقنيات (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="التقنيات والأدوات المعتمدة"
                          value={formData.customSectionTitles?.techStack?.ar || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                techStack: {
                                  en: prev.customSectionTitles?.techStack?.en || '',
                                  ar: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isRtl
                          ? 'المهارات والتقنيات والأدوات (Skills & Core Tooling)'
                          : 'Skills, Tech Stack & Core Tooling'}
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Shown as interactive skill pills on the career detail page (e.g. Next.js, Python, Meta Ads, Figma, TypeScript).
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Type skill or tool name (e.g. Docker, Figma, GA4)..."
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
                          {isRtl ? 'إضافة مهارة / أداة' : 'Add Skill / Tool'}
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
                  </div>

                  {/* Role Benefits / Perks */}
                  <div className="pt-5 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Role Perks Section Heading Override (EN)
                        </label>
                        <input
                          type="text"
                          placeholder="Role Perks & Total Rewards"
                          value={formData.customSectionTitles?.benefits?.en || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                benefits: {
                                  en: e.target.value,
                                  ar: prev.customSectionTitles?.benefits?.ar || '',
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 font-arabic" dir="rtl">
                          عنوان قسم المزايا والحوافز (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="المزايا والحوافز الخاصة بالدور"
                          value={formData.customSectionTitles?.benefits?.ar || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSectionTitles: {
                                ...prev.customSectionTitles,
                                benefits: {
                                  en: prev.customSectionTitles?.benefits?.en || '',
                                  ar: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                    </div>

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

              {/* TAB 6: DESIGN & VISIBILITY CONTROLS (ON / OFF) */}
              {activeTab === 'visibility' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        {isRtl
                          ? 'التحكم بتصميم وأقسام صفحة تفاصيل الوظيفة والبطاقة (On / Off)'
                          : 'Frontend Career Detail & Card Design Visibility (On / Off)'}
                      </h4>
                      <p className="text-[11px] text-amber-800/80 mt-0.5">
                        {isRtl
                          ? 'يمكنك تشغيل أو إيقاف أي حقل أو شارة أو قسم في صفحة الوظيفة الفردية دون حذف بياناته.'
                          : 'Toggle any badge, field, or section on/off on the public Career Hub card and Career Detail page without losing data.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSetAllVisibility(true)}
                        className="px-3 py-1.5 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        {isRtl ? 'تفعيل الكل (All On)' : 'Enable All (On)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetAllVisibility(false)}
                        className="px-3 py-1.5 text-[11px] font-bold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        {isRtl ? 'إخفاء الكل (All Off)' : 'Hide All (Off)'}
                      </button>
                    </div>
                  </div>

                  {/* Group 1: Header & Card Metadata Badges */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      1. {isRtl ? 'شارات الرأس وبطاقة الوظيفة (Category, Type, Salary, Location)' : 'Header & Job Card Metadata Badges'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(
                        [
                          {
                            key: 'showDepartmentBadge',
                            en: 'Department / Category Badge',
                            ar: 'شارة القسم / التصنيف',
                          },
                          {
                            key: 'showLocationBadge',
                            en: 'Location Hub Badge',
                            ar: 'شارة الموقع الجغرافي',
                          },
                          {
                            key: 'showWorkPolicyBadge',
                            en: 'Work Policy Badge (Hybrid/Remote)',
                            ar: 'شارة نظام العمل (هجين/عن بعد)',
                          },
                          {
                            key: 'showTypeBadge',
                            en: 'Job Type Badge (Full-time)',
                            ar: 'شارة نوع الوظيفة والعقد',
                          },
                          {
                            key: 'showExperienceBadge',
                            en: 'Seniority / Experience Badge',
                            ar: 'شارة سنوات الخبرة',
                          },
                          {
                            key: 'showSalary',
                            en: 'Salary / Compensation Package',
                            ar: 'نطاق الراتب والتعويضات',
                          },
                          {
                            key: 'showPostedDate',
                            en: 'Posted Date Indicator',
                            ar: 'تاريخ نشر الوظيفة',
                          },
                        ] as Array<{ key: keyof CareerSectionVisibility; en: string; ar: string }>
                      ).map((item) => {
                        const enabled = formData.sectionVisibility?.[item.key] !== false;
                        return (
                          <label
                            key={item.key}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                              enabled
                                ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="text-xs font-semibold">
                              {isRtl ? item.ar : item.en}
                            </span>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleToggleVisibility(item.key)}
                              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 2: Main Content Sections */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. {isRtl ? 'الأقسام الرئيسية في صفحة تفاصيل الوظيفة' : 'Main Career Detail Content Sections'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          {
                            key: 'showSummary',
                            en: 'Introductory Role Summary Paragraph',
                            ar: 'الملخص التعريفي في أعلى الصفحة والبطاقة',
                          },
                          {
                            key: 'showMission',
                            en: 'The Mission & Strategic Context Section',
                            ar: 'قسم المهمة والسياق الاستراتيجي للدور',
                          },
                          {
                            key: 'showResponsibilities',
                            en: 'Responsibilities ("What You Will Own") Section',
                            ar: 'قسم المسؤوليات والمهام الرئيسية',
                          },
                          {
                            key: 'showRequirements',
                            en: 'Requirements ("What You Bring") Section',
                            ar: 'قسم المؤهلات والخبرات المطلوبة',
                          },
                          {
                            key: 'showPreferredQualifications',
                            en: 'Recommendations / Bonus Points Section',
                            ar: 'قسم التوصيات والمؤهلات الإضافية المفضلة',
                          },
                          {
                            key: 'showTechStack',
                            en: 'Skills & Tech Stack Pills Section',
                            ar: 'قسم المهارات والتقنيات والأدوات المعتمدة',
                          },
                          {
                            key: 'showBenefits',
                            en: 'Role Perks & Total Rewards Section',
                            ar: 'قسم المزايا والحوافز الخاصة بالدور',
                          },
                        ] as Array<{ key: keyof CareerSectionVisibility; en: string; ar: string }>
                      ).map((item) => {
                        const enabled = formData.sectionVisibility?.[item.key] !== false;
                        return (
                          <label
                            key={item.key}
                            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                              enabled
                                ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="text-xs font-semibold">
                              {isRtl ? item.ar : item.en}
                            </span>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleToggleVisibility(item.key)}
                              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 3: Sidebar Cards, Application Form & Related Roles */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      3. {isRtl ? 'البطاقات الجانبية ونموذج التقديم والوظائف المشابهة' : 'Sidebar Cards, Application Form & Footer'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(
                        [
                          {
                            key: 'showSidebarSpecs',
                            en: 'Role Specifications Sticky Card',
                            ar: 'بطاقة مواصفات الدور الجانبية',
                          },
                          {
                            key: 'showVisaSupport',
                            en: 'Visa & Relocation Row in Specs',
                            ar: 'بند الكفالة والإقامة الذهبية',
                          },
                          {
                            key: 'showWorkstation',
                            en: 'Workstation Spec Row in Specs',
                            ar: 'بند تجهيزات العمل والحاسوب',
                          },
                          {
                            key: 'showShareCard',
                            en: 'Share Opportunity Social Card',
                            ar: 'بطاقة مشاركة الفرصة الوظيفية',
                          },
                          {
                            key: 'showConciergeCard',
                            en: 'Talent Concierge Contact Card',
                            ar: 'بطاقة تواصل فريق استقطاب المواهب',
                          },
                          {
                            key: 'showApplicationForm',
                            en: 'Candidate Application Form (#apply-now)',
                            ar: 'نموذج التقديم المباشر على الوظيفة',
                          },
                          {
                            key: 'showRelatedRoles',
                            en: 'Explore More Open Positions Section',
                            ar: 'قسم استكشف المزيد من الوظائف الشاغرة',
                          },
                        ] as Array<{ key: keyof CareerSectionVisibility; en: string; ar: string }>
                      ).map((item) => {
                        const enabled = formData.sectionVisibility?.[item.key] !== false;
                        return (
                          <label
                            key={item.key}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                              enabled
                                ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="text-xs font-semibold">
                              {isRtl ? item.ar : item.en}
                            </span>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleToggleVisibility(item.key)}
                              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                            />
                          </label>
                        );
                      })}
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
                  <div className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {stripHtmlPreview(getLocString(activeJob.mission) || getLocString(activeJob.summary))}
                  </div>
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

              {/* Preferred Qualifications / Recommendations */}
              {activeJob.preferredQualifications && activeJob.preferredQualifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <TbSparkles className="w-4 h-4 text-amber-500" />
                    <span>{isRtl ? 'المؤهلات الموصى بها (Bonus)' : 'Recommendations & Bonus Points'}</span>
                  </h4>
                  <ul className="space-y-2">
                    {activeJob.preferredQualifications.map((pref, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{getLocArrayItem(pref)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {activeJob.techStack && activeJob.techStack.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isRtl ? 'المهارات والتقنيات والأدوات' : 'Skills & Tech Stack'}
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
                    handleOpenEdit(toEdit, 'visibility');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <TbAdjustmentsHorizontal className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'التصميم (On/Off)' : 'Design On/Off'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const toEdit = activeJob;
                    setActiveJob(null);
                    handleOpenEdit(toEdit, 'basics');
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
