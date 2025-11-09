import api from './api';

const API_URL = '/api/auth';

const signup = (name, email, password) => {
  console.log('authService: Calling POST /api/auth/signup'); // <-- DIAGNOSTIC LOG
  return api.post(`${API_URL}/signup`, {
    name,
    email,
    password,
  });
};

const login = async (email, password) => {
  console.log('authService: Calling POST /api/auth/login'); // <-- DIAGNOSTIC LOG
  const response = await api.post(`${API_URL}/login`, {
    email,
    password,
  });
  if (response.data.accessToken) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;