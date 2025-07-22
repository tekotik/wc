
'use server';

import bcrypt from 'bcryptjs';
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, limit, doc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

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

const usersCollection = collection(db, 'users');

export async function findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    const q = query(usersCollection, where("email", "==", email.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return undefined;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        balance: userData.balance ?? 0,
        passwordHash: userData.passwordHash
    };
}

export async function findUserById(id: string): Promise<UserWithPassword | undefined> {
    const userDocRef = doc(db, "users", id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        return undefined;
    }
    
    const userData = userDoc.data();
    return {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        balance: userData.balance ?? 0,
        passwordHash: userData.passwordHash
    };
}


export async function createUser(userData: Pick<User, 'name' | 'email'> & {password: string}): Promise<User> {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует.');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    const newUserDoc = await addDoc(usersCollection, {
        name: userData.name,
        email: userData.email.toLowerCase(),
        passwordHash: passwordHash,
        balance: 0 // Add initial balance
    });

    return {
        id: newUserDoc.id,
        name: userData.name,
        email: userData.email,
        balance: 0
    };
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
