'use client';

import { useEffect } from 'react';

// Run immediately upon client-side module evaluation, before React hydration
if (typeof window !== 'undefined' && typeof Element !== 'undefined') {
  try {
    const origSetAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name: string, val: string) {
      if (
        name === 'bis_skin_checked' ||
        name === 'bis_register' ||
        name === 'bis_frame_id'
      ) {
        return;
      }
      return origSetAttr.apply(this, arguments as any);
    };

    const cleanAttr = (el: Element | null) => {
      if (!el || !el.removeAttribute) return;
      el.removeAttribute('bis_skin_checked');
      el.removeAttribute('bis_register');
      el.removeAttribute('bis_frame_id');
    };

    const cleanAll = () => {
      if (typeof document === 'undefined') return;
      const els = document.querySelectorAll(
        '[bis_skin_checked],[bis_register],[bis_frame_id]'
      );
      for (let i = 0; i < els.length; i++) {
        cleanAttr(els[i]);
      }
    };

    cleanAll();
  } catch (e) {}
}

export function ExtensionCleaner() {
  useEffect(() => {
    try {
      const cleanAttr = (el: Element | null) => {
        if (!el || !el.removeAttribute) return;
        el.removeAttribute('bis_skin_checked');
        el.removeAttribute('bis_register');
        el.removeAttribute('bis_frame_id');
      };

      const cleanAll = () => {
        const els = document.querySelectorAll(
          '[bis_skin_checked],[bis_register],[bis_frame_id]'
        );
        for (let i = 0; i < els.length; i++) {
          cleanAttr(els[i]);
        }
      };

      cleanAll();

      if (
        typeof MutationObserver !== 'undefined' &&
        document.documentElement
      ) {
        const observer = new MutationObserver((mutations) => {
          for (let i = 0; i < mutations.length; i++) {
            const m = mutations[i];
            if (m.type === 'attributes') {
              cleanAttr(m.target as Element);
            } else if (m.type === 'childList') {
              for (let j = 0; j < m.addedNodes.length; j++) {
                const node = m.addedNodes[j];
                if (node.nodeType === 1) {
                  const el = node as Element;
                  cleanAttr(el);
                  if (el.querySelectorAll) {
                    const descendants = el.querySelectorAll(
                      '[bis_skin_checked],[bis_register],[bis_frame_id]'
                    );
                    for (let k = 0; k < descendants.length; k++) {
                      cleanAttr(descendants[k]);
                    }
                  }
                }
              }
            }
          }
        });

        observer.observe(document.documentElement, {
          attributes: true,
          subtree: true,
          childList: true,
          attributeFilter: ['bis_skin_checked', 'bis_register', 'bis_frame_id'],
        });

        return () => {
          observer.disconnect();
        };
      }
    } catch (e) {}
  }, []);

  return null;
}
