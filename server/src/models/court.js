// Model Court (lapangan)
module.exports = (sequelize, DataTypes) => {
  const Court = sequelize.define('Court', {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING }, // Indoor / Outdoor
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }, // Ganti pricePerHour jadi price biar konsisten
    description: { type: DataTypes.TEXT },
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
    tableName: 'courts'
  });
  return Court;
};
