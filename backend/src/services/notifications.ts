import type { Core } from '@strapi/strapi';

// Notification service for sending emails and WhatsApp messages
export default ({ strapi }: { strapi: Core.Strapi }) => {
  const logger = strapi.log;

  return {
  /**
   * Send email notification via SendGrid (when SENDGRID_API_KEY is set) or log.
   */
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (apiKey) {
      try {
        // Dynamic import so the package is optional — install @sendgrid/mail to enable
        let sgMail;
        try {
          sgMail = require('@sendgrid/mail');
        } catch {
          logger.warn('SendGrid package not installed. Run: npm install @sendgrid/mail');
          return { success: false, error: 'SendGrid package not installed' };
        }
        sgMail.setApiKey(apiKey);
        await sgMail.send({
          to,
          from: process.env.SENDGRID_FROM_EMAIL || 'noreply@astroapp.in',
          subject,
          text,
          html: html || text,
        });
        logger.info(`📧 Email sent to ${to}: ${subject}`);
        return { success: true };
      } catch (err) {
        logger.error('SendGrid email error:', err);
        return { success: false, error: err };
      }
    }

    // Fallback: log (dev / staging without email configured)
    logger.info('📧 Email notification (no provider):', { to, subject, text });
    return { success: true, message: 'Email logged (no provider configured)' };
  },

  /**
   * Send WhatsApp message via Twilio (when TWILIO_* vars are set) or log.
   */
  async sendWhatsApp(to: string, message: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (accountSid && authToken && fromNumber) {
      try {
        // Dynamic import so the package is optional — install twilio to enable
        let twilio;
        try {
          twilio = require('twilio');
        } catch {
          logger.warn('Twilio package not installed. Run: npm install twilio');
          return { success: false, error: 'Twilio package not installed' };
        }
        const client = twilio(accountSid, authToken);
        await client.messages.create({
          from: `whatsapp:${fromNumber}`,
          to: `whatsapp:${to}`,
          body: message,
        });
        logger.info(`📱 WhatsApp sent to ${to}`);
        return { success: true };
      } catch (err) {
        logger.error('Twilio WhatsApp error:', err);
        return { success: false, error: err };
      }
    }

    // Fallback: log
    logger.info('📱 WhatsApp notification (no provider):', { to, message });
    return { success: true, message: 'WhatsApp logged (no provider configured)' };
  },

  /**
   * Notify astrologers about a new service request.
   */
  async notifyAstrologersNewRequest(user: any, serviceRequest: any) {
    const astrologerEmails = process.env.ASTROLOGER_EMAILS?.split(',') || [];
    const astrologerPhones = process.env.ASTROLOGER_PHONES?.split(',') || [];

    const subject = `New ${serviceRequest.service_type} Request – ${serviceRequest.order_number}`;
    const message =
      `New ${serviceRequest.service_type} request from ${user.name || user.email || 'a user'}.\n` +
      `Order: ${serviceRequest.order_number}\n` +
      `Notes: ${serviceRequest.user_notes || 'None'}`;

    for (const email of astrologerEmails) {
      if (email.trim()) await this.sendEmail(email.trim(), subject, message);
    }
    for (const phone of astrologerPhones) {
      if (phone.trim()) await this.sendWhatsApp(phone.trim(), message);
    }
  },

  /**
   * Notify user when their service request is completed.
   */
  async notifyUserRequestCompleted(user: any, serviceRequest: any) {
    const subject = 'Your Request is Complete';
    const message =
      `Your ${serviceRequest.service_type} request (${serviceRequest.order_number}) has been completed.\n` +
      `Please check the app for your response.`;

    if (user.email) await this.sendEmail(user.email, subject, message);
    if (user.phone) await this.sendWhatsApp(user.phone, message);
  },
  };
};
