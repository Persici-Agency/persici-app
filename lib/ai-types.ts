export type AiProviderId = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'deepseek';
export type AiEffectLevel = 'low' | 'medium' | 'high';

export interface AiModelDescriptor {
  id: string;
  name: string;
  provider: AiProviderId;
  supportsJsonMode: boolean;
  supportsReasoning: boolean;
  contextWindow: number;
  inputCostPer1MTokens: number; // USD per 1M input tokens
  outputCostPer1MTokens: number; // USD per 1M output tokens
  freeTierAvailable: boolean;
  freeTierNotes?: string;
  isLatest?: boolean;
  releasedAt?: string;
}

export interface AiProviderSettings {
  provider: AiProviderId;
  apiKey: string;
  hasApiKey?: boolean;
  isFreeTier: boolean;
  allocatedCreditUsd: number;
  dailyFreeQuotaLimit: number;
  customBaseUrl?: string;
  lastVerifiedAt?: string;
  lastError?: string;
  liveBalanceUsd?: number | null;
  liveGrantedBalanceUsd?: number | null;
  liveToppedUpBalanceUsd?: number | null;
  rateLimitRemainingRequests?: number | null;
  rateLimitRemainingTokens?: number | null;
  cachedModels?: AiModelDescriptor[];
  modelsLastSyncedAt?: string;
}

export interface AiSystemConfig {
  activeProvider: AiProviderId;
  activeModelId: string;
  effectLevel: AiEffectLevel;
  providers: Record<AiProviderId, AiProviderSettings>;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AiUsageLogEntry {
  id: string;
  provider: AiProviderId;
  modelId: string;
  effectLevel: AiEffectLevel;
  targetField: string;
  storySlug?: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  theoreticalPaidCostUsd: number;
  isFreeTier: boolean;
  latencyMs: number;
  status: 'success' | 'error';
  errorMessage?: string;
  userId?: string;
  createdAt: string;
}

export interface AiProviderUsageAggregate {
  provider: AiProviderId;
  requests: number;
  todayRequests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalSpendUsd: number;
  theoreticalValueUsd: number;
  allocatedCreditUsd: number;
  remainingCreditUsd: number;
  dailyFreeQuotaLimit: number;
  remainingFreeDailyRequests: number;
  isFreeTier: boolean;
  liveBalanceUsd?: number | null;
}

export interface AiUsageSummary {
  totalRequests: number;
  todayRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalSpendUsd: number;
  theoreticalPaidValueUsd: number;
  averageLatencyMs: number;
  byProvider: Record<AiProviderId, AiProviderUsageAggregate>;
  recentLogs: AiUsageLogEntry[];
}

export interface AiProviderMeta {
  id: AiProviderId;
  name: string;
  shortName: string;
  company: string;
  keyPrefixHint: string;
  consoleUrl: string;
  defaultFreeTierAvailable: boolean;
  freeTierSummary: {
    en: string;
    ar: string;
  };
  billingNotes: {
    en: string;
    ar: string;
  };
}

export const AI_PROVIDER_IDS: AiProviderId[] = [
  'gemini',
  'openai',
  'anthropic',
  'groq',
  'deepseek',
];

export const AI_PROVIDERS_META: Record<AiProviderId, AiProviderMeta> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (AI Studio / Vertex)',
    shortName: 'Gemini',
    company: 'Google DeepMind',
    keyPrefixHint: 'AIzaSy...',
    consoleUrl: 'https://aistudio.google.com/app/apikey',
    defaultFreeTierAvailable: true,
    freeTierSummary: {
      en: 'Free Tier available via Google AI Studio (15–30 RPM, up to 1,500 RPD on Flash)',
      ar: 'يتوفر مستوى مجاني عبر Google AI Studio (15–30 طلب/دقيقة وحتى 1,500 طلب/يوم لـ Flash)',
    },
    billingNotes: {
      en: 'Paid tier removes strict rate limits & unlocks high-throughput Pro reasoning.',
      ar: 'الخطة المدفوعة ترفع حدود الاستخدام وتتيح أعلى سرعة لنماذج Pro.',
    },
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (ChatGPT / GPT & o-Series)',
    shortName: 'ChatGPT',
    company: 'OpenAI',
    keyPrefixHint: 'sk-proj-... or sk-...',
    consoleUrl: 'https://platform.openai.com/api-keys',
    defaultFreeTierAvailable: false,
    freeTierSummary: {
      en: 'Paid API (Prepaid credits required; free trial credits only on new qualifying accounts)',
      ar: 'API مدفوع (يتطلب شحن رصيد مسبق في OpenAI Platform)',
    },
    billingNotes: {
      en: 'Pay-as-you-go per 1M input/output tokens; monitor spend via Allocated Credit tracker.',
      ar: 'محاسبة حسب الاستهلاك لكل مليون توكن؛ يمكنك تتبع الرصيد المتبقي بدقة من هنا.',
    },
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    shortName: 'Claude',
    company: 'Anthropic',
    keyPrefixHint: 'sk-ant-api03-...',
    consoleUrl: 'https://console.anthropic.com/settings/keys',
    defaultFreeTierAvailable: false,
    freeTierSummary: {
      en: 'Paid API (Requires prepaid credits in Anthropic Console; occasional starter grant)',
      ar: 'API مدفوع (يتطلب رصيداً في لوحة تحكم Anthropic Console)',
    },
    billingNotes: {
      en: 'Industry-leading editorial nuance & Arabic/English fluency.',
      ar: 'جودة تحريرية وصياغة عربية وإنجليزية فائقة الدقة.',
    },
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud (LPU Ultra-Fast Inference)',
    shortName: 'Groq',
    company: 'Groq',
    keyPrefixHint: 'gsk_...',
    consoleUrl: 'https://console.groq.com/keys',
    defaultFreeTierAvailable: true,
    freeTierSummary: {
      en: 'Generous Free Developer Tier (Up to 1,000–14,400 RPD depending on model)',
      ar: 'خطة مجانية سخية للمطورين (تصل إلى 1,000–14,400 طلب يومياً حسب النموذج)',
    },
    billingNotes: {
      en: 'Ultra-low latency LPU inference ideal for instant field regeneration.',
      ar: 'سرعة استجابة فائقة لتوليد الحقول بشكل شبه فوري.',
    },
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek AI (V3 & R1)',
    shortName: 'DeepSeek',
    company: 'DeepSeek',
    keyPrefixHint: 'sk-...',
    consoleUrl: 'https://platform.deepseek.com/api_keys',
    defaultFreeTierAvailable: false,
    freeTierSummary: {
      en: 'Ultra-low-cost Paid API + supports Live Balance API (/user/balance)',
      ar: 'API منخفض التكلفة للغاية + يدعم جلب الرصيد الفعلي تلقائياً من السيرفر',
    },
    billingNotes: {
      en: 'Extremely cost-efficient (~$0.27/1M input) with live balance telemetry built-in.',
      ar: 'تكلفة اقتصادية جداً مع إمكانية قراءة الرصيد الفعلي المتبقي مباشرة من API.',
    },
  },
};

export const EFFECT_LEVEL_PRESETS: Record<
  AiEffectLevel,
  {
    id: AiEffectLevel;
    labelEn: string;
    labelAr: string;
    descEn: string;
    descAr: string;
    temperature: number;
    maxOutputTokens: number;
    geminiThinkingBudget: number;
    reasoningEffort: 'low' | 'medium' | 'high';
    anthropicThinkingBudget: number;
  }
> = {
  low: {
    id: 'low',
    labelEn: 'Low (Fast & Concise)',
    labelAr: 'منخفض (سريع ومباشر)',
    descEn: 'Quick factual extraction with tight concise outputs and minimal token usage.',
    descAr: 'استخلاص سريع ومختصر بأقل استهلاك للتوكنز وزمن استجابة فوري.',
    temperature: 0.2,
    maxOutputTokens: 1600,
    geminiThinkingBudget: 512,
    reasoningEffort: 'low',
    anthropicThinkingBudget: 1024,
  },
  medium: {
    id: 'medium',
    labelEn: 'Medium (Balanced SEO & Editorial)',
    labelAr: 'متوسط (متوازن للـ SEO والتحرير)',
    descEn: 'Optimal balance of persuasive B2B storytelling, SEO keyword depth, and speed.',
    descAr: 'توازن مثالي بين السرد الاحترافي وتضمين كلمات SEO المفتاحية والسرعة.',
    temperature: 0.45,
    maxOutputTokens: 3200,
    geminiThinkingBudget: 2048,
    reasoningEffort: 'medium',
    anthropicThinkingBudget: 2048,
  },
  high: {
    id: 'high',
    labelEn: 'High (Deep Strategy & Max SEO)',
    labelAr: 'عالي (تحليل معمق وأقصى SEO)',
    descEn: 'Deep analytical synthesis, rich executive nuance, and comprehensive SEO optimization.',
    descAr: 'صياغة استراتيجية عميقة، غنى لغوي وتنفيذي، وأعلى تحسين لمحركات البحث.',
    temperature: 0.65,
    maxOutputTokens: 6000,
    geminiThinkingBudget: 8192,
    reasoningEffort: 'high',
    anthropicThinkingBudget: 4096,
  },
};

export const MODEL_PRICING_CATALOG: Record<AiProviderId, AiModelDescriptor[]> = {
  gemini: [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash (Recommended)',
      provider: 'gemini',
      supportsJsonMode: true,
      supportsReasoning: true,
      contextWindow: 1048576,
      inputCostPer1MTokens: 0.15,
      outputCostPer1MTokens: 0.6,
      freeTierAvailable: true,
      freeTierNotes: '10 RPM / 250–500 RPD Free Tier on AI Studio',
      isLatest: true,
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      provider: 'gemini',
      supportsJsonMode: true,
      supportsReasoning: true,
      contextWindow: 1048576,
      inputCostPer1MTokens: 1.25,
      outputCostPer1MTokens: 10.0,
      freeTierAvailable: true,
      freeTierNotes: 'Limited Free Tier RPM on AI Studio',
      isLatest: true,
    },
    {
      id: 'gemini-2.5-flash-lite',
      name: 'Gemini 2.5 Flash-Lite',
      provider: 'gemini',
      supportsJsonMode: true,
      supportsReasoning: true,
      contextWindow: 1048576,
      inputCostPer1MTokens: 0.1,
      outputCostPer1MTokens: 0.4,
      freeTierAvailable: true,
      freeTierNotes: '15 RPM / 1,000 RPD Free Tier on AI Studio',
      isLatest: true,
    },
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'gemini',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 1048576,
      inputCostPer1MTokens: 0.1,
      outputCostPer1MTokens: 0.4,
      freeTierAvailable: true,
      freeTierNotes: '15 RPM / 1,500 RPD Free Tier on AI Studio',
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      provider: 'gemini',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 2097152,
      inputCostPer1MTokens: 1.25,
      outputCostPer1MTokens: 5.0,
      freeTierAvailable: true,
      freeTierNotes: '2 RPM Free Tier limit',
    },
  ],
  openai: [
    {
      id: 'gpt-4.1',
      name: 'GPT-4.1 (Flagship)',
      provider: 'openai',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 1047576,
      inputCostPer1MTokens: 2.0,
      outputCostPer1MTokens: 8.0,
      freeTierAvailable: false,
      isLatest: true,
    },
    {
      id: 'gpt-4.1-mini',
      name: 'GPT-4.1 Mini',
      provider: 'openai',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 1047576,
      inputCostPer1MTokens: 0.4,
      outputCostPer1MTokens: 1.6,
      freeTierAvailable: false,
      isLatest: true,
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'openai',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 128000,
      inputCostPer1MTokens: 2.5,
      outputCostPer1MTokens: 10.0,
      freeTierAvailable: false,
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'openai',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 128000,
      inputCostPer1MTokens: 0.15,
      outputCostPer1MTokens: 0.6,
      freeTierAvailable: false,
    },
    {
      id: 'o4-mini',
      name: 'o4-mini (Reasoning)',
      provider: 'openai',
      supportsJsonMode: true,
      supportsReasoning: true,
      contextWindow: 200000,
      inputCostPer1MTokens: 1.1,
      outputCostPer1MTokens: 4.4,
      freeTierAvailable: false,
      isLatest: true,
    },
    {
      id: 'o3',
      name: 'o3 (Deep Reasoning)',
      provider: 'openai',
      supportsJsonMode: true,
      supportsReasoning: true,
      contextWindow: 200000,
      inputCostPer1MTokens: 10.0,
      outputCostPer1MTokens: 40.0,
      freeTierAvailable: false,
      isLatest: true,
    },
  ],
  anthropic: [
    {
      id: 'claude-sonnet-4-20250514',
      name: 'Claude Sonnet 4',
      provider: 'anthropic',
      supportsJsonMode: false,
      supportsReasoning: true,
      contextWindow: 200000,
      inputCostPer1MTokens: 3.0,
      outputCostPer1MTokens: 15.0,
      freeTierAvailable: false,
      isLatest: true,
    },
    {
      id: 'claude-opus-4-20250514',
      name: 'Claude Opus 4',
      provider: 'anthropic',
      supportsJsonMode: false,
      supportsReasoning: true,
      contextWindow: 200000,
      inputCostPer1MTokens: 15.0,
      outputCostPer1MTokens: 75.0,
      freeTierAvailable: false,
      isLatest: true,
    },
    {
      id: 'claude-3-7-sonnet-latest',
      name: 'Claude 3.7 Sonnet',
      provider: 'anthropic',
      supportsJsonMode: false,
      supportsReasoning: true,
      contextWindow: 200000,
      inputCostPer1MTokens: 3.0,
      outputCostPer1MTokens: 15.0,
      freeTierAvailable: false,
    },
    {
      id: 'claude-3-5-sonnet-latest',
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      supportsJsonMode: false,
      supportsReasoning: false,
      contextWindow: 200000,
      inputCostPer1MTokens: 3.0,
      outputCostPer1MTokens: 15.0,
      freeTierAvailable: false,
    },
    {
      id: 'claude-3-5-haiku-latest',
      name: 'Claude 3.5 Haiku',
      provider: 'anthropic',
      supportsJsonMode: false,
      supportsReasoning: false,
      contextWindow: 200000,
      inputCostPer1MTokens: 0.8,
      outputCostPer1MTokens: 4.0,
      freeTierAvailable: false,
    },
  ],
  groq: [
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B Versatile',
      provider: 'groq',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 128000,
      inputCostPer1MTokens: 0.59,
      outputCostPer1MTokens: 0.79,
      freeTierAvailable: true,
      freeTierNotes: '1,000 RPD / 30 RPM Free Tier on GroqCloud',
      isLatest: true,
    },
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B Instant',
      provider: 'groq',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 128000,
      inputCostPer1MTokens: 0.05,
      outputCostPer1MTokens: 0.08,
      freeTierAvailable: true,
      freeTierNotes: '14,400 RPD / 30 RPM Free Tier on GroqCloud',
    },
    {
      id: 'deepseek-r1-distill-llama-70b',
      name: 'DeepSeek R1 Distill Llama 70B (Groq)',
      provider: 'groq',
      supportsJsonMode: true,
      supportsReasoning: true,
      contextWindow: 128000,
      inputCostPer1MTokens: 0.75,
      outputCostPer1MTokens: 0.99,
      freeTierAvailable: true,
      freeTierNotes: '1,000 RPD Free Tier on GroqCloud',
      isLatest: true,
    },
    {
      id: 'qwen-qwq-32b',
      name: 'Qwen QwQ 32B',
      provider: 'groq',
      supportsJsonMode: true,
      supportsReasoning: true,
      contextWindow: 128000,
      inputCostPer1MTokens: 0.29,
      outputCostPer1MTokens: 0.39,
      freeTierAvailable: true,
      freeTierNotes: '1,000 RPD Free Tier on GroqCloud',
    },
  ],
  deepseek: [
    {
      id: 'deepseek-chat',
      name: 'DeepSeek-V3 (deepseek-chat)',
      provider: 'deepseek',
      supportsJsonMode: true,
      supportsReasoning: false,
      contextWindow: 65536,
      inputCostPer1MTokens: 0.27,
      outputCostPer1MTokens: 1.1,
      freeTierAvailable: false,
      isLatest: true,
    },
    {
      id: 'deepseek-reasoner',
      name: 'DeepSeek-R1 (deepseek-reasoner)',
      provider: 'deepseek',
      supportsJsonMode: false,
      supportsReasoning: true,
      contextWindow: 65536,
      inputCostPer1MTokens: 0.55,
      outputCostPer1MTokens: 2.19,
      freeTierAvailable: false,
      isLatest: true,
    },
  ],
};

function createDefaultProviderSettings(provider: AiProviderId): AiProviderSettings {
  const meta = AI_PROVIDERS_META[provider];
  return {
    provider,
    apiKey: '',
    hasApiKey: false,
    isFreeTier: meta.defaultFreeTierAvailable,
    allocatedCreditUsd: meta.defaultFreeTierAvailable ? 0 : 10,
    dailyFreeQuotaLimit: meta.defaultFreeTierAvailable ? 250 : 0,
    customBaseUrl: '',
    liveBalanceUsd: null,
    liveGrantedBalanceUsd: null,
    liveToppedUpBalanceUsd: null,
    rateLimitRemainingRequests: null,
    rateLimitRemainingTokens: null,
    cachedModels: MODEL_PRICING_CATALOG[provider],
  };
}

export const DEFAULT_AI_CONFIG: AiSystemConfig = {
  activeProvider: 'gemini',
  activeModelId: 'gemini-2.5-flash',
  effectLevel: 'medium',
  providers: {
    gemini: createDefaultProviderSettings('gemini'),
    openai: createDefaultProviderSettings('openai'),
    anthropic: createDefaultProviderSettings('anthropic'),
    groq: createDefaultProviderSettings('groq'),
    deepseek: createDefaultProviderSettings('deepseek'),
  },
};

export function maskApiKey(key?: string): string {
  if (!key || typeof key !== 'string') return '';
  const trimmed = key.trim();
  if (trimmed.length === 0) return '';
  if (trimmed.length <= 8) return '••••••••';
  return `${trimmed.slice(0, 5)}••••••••${trimmed.slice(-4)}`;
}

export function isMaskedApiKey(val?: string): boolean {
  return Boolean(val && val.includes('••••'));
}

export function normalizeAiConfig(raw?: Partial<AiSystemConfig> | Record<string, unknown> | null): AiSystemConfig {
  const base = structuredClone(DEFAULT_AI_CONFIG);
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const obj = raw as Record<string, unknown>;
  const activeProvider: AiProviderId = AI_PROVIDER_IDS.includes(obj.activeProvider as AiProviderId)
    ? (obj.activeProvider as AiProviderId)
    : base.activeProvider;

  const effectLevel: AiEffectLevel =
    obj.effectLevel === 'low' || obj.effectLevel === 'medium' || obj.effectLevel === 'high'
      ? obj.effectLevel
      : base.effectLevel;

  const rawProviders =
    obj.providers && typeof obj.providers === 'object'
      ? (obj.providers as Record<string, Partial<AiProviderSettings>>)
      : {};

  const providers = { ...base.providers };
  for (const pid of AI_PROVIDER_IDS) {
    const incoming = rawProviders[pid] || {};
    const def = base.providers[pid];
    const apiKey = typeof incoming.apiKey === 'string' ? incoming.apiKey.trim() : def.apiKey;
    providers[pid] = {
      ...def,
      ...incoming,
      provider: pid,
      apiKey,
      hasApiKey: apiKey.length > 0,
      isFreeTier:
        typeof incoming.isFreeTier === 'boolean' ? incoming.isFreeTier : def.isFreeTier,
      allocatedCreditUsd:
        typeof incoming.allocatedCreditUsd === 'number' && !Number.isNaN(incoming.allocatedCreditUsd)
          ? Math.max(0, incoming.allocatedCreditUsd)
          : def.allocatedCreditUsd,
      dailyFreeQuotaLimit:
        typeof incoming.dailyFreeQuotaLimit === 'number' && !Number.isNaN(incoming.dailyFreeQuotaLimit)
          ? Math.max(0, Math.round(incoming.dailyFreeQuotaLimit))
          : def.dailyFreeQuotaLimit,
      cachedModels:
        Array.isArray(incoming.cachedModels) && incoming.cachedModels.length > 0
          ? incoming.cachedModels
          : def.cachedModels,
    };
  }

  const fallbackModel =
    providers[activeProvider].cachedModels?.[0]?.id ||
    MODEL_PRICING_CATALOG[activeProvider][0].id;

  const activeModelId =
    typeof obj.activeModelId === 'string' && obj.activeModelId.trim().length > 0
      ? obj.activeModelId.trim()
      : fallbackModel;

  return {
    activeProvider,
    activeModelId,
    effectLevel,
    providers,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : undefined,
    updatedBy: typeof obj.updatedBy === 'string' ? obj.updatedBy : undefined,
  };
}

/**
 * Strips raw secret API keys before returning configuration to the browser UI.
 */
export function toPublicAiConfig(config: AiSystemConfig): AiSystemConfig {
  const providers = { ...config.providers };
  for (const pid of AI_PROVIDER_IDS) {
    const p = providers[pid];
    providers[pid] = {
      ...p,
      hasApiKey: Boolean(p.apiKey && p.apiKey.trim().length > 0),
      apiKey: p.apiKey ? maskApiKey(p.apiKey) : '',
    };
  }
  return {
    ...config,
    providers,
  };
}

/**
 * Resolves token pricing and capabilities for any model ID (including newly auto-discovered models).
 */
export function resolveModelDescriptor(
  provider: AiProviderId,
  modelId: string,
  cachedModels?: AiModelDescriptor[]
): AiModelDescriptor {
  const allCandidates = [...(cachedModels || []), ...MODEL_PRICING_CATALOG[provider]];
  const exact = allCandidates.find((m) => m.id === modelId);
  if (exact) return exact;

  // Match prefix/family so newer snapshots (e.g. gpt-4o-2025-xx or gemini-3.0-flash) inherit accurate family pricing
  const lowerId = modelId.toLowerCase();
  const familyMatch = allCandidates.find((m) => {
    const lowerCat = m.id.toLowerCase();
    return lowerId.includes(lowerCat) || lowerCat.includes(lowerId);
  });

  if (familyMatch) {
    return {
      ...familyMatch,
      id: modelId,
      name: modelId,
      isLatest: true,
    };
  }

  // Fallback by provider heuristics
  const defaults = MODEL_PRICING_CATALOG[provider][0];
  return {
    ...defaults,
    id: modelId,
    name: modelId,
    isLatest: true,
  };
}

export function calculateTokenCostUsd(
  provider: AiProviderId,
  modelId: string,
  inputTokens: number,
  outputTokens: number,
  cachedModels?: AiModelDescriptor[]
): number {
  const desc = resolveModelDescriptor(provider, modelId, cachedModels);
  const inputCost = (Math.max(0, inputTokens) / 1_000_000) * desc.inputCostPer1MTokens;
  const outputCost = (Math.max(0, outputTokens) / 1_000_000) * desc.outputCostPer1MTokens;
  return Number((inputCost + outputCost).toFixed(6));
}
