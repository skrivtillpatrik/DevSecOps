import express from 'express';
import userController from '../userController';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = userController.GetUserByUsername(username);

  if (!user || !userController.VerifyPassword(user, password)) {
    return res.status(401).send('Invalid credentials');
  }
  req.session.userId = user.id;
  res.status(200).json({ message: 'Login successful' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});