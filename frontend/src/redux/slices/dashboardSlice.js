import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── localStorage helpers ─────────────────────────────────────────────────────
const WISHLIST_KEY = 'luxoria_wishlist_items';

const loadWishlistFromStorage = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch {}
};

const isMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

// ── Initial state ────────────────────────────────────────────────────────────
const initialState = {
  bookings: [],
  wishlist: loadWishlistFromStorage(), // ← hydrate from storage on startup
  payments: [],
  stats: null,
  loading: false,
  wishlistLoading: false,
  error: null,
};

// ── Thunks ───────────────────────────────────────────────────────────────────
export const fetchMyBookings = createAsyncThunk('dashboard/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/bookings/my?limit=50');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch bookings');
  }
});

export const fetchWishlist = createAsyncThunk('dashboard/fetchWishlist', async (_, { getState, rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    const apiItems = response.data.data.wishlist || [];
    // Preserve any locally-stored mock items (non-MongoDB IDs) that the API doesn't know about
    const localMockItems = getState().dashboard.wishlist.filter(
      w => !isMongoId(w.vehicle?._id || w.vehicle?.id || w.vehicleId || '')
    );
    return { apiItems, localMockItems };
  } catch (error) {
    return rejectWithValue('Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('dashboard/toggleWishlist', async (payload, { getState, rejectWithValue }) => {
  try {
    const vehicleId = typeof payload === 'string' ? payload : payload.vehicleId;
    const vehicleObj = typeof payload === 'object' ? payload.vehicle : null;

    const { wishlist } = getState().dashboard;
    const alreadySaved = wishlist.some(
      w => w.vehicle?._id === vehicleId || w.vehicle?.id === vehicleId || w.vehicleId === vehicleId
    );

    if (!isMongoId(vehicleId)) {
      // Local-only toggle for mock data — no API call
      return { vehicleId, vehicle: vehicleObj, action: alreadySaved ? 'removed' : 'added', mock: true };
    }

    if (alreadySaved) {
      await api.delete(`/wishlist/${vehicleId}`);
      return { vehicleId, action: 'removed' };
    } else {
      await api.post(`/wishlist/${vehicleId}`);
      return { vehicleId, vehicle: vehicleObj, action: 'added' };
    }
  } catch (err) {
    if (err.response?.status === 409) {
      try {
        const vehicleId = typeof payload === 'string' ? payload : payload.vehicleId;
        await api.delete(`/wishlist/${vehicleId}`);
        return { vehicleId, action: 'removed' };
      } catch {
        return rejectWithValue('Failed to update wishlist');
      }
    }
    return rejectWithValue(err.response?.data?.error?.message || 'Failed to update wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('dashboard/removeFromWishlist', async (vehicleId, { rejectWithValue }) => {
  try {
    if (isMongoId(vehicleId)) {
      await api.delete(`/wishlist/${vehicleId}`);
    }
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

// ── Slice ────────────────────────────────────────────────────────────────────
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Bookings ──────────────────────────────────────────────────────────
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        const active = action.payload.filter(b => ['pending', 'confirmed', 'active'].includes(b.status));
        const totalAmount = action.payload.filter(b => b.status === 'completed').reduce((s, b) => s + b.totalAmount, 0);
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

      // ── Wishlist fetch — merge API + local mock items ─────────────────────
      .addCase(fetchWishlist.pending, (state) => { state.wishlistLoading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        const { apiItems, localMockItems } = action.payload;
        // Deduplicate: start with API items, then append any mock items not already covered
        const merged = [...apiItems];
        localMockItems.forEach(mockItem => {
          const mockId = mockItem.vehicle?._id || mockItem.vehicle?.id || mockItem.vehicleId;
          const alreadyIn = merged.some(
            a => (a.vehicle?._id || a.vehicle?.id) === mockId
          );
          if (!alreadyIn) merged.push(mockItem);
        });
        state.wishlist = merged;
        saveWishlistToStorage(merged);
      })
      .addCase(fetchWishlist.rejected, (state) => { state.wishlistLoading = false; })

      // ── Toggle wishlist ───────────────────────────────────────────────────
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { vehicleId, vehicle, action: wishlistAction } = action.payload;
        if (wishlistAction === 'removed') {
          state.wishlist = state.wishlist.filter(
            w => w.vehicle?._id !== vehicleId &&
                 w.vehicle?.id  !== vehicleId &&
                 w.vehicleId    !== vehicleId
          );
        } else if (wishlistAction === 'added') {
          const alreadyIn = state.wishlist.some(
            w => w.vehicle?._id === vehicleId ||
                 w.vehicle?.id  === vehicleId ||
                 w.vehicleId    === vehicleId
          );
          if (!alreadyIn) {
            state.wishlist.push({
              _id: `wishlist-${vehicleId}`,
              vehicleId,
              vehicle: vehicle
                ? { ...vehicle, _id: vehicle._id || vehicleId, id: vehicle.id || vehicleId }
                : { _id: vehicleId, id: vehicleId, name: '', brand: '', pricePerDay: 0 },
              user: null,
              createdAt: new Date().toISOString(),
            });
          }
        }
        saveWishlistToStorage(state.wishlist);
      })
      .addCase(toggleWishlist.rejected, (_state, action) => {
        console.warn('Wishlist toggle failed:', action.payload);
      })

      // ── Remove from wishlist ──────────────────────────────────────────────
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const { vehicleId } = action.payload;
        state.wishlist = state.wishlist.filter(
          w => w.vehicle?._id !== vehicleId &&
               w.vehicle?.id  !== vehicleId &&
               w.vehicleId    !== vehicleId
        );
        saveWishlistToStorage(state.wishlist);
      })

      // ── Cancel Booking ────────────────────────────────────────────────────
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.bookings[index] = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
