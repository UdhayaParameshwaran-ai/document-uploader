import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

export const db = drizzle(pool);
export const queryClient = pool; // optional if you need raw SQL
