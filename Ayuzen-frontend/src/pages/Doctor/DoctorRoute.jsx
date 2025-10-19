import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DoctorRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading user authentication...</div>;
  }

  const userRole = user?.authorities?.[0];
  const isAuthorized = isAuthenticated && userRole === 'ROLE_DOCTOR';

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default DoctorRoute;