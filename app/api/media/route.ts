import { NextRequest, NextResponse } from 'next/server';
import {
  uploadOptimizedImageToR2,
  deleteFileFromR2,
  listFilesFromR2,
  isR2Configured,
} from '@/lib/storage';
import { getDb, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

/**
 * GET /api/media
 * Lists media items from Cloudflare R2 or MongoDB media records.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    if (!isR2Configured()) {
      return NextResponse.json({
        configured: false,
        message: 'Cloudflare R2 is not fully configured.',
        items: [],
      });
    }

    const items = await listFilesFromR2(folder, limit);
    return NextResponse.json({
      configured: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('[API /api/media GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve media items', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media
 * Uploads an image, compresses it to WebP via Sharp, and uploads to Cloudflare R2.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        {
          error: 'Cloudflare R2 storage is not configured. Please check environment variables.',
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'media';
    const alt = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file was provided in the request.' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run Sharp in-flight compression & push to Cloudflare R2
    const result = await uploadOptimizedImageToR2(buffer, file.name, folder);

    // Record in MongoDB media collection if DB is available
    const db = await getDb();
    if (db) {
      await db.collection(COLLECTIONS.MEDIA).insertOne({
        ...result,
        alt,
        folder,
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Image successfully compressed and uploaded to Cloudflare R2.',
        media: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/media POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process and upload image', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media
 * Deletes a media file from Cloudflare R2 and removes its MongoDB record.
 */
export async function DELETE(request: NextRequest) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Cloudflare R2 is not configured.' },
        { status: 503 }
      );
    }

    let key = '';
    const { searchParams } = new URL(request.url);
    const keyParam = searchParams.get('key');

    if (keyParam) {
      key = keyParam;
    } else {
      const body = await request.json().catch(() => ({}));
      key = body.key || '';
    }

    if (!key) {
      return NextResponse.json(
        { error: 'Missing file key to delete.' },
        { status: 400 }
      );
    }

    // Delete from Cloudflare R2
    const result = await deleteFileFromR2(key);

    // Delete record from MongoDB if available
    const db = await getDb();
    if (db) {
      await db.collection(COLLECTIONS.MEDIA).deleteOne({ key: result.key });
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully from Cloudflare R2.',
      key: result.key,
    });
  } catch (error) {
    console.error('[API /api/media DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file from storage', details: String(error) },
      { status: 500 }
    );
  }
}
