import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerNewUser, updateUserProfileApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on startup
  useEffect(() => {
    const cachedUser = localStorage.getItem('authUserInfo');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser(email, password);
      setUser(data);
      localStorage.setItem('authUserInfo', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await registerNewUser(name, email, password);
      setUser(data);
      localStorage.setItem('authUserInfo', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUserInfo');
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateUserProfileApi(profileData);
      setUser(data);
      localStorage.setItem('authUserInfo', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Profile update failed.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
