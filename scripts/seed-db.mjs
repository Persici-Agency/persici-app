#!/usr/bin/env node

/**
 * Persici — MongoDB Atlas Seeding Utility
 *
 * Populates MongoDB Atlas with all default CMS page sections, projects,
 * services, insights, logos, reviews, navigation menus, and the initial
 * root administrative account.
 *
 * Usage:
 *   node scripts/seed-db.mjs
 */

import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dns from 'node:dns';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Ensure resilient DNS resolution for MongoDB Atlas SRV
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in sandboxes
}

// Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const envPath = path.join(rootDir, file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...values] = trimmed.split('=');
          if (key && values.length > 0) {
            const val = values.join('=').replace(/^["']|["']$/g, '').trim();
            if (!process.env[key.trim()]) {
              process.env[key.trim()] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'persici_db';

if (!uri) {
  console.error('\n❌ Error: MONGODB_URI is not set in environment variables.');
  process.exit(1);
}

console.log('\n🌱 Persici MongoDB Atlas Master Seeding Engine');
console.log('================================================');
console.log(`📡 Target Cluster: Atlas (${dbName})\n`);

async function seed() {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const db = client.db(dbName);

    // 0. Seed Root Admin User
    console.log('🔐 Initializing root administrator account in dashboard_users...');
    const usersCol = db.collection('dashboard_users');
    await usersCol.createIndex({ email: 1 }, { unique: true });

    const adminEmail = 'admin@persiciagency.com';
    const adminPasswordPlain = 'PersiciAdmin2026!';
    const passwordHash = await bcrypt.hash(adminPasswordPlain, 12);

    await usersCol.updateOne(
      { email: adminEmail },
      {
        $set: {
          name: 'Persici Root Administrator',
          email: adminEmail,
          role: 'admin',
          passwordHash,
          avatar: '',
          status: 'active',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(`   ✓ Root Admin Account configured: ${adminEmail}`);

    // Dynamic import of master shared data, about data, contact data, client stories data, careers data, & insights data
    const sharedDataModule = await import('../app/[lang]/(site)/_shared/data.ts');
    const aboutDataModule = await import('../app/[lang]/(site)/about/_about/data/about.data.ts');
    const contactDataModule = await import('../app/[lang]/(site)/contact/_contact/data/contact.data.ts');
    const clientStoriesModule = await import('../app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data.ts');
    const careersDataModule = await import('../app/[lang]/(site)/careers/_careers/data/careers.data.ts');
    const insightsDataModule = await import('../app/[lang]/(site)/insights/_insights/data/insights.data.ts');
    const solutionsCmsModule = await import('../app/[lang]/(site)/solutions/_solutions/data/solutions-cms.data.ts');
    const {
      homePageContent,
      servicesPageContent,
      workPageContent,
      solutionsOfferingsList,
      industriesPageContent,
      industriesOfferingsList,
      howWeDoItPageContent,
      howWeDoItOfferingsList,
      servicesList,
      clientLogos,
      reviewsList,
      defaultTestimonials,
      siteNavLinks,
      defaultSharedContactData,
    } = sharedDataModule;
    const { aboutPageData } = aboutDataModule;
    const { contactPageData } = contactDataModule;
    const { clientStoriesData, clientStoriesHubPageData } = clientStoriesModule;
    const { careersHubData, careerOpenings } = careersDataModule;
    const {
      insightsData,
      insightsHubPageData,
      DEFAULT_INSIGHT_SECTION_VISIBILITY,
    } = insightsDataModule;
    const {
      defaultSolutionsHubCmsData,
      SOLUTION_FEATURE_SLUGS,
      getDefaultSolutionFeatureCmsData,
    } = solutionsCmsModule;

    // 1. Seed Page Contents
    console.log('\n📄 Seeding page_contents collection...');
    const pagesCollection = db.collection('page_contents');
    await pagesCollection.createIndex({ page: 1 }, { unique: true });

    const pages = [
      { page: 'home', data: homePageContent },
      { page: 'about', data: aboutPageData },
      { page: 'services', data: servicesPageContent },
      { page: 'work', data: workPageContent },
      { page: 'client-stories', data: clientStoriesHubPageData },
      { page: 'careers', data: careersHubData },
      { page: 'insights', data: insightsHubPageData },
      { page: 'contact', data: contactPageData },
      { page: 'solutions', data: defaultSolutionsHubCmsData },
      ...SOLUTION_FEATURE_SLUGS.map((slug) => ({
        page: `solutions-${slug}`,
        data: getDefaultSolutionFeatureCmsData(slug),
      })),
      { page: 'industries', data: industriesPageContent },
      { page: 'how-we-do-it', data: howWeDoItPageContent },
      { page: 'shared-contact', data: defaultSharedContactData },
    ];

    for (const p of pages) {
      await pagesCollection.updateOne(
        { page: p.page },
        {
          $set: {
            ...p.data,
            page: p.page,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log(`   ✓ Page synchronized: ${p.page}`);
    }

    // 1b. Seed Careers Collection (Active Job Postings)
    console.log('\n💼 Seeding careers collection...');
    const careersCol = db.collection('careers');
    await careersCol.createIndex({ slug: 1 }, { unique: true });
    for (const job of careerOpenings) {
      await careersCol.updateOne(
        { slug: job.slug },
        {
          $setOnInsert: {
            ...job,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
    console.log(`   ✓ Verified/Seeded ${careerOpenings.length} career openings.`);

    // 2. Seed Solutions Collection
    console.log('\n💡 Seeding solutions offerings collection...');
    const solutionsCol = db.collection('solutions');
    await solutionsCol.createIndex({ slug: 1 }, { unique: true });
    for (const item of solutionsOfferingsList) {
      const { id, ...rest } = item;
      void id;
      await solutionsCol.updateOne(
        { slug: item.slug },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${solutionsOfferingsList.length} solution offerings.`);

    // 3. Seed Industries Collection
    console.log('\n🏭 Seeding industries offerings collection...');
    const industriesCol = db.collection('industries');
    await industriesCol.createIndex({ slug: 1 }, { unique: true });
    for (const item of industriesOfferingsList) {
      const { id, ...rest } = item;
      void id;
      await industriesCol.updateOne(
        { slug: item.slug },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${industriesOfferingsList.length} industry offerings.`);

    // 4. Seed Real Client Stories (projects collection)
    console.log('\n💼 Seeding real client stories into projects collection...');
    const projectsCol = db.collection('projects');
    await projectsCol.createIndex({ slug: 1 }, { unique: true });

    // Remove legacy fake placeholder items
    const legacyFakeSlugs = ['nordic-living', 'lumina-beauty', 'urban-pulse', 'atelier-chic'];
    const delRes = await projectsCol.deleteMany({ slug: { $in: legacyFakeSlugs } });
    if (delRes.deletedCount > 0) {
      console.log(`   ✓ Purged ${delRes.deletedCount} legacy placeholder project records.`);
    }

    const baseTime = Date.now();
    for (let idx = 0; idx < clientStoriesData.length; idx++) {
      const item = clientStoriesData[idx];
      await projectsCol.updateOne(
        { slug: item.slug },
        {
          $set: {
            ...item,
            isActive: true,
            sortOrder: idx + 1,
            updatedAt: new Date(baseTime - idx * 1000),
          },
          $setOnInsert: {
            createdAt: new Date(baseTime - idx * 1000),
          },
        },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${clientStoriesData.length} real Persici client stories.`);

    // 5. Seed Services
    console.log('\n⚙️  Seeding services collection...');
    const servicesCol = db.collection('services');
    await servicesCol.createIndex({ slug: 1 }, { unique: true });
    for (const item of servicesList) {
      const { id, ...rest } = item;
      void id;
      await servicesCol.updateOne(
        { slug: item.slug },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${servicesList.length} growth services.`);

    // 6. Seed Insights Articles (Canonical 9 Persici Thought Leadership & Research Articles)
    console.log('\n📰 Seeding insights articles collection...');
    const insightsCol = db.collection('insights');
    await insightsCol.createIndex({ slug: 1 }, { unique: true });

    // Remove legacy fake placeholder insight items
    const legacyFakeInsightSlugs = [
      'scaling-meta-ads-2026',
      'shopify-headless-cro',
      'first-party-data-retention',
    ];
    const delInsightsRes = await insightsCol.deleteMany({
      slug: { $in: legacyFakeInsightSlugs },
    });
    if (delInsightsRes.deletedCount > 0) {
      console.log(`   ✓ Purged ${delInsightsRes.deletedCount} legacy placeholder insight records.`);
    }

    for (let idx = 0; idx < insightsData.length; idx++) {
      const item = insightsData[idx];
      await insightsCol.updateOne(
        { slug: item.slug },
        {
          $set: {
            ...item,
            isActive: item.isActive !== false,
            sectionVisibility: {
              ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
              ...(item.sectionVisibility || {}),
            },
            sortOrder: idx + 1,
            updatedAt: new Date(baseTime - idx * 1000),
          },
          $setOnInsert: {
            createdAt: new Date(baseTime - idx * 1000),
          },
        },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${insightsData.length} real Persici insight & research articles.`);

    // 7. Seed Client Logos (Canonical sequence)
    console.log('\n🤝 Seeding client_logos collection...');
    const logosCol = db.collection('client_logos');
    for (const item of clientLogos) {
      const { id, ...rest } = item;
      void id;
      await logosCol.updateOne(
        { name: item.name },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${clientLogos.length} canonical client logos.`);

    // 8. Seed Reviews & Testimonials
    console.log('\n⭐ Seeding reviews & testimonials...');
    const reviewsCol = db.collection('reviews');
    for (const item of reviewsList) {
      const { id, ...rest } = item;
      void id;
      await reviewsCol.updateOne(
        { name: item.name, company: item.company },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }

    const testCol = db.collection('testimonials');
    for (const item of defaultTestimonials) {
      const { id, ...rest } = item;
      void id;
      await testCol.updateOne(
        { author: item.author, company: item.company },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${reviewsList.length} client reviews and testimonials.`);

    // 9. Seed Navigation Menus (Header & Footer)
    console.log('\n🧭 Seeding navigation_menus collection...');
    const navCol = db.collection('navigation_menus');
    await navCol.updateOne(
      { type: 'header' },
      {
        $set: {
          type: 'header',
          links: siteNavLinks,
          ctaButton: {
            text: { en: 'Book a Call', ar: 'احجز مكالمة' },
            href: '/contact',
            enabled: true,
          },
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    await navCol.updateOne(
      { type: 'footer' },
      {
        $set: {
          type: 'footer',
          disclaimer: 'Persici Agency — Specialized in AI and Digital Transformation.',
          hubs: [
            { city: 'Dubai', country: 'United Arab Emirates', address: 'DIFC, Gate Precinct 4' },
            { city: 'Riyadh', country: 'Kingdom of Saudi Arabia', address: 'KAFD, Tower 2' },
            { city: 'Amman', country: 'Hashemite Kingdom of Jordan', address: 'Abdali Boulevard' },
          ],
          socialLinks: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/company/persici' },
            { platform: 'Twitter', url: 'https://x.com/persiciagency' },
            { platform: 'Instagram', url: 'https://instagram.com/persiciagency' },
          ],
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
    console.log('   ✓ Seeded Header and Footer navigation configurations.');

    console.log('\n🎉 SUCCESS! MongoDB Atlas is 100% synchronized with all site data.');
    console.log('🔑 Root Admin: admin@persiciagency.com | Password: PersiciAdmin2026!\n');
  } catch (error) {
    console.error('\n❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
