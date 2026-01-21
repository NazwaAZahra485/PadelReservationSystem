// Model User
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, defaultValue: 'customer' }
  }, {
    tableName: 'users'
  });
  return User;
};
