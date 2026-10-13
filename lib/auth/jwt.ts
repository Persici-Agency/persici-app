import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { UserRole, DashboardUser } from './rbac';

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'persici_session';
export const GATE_COOKIE_NAME = process.env.GATE_COOKIE_NAME || 'persici_dashboard_gate';
export const DASHBOARD_PASSKEY = process.env.DASHBOARD_PASSKEY || 'persici2026';
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

/**
 * Signs a tamper-proof gate authorization token valid for the active session (12h).
 */
export async function signGateToken(): Promise<string> {
  return new SignJWT({ gate: 'granted' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(SECRET_KEY);
}

/**
 * Verifies the gate token signature.
 */
export async function verifyGateToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.gate === 'granted';
  } catch {
    return false;
  }
}

/**
 * Checks if the current request has gate clearance (via gate cookie).
 */
export async function hasGateAccess(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const gateToken = cookieStore.get(GATE_COOKIE_NAME)?.value;
    if (!gateToken) return false;
    return await verifyGateToken(gateToken);
  } catch {
    return false;
  }
}



