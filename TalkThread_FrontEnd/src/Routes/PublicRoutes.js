import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContex'; // Adjust the path based on your structure

const PublicRoutes = () => {
    const { token } = useAuth(); // Assuming this returns true/false based on auth state

    // If the user is authenticated, redirect them to the home page or desired route
    if (token) {
        return <Navigate to="/home" replace={true} />;
    }

    return <Outlet />; // Render child routes if not authenticated
};

export default PublicRoutes;
