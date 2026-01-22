const express = require('express');
const router = express.Router();
const { Reservation, User, Court } = require('../models');

router.get('/', async (req, res) => {
  try {
    const list = await Reservation.findAll({
      include: [User, Court],
      order: [['createdAt', 'DESC']]
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data reservasi' });
  }
});

router.post('/', async (req, res) => {
  const { date, startTime, endTime, userId, courtId, guestName, guestEmail, guestPhone } = req.body;

  // Validasi: Harus ada userId (member) ATAU guestName & guestPhone (tamu)
  if (!userId && (!guestName || !guestPhone)) {
    return res.status(400).json({ message: 'Data pemesan tidak lengkap. Mohon isi nama dan nomor HP.' });
  }

  try {
    const r = await Reservation.create({
      date, startTime, endTime, userId, courtId,
      guestName, guestEmail, guestPhone,
      status: 'pending'
    });
    res.json(r);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ message: 'Gagal membuat reservasi', error: err.message });
  }
});

// Endpoint untuk update status (approve/reject)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
    }
    reservation.status = status;
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update status' });
  }
});

module.exports = router;
