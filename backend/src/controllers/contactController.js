import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';
import emailService from '../services/emailService.js';

export const submitInquiry = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, city, serviceType, eventDate } = req.body;

  if (!firstName || !lastName || !email || !phone || !city || !serviceType || !eventDate) {
    throw ApiError.badRequest('Please provide all required fields.');
  }

  // Send the email via our email service
  await emailService.sendContactInquiryToAdmin(req.body);

  return ApiResponse.success(res, null, 'Inquiry sent successfully');
});

export const contactVendor = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    throw ApiError.badRequest('Please provide all required fields (name, email, phone, message).');
  }

  await emailService.sendVendorContactToAdmin(req.body);

  return ApiResponse.success(res, null, 'Vendor contact request sent successfully');
});

export const submitSupportTicket = asyncHandler(async (req, res) => {
    const { subject, priority, inquiryType, message } = req.body;

    if (!subject || !message) {
      throw ApiError.badRequest('Subject and message are required.');
    }

    const validPriorities = ['normal', 'high', 'urgent'];
    const resolvedPriority = validPriorities.includes(priority) ? priority : 'normal';

    // Build sender info from authenticated user (req.user set by protect middleware)
    const senderName = req.user.name || req.user.businessName || 'Unknown User';
    const senderEmail = req.user.email;
    const senderRole = req.user.role;

    // Client support tickets route to the configured support inbox
    const SUPPORT_INBOX = process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL || 'support@luxoria.com';

    await emailService.sendSupportTicketToAdmin({
      subject,
      priority: resolvedPriority,
      inquiryType: inquiryType || null,
      message,
      senderName,
      senderEmail,
      senderRole,
      recipientEmail: senderRole === 'user' ? SUPPORT_INBOX : undefined,
    });

    return ApiResponse.success(res, null, 'Support ticket submitted successfully');
});
