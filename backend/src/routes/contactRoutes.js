import express from 'express';
import { submitInquiry } from '../controllers/contactController.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a new contact inquiry
// @access  Public
router.post('/', submitInquiry);

export default router;
