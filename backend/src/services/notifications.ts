// Notification service for sending emails and WhatsApp messages
// This is a basic structure - actual providers (SendGrid, Twilio, etc.) can be integrated later

export default ({ strapi }) => ({
  /**
   * Send email notification
   * @param {string} to - Email address
   * @param {string} subject - Email subject
   * @param {string} text - Plain text content
   * @param {string} html - HTML content (optional)
   */
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    console.log('📧 Email notification:', { to, subject, text });
    
    // TODO: Integrate with SendGrid or Mailgun
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from: 'noreply@yourdomain.com', subject, text, html });
    
    return { success: true, message: 'Email sent (simulated)' };
  },

  /**
   * Send WhatsApp message
   * @param {string} to - Phone number with country code
   * @param {string} message - Message content
   */
  async sendWhatsApp(to: string, message: string) {
    console.log('📱 WhatsApp notification:', { to, message });
    
    // TODO: Integrate with WhatsApp provider (Meta Cloud API, Twilio, Gupshup)
    // Example with Twilio:
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //   from: 'whatsapp:+14155238886',
    //   to: `whatsapp:${to}`,
    //   body: message,
    // });
    
    return { success: true, message: 'WhatsApp sent (simulated)' };
  },

  /**
   * Send payment confirmation to user
   */
  async sendPaymentConfirmation(user: any, payment: any) {
    const subject = 'Payment Confirmation - Astro App';
    const text = `Dear ${user.name || 'User'},\n\nYour payment of ₹${payment.amount} has been confirmed.\n\nThank you for your purchase!`;
    
    if (user.email) {
      await this.sendEmail(user.email, subject, text);
    }
    
    if (user.phone) {
      await this.sendWhatsApp(user.phone, text);
    }
  },

  /**
   * Notify astrologers about new service request
   */
  async notifyAstrologersNewRequest(user: any, serviceRequest: any) {
    const astrologerEmails = process.env.ASTROLOGER_EMAILS?.split(',') || [];
    const astrologerPhones = process.env.ASTROLOGER_PHONES?.split(',') || [];
    
    const subject = `New Service Request - ${serviceRequest.service_type}`;
    const message = `New ${serviceRequest.service_type} request from ${user.name || user.email}.\n\nUser notes: ${serviceRequest.user_notes || 'None'}`;
    
    // Send to all astrologers
    for (const email of astrologerEmails) {
      if (email.trim()) {
        await this.sendEmail(email.trim(), subject, message);
      }
    }
    
    for (const phone of astrologerPhones) {
      if (phone.trim()) {
        await this.sendWhatsApp(phone.trim(), message);
      }
    }
  },

  /**
   * Notify user about service request completion
   */
  async notifyUserRequestCompleted(user: any, serviceRequest: any) {
    const subject = 'Your Service Request is Complete';
    const message = `Your ${serviceRequest.service_type} request has been completed.\n\nPlease check the app for details.`;
    
    if (user.email) {
      await this.sendEmail(user.email, subject, message);
    }
    
    if (user.phone) {
      await this.sendWhatsApp(user.phone, message);
    }
  },
});
