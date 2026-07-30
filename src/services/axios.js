import axios from 'axios';
import { API_BASE_URL } from '@env';
import store from '../redux/store';

const getHeaders = () => {
  const { token } = store.getState().auth;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiService = {
  get: endpoint =>
    axios.get(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() }),
  post: (endpoint, data) =>
    axios.post(`${API_BASE_URL}${endpoint}`, data, { headers: getHeaders() }),
  put: (endpoint, data) =>
    axios.put(`${API_BASE_URL}${endpoint}`, data, { headers: getHeaders() }),
  patch: (endpoint, data) =>
    axios.patch(`${API_BASE_URL}${endpoint}`, data, { headers: getHeaders() }),
  delete: (endpoint, data) =>
    axios.delete(`${API_BASE_URL}${endpoint}`, { data, headers: getHeaders() }),
};
