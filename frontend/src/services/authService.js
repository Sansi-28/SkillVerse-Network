import axios from 'axios';

// The base URL of our Spring Boot backend
const API_URL = process.env.REACT_APP_API_URL + '/api/auth/';

// Function to handle user signup
const signup = (name, email, password) => {
  return axios.post(API_URL + 'signup', {
    name,
    email,
    password,
  });
};

// Function to handle user login
const login = async (email, password) => {
  const response = await axios.post(API_URL + 'login', {
    email,
    password,
  });
  // If the login is successful and we get a token...
  if (response.data.accessToken) {
    // ...store the user details and token in the browser's local storage.
    // This allows the user to stay logged in even after refreshing the page.
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Function to log the user out
const logout = () => {
  localStorage.removeItem('user');
};

// Function to get the current user's data from local storage
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