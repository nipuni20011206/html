// src/pages/LoginPage.test.jsx  <-- Renamed to match convention (or keep .jsx if preferred)

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent
import { BrowserRouter } from 'react-router-dom'; // Needed for Link component
import axios from 'axios'; // Import axios to mock it
import { useAuth } from '../context/AuthContext'; // Import useAuth to mock it
import LoginPage from './LoginPage'; // Adjust path if needed

// --- Mock Dependencies ---

// Mock axios
jest.mock('axios');

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use actual Link, etc.
  useNavigate: () => mockNavigate, // Provide mock navigate function
}));

// Mock useAuth context hook
const mockLogin = jest.fn(); // Mock the login function provided by context
jest.mock('../context/AuthContext', () => ({
  // Mock the whole module
  useAuth: () => ({
    // Return the object expected from the hook
    login: mockLogin, // Provide the mock login function
    // Add other context values if LoginPage uses them (e.g., isAuthenticated, user)
    isAuthenticated: false,
    user: null,
  }),
  // Export AuthProvider as a simple component if needed for wrapping,
  // but often not necessary if mocking useAuth directly.
  // AuthProvider: ({ children }) => <div>{children}</div>,
}));
// ------------------------

describe('LoginPage Component', () => {
  // Setup userEvent before each test
  let user;
  beforeEach(() => {
    user = userEvent.setup();
    // Reset mocks before each test
    mockNavigate.mockClear();
    mockLogin.mockClear();
    axios.post.mockClear();
  });

  // Helper function to render with Router wrapper
  const renderComponent = () => {
    render(
      <BrowserRouter> {/* Needed because LoginPage uses <Link> internally */}
        <LoginPage />
      </BrowserRouter>
    );
  };

  // --- Test Cases ---

  test('renders login form correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows user to type into email and password fields', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows error message if fields are empty on submit', async () => {
    renderComponent();
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.click(loginButton);

    expect(screen.getByText(/please fill in both fields/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled(); // API call shouldn't happen
    expect(mockLogin).not.toHaveBeenCalled(); // Context login shouldn't be called
  });

  test('calls API, calls context login, and navigates on successful login', async () => {
    // Arrange: Mock successful API response
    const mockApiResponse = {
      token: 'mock-jwt-token-123',
      user: { id: 'user1', username: 'tester', email: 'test@example.com' },
    };
    axios.post.mockResolvedValueOnce({ data: mockApiResponse }); // Mock a successful response

    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Act: Fill form and submit
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    // Assert: Check loading state (optional, depends on implementation)
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();

    // Assert: API call check (wait for async operations)
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/login', // URL
      { email: 'test@example.com', password: 'password123' }, // Data
      { headers: { 'Content-Type': 'application/json' } } // Config
    );

    // Assert: Context login function called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
    expect(mockLogin).toHaveBeenCalledWith(mockApiResponse.token, mockApiResponse.user);

    // Assert: Navigation called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/'); // Check navigation target

    // Assert: No error message shown
    expect(screen.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
  });

  test('shows error message on failed login (invalid credentials)', async () => {
    // Arrange: Mock failed API response
    const mockApiError = {
      response: { // Simulate axios error structure
        data: { message: 'Invalid email or password.' },
        status: 401,
      },
    };
    axios.post.mockRejectedValueOnce(mockApiError); // Mock a rejection

    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Act: Fill form and submit
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    // Assert: Loading state changes back (optional check)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    // Assert: API call was made
    expect(axios.post).toHaveBeenCalledTimes(1);

    // Assert: Error message is displayed
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();

    // Assert: Context login and navigate were NOT called
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

    test('shows generic error message on other API errors', async () => {
    // Arrange: Mock a generic server error
    const mockApiError = new Error("Network Error"); // Simulate network issue
    axios.post.mockRejectedValueOnce(mockApiError);

    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Act: Fill form and submit
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    // Assert: Check for the fallback error message from the component
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument(); // Your component uses this as fallback

    // Assert: Context login and navigate were NOT called
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });


  test('toggles password visibility correctly', async () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/password/i);
    // Find the button by its aria-label (adjust if your button label changes)
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    // Initial state: password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    // Check aria-label changed
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    // Click to hide again
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
     // Check aria-label changed back
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

});