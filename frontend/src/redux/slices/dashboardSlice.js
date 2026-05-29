import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  bookings: [],
  wishlist: [],
  payments: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk('dashboard/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/bookings/my?limit=50');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch bookings');
  }
});

export const fetchWishlist = createAsyncThunk('dashboard/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    return response.data.data.wishlist;
  } catch (error) {
    return rejectWithValue('Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('dashboard/toggleWishlist', async (vehicleId, { rejectWithValue }) => {
  try {
    // Attempt to add. If it conflicts (409), the backend might throw, so we catch and remove.
    // For a cleaner approach, the component should know if it's adding or removing.
    // But we'll try adding, and if 409, we remove.
    try {
      await api.post(`/wishlist/${vehicleId}`);
      return { vehicleId, action: 'added' };
    } catch (err) {
      if (err.response?.status === 409) {
        await api.delete(`/wishlist/${vehicleId}`);
        return { vehicleId, action: 'removed' };
      }
      throw err;
    }
  } catch (error) {
    return rejectWithValue('Failed to update wishlist');
  }
});

export const cancelBooking = createAsyncThunk('dashboard/cancelBooking', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/bookings/${id}/cancel`, { cancellationReason: reason });
    return response.data.data.booking;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to cancel booking');
  }
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Bookings
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        
        // Compute basic stats
        const active = action.payload.filter(b => ['pending', 'confirmed', 'active'].includes(b.status));
        const totalAmount = action.payload.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalAmount, 0);
        state.stats = {
          totalBookings: action.payload.length,
          activeBookings: active.length,
          totalSpent: totalAmount,
          loyaltyPoints: Math.floor(totalAmount / 100),
        };
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Wishlist
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.action === 'removed') {
          state.wishlist = state.wishlist.filter(w => w.vehicle._id !== action.payload.vehicleId);
        } else {
          // If added, we might need a refetch to get the populated vehicle object
          // For now, it will be added on next fetch or handled by component
        }
      })
      
      // Cancel Booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  }
});

export default dashboardSlice.reducer;
