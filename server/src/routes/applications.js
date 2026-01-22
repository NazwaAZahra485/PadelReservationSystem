const express = require('express');
const router = express.Router();
const { Application } = require('../models');

// GET ALL
router.get('/', async (req, res) => {
    try {
        const apps = await Application.findAll({ order: [['createdAt', 'DESC']] });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// CREATE (Untuk testing / form pengajuan nanti)
router.post('/', async (req, res) => {
    try {
        const app = await Application.create(req.body);
        res.json(app);
    } catch (err) {
        res.status(500).json({ message: 'Error creating application' });
    }
});

// UPDATE STATUS (Approve/Reject)
router.put('/:id', async (req, res) => {
    try {
        const { status, reason } = req.body;
        const app = await Application.findByPk(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });

        app.status = status;
        if (reason) app.reason = reason;

        await app.save();
        res.json(app);
    } catch (err) {
        res.status(500).json({ message: 'Error updating application' });
    }
});

module.exports = router;
