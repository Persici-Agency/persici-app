'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  TbBriefcase,
  TbPlus,
  TbTrash,
  TbEdit,
  TbRefresh,
  TbDeviceFloppy,
  TbX,
  TbExternalLink,
  TbPhoto,
  TbVideo,
} from 'react-icons/tb';
import { MediaPickerModal } from '@dashboard-shared/components';

interface ProjectRecord {
  id?: string;
  _id?: string;
  slug: string;
  title: { en: string; ar: string };
  client: { en: string; ar: string };
  summary: { en: string; ar: string };
  leadSubtitle?: { en: string; ar: string };
  challenge?: { en: string; ar: string };
  solution?: { en: string; ar: string };
  results?: { en: string; ar: string };
  industrySlug?: string;
  metrics?: { label: { en: string; ar: string }; value: string }[];
  featuredImage?: string;
  heroVideo?: string;
  link?: string;
}

export default function ProjectsManagerPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<'image' | 'video' | 'all'>('image');
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'featuredImage' | 'heroVideo'>('featuredImage');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    try {
      const isNew = isCreating || (!editingProject.id && !editingProject._id);
      const url = '/api/projects';
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        setEditingProject(null);
        setIsCreating(false);
        fetchProjects();
      }
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slugOrId: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      const res = await fetch(`/api/projects?slug=${slugOrId}&id=${slugOrId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.slug !== slugOrId && p.id !== slugOrId));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const openNewProject = () => {
    setIsCreating(true);
    setEditingProject({
      slug: 'new-case-study-' + Date.now(),
      title: { en: 'New Case Study', ar: 'دراسة حالة جديدة' },
      client: { en: 'Enterprise Client', ar: 'عميل مؤسسي' },
      summary: {
        en: 'Delivering end-to-end digital architecture and strategic transformation.',
        ar: 'تقديم هندسة رقمية متكاملة وتحول استراتيجي.',
      },
      featuredImage: '/images/work/fintech-dashboard.webp',
      metrics: [
        { label: { en: 'Revenue Growth', ar: 'نمو الإيرادات' }, value: '+140%' },
        { label: { en: 'Time-to-Market', ar: 'سرعة الطرح' }, value: '3x Faster' },
      ],
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <span>Portfolio & Work</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Projects & Case Studies</h1>
          <p className="text-sm text-slate-500 mt-1">
            Showcase flagship enterprise transformations, measurable impact metrics, and client success stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openNewProject}
            className="flex items-center gap-2 px-4 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            <TbPlus className="w-4 h-4" />
            <span>Create Case Study</span>
          </button>
          <button
            type="button"
            onClick={fetchProjects}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isCreating ? 'Create Portfolio Case Study' : 'Edit Project'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Slug</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Live External Link</label>
                  <input
                    type="url"
                    value={editingProject.link || ''}
                    placeholder="https://..."
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Title EN / AR */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title.en}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        title: { ...editingProject.title, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    value={editingProject.title.ar}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        title: { ...editingProject.title, ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              {/* Client EN / AR */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProject.client.en}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        client: { ...editingProject.client, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    value={editingProject.client.ar}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        client: { ...editingProject.client, ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              {/* Summary EN / AR */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Summary (EN)</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.summary.en}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        summary: { ...editingProject.summary, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Summary (AR)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    required
                    value={editingProject.summary.ar}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        summary: { ...editingProject.summary, ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              {/* Media: Image & Video */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Featured Cover Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProject.featuredImage || ''}
                      placeholder="https://..."
                      onChange={(e) => setEditingProject({ ...editingProject, featuredImage: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerType('image');
                        setMediaPickerTarget('featuredImage');
                        setMediaPickerOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5"
                    >
                      <TbPhoto className="w-4 h-4" />
                      <span>Pick Image</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Showcase Video (MP4 / WebM)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProject.heroVideo || ''}
                      placeholder="https://.../video.mp4"
                      onChange={(e) => setEditingProject({ ...editingProject, heroVideo: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerType('video');
                        setMediaPickerTarget('heroVideo');
                        setMediaPickerOpen(true);
                      }}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 border border-amber-200"
                    >
                      <TbVideo className="w-4 h-4 text-amber-600" />
                      <span>Pick Video</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Challenge (EN / AR) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Strategic Challenge (EN)</label>
                  <textarea
                    rows={2}
                    placeholder="Legacy platform bottlenecks, poor omnichannel latency..."
                    value={editingProject.challenge?.en || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        challenge: { en: e.target.value, ar: editingProject.challenge?.ar || '' },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">التحدي والمشكلة الاستراتيجية (AR)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="تحديات البنية التحتية والأنظمة القديمة..."
                    value={editingProject.challenge?.ar || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        challenge: { en: editingProject.challenge?.en || '', ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              {/* Solution (EN / AR) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Engineered Solution (EN)</label>
                  <textarea
                    rows={2}
                    placeholder="Headless Next.js architecture, predictive AI pipelines..."
                    value={editingProject.solution?.en || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        solution: { en: e.target.value, ar: editingProject.solution?.ar || '' },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الحل المعماري والتنفيذ (AR)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="بنية سحابية حديثة وتكامل الذكاء الاصطناعي..."
                    value={editingProject.solution?.ar || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        solution: { en: editingProject.solution?.en || '', ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              {/* Results (EN / AR) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Impact & Results (EN)</label>
                  <textarea
                    rows={2}
                    placeholder="+340% YoY ARR, 99.99% system availability..."
                    value={editingProject.results?.en || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        results: { en: e.target.value, ar: editingProject.results?.ar || '' },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">النتائج والعائد على الاستثمار (AR)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="+340% نمو سنوي في الإيرادات وموثوقية فائقة..."
                    value={editingProject.results?.ar || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        results: { en: editingProject.results?.en || '', ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          allowedType={mediaPickerType}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url: string) => {
            if (editingProject) {
              if (mediaPickerTarget === 'heroVideo') {
                setEditingProject({ ...editingProject, heroVideo: url });
              } else {
                setEditingProject({ ...editingProject, featuredImage: url });
              }
            }
            setMediaPickerOpen(false);
          }}
        />
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
          <p className="text-sm">Loading portfolio case studies...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <TbBriefcase className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">No projects added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const id = p.slug;
            return (
              <div
                key={p.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {p.featuredImage && (
                    <div className="aspect-video relative bg-slate-100 overflow-hidden">
                      <Image
                        src={p.featuredImage}
                        alt={p.title.en}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-persici-crimson">
                        {p.client.en}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">/{p.slug}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{p.title.en}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{p.summary.en}</p>

                    {p.metrics && p.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        {p.metrics.slice(0, 2).map((m, mi) => (
                          <div key={mi} className="bg-slate-50 p-2 rounded-lg text-center">
                            <p className="text-sm font-bold text-slate-900">{m.value}</p>
                            <p className="text-[10px] text-slate-500">{m.label.en}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <a
                    href={`/${lang}/work/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-600 hover:text-persici-crimson flex items-center gap-1"
                  >
                    <TbExternalLink className="w-3.5 h-3.5" />
                    <span>View Story</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingProject(p);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                    >
                      <TbEdit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
