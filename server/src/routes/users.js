const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/', async (req, res) => {
  const { name, email, role, password } = req.body;
  const user = await User.create({ name, email, role, password });
  res.json(user);
});

// Login endpoint - untuk integrasi login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user dengan role untuk frontend
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'admin'
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
