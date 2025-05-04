// pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FaSpinner, FaUserCircle, FaEnvelope,
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram,
  FaCalendarAlt, FaStar, FaSave, FaPencilAlt // Added Pencil for Bio heading
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, token, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for favorites from localStorage
  const [localFavorites, setLocalFavorites] = useState([]);

  // --- State for Editable Bio ---
  const [bioInput, setBioInput] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);
  // -----------------------------

  // --- Fetch Backend Profile Data ---
  useEffect(() => {
    if (authLoading || !token) {
      if (!token && !authLoading) {
        setError("You must be logged in to view this page.");
        setLoading(false);
      }
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = response.data.user;
        setProfileData(userProfile);
        // Initialize bio input with fetched data
        setBioInput(userProfile.bio || ''); // Use existing bio or empty string
        console.log("ProfilePage: Backend profile data fetched:", userProfile);

      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Your session may have expired or is invalid. Please log in again.");
        } else {
          setError(err.response?.data?.message || "Could not load profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, authLoading, logout]);
  // -----------------------------------

  // --- Load favorites from localStorage ---
  useEffect(() => {
    if (isAuthenticated) {
      const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setLocalFavorites(savedFavorites);
    } else {
      setLocalFavorites([]);
    }
  }, [isAuthenticated]);
  // --------------------------------------

  // --- Handle Saving User's Bio ---
  const handleSaveBio = async (e) => {
    e.preventDefault();
    if (isSavingBio) return;
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }
    // Prevent saving if bio hasn't changed (optional but good practice)
    if (bioInput === (profileData?.bio || '')) {
        toast.info("No changes made to bio.");
        return;
    }


    setIsSavingBio(true);
    const loadingToastId = toast.loading('Saving bio...');

    try {
      // Ensure backend accepts 'bio' field update
      const response = await axios.patch(
        'http://localhost:5000/api/auth/me',
        { bio: bioInput }, // Send the updated bio
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update profileData state locally after successful save
      setProfileData(prev => ({ ...prev, bio: bioInput }));
      toast.success('Bio updated successfully!', { id: loadingToastId });
      console.log("Save bio response:", response.data);

    } catch (err) {
      console.error("Error saving bio:", err.response?.data || err.message);
       // Check for the specific backend error message if available
       const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to save bio.';
      toast.error(errorMessage, { id: loadingToastId });
    } finally {
      setIsSavingBio(false);
    }
  };
  // ------------------------------------

  // --- Helper: Format Date ---
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) { return "Invalid Date"; }
  };

  // --- Render States ---
  if (loading || authLoading) { /* ... Loading spinner ... */
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <span className="ml-3 text-lg text-gray-600">Loading Profile...</span>
      </div>
    );
  }
  if (error) { /* ... Error display ... */
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] px-4">
         <div className="text-center py-10 px-6 bg-red-50 border border-red-200 rounded-lg shadow-md max-w-md">
            <h3 className="text-lg font-medium text-red-800">Error Loading Profile</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            {!isAuthenticated && (
                 <Link to="/sign-in" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Login
                 </Link>
            )}
          </div>
      </div>
    );
  }
   if (!profileData && !loading && !authLoading) { /* ... Profile unavailable ... */
       return (
       <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] px-4">
         <div className="text-center py-10 px-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md max-w-md">
            <h3 className="text-lg font-medium text-yellow-800">Profile Unavailable</h3>
            <p className="mt-1 text-sm text-yellow-700">Could not retrieve profile details. Ensure you are logged in.</p>
            {!isAuthenticated && (
                 <Link to="/sign-in" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Login
                 </Link>
            )}
          </div>
       </div>
     );
   }
  // ---------------------

  // Destructure necessary data
  const {
    username,
    email,
    profilePicture,
    // bio, // We use bioInput for the display/edit now
    socialLinks,
    createdAt,
  } = profileData || {};


  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">

        {/* --- Profile Header --- */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 sm:p-8 text-white">
           <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {profilePicture ? (
                <img src={profilePicture} alt={`${username}'s profile`} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"/>
              ) : (
                <FaUserCircle className="h-28 w-28 text-gray-300 bg-gray-600 rounded-full p-2 border-4 border-white shadow-md" />
              )}
            </div>
            {/* Username and Basic Info */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold truncate" title={username}>{username || 'Username'}</h1>
              {createdAt && (
                  <p className="text-blue-100 text-sm mt-1 flex items-center justify-center gap-1.5">
                    <FaCalendarAlt className="w-3 h-3" />
                    Member since {formatDate(createdAt)}
                  </p>
              )}
            </div>
          </div>
        </div>
        {/* --- End Profile Header --- */}

        {/* --- Profile Details Body --- */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* About Me / Bio Section (Editable) */}
          <form onSubmit={handleSaveBio} className="space-y-3">
            <label htmlFor="bioInput" className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-1">
               <FaPencilAlt className="w-4 h-4 text-gray-400"/>
               About Me
            </label>
            <textarea
              id="bioInput"
              rows="4"
              placeholder="Tell us a little about yourself..."
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y" // Allow vertical resize
              disabled={isSavingBio}
            />
             <div className="flex justify-end"> {/* Align button to the right */}
                <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSavingBio || bioInput === (profileData?.bio || '')} // Disable if saving or unchanged
                >
                {isSavingBio ? (
                    <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                    <FaSave className="h-4 w-4" />
                )}
                <span className="ml-2">{isSavingBio ? 'Saving...' : 'Save Bio'}</span>
                </button>
            </div>
          </form>

          {/* Account Details Section */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
             <h2 className="text-lg font-semibold text-gray-700 mb-1">Account Details</h2>
             {/* Email */}
            <div className="flex items-center space-x-3">
              <FaEnvelope className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 text-sm truncate" title={email}>{email || 'No email provided'}</span>
            </div>
            {/* REMOVED Country Input Form */}
          </div>

          {/* Favorite Countries Section */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Favorite Countries
            </h2>
            {localFavorites && localFavorites.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {localFavorites.map((favCountry) => (
                   favCountry.cca3 && favCountry.name?.common ? (
                     <Link
                       key={favCountry.cca3}
                       to={`/country-details/${favCountry.cca3}`}
                       className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                       title={`View details for ${favCountry.name.common}`}
                     >
                       {favCountry.name.common}
                     </Link>
                   ) : null
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No favorite countries added yet.</p>
            )}
          </div>          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;