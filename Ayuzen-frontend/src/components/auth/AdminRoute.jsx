import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth();

  // --- START DEBUGGING LOGS ---
  console.clear(); // Clears the console for a clean view
  console.log("--- AdminRoute Authorization Check ---");
  console.log("Is user authenticated?", isAuthenticated);
  console.log("User object from context:", user);

  // Attempt to get the role from the 'authorities' array
  const userRole = user?.authorities?.[0];
  console.log("Role found in user object:", userRole);
  // --- END DEBUGGING LOGS ---

  const isAuthorized = 
    isAuthenticated && 
    (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_RECEPTIONIST');

  if (!isAuthorized) {
    console.log("Authorization FAILED. Redirecting to homepage.");
    return <Navigate to="/" replace />;
  }

  console.log("Authorization SUCCEEDED. Rendering admin page.");
  return <Outlet />;
};

export default AdminRoute;