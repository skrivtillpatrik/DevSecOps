import express from 'express';
import userController from '../userController.js';

const router = express.Router();

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = userController.GetUserByUsername(username);

  if (!user || !userController.VerifyPassword(user, password)) {
    return res.status(401).send('Invalid credentials');
  }

  req.session.userId = user.id;

  req.session.save((err) => {
    if (err) {
      return res.status(500).send('Could not persist session.');
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name
      }
    });
  });
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

function currentUserHandler(req, res) {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated');
  }

  const user = userController.GetUser(req.session.userId);

  if (!user) {
    return res.status(401).send('Not authenticated');
  }

  res.status(200).json(user);
}

router.get('/auth/currentUser', currentUserHandler);

export default router;