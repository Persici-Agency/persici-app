import 'server-only';
import { MongoClient, Db, Collection, Document } from 'mongodb';


const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'persici_db';

interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const globalThis: GlobalMongo & typeof global;

let clientPromise: Promise<MongoClient> | null = null;

export const COLLECTIONS = {
  PAGES: 'page_contents',
  PROJECTS: 'projects',
  SERVICES: 'services',
  INSIGHTS: 'insights',
  CLIENT_LOGOS: 'client_logos',
  REVIEWS: 'reviews',
  TESTIMONIALS: 'testimonials',
  CONTACT_SUBMISSIONS: 'contact_submissions',
  DISCOVERY_SUBMISSIONS: 'discovery_submissions',
  MEDIA: 'media_items',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/**
 * Returns a promise resolving to the shared MongoClient instance.
 * In development, utilizes globalThis to preserve connection across HMR.
 * Returns null if MONGODB_URI is not set.
 */
export function getMongoClientPromise(): Promise<MongoClient> | null {
  if (!uri || uri.trim() === '') {
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!globalThis._mongoClientPromise) {
      const client = new MongoClient(uri);
      globalThis._mongoClientPromise = client.connect();
    }
    return globalThis._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

/**
 * Helper to get the MongoDB database instance.
 * Returns null if database connection is not configured or unavailable.
 */
export async function getDb(): Promise<Db | null> {
  const promise = getMongoClientPromise();
  if (!promise) return null;

  try {
    const client = await promise;
    return client.db(dbName);
  } catch (err) {
    console.error('[MongoDB] Connection error:', err);
    return null;
  }
}

/**
 * Helper to get a typed collection.
 * Returns null if database is not available.
 */
export async function getCollection<T extends Document = Document>(
  collectionName: CollectionName | string
): Promise<Collection<T> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<T>(collectionName);
}

/**
 * Checks if MongoDB connection is configured and reachable.
 */
export async function isMongoConnected(): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}
