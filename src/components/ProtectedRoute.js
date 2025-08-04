import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  
  useEffect(() => {
    // If no user in context, try to get from localStorage
    if (!user && !loading) {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Protected route checking localStorage user:", parsedUser);
          
          // If role is missing, try to infer from URL
          if (!parsedUser.role) {
            const path = window.location.pathname;
            if (path.includes('/seller') || path === '/dashboard' || path.includes('/dashboard/')) {
              parsedUser.role = 'seller';
              console.log("Inferred role as seller from URL path");
            } else if (path.includes('/customer')) {
              parsedUser.role = 'customer';
              console.log("Inferred role as customer from URL path");
            }
          }
          
          setLocalUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
    }
    
    setCheckedStorage(true);
  }, [user, loading]);

  if (loading || !checkedStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const effectiveUser = user || localUser;
  const token = localStorage.getItem('token');
  
  // Check if we have a development mode token
  const isDevMode = token === 'mock-seller-token-for-development';
  
  if (isDevMode && requiredRole === 'seller') {
    // Allow access in development mode for seller routes
    console.log("Development mode: Allowing access to seller route");
    return children;
  }
  
  if (!effectiveUser || !token) {
    // Redirect to appropriate login page based on required role
    const loginPath = requiredRole === 'customer' ? '/customer/login' : '/seller/login';
    console.log(`No authenticated user found, redirecting to ${loginPath}`);
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && effectiveUser.role !== requiredRole && !isDevMode) {
    // User doesn't have required role
    console.log(`User has role ${effectiveUser.role}, but ${requiredRole} is required`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;