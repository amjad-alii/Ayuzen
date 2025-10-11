import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setIsAuthenticated(true);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Invalid token found", error);
        localStorage.removeItem('authToken');
      }
    }
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
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

