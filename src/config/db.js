import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("[db] ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("[db] Connection failed:", err.message);
    process.exit(1);
  }
  release();
  console.log("[db] Connected to PostgreSQL successfully.");
});
