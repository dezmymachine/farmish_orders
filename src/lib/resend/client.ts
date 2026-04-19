import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface EmailAttachment {
  filename: string;
  content: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}) {
  if (!resend) {
    console.warn('Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'orders@yourdomain.com',
      to,
      subject,
      html,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}