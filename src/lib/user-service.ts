
'use server';

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import * as argon2 from 'argon2';
import { logDatabaseAction } from './log-service';

interface BaseUser {
    id: string;
    name: string;
    email: string;
    password: string; // This will be the hash
    role: 'user' | 'admin';
}

interface User extends BaseUser {
    role: 'user';
}

interface Admin extends BaseUser {
    role: 'admin';
}


// Path to the CSV file
const usersFilePath = path.join(process.cwd(), 'src/lib/users.csv');
const adminsFilePath = path.join(process.cwd(), 'src/lib/admins.csv');


// Helper function to read users from the CSV file
async function readUsers(): Promise<User[]> {
    try {
        await fs.access(usersFilePath);
    } catch (error) {
        await fs.writeFile(usersFilePath, 'id,name,email,password,role\n', 'utf8');
        return [];
    }

    const fileContent = await fs.readFile(usersFilePath, 'utf8');
    
    if (!fileContent.trim()) {
        return [];
    }

    const result = Papa.parse<User>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });
    return result.data;
}


// Helper function to read admins from the CSV file
async function readAdmins(): Promise<Admin[]> {
    const createDefaultAdmin = async () => {
        const hashedPassword = await argon2.hash('admin6');
        const defaultAdmin: Admin = {
            id: 'admin_default_id',
            name: 'Admin',
            email: 'xdefrin@admin.com',
            password: hashedPassword,
            role: 'admin'
        };
        const csvHeader = 'id,name,email,password,role\n';
        // IMPORTANT: Set quotes: true to match the reader config
        const adminRow = Papa.unparse([defaultAdmin], { header: false, quotes: true });
        await fs.writeFile(adminsFilePath, `${csvHeader}${adminRow}\n`, 'utf8');
        return [defaultAdmin];
    };

    try {
        await fs.access(adminsFilePath);
    } catch (error) {
        // File does not exist, create it with the default admin
        return await createDefaultAdmin();
    }

    const fileContent = await fs.readFile(adminsFilePath, 'utf8');
    
    // If file is empty or just whitespace, create default admin
    if (!fileContent.trim() || fileContent.trim().split('\n').length <= 1) {
        return await createDefaultAdmin();
    }

    const result = Papa.parse<Admin>(fileContent, {
        header: true,
        skipEmptyLines: true,
        quoteChar: '"', // Correctly handle quoted values
    });
    
    // If file has only headers but no data rows, create default admin
    if (result.data.length === 0) {
       return await createDefaultAdmin();
    }
    
    return result.data;
}


// Helper function to append a user to the CSV file
async function appendUser(user: User): Promise<void> {
    const csvRow = Papa.unparse([user], { header: false });
    await fs.appendFile(usersFilePath, `${csvRow}\n`, 'utf8');
}

export async function getUser(email: string): Promise<User | undefined> {
    const users = await readUsers();
    await logDatabaseAction('READ_USER', `Attempted to read user with email: ${email}`);
    return users.find(user => user.email === email);
}

export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
    const admins = await readAdmins();
    await logDatabaseAction('READ_ADMIN', `Attempted to read admin with email: ${email}`);
    return admins.find(admin => admin.email === email);
}

export async function getUserById(id: string): Promise<Omit<User, 'password'> | Omit<Admin, 'password'> | null> {
    const admins = await readAdmins();
    const admin = admins.find(a => a.id === id);
    if (admin) {
            const { password, ...adminWithoutPassword } = admin;
            return adminWithoutPassword;
    }

    const users = await readUsers();
    const user = users.find(user => user.id === id);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    
    return null;
}


export async function verifyPassword(password: string, hash: string): Promise<boolean> {
     try {
        if (!password || !hash) return false;
        return await argon2.verify(hash, password);
    } catch (err) {
        console.error("Error verifying password:", err);
        return false;
    }
}

export async function createUser(userData: Omit<User, 'id' | 'password' | 'role'> & { password_raw: string }) {
    const users = await readUsers();
    const existingUser = users.find(user => user.email === userData.email);

    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует.');
    }

    let hashedPassword;
    try {
        hashedPassword = await argon2.hash(userData.password_raw);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.");
    }

    const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: 'user',
    };

    await appendUser(newUser);
    await logDatabaseAction('CREATE_USER', `New user created with email: ${newUser.email} and ID: ${newUser.id}`);
    
    const { password, ...userToReturn } = newUser;
    return userToReturn;
}


// --- Functions to get Admin for internal use ---
export async function getAdmin(id: string): Promise<Admin | undefined> {
    const admins = await readAdmins();
    return admins.find(admin => admin.id === id);
}
