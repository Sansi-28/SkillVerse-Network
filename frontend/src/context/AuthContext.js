import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import userService from '../services/userService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // --- THE FIX IS HERE ---
  const fetchUserProfile = useCallback(async () => {
    try {
      // userService.getUserProfile() now returns the data object directly.
      const profileData = await userService.getUserProfile();
      // We must set the state with the data object itself, not profileData.data
      setUserProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout(); // Log out if the token is invalid and we can't get a profile
    }
  }, []);
  // --- END OF FIX ---

  // On initial app load, check for an existing session in localStorage
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.accessToken) {
      setAuthToken(storedUser.accessToken);
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    const storedUser = await authService.login(email, password);
    if (storedUser && storedUser.accessToken) {
      setAuthToken(storedUser.accessToken);
      await fetchUserProfile(); // This will now work correctly
    }
    return storedUser;
  };

  const signup = async (name, email, password) => {
    await authService.signup(name, email, password);
    // After a successful signup, automatically log the new user in.
    await login(email, password);
  };

  const logout = () => {
    authService.logout();
    setAuthToken(null);
    setUserProfile(null);
  };
  
  const refreshUserProfile = () => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.accessToken) {
      fetchUserProfile();
    }
  };

  const value = {
    authToken,
    token: authToken,
    userProfile,
    login,
    signup,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};