'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  TbIdBadge2,
  TbPlus,
  TbLayoutGrid,
  TbList,
  TbGripVertical,
  TbDeviceFloppy,
  TbEdit,
  TbTrash,
  TbEye,
  TbEyeOff,
  TbSearch,
  TbArrowUp,
  TbArrowDown,
  TbCheck,
  TbAlertCircle,
  TbDatabaseImport,
  TbLoader2,
  TbUser,
  TbWorld,
} from 'react-icons/tb';
import {
  DEFAULT_TEAM_MEMBERS,
  getMemberFullName,
  normalizeTeamMember,
  type TeamMemberDetail,
} from '@/lib/team-types';
import {
  TeamMemberEditorModal,
  type ActiveAiMetaInfo,
} from './_components/team-member-editor-modal';

export default function TeamMembersDashboardPage() {
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang === 'ar' ? 'ar' : 'en';
  const isRtl = lang === 'ar';

  const [members, setMembers] = useState<TeamMemberDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [activeAiMeta, setActiveAiMeta] = useState<ActiveAiMetaInfo | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Drag-and-drop state for member cards/rows
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Modal state
  const [editingMember, setEditingMember] = useState<TeamMemberDetail | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadInitial() {
      const pk =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('passkey') || ''
          : '';
      try {
        const [teamRes, aiRes] = await Promise.all([
          fetch('/api/team', { cache: 'no-store' }),
          fetch('/api/ai/config', { cache: 'no-store' }).catch(() => null),
        ]);
        const teamData = await teamRes.json();
        const aiData = aiRes ? await aiRes.json().catch(() => null) : null;

        if (!cancelled) {
          if (pk) setPasskey(pk);
          if (teamData?.success && Array.isArray(teamData.members)) {
            setMembers(
              teamData.members.map((m: unknown, idx: number) =>
                normalizeTeamMember(m, idx)
              )
            );
          } else {
            setMembers(DEFAULT_TEAM_MEMBERS);
          }

          if (aiData?.success && aiData.config) {
            const cfg = aiData.config;
            const prov = cfg.activeProvider;
            setActiveAiMeta({
              provider: prov,
              modelId: cfg.activeModelId,
              effectLevel: cfg.activeEffectLevel || 'medium',
              hasApiKey: Boolean(cfg.providers?.[prov]?.hasApiKey),
              isFreeTier: Boolean(cfg.providers?.[prov]?.isFreeTier),
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStatusMessage({
            type: 'error',
            text:
              err instanceof Error
                ? err.message
                : isRtl
                ? 'تعذر تحميل قائمة الفريق.'
                : 'Failed to load team members.',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [isRtl]);

  const moveMember = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= members.length || fromIdx === toIdx) return;
    setMembers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next.map((m, idx) => ({ ...m, order: idx + 1 }));
    });
    setOrderDirty(true);
    setStatusMessage(null);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    setStatusMessage(null);
    try {
      const orderedIds = members.map((m) => m.id);
      const res = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedIds }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to save carousel order');
      }
      if (Array.isArray(data.members)) {
        setMembers(
          data.members.map((m: unknown, idx: number) =>
            normalizeTeamMember(m, idx)
          )
        );
      }
      setOrderDirty(false);
      setStatusMessage({
        type: 'success',
        text: isRtl
          ? 'تم حفظ ترتيب أعضاء الفريق وتحديث كاروسيل الصفحة الرئيسية بنجاح.'
          : 'Team order saved and synchronized with the Homepage Team Carousel!',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save order',
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed' }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Seed failed');
      }
      if (Array.isArray(data.members)) {
        setMembers(
          data.members.map((m: unknown, idx: number) =>
            normalizeTeamMember(m, idx)
          )
        );
      }
      setOrderDirty(false);
      setStatusMessage({
        type: 'success',
        text: isRtl
          ? 'تم استيراد الأعضاء الافتراضيين إلى قاعدة البيانات.'
          : 'Default Persici team members seeded to MongoDB.',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to seed defaults',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleActive = async (member: TeamMemberDetail) => {
    const nextActive = !(member.active !== false);
    try {
      const res = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...member, active: nextActive }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed updating visibility');
      }
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? normalizeTeamMember(data.member, m.order - 1) : m
        )
      );
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Update failed',
      });
    }
  };

  const handleDeleteMember = async (member: TeamMemberDetail) => {
    const fullName = getMemberFullName(member, lang);
    if (
      !window.confirm(
        isRtl
          ? `هل أنت متأكد من حذف "${fullName}"؟`
          : `Are you sure you want to delete "${fullName}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/team?id=${encodeURIComponent(member.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to delete member');
      }
      setMembers((prev) =>
        prev
          .filter((m) => m.id !== member.id)
          .map((m, idx) => ({ ...m, order: idx + 1 }))
      );
      setStatusMessage({
        type: 'success',
        text: isRtl ? 'تم حذف العضو بنجاح.' : `Removed ${fullName}.`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Delete failed',
      });
    }
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingMember(
      normalizeTeamMember(
        {
          id: `member-${Date.now()}`,
          firstName: { en: '', ar: '' },
          lastName: { en: '', ar: '' },
          title: { en: '', ar: '' },
          avatar: '',
          portfolioUrl: '',
          order: members.length + 1,
          active: true,
        },
        members.length
      )
    );
  };

  const handleMemberSaved = (saved: TeamMemberDetail, wasNew: boolean) => {
    const normalized = normalizeTeamMember(saved, saved.order ? saved.order - 1 : 0);
    setMembers((prev) => {
      if (wasNew) {
        return [...prev, normalized].sort((a, b) => a.order - b.order);
      }
      return prev.map((m) => (m.id === normalized.id ? normalized : m));
    });
    setEditingMember(null);
    setIsCreating(false);
    setStatusMessage({
      type: 'success',
      text: isRtl
        ? 'تم حفظ بيانات عضو الفريق بنجاح ومزامنتها مع الصفحة الرئيسية.'
        : 'Saved team member details and synced with the Homepage.',
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const isFiltered = Boolean(q);
  const visibleMembers = members.filter((m) => {
    if (!q) return true;
    const text = `${m.firstName.en} ${m.lastName.en} ${m.firstName.ar} ${m.lastName.ar} ${m.title.en} ${m.title.ar}`.toLowerCase();
    return text.includes(q);
  });

  const activeCount = members.filter((m) => m.active !== false).length;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
              <TbIdBadge2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isRtl ? 'فريق العمل والموظفون' : 'Team Members Directory & Carousel'}
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                {isRtl
                  ? 'أضف وعدّل بيانات أعضاء فريق بيرسيشي مع محرر محتوى متقدم والذكاء الاصطناعي. اسحب البطاقات لتغيير ترتيب ظهورهم في كاروسيل الصفحة الرئيسية ثم اضغط "حفظ الترتيب".'
                  : 'Manage Persici specialists with draggable rich descriptions, custom sections, and AI generation. Drag members to reorder the Homepage Carousel, then click Save Order.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {seeding ? (
                <TbLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TbDatabaseImport className="w-4 h-4 text-slate-600" />
              )}
              <span>{isRtl ? 'تهيئة القائمة الافتراضية' : 'Sync / Seed Defaults'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <TbPlus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة عضو جديد' : 'Add Team Member'}</span>
            </button>
          </div>
        </div>

        {/* Stats + Search + View Mode Switcher */}
        <div className="pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold">
              {isRtl ? 'الإجمالي:' : 'Total:'} {members.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              {isRtl ? 'ظاهر في الكاروسيل:' : 'Active in Carousel:'} {activeCount}
            </span>
            {orderDirty && (
              <button
                type="button"
                disabled={savingOrder}
                onClick={handleSaveOrder}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-sm animate-pulse cursor-pointer disabled:opacity-50"
              >
                {savingOrder ? (
                  <TbLoader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TbDeviceFloppy className="w-4 h-4" />
                )}
                <span>
                  {savingOrder
                    ? isRtl
                      ? 'جاري الحفظ...'
                      : 'Saving Order...'
                    : isRtl
                    ? 'حفظ الترتيب الجديد'
                    : 'Save Order'}
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <TbSearch className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'ابحث بالاسم أو المسمى...' : 'Search by name or title...'}
                className="ps-9 pe-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-persici-crimson outline-none w-56"
              />
            </div>

            {/* Grid / List Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TbLayoutGrid className="w-4 h-4" />
                <span>{isRtl ? 'شبكة' : 'Grid'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TbList className="w-4 h-4" />
                <span>{isRtl ? 'قائمة' : 'List'}</span>
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <TbCheck className="w-4 h-4 shrink-0" />
            ) : (
              <TbAlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {isFiltered && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
            {isRtl
              ? 'مسح حقل البحث لتفعيل السحب وإعادة ترتيب جميع الأعضاء.'
              : 'Clear search filter to drag-and-drop reorder all members.'}
          </p>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
          <div className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-persici-crimson animate-spin mx-auto" />
          <p className="text-xs text-slate-500">
            {isRtl ? 'جاري تحميل أعضاء الفريق...' : 'Loading Persici team directory...'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (Draggable Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleMembers.map((member, idx) => {
            const fullName = getMemberFullName(member, lang);
            const roleTitle = member.title?.[lang] || member.title?.en;
            const isDragging = draggedIdx === idx;
            const isDragOver =
              dragOverIdx === idx && draggedIdx !== null && draggedIdx !== idx;

            return (
              <div
                key={member.id}
                draggable={!isFiltered}
                onDragStart={(e) => {
                  if (isFiltered) return;
                  setDraggedIdx(idx);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', member.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isFiltered && draggedIdx !== null && draggedIdx !== idx) {
                    setDragOverIdx(idx);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!isFiltered && draggedIdx !== null && draggedIdx !== idx) {
                    moveMember(draggedIdx, idx);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={`group rounded-3xl bg-white border overflow-hidden transition-all flex flex-col justify-between ${
                  isDragging
                    ? 'opacity-45 border-persici-crimson scale-95 shadow-xl'
                    : isDragOver
                    ? 'border-persici-crimson ring-2 ring-persici-crimson/25 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                } ${!member.active ? 'opacity-70' : ''}`}
              >
                <div>
                  {/* Card Top Bar */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {!isFiltered && (
                        <TbGripVertical className="w-4 h-4 text-slate-400 cursor-grab active:cursor-grabbing" />
                      )}
                      <span className="text-xs font-mono font-bold text-slate-600">
                        #{idx + 1}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.active !== false
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {member.active !== false
                        ? isRtl
                          ? 'نشط'
                          : 'Active'
                        : isRtl
                        ? 'مخفي'
                        : 'Hidden'}
                    </span>
                  </div>

                  {/* Portrait Preview */}
                  <div className="p-4 flex flex-col items-center text-center space-y-3">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={fullName}
                          width={96}
                          height={96}
                          draggable={false}
                          unoptimized
                          className="w-full h-full object-cover pointer-events-none select-none"
                        />
                      ) : (
                        <TbUser className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {fullName || 'Unnamed Specialist'}
                      </h3>
                      <p className="text-xs text-persici-crimson font-semibold line-clamp-2 min-h-[2rem]">
                        {roleTitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-500">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100">
                        {member.descriptionBlocks.length}{' '}
                        {isRtl ? 'عناصر وصف' : 'bio blocks'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100">
                        {member.sections.length} {isRtl ? 'أقسام' : 'sections'}
                      </span>
                      {member.portfolioUrl && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100">
                          <TbWorld className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-3 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingMember(member);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-900 hover:bg-persici-crimson text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <TbEdit className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleToggleActive(member)}
                    title={member.active !== false ? 'Hide in carousel' : 'Show in carousel'}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
                  >
                    {member.active !== false ? (
                      <TbEye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <TbEyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteMember(member)}
                    className="p-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 cursor-pointer"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <TbTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW (Compact Draggable Rows) */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {visibleMembers.map((member, idx) => {
            const fullName = getMemberFullName(member, lang);
            const roleTitle = member.title?.[lang] || member.title?.en;
            const isDragging = draggedIdx === idx;
            const isDragOver =
              dragOverIdx === idx && draggedIdx !== null && draggedIdx !== idx;

            return (
              <div
                key={member.id}
                draggable={!isFiltered}
                onDragStart={(e) => {
                  if (isFiltered) return;
                  setDraggedIdx(idx);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', member.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isFiltered && draggedIdx !== null && draggedIdx !== idx) {
                    setDragOverIdx(idx);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!isFiltered && draggedIdx !== null && draggedIdx !== idx) {
                    moveMember(draggedIdx, idx);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={`p-4 flex flex-wrap items-center justify-between gap-4 transition-colors ${
                  isDragging
                    ? 'opacity-45 bg-rose-50/40'
                    : isDragOver
                    ? 'bg-persici-crimson/[0.04]'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {!isFiltered && (
                    <TbGripVertical className="w-5 h-5 text-slate-400 shrink-0 cursor-grab active:cursor-grabbing" />
                  )}
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={fullName}
                        width={48}
                        height={48}
                        draggable={false}
                        unoptimized
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    ) : (
                      <TbUser className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {fullName || 'Unnamed Specialist'}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          member.active !== false
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {member.active !== false ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-xs text-persici-crimson font-semibold truncate">
                      {roleTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="hidden md:inline-flex px-2.5 py-1 rounded-lg bg-slate-100">
                    {member.descriptionBlocks.length} blocks · {member.sections.length}{' '}
                    sections
                  </span>

                  {!isFiltered && (
                    <>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveMember(idx, idx - 1)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === members.length - 1}
                        onClick={() => moveMember(idx, idx + 1)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => void handleToggleActive(member)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
                  >
                    {member.active !== false ? (
                      <TbEye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TbEyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingMember(member);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-persici-crimson text-white text-xs font-semibold cursor-pointer"
                  >
                    <TbEdit className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeleteMember(member)}
                    className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Persistent Save Order Bar when Order Dirty */}
      {orderDirty && (
        <div className="fixed bottom-6 end-6 z-40">
          <button
            type="button"
            disabled={savingOrder}
            onClick={handleSaveOrder}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-persici-crimson text-white text-sm font-bold shadow-2xl border border-white/10 transition-colors cursor-pointer disabled:opacity-60"
          >
            {savingOrder ? (
              <TbLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              <TbDeviceFloppy className="w-5 h-5 text-amber-300" />
            )}
            <span>
              {savingOrder
                ? isRtl
                  ? 'جاري حفظ الترتيب...'
                  : 'Saving Carousel Order...'
                : isRtl
                ? 'حفظ ترتيب الأعضاء'
                : 'Save Team Order'}
            </span>
          </button>
        </div>
      )}

      {editingMember && (
        <TeamMemberEditorModal
          initialMember={editingMember}
          isNew={isCreating}
          lang={lang}
          passkey={passkey}
          activeAiMeta={activeAiMeta}
          onClose={() => {
            setEditingMember(null);
            setIsCreating(false);
          }}
          onSaved={handleMemberSaved}
        />
      )}
    </div>
  );
}
