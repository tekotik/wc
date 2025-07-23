// lib/session.ts
import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  isLoggedIn: boolean;
  userRole: 'user' | 'admin';
}

export const sessionOptions = {
  cookieName: 'elsender_session',
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_sure',
  // Secure: true should be used in production (HTTPS) but can be false for development
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function getSession(): Promise<IronSession<SessionData>> {
  const session = getIronSession<SessionData>(cookies(), sessionOptions);
  return Promise.resolve(session);
}
