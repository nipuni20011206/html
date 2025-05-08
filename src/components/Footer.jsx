// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaHeart, FaUser, FaGithub } from 'react-icons/fa'; // Example icons

const SITE_NAME = "CountryExplorer";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Copyright */}
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          © {currentYear} {SITE_NAME}
        </p>

        {/* Icon Links */}
        <nav className="flex space-x-6 order-1 sm:order-2" aria-label="Footer Quick Links">
          <Link to="/explore" className="text-gray-500 hover:text-blue-600 transition-colors" title="Explore">
            <FaCompass className="h-5 w-5" />
            <span className="sr-only">Explore</span>
          </Link>
          <Link to="/favourites" className="text-gray-500 hover:text-red-600 transition-colors" title="Favourites">
            <FaHeart className="h-5 w-5" />
             <span className="sr-only">Favourites</span>
          </Link>
          <Link to="/profile" className="text-gray-500 hover:text-indigo-600 transition-colors" title="Profile">
            <FaUser className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Link>
           {/* Optional External Link */}
           <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors" title="GitHub">
              <FaGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
           </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;