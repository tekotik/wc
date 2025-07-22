
'use server';

// FAKE USER SERVICE FOR DEMO PURPOSES
// In a real application, you would replace this with a database call.

export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
}

// This is a mock user. In a real app, you'd fetch this from a session/database.
const MOCK_USER: User = {
    id: 'user_12345',
    name: 'Роман Авдеев',
    email: 'roman@example.com',
    balance: 15300,
};


export async function findUserByEmail(email: string): Promise<User | undefined> {
    // In a real app, you would query your database:
    // e.g., `return await db.users.findUnique({ where: { email } });`
    if (email.toLowerCase() === MOCK_USER.email) {
        return MOCK_USER;
    }
    return undefined;
}

export async function findUserById(id: string): Promise<User | undefined> {
   if (id === MOCK_USER.id) {
       return MOCK_USER;
   }
   return undefined;
}


export async function createUser(userData: Pick<User, 'name' | 'email'> & {password: string}): Promise<User> {
    // This is a mock implementation. It doesn't actually save the user.
    // It just returns a user object as if it were created.
    console.log("Mock createUser called with:", userData.email);
    if (userData.email.toLowerCase() === MOCK_USER.email) {
        throw new Error('Пользователь с таким email уже существует.');
    }
    
    const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        balance: 0, // New users start with 0 balance
    };
    
    // In a real app, you would save `newUser` to the database here.
    
    return newUser;
}

// Mock password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    // In a real app with bcrypt, you'd do:
    // return await bcrypt.compare(password, hash);
    // For this mock, we'll just accept any password if the email is correct.
    // This is NOT secure and is for demo purposes ONLY.
    return true; 
}
