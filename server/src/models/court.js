// Model Court (lapangan)
module.exports = (sequelize, DataTypes) => {
  const Court = sequelize.define('Court', {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    pricePerHour: { type: DataTypes.FLOAT, defaultValue: 0 },
    maintenance: { type: DataTypes.BOOLEAN, defaultValue: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: true } // Court can be assigned to an owner
  }, {
    tableName: 'courts'
  });

  Court.associate = (models) => {
    Court.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
  };

  return Court;
};
