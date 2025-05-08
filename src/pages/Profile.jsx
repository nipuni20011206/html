// pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Your Supabase-aware AuthContext
import { supabase } from '../supabaseClient';    // Import your Supabase client
import {
  FaSpinner, FaUserCircle, FaEnvelope,
  FaCalendarAlt, FaStar, FaSave, FaPencilAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true); // For this page's data fetching
  const [error, setError] = useState(null);

  const [localFavorites, setLocalFavorites] = useState([]);
  const [bioInput, setBioInput] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);

  // --- Fetch Profile Data from Supabase 'profiles' table ---
  const fetchSupabaseProfile = useCallback(async () => {
    if (!authUser || !authUser.id) {
      // This case should ideally be prevented by the !isAuthenticated check in useEffect
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url, created_at') // Adjust fields as per your 'profiles' table
        .eq('id', authUser.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // Profile row doesn't exist for the user yet
          console.warn("ProfilePage: No Supabase profile row found for user:", authUser.id);
          // Create a minimal profile object based on auth data
          const initialProfile = {
            username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'New User',
            email: authUser.email,
            bio: '', // Default empty bio
            avatar_url: authUser.user_metadata?.avatar_url, // From Supabase auth metadata if set
            created_at: authUser.created_at, // From Supabase auth user
          };
          setProfileData(initialProfile);
          setBioInput(initialProfile.bio);
        } else {
          throw fetchError; // Re-throw other Supabase errors
        }
      } else if (data) {
        // Profile row exists, combine with auth data
        setProfileData({
          ...data,
          email: authUser.email,
          username: data.username || authUser.user_metadata?.username || authUser.email?.split('@')[0],
          avatar_url: data.avatar_url || authUser.user_metadata?.avatar_url,
          created_at: data.created_at || authUser.created_at,
        });
        setBioInput(data.bio || '');
      } else {
         // Fallback if no data and no specific error (less likely with .single())
         const fallbackProfile = {
           username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User',
           email: authUser.email,
           bio: '',
           created_at: authUser.created_at,
         };
         setProfileData(fallbackProfile);
         setBioInput('');
      }
    } catch (err) {
      console.error("Error fetching Supabase profile:", err);
      setError(err.message || "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  }, [authUser]); // Dependency: Supabase authenticated user object

  // Effect to initiate profile fetching based on auth state
  useEffect(() => {
    if (authLoading) {
      return; // Wait for authentication to resolve
    }
    if (!isAuthenticated) {
      // setError("You must be logged in to view this page."); // Set error or navigate
      // setLoading(false); // Ensure loading stops if not authenticated
      navigate('/sign-in', { state: { from: '/profile' }, replace: true }); // Redirect
      return;
    }
    // If authenticated, fetch the profile
    fetchSupabaseProfile();
  }, [authLoading, isAuthenticated, fetchSupabaseProfile, navigate]);

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

  // --- Handle Saving User's Bio to Supabase ---
  const handleSaveBio = async (e) => {
    e.preventDefault();
    if (isSavingBio || !authUser || !authUser.id) {
        toast.error("User not authenticated or action already in progress.");
        return;
    }
    if (bioInput === (profileData?.bio || '')) {
      toast.info("No changes made to bio.");
      return;
    }

    setIsSavingBio(true);
    const loadingToastId = toast.loading('Saving bio...');

    try {
      // Upsert: updates if 'id' exists, inserts if not.
      // Make sure your 'profiles' table has RLS policies allowing this.
      const { data: updatedProfile, error: saveError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id, // This is the primary key linking to auth.users
          bio: bioInput,
          // If you also want to update username from metadata on first save:
          // username: profileData.username || authUser.user_metadata?.username,
        })
        .select() // Returns the upserted row
        .single(); // Expect a single row back

      if (saveError) throw saveError;

      if (updatedProfile) {
        setProfileData(prev => ({ ...prev, bio: updatedProfile.bio, username: updatedProfile.username || prev.username }));
        setBioInput(updatedProfile.bio); // Ensure bioInput is also in sync
      } else {
        // Fallback if select() doesn't return data but upsert was likely successful
         setProfileData(prev => ({ ...prev, bio: bioInput }));
      }
      toast.success('Bio updated successfully!', { id: loadingToastId });

    } catch (err) {
      console.error("Error saving bio to Supabase:", err);
      toast.error(err.message || 'Failed to save bio.', { id: loadingToastId });
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


  // --- Conditional Rendering Logic ---
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <span className="ml-3 text-lg text-gray-600">
          {authLoading ? 'Authenticating...' : 'Loading Profile...'}
        </span>
      </div>
    );
  }

  // This check is somewhat redundant if useEffect navigates, but good for direct URL access attempts
  if (!isAuthenticated) {
    // The navigate in useEffect should handle this, but as a fallback render:
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] px-4">
        <div className="text-center py-10 px-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-medium text-yellow-800">Access Denied</h3>
          <p className="mt-1 text-sm text-yellow-700">Please log in to view your profile.</p>
          <Link to="/sign-in" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] px-4">
        <div className="text-center py-10 px-6 bg-red-50 border border-red-200 rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-medium text-red-800">Error Loading Profile</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // If authenticated, no error, but profileData is still not set (e.g., initial load before fetch completes fully, or an unexpected issue)
  // This check helps prevent trying to render with undefined profileData
  if (!profileData) {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] px-4">
            <div className="text-center py-10 px-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md max-w-md">
                <h3 className="text-lg font-medium text-yellow-800">Profile Data Unavailable</h3>
                <p className="mt-1 text-sm text-yellow-700">Could not retrieve your profile details at the moment. Please try again later or contact support if the issue persists.</p>
            </div>
        </div>
    );
  }
  // --- End Conditional Rendering ---


  // Destructure necessary data from profileData (which is now sourced from Supabase/auth)
  const {
    username,    // From 'profiles' table or authUser.user_metadata
    email,       // From authUser.email
    avatar_url,  // From 'profiles' table or authUser.user_metadata
    // bio is handled by bioInput state for editing
    // socialLinks, // If you add this to your 'profiles' table
    created_at,  // From 'profiles' table or authUser.created_at
  } = profileData; // profileData should not be null here due to checks above


  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">

        {/* --- Profile Header --- */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 sm:p-8 text-white">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex-shrink-0">
              {avatar_url ? (
                <img src={avatar_url} alt={`${username}'s profile`} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md" />
              ) : (
                <FaUserCircle className="h-28 w-28 text-gray-300 bg-gray-600 rounded-full p-2 border-4 border-white shadow-md" />
              )}
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold truncate" title={username}>{username || 'Username'}</h1>
              {created_at && (
                <p className="text-blue-100 text-sm mt-1 flex items-center justify-center gap-1.5">
                  <FaCalendarAlt className="w-3 h-3" />
                  Member since {formatDate(created_at)}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* --- End Profile Header --- */}

        {/* --- Profile Details Body --- */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSaveBio} className="space-y-3">
            <label htmlFor="bioInput" className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-1">
              <FaPencilAlt className="w-4 h-4 text-gray-400" />
              About Me
            </label>
            <textarea
              id="bioInput"
              rows="4"
              placeholder="Tell us a little about yourself..."
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
              disabled={isSavingBio}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSavingBio || bioInput === (profileData?.bio || '')}
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

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Account Details</h2>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 text-sm truncate" title={email}>{email || 'No email provided'}</span>
            </div>
          </div>

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