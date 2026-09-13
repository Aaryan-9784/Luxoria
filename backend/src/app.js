import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import passport from 'passport';
import configurePassport from './config/passport.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import emailService from './services/emailService.js';

const app = express();

// ─── Trust Proxy (Required for Render/Vercel/Cloud deployments) ───
app.set('trust proxy', 1);

// ─── Passport Configuration ──────────────────────────────────────
configurePassport();
app.use(passport.initialize());

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet());
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc) or matching client URLs
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = origin.replace(/\/$/, '');
      const isAllowed =
        (clientUrl && normalizedOrigin === clientUrl) ||
        origin.endsWith('.vercel.app') ||
        origin.startsWith('http://localhost');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback allow in dev/staging
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200,
  })
);
app.use(mongoSanitize());
app.use(hpp());

// ─── Body Parsing ────────────────────────────────────────────────
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Rate Limiting ───────────────────────────────────────────────
app.use('/api', generalLimiter);

// ─── Logging ─────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// ─── Health Checks (Root, /health, /api/health for Render/Docker/AWS probes) ───
const healthResponse = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LUXORIA API is operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
  });
};

app.get('/', healthResponse);
app.get('/health', healthResponse);
app.get('/api/health', healthResponse);

// Diagnostic test endpoint to verify email delivery from production
app.get('/api/health/test-email', async (req, res) => {
  const targetEmail = req.query.to || process.env.SMTP_USER || 'aaryanpatel9784@gmail.com';
  try {
    const result = await emailService.sendEmail({
      email: targetEmail,
      subject: 'Luxoria Email Test - Delivery Confirmed',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4AF37; border-radius: 8px;">
          <h2 style="color: #0F172A;">Luxoria Email System Operational</h2>
          <p>This is a live test confirming that your email system on Render is connected and delivering properly.</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'production'}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
      message: 'Luxoria Email System is operational!',
    });

    res.status(200).json({
      success: result?.success !== false,
      targetEmail,
      result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Internal Email Relay (Enables local development to send emails via live Render securely)
app.post('/api/internal/send-email', async (req, res) => {
  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== process.env.JWT_ACCESS_SECRET) {
    return res.status(403).json({ success: false, error: 'Unauthorized internal relay' });
  }

  try {
    const result = await emailService.sendEmail({ ...req.body, _relayed: true });
    return res.status(200).json({
      success: result?.success !== false,
      messageId: result?.messageId,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      statusCode: 404,
      message: `Route ${req.originalUrl} not found`,
    },
  });
});

// ─── Global Error Handler ────────────────────────────────────────
app.use(errorHandler);

export default app;
