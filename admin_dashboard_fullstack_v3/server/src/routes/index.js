const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const courtRoutes = require('./courts');
const reservationRoutes = require('./reservations');

router.use('/users', userRoutes);
router.use('/courts', courtRoutes);
router.use('/reservations', reservationRoutes);

// endpoint stats sederhana untuk dashboard
router.get('/stats', async (req, res) => {
  try{
    // data dummy untuk trend (7 hari terakhir)
    const trend = [5, 8, 6, 10, 9, 12, 7];
    const totals = { totalReservations: 57, totalCourts: 6, totalUsers: 24 };
    res.json({ totals, trend });
  }catch(err){
    res.status(500).json({ error: 'Gagal ambil stats' });
  }
});

router.get('/health', (req, res) => res.json({ ok: true }));

module.exports = router;
