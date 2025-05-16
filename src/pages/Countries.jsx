import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaSearch,
  FaHeart,
  FaRegHeart,
  FaInfoCircle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 12;

const CountryDetail = ({ label, value }) => (
  <p className="text-sm">
    <span className="font-medium text-gray-700">{label}:</span>{" "}
    <span className="text-gray-600">{value || "N/A"}</span>
  </p>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-12" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <FaChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

const Countries = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem("persistedSearchQuery") || "");
  const [selectedRegion, setSelectedRegion] = useState(() => localStorage.getItem("persistedRegion") || "All");
  const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem("persistedLanguage") || "All");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("persistedSearchQuery", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("persistedRegion", selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    localStorage.setItem("persistedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca3,flags,capital,region,population,languages");
        const data = res.data;
        setAllCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load country data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    let result = [...allCountries];
    if (selectedRegion !== "All") result = result.filter(c => c.region === selectedRegion);
    if (selectedLanguage !== "All") result = result.filter(c => c.languages && Object.values(c.languages).includes(selectedLanguage));
    if (searchQuery) result = result.filter(c => c.name.common.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredCountries(result);
    setCurrentPage(1);
  }, [allCountries, selectedRegion, selectedLanguage, searchQuery]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    isAuthenticated ? setFavorites(JSON.parse(localStorage.getItem("favorites")) || []) : setFavorites([]);
  }, [isAuthenticated, authLoading]);

  const handleFavoriteClick = (country) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage your favorites.");
      return;
    }
    const isFav = favorites.some(fav => fav.cca3 === country.cca3);
    const updated = isFav ? favorites.filter(fav => fav.cca3 !== country.cca3) : [...favorites, country];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    toast.success(`${country.name.common} ${isFav ? 'removed from' : 'added to'} favorites!`);
  };

  const uniqueLanguages = useMemo(() => {
    const set = new Set();
    allCountries.forEach(c => c.languages && Object.values(c.languages).forEach(l => set.add(l)));
    return Array.from(set).sort();
  }, [allCountries]);

  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const currentCountries = useMemo(() => filteredCountries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredCountries, currentPage]);

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Explore Countries</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
          <div className="relative md:col-span-1">
            <label htmlFor="search-country" className="sr-only">Search for a country</label>
            <input id="search-country" type="text" placeholder="Search by name..." className="p-3 pl-10 pr-4 w-full border border-gray-300 rounded-md" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} disabled={loading} />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative md:col-span-1">
            <label htmlFor="region-filter" className="sr-only">Filter by region</label>
            <select id="region-filter" className="p-3 w-full border border-gray-300 rounded-md" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} disabled={loading}>
              <option value="All">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
          <div className="relative md:col-span-1">
            <label htmlFor="language-filter" className="sr-only">Filter by language</label>
            <select id="language-filter" className="p-3 w-full border border-gray-300 rounded-md" value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} disabled={loading || uniqueLanguages.length === 0}>
              <option value="All">All Languages</option>
              {uniqueLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
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
            <h3 className="text-lg font-medium text-gray-900">No Countries Found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {currentCountries.map((country) => {
                const isFavorite = favorites.some((fav) => fav.cca3 === country.cca3);
                return (
                  <div key={country.cca3} className="relative flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:translate-y-[-10px] transition-transform duration-300 overflow-hidden border border-gray-100 group">
                    <div className="aspect-video w-full bg-gray-100">
                      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-grow relative">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 truncate" title={country.name.common}>{country.name.common}</h3>
                      <div className="space-y-1.5 mb-4 flex-grow">
                        <CountryDetail label="Capital" value={country.capital?.[0]} />
                        <CountryDetail label="Region" value={country.region} />
                        <CountryDetail label="Population" value={country.population?.toLocaleString()} />
                        <CountryDetail label="Languages" value={country.languages ? Object.values(country.languages).join(", ") : null} />
                      </div>
                      <Link to={`/country-details/${country.cca3}`} className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <FaInfoCircle className="w-4 h-4 mr-2" /> More Details
                      </Link>
                    </div>
                    <button onClick={() => handleFavoriteClick(country)} className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-600 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100">
                      {isFavorite ? <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-red-500" />}
                    </button>
                  </div>
                );
              })}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default Countries;
