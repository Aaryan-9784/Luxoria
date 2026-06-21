import ApiResponse from '../utils/ApiResponse.js';
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
