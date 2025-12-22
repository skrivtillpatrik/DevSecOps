let users = [];
let nextId = 1;

function newUser(body) {
  const user = { ...body, id: nextId++ };
  users.push(user);
  return user;
}

function GetAllUsers(id) {
  if (id === undefined) return users;
  return users.find(u => u.id === Number(id));
}

function UpdateUser(id, body) {
  const index = users.findIndex(u => u.id === Number(id));
  if (index === -1) return null;
  users[index] = { id: users[index].id, ...body };
  return users[index];
}

function DeleteUser(id) {
  const index = users.findIndex(u => u.id === Number(id));
  if (index === -1) return null;
  return users.splice(index, 1);
}

export default {
  newUser,
  GetAllUsers,
  UpdateUser,
  DeleteUser,
};
