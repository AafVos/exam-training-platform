import React from 'react';
import { checkPasswordStrength } from '@/lib/auth/password';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  className = '',
}) => {
  const strength = checkPasswordStrength(password);

  if (!password) {
    return null;
  }

  const getStrengthColor = (score: number): string => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number): string => {
    if (score <= 2) return 'Zwak';
    if (score <= 3) return 'Matig';
    if (score <= 4) return 'Goed';
    return 'Sterk';
  };

  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength bar */}
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded ${
              level <= strength.score
                ? getStrengthColor(strength.score)
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength text */}
      <div className="flex justify-between items-center text-sm">
        <span className={`font-medium ${
          strength.isValid ? 'text-green-600' : 'text-gray-600'
        }`}>
          Wachtwoord sterkte: {getStrengthText(strength.score)}
        </span>
        {strength.isValid && (
          <span className="text-green-600 text-xs">✓ Voldoet aan eisen</span>
        )}
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <ul className="mt-2 text-xs text-gray-600 space-y-1">
          {strength.feedback.map((feedback, index) => (
            <li key={index} className="flex items-center">
              <span className="text-red-500 mr-1">•</span>
              {feedback}
            </li>
          ))}
        </ul>
      )}

      {strength.isValid && (
        <ul className="mt-2 text-xs text-green-600 space-y-1">
          <li className="flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            Alle vereisten voldaan
          </li>
        </ul>
      )}
    </div>
  );
};
