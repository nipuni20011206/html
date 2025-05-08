// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import your Supabase client

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null); // Store the full Supabase session
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Check initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    }).catch(error => {
      console.error("AuthContext: Error getting initial session:", error);
      setIsLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false); // Important to set loading to false after state change
      }
    );

    return () => {
      // Cleanup listener
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // login, signup, logout functions will be called directly from components
  // So, we don't need login/logout functions here in the context for this simpler pattern.

  const value = {
    user, // Supabase user object (or null)
    session, // Supabase session object (or null)
    isAuthenticated: !!user, // True if user object exists
    isLoading,
  };

  // Optionally, only render children when not loading to prevent flashes
  // if (isLoading) {
  //   return <div>Loading Auth...</div>;
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