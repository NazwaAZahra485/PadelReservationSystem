const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/', async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.create({ name, email, role });
  res.json(user);
});

module.exports = router;
