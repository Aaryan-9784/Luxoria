import Razorpay from 'razorpay';

let razorpayInstance;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in environment. Online checkout will be unavailable until keys are provided.');
  razorpayInstance = {
    orders: {
      create: async () => {
        throw new Error('Razorpay keys missing in server configuration. Please provide RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
      },
    },
    payments: {
      fetch: async () => {
        throw new Error('Razorpay keys missing in server configuration.');
      },
      refund: async () => {
        throw new Error('Razorpay keys missing in server configuration.');
      },
    },
  };
}

export default razorpayInstance;
