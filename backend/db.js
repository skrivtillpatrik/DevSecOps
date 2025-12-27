import Database from "better-sqlite3";

const db = new Database("database.sqlite");

// Skapa tabell om den inte finns
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password_hash TEXT,
    email TEXT UNIQUE
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
   );
`);

export default db;
