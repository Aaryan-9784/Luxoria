import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyReviews = createAsyncThunk('reviews/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/reviews/my');
    return res.data.data.reviews;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch reviews');
  }
});

export const updateReview = createAsyncThunk('reviews/update', async ({ id, rating, comment }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/reviews/${id}`, { rating, comment });
    return res.data.data.review;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Failed to update review');
  }
});

export const deleteReview = createAsyncThunk('reviews/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/reviews/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Failed to delete review');
  }
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; })
      .addCase(fetchMyReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateReview.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.reviews[idx] = { ...state.reviews[idx], ...action.payload };
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;
