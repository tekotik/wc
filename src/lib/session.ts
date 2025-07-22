
'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { User } from './user-service';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  if (!key) throw new Error('SESSION_SECRET is not defined');
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Set session to expire in 1 hour
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  if (!key) throw new Error('SESSION_SECRET is not defined');
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

export async function createSession(user: Omit<User, 'id'> & { id?: number | string }) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  const session = await encrypt({ user, expires });

  cookies().set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
}

export async function getSession(): Promise<{ user: User } | null> {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) return null;

  const session = sessionCookie.value;
  const decrypted = await decrypt(session);
  
  return decrypted ? { user: decrypted