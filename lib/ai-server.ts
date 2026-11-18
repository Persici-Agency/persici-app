import 'server-only';
import { getDb, getCollection, COLLECTIONS } from '@/lib/mongodb';
import {
  AI_PROVIDER_IDS,
  MODEL_PRICING_CATALOG,
  EFFECT_LEVEL_PRESETS,
  KNOWN_RETIRED_MODEL_IDS,
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
    case 'grok':
      return (process.env.XAI_API_KEY || process.env.GROK_API_KEY || '').trim();
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

function scoreGeminiModelPriority(id: string): number {
  const lower = id.toLowerCase();
  const verMatch = lower.match(/gemini-(\d+(?:\.\d+)?)/);
  const ver = verMatch ? parseFloat(verMatch[1]) * 100 : 100;
  let bonus = 0;
  if (lower.includes('flash') && !lower.includes('lite') && !lower.includes('8b')) bonus += 30;
  else if (lower.includes('pro')) bonus += 25;
  else if (lower.includes('lite')) bonus += 15;
  if (lower.includes('latest')) bonus += 8;
  if (lower.includes('preview') || lower.includes('exp')) bonus -= 12;
  if (/-\d{3,}$/.test(lower) || /-\d{2}-\d{2}$/.test(lower)) bonus -= 15;
  return ver + bonus;
}

function getOpenAiCompatibleBaseUrl(provider: AiProviderId): string {
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com/v1/chat/completions';
    case 'groq':
      return 'https://api.groq.com/openai/v1/chat/completions';
    case 'deepseek':
      return 'https://api.deepseek.com/chat/completions';
    case 'grok':
      return 'https://api.x.ai/v1/chat/completions';
    default:
      throw new Error(`Provider ${provider} does not use OpenAI-compatible chat endpoint`);
  }
}

function isOpenAiReasoningModel(provider: AiProviderId, modelId: string): boolean {
  if (provider !== 'openai') return false;
  const lower = modelId.toLowerCase();
  return (
    lower.startsWith('o1') ||
    lower.startsWith('o3') ||
    lower.startsWith('o4') ||
    lower.startsWith('gpt-5')
  );
}

class AiProviderHttpError extends Error {
  status: number;
  bodyText: string;

  constructor(message: string, status: number, bodyText: string) {
    super(message);
    this.status = status;
    this.bodyText = bodyText;
  }
}

function isModelNotFoundOrUnavailableError(status: number, errText: string): boolean {
  if (status === 404 || status === 410) return true;
  if (status === 400 || status === 403 || status === 422) {
    return /not found|no longer available|decommissioned|deprecated|does not exist|model_not_found|unknown model|invalid model|not supported for generateContent|model .*not available|permission denied.*model/i.test(
      errText
    );
  }
  return false;
}

function extractSuggestedModelFromError(errText: string): string | null {
  const patterns = [
    /(?:update your code to use|please update.*?to use|please use|try using|instead use|use the)\s+(?:models\/)?["'`]?([a-zA-Z0-9._\/:-]{3,80})["'`]?/i,
    /(?:replaced by|recommended replacement[:\s]+)(?:models\/)?["'`]?([a-zA-Z0-9._\/:-]{3,80})["'`]?/i,
  ];
  for (const re of patterns) {
    const match = errText.match(re);
    if (match?.[1]) {
      const cleaned = match[1]
        .replace(/^models\//i, '')
        .replace(/[.,;:'")\]}]+$/, '')
        .trim();
      if (cleaned && !cleaned.includes('\\')) {
        return cleaned;
      }
    }
  }
  return null;
}

async function fetchDeepSeekLiveBalance(apiKey: string): Promise<{
  liveBalanceUsd: number | null;
  liveGrantedBalanceUsd: number | null;
  liveToppedUpBalanceUsd: number | null;
}> {
  try {
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
        return {
          liveBalanceUsd: Number(info.total_balance ?? 0),
          liveGrantedBalanceUsd: Number(info.granted_balance ?? 0),
          liveToppedUpBalanceUsd: Number(info.topped_up_balance ?? 0),
        };
      }
    }
  } catch {
    // ignore balance fetch errors
  }
  return {
    liveBalanceUsd: null,
    liveGrantedBalanceUsd: null,
    liveToppedUpBalanceUsd: null,
  };
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
        ? config.providers[provider].cachedModels!.filter((m) => !KNOWN_RETIRED_MODEL_IDS.has(m.id))
        : catalogFallback,
      source: 'catalog',
      syncedAt,
    };
  }

  let liveModels: AiModelDescriptor[] = [];

  try {
    if (provider === 'gemini') {
      const rawList: Array<Record<string, unknown>> = [];
      let nextPageToken = '';
      for (let page = 0; page < 3; page++) {
        const pageQuery = nextPageToken ? `&pageToken=${encodeURIComponent(nextPageToken)}` : '';
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?pageSize=100&key=${encodeURIComponent(apiKey)}${pageQuery}`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Gemini models API returned HTTP ${res.status}: ${errBody.slice(0, 180)}`);
        }
        const data = await res.json();
        if (Array.isArray(data.models)) {
          rawList.push(...data.models);
        }
        if (typeof data.nextPageToken === 'string' && data.nextPageToken) {
          nextPageToken = data.nextPageToken;
        } else {
          break;
        }
      }

      liveModels = rawList
        .filter((m: Record<string, unknown>) => {
          const methods = Array.isArray(m.supportedGenerationMethods)
            ? (m.supportedGenerationMethods as string[])
            : [];
          const id = String(m.name || '').replace(/^models\//, '').toLowerCase();
          const desc = String(m.description || '').toLowerCase();
          const isExcluded =
            KNOWN_RETIRED_MODEL_IDS.has(id) ||
            id.includes('embedding') ||
            id.includes('aqa') ||
            id.includes('imagen') ||
            id.includes('veo') ||
            id.includes('tts') ||
            id.includes('audio') ||
            id.includes('robotics') ||
            id.includes('computer-use') ||
            id.includes('learnlm') ||
            id.includes('gemma') ||
            id.includes('bisheng') ||
            id.includes('vision') ||
            id.includes('1.0') ||
            id.includes('1.5') ||
            desc.includes('deprecated') ||
            desc.includes('discontinued');
          return methods.includes('generateContent') && id.includes('gemini') && !isExcluded;
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
        .sort(
          (a: AiModelDescriptor, b: AiModelDescriptor) =>
            scoreGeminiModelPriority(b.id) - scoreGeminiModelPriority(a.id)
        );
    } else if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`OpenAI models API returned HTTP ${res.status}: ${errBody.slice(0, 180)}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];

      const catalogPriority = new Map(catalogFallback.map((m, i) => [m.id, 100 - i]));

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
            KNOWN_RETIRED_MODEL_IDS.has(id) ||
            id.includes('realtime') ||
            id.includes('audio') ||
            id.includes('transcribe') ||
            id.includes('tts') ||
            id.includes('search') ||
            id.includes('image') ||
            id.includes('dall-e') ||
            id.includes('instruct') ||
            id.includes('embedding') ||
            id.includes('moderation') ||
            id.includes('whisper') ||
            id.includes('babbage') ||
            id.includes('davinci') ||
            id.includes('sora') ||
            id.includes('codex') ||
            id.includes('computer-use') ||
            id.includes('diarize') ||
            id.includes('vision') ||
            id.includes('32k') ||
            id.endsWith('-0314') ||
            id.endsWith('-0613');
          return isChatFamily && !excluded;
        })
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
          const pA = catalogPriority.get(String(a.id || '')) ?? 0;
          const pB = catalogPriority.get(String(b.id || '')) ?? 0;
          if (pA !== pB) return pB - pA;
          return Number(b.created || 0) - Number(a.created || 0);
        })
        .map((m: Record<string, unknown>) => {
          const id = String(m.id || '');
          const baseDesc = resolveModelDescriptor('openai', id, catalogFallback);
          const createdTs =
            typeof m.created === 'number'
              ? new Date(m.created * 1000).toISOString().slice(0, 10)
              : undefined;
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
        const errBody = await res.text();
        throw new Error(`Anthropic models API returned HTTP ${res.status}: ${errBody.slice(0, 180)}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];

      liveModels = rawList
        .filter((m: Record<string, unknown>) => !KNOWN_RETIRED_MODEL_IDS.has(String(m.id || '')))
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
        const errBody = await res.text();
        throw new Error(`Groq models API returned HTTP ${res.status}: ${errBody.slice(0, 180)}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];
      const catalogPriority = new Map(catalogFallback.map((m, i) => [m.id, 100 - i]));

      liveModels = rawList
        .filter((m: Record<string, unknown>) => {
          const id = String(m.id || '').toLowerCase();
          return (
            !KNOWN_RETIRED_MODEL_IDS.has(id) &&
            m.active !== false &&
            !id.includes('whisper') &&
            !id.includes('playai') &&
            !id.includes('tts') &&
            !id.includes('guard') &&
            !id.includes('prompt-guard') &&
            !id.includes('allam') &&
            !id.includes('orpheus')
          );
        })
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
          const pA = catalogPriority.get(String(a.id || '')) ?? 0;
          const pB = catalogPriority.get(String(b.id || '')) ?? 0;
          if (pA !== pB) return pB - pA;
          return Number(b.created || 0) - Number(a.created || 0);
        })
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
        const errBody = await res.text();
        throw new Error(`DeepSeek models API returned HTTP ${res.status}: ${errBody.slice(0, 180)}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];

      liveModels = rawList
        .filter((m: Record<string, unknown>) => !KNOWN_RETIRED_MODEL_IDS.has(String(m.id || '')))
        .map((m: Record<string, unknown>) => {
          const id = String(m.id || '');
          return resolveModelDescriptor('deepseek', id, catalogFallback);
        });
    } else if (provider === 'grok') {
      const res = await fetch('https://api.x.ai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`xAI Grok models API returned HTTP ${res.status}: ${errBody.slice(0, 180)}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : [];
      const catalogPriority = new Map(catalogFallback.map((m, i) => [m.id, 100 - i]));

      liveModels = rawList
        .filter((m: Record<string, unknown>) => {
          const id = String(m.id || '').toLowerCase();
          return (
            !KNOWN_RETIRED_MODEL_IDS.has(id) &&
            !id.includes('image') &&
            !id.includes('imagine') &&
            !id.includes('aurora') &&
            !id.includes('video') &&
            !id.includes('embedding')
          );
        })
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
          const pA = catalogPriority.get(String(a.id || '')) ?? 0;
          const pB = catalogPriority.get(String(b.id || '')) ?? 0;
          if (pA !== pB) return pB - pA;
          return Number(b.created || 0) - Number(a.created || 0);
        })
        .map((m: Record<string, unknown>) => {
          const id = String(m.id || '');
          const baseDesc = resolveModelDescriptor('grok', id, catalogFallback);
          return {
            ...baseDesc,
            id,
            releasedAt:
              typeof m.created === 'number'
                ? new Date(m.created * 1000).toISOString().slice(0, 10)
                : undefined,
          };
        });
    }

    // Only fall back to static catalog if the live endpoint returned 0 valid chat models
    const finalModels = liveModels.length > 0 ? liveModels : catalogFallback;

    if (persistCache && finalModels.length > 0) {
      await saveAiConfig({
        providers: {
          ...config.providers,
          [provider]: {
            ...config.providers[provider],
            cachedModels: finalModels,
            modelsLastSyncedAt: syncedAt,
            lastError: '',
          },
        },
      }).catch(() => {});
    }

    return {
      models: finalModels,
      source: liveModels.length > 0 ? 'live-api' : 'catalog',
      syncedAt,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Model discovery failed';
    return {
      models: config.providers[provider]?.cachedModels?.length
        ? config.providers[provider].cachedModels!.filter((m) => !KNOWN_RETIRED_MODEL_IDS.has(m.id))
        : catalogFallback,
      source: 'catalog',
      error: errorMsg,
      syncedAt,
    };
  }
}

async function invokeSingleModelRequest(params: {
  provider: AiProviderId;
  apiKey: string;
  modelId: string;
  systemPrompt?: string;
  userPrompt: string;
  effectLevel: AiEffectLevel;
  cachedModels?: AiModelDescriptor[];
  isProbe?: boolean;
}): Promise<{
  rawText: string;
  inputTokens: number;
  outputTokens: number;
  rateLimitRemainingRequests: number | null;
  rateLimitRemainingTokens: number | null;
}> {
  const { provider, apiKey, modelId, systemPrompt, userPrompt, effectLevel, cachedModels, isProbe } = params;
  const preset = EFFECT_LEVEL_PRESETS[effectLevel];

  if (provider === 'gemini') {
    const supportsThinking =
      !isProbe && (modelId.includes('2.5') || modelId.includes('3')) && preset.geminiThinkingBudget > 0;

    const sendGemini = async (opts: {
      includeThinking: boolean;
      includeJsonMime: boolean;
      includeSystemInstruction: boolean;
    }) => {
      const generationConfig: Record<string, unknown> = isProbe
        ? { maxOutputTokens: 64, temperature: 0 }
        : {
            temperature: preset.temperature,
            maxOutputTokens: preset.maxOutputTokens,
          };

      if (opts.includeJsonMime && !isProbe) {
        generationConfig.responseMimeType = 'application/json';
      }
      if (opts.includeThinking && supportsThinking) {
        generationConfig.thinkingConfig = { thinkingBudget: preset.geminiThinkingBudget };
      }

      const effectivePrompt =
        systemPrompt && !opts.includeSystemInstruction
          ? `${systemPrompt}\n\n${userPrompt}`
          : userPrompt;

      const payload: Record<string, unknown> = {
        contents: [{ role: 'user', parts: [{ text: effectivePrompt }] }],
        generationConfig,
      };
      if (systemPrompt && opts.includeSystemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemPrompt }] };
      }

      return fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          modelId
        )}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
    };

    let res = await sendGemini({
      includeThinking: true,
      includeJsonMime: true,
      includeSystemInstruction: true,
    });
    if (!res.ok && res.status === 400) {
      const firstErr = await res.text();
      if (/thinking|response_mime_type|json mode|Developer instruction|system_instruction/i.test(firstErr)) {
        res = await sendGemini({
          includeThinking: false,
          includeJsonMime: !/json|mime/i.test(firstErr),
          includeSystemInstruction: !/Developer instruction|system_instruction/i.test(firstErr),
        });
      } else {
        throw new AiProviderHttpError(`HTTP ${res.status}: ${firstErr.slice(0, 260)}`, res.status, firstErr);
      }
    }

    if (!res.ok) {
      const errBody = await res.text();
      throw new AiProviderHttpError(`HTTP ${res.status}: ${errBody.slice(0, 260)}`, res.status, errBody);
    }

    const json = await res.json();
    const rawText =
      json?.candidates?.[0]?.content?.parts
        ?.map((p: Record<string, unknown>) => String(p.text || ''))
        .join('') || '';

    return {
      rawText,
      inputTokens: Number(json?.usageMetadata?.promptTokenCount || 0),
      outputTokens: Number(json?.usageMetadata?.candidatesTokenCount || 0),
      rateLimitRemainingRequests: null,
      rateLimitRemainingTokens: null,
    };
  }

  if (provider === 'anthropic') {
    const bodyPayload: Record<string, unknown> = {
      model: modelId,
      max_tokens: isProbe ? 16 : preset.maxOutputTokens,
      messages: [{ role: 'user', content: userPrompt }],
    };
    if (!isProbe) {
      bodyPayload.temperature = preset.temperature;
    }
    if (systemPrompt) {
      bodyPayload.system = `${systemPrompt}\n\nIMPORTANT: Return ONLY a valid raw JSON object without markdown fences or explanation.`;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(bodyPayload),
    });

    const remReq = res.headers.get('anthropic-ratelimit-requests-remaining');
    const remTok = res.headers.get('anthropic-ratelimit-tokens-remaining');
    const rateLimitRemainingRequests = remReq !== null && !Number.isNaN(Number(remReq)) ? Number(remReq) : null;
    const rateLimitRemainingTokens = remTok !== null && !Number.isNaN(Number(remTok)) ? Number(remTok) : null;

    if (!res.ok) {
      const errBody = await res.text();
      throw new AiProviderHttpError(`HTTP ${res.status}: ${errBody.slice(0, 260)}`, res.status, errBody);
    }

    const json = await res.json();
    const contentArr = Array.isArray(json.content) ? json.content : [];
    const rawText = contentArr
      .filter((b: Record<string, unknown>) => b.type === 'text')
      .map((b: Record<string, unknown>) => String(b.text || ''))
      .join('');

    return {
      rawText,
      inputTokens: Number(json?.usage?.input_tokens || 0),
      outputTokens: Number(json?.usage?.output_tokens || 0),
      rateLimitRemainingRequests,
      rateLimitRemainingTokens,
    };
  }

  // OpenAI-compatible protocol: openai, groq, deepseek, grok
  const endpoint = getOpenAiCompatibleBaseUrl(provider);
  const openAiReasoning = isOpenAiReasoningModel(provider, modelId);
  const descriptor = resolveModelDescriptor(provider, modelId, cachedModels);

  const buildOpenAiPayload = (overrides?: {
    useMaxCompletion?: boolean;
    omitTemp?: boolean;
    omitJsonMode?: boolean;
    omitReasoningEffort?: boolean;
  }) => {
    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: userPrompt });

    const payload: Record<string, unknown> = {
      model: modelId,
      messages,
    };

    const useMaxComp = overrides?.useMaxCompletion ?? openAiReasoning;
    const tokenCap = isProbe ? (openAiReasoning ? 64 : 16) : preset.maxOutputTokens;
    if (useMaxComp) {
      payload.max_completion_tokens = tokenCap;
    } else {
      payload.max_tokens = tokenCap;
    }

    const shouldOmitTemp = overrides?.omitTemp ?? openAiReasoning;
    if (!shouldOmitTemp) {
      payload.temperature = isProbe ? 0 : preset.temperature;
    }

    if (openAiReasoning && !isProbe && !overrides?.omitReasoningEffort) {
      payload.reasoning_effort = preset.reasoningEffort;
    }

    if (!isProbe && !overrides?.omitJsonMode && descriptor.supportsJsonMode && !modelId.includes('reasoner')) {
      payload.response_format = { type: 'json_object' };
    }

    return payload;
  };

  let overrides: {
    useMaxCompletion?: boolean;
    omitTemp?: boolean;
    omitJsonMode?: boolean;
    omitReasoningEffort?: boolean;
  } = {};

  let res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildOpenAiPayload(overrides)),
  });

  // Auto-retry up to 2 times if provider returns HTTP 400 for an unsupported optional parameter
  for (let attempt = 0; attempt < 2 && !res.ok && res.status === 400; attempt++) {
    const errText = await res.text();
    if (isModelNotFoundOrUnavailableError(400, errText)) {
      throw new AiProviderHttpError(`HTTP 400: ${errText.slice(0, 260)}`, 400, errText);
    }

    let adjusted = false;
    const nextOverrides = { ...overrides };
    if (/max_completion_tokens/i.test(errText) && /max_tokens/i.test(errText)) {
      nextOverrides.useMaxCompletion = /use ['"]?max_completion_tokens/i.test(errText);
      adjusted = true;
    }
    if (/temperature/i.test(errText)) {
      nextOverrides.omitTemp = true;
      adjusted = true;
    }
    if (/reasoning_effort/i.test(errText)) {
      nextOverrides.omitReasoningEffort = true;
      adjusted = true;
    }
    if (/response_format|json_validate_failed|json_object/i.test(errText)) {
      nextOverrides.omitJsonMode = true;
      adjusted = true;
    }

    if (!adjusted) {
      throw new AiProviderHttpError(`HTTP 400: ${errText.slice(0, 260)}`, 400, errText);
    }

    overrides = nextOverrides;
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildOpenAiPayload(overrides)),
    });
  }

  const remReq = res.headers.get('x-ratelimit-remaining-requests');
  const remTok = res.headers.get('x-ratelimit-remaining-tokens');
  const rateLimitRemainingRequests = remReq !== null && !Number.isNaN(Number(remReq)) ? Number(remReq) : null;
  const rateLimitRemainingTokens = remTok !== null && !Number.isNaN(Number(remTok)) ? Number(remTok) : null;

  if (!res.ok) {
    const errBody = await res.text();
    throw new AiProviderHttpError(`HTTP ${res.status}: ${errBody.slice(0, 260)}`, res.status, errBody);
  }

  const json = await res.json();
  const rawText = String(json?.choices?.[0]?.message?.content || '');

  return {
    rawText,
    inputTokens: Number(json?.usage?.prompt_tokens || 0),
    outputTokens: Number(json?.usage?.completion_tokens || 0),
    rateLimitRemainingRequests,
    rateLimitRemainingTokens,
  };
}

async function healDeadModelsInConfig(params: {
  config: AiSystemConfig;
  provider: AiProviderId;
  deadModels: string[];
  workingModelId: string;
  liveDiscoveredModels?: AiModelDescriptor[];
}): Promise<AiModelDescriptor[]> {
  const { config, provider, deadModels, workingModelId, liveDiscoveredModels } = params;
  const deadSet = new Set(deadModels);
  const baseList =
    liveDiscoveredModels && liveDiscoveredModels.length > 0
      ? liveDiscoveredModels
      : config.providers[provider]?.cachedModels || MODEL_PRICING_CATALOG[provider];

  const cleanedList = baseList.filter((m) => !deadSet.has(m.id));
  if (!cleanedList.some((m) => m.id === workingModelId)) {
    cleanedList.unshift(resolveModelDescriptor(provider, workingModelId, baseList));
  }

  const shouldSwitchActive =
    config.activeProvider === provider && deadSet.has(config.activeModelId);

  await saveAiConfig({
    activeModelId: shouldSwitchActive ? workingModelId : config.activeModelId,
    providers: {
      ...config.providers,
      [provider]: {
        ...config.providers[provider],
        cachedModels: cleanedList,
      },
    },
  }).catch(() => {});

  return cleanedList;
}

async function invokeWithModelAutoHeal(params: {
  config: AiSystemConfig;
  provider: AiProviderId;
  apiKey: string;
  requestedModel: string;
  systemPrompt?: string;
  userPrompt: string;
  effectLevel: AiEffectLevel;
  isProbe?: boolean;
  prefetchedDiscovery?: {
    models: AiModelDescriptor[];
    syncedAt: string;
  };
}): Promise<{
  response: Awaited<ReturnType<typeof invokeSingleModelRequest>>;
  usedModelId: string;
  deadModels: string[];
  discoveryModels: AiModelDescriptor[];
  syncedAt: string;
}> {
  const { config, provider, apiKey, requestedModel, systemPrompt, userPrompt, effectLevel, isProbe, prefetchedDiscovery } = params;
  const deadModels: string[] = KNOWN_RETIRED_MODEL_IDS.has(requestedModel) ? [requestedModel] : [];
  let currentModelId = KNOWN_RETIRED_MODEL_IDS.has(requestedModel)
    ? (prefetchedDiscovery?.models[0]?.id || MODEL_PRICING_CATALOG[provider][0].id)
    : requestedModel;

  const cachedList =
    prefetchedDiscovery?.models ||
    config.providers[provider]?.cachedModels ||
    MODEL_PRICING_CATALOG[provider];

  try {
    const response = await invokeSingleModelRequest({
      provider,
      apiKey,
      modelId: currentModelId,
      systemPrompt,
      userPrompt,
      effectLevel,
      cachedModels: cachedList,
      isProbe,
    });
    return {
      response,
      usedModelId: currentModelId,
      deadModels,
      discoveryModels: cachedList,
      syncedAt: prefetchedDiscovery?.syncedAt || new Date().toISOString(),
    };
  } catch (firstErr) {
    const httpErr = firstErr instanceof AiProviderHttpError ? firstErr : null;
    if (!httpErr || !isModelNotFoundOrUnavailableError(httpErr.status, httpErr.bodyText)) {
      throw firstErr;
    }

    deadModels.push(currentModelId);
    const suggested = extractSuggestedModelFromError(httpErr.bodyText);
    const discovery = prefetchedDiscovery
      ? { models: prefetchedDiscovery.models, syncedAt: prefetchedDiscovery.syncedAt }
      : await discoverProviderModels(provider, apiKey, false);

    const fallbackCandidates = Array.from(
      new Set([
        ...(suggested ? [suggested] : []),
        ...discovery.models.map((m) => m.id),
        ...MODEL_PRICING_CATALOG[provider].map((m) => m.id),
      ])
    ).filter((id) => Boolean(id) && !deadModels.includes(id));

    let lastFallbackErr: unknown = firstErr;
    for (const candidate of fallbackCandidates.slice(0, 5)) {
      try {
        const response = await invokeSingleModelRequest({
          provider,
          apiKey,
          modelId: candidate,
          systemPrompt,
          userPrompt,
          effectLevel,
          cachedModels: discovery.models,
          isProbe,
        });
        currentModelId = candidate;
        return {
          response,
          usedModelId: currentModelId,
          deadModels,
          discoveryModels: discovery.models,
          syncedAt: discovery.syncedAt,
        };
      } catch (candErr) {
        lastFallbackErr = candErr;
        const candHttpErr = candErr instanceof AiProviderHttpError ? candErr : null;
        if (candHttpErr && isModelNotFoundOrUnavailableError(candHttpErr.status, candHttpErr.bodyText)) {
          deadModels.push(candidate);
          continue;
        }
        throw candErr;
      }
    }

    throw lastFallbackErr;
  }
}

/**
 * Tests connection with an AI provider, refreshes models, and auto-heals deprecated models if needed.
 */
export async function probeProviderConnectionAndBalance(
  provider: AiProviderId,
  modelId?: string,
  overrideApiKey?: string
): Promise<{
  ok: boolean;
  provider: AiProviderId;
  modelId: string;
  autoHealedFrom?: string;
  latencyMs: number;
  liveBalanceUsd?: number | null;
  liveGrantedBalanceUsd?: number | null;
  liveToppedUpBalanceUsd?: number | null;
  rateLimitRemainingRequests?: number | null;
  rateLimitRemainingTokens?: number | null;
  modelsCount: number;
  error?: string;
}> {
  const config = await getAiConfig(true);
  const apiKey = resolveProviderApiKey(config, provider, overrideApiKey);
  const requestedModel =
    modelId ||
    config.providers[provider]?.cachedModels?.[0]?.id ||
    MODEL_PRICING_CATALOG[provider][0].id;

  const targetModel = KNOWN_RETIRED_MODEL_IDS.has(requestedModel)
    ? MODEL_PRICING_CATALOG[provider][0].id
    : requestedModel;

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

  try {
    const discovery = await discoverProviderModels(provider, apiKey, false);
    const healedRun = await invokeWithModelAutoHeal({
      config,
      provider,
      apiKey,
      requestedModel,
      userPrompt: 'Reply with OK',
      effectLevel: 'low',
      isProbe: true,
      prefetchedDiscovery: {
        models: discovery.models,
        syncedAt: discovery.syncedAt,
      },
    });

    const verifiedModelId = healedRun.usedModelId;
    const probeRes = healedRun.response;

    const { liveBalanceUsd, liveGrantedBalanceUsd, liveToppedUpBalanceUsd } =
      provider === 'deepseek'
        ? await fetchDeepSeekLiveBalance(apiKey)
        : {
            liveBalanceUsd: null,
            liveGrantedBalanceUsd: null,
            liveToppedUpBalanceUsd: null,
          };

    const latencyMs = Date.now() - startedAt;
    const healedModels = await healDeadModelsInConfig({
      config,
      provider,
      deadModels: healedRun.deadModels,
      workingModelId: verifiedModelId,
      liveDiscoveredModels: discovery.models,
    });

    const latestConfig = await getAiConfig(true);
    await saveAiConfig({
      activeModelId:
        latestConfig.activeProvider === provider &&
        (healedRun.deadModels.includes(latestConfig.activeModelId) || verifiedModelId !== requestedModel)
          ? verifiedModelId
          : latestConfig.activeModelId,
      providers: {
        ...latestConfig.providers,
        [provider]: {
          ...latestConfig.providers[provider],
          apiKey,
          hasApiKey: true,
          lastVerifiedAt: new Date().toISOString(),
          lastError: '',
          liveBalanceUsd,
          liveGrantedBalanceUsd,
          liveToppedUpBalanceUsd,
          rateLimitRemainingRequests: probeRes.rateLimitRemainingRequests ?? null,
          rateLimitRemainingTokens: probeRes.rateLimitRemainingTokens ?? null,
          cachedModels: healedModels,
          modelsLastSyncedAt: discovery.syncedAt,
        },
      },
    }).catch(() => {});

    return {
      ok: true,
      provider,
      modelId: verifiedModelId,
      autoHealedFrom: verifiedModelId !== requestedModel ? requestedModel : undefined,
      latencyMs,
      liveBalanceUsd,
      liveGrantedBalanceUsd,
      liveToppedUpBalanceUsd,
      rateLimitRemainingRequests: probeRes.rateLimitRemainingRequests ?? null,
      rateLimitRemainingTokens: probeRes.rateLimitRemainingTokens ?? null,
      modelsCount: healedModels.length,
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
 * auto-healing retired models on 404/decommissioned errors and recording token & cost telemetry in `ai_usage_logs`.
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
  const requestedModel =
    params.modelOverride ||
    config.activeModelId ||
    MODEL_PRICING_CATALOG[provider][0].id;

  let modelId = KNOWN_RETIRED_MODEL_IDS.has(requestedModel)
    ? MODEL_PRICING_CATALOG[provider][0].id
    : requestedModel;

  const effectLevel = params.effectOverride || config.effectLevel || 'medium';
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
    const healedRun = await invokeWithModelAutoHeal({
      config,
      provider,
      apiKey,
      requestedModel,
      systemPrompt: params.systemPrompt,
      userPrompt: params.userPrompt,
      effectLevel,
    });

    modelId = healedRun.usedModelId;
    if (healedRun.deadModels.length > 0) {
      await healDeadModelsInConfig({
        config,
        provider,
        deadModels: healedRun.deadModels,
        workingModelId: modelId,
        liveDiscoveredModels: healedRun.discoveryModels,
      });
    }

    rawText = healedRun.response.rawText;
    inputTokens = healedRun.response.inputTokens;
    outputTokens = healedRun.response.outputTokens;

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
