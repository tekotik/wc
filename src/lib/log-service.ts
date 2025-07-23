
'use server';

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

interface LogEntry {
    timestamp: string;
    action: string;
    details: string;
}

const logsFilePath = path.join(process.cwd(), 'src/lib/logs.csv');
const logFileMutex = { isLocked: false };

async function withLogFileLock<T>(fn: () => Promise<T>): Promise<T> {
    while (logFileMutex.isLocked) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    logFileMutex.isLocked = true;
    try {
        return await fn();
    } finally {
        logFileMutex.isLocked = false;
    }
}

async function ensureLogFileExists(): Promise<void> {
    try {
        await fs.access(logsFilePath);
    } catch (error) {
        await fs.writeFile(logsFilePath, 'timestamp,action,details\n', 'utf8');
    }
}

export async function logDatabaseAction(action: string, details: string): Promise<void> {
    return withLogFileLock(async () => {
        await ensureLogFileExists();
        
        const newLog: LogEntry = {
            timestamp: new Date().toISOString(),
            action,
            details,
        };
        
        const csvRow = Papa.unparse([newLog], { header: false });
        await fs.appendFile(logsFilePath, `${csvRow}\n`, 'utf8');
    });
}

export async function getLogs(): Promise<LogEntry[]> {
     return withLogFileLock(async () => {
        await ensureLogFileExists();
        const fileContent = await fs.readFile(logsFilePath, 'utf8');
        const result = Papa.parse<LogEntry>(fileContent, {
            header: true,
            skipEmptyLines: true,
        });
        return result.data.reverse(); // Show most recent first
    });
}
