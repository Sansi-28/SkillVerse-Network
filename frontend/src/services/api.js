import axios from 'axios';

// REMOVED: import authService from './authService'; // This line caused the circular dependency.

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the token to every request
api.interceptors.request.use(
    (config) => {
        // --- THE FIX: Read directly from localStorage to break the cycle ---
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            if (user && user.accessToken) {
                config.headers['Authorization'] = `Bearer ${user.accessToken}`;
            }
        }
        // --- END OF FIX ---
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear user from storage and redirect to login page.
      localStorage.removeItem('user');
      // Use window.location to force a full page reload, clearing any component state.
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);


export default api;