import 'server-only';
import { getCollection, COLLECTIONS } from '@/lib/mongodb';
import {
  MaintenanceConfig,
  DEFAULT_MAINTENANCE_CONFIG,
  normalizeMaintenanceConfig,
} from '@/lib/maintenance-types';

interface MaintenanceDocument extends MaintenanceConfig {
  key: 'maintenance';
  createdAt?: string;
}

interface GlobalMaintenanceState {
  __persiciMaintenanceCache?: {
    config: MaintenanceConfig;
    fetchedAt: number;
  };
}

declare const globalThis: GlobalMaintenanceState & typeof global;

const CACHE_TTL_MS = 3000; // 3 seconds TTL for DB reads, invalidated immediately on save

/**
 * Retrieves the current site Maintenance & Redirect configuration.
 * Uses a fast in-memory cache backed by MongoDB Atlas ('system_settings' collection)
 * with graceful fallback to DEFAULT_MAINTENANCE_CONFIG if MongoDB is unreachable.
 */
export async function getMaintenanceConfig(
  forceRefresh = false
): Promise<MaintenanceConfig> {
  const now = Date.now();

  if (
    !forceRefresh &&
    globalThis.__persiciMaintenanceCache &&
    now - globalThis.__persiciMaintenanceCache.fetchedAt < CACHE_TTL_MS
  ) {
    return globalThis.__persiciMaintenanceCache.config;
  }

  try {
    const collection = await getCollection<MaintenanceDocument>(
      COLLECTIONS.SETTINGS
    );

    if (!collection) {
      const fallback =
        globalThis.__persiciMaintenanceCache?.config ||
        normalizeMaintenanceConfig(DEFAULT_MAINTENANCE_CONFIG);
      return fallback;
    }

    const doc = await collection.findOne({ key: 'maintenance' });
    const normalized = normalizeMaintenanceConfig(doc);

    globalThis.__persiciMaintenanceCache = {
      config: normalized,
      fetchedAt: Date.now(),
    };

    return normalized;
  } catch (error) {
    console.warn(
      '[getMaintenanceConfig] MongoDB read warning, using cached/default config:',
      error
    );
    return (
      globalThis.__persiciMaintenanceCache?.config ||
      normalizeMaintenanceConfig(DEFAULT_MAINTENANCE_CONFIG)
    );
  }
}

/**
 * Persists updated Maintenance & Redirect configuration to MongoDB Atlas
 * and immediately updates the in-memory edge cache.
 */
export async function saveMaintenanceConfig(
  input: Partial<MaintenanceConfig> | Record<string, unknown>,
  updatedBy = 'admin'
): Promise<{ success: boolean; config: MaintenanceConfig; persistedToDb: boolean }> {
  const current = await getMaintenanceConfig(true);
  const merged = normalizeMaintenanceConfig({
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
    updatedBy,
  });

  // Immediately update in-memory cache so proxy.ts and SSR routes reflect the change in 0ms
  globalThis.__persiciMaintenanceCache = {
    config: merged,
    fetchedAt: Date.now(),
  };

  try {
    const collection = await getCollection<MaintenanceDocument>(
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
      { key: 'maintenance' },
      {
        $set: {
          ...merged,
          key: 'maintenance',
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
    console.error('[saveMaintenanceConfig] Error saving to MongoDB:', error);
    // Still return success with the updated in-memory config so local/offline dev environments remain functional
    return {
      success: true,
      config: merged,
      persistedToDb: false,
    };
  }
}
