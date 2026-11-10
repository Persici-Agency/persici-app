'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type {
  TrackingConfig,
  CustomCodeSnippet,
} from '@/lib/tracking-types';
import { captureVisitorAttribution } from '@/lib/tracking-events';

export interface SiteTrackingInjectorProps {
  config: TrackingConfig;
  position: 'body_top' | 'body_bottom';
  lang: string;
}

/**
 * Checks whether a CustomCodeSnippet should be active on the current pathname.
 */
function doesSnippetMatchPath(
  snippet: CustomCodeSnippet,
  pathname: string,
  lang: string
): boolean {
  if (!snippet.enabled || !snippet.code || !snippet.code.trim()) {
    return false;
  }

  // Strip locale prefix (/en or /ar) to normalize path matching
  const normalizedPath =
    pathname === `/${lang}` || pathname === `/${lang}/`
      ? '/'
      : pathname.startsWith(`/${lang}/`)
        ? pathname.slice(lang.length + 1)
        : pathname || '/';

  if (snippet.scope === 'all_public') {
    return true;
  }

  if (snippet.scope === 'homepage_only') {
    return normalizedPath === '/';
  }

  if (snippet.scope === 'custom_paths') {
    if (!Array.isArray(snippet.targetPaths) || snippet.targetPaths.length === 0) {
      return true;
    }
    return snippet.targetPaths.some((rawTarget) => {
      const target = rawTarget.trim();
      if (!target) return false;
      const cleanTarget = target.startsWith('/') ? target : `/${target}`;
      if (cleanTarget.endsWith('*')) {
        const prefix = cleanTarget.slice(0, -1);
        return (
          normalizedPath.startsWith(prefix) || pathname.startsWith(prefix)
        );
      }
      return (
        normalizedPath === cleanTarget ||
        normalizedPath === `${cleanTarget}/` ||
        pathname === cleanTarget
      );
    });
  }

  return true;
}

/**
 * Injects a snippet (HTML or JavaScript) into a target DOM element (e.g. document.head or a body container),
 * ensuring <script> tags (both inline and external src) are genuinely executed by the browser.
 */
function injectSnippetDomNodes(
  snippet: CustomCodeSnippet,
  targetContainer: HTMLElement,
  mode: 'prepend' | 'append'
): HTMLElement[] {
  const createdNodes: HTMLElement[] = [];
  const rawCode = snippet.code.trim();
  if (!rawCode) return createdNodes;

  const markerAttr = `data-persici-snippet-${snippet.id}`;

  // Avoid duplicate injection if already present in targetContainer
  if (targetContainer.querySelector(`[${markerAttr}]`)) {
    return createdNodes;
  }

  // Case 1: Pure JavaScript snippet (or JS wrapped in <script> tags)
  const hasHtmlTags = /<\s*(script|noscript|meta|link|style|div|iframe|img)\b/i.test(
    rawCode
  );

  if (snippet.codeType === 'javascript' && !hasHtmlTags) {
    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.setAttribute(markerAttr, 'true');
    scriptEl.setAttribute('data-snippet-name', snippet.name);
    scriptEl.text = rawCode;

    if (mode === 'prepend' && targetContainer.firstChild) {
      targetContainer.insertBefore(scriptEl, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(scriptEl);
    }
    createdNodes.push(scriptEl);
    return createdNodes;
  }

  // Case 2: HTML snippet (may contain <script>, <meta>, <link>, <style>, <noscript>, etc.)
  const template = document.createElement('template');
  template.innerHTML = rawCode;

  const nodesToInsert = Array.from(template.content.childNodes);

  // If mode is prepend, reverse order when inserting before firstChild so original sequence is preserved
  const orderedNodes =
    mode === 'prepend' ? [...nodesToInsert].reverse() : nodesToInsert;

  for (const node of orderedNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      let nodeToMount: HTMLElement;

      if (el.tagName.toLowerCase() === 'script') {
        const executableScript = document.createElement('script');
        // Copy all attributes (src, async, defer, type, id, crossOrigin, etc.)
        Array.from(el.attributes).forEach((attr) => {
          executableScript.setAttribute(attr.name, attr.value);
        });
        if (el.textContent) {
          executableScript.text = el.textContent;
        }
        nodeToMount = executableScript;
      } else {
        nodeToMount = el.cloneNode(true) as HTMLElement;
      }

      nodeToMount.setAttribute(markerAttr, 'true');
      nodeToMount.setAttribute('data-snippet-name', snippet.name);

      if (mode === 'prepend' && targetContainer.firstChild) {
        targetContainer.insertBefore(nodeToMount, targetContainer.firstChild);
      } else {
        targetContainer.appendChild(nodeToMount);
      }
      createdNodes.push(nodeToMount);
    }
  }

  return createdNodes;
}

/**
 * Renders and manages all storefront tracking integrations:
 * - position="body_top": Mounted as the very first child inside <body>.
 *   Also manages <head> top (head_top) and <head> bottom (head_bottom) injections,
 *   GTM, GA4, native pixels, UTM capture, and SPA route change pageviews.
 * - position="body_bottom": Mounted as the very last child inside <body> (Footer / before </body>).
 */
function SiteTrackingInjectorInner({
  config,
  position,
  lang,
}: SiteTrackingInjectorProps) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const bodyContainerRef = useRef<HTMLDivElement | null>(null);
  const lastTrackedUrlRef = useRef<string>('');

  // 1. Capture UTM & Click-ID attribution and fire SPA pageviews (only run in 'body_top' instance)
  useEffect(() => {
    if (position !== 'body_top') return;

    captureVisitorAttribution();

    const searchStr = searchParams?.toString() || '';
    const fullUrl = searchStr ? `${pathname}?${searchStr}` : pathname;

    // Avoid firing duplicate pageviews for the exact same URL
    if (lastTrackedUrlRef.current === fullUrl) return;
    const isInitialLoad = lastTrackedUrlRef.current === '';
    lastTrackedUrlRef.current = fullUrl;

    // On subsequent SPA navigations, dispatch virtual pageviews
    if (!isInitialLoad) {
      try {
        if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push({
            event: 'persici_virtual_pageview',
            page_path: fullUrl,
            page_title: document.title,
          });
        }
        if (
          config.ga4.enabled &&
          config.ga4.measurementId &&
          config.ga4.sendPageViews &&
          typeof window.gtag === 'function'
        ) {
          window.gtag('event', 'page_view', {
            page_path: fullUrl,
            page_title: document.title,
            send_to: config.ga4.measurementId,
          });
        }
        if (
          config.pixels.meta.enabled &&
          config.pixels.meta.pixelId &&
          typeof window.fbq === 'function'
        ) {
          window.fbq('track', 'PageView');
        }
        if (
          config.pixels.tiktok.enabled &&
          config.pixels.tiktok.pixelId &&
          window.ttq &&
          typeof window.ttq.page === 'function'
        ) {
          window.ttq.page();
        }
        if (
          config.pixels.snapchat.enabled &&
          config.pixels.snapchat.pixelId &&
          typeof window.snaptr === 'function'
        ) {
          window.snaptr('track', 'PAGE_VIEW');
        }
      } catch {
        // Ignore non-critical tracking errors
      }
    }
  }, [position, pathname, searchParams, config]);

  // 2. Inject GTM, GA4, Native Pixels, and Custom Head Snippets (head_top & head_bottom)
  useEffect(() => {
    if (position !== 'body_top' || typeof document === 'undefined') return;

    const head = document.head;
    const cleanupNodes: HTMLElement[] = [];

    // A. Google Tag Manager (GTM) — Injected at TOP of <head>
    if (config.gtm.enabled && config.gtm.containerId) {
      const gtmId = config.gtm.containerId.trim();
      const dlName = config.gtm.dataLayerName || 'dataLayer';
      const domain =
        config.gtm.customScriptDomain || 'https://www.googletagmanager.com';
      const envParams =
        config.gtm.environmentAuth && config.gtm.environmentPreview
          ? `&gtm_auth=${encodeURIComponent(config.gtm.environmentAuth)}&gtm_preview=${encodeURIComponent(config.gtm.environmentPreview)}&gtm_cookies_win=x`
          : '';

      if (!head.querySelector('[data-persici-gtm-head]')) {
        const gtmScript = document.createElement('script');
        gtmScript.setAttribute('data-persici-gtm-head', gtmId);
        gtmScript.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='${domain}/gtm.js?id='+i+dl+'${envParams}';f.parentNode.insertBefore(j,f);})(window,document,'script','${dlName}','${gtmId}');`;
        if (head.firstChild) {
          head.insertBefore(gtmScript, head.firstChild);
        } else {
          head.appendChild(gtmScript);
        }
      }
    }

    // B. Google Analytics 4 (GA4) & Google Ads (gtag.js)
    const ga4Active = Boolean(config.ga4.enabled && config.ga4.measurementId);
    const gAdsActive = Boolean(
      config.pixels.googleAds.enabled && config.pixels.googleAds.conversionId
    );
    const primaryGtagId = ga4Active
      ? config.ga4.measurementId
      : gAdsActive
        ? config.pixels.googleAds.conversionId
        : '';

    if (primaryGtagId && !head.querySelector('[data-persici-gtag-loader]')) {
      const gtagSrc = document.createElement('script');
      gtagSrc.async = true;
      gtagSrc.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryGtagId)}`;
      gtagSrc.setAttribute('data-persici-gtag-loader', primaryGtagId);
      head.appendChild(gtagSrc);

      const gtagInit = document.createElement('script');
      gtagInit.setAttribute('data-persici-gtag-init', 'true');
      const lines: string[] = [
        `window.dataLayer = window.dataLayer || [];`,
        `function gtag(){dataLayer.push(arguments);}`,
        `window.gtag = gtag;`,
        `gtag('js', new Date());`,
      ];

      if (ga4Active) {
        const gaOpts = JSON.stringify({
          send_page_view: config.ga4.sendPageViews,
          anonymize_ip: config.ga4.anonymizeIp,
          ...(config.ga4.debugMode ? { debug_mode: true } : {}),
        });
        lines.push(
          `gtag('config', '${config.ga4.measurementId.replace(/'/g, '')}', ${gaOpts});`
        );
      }

      if (gAdsActive) {
        lines.push(
          `gtag('config', '${config.pixels.googleAds.conversionId.replace(/'/g, '')}');`
        );
      }

      gtagInit.text = lines.join('\n');
      head.appendChild(gtagInit);
    }

    // C. Meta (Facebook) Pixel
    if (
      config.pixels.meta.enabled &&
      config.pixels.meta.pixelId &&
      !head.querySelector('[data-persici-meta-pixel]')
    ) {
      const fbPixelId = config.pixels.meta.pixelId.replace(/[^0-9a-zA-Z_-]/g, '');
      const fbScript = document.createElement('script');
      fbScript.setAttribute('data-persici-meta-pixel', fbPixelId);
      fbScript.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${fbPixelId}');fbq('track', 'PageView');`;
      head.appendChild(fbScript);
    }

    // D. TikTok Pixel
    if (
      config.pixels.tiktok.enabled &&
      config.pixels.tiktok.pixelId &&
      !head.querySelector('[data-persici-tiktok-pixel]')
    ) {
      const ttId = config.pixels.tiktok.pixelId.replace(/[^0-9a-zA-Z_-]/g, '');
      const ttScript = document.createElement('script');
      ttScript.setAttribute('data-persici-tiktok-pixel', ttId);
      ttScript.text = `!function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${ttId}');ttq.page();}(window, document, 'ttq');`;
      head.appendChild(ttScript);
    }

    // E. Snapchat Pixel
    if (
      config.pixels.snapchat.enabled &&
      config.pixels.snapchat.pixelId &&
      !head.querySelector('[data-persici-snap-pixel]')
    ) {
      const snapId = config.pixels.snapchat.pixelId.replace(
        /[^0-9a-zA-Z_-]/g,
        ''
      );
      const snapScript = document.createElement('script');
      snapScript.setAttribute('data-persici-snap-pixel', snapId);
      snapScript.text = `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init', '${snapId}');snaptr('track', 'PAGE_VIEW');`;
      head.appendChild(snapScript);
    }

    // F. LinkedIn Insight Tag
    if (
      config.pixels.linkedin.enabled &&
      config.pixels.linkedin.partnerId &&
      !head.querySelector('[data-persici-linkedin-pixel]')
    ) {
      const partnerId = config.pixels.linkedin.partnerId.replace(
        /[^0-9a-zA-Z_-]/g,
        ''
      );
      const liScript = document.createElement('script');
      liScript.setAttribute('data-persici-linkedin-pixel', partnerId);
      liScript.text = `_linkedin_partner_id = "${partnerId}";window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l) {if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s = document.getElementsByTagName("script")[0];var b = document.createElement("script");b.type = "text/javascript";b.async = true;b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b, s);})(window.lintrk);`;
      head.appendChild(liScript);
    }

    // G. X (Twitter) Pixel
    if (
      config.pixels.x.enabled &&
      config.pixels.x.pixelId &&
      !head.querySelector('[data-persici-x-pixel]')
    ) {
      const xId = config.pixels.x.pixelId.replace(/[^0-9a-zA-Z_-]/g, '');
      const xScript = document.createElement('script');
      xScript.setAttribute('data-persici-x-pixel', xId);
      xScript.text = `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${xId}');`;
      head.appendChild(xScript);
    }

    // H. Microsoft Clarity & Hotjar
    if (
      config.pixels.behavior.clarityEnabled &&
      config.pixels.behavior.clarityProjectId &&
      !head.querySelector('[data-persici-clarity]')
    ) {
      const clarityId = config.pixels.behavior.clarityProjectId.replace(
        /[^0-9a-zA-Z_-]/g,
        ''
      );
      const clarityScript = document.createElement('script');
      clarityScript.setAttribute('data-persici-clarity', clarityId);
      clarityScript.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`;
      head.appendChild(clarityScript);
    }

    if (
      config.pixels.behavior.hotjarEnabled &&
      config.pixels.behavior.hotjarSiteId &&
      !head.querySelector('[data-persici-hotjar]')
    ) {
      const hjId = config.pixels.behavior.hotjarSiteId.replace(/[^0-9]/g, '');
      if (hjId) {
        const hjScript = document.createElement('script');
        hjScript.setAttribute('data-persici-hotjar', hjId);
        hjScript.text = `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hjId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
        head.appendChild(hjScript);
      }
    }

    // I. Custom Snippets targeting head_top and head_bottom
    const headTopSnippets = config.customSnippets
      .filter(
        (s) =>
          s.placement === 'head_top' && doesSnippetMatchPath(s, pathname, lang)
      )
      .sort((a, b) => a.priority - b.priority);

    const headBottomSnippets = config.customSnippets
      .filter(
        (s) =>
          s.placement === 'head_bottom' &&
          doesSnippetMatchPath(s, pathname, lang)
      )
      .sort((a, b) => a.priority - b.priority);

    // Prepend head_top snippets in reverse order so priority 1 stays at the very top
    for (const snippet of [...headTopSnippets].reverse()) {
      const inserted = injectSnippetDomNodes(snippet, head, 'prepend');
      if (snippet.scope !== 'all_public') {
        cleanupNodes.push(...inserted);
      }
    }

    for (const snippet of headBottomSnippets) {
      const inserted = injectSnippetDomNodes(snippet, head, 'append');
      if (snippet.scope !== 'all_public') {
        cleanupNodes.push(...inserted);
      }
    }

    return () => {
      cleanupNodes.forEach((node) => {
        try {
          node.remove();
        } catch {}
      });
    };
  }, [position, config, pathname, lang]);

  // 3. Inject Custom Snippets targeting body_top or body_bottom
  useEffect(() => {
    const container = bodyContainerRef.current;
    if (!container) return;

    const matchingBodySnippets = config.customSnippets
      .filter(
        (s) =>
          s.placement === position && doesSnippetMatchPath(s, pathname, lang)
      )
      .sort((a, b) => a.priority - b.priority);

    const cleanupNodes: HTMLElement[] = [];

    for (const snippet of matchingBodySnippets) {
      const inserted = injectSnippetDomNodes(snippet, container, 'append');
      cleanupNodes.push(...inserted);
    }

    return () => {
      cleanupNodes.forEach((node) => {
        try {
          node.remove();
        } catch {}
      });
    };
  }, [position, config.customSnippets, pathname, lang]);

  const gtmDomain =
    config.gtm.customScriptDomain || 'https://www.googletagmanager.com';

  return (
    <div
      ref={bodyContainerRef}
      data-persici-tracking-slot={position}
      style={{ display: 'contents' }}
      suppressHydrationWarning
    >
      {/* Server-rendered GTM <noscript> immediately after opening <body> tag */}
      {position === 'body_top' &&
        config.gtm.enabled &&
        config.gtm.containerId && (
          <noscript>
            <iframe
              src={`${gtmDomain}/ns.html?id=${encodeURIComponent(config.gtm.containerId)}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="gtm-noscript"
            />
          </noscript>
        )}

      {/* Server-rendered Meta Pixel <noscript> fallback */}
      {position === 'body_top' &&
        config.pixels.meta.enabled &&
        config.pixels.meta.pixelId && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(config.pixels.meta.pixelId)}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

      {/* Server-rendered LinkedIn <noscript> fallback */}
      {position === 'body_bottom' &&
        config.pixels.linkedin.enabled &&
        config.pixels.linkedin.partnerId && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://px.ads.linkedin.com/collect/?pid=${encodeURIComponent(config.pixels.linkedin.partnerId)}&fmt=gif`}
            />
          </noscript>
        )}
    </div>
  );
}

export function SiteTrackingInjector(props: SiteTrackingInjectorProps) {
  return (
    <Suspense fallback={null}>
      <SiteTrackingInjectorInner {...props} />
    </Suspense>
  );
}

