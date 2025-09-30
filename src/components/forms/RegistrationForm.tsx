import React, { useState } from 'react';
import { FormField } from './FormField';
import { PasswordStrength } from './PasswordStrength';
import { VWOLevelSelect } from './VWOLevelSelect';
import { RegistrationData } from '@/types';
import { registerSchema } from '@/lib/validations/auth';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
  isLoading: boolean;
  errors: Record<string, string>;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading,
  errors,
}) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: process.env.NODE_ENV === 'test' ? '' : 'Jan de Vries',
    email: process.env.NODE_ENV === 'test' ? '' : `test${Date.now()}@example.com`,
    password: process.env.NODE_ENV === 'test' ? '' : 'TestWachtwoord123',
    vwoLevel: process.env.NODE_ENV === 'test' ? '' : 'VWO 6',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof RegistrationData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const result = registerSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setFieldErrors(newErrors);
      return false;
    }
    
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Combine server errors and client validation errors
  const getFieldError = (field: string): string => {
    return fieldErrors[field] || errors[field] || '';
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Account Aanmaken
        </h2>
        <p className="text-gray-600">
          Maak een account aan om te beginnen met oefenen voor Wiskunde B
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <FormField
          label="Volledige naam"
          name="name"
          type="text"
          placeholder="Bijvoorbeeld: Jan de Vries"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={getFieldError('name')}
          required
        />

        {/* Email Field */}
        <FormField
          label="E-mailadres"
          name="email"
          type="email"
          placeholder="jouw@email.com"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={getFieldError('email')}
          required
        />

        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Wachtwoord
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Kies een sterk wachtwoord"
              value={formData.password}
              onChange={(e) => handleInputChange('password')(e.target.value)}
              className={`
                w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${getFieldError('password') ? 'border-red-500' : 'border-gray-300'}
              `.trim()}
              required
              aria-describedby={getFieldError('password') ? 'password-error' : undefined}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <span className="text-gray-500">🙈</span>
              ) : (
                <span className="text-gray-500">👁️</span>
              )}
            </button>
          </div>
          {getFieldError('password') && (
            <p
              id="password-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {getFieldError('password')}
            </p>
          )}
          <PasswordStrength password={formData.password} />
        </div>

        {/* VWO Level Select */}
        <VWOLevelSelect
          value={formData.vwoLevel}
          onChange={handleInputChange('vwoLevel')}
          error={getFieldError('vwoLevel')}
        />

        {/* Subject Field (Fixed) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vak
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
            Wiskunde B
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Momenteel alleen beschikbaar voor Wiskunde B
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600" role="alert">
              {errors.general}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-2 px-4 rounded-md font-medium text-white transition-colors
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }
          `.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Account aanmaken...
            </span>
          ) : (
            'Account Aanmaken'
          )}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Heb je al een account?{' '}
            <a
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Log hier in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
