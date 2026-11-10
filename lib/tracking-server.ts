import 'server-only';
import { getCollection, COLLECTIONS } from '@/lib/mongodb';
import {
  TrackingConfig,
  CustomCodeSnippet,
  DEFAULT_TRACKING_CONFIG,
  normalizeTrackingConfig,
  normalizeCustomSnippet,
  toPublicTrackingConfig,
} from '@/lib/tracking-types';

interface TrackingDocument extends TrackingConfig {
  key: 'tracking_config';
  createdAt?: string;
}

interface GlobalTrackingState {
  __persiciTrackingCache?: {
    config: TrackingConfig;
    fetchedAt: number;
  };
}

declare const globalThis: GlobalTrackingState & typeof global;

const CACHE_TTL_MS = 3000;

/**
 * Retrieves the full Tracking, Pixels, GTM & GA4 configuration from MongoDB Atlas
 * ('system_settings' collection under { key: 'tracking_config' }) with a 3s in-memory cache.
 */
export async function getTrackingConfig(
  forceRefresh = false
): Promise<TrackingConfig> {
  const now = Date.now();

  if (
    !forceRefresh &&
    globalThis.__persiciTrackingCache &&
    now - globalThis.__persiciTrackingCache.fetchedAt < CACHE_TTL_MS
  ) {
    return globalThis.__persiciTrackingCache.config;
  }

  try {
    const collection = await getCollection<TrackingDocument>(
      COLLECTIONS.SETTINGS
    );

    if (!collection) {
      return (
        globalThis.__persiciTrackingCache?.config ||
        normalizeTrackingConfig(DEFAULT_TRACKING_CONFIG)
      );
    }

    const doc = await collection.findOne({ key: 'tracking_config' });
    const normalized = normalizeTrackingConfig(doc);

    globalThis.__persiciTrackingCache = {
      config: normalized,
      fetchedAt: Date.now(),
    };

    return normalized;
  } catch (error) {
    console.warn(
      '[getTrackingConfig] MongoDB read warning, using cached/default config:',
      error
    );
    return (
      globalThis.__persiciTrackingCache?.config ||
      normalizeTrackingConfig(DEFAULT_TRACKING_CONFIG)
    );
  }
}

/**
 * Retrieves the public-safe TrackingConfig (strips server-side private keys).
 */
export async function getPublicTrackingConfig(
  forceRefresh = false
): Promise<TrackingConfig> {
  const config = await getTrackingConfig(forceRefresh);
  return toPublicTrackingConfig(config);
}

/**
 * Persists updated TrackingConfig to MongoDB Atlas and refreshes the in-memory cache immediately.
 */
export async function saveTrackingConfig(
  input: Partial<TrackingConfig> | Record<string, unknown>,
  updatedBy = 'admin'
): Promise<{
  success: boolean;
  config: TrackingConfig;
  persistedToDb: boolean;
}> {
  const current = await getTrackingConfig(true);
  const incoming = (input || {}) as Record<string, unknown>;

  // Preserve existing private keys if incoming payload passes masked/empty placeholder unless explicitly cleared
  const incomingGa4 = (
    incoming.ga4 && typeof incoming.ga4 === 'object' ? incoming.ga4 : {}
  ) as Record<string, unknown>;
  const incomingPixels = (
    incoming.pixels && typeof incoming.pixels === 'object'
      ? incoming.pixels
      : {}
  ) as Record<string, unknown>;
  const incomingMeta = (
    incomingPixels.meta && typeof incomingPixels.meta === 'object'
      ? incomingPixels.meta
      : {}
  ) as Record<string, unknown>;

  const mergedGa4 = {
    ...current.ga4,
    ...incomingGa4,
    serviceAccountPrivateKey:
      incomingGa4.serviceAccountPrivateKey === '__KEEP_EXISTING__'
        ? current.ga4.serviceAccountPrivateKey
        : typeof incomingGa4.serviceAccountPrivateKey === 'string'
          ? incomingGa4.serviceAccountPrivateKey
          : current.ga4.serviceAccountPrivateKey,
  };

  const mergedPixels = {
    ...current.pixels,
    ...incomingPixels,
    meta: {
      ...current.pixels.meta,
      ...incomingMeta,
      capiAccessToken:
        incomingMeta.capiAccessToken === '__KEEP_EXISTING__'
          ? current.pixels.meta.capiAccessToken
          : typeof incomingMeta.capiAccessToken === 'string'
            ? incomingMeta.capiAccessToken
            : current.pixels.meta.capiAccessToken,
    },
    tiktok: {
      ...current.pixels.tiktok,
      ...(incomingPixels.tiktok && typeof incomingPixels.tiktok === 'object'
        ? (incomingPixels.tiktok as Record<string, unknown>)
        : {}),
    },
    snapchat: {
      ...current.pixels.snapchat,
      ...(incomingPixels.snapchat && typeof incomingPixels.snapchat === 'object'
        ? (incomingPixels.snapchat as Record<string, unknown>)
        : {}),
    },
    linkedin: {
      ...current.pixels.linkedin,
      ...(incomingPixels.linkedin && typeof incomingPixels.linkedin === 'object'
        ? (incomingPixels.linkedin as Record<string, unknown>)
        : {}),
    },
    x: {
      ...current.pixels.x,
      ...(incomingPixels.x && typeof incomingPixels.x === 'object'
        ? (incomingPixels.x as Record<string, unknown>)
        : {}),
    },
    googleAds: {
      ...current.pixels.googleAds,
      ...(incomingPixels.googleAds &&
      typeof incomingPixels.googleAds === 'object'
        ? (incomingPixels.googleAds as Record<string, unknown>)
        : {}),
    },
    behavior: {
      ...current.pixels.behavior,
      ...(incomingPixels.behavior && typeof incomingPixels.behavior === 'object'
        ? (incomingPixels.behavior as Record<string, unknown>)
        : {}),
    },
  };

  const merged = normalizeTrackingConfig({
    ...current,
    ...incoming,
    gtm: {
      ...current.gtm,
      ...(incoming.gtm && typeof incoming.gtm === 'object'
        ? (incoming.gtm as Record<string, unknown>)
        : {}),
    },
    ga4: mergedGa4,
    pixels: mergedPixels,
    customSnippets: Array.isArray(incoming.customSnippets)
      ? incoming.customSnippets
      : current.customSnippets,
    updatedAt: new Date().toISOString(),
    updatedBy,
  });

  globalThis.__persiciTrackingCache = {
    config: merged,
    fetchedAt: Date.now(),
  };

  try {
    const collection = await getCollection<TrackingDocument>(
      COLLECTIONS.SETTINGS
    );

    if (!collection) {
      return {
        success: true,
        config: merged,
        persistedToDb: false,
      };
    }

    await collection.updateOne(
      { key: 'tracking_config' },
      {
        $set: {
          ...merged,
          key: 'tracking_config',
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return {
      success: true,
      config: merged,
      persistedToDb: true,
    };
  } catch (error) {
    console.error('[saveTrackingConfig] Error saving to MongoDB:', error);
    return {
      success: true,
      config: merged,
      persistedToDb: false,
    };
  }
}

/**
 * Upserts a single CustomCodeSnippet inside the TrackingConfig.
 */
export async function upsertCustomSnippet(
  snippetInput: Partial<CustomCodeSnippet>,
  updatedBy = 'admin'
): Promise<{
  success: boolean;
  snippet: CustomCodeSnippet;
  config: TrackingConfig;
  persistedToDb: boolean;
}> {
  const current = await getTrackingConfig(true);
  const normalizedSnippet = normalizeCustomSnippet(
    {
      ...snippetInput,
      updatedAt: new Date().toISOString(),
    },
    current.customSnippets.length
  );

  const existingIndex = current.customSnippets.findIndex(
    (s) => s.id === normalizedSnippet.id
  );

  const nextSnippets = [...current.customSnippets];
  if (existingIndex >= 0) {
    nextSnippets[existingIndex] = {
      ...nextSnippets[existingIndex],
      ...normalizedSnippet,
      createdAt:
        nextSnippets[existingIndex].createdAt || normalizedSnippet.createdAt,
    };
  } else {
    nextSnippets.push(normalizedSnippet);
  }

  const saved = await saveTrackingConfig(
    {
      ...current,
      customSnippets: nextSnippets,
    },
    updatedBy
  );

  return {
    success: saved.success,
    snippet: normalizedSnippet,
    config: saved.config,
    persistedToDb: saved.persistedToDb,
  };
}

/**
 * Deletes a CustomCodeSnippet by ID.
 */
export async function deleteCustomSnippet(
  snippetId: string,
  updatedBy = 'admin'
): Promise<{
  success: boolean;
  config: TrackingConfig;
  persistedToDb: boolean;
}> {
  const current = await getTrackingConfig(true);
  const nextSnippets = current.customSnippets.filter((s) => s.id !== snippetId);
  return saveTrackingConfig(
    {
      ...current,
      customSnippets: nextSnippets,
    },
    updatedBy
  );
}
