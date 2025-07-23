
import { getSession } from '@/lib/session';
import { getUser } from '@/lib/user-service';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ isLoggedIn: false, user: null, balance: 0 });
  }

  // Fetch the user details, but without the password
  const user = await getUser(session.userId); 

  if (user) {
    return NextResponse.json({
      isLoggedIn: true,
      // In a real app, you would fetch more complete user data
      user: { id: user.id, name: user.name, email: user.email },
      // Mock balance
      balance: 1500,
    });
  }

  return NextResponse.json({ isLoggedIn: false, user: null, balance: 0 });
}
