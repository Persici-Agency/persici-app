import {
  contactPageData,
  type ContactOfficeItem,
  type ContactChannelItem,
} from '@/app/[lang]/(site)/contact/_contact/data/contact.data';

export type SocialIconKey =
  | 'x'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'snapchat'
  | 'pinterest'
  | 'github'
  | 'whatsapp'
  | 'website';

export interface CommunicationSocialLink {
  id: string;
  platform: string;
  iconKey: SocialIconKey;
  url: string;
  enabled: boolean;
}

export interface CommunicationSocialConfig {
  websiteDomain: string;
  websiteUrl: string;
  infoEmail: string;
  supportEmail: string;
  hrEmail: string;
  growthEmail: string;
  partnersEmail: string;
  pressEmail: string;
  primaryPhone: string;
  whatsappNumber?: string;
  socialLinks: CommunicationSocialLink[];
  offices: ContactOfficeItem[];
  channels: ContactChannelItem[];
  updatedBy?: string;
  updatedAt?: string;
}

export function inferSocialIconKey(platformName?: string, rawKey?: string): SocialIconKey {
  const validKeys = new Set<SocialIconKey>([
    'x',
    'linkedin',
    'instagram',
    'facebook',
    'youtube',
    'tiktok',
    'snapchat',
    'pinterest',
    'github',
    'whatsapp',
    'website',
  ]);
  if (rawKey && validKeys.has(rawKey as SocialIconKey)) {
    return rawKey as SocialIconKey;
  }
  const lower = (platformName || '').toLowerCase();
  if (lower.includes('linkedin')) return 'linkedin';
  if (lower.includes('instagram')) return 'instagram';
  if (lower.includes('facebook')) return 'facebook';
  if (lower.includes('youtube')) return 'youtube';
  if (lower.includes('tiktok')) return 'tiktok';
  if (lower.includes('snapchat')) return 'snapchat';
  if (lower.includes('pinterest')) return 'pinterest';
  if (lower.includes('github')) return 'github';
  if (lower.includes('whatsapp')) return 'whatsapp';
  if (lower === 'x' || lower.includes('twitter')) return 'x';
  return 'website';
}

export const DEFAULT_SOCIAL_LINKS: CommunicationSocialLink[] = [
  {
    id: 'social-x',
    platform: 'X',
    iconKey: 'x',
    url: 'https://x.com/persiciofficial',
    enabled: true,
  },
  {
    id: 'social-linkedin',
    platform: 'LinkedIn',
    iconKey: 'linkedin',
    url: 'https://www.linkedin.com/company/persiciofficial/',
    enabled: true,
  },
  {
    id: 'social-instagram',
    platform: 'Instagram',
    iconKey: 'instagram',
    url: 'https://www.instagram.com/persiciofficial',
    enabled: true,
  },
  {
    id: 'social-facebook',
    platform: 'Facebook',
    iconKey: 'facebook',
    url: 'https://www.facebook.com/persiciofficial',
    enabled: false,
  },
  {
    id: 'social-youtube',
    platform: 'YouTube',
    iconKey: 'youtube',
    url: 'https://www.youtube.com/channel/UCI_O_2_bnWAePTGMl-rjKug',
    enabled: false,
  },
  {
    id: 'social-snapchat',
    platform: 'Snapchat',
    iconKey: 'snapchat',
    url: 'https://www.snapchat.com/@persiciofficial',
    enabled: false,
  },
  {
    id: 'social-pinterest',
    platform: 'Pinterest',
    iconKey: 'pinterest',
    url: 'https://www.pinterest.com/persiciofficial/',
    enabled: false,
  },
  {
    id: 'social-tiktok',
    platform: 'TikTok',
    iconKey: 'tiktok',
    url: 'https://www.tiktok.com/@persiciofficial',
    enabled: false,
  },
];

export const DEFAULT_COMMUNICATION_CONFIG: CommunicationSocialConfig = {
  websiteDomain: 'persiciagency.com',
  websiteUrl: 'https://persiciagency.com',
  infoEmail: 'info@persiciagency.com',
  supportEmail: 'support@persiciagency.com',
  hrEmail: 'hr@persiciagency.com',
  growthEmail: 'growth@persiciagency.com',
  partnersEmail: 'partners@persiciagency.com',
  pressEmail: 'press@persiciagency.com',
  primaryPhone: '+971 4 000 0000',
  whatsappNumber: '',
  socialLinks: DEFAULT_SOCIAL_LINKS,
  offices: contactPageData.offices,
  channels: contactPageData.channels,
};

export function normalizeCommunicationConfig(
  raw?: Partial<CommunicationSocialConfig> | null
): CommunicationSocialConfig {
  const src = raw || {};
  const str = (v: unknown, fallback: string) =>
    typeof v === 'string' && v.trim() ? v.trim() : fallback;

  const cleanDomain = str(src.websiteDomain, DEFAULT_COMMUNICATION_CONFIG.websiteDomain)
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim();

  const rawUrl = str(src.websiteUrl, `https://${cleanDomain}`);
  const websiteUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

  const rawSocials =
    Array.isArray(src.socialLinks) && src.socialLinks.length > 0
      ? src.socialLinks
      : DEFAULT_SOCIAL_LINKS;

  const socialLinks: CommunicationSocialLink[] = rawSocials.map((item, idx) => {
    const rec = item as Partial<CommunicationSocialLink> & { hidden?: boolean };
    const platform = str(rec.platform, `Social ${idx + 1}`);
    return {
      id: str(rec.id, `social-${idx + 1}`),
      platform,
      iconKey: inferSocialIconKey(platform, rec.iconKey),
      url: typeof rec.url === 'string' ? rec.url.trim() : '',
      enabled:
        rec.enabled !== undefined
          ? Boolean(rec.enabled)
          : rec.hidden !== undefined
          ? !rec.hidden
          : true,
    };
  });

  const offices: ContactOfficeItem[] =
    Array.isArray(src.offices) && src.offices.length > 0
      ? src.offices.map((ofc, idx) => {
          const defOfc = contactPageData.offices[idx] || contactPageData.offices[0];
          return {
            ...defOfc,
            ...ofc,
            id: str(ofc?.id, defOfc.id || `office-${idx + 1}`),
            city: { ...(defOfc.city || { en: '', ar: '' }), ...(ofc?.city || {}) },
            country: { ...(defOfc.country || { en: '', ar: '' }), ...(ofc?.country || {}) },
            badge: { ...(defOfc.badge || { en: '', ar: '' }), ...(ofc?.badge || {}) },
            address: { ...(defOfc.address || { en: '', ar: '' }), ...(ofc?.address || {}) },
            hours: { ...(defOfc.hours || { en: '', ar: '' }), ...(ofc?.hours || {}) },
            directionsLabel: {
              ...(defOfc.directionsLabel || { en: 'Get Directions', ar: 'الاتجاهات عبر خرائط جوجل' }),
              ...(ofc?.directionsLabel || {}),
            },
            email: str(ofc?.email, defOfc.email),
            phone: str(ofc?.phone, defOfc.phone),
            timezone: str(ofc?.timezone, defOfc.timezone),
            mapsUrl: str(ofc?.mapsUrl, defOfc.mapsUrl),
            image: str(ofc?.image, defOfc.image),
          };
        })
      : contactPageData.offices;

  const channels: ContactChannelItem[] =
    Array.isArray(src.channels) && src.channels.length > 0
      ? src.channels.map((ch, idx) => {
          const defCh = contactPageData.channels[idx] || contactPageData.channels[0];
          return {
            ...defCh,
            ...ch,
            id: str(ch?.id, defCh.id || `channel-${idx + 1}`),
            category: { ...(defCh.category || { en: '', ar: '' }), ...(ch?.category || {}) },
            title: { ...(defCh.title || { en: '', ar: '' }), ...(ch?.title || {}) },
            description: {
              ...(defCh.description || { en: '', ar: '' }),
              ...(ch?.description || {}),
            },
            sla: { ...(defCh.sla || { en: '', ar: '' }), ...(ch?.sla || {}) },
            email: str(ch?.email, defCh.email),
          };
        })
      : contactPageData.channels;

  return {
    websiteDomain: cleanDomain,
    websiteUrl,
    infoEmail: str(src.infoEmail, DEFAULT_COMMUNICATION_CONFIG.infoEmail),
    supportEmail: str(src.supportEmail, DEFAULT_COMMUNICATION_CONFIG.supportEmail),
    hrEmail: str(src.hrEmail, DEFAULT_COMMUNICATION_CONFIG.hrEmail),
    growthEmail: str(src.growthEmail, DEFAULT_COMMUNICATION_CONFIG.growthEmail),
    partnersEmail: str(src.partnersEmail, DEFAULT_COMMUNICATION_CONFIG.partnersEmail),
    pressEmail: str(src.pressEmail, DEFAULT_COMMUNICATION_CONFIG.pressEmail),
    primaryPhone: str(src.primaryPhone, DEFAULT_COMMUNICATION_CONFIG.primaryPhone),
    whatsappNumber: typeof src.whatsappNumber === 'string' ? src.whatsappNumber.trim() : '',
    socialLinks,
    offices,
    channels,
    ...(typeof src.updatedBy === 'string' ? { updatedBy: src.updatedBy } : {}),
    ...(typeof src.updatedAt === 'string' ? { updatedAt: src.updatedAt } : {}),
  };
}

/**
 * Replaces the domain portion (@oldDomain) of an email with @newDomain, preserving the local prefix.
 */
export function rewriteEmailDomain(email: string, nextDomain: string): string {
  const cleanDomain = nextDomain
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim();
  if (!cleanDomain) return email;
  const trimmed = (email || '').trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex > 0) {
    return `${trimmed.slice(0, atIndex)}@${cleanDomain}`;
  }
  return trimmed;
}
