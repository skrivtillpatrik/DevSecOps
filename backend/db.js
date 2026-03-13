import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export function initDatabase() {
  const env = process.env.NODE_ENV;

  if (env === "unit") {
    console.log("Unit tester. använder in-memory databas");
    db = new Database(":memory:");
  }
  else if (env === "e2etest") {
    console.log("E2E tester. använder testdatabas");

    const dbPath = path.join(__dirname, "db", "database.test.sqlite");
    console.log("SQLite TEST DB path:", dbPath);

    db = new Database(dbPath);
  }
  else {
    console.log("Utvecklingsläge. använder filbaserad databas");

    const dbPath = path.join(__dirname, "db", "database.sqlite");
    console.log("SQLite DB path:", dbPath);

    db = new Database(dbPath);
  }


  db.exec("PRAGMA foreign_keys = ON;");

  return db;
}

export function getDB() {
  return db;
}

export function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS EventMembers (
      eventId INTEGER,
      userId INTEGER,
      PRIMARY KEY (eventId, userId)
    );

    CREATE TABLE IF NOT EXISTS calendarMeeting (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      dateStart DATE NOT NULL,
      dateEnd DATE NOT NULL,
      createdBy INTEGER,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    );
  `);
}