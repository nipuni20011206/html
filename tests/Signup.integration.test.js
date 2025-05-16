import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../src/pages/Signup';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';

// Mock Supabase client
jest.mock('../src/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithOAuth: jest.fn()
    }
  }
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Signup Integration Test', () => {
  it('allows a user to sign up successfully and redirects', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: {
        user: { email: 'john@example.com' },
        session: null,
        user_metadata: { username: 'john' },
        identities: [] // No session yet, requires email confirmation
      },
      error: null
    });

    renderWithRouter(<Signup />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '123456' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Expect success message
    await waitFor(() => {
  const successText = screen.getByText((content) =>
        content.includes('Sign up successful')
    );
    expect(successText).toBeInTheDocument();
    });
  });

  it('shows Supabase error when signup fails', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: 'Email already registered' }
    });

    renderWithRouter(<Signup />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });
});
