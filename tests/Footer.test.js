// src/components/Footer.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Needed because Footer uses <Link>
import Footer from '../src/components/Footer';

const SITE_NAME = "CountryExplorer";

describe('Footer Component', () => {
  // Helper function to render the Footer within MemoryRouter
  const renderFooter = () => {
    render(
      <MemoryRouter>
        <Footer/>
      </MemoryRouter>
    );
  };

  test('renders copyright information with current year and site name', () => {
    renderFooter();
    const currentYear = new Date().getFullYear();
    const expectedCopyrightText = `© ${currentYear} ${SITE_NAME}`;

    
    // Check for the copyright text. Using a regex can make it more resilient to slight spacing changes.
    const copyrightElement = screen.getByText(new RegExp(`© ${currentYear} ${SITE_NAME}`, 'i'));
    expect(copyrightElement).toBeInTheDocument();
  });

  test('renders Explore navigation link correctly', () => {
    renderFooter();
    // We target links by their accessible name, which includes the sr-only text
    const exploreLink = screen.getByRole('link', { name: /Countries/i });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute('href', '/explore');
    expect(exploreLink).toHaveAttribute('title', 'Explore');
    // Check for the icon within the link (optional, but good for visual confirmation)
    expect(exploreLink.querySelector('svg')).toBeInTheDocument(); // FaCompass
  });

  test('renders Favourites navigation link correctly', () => {
    renderFooter();
    const favouritesLink = screen.getByRole('link', { name: /Favourites/i });
    expect(favouritesLink).toBeInTheDocument();
    expect(favouritesLink).toHaveAttribute('href', '/favourites');
    expect(favouritesLink).toHaveAttribute('title', 'Favourites');
    expect(favouritesLink.querySelector('svg')).toBeInTheDocument(); // FaHeart
  });

  test('renders Profile navigation link correctly', () => {
    renderFooter();
    const profileLink = screen.getByRole('link', { name: /Profile/i });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/profile');
    expect(profileLink).toHaveAttribute('title', 'Profile');
    expect(profileLink.querySelector('svg')).toBeInTheDocument(); // FaUser
  });

  test('renders external GitHub link correctly', () => {
    renderFooter();
    const githubLink = screen.getByRole('link', { name: /GitHub/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(githubLink).toHaveAttribute('title', 'GitHub');
    expect(githubLink.querySelector('svg')).toBeInTheDocument(); // FaGithub
  });

  test('footer element itself is present', () => {
    renderFooter();
    // The <footer> element has an implicit role of 'contentinfo'
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });
});