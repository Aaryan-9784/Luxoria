import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../services/api';

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Login failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch profile');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to send reset email');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to reset password');
  }
});


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      // Use raw axios to prevent interceptor from triggering a refresh token flow if access token is already expired during logout
      const baseURL = import.meta.env.VITE_API_URL || '/api';
      axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true }).catch(() => {});
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile (used on app load to restore session if refresh token is valid)
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        // token is handled by the api interceptor which will refresh if needed
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, updateUser, logout, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
