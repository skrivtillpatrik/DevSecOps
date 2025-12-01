import express from 'express';
const router = express.Router();
let users = [];
let nextId = 1;
// CREATE
router.post('/users', (req, res) => {
  const user = { id: nextId++, ...req.body };
  users.push(user);
  res.status(201).json(user);
}); 

// READ ALL
router.get('/users', (req, res) => {
  res.json(users);
  res.status(200);
});
// READ ONE
router.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).send('User not found');
}); 
// UPDATE   
router.put('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('User not found');
    users[index] = { id: users[index].id, ...req.body };
    res.json(users[index]);
});
// DELETE
router.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('User not found');
    const deleted = users.splice(index, 1);
    res.json(deleted[0]);
});
export default router;
