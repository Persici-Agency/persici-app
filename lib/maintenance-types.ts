export type MaintenanceModeType = 'maintenance_page' | 'redirect';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface MaintenanceConfig {
  enabled: boolean;
  mode: MaintenanceModeType;

  // Direct Redirect Mode Configuration
  redirectUrl: string;
  redirectStatusCode: 307 | 308;
  preservePath: boolean;

  // Countdown Timer Configuration
  countdownEnabled: boolean;
  countdownTargetDate: string; // ISO 8601 string
  countdownLabel: BilingualText;

  // Default Maintenance Page Bilingual Content
  badge: BilingualText;
  title: BilingualText;
  description: BilingualText;
  showContactButton: boolean;
  contactButtonLabel: BilingualText;
  contactButtonHref: string;

  // Audit Metadata
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enabled: false,
  mode: 'maintenance_page',

  redirectUrl: '',
  redirectStatusCode: 307,
  preservePath: false,

  countdownEnabled: false,
  countdownTargetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  countdownLabel: {
    en: 'ESTIMATED TIME REMAINING UNTIL LAUNCH',
    ar: 'الوقت المتبقي المتوقع لعودة الخدمة',
  },

  badge: {
    en: 'SYSTEM MAINTENANCE • SCHEDULED UPGRADE',
    ar: 'صيانة النظام • تحديث مجدول',
  },
  title: {
    en: 'Elevating Our Digital Experience — Back Shortly',
    ar: 'نعمل حالياً على تطوير وتحسين منصتنا الرقمية',
  },
  description: {
    en: 'We are currently performing scheduled infrastructure upgrades and deploying new capabilities to serve you better. Thank you for your patience.',
    ar: 'نقوم حالياً بإجراء تحديثات مجدولة للبنية التحتية وإطلاق مزايا جديدة لتقديم تجربة استثنائية. نشكركم على صبركم وتفهمكم.',
  },
  showContactButton: true,
  contactButtonLabel: {
    en: 'Contact Support Team',
    ar: 'تواصل مع فريق الدعم',
  },
  contactButtonHref: 'mailto:info@persici.com',
};

function normalizeBilingual(
  input: unknown,
  fallback: BilingualText
): BilingualText {
  if (!input || typeof input !== 'object') {
    return { ...fallback };
  }
  const obj = input as Record<string, unknown>;
  return {
    en:
      typeof obj.en === 'string' && obj.en.trim().length > 0
        ? obj.en.trim()
        : fallback.en,
    ar:
      typeof obj.ar === 'string' && obj.ar.trim().length > 0
        ? obj.ar.trim()
        : fallback.ar,
  };
}

export function normalizeMaintenanceConfig(
  raw?: Partial<MaintenanceConfig> | Record<string, unknown> | null
): MaintenanceConfig {
  if (!raw || typeof raw !== 'object') {
    return {
      ...DEFAULT_MAINTENANCE_CONFIG,
      countdownLabel: { ...DEFAULT_MAINTENANCE_CONFIG.countdownLabel },
      badge: { ...DEFAULT_MAINTENANCE_CONFIG.badge },
      title: { ...DEFAULT_MAINTENANCE_CONFIG.title },
      description: { ...DEFAULT_MAINTENANCE_CONFIG.description },
      contactButtonLabel: { ...DEFAULT_MAINTENANCE_CONFIG.contactButtonLabel },
    };
  }

  const data = raw as Record<string, unknown>;

  const mode: MaintenanceModeType =
    data.mode === 'redirect' ? 'redirect' : 'maintenance_page';

  const redirectStatusCode: 307 | 308 =
    Number(data.redirectStatusCode) === 308 ? 308 : 307;

  const countdownTargetDate =
    typeof data.countdownTargetDate === 'string' &&
    data.countdownTargetDate.trim().length > 0
      ? data.countdownTargetDate.trim()
      : DEFAULT_MAINTENANCE_CONFIG.countdownTargetDate;

  return {
    enabled: Boolean(data.enabled),
    mode,
    redirectUrl:
      typeof data.redirectUrl === 'string' ? data.redirectUrl.trim() : '',
    redirectStatusCode,
    preservePath: Boolean(data.preservePath),
    countdownEnabled: Boolean(data.countdownEnabled),
    countdownTargetDate,
    countdownLabel: normalizeBilingual(
      data.countdownLabel,
      DEFAULT_MAINTENANCE_CONFIG.countdownLabel
    ),
    badge: normalizeBilingual(data.badge, DEFAULT_MAINTENANCE_CONFIG.badge),
    title: normalizeBilingual(data.title, DEFAULT_MAINTENANCE_CONFIG.title),
    description: normalizeBilingual(
      data.description,
      DEFAULT_MAINTENANCE_CONFIG.description
    ),
    showContactButton:
      typeof data.showContactButton === 'boolean'
        ? data.showContactButton
        : DEFAULT_MAINTENANCE_CONFIG.showContactButton,
    contactButtonLabel: normalizeBilingual(
      data.contactButtonLabel,
      DEFAULT_MAINTENANCE_CONFIG.contactButtonLabel
    ),
    contactButtonHref:
      typeof data.contactButtonHref === 'string' &&
      data.contactButtonHref.trim().length > 0
        ? data.contactButtonHref.trim()
        : DEFAULT_MAINTENANCE_CONFIG.contactButtonHref,
    updatedAt:
      typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
    updatedBy:
      typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
  };
}
