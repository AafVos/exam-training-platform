// Mock all dependencies
jest.mock('@/lib/db/user');
jest.mock('@/lib/email/config');
jest.mock('@/lib/auth/password');

import { getVerificationEmailTemplate, getWelcomeEmailTemplate } from '@/lib/email/templates';

describe('Email Templates', () => {
  describe('getVerificationEmailTemplate', () => {
    it('should generate verification email template', () => {
      const result = getVerificationEmailTemplate(
        'Test User',
        'test@example.com',
        'test-token-123'
      );

      expect(result.subject).toContain('Bevestig je e-mailadres');
      expect(result.html).toContain('Test User');
      expect(result.html).toContain('test-token-123');
      expect(result.text).toContain('Test User');
      expect(result.text).toContain('test-token-123');
    });
  });

  describe('getWelcomeEmailTemplate', () => {
    it('should generate welcome email template', () => {
      const result = getWelcomeEmailTemplate('Test User', 'VWO 6');

      expect(result.subject).toContain('Welkom');
      expect(result.html).toContain('Test User');
      expect(result.html).toContain('VWO 6');
      expect(result.text).toContain('Test User');
      expect(result.text).toContain('VWO 6');
    });
  });
});
