import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_API = 'http://localhost:5001/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // On mount — restore user session from localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Register — POST /api/auth/register
  // ---------------------------------------------------------------------------
  const register = async (name, email, password) => {
    const res = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    // Save user + token
    const userData = { _id: data._id, name: data.name, email: data.email };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', data.token);

    return data;
  };

  // ---------------------------------------------------------------------------
  // Login — POST /api/auth/login
  // ---------------------------------------------------------------------------
  const login = async (email, password) => {
    const res = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Email ou mot de passe incorrect');
    }

    // Save user + token
    const userData = { _id: data._id, name: data.name, email: data.email };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', data.token);

    return data;
  };

  // ---------------------------------------------------------------------------
  // Logout — clear session
  // ---------------------------------------------------------------------------
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);