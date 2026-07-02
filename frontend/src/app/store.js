import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import uiReducer from '../redux/slices/uiSlice';
import vehicleReducer from '../redux/slices/vehicleSlice';
import bookingReducer from '../redux/slices/bookingSlice';
import dashboardReducer from '../redux/slices/dashboardSlice';
import vendorReducer from '../redux/slices/vendorSlice';
import adminReducer from '../redux/slices/adminSlice';
import notificationReducer from '../redux/slices/notificationSlice';
import reviewReducer from '../redux/slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    vehicle: vehicleReducer,
    booking: bookingReducer,
    dashboard: dashboardReducer,
    vendor: vendorReducer,
    admin: adminReducer,
    notifications: notificationReducer,
    reviews: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

