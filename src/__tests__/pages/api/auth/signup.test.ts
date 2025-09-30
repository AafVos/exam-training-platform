import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/auth/signup';
import { RegistrationResponse } from '@/types';

// Mock Cosmos DB user operations
jest.mock('@/lib/db/user', () => {
  const mockFindUserByEmail = jest.fn();
  const mockCreateUser = jest.fn();
  const mockUpdateUser = jest.fn();
  
  return {
    findUserByEmail: mockFindUserByEmail,
    createUser: mockCreateUser,
    updateUser: mockUpdateUser,
    mockFindUserByEmail,
    mockCreateUser,
    mockUpdateUser,
  };
});

// Import the mocked functions
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { mockFindUserByEmail, mockCreateUser, mockUpdateUser } = require('@/lib/db/user');

describe('/api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123',
      vwoLevel: 'VWO 6',
    };

    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'STUDENT',
      vwoLevel: 'VWO 6',
      subject: 'Wiskunde B',
      emailVerified: null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    };

    mockFindUserByEmail.mockResolvedValue(null);
    mockCreateUser.mockResolvedValue(mockUser);
    mockUpdateUser.mockResolvedValue({ ...mockUser, emailVerifyToken: 'test-token' });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse<RegistrationResponse>>({
      method: 'POST',
      body: userData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe('test@example.com');
    expect(data.message).toContain('succesvol aangemaakt');
  });

  it('should return 409 if email already exists', async () => {
    const userData = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'TestPass123',
      vwoLevel: 'VWO 6',
    };

    const existingUser = {
      id: '1',
      email: 'existing@example.com',
      name: 'Existing User',
      password: 'hashedpass',
      role: 'STUDENT',
      vwoLevel: 'VWO 6',
      subject: 'Wiskunde B',
      emailVerified: null,
      emailVerifyToken: null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    };

    mockFindUserByEmail.mockResolvedValue(existingUser);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse<RegistrationResponse>>({
      method: 'POST',
      body: userData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(409);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('E-mailadres is al in gebruik');
  });

  it('should return 400 for invalid email', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'TestPass123',
      vwoLevel: 'VWO 6',
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse<RegistrationResponse>>({
      method: 'POST',
      body: userData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validatiefout');
  });

  it('should return 400 for weak password', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'weak',
      vwoLevel: 'VWO 6',
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse<RegistrationResponse>>({
      method: 'POST',
      body: userData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validatiefout');
  });

  it('should return 400 for missing required fields', async () => {
    const userData = {
      name: 'Test User',
      // missing email, password, vwoLevel
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse<RegistrationResponse>>({
      method: 'POST',
      body: userData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validatiefout');
  });

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<RegistrationResponse>>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('Method not allowed');
  });
});
