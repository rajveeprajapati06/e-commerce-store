import axios from 'axios';

// Create central Axios instance
const API = axios.create({
  baseURL: 'https://e-commerce-store1-4gkd.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Authorization token automatically
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('authUserInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Interceptor to handle 401 Unauthorized errors automatically
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or user not found in database. Wiping credentials...');
      localStorage.removeItem('authUserInfo');
      
      // Avoid infinite loop if already on login page
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

// 1. Auth Services
export const loginUser = async (email, password) => {
  const response = await API.post('/api/users/login', { email, password });
  return response.data;
};

export const registerNewUser = async (name, email, password) => {
  const response = await API.post('/api/users', { name, email, password });
  return response.data;
};

export const getUserDetails = async () => {
  const response = await API.get('/api/users/profile');
  return response.data;
};

export const updateUserProfileApi = async (userData) => {
  const response = await API.put('/api/users/profile', userData);
  return response.data;
};

// 2. Product Services
export const fetchProducts = async (filters = {}) => {
  const { keyword, category, minPrice, maxPrice, sort } = filters;
  const params = new URLSearchParams();
  
  if (keyword) params.append('keyword', keyword);
  if (category) params.append('category', category);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  if (sort) params.append('sort', sort);

  const response = await API.get(`/api/products?${params.toString()}`);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await API.get(`/api/products/${id}`);
  return response.data;
};

export const addProductApi = async () => {
  const response = await API.post('/api/products');
  return response.data;
};

export const editProductApi = async (id, productData) => {
  const response = await API.put(`/api/products/${id}`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await API.delete(`/api/products/${id}`);
  return response.data;
};

// 3. Order Services
export const createOrderApi = async (orderData) => {
  const response = await API.post('/api/orders', orderData);
  return response.data;
};

export const fetchOrderById = async (id) => {
  const response = await API.get(`/api/orders/${id}`);
  return response.data;
};

export const fetchMyOrders = async () => {
  const response = await API.get('/api/orders/myorders');
  return response.data;
};

export const fetchAllOrdersAdmin = async () => {
  const response = await API.get('/api/orders');
  return response.data;
};

export const updateOrderToPaidApi = async (id, paymentResult) => {
  const response = await API.put(`/api/orders/${id}/pay`, paymentResult);
  return response.data;
};

export const updateOrderToDeliveredApi = async (id) => {
  const response = await API.put(`/api/orders/${id}/deliver`, {});
  return response.data;
};

export const fetchAdminStatsApi = async () => {
  const response = await API.get('/api/orders/stats');
  return response.data;
};

// 4. Payment Integration Services (Razorpay)
export const initRazorpayOrderApi = async (amount) => {
  const response = await API.post('/api/payments/order', { amount });
  return response.data;
};

export const verifyRazorpayPaymentApi = async (verificationPayload) => {
  const response = await API.post('/api/payments/verify', verificationPayload);
  return response.data;
};

export default API;
