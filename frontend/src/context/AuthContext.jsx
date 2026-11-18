import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careerpath_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('careerpath_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user:", e);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('careerpath_token', access_token);
      localStorage.setItem('careerpath_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Invalid email or password'
      };
    }
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: 999,
      full_name: "Demo Student",
      email: "student@careerpath.ai"
    };
    const demoToken = "demo-mock-jwt-token-2026";
    localStorage.setItem('careerpath_token', demoToken);
    localStorage.setItem('careerpath_user', JSON.stringify(demoUser));
    setToken(demoToken);
    setUser(demoUser);
  };

  const register = async (fullName, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        full_name: fullName,
        email,
        password
      });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('careerpath_token', access_token);
      localStorage.setItem('careerpath_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('careerpath_token');
    localStorage.removeItem('careerpath_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        loginAsDemo,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
