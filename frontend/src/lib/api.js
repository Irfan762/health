import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Machines API
export const machinesAPI = {
  getAll: (params) => api.get('/machines', { params }),
  getById: (id) => api.get(`/machines/${id}`),
  create: (data) => api.post('/machines', data),
  update: (id, data) => api.put(`/machines/${id}`, data),
  delete: (id) => api.delete(`/machines/${id}`),
  getCategories: () => api.get('/machines/meta/categories'),
};

// Rentals API
export const rentalsAPI = {
  createRequest: (data) => api.post('/rentals/request', data),
  getMyRequests: () => api.get('/rentals/my-requests'),
  getAllRequests: (params) => api.get('/rentals/requests', { params }),
  updateRequestStatus: (id, data) => api.put(`/rentals/requests/${id}/status`, data),
  markAsReturned: (id) => api.put(`/rentals/${id}/return`),
  getStats: () => api.get('/rentals/stats'),
};

// Purchases API
export const purchasesAPI = {
  create: (data) => api.post('/purchases', data),
  getMyPurchases: () => api.get('/purchases/my-purchases'),
  getAll: (params) => api.get('/purchases', { params }),
  updateStatus: (id, data) => api.put(`/purchases/${id}/status`, data),
  getStats: () => api.get('/purchases/stats'),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  getStats: () => api.get('/users/stats/overview'),
};

export default api;