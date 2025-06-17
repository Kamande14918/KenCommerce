import React, { createContext, useState, useEffect } from 'react';
import { login, register, forgotPassword, resetPassword } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage
    const saved = localStorage.getItem('kencommerce_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kencommerce_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kencommerce_user');
    }
  }, [user]);

  const loginHandler = async (credentials) => {
    const response = await login(credentials);
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  };

  const registerHandler = async (userData) => {
    const response = await register(userData);
    return response;
  };

  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const forgotPasswordHandler = async (email) => {
    const response = await forgotPassword(email);
    return response;
  };

  const resetPasswordHandler = async (token, newPassword) => {
    const response = await resetPassword(token, newPassword);
    return response;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login: loginHandler,
      register: registerHandler,
      logout: logoutHandler,
      forgotPassword: forgotPasswordHandler,
      resetPassword: resetPasswordHandler,
      setToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};