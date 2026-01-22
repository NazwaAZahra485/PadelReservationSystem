// Model Event
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATEONLY },
    location: { type: DataTypes.STRING },
    images: {
      type: DataTypes.TEXT, // Simpan sebagai JSON String
      get() {
        const rawValue = this.getDataValue('images');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'events'
  });
  return Event;
};
