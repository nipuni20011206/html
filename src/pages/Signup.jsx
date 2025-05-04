import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// --- Import Icons ---
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// --------------------

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // --- State for password visibility ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // -----------------------------------

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
     // Clear specific errors when user starts typing
     if (name === 'password' || name === 'confirmPassword') {
        if (error === 'Passwords do not match.') setError('');
     }
     if (name === 'password' && error === 'Password must be at least 8 characters long.') setError('');
     if (name === 'email' && error === 'Please enter a valid email.') setError('');
     if (error === 'All fields are required.') setError(''); // Clear general error on any change
  };

  // --- Toggle Functions ---
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevState => !prevState);
  };
  // ------------------------

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    // Clear previous messages
    setError('');
    setSuccessMessage('');

    // Validations (kept the same, just reordered slightly)
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
     if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
     if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // --- API Call Logic (unchanged) ---
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccessMessage('Sign up successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Sign up failed. Please try again.');
    }
    // ----------------------------------
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4"> {/* Added px-4 for small screens */}
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg"> {/* Added max-w-md */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-indigo-600 mb-6 sm:mb-8">Create Your Account</h2>

        {/* Error/Success Messages */}
        {error && <p className="text-red-600 text-center text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
        {successMessage && <p className="text-green-600 text-center text-sm mb-4 bg-green-50 p-2 rounded border border-green-200">{successMessage}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5"> {/* Slightly reduced spacing */}
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label> {/* Added mb-1 */}
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" // Added focus:border, text-sm
              placeholder="Choose a username"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password Input with Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             {/* --- Added relative positioning wrapper --- */}
            <div className="relative">
              <input
                 // --- Dynamic type based on state ---
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                 // --- Added padding-right for icon space ---
                className="p-3 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Create a password (min 8 chars)"
                required
                aria-describedby="password-constraints" // Added for accessibility
              />
              {/* --- Toggle Button --- */}
              <button
                type="button" // Prevent form submission
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
             <p id="password-constraints" className="text-xs text-gray-500 mt-1">Minimum 8 characters.</p> {/* Accessibility hint */}
          </div>

          {/* Confirm Password Input with Toggle */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
             {/* --- Added relative positioning wrapper --- */}
            <div className="relative">
              <input
                 // --- Dynamic type based on state ---
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                 // --- Added padding-right for icon space ---
                className="p-3 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Re-type your password"
                required
              />
               {/* --- Toggle Button --- */}
              <button
                type="button" // Prevent form submission
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out" // Added styles
            >
              Sign Up
            </button>
          </div>
        </form>

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