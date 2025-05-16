beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});


jest.mock('../src/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() =>
        Promise.resolve({
          data: { user: { id: 'test-id', email: 'test@example.com' } },
          error: null
        })
      ),
      signInWithOAuth: jest.fn(() =>
        Promise.resolve({
          data: {},
          error: null
        })
      )
    }
  }
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../src/pages/Login';
import { BrowserRouter } from 'react-router-dom';

// Wrap LoginPage with router for useNavigate to work
const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

describe('LoginPage', () => {

  test('submits email/password successfully', async () => {
    renderWithRouter();

    // Fill in fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Mock Supabase response in your actual test environment if needed

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Please fill in both fields/i)).not.toBeInTheDocument();
    });
  });
});
