
'use server';

import bcrypt from 'bcryptjs';

// Define the user type, excluding the password for security
export interface User {
    id: string;
    name: string;
    email: string;
}

// Internal type that includes the hashed password
interface UserWithPassword extends User {
    passwordHash: string;
}

// In-memory store that starts with a hardcoded admin user.
// In a real application, this would be a database.
const inMemoryUsers: UserWithPassword[] = [
    {
        id: 'admin_user',
        name: 'Admin',
        email: 'admin@example.com',
        // Hash for "password". Generate with: await bcrypt.hash('password', 10)
        passwordHash: '$2a$10$f.74s6A.G03GOv0iC72M5.ElHnCjL02r5aDQsN9VzSSTfVzscuO.C'
    }
];


export async function findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    return inMemoryUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<UserWithPassword | undefined> {
    return inMemoryUsers.find(user => user.id === id);
}


export async function createUser(userData: Pick<User, 'name' | 'email'> & {password: string}): Promise<User> {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует.');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    const newUser: UserWithPassword = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        passwordHash,
    };
    
    // On Vercel, this in-memory modification will not persist across serverless function invocations.
    // For a real application, this must be replaced with a database write.
    inMemoryUsers.push(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userToReturn } = newUser;
    return userToReturn;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
