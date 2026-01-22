const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Payment, Reservation, User } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all payments (for admin/owner)
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Reservation,
          include: [User, require('../models').Court]
        },
        { model: User, as: 'approver' }
      ]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment for reservation
router.post('/', upload.single('paymentProof'), async (req, res) => {
  try {
    const { reservationId, method, amount } = req.body;

    // Check if reservation exists and is unpaid
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    if (reservation.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Reservation is already paid' });
    }

    const paymentData = {
      reservationId,
      amount: parseFloat(amount),
      method,
      status: method === 'cash' ? 'approved' : 'pending'
    };

    if (req.file) {
      paymentData.paymentProof = req.file.path;
    }

    const payment = await Payment.create(paymentData);

    // If cash payment, automatically confirm reservation
    if (method === 'cash') {
      reservation.status = 'confirmed';
      reservation.paymentStatus = 'paid';
      await reservation.save();
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve or reject payment (for owner/admin)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Reservation }]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Assuming approver ID comes from auth middleware
    const approverId = req.user ? req.user.id : 1;

    payment.status = status;
    payment.notes = notes;
    payment.approvedBy = approverId;
    payment.approvedAt = new Date();

    await payment.save();

    // Update reservation status based on payment approval
    const reservation = payment.Reservation;
    if (status === 'approved') {
      reservation.status = 'confirmed';
      reservation.paymentStatus = 'paid';
    } else if (status === 'rejected') {
      reservation.status = 'cancelled';
      reservation.paymentStatus = 'unpaid';
    }
    await reservation.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment by reservation ID
router.get('/reservation/:reservationId', async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { reservationId: req.params.reservationId },
      include: [
        { model: Reservation, include: [User, require('../models').Court] },
        { model: User, as: 'approver' }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;