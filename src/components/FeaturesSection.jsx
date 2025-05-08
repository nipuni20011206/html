// src/components/FeaturesSection.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { FaSearchLocation, FaInfoCircle, FaHeart, FaMapMarkedAlt } from 'react-icons/fa';
import { ChevronRightIcon } from 'lucide-react'; // For a nicer button icon
import { useAuth } from '../context/AuthContext'; // To check if user is authenticated for Favourites

const FeaturesSection = () => {
  const { isAuthenticated } = useAuth();

  const featuresData = [
    {
      icon: FaSearchLocation,
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
      title: 'Explore & Discover',
      description: 'Browse through hundreds of countries, filter by region or language, and find exactly what you\'re looking for.',
      buttonText: 'Start Exploring',
      path: '/countries',
    },
    {
      icon: FaInfoCircle,
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
      title: 'Detailed Information',
      description: 'Get in-depth details about each country, including capital, population, area, currency, languages, map location, and more.',
      buttonText: 'See Examples',
      path: '/countries', // Could link to a specific country later
    },
    {
      icon: FaHeart,
      bgColor: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-400',
      title: 'Save Your Favorites',
      description: 'Keep track of the countries that interest you the most by adding them to your personal favorites list for easy access.',
      buttonText: 'View Favorites',
      path: '/favourites',
      requiresAuth: true,
    },
    {
      icon: FaMapMarkedAlt,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      title: 'Interactive Maps',
      description: 'Visualize country locations with integrated maps, making geographical exploration intuitive and engaging.',
      buttonText: 'Explore Maps',
      path: '/countries', // Or a dedicated map page if you build one
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Discover What You Can Do
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform provides comprehensive tools to explore, learn about, and organize information about countries worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {featuresData.map((feature, index) => {
            const isFavouritesAndNotAuth = feature.requiresAuth && !isAuthenticated;
            const buttonPath = isFavouritesAndNotAuth ? '/sign-in' : feature.path;
            const buttonLabel = isFavouritesAndNotAuth ? 'Login to View' : feature.buttonText;

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl dark:shadow-gray-700/50 dark:hover:shadow-gray-600/60 transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-5 shadow-md`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 flex-grow">
                  {feature.description}
                </p>
                {feature.buttonText && (
                  <Link
                    to={buttonPath}
                    className="mt-auto inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {buttonLabel}
                    <ChevronRightIcon className="w-4 h-4 ml-1.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;