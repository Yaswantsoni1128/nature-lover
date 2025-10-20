import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token && !authCheckInProgress) {
        setAuthCheckInProgress(true);
        try {
          const response = await api.get('/api/user/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Only clear token if it's a 401 error (unauthorized)
          if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            setToken(null);
            setUser(null);
          }
        } finally {
          setAuthCheckInProgress(false);
        }
      }
      setLoading(false);
    };

    // Only check auth if there's a token and we're not already authenticated
    if (token && !user && !authCheckInProgress) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []); // Remove token dependency to prevent loops

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/user/login', {
        email,
        password
      });
      
      const { accessToken, user: userData } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await api.post('/api/user/register', {
        name,
        email,
        password,
        phone
      });
      
      const { accessToken, user: userData } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    loading: loading || authCheckInProgress,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
