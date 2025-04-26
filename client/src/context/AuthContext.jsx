import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext(); // Define first

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('token'); // small fix
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; // Export afterwards
