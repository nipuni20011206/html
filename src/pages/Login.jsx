import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for Sign Up
import axios from "axios";
import { useAuth } from '../context/AuthContext';
// --- Import Icons ---
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// --------------------

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- State for password visibility ---
  const [showPassword, setShowPassword] = useState(false);
  // -----------------------------------

  const navigate = useNavigate();
  const { login } = useAuth();

  // --- Toggle Function ---
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };
  // ------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const loginData = { email, password };

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });

      login(response.data.token, response.data.user);
      console.log("Login successful, navigating home.");
      navigate("/");

    } catch (error) {
      console.error("Login API error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4"> {/* Added px-4 */}
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-lg"> {/* Adjusted padding */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-indigo-600 mb-6 sm:mb-8">Welcome Back!</h2> {/* Adjusted text size/margin */}

        {errorMessage && <p className="text-red-600 text-center text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">{errorMessage}</p>} {/* Styled error */}

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Adjusted spacing */}
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1"> Email </label> {/* Added mb-1 */}
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" // Added focus:border, text-sm
              placeholder="your@email.com"
              disabled={isLoading}
              required // Added required
            />
          </div>

          {/* Password Input with Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1"> Password </label>
             {/* --- Added relative positioning wrapper --- */}
            <div className="relative">
              <input
                 // --- Dynamic type based on state ---
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                 // --- Added padding-right for icon space ---
                className="p-3 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter your password"
                disabled={isLoading}
                required // Added required
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
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className={`w-full mt-2 py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} // Added styles
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Links */}
        {/* Optional: Forgot Password Link */}
        {/* <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800 text-sm hover:underline"> Forgot Password? </Link>
        </div> */}
        <div className="text-center mt-6"> {/* Increased margin */}
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            {/* Use Link component for SPA navigation */}
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