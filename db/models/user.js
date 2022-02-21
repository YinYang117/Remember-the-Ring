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
    },
    currentExp: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    isGuest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Task, { foreignKey: 'userId', onDelete: 'cascade', hooks: true })
    User.hasMany(models.List, { foreignKey: 'userId', onDelete: 'cascade', hooks: true })
  };
  return User;
};
