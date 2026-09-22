'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  TbArticle,
  TbPlus,
  TbTrash,
  TbEdit,
  TbRefresh,
  TbDeviceFloppy,
  TbX,
  TbSparkles,
  TbPhoto,
  TbExternalLink,
  TbClock,
  TbTag,
} from 'react-icons/tb';
import { RichTextEditor, MediaPickerModal } from '@dashboard-shared/components';

interface ArticleItem {
  id?: string;
  _id?: string;
  slug: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content?: { en: string; ar: string };
  category?: { en: string; ar: string };
  author?: { name: string; role: string; avatar?: string };
  readTime?: string;
  coverImage?: string;
  publishedAt?: string;
}

export default function InsightsManagerPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/insights', { cache: 'no-store' });
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleGenerateAiOverview = async () => {
    if (!editingArticle) return;
    setGeneratingAi(true);
    try {
      const prompt = `${editingArticle.title.en}\n\n${editingArticle.excerpt.en}\n\n${editingArticle.content?.en || ''}`;
      const res = await fetch('/api/insights/ai-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, title: editingArticle.title.en }),
      });
      const data = await res.json();
      if (data.overview) {
        setEditingArticle((prev) =>
          prev
            ? {
                ...prev,
                excerpt: {
                  ...prev.excerpt,
                  en: data.overview,
                },
              }
            : null
        );
      }
    } catch (err) {
      console.error('Failed to generate AI overview:', err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    setSaving(true);
    try {
      const isNew = isCreating || (!editingArticle.id && !editingArticle._id);
      const url = '/api/insights';
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle),
      });

      if (res.ok) {
        setEditingArticle(null);
        setIsCreating(false);
        fetchArticles();
      }
    } catch (err) {
      console.error('Failed to save article:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slugOrId: string) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      const res = await fetch(`/api/insights?slug=${slugOrId}&id=${slugOrId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.slug !== slugOrId && a.id !== slugOrId));
      }
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };

  const openNewArticle = () => {
    setIsCreating(true);
    setEditingArticle({
      slug: 'insight-' + Date.now(),
      title: { en: 'New Strategic Insight', ar: 'رؤية استراتيجية جديدة' },
      excerpt: {
        en: 'Exploring the architectural paradigm shift in enterprise AI workflows.',
        ar: 'استكشاف التحول المعماري في نماذج الذكاء الاصطناعي للمؤسسات.',
      },
      content: {
        en: '<p>Enter article content here...</p>',
        ar: '<p>أدخل محتوى المقال هنا...</p>',
      },
      category: { en: 'AI & Engineering', ar: 'الذكاء الاصطناعي والهندسة' },
      author: { name: 'Persici Research Lab', role: 'Strategic Intelligence' },
      readTime: '5 min read',
      coverImage: '/images/insights/ai-enterprise.webp',
      publishedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <span>Thought Leadership & Editorial</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Articles & AI Overviews</h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish thought leadership publications, technical whitepapers, and generate AI synthesis summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openNewArticle}
            className="flex items-center gap-2 px-4 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            <TbPlus className="w-4 h-4" />
            <span>New Publication</span>
          </button>
          <button
            type="button"
            onClick={fetchArticles}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isCreating ? 'Compose New Publication' : 'Edit Article'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Read Time Estimate</label>
                  <input
                    type="text"
                    value={editingArticle.readTime || '5 min read'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
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
                    value={editingArticle.title.en}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        title: { ...editingArticle.title, en: e.target.value },
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
                    value={editingArticle.title.ar}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        title: { ...editingArticle.title, ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              {/* Excerpt with AI Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Executive Excerpt / Abstract
                  </label>
                  <button
                    type="button"
                    disabled={generatingAi}
                    onClick={handleGenerateAiOverview}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <TbSparkles className="w-3.5 h-3.5" />
                    <span>{generatingAi ? 'Generating AI Overview...' : 'Generate with AI'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <textarea
                    rows={3}
                    placeholder="English excerpt..."
                    value={editingArticle.excerpt.en}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        excerpt: { ...editingArticle.excerpt, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <textarea
                    rows={3}
                    dir="rtl"
                    placeholder="Arabic excerpt..."
                    value={editingArticle.excerpt.ar}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        excerpt: { ...editingArticle.excerpt, ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-arabic"
                  />
                </div>
              </div>

              {/* Body Content Rich Text Editor */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Full Article Content</label>
                <RichTextEditor
                  label="Article Body"
                  valueEn={editingArticle.content?.en || ''}
                  valueAr={editingArticle.content?.ar || ''}
                  onChangeEn={(val: string) =>
                    setEditingArticle((prev) =>
                      prev
                        ? {
                            ...prev,
                            content: { en: val, ar: prev.content?.ar || '' },
                          }
                        : null
                    )
                  }
                  onChangeAr={(val: string) =>
                    setEditingArticle((prev) =>
                      prev
                        ? {
                            ...prev,
                            content: { en: prev.content?.en || '', ar: val },
                          }
                        : null
                    )
                  }
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingArticle.coverImage || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5"
                  >
                    <TbPhoto className="w-4 h-4" />
                    <span>Select R2 Asset</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Publish Article'}
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
          allowedType="image"
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url: string) => {
            if (editingArticle) {
              setEditingArticle({ ...editingArticle, coverImage: url });
            }
            setMediaPickerOpen(false);
          }}
        />
      )}

      {/* Articles Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
          <p className="text-sm">Loading articles & publications...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <TbArticle className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">No articles published yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => {
            const id = a.slug;
            return (
              <div
                key={a.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {a.coverImage && (
                    <div className="aspect-video relative bg-slate-100 overflow-hidden">
                      <Image
                        src={a.coverImage}
                        alt={a.title.en}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        {a.category?.en || 'Insight'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <TbClock className="w-3.5 h-3.5" />
                        <span>{a.readTime || '5 min'}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{a.title.en}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3">{a.excerpt.en}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <a
                    href={`/${lang}/insights/${a.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-600 hover:text-persici-crimson flex items-center gap-1"
                  >
                    <TbExternalLink className="w-3.5 h-3.5" />
                    <span>Read Public</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingArticle(a);
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
