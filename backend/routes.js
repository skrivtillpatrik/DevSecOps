import express from 'express';
import controller from './userController.js';
const router = express.Router();

// CREATE
router.post('/users', (req, res) => {
  const user = controller.newUser(req.body);
  res.status(201).json(user);
}); 

// READ ALL
router.get('/users', (req, res) => {
  console.log('Fetching all users');
  console.log(controller.GetAllUsers());
  res.json(controller.GetAllUsers());
  res.json({users: [{id: 1, name: "John Doe"}, {id: 2, name: "Jane Smith"}]});
  res.status(200);
});
// READ ONE
router.get('/users/:id', (req, res) => {
  const user = controller.GetAllUsers(req.params.id);
  user ? res.json(user) : res.status(404).send('User not found');
}); 
// UPDATE   
router.put('/users/:id', (req, res) => {
    const user = controller.UpdateUser(req.params.id, req.body);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// DELETE
router.delete('/users/:id', (req, res) => {
    const deleted = controller.DeleteUser(req.params.id);
    if (!deleted) return res.status(404).send('User not found');
    res.json(deleted[0]);
});
export default router;
