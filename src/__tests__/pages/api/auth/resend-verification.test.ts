import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/auth/resend-verification';

// Mock email verification service
jest.mock('@/lib/email/verification', () => ({
  resendVerificationEmail: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { resendVerificationEmail } = require('@/lib/email/verification');

describe('/api/auth/resend-verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resend verification email successfully', async () => {
    resendVerificationEmail.mockResolvedValue({
      success: true,
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { email: 'test@example.com' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.message).toContain('Nieuwe verificatie-e-mail verzonden');
  });

  it('should return 400 for non-existent user', async () => {
    resendVerificationEmail.mockResolvedValue({
      success: false,
      error: 'Gebruiker niet gevonden',
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { email: 'nonexistent@example.com' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Gebruiker niet gevonden');
  });

  it('should return 400 for invalid email', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { email: 'invalid-email' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validatiefout');
  });

  it('should return 400 for missing email', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validatiefout');
  });

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Method not allowed');
  });
});
