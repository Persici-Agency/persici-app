'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import {
  TbSparkles,
  TbRefresh,
  TbDeviceFloppy,
  TbKey,
  TbEye,
  TbEyeOff,
  TbCheck,
  TbAlertCircle,
  TbPlugConnected,
  TbCoin,
  TbActivity,
  TbCpu,
  TbExternalLink,
  TbTrash,
  TbBolt,
  TbChartBar,
} from 'react-icons/tb';
import {
  AI_PROVIDER_IDS,
  AI_PROVIDERS_META,
  EFFECT_LEVEL_PRESETS,
  DEFAULT_AI_CONFIG,
  MODEL_PRICING_CATALOG,
  resolveModelDescriptor,
  isMaskedApiKey,
  type AiProviderId,
  type AiEffectLevel,
  type AiSystemConfig,
  type AiUsageSummary,
  type AiModelDescriptor,
} from '@/lib/ai-types';

export default function AiStudioSettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const isRtl = lang === 'ar';

  const [config, setConfig] = useState<AiSystemConfig>(DEFAULT_AI_CONFIG);
  const [usage, setUsage] = useState<AiUsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingModels, setSyncingModels] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [editedKeys, setEditedKeys] = useState<Partial<Record<AiProviderId, string>>>({});
  const [clearedKeys, setClearedKeys] = useState<Set<AiProviderId>>(new Set());
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotice = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/config', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
      if (data.usage) {
        setUsage(data.usage);
      }
    } catch (err) {
      console.error('Failed to load AI Studio settings:', err);
      showNotice('error', isRtl ? 'تعذر تحميل إعدادات الذكاء الاصطناعي' : 'Failed to load AI configuration.');
    } finally {
      setLoading(false);
    }
  }, [isRtl, showNotice]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchAll();
    });
  }, [fetchAll]);

  const activeProvider = config.activeProvider;
  const activeProviderMeta = AI_PROVIDERS_META[activeProvider];
  const activeProviderSettings = config.providers[activeProvider];
  const providerModels: AiModelDescriptor[] =
    activeProviderSettings.cachedModels && activeProviderSettings.cachedModels.length > 0
      ? activeProviderSettings.cachedModels
      : MODEL_PRICING_CATALOG[activeProvider];

  const selectedModel = resolveModelDescriptor(
    activeProvider,
    config.activeModelId,
    providerModels
  );

  const activeKeyInputValue =
    editedKeys[activeProvider] !== undefined
      ? editedKeys[activeProvider]!
      : activeProviderSettings.apiKey || '';

  const activeUsageAgg = usage?.byProvider?.[activeProvider];

  // Auto-select first model when switching providers
  const handleSelectProvider = async (nextProvider: AiProviderId) => {
    const nextModels =
      config.providers[nextProvider]?.cachedModels &&
      config.providers[nextProvider].cachedModels!.length > 0
        ? config.providers[nextProvider].cachedModels!
        : MODEL_PRICING_CATALOG[nextProvider];

    const defaultNextModel = nextModels[0]?.id || MODEL_PRICING_CATALOG[nextProvider][0].id;

    setConfig((prev) => ({
      ...prev,
      activeProvider: nextProvider,
      activeModelId: defaultNextModel,
    }));

    // Auto-refresh live models in background if provider has an API key
    if (config.providers[nextProvider]?.hasApiKey || editedKeys[nextProvider]) {
      handleSyncModels(nextProvider, false);
    }
  };

  const handleSyncModels = async (
    targetProvider: AiProviderId = activeProvider,
    showFeedback = true
  ) => {
    setSyncingModels(true);
    try {
      const candidateKey = editedKeys[targetProvider];
      const headers: Record<string, string> = {};
      if (candidateKey && !isMaskedApiKey(candidateKey)) {
        headers['x-ai-api-key'] = candidateKey.trim();
      }
      const res = await fetch(`/api/ai/models?provider=${encodeURIComponent(targetProvider)}`, {
        headers,
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.models)) {
        setConfig((prev) => ({
          ...prev,
          activeModelId:
            prev.activeProvider === targetProvider &&
            !data.models.some((m: AiModelDescriptor) => m.id === prev.activeModelId)
              ? data.models[0]?.id || prev.activeModelId
              : prev.activeModelId,
          providers: {
            ...prev.providers,
            [targetProvider]: {
              ...prev.providers[targetProvider],
              cachedModels: data.models,
              modelsLastSyncedAt: data.syncedAt,
              lastError: data.error || '',
            },
          },
        }));
        if (showFeedback) {
          if (data.source === 'live-api') {
            showNotice(
              'success',
              isRtl
                ? `تم تحديث قائمة النماذج تلقائياً (${data.models.length} نموذجاً متاحاً)`
                : `Synced ${data.models.length} live models from ${AI_PROVIDERS_META[targetProvider].shortName}!`
            );
          } else {
            showNotice(
              'error',
              data.error ||
                (isRtl
                  ? 'تعذر جلب النماذج الحية (تم عرض الكتالوج المدمج). تأكد من صحة مفتاح API.'
                  : 'Used built-in model catalog. Enter a valid API key to auto-sync live releases.')
            );
          }
        }
      }
    } catch (err) {
      console.error('Model sync error:', err);
    } finally {
      setSyncingModels(false);
    }
  };

  const handleSaveConfig = async (customConfig?: AiSystemConfig) => {
    const targetConfig = customConfig || config;
    setSaving(true);
    try {
      const payloadProviders = { ...targetConfig.providers };
      for (const pid of AI_PROVIDER_IDS) {
        if (clearedKeys.has(pid)) {
          payloadProviders[pid] = { ...payloadProviders[pid], apiKey: '' };
        } else if (editedKeys[pid] !== undefined) {
          payloadProviders[pid] = {
            ...payloadProviders[pid],
            apiKey: editedKeys[pid]!.trim(),
          };
        }
      }

      const res = await fetch('/api/ai/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...targetConfig,
          providers: payloadProviders,
          clearKeys: Array.from(clearedKeys),
        }),
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
        if (data.usage) setUsage(data.usage);
        setEditedKeys({});
        setClearedKeys(new Set());
        showNotice(
          'success',
          isRtl
            ? 'تم حفظ إعدادات الذكاء الاصطناعي وتفعيل النموذج على النظام بنجاح!'
            : 'AI configuration saved and activated across the dashboard!'
        );
      } else {
        showNotice('error', data.error || 'Failed to save configuration.');
      }
    } catch (err) {
      console.error('Save AI config error:', err);
      showNotice('error', 'Network error while saving AI settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestAndCheckBalance = async () => {
    setTestingConnection(true);
    try {
      const candidateKey =
        editedKeys[activeProvider] !== undefined ? editedKeys[activeProvider] : undefined;

      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProvider,
          modelId: config.activeModelId,
          apiKey: candidateKey && !isMaskedApiKey(candidateKey) ? candidateKey : undefined,
        }),
      });
      const data = await res.json();
      if (data.config) {
        setConfig((prev) => ({
          ...data.config,
          activeProvider: prev.activeProvider,
          activeModelId:
            data.success && data.probe?.modelId
              ? data.probe.modelId
              : prev.activeModelId,
        }));
      }
      if (data.success && data.probe?.ok) {
        setEditedKeys((prev) => {
          const next = { ...prev };
          delete next[activeProvider];
          return next;
        });
      }
      if (data.usage) setUsage(data.usage);

      if (data.success && data.probe?.ok) {
        const balanceInfo =
          data.probe.liveBalanceUsd !== null && data.probe.liveBalanceUsd !== undefined
            ? ` | Live Balance: $${Number(data.probe.liveBalanceUsd).toFixed(4)}`
            : '';
        const healedNote = data.probe.autoHealedFrom
          ? isRtl
            ? ` (تم التبديل تلقائياً من ${data.probe.autoHealedFrom} إلى ${data.probe.modelId})`
            : ` (Auto-updated from ${data.probe.autoHealedFrom} to ${data.probe.modelId})`
          : ` [${data.probe.modelId}]`;
        showNotice(
          'success',
          isRtl
            ? `الاتصال ناجح مع ${activeProviderMeta.shortName}${healedNote} (${data.probe.latencyMs}ms)${balanceInfo}`
            : `Verified ${activeProviderMeta.shortName}${healedNote} (${data.probe.latencyMs}ms, ${data.probe.modelsCount} models synced)${balanceInfo}`
        );
      } else {
        showNotice(
          'error',
          data.probe?.error || (isRtl ? 'فشل التحقق من مفتاح API' : 'Connection test failed.')
        );
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      showNotice('error', 'Failed to run connection test.');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleClearProviderKey = () => {
    setClearedKeys((prev) => new Set(prev).add(activeProvider));
    setEditedKeys((prev) => ({ ...prev, [activeProvider]: '' }));
    setConfig((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [activeProvider]: {
          ...prev.providers[activeProvider],
          apiKey: '',
          hasApiKey: false,
          lastVerifiedAt: undefined,
        },
      },
    }));
  };

  // Estimate cost of generating 1 complete Client Story (~3500 input tokens, ~1800 output tokens)
  const estStoryInputTokens = 3500;
  const estStoryOutputTokens =
    config.effectLevel === 'high' ? 2600 : config.effectLevel === 'medium' ? 1800 : 1000;
  const estFullStoryCost = activeProviderSettings.isFreeTier
    ? 0
    : (estStoryInputTokens / 1_000_000) * selectedModel.inputCostPer1MTokens +
      (estStoryOutputTokens / 1_000_000) * selectedModel.outputCostPer1MTokens;

  const creditTotal = activeUsageAgg?.allocatedCreditUsd ?? activeProviderSettings.allocatedCreditUsd;
  const creditRemaining =
    activeProviderSettings.liveBalanceUsd !== null &&
    activeProviderSettings.liveBalanceUsd !== undefined
      ? activeProviderSettings.liveBalanceUsd
      : activeUsageAgg?.remainingCreditUsd ?? creditTotal;
  const creditUsed = activeUsageAgg?.totalSpendUsd ?? 0;
  const creditUsedPct =
    creditTotal > 0 ? Math.min(100, Math.round((creditUsed / creditTotal) * 100)) : 0;

  const dailyLimit =
    activeUsageAgg?.dailyFreeQuotaLimit ?? activeProviderSettings.dailyFreeQuotaLimit;
  const dailyUsed = activeUsageAgg?.todayRequests ?? 0;
  const dailyRemaining = Math.max(0, dailyLimit - dailyUsed);
  const dailyPct = dailyLimit > 0 ? Math.min(100, Math.round((dailyUsed / dailyLimit) * 100)) : 0;

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-6 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 end-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
              : 'bg-rose-950 text-rose-100 border-rose-700'
          }`}
        >
          {toast.type === 'success' ? (
            <TbCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <TbAlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson mb-1">
            <TbSparkles className="w-4 h-4" />
            <span>
              {isRtl
                ? 'مركز التحكم بالذكاء الاصطناعي وتوليد المحتوى'
                : 'Persici Intelligence • Multi-Provider AI Studio'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRtl
              ? 'إعدادات الذكاء الاصطناعي، النماذج، والرصيد'
              : 'AI Provider Settings, Auto-Models & Credit Telemetry'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            {isRtl
              ? 'اربط Gemini أو ChatGPT أو Claude أو Groq أو DeepSeek أو xAI Grok، وحدد النموذج المحدّث تلقائياً ومستوى التأثير وتابع استهلاك التوكنز والرصيد.'
              : 'Connect Gemini, ChatGPT (OpenAI), Claude, Groq, DeepSeek, or xAI Grok. Auto-sync latest released models, set Low/Medium/High effect intensity, and monitor real-time token pricing and credits.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleSyncModels(activeProvider, true)}
            disabled={syncingModels}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <TbRefresh className={`w-4 h-4 ${syncingModels ? 'animate-spin' : ''}`} />
            <span>{isRtl ? 'تحديث النماذج الآن' : 'Sync Latest Models'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveConfig()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-persici-crimson hover:bg-red-700 rounded-xl transition-colors shadow-sm shadow-persici-crimson/20 cursor-pointer disabled:opacity-50"
          >
            <TbDeviceFloppy className="w-4 h-4" />
            <span>
              {saving
                ? isRtl
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isRtl
                ? 'حفظ وتفعيل المحرك'
                : 'Save & Activate Engine'}
            </span>
          </button>
        </div>
      </div>

      {/* Primary KPI & Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Free vs Paid Tier Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'نوع الباقة والحالة' : 'Billing Tier & Key Status'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                activeProviderSettings.isFreeTier
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {activeProviderSettings.isFreeTier
                ? isRtl
                  ? 'خطة مجانية (Free)'
                  : 'FREE TIER'
                : isRtl
                ? 'خطة مدفوعة (Paid)'
                : 'PAID API'}
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            {activeProviderMeta.shortName} • {selectedModel.id}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isRtl
              ? activeProviderMeta.freeTierSummary.ar
              : activeProviderMeta.freeTierSummary.en}
          </p>
        </div>

        {/* Card 2: Input & Output Token Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'تسعير التوكنز (لكل 1M)' : 'Token Cost (Per 1M Tokens)'}
            </span>
            <TbCoin className="w-5 h-5 text-amber-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block">
                {isRtl ? 'توكن الإدخال (Input)' : 'Input / 1M'}
              </span>
              <span className="text-sm font-bold font-mono text-slate-900">
                ${selectedModel.inputCostPer1MTokens.toFixed(2)}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block">
                {isRtl ? 'توكن الإخراج (Output)' : 'Output / 1M'}
              </span>
              <span className="text-sm font-bold font-mono text-slate-900">
                ${selectedModel.outputCostPer1MTokens.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            {isRtl ? 'التكلفة التقديرية لقصة عميل كاملة:' : 'Est. cost per full Client Story:'}{' '}
            <strong className="text-slate-900 font-mono">
              {activeProviderSettings.isFreeTier
                ? '$0.00 (Free Tier)'
                : `~$${estFullStoryCost.toFixed(4)}`}
            </strong>
          </p>
        </div>

        {/* Card 3: Credit Balance or Free Daily Quota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {activeProviderSettings.isFreeTier
                ? isRtl
                  ? 'الحصة المجانية المتبقية اليوم'
                  : 'Free Tier Daily Quota'
                : isRtl
                ? 'الرصيد المتبقي (Credit)'
                : 'Remaining Credit Balance'}
            </span>
            <TbBolt className="w-5 h-5 text-purple-600" />
          </div>

          {activeProviderSettings.isFreeTier ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-700">
                  {dailyRemaining}
                </span>
                <span className="text-xs text-slate-400">
                  / {dailyLimit} {isRtl ? 'طلب متاح اليوم' : 'requests left today'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.max(4, 100 - dailyPct)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {activeProviderSettings.rateLimitRemainingRequests !== null &&
                activeProviderSettings.rateLimitRemainingRequests !== undefined
                  ? `API Header Remaining Req: ${activeProviderSettings.rateLimitRemainingRequests}`
                  : isRtl
                  ? `قيمة التوفير التقديرية: $${(activeUsageAgg?.theoreticalValueUsd || 0).toFixed(4)}`
                  : `Value saved on Free Tier: $${(activeUsageAgg?.theoreticalValueUsd || 0).toFixed(4)}`}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  ${Number(creditRemaining).toFixed(3)}
                </span>
                <span className="text-xs text-slate-400">
                  {activeProviderSettings.liveBalanceUsd !== null &&
                  activeProviderSettings.liveBalanceUsd !== undefined
                    ? isRtl
                      ? '(رصيد API المباشر)'
                      : '(Live Provider Balance)'
                    : `/ $${creditTotal.toFixed(2)}`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditUsedPct > 85 ? 'bg-rose-500' : 'bg-purple-600'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, 100 - creditUsedPct))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {isRtl ? 'المستهلك في هذا المزود:' : 'Logged spend on provider:'}{' '}
                <strong className="font-mono text-slate-800">${creditUsed.toFixed(4)}</strong>
              </p>
            </>
          )}
        </div>

        {/* Card 4: Cumulative Consumption */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'إجمالي الاستهلاك والسرعة' : 'Global AI Telemetry'}
            </span>
            <TbActivity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {(usage?.totalTokens || 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">{isRtl ? 'إجمالي توكن' : 'total tokens'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>
              {isRtl ? 'الطلبات:' : 'Requests:'}{' '}
              <strong className="text-slate-800">{usage?.totalRequests || 0}</strong>
            </span>
            <span>
              {isRtl ? 'متوسط السرعة:' : 'Avg Latency:'}{' '}
              <strong className="text-slate-800">{usage?.averageLatencyMs || 0}ms</strong>
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            {isRtl ? 'سياق النموذج:' : 'Model Context Window:'}{' '}
            <strong className="font-mono">{selectedModel.contextWindow.toLocaleString()}</strong> tokens
          </p>
        </div>
      </div>

      {/* Main Engine Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-persici-crimson/10 text-persici-crimson">
                <TbCpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isRtl ? 'تكوين محرك الذكاء الاصطناعي النشط' : 'Active AI Engine & Model Selection'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl
                    ? 'يتم استخدام هذه الإعدادات تلقائياً عند التوليد داخل قصص العملاء.'
                    : 'Used automatically whenever editors click "Generate with AI" in Client Stories.'}
                </p>
              </div>
            </div>

            {activeProviderSettings.modelsLastSyncedAt && (
              <span className="text-[11px] font-mono text-slate-400">
                {isRtl ? 'آخر مزامنة:' : 'Models synced:'}{' '}
                {new Date(activeProviderSettings.modelsLastSyncedAt).toLocaleString()}
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              {isRtl ? 'جاري تحميل إعدادات المحرك...' : 'Loading AI configuration...'}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Row 1: Provider Company Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {isRtl
                    ? '1. اختر شركة الذكاء الاصطناعي (AI Provider Platform)'
                    : '1. Select AI Company / Provider Platform'}
                </label>
                <select
                  value={activeProvider}
                  onChange={(e) => handleSelectProvider(e.target.value as AiProviderId)}
                  className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none cursor-pointer"
                >
                  {AI_PROVIDER_IDS.map((pid) => {
                    const meta = AI_PROVIDERS_META[pid];
                    const hasKey =
                      Boolean(config.providers[pid]?.hasApiKey) ||
                      Boolean(editedKeys[pid]);
                    return (
                      <option key={pid} value={pid}>
                        {meta.name} {hasKey ? '✓ Key Configured' : '• Setup Required'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Row 2: Auto-Updating Model Dropdown + Effect Level Selector Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      {isRtl
                        ? `2. اسم النموذج (${providerModels.length} نموذج متاح تلقائياً)`
                        : `2. Model Name (${providerModels.length} Auto-Updated Models)`}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSyncModels(activeProvider, true)}
                      disabled={syncingModels}
                      className="text-[11px] font-semibold text-persici-crimson hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <TbRefresh className={`w-3 h-3 ${syncingModels ? 'animate-spin' : ''}`} />
                      <span>{isRtl ? 'تحديث القائمة' : 'Refresh Live List'}</span>
                    </button>
                  </div>
                  <select
                    value={config.activeModelId}
                    onChange={(e) => setConfig((prev) => ({ ...prev, activeModelId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none cursor-pointer"
                  >
                    {providerModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} [{m.id}] — In: ${m.inputCostPer1MTokens}/1M • Out: ${m.outputCostPer1MTokens}/1M
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isRtl
                      ? 'يتم جلب أي إصدارات جديدة من الشركة المزودة تلقائياً بمجرد توفرها.'
                      : 'New models released by the provider are automatically fetched and appended to the top of this list.'}
                  </p>
                </div>

                {/* Effect / Intensity Level beside Model */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {isRtl
                      ? '3. مستوى التأثير والعمق (Effect Level)'
                      : '3. Reasoning & Effect Level'}
                  </label>
                  <select
                    value={config.effectLevel}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        effectLevel: e.target.value as AiEffectLevel,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none cursor-pointer"
                  >
                    {(['low', 'medium', 'high'] as AiEffectLevel[]).map((lvl) => {
                      const preset = EFFECT_LEVEL_PRESETS[lvl];
                      return (
                        <option key={lvl} value={lvl}>
                          {isRtl ? preset.labelAr : preset.labelEn}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isRtl
                      ? EFFECT_LEVEL_PRESETS[config.effectLevel].descAr
                      : EFFECT_LEVEL_PRESETS[config.effectLevel].descEn}
                  </p>
                </div>
              </div>

              {/* Row 3: API Key Input & Live Verification */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <TbKey className="w-4 h-4 text-persici-crimson" />
                    <span>
                      {isRtl
                        ? `4. مفتاح الربط API Key (${activeProviderMeta.shortName})`
                        : `4. ${activeProviderMeta.shortName} API Key (Stored Server-Side)`}
                    </span>
                  </label>
                  <a
                    href={activeProviderMeta.consoleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    <span>
                      {isRtl ? 'الحصول على مفتاح API' : `Open ${activeProviderMeta.shortName} Console`}
                    </span>
                    <TbExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={activeKeyInputValue}
                      placeholder={activeProviderMeta.keyPrefixHint}
                      onChange={(e) => {
                        const val = e.target.value;
                        setClearedKeys((prev) => {
                          const next = new Set(prev);
                          next.delete(activeProvider);
                          return next;
                        });
                        setEditedKeys((prev) => ({
                          ...prev,
                          [activeProvider]: val,
                        }));
                      }}
                      className="w-full pe-10 ps-3.5 py-2.5 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:border-persici-crimson outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((prev) => !prev)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={showKey ? 'Hide key' : 'Reveal key'}
                    >
                      {showKey ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestAndCheckBalance}
                    disabled={testingConnection}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <TbPlugConnected className="w-4 h-4" />
                    <span>
                      {testingConnection
                        ? isRtl
                          ? 'جاري الفحص...'
                          : 'Testing...'
                        : isRtl
                        ? 'فحص الاتصال والرصيد'
                        : 'Verify Key & Sync Balance'}
                    </span>
                  </button>

                  {activeProviderSettings.hasApiKey && (
                    <button
                      type="button"
                      onClick={handleClearProviderKey}
                      className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer shrink-0"
                      title={isRtl ? 'حذف المفتاح' : 'Clear saved key'}
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {activeProviderSettings.lastError && (
                  <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                    {activeProviderSettings.lastError}
                  </div>
                )}

                {activeProviderSettings.lastVerifiedAt && !activeProviderSettings.lastError && (
                  <div className="text-[11px] text-emerald-700 flex flex-wrap items-center gap-2">
                    <TbCheck className="w-3.5 h-3.5" />
                    <span>
                      {isRtl ? 'تم التحقق بنجاح بتاريخ:' : 'Verified at:'}{' '}
                      {new Date(activeProviderSettings.lastVerifiedAt).toLocaleString()}
                    </span>
                    {activeProviderSettings.rateLimitRemainingTokens !== null &&
                      activeProviderSettings.rateLimitRemainingTokens !== undefined && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                          Remaining Rate-Limit Tokens:{' '}
                          {activeProviderSettings.rateLimitRemainingTokens.toLocaleString()}
                        </span>
                      )}
                  </div>
                )}
              </div>

              {/* Row 4: Billing Tier (Free vs Paid), Credit Budget & Daily Quota Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="block text-[11px] font-bold uppercase text-slate-600">
                    {isRtl ? 'وضع الحساب (مجاني أم مدفوع؟)' : 'Account Tier Mode'}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          providers: {
                            ...prev.providers,
                            [activeProvider]: {
                              ...prev.providers[activeProvider],
                              isFreeTier: true,
                            },
                          },
                        }))
                      }
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        activeProviderSettings.isFreeTier
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isRtl ? 'مجاني (Free)' : 'Free Tier'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          providers: {
                            ...prev.providers,
                            [activeProvider]: {
                              ...prev.providers[activeProvider],
                              isFreeTier: false,
                            },
                          },
                        }))
                      }
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        !activeProviderSettings.isFreeTier
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isRtl ? 'مدفوع (Paid)' : 'Paid API'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">
                    {isRtl ? 'ميزانية الرصيد المخصصة ($ USD)' : 'Allocated Credit Budget ($ USD)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={activeProviderSettings.allocatedCreditUsd}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        providers: {
                          ...prev.providers,
                          [activeProvider]: {
                            ...prev.providers[activeProvider],
                            allocatedCreditUsd: Math.max(0, Number(e.target.value) || 0),
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    {isRtl
                      ? 'يُخصم منها الاستهلاك الفعلي لحساب الرصيد المتبقي.'
                      : 'Tracks spend vs. remaining prepaid credit balance.'}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">
                    {isRtl ? 'الحد اليومي المجاني (Daily Requests)' : 'Daily Free Request Allowance'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={activeProviderSettings.dailyFreeQuotaLimit}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        providers: {
                          ...prev.providers,
                          [activeProvider]: {
                            ...prev.providers[activeProvider],
                            dailyFreeQuotaLimit: Math.max(0, Number(e.target.value) || 0),
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    {isRtl
                      ? 'يتتبّع عدد الطلبات المتبقية اليوم عند استخدام الخطة المجانية.'
                      : 'Monitors remaining free-tier daily quota.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: All 5 Providers Overview Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TbChartBar className="w-4 h-4 text-persici-crimson" />
              <span>{isRtl ? 'مقارنة جميع المنصات الست' : 'All 6 Supported AI Platforms'}</span>
            </h3>

            <div className="space-y-2.5">
              {AI_PROVIDER_IDS.map((pid) => {
                const meta = AI_PROVIDERS_META[pid];
                const pSet = config.providers[pid];
                const pAgg = usage?.byProvider?.[pid];
                const isSelected = activeProvider === pid;
                const hasKey = Boolean(pSet?.hasApiKey) || Boolean(editedKeys[pid]);
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => handleSelectProvider(pid)}
                    className={`w-full text-start p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'border-persici-crimson bg-persici-crimson/[0.04] ring-1 ring-persici-crimson/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{meta.shortName}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            meta.defaultFreeTierAvailable
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {meta.defaultFreeTierAvailable ? 'Free Tier Opt.' : 'Paid API'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            hasKey
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {hasKey ? (isRtl ? 'مربوط' : 'Connected') : isRtl ? 'بدون مفتاح' : 'No Key'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        {pAgg?.requests || 0} req • {(pAgg?.totalTokens || 0).toLocaleString()} tok
                      </span>
                      <span className="font-mono font-semibold text-slate-700">
                        {pSet.liveBalanceUsd !== null && pSet.liveBalanceUsd !== undefined
                          ? `Bal: $${Number(pSet.liveBalanceUsd).toFixed(2)}`
                          : `Spend: $${(pAgg?.totalSpendUsd || 0).toFixed(4)}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent AI Generation Telemetry Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isRtl ? 'سجل عمليات التوليد واستهلاك التوكنز' : 'Recent AI Generation & Token Usage Logs'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRtl
                ? 'سجل حي لكل عملية توليد في محرر قصص العملاء مع تكلفة الإدخال والإخراج وزمن التنفيذ.'
                : 'Real-time audit log of field generations, input/output tokens, computed cost, and latency.'}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <TbRefresh className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تحديث السجل' : 'Refresh Logs'}</span>
          </button>
        </div>

        {!usage || usage.recentLogs.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            {isRtl
              ? 'لم يتم إجراء أي عمليات توليد بعد. افتح قسم "قصص العملاء" وارفع ملف مرجع للبدء.'
              : 'No AI generations logged yet. Open Client Stories, upload a reference file, and generate content to see live token telemetry.'}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-start text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start">{isRtl ? 'المزود والنموذج' : 'Provider & Model'}</th>
                  <th className="px-4 py-3 text-start">{isRtl ? 'الحقل المستهدف' : 'Target Field'}</th>
                  <th className="px-4 py-3 text-start">{isRtl ? 'التأثير' : 'Effect'}</th>
                  <th className="px-4 py-3 text-start">{isRtl ? 'التوكنز (In / Out)' : 'Tokens (In / Out)'}</th>
                  <th className="px-4 py-3 text-start">{isRtl ? 'التكلفة' : 'Cost'}</th>
                  <th className="px-4 py-3 text-start">{isRtl ? 'الزمن' : 'Latency'}</th>
                  <th className="px-4 py-3 text-start">{isRtl ? 'الحالة والتاريخ' : 'Status & Time'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usage.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">
                        {AI_PROVIDERS_META[log.provider]?.shortName || log.provider}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{log.modelId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {log.targetField}
                      </span>
                      {log.storySlug && (
                        <div className="text-[10px] text-slate-400 mt-0.5">{log.storySlug}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 uppercase font-mono text-[10px] font-bold">
                      {log.effectLevel}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">
                      {log.inputTokens.toLocaleString()} / {log.outputTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">
                      {log.isFreeTier ? (
                        <span className="text-emerald-700 font-semibold">
                          Free (${log.theoreticalPaidCostUsd.toFixed(4)} val)
                        </span>
                      ) : (
                        <span className="text-slate-900 font-semibold">
                          ${log.estimatedCostUsd.toFixed(5)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">{log.latencyMs}ms</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {log.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
