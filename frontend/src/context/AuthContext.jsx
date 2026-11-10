import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, getMe as apiGetMe } from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('brew_bite_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('brew_bite_token');
      if (storedToken) {
        try {
          const res = await apiGetMe();
          setUser(res.data?.user || res.data?.data || res.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Session restore failed:', error);
          localStorage.removeItem('brew_bite_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const data = res.data?.data || res.data;
    const receivedToken = data.token || data.accessToken || res.data?.token;
    const receivedUser = data.user || res.data?.user || { email };

    if (receivedToken) {
      localStorage.setItem('brew_bite_token', receivedToken);
      setToken(receivedToken);
    }
    setUser(receivedUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('brew_bite_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
