import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { parseReferenceFile } from '@/lib/ai-reference-parser';

export const runtime = 'nodejs';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files').filter((f): f is File => f instanceof File);
    const singleFile = formData.get('file');
    if (singleFile instanceof File) {
      files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Please upload at least one reference file (.pdf, .docx, .doc, .xlsx, .xls, .csv, .md, or .txt).' },
        { status: 400 }
      );
    }

    const parsedDocuments = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 15 MB limit.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parsed = await parseReferenceFile(buffer, file.name, file.type);
      parsedDocuments.push(parsed);
    }

    return NextResponse.json({
      success: true,
      documents: parsedDocuments,
    });
  } catch (err) {
    console.error('[API /api/ai/parse-reference POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to parse reference file';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
