const express = require('express');
const router = express.Router();
const { Reservation, User, Court } = require('../models');

router.get('/', async (req, res) => {
  const list = await Reservation.findAll({ include: [User, Court] });
  res.json(list);
});

router.post('/', async (req, res) => {
  const { date, startTime, endTime, userId, courtId } = req.body;
  const r = await Reservation.create({ date, startTime, endTime, userId, courtId });
  res.json(r);
});

module.exports = router;
