// src/components/FeaturedCountry.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Languages, Landmark } from 'lucide-react';

// Placeholder data - you can make this dynamic later
const featured = {
  name: 'Japan',
  tagline: 'Land of the Rising Sun',
  imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  description: 'Japan is an island country in East Asia, known for its traditional arts, including tea ceremonies, calligraphy and flower arranging, and a unique blend of ancient temples and futuristic cities.',
  facts: [
    { icon: MapPin, text: 'Capital: Tokyo' },
    { icon: Users, text: 'Population: ~125 million' },
    { icon: Languages, text: 'Language: Japanese' },
    { icon: Landmark, text: 'Currency: Yen (JPY)' },
  ],
  path: '/countries/Japan' // Assuming your country detail path is like /countries/:name
};

const FeaturedCountry = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Country Spotlight
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Discover {featured.name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {featured.tagline}
          </p>
        </div>

        <div className="lg:flex lg:items-center lg:space-x-12 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-700/30 rounded-xl overflow-hidden p-6 md:p-8">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <img
              src={featured.imageUrl}
              alt={`Scenic view of ${featured.name}`}
              className="w-full h-auto object-cover rounded-lg shadow-md aspect-video"
            />
          </div>
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{featured.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-justify">
              {featured.description}
            </p>
            <ul className="space-y-3 mb-8">
              {featured.facts.map((fact, index) => (
                <li key={index} className="flex items-center text-gray-700 dark:text-gray-200">
                  <fact.icon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  {fact.text}
                </li>
              ))}
            </ul>
            <span
              to={featured.path}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Learn More About {featured.name}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCountry;