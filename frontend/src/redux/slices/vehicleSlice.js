import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  vehicles: [],
  featuredVehicles: [],
  vehicleDetails: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    search: '',
    brand: '',
    category: '',
    transmission: '',
    fuelType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    seats: '',
  },
  sortBy: '-createdAt', // Default sorting
  viewMode: 'grid', // 'grid' | 'list'
};

// Fetch paginated and filtered vehicles
export const fetchVehicles = createAsyncThunk(
  'vehicle/fetchVehicles',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination, sortBy } = getState().vehicle;
      
      // Build query string
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
      });

      // Append active filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await api.get(`/vehicles?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vehicles');
    }
  }
);

// Fetch featured vehicles for homepage
export const fetchFeaturedVehicles = createAsyncThunk(
  'vehicle/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/vehicles/featured');
      return response.data.data.vehicles;
    } catch (error) {
      return rejectWithValue('Failed to fetch featured vehicles');
    }
  }
);

// Fetch single vehicle details
export const fetchVehicleById = createAsyncThunk(
  'vehicle/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data.data.vehicle;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vehicle details');
    }
  }
);

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 on filter change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.pagination.page = 1;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedVehicles.fulfilled, (state, action) => {
        state.featuredVehicles = action.payload;
      })
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleDetails = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, clearFilters, setPage, setSortBy, setViewMode } = vehicleSlice.actions;
export default vehicleSlice.reducer;
