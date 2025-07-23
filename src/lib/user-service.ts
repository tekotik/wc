
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
    await logDatabaseAction('readUsers', 'Начало чтения базы пользователей.');
    try {
        await fs.access(usersFilePath);
    } catch (error) {
        await logDatabaseAction('readUsers', 'Файл users.csv не найден, создается новый.');
        await fs.writeFile(usersFilePath, 'id,name,email,password,role\n', 'utf8');
        return [];
    }

    const fileContent = await fs.readFile(usersFilePath, 'utf8');
    const result = Papa.parse<User>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });
    await logDatabaseAction('readUsers', `Чтение завершено. Найдено ${result.data.length} пользователей.`);
    return result.data;
}

// Helper function to read admins from the CSV file
async function readAdmins(): Promise<Admin[]> {
    try {
        await fs.access(adminsFilePath);
    } catch (error) {
        await fs.writeFile(adminsFilePath, 'id,name,email,password,role\n', 'utf8');
        return [];
    }

    const fileContent = await fs.readFile(adminsFilePath, 'utf8');
    const result = Papa.parse<Admin>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });
    return result.data;
}


// Helper function to append a user to the CSV file
async function appendUser(user: User): Promise<void> {
    await logDatabaseAction('appendUser', `Начало добавления пользователя ${user.email}.`);
    const csvRow = Papa.unparse([user], { header: false });
    await fs.appendFile(usersFilePath, `${csvRow}\n`, 'utf8');
    await logDatabaseAction('appendUser', `Пользователь ${user.email} успешно добавлен.`);
}

export async function getUser(email: string): Promise<User | undefined> {
    return withFileLock(async () => {
        await logDatabaseAction('getUser', `Поиск пользователя с email: ${email}.`);
        const users = await readUsers();
        const user = users.find(user => user.email === email);
        if (user) {
            await logDatabaseAction('getUser', `Пользователь ${email} найден.`);
        } else {
            await logDatabaseAction('getUser', `Пользователь ${email} не найден.`);
        }
        return user;
    });
}

export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
    return withFileLock(async () => {
        const admins = await readAdmins();
        return admins.find(admin => admin.email === email);
    });
}

export async function getUserById(id: string): Promise<Omit<User, 'password'> | Omit<Admin, 'password'> | null> {
    return withFileLock(async () => {
        await logDatabaseAction('getUserById', `Поиск пользователя с ID: ${id}.`);
        
        const admins = await readAdmins();
        const admin = admins.find(a => a.id === id);
        if (admin) {
             await logDatabaseAction('getUserById', `Найден администратор с ID ${id}.`);
             const { password, ...adminWithoutPassword } = admin;
             return adminWithoutPassword;
        }

        const users = await readUsers();
        const user = users.find(user => user.id === id);
        if (user) {
            await logDatabaseAction('getUserById', `Пользователь с ID ${id} найден.`);
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        
        await logDatabaseAction('getUserById', `Пользователь или админ с ID ${id} не найден.`);
        return null;
    });
}


export async function verifyPassword(password: string, hash: string): Promise<boolean> {
     try {
        if (!password || !hash) return false;
        await logDatabaseAction('verifyPassword', 'Проверка хеша пароля.');
        const result = await argon2.verify(hash, password);
        await logDatabaseAction('verifyPassword', `Результат проверки: ${result ? 'успешно' : 'неуспешно'}.`);
        return result;
    } catch (err) {
        console.error("Error verifying password:", err);
        await logDatabaseAction('verifyPassword', `Ошибка при проверке пароля: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return false;
    }
}

export async function createUser(userData: Omit<User, 'id' | 'password' | 'role'> & { password_raw: string }) {
    return withFileLock(async () => {
        await logDatabaseAction('createUser', `Попытка создания пользователя: ${userData.email}.`);
        const users = await readUsers();
        const existingUser = users.find(user => user.email === userData.email);

        if (existingUser) {
            await logDatabaseAction('createUser', `Ошибка: Пользователь ${userData.email} уже существует.`);
            throw new Error('Пользователь с таким email уже существует.');
        }

        await logDatabaseAction('createUser', `Хеширование пароля для ${userData.email}.`);
        const hashedPassword = await argon2.hash(userData.password_raw);
        await logDatabaseAction('createUser', `Пароль для ${userData.email} хеширован.`);

        const newUser: User = {
            id: `user_${Date.now()}`,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: 'user', // Always assign user role on creation
        };

        await appendUser(newUser);
        await logDatabaseAction('createUser', `Пользователь ${newUser.email} успешно создан с ID: ${newUser.id}.`);
        
        const { password, ...userToReturn } = newUser;
        return userToReturn;
    });
}


// --- Functions to get Admin for internal use ---
export async function getAdmin(id: string): Promise<Admin | undefined> {
    return withFileLock(async () => {
        const admins = await readAdmins();
        return admins.find(admin => admin.id === id);
    });
}
