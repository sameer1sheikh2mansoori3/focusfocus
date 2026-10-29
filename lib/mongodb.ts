import { MongoClient, Db } from 'mongodb';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 2000,
  connectTimeoutMS: 2000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoUri(): string | null {
  return process.env.MONGODB_URI || process.env.MONGO_URI || null;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = getMongoUri();
  if (!uri) return null;

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        const client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect().catch((err) => {
          // Reset cached promise so next try can reconnect if network is restored
          global._mongoClientPromise = undefined;
          throw err;
        });
      }
      return await global._mongoClientPromise;
    } else {
      const client = new MongoClient(uri, options);
      return await client.connect();
    }
  } catch (err) {
    // Graceful fallback to local engine without crashing
    return null;
  }
}

export async function getMongoDatabase(): Promise<Db | null> {
  try {
    const client = await getMongoClient();
    if (!client) return null;
    return client.db();
  } catch (err) {
    return null;
  }
}


