import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { FEATURED_VEHICLES } from '../../pages/vehicles/data/vehiclesPageData';
import { HOME_FEATURED_VEHICLES } from '../../sections/FeaturedVehicles';
import { vehicles as COLLECTION_VEHICLES } from '../../pages/public/components/collection/data';

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
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(id));
      
      if (!isMongoId) {
        const vehicle = FEATURED_VEHICLES.find(v => String(v.id) === String(id)) ||
                        HOME_FEATURED_VEHICLES.find(v => String(v.id) === String(id)) ||
                        COLLECTION_VEHICLES.find(v => String(v.id) === String(id));
        if (vehicle) return vehicle;
        throw new Error('Mock vehicle not found');
      }

      try {
        const response = await api.get(`/vehicles/${id}`);
        return response.data.data.vehicle;
      } catch (err) {
        const vehicle = FEATURED_VEHICLES.find(v => String(v.id) === String(id)) ||
                        HOME_FEATURED_VEHICLES.find(v => String(v.id) === String(id)) ||
                        COLLECTION_VEHICLES.find(v => String(v.id) === String(id));
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
        
        if (backendVehicles.length > 0) {
          // Use real backend data, normalising images to the canonical set
          state.vehicles = backendVehicles.map(normaliseDbVehicle);
          state.pagination = backendPagination;
        } else {
          // Fallback to filtered mock data when backend is empty
          let filteredVehicles = [...FEATURED_VEHICLES];
          const { filters } = state;
          
          // Client-side filtering for mock data
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredVehicles = filteredVehicles.filter(v =>
              v.name?.toLowerCase().includes(searchLower) ||
              v.brand?.toLowerCase().includes(searchLower) ||
              v.model?.toLowerCase().includes(searchLower)
            );
          }
          
          if (filters.brand) {
            filteredVehicles = filteredVehicles.filter(v =>
              v.brand?.toLowerCase() === filters.brand.toLowerCase()
            );
          }
          
          if (filters.category) {
            filteredVehicles = filteredVehicles.filter(v =>
              v.category?.toLowerCase() === filters.category.toLowerCase()
            );
          }
          
          if (filters.city) {
            filteredVehicles = filteredVehicles.filter(v =>
              v.location?.toLowerCase().includes(filters.city.toLowerCase()) ||
              v.city?.toLowerCase().includes(filters.city.toLowerCase())
            );
          }
          
          if (filters.transmission) {
            filteredVehicles = filteredVehicles.filter(v =>
              v.transmission?.toLowerCase() === filters.transmission.toLowerCase()
            );
          }
          
          if (filters.fuelType) {
            filteredVehicles = filteredVehicles.filter(v =>
              v.fuelType?.toLowerCase() === filters.fuelType.toLowerCase()
            );
          }
          
          if (filters.seats) {
            filteredVehicles = filteredVehicles.filter(v =>
              Number(v.seats) >= Number(filters.seats)
            );
          }
          
          if (filters.minPrice) {
            filteredVehicles = filteredVehicles.filter(v =>
              Number(v.pricePerDay) >= Number(filters.minPrice)
            );
          }
          
          if (filters.maxPrice) {
            filteredVehicles = filteredVehicles.filter(v =>
              Number(v.pricePerDay) <= Number(filters.maxPrice)
            );
          }
          
          // Client-side sorting
          const sortBy = state.sortBy;
          if (sortBy === 'featured') {
            // Keep default order for featured
          } else if (sortBy === '-createdAt') {
            // Sort by newest first (descending date)
            filteredVehicles.sort((a, b) => {
              const dateA = new Date(a.createdAt || 0);
              const dateB = new Date(b.createdAt || 0);
              return dateB - dateA;
            });
          } else if (sortBy === '-bookingCount') {
            // Sort by most popular (highest booking count)
            filteredVehicles.sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0));
          } else if (sortBy === '-rating.average') {
            // Sort by highest rated
            filteredVehicles.sort((a, b) => (b.rating?.average || b.rating || 0) - (a.rating?.average || a.rating || 0));
          } else if (sortBy === 'pricePerDay') {
            // Sort by price low to high
            filteredVehicles.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
          } else if (sortBy === '-pricePerDay') {
            // Sort by price high to low
            filteredVehicles.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
          }
          
          state.vehicles = filteredVehicles;
          state.pagination = {
            page: 1,
            limit: filteredVehicles.length,
            total: filteredVehicles.length,
            pages: 1,
          };
        }
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
