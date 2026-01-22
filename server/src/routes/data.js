// Route untuk mengambil semua data dari database
const express = require('express');
const router = express.Router();
const { User, Court, Reservation, Event } = require('../models');

// Endpoint untuk mendapatkan semua data dari database
router.get('/all', async (req, res) => {
    try {
        const [users, courts, reservations, events] = await Promise.all([
            User.findAll(),
            Court.findAll(),
            Reservation.findAll({ include: [User, Court] }),
            Event.findAll()
        ]);

        res.json({
            success: true,
            data: {
                users: users,
                courts: courts,
                reservations: reservations,
                events: events
            },
            summary: {
                totalUsers: users.length,
                totalCourts: courts.length,
                totalReservations: reservations.length,
                totalEvents: events.length
            }
        });
    } catch (error) {
        console.error('Error fetching all data:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari database',
            error: error.message
        });
    }
});

// Endpoint untuk mendapatkan users saja
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint untuk mendapatkan courts saja
router.get('/courts', async (req, res) => {
    try {
        const courts = await Court.findAll();
        res.json({ success: true, data: courts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint untuk mendapatkan reservations saja
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.findAll({ include: [User, Court] });
        res.json({ success: true, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint untuk mendapatkan events saja
router.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
