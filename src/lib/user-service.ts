
'use server';

import usersData from './users.json';
import fs from 'fs/promises';
import path from 'path';

// This is a mock user type, in a real app you would have a more robust user model
interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app, this should be a hash
}

// Path to the JSON file
const usersFilePath = path.join(process.cwd(), 'src/lib/users.json');

// Helper function to read users from the file
async function readUsers(): Promise<User[]> {
    try {
        const fileContent = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(fileContent) as User[];
    } catch (error) {
        console.error("Failed to read users file:", error);
        // If the file doesn't exist or is empty, start with the initial data or an empty array
        return [];
    }
}

// Helper function to write users to the file
async function writeUsers(users: User[]): Promise<void> {
    try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error("Failed to write users file:", error);
        throw new Error("Could not save user data.");
    }
}


export async function getUser(email: string): Promise<User | undefined> {
    const users = await readUsers();
    return users.find(user => user.email === email);
}

// In a real app, you should use a library like bcrypt to hash and compare passwords.
// This is a simplified version for demonstration purposes.
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return password === hash;
}

export async function createUser(userData: Omit<User, 'id'>) {
    const users = await readUsers();
    const existingUser = users.find(user => user.email === userData.email);

    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует.');
    }

    // In a real app, hash the password before saving
    // const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser: User = {
        id: `user_${Date.now()}`,
        ...userData,
        // password: hashedPassword,
    };

    const updatedUsers = [...users, newUser];
    await writeUsers(updatedUsers);

    return newUser;
}
