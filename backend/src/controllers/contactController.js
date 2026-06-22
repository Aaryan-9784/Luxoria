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
