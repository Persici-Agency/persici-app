import type { LeadAttributionData } from '@/lib/tracking-types';

const ATTRIBUTION_STORAGE_KEY = 'persici_lead_attribution_v1';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      page?: () => void;
      track?: (event: string, params?: Record<string, unknown>) => void;
    };
    snaptr?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
    twq?: (...args: unknown[]) => void;
  }
}

/**
 * Captures URL UTM parameters, ad click IDs (gclid, fbclid, ttclid, etc.),
 * referrer, and initial landing page into sessionStorage.
 */
export function captureVisitorAttribution(): LeadAttributionData {
  if (typeof window === 'undefined') return {};

  try {
    const existingRaw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const existing: LeadAttributionData = existingRaw
      ? JSON.parse(existingRaw)
      : {};

    const params = new URLSearchParams(window.location.search);

    const updated: LeadAttributionData = {
      utmSource:
        params.get('utm_source') || existing.utmSource || undefined,
      utmMedium:
        params.get('utm_medium') || existing.utmMedium || undefined,
      utmCampaign:
        params.get('utm_campaign') || existing.utmCampaign || undefined,
      utmTerm: params.get('utm_term') || existing.utmTerm || undefined,
      utmContent:
        params.get('utm_content') || existing.utmContent || undefined,
      gclid: params.get('gclid') || existing.gclid || undefined,
      fbclid: params.get('fbclid') || existing.fbclid || undefined,
      ttclid: params.get('ttclid') || existing.ttclid || undefined,
      liFatId: params.get('li_fat_id') || existing.liFatId || undefined,
      twclid: params.get('twclid') || existing.twclid || undefined,
      sccid:
        params.get('ScCid') ||
        params.get('sccid') ||
        existing.sccid ||
        undefined,
      referrer:
        existing.referrer ||
        (document.referrer &&
        !document.referrer.includes(window.location.hostname)
          ? document.referrer
          : undefined),
      landingPage:
        existing.landingPage ||
        `${window.location.pathname}${window.location.search}`,
    };

    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return {};
  }
}

/**
 * Returns the visitor's stored UTM & click-ID attribution data for form submission payloads.
 */
export function getStoredAttribution(): LeadAttributionData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as LeadAttributionData;
    }
    return captureVisitorAttribution();
  } catch {
    return {};
  }
}

/**
 * Dispatches conversion events to all active tracking pixels (GTM dataLayer, GA4 gtag,
 * Meta Pixel, TikTok Pixel, Snapchat Pixel, LinkedIn Insight, X Pixel).
 */
export function trackLeadConversion(
  leadType: 'contact' | 'appointment' | 'discovery',
  metadata: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return;

  const attribution = getStoredAttribution();
  const payload = {
    lead_type: leadType,
    page_path: window.location.pathname,
    utm_source: attribution.utmSource || 'direct',
    utm_medium: attribution.utmMedium || 'none',
    utm_campaign: attribution.utmCampaign || 'none',
    ...metadata,
  };

  try {
    // 1. Google Tag Manager (dataLayer)
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'persici_lead_submission',
        event_category: 'lead_generation',
        ...payload,
      });
    }

    // 2. Google Analytics 4 (gtag)
    if (typeof window.gtag === 'function') {
      const gaEventName =
        leadType === 'appointment'
          ? 'schedule_appointment'
          : leadType === 'discovery'
            ? 'request_discovery'
            : 'generate_lead';

      window.gtag('event', gaEventName, {
        event_category: 'engagement',
        event_label: leadType,
        ...payload,
      });

      // Also fire standard GA4 generate_lead if it was appointment/discovery
      if (gaEventName !== 'generate_lead') {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: leadType,
          ...payload,
        });
      }
    }

    // 3. Meta (Facebook) Pixel
    if (typeof window.fbq === 'function') {
      const metaEvent = leadType === 'appointment' ? 'Schedule' : 'Lead';
      window.fbq('track', metaEvent, {
        content_name: `Persici ${leadType} submission`,
        content_category: leadType,
        ...metadata,
      });
    }

    // 4. TikTok Pixel
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('SubmitForm', {
        content_name: `Persici ${leadType}`,
        ...metadata,
      });
    }

    // 5. Snapchat Pixel
    if (typeof window.snaptr === 'function') {
      window.snaptr('track', 'SIGN_UP', {
        sign_up_method: leadType,
      });
    }

    // 6. LinkedIn Insight Tag
    if (typeof window.lintrk === 'function') {
      window.lintrk('track');
    }
  } catch (err) {
    console.warn('[trackLeadConversion] Non-blocking pixel dispatch notice:', err);
  }
}
