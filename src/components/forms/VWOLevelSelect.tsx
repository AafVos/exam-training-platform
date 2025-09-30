import React from 'react';
import { VWO_LEVELS } from '@/lib/validations/auth';

interface VWOLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export const VWOLevelSelect: React.FC<VWOLevelSelectProps> = ({
  value,
  onChange,
  error,
  className = '',
}) => {
  const options = VWO_LEVELS.map((level) => ({
    value: level,
    label: level,
  }));

  return (
    <div className={className}>
      <label
        htmlFor="vwoLevel"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        VWO Niveau
        <span className="text-red-500 ml-1">*</span>
      </label>
      <select
        id="vwoLevel"
        name="vwoLevel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `.trim()}
        required
        aria-describedby={error ? 'vwoLevel-error' : undefined}
      >
        <option value="">Selecteer je VWO niveau</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          id="vwoLevel-error"
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Selecteer het VWO niveau waarvoor je je wilt voorbereiden
      </p>
    </div>
  );
};
