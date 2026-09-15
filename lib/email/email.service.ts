import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { getEmailConfig } from './email.config';
import type { ContactFormData, AppointmentFormData, JobApplicationFormData } from '@shared/types';

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const config = getEmailConfig();

  // If credentials are not configured yet, return null for graceful development fallback
  if (!config.smtp.auth.user || !config.smtp.auth.pass) {
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass,
      },
      tls: {
        // Do not fail on invalid certs in strict corporate networks
        rejectUnauthorized: false,
      },
    });
  }

  return cachedTransporter;
}

/**
 * Verify Hostinger SMTP Connection
 */
export async function verifyEmailConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      return {
        success: false,
        message: 'Hostinger SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in environment variables.',
      };
    }
    await transporter.verify();
    return { success: true, message: 'Hostinger SMTP connection established successfully.' };
  } catch (error) {
    console.error('[EmailService] SMTP verification failed:', error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Send Contact Form Inquiry Notification to Persici Agency & Client Auto-Reply
 */
export async function sendContactFormNotification(data: ContactFormData): Promise<{ success: boolean; simulated?: boolean; messageId?: string }> {
  const config = getEmailConfig();
  const transporter = getTransporter();

  const formattedDate = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Cairo',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `[Persici Contact Inquiry] - ${data.name}${data.company ? ` (${data.company})` : ''}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f9; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #0f0f11; padding: 28px 32px; border-bottom: 3px solid #EB1933; }
          .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { color: #94a3b8; margin: 4px 0 0 0; font-size: 13px; }
          .badge { display: inline-block; background: #EB1933; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
          .body { padding: 32px; }
          .field { margin-bottom: 18px; }
          .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 600; color: #0f172a; word-break: break-word; }
          .message-box { background: #f8fafc; border-left: 4px solid #EB1933; padding: 16px; border-radius: 8px; margin-top: 20px; font-size: 14px; line-height: 1.6; color: #334155; }
          .footer { background: #f8fafc; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Contact Us Form</span>
            <h1>New Client Inquiry Received</h1>
            <p>Submitted on ${formattedDate} (Egypt Cairo Time)</p>
          </div>
          <div class="body">
            <div class="field">
              <div class="label">Client Name</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${data.email}" style="color: #EB1933; text-decoration: none;">${data.email}</a></div>
            </div>
            ${data.phone ? `
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value">${data.phone}</div>
            </div>` : ''}
            ${data.company ? `
            <div class="field">
              <div class="label">Company / Organization</div>
              <div class="value">${data.company}</div>
            </div>` : ''}
            ${data.jobTitle ? `
            <div class="field">
              <div class="label">Job Title</div>
              <div class="value">${data.jobTitle}</div>
            </div>` : ''}
            ${data.country ? `
            <div class="field">
              <div class="label">Country / Region</div>
              <div class="value">${data.country}</div>
            </div>` : ''}
            ${data.reason ? `
            <div class="field">
              <div class="label">Reason for Inquiry</div>
              <div class="value">${data.reason}</div>
            </div>` : ''}
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${(data.message || 'No additional message provided.').replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            Persici Growth OS • Enterprise Digital Agency System
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
NEW CLIENT INQUIRY (CONTACT US FORM)
=====================================
Date: ${formattedDate} (Egypt Cairo Time)
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Job Title: ${data.jobTitle || 'Not provided'}
Country: ${data.country || 'Not specified'}
Reason: ${data.reason || 'General Inquiry'}

Message:
${data.message || 'No message provided'}
  `.trim();

  // If transporter is not configured, gracefully simulate
  if (!transporter) {
    console.log('[EmailService] SMTP credentials not set yet. Simulated Contact Email:', {
      to: config.recipients.contactForm,
      subject,
      sender: data.email,
    });
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: config.recipients.contactForm,
      replyTo: data.email,
      subject,
      text: textContent,
      html: htmlContent,
    });

    // Auto-reply to client
    try {
      await transporter.sendMail({
        from: config.from,
        to: data.email,
        subject: `Thank you for contacting Persici Agency`,
        text: `Hello ${data.name},\n\nThank you for reaching out to Persici Agency. We have received your inquiry and one of our growth strategists will get in touch with you shortly.\n\nBest regards,\nPersici Agency Team\nhttps://persiciagency.com`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; margin-top: 0;">Thank you for reaching out!</h2>
            <p>Dear ${data.name},</p>
            <p>We have successfully received your inquiry. One of our growth strategists will review your request and connect with you within 24 business hours.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;"><strong>Persici Agency</strong> — Global Digital Transformation & Growth Partner</p>
          </div>
        `,
      });
    } catch (clientErr) {
      console.warn('[EmailService] Auto-reply to client failed:', clientErr);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Failed to send contact email:', error);
    return { success: false };
  }
}

/**
 * Send Appointment Request Notification (Explicitly marked as from the Floating Appointment Pop-Up)
 */
export async function sendAppointmentNotification(data: AppointmentFormData): Promise<{ success: boolean; simulated?: boolean; messageId?: string }> {
  const config = getEmailConfig();
  const transporter = getTransporter();

  const formattedDate = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Cairo',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `📅 [Persici Appointment Request] - ${data.name} (${data.selectedDate || 'Upcoming'} at ${data.selectedTime || 'Session'})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f9; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #0f0f11; padding: 28px 32px; border-bottom: 3px solid #10b981; }
          .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { color: #94a3b8; margin: 4px 0 0 0; font-size: 13px; }
          .badge-appointment { display: inline-block; background: #10b981; color: #ffffff; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
          .badge-source { display: inline-block; background: #3b82f6; color: #ffffff; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; margin-left: 6px; }
          .body { padding: 32px; }
          .highlight-card { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
          .highlight-title { font-size: 12px; font-weight: 700; color: #047857; text-transform: uppercase; margin-bottom: 6px; }
          .highlight-value { font-size: 18px; font-weight: 800; color: #065f46; }
          .field { margin-bottom: 18px; }
          .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 600; color: #0f172a; word-break: break-word; }
          .footer { background: #f8fafc; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <span class="badge-appointment">Appointment Booking</span>
              <span class="badge-source">Floating Widget</span>
            </div>
            <h1>New Discovery Strategy Session Booked</h1>
            <p>Booked via site popup on ${formattedDate} (Egypt Cairo Time)</p>
          </div>
          <div class="body">
            <div class="highlight-card">
              <div class="highlight-title">Scheduled Date & Time Slot</div>
              <div class="highlight-value">🗓️ ${data.selectedDate || 'Requested'} • ⏰ ${data.selectedTime || 'Pending'}</div>
            </div>

            <div class="field">
              <div class="label">Origin / Source</div>
              <div class="value" style="color: #2563eb;">⚡ Floating Appointment Pop-Up Widget</div>
            </div>

            <div class="field">
              <div class="label">Client Full Name</div>
              <div class="value">${data.name}</div>
            </div>

            <div class="field">
              <div class="label">Work Email</div>
              <div class="value"><a href="mailto:${data.email}" style="color: #10b981; text-decoration: none;">${data.email}</a></div>
            </div>

            ${data.website ? `
            <div class="field">
              <div class="label">Store / Company Website</div>
              <div class="value"><a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" target="_blank" style="color: #2563eb; text-decoration: underline;">${data.website}</a></div>
            </div>` : ''}

            ${data.revenue ? `
            <div class="field">
              <div class="label">Monthly Revenue Tier</div>
              <div class="value">${data.revenue}</div>
            </div>` : ''}

            ${data.phone ? `
            <div class="field">
              <div class="label">Phone</div>
              <div class="value">${data.phone}</div>
            </div>` : ''}

            ${data.notes ? `
            <div class="field">
              <div class="label">Notes / Objectives</div>
              <div class="value">${data.notes}</div>
            </div>` : ''}
          </div>
          <div class="footer">
            Persici Growth OS • Appointment & Scheduling Engine
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
NEW APPOINTMENT BOOKING (FROM FLOATING APPOINTMENT POP-UP)
===========================================================
Source: Floating Appointment Pop-Up Widget
Received on: ${formattedDate} (Egypt Cairo Time)

SCHEDULED SESSION:
Date: ${data.selectedDate || 'Pending'}
Time Slot: ${data.selectedTime || 'Pending'}

CLIENT DETAILS:
Name: ${data.name}
Work Email: ${data.email}
Store / Website: ${data.website || 'Not provided'}
Revenue Tier: ${data.revenue || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Notes: ${data.notes || 'None'}
  `.trim();

  // If transporter is not configured, gracefully simulate
  if (!transporter) {
    console.log('[EmailService] SMTP credentials not set yet. Simulated Appointment Email:', {
      to: config.recipients.appointment,
      subject,
      date: data.selectedDate,
      time: data.selectedTime,
      sender: data.email,
    });
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: config.recipients.appointment,
      replyTo: data.email,
      subject,
      text: textContent,
      html: htmlContent,
    });

    // Auto-reply to client
    try {
      await transporter.sendMail({
        from: config.from,
        to: data.email,
        subject: `Your Persici Strategy Call is Confirmed — ${data.selectedDate || ''} at ${data.selectedTime || ''}`,
        text: `Hello ${data.name},\n\nWe have received your appointment request for ${data.selectedDate || ''} at ${data.selectedTime || ''}.\n\nOur team has reserved this 30-minute growth strategy session for you. A calendar invitation with meeting coordinates will be dispatched to this email address.\n\nBest regards,\nPersici Agency Team`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; margin-top: 0;">Your Strategy Call is Confirmed!</h2>
            <p>Dear ${data.name},</p>
            <p>Thank you for scheduling a discovery session with Persici Agency. Here are your booking details:</p>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0 0 6px 0;"><strong>Date:</strong> ${data.selectedDate || 'To be confirmed'}</p>
              <p style="margin: 0;"><strong>Time:</strong> ${data.selectedTime || 'To be confirmed'}</p>
            </div>
            <p>One of our partners will review your store (${data.website || 'profile'}) and send a direct Google Meet / calendar invite prior to the call.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;"><strong>Persici Agency</strong> — Global Digital Growth Partner</p>
          </div>
        `,
      });
    } catch (clientErr) {
      console.warn('[EmailService] Client appointment auto-reply failed:', clientErr);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Failed to send appointment email:', error);
    return { success: false };
  }
}

/**
 * Send Job Application Notification to Persici Talent Acquisition & Applicant Confirmation
 */
export async function sendJobApplicationNotification(
  data: JobApplicationFormData
): Promise<{ success: boolean; simulated?: boolean; messageId?: string }> {
  const config = getEmailConfig();
  const transporter = getTransporter();

  const subject = `[Persici Careers] New Application: ${data.name} — ${data.roleTitle}`;

  const textContent = `
NEW PERSICI CAREERS APPLICATION
===============================
Role Applied: ${data.roleTitle} (${data.department || 'General'})
Role Slug: ${data.roleSlug}

Candidate Details:
------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Location: ${data.location || 'N/A'}
Earliest Start Date: ${data.startDate || 'Immediate / Flexible'}
Expected Compensation: ${data.expectedSalary || 'Negotiable'}

Profiles & Links:
-----------------
LinkedIn: ${data.linkedinUrl || 'N/A'}
Portfolio / GitHub: ${data.portfolioUrl || data.githubUrl || 'N/A'}
Resume URL: ${data.resumeUrl || 'N/A'} (Filename: ${data.resumeFileName || 'N/A'})

Cover Note / Why Persici:
-------------------------
${data.coverNote || 'None provided.'}

Timestamp: ${new Date().toISOString()}
  `.trim();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #121212; padding: 32px; border-bottom: 3px solid #D83427; }
          .badge { display: inline-block; background: rgba(216, 52, 39, 0.15); color: #D83427; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(216,52,39,0.3); margin-bottom: 8px; }
          .title { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
          .subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
          .content { padding: 32px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
          .data-box { background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; }
          .label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 4px; }
          .val { font-size: 15px; font-weight: 600; color: #0f172a; word-break: break-all; }
          .note-box { background: #fdf3f2; border: 1px solid #f9ccc8; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .note-text { font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin: 0; }
          .btn { display: inline-block; background: #D83427; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 8px; }
          .footer { background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Persici Careers Portal</span>
            <h1 class="title">New Candidate Application</h1>
            <p class="subtitle">${data.roleTitle} &bull; ${data.department || 'General'}</p>
          </div>
          <div class="content">
            <div class="grid">
              <div class="data-box">
                <div class="label">Full Name</div>
                <div class="val">${data.name}</div>
              </div>
              <div class="data-box">
                <div class="label">Email Address</div>
                <div class="val"><a href="mailto:${data.email}" style="color: #D83427; text-decoration: none;">${data.email}</a></div>
              </div>
              <div class="data-box">
                <div class="label">Phone</div>
                <div class="val">${data.phone || 'N/A'}</div>
              </div>
              <div class="data-box">
                <div class="label">Current Location</div>
                <div class="val">${data.location || 'N/A'}</div>
              </div>
              <div class="data-box">
                <div class="label">Earliest Availability</div>
                <div class="val">${data.startDate || 'Immediate / Flexible'}</div>
              </div>
              <div class="data-box">
                <div class="label">Expected Compensation</div>
                <div class="val">${data.expectedSalary || 'Negotiable'}</div>
              </div>
            </div>

            <div style="background: #f1f5f9; padding: 16px; border-radius: 10px; margin-bottom: 24px;">
              <div class="label" style="margin-bottom: 8px;">Professional Profiles & Dossier</div>
              <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px;">
                ${data.linkedinUrl ? `<div><strong>LinkedIn:</strong> <a href="${data.linkedinUrl}" target="_blank" style="color: #D83427;">View Profile &rarr;</a></div>` : ''}
                ${data.portfolioUrl ? `<div><strong>Portfolio:</strong> <a href="${data.portfolioUrl}" target="_blank" style="color: #D83427;">View Showcase &rarr;</a></div>` : ''}
                ${data.githubUrl ? `<div><strong>GitHub:</strong> <a href="${data.githubUrl}" target="_blank" style="color: #D83427;">View Code &rarr;</a></div>` : ''}
                ${data.resumeUrl ? `<div><strong>Resume/CV:</strong> <a href="${data.resumeUrl}" target="_blank" style="color: #D83427; font-weight: bold;">Download ${data.resumeFileName || 'Resume'} &darr;</a></div>` : ''}
              </div>
            </div>

            ${data.coverNote ? `
              <div class="label" style="margin-bottom: 6px;">Cover Note / Candidate Statement</div>
              <div class="note-box">
                <p class="note-text">${data.coverNote}</p>
              </div>
            ` : ''}

            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${data.email}?subject=Persici%20Careers%20Follow-up%20%7C%20${encodeURIComponent(data.roleTitle)}" class="btn">
                Reply Directly to Candidate &rarr;
              </a>
            </div>
          </div>
          <div class="footer">
            Persici Agency Talent Acquisition &bull; Dubai &bull; Riyadh &bull; Amman &bull; Global
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transporter) {
    console.log('[EmailService (DEV/SIMULATED)] Careers Application Notification:');
    console.log(textContent);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: config.recipients.careers,
      replyTo: data.email,
      subject,
      text: textContent,
      html: htmlContent,
    });

    // Auto-reply to applicant
    try {
      await transporter.sendMail({
        from: config.from,
        to: data.email,
        subject: `Application Received: ${data.roleTitle} at Persici Agency`,
        text: `Dear ${data.name},\n\nThank you for applying for the ${data.roleTitle} role at Persici Agency.\n\nOur talent team and department leads are reviewing your profile and portfolio. If there is mutual alignment, we will reach out within 48 to 72 hours for an initial alignment conversation.\n\nIn the meantime, feel free to explore our recent client transformations at https://persiciagency.com/client-stories.\n\nBest regards,\nPersici Agency Talent Collective`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 580px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="margin-bottom: 20px;">
              <span style="font-size: 11px; font-weight: 700; color: #D83427; letter-spacing: 1px; text-transform: uppercase;">Persici Agency</span>
              <h2 style="color: #0f172a; margin: 8px 0 0 0; font-size: 20px;">Your application has been received</h2>
            </div>
            <p>Dear ${data.name},</p>
            <p>Thank you for your interest in shaping the digital landscape with us. We have received your application for <strong>${data.roleTitle}</strong>.</p>
            <div style="background: #f8fafc; border-left: 3px solid #D83427; padding: 14px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Next Steps:</strong> Our hiring team reviews every submission thoroughly. You can expect a response within <strong>48 to 72 business hours</strong> regarding next steps.</p>
            </div>
            <p>We appreciate the time you took to share your journey with us.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Persici Agency &bull; Dubai HQ &bull; Riyadh &bull; Amman &bull; Global Remote</p>
          </div>
        `,
      });
    } catch (clientErr) {
      console.warn('[EmailService] Applicant auto-reply failed:', clientErr);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Failed to send careers notification email:', error);
    return { success: false };
  }
}

