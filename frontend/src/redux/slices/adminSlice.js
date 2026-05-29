import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  analytics: null,
  users: [],
  vendors: [],
  vehicles: [],
  bookings: [],
  loading: false,
  error: null,
  totalUsers: 0,
  totalVendors: 0,
  totalVehicles: 0,
  totalBookings: 0,
};

// Async Thunks
export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data.data.analytics;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch analytics');
  }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (queryParams = '', { rejectWithValue }) => {
  try {
    const response = await api.get(`/admin/users${queryParams}`);
    return { users: response.data.data, total: response.data.pagination.total };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch users');
  }
});

export const updateUserStatus = createAsyncThunk('admin/updateUserStatus', async ({ id, isActive }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to update user status');
  }
});

export const fetchVendors = createAsyncThunk('admin/fetchVendors', async (queryParams = '', { rejectWithValue }) => {
  try {
    const response = await api.get(`/admin/vendors${queryParams}`);
    return { vendors: response.data.data, total: response.data.pagination.total };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vendors');
  }
});

export const approveVendor = createAsyncThunk('admin/approveVendor', async ({ id, isVerified }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/vendors/${id}/approve`, { isVerified });
    return response.data.data.vendor;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to approve vendor');
  }
});

export const fetchAdminVehicles = createAsyncThunk('admin/fetchVehicles', async (queryParams = '', { rejectWithValue }) => {
  try {
    const response = await api.get(`/admin/vehicles${queryParams}`);
    return { vehicles: response.data.data, total: response.data.pagination.total };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vehicles');
  }
});

export const approveVehicle = createAsyncThunk('admin/approveVehicle', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/vehicles/${id}/approve`, { status });
    return response.data.data.vehicle;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to approve vehicle');
  }
});

export const fetchAdminBookings = createAsyncThunk('admin/fetchBookings', async (queryParams = '', { rejectWithValue }) => {
  try {
    const response = await api.get(`/admin/bookings${queryParams}`);
    return { bookings: response.data.data, total: response.data.pagination.total };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch bookings');
  }
});

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Analytics
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Users
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.total;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
      })
      
      // Vendors
      .addCase(fetchVendors.pending, (state) => { state.loading = true; })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.vendors;
        state.totalVendors = action.payload.total;
      })
      .addCase(approveVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(v => v._id === action.payload._id);
        if (index !== -1) state.vendors[index] = action.payload;
      })
      
      // Vehicles
      .addCase(fetchAdminVehicles.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.vehicles;
        state.totalVehicles = action.payload.total;
      })
      .addCase(approveVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex(v => v._id === action.payload._id);
        if (index !== -1) state.vehicles[index] = action.payload;
      })
      
      // Bookings
      .addCase(fetchAdminBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.totalBookings = action.payload.total;
      });
  }
});

export default adminSlice.reducer;
