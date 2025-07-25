// lib/session.ts
import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId?: string;
  isLoggedIn: boolean;
  userRole?: 'user' | 'admin';
}

export const sessionOptions = {
  cookieName: 'elsender_session',
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_sure',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    // httpOnly: true, // Recommended for security
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // Initialize session data if it doesn't exist
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  
  return session;
}
