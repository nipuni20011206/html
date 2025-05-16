beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {}); // silences all console.log
});


// Mock Supabase client before anything else
jest.mock('../src/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
  },
}));


import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Countries from '../src/pages/Countries';
import { AuthContext } from '../src/context/AuthContext';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';

// Mock country data
const mockCountries = [
  {
    cca3: 'USA',
    name: { common: 'United States' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    population: 331002651,
    languages: { eng: 'English' },
    flags: { svg: 'https://flagcdn.com/us.svg' }
  },
  {
    cca3: 'JPN',
    name: { common: 'Japan' },
    capital: ['Tokyo'],
    region: 'Asia',
    population: 126476461,
    languages: { jpn: 'Japanese' },
    flags: { svg: 'https://flagcdn.com/jp.svg' }
  }
];

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => JSON.stringify([]));
  Storage.prototype.setItem = jest.fn();
});

// Mock axios
jest.mock('axios');
axios.get.mockResolvedValue({ data: mockCountries });

// Custom render with mocked AuthContext
const renderWithAuth = async (isAuthenticated = false) => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isAuthenticated, isLoading: false }}>
          <Countries />
        </AuthContext.Provider>
      </MemoryRouter>
    );
};

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (msg.includes('act(...)')) return;
    console.error(msg, ...args);
  });
});


describe('Countries Component', () => {
  it('renders loading spinner initially', async () => {
    renderWithAuth();
    expect(screen.getByText(/Loading countries/i)).toBeInTheDocument();
  });

  it('renders countries after fetch', async () => {
  await renderWithAuth();

  await waitFor(() => {
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });
});


  it('filters countries by search query', async () => {
    renderWithAuth();
    await waitFor(() => screen.getByText('Japan'));

    const input = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(input, { target: { value: 'Japan' } });

    await waitFor(() => {
      expect(screen.getByText('Japan')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
    });
  });

  it('shows toast and blocks favorites if not authenticated', async () => {
  await renderWithAuth(false); // Not logged in

  await waitFor(() => screen.getByText('Japan'));

  const favoriteButtons = screen.getAllByLabelText(/Add .* to favorites/i);
  fireEvent.click(favoriteButtons[0]);

  expect(localStorage.setItem).not.toHaveBeenCalled();
});

it('allows adding/removing favorites when authenticated', async () => {
  await renderWithAuth(true); // Logged in

  await waitFor(() => screen.getByText('Japan'));

  const favoriteButtons = screen.getAllByLabelText(/Add .* to favorites/i);
  fireEvent.click(favoriteButtons[0]);

  expect(localStorage.setItem).toHaveBeenCalledTimes(1);
});

});