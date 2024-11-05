import React from 'react';
import { Navigate, Outlet,useLocation } from 'react-router-dom';
import { useAuth } from './AuthContex'; // Adjust the path based on your structure
import ErrorPage from '../Error';
const UserRoutes = () => {
  const { isAuthenticated } = useAuth(); // Assuming this returns true/false based on auth state

  // Define routes that should be protected
  const protectedRoutes = ['/chat', '/CreateProfile', '/home', '/Profile', '/Createpost', '/Search'];

  // Check if the current location is one of the protected routes
  const location = useLocation();
  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  // If authenticated and trying to access a protected route, navigate to the ErrorPage
  if (isAuthenticated && isProtectedRoute) {
    return <Navigate to="/error" />;
  }

  return <Outlet />;
};

export default UserRoutes;
