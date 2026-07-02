import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  bookings: [],
  wishlist: [],
  payments: [],
  stats: null,
  loading: false,
  wishlistLoading: false,
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

export const toggleWishlist = createAsyncThunk('dashboard/toggleWishlist', async (vehicleId, { getState, rejectWithValue }) => {
  try {
    // Check if already in wishlist to decide add or remove
    const { wishlist } = getState().dashboard;
    const alreadySaved = wishlist.some(
      w => w.vehicle?._id === vehicleId || w.vehicle?.id === vehicleId
    );

    if (alreadySaved) {
      await api.delete(`/wishlist/${vehicleId}`);
      return { vehicleId, action: 'removed' };
    } else {
      await api.post(`/wishlist/${vehicleId}`);
      return { vehicleId, action: 'added' };
    }
  } catch (err) {
    // Fallback: if 409 conflict on add, remove instead
    if (err.response?.status === 409) {
      try {
        await api.delete(`/wishlist/${vehicleId}`);
        return { vehicleId, action: 'removed' };
      } catch (removeErr) {
        return rejectWithValue('Failed to update wishlist');
      }
    }
    return rejectWithValue(err.response?.data?.error?.message || 'Failed to update wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('dashboard/removeFromWishlist', async (vehicleId, { rejectWithValue }) => {
  try {
    await api.delete(`/wishlist/${vehicleId}`);
    return { vehicleId };
  } catch (error) {
    return rejectWithValue('Failed to remove from wishlist');
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
      .addCase(fetchWishlist.pending, (state) => { state.wishlistLoading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => { state.wishlistLoading = false; })

      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.action === 'removed') {
          state.wishlist = state.wishlist.filter(
            w => w.vehicle?._id !== action.payload.vehicleId && w.vehicle?.id !== action.payload.vehicleId
          );
        }
        // 'added' case: the full wishlist item (with populated vehicle) is fetched
        // lazily — we insert a minimal placeholder and let the next fetchWishlist fill it in.
        // The isWishlisted check in UI will use vehicleId directly.
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(
          w => w.vehicle?._id !== action.payload.vehicleId && w.vehicle?.id !== action.payload.vehicleId
        );
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
