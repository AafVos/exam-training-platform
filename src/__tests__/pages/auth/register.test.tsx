import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RegisterPage from '@/pages/auth/register';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByText('Maak je account aan')).toBeInTheDocument();
    expect(screen.getByText('Begin vandaag nog met je VWO Wiskunde B voorbereiding')).toBeInTheDocument();
    expect(screen.getByLabelText(/volledige naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mailadres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wachtwoord/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vwo niveau/i)).toBeInTheDocument();
  });

  it('shows success message after successful registration', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        user: { name: 'Test User', email: 'test@example.com' },
        message: 'Account succesvol aangemaakt',
      }),
    });

    render(<RegisterPage />);

    // Fill out the form
    await user.type(screen.getByLabelText(/volledige naam/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mailadres/i), 'test@example.com');
    await user.type(screen.getByLabelText(/wachtwoord/i), 'TestPass123');
    await user.selectOptions(screen.getByLabelText(/vwo niveau/i), 'VWO 6');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /account aanmaken/i });
    await user.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Account Aangemaakt!')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Controleer je e-mail')).toBeInTheDocument();
  });

  it('shows error message on registration failure', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: false,
        error: 'E-mailadres is al in gebruik',
      }),
    });

    render(<RegisterPage />);

    // Fill out the form
    await user.type(screen.getByLabelText(/volledige naam/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mailadres/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/wachtwoord/i), 'TestPass123');
    await user.selectOptions(screen.getByLabelText(/vwo niveau/i), 'VWO 6');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /account aanmaken/i });
    await user.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('E-mailadres is al in gebruik')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<RegisterPage />);

    // Fill out the form
    await user.type(screen.getByLabelText(/volledige naam/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mailadres/i), 'test@example.com');
    await user.type(screen.getByLabelText(/wachtwoord/i), 'TestPass123');
    await user.selectOptions(screen.getByLabelText(/vwo niveau/i), 'VWO 6');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /account aanmaken/i });
    await user.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/onverwachte fout opgetreden/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('allows resending verification email', async () => {
    const user = userEvent.setup();
    
    // First, simulate successful registration
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        user: { name: 'Test User', email: 'test@example.com' },
      }),
    });

    render(<RegisterPage />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/volledige naam/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mailadres/i), 'test@example.com');
    await user.type(screen.getByLabelText(/wachtwoord/i), 'TestPass123');
    await user.selectOptions(screen.getByLabelText(/vwo niveau/i), 'VWO 6');
    await user.click(screen.getByRole('button', { name: /account aanmaken/i }));

    // Wait for success page
    await waitFor(() => {
      expect(screen.getByText('Account Aangemaakt!')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Mock resend verification
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        message: 'Nieuwe verificatie-e-mail verzonden',
      }),
    });

    // Click resend button
    const resendButton = screen.getByText('Nieuwe verificatie-e-mail verzenden');
    await user.click(resendButton);

    // Check that resend API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
    }, { timeout: 3000 });
  });

  it('shows platform benefits', () => {
    render(<RegisterPage />);

    expect(screen.getByText('Waarom Exam Training Platform?')).toBeInTheDocument();
    expect(screen.getByText('Gerichte Voorbereiding')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Feedback')).toBeInTheDocument();
    expect(screen.getByText('Voortgang Tracking')).toBeInTheDocument();
  });

  it('allows navigation back to registration from success page', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        user: { name: 'Test User', email: 'test@example.com' },
      }),
    });

    render(<RegisterPage />);

    // Complete registration
    await user.type(screen.getByLabelText(/volledige naam/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mailadres/i), 'test@example.com');
    await user.type(screen.getByLabelText(/wachtwoord/i), 'TestPass123');
    await user.selectOptions(screen.getByLabelText(/vwo niveau/i), 'VWO 6');
    await user.click(screen.getByRole('button', { name: /account aanmaken/i }));

    // Wait for success page
    await waitFor(() => {
      expect(screen.getByText('Account Aangemaakt!')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Click back to registration
    const backButton = screen.getByText('Terug naar registratie');
    await user.click(backButton);

    // Should show registration form again
    expect(screen.getByText('Maak je account aan')).toBeInTheDocument();
    expect(screen.getByLabelText(/volledige naam/i)).toBeInTheDocument();
  });
});
