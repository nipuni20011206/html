import React from 'react';
import { Link } from 'react-router-dom'; // For the CTA button

const Hero = () => {
  // Placeholder image URL from Unsplash (Replace with your chosen image if desired)
  // This one shows a map/globe theme, relevant to exploration.
  const imageUrl = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80';  // Alt: https://images.unsplash.com/photo-1530508977140-77a176fe9400?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80 (flags)
  // Alt: https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80 (earth from space)


  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-sky-50 py-16 sm:py-20 lg:py-24"> {/* Added a subtle gradient background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for two columns on medium screens and up */}
        <div className="md:flex md:items-center md:space-x-12 lg:space-x-16">

          {/* --- Left Column: Text Content --- */}
          <div className="md:w-1/2 lg:w-3/5 mb-10 md:mb-0 text-center md:text-left"> {/* Takes slightly more width on large screens, centers text on mobile */}
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Your Global Guide
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight mb-4">
              <span className="inline-block mr-2" role="img" aria-label="Globe emoji">🌍</span>
              Discover Countries
            </h1>
            <p className="text-lg text-gray-600 sm:text-xl max-w-xl mx-auto md:mx-0 mb-8"> {/* Max width for readability, centered on mobile */}
              Dive deep into details about any nation. Access population stats, capitals, languages, currencies, maps, and flags instantly through our comprehensive REST API data.
            </p>
            <Link
              to="/countries" // Link to your main countries list page
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Browse Countries
              <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg> {/* Simple arrow icon */}
            </Link>
          </div>

          {/* --- Right Column: Image --- */}
          <div className="md:w-1/2 lg:w-2/5">
            <div className="aspect-w-4 aspect-h-3 sm:aspect-w-16 sm:aspect-h-9 md:aspect-w-4 md:aspect-h-3 lg:aspect-h-4 rounded-lg overflow-hidden shadow-2xl"> {/* Aspect ratio container, responsive */}
              <img
                className="w-full h-full object-cover" // Ensure image covers the container
                src={imageUrl}
                alt="Stylized map showing global connections and exploration" // Descriptive alt text
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;