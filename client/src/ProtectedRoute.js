import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    return isLoggedIn ? element : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
