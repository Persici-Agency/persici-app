import 'server-only';
import { getDb, getCollection, COLLECTIONS } from '@/lib/mongodb';
import {
  AI_PROVIDER_IDS,
  MODEL_PRICING_CATALOG,
  EFFECT_LEVEL_PRESETS,
  type AiProviderId,
  type AiEffectLevel,
  type AiModelDescriptor,
  type AiSystemConfig,
  type AiUsageLogEntry,
  type AiUsageSummary,
  type AiProviderUsageAggregate,
  normalizeAiConfig,
  isMaskedApiKey,
  resolveModelDescriptor,
  calculateTokenCostUsd,
} from '@/lib/ai-types';

const CONFIG_KEY = 'ai_config';
const CACHE_TTL_MS = 3000;

interface GlobalAiCache {
  __persiciAiConfigCache?: {
    config: AiSystemConfig;
    fetchedAt: number;
  };
}

const g = globalThis as unknown as GlobalAiCache;

function getEnvApiKey(provider: AiProviderId): string {
  switch (provider) {
    case 'gemini':
      return (process.env.GEMINI_API_KEY || '').trim();
    case 'openai':
      return (process.env.OPENAI_API_KEY || '').trim();
    case 'anthropic':
      return (process.env.ANTHROPIC_API_KEY || '').trim();
    case 'groq':
      return (process.env.GROQ_API_KEY || '').trim();
    case 'deepseek':
      return (process.env.DEEPSEEK_API_KEY || '').trim();
    default:
      return '';
  }
}

function resolveProviderApiKey(
  config: AiSystemConfig,
  provider: AiProviderId,
  overrideKey?: string
): string {
  if (overrideKey && overrideKey.trim() && !isMaskedApiKey(overrideKey)) {
    return overrideKey.trim();
  }
  const stored = config.providers[provider]?.apiKey || '';
  if (stored && stored.trim()) return stored.trim();
  return getEnvApiKey(provider);
}

/**
 * Loads AI configuration from MongoDB `system_settings` (`key: 'ai_config'`).
 */
export async function getAiConfig(skipCache = false): Promise<AiSystemConfig> {
  const now = Date.now();
  if (
    !skipCache &&
    g.__persiciAiConfigCache &&
    now - g.__persiciAiConfigCache.fetchedAt < CACHE_TTL_MS
  ) {
    return g.__persiciAiConfigCache.config;
  }

  let normalized = normalizeAiConfig(null);

  try {
    const db = await getDb();
    if (db) {
      const doc = await db.collection(COLLECTIONS.SETTINGS).findOne({ key: CONFIG_KEY });
      if (doc && doc.config && typeof doc.config === 'object') {
        normalized = normalizeAiConfig(doc.config as Record<string, unknown>);
      }
    }
  } catch (err) {
    console.warn('[ai-server] getAiConfig fallback to defaults:', err);
  }

  // Hydrate empty API keys from env variables if configured on server
  for (const pid of AI_PROVIDER_IDS) {
    if (!normalized.providers[pid].apiKey) {
      const envKey = getEnvApiKey(pid);
      if (envKey) {
        normalized.providers[pid].apiKey = envKey;
        normalized.providers[pid].hasApiKey = true;
      }
    }
  }

  g.__persiciAiConfigCache = { config: normalized, fetchedAt: now };
  return normalized;
}

/**
 * Saves updated AI settings while preserving existing unmasked API keys if client submits masked values.
 */
export async function saveAiConfig(
  incoming: Partial<AiSystemConfig> & { clearKeys?: AiProviderId[] },
  updatedBy?: string
): Promise<AiSystemConfig> {
  const existing = await getAiConfig(true);
  const clearKeys = new Set<AiProviderId>(Array.isArray(incoming.clearKeys) ? incoming.clearKeys : []);

  const mergedProviders = { ...existing.providers };
  for (const pid of AI_PROVIDER_IDS) {
    const prev = existing.providers[pid];
    const next = incoming.providers?.[pid];
    if (!next) continue;

    let finalApiKey = prev.apiKey;
    if (clearKeys.has(pid)) {
      finalApiKey = '';
    } else if (typeof next.apiKey === 'string') {
      const trimmed = next.apiKey.trim();
      if (trimmed === '') {
        // Keep stored key if masked/env wasn't cleared, unless explicitly cleared via clearKeys
        finalApiKey = prev.apiKey;
      } else if (!isMaskedApiKey(trimmed)) {
        finalApiKey = trimmed;
      }
    }

    mergedProviders[pid] = {
      ...prev,
      ...next,
      provider: pid,
      apiKey: finalApiKey,
      hasApiKey: finalApiKey.length > 0,
      cachedModels:
        Array.isArray(next.cachedModels) && next.cachedModels.length > 0
          ? next.cachedModels
          : prev.cachedModels,
    };
  }

  const nextConfig = normalizeAiConfig({
    ...existing,
    ...incoming,
    providers: mergedProviders,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy || existing.updatedBy,
  });

  try {
    const db = await getDb();
    if (db) {
      await db.collection(COLLECTIONS.SETTINGS).updateOne(
        { key: CONFIG_KEY },
        {
          $set: {
            key: CONFIG_KEY,
            config: nextConfig,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error('[ai-server] saveAiConfig failed:', err);
    throw err;
  }

  g.__persiciAiConfigCache = { config: nextConfig, fetchedAt: Date.now() };
  return nextConfig;
}

/**
 * Fetches live models from provider API and merges with pricing catalog.
 */
export async function discoverProviderModels(
  provider: AiProviderId,
  overrideApiKey?: string,
  persistCache = true
): Promise<{
  models: AiModelDescriptor[];
  source: 'live-api' | 'catalog';
  error?: string;
  syncedAt: string;
}> {
  const config = await getAiConfig();
  const apiKey = resolveProviderApiKey(config, provider, overrideApiKey);
  const syncedAt = new Date().toISOString();
  const catalogFallback = MODEL_PRICING_CATALOG[provider];

  if (!apiKey) {
    return {
      models: config.providers[provider]?.cachedModels?.length
        ? config.providers[provider].cachedModels!
        : catalogFallback,
      source: 'catalog',
      syncedAt,
    };
  }

  let liveModels: AiModelDescriptor[] = [];

  try {
    if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?pageSize=100&key=${encodeURIComponent(apiKey)}`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        throw new Error(`Gemini models API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.models) ? data.models : [];

      liveModels = rawList
        .filter((m: Record<string, unknown>) => {
          const methods = Array.isArray(m.supportedGenerationMethods)
            ? (m.supportedGenerationMethods as string[])
            : [];
          const name = String(m.name || '').toLowerCase();
          return (
            methods.includes('generateContent') &&
            name.includes('gemini') &&
            !name.includes('embedding') &&
            !name.includes('vision-only')
          );
        })
        .map((m: Record<string, unknown>) => {
          const id = String(m.name || '').replace(/^models\//, '');
          const baseDesc = resolveModelDescriptor('gemini', id, catalogFallback);
          return {
            ...baseDesc,
            id,
            name: typeof m.displayName === 'string' && m.displayName ? m.displayName : baseDesc.name,
            contextWindow:
              typeof m.inputTokenLimit === 'number' && m.inputTokenLimit > 0
                ? m.inputTokenLimit
                : baseDesc.contextWindow,
          };
        })
        .sort((a: AiModelDescriptor, b: AiModelDescriptor) => {
          // Prioritize higher version numbers (e.g. 3.0 > 2.5 > 2.0 > 1.5) and Flash/Pro flagship order
          return b.id.localeCompare(a.id);
        });
    } else if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`OpenAI models API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];

      liveModels = rawList
        .filter((m: Record<string, unknown>) => {
          const id = String(m.id || '').toLowerCase();
          const isChatFamily =
            id.startsWith('gpt-') ||
            id.startsWith('o1') ||
            id.startsWith('o3') ||
            id.startsWith('o4') ||
            id.startsWith('chatgpt-');
          const excluded =
            id.includes('realtime') ||
            id.includes('audio') ||
            id.includes('transcribe') ||
            id.includes('tts') ||
            id.includes('search') ||
            id.includes('image') ||
            id.includes('dall-e') ||
            id.includes('instruct');
          return isChatFamily && !excluded;
        })
        .sort(
          (a: Record<string, unknown>, b: Record<string, unknown>) =>
            Number(b.created || 0) - Number(a.created || 0)
        )
        .map((m: Record<string, unknown>) => {
          const id = String(m.id || '');
          const baseDesc = resolveModelDescriptor('openai', id, catalogFallback);
          const createdTs = typeof m.created === 'number' ? new Date(m.created * 1000).toISOString().slice(0, 10) : undefined;
          return {
            ...baseDesc,
            id,
            name: baseDesc.name === id ? id : `${baseDesc.name} (${id})`,
            releasedAt: createdTs,
          };
        });
    } else if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Anthropic models API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];

      liveModels = rawList
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
          String(b.created_at || '').localeCompare(String(a.created_at || ''))
        )
        .map((m: Record<string, unknown>) => {
          const id = String(m.id || '');
          const baseDesc = resolveModelDescriptor('anthropic', id, catalogFallback);
          return {
            ...baseDesc,
            id,
            name:
              typeof m.display_name === 'string' && m.display_name
                ? `${m.display_name}`
                : baseDesc.name,
            releasedAt: typeof m.created_at === 'string' ? m.created_at.slice(0, 10) : undefined,
          };
        });
    } else if (provider === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Groq models API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];

      liveModels = rawList
        .filter((m: Record<string, unknown>) => {
          const id = String(m.id || '').toLowerCase();
          return !id.includes('whisper') && !id.includes('playai') && !id.includes('tts');
        })
        .sort(
          (a: Record<string, unknown>, b: Record<string, unknown>) =>
            Number(b.created || 0) - Number(a.created || 0)
        )
        .map((m: Record<string, unknown>) => {
          const id = String(m.id || '');
          const baseDesc = resolveModelDescriptor('groq', id, catalogFallback);
          return {
            ...baseDesc,
            id,
            contextWindow:
              typeof m.context_window === 'number' && m.context_window > 0
                ? m.context_window
                : baseDesc.contextWindow,
          };
        });
    } else if (provider === 'deepseek') {
      const res = await fetch('https://api.deepseek.com/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`DeepSeek models API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];

      liveModels = rawList.map((m: Record<string, unknown>) => {
        const id = String(m.id || '');
        return resolveModelDescriptor('deepseek', id, catalogFallback);
      });
    }

    // Merge catalog fallback items so known flagship models remain selectable if omitted by pagination
    const seenIds = new Set(liveModels.map((m) => m.id));
    for (const catModel of catalogFallback) {
      if (!seenIds.has(catModel.id)) {
        liveModels.push(catModel);
      }
    }

    if (persistCache && liveModels.length > 0) {
      await saveAiConfig({
        providers: {
          ...config.providers,
          [provider]: {
            ...config.providers[provider],
            cachedModels: liveModels,
            modelsLastSyncedAt: syncedAt,
            lastError: '',
          },
        },
      }).catch(() => {});
    }

    return {
      models: liveModels,
      source: 'live-api',
      syncedAt,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Model discovery failed';
    return {
      models: config.providers[provider]?.cachedModels?.length
        ? config.providers[provider].cachedModels!
        : catalogFallback,
      source: 'catalog',
      error: errorMsg,
      syncedAt,
    };
  }
}

/**
 * Tests connection with an AI provider, refreshes models, and fetches live balance/rate limits.
 */
export async function probeProviderConnectionAndBalance(
  provider: AiProviderId,
  modelId?: string,
  overrideApiKey?: string
): Promise<{
  ok: boolean;
  provider: AiProviderId;
  modelId: string;
  latencyMs: number;
  liveBalanceUsd?: number | null;
  liveGrantedBalanceUsd?: number | null;
  liveToppedUpBalanceUsd?: number | null;
  rateLimitRemainingRequests?: number | null;
  rateLimitRemainingTokens?: number | null;
  modelsCount: number;
  error?: string;
}> {
  const config = await getAiConfig();
  const apiKey = resolveProviderApiKey(config, provider, overrideApiKey);
  const targetModel =
    modelId ||
    config.providers[provider]?.cachedModels?.[0]?.id ||
    MODEL_PRICING_CATALOG[provider][0].id;

  if (!apiKey) {
    return {
      ok: false,
      provider,
      modelId: targetModel,
      latencyMs: 0,
      modelsCount: config.providers[provider]?.cachedModels?.length || 0,
      error: `No API key configured for ${provider}.`,
    };
  }

  const startedAt = Date.now();
  let liveBalanceUsd: number | null = null;
  let liveGrantedBalanceUsd: number | null = null;
  let liveToppedUpBalanceUsd: number | null = null;
  let rateLimitRemainingRequests: number | null = null;
  let rateLimitRemainingTokens: number | null = null;

  try {
    // Run model discovery + connection probe
    const discovery = await discoverProviderModels(provider, apiKey, false);

    if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          targetModel
        )}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Reply with the word OK only.' }] }],
            generationConfig: { maxOutputTokens: 16, temperature: 0 },
          }),
        }
      );
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 220)}`);
      }
    } else if (provider === 'openai' || provider === 'groq' || provider === 'deepseek') {
      const endpoint =
        provider === 'openai'
          ? 'https://api.openai.com/v1/chat/completions'
          : provider === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.deepseek.com/chat/completions';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [{ role: 'user', content: 'Reply with OK' }],
          max_tokens: 10,
          temperature: 0,
        }),
      });

      const remReq = res.headers.get('x-ratelimit-remaining-requests');
      const remTok = res.headers.get('x-ratelimit-remaining-tokens');
      if (remReq !== null && !Number.isNaN(Number(remReq))) {
        rateLimitRemainingRequests = Number(remReq);
      }
      if (remTok !== null && !Number.isNaN(Number(remTok))) {
        rateLimitRemainingTokens = Number(remTok);
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 220)}`);
      }

      if (provider === 'deepseek') {
        const balRes = await fetch('https://api.deepseek.com/user/balance', {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: 'no-store',
        });
        if (balRes.ok) {
          const balJson = await balRes.json();
          const info = Array.isArray(balJson.balance_infos)
            ? balJson.balance_infos.find((b: Record<string, unknown>) => b.currency === 'USD') ||
              balJson.balance_infos[0]
            : null;
          if (info) {
            liveBalanceUsd = Number(info.total_balance ?? 0);
            liveGrantedBalanceUsd = Number(info.granted_balance ?? 0);
            liveToppedUpBalanceUsd = Number(info.topped_up_balance ?? 0);
          }
        }
      }
    } else if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 16,
          messages: [{ role: 'user', content: 'Reply with OK' }],
        }),
      });

      const remReq = res.headers.get('anthropic-ratelimit-requests-remaining');
      const remTok = res.headers.get('anthropic-ratelimit-tokens-remaining');
      if (remReq !== null && !Number.isNaN(Number(remReq))) {
        rateLimitRemainingRequests = Number(remReq);
      }
      if (remTok !== null && !Number.isNaN(Number(remTok))) {
        rateLimitRemainingTokens = Number(remTok);
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 220)}`);
      }
    }

    const latencyMs = Date.now() - startedAt;

    await saveAiConfig({
      providers: {
        ...config.providers,
        [provider]: {
          ...config.providers[provider],
          apiKey,
          hasApiKey: true,
          lastVerifiedAt: new Date().toISOString(),
          lastError: '',
          liveBalanceUsd,
          liveGrantedBalanceUsd,
          liveToppedUpBalanceUsd,
          rateLimitRemainingRequests,
          rateLimitRemainingTokens,
          cachedModels: discovery.models,
          modelsLastSyncedAt: discovery.syncedAt,
        },
      },
    }).catch(() => {});

    return {
      ok: true,
      provider,
      modelId: targetModel,
      latencyMs,
      liveBalanceUsd,
      liveGrantedBalanceUsd,
      liveToppedUpBalanceUsd,
      rateLimitRemainingRequests,
      rateLimitRemainingTokens,
      modelsCount: discovery.models.length,
    };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    const errorMsg = err instanceof Error ? err.message : 'Connection verification failed';
    await saveAiConfig({
      providers: {
        ...config.providers,
        [provider]: {
          ...config.providers[provider],
          lastError: errorMsg,
        },
      },
    }).catch(() => {});

    return {
      ok: false,
      provider,
      modelId: targetModel,
      latencyMs,
      modelsCount: config.providers[provider]?.cachedModels?.length || 0,
      error: errorMsg,
    };
  }
}

/**
 * Extracts and parses clean JSON from LLM output even if wrapped in markdown code fences or prose.
 */
function parseRobustJson<T = Record<string, unknown>>(rawText: string): T {
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const slice = cleaned.slice(firstBrace, lastBrace + 1);
      return JSON.parse(slice) as T;
    }
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      const slice = cleaned.slice(firstBracket, lastBracket + 1);
      return JSON.parse(slice) as T;
    }
    throw new Error('AI response did not contain valid JSON.');
  }
}

/**
 * Executes a structured JSON generation request using the configured (or overridden) provider, model, and effect level,
 * and records token & cost telemetry in `ai_usage_logs`.
 */
export async function generateStructuredAiJson<T = Record<string, unknown>>(params: {
  systemPrompt: string;
  userPrompt: string;
  targetField: string;
  storySlug?: string;
  userId?: string;
  providerOverride?: AiProviderId;
  modelOverride?: string;
  effectOverride?: AiEffectLevel;
}): Promise<{
  data: T;
  usage: {
    provider: AiProviderId;
    modelId: string;
    effectLevel: AiEffectLevel;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    theoreticalPaidCostUsd: number;
    isFreeTier: boolean;
    latencyMs: number;
  };
}> {
  const config = await getAiConfig(true);
  const provider = params.providerOverride || config.activeProvider;
  const modelId =
    params.modelOverride ||
    config.activeModelId ||
    MODEL_PRICING_CATALOG[provider][0].id;
  const effectLevel = params.effectOverride || config.effectLevel || 'medium';
  const preset = EFFECT_LEVEL_PRESETS[effectLevel];
  const providerSettings = config.providers[provider];
  const apiKey = resolveProviderApiKey(config, provider);

  if (!apiKey) {
    throw new Error(
      `No API key configured for ${provider}. Please add your ${provider} API key in Dashboard -> AI Studio & Models.`
    );
  }

  const startedAt = Date.now();
  let rawText = '';
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    if (provider === 'gemini') {
      const supportsThinking = modelId.includes('2.5') || modelId.includes('3');
      const generationConfig: Record<string, unknown> = {
        responseMimeType: 'application/json',
        temperature: preset.temperature,
        maxOutputTokens: preset.maxOutputTokens,
      };
      if (supportsThinking) {
        generationConfig.thinkingConfig = {
          thinkingBudget: preset.geminiThinkingBudget,
        };
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          modelId
        )}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: params.systemPrompt }],
            },
            contents: [{ role: 'user', parts: [{ text: params.userPrompt }] }],
            generationConfig,
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Gemini API Error (${res.status}): ${errBody.slice(0, 300)}`);
      }

      const json = await res.json();
      rawText =
        json?.candidates?.[0]?.content?.parts
          ?.map((p: Record<string, unknown>) => String(p.text || ''))
          .join('') || '';
      inputTokens = Number(json?.usageMetadata?.promptTokenCount || 0);
      outputTokens = Number(json?.usageMetadata?.candidatesTokenCount || 0);
    } else if (provider === 'openai' || provider === 'groq' || provider === 'deepseek') {
      const endpoint =
        provider === 'openai'
          ? 'https://api.openai.com/v1/chat/completions'
          : provider === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.deepseek.com/chat/completions';

      const isReasonerModel =
        modelId.startsWith('o1') ||
        modelId.startsWith('o3') ||
        modelId.startsWith('o4') ||
        modelId.includes('reasoner');

      const bodyPayload: Record<string, unknown> = {
        model: modelId,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
      };

      if (!isReasonerModel) {
        bodyPayload.temperature = preset.temperature;
        bodyPayload.max_tokens = preset.maxOutputTokens;
      } else {
        bodyPayload.max_completion_tokens = preset.maxOutputTokens;
        if (provider === 'openai') {
          bodyPayload.reasoning_effort = preset.reasoningEffort;
        }
      }

      const descriptor = resolveModelDescriptor(provider, modelId, providerSettings.cachedModels);
      if (descriptor.supportsJsonMode) {
        bodyPayload.response_format = { type: 'json_object' };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`${provider.toUpperCase()} API Error (${res.status}): ${errBody.slice(0, 300)}`);
      }

      const json = await res.json();
      rawText = String(json?.choices?.[0]?.message?.content || '');
      inputTokens = Number(json?.usage?.prompt_tokens || 0);
      outputTokens = Number(json?.usage?.completion_tokens || 0);
    } else if (provider === 'anthropic') {
      const bodyPayload: Record<string, unknown> = {
        model: modelId,
        max_tokens: preset.maxOutputTokens,
        temperature: preset.temperature,
        system: `${params.systemPrompt}\n\nIMPORTANT: Return ONLY a valid raw JSON object without markdown fences or explanation.`,
        messages: [{ role: 'user', content: params.userPrompt }],
      };

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Anthropic API Error (${res.status}): ${errBody.slice(0, 300)}`);
      }

      const json = await res.json();
      const contentArr = Array.isArray(json.content) ? json.content : [];
      rawText = contentArr
        .filter((b: Record<string, unknown>) => b.type === 'text')
        .map((b: Record<string, unknown>) => String(b.text || ''))
        .join('');
      inputTokens = Number(json?.usage?.input_tokens || 0);
      outputTokens = Number(json?.usage?.output_tokens || 0);
    }

    // Fallback token estimate if provider omits usage block
    if (inputTokens === 0) {
      inputTokens = Math.ceil((params.systemPrompt.length + params.userPrompt.length) / 4);
    }
    if (outputTokens === 0) {
      outputTokens = Math.ceil(rawText.length / 4);
    }

    const totalTokens = inputTokens + outputTokens;
    const latencyMs = Date.now() - startedAt;
    const theoreticalPaidCostUsd = calculateTokenCostUsd(
      provider,
      modelId,
      inputTokens,
      outputTokens,
      providerSettings.cachedModels
    );
    const estimatedCostUsd = providerSettings.isFreeTier ? 0 : theoreticalPaidCostUsd;

    const parsed = parseRobustJson<T>(rawText);

    // Log success in MongoDB telemetry
    try {
      const col = await getCollection(COLLECTIONS.AI_USAGE_LOGS);
      if (col) {
        await col.insertOne({
          provider,
          modelId,
          effectLevel,
          targetField: params.targetField,
          storySlug: params.storySlug || '',
          inputTokens,
          outputTokens,
          totalTokens,
          estimatedCostUsd,
          theoreticalPaidCostUsd,
          isFreeTier: providerSettings.isFreeTier,
          latencyMs,
          status: 'success',
          userId: params.userId || '',
          createdAt: new Date(),
        });
      }
    } catch (logErr) {
      console.warn('[ai-server] Failed to log AI usage telemetry:', logErr);
    }

    return {
      data: parsed,
      usage: {
        provider,
        modelId,
        effectLevel,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd,
        theoreticalPaidCostUsd,
        isFreeTier: providerSettings.isFreeTier,
        latencyMs,
      },
    };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    const errorMessage = err instanceof Error ? err.message : 'AI generation failed';
    try {
      const col = await getCollection(COLLECTIONS.AI_USAGE_LOGS);
      if (col) {
        await col.insertOne({
          provider,
          modelId,
          effectLevel,
          targetField: params.targetField,
          storySlug: params.storySlug || '',
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          estimatedCostUsd: 0,
          theoreticalPaidCostUsd: 0,
          isFreeTier: providerSettings.isFreeTier,
          latencyMs,
          status: 'error',
          errorMessage,
          userId: params.userId || '',
          createdAt: new Date(),
        });
      }
    } catch {
      // ignore telemetry log write errors
    }
    throw err;
  }
}

/**
 * Aggregates cumulative AI token consumption, spend, free quota, and remaining credits across all 5 providers.
 */
export async function getAiUsageSummary(): Promise<AiUsageSummary> {
  const config = await getAiConfig();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const byProvider = {} as Record<AiProviderId, AiProviderUsageAggregate>;
  for (const pid of AI_PROVIDER_IDS) {
    const pConf = config.providers[pid];
    byProvider[pid] = {
      provider: pid,
      requests: 0,
      todayRequests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      totalSpendUsd: 0,
      theoreticalValueUsd: 0,
      allocatedCreditUsd: pConf.allocatedCreditUsd || 0,
      remainingCreditUsd: pConf.allocatedCreditUsd || 0,
      dailyFreeQuotaLimit: pConf.dailyFreeQuotaLimit || 0,
      remainingFreeDailyRequests: pConf.dailyFreeQuotaLimit || 0,
      isFreeTier: pConf.isFreeTier,
      liveBalanceUsd: pConf.liveBalanceUsd ?? null,
    };
  }

  let totalRequests = 0;
  let todayRequests = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalTokens = 0;
  let totalSpendUsd = 0;
  let theoreticalPaidValueUsd = 0;
  let latencySum = 0;
  let latencyCount = 0;
  const recentLogs: AiUsageLogEntry[] = [];

  try {
    const col = await getCollection(COLLECTIONS.AI_USAGE_LOGS);
    if (col) {
      const docs = await col.find({}).sort({ createdAt: -1 }).limit(1000).toArray();

      for (const d of docs) {
        const pid = AI_PROVIDER_IDS.includes(d.provider as AiProviderId)
          ? (d.provider as AiProviderId)
          : 'gemini';
        const createdAtDate = d.createdAt ? new Date(d.createdAt) : new Date();
        const isToday = createdAtDate >= todayStart;
        const inTok = Number(d.inputTokens || 0);
        const outTok = Number(d.outputTokens || 0);
        const totTok = Number(d.totalTokens || inTok + outTok);
        const spend = Number(d.estimatedCostUsd || 0);
        const theo = Number(d.theoreticalPaidCostUsd || 0);
        const lat = Number(d.latencyMs || 0);

        totalRequests += 1;
        if (isToday) todayRequests += 1;
        totalInputTokens += inTok;
        totalOutputTokens += outTok;
        totalTokens += totTok;
        totalSpendUsd += spend;
        theoreticalPaidValueUsd += theo;
        if (lat > 0) {
          latencySum += lat;
          latencyCount += 1;
        }

        const agg = byProvider[pid];
        agg.requests += 1;
        if (isToday) agg.todayRequests += 1;
        agg.inputTokens += inTok;
        agg.outputTokens += outTok;
        agg.totalTokens += totTok;
        agg.totalSpendUsd = Number((agg.totalSpendUsd + spend).toFixed(6));
        agg.theoreticalValueUsd = Number((agg.theoreticalValueUsd + theo).toFixed(6));

        if (recentLogs.length < 25) {
          recentLogs.push({
            id: String(d._id),
            provider: pid,
            modelId: String(d.modelId || ''),
            effectLevel: (d.effectLevel as AiEffectLevel) || 'medium',
            targetField: String(d.targetField || ''),
            storySlug: typeof d.storySlug === 'string' ? d.storySlug : undefined,
            inputTokens: inTok,
            outputTokens: outTok,
            totalTokens: totTok,
            estimatedCostUsd: spend,
            theoreticalPaidCostUsd: theo,
            isFreeTier: Boolean(d.isFreeTier),
            latencyMs: lat,
            status: d.status === 'error' ? 'error' : 'success',
            errorMessage: typeof d.errorMessage === 'string' ? d.errorMessage : undefined,
            userId: typeof d.userId === 'string' ? d.userId : undefined,
            createdAt: createdAtDate.toISOString(),
          });
        }
      }
    }
  } catch (err) {
    console.warn('[ai-server] getAiUsageSummary failed:', err);
  }

  for (const pid of AI_PROVIDER_IDS) {
    const agg = byProvider[pid];
    agg.remainingCreditUsd = Number(
      Math.max(0, agg.allocatedCreditUsd - agg.totalSpendUsd).toFixed(4)
    );
    agg.remainingFreeDailyRequests = Math.max(0, agg.dailyFreeQuotaLimit - agg.todayRequests);
  }

  return {
    totalRequests,
    todayRequests,
    totalInputTokens,
    totalOutputTokens,
    totalTokens,
    totalSpendUsd: Number(totalSpendUsd.toFixed(6)),
    theoreticalPaidValueUsd: Number(theoreticalPaidValueUsd.toFixed(6)),
    averageLatencyMs: latencyCount > 0 ? Math.round(latencySum / latencyCount) : 0,
    byProvider,
    recentLogs,
  };
}
