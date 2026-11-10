export type SnippetPlacement =
  | 'head_top'
  | 'head_bottom'
  | 'body_top'
  | 'body_bottom';

export type SnippetCodeType = 'html' | 'javascript';

export type SnippetScope = 'all_public' | 'homepage_only' | 'custom_paths';
export type SnippetPageScope = SnippetScope;

export type SnippetPlatform =
  | 'google_tag'
  | 'google_analytics'
  | 'meta_pixel'
  | 'tiktok_pixel'
  | 'snap_pixel'
  | 'linkedin_insight'
  | 'x_pixel'
  | 'clarity_hotjar'
  | 'custom';

export interface GtmConfig {
  enabled: boolean;
  containerId: string; // e.g. GTM-XXXXXXX
  dataLayerName: string; // default: 'dataLayer'
  customScriptDomain: string; // default: '' (uses https://www.googletagmanager.com)
  environmentAuth: string; // optional gtm_auth
  environmentPreview: string; // optional gtm_preview
}

export interface Ga4Config {
  enabled: boolean;
  measurementId: string; // e.g. G-XXXXXXXXXX
  propertyId: string; // e.g. 123456789 (for GA4 Data API v1 reporting)
  dataStreamId: string; // optional stream ID
  sendPageViews: boolean;
  trackLeadEvents: boolean; // auto-fires generate_lead / schedule_appointment / request_discovery
  anonymizeIp: boolean;
  debugMode: boolean;
  // Server-side Reporting API / Measurement Protocol settings (for future linking)
  apiSecret: string; // Measurement Protocol API Secret
  serviceAccountEmail: string; // Google Cloud Service Account client_email
  serviceAccountPrivateKey: string; // Service Account private_key or JSON (stored server-side)
  hasServiceAccountKey?: boolean;
}

export interface MetaPixelConfig {
  enabled: boolean;
  pixelId: string;
  trackLeadEvents: boolean;
  capiAccessToken: string; // Optional Meta Conversions API token (server-side)
  testEventCode: string; // Optional Test Event Code (e.g. TEST12345)
  hasCapiToken?: boolean;
}

export interface TiktokPixelConfig {
  enabled: boolean;
  pixelId: string;
  trackLeadEvents: boolean;
}

export interface SnapchatPixelConfig {
  enabled: boolean;
  pixelId: string;
  trackLeadEvents: boolean;
}

export interface LinkedinInsightConfig {
  enabled: boolean;
  partnerId: string;
  conversionId: string;
  trackLeadEvents: boolean;
}

export interface XPixelConfig {
  enabled: boolean;
  pixelId: string;
  conversionEventId: string;
  trackLeadEvents: boolean;
}

export interface GoogleAdsPixelConfig {
  enabled: boolean;
  conversionId: string; // e.g. AW-123456789
  conversionLabel: string; // e.g. AbCdEfGhIjKlMnOpQr
  trackLeadEvents: boolean;
}

export interface ClarityHotjarConfig {
  clarityEnabled: boolean;
  clarityProjectId: string;
  hotjarEnabled: boolean;
  hotjarSiteId: string;
}

export interface PixelsConfig {
  meta: MetaPixelConfig;
  tiktok: TiktokPixelConfig;
  snapchat: SnapchatPixelConfig;
  linkedin: LinkedinInsightConfig;
  x: XPixelConfig;
  googleAds: GoogleAdsPixelConfig;
  behavior: ClarityHotjarConfig;
}

export interface CustomCodeSnippet {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  platform: SnippetPlatform;
  codeType: SnippetCodeType;
  placement: SnippetPlacement;
  scope: SnippetScope;
  targetPaths: string[]; // e.g. ['/contact', '/solutions'] when scope === 'custom_paths'
  priority: number; // lower number = earlier execution (default 10)
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackingConfig {
  gtm: GtmConfig;
  ga4: Ga4Config;
  pixels: PixelsConfig;
  customSnippets: CustomCodeSnippet[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface LeadAttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  liFatId?: string;
  twclid?: string;
  sccid?: string;
  referrer?: string;
  landingPage?: string;
}

export const DEFAULT_TRACKING_CONFIG: TrackingConfig = {
  gtm: {
    enabled: false,
    containerId: '',
    dataLayerName: 'dataLayer',
    customScriptDomain: '',
    environmentAuth: '',
    environmentPreview: '',
  },
  ga4: {
    enabled: false,
    measurementId: '',
    propertyId: '',
    dataStreamId: '',
    sendPageViews: true,
    trackLeadEvents: true,
    anonymizeIp: false,
    debugMode: false,
    apiSecret: '',
    serviceAccountEmail: '',
    serviceAccountPrivateKey: '',
    hasServiceAccountKey: false,
  },
  pixels: {
    meta: {
      enabled: false,
      pixelId: '',
      trackLeadEvents: true,
      capiAccessToken: '',
      testEventCode: '',
      hasCapiToken: false,
    },
    tiktok: {
      enabled: false,
      pixelId: '',
      trackLeadEvents: true,
    },
    snapchat: {
      enabled: false,
      pixelId: '',
      trackLeadEvents: true,
    },
    linkedin: {
      enabled: false,
      partnerId: '',
      conversionId: '',
      trackLeadEvents: true,
    },
    x: {
      enabled: false,
      pixelId: '',
      conversionEventId: '',
      trackLeadEvents: true,
    },
    googleAds: {
      enabled: false,
      conversionId: '',
      conversionLabel: '',
      trackLeadEvents: true,
    },
    behavior: {
      clarityEnabled: false,
      clarityProjectId: '',
      hotjarEnabled: false,
      hotjarSiteId: '',
    },
  },
  customSnippets: [],
};

const VALID_PLACEMENTS: SnippetPlacement[] = [
  'head_top',
  'head_bottom',
  'body_top',
  'body_bottom',
];

const VALID_PLATFORMS: SnippetPlatform[] = [
  'google_tag',
  'google_analytics',
  'meta_pixel',
  'tiktok_pixel',
  'snap_pixel',
  'linkedin_insight',
  'x_pixel',
  'clarity_hotjar',
  'custom',
];

const VALID_SCOPES: SnippetScope[] = [
  'all_public',
  'homepage_only',
  'custom_paths',
];

export function normalizeCustomSnippet(
  raw: unknown,
  index = 0
): CustomCodeSnippet {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<
    string,
    unknown
  >;

  const placement: SnippetPlacement = VALID_PLACEMENTS.includes(
    obj.placement as SnippetPlacement
  )
    ? (obj.placement as SnippetPlacement)
    : 'head_bottom';

  const platform: SnippetPlatform = VALID_PLATFORMS.includes(
    obj.platform as SnippetPlatform
  )
    ? (obj.platform as SnippetPlatform)
    : 'custom';

  const codeType: SnippetCodeType =
    obj.codeType === 'javascript' ? 'javascript' : 'html';

  const scope: SnippetScope = VALID_SCOPES.includes(obj.scope as SnippetScope)
    ? (obj.scope as SnippetScope)
    : 'all_public';

  const rawPaths = Array.isArray(obj.targetPaths)
    ? obj.targetPaths
    : Array.isArray(obj.customPaths)
    ? obj.customPaths
    : [];
  const targetPaths = rawPaths
    .map((p) => String(p || '').trim())
    .filter((p) => p.length > 0);

  const priority =
    typeof obj.priority === 'number' && !Number.isNaN(obj.priority)
      ? Math.max(1, Math.min(999, Math.round(obj.priority)))
      : 10;

  return {
    id:
      typeof obj.id === 'string' && obj.id.trim().length > 0
        ? obj.id.trim()
        : `snippet-${Date.now()}-${index}`,
    name:
      typeof obj.name === 'string' && obj.name.trim().length > 0
        ? obj.name.trim()
        : `Custom Snippet #${index + 1}`,
    description:
      typeof obj.description === 'string' ? obj.description.trim() : '',
    enabled: obj.enabled !== false,
    platform,
    codeType,
    placement,
    scope,
    targetPaths,
    priority,
    code: typeof obj.code === 'string' ? obj.code : '',
    createdAt:
      typeof obj.createdAt === 'string'
        ? obj.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof obj.updatedAt === 'string'
        ? obj.updatedAt
        : new Date().toISOString(),
  };
}

export function normalizeTrackingConfig(
  raw?: Partial<TrackingConfig> | Record<string, unknown> | null
): TrackingConfig {
  if (!raw || typeof raw !== 'object') {
    return structuredClone(DEFAULT_TRACKING_CONFIG);
  }

  const data = raw as Record<string, unknown>;
  const rawGtm = (
    data.gtm && typeof data.gtm === 'object' ? data.gtm : {}
  ) as Record<string, unknown>;
  const rawGa4 = (
    data.ga4 && typeof data.ga4 === 'object' ? data.ga4 : {}
  ) as Record<string, unknown>;
  const rawPixels = (
    data.pixels && typeof data.pixels === 'object' ? data.pixels : {}
  ) as Record<string, unknown>;

  const rawMeta = (
    rawPixels.meta && typeof rawPixels.meta === 'object' ? rawPixels.meta : {}
  ) as Record<string, unknown>;
  const rawTiktok = (
    rawPixels.tiktok && typeof rawPixels.tiktok === 'object'
      ? rawPixels.tiktok
      : {}
  ) as Record<string, unknown>;
  const rawSnap = (
    rawPixels.snapchat && typeof rawPixels.snapchat === 'object'
      ? rawPixels.snapchat
      : {}
  ) as Record<string, unknown>;
  const rawLinkedin = (
    rawPixels.linkedin && typeof rawPixels.linkedin === 'object'
      ? rawPixels.linkedin
      : {}
  ) as Record<string, unknown>;
  const rawX = (
    rawPixels.x && typeof rawPixels.x === 'object' ? rawPixels.x : {}
  ) as Record<string, unknown>;
  const rawGoogleAds = (
    rawPixels.googleAds && typeof rawPixels.googleAds === 'object'
      ? rawPixels.googleAds
      : {}
  ) as Record<string, unknown>;
  const rawBehavior = (
    rawPixels.behavior && typeof rawPixels.behavior === 'object'
      ? rawPixels.behavior
      : {}
  ) as Record<string, unknown>;

  const serviceAccountPrivateKey =
    typeof rawGa4.serviceAccountPrivateKey === 'string'
      ? rawGa4.serviceAccountPrivateKey.trim()
      : '';

  const capiAccessToken =
    typeof rawMeta.capiAccessToken === 'string'
      ? rawMeta.capiAccessToken.trim()
      : '';

  const customSnippets = Array.isArray(data.customSnippets)
    ? data.customSnippets
        .map((s, idx) => normalizeCustomSnippet(s, idx))
        .sort((a, b) => a.priority - b.priority)
    : [];

  return {
    gtm: {
      enabled: Boolean(rawGtm.enabled),
      containerId:
        typeof rawGtm.containerId === 'string'
          ? rawGtm.containerId.trim().toUpperCase()
          : '',
      dataLayerName:
        typeof rawGtm.dataLayerName === 'string' &&
        rawGtm.dataLayerName.trim().length > 0
          ? rawGtm.dataLayerName.trim()
          : 'dataLayer',
      customScriptDomain:
        typeof rawGtm.customScriptDomain === 'string'
          ? rawGtm.customScriptDomain.trim().replace(/\/$/, '')
          : '',
      environmentAuth:
        typeof rawGtm.environmentAuth === 'string'
          ? rawGtm.environmentAuth.trim()
          : '',
      environmentPreview:
        typeof rawGtm.environmentPreview === 'string'
          ? rawGtm.environmentPreview.trim()
          : '',
    },
    ga4: {
      enabled: Boolean(rawGa4.enabled),
      measurementId:
        typeof rawGa4.measurementId === 'string'
          ? rawGa4.measurementId.trim().toUpperCase()
          : '',
      propertyId:
        typeof rawGa4.propertyId === 'string' ? rawGa4.propertyId.trim() : '',
      dataStreamId:
        typeof rawGa4.dataStreamId === 'string'
          ? rawGa4.dataStreamId.trim()
          : '',
      sendPageViews:
        typeof rawGa4.sendPageViews === 'boolean'
          ? rawGa4.sendPageViews
          : true,
      trackLeadEvents:
        typeof rawGa4.trackLeadEvents === 'boolean'
          ? rawGa4.trackLeadEvents
          : true,
      anonymizeIp: Boolean(rawGa4.anonymizeIp),
      debugMode: Boolean(rawGa4.debugMode),
      apiSecret:
        typeof rawGa4.apiSecret === 'string' ? rawGa4.apiSecret.trim() : '',
      serviceAccountEmail:
        typeof rawGa4.serviceAccountEmail === 'string'
          ? rawGa4.serviceAccountEmail.trim()
          : '',
      serviceAccountPrivateKey,
      hasServiceAccountKey: serviceAccountPrivateKey.length > 0,
    },
    pixels: {
      meta: {
        enabled: Boolean(rawMeta.enabled),
        pixelId:
          typeof rawMeta.pixelId === 'string' ? rawMeta.pixelId.trim() : '',
        trackLeadEvents:
          typeof rawMeta.trackLeadEvents === 'boolean'
            ? rawMeta.trackLeadEvents
            : true,
        capiAccessToken,
        testEventCode:
          typeof rawMeta.testEventCode === 'string'
            ? rawMeta.testEventCode.trim()
            : '',
        hasCapiToken: capiAccessToken.length > 0,
      },
      tiktok: {
        enabled: Boolean(rawTiktok.enabled),
        pixelId:
          typeof rawTiktok.pixelId === 'string'
            ? rawTiktok.pixelId.trim()
            : '',
        trackLeadEvents:
          typeof rawTiktok.trackLeadEvents === 'boolean'
            ? rawTiktok.trackLeadEvents
            : true,
      },
      snapchat: {
        enabled: Boolean(rawSnap.enabled),
        pixelId:
          typeof rawSnap.pixelId === 'string' ? rawSnap.pixelId.trim() : '',
        trackLeadEvents:
          typeof rawSnap.trackLeadEvents === 'boolean'
            ? rawSnap.trackLeadEvents
            : true,
      },
      linkedin: {
        enabled: Boolean(rawLinkedin.enabled),
        partnerId:
          typeof rawLinkedin.partnerId === 'string'
            ? rawLinkedin.partnerId.trim()
            : '',
        conversionId:
          typeof rawLinkedin.conversionId === 'string'
            ? rawLinkedin.conversionId.trim()
            : '',
        trackLeadEvents:
          typeof rawLinkedin.trackLeadEvents === 'boolean'
            ? rawLinkedin.trackLeadEvents
            : true,
      },
      x: {
        enabled: Boolean(rawX.enabled),
        pixelId: typeof rawX.pixelId === 'string' ? rawX.pixelId.trim() : '',
        conversionEventId:
          typeof rawX.conversionEventId === 'string'
            ? rawX.conversionEventId.trim()
            : '',
        trackLeadEvents:
          typeof rawX.trackLeadEvents === 'boolean'
            ? rawX.trackLeadEvents
            : true,
      },
      googleAds: {
        enabled: Boolean(rawGoogleAds.enabled),
        conversionId:
          typeof rawGoogleAds.conversionId === 'string'
            ? rawGoogleAds.conversionId.trim()
            : '',
        conversionLabel:
          typeof rawGoogleAds.conversionLabel === 'string'
            ? rawGoogleAds.conversionLabel.trim()
            : '',
        trackLeadEvents:
          typeof rawGoogleAds.trackLeadEvents === 'boolean'
            ? rawGoogleAds.trackLeadEvents
            : true,
      },
      behavior: {
        clarityEnabled: Boolean(rawBehavior.clarityEnabled),
        clarityProjectId:
          typeof rawBehavior.clarityProjectId === 'string'
            ? rawBehavior.clarityProjectId.trim()
            : '',
        hotjarEnabled: Boolean(rawBehavior.hotjarEnabled),
        hotjarSiteId:
          typeof rawBehavior.hotjarSiteId === 'string'
            ? rawBehavior.hotjarSiteId.trim()
            : '',
      },
    },
    customSnippets,
    updatedAt:
      typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
    updatedBy:
      typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
  };
}

/**
 * Strips server-only secrets before passing TrackingConfig to public client components.
 */
export function toPublicTrackingConfig(config: TrackingConfig): TrackingConfig {
  return {
    ...config,
    ga4: {
      ...config.ga4,
      apiSecret: '',
      serviceAccountPrivateKey: '',
      hasServiceAccountKey: Boolean(config.ga4.serviceAccountPrivateKey),
    },
    pixels: {
      ...config.pixels,
      meta: {
        ...config.pixels.meta,
        capiAccessToken: '',
        hasCapiToken: Boolean(config.pixels.meta.capiAccessToken),
      },
    },
  };
}

/**
 * Computes a summary of active tracking integrations for dashboard status badges.
 */
export function getTrackingStatusSummary(config: TrackingConfig) {
  const gtmActive = Boolean(config.gtm.enabled && config.gtm.containerId);
  const ga4Active = Boolean(config.ga4.enabled && config.ga4.measurementId);
  const ga4ApiConfigured = Boolean(
    config.ga4.propertyId &&
      config.ga4.serviceAccountEmail &&
      (config.ga4.serviceAccountPrivateKey || config.ga4.hasServiceAccountKey)
  );

  const activePixels: string[] = [];
  if (config.pixels.meta.enabled && config.pixels.meta.pixelId) {
    activePixels.push('Meta Pixel');
  }
  if (config.pixels.tiktok.enabled && config.pixels.tiktok.pixelId) {
    activePixels.push('TikTok Pixel');
  }
  if (config.pixels.snapchat.enabled && config.pixels.snapchat.pixelId) {
    activePixels.push('Snapchat Pixel');
  }
  if (config.pixels.linkedin.enabled && config.pixels.linkedin.partnerId) {
    activePixels.push('LinkedIn Insight');
  }
  if (config.pixels.x.enabled && config.pixels.x.pixelId) {
    activePixels.push('X (Twitter) Pixel');
  }
  if (config.pixels.googleAds.enabled && config.pixels.googleAds.conversionId) {
    activePixels.push('Google Ads');
  }
  if (
    config.pixels.behavior.clarityEnabled &&
    config.pixels.behavior.clarityProjectId
  ) {
    activePixels.push('Microsoft Clarity');
  }
  if (
    config.pixels.behavior.hotjarEnabled &&
    config.pixels.behavior.hotjarSiteId
  ) {
    activePixels.push('Hotjar');
  }

  const activeSnippetsCount = config.customSnippets.filter(
    (s) => s.enabled && s.code.trim().length > 0
  ).length;

  return {
    gtmActive,
    gtmContainerId: config.gtm.containerId,
    ga4Active,
    ga4MeasurementId: config.ga4.measurementId,
    ga4ApiConfigured,
    ga4FutureReady: ga4ApiConfigured,
    activePixels,
    activePixelsCount: activePixels.length,
    activeSnippetsCount,
    totalSnippetsCount: config.customSnippets.length,
  };
}

export type TrackingStatusSummary = ReturnType<typeof getTrackingStatusSummary>;
