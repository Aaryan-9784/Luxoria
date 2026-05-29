import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  vehicles: [],
  bookings: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchVendorVehicles = createAsyncThunk('vendor/fetchVehicles', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/vehicles/vendor?limit=50');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vendor vehicles');
  }
});

export const fetchVendorBookings = createAsyncThunk('vendor/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/bookings/vendor?limit=50');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vendor bookings');
  }
});

export const updateBookingStatus = createAsyncThunk('vendor/updateBookingStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data.data.booking;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to update booking status');
  }
});

export const createVendorVehicle = createAsyncThunk('vendor/createVehicle', async (vehicleData, { rejectWithValue }) => {
  try {
    const response = await api.post('/vehicles', vehicleData);
    return response.data.data.vehicle;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to create vehicle');
  }
});

export const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Vehicles
      .addCase(fetchVendorVehicles.pending, (state) => { state.loading = true; })
      .addCase(fetchVendorVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
        // Basic stat computation
        state.stats = {
          ...state.stats,
          totalVehicles: action.payload.length,
          pendingApprovals: action.payload.filter(v => v.status === 'pending').length
        };
      })
      .addCase(fetchVendorVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Bookings
      .addCase(fetchVendorBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchVendorBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        
        // Compute revenue and active stats
        const revenue = action.payload
          .filter(b => b.status === 'completed' || b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalAmount, 0);
          
        const active = action.payload.filter(b => ['pending', 'confirmed', 'active'].includes(b.status));

        state.stats = {
          ...state.stats,
          totalRevenue: revenue,
          activeRentals: active.length,
          totalBookings: action.payload.length
        };
      })
      .addCase(fetchVendorBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Booking Status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      
      // Create Vehicle
      .addCase(createVendorVehicle.fulfilled, (state, action) => {
        state.vehicles.unshift(action.payload);
        if (state.stats) {
          state.stats.totalVehicles += 1;
          if (action.payload.status === 'pending') {
            state.stats.pendingApprovals += 1;
          }
        }
      });
  }
});

export default vendorSlice.reducer;
