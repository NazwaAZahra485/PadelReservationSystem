// Model VenueAppeal
module.exports = (sequelize, DataTypes) => {
  const VenueAppeal = sequelize.define('VenueAppeal', {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    contactInfo: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, approved, rejected
    ownerId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'venue_appeals'
  });

  VenueAppeal.associate = (models) => {
    VenueAppeal.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
  };

  return VenueAppeal;
};