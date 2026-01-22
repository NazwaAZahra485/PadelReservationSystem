// Model Event
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATEONLY },
    startTime: { type: DataTypes.STRING },
    endTime: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    maxParticipants: { type: DataTypes.INTEGER, defaultValue: 0 },
    ownerId: { type: DataTypes.INTEGER, allowNull: true } // Event can be assigned to an owner
  }, {
    tableName: 'events'
  });

  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
  };

  return Event;
};
