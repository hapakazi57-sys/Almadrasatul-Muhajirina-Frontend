import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
});

// Kila request tunaweka token ya admin aliyeingia (kama ipo)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('amm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Endapo token imekwisha muda (401), mrudishe admin Login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('amm_token');
      localStorage.removeItem('amm_admin');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
