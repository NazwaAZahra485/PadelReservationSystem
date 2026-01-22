const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching event' });
    }
});

router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            images: imagePaths
        });
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating event' });
    }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, date, location, existingImages } = req.body;
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        let finalImages = [];
        if (existingImages) {
            finalImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }
        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
            finalImages = [...finalImages, ...newImagePaths];
        }

        await event.update({
            title,
            description,
            date,
            location,
            images: finalImages
        });
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating event' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.destroy();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting event' });
    }
});

module.exports = router;
