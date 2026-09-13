import express from 'express';
import { subscribe } from '../controllers/newsletterController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/subscribe', authLimiter, subscribe);

export default router;
