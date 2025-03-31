import axios from 'axios';

// Create a custom instance of axios with a base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080', // Express server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error responses here
    return Promise.reject(error);
  }
);

export default api;