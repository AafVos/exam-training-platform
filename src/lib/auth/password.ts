import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isValid: boolean;
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    feedback.push('Minimaal 8 karakters');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Minimaal één kleine letter');
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Minimaal één hoofdletter');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    feedback.push('Minimaal één cijfer');
  } else {
    score += 1;
  }

  // Special character bonus
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }

  const isValid = score >= 4 && password.length >= 8;

  return {
    score: Math.min(score, 5),
    feedback,
    isValid,
  };
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(): string {
  return Math.random().toString(36).substring(2) + 
         Date.now().toString(36) + 
         Math.random().toString(36).substring(2);
}
