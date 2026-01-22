const express = require('express');
const router = express.Router();
const { Court } = require('../models');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
    try {
        const courts = await Court.findAll();
        res.json(courts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching courts' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const court = await Court.findByPk(req.params.id);
        if (!court) return res.status(404).json({ message: 'Court not found' });
        res.json(court);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching court' });
    }
});

router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const { name, location, type, price, description } = req.body;
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        }

        const court = await Court.create({
            name,
            location,
            type,
            price: parseFloat(price),
            description,
            images: imagePaths
        });
        res.json(court);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating court' });
    }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        const { name, location, type, price, description, existingImages } = req.body;
        const court = await Court.findByPk(req.params.id);
        if (!court) return res.status(404).json({ message: 'Court not found' });

        let finalImages = [];
        if (existingImages) {
            finalImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }
        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
            finalImages = [...finalImages, ...newImagePaths];
        }

        await court.update({
            name,
            location,
            type,
            price: parseFloat(price),
            description,
            images: finalImages
        });
        res.json(court);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating court' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const court = await Court.findByPk(req.params.id);
        if (!court) return res.status(404).json({ message: 'Court not found' });
        await court.destroy();
        res.json({ message: 'Court deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting court' });
    }
});

module.exports = router;
