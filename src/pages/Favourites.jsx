// src/pages/Favourites.js using localStorage ONLY

import React, { useEffect, useState } from "react";
import { FaHeart, FaTrash, FaInfoCircle, FaSpinner } from "react-icons/fa"; // Added FaSpinner
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Simple loading state

  // --- Load favorites from localStorage on mount ---
  useEffect(() => {
    setIsLoading(true);
    console.log("Favourites.js: Loading favorites from localStorage.");
    try {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
    } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        toast.error("Could not load favorites from local storage.");
        setFavorites([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  // --- Handle removing country from localStorage favorites ---
  const removeFavorite = (countryToRemove) => {
    const confirm = window.confirm(`Are you sure you want to remove ${countryToRemove.name?.common || countryToRemove.cca3} from favorites?`);
    if (!confirm) return;

    try {
        const updatedFavorites = favorites.filter(
          (item) => (item.cca3 || item.name.common) !== (countryToRemove.cca3 || countryToRemove.name.common)
        );
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        toast.success(`${countryToRemove.name?.common || countryToRemove.cca3} removed from local favorites!`);
    } catch (error) {
        console.error("Error updating localStorage:", error);
        toast.error("Failed to update local favorites.");
    }
  };

  // Helper function (remains the same)
  const CountryDetail = ({ label, value }) => (
    <p className="text-sm">
      <span className="font-medium text-gray-700">{label}:</span>{' '}
      <span className="text-gray-600">{value || "N/A"}</span>
    </p>
  );

  // --- Conditional Rendering ---
  if (isLoading) {
     return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
             <FaSpinner className="animate-spin text-blue-500 text-4xl" />
             <span className="ml-3 text-lg text-gray-600">Loading local favorites...</span>
        </div>
     );
  }

  // --- Main Return JSX ---
  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
        Your Favorite Destinations ❤️
      </h1>
      
      <div className="max-w-7xl mx-auto">
        {favorites.length === 0 ? (
          // Empty State Message
          <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">
             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No local favorites added yet!</h3>
            <p className="mt-1 text-sm text-gray-500">Add countries from the main list.</p>
             <Link to="/countries" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Explore Countries
            </Link>
          </div>
        ) : (
          // Grid for displaying favorite cards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {favorites.map((country) => (
              country && country.name && country.flags ? (
                <div key={country.cca3 || country.name.common} className="relative flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group">
                    {/* Flag */}
                    <div className="aspect-video w-full bg-gray-100">
                      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} className="w-full h-full object-cover" loading="lazy"/>
                    </div>
                    {/* Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 truncate" title={country.name.common}>{country.name.common}</h3>
                      <div className="space-y-1.5 mb-4 flex-grow">
                        <CountryDetail label="Capital" value={country.capital?.[0]} />
                        <CountryDetail label="Region" value={country.region} />
                        <CountryDetail label="Population" value={country.population?.toLocaleString()} />
                        <CountryDetail label="Languages" value={country.languages ? Object.values(country.languages).join(", ") : null} />
                      </div>
                      <Link to={`/country-details/${country.cca3 || country.name.common.toLowerCase()}`} className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        <FaInfoCircle className="w-4 h-4 mr-2" /> More Details
                      </Link>
                    </div>
                    {/* Remove Button */}
                    <button onClick={() => removeFavorite(country)} className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-700 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label={`Remove ${country.name.common} from favorites`} title="Remove from favorites">
                        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;