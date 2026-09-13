import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  currentBooking: null,
  paymentDetails: null,
  loading: false,
  error: null,
};

// Step 1: Create a pending booking
export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create booking. Dates may be unavailable.');
    }
  }
);

// Step 2: Initialize Razorpay order from backend
export const createPaymentOrder = createAsyncThunk(
  'booking/createOrder',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/create-order', { bookingId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to initialize payment.');
    }
  }
);

// Step 3: Verify Razorpay signature
export const verifyPayment = createAsyncThunk(
  'booking/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Payment verification failed.');
    }
  }
);

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingState: (state) => {
      state.currentBooking = null;
      state.paymentDetails = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        // The backend returns updated booking and payment records
        state.currentBooking = action.payload.booking;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
