import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../src/pages/Profile';
import { AuthContext } from '../src/context/AuthContext';
import { supabase } from '../src/supabaseClient';
import { MemoryRouter } from 'react-router-dom';

const mockUser = {
  id: '123',
  email: 'user@example.com',
  user_metadata: { username: 'testuser', avatar_url: 'https://example.com/avatar.png' },
  created_at: '2022-01-01T00:00:00Z',
};


jest.mock('../src/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
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
              username: 'testuser',
              bio: 'Updated bio',
            },
            error: null,
          }),
        }),
      }),
    })),
  },
}));


const renderWithContext = () => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
      }}>
        <ProfilePage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Profile Integration Test', () => {
  it('loads profile data and allows bio update', async () => {
    renderWithContext();

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Hello world!')).toBeInTheDocument();
    });

    // Update bio
    const textarea = screen.getByPlaceholderText(/tell us a little/i);
    fireEvent.change(textarea, { target: { value: 'Updated bio' } });

    const button = screen.getByRole('button', { name: /save bio/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(textarea.value).toBe('Updated bio');
    });
  });
});
