'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  List.associate = function (models) {
    // associations can be defined here
  };
  return List;
};