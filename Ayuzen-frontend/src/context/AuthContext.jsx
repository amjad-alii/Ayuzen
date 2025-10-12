import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 1. Add loading state, default to true

  // This effect runs ONCE on initial app load to check for an existing token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if the token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setIsAuthenticated(true);
          // Set the auth header for all future API calls
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('authToken'); // Clean up expired token
        }
      } catch (error) {
        console.error("Invalid token found in storage", error);
        localStorage.removeItem('authToken');
      }
    }
    // 2. Set loading to false AFTER the check is complete
    setIsLoading(false); 
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
    // Optional: redirect to login page on logout
    window.location.href = '/login';
  };

  return (
    // 3. Provide the isLoading state to the rest of the app
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};