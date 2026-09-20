/**
 * Hostinger Email Server Configuration
 * 
 * Standard Hostinger Mail Server Parameters:
 * - Incoming Mail (IMAP): imap.hostinger.com | Port 993 (SSL/TLS)
 * - Outgoing Mail (SMTP): smtp.hostinger.com | Port 465 (SSL/TLS) or 587 (STARTTLS)
 */

export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  imap: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
  recipients: {
    contactForm: string;
    appointment: string;
    careers: string;
  };
}

export function getEmailConfig(): EmailConfig {
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const imapUser = process.env.IMAP_USER || smtpUser;
  const imapPass = process.env.IMAP_PASS || smtpPass;

  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const isSecure = process.env.SMTP_SECURE !== undefined 
    ? process.env.SMTP_SECURE === 'true' 
    : smtpPort === 465;

  const defaultFrom = smtpUser ? `Persici Agency <${smtpUser}>` : 'Persici Agency <info@persiciagency.com>';

  const contactReceiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.SITE_RECEIVER_EMAIL || smtpUser || 'info@persiciagency.com';
  const appointmentReceiver = process.env.APPOINTMENT_RECEIVER_EMAIL || contactReceiver;
  const careersReceiver = process.env.CAREERS_RECEIVER_EMAIL || process.env.HR_RECEIVER_EMAIL || 'hr@persiciagency.com';

  return {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    },
    imap: {
      host: process.env.IMAP_HOST || 'imap.hostinger.com',
      port: parseInt(process.env.IMAP_PORT || '993', 10),
      secure: true,
      auth: {
        user: imapUser,
        pass: imapPass,
      },
    },
    from: process.env.MAIL_FROM || defaultFrom,
    recipients: {
      contactForm: contactReceiver,
      appointment: appointmentReceiver,
      careers: careersReceiver,
    },
  };
}
