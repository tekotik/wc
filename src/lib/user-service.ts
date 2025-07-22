
'use server';

import bcrypt from 'bcryptjs';
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, limit } from 'firebase/firestore';

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
        passwordHash: userData.passwordHash
    };
}

export async function findUserById(id: string): Promise<UserWithPassword | undefined> {
    // This function is less critical with Firestore but good to have.
    // In a real app, you might get the document directly by ID.
    const q = query(usersCollection, where("__name__", "==", id), limit(1));
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
        passwordHash: passwordHash
    });

    return {
        id: newUserDoc.id,
        name: userData.name,
        email: userData.email
    };
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
