
'use server';

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import { getSession } from './session';
import { withFileLock } from './user-service'; 

export interface Request {
    id: number;
    user_id: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_comment: string;
    campaignId: string;
}

const requestsFilePath = path.join(process.cwd(), 'src/lib/requests.csv');

async function ensureFileExists(): Promise<void> {
    try {
        await fs.access(requestsFilePath);
    } catch (error) {
        await fs.writeFile(requestsFilePath, 'id,user_id,description,status,admin_comment,campaignId\n', 'utf8');
    }
}

async function readRequests(): Promise<Request[]> {
    await ensureFileExists();
    const fileContent = await fs.readFile(requestsFilePath, 'utf8');
    const result = Papa.parse<Request>(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: (value, header) => {
            if (header === 'id') {
                const num = Number(value);
                return isNaN(num) ? 0 : num;
            }
            return value;
        }
    });
    if (result.errors.length) {
        console.error("Error parsing requests.csv:", result.errors);
    }
    return result.data.filter(r => r.id);
}

async function writeRequests(requests: Request[]): Promise<void> {
    const csvData = Papa.unparse(requests);
    await fs.writeFile(requestsFilePath, csvData, 'utf8');
}


export async function getRequests(): Promise<Request[]> {
    return withFileLock(async () => {
        const session = await getSession();
        const allRequests = await readRequests();

        if (session.isLoggedIn && session.userRole === 'admin') {
            return allRequests.sort((a,b) => b.id - a.id);
        }

        if (session.isLoggedIn && session.userRole === 'user' && session.userId) {
            return allRequests.filter(r => r.user_id === session.userId).sort((a,b) => b.id - a.id);
        }

        return [];
    });
}

export async function getRequestById(id: number): Promise<Request | null> {
    return withFileLock(async () => {
        const session = await getSession();
        if (!session.isLoggedIn || session.userRole !== 'admin') {
            throw new Error("Unauthorized: Only admins can get requests by ID.");
        }
        const requests = await readRequests();
        return requests.find(r => r.id === id) || null;
    });
}


export async function addRequest(newRequestData: Omit<Request, 'id' | 'status' | 'admin_comment'>): Promise<Request> {
    return withFileLock(async () => {
        const requests = await readRequests();
        const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
        
        const requestToAdd: Request = {
            id: newId,
            ...newRequestData,
            status: 'pending',
            admin_comment: ''
        };

        const updatedRequests = [...requests, requestToAdd];
        await writeRequests(updatedRequests);
        
        return requestToAdd;
    });
}

export async function updateRequest(updatedRequestData: Pick<Request, 'id' | 'status' | 'admin_comment'> & { description?: string }): Promise<Request> {
     return withFileLock(async () => {
        const session = await getSession();
        if (!session.isLoggedIn || session.userRole !== 'admin') {
            throw new Error("Unauthorized: Only admins can update requests.");
        }
        
        const requests = await readRequests();
        const requestIndex = requests.findIndex(r => r.id === updatedRequestData.id);

        if (requestIndex === -1) {
            throw new Error("Request not found.");
        }
        
        requests[requestIndex] = {
            ...requests[requestIndex],
            status: updatedRequestData.status,
            admin_comment: updatedRequestData.admin_comment || requests[requestIndex].admin_comment,
        };
        
        if(updatedRequestData.description) {
            requests[requestIndex].description = updatedRequestData.description;
        }

        await writeRequests(requests);
        return requests[requestIndex];
    });
}
