import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || '/api';
const baseURL = rawBaseURL.replace(/\/+$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true, // required for refresh token cookies
});

let store;
export const injectStore = (_store) => {
  store = _store;
};

// Request interceptor: attach access token from Redux state
api.interceptors.request.use(
  (config) => {
    if (store) {
      const state = store.getState();
      const token = state.auth?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if a token refresh is already in progress to avoid multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for refresh token handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401, we haven't retried yet, and it's not an auth endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token using the backend endpoint
        // Pass stored refresh token in body as cross-domain cookie fallback
        const storedRefreshToken = localStorage.getItem('luxoria_refresh_token');
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken: storedRefreshToken || undefined },
          { withCredentials: true }
        );
        
        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        // Update stored refresh token for future requests
        if (newRefreshToken) {
          localStorage.setItem('luxoria_refresh_token', newRefreshToken);
        }
        
        // Update the store with the new access token
        if (store) {
          store.dispatch({
            type: 'auth/setCredentials',
            payload: {
              user: store.getState().auth.user,
              accessToken: newAccessToken,
            },
          });
        }

        processQueue(null, newAccessToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed, session is truly expired
        localStorage.removeItem('luxoria_has_session');
        localStorage.removeItem('luxoria_refresh_token');
        if (store) {
          store.dispatch({ type: 'auth/logout' });
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
