import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('ProtectedAdminRoute - User:', user, 'Loading:', loading, 'IsAuth:', isAuthenticated);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'admin') {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin authenticated, rendering children');
  return children;
};

export default ProtectedAdminRoute;
