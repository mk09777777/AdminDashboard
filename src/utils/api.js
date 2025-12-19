import axios from 'axios';

const API_BASE_URL = 'https://foodorderbackend-fhmg.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Restaurant Items
  getRestaurantItems: () => api.get('/admin/restaurant-items'),
  
  // Image Upload
  uploadImage: (formData) => api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Trendy Items
  getTrendyItems: () => api.get('/admin/trendy-items'),
  createTrendyItem: (data) => api.post('/admin/trendy-items', data),
  updateTrendyItem: (id, data) => api.put(`/admin/trendy-items/${id}`, data),
  deleteTrendyItem: (id) => api.delete(`/admin/trendy-items/${id}`),
  
  // Banners
  getBanners: () => api.get('/admin/banners'),
  createBanner: (data) => api.post('/admin/banners', data),
  updateBanner: (id, data) => api.put(`/admin/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
  
  // Restaurants
  getRestaurants: () => api.get('/admin/restaurants'),
  updateRestaurantStatus: (id, status) => api.put(`/admin/restaurants/${id}/status`, { isActive: status }),
  
  // Cuisines
  getCuisines: () => api.get('/admin/cuisines'),
  createCuisine: (data) => api.post('/admin/cuisines', data),
  deleteCuisine: (id) => api.delete(`/admin/cuisines/${id}`),
  
  // Highlights
  getHighlights: () => api.get('/admin/highlights'),
  createHighlight: (data) => api.post('/admin/highlights', data),
  deleteHighlight: (id) => api.delete(`/admin/highlights/${id}`),
  
  // Restaurant Access
  getRestaurantAccess: (restaurantId) => api.post(`/admin/restaurant-access/${restaurantId}`),
};

export const restaurantAPI = {
  // Orders
  getOrders: () => api.get('/restaurant-dashboard/orders'),
  updateOrderStatus: (orderId, status) => api.put(`/restaurant-dashboard/orders/${orderId}/status`, { status }),
  
  // Menu Items
  getMenuItems: () => api.get('/restaurant-dashboard/items'),
  createMenuItem: (data) => api.post('/restaurant-dashboard/items', data),
  updateMenuItem: (itemId, data) => api.put(`/restaurant-dashboard/items/${itemId}`, data),
  deleteMenuItem: (itemId) => api.delete(`/restaurant-dashboard/items/${itemId}`),
  toggleItemAvailability: (itemId, isAvailable) => api.put(`/restaurant-dashboard/items/${itemId}/availability`, { isAvailable }),
  
  // Restaurant Info
  getDashboardData: () => api.get('/restaurant-dashboard/dashboard'),
  updateRestaurantInfo: (data) => api.put('/restaurant-dashboard/info', data),
  
  // Analytics
  getAnalytics: () => api.get('/restaurant-dashboard/analytics'),
};

export default api;