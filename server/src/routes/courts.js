const express = require('express');
const router = express.Router();
const { Court } = require('../models');

router.get('/', async (req, res) => {
  try {
    // Get user from token/session (simplified for now)
    const userRole = req.user?.role || 'customer';
    const userId = req.user?.id;

    let whereClause = {};
    if (userRole === 'owner') {
      // Owners only see courts assigned to them
      whereClause.ownerId = userId;
    }
    // Admins see all courts

    const courts = await Court.findAll({
      where: whereClause,
      include: [{ model: require('../models').User, as: 'owner', attributes: ['name', 'email'] }]
    });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, location, type, pricePerHour, maintenance, ownerId } = req.body;
    const c = await Court.create({ name, location, type, pricePerHour, maintenance, ownerId });
    res.json(c);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const court = await Court.findByPk(req.params.id);
    if (!court) return res.status(404).json({ error: 'Court not found' });

    // Check permissions: owners can only edit their assigned courts, admins can edit any
    if (userRole === 'owner' && court.ownerId !== userId) {
      return res.status(403).json({ error: 'You can only edit courts assigned to you' });
    }

    const { name, location, type, pricePerHour, maintenance, ownerId } = req.body;
    await court.update({ name, location, type, pricePerHour, maintenance, ownerId });
    res.json(court);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const court = await Court.findByPk(req.params.id);
    if (!court) return res.status(404).json({ error: 'Court not found' });

    // Check permissions: owners can only delete their assigned courts, admins can delete any
    if (userRole === 'owner' && court.ownerId !== userId) {
      return res.status(403).json({ error: 'You can only delete courts assigned to you' });
    }

    await court.destroy();
    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
