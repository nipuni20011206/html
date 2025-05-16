jest.mock('../src/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
    },
  },
}));

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Countries from '../src/pages/Countries';
import { AuthContext } from '../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

//Mock axios
jest.mock('axios');

//Mock localStorage
beforeEach(() => {
  localStorage.clear();
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'favorites') return JSON.stringify([]);
    return '';
  });
  Storage.prototype.setItem = jest.fn();
});

//Sample countries
const mockCountries = [
  {
    cca3: 'USA',
    name: { common: 'United States' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    population: 331002651,
    languages: { eng: 'English' },
    flags: { svg: 'https://flagcdn.com/us.svg' },
  },
  {
    cca3: 'JPN',
    name: { common: 'Japan' },
    capital: ['Tokyo'],
    region: 'Asia',
    population: 126476461,
    languages: { jpn: 'Japanese' },
    flags: { svg: 'https://flagcdn.com/jp.svg' },
  },
];

//Reusable render function
const renderWithAuth = async (isAuthenticated = false) => {
  axios.get.mockResolvedValue({ data: mockCountries });

  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ isAuthenticated, isLoading: false }}>
        <Countries />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument()
  );
};

describe('Countries Component', () => {
  it('renders loading spinner initially', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isAuthenticated: false, isLoading: false }}>
          <Countries />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading countries/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument()
    );
  });

  it('renders countries after fetch', async () => {
    await renderWithAuth();

    // Use role-based queries to avoid matching extra elements like <option>
    expect(screen.getByRole('heading', { name: 'Japan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'United States' })).toBeInTheDocument();
  });


  it('filters countries by search query', async () => {
    await renderWithAuth();

    const input = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(input, { target: { value: 'Japan' } });

    await waitFor(() => {
      expect(screen.getByText(/Japan/i)).toBeInTheDocument();
      expect(screen.queryByText(/United States/i)).not.toBeInTheDocument();
    });
  });

  it('shows toast and blocks favorites if not authenticated', async () => {
    await renderWithAuth(false);
    const favoriteButtons = screen.getAllByLabelText(/Add .* to favorites/i);
    fireEvent.click(favoriteButtons[0]);

    // This should still not include favorites being saved
    expect(localStorage.setItem).not.toHaveBeenCalledWith("favorites", expect.any(String));
  });


  it('allows adding/removing favorites when authenticated', async () => {
    await renderWithAuth(true);
    const favoriteButtons = screen.getAllByLabelText(/Add .* to favorites/i);
    fireEvent.click(favoriteButtons[0]);

    // Count how many times it was called with 'favorites'
    const favoriteCalls = localStorage.setItem.mock.calls.filter(call => call[0] === "favorites");
    expect(favoriteCalls).toHaveLength(1);
  });

});
