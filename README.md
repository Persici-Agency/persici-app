# Persici Agency — Enterprise Digital Transformation Platform

> **Boutique Studio Specialized in AI & Digital Transformation**  
> UAE (Dubai) • KSA (Riyadh) • Jordan (Amman)  
> Production Platform: [https://persici.com](https://persici.com)

---

## Overview

Persici Agency is an enterprise-grade digital transformation and AI integration studio. This repository houses the complete bilingual (English & Arabic) web application, powered by Next.js 16 (App Router), React 19, Tailwind CSS v4, MongoDB Atlas, and Cloudflare R2 object storage.

---

## Tech Stack & Architecture

- **Framework**: [Next.js 16.3.1](https://nextjs.org/) (Turbopack, App Router)
- **UI Runtime**: [React 19.2.8](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@theme inline` in `app/globals.css`
- **Internationalization (i18n)**: Native bilingual routing (`/en` and `/ar`) with automated LTR/RTL cascading via `proxy.ts`. Headings auto-switch to `Cairo` font and body to `Tajawal` under Arabic mode.
- **Database Layer**: [MongoDB Atlas](https://www.mongodb.com/atlas) with connection pooling in `lib/mongodb.ts` and graceful static fallbacks.
- **Object Storage & CDN**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) via `@aws-sdk/client-s3` (`lib/storage.ts`) and [Sharp](https://sharp.pixelplumbing.com/) WebP compression pipeline.
- **Email Infrastructure**: Hostinger SMTP/IMAP (`lib/email/email.service.ts`) with custom templates.
- **AI Synthesis**: Google Gemini 2.5 Flash for automated executive summaries in Insights (`/api/insights/ai-overview`).

---

## Directory Structure

```
persici-app/
├── .doc/                      # Authoritative master architectural references (git-ignored)
│   ├── instructions.md        # Master coding standards & agent operational rules
│   ├── reference-*.md         # 12 domain-specific architectural specifications
├── app/
│   ├── [lang]/                # Localized route hierarchy (/en and /ar)
│   │   ├── (dashboard)/       # Administrative CMS Dashboard (/dashboard)
│   │   ├── (site)/            # Public enterprise website
│   │   │   ├── _home/         # Homepage orchestrator & 8 modular sections
│   │   │   ├── _shared/       # Master reusable UI library (@shared/components)
│   │   │   ├── solutions/     # Solutions Hub & 9 dedicated Solution Feature Pages
│   │   │   ├── industries/    # Industries Hub & 6 dedicated Industry Feature Pages
│   │   │   ├── how-we-do-it/  # Methodology Hub & 5 dedicated Subpages
│   │   │   ├── client-stories/# Client Stories Hub & showcase templates
│   │   │   ├── insights/      # Insights Hub, AI Overview & detail pages
│   │   │   ├── careers/       # Careers Hub, job openings & application form
│   │   │   ├── contact/       # Contact Us, global growth hubs & appointment widget
│   │   │   ├── about/         # About Us page, agency heritage & milestones
│   │   │   ├── privacy/       # Privacy Policy & Sovereign Data Governance
│   │   │   └── terms/         # Terms of Service & Compliance
│   │   ├── _lib/              # Fonts, metadata builders & i18n utilities
│   │   ├── dictionaries/      # Localized JSON dictionaries (en.json, ar.json)
│   │   └── layout.tsx         # Root layout with hydration defense
│   └── api/                   # Serverless route handlers (contact, discovery, media, etc.)
├── lib/                       # MongoDB client, Cloudflare R2 storage & email service
├── public/                    # Static assets, icons, SVGs, and local media caches
├── scripts/                   # Database seed and R2 asset upload automation scripts
├── CLAUDE.md                  # Quick-reference guide & architectural invariants for AI agents
└── AGENTS.md                  # Next.js App Router operational rules
```

---

## Getting Started

### 1. Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

Key environment variables:
- `MONGODB_URI`: MongoDB Atlas connection string.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID.
- `CLOUDFLARE_R2_ACCESS_KEY_ID`: Cloudflare R2 access key.
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: Cloudflare R2 secret key.
- `CLOUDFLARE_R2_BUCKET_NAME`: R2 bucket name (`persici-media`).
- `CLOUDFLARE_R2_PUBLIC_URL`: CDN delivery base URL.
- `SMTP_USER` & `SMTP_PASSWORD`: Hostinger email credentials.
- `GEMINI_API_KEY`: Google Gemini API key for Insights AI Overview.

### 3. Installation & Development

```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (auto-redirects to `/en`).

---

## Quality Verification & Build

Before committing or deploying, run the standard quality verification suite:

```bash
# 1. TypeScript verification (must pass with 0 errors)
npx tsc --noEmit

# 2. ESLint linting
npm run lint

# 3. Production build (pre-renders all 154+ static routes)
npm run build
```

---

## Master Architecture References (`.doc/`)

Comprehensive technical specifications, design tokens, and domain references are maintained in `.doc/`:

- [`.doc/instructions.md`](.doc/instructions.md): Master coding standards, component architecture & design tokens.
- [`.doc/reference-home-navbar-core-architecture.md`](.doc/reference-home-navbar-core-architecture.md): Global header, floating navbar, luminance engine, homepage sections & footer.
- [`.doc/reference-media-and-r2-asset-pipeline.md`](.doc/reference-media-and-r2-asset-pipeline.md): Cloudflare R2 object storage, Sharp WebP compression & platform vector icons.
- [`.doc/reference-solutions-pages-reference.md`](.doc/reference-solutions-pages-reference.md): Solutions Hub & 9 Solution Feature Pages.
- [`.doc/reference-industries-architecture-knowledge.md`](.doc/reference-industries-architecture-knowledge.md): Industries Hub & 6 Industry Feature Pages.
- [`.doc/reference-how-we-do-it-pages-reference.md`](.doc/reference-how-we-do-it-pages-reference.md): How We Do It Hub & 5 Methodology Subpages.
- [`.doc/reference-client-stories-architecture.md`](.doc/reference-client-stories-architecture.md): Client Stories Hub & showcase templates.
- [`.doc/reference-insights-and-ai-overview-architecture.md`](.doc/reference-insights-and-ai-overview-architecture.md): Insights Hub & Gemini 2.5 Flash AI overview.
- [`.doc/reference-careers-and-recruitment-architecture.md`](.doc/reference-careers-and-recruitment-architecture.md): Careers Hub & recruitment system.
- [`.doc/reference-contact-and-email-system.md`](.doc/reference-contact-and-email-system.md): Contact Us, global growth hubs & Hostinger email.
- [`.doc/reference-dashboard-and-cms-architecture.md`](.doc/reference-dashboard-and-cms-architecture.md): Admin dashboard & CMS integration.
- [`.doc/reference-about-page-architecture.md`](.doc/reference-about-page-architecture.md): About Us page & agency heritage.
- [`.doc/reference-legal-and-compliance-architecture.md`](.doc/reference-legal-and-compliance-architecture.md): Privacy Policy, Terms & compliance.

---

## License
Proprietary & Confidential. Copyright © 2026 Persici Agency. All rights reserved.
