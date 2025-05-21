// API utility for handling URLs

// Get the base API URL based on the environment
const getBaseUrl = () => {
  // Use environment variable if available
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Default to deployed API if no environment variable is set
  return 'https://alumni-server-phe9.onrender.com/api';
};

// Export the base URL for use in components
export const API_BASE_URL = getBaseUrl();

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Log the API URL being used (helpful for debugging)
console.log('Using API URL:', API_BASE_URL);

export default {
  API_BASE_URL,
  createApiUrl
};
