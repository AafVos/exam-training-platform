import { getUsersContainer } from '../cosmos';
import { v4 as uuidv4 } from 'uuid';

// Import User interface from types
import { User } from '@/types';

// User creation data
export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  vwoLevel?: string;
  subject?: string;
}

/**
 * Create a new user in Cosmos DB
 */
export async function createUser(userData: CreateUserData): Promise<User> {
  const container = await getUsersContainer();
  
  // Check if user with this email already exists
  const existingUser = await findUserByEmail(userData.email.toLowerCase());
  if (existingUser) {
    throw new Error('E-mailadres is al in gebruik');
  }
  
  const now = new Date().toISOString();
  const user: User = {
    id: uuidv4(),
    email: userData.email.toLowerCase(),
    name: userData.name,
    password: userData.password,
    role: 'STUDENT',
    vwoLevel: userData.vwoLevel,
    subject: userData.subject || 'Wiskunde B',
    emailVerified: null,
    emailVerifyToken: undefined,
    createdAt: now,
    lastLoginAt: now,
    updatedAt: now
  };

  try {
    const { resource } = await container.items.create(user);
    
    if (!resource) {
      throw new Error('Create operation returned null resource');
    }
    
    return resource as User;
  } catch (error: unknown) {
    // Handle any other Cosmos DB errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
      throw new Error('E-mailadres is al in gebruik');
    }
    throw error;
  }
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const container = await getUsersContainer();
  
  try {
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.email = @email',
      parameters: [
        { name: '@email', value: email.toLowerCase() }
      ]
    };

    const { resources } = await container.items.query<User>(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  const container = await getUsersContainer();
  
  try {
    // Query by ID since we don't have the email (partition key)
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.id = @id',
      parameters: [{ name: '@id', value: id }]
    };
    
    const { resources: users } = await container.items.query<User>(querySpec).fetchAll();
    return users[0] || null;
  } catch (error: unknown) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

/**
 * Update a user
 */
export async function updateUser(id: string, updates: Partial<User>, retryCount: number = 0): Promise<User | null> {
  const container = await getUsersContainer();
  
  try {
    // First, we need to find the user by ID to get their email (partition key)
    // Since we don't have the email, we need to query by ID first
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.id = @id',
      parameters: [{ name: '@id', value: id }]
    };
    
    const { resources: users } = await container.items.query<User>(querySpec).fetchAll();
    const currentUser = users[0];
    
    if (!currentUser) {
      // If this is right after user creation, retry a few times due to eventual consistency
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 500));
        return updateUser(id, updates, retryCount + 1);
      }
      return null;
    }

    // Merge updates
    const updatedUser: User = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Use the email as partition key for the replace operation
    const { resource } = await container.item(id, currentUser.email).replace(updatedUser);
    
    if (!resource) {
      return null;
    }
    
    return resource as User;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 404) {
      // If this is right after user creation, retry a few times due to eventual consistency
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 500));
        return updateUser(id, updates, retryCount + 1);
      }
      return null;
    }
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Find user by email verification token
 */
export async function findUserByVerificationToken(token: string): Promise<User | null> {
  const container = await getUsersContainer();
  
  try {
    const querySpec = {
      query: 'SELECT * FROM users u WHERE u.emailVerifyToken = @token',
      parameters: [
        { name: '@token', value: token }
      ]
    };

    const { resources } = await container.items.query<User>(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  } catch (error) {
    console.error('Error finding user by verification token:', error);
    return null;
  }
}
