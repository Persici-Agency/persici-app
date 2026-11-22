import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { revalidatePageContent } from '@/lib/revalidate';
import { contactPageData } from '@/app/[lang]/(site)/contact/_contact/data/contact.data';
import {
  DEFAULT_COMMUNICATION_CONFIG,
  inferSocialIconKey,
  normalizeCommunicationConfig,
  type CommunicationSocialConfig,
  type CommunicationSocialLink,
} from '@/lib/communication-types';

const SETTINGS_KEY = 'communication_social_config';

export async function getCommunicationConfigFromDb(): Promise<CommunicationSocialConfig> {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_COMMUNICATION_CONFIG;

    const doc = await db.collection(COLLECTIONS.SETTINGS).findOne({ key: SETTINGS_KEY });
    if (doc && doc.config && typeof doc.config === 'object') {
      return normalizeCommunicationConfig({
        ...(doc.config as Partial<CommunicationSocialConfig>),
        updatedBy: typeof doc.updatedBy === 'string' ? doc.updatedBy : undefined,
        updatedAt:
          doc.updatedAt instanceof Date
            ? doc.updatedAt.toISOString()
            : typeof doc.updatedAt === 'string'
            ? doc.updatedAt
            : undefined,
      });
    }

    // Bootstrap smoothly from any existing customized Contact / Careers / Footer navigation records
    const [contactDoc, careersDoc, footerDoc] = await Promise.all([
      db.collection(COLLECTIONS.PAGES).findOne({ page: 'contact' }),
      db.collection(COLLECTIONS.PAGES).findOne({ page: 'careers' }),
      db.collection(COLLECTIONS.NAVIGATION).findOne({ type: 'footer' }),
    ]);

    const seed: Partial<CommunicationSocialConfig> = {};
    if (Array.isArray(contactDoc?.offices) && contactDoc.offices.length > 0) {
      seed.offices = contactDoc.offices;
      const firstPhone = contactDoc.offices.find((o: { phone?: string }) => o?.phone)?.phone;
      if (firstPhone) seed.primaryPhone = String(firstPhone);
    }
    if (Array.isArray(contactDoc?.channels) && contactDoc.channels.length > 0) {
      seed.channels = contactDoc.channels;
      const growthCh = contactDoc.channels.find((c: { id?: string }) => c?.id === 'rfp');
      const partnersCh = contactDoc.channels.find((c: { id?: string }) => c?.id === 'partnerships');
      const hrCh = contactDoc.channels.find((c: { id?: string }) => c?.id === 'careers');
      const pressCh = contactDoc.channels.find((c: { id?: string }) => c?.id === 'press');
      if (growthCh?.email) seed.growthEmail = String(growthCh.email);
      if (partnersCh?.email) seed.partnersEmail = String(partnersCh.email);
      if (hrCh?.email) seed.hrEmail = String(hrCh.email);
      if (pressCh?.email) seed.pressEmail = String(pressCh.email);
    }
    if (careersDoc?.spontaneous?.email && !seed.hrEmail) {
      seed.hrEmail = String(careersDoc.spontaneous.email);
    }
    if (Array.isArray(footerDoc?.socialLinks) && footerDoc.socialLinks.length > 0) {
      seed.socialLinks = footerDoc.socialLinks.map(
        (s: { platform?: string; url?: string; enabled?: boolean; iconKey?: string }, idx: number): CommunicationSocialLink => {
          const platform = String(s?.platform || `Social ${idx + 1}`);
          return {
            id: `social-boot-${idx + 1}`,
            platform,
            iconKey: inferSocialIconKey(platform, s?.iconKey),
            url: String(s?.url || ''),
            enabled: s?.enabled !== false,
          };
        }
      );
    }

    return normalizeCommunicationConfig(seed);
  } catch (err) {
    console.warn('[communication-server] getCommunicationConfigFromDb fallback:', err);
    return DEFAULT_COMMUNICATION_CONFIG;
  }
}

export async function saveCommunicationConfigToDb(
  input: Partial<CommunicationSocialConfig>,
  updatedBy = 'admin'
): Promise<{ success: boolean; config?: CommunicationSocialConfig; error?: string }> {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database unavailable' };
    }

    const normalized = normalizeCommunicationConfig(input);
    const now = new Date();

    await db.collection(COLLECTIONS.SETTINGS).updateOne(
      { key: SETTINGS_KEY },
      {
        $set: {
          key: SETTINGS_KEY,
          config: normalized,
          updatedBy,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    // Sync downstream collections so Contact page, Careers page, and Footer navigation stay consistent
    const [existingContact, existingFooter] = await Promise.all([
      db.collection(COLLECTIONS.PAGES).findOne({ page: 'contact' }),
      db.collection(COLLECTIONS.NAVIGATION).findOne({ type: 'footer' }),
    ]);

    if (existingContact) {
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: 'contact' },
        {
          $set: {
            offices: normalized.offices,
            channels: normalized.channels,
            updatedAt: now,
          },
        }
      );
    } else {
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: 'contact' },
        {
          $set: {
            ...contactPageData,
            page: 'contact',
            offices: normalized.offices,
            channels: normalized.channels,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }

    await db.collection(COLLECTIONS.PAGES).updateOne(
      { page: 'careers' },
      {
        $set: {
          'spontaneous.email': normalized.hrEmail,
          updatedAt: now,
        },
      }
    );

    const syncedHubs = normalized.offices.map((ofc) => ({
      city: ofc.city,
      address: ofc.address,
      phone: ofc.phone,
    }));
    const syncedSocials = normalized.socialLinks.map((s) => ({
      id: s.id,
      platform: s.platform,
      iconKey: s.iconKey,
      url: s.url,
      enabled: s.enabled,
    }));

    if (existingFooter) {
      await db.collection(COLLECTIONS.NAVIGATION).updateOne(
        { type: 'footer' },
        {
          $set: {
            hubs: syncedHubs,
            socialLinks: syncedSocials,
            updatedBy,
            updatedAt: now,
          },
        }
      );
    } else {
      await db.collection(COLLECTIONS.NAVIGATION).updateOne(
        { type: 'footer' },
        {
          $set: {
            type: 'footer',
            hubs: syncedHubs,
            socialLinks: syncedSocials,
            updatedBy,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }

    // Revalidate layout + affected pages across all locales
    revalidatePageContent();
    revalidatePageContent('contact');
    revalidatePageContent('careers');

    return {
      success: true,
      config: {
        ...normalized,
        updatedBy,
        updatedAt: now.toISOString(),
      },
    };
  } catch (err) {
    console.error('[communication-server] saveCommunicationConfigToDb error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save communication config',
    };
  }
}
