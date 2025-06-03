import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if token is expired
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    
    try {
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; 
    }
  }, []);

  // Function to fetch user profile data
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const userData = response.data;
      setUser(userData);
      
      // Store user data in localStorage

      localStorage.setItem('userData', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If unauthorized (401), token is invalid
      
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    console.log('Logging out user...');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('redirectAfterLogin');
  }, []);

  // Check token validity and auto-logout if expired
  const checkTokenValidity = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && isTokenExpired(storedToken)) {
      console.log('Token expired, logging out...');
      logout();
      return false;
    }
    
    return !!storedToken;
  }, [isTokenExpired, logout]);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      const storedToken = localStorage.getItem('token');
      const storedUserData = localStorage.getItem('userData');
      
      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setIsAuthenticated(true);
        
        // Try to get user data from localStorage first
        if (storedUserData) {
          try {
            const parsedUserData = JSON.parse(storedUserData);
            setUser(parsedUserData);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
          }
        }
        
        // Verify token is still valid by fetching user profile
        await fetchUserProfile(storedToken);
      } else {
        // Token doesn't exist or is expired
        logout();
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [isTokenExpired, logout]);

  // Set up automatic token validation check every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  // Login function
  const login = async (newToken) => {
    if (!newToken || isTokenExpired(newToken)) {
      throw new Error('Invalid or expired token');
    }

    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
    
    // Fetch user profile data after setting token
    const userData = await fetchUserProfile(newToken);
    
    return userData;
  };

  // Function to get valid token (checks expiry before returning)
  const getValidToken = useCallback(() => {
    const currentToken = token || localStorage.getItem('token');
    
    if (!currentToken || isTokenExpired(currentToken)) {
      logout();
      return null;
    }
    
    return currentToken;
  }, [token, isTokenExpired, logout]);

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isAuthenticated, 
      loading,
      login, 
      logout,
      fetchUserProfile,
      getValidToken,
      checkTokenValidity
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;