import express from 'express';
import { submitInquiry, contactVendor, submitSupportTicket } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a new contact inquiry
// @access  Public
router.post('/', submitInquiry);

// @route   POST /api/contact/vendor
// @desc    Submit a vendor contact request
// @access  Public
router.post('/vendor', contactVendor);

// @route   POST /api/contact/support-ticket
// @desc    Submit a partner/user support ticket — sends email to admin
// @access  Private (authenticated users & vendors)
router.post('/support-ticket', protect, submitSupportTicket);

export default router;
