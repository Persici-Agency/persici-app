import type { Metadata } from 'next';
import { lexendDeca, roboto, robotoMono, cairo, tajawal } from './_lib/fonts';
import { localeDirection } from './_lib/i18n';
import type { Locale } from './_lib/i18n';
import { hasLocale } from './dictionaries';
import { notFound } from 'next/navigation';
import './globals.css';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export const metadata: Metadata = {
  title: {
    default: 'Persici — Digital Agency',
    template: '%s | Persici',
  },
  description:
    'Persici is a digital agency specializing in strategy, design, engineering, and digital transformation.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dir = localeDirection[lang as Locale] || 'ltr';

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${lexendDeca.variable} ${roboto.variable} ${robotoMono.variable} ${cairo.variable} ${tajawal.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var origSetAttr = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, val) {
                    if (name === 'bis_skin_checked' || name === 'bis_register' || name === 'bis_frame_id') return;
                    return origSetAttr.apply(this, arguments);
                  };
                  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined' && document.documentElement) {
                    var cleanAttr = function(el) {
                      if (!el || !el.removeAttribute) return;
                      el.removeAttribute('bis_skin_checked');
                      el.removeAttribute('bis_register');
                      el.removeAttribute('bis_frame_id');
                    };
                    var observer = new MutationObserver(function(mutations) {
                      for (var i = 0; i < mutations.length; i++) {
                        var m = mutations[i];
                        if (m.type === 'attributes') {
                          cleanAttr(m.target);
                        } else if (m.type === 'childList') {
                          for (var j = 0; j < m.addedNodes.length; j++) {
                            var node = m.addedNodes[j];
                            if (node.nodeType === 1) {
                              cleanAttr(node);
                              var descendants = node.querySelectorAll ? node.querySelectorAll('[bis_skin_checked],[bis_register],[bis_frame_id]') : [];
                              for (var k = 0; k < descendants.length; k++) {
                                cleanAttr(descendants[k]);
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
                      attributeFilter: ['bis_skin_checked', 'bis_register', 'bis_frame_id']
                    });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
