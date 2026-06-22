import express from 'express';
import { submitInquiry, contactVendor } from '../controllers/contactController.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a new contact inquiry
// @access  Public
router.post('/', submitInquiry);

// @route   POST /api/contact/vendor
// @desc    Submit a vendor contact request
// @access  Public
router.post('/vendor', contactVendor);

export default router;
