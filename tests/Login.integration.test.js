beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {}); 
});


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';

var getSupabaseMock;

jest.mock('../src/supabaseClient', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
    },
  };
  getSupabaseMock = () => mockSupabase;
  return { supabase: mockSupabase };
});


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const DummyHome = () => <div>Welcome to Home Page</div>;

describe('Login Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in the user and redirects to /home', async () => {
    const supabase = getSupabaseMock();

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: {}, user: { id: '123', email: 'user@example.com' } },
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/sign-in']}>
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/home" element={<DummyHome />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: '123456',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
