import express from 'express';
import controller from '../userController.js';
import calendarController from '../calendarController.js';

const router = express.Router();

// CREATE User
router.post('/users', (req, res) => {
  const user = controller.NewUser(req.body);
  if (!user) return res.status(400).send('Invalid user data');
  res.status(201).json(user);
}); 

// READ ALL Users
router.get('/users', (req, res) => {
  console.log('Fetching all users');
  console.log(controller.GetAllUsers());
  res.json(controller.GetAllUsers());
  res.status(200);
});
// READ ONE User
router.get('/users/:id', (req, res) => {
  const user = controller.GetUser(req.params.id);
  user ? res.json(user) : res.status(404).send('User not found');
}); 
// UPDATE   user
router.put('/users/:id', (req, res) => {
    const user = controller.UpdateUser(req.params.id, req.body);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// DELETE user
router.delete('/users/:id', (req, res) => {
    const deleted = controller.DeleteUser(req.params.id);
    if (!deleted) return res.status(404).send('User not found');
    res.json(deleted[0]);
});

// Calendar Event Routes
router.post('/calendarEvents', (req, res) => {
    const event = calendarController.createCalendarEvent(req.body);
    res.status(201).json(event);
});

router.get('/calendarEvents/:id/', (req, res) => {
    const event = calendarController.getCalendarEvent(req.params.id, req.params.userId);
    event ? res.json(event) : res.status(404).send('Event not found');
});
cd

export default router;
