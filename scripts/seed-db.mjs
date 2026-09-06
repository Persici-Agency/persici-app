#!/usr/bin/env node

/**
 * Persici — MongoDB Seeding Utility
 *
 * Populates MongoDB Atlas with all default CMS page sections, projects,
 * services, insights, logos, and testimonials from the codebase.
 *
 * Usage:
 *   node scripts/seed-db.mjs
 */

import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local if present
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
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

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'persici_db';

if (!uri) {
  console.error('\n❌ Error: MONGODB_URI is not set.');
  console.error('👉 Please define MONGODB_URI in your .env.local file:');
  console.error('   MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"\n');
  process.exit(1);
}

console.log('\n🌱 Persici MongoDB Seeding Utility');
console.log('====================================');
console.log(`📡 Database: ${dbName}\n`);

async function seed() {
  const client = new MongoClient(uri);

  try {
    console.log('⏳ Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const db = client.db(dbName);

    // 1. Seed Page Contents
    console.log('📄 Seeding page_contents collection...');
    const pagesCollection = db.collection('page_contents');
    await pagesCollection.createIndex({ page: 1 }, { unique: true });

    // Dynamic import of page data
    const sharedDataModule = await import('../app/[lang]/(site)/_shared/data.ts');
    const {
      homePageContent,
      servicesPageContent,
      workPageContent,
      contactPageContent,
      projectsList,
      servicesList,
      insightsArticles,
      clientLogos,
      reviewsList,
      defaultTestimonials,
    } = sharedDataModule;

    const pages = [
      { page: 'home', data: homePageContent },
      { page: 'services', data: servicesPageContent },
      { page: 'work', data: workPageContent },
      { page: 'contact', data: contactPageContent },
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
      console.log(`   ✓ Page seeded: ${p.page}`);
    }

    // 2. Seed Projects
    console.log('\n💼 Seeding projects collection...');
    const projectsCol = db.collection('projects');
    await projectsCol.createIndex({ slug: 1 }, { unique: true });
    for (const item of projectsList) {
      const { id, ...rest } = item;
      void id;
      await projectsCol.updateOne(
        { slug: item.slug },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${projectsList.length} projects.`);

    // 3. Seed Services
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
    console.log(`   ✓ Seeded ${servicesList.length} services.`);

    // 4. Seed Insights
    console.log('\n📰 Seeding insights collection...');
    const insightsCol = db.collection('insights');
    await insightsCol.createIndex({ slug: 1 }, { unique: true });
    for (const item of insightsArticles) {
      const { id, ...rest } = item;
      void id;
      await insightsCol.updateOne(
        { slug: item.slug },
        { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded ${insightsArticles.length} insight articles.`);

    // 5. Seed Client Logos
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
    console.log(`   ✓ Seeded ${clientLogos.length} client logos.`);

    // 6. Seed Reviews & Testimonials
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
    console.log(`   ✓ Seeded ${reviewsList.length} reviews and testimonials.`);

    console.log('\n🎉 SUCCESS! MongoDB Atlas has been fully seeded with all CMS data.');
    console.log('💡 Your database is completely synchronized and ready for the CMS dashboard!\n');
  } catch (error) {
    console.error('\n❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
