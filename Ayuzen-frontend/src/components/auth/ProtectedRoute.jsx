import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // If they are authenticated, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;