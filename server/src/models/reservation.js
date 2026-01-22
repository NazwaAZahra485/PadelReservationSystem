// Model Reservation (pemesanan)
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.STRING, allowNull: false },
    endTime: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    // Field untuk Guest (User tanpa login)
    guestName: { type: DataTypes.STRING, allowNull: true },
    guestEmail: { type: DataTypes.STRING, allowNull: true },
    guestPhone: { type: DataTypes.STRING, allowNull: true },
    // Total harga
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'unpaid' }
  }, {
    tableName: 'reservations'
  });
  return Reservation;
};
