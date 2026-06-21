import nodemailer from 'nodemailer';

/**
 * Enterprise Email Service using Nodemailer
 * Configured for production via environment variables (e.g. Gmail SMTP, SendGrid, Mailtrap)
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || 'placeholder_user',
        pass: process.env.SMTP_PASS || 'placeholder_pass',
      },
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: `Luxoria Premium <${process.env.SMTP_FROM || 'noreply@luxoria.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.message,
    };

    try {
      if (process.env.NODE_ENV !== 'test') {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
      }
    } catch (error) {
      console.error(`Error sending email to ${options.email}:`, error);
      // We don't throw to prevent blocking the main thread (e.g. booking success)
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0F172A; text-transform: uppercase; letter-spacing: 2px;">Welcome to Luxoria</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for joining the premier luxury vehicle platform. Your journey to extraordinary experiences begins here.</p>
        <p>Explore our curated fleet of sports cars, luxury sedans, and premium SUVs.</p>
        <div style="margin-top: 30px;">
          <a href="${process.env.CLIENT_URL}/vehicles" style="background-color: #0F172A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore Fleet</a>
        </div>
      </div>
    `;
    await this.sendEmail({ email: user.email, subject: 'Welcome to Luxoria Premium', html });
  }

  async sendBookingConfirmation(user, booking, vehicle) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0F172A;">Booking Confirmed: ${vehicle.name}</h2>
        <p>Dear ${user.name},</p>
        <p>Your reservation (ID: ${booking.bookingId}) is confirmed.</p>
        <div style="background-color: #F8FAFC; padding: 15px; border-left: 4px solid #0F172A; margin: 20px 0;">
          <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${booking.pickupLocation}</p>
          <p><strong>Total Paid:</strong> ₹${booking.totalAmount.toLocaleString('en-IN')}</p>
        </div>
        <p>Your vendor partner will be preparing the vehicle to our highest luxury standards.</p>
      </div>
    `;
    await this.sendEmail({ email: user.email, subject: `Booking Confirmed: ${vehicle.brand} ${vehicle.name}`, html });
  }

  async sendPasswordReset(user, resetUrl) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0F172A;">Password Reset Request</h2>
        <p>We received a request to reset your Luxoria password.</p>
        <p>Click the button below to set a new password. This link will expire in 10 minutes.</p>
        <div style="margin-top: 30px; margin-bottom: 30px;">
          <a href="${resetUrl}" style="background-color: #0F172A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #64748B; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `;
    await this.sendEmail({ email: user.email, subject: 'Luxoria Password Reset', html });
  }

  async sendContactInquiryToAdmin(data) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxoria.com';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0F172A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Experience Inquiry</h2>
        
        <p style="color: #334155; font-size: 16px;">A new inquiry has been submitted via the Luxoria platform.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tbody>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>City:</strong></td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.city}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>Service Type:</strong></td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.serviceType}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>Event Date:</strong></td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.eventDate}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>Preferred Vehicle:</strong></td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.preferredVehicle || 'N/A'}</td></tr>
          </tbody>
        </table>
        
        <div style="background-color: #F8FAFC; padding: 15px; border-left: 4px solid #0F172A; margin: 20px 0;">
          <p style="margin: 0; color: #475569;"><strong>Additional Details:</strong></p>
          <p style="margin-top: 5px; color: #1e293b; white-space: pre-wrap;">${data.message || 'No additional details provided.'}</p>
        </div>
      </div>
    `;
    await this.sendEmail({ email: adminEmail, subject: 'New Luxoria Experience Inquiry', html, message: `New inquiry from ${data.firstName} ${data.lastName}. Email: ${data.email}` });
  }
}

export default new EmailService();
