import axios from 'axios';
import { API_BASE_URL } from '@env';
import store, { persistor } from '../redux/store';
import { logout as reduxLogout } from '../redux/slices/authSlice';
import ToastView from '../components/Toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/* ---------------- Request Interceptor ---------------- */
api.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- Response Interceptor ---------------- */
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isLoginRoute = error.config?.url?.includes('/auth/login');
    const status = error.response?.status;

    if ([401, 403].includes(status) && !isLoginRoute && !isLoggingOut) {
      isLoggingOut = true;

      const message =
        error.response?.data?.message || 'Session expired. Please login again.';

      if (typeof ToastView?.error === 'function') {
        ToastView.error(message);
      }

      store.dispatch(reduxLogout());

      await persistor.purge();

      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);
    }

    return Promise.reject(error);
  }
);

/* ---------------- API Helper Exports ---------------- */
export const apiService = {
  get: (endpoint) => api.get(endpoint),
  post: (endpoint, data) => api.post(endpoint, data),
  put: (endpoint, data) => api.put(endpoint, data),
  patch: (endpoint, data) => api.patch(endpoint, data),
  delete: (endpoint, data) => api.delete(endpoint, { data }),
};

export default api;