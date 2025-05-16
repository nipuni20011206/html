beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CountryDetails from '../src/pages/Details';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-leaflet', () => {
  const actual = jest.requireActual('react-leaflet');
  return {
    ...actual,
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => <div />,
    Marker: () => <div />,
    Popup: ({ children }) => <div>{children}</div>
  };
});

const mockCountryData = {
  name: { common: 'France', official: 'French Republic' },
  capital: ['Paris'],
  region: 'Europe',
  subregion: 'Western Europe',
  population: 67000000,
  area: 640679,
  languages: { fra: 'French' },
  currencies: { EUR: { name: 'Euro', symbol: '€' } },
  idd: { root: '+33', suffixes: ['1'] },
  timezones: ['UTC+01:00'],
  flags: { svg: 'https://example.com/france.svg' },
  latlng: [46.2276, 2.2137],
  borders: ['DEU', 'ESP'],
};

const renderWithRouter = (code) => {
  return render(
    <MemoryRouter initialEntries={[`/country/${code}`]}>
      <Routes>
        <Route path="/country/:code" element={<CountryDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CountryDetails Component', () => {
  it('shows loading state initially', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockCountryData] });

    renderWithRouter('FRA');
    expect(screen.getByText(/Loading Country Data/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/France/i)).toBeInTheDocument());
  });

  it('displays error if API fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter('FRA');

    await waitFor(() =>
      expect(screen.getByText(/Failed to fetch country details/i)).toBeInTheDocument()
    );
  });

  it('renders country details correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockCountryData] });

    renderWithRouter('FRA');

    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText(/French Republic/)).toBeInTheDocument();
      expect(screen.getByText(/Paris/)).toBeInTheDocument();
      expect(screen.getByText(/Euro \(€/)).toBeInTheDocument();
      expect(screen.getByTestId('map')).toBeInTheDocument();
    });
  });

  it('renders border countries when available', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockCountryData] });

    renderWithRouter('FRA');

    await waitFor(() => {
      expect(screen.getByText('DEU')).toBeInTheDocument();
      expect(screen.getByText('ESP')).toBeInTheDocument();
    });
  });

  it('renders fallback message when country data not found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter('XYZ');

    await waitFor(() => {
      expect(screen.getByText(/Country details not found/i)).toBeInTheDocument();
    });
  });
});
