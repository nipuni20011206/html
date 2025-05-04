// src/components/FeaturesSection.js
import React from 'react';
import { FaSearchLocation, FaInfoCircle, FaHeart, FaMapMarkedAlt } from 'react-icons/fa';
// Removed 'Link' import

const features = [
  {
    icon: FaSearchLocation,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Explore & Discover',
    description: 'Browse through hundreds of countries, filter by region or language, and find exactly what you\'re looking for.',
    buttonText: 'Start Exploring',
  },
  {
    icon: FaInfoCircle,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Detailed Information',
    description: 'Get in-depth details about each country, including capital, population, area, currency, languages, map location, and more.',
    buttonText: 'See Details',
  },
  {
    icon: FaHeart,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Save Your Favorites',
    description: 'Keep track of the countries that interest you the most by adding them to your personal favorites list for easy access.',
    buttonText: 'View Favorites',
  },
   {
     icon: FaMapMarkedAlt,
     bgColor: 'bg-yellow-100',
     iconColor: 'text-yellow-600',
     title: 'Interactive Maps',
     description: 'Visualize country locations with integrated maps, making geographical exploration intuitive and engaging.',
     buttonText: 'View Maps',
   },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Discover What You Can Do
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform provides comprehensive tools to explore, learn about, and organize information about countries worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Icon Circle */}
              <div className={`w-16 h-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-5 shadow`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-5 flex-grow">
                {feature.description}
              </p>

              {/* --- Button styled to look active but does nothing --- */}
              {feature.buttonText && (
                <button
                  type="button" // Ensures it doesn't submit forms
                  // Use active button styling, including hover effects
                  className="mt-auto inline-block px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow hover:bg-indigo-700 hover:shadow-md transition-all duration-200 cursor-pointer" // Ensure cursor-pointer
                  // No 'disabled' attribute
                  // No 'onClick' handler
                >
                  {feature.buttonText}
                </button>
              )}
              {/* --- End Button --- */}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;