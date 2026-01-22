module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    method: {
      type: DataTypes.ENUM('cash', 'virtual_account', 'qr_code', 'transfer'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    paymentProof: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    approvedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'payments'
  });
  return Payment;
};