import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// 1. Read environment variables from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) {
    env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME || 'persici-media';
const publicBaseUrl = (env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev').replace(/\/$/, '');

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('Missing Cloudflare R2 credentials in .env.local!');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function uploadToR2(key, buffer, contentType) {
  const cmd = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await s3.send(cmd);
  console.log(`Uploaded to R2: ${key} (${buffer.length} bytes)`);
}

async function main() {
  console.log('--- Step 1: Processing Client Logos ---');
  const clientLogos = [
    {
      sourceFile: 'Mashreq-Bank-Logo.png',
      canonicalName: 'mashreq-logo.webp',
      altKey: 'Mashreq-Bank-Logo.webp',
    },
    {
      sourceFile: 'lahfaa-icon.png',
      canonicalName: 'lahfaa-logo.webp',
      altKey: 'lahfaa-icon.webp',
    },
    {
      sourceFile: 'vayron-logo-dark-h.png',
      canonicalName: 'vayron-logo-dark.webp',
      altKey: 'vayron-logo-dark-h.webp',
    },
  ];

  const backupDir = path.join('public', 'images', '_originals', 'clients');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (const item of clientLogos) {
    const inputPath = path.join('public', 'images', 'clients', item.sourceFile);
    if (!fs.existsSync(inputPath)) {
      console.error(`File not found: ${inputPath}`);
      continue;
    }

    // Backup original PNG if not already backed up
    const backupPath = path.join(backupDir, item.sourceFile);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`Backed up original to: ${backupPath}`);
    }

    // Compress using Sharp: trim transparent padding, resize to height 120 (proportional width), webp quality 85 effort 6
    const outputBuffer = await sharp(inputPath)
      .trim()
      .resize({ height: 120, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    const localOutputPath = path.join('public', 'images', 'clients', item.canonicalName);
    fs.writeFileSync(localOutputPath, outputBuffer);
    console.log(`Saved local WebP: ${localOutputPath} (${outputBuffer.length} bytes)`);

    // Upload to Cloudflare R2 under clients/
    await uploadToR2(`clients/${item.canonicalName}`, outputBuffer, 'image/webp');
    if (item.altKey) {
      await uploadToR2(`clients/${item.altKey}`, outputBuffer, 'image/webp');
    }
  }

  console.log('\n--- Step 2: Processing Platform SVGs ---');
  const platformsDir = path.join('public', 'icons', 'platforms');
  if (!fs.existsSync(platformsDir)) {
    fs.mkdirSync(platformsDir, { recursive: true });
  }

  const platformSvgs = [
    {
      id: 'salesforce',
      url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/13.0.0/icons/salesforce.svg',
      color: '#00A1E0',
      fileName: 'salesforce.svg',
    },
    {
      id: 'adobe-creative-cloud',
      url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/13.0.0/icons/adobecreativecloud.svg',
      color: '#DA1F26',
      fileName: 'adobe-creative-cloud.svg',
    },
    {
      id: 'canva',
      url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/13.0.0/icons/canva.svg',
      color: '#00C4CC',
      fileName: 'canva.svg',
    },
    {
      id: 'python',
      url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/13.0.0/icons/python.svg',
      color: '#3776AB',
      fileName: 'python.svg',
    },
  ];

  for (const p of platformSvgs) {
    console.log(`Fetching SVG for ${p.id}...`);
    const res = await fetch(p.url);
    if (!res.ok) {
      console.error(`Failed to fetch SVG for ${p.id}: ${res.status}`);
      continue;
    }
    let svgText = await res.text();
    // Ensure the SVG has the brand fill color if not present on path
    if (!svgText.includes('fill=')) {
      svgText = svgText.replace('<path ', `<path fill="${p.color}" `);
    }

    const svgPath = path.join(platformsDir, p.fileName);
    fs.writeFileSync(svgPath, svgText, 'utf8');
    console.log(`Saved local SVG: ${svgPath}`);

    const svgBuffer = Buffer.from(svgText, 'utf8');
    await uploadToR2(`icons/platforms/${p.fileName}`, svgBuffer, 'image/svg+xml');
  }

  console.log('\n--- Step 3: Verifying Public URLs ---');
  const testUrls = [
    `${publicBaseUrl}/clients/mashreq-logo.webp`,
    `${publicBaseUrl}/clients/lahfaa-logo.webp`,
    `${publicBaseUrl}/clients/vayron-logo-dark.webp`,
    `${publicBaseUrl}/icons/platforms/salesforce.svg`,
    `${publicBaseUrl}/icons/platforms/adobe-creative-cloud.svg`,
    `${publicBaseUrl}/icons/platforms/canva.svg`,
    `${publicBaseUrl}/icons/platforms/python.svg`,
  ];

  for (const u of testUrls) {
    try {
      const res = await fetch(u);
      console.log(`HTTP ${res.status} ${res.headers.get('content-type')} -> ${u}`);
    } catch (e) {
      console.error(`Error testing ${u}:`, e.message);
    }
  }

  console.log('\nAsset processing and Cloudflare R2 upload complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
