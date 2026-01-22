// Model Payment
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    method: {
      type: DataTypes.ENUM('cash', 'virtual_account', 'qr_code'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    paymentProof: { type: DataTypes.STRING }, // File path for uploaded screenshot
    notes: { type: DataTypes.TEXT },
    approvedBy: { type: DataTypes.INTEGER }, // Owner who approved
    approvedAt: { type: DataTypes.DATE }
  }, {
    tableName: 'payments'
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Reservation, { foreignKey: 'reservationId' });
    Payment.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
  };

  return Payment;
};