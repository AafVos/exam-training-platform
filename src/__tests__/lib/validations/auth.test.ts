import { 
  registerSchema, 
  loginSchema, 
  emailVerificationSchema,
  VWO_LEVELS 
} from '@/lib/validations/auth';

describe('Auth Validation', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'TestPass123',
        vwoLevel: 'VWO 6',
        subject: 'Wiskunde B',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Jan de Vries');
        expect(result.data.email).toBe('jan@example.com');
        expect(result.data.subject).toBe('Wiskunde B');
      }
    });

    it('should set default subject to Wiskunde B', () => {
      const validData = {
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'TestPass123',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.subject).toBe('Wiskunde B');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'Jan de Vries',
        email: 'invalid-email',
        password: 'TestPass123',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('geldig e-mailadres');
      }
    });

    it('should reject weak password', () => {
      const invalidData = {
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'weak',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e) => e.message.includes('minimaal 8 karakters'))).toBe(true);
      }
    });

    it('should reject password without uppercase', () => {
      const invalidData = {
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'testpass123',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e) => e.message.includes('hoofdletter'))).toBe(true);
      }
    });

    it('should reject password without lowercase', () => {
      const invalidData = {
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'TESTPASS123',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e) => e.message.includes('kleine letter'))).toBe(true);
      }
    });

    it('should reject password without number', () => {
      const invalidData = {
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'TestPassword',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e) => e.message.includes('cijfer'))).toBe(true);
      }
    });

    it('should reject invalid name characters', () => {
      const invalidData = {
        name: 'Jan123',
        email: 'jan@example.com',
        password: 'TestPass123',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('letters');
      }
    });

    it('should accept valid name with accents and hyphens', () => {
      const validData = {
        name: 'José van der Berg-Müller',
        email: 'jose@example.com',
        password: 'TestPass123',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject name that is too short', () => {
      const invalidData = {
        name: 'J',
        email: 'jan@example.com',
        password: 'TestPass123',
        vwoLevel: 'VWO 6',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimaal 2 karakters');
      }
    });

    it('should reject missing vwoLevel', () => {
      const invalidData = {
        name: 'Jan de Vries',
        email: 'jan@example.com',
        password: 'TestPass123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e) => e.message.includes('expected string'))).toBe(true);
      }
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'jan@example.com',
        password: 'TestPass123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'TestPass123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'jan@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('emailVerificationSchema', () => {
    it('should validate valid token', () => {
      const validData = {
        token: 'abc123xyz789',
      };

      const result = emailVerificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const invalidData = {
        token: '',
      };

      const result = emailVerificationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('VWO_LEVELS', () => {
    it('should contain expected VWO levels', () => {
      expect(VWO_LEVELS).toEqual(['VWO 4', 'VWO 5', 'VWO 6']);
    });
  });
});
