
'use server';

import bcrypt from 'bcryptjs';
import { sql } from './db';

// Define the user type, excluding the password for security
export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
}

// Internal type that includes the hashed password
interface UserWithPassword extends User {
    passwordHash: string;
}

export async function findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    try {
        const result = await sql<UserWithPassword[]>`
            SELECT id, name, email, balance, password_hash as "passwordHash" FROM users WHERE email = ${email.toLowerCase()}
        `;
        return result[0];
    } catch (error) {
        console.error('Database error while finding user by email:', error);
        throw new Error('Could not find user.');
    }
}

export async function findUserById(id: string): Promise<UserWithPassword | undefined> {
   try {
        const result = await sql<UserWithPassword[]>`
            SELECT id, name, email, balance, password_hash as "passwordHash" FROM users WHERE id = ${id}
        `;
        return result[0];
    } catch (error) {
        console.error('Database error while finding user by id:', error);
        throw new Error('Could not find user.');
    }
}


export async function createUser(userData: Pick<User, 'name' | 'email'> & {password: string}): Promise<Omit<User, 'id'> & { id?: number | string }> {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует.');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    try {
         const result = await sql<(Omit<User, 'id'> & { id?: number | string })[]>`
            INSERT INTO users (name, email, password_hash, balance)
            VALUES (${userData.name}, ${userData.email.toLowerCase()}, ${passwordHash}, 0)
            RETURNING id, name, email, balance
        `;
        return result[0];
    } catch (error) {
        console.error('Database error during user creation:', error);
        throw new Error('Could not create user.');
    }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
