// placeholder för riktig databas
// let users = [];
// let nextId = 1;

import { getDB } from './db.js';

function getDbOrThrow() {
  const db = getDB();
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() before using userController.');
  }
  return db;
}

function NewUser(body) {

  const db = getDbOrThrow();


  const { name } = body;
  const sql = db.prepare("INSERT INTO users (name) VALUES (?)");
  const result = sql.run(name);

  const newUser = { id: result.lastInsertRowid, name };

  return newUser;
}

function GetUser(id) {
  const db = getDbOrThrow();
  const sql = db.prepare("SELECT * FROM users WHERE id = ?");

  const user = sql.get(id);
  return user || null;
}

function GetAllUsers() {
  const db = getDbOrThrow();
  const sql = db.prepare("SELECT * FROM users");

  const users = sql.all();
  return users;

}

function GetUserByUsername(username) {
  const db = getDbOrThrow();
  const sql = db.prepare("SELECT * FROM users WHERE name = ?");
  const user = sql.get(username);
  return user;
}

function UpdateUser(id, body) {
  const db = getDbOrThrow();
  const { name } = body;
  const sql = db.prepare("UPDATE users SET name = ? WHERE id = ?");
  const result = sql.run(name, id);
  if (result.changes === 0) return null;
  return { id: Number(id), name };
}

function DeleteUser(id) {

  const db = getDbOrThrow();

  const sql = db.prepare("SELECT * FROM users WHERE id = ?");
  const user = sql.get(id);

  if (!user) return null;

  const deleteSql = db.prepare("DELETE FROM users WHERE id = ?");
  const result = deleteSql.run(id);
  if (result.changes === 0) {
    throw new Error("Failed to delete user with id " + id);
  }
  return user;
}

function VerifyPassword(user, password) {
  // Placeholder for password verification logic
  return true;//user.password === password;
}


export default {
  NewUser,
  GetUser,
  GetAllUsers,
  GetUserByUsername,
  UpdateUser,
  DeleteUser,
  VerifyPassword
};
