
import { getSession } from '@/lib/session';
import { getUserById } from '@/lib/user-service';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ isLoggedIn: false, user: null, balance: 0 });
  }

  // Fetch the user details by ID, but without the password
  const user = await getUserById(session.userId); 

  if (user) {
    return NextResponse.json({
      isLoggedIn: true,
      user: user,
      // Mock balance
      balance: 1500,
    });
  }

  // If user not found in DB but session exists, treat as logged out
  await session.destroy();
  return NextResponse.json({ isLoggedIn: false, user: null, balance: 0 });
}
