'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    },
    currentLevel: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Task, { foreignKey: 'userId'})
    User.hasMany(models.List, { foreignKey: 'userId'})
    User.hasMany(models.Category, { foreignKey: 'userId'})
  };
  return User;
};