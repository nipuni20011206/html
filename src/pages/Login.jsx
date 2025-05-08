// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../supabaseClient'; // Import Supabase client
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'; // Import FaGoogle

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For email/password login
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Separate loading for Google
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  // --- Email/Password Login Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true); // Start email/password loading

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
      } else if (data.user) {
        console.log("Login successful via Supabase, navigating home.");
        navigate("/"); // Navigate after successful Supabase login
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login page error:", error);
      setErrorMessage("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false); // Stop email/password loading
    }
  };

  // --- Google Login Handler ---
  const handleGoogleLogin = async () => {
    setErrorMessage(""); // Clear previous errors
    setIsGoogleLoading(true); // Start Google loading
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        // options: {
        //   redirectTo: window.location.origin // Optional: Specify where to redirect back after Google login
        // }
      });

      if (error) {
        setErrorMessage(`Google login failed: ${error.message}`);
        setIsGoogleLoading(false); // Stop Google loading on error
      }
      // If successful, Supabase handles the redirect TO Google.
      // The user will be redirected back by Google, and Supabase Auth listener
      // (in your AuthContext or similar) will pick up the session.
      // No need to navigate('/') here, the redirect back handles it.

    } catch (error) {
        console.error("Google OAuth error:", error);
        setErrorMessage("An unexpected error occurred during Google login.");
        setIsGoogleLoading(false); // Stop Google loading on error
    }
    // Don't set isGoogleLoading to false here on success, as the page will redirect away.
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-indigo-600 mb-6 sm:mb-8">Welcome Back!</h2>
        {errorMessage && <p className="text-red-600 text-center text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">{errorMessage}</p>}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1"> Email </label>
            <input
              type="email" id="email" name="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="your@email.com" disabled={isLoading || isGoogleLoading} required
            />
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1"> Password </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} id="password" name="password" value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                className="p-3 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter your password" disabled={isLoading || isGoogleLoading} required
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {/* Login Button */}
          <div>
            <button type="submit" className={`w-full mt-2 py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isLoading || isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading || isGoogleLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading} // Disable if either login type is in progress
            className={`w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isGoogleLoading || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGoogleLoading ? (
              <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" />
            ) : (
              <FaGoogle className="-ml-1 mr-3 h-5 w-5 text-red-500" aria-hidden="true" /> // Google icon
            )}
            Continue with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;