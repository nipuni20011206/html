// tests/pages/Home.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../src/pages/Home'; // Adjust path if needed

jest.mock('../src/components/Hero', () => () => <div data-testid="mock-hero">Mocked Hero</div>);
jest.mock('../src/components/FeaturesSection', () => () => <div data-testid="mock-features-section">Mocked FeaturesSection</div>);
jest.mock('../src/components/FeaturedCountry', () => () => <div data-testid="mock-featured-country">Mocked FeaturedCountry</div>);


describe('Home Page', () => {
  test('Test 1: Renders the Hero component', () => {
    render(<Home />);
    // If using the mock strategy:
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByText('Mocked Hero')).toBeInTheDocument();


  });

  test('Test 2: Renders the FeaturesSection component', () => {
    render(<Home />);
    // If using the mock strategy:
    expect(screen.getByTestId('mock-features-section')).toBeInTheDocument();
    expect(screen.getByText('Mocked FeaturesSection')).toBeInTheDocument();


  });

  test('Test 3: Renders the FeaturedCountry component', () => {
    render(<Home />);
    // If using the mock strategy:
    expect(screen.getByTestId('mock-featured-country')).toBeInTheDocument();
    expect(screen.getByText('Mocked FeaturedCountry')).toBeInTheDocument();

  });

  test('Test 4: Renders all components', () => {
    
    render(<Home />);
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByTestId('mock-features-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-featured-country')).toBeInTheDocument();

  
  });
});