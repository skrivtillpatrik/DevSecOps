import Database from "better-sqlite3";

const db = new Database("database.sqlite");

// Skapa tabell om den inte finns
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`);

export default db;
