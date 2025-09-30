import { getDatabase, getUsersContainer } from '../cosmos';
import { createUser, findUserByEmail } from './user';
import { v4 as uuidv4 } from 'uuid';

/**
 * Test Azure Cosmos DB connectivity
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Test database connection
    const database = await getDatabase();
    const { resource: info } = await database.read();
    console.log('✅ Azure Cosmos DB connection successful:', info?.id);
    return true;
  } catch (error) {
    console.error('❌ Azure Cosmos DB connection failed:', error);
    return false;
  }
}

/**
 * Test user model operations with Azure Cosmos DB
 */
export async function testUserModel(): Promise<boolean> {
  try {
    // Test creating a user container
    const container = await getUsersContainer();
    console.log('✅ Users container ready');

    // Test creating a user (will be cleaned up)
    const testUser = await createUser({
      email: `test-${uuidv4()}@example.com`,
      name: 'Test User',
      password: 'hashedpassword123',
      vwoLevel: 'VWO 6',
    });
    
    // Test finding the user
    const foundUser = await findUserByEmail(testUser.email);
    if (!foundUser) {
      throw new Error('User not found after creation');
    }
    
    // Clean up test user
    await container.item(testUser.id, testUser.id).delete();
    
    console.log('✅ User model operations successful');
    return true;
  } catch (error) {
    console.error('❌ User model test failed:', error);
    return false;
  }
}
