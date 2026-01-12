
// placeholder för riktig databas
// let users = [];
// let nextId = 1;

import db from './db.js';

function NewUser(body) {

  
  const { name } = body;
  const sql = db.prepare("INSERT INTO users (name) VALUES (?)");
  const result = sql.run(name);

  const newUser = { id: result.lastInsertRowid, name };

  return newUser;
}

function GetUser(id) {
  const sql = db.prepare("SELECT * FROM users WHERE id = ?");
  
  const user = sql.get(id);
  return user;
}

function GetAllUsers() {
  const sql = db.prepare("SELECT * FROM users");
  
  const users = sql.all();
  return users;

}

function UpdateUser(id, body) {
  const { name } = body;
  const sql = db.prepare("UPDATE users SET name = ? WHERE id = ?");
  const result = sql.run(name, id);
  if (result.changes === 0) return null;
  return { id: Number(id), name };
}

function DeleteUser(id) {
  const sql = db.prepare("DELETE FROM users WHERE id = ?");
  const result = sql.run(id);
  return result.changes > 0;
}

function VerifyPassword(user, password) {
  // Placeholder for password verification logic
  return true;//user.password === password;
}


export default {
  NewUser,
  GetUser,
  GetAllUsers,
  UpdateUser,
  DeleteUser,
  VerifyPassword
};
