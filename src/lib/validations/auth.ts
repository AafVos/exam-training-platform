import { z } from 'zod';

/**
 * Registration form validation schema
 */
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Naam moet minimaal 2 karakters bevatten')
    .max(50, 'Naam mag maximaal 50 karakters bevatten')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Naam mag alleen letters, spaties, apostroffen en koppeltekens bevatten'),
  
  email: z.string()
    .email('Voer een geldig e-mailadres in')
    .max(254, 'E-mailadres is te lang'),
  
  password: z.string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters bevatten')
    .regex(/(?=.*[a-z])/, 'Wachtwoord moet minimaal één kleine letter bevatten')
    .regex(/(?=.*[A-Z])/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
    .regex(/(?=.*\d)/, 'Wachtwoord moet minimaal één cijfer bevatten'),
  
  vwoLevel: z.string()
    .min(1, 'Selecteer je VWO niveau'),
  
  subject: z.string()
    .default('Wiskunde B')
    .optional(),
});

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string()
    .email('Voer een geldig e-mailadres in'),
  
  password: z.string()
    .min(1, 'Wachtwoord is verplicht'),
});

/**
 * Email verification schema
 */
export const emailVerificationSchema = z.object({
  token: z.string()
    .min(1, 'Verificatietoken is verplicht'),
});

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z.string()
    .email('Voer een geldig e-mailadres in'),
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  token: z.string()
    .min(1, 'Reset token is verplicht'),
  
  password: z.string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters bevatten')
    .regex(/(?=.*[a-z])/, 'Wachtwoord moet minimaal één kleine letter bevatten')
    .regex(/(?=.*[A-Z])/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
    .regex(/(?=.*\d)/, 'Wachtwoord moet minimaal één cijfer bevatten'),
});

// Type exports
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;

/**
 * VWO Level options
 */
export const VWO_LEVELS = [
  'VWO 4',
  'VWO 5',
  'VWO 6',
] as const;

export type VWOLevel = typeof VWO_LEVELS[number];
