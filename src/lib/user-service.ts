
'use server';

import fs from 'fs/promises';
import path from 'path';
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

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

// In-memory store for users to support read-only filesystems.
let inMemoryUsers: UserWithPassword[] | null = null;

async function readUsersFromFile(): Promise<UserWithPassword[]> {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, create it with an empty array
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await writeUsersToFile([]);
      return [];
    }
    console.error('Error reading users file:', error);
    return [];
  }
}

async function writeUsersToFile(users: UserWithPassword[]): Promise<void> {
    try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to users file:', error);
    }
}

async function getUsers(): Promise<UserWithPassword[]> {
    if (inMemoryUsers === null) {
        inMemoryUsers = await readUsersFromFile();
    }
    return inMemoryUsers;
}

export async function findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    const users = await getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<UserWithPassword | undefined> {
    const users = await getUsers();
    return users.find(user => user.id === id);
}

export async function createUser(userData: Pick<User, 'name' | 'email'> & {password: string}): Promise<User> {
    const users = await getUsers();
    const existingUser = await findUserByEmail(userData.email);

    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует.');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    const newUser: UserWithPassword = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: userData.name,
        email: userData.email,
        passwordHash: passwordHash
    };

    const newUsers = [...users, newUser];
    await writeUsersToFile(newUsers);
    inMemoryUsers = newUsers;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

