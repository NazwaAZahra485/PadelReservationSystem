const express = require('express');
const router = express.Router();
const { Reservation, User, Court } = require('../models');

router.get('/', async (req, res) => {
  const list = await Reservation.findAll({ include: [User, Court] });
  res.json(list);
});

router.post('/', async (req, res) => {
  try {
    const { date, startTime, endTime, userId, courtId } = req.body;

    // Check if court exists and is not under maintenance
    const court = await Court.findByPk(courtId);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }
    if (court.maintenance) {
      return res.status(400).json({ error: 'Court is currently under maintenance and cannot be reserved' });
    }

    const r = await Reservation.create({ date, startTime, endTime, userId, courtId });
    res.json(r);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
