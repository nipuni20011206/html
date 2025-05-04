import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); // State to hold the email input
  const [errorMessage, setErrorMessage] = useState(''); // State to handle error message
  const [successMessage, setSuccessMessage] = useState(''); // State to handle success message

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email.');
      setSuccessMessage('');
    } else {
      setErrorMessage('');
      setSuccessMessage('Check your email for the password reset link!');
      // Here you can handle the actual logic to send password reset email (e.g., API call)
      console.log("Email submitted:", email);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white w-full sm:w-96 p-8 rounded-lg shadow-lg">
        {/* Page Heading */}
        <h2 className="text-4xl font-bold mb-8 text-blue-900 text-center">Forgot Password</h2>

        {/* Error Message (if any) */}
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        {/* Success Message (if any) */}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        {/* Link to Login Page */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a href="/login" className="text-indigo-600 hover:text-indigo-800">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
