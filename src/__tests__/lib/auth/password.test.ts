import { 
  hashPassword, 
  verifyPassword, 
  checkPasswordStrength, 
  generateSecureToken 
} from '@/lib/auth/password';

describe('Password utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPass123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // bcrypt hashes are long
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPass123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'TestPass123';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPass123';
      const wrongPassword = 'WrongPass456';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should validate strong password', () => {
      const result = checkPasswordStrength('StrongPass123!');
      
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.feedback).toHaveLength(0);
    });

    it('should reject password too short', () => {
      const result = checkPasswordStrength('Short1');
      
      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Minimaal 8 karakters');
    });

    it('should reject password without lowercase', () => {
      const result = checkPasswordStrength('UPPERCASE123');
      
      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Minimaal één kleine letter');
    });

    it('should reject password without uppercase', () => {
      const result = checkPasswordStrength('lowercase123');
      
      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Minimaal één hoofdletter');
    });

    it('should reject password without numbers', () => {
      const result = checkPasswordStrength('NoNumbers');
      
      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Minimaal één cijfer');
    });

    it('should give bonus for special characters', () => {
      const resultWithSpecial = checkPasswordStrength('TestPass123!');
      const resultWithoutSpecial = checkPasswordStrength('TestPass123');
      
      expect(resultWithSpecial.score).toBeGreaterThan(resultWithoutSpecial.score);
    });

    it('should provide multiple feedback items for weak password', () => {
      const result = checkPasswordStrength('weak');
      
      expect(result.isValid).toBe(false);
      expect(result.feedback.length).toBeGreaterThan(1);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate a token', () => {
      const token = generateSecureToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(10);
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      
      expect(token1).not.toBe(token2);
    });
  });
});
