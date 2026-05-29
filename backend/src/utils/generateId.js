import crypto from 'crypto';

export const generateBookingId = () => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `LUX-${random}`;
};

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  return { resetToken, hashedToken };
};
