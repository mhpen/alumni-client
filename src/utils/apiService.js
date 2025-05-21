import axios from 'axios';
import { API_BASE_URL } from './api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Use the API_BASE_URL from api.js
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // Set to false for CORS
  timeout: 15000 // 15 second timeout (increased for potential slow initial connections)
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle different types of errors
    if (error.message === 'Network Error') {
      console.error('Network error - possible CORS issue or server unavailable');
      // Add more detailed logging
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    }

    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Auth methods
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      console.log('Using API URL:', API_BASE_URL);
      const response = await apiClient.post('admin/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Dashboard data methods
  getDashboardData: async () => {
    try {
      const response = await apiClient.get('admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Analytics methods
  getAnalytics: async (endpoint) => {
    try {
      const response = await apiClient.get(`analytics/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching analytics for ${endpoint}:`, error);
      throw error;
    }
  },

  // Model methods
  getModels: async () => {
    try {
      const response = await apiClient.get('prediction/models');
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  runPrediction: async (modelId, data) => {
    try {
      // Determine which endpoint to use based on the model ID
      let endpoint = '';
      if (modelId === 'career-path-prediction') {
        endpoint = 'career-path-prediction';
      } else if (modelId === 'employment-probability-post-graduation') {
        endpoint = 'employment-probability';
      } else {
        // Default to the model ID if it doesn't match known endpoints
        endpoint = modelId;
      }

      console.log(`Making prediction request to: prediction/${endpoint}`);
      console.log('Input data:', data);

      const response = await apiClient.post(`prediction/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Error running prediction:', error);
      throw error;
    }
  },

  // Generic methods
  get: async (endpoint) => {
    try {
      // Remove /api prefix if present
      const cleanEndpoint = endpoint.startsWith('/api/') ? endpoint.substring(4) : endpoint;
      // Remove leading slash if present
      const formattedEndpoint = cleanEndpoint.startsWith('/') ? cleanEndpoint.substring(1) : cleanEndpoint;

      console.log(`Making GET request to: ${formattedEndpoint}`);
      const response = await apiClient.get(formattedEndpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      // Remove /api prefix if present
      const cleanEndpoint = endpoint.startsWith('/api/') ? endpoint.substring(4) : endpoint;
      // Remove leading slash if present
      const formattedEndpoint = cleanEndpoint.startsWith('/') ? cleanEndpoint.substring(1) : cleanEndpoint;

      console.log(`Making POST request to: ${formattedEndpoint}`);
      console.log('With data:', data);
      const response = await apiClient.post(formattedEndpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      // Remove /api prefix if present
      const cleanEndpoint = endpoint.startsWith('/api/') ? endpoint.substring(4) : endpoint;
      // Remove leading slash if present
      const formattedEndpoint = cleanEndpoint.startsWith('/') ? cleanEndpoint.substring(1) : cleanEndpoint;

      console.log(`Making PUT request to: ${formattedEndpoint}`);
      const response = await apiClient.put(formattedEndpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      // Remove /api prefix if present
      const cleanEndpoint = endpoint.startsWith('/api/') ? endpoint.substring(4) : endpoint;
      // Remove leading slash if present
      const formattedEndpoint = cleanEndpoint.startsWith('/') ? cleanEndpoint.substring(1) : cleanEndpoint;

      console.log(`Making DELETE request to: ${formattedEndpoint}`);
      const response = await apiClient.delete(formattedEndpoint);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      throw error;
    }
  }
};

export default apiService;
