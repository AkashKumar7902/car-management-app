// src/components/Layout/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while initializing
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;