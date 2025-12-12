const express = require('express');
const router = express.Router();
const { Court } = require('../models');

router.get('/', async (req, res) => {
  const courts = await Court.findAll();
  res.json(courts);
});

router.post('/', async (req, res) => {
  const { name, location, type, pricePerHour } = req.body;
  const c = await Court.create({ name, location, type, pricePerHour });
  res.json(c);
});

module.exports = router;
