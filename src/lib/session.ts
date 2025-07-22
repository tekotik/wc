
'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { User } from './user-service';

const secretKey = process.env.SESSION_SECRET || "fallback-secret-for-development-only-must-be-32-bytes-long";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  if (!key || secretKey.length < 32) throw new Error('SESSION_SECRET must be at least 32 bytes long');
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Set session to expire in 1 hour
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  if (!key || secretKey.length < 32) throw new Error('SESSION_SECRET must be at least 32 bytes long');
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // Handle expired or invalid tokens
    console.log('Token validation failed', error);
    return null;
  }
}

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  const session = await encrypt({ user, expires });

  cookies().set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
}

export async function getSession(): Promise<{ user: User } | null> {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) return null;

  const session = sessionCookie.value;
  const decrypted = await decrypt(session);
  
  return decrypted ? { user: decrypted.user } : null;
}

export async function deleteSession() {
  cookies().set('session', '', { expires: new Date(0) });
}
