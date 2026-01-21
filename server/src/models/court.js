// Model Court (lapangan)
module.exports = (sequelize, DataTypes) => {
  const Court = sequelize.define('Court', {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    pricePerHour: { type: DataTypes.FLOAT, defaultValue: 0 }
  }, {
    tableName: 'courts'
  });
  return Court;
};
