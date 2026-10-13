import 'server-only';
import { MongoClient, Db, Collection, Document } from 'mongodb';
import dns from 'node:dns';

// Ensure DNS resolution for MongoDB Atlas SRV records works reliably across all environments (Windows, containers, local ISPs)
try {
  const currentServers = dns.getServers();
  // If no servers or only localhost, ensure public resilient DNS is available for SRV resolution
  if (!currentServers || currentServers.length === 0 || currentServers[0] === '127.0.0.1') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch {
  // Ignore in restricted sandboxes
}

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
  SOLUTIONS: 'solutions',
  INDUSTRIES: 'industries',
  INSIGHTS: 'insights',
  CLIENT_LOGOS: 'client_logos',
  REVIEWS: 'reviews',
  TESTIMONIALS: 'testimonials',
  CONTACT_SUBMISSIONS: 'contact_submissions',
  DISCOVERY_SUBMISSIONS: 'discovery_submissions',
  APPOINTMENTS: 'appointments',
  JOB_APPLICATIONS: 'job_applications',
  APPLICANT_COMMUNICATIONS: 'applicant_communications',
  CAREERS: 'career_openings',
  MEDIA: 'media_items',
  USERS: 'dashboard_users',
  NAVIGATION: 'navigation_menus',
  SETTINGS: 'system_settings',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

const clientOptions = {
  maxPoolSize: 20,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 8000,
};

function createClientWithDnsFallback(connectionUri: string): Promise<MongoClient> {
  const client = new MongoClient(connectionUri, clientOptions);
  return client.connect().catch(async (err: unknown) => {
    const errMsg = String(err);
    if (errMsg.includes('querySrv') || errMsg.includes('ECONNREFUSED')) {
      console.warn('[MongoDB] Retrying with public DNS servers (8.8.8.8, 1.1.1.1)...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const fallbackClient = new MongoClient(connectionUri, clientOptions);
        return await fallbackClient.connect();
      } catch (fallbackErr) {
        console.error('[MongoDB] DNS fallback connection failed:', fallbackErr);
        throw fallbackErr;
      }
    }
    throw err;
  });
}

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
      globalThis._mongoClientPromise = createClientWithDnsFallback(uri);
    }
    return globalThis._mongoClientPromise;
  } else {
    if (!clientPromise) {
      clientPromise = createClientWithDnsFallback(uri);
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
