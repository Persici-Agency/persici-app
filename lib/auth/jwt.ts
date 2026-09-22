import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { UserRole, DashboardUser } from './rbac';

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'persici_session';
const JWT_SECRET_STRING = process.env.JWT_SECRET || 'persici_jwt_secret_super_secure_key_2026_growth_os';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const TOKEN_EXPIRY = '7d';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  [key: string]: unknown;
}

/**
 * Signs a tamper-proof JWT session token valid for 7 days.
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT token signature and returns the payload if valid.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Server-side helper to retrieve the authenticated user from cookies.
 * Usable inside Server Components, Server Actions, and Route Handlers.
 */
export async function getSessionUser(): Promise<DashboardUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload || !payload.userId || !payload.role) return null;

    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      avatar: payload.avatar,
    };
  } catch {
    return null;
  }
}
