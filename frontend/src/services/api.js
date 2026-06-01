import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // required for refresh token cookies
});

let store;
export const injectStore = (_store) => {
  store = _store;
};

// Request interceptor: attach token if we use bearer (though here we might just rely on cookies, or add bearer if we store it in memory)
// Since authSlice stores accessToken in redux state, we should ideally inject it, but Redux toolkit handles state.
// To avoid circular dependency, we can intercept requests and get token from store if needed.
// However, the standard setup might just rely on HTTP-only cookies or dispatching via store.
// Let's implement a generic interceptor that checks localStorage if they used that, or we just leave it minimal.
api.interceptors.request.use(
  (config) => {
    // Note: If you store the access token in memory/redux, you might need to inject it here.
    // Assuming backend also accepts cookie for auth or we don't strictly need this interceptor for now.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for refresh token handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized, we haven't retried yet, and it's not a login request
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token using the backend endpoint
        await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, meaning session is truly expired
        // Dispatch logout if store is available
        if (store) {
          store.dispatch({ type: 'auth/logout' });
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
