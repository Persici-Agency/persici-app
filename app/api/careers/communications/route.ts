import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getEmailConfig } from '@/lib/email/email.config';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';

export const runtime = 'nodejs';

/**
 * GET /api/careers/communications?applicantId=...
 * Retrieves email history for an applicant.
 * PROTECTED: Requires 'admin' or 'hr' role.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const applicantId = searchParams.get('applicantId');

    const db = await getDb();
    if (!db) return NextResponse.json({ success: true, messages: [] });

    const query = applicantId ? { applicantId } : {};
    const messages = await db
      .collection(COLLECTIONS.APPLICANT_COMMUNICATIONS)
      .find(query)
      .sort({ sentAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      messages: messages.map((m) => {
        const { _id, ...rest } = m;
        return { ...rest, id: _id.toString() };
      }),
    });
  } catch (error) {
    console.error('[API /api/careers/communications GET] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve communications log.' }, { status: 500 });
  }
}

/**
 * POST /api/careers/communications
 * Sends an email directly to a candidate from HR and records it in history.
 * PROTECTED: Requires 'admin' or 'hr' role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. HR or Admin credentials are required.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.applicantEmail || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Applicant email, subject, and message are required.' },
        { status: 400 }
      );
    }

    const {
      applicantId = '',
      applicantName = 'Candidate',
      applicantEmail,
      roleTitle = '',
      subject,
      message,
      templateType = 'custom',
    } = body;

    const config = getEmailConfig();
    const hrEmail = process.env.HR_EMAIL_USER || process.env.HR_RECEIVER_EMAIL || 'hr@persiciagency.com';
    const hrFromName = `Persici Talent Acquisition <${hrEmail}>`;

    const formattedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
            .header { background: #0f172a; padding: 24px 32px; border-bottom: 3px solid #D83427; }
            .header h1 { color: #ffffff; font-size: 18px; margin: 0; }
            .header p { color: #94a3b8; font-size: 12px; margin: 4px 0 0 0; }
            .body { padding: 32px; font-size: 15px; line-height: 1.6; color: #334155; }
            .body a { color: #D83427; font-weight: 600; text-decoration: none; }
            .footer { background: #f8fafc; padding: 16px 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>Persici Agency &bull; Talent Acquisition</h1>
              <p>Regarding: ${roleTitle || 'Your Application'}</p>
            </div>
            <div class="body">
              ${message.replace(/\n/g, '<br/>')}
            </div>
            <div class="footer">
              Persici Agency &bull; Dubai HQ &bull; Riyadh &bull; Amman &bull; Global Remote<br/>
              To reply, simply respond directly to this email.
            </div>
          </div>
        </body>
      </html>
    `;

    // Initialize transporter
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });

    let sentMessageId = 'simulated-' + Date.now();
    let isSimulated = false;

    if (!config.smtp.auth.user || !config.smtp.auth.pass) {
      console.log('[HR Communications (DEV/SIMULATED)] Email to:', applicantEmail, 'Subject:', subject);
      isSimulated = true;
    } else {
      const sendResult = await transporter.sendMail({
        from: hrFromName,
        to: applicantEmail,
        replyTo: hrEmail,
        subject,
        text: message,
        html: formattedHtml,
      });
      sentMessageId = sendResult.messageId;
    }

    // Record email in MongoDB communication log
    const db = await getDb();
    if (db) {
      await db.collection(COLLECTIONS.APPLICANT_COMMUNICATIONS).insertOne({
        applicantId,
        applicantName,
        applicantEmail,
        roleTitle,
        subject,
        message,
        templateType,
        sentBy: user.email,
        sentByName: user.name,
        sentAt: new Date(),
        messageId: sentMessageId,
        isSimulated,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email dispatched successfully to candidate.',
      messageId: sentMessageId,
      isSimulated,
    });
  } catch (error) {
    console.error('[API /api/careers/communications POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch email to applicant.' },
      { status: 500 }
    );
  }
}
