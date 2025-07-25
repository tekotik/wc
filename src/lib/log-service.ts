
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

async function ensureLogFileExists(): Promise<void> {
    try {
        await fs.access(logsFilePath);
    } catch (error) {
        await fs.writeFile(logsFilePath, 'timestamp,action,details\n', 'utf8');
    }
}

export async function logDatabaseAction(action: string, details: string): Promise<void> {
    await ensureLogFileExists();
    
    const newLog: LogEntry = {
        timestamp: new Date().toISOString(),
        action,
        details,
    };
    
    const csvRow = Papa.unparse([newLog], { header: false });
    await fs.appendFile(logsFilePath, `${csvRow}\n`, 'utf8');
}

export async function getLogs(): Promise<LogEntry[]> {
    await ensureLogFileExists();
    const fileContent = await fs.readFile(logsFilePath, 'utf8');
    const result = Papa.parse<LogEntry>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });
    return result.data.reverse(); // Show most recent first
}
