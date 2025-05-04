// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Start with null, let useEffect populate
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Function to decode and set state from token
  const processToken = (receivedToken) => {
    try {
      const decoded = jwtDecode(receivedToken);
      // Check expiry
      if (decoded.exp * 1000 > Date.now()) {
        setToken(receivedToken);
        // Set user from decoded payload (now includes username)
        setUser({ id: decoded.id, username: decoded.username }); // Use username
        localStorage.setItem('authToken', receivedToken); // Store only if valid
        return true; // Indicate success
      } else {
        console.log("Token expired on load.");
        handleLogout(); // Token expired
        return false;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      handleLogout(); // Clear invalid token
      return false;
    }
  };


  useEffect(() => {
    setIsLoading(true);
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      processToken(storedToken); // Use the refactored function
    }
    setIsLoading(false); // Finished initial loading attempt
  }, []); // Run only once on mount


  // --- MODIFIED handleLogin ---
  // Accepts the token, optionally accepts user data directly from API response
  const handleLogin = (newToken, apiUser = null) => {
     const success = processToken(newToken); // Decode, validate expiry, set state, store token
     if (success && apiUser) {
        // If API provided user data directly, prefer that for immediate use
        // (ensures consistency if JWT payload is minimal)
        setUser({ id: apiUser.id, username: apiUser.username });
     } else if (!success) {
        // If processToken failed (e.g., decode error, expired), ensure logout state
        handleLogout();
     }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isLoading, // Provide loading state if needed elsewhere
    login: handleLogin,
    logout: handleLogout,
  };

  // Render children only after initial auth check is done (optional but good practice)
  // if (isLoading) {
  //   return <div>Loading application...</div>; // Or a spinner component
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};