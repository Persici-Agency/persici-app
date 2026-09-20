import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { saveJobApplicationSubmission } from '@shared/services/db.service';
import { sendJobApplicationNotification } from '@/lib/email';
import { isR2Configured, uploadDocumentToR2, toSeoFilename } from '@/lib/storage';
import type { JobApplicationFormData } from '@shared/types';

export const runtime = 'nodejs';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/careers/apply
 * Handles candidate job applications with CV/Resume document uploads,
 * saves submission to MongoDB, and dispatches notification via Hostinger SMTP.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let applicationData: JobApplicationFormData;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const name = (formData.get('name') as string || '').trim();
      const email = (formData.get('email') as string || '').trim();
      const phone = (formData.get('phone') as string || '').trim();
      const location = (formData.get('location') as string || '').trim();
      const roleSlug = (formData.get('roleSlug') as string || '').trim();
      const roleTitle = (formData.get('roleTitle') as string || '').trim();
      const department = (formData.get('department') as string || '').trim();
      const linkedinUrl = (formData.get('linkedinUrl') as string || '').trim();
      const portfolioUrl = (formData.get('portfolioUrl') as string || '').trim();
      const githubUrl = (formData.get('githubUrl') as string || '').trim();
      const startDate = (formData.get('startDate') as string || '').trim();
      const expectedSalary = (formData.get('expectedSalary') as string || '').trim();
      const coverNote = (formData.get('coverNote') as string || '').trim();
      const locale = (formData.get('locale') as string || 'en').trim();

      if (!name || !email || !roleSlug || !roleTitle) {
        return NextResponse.json(
          { error: 'Missing required fields: name, email, roleSlug, and roleTitle are required.' },
          { status: 400 }
        );
      }

      let resumeUrl: string | undefined;
      let resumeFileName: string | undefined;

      const resumeFile = formData.get('resume') as File | null;

      if (resumeFile && typeof resumeFile === 'object' && resumeFile.size > 0) {
        if (resumeFile.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'The uploaded file exceeds the 10MB size limit.' },
            { status: 400 }
          );
        }

        const ext = path.extname(resumeFile.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext)) {
          return NextResponse.json(
            { error: 'Invalid document type. Only PDF, DOC, and DOCX files are permitted.' },
            { status: 400 }
          );
        }

        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        resumeFileName = resumeFile.name;

        if (isR2Configured()) {
          try {
            const uploadResult = await uploadDocumentToR2(
              buffer,
              resumeFile.name,
              resumeFile.type || 'application/octet-stream',
              'resumes'
            );
            resumeUrl = uploadResult.url;
          } catch (r2Err) {
            console.error('[API /api/careers/apply] R2 upload failed, falling back to local storage:', r2Err);
          }
        }

        // Fallback to local storage if R2 is unconfigured or failed
        if (!resumeUrl) {
          try {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
            await fs.mkdir(uploadDir, { recursive: true });
            const sanitizedBase = toSeoFilename(resumeFile.name);
            const localFileName = `${sanitizedBase}-${Date.now()}${ext}`;
            const targetPath = path.join(uploadDir, localFileName);
            await fs.writeFile(targetPath, buffer);
            resumeUrl = `/uploads/resumes/${localFileName}`;
          } catch (fsErr) {
            console.warn('[API /api/careers/apply] Local storage save failed:', fsErr);
            resumeUrl = `https://storage.persiciagency.com/resumes/${toSeoFilename(resumeFile.name)}-${Date.now()}${ext}`;
          }
        }
      }

      applicationData = {
        name,
        email,
        phone,
        location,
        roleSlug,
        roleTitle,
        department,
        linkedinUrl,
        portfolioUrl,
        githubUrl,
        startDate,
        expectedSalary,
        resumeUrl,
        resumeFileName,
        coverNote,
        locale,
      };
    } else {
      // JSON payload
      const body = (await request.json().catch(() => null)) as JobApplicationFormData | null;
      if (!body || !body.name || !body.email || !body.roleSlug || !body.roleTitle) {
        return NextResponse.json(
          { error: 'Missing required fields: name, email, roleSlug, and roleTitle are required.' },
          { status: 400 }
        );
      }
      applicationData = body;
    }

    // 1. Persist to MongoDB (Collection: job_applications)
    const dbResult = await saveJobApplicationSubmission(applicationData);

    // 2. Dispatch Hostinger SMTP Email Notification & Applicant Confirmation
    await sendJobApplicationNotification(applicationData);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully.',
      applicationId: dbResult.id,
    });
  } catch (error) {
    console.error('[API /api/careers/apply] Error processing application:', error);
    return NextResponse.json(
      { error: 'Failed to process job application. Please try again or contact hr@persiciagency.com.' },
      { status: 500 }
    );
  }
}
