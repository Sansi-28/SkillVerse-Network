import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import userService from '../services/userService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // We now store the JWT token and the user's profile data separately.
  const [authToken, setAuthToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // This function fetches the user's profile from our new /api/users/me endpoint.
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const profile = await userService.getUserProfile(token);
      setUserProfile(profile.data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      // If fetching fails, the token is likely invalid, so we log out.
      logout();
    }
  }, []);

  // When the app loads, check local storage for a token.
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.accessToken) {
      const token = storedUser.accessToken;
      setAuthToken(token);
      // Pass token directly to avoid stale state issues
      fetchUserProfile(token);
    }
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    const storedUser = await authService.login(email, password);
    if (storedUser && storedUser.accessToken) {
      setAuthToken(storedUser.accessToken);
      await fetchUserProfile(storedUser.accessToken); // Fetch profile right after login.
    }
    return storedUser;
  };

  const logout = () => {
    authService.logout();
    setAuthToken(null);
    setUserProfile(null);
  };
  
  const refreshUserProfile = () => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.accessToken) {
      fetchUserProfile(storedUser.accessToken);
    }
  };

  // Keep backwards compatibility: expose `token` as well as `authToken`.
  const value = {
    authToken,
    token: authToken,
    userProfile,
    login,
    logout,
    refreshUserProfile, // Expose the refresh function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};