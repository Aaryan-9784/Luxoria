import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Fetch all notifications for the current user (user/vendor/admin)
export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/notifications');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch notifications');
  }
});

// Mark a single notification as read
export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id, { rejectWithValue }) => {
  try {
    await api.put(`/notifications/${id}/read`);
    return { _id: id };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to mark notification as read');
  }
});

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async (_, { rejectWithValue }) => {
  try {
    await api.put('/notifications/read-all');
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to mark all as read');
  }
});

// Delete a single notification
export const deleteNotification = createAsyncThunk('notifications/deleteOne', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/notifications/${id}`);
    return { _id: id };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete notification');
  }
});

// Delete all notifications
export const deleteAllNotifications = createAsyncThunk('notifications/deleteAll', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/notifications');
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete all notifications');
  }
});

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // For handling real-time socket events in the future
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // The backend returns { notifications, unreadCount } inside response.data.data
        if (action.payload && action.payload.notifications) {
          state.notifications = action.payload.notifications;
          state.unreadCount = action.payload.unreadCount !== undefined 
            ? action.payload.unreadCount 
            : action.payload.notifications.filter(n => !n.isRead).length;
        } else if (Array.isArray(action.payload)) {
          // Fallback in case the API changes to return an array directly
          state.notifications = action.payload;
          state.unreadCount = action.payload.filter(n => !n.isRead).length;
        } else {
          state.notifications = [];
          state.unreadCount = 0;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1 && !state.notifications[index].isRead) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const wasUnread = state.notifications.find(n => n._id === action.payload._id && !n.isRead);
        state.notifications = state.notifications.filter(n => n._id !== action.payload._id);
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
