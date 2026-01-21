// Entry point server Express (komentar bahasa Indonesia)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

// Sinkronisasi database (untuk development pakai alter false untuk production)
sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database terhubung dan disinkronkan');
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  })
  .catch(err => console.error('Gagal koneksi ke database:', err));
