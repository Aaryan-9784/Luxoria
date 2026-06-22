import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { FEATURED_VEHICLES } from '../../pages/vehicles/data/vehiclesPageData';

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

  // ── New: Vehicles Page Enhanced State ──
  wishlist: JSON.parse(localStorage.getItem('luxoria_wishlist') || '[]'),
  compareList: [], // max 3 vehicles
  recentlyViewed: JSON.parse(localStorage.getItem('luxoria_recently_viewed') || '[]'),
  quickViewVehicle: null,
  savedFilters: JSON.parse(localStorage.getItem('luxoria_saved_filters') || 'null'),
};

// Fetch paginated and filtered vehicles
export const fetchVehicles = createAsyncThunk(
  'vehicle/fetchVehicles',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination, sortBy } = getState().vehicle;
      
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      try {
        const response = await api.get(`/vehicles?${queryParams.toString()}`);
        
        // Fallback to mock data if the database is completely empty
        if (response.data && response.data.data && response.data.data.length === 0) {
          return {
            data: FEATURED_VEHICLES,
            pagination: { page: 1, limit: 12, total: FEATURED_VEHICLES.length, pages: 1 }
          };
        }
        
        return response.data;
      } catch (err) {
        console.warn('API fetch failed, falling back to mock data');
        return {
          data: FEATURED_VEHICLES,
          pagination: { page: 1, limit: 12, total: FEATURED_VEHICLES.length, pages: 1 }
        };
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch vehicles');
    }
  }
);

// Fetch featured vehicles for homepage
export const fetchFeaturedVehicles = createAsyncThunk(
  'vehicle/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      try {
        const response = await api.get('/vehicles/featured');
        const vehicles = response.data?.data?.vehicles || response.data?.data || [];
        
        if (vehicles.length === 0) {
          return FEATURED_VEHICLES;
        }
        
        return vehicles;
      } catch (err) {
        return FEATURED_VEHICLES;
      }
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
      // Intercept mock IDs to prevent 400 Bad Request errors from MongoDB CastError
      if (typeof id === 'string' && id.startsWith('feat-')) {
        const vehicle = FEATURED_VEHICLES.find(v => v.id === id);
        if (vehicle) return vehicle;
        throw new Error('Mock vehicle not found');
      }

      try {
        const response = await api.get(`/vehicles/${id}`);
        return response.data.data.vehicle;
      } catch (err) {
        const vehicle = FEATURED_VEHICLES.find(v => v.id === id);
        if (vehicle) return vehicle;
        throw err;
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch vehicle details');
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

    // ── New: Wishlist ──
    toggleWishlist: (state, action) => {
      const vehicleId = action.payload;
      const idx = state.wishlist.indexOf(vehicleId);
      if (idx > -1) {
        state.wishlist.splice(idx, 1);
      } else {
        state.wishlist.push(vehicleId);
      }
      localStorage.setItem('luxoria_wishlist', JSON.stringify(state.wishlist));
    },

    // ── New: Compare (max 3) ──
    addToCompare: (state, action) => {
      const vehicle = action.payload;
      if (state.compareList.length < 3 && !state.compareList.find(v => v.id === vehicle.id)) {
        state.compareList.push(vehicle);
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter(v => v.id !== action.payload);
    },
    clearCompare: (state) => {
      state.compareList = [];
    },

    // ── New: Quick View ──
    setQuickView: (state, action) => {
      state.quickViewVehicle = action.payload;
    },
    clearQuickView: (state) => {
      state.quickViewVehicle = null;
    },

    // ── New: Recently Viewed ──
    addToRecentlyViewed: (state, action) => {
      const vehicle = action.payload;
      state.recentlyViewed = [
        vehicle,
        ...state.recentlyViewed.filter(v => v.id !== vehicle.id),
      ].slice(0, 10);
      localStorage.setItem('luxoria_recently_viewed', JSON.stringify(state.recentlyViewed));
    },

    // ── New: Save/Load Filters ──
    saveCurrentFilters: (state) => {
      state.savedFilters = { ...state.filters };
      localStorage.setItem('luxoria_saved_filters', JSON.stringify(state.filters));
    },
    loadSavedFilters: (state) => {
      if (state.savedFilters) {
        state.filters = { ...state.savedFilters };
        state.pagination.page = 1;
      }
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

export const {
  setFilter,
  clearFilters,
  setPage,
  setSortBy,
  setViewMode,
  toggleWishlist,
  addToCompare,
  removeFromCompare,
  clearCompare,
  setQuickView,
  clearQuickView,
  addToRecentlyViewed,
  saveCurrentFilters,
  loadSavedFilters,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
