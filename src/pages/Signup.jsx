// src/pages/Signup.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { FaEye, FaEyeSlash, FaGoogle, FaSpinner } from 'react-icons/fa'; // Import FaGoogle, FaSpinner

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For email/password signup
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Separate loading for Google
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors on change
    if (name === 'password' || name === 'confirmPassword') { if (error === 'Passwords do not match.') setError(''); }
    if (name === 'password' && error === 'Password must be at least 6 characters long.') setError('');
    if (name === 'email' && error === 'Please enter a valid email.') setError('');
    if (error === 'All fields are required.') setError('');
  };

  const togglePasswordVisibility = () => setShowPassword(p => !p);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(p => !p);

  // --- Email/Password Signup Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
    setError(''); setSuccessMessage('');

    // Validations...
    if (!username || !email || !password || !confirmPassword) { setError('All fields are required.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsLoading(true); // Start email/password loading
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { username: username } }
      });

      if (signUpError) {
        setError(signUpError.message || 'Sign up failed. Please try again.');
      } else if (data.user) {
        // Check if email confirmation is required
        if (data.session === null && data.user.identities && data.user.identities.length === 0) {
           setSuccessMessage('Sign up successful! Please check your email to confirm your account.');
        } else {
           setSuccessMessage('Sign up successful! Redirecting to login...');
           setTimeout(() => { navigate('/sign-in'); }, 3000);
        }
      } else { setError('Sign up failed. Please try again.'); }
    } catch (err) {
      console.error("Signup page error:", err);
      setError('An unexpected error occurred during sign up.');
    } finally {
      setIsLoading(false); // Stop email/password loading
    }
  };

  // --- Google Signup/Login Handler ---
  const handleGoogleSignup = async () => {
    setError(''); setSuccessMessage(''); // Clear messages
    setIsGoogleLoading(true); // Start Google loading
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        // options: {
        //   redirectTo: window.location.origin // Optional: Specify where to redirect back after Google signup/login
        // }
      });

      if (error) {
        setError(`Google sign up failed: ${error.message}`);
        setIsGoogleLoading(false); // Stop Google loading on error
      }
      // On success, Supabase handles redirect TO Google.
      // Redirect back is handled by Supabase listener.

    } catch (error) {
        console.error("Google OAuth error:", error);
        setError("An unexpected error occurred during Google sign up.");
        setIsGoogleLoading(false); // Stop Google loading on error
    }
     // Don't set isGoogleLoading to false here on success, as the page will redirect away.
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-indigo-600 mb-6 sm:mb-8">Create Your Account</h2>
        {error && <p className="text-red-600 text-center text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
        {successMessage && <p className="text-green-600 text-center text-sm mb-4 bg-green-50 p-2 rounded border border-green-200">{successMessage}</p>}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Choose a username" disabled={isLoading || isGoogleLoading} required />
          </div>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="your@email.com" disabled={isLoading || isGoogleLoading} required />
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className="p-3 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Create a password (min 6 chars)" disabled={isLoading || isGoogleLoading} required aria-describedby="password-constraints" />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
            <p id="password-constraints" className="text-xs text-gray-500 mt-1">Minimum 6 characters.</p>
          </div>
          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="p-3 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Re-type your password" disabled={isLoading || isGoogleLoading} required />
              <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div>
            <button type="submit" disabled={isLoading || isGoogleLoading} className={`w-full mt-2 py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isLoading || isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Signup/Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading || isGoogleLoading} // Disable if either action is in progress
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


        {/* Redirect to Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink to="/sign-in" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;