import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Fetch user profile
      axios.get('http://localhost:5000/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => logout());
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
  };

  const subscribeUser = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/subscribe');
    setUser(res.data);
  };

  const unsubscribeUser = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/unsubscribe');
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, subscribeUser, unsubscribeUser }}>
      {children}
    </AuthContext.Provider>
  );
};
