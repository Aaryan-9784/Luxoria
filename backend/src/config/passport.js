import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import emailService from '../services/emailService.js';

const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️ Google OAuth credentials missing in environment; skipping Google Strategy initialization.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }

          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;
            if (!user.avatar?.url && profile.photos?.[0]?.value) {
              user.avatar = {
                url: profile.photos[0].value,
                publicId: '',
              };
            }
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            name: profile.displayName || email.split('@')[0],
            email: email,
            googleId: profile.id,
            avatar: {
              url: profile.photos?.[0]?.value || '',
              publicId: '',
            },
            isVerified: true,
          });

          // Send welcome email (non-blocking)
          emailService.sendWelcomeEmail(user).catch((err) => console.error('OAuth welcome email failed:', err));

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

export default configurePassport;
