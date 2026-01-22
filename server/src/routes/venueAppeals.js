const express = require('express');
const router = express.Router();
const { VenueAppeal, User } = require('../models');

// Get all venue appeals (for admin)
router.get('/', async (req, res) => {
  try {
    const appeals = await VenueAppeal.findAll({
      include: [{ model: User, as: 'owner', attributes: ['name', 'email'] }]
    });
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new venue appeal (for owner)
router.post('/', async (req, res) => {
  try {
    const { name, location, description, contactInfo } = req.body;
    // Assuming ownerId comes from auth middleware
    const ownerId = req.user ? req.user.id : 1; // Placeholder, should come from JWT

    const appeal = await VenueAppeal.create({
      name,
      location,
      description,
      contactInfo,
      ownerId
    });
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appeal status (for admin)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const appeal = await VenueAppeal.findByPk(req.params.id);
    if (!appeal) return res.status(404).json({ error: 'Appeal not found' });

    appeal.status = status;
    await appeal.save();
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;