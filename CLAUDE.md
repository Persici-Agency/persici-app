@AGENTS.md

# Persici Engineering Standards & Agent Master Reference

> **MANDATORY FOR ALL AGENTS & CONVERSATIONS**:  
> Before writing code or making modifications, read and adhere strictly to the engineering rules, design tokens, component architecture, and quality gates defined in [`.doc/instructions.md`](file:///i:/Projects/persici-app/.doc/instructions.md).

---

## 1. Quick Technical Stack Reference
- **Framework**: Next.js 16.3.1 (Turbopack, App Router) with React 19.2.8.
- **Styling**: Tailwind CSS v4 (`@theme inline` in `app/globals.css`).
- **Database**: MongoDB Atlas (`lib/mongodb.ts`) with cached connections and static fallbacks in `data.ts`.
- **Media & Storage**: Cloudflare R2 bucket `persici-media` via `@aws-sdk/client-s3` (`lib/storage.ts`).
  - Public CDN base URL: `https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev`.
  - Compression: Sharp (v0.35.3) WebP (`quality: 80-85`, `effort: 6`).
- **Internationalization (i18n)**: Fully bilingual English (`en`, LTR) and Arabic (`ar`, RTL) via `proxy.ts`.
  - Headings auto-switch to `Cairo` font and body to `Tajawal` under `html[lang="ar"]`.
- **Email Infrastructure**: Hostinger SMTP/IMAP (`lib/email/email.service.ts`).

---

## 2. Core Architectural Invariants & Rules

1. **Async Route Parameters (Next.js 16)**:
   - Always await route params: `const { lang, slug } = await params;`.
2. **Server-to-Client Component Boundary Serialization**:
   - Never pass function event handlers (e.g. `onError`, `onClick`) inside React element props from Server Components into Client Components (`FadeUp`, etc.). Keep element props purely serializable to avoid fatal prerender build errors.
3. **Always Check `@shared` First**:
   - Reusable components live strictly in `app/[lang]/(site)/_shared/components/` and are re-exported via `@shared`.
   - Never create duplicate one-off cards, accordions, or carousels in feature directories.
4. **Responsive Breadcrumb Standard**:
   - Breadcrumb navigation on all pages must use `flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-xs text-foreground/60`.
5. **Advantage / Feature Banners Standard**:
   - All feature banner / "Advantage" sections across all pages must contain **strictly 3 features** (never 4), matching the published design benchmark.
6. **Global Site Metadata Standard**:
   - Default title must include a dash after `Persici`:
     - English: `"Persici - Specialized in AI and Digital Transformation"`
     - Arabic: `"بيرسيشي - متخصصة في الذكاء الاصطناعي والتحول الرقمي"`
7. **Floating Header & Navigation Hierarchy**:
   - **Language Switcher**: Positioned in the header navbar directly beside the "Book a Call" CTA button (borderless, outline-free, with `TbGlobe`, displaying `AR` in English mode and `EN` in Arabic mode).
   - **Desktop Menu**: Centered in the navbar pill; compact padding on small laptops (1024px) to prevent multi-line wrapping.
   - **Tablet Breakpoint**: Mobile drawer activates starting at tablet view (`< lg`, below 1024px / 768px down).
   - **Header Transparency**: Transparent at the top of the page; transitions to solid white on scroll (`mobileMenuOpen || isScrolled`).
   - **Mobile Drawer**: Solid white background (`bg-white`); accordion trailing arrows are placed immediately beside label text (`gap-1.5`).
8. **Contact Section Responsive Reversal**:
   - Below 1024px (`< lg`), the contact section layout reverses so the inquiry form appears first (`order-1 lg:order-2`), and the trust block ("Ready to learn more?" + swiper) appears underneath (`order-2 lg:order-1`).
9. **Canonical 15-Client Logos Sequence**:
   - 1. Accor Live Limitless &rarr; 2. Mashreq &rarr; 3. Land of Exotics &rarr; 4. Hadiya &rarr; 5. Lahfaa &rarr; 6. Hala Food &rarr; 7. Metal Fuze &rarr; 8. Khazan &rarr; 9. The Harmony &rarr; 10. Protes &rarr; 11. Meraas &rarr; 12. Alhokair Holding &rarr; 13. 7awi &rarr; 14. Hokair Group &rarr; 15. Vayron.
   - Compressed to WebP (120px height, q85, effort 6, trimmed transparent borders) and served from Cloudflare R2 `clients/`.
10. **Growth Services Platform Order**:
    - Service 1 ("Technology & AI Digital Transformation"): **Python** is first, followed by Next.js, React, Flutter, Angular (replacing React Native), Node.js, PHP (Laravel), WordPress, AWS, Docker, GCP, MongoDB, Figma, OpenAI API.
    - Platform vector icons (Salesforce, Adobe, Canva, Python) are mirrored locally and on Cloudflare R2, with resilient React Icon fallbacks.

---

## 3. Master Documentation Directory (`.doc/`)

Consult the authoritative master documentation in `.doc/` for in-depth specifications:

| Master Reference File | Scope & Authority |
| :--- | :--- |
| [`.doc/instructions.md`](file:///i:/Projects/persici-app/.doc/instructions.md) | Master coding standards, component architecture, styling tokens & verification gates. |
| [`.doc/reference-home-navbar-core-architecture.md`](file:///i:/Projects/persici-app/.doc/reference-home-navbar-core-architecture.md) | Global header, floating navbar, luminance engine, homepage sections & footer. |
| [`.doc/reference-media-and-r2-asset-pipeline.md`](file:///i:/Projects/persici-app/.doc/reference-media-and-r2-asset-pipeline.md) | Cloudflare R2 object storage, Sharp WebP compression, platform icons & client logos. |
| [`.doc/reference-solutions-pages-reference.md`](file:///i:/Projects/persici-app/.doc/reference-solutions-pages-reference.md) | Solutions Hub (`/solutions`) & 9 dedicated Solution Feature Pages (`/solutions/[slug]`). |
| [`.doc/reference-industries-architecture-knowledge.md`](file:///i:/Projects/persici-app/.doc/reference-industries-architecture-knowledge.md) | Industries Hub (`/industries`) & 6 dedicated Industry Feature Pages (`/industries/[slug]`). |
| [`.doc/reference-how-we-do-it-pages-reference.md`](file:///i:/Projects/persici-app/.doc/reference-how-we-do-it-pages-reference.md) | How We Do It Hub (`/how-we-do-it`) & 5 dedicated Methodology Subpages (`/how-we-do-it/[slug]`). |
| [`.doc/reference-client-stories-architecture.md`](file:///i:/Projects/persici-app/.doc/reference-client-stories-architecture.md) | Client Stories Hub (`/client-stories`), showcase templates, video modal & metrics. |
| [`.doc/reference-insights-and-ai-overview-architecture.md`](file:///i:/Projects/persici-app/.doc/reference-insights-and-ai-overview-architecture.md) | Insights Hub (`/insights`), detail pages, scrollspy rail & Gemini 2.5 Flash AI overview. |
| [`.doc/reference-careers-and-recruitment-architecture.md`](file:///i:/Projects/persici-app/.doc/reference-careers-and-recruitment-architecture.md) | Careers Hub (`/careers`), job detail pages, application dossier form & R2 CV uploads. |
| [`.doc/reference-contact-and-email-system.md`](file:///i:/Projects/persici-app/.doc/reference-contact-and-email-system.md) | Contact Us (`/contact`), global growth hubs, appointment pop-up & Hostinger mail. |
| [`.doc/reference-dashboard-and-cms-architecture.md`](file:///i:/Projects/persici-app/.doc/reference-dashboard-and-cms-architecture.md) | Admin dashboard (`/dashboard`), CMS content editor, media manager & diagnostics. |
| [`.doc/reference-about-page-architecture.md`](file:///i:/Projects/persici-app/.doc/reference-about-page-architecture.md) | About Us (`/about`), agency heritage, 10 view sections, 3D origami & milestones. |
| [`.doc/reference-legal-and-compliance-architecture.md`](file:///i:/Projects/persici-app/.doc/reference-legal-and-compliance-architecture.md) | Privacy policy (`/privacy`), Terms (`/terms`), GDPR/CCPA & UAE/KSA/Jordan compliance. |

---

## 4. Verification Commands
Always verify changes before concluding tasks:
```bash
npx tsc --noEmit        # TypeScript verification (must be 0 errors)
npm run lint            # ESLint validation
npm run build           # Full production build (must pre-render 154+ pages cleanly)
```
