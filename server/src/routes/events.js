const express = require('express');
const router = express.Router();
const { Event } = require('../models');

router.get('/', async (req, res) => {
  try {
    // Get user from token/session (simplified for now)
    const userRole = req.user?.role || 'customer';
    const userId = req.user?.id;

    let whereClause = {};
    if (userRole === 'owner') {
      // Owners only see events assigned to them
      whereClause.ownerId = userId;
    }
    // Admins see all events

    const events = await Event.findAll({
      where: whereClause,
      include: [{ model: require('../models').User, as: 'owner', attributes: ['name', 'email'] }]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, maxParticipants, ownerId } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      maxParticipants,
      ownerId
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check permissions: owners can only edit their assigned events, admins can edit any
    if (userRole === 'owner' && event.ownerId !== userId) {
      return res.status(403).json({ error: 'You can only edit events assigned to you' });
    }

    const { title, description, date, startTime, endTime, location, maxParticipants, ownerId } = req.body;
    await event.update({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      maxParticipants,
      ownerId
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check permissions: owners can only delete their assigned events, admins can delete any
    if (userRole === 'owner' && event.ownerId !== userId) {
      return res.status(403).json({ error: 'You can only delete events assigned to you' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;