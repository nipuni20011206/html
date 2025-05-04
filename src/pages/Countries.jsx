// src/pages/Countries.js

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaHeart, FaRegHeart, FaInfoCircle, FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Already imported
import { toast } from "react-hot-toast";     // Already imported

// --- Pagination Configuration ---
const ITEMS_PER_PAGE = 12;

// Helper Component (No changes)
const CountryDetail = ({ label, value }) => (
    <p className="text-sm">
    <span className="font-medium text-gray-700">{label}:</span>{' '}
    <span className="text-gray-600">{value || "N/A"}</span>
  </p>
);

// Pagination Component (No changes)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // ... (Pagination component code remains the same) ...
        if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-12" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <FaChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Next
          <FaChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

// Main Countries Component
const Countries = () => {
  // --- State ---
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [favorites, setFavorites] = useState([]); // State for favorites
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Hooks ---
  const { isAuthenticated } = useAuth(); // Get authentication status
  const navigate = useNavigate();

  // --- useEffect Hooks ---
  // Fetching Data (remains the same)
  useEffect(() => {
    const fetchInitialData = async () => {
      // ... (fetch logic remains the same) ...
         setLoading(true);
      setError(null);
      setCurrentPage(1);
      try {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca3,flags,capital,region,population,languages");
        setAllCountries(res.data);
        setFilteredCountries(res.data);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load country data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Filtering Logic (remains the same)
  useEffect(() => {
     // ... (filter logic remains the same) ...
         let result = [...allCountries];
    if (selectedRegion !== "All") {
      result = result.filter(country => country.region === selectedRegion);
    }
    if (selectedLanguage !== "All") {
      result = result.filter(country =>
        country.languages && Object.values(country.languages).includes(selectedLanguage)
      );
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(country =>
        country.name.common.toLowerCase().includes(lowerCaseQuery)
      );
    }
    setFilteredCountries(result);
    setCurrentPage(1);
  }, [searchQuery, selectedRegion, selectedLanguage, allCountries]);

  // --- REMOVED: Old useEffect for loading favorites only on mount ---
  // useEffect(() => {
  //   const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  //   setFavorites(savedFavorites);
  // }, []);

  // --- ADDED: useEffect to load/clear favorites based on auth status ---
  useEffect(() => {
    if (isAuthenticated) {
      // If user is logged in, load favorites from localStorage
      console.log("Auth state changed: User is Authenticated. Loading favorites.");
      const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(savedFavorites);
    } else {
      // If user is logged out, clear the local favorites state
      console.log("Auth state changed: User is NOT Authenticated. Clearing favorites state.");
      setFavorites([]); // This will make all hearts appear unfilled
    }
    // This effect runs whenever isAuthenticated changes
  }, [isAuthenticated]);
  // --------------------------------------------------------------------


  // --- Internal function to toggle favorite state ---
  const toggleFavoriteInternal = (country) => {
     // ... (toggle logic remains the same, updates state and localStorage) ...
        const isFavorite = favorites.some((fav) => fav.cca3 === country.cca3);
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.cca3 !== country.cca3);
    } else {
      updatedFavorites = [...favorites, country];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Persist change for logged-in user
    return !isFavorite;
  };

  // --- Handler for the favorite button click ---
  const handleFavoriteClick = (country) => {
    // Check if the user is NOT logged in
    if (!isAuthenticated) {
      // Show error toast (remains the same)
      toast.error("Please log in to manage your favorites.", {
         // ... (toast options remain the same) ...
             position: "top-center",
        duration: 3500,
        style: {
           background: '#EF4444',
           color: '#FFFFFF',
           padding: '1rem',
           borderRadius: '0.5rem',
           boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
         },
      });
      return; // Stop execution
    }

    // --- If authenticated, proceed ---
    const wasAdded = toggleFavoriteInternal(country); // Update favorite status

    // Show success toast (remains the same)
    toast.success(wasAdded ? `${country.name.common} added!` : `${country.name.common} removed!`, { // Shorter message
      // ... (toast options remain the same) ...
          position: "top-center",
      duration: 2500,
      style: {
           background: '#22C55E',
           color: '#FFFFFF',
           padding: '1rem',
           borderRadius: '0.5rem',
           boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    });
  };

  // --- Calculations ---
   // ... (uniqueLanguages, pagination data, currentCountries calculation remain the same) ...
      const uniqueLanguages = useMemo(() => {
     if (!allCountries) return [];
     const languagesSet = new Set();
     allCountries.forEach(country => {
       if (country.languages) {
         Object.values(country.languages).forEach(lang => languagesSet.add(lang));
       }
     });
     return Array.from(languagesSet).sort();
   }, [allCountries]);

  const totalItems = filteredCountries.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const currentCountries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCountries.slice(startIndex, endIndex);
  }, [filteredCountries, currentPage]);


  // --- Handler for changing page ---
   // ... (handlePageChange remains the same) ...
     const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  // --- JSX Rendering ---
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* --- Filters Section (No changes needed) --- */}
        {/* ... */}
             <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Explore Countries
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
          {/* Search Bar */}
          <div className="relative md:col-span-1">
            <label htmlFor="search-country" className="sr-only">Search for a country</label>
            <input
              id="search-country"
              type="text"
              placeholder="Search by name..."
              className="p-3 pl-10 pr-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Region Filter */}
          <div className="relative md:col-span-1">
             <label htmlFor="region-filter" className="sr-only">Filter by region</label>
            <select
              id="region-filter"
              className="p-3 w-full border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 pr-8 bg-white cursor-pointer"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              disabled={loading}
            >
              <option value="All">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {/* Language Filter */}
          <div className="relative md:col-span-1">
             <label htmlFor="language-filter" className="sr-only">Filter by language</label>
            <select
              id="language-filter"
              className="p-3 w-full border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 pr-8 bg-white cursor-pointer"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={loading || uniqueLanguages.length === 0}
            >
              <option value="All">All Languages</option>
              {uniqueLanguages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- Countries Grid Area --- */}
      <div className="max-w-7xl mx-auto">
        {/* Loading/Error/No Results States */}
        {/* ... */}
           {loading ? (
           <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            <span className="ml-3 text-lg text-gray-600">Loading countries...</span>
          </div>
        ) : error ? (
            <div className="text-center py-20 px-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        ) : filteredCountries.length === 0 ? (
            <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Countries Found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (

        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {currentCountries.map((country) => {
           
              const isFavorite = favorites.some((fav) => fav.cca3 === country.cca3);
              
              return (
                <div
                  key={country.cca3}
                  className="relative flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:translate-y-[-10px] transition-transform duration-300 overflow-hidden border border-gray-100 group"
                >
                  {/* Card Content */}
                      <div className="aspect-video w-full bg-gray-100">
                      <img
                        src={country.flags.svg}
                        alt={`Flag of ${country.name.common}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-grow relative">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 truncate" title={country.name.common}>
                        {country.name.common}
                      </h3>
                      <div className="space-y-1.5 mb-4 flex-grow">
                        <CountryDetail label="Capital" value={country.capital?.[0]} />
                        <CountryDetail label="Region" value={country.region} />
                        <CountryDetail label="Population" value={country.population?.toLocaleString()} />
                        <CountryDetail label="Languages" value={country.languages ? Object.values(country.languages).join(", ") : null} />
                      </div>
                      <Link
                        to={`/country-details/${country.cca3}`}
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <FaInfoCircle className="w-4 h-4 mr-2" />
                        More Details
                      </Link>
                    </div>

                  {/* Favorite Button (onClick remains the same, calls handleFavoriteClick) */}
                  <button
                    onClick={() => handleFavoriteClick(country)}
                    className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-600 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={isFavorite ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} to favorites`}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {/* The icon correctly reflects the current `isFavorite` status */}
                    {isFavorite ? <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-red-500" />}
                  </button>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
         )}
      </div>
    </div>
  );
};

export default Countries;