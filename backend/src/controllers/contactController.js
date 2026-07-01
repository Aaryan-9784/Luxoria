import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import emailService from '../services/emailService.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, city, serviceType, eventDate } = req.body;

    if (!firstName || !lastName || !email || !phone || !city || !serviceType || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Send the email via our email service
    await emailService.sendContactInquiryToAdmin(req.body);

    return ApiResponse.success(res, null, 'Inquiry sent successfully');
  } catch (error) {
    next(error);
  }
};

export const contactVendor = async (req, res, next) => {
  try {
    const { name, email, phone, message, vehicleId, vehicleName, vendorName } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, phone, message).',
      });
    }

    await emailService.sendVendorContactToAdmin(req.body);

    return ApiResponse.success(res, null, 'Vendor contact request sent successfully');
  } catch (error) {
    next(error);
  }
};

export const submitSupportTicket = async (req, res, next) => {
  try {
    const { subject, priority, message } = req.body;

    if (!subject || !message) {
      throw ApiError.badRequest('Subject and message are required.');
    }

    const validPriorities = ['normal', 'high', 'urgent'];
    const resolvedPriority = validPriorities.includes(priority) ? priority : 'normal';

    // Build sender info from authenticated user (req.user set by protect middleware)
    const senderName = req.user.name || req.user.businessName || 'Unknown Partner';
    const senderEmail = req.user.email;
    const senderRole = req.user.role;

    await emailService.sendSupportTicketToAdmin({
      subject,
      priority: resolvedPriority,
      message,
      senderName,
      senderEmail,
      senderRole,
    });

    return ApiResponse.success(res, null, 'Support ticket submitted successfully');
  } catch (error) {
    next(error);
  }
};
