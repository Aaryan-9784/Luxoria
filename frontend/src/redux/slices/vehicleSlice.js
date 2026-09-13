import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Canonical image map for the 6 approved cars ──────────────────────────────
// Keyed by lowercase "brand|name" so DB vehicles always show the correct image
const CANONICAL_IMAGES = {
  'rolls-royce|ghost series ii': 'https://calibremag.com/wp-content/uploads/2025/04/Rolls-Royce-Ghost-Series-II-Scotland-2025-CALIBRE-01.webp',
  'ferrari|296 gtb':             'https://images.collectingcars.com/081193/AS-01-10-06.jpg?w=1920&q=95',
  'bugatti|mistral':             'https://cdn.motor1.com/images/mgl/eoBpg8/s1/bugatti-brouillard.webp',
  'lamborghini|huracán evo':     'https://houstonexotics.blob.core.windows.net/ech-ga12749/full/1img4066.jpg',
  'lamborghini|huracan evo':     'https://houstonexotics.blob.core.windows.net/ech-ga12749/full/1img4066.jpg',
  'porsche|911 turbo s':         'https://images.collectingcars.com/023148/DSC03123-EDITED.jpg?w=3840&q=75',
  'mclaren|720s':                'https://issimi-vehicles-cdn.b-cdn.net/publicamlvehiclemanagement/VehicleDetails/628/timestamped-1722570747278-2018%20McLaren%20720S_001.jpg?width=3840&quality=75',
};

/**
 * Returns the canonical image URL for a vehicle if it matches one of the 6
 * known cars, otherwise falls back to whatever the DB stored.
 */
function resolveVehicleImage(vehicle) {
  const key = `${(vehicle.brand || '').toLowerCase()}|${(vehicle.name || '').toLowerCase()}`;
  return CANONICAL_IMAGES[key] || vehicle.images?.[0]?.url || vehicle.image || null;
}

/**
 * Normalise a DB vehicle for use in Redux state, injecting the canonical image.
 */
function normaliseDbVehicle(v) {
  return {
    ...v,
    id: v._id || v.id,
    image: resolveVehicleImage(v),
    isAvailable: v.availability === 'available' || v.isAvailable,
  };
}

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
  publicStats: null,

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

      const response = await api.get(`/vehicles?${queryParams.toString()}`);
      return response.data;
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
      const response = await api.get('/vehicles/featured');
      const vehicles = response.data?.data?.vehicles || response.data?.data || [];
      return vehicles.map(normaliseDbVehicle);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch featured vehicles');
    }
  }
);

// Fetch public database metrics for statistics showcases
export const fetchPublicStats = createAsyncThunk(
  'vehicle/fetchPublicStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/vehicles/stats');
      return response.data?.data || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch public stats');
    }
  }
);

// Fetch single vehicle details
export const fetchVehicleById = createAsyncThunk(
  'vehicle/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data?.data?.vehicle || response.data?.data;
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
        // Check if backend returned real data
        const backendVehicles = action.payload.data || [];
        const raw = action.payload.pagination || {};
        const backendPagination = {
          page: raw.page || 1,
          limit: raw.limit || 12,
          total: raw.total ?? raw.totalResults ?? 0,
          // backend sends 'totalPages'; normalise to 'pages' used throughout the frontend
          pages: raw.pages ?? raw.totalPages ?? 0,
        };
        
        state.vehicles = backendVehicles.map(normaliseDbVehicle);
        state.pagination = backendPagination;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedVehicles.fulfilled, (state, action) => {
        state.featuredVehicles = action.payload;
      })
      .addCase(fetchPublicStats.fulfilled, (state, action) => {
        state.publicStats = action.payload;
      })
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        const v = action.payload;
        // Inject canonical image if this is a DB vehicle (has _id)
        state.vehicleDetails = v?._id ? normaliseDbVehicle(v) : v;
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
