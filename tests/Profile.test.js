beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});


jest.mock('../src/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { code: 'PGRST116', message: 'Profile not found' } }),
        }),
      }),
    })),
  },
}));



import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from '../src/pages/Profile';
import { AuthContext } from '../src/context/AuthContext';
import { supabase } from '../src/supabaseClient';
import { MemoryRouter } from 'react-router-dom';

const mockUser = {
  id: '123',
  email: 'test@example.com',
  user_metadata: {
    username: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
  },
  created_at: '2022-01-01T00:00:00Z',
};

const renderProfilePage = (ctx = {}) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        ...ctx
      }}>
        <ProfilePage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.setItem('favorites', JSON.stringify([
      { cca3: 'USA', name: { common: 'United States' } },
    ]));

    // Clear mocks before each test
    jest.clearAllMocks();

    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: {
              username: 'testuser',
              bio: 'Hello world!',
              avatar_url: 'https://example.com/avatar.png',
              created_at: '2022-01-01T00:00:00Z',
            },
            error: null,
          }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({
            data: {
              bio: 'Updated bio',
              username: 'testuser',
            },
            error: null,
          }),
        }),
      }),
    });
  });

  it('renders the profile page with user info and favorites', async () => {
    renderProfilePage();

    expect(screen.getByText(/Loading Profile/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Tell us a little/i)).toBeInTheDocument();
    });
  });

   it('shows error when Supabase returns an error', async () => {
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Fetch failed' } }),
        }),
      }),
    });

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Fetch failed/i)).toBeInTheDocument();
    });
  });

  it('can update the user bio', async () => {
    renderProfilePage();

    await waitFor(() => screen.getByDisplayValue('Hello world!'));

    const textarea = screen.getByPlaceholderText(/Tell us a little/i);
    fireEvent.change(textarea, { target: { value: 'Updated bio' } });

    const button = screen.getByText(/Save Bio/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(textarea.value).toBe('Updated bio');
    });
  });

  it('disables save button when bio is unchanged', async () => {
    renderProfilePage();

    await waitFor(() => screen.getByDisplayValue('Hello world!'));
    const button = screen.getByRole('button', { name: /Save Bio/i });
    expect(button).toBeDisabled();

  });
});
