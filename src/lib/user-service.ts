
'use server';

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import * as argon2 from 'argon2';

interface User {
    id: string;
    name: string;
    email: string;
    password: string; // This will be the hash
}

// Path to the CSV file
const usersFilePath = path.join(process.cwd(), 'src/lib/users.csv');
const fileMutex = { isLocked: false };

async function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
    while (fileMutex.isLocked) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    fileMutex.isLocked = true;
    try {
        return await fn();
    } finally {
        fileMutex.isLocked = false;
    }
}

// Helper function to read users from the CSV file
async function readUsers(): Promise<User[]> {
    try {
        await fs.access(usersFilePath);
    } catch (error) {
        // If file doesn't exist, create it with headers
        await fs.writeFile(usersFilePath, 'id,name,email,password\n', 'utf8');
        return [];
    }

    const fileContent = await fs.readFile(usersFilePath, 'utf8');
    const result = Papa.parse<User>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });
    return result.data;
}

// Helper function to append a user to the CSV file
async function appendUser(user: User): Promise<void> {
    const csvRow = Papa.unparse([user], { header: false });
    await fs.appendFile(usersFilePath, `\n${csvRow}`, 'utf8');
}

export async function getUser(email: string): Promise<User | undefined> {
    return withFileLock(async () => {
        const users = await readUsers();
        return users.find(user => user.email === email);
    });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
     try {
        return await argon2.verify(hash, password);
    } catch (err) {
        console.error("Error verifying password:", err);
        return false;
    }
}

export async function createUser(userData: Omit<User, 'id' | 'password'> & { password_raw: string }) {
    return withFileLock(async () => {
        console.log("Attempting to create user for:", userData.email);
        const users = await readUsers();
        const existingUser = users.find(user => user.email === userData.email);

        if (existingUser) {
            console.error("User already exists:", userData.email);
            throw new Error('Пользователь с таким email уже существует.');
        }

        console.log("Hashing password for:", userData.email);
        const hashedPassword = await argon2.hash(userData.password_raw);
        console.log("Password hashed for:", userData.email);

        const newUser: User = {
            id: `user_${Date.now()}`,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        };

        console.log("Appending new user to CSV:", newUser.id);
        await appendUser(newUser);
        console.log("Successfully created user:", newUser.id);

        return { ...newUser, password: "" }; // Return user without password hash
    });
}
