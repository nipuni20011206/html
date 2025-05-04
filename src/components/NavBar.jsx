import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { Menu, X, Globe, User, LogOut, Heart, UserCircle } from "lucide-react";
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- Use Authentication Context ---
  const { isAuthenticated, user, logout } = useAuth(); // Get state and functions

  // Define links - Favourites might require authentication
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Countries", path: "/countries" },
    { name: "Favourites", path: "/favourites", requiresAuth: true }, // Example: requires auth
  ];

  // Filter links based on authentication status
  const accessibleNavLinks = navLinks.filter(link => !link.requiresAuth || isAuthenticated);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Run always to attach/detach listener

  // --- Logout Handler (uses context's logout) ---
  const handleLogout = async () => {
    try {
      // Make an API call to the backend logout endpoint
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Call logout from context (clear token from context or localStorage)
      logout(); 

      // Optionally close any dropdown or modal if applicable
      setIsDropdownOpen(false); 

      // Redirect to the home page or login page after logout
      navigate("/");

      console.log("User logged out via Navbar");
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
      // Handle logout error (maybe show a notification)
    }
  };

  // --- Dynamic Title ---
  const getNavbarTitle = () => {
    return "Country Explorer"; // Always return the fixed title
  };

  // --- Styling Classes (keep as they were) ---
  const activeLinkClass = "bg-blue-100 text-blue-700";
  const inactiveLinkClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-800";
  const baseLinkClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out";
  const mobileActiveLinkClass = "bg-blue-100 text-blue-700";
  const mobileInactiveLinkClass = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  const mobileBaseLinkClass = "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out";
  const dropdownItemClass = "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out";
  const dropdownButtonClass = `${dropdownItemClass} text-left`;


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo and Title */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2" aria-label="Homepage">
              <Globe className="h-7 w-7 text-blue-600" aria-hidden="true" />
              <span className="text-xl font-semibold text-gray-800 hidden sm:inline">
                {getNavbarTitle()}
              </span>
            </NavLink>
          </div>

          {/* Center/Right: Desktop Links and Auth */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Desktop Nav Links */}
            <div className="flex items-center space-x-1">
              {accessibleNavLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="relative ml-3" ref={dropdownRef}>
              {isAuthenticated ? (
                // If Authenticated: Show Profile Dropdown
                <div>
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <UserCircle className="h-8 w-8 text-gray-600 hover:text-blue-600" />
                  </button>
                  {/* Dropdown Panel */}
                  {isDropdownOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1"
                    >
                      {/* --- Display Username --- */}
                      <div className="px-4 py-2 text-sm text-gray-500 border-b truncate">
                        Signed in as{' '}
                        <span className="font-medium text-gray-700">{user?.username || 'User'}</span>
                      </div>
                      <NavLink to="/profile" className={dropdownItemClass} role="menuitem" tabIndex="-1" onClick={() => setIsDropdownOpen(false)}>
                        <User className="mr-2 h-4 w-4" aria-hidden="true" /> Your Profile
                      </NavLink>
                      {/* Conditionally render Favourites if it's in navLinks and requiresAuth */}
                      {navLinks.find(l => l.path === '/favourites')?.requiresAuth && (
                         <NavLink to="/favourites" className={dropdownItemClass} role="menuitem" tabIndex="-1" onClick={() => setIsDropdownOpen(false)}>
                            <Heart className="mr-2 h-4 w-4" aria-hidden="true" /> Favourites
                         </NavLink>
                      )}
                      <button onClick={handleLogout} className={`${dropdownButtonClass} text-red-600`} role="menuitem" tabIndex="-1">
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // If Not Authenticated: Show Login Button
                <NavLink
                  to="/sign-in" // Ensure this matches your login route
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out shadow-sm"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40" id="mobile-menu">
          {/* Mobile Nav Links */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {accessibleNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)} // Close menu on click
                className={({ isActive }) => `${mobileBaseLinkClass} ${isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          {/* Mobile Auth Section */}
          <div className="pt-3 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-2 sm:px-3">
              {isAuthenticated ? (
                // Authenticated Mobile View
                <>
                  <div className="flex items-center px-3 mb-2">
                     <UserCircle className="h-8 w-8 text-gray-500 mr-2" />
                      <div>
                         <div className="text-base font-medium text-gray-800">{user?.username || 'User'}</div>
                         {/* You could add email here if available and desired */}
                         {/* <div className="text-sm font-medium text-gray-500">{user?.email}</div> */}
                      </div>
                  </div>
                  <NavLink to="/profile" onClick={() => setIsOpen(false)} className={`${mobileBaseLinkClass} ${mobileInactiveLinkClass} flex items-center`}>
                    <User className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" /> Profile
                  </NavLink>
                  {/* Conditionally render Favourites */}
                  {navLinks.find(l => l.path === '/favourites')?.requiresAuth && (
                    <NavLink to="/favourites" onClick={() => setIsOpen(false)} className={`${mobileBaseLinkClass} ${mobileInactiveLinkClass} flex items-center`}>
                        <Heart className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" /> Favourites
                    </NavLink>
                  )}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className={`${mobileBaseLinkClass} ${mobileInactiveLinkClass} w-full text-left flex items-center text-red-600 hover:bg-red-50`}>
                    <LogOut className="mr-3 h-5 w-5" aria-hidden="true" /> Logout
                  </button>
                </>
              ) : (
                // Not Authenticated Mobile View
                <NavLink to="/sign-in" onClick={() => setIsOpen(false)} className={`${mobileBaseLinkClass} ${mobileInactiveLinkClass} text-center bg-blue-50 text-blue-700 hover:bg-blue-100`}>
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;