import Database from "better-sqlite3";

const db = new Database("database.sqlite");

// Skapa tabell om den inte finns
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
    create table if not exists EventMembers (
    eventId INTEGER,
    userId INTEGER,
    PRIMARY KEY (eventId, userId),
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


  CREATE TABLE IF NOT EXISTS notes (
  );
`);

export default db;
