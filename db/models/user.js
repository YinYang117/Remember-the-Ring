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
    // associations can be defined here
  };
  return User;
};