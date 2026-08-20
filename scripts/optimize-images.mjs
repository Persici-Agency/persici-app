#!/usr/bin/env node

/**
 * Persici — Image Optimization Script
 *
 * Scans public/images/ for non-web-optimized images and converts them to
 * highly optimized WebP format with SEO-friendly filenames.
 *
 * Features:
 *  - Converts PNG, JPG, JPEG, BMP, TIFF, GIF to WebP
 *  - Renames to SEO-friendly: lowercase, hyphens instead of spaces, no special chars
 *  - Backs up originals to public/images/_originals/
 *  - Generates image-manifest.json mapping original → optimized paths
 *  - Logs compression stats (size savings)
 *
 * Usage:
 *   npm run optimize-images
 *   npm run optimize-images -- --quality 75
 *   npm run optimize-images -- --dir public/uploads
 */

import { readdir, stat, mkdir, rename, readFile, writeFile, access } from 'node:fs/promises';
import { join, extname, basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// ----- Configuration -----

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const DEFAULT_CONFIG = {
  /** Directory to scan for images */
  inputDir: join(PROJECT_ROOT, 'public', 'images'),
  /** Where to back up originals */
  backupDir: join(PROJECT_ROOT, 'public', 'images', '_originals'),
  /** Output quality for WebP (1-100) */
  quality: 80,
  /** Supported input extensions */
  inputExtensions: ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif', '.gif'],
  /** Max width for resizing (null = no resize) */
  maxWidth: 2560,
  /** Max height for resizing (null = no resize) */
  maxHeight: 2560,
  /** Whether to generate AVIF alongside WebP */
  generateAvif: false,
  /** Manifest output path */
  manifestPath: join(PROJECT_ROOT, 'public', 'images', 'image-manifest.json'),
};

// ----- Parse CLI args -----

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--quality':
        config.quality = parseInt(args[++i], 10);
        break;
      case '--dir':
        config.inputDir = join(PROJECT_ROOT, args[++i]);
        config.backupDir = join(config.inputDir, '_originals');
        config.manifestPath = join(config.inputDir, 'image-manifest.json');
        break;
      case '--max-width':
        config.maxWidth = parseInt(args[++i], 10);
        break;
      case '--no-backup':
        config.backupDir = null;
        break;
      case '--avif':
        config.generateAvif = true;
        break;
      case '--help':
        console.log(`
Persici Image Optimizer
=======================
Usage: node scripts/optimize-images.mjs [options]

Options:
  --quality <n>     WebP quality (1-100, default: 80)
  --dir <path>      Directory to scan (relative to project root, default: public/images)
  --max-width <n>   Max width in pixels (default: 2560)
  --no-backup       Skip backing up originals
  --avif            Also generate AVIF versions
  --help            Show this help
        `);
        process.exit(0);
    }
  }

  return config;
}

// ----- Helpers -----

/**
 * Converts a filename to an SEO-friendly format:
 * - Lowercase
 * - Replace spaces, underscores, and special chars with hyphens
 * - Remove consecutive hyphens
 * - Remove leading/trailing hyphens
 */
function toSeoFilename(filename) {
  const name = basename(filename, extname(filename));
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')   // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .replace(/^-|-$/g, '');          // Trim leading/trailing hyphens
}

/**
 * Recursively find all image files in a directory
 */
async function findImages(dir, extensions) {
  const results = [];

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    // Skip backup directory and hidden dirs
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
      const subResults = await findImages(fullPath, extensions);
      results.push(...subResults);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/**
 * Ensure a directory exists
 */
async function ensureDir(dir) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Format bytes into human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ----- Main -----

async function main() {
  const config = parseArgs();

  console.log('\n🎨 Persici Image Optimizer');
  console.log('========================\n');
  console.log(`📂 Scanning: ${relative(PROJECT_ROOT, config.inputDir)}`);
  console.log(`📊 Quality:  ${config.quality}`);
  console.log(`📐 Max size: ${config.maxWidth}x${config.maxHeight}\n`);

  // Find all images
  const images = await findImages(config.inputDir, config.inputExtensions);

  if (images.length === 0) {
    console.log('✅ No images found to optimize. Directory is clean!\n');
    console.log('💡 Tip: Add images to public/images/ and run this script again.\n');
    return;
  }

  console.log(`🔍 Found ${images.length} image(s) to optimize\n`);

  // Ensure backup directory exists
  if (config.backupDir) {
    await ensureDir(config.backupDir);
  }

  const manifest = {};
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const imagePath of images) {
    const relativePath = relative(config.inputDir, imagePath);
    const seoName = toSeoFilename(relativePath.replace(/[\\/]/g, '-'));
    const outputFilename = `${seoName}.webp`;
    const outputDir = dirname(imagePath);
    const outputPath = join(outputDir, outputFilename);

    try {
      // Get original size
      const originalStat = await stat(imagePath);
      const originalSize = originalStat.size;
      totalOriginalSize += originalSize;

      // Process image with sharp
      let pipeline = sharp(imagePath);

      // Resize if needed (maintain aspect ratio)
      if (config.maxWidth || config.maxHeight) {
        pipeline = pipeline.resize({
          width: config.maxWidth,
          height: config.maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Convert to WebP
      const webpBuffer = await pipeline
        .webp({ quality: config.quality, effort: 6 })
        .toBuffer();

      // Write optimized image
      await writeFile(outputPath, webpBuffer);
      const optimizedSize = webpBuffer.length;
      totalOptimizedSize += optimizedSize;

      // Generate AVIF if requested
      if (config.generateAvif) {
        const avifBuffer = await sharp(imagePath)
          .resize({
            width: config.maxWidth,
            height: config.maxHeight,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .avif({ quality: config.quality })
          .toBuffer();

        await writeFile(join(outputDir, `${seoName}.avif`), avifBuffer);
      }

      // Backup original
      if (config.backupDir) {
        const backupPath = join(config.backupDir, basename(imagePath));
        await rename(imagePath, backupPath);
      }

      // Add to manifest
      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      manifest[relativePath] = {
        original: relativePath,
        optimized: relative(config.inputDir, outputPath),
        originalSize: formatBytes(originalSize),
        optimizedSize: formatBytes(optimizedSize),
        savings: `${savings}%`,
      };

      const savingsColor = parseFloat(savings) > 50 ? '🟢' : parseFloat(savings) > 20 ? '🟡' : '🔴';
      console.log(
        `  ${savingsColor} ${relativePath} → ${outputFilename}  ` +
        `(${formatBytes(originalSize)} → ${formatBytes(optimizedSize)}, -${savings}%)`
      );

      successCount++;
    } catch (error) {
      console.error(`  ❌ Failed: ${relativePath} — ${error.message}`);
      errorCount++;
    }
  }

  // Write manifest
  await writeFile(config.manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  // Summary
  const totalSavings = totalOriginalSize > 0
    ? ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)
    : '0';

  console.log('\n========================');
  console.log('📊 Summary');
  console.log('========================');
  console.log(`  ✅ Optimized: ${successCount} image(s)`);
  if (errorCount > 0) console.log(`  ❌ Errors:    ${errorCount} image(s)`);
  console.log(`  📦 Total:     ${formatBytes(totalOriginalSize)} → ${formatBytes(totalOptimizedSize)} (-${totalSavings}%)`);
  console.log(`  📄 Manifest:  ${relative(PROJECT_ROOT, config.manifestPath)}`);
  if (config.backupDir) console.log(`  💾 Backups:   ${relative(PROJECT_ROOT, config.backupDir)}/`);
  console.log('');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
