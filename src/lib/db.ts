
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

export const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
export const db = drizzle(sql);


// Helper function to create tables if they don't exist
async function setupDatabase() {
    console.log("Checking database schema...");
    try {
        // Create users table
        await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            balance INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;

        // Create campaigns table
        await sql`
        CREATE TABLE IF NOT EXISTS campaigns (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            text TEXT,
            rejection_reason TEXT,
            base_file JSONB,
            stats JSONB,
            scheduled_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;
        
        // Create replies table (can be used later)
        await sql`
        CREATE TABLE IF NOT EXISTS replies (
            id SERIAL PRIMARY KEY,
            campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
            name VARCHAR(255),
            reply TEXT NOT NULL,
            time VARCHAR(50),
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;
        
        console.log("Database schema check complete. Tables are ready.");
    } catch(error) {
        console.error("Error setting up database schema:", error);
    }
}

// Run setup only once
setupDatabase();
