import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/auth/verify-email';

// Mock email verification service
jest.mock('@/lib/email/verification', () => ({
  verifyEmailToken: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { verifyEmailToken } = require('@/lib/email/verification');

describe('/api/auth/verify-email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify email successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'STUDENT',
      emailVerified: '2025-09-26T14:56:11.350Z',
    };

    verifyEmailToken.mockResolvedValue({
      success: true,
      user: mockUser,
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { token: 'valid-token' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.user).toEqual(mockUser);
    expect(data.message).toContain('succesvol geverifieerd');
  });

  it('should return 400 for invalid token', async () => {
    verifyEmailToken.mockResolvedValue({
      success: false,
      error: 'Ongeldige token',
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { token: 'invalid-token' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Ongeldige token');
  });

  it('should return 400 for missing token', async () => {
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
