// Inisialisasi Sequelize dan model-model (komentar bahasa Indonesia)
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || 'padel_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || '';
const DB_DIALECT = process.env.DB_DIALECT || 'sqlite';

let sequelize;
if (DB_DIALECT === 'sqlite') {
  sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite' });
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT
  });
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Court = require('./court')(sequelize, Sequelize);
db.Reservation = require('./reservation')(sequelize, Sequelize);
db.Event = require('./event')(sequelize, Sequelize);
db.VenueAppeal = require('./venueAppeal')(sequelize, Sequelize);
db.Payment = require('./payment')(sequelize, Sequelize);

db.User.hasMany(db.Reservation, { foreignKey: 'userId' });
db.Reservation.belongsTo(db.User, { foreignKey: 'userId' });
db.Court.hasMany(db.Reservation, { foreignKey: 'courtId' });
db.Reservation.belongsTo(db.Court, { foreignKey: 'courtId' });
db.Reservation.hasOne(db.Payment, { foreignKey: 'reservationId' });
db.Payment.belongsTo(db.Reservation, { foreignKey: 'reservationId' });
db.Payment.belongsTo(db.User, { foreignKey: 'approvedBy', as: 'approver' });
db.Court.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });
db.User.hasMany(db.Court, { foreignKey: 'ownerId' });
db.Event.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });
db.User.hasMany(db.Event, { foreignKey: 'ownerId' });

module.exports = db;
