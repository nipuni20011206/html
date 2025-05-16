import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../src/pages/Signup';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import { within } from '@testing-library/react';

// Mock supabase
jest.mock('../src/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  },
}));

const renderSignup = () => {
  return render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );
};

describe('Signup Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    renderSignup();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

    it('shows error for mismatched passwords', async () => {
    renderSignup();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '654321' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('calls supabase.auth.signUp on valid submit', async () => {
  supabase.auth.signUp.mockResolvedValueOnce({
    data: {
      user: { id: '123', identities: [] },
      session: null,
    },
    error: null,
  });

  renderSignup();
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'john' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '123456' } });

  fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  const success = await screen.findByText(/check your email to confirm|redirecting to login/i);
  expect(success).toBeInTheDocument();
});


  it('handles Supabase signup error gracefully', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: 'User already exists' },
    });

    renderSignup();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });

  it('calls Supabase Google OAuth when button clicked', async () => {
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({ data: {}, error: null });

    renderSignup();
    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({ provider: 'google' });
    });
  });
});
