
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

// Hardcoded admin user. In a real application, this would come from a database.
const adminUser: UserWithPassword = {
    id: 'admin_user',
    name: 'Admin',
    email: 'admin@example.com',
    // Hash for "password". Generate with: await bcrypt.hash('password', 10)
    passwordHash: '$2a$10$f.74s6A.G03GOv0iC72M5.ElHnCjL02r5aDQsN9VzSSTfVzscuO.C'
};

const inMemoryUsers: UserWithPassword[] = [adminUser];


export async function findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    return inMemoryUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<UserWithPassword | undefined> {
    return inMemoryUsers.find(user => user.id === id);
}

// Signup functionality is disabled in this simplified version.
// You could re-enable this if you connect to a persistent database.
export async function createUser(userData: Pick<User, 'name' | 'email'> & {password: string}): Promise<User> {
    throw new Error('User creation is disabled.');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
