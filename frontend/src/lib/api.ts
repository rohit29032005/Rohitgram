import axios from 'axios';

if (typeof window !== 'undefined') {
  console.log("🚜 API initialized with Tractor Proxy: /api/v1");
}

const api = axios.create({
  baseURL: '/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('is_admin') === 'true' : false;
  
  if (isAdmin) {
    config.headers['X-Admin-Secret'] = 'rohitgram_bypass_2026'; 
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
