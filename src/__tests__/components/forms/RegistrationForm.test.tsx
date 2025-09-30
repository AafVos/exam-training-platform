import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RegistrationForm } from '@/components/forms/RegistrationForm';

describe('RegistrationForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    errors: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<RegistrationForm {...defaultProps} />);

    expect(screen.getByLabelText(/volledige naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mailadres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wachtwoord/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vwo niveau/i)).toBeInTheDocument();
    expect(screen.getByText('Wiskunde B')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /account aanmaken/i })).toBeInTheDocument();
  });

  it('shows required field indicators', () => {
    render(<RegistrationForm {...defaultProps} />);

    const requiredFields = screen.getAllByText('*');
    expect(requiredFields).toHaveLength(4); // name, email, password, vwoLevel
  });

  it('updates form data when user types', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/volledige naam/i);
    const emailInput = screen.getByLabelText(/e-mailadres/i);
    const passwordInput = screen.getByLabelText(/wachtwoord/i);

    await user.type(nameInput, 'Jan de Vries');
    await user.type(emailInput, 'jan@example.com');
    await user.type(passwordInput, 'TestPass123');

    expect(nameInput).toHaveValue('Jan de Vries');
    expect(emailInput).toHaveValue('jan@example.com');
    expect(passwordInput).toHaveValue('TestPass123');
  });

  it('shows VWO level options', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...defaultProps} />);

    const vwoSelect = screen.getByLabelText(/vwo niveau/i);
    await user.click(vwoSelect);

    expect(screen.getByText('VWO 4')).toBeInTheDocument();
    expect(screen.getByText('VWO 5')).toBeInTheDocument();
    expect(screen.getByText('VWO 6')).toBeInTheDocument();
  });

  it('shows password strength indicator', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/wachtwoord/i);
    await user.type(passwordInput, 'TestPass123');

    await waitFor(() => {
      expect(screen.getByText(/wachtwoord sterkte/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/wachtwoord/i);
    const toggleButton = screen.getByRole('button', { name: '👁️' }); // Eye button

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('does not submit form when validation fails', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /account aanmaken/i });
    await user.click(submitButton);

    // Should not call onSubmit when form is empty/invalid
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(<RegistrationForm {...defaultProps} />);

    // Fill in valid form data
    await user.type(screen.getByLabelText(/volledige naam/i), 'Jan de Vries');
    await user.type(screen.getByLabelText(/e-mailadres/i), 'jan@example.com');
    await user.type(screen.getByLabelText(/wachtwoord/i), 'TestPass123');
    await user.selectOptions(screen.getByLabelText(/vwo niveau/i), 'VWO 6');

    const submitButton = screen.getByRole('button', { name: /account aanmaken/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'TestPass123',
        vwoLevel: 'VWO 6',
      });
    });
  });

  it('shows loading state during submission', () => {
    render(<RegistrationForm {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /account aanmaken/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/account aanmaken\.\.\./i)).toBeInTheDocument();
  });

  it('displays server errors', () => {
    const errors = {
      email: 'E-mailadres is al in gebruik',
      general: 'Er is een fout opgetreden',
    };

    render(<RegistrationForm {...defaultProps} errors={errors} />);

    expect(screen.getByText('E-mailadres is al in gebruik')).toBeInTheDocument();
    expect(screen.getByText('Er is een fout opgetreden')).toBeInTheDocument();
  });

  it('shows server errors initially', async () => {
    const errors = { name: 'Naam is te kort' };

    render(<RegistrationForm {...defaultProps} errors={errors} />);

    expect(screen.getByText('Naam is te kort')).toBeInTheDocument();
  });

  it('shows login link', () => {
    render(<RegistrationForm {...defaultProps} />);

    const loginLink = screen.getByText(/log hier in/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/auth/login');
  });

  it('displays subject as fixed field', () => {
    render(<RegistrationForm {...defaultProps} />);

    expect(screen.getByText('Wiskunde B')).toBeInTheDocument();
    expect(screen.getByText(/momenteel alleen beschikbaar voor wiskunde b/i)).toBeInTheDocument();
  });
});
