// Model Reservation (pemesanan)
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.STRING, allowNull: false },
    endTime: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
    paymentRequired: { type: DataTypes.BOOLEAN, defaultValue: true },
    paymentStatus: { type: DataTypes.ENUM('unpaid', 'paid', 'refunded'), defaultValue: 'unpaid' }
  }, {
    tableName: 'reservations'
  });

  Reservation.associate = (models) => {
    Reservation.hasOne(models.Payment, { foreignKey: 'reservationId' });
  };

  return Reservation;
};
