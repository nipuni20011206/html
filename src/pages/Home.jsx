import React from 'react';
import Hero from '../components/Hero';
import FeaturesSection from '../components/FeaturesSection';
import FeaturedCountry from '../components/FeaturedCountry';

const Home = () => {
  return (
    <div>
      <Hero /> 
      <FeaturesSection />
      <FeaturedCountry />
    </div>
  );
};

export default Home;
