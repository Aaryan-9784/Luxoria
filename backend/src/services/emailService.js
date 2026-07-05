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
      from: options.from || `Luxoria Premium <${process.env.SMTP_FROM || 'noreply@luxoria.com'}>`,
      to: options.to || options.email,
      replyTo: options.replyTo,
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
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <!-- Redesigned Header with Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0F172A; border-bottom: 4px solid #D4AF37;">
          <tr>
            <td align="center" style="padding: 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" valign="middle" style="padding-right: 15px;">
                    <img src="https://api.iconify.design/lucide:car.svg?color=%23D4AF37&width=140&height=140" width="35" height="35" alt="Luxoria Logo" style="display: block; border: 0;" />
                  </td>
                  <td align="center" valign="middle">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase;">Luxoria</h1>
                  </td>
                </tr>
              </table>
              <p style="color: #D4AF37; margin: 15px 0 0 0; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">Welcome to the Elite</p>
            </td>
          </tr>
        </table>
        
        <div style="padding: 40px 30px; text-align: center;">
          <h2 style="color: #0F172A; font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${user.name},</h2>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">Thank you for joining the premier luxury vehicle platform. Your journey to extraordinary experiences begins right here.</p>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">Explore our curated fleet of sports cars, luxury sedans, and premium SUVs.</p>
          <div style="margin: 40px 0;">
            <a href="${process.env.CLIENT_URL}/vehicles" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 1px; display: inline-block; text-transform: uppercase;">Explore The Fleet</a>
          </div>
        </div>
        <div style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0;">
            <strong style="color: #0F172A;">&copy; ${new Date().getFullYear()} Luxoria Premium Private Limited.</strong><br>All rights reserved.
          </p>
        </div>
      </div>
    `;
    await this.sendEmail({ email: user.email, subject: 'Welcome to Luxoria Premium', html });
  }

  async sendBookingConfirmation(user, booking, vehicle) {
    const formattedTotalPaid = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(booking.totalAmount || 0);

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <!-- Redesigned Header with Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0F172A; border-bottom: 4px solid #D4AF37;">
          <tr>
            <td align="center" style="padding: 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" valign="middle" style="padding-right: 15px;">
                    <img src="https://api.iconify.design/lucide:car.svg?color=%23D4AF37&width=140&height=140" width="35" height="35" alt="Luxoria Logo" style="display: block; border: 0;" />
                  </td>
                  <td align="center" valign="middle">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase;">Luxoria</h1>
                  </td>
                </tr>
              </table>
              <p style="color: #D4AF37; margin: 15px 0 0 0; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">Booking Confirmed</p>
            </td>
          </tr>
        </table>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #0F172A; font-size: 20px; font-weight: 600; margin-bottom: 20px; text-align: center;">Dear ${user.name},</h2>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center;">Your reservation for the <strong>${vehicle.brand} ${vehicle.name}</strong> is confirmed. (ID: ${booking.bookingId})</p>
          
          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-top: 35px;">
            <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; font-weight: 700;">Itinerary Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px; width: 35%;"><strong>Dates:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Location:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${booking.pickupLocation}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Total Paid:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${formattedTotalPaid}</td></tr>
              </tbody>
            </table>
          </div>
          
          <p style="color: #4B5563; font-size: 15px; line-height: 1.6; margin-top: 35px; text-align: center;">Your vendor partner will be preparing the vehicle to our highest luxury standards.</p>
        </div>
        <div style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0;">
            <strong style="color: #0F172A;">&copy; ${new Date().getFullYear()} Luxoria Premium Private Limited.</strong><br>All rights reserved.
          </p>
        </div>
      </div>
    `;
    await this.sendEmail({ email: user.email, subject: `Booking Confirmed: ${vehicle.brand} ${vehicle.name}`, html });
  }

  async sendPasswordReset(user, resetUrl) {
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <!-- Redesigned Header with Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0F172A; border-bottom: 4px solid #D4AF37;">
          <tr>
            <td align="center" style="padding: 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" valign="middle" style="padding-right: 15px;">
                    <img src="https://api.iconify.design/lucide:car.svg?color=%23D4AF37&width=140&height=140" width="35" height="35" alt="Luxoria Logo" style="display: block; border: 0;" />
                  </td>
                  <td align="center" valign="middle">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase;">Luxoria</h1>
                  </td>
                </tr>
              </table>
              <p style="color: #D4AF37; margin: 15px 0 0 0; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">Account Security</p>
            </td>
          </tr>
        </table>
        
        <!-- Body -->
        <div style="padding: 40px 30px; text-align: center;">
          <h2 style="color: #0F172A; font-size: 20px; font-weight: 600; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-top: 0;">We received a request to reset the password for your Luxoria account.</p>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">Click the secure link below to set a new password. For your protection, this link will expire in 10 minutes.</p>
          
          <div style="margin: 40px 0;">
            <a href="${resetUrl}" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 1px; display: inline-block; border: 1px solid #0F172A; text-transform: uppercase;">Reset Your Password</a>
          </div>
          
          <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5; margin-top: 30px; padding-top: 30px; border-top: 1px solid #F3F4F6;">If you did not request a password reset, please ignore this email or contact support if you have concerns regarding your account security.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0;">
            <strong style="color: #0F172A;">&copy; ${new Date().getFullYear()} Luxoria Premium Private Limited.</strong><br>All rights reserved.
          </p>
        </div>
      </div>
    `;
    await this.sendEmail({ email: user.email, subject: 'Luxoria Security: Password Reset Request', html });
  }

  async sendContactInquiryToAdmin(data) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxoria.com';
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <!-- Redesigned Header with Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0F172A; border-bottom: 4px solid #D4AF37;">
          <tr>
            <td align="center" style="padding: 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" valign="middle" style="padding-right: 15px;">
                    <img src="https://api.iconify.design/lucide:car.svg?color=%23D4AF37&width=140&height=140" width="35" height="35" alt="Luxoria Logo" style="display: block; border: 0;" />
                  </td>
                  <td align="center" valign="middle">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase;">Luxoria</h1>
                  </td>
                </tr>
              </table>
              <p style="color: #D4AF37; margin: 15px 0 0 0; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">New Experience Inquiry</p>
            </td>
          </tr>
        </table>
        
        <div style="padding: 40px 30px;">
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-top: 0; text-align: center;">A new inquiry has been submitted via the Luxoria platform.</p>
          
          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-top: 35px;">
            <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; font-weight: 700;">Client Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px; width: 35%;"><strong>Client Name:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.firstName} ${data.lastName}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Email Address:</strong></td><td style="padding: 10px 0; font-size: 15px;"><a href="mailto:${data.email}" style="color: #D4AF37; text-decoration: none; font-weight: 600;">${data.email}</a></td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Phone Number:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.phone}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>City:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.city}</td></tr>
              </tbody>
            </table>
          </div>

          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-top: 25px;">
            <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; font-weight: 700;">Experience Request</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px; width: 35%;"><strong>Service Type:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600; text-transform: capitalize;">${data.serviceType}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Event Date:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.eventDate}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Preferred Vehicle:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.preferredVehicle || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
          
          <div style="margin-top: 35px;">
            <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; font-weight: 700;">Additional Details</h3>
            <div style="background-color: #ffffff; border-left: 4px solid #D4AF37; padding: 25px; color: #374151; font-size: 15px; line-height: 1.7; box-shadow: 0 2px 10px rgba(0,0,0,0.02); border-radius: 0 8px 8px 0; border-top: 1px solid #F3F4F6; border-right: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6;">
              <i>"${data.message || 'No additional details provided.'}"</i>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0;">
            <strong style="color: #0F172A;">&copy; ${new Date().getFullYear()} Luxoria Premium Private Limited.</strong><br>All rights reserved.
          </p>
        </div>
      </div>
    `;
    await this.sendEmail({ email: adminEmail, subject: 'New Luxoria Experience Inquiry', html, message: `New inquiry from ${data.firstName} ${data.lastName}. Email: ${data.email}` });
  }
  async sendVendorContactToAdmin(data) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxoria.com';
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <!-- Redesigned Header with Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0F172A; border-bottom: 4px solid #D4AF37;">
          <tr>
            <td align="center" style="padding: 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" valign="middle" style="padding-right: 15px;">
                    <img src="https://api.iconify.design/lucide:car.svg?color=%23D4AF37&width=140&height=140" width="35" height="35" alt="Luxoria Logo" style="display: block; border: 0;" />
                  </td>
                  <td align="center" valign="middle">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase;">Luxoria</h1>
                  </td>
                </tr>
              </table>
              <p style="color: #D4AF37; margin: 15px 0 0 0; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">Exclusive Vendor Inquiry</p>
            </td>
          </tr>
        </table>
        
        <!-- Body -->
        <div style="padding: 40px 30px;">
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-top: 0; text-align: center;">A prospective client has requested to connect with a vendor regarding a premium vehicle.</p>
          
          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-top: 35px;">
            <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; font-weight: 700;">Client Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px; width: 35%;"><strong>Client Name:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.name}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Email Address:</strong></td><td style="padding: 10px 0; font-size: 15px;"><a href="mailto:${data.email}" style="color: #D4AF37; text-decoration: none; font-weight: 600;">${data.email}</a></td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Phone Number:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.phone}</td></tr>
              </tbody>
            </table>
          </div>

          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-top: 25px;">
            <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; font-weight: 700;">Inquiry Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px; width: 35%;"><strong>Target Vehicle:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.vehicleName || 'N/A'}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Vehicle ID:</strong></td><td style="padding: 10px 0; color: #4B5563; font-size: 14px;">${data.vehicleId}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;"><strong>Vendor:</strong></td><td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.vendorName || 'Luxoria Premium Private Limited'}</td></tr>
              </tbody>
            </table>
          </div>
          
          <div style="margin-top: 35px;">
            <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; font-weight: 700;">Client Message</h3>
            <div style="background-color: #ffffff; border-left: 4px solid #D4AF37; padding: 25px; color: #374151; font-size: 15px; line-height: 1.7; box-shadow: 0 2px 10px rgba(0,0,0,0.02); border-radius: 0 8px 8px 0; border-top: 1px solid #F3F4F6; border-right: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6;">
              <i>"${data.message || 'No additional message provided.'}"</i>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0;">
            Please follow up with the client promptly to maintain our premium service standards.<br><br>
            <strong style="color: #0F172A;">&copy; ${new Date().getFullYear()} Luxoria Premium Private Limited.</strong><br>All rights reserved.
          </p>
        </div>
      </div>
    `;
    await this.sendEmail({
      email: adminEmail,
      to: `"Aryan Patel" <${adminEmail}>`,
      from: `"${data.name}" <${process.env.SMTP_FROM || 'noreply@luxoria.com'}>`,
      replyTo: data.email,
      subject: `VIP Vendor Inquiry: ${data.vehicleName}`,
      html,
      message: `New vendor contact request from ${data.name} for vehicle ${data.vehicleName}.`
    });
  }
  async sendSupportTicketToAdmin(data) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxoria.com';

    const isVendor = data.senderRole === 'vendor';
    const senderLabel = isVendor ? 'Partner' : 'Client';
    const ticketSource = isVendor ? 'Partner Workspace' : 'Client Support Center';
    const headerSubtitle = isVendor ? 'New Partner Support Ticket' : 'New Client Support Ticket';
    const emailSubjectPrefix = isVendor ? 'Partner Ticket' : 'Client Ticket';

    const priorityColors = {
      urgent: '#DC2626',
      high: '#D97706',
      normal: '#16A34A',
    };

    // For vendors: show priority badge. For clients: show inquiry type label.
    const inquiryTypeLabels = {
      general_question:     'General Question',
      booking_modification: 'Booking Modification',
      booking_cancellation: 'Booking Cancellation',
      payment_billing:      'Payment & Billing',
      vehicle_inquiry:      'Vehicle Inquiry',
      chauffeur_service:    'Chauffeur Service',
      urgent_assistance:    'Urgent Assistance',
    };

    const priorityLabels = {
      urgent: 'URGENT — Active Booking Issue',
      high: 'HIGH — Time Sensitive',
      normal: 'NORMAL',
    };

    // Determine badge for the ticket details row
    let ticketTypeBadge;
    if (isVendor) {
      const priorityColor = priorityColors[data.priority] || priorityColors.normal;
      const priorityLabel = priorityLabels[data.priority] || priorityLabels.normal;
      ticketTypeBadge = `
        <tr>
          <td style="padding:10px 0;color:#6B7280;font-size:14px;"><strong>Priority:</strong></td>
          <td style="padding:10px 0;">
            <span style="display:inline-block;background-color:${priorityColor};color:#ffffff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;">${priorityLabel}</span>
          </td>
        </tr>`;
    } else {
      const inquiryLabel = inquiryTypeLabels[data.inquiryType] || 'General Question';
      const urgentColor = data.inquiryType === 'urgent_assistance' ? '#DC2626' : '#D4AF37';
      ticketTypeBadge = `
        <tr>
          <td style="padding:10px 0;color:#6B7280;font-size:14px;"><strong>Inquiry Type:</strong></td>
          <td style="padding:10px 0;">
            <span style="display:inline-block;background-color:${urgentColor};color:#ffffff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;">${inquiryLabel.toUpperCase()}</span>
          </td>
        </tr>`;
    }

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0F172A; border-bottom: 4px solid #D4AF37;">
          <tr>
            <td align="center" style="padding: 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" valign="middle" style="padding-right: 15px;">
                    <img src="https://api.iconify.design/lucide:car.svg?color=%23D4AF37&width=140&height=140" width="35" height="35" alt="Luxoria Logo" style="display:block;border:0;" />
                  </td>
                  <td align="center" valign="middle">
                    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:300;letter-spacing:6px;text-transform:uppercase;">Luxoria</h1>
                  </td>
                </tr>
              </table>
              <p style="color:#D4AF37;margin:15px 0 0 0;font-size:13px;letter-spacing:4px;text-transform:uppercase;font-weight:600;">${headerSubtitle}</p>
            </td>
          </tr>
        </table>

        <div style="padding: 40px 30px;">
          <p style="color:#4B5563;font-size:16px;line-height:1.6;margin-top:0;text-align:center;">A ${senderLabel.toLowerCase()} has opened a new support ticket from the ${ticketSource}.</p>

          <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:25px;margin-top:35px;">
            <h3 style="color:#0F172A;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 20px 0;border-bottom:1px solid #E5E7EB;padding-bottom:12px;font-weight:700;">${senderLabel} Details</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tbody>
                <tr><td style="padding:10px 0;color:#6B7280;font-size:14px;width:35%;"><strong>${senderLabel} Name:</strong></td><td style="padding:10px 0;color:#111827;font-size:15px;font-weight:600;">${data.senderName}</td></tr>
                <tr><td style="padding:10px 0;color:#6B7280;font-size:14px;"><strong>Email:</strong></td><td style="padding:10px 0;font-size:15px;"><a href="mailto:${data.senderEmail}" style="color:#D4AF37;text-decoration:none;font-weight:600;">${data.senderEmail}</a></td></tr>
                <tr><td style="padding:10px 0;color:#6B7280;font-size:14px;"><strong>Role:</strong></td><td style="padding:10px 0;color:#111827;font-size:15px;font-weight:600;text-transform:capitalize;">${data.senderRole}</td></tr>
              </tbody>
            </table>
          </div>

          <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:25px;margin-top:25px;">
            <h3 style="color:#0F172A;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 20px 0;border-bottom:1px solid #E5E7EB;padding-bottom:12px;font-weight:700;">Ticket Details</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tbody>
                <tr>
                  <td style="padding:10px 0;color:#6B7280;font-size:14px;width:35%;"><strong>Subject:</strong></td>
                  <td style="padding:10px 0;color:#111827;font-size:15px;font-weight:600;">${data.subject}</td>
                </tr>
                ${ticketTypeBadge}
                <tr>
                  <td style="padding:10px 0;color:#6B7280;font-size:14px;"><strong>Submitted At:</strong></td>
                  <td style="padding:10px 0;color:#111827;font-size:15px;font-weight:600;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top:35px;">
            <h3 style="color:#0F172A;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 15px 0;font-weight:700;">Message</h3>
            <div style="background-color:#ffffff;border-left:4px solid #D4AF37;padding:25px;color:#374151;font-size:15px;line-height:1.7;box-shadow:0 2px 10px rgba(0,0,0,0.02);border-radius:0 8px 8px 0;border-top:1px solid #F3F4F6;border-right:1px solid #F3F4F6;border-bottom:1px solid #F3F4F6;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>

        <div style="background-color:#F8FAFC;padding:30px;text-align:center;border-top:1px solid #E5E7EB;">
          <p style="color:#64748B;font-size:13px;line-height:1.6;margin:0;">
            Please respond to the ${senderLabel.toLowerCase()} via <a href="mailto:${data.senderEmail}" style="color:#D4AF37;">${data.senderEmail}</a><br><br>
            <strong style="color:#0F172A;">&copy; ${new Date().getFullYear()} Luxoria Premium Private Limited.</strong><br>All rights reserved.
          </p>
        </div>
      </div>
    `;

    const subjectLine = isVendor
      ? `[${data.priority.toUpperCase()}] Partner Ticket: ${data.subject}`
      : `[CLIENT] ${data.inquiryType ? inquiryTypeLabels[data.inquiryType] || 'Support' : 'Support'}: ${data.subject}`;

    await this.sendEmail({
      email: adminEmail,
      replyTo: data.senderEmail,
      subject: subjectLine,
      html,
      message: `New support ticket from ${data.senderName} (${data.senderEmail}). Subject: ${data.subject}`,
    });
  }
}

export default new EmailService();
