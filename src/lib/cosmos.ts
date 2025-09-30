import { CosmosClient, Database, Container } from '@azure/cosmos';

// Cosmos DB configuration
const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
const key = process.env.AZURE_COSMOS_KEY!;
const databaseId = process.env.AZURE_COSMOS_DATABASE!;

if (!endpoint || !key || !databaseId) {
  throw new Error('Azure Cosmos DB configuration is missing. Please check your environment variables.');
}

// Create Cosmos client
const cosmosClient = new CosmosClient({ endpoint, key });

// Database and container references
let database: Database;
let usersContainer: Container;

/**
 * Initialize Cosmos DB database and containers
 */
export async function initializeCosmosDB() {
  try {
    // Create database if it doesn't exist
    const { database: db } = await cosmosClient.databases.createIfNotExists({
      id: databaseId
    });
    database = db;

    // Create users container if it doesn't exist
    const { container } = await database.containers.createIfNotExists({
      id: 'users',
      partitionKey: '/email' // Partition by email for efficient queries
    });
    usersContainer = container;

    console.log('✅ Cosmos DB initialized successfully');
    return { database, usersContainer };
  } catch (error) {
    console.error('❌ Failed to initialize Cosmos DB:', error);
    throw error;
  }
}

/**
 * Get users container (initialize if needed)
 */
export async function getUsersContainer(): Promise<Container> {
  if (!usersContainer) {
    await initializeCosmosDB();
  }
  return usersContainer;
}

/**
 * Get database (initialize if needed)
 */
export async function getDatabase(): Promise<Database> {
  if (!database) {
    await initializeCosmosDB();
  }
  return database;
}

export { cosmosClient };
